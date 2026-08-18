import { buildGroundedFallback } from "@/lib/chat/grounded-fallback";
import type { UIMessageStreamWriter } from "ai";

const FALLBACK_TEXT_ID = "ozzy-grounded-fallback";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function chunkHasAssistantText(value: unknown): boolean {
  if (!isRecord(value) || typeof value.type !== "string") {
    return false;
  }

  if (value.type === "text-delta") {
    const delta =
      typeof value.delta === "string"
        ? value.delta
        : typeof value.text === "string"
          ? value.text
          : "";
    return delta.trim().length > 0;
  }

  if (value.type === "text") {
    return typeof value.text === "string" && value.text.trim().length > 0;
  }

  return false;
}

export function writeGroundedFallbackText(
  writer: UIMessageStreamWriter,
  query: string
): void {
  const text = buildGroundedFallback(query);
  writer.write({ type: "text-start", id: FALLBACK_TEXT_ID });
  writer.write({ type: "text-delta", id: FALLBACK_TEXT_ID, delta: text });
  writer.write({ type: "text-end", id: FALLBACK_TEXT_ID });
}

export async function forwardAgentStreamWithTextGuard(options: {
  writer: UIMessageStreamWriter;
  stream: ReadableStream<unknown>;
  query: string;
}): Promise<boolean> {
  let wroteText = false;
  const reader = options.stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (chunkHasAssistantText(value)) {
        wroteText = true;
      }
      options.writer.write(value as Parameters<UIMessageStreamWriter["write"]>[0]);
    }
  } finally {
    reader.releaseLock();
  }

  if (!wroteText) {
    writeGroundedFallbackText(options.writer, options.query);
  }

  return wroteText;
}
