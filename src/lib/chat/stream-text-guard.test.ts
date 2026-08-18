import { describe, expect, it } from "vitest";
import {
  chunkHasAssistantText,
  forwardAgentStreamWithTextGuard,
} from "@/lib/chat/stream-text-guard";

describe("chunkHasAssistantText", () => {
  it("detects AI SDK text-delta chunks", () => {
    expect(
      chunkHasAssistantText({ type: "text-delta", id: "1", delta: "Hello" })
    ).toBe(true);
    expect(
      chunkHasAssistantText({ type: "text-delta", id: "1", delta: "   " })
    ).toBe(false);
  });

  it("ignores tool-only chunks", () => {
    expect(
      chunkHasAssistantText({
        type: "tool-output-available",
        toolCallId: "call-1",
        output: { slug: "elon-ai" },
      })
    ).toBe(false);
  });
});

describe("forwardAgentStreamWithTextGuard", () => {
  it("injects grounded TUEL text when the stream has no text-delta", async () => {
    const writes: unknown[] = [];
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue({
          type: "tool-output-available",
          toolCallId: "call-1",
          output: { slug: "elon-ai" },
        });
        controller.close();
      },
    });

    const wroteModelText = await forwardAgentStreamWithTextGuard({
      writer: {
        write: (chunk: unknown) => {
          writes.push(chunk);
        },
      } as never,
      stream,
      query: "What is Tuel?",
    });

    expect(wroteModelText).toBe(false);
    const fallback = writes.find(
      (chunk) =>
        typeof chunk === "object" &&
        chunk !== null &&
        "type" in chunk &&
        chunk.type === "text-delta"
    ) as { delta?: string } | undefined;
    expect(fallback?.delta).toMatch(/TUEL/i);
    expect(fallback?.delta).toMatch(/250\+/);
  });

  it("does not inject fallback when the model already streamed text", async () => {
    const writes: unknown[] = [];
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue({
          type: "text-delta",
          id: "1",
          delta: "TUEL AI is Omer's product family.",
        });
        controller.close();
      },
    });

    const wroteModelText = await forwardAgentStreamWithTextGuard({
      writer: {
        write: (chunk: unknown) => {
          writes.push(chunk);
        },
      } as never,
      stream,
      query: "What is Tuel?",
    });

    expect(wroteModelText).toBe(true);
    expect(writes).toHaveLength(1);
  });
});
