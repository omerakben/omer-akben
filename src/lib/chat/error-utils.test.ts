import { describe, expect, it } from "vitest";
import {
  parseChatTransportError,
  shouldClearChatError,
  silentReplyErrorMessage,
} from "@/lib/chat/error-utils";

describe("parseChatTransportError", () => {
  it("extracts the server error from a JSON 500 body", () => {
    expect(
      parseChatTransportError(
        new Error('{"error":"Failed to process chat request"}')
      )
    ).toBe("Failed to process chat request");
  });

  it("maps fetch failures to a network message", () => {
    expect(parseChatTransportError(new Error("Failed to fetch"))).toBe(
      "Network error. Please check your connection and try again."
    );
  });

  it("returns a generic message for empty errors", () => {
    expect(parseChatTransportError(new Error("   "))).toBe(
      "Failed to send message. Please try again."
    );
  });

  it("keeps a plain transport message", () => {
    expect(parseChatTransportError(new Error("The response body is empty."))).toBe(
      "The response body is empty."
    );
  });
});

describe("shouldClearChatError", () => {
  it("does not clear when onFinish ran without a finish payload", () => {
    expect(shouldClearChatError(undefined)).toBe(false);
  });

  it("does not clear failed or aborted finishes", () => {
    expect(shouldClearChatError({ isError: true })).toBe(false);
    expect(shouldClearChatError({ isAbort: true })).toBe(false);
    expect(shouldClearChatError({ isDisconnect: true })).toBe(false);
  });

  it("clears only after an explicit successful finish", () => {
    expect(shouldClearChatError({ isError: false })).toBe(true);
  });
});

describe("silentReplyErrorMessage", () => {
  it("explains an empty completed turn", () => {
    expect(silentReplyErrorMessage()).toContain("did not return a reply");
  });
});
