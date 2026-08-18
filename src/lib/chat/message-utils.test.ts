import { describe, expect, it } from "vitest";
import {
  getMessageText,
  hasVisibleAssistantContent,
} from "@/lib/chat/message-utils";
import type { UIMessage } from "ai";

describe("getMessageText", () => {
  it("returns empty string when parts are missing instead of throwing", () => {
    const message = {
      id: "legacy",
      role: "user",
    } as UIMessage;

    expect(getMessageText(message)).toBe("");
  });

  it("reads the last text part", () => {
    const message: UIMessage = {
      id: "1",
      role: "user",
      parts: [{ type: "text", text: "Tell me about yourself." }],
    };

    expect(getMessageText(message)).toBe("Tell me about yourself.");
  });

  it("returns empty string for a tool-only assistant message", () => {
    const message = {
      id: "tool-only",
      role: "assistant",
      parts: [
        {
          type: "dynamic-tool",
          toolName: "open_project",
          toolCallId: "call-1",
          state: "output-available",
          input: { slug: "elon-ai" },
          output: { success: true },
        },
      ],
    } as UIMessage;

    expect(getMessageText(message)).toBe("");
    expect(hasVisibleAssistantContent(message)).toBe(false);
  });
});
