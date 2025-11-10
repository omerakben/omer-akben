import type { UIMessage } from "ai";

type MessagePart = NonNullable<UIMessage["parts"]>[number];
type TextPart = Extract<MessagePart, { type: "text" }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTextPart(part: unknown): part is TextPart {
  if (!isRecord(part)) {
    return false;
  }

  return (
    typeof part.type === "string" &&
    part.type === "text" &&
    typeof (part as { text?: unknown }).text === "string"
  );
}

function shouldSkipPart(part: unknown): boolean {
  if (!isRecord(part) || typeof part.type !== "string") {
    return true;
  }

  // Drop Mastra-specific workflow markers that pollute the transcript
  if (part.type.startsWith("step-")) {
    return true;
  }

  return false;
}

export function extractUniqueTextFromParts(
  parts?: UIMessage["parts"]
): string {
  if (!Array.isArray(parts)) {
    return "";
  }

  // Strategy: Find the LAST text part after filtering out workflow markers
  // In AI SDK tool-calling flow, the final text part contains the complete response
  // Intermediate text parts (before tool calls) should be ignored

  let lastTextPart: TextPart | null = null;

  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];

    if (shouldSkipPart(part)) {
      continue;
    }

    if (isTextPart(part)) {
      const normalized = part.text.trim();
      if (normalized) {
        lastTextPart = part;
        break; // Found the last valid text part
      }
    }
  }

  return lastTextPart ? lastTextPart.text.trimEnd() : "";
}

export function getMessageText(message: UIMessage | null | undefined) {
  if (!message) {
    return "";
  }

  return extractUniqueTextFromParts(message.parts);
}

export type NavigationLink = {
  label: string;
  href: string;
  type: "internal" | "external";
};

function isNavigationLink(value: unknown): value is NavigationLink {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.label === "string" &&
    typeof value.href === "string" &&
    (value.type === "internal" || value.type === "external")
  );
}

function readLinksFromResult(
  result: unknown
): NavigationLink[] {
  if (!isRecord(result)) {
    return [];
  }

  const data = result.data;
  if (!isRecord(data) || !Array.isArray(data.links)) {
    return [];
  }

  return data.links.filter(isNavigationLink);
}

export function extractNavigationLinks(
  message: UIMessage | null | undefined
): NavigationLink[] {
  if (!message || !Array.isArray(message.parts)) {
    return [];
  }

  const collected: NavigationLink[] = [];

  for (const part of message.parts) {
    if (!isRecord(part) || typeof part.type !== "string") {
      continue;
    }

    if (part.type === "tool-provide_navigation_links") {
      const outputLinks = readLinksFromResult(
        (part as { output?: unknown }).output
      );
      collected.push(...outputLinks);
      continue;
    }

    if (
      part.type === "tool-result" &&
      "toolName" in part &&
      part.toolName === "provide_navigation_links"
    ) {
      const resultLinks = readLinksFromResult(
        (part as { result?: unknown }).result
      );
      collected.push(...resultLinks);
    }
  }

  const uniqueByHref = new Map<string, NavigationLink>();
  for (const link of collected) {
    if (!uniqueByHref.has(link.href)) {
      uniqueByHref.set(link.href, link);
    }
  }

  return Array.from(uniqueByHref.values());
}
