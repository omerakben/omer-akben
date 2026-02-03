import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

const vectorUpsertMock = vi.fn();
const embeddingsCreateMock = vi.fn();
const knnSearchMock = vi.fn();

vi.mock("@/lib/redis/vector-client", () => ({
  getVectorClient: () => ({
    upsert: vectorUpsertMock,
  }),
}));

vi.mock("@/lib/redis/vector-search", () => ({
  knnSearch: knnSearchMock,
}));

// Mock the OpenAI cache to prevent Redis connection attempts
vi.mock("@/lib/cache/openai-cache", () => ({
  getCachedEmbedding: vi.fn().mockResolvedValue(null),
  setCachedEmbedding: vi.fn().mockResolvedValue(undefined),
  recordCacheMiss: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("openai", () => {
  class OpenAI {
    embeddings = {
      create: embeddingsCreateMock,
    };
  }
  return {
    __esModule: true,
    default: OpenAI,
  };
});

describe("RedisEpisodicMemory", () => {
  beforeEach(() => {
    vectorUpsertMock.mockReset();
    embeddingsCreateMock.mockReset();
    knnSearchMock.mockReset();
  });

  it("skips saving when no chunks exist", async () => {
    const { RedisEpisodicMemory } = await import("./episodic");
    const memory = new RedisEpisodicMemory();
    embeddingsCreateMock.mockResolvedValueOnce({ data: [] });

    const messages: UIMessage[] = [{ id: "1", role: "user", parts: [] }];

    await memory.saveConversation("thread", messages);
    expect(vectorUpsertMock).not.toHaveBeenCalled();
  });

  it("stores chunks with embeddings in Vector database", async () => {
    const { RedisEpisodicMemory } = await import("./episodic");
    const memory = new RedisEpisodicMemory();
    embeddingsCreateMock.mockResolvedValueOnce({
      data: [{ embedding: Array(5).fill(0.1) }],
    });
    vectorUpsertMock.mockResolvedValueOnce(undefined);

    const messages: UIMessage[] = [
      { id: "1", role: "user", parts: [{ type: "text", text: "Hello" }] },
    ];

    await memory.saveConversation("thread", messages);

    // Verify Vector upsert was called
    expect(vectorUpsertMock).toHaveBeenCalled();
    const upsertCall = vectorUpsertMock.mock.calls[0][0];

    // Verify upsert parameters
    expect(upsertCall).toHaveProperty("id");
    expect(upsertCall.id).toContain("memory:episodic:thread:");
    expect(upsertCall).toHaveProperty("vector");
    expect(upsertCall.vector).toEqual(Array(5).fill(0.1));
    expect(upsertCall).toHaveProperty("metadata");
    expect(upsertCall.metadata).toEqual({
      threadId: "thread",
      chunkId: expect.any(String),
      content: "user: Hello",
    });
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
