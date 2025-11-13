/**
 * Dynamic Follow-Up Suggestions API
 *
 * POST /api/suggest-followups
 * Generates context-aware follow-up suggestions using GPT-4o-mini
 *
 * Request Body:
 * - messages: Array of conversation messages (role + content)
 * - userId: Optional user ID for semantic memory personalization
 * - threadId: Optional thread ID for conversation context
 *
 * Response:
 * - entities: Extracted person type, topic, project, confidence
 * - suggested_followups: 2-4 contextual follow-up questions with actions
 * - routing: Next conversation state and reason
 */

import { logError } from "@/lib/log";
import { RedisMemoryManager } from "@/lib/memory/redis-memory";
import type { SemanticMemory } from "@/lib/memory/types";
import {
  FollowupRequest,
  type FollowupRequestType,
} from "@/lib/schemas/followup-schema";
import { generateDynamicFollowups } from "@/lib/followups/dynamic-generator";
import { followupCache } from "@/lib/followups/cache";

export const maxDuration = 10; // Follow-up generation should be fast

const memoryManager = new RedisMemoryManager();

function ensureJsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/suggest-followups?threadId=xxx
 * Retrieve cached follow-up suggestions for a thread
 *
 * Response:
 * - 200: Cached suggestions found
 * - 404: No cached suggestions (client should POST to generate)
 * - 400: Missing threadId parameter
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const threadId = url.searchParams.get("threadId");

  if (!threadId) {
    return ensureJsonResponse(
      { error: "threadId query parameter is required" },
      400
    );
  }

  try {
    // Check cache for existing suggestions
    const cached = followupCache.get(threadId);

    if (cached) {
      return ensureJsonResponse(cached, 200);
    }

    // Not found in cache
    return ensureJsonResponse(
      {
        error: "No cached follow-ups found",
        hint: "POST to /api/suggest-followups to generate new suggestions",
      },
      404
    );
  } catch (error) {
    logError("suggest-followups:GET", error);
    return ensureJsonResponse(
      { error: "Internal server error while retrieving cached follow-ups" },
      500
    );
  }
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return ensureJsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  // Validate request with Zod schema
  const parsed = FollowupRequest.safeParse(payload);
  if (!parsed.success) {
    return ensureJsonResponse(
      {
        error: "Invalid request format",
        details: parsed.error.format(),
      },
      400
    );
  }

  const { messages, userId, threadId, context }: FollowupRequestType =
    parsed.data;

  try {
    // Load semantic memory for personalization (if userId provided)
    let semanticMemory: SemanticMemory | null = null;
    if (userId && userId !== "anonymous") {
      semanticMemory = await memoryManager.getSemantic<SemanticMemory>(userId);
    }

    // Generate dynamic follow-ups with GPT-4o-mini
    const followups = await generateDynamicFollowups({
      messages,
      userId,
      threadId,
      semanticMemory,
      context,
    });

    // Handle generation failure (null return from generator)
    if (!followups) {
      return ensureJsonResponse(
        {
          error: "Failed to generate follow-ups",
          fallback: true,
        },
        500
      );
    }

    return ensureJsonResponse(followups, 200);
  } catch (error) {
    logError("suggest-followups:POST", error);
    return ensureJsonResponse(
      {
        error: "Internal server error during follow-up generation",
      },
      500
    );
  }
}
