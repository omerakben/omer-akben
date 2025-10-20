import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import type { UIMessage } from "ai";
import { z } from "zod";

const getMock = vi.fn();
const putMock = vi.fn();
const streamTextMock = vi.fn();
const redisConstructorMock = vi.fn();

vi.mock("@langchain/langgraph-checkpoint-redis", () => ({
  RedisSaver: class {
    get = getMock;
    put = putMock;
  },
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor(config: unknown) {
      redisConstructorMock(config);
    }
  },
}));

vi.mock("@ai-sdk/openai", () => ({
  openai: vi.fn().mockReturnValue("mock-model"),
}));

vi.mock("@/lib/agent-knowledge-base", () => ({
  enhancedSystemPrompt: "system-prompt",
}));

vi.mock("@/lib/agent-tools/schemas", () => ({
  navigatePageInputSchema: z.object({}),
  scrollToSectionInputSchema: z.object({}),
  extractPageSummaryInputSchema: z.object({}),
  triggerWorkflowInputSchema: z.object({}),
  profilePerformanceInputSchema: z.object({}),
}));

vi.mock("ai", async () => {
  const actual = await vi.importActual<typeof import("ai")>("ai");
  return {
    ...actual,
    convertToModelMessages: (messages: UIMessage[]) => messages,
    streamText: streamTextMock,
  };
});

process.env.UPSTASH_REDIS_REST_URL = "https://example.com";
process.env.UPSTASH_REDIS_REST_TOKEN = "token";
process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";

const originalFetch = global.fetch;
let routeModule: typeof import("./route");

beforeAll(async () => {
  routeModule = await import("./route");
});

afterAll(() => {
  global.fetch = originalFetch;
});

beforeEach(() => {
  getMock.mockReset();
  putMock.mockReset();
  streamTextMock.mockReset();
  redisConstructorMock.mockClear();

  streamTextMock.mockImplementation(({ messages }) => ({
    onFinish: (handler: (event: { messages: UIMessage[] }) => void) => {
      handler({ messages: messages as UIMessage[] });
    },
    toUIMessageStreamResponse: () => new Response("ok"),
  }));

  global.fetch = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({ success: true }),
  }) as unknown as typeof fetch;
});

describe("chat route", () => {
  it("returns history for a chat id", async () => {
    const history: UIMessage[] = [
      {
        id: "1",
        role: "user",
        content: [{ type: "text", text: "Hello" }],
      } as unknown as UIMessage,
    ];

    getMock.mockResolvedValue({
      channel_values: { messages: history },
    });

    const response = await routeModule.GET(
      new Request("http://localhost/api/chat?chatId=test-thread")
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.messages).toEqual(history);
  });

  it("returns 400 when chatId missing on GET", async () => {
    const response = await routeModule.GET(new Request("http://localhost/api/chat"));
    expect(response.status).toBe(400);
  });

  it("returns 400 when payload invalid", async () => {
    const response = await routeModule.POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      })
    );

    expect(response.status).toBe(400);
  });

  it("persists chat history via Redis checkpointer", async () => {
    const history: UIMessage[] = [
      {
        id: "1",
        role: "assistant",
        content: [{ type: "text", text: "Hi there" }],
      } as unknown as UIMessage,
    ];

    const newMessage = {
      id: "2",
      role: "user",
      content: [{ type: "text", text: "Tell me more" }],
    } as unknown as UIMessage;

    getMock.mockResolvedValue({
      channel_values: { messages: history },
    });

    const response = await routeModule.POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ chatId: "test-thread", message: newMessage }),
        headers: { "Content-Type": "application/json" },
      })
    );

    expect(response.status).toBe(200);
    expect(streamTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [...history, newMessage],
      })
    );
    expect(putMock).toHaveBeenCalledWith(
      { configurable: { thread_id: "test-thread" } },
      { messages: [...history, newMessage] },
      {}
    );
  });
});
