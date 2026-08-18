/**
 * Client-side chat transport error helpers.
 *
 * AI SDK 6 calls onFinish after both success and failure. Clearing the
 * visible error in onFinish without checking isError/isAbort is what made
 * production 500s look like a silent, empty chat.
 */

export type ChatFinishEvent = {
  isError?: boolean;
  isAbort?: boolean;
  isDisconnect?: boolean;
};

const GENERIC_CHAT_ERROR = "Failed to send message. Please try again.";
const EMPTY_REPLY_ERROR = "Ozzy did not return a reply. Please try again.";

export function parseChatTransportError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const trimmed = raw.trim();

  if (!trimmed) {
    return GENERIC_CHAT_ERROR;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === "object" &&
      "error" in parsed &&
      typeof parsed.error === "string" &&
      parsed.error.trim()
    ) {
      return parsed.error.trim();
    }
  } catch {
    // Transport errors are often plain text, not JSON.
  }

  if (/failed to fetch|networkerror|load failed/i.test(trimmed)) {
    return "Network error. Please check your connection and try again.";
  }

  return trimmed;
}

export function shouldClearChatError(finish?: ChatFinishEvent): boolean {
  if (!finish) {
    return false;
  }

  return (
    finish.isError !== true &&
    finish.isAbort !== true &&
    finish.isDisconnect !== true
  );
}

export function silentReplyErrorMessage(): string {
  return EMPTY_REPLY_ERROR;
}
