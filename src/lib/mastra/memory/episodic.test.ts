import { describe, expect, it, beforeEach, vi } from "vitest";
import type { UIMessage } from "ai";

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
    vectorUpsertMock.mockReset();
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
