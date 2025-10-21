/**
 * Cache Metrics API Route
 *
 * Endpoint: GET /api/cache-metrics?type={embedding|completion}&days={number}
 *
 * Retrieves cache performance metrics for specified cache type and date range.
 * Used for monitoring cache hit rates, cost savings, and performance.
 *
 * Query Parameters:
 * - type: Cache type ("embedding" or "completion")
 * - days: Number of days to aggregate (default: 7, max: 90)
 *
 * Returns:
 * {
 *   hits: number,
 *   misses: number,
 *   hitRate: number,     // Percentage (0-100)
 *   totalCalls: number,
 *   avgLookupTime: number
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { getCacheMetrics, type CacheType } from "@/lib/cache/openai-cache";
import { logError } from "@/lib/log";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse and validate type parameter
    const type = searchParams.get("type") as CacheType | null;
    if (!type || !["embedding", "completion"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type parameter. Must be 'embedding' or 'completion'" },
        { status: 400 }
      );
    }

    // Parse and validate days parameter
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 7;

    // Validate that days is an integer (reject decimals like "3.5")
    const isInteger = daysParam === null || !daysParam.includes(".");

    if (isNaN(days) || days < 1 || days > 90 || !isInteger) {
      return NextResponse.json(
        { error: "Invalid days parameter. Must be between 1 and 90" },
        { status: 400 }
      );
    }

    // Retrieve metrics
    const metrics = await getCacheMetrics(type, days);

    return NextResponse.json({
      type,
      days,
      metrics,
    });
  } catch (error) {
    logError("cache-metrics:GET", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
