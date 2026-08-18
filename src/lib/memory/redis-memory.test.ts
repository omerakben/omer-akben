import { beforeEach, describe, expect, it, vi } from "vitest";

const searchMock = vi.fn();
const getFactsMock = vi.fn();

vi.mock("@/lib/mastra/memory/episodic", () => ({
  RedisEpisodicMemory: class {
    search = searchMock;
  },
}));

vi.mock("@/lib/mastra/memory/semantic", () => ({
  RedisSemanticMemory: class {
    getFacts = getFactsMock;
  },
}));

vi.mock("@/lib/redis/client", () => ({
  getRedisClient: () => ({
    set: vi.fn(),
    get: vi.fn(),
  }),
}));

describe("RedisMemoryManager.retrieveRelevant", () => {
  beforeEach(() => {
    searchMock.mockReset();
    getFactsMock.mockReset();
  });

  it("returns empty memory instead of throwing when retrieval fails", async () => {
    searchMock.mockRejectedValueOnce(new Error("Missing Upstash Vector credentials"));
    getFactsMock.mockResolvedValueOnce(null);

    const { RedisMemoryManager } = await import("./redis-memory");
    const manager = new RedisMemoryManager();
    const result = await manager.retrieveRelevant("Tell me about yourself.", "anonymous");

    expect(result).toEqual({ episodic: [], semantic: null });
  });
});
