import type { UIMessage } from "ai";
import OpenAI from "openai";
import { getRedisClient } from "@/lib/redis/client";
import { knnSearch } from "@/lib/redis/vector-search";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EPISODIC_PREFIX = "memory:episodic:";
const EPISODIC_INDEX = "episodic_idx";
const NINETY_DAYS_IN_SECONDS = 60 * 60 * 24 * 90;

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient;
  }

  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openaiClient;
}

function encodeEmbedding(embedding: number[]): Uint8Array {
  const typed = new Float32Array(embedding);
  return new Uint8Array(typed.buffer);
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
  private readonly redis = getRedisClient();

  async saveConversation(threadId: string, messages: UIMessage[]): Promise<void> {
    const chunks = createChunks(messages);
    if (chunks.length === 0) {
      return;
    }

    const openai = getOpenAIClient();
    const embeddings = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: chunks,
    });

    const timestamp = Date.now();

    await Promise.all(
      embeddings.data.map(async (entry, index) => {
        const chunkId = `${timestamp}-${index}`;
        const key = `${EPISODIC_PREFIX}${threadId}:${chunkId}`;
        const vector = encodeEmbedding(entry.embedding);

        await this.redis.call(
          "HSET",
          key,
          "threadId",
          threadId,
          "chunkId",
          chunkId,
          "content",
          chunks[index],
          "embedding",
          vector
        );
        await this.redis.call("EXPIRE", key, NINETY_DAYS_IN_SECONDS);
      })
    );
  }

  async search(query: string, limit = 3): Promise<EpisodicMemoryResult[]> {
    if (!query.trim()) {
      return [];
    }

    const openai = getOpenAIClient();
    const embedding = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: [query],
    });

    const [vector] = embedding.data;
    if (!vector) {
      return [];
    }

    const matches = await knnSearch(EPISODIC_INDEX, vector.embedding, limit, [
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
