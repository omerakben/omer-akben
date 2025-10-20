import type { UIMessage } from "ai";
import OpenAI from "openai";
import { getVectorClient } from "@/lib/redis/vector-client";
import { knnSearch } from "@/lib/redis/vector-search";
import {
  getCachedEmbedding,
  setCachedEmbedding,
  recordCacheHit,
  recordCacheMiss,
} from "@/lib/cache/openai-cache";

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
    .filter((part): part is { type: "text"; text: string } => part.type === "text" && "text" in part)
    .map((part) => part.text.trim())
    .filter(Boolean);

  if (textParts.length > 0) {
    return textParts.join("\n");
  }

  if (typeof (message as unknown as { content?: unknown }).content === "string") {
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
  async saveConversation(threadId: string, messages: UIMessage[]): Promise<void> {
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

    const matches = await knnSearch("", queryEmbedding, limit, [
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
}
