import { describe, expect, it, beforeEach, vi } from "vitest";
import type { UIMessage } from "ai";

const callMock = vi.fn();
const embeddingsCreateMock = vi.fn();
const knnSearchMock = vi.fn();

vi.mock("@/lib/redis/client", () => ({
  getRedisClient: () => ({
    call: callMock,
  }),
}));

vi.mock("@/lib/redis/vector-search", () => ({
  knnSearch: knnSearchMock,
}));

vi.mock("openai", () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    embeddings: {
      create: embeddingsCreateMock,
    },
  })),
}));

describe("RedisEpisodicMemory", () => {
  beforeEach(() => {
    callMock.mockReset();
    embeddingsCreateMock.mockReset();
    knnSearchMock.mockReset();
  });

  it("skips saving when no chunks exist", async () => {
    const { RedisEpisodicMemory } = await import("./episodic");
    const memory = new RedisEpisodicMemory();
    embeddingsCreateMock.mockResolvedValueOnce({ data: [] });

    const messages: UIMessage[] = [
      { id: "1", role: "user", parts: [] },
    ];

    await memory.saveConversation("thread", messages);
    expect(callMock).not.toHaveBeenCalled();
  });

  it("stores chunks with embeddings and expiry", async () => {
    const { RedisEpisodicMemory } = await import("./episodic");
    const memory = new RedisEpisodicMemory();
    embeddingsCreateMock.mockResolvedValueOnce({
      data: [{ embedding: Array(5).fill(0.1) }],
    });

    const messages: UIMessage[] = [
      { id: "1", role: "user", parts: [{ type: "text", text: "Hello" }] },
    ];

    await memory.saveConversation("thread", messages);
    expect(callMock).toHaveBeenCalled();
    const [command] = callMock.mock.calls[0];
    expect(command).toBe("HSET");
  });

  it("formats search results", async () => {
    const { RedisEpisodicMemory } = await import("./episodic");
    const memory = new RedisEpisodicMemory();
    embeddingsCreateMock.mockResolvedValueOnce({
      data: [{ embedding: Array(5).fill(0.2) }],
    });
    knnSearchMock.mockResolvedValueOnce([
      {
        key: "k1",
        score: 0.9,
        fields: { threadId: "thread", chunkId: "chunk", content: "text" },
      },
    ]);

    const results = await memory.search("query", 1);
    expect(results).toEqual([
      {
        threadId: "thread",
        chunkId: "chunk",
        content: "text",
        score: 0.9,
      },
    ]);
  });
});
