import {
  getCachedEmbedding,
  recordCacheHit,
  recordCacheMiss,
  setCachedEmbedding,
} from "@/lib/cache/openai-cache";
import { getVectorClient } from "@/lib/redis/vector-client";
import { knnSearch } from "@/lib/redis/vector-search";
import type { UIMessage } from "ai";
import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EPISODIC_PREFIX = "memory:episodic:";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient;
  }

  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openaiClient;
}

function extractMessageText(message: UIMessage): string {
  const textParts = message.parts
    .filter(
      (part): part is { type: "text"; text: string } =>
        part.type === "text" && "text" in part
    )
    .map((part) => part.text.trim())
    .filter(Boolean);

  if (textParts.length > 0) {
    return textParts.join("\n");
  }

  if (
    typeof (message as unknown as { content?: unknown }).content === "string"
  ) {
    return ((message as unknown as { content?: string }).content ?? "").trim();
  }

  return "";
}

function createChunks(messages: UIMessage[]): string[] {
  const segments = messages
    .map((message) => {
      const text = extractMessageText(message);
      return text ? `${message.role}: ${text}` : "";
    })
    .filter(Boolean);

  if (segments.length === 0) {
    return [];
  }

  const joined = segments.join("\n");
  const MAX_CHARS = 4000;
  const chunks: string[] = [];
  for (let i = 0; i < joined.length; i += MAX_CHARS) {
    const slice = joined.slice(i, i + MAX_CHARS + 200);
    chunks.push(slice);
  }
  return chunks;
}

export interface EpisodicMemoryResult {
  threadId: string;
  chunkId: string;
  content: string;
  score: number;
}

export class RedisEpisodicMemory {
  async saveConversation(
    threadId: string,
    messages: UIMessage[]
  ): Promise<void> {
    const chunks = createChunks(messages);
    if (chunks.length === 0) {
      return;
    }

    // Check cache for all chunks in parallel
    const cacheResults = await Promise.all(
      chunks.map((chunk) => getCachedEmbedding(chunk, EMBEDDING_MODEL))
    );

    // Identify chunks that need embeddings (cache misses)
    const uncachedIndices: number[] = [];
    const uncachedChunks: string[] = [];

    cacheResults.forEach((cachedEmbedding, index) => {
      if (cachedEmbedding === null) {
        uncachedIndices.push(index);
        uncachedChunks.push(chunks[index]);
      }
    });

    // Generate embeddings for cache misses (batch call)
    let newEmbeddings: number[][] = [];
    if (uncachedChunks.length > 0) {
      const openai = getOpenAIClient();
      const result = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: uncachedChunks,
      });

      newEmbeddings = result.data.map((entry) => entry.embedding);

      // Store new embeddings in cache
      await Promise.all(
        uncachedChunks.map((chunk, idx) =>
          setCachedEmbedding(chunk, newEmbeddings[idx], EMBEDDING_MODEL)
        )
      );
    }

    // Combine cached and new embeddings
    const allEmbeddings: number[][] = [];
    let newEmbeddingIndex = 0;

    for (let i = 0; i < chunks.length; i++) {
      if (cacheResults[i] !== null) {
        allEmbeddings[i] = cacheResults[i] as number[];
        await recordCacheHit("embedding");
      } else {
        allEmbeddings[i] = newEmbeddings[newEmbeddingIndex];
        newEmbeddingIndex++;
        await recordCacheMiss("embedding");
      }
    }

    const timestamp = Date.now();
    const vectorClient = getVectorClient();

    // Store all chunks with their embeddings in Upstash Vector
    await Promise.all(
      chunks.map(async (chunk, index) => {
        const chunkId = `${timestamp}-${index}`;
        const vectorId = `${EPISODIC_PREFIX}${threadId}:${chunkId}`;

        await vectorClient.upsert({
          id: vectorId,
          vector: allEmbeddings[index],
          metadata: {
            threadId,
            chunkId,
            content: chunk,
          },
        });
      })
    );
  }

  async search(query: string, limit = 3): Promise<EpisodicMemoryResult[]> {
    if (!query.trim()) {
      return [];
    }

    // Check cache for query embedding
    const cachedEmbedding = await getCachedEmbedding(query, EMBEDDING_MODEL);

    let queryEmbedding: number[];

    if (cachedEmbedding !== null) {
      // Cache hit - use cached embedding
      queryEmbedding = cachedEmbedding;
      await recordCacheHit("embedding");
    } else {
      // Cache miss - generate embedding
      const openai = getOpenAIClient();
      const result = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: [query],
      });

      const [vector] = result.data;
      if (!vector) {
        return [];
      }

      queryEmbedding = vector.embedding;

      // Store in cache for future searches
      await setCachedEmbedding(query, queryEmbedding, EMBEDDING_MODEL);
      await recordCacheMiss("embedding");
    }

    // Query Upstash Vector for episodic memory (index=undefined routes to Vector)
    const matches = await knnSearch(undefined, queryEmbedding, limit, [
      "threadId",
      "chunkId",
      "content",
      "vector_score",
    ]);

    return matches
      .map((match) => ({
        threadId: match.fields.threadId ?? "",
        chunkId: match.fields.chunkId ?? "",
        content: match.fields.content ?? "",
        score: match.score,
      }))
      .filter((result) => Boolean(result.threadId));
  }

  /**
   * Cleanup old episodic memories beyond TTL
   *
   * Scans all episodic memory vectors and deletes those older than the specified TTL.
   * Uses cursor-based pagination to handle large datasets efficiently.
   *
   * @param ttlDays - Time-to-live in days (default: 90 days)
   * @returns Number of vectors deleted
   *
   * @example
   * const memory = new RedisEpisodicMemory();
   * const deletedCount = await memory.cleanup(90);
   * console.log(`Deleted ${deletedCount} old memories`);
   */
  async cleanup(ttlDays = 90): Promise<number> {
    const cutoffTime = Date.now() - ttlDays * 24 * 60 * 60 * 1000;
    const vectorClient = getVectorClient();
    const idsToDelete: string[] = [];

    try {
      // Scan all episodic vectors using cursor-based pagination
      let nextCursor: string | undefined = undefined;

      while (true) {
        // Fetch batch of vectors with cursor
        const rangeResponse: unknown = await vectorClient.range({
          cursor: nextCursor || "",
          limit: 100,
          includeMetadata: false,
          includeVectors: false,
        });

        // Extract vectors array from response (handle both array and object formats)
        const vectors = Array.isArray(rangeResponse)
          ? rangeResponse
          : ((rangeResponse as Record<string, unknown>).vectors as { id: string }[]) || [];

        // Parse timestamps from vector IDs and filter old ones
        for (const vector of vectors) {
          const vectorId = vector.id;

          // Only process episodic memory vectors
          if (!vectorId.startsWith(EPISODIC_PREFIX)) {
            continue;
          }

          try {
            // Vector ID format: memory:episodic:${threadId}:${timestamp}-${index}
            // Extract timestamp from the chunkId portion
            const parts = vectorId.split(":");
            if (parts.length < 3) continue;

            const chunkId = parts[parts.length - 1]; // ${timestamp}-${index}
            const timestampStr = chunkId.split("-")[0];
            const timestamp = parseInt(timestampStr, 10);

            if (isNaN(timestamp)) {
              console.warn(
                `[EpisodicMemory] Invalid timestamp in vector ID: ${vectorId}`
              );
              continue;
            }

            // Add to deletion list if older than cutoff
            if (timestamp < cutoffTime) {
              idsToDelete.push(vectorId);
            }
          } catch (error) {
            console.error(
              `[EpisodicMemory] Error parsing vector ID ${vectorId}:`,
              error
            );
          }
        }

        // Check for next cursor to determine if we should continue
        const responseObj = rangeResponse as Record<string, unknown>;
        const cursorValue = (responseObj.nextCursor as string | undefined) ||
                           (responseObj.cursor as string | undefined);

        if (!cursorValue || cursorValue === "") {
          break;
        }

        nextCursor = cursorValue;
      }

      // Delete old vectors in batches if any found
      if (idsToDelete.length > 0) {
        console.log(
          `[EpisodicMemory] Deleting ${idsToDelete.length} vectors older than ${ttlDays} days`
        );

        // Delete in batches of 100 to avoid overwhelming the API
        const BATCH_SIZE = 100;
        for (let i = 0; i < idsToDelete.length; i += BATCH_SIZE) {
          const batch = idsToDelete.slice(i, i + BATCH_SIZE);
          await vectorClient.delete(batch);
        }
      }

      return idsToDelete.length;
    } catch (error) {
      console.error("[EpisodicMemory] Cleanup failed:", error);
      throw error;
    }
  }
}
