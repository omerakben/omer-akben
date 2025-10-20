import { describe, expect, it, vi, beforeEach } from "vitest";
import type { UIMessage } from "ai";

const loadThreadMessagesMock = vi.fn();
const routeMock = vi.fn();
const saveSTMMock = vi.fn();
const saveLTMMock = vi.fn();

vi.mock("@/lib/mastra/memory/checkpointer", () => ({
  loadThreadMessages: loadThreadMessagesMock,
}));

vi.mock("@/lib/mastra/agents/coordinator", () => ({
  coordinatorAgent: {
    route: routeMock,
  },
}));

vi.mock("@/lib/memory/redis-memory", () => ({
  RedisMemoryManager: vi.fn(() => ({
    saveSTM: saveSTMMock,
    saveLTM: saveLTMMock,
  })),
}));

describe("chat route", () => {
  beforeEach(() => {
    loadThreadMessagesMock.mockResolvedValue([]);
    routeMock.mockReset();
    routeMock.mockImplementation(async () => ({
      toUIMessageStreamResponse: ({ onFinish }: { onFinish?: ({ messages }: { messages?: UIMessage[] }) => Promise<void> | void }) => {
        onFinish?.({
          messages: [
            { id: "2", role: "assistant", parts: [{ type: "text", text: "Hi" }] } as UIMessage,
          ],
        });
        return new Response(null, { status: 200 });
      },
    }));
    saveSTMMock.mockResolvedValue(undefined);
    saveLTMMock.mockResolvedValue(undefined);
  });

  describe("GET", () => {
    it("returns history for a chat id", async () => {
      const messages: UIMessage[] = [
        { id: "1", role: "assistant", parts: [{ type: "text", text: "Hello" }] },
      ];
      loadThreadMessagesMock.mockResolvedValueOnce(messages);
      const module = await import("./route");
      const response = await module.GET(new Request("http://localhost/api/chat?chatId=test"));
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ messages });
    });

    it("validates missing chat id", async () => {
      const module = await import("./route");
      const response = await module.GET(new Request("http://localhost/api/chat"));
      expect(response.status).toBe(400);
    });
  });

  describe("POST", () => {

    it("rejects invalid payloads", async () => {
      const module = await import("./route");
      const response = await module.POST(new Request("http://localhost/api/chat", { method: "POST", body: "{}" }));
      expect(response.status).toBe(400);
    });

    it("routes through coordinator and persists memory", async () => {
      const module = await import("./route");
      loadThreadMessagesMock.mockResolvedValueOnce([
        { id: "prev", role: "assistant", parts: [{ type: "text", text: "Prev" }] },
      ]);

      const response = await module.POST(
        new Request("http://localhost/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: "thread-1",
            message: { id: "1", role: "user", content: "Show projects" },
          }),
        })
      );

      expect(response.status).toBe(200);
      expect(routeMock).toHaveBeenCalledTimes(1);
      const routeArgs = routeMock.mock.calls[0][0];
      expect(routeArgs.threadId).toBe("thread-1");
      expect(routeArgs.history).toHaveLength(2);
      expect(saveSTMMock).toHaveBeenCalledWith("thread-1", expect.any(Array));
      expect(saveLTMMock).toHaveBeenCalledWith("thread-1", expect.any(Array));
    });
  });
});
