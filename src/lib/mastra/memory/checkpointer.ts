import { RedisSaver, type RedisClientType } from "@langchain/langgraph-checkpoint-redis";
import type { UIMessage } from "ai";
import { getRedisClient, type RedisStackClient } from "@/lib/redis/client";

class RedisSaverAdapter {
  constructor(private readonly client: RedisStackClient) {}

  json = {
    get: (...args: Parameters<RedisStackClient["json"]["get"]>) => this.client.json.get(...args),
    set: (...args: Parameters<RedisStackClient["json"]["set"]>) => this.client.json.set(...args),
  };

  ft = this.client.ft;

  keys(pattern: string) {
    return this.client.keys(pattern);
  }

  exists(...keys: Parameters<RedisStackClient["exists"]>) {
    return this.client.exists(...keys);
  }

  expire(key: string, seconds: number) {
    return this.client.expire(key, seconds);
  }

  async zAdd(
    key: string,
    entries: Array<{ score: number; value: string }>
  ): Promise<unknown> {
    if (entries.length === 0) {
      return 0;
    }
    const first = { score: entries[0].score, member: entries[0].value };
    const rest = entries.slice(1).map(({ score, value }) => ({ score, member: value }));
    return this.client.zadd(key, first, ...rest);
  }

  del(...keys: Array<string | string[]>) {
    const flattened = keys.flatMap((item) => (Array.isArray(item) ? item : [item]));
    return this.client.del(...flattened);
  }

  quit() {
    return Promise.resolve();
  }
}

let checkpointer: RedisSaver | null = null;

function createRedisClient(): RedisClientType {
  const baseClient = getRedisClient();
  return new RedisSaverAdapter(baseClient) as unknown as RedisClientType;
}

export function getCheckpointer(): RedisSaver {
  if (checkpointer) {
    return checkpointer;
  }

  const client = createRedisClient();
  checkpointer = new RedisSaver(client);
  return checkpointer;
}

export async function loadThreadMessages(threadId: string): Promise<UIMessage[]> {
  const checkpoint = await getCheckpointer().get({
    configurable: { thread_id: threadId },
  });

  return (checkpoint?.channel_values?.messages as UIMessage[] | undefined) ?? [];
}
