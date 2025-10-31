import { logError } from "@/lib/log";
import { getRedisClient } from "@/lib/redis/client";
import { NextRequest } from "next/server";
import { z } from "zod";

// Cache preference options
const CachePreferenceSchema = z.enum(["performance", "quality"]);
type CachePreference = z.infer<typeof CachePreferenceSchema>;

// Request schema for POST endpoint
const SetPreferenceRequestSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  preference: CachePreferenceSchema,
});

// Redis key prefix and TTL
const REDIS_KEY_PREFIX = "cache_pref:";
const TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

/**
 * Helper to ensure JSON response format
 */
function ensureJsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/preferences/cache?clientId={clientId}
 * Retrieve cache preference for a client
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return ensureJsonResponse(
        {
          success: false,
          error: "Client ID is required",
        },
        400
      );
    }

    // Get Redis client (handles missing env vars gracefully)
    let redis;
    try {
      redis = getRedisClient();
    } catch (error) {
      logError("cache-preferences:GET:redis", error);
      // Return null preference if Redis unavailable (dev mode graceful degradation)
      return ensureJsonResponse({
        success: true,
        data: { preference: null },
      });
    }

    // Retrieve preference from Redis
    const key = `${REDIS_KEY_PREFIX}${clientId}`;
    const preference = await redis.get<CachePreference>(key);

    return ensureJsonResponse({
      success: true,
      data: { preference: preference ?? null },
    });
  } catch (error) {
    logError("cache-preferences:GET", error);
    return ensureJsonResponse(
      {
        success: false,
        error: "Failed to retrieve cache preference",
      },
      500
    );
  }
}

/**
 * POST /api/preferences/cache
 * Set cache preference for a client
 * Body: { clientId: string, preference: "performance" | "quality" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = SetPreferenceRequestSchema.safeParse(body);
    if (!validation.success) {
      return ensureJsonResponse(
        {
          success: false,
          error: validation.error.issues[0]?.message ?? "Invalid request",
        },
        400
      );
    }

    const { clientId, preference } = validation.data;

    // Get Redis client (handles missing env vars gracefully)
    let redis;
    try {
      redis = getRedisClient();
    } catch (error) {
      logError("cache-preferences:POST:redis", error);
      // Return success but log warning if Redis unavailable (dev mode)
      console.warn(
        "[cache-preferences:POST] Redis unavailable, preference not persisted"
      );
      return ensureJsonResponse({
        success: true,
        data: { preference },
      });
    }

    // Store preference in Redis with TTL
    const key = `${REDIS_KEY_PREFIX}${clientId}`;
    await redis.set(key, preference, { ex: TTL_SECONDS });

    return ensureJsonResponse({
      success: true,
      data: { preference },
    });
  } catch (error) {
    logError("cache-preferences:POST", error);
    return ensureJsonResponse(
      {
        success: false,
        error: "Failed to save cache preference",
      },
      500
    );
  }
}
