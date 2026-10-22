import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

const toUIMessageStreamResponse = vi.fn();
const streamTextMock = vi.fn();

vi.mock("ai", async () => {
  const actual = await vi.importActual<typeof import("ai")>("ai");
  return {
    ...actual,
    streamText: (...args: unknown[]) => streamTextMock(...args),
  };
});

vi.mock("@ai-sdk/openai", () => ({
  openai: (model: string) => ({ provider: "openai", modelId: model }),
}));

describe("streamChatWithOpenAIFallback", () => {
  beforeEach(() => {
    toUIMessageStreamResponse.mockReset();
    streamTextMock.mockReset();
    toUIMessageStreamResponse.mockResolvedValue(new Response("ok", { status: 200 }));
    streamTextMock.mockReturnValue({
      toUIMessageStreamResponse,
    });
  });

  it("converts UI messages to model messages and streams via OpenAI", async () => {
    const { streamChatWithOpenAIFallback, toModelMessages } = await import(
      "./openai-fallback-stream"
    );

    const messages: UIMessage[] = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Tell me about yourself." }],
      },
    ];

    expect(toModelMessages(messages)).toEqual([
      { role: "user", content: "Tell me about yourself." },
    ]);

    const onFinish = vi.fn().mockResolvedValue(undefined);
    const response = await streamChatWithOpenAIFallback({
      messages,
      system: "You are Ozzy.",
      onFinish,
    });

    expect(response.status).toBe(200);
    expect(streamTextMock).toHaveBeenCalledTimes(1);
    const streamArgs = streamTextMock.mock.calls[0][0] as {
      system: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(streamArgs.system).toBe("You are Ozzy.");
    expect(streamArgs.messages[0]?.content).toBe("Tell me about yourself.");
    expect(toUIMessageStreamResponse).toHaveBeenCalledTimes(1);
  });

  it("rejects an empty transcript", async () => {
    const { streamChatWithOpenAIFallback } = await import(
      "./openai-fallback-stream"
    );

    await expect(
      streamChatWithOpenAIFallback({
        messages: [],
        system: "You are Ozzy.",
        onFinish: vi.fn(),
      })
    ).rejects.toThrow("No message to send");
  });
});
