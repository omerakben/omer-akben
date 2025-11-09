/**
 * Vercel Cron Job: Episodic Memory Cleanup
 *
 * Scheduled to run every Sunday at 3am UTC.
 * Deletes episodic memory vectors older than 90 days to prevent unbounded growth.
 *
 * Schedule: 0 3 * * 0 (Every Sunday at 3:00 AM UTC)
 *
 * Vercel Cron Documentation:
 * https://vercel.com/docs/cron-jobs
 */

import { RedisEpisodicMemory } from "@/lib/mastra/memory/episodic";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout for cleanup operation

/**
 * GET /api/cron/cleanup-memory
 *
 * Triggered by Vercel Cron on schedule.
 * Performs cleanup of episodic memories older than 90 days.
 *
 * Returns:
 * - 200: Cleanup successful with deletion count
 * - 500: Cleanup failed with error message
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron (optional security check)
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting episodic memory cleanup...");

    const memory = new RedisEpisodicMemory();
    const deletedCount = await memory.cleanup(90); // 90-day TTL

    console.log(
      `[Cron] Cleanup complete: ${deletedCount} vectors deleted`
    );

    return NextResponse.json({
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Episodic memory cleanup failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
