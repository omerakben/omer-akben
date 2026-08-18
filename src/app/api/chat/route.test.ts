import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadSTMMock = vi.fn();
const routeMock = vi.fn();
const saveSTMMock = vi.fn();
const saveLTMMock = vi.fn();
let onFinishCallback: (({ messages }: { messages: UIMessage[] }) => void) | null = null;

// Helper to create a mock MastraModelOutput stream (Mastra v1 format)
function createMockMastraStream() {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue({ type: "text-delta", textDelta: "Hi" });
      controller.close();
    },
  });
  return { fullStream: stream, textStream: stream };
}

vi.mock("@/lib/mastra/agents/coordinator", () => ({
  coordinatorAgent: {
    route: routeMock,
  },
}));

vi.mock("@/lib/memory/fact-extractor", () => ({
  extractAndSaveFacts: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/memory/redis-memory", () => {
  class RedisMemoryManager {
    loadSTM = loadSTMMock;
    saveSTM = saveSTMMock;
    saveLTM = saveLTMMock;
  }
  return { RedisMemoryManager };
});

// Mock toAISdkStream
vi.mock("@mastra/ai-sdk", () => ({
  toAISdkStream: vi.fn(() => {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: "text", text: "Hi" });
        controller.close();
      },
    });
  }),
}));

vi.mock("@/lib/followups/generate-and-cache", () => ({
  generateAndCacheFollowups: vi.fn().mockResolvedValue(undefined),
}));

const streamChatWithOpenAIFallback = vi.fn();

vi.mock("@/lib/chat/openai-fallback-stream", () => ({
  streamChatWithOpenAIFallback: (...args: unknown[]) =>
    streamChatWithOpenAIFallback(...args),
}));

vi.mock("@/lib/mastra/agents/ozzy-agent", () => ({
  buildOzzyInstructions: vi.fn().mockResolvedValue({
    role: "system",
    content: "You are Ozzy.",
  }),
}));

// Mock AI SDK's createUIMessageStream to capture onFinish callback
vi.mock("ai", async () => {
  const actual = await vi.importActual("ai");
  return {
    ...actual,
    createUIMessageStream: vi.fn(({ onFinish }) => {
      // Store the onFinish callback for later invocation
      onFinishCallback = onFinish;
      return new ReadableStream({
        start(controller) {
          controller.enqueue({ type: "text", text: "Hi" });
          controller.close();
        },
      });
    }),
    createUIMessageStreamResponse: vi.fn(({ stream }) => {
      return new Response(stream, { status: 200 });
    }),
  };
});

describe("chat route", () => {
  beforeEach(() => {
    loadSTMMock.mockResolvedValue([]);
    routeMock.mockReset();
    routeMock.mockImplementation(async () => createMockMastraStream());
    saveSTMMock.mockResolvedValue(undefined);
    saveLTMMock.mockResolvedValue(undefined);
    onFinishCallback = null;
    streamChatWithOpenAIFallback.mockReset();
    streamChatWithOpenAIFallback.mockResolvedValue(
      new Response("fallback-stream", { status: 200 })
    );
  });

  describe("GET", () => {
    it("returns history for a chat id", async () => {
      const messages: UIMessage[] = [
        {
          id: "1",
          role: "assistant",
          parts: [{ type: "text", text: "Hello" }],
        },
      ];
      loadSTMMock.mockResolvedValueOnce(messages);
      const routeModule = await import("./route");
      const response = await routeModule.GET(
        new Request("http://localhost/api/chat?chatId=test")
      );
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ messages });
    });

    it("validates missing chat id", async () => {
      const routeModule = await import("./route");
      const response = await routeModule.GET(
        new Request("http://localhost/api/chat")
      );
      expect(response.status).toBe(400);
    });
  });

  describe("POST", () => {
    it("rejects invalid payloads", async () => {
      const routeModule = await import("./route");
      const response = await routeModule.POST(
        new Request("http://localhost/api/chat", { method: "POST", body: "{}" })
      );
      expect(response.status).toBe(400);
    });

    it("routes through coordinator and persists memory", async () => {
      const routeModule = await import("./route");
      loadSTMMock.mockResolvedValueOnce([
        {
          id: "prev",
          role: "assistant",
          parts: [{ type: "text", text: "Prev" }],
        },
      ]);

      const response = await routeModule.POST(
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

      // Trigger the onFinish callback that was captured during stream creation
      if (onFinishCallback) {
        await onFinishCallback({
          messages: [
            {
              id: "2",
              role: "assistant",
              parts: [{ type: "text", text: "Hi" }],
            } as UIMessage,
          ],
        });
      }

      expect(saveSTMMock).toHaveBeenCalledWith("thread-1", expect.any(Array));
      expect(saveLTMMock).toHaveBeenCalledWith("thread-1", expect.any(Array));
      expect(streamChatWithOpenAIFallback).not.toHaveBeenCalled();
    });

    it("falls back to OpenAI when the Mastra coordinator throws", async () => {
      const routeModule = await import("./route");
      routeMock.mockRejectedValueOnce(new Error("Memory is not initialized"));

      const response = await routeModule.POST(
        new Request("http://localhost/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: "thread-fallback",
            message: {
              id: "1",
              role: "user",
              parts: [{ type: "text", text: "Tell me about yourself." }],
            },
          }),
        })
      );

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("fallback-stream");
      expect(streamChatWithOpenAIFallback).toHaveBeenCalledTimes(1);
      const fallbackArgs = streamChatWithOpenAIFallback.mock.calls[0][0] as {
        system: string;
        messages: UIMessage[];
      };
      expect(fallbackArgs.system).toContain("You are Ozzy.");
      expect(fallbackArgs.messages.at(-1)?.role).toBe("user");
    });
  });
});
