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

/**
 * Tool-result narration the model sometimes emits after provide_navigation_links.
 * These strings must never replace a streamed bio in the visible bubble.
 */
export function isToolNarrationText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  if (
    trimmed.startsWith("[") &&
    trimmed.endsWith("]") &&
    /navigation|tool call|buttons?/i.test(trimmed)
  ) {
    return true;
  }

  return /i(?:['’])?ve provided clickable navigation buttons/i.test(trimmed);
}

export function stripToolNarration(text: string): string {
  return text
    .replace(/\[[^\]]*(?:navigation buttons|tool (?:call|result)|buttons? (?:now )?appear)[^\]]*]/gi, "")
    .replace(/i(?:['’])?ve provided clickable navigation buttons[^.?!\n]*[.?!]?/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractUniqueTextFromParts(
  parts?: UIMessage["parts"]
): string {
  if (!Array.isArray(parts)) {
    return "";
  }

  // Keep every user-visible text part. Intro turns stream a bio, then
  // provide_navigation_links, then a later text-delta that used to wipe
  // the bio when only the last part was kept.
  const seen = new Set<string>();
  const kept: string[] = [];

  for (const part of parts) {
    if (shouldSkipPart(part) || !isTextPart(part)) {
      continue;
    }

    const cleaned = stripToolNarration(part.text);
    if (!cleaned || isToolNarrationText(cleaned)) {
      continue;
    }

    if (seen.has(cleaned)) {
      continue;
    }

    seen.add(cleaned);
    kept.push(cleaned);
  }

  return kept.join("\n\n");
}

export function getMessageText(message: UIMessage | null | undefined) {
  if (!message) {
    return "";
  }

  return extractUniqueTextFromParts(message.parts);
}

export function hasVisibleAssistantContent(
  message: UIMessage | null | undefined
): boolean {
  if (!message || message.role !== "assistant") {
    return false;
  }

  if (getMessageText(message).trim().length > 0) {
    return true;
  }

  if (extractNavigationLinks(message).length > 0) {
    return true;
  }

  return extractCollectContactMessage(message) !== null;
}

export type NavigationLink = {
  label: string;
  href: string;
  type: "internal" | "external";
  icon?: string;
};

function isNavigationLink(value: unknown): value is NavigationLink {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.label === "string" &&
    typeof value.href === "string" &&
    (value.type === "internal" || value.type === "external") &&
    (!("icon" in value) || typeof value.icon === "string")
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
      part.type === "dynamic-tool" &&
      "toolName" in part &&
      part.toolName === "provide_navigation_links"
    ) {
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

function readCollectContactMessageFromResult(result: unknown): string | null {
  if (!isRecord(result)) {
    return null;
  }

  const data = result.data;
  if (!isRecord(data)) {
    return null;
  }

  const message = data.message;
  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }

  return null;
}

export function extractCollectContactMessage(
  message: UIMessage | null | undefined
): string | null {
  if (!message || !Array.isArray(message.parts)) {
    return null;
  }

  for (const part of message.parts) {
    if (!isRecord(part) || typeof part.type !== "string") {
      continue;
    }

    if (part.type === "tool-collect_contact") {
      const output = (part as { output?: unknown }).output;
      const extracted = readCollectContactMessageFromResult(output);
      if (extracted) {
        return extracted;
      }
    }

    if (
      part.type === "tool-result" &&
      "toolName" in part &&
      part.toolName === "collect_contact"
    ) {
      const extracted = readCollectContactMessageFromResult(
        (part as { result?: unknown }).result
      );
      if (extracted) {
        return extracted;
      }
    }

    if (
      part.type === "dynamic-tool" &&
      "toolName" in part &&
      part.toolName === "collect_contact"
    ) {
      const extracted = readCollectContactMessageFromResult(
        (part as { output?: unknown }).output
      );
      if (extracted) {
        return extracted;
      }
    }
  }

  return null;
}
