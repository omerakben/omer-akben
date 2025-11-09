/**
 * Follow-up Generation and Caching Helper
 *
 * Integrates with chat API's onFinish callback to:
 * - Convert UIMessage[] to dynamic generator format
 * - Generate follow-up suggestions with semantic memory
 * - Cache results for instant client-side retrieval
 * - Handle errors gracefully without breaking chat flow
 */

import type { UIMessage } from "ai";
import { generateDynamicFollowups } from "./dynamic-generator";
import { followupCache } from "./cache";
import { RedisMemoryManager } from "@/lib/memory/redis-memory";
import type { SemanticMemory } from "@/lib/memory/types";

interface GenerateAndCacheParams {
  threadId: string;
  userId: string;
  messages: UIMessage[];
}

const memoryManager = new RedisMemoryManager();

/**
 * Convert UIMessage to simple message format
 * Extracts text content from parts array
 */
function convertUIMessageToSimple(message: UIMessage): {
  role: "user" | "assistant" | "system";
  content: string;
} {
  // Normalize role early (UIMessage can be "user" | "assistant" | "system" | "tool")
  // Map "tool" role to "assistant" since generator expects user/assistant/system only
  const messageRole = message.role as "user" | "assistant" | "system" | "tool";
  const role: "user" | "assistant" | "system" =
    messageRole === "tool" ? "assistant" : messageRole;

  // STRATEGY 1: Extract text from parts array (normal LLM messages)
  if (message.parts && message.parts.length > 0) {
    const textParts = message.parts
      .filter(
        (part): part is { type: "text"; text: string } =>
          part.type === "text" &&
          "text" in part &&
          typeof part.text === "string"
      )
      .map((part) => part.text.trim())
      .filter(Boolean);

    if (textParts.length > 0) {
      return {
        role,
        content: textParts.join("\n"),
      };
    }
  }

  // STRATEGY 2: Fallback to .content property (workflow messages, legacy format)
  // This mirrors the pattern used in extractMessageText() in route.ts
  if (
    typeof (message as unknown as { content?: unknown }).content === "string"
  ) {
    const content = (
      (message as unknown as { content?: string }).content ?? ""
    ).trim();
    return {
      role,
      content,
    };
  }

  // STRATEGY 3: Empty content (will be filtered out at line 83)
  return {
    role,
    content: "",
  };
}

/**
 * Generate follow-up suggestions and cache them
 * Called from chat API's onFinish callback
 *
 * Design: Fire-and-forget pattern - errors are logged but don't break chat flow
 */
export async function generateAndCacheFollowups({
  threadId,
  userId,
  messages,
}: GenerateAndCacheParams): Promise<void> {
  try {
    // Convert UIMessage[] to simple message format
    const convertedMessages = messages
      .map(convertUIMessageToSimple)
      .filter((msg) => msg.content.length > 0); // Filter out empty messages

    // Skip generation if no valid messages
    if (convertedMessages.length === 0) {
      console.warn(
        "[FollowupCache] No valid messages to generate follow-ups from"
      );
      return;
    }

    // Load semantic memory for personalization
    let semanticMemory: SemanticMemory | null = null;
    if (userId !== "anonymous") {
      try {
        semanticMemory = await memoryManager.getSemantic<SemanticMemory>(userId);
      } catch (error) {
        console.warn("[FollowupCache] Failed to load semantic memory:", error);
        // Continue without semantic memory
      }
    }

    // Generate follow-up suggestions
    const followups = await generateDynamicFollowups({
      messages: convertedMessages,
      userId,
      threadId,
      semanticMemory,
    });

    // Cache if generation successful
    if (followups) {
      followupCache.set(threadId, followups);
    } else {
      console.warn(
        "[FollowupCache] Generation returned null, nothing to cache"
      );
    }
  } catch (error) {
    // Log error but don't throw - we don't want to break the chat flow
    if (error instanceof Error) {
      console.error("[FollowupCache] Generation failed:", error.message);
    } else {
      console.error("[FollowupCache] Unknown error:", error);
    }
  }
}
