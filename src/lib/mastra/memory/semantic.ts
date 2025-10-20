import { getRedisClient } from "@/lib/redis/client";

const SEMANTIC_PREFIX = "memory:semantic:";

export interface SemanticMemoryPayload {
  facts: Record<string, unknown>;
}

export class RedisSemanticMemory {
  private readonly redis = getRedisClient();

  private buildKey(userId: string): string {
    return `${SEMANTIC_PREFIX}${userId}`;
  }

  async getFacts<T = SemanticMemoryPayload>(userId: string): Promise<T | null> {
    const key = this.buildKey(userId);
    const response = await this.redis.call("JSON.GET", key, "$");
    if (!response) {
      return null;
    }

    const raw = Array.isArray(response) ? response[0] : response;
    if (typeof raw !== "string") {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error("[RedisSemanticMemory] Failed to parse semantic memory", error);
      return null;
    }
  }

  async setFacts(userId: string, facts: SemanticMemoryPayload): Promise<void> {
    const key = this.buildKey(userId);
    await this.redis.call("JSON.SET", key, "$", JSON.stringify(facts));
  }

  async mergeFacts(userId: string, partialFacts: Record<string, unknown>): Promise<void> {
    const current = (await this.getFacts(userId)) ?? { facts: {} };
    const merged = {
      facts: {
        ...(current.facts ?? {}),
        ...partialFacts,
      },
    } satisfies SemanticMemoryPayload;
    await this.setFacts(userId, merged);
  }
}
