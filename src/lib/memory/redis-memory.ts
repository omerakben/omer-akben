import { getRedisClient } from "@/lib/redis/client";
import {
  RedisEpisodicMemory,
  type EpisodicMemoryResult,
} from "@/lib/mastra/memory/episodic";
import {
  RedisSemanticMemory,
  type SemanticMemoryPayload,
} from "@/lib/mastra/memory/semantic";
import type { UIMessage } from "ai";

const STM_TTL = 86400; // 24 hours in seconds

export class RedisMemoryManager {
  private readonly episodic = new RedisEpisodicMemory();
  private readonly semantic = new RedisSemanticMemory();
  private readonly redis = getRedisClient();

  /**
   * Save short-term memory (conversation history) to Redis
   * Uses simple key-value storage with 24h TTL
   */
  async saveSTM(threadId: string, messages: UIMessage[]): Promise<void> {
    const key = `stm:${threadId}`;
    await this.redis.set(key, JSON.stringify(messages), { ex: STM_TTL });
  }

  /**
   * Load short-term memory (conversation history) from Redis
   * Returns empty array if thread doesn't exist or has expired
   */
  async loadSTM(threadId: string): Promise<UIMessage[]> {
    const key = `stm:${threadId}`;
    const stored = await this.redis.get(key);

    if (!stored || typeof stored !== "string") {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async saveLTM(threadId: string, messages: UIMessage[]): Promise<void> {
    await this.episodic.saveConversation(threadId, messages);
  }

  async retrieveEpisodic(
    query: string,
    limit = 3
  ): Promise<EpisodicMemoryResult[]> {
    return this.episodic.search(query, limit);
  }

  async setSemantic(
    userId: string,
    payload: SemanticMemoryPayload
  ): Promise<void> {
    await this.semantic.setFacts(userId, payload);
  }

  async mergeSemantic(
    userId: string,
    facts: Record<string, unknown>
  ): Promise<void> {
    await this.semantic.mergeFacts(userId, facts);
  }

  async getSemantic<T = SemanticMemoryPayload>(
    userId: string
  ): Promise<T | null> {
    return this.semantic.getFacts<T>(userId);
  }

  async retrieveRelevant(query: string, userId: string) {
    const [episodic, semantic] = await Promise.all([
      this.retrieveEpisodic(query, 3),
      this.getSemantic(userId),
    ]);

    return {
      episodic,
      semantic,
    };
  }
}
