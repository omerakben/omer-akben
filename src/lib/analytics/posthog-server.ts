/**
 * PostHog Server-Side Analytics Client
 *
 * Provides server-side PostHog analytics integration for tracking server events
 * (e.g., LLM calls, API requests). Validates project API key and disables in development
 * to prevent ECONNRESET errors.
 *
 * @module lib/analytics/posthog-server
 *
 * @example
 * ```ts
 * import { getPostHogServer } from '@/lib/analytics/posthog-server';
 *
 * const posthog = getPostHogServer();
 * if (posthog) {
 *   posthog.capture({
 *     distinctId: 'user-id',
 *     event: 'llm_call',
 *     properties: { model: 'grok-4-fast', tokens: 1500 }
 *   });
 * }
 * ```
 *
 * @remarks
 * - Returns null if NEXT_PUBLIC_POSTHOG_KEY is missing or invalid
 * - Disabled in development to prevent connection errors
 * - Uses same project key as client-side analytics
 * - Singleton pattern ensures single client instance
 */

import { PostHog } from "posthog-node";

let posthogServerClient: PostHog | null = null;

/**
 * Gets or creates server-side PostHog client singleton
 *
 * Validates that NEXT_PUBLIC_POSTHOG_KEY starts with "phc_" (project key format).
 * Returns null if key is invalid or missing to allow graceful degradation.
 * Client is disabled in development mode to prevent ECONNRESET errors.
 *
 * @returns PostHog client instance or null if unavailable/invalid
 *
 * @example
 * ```ts
 * const posthog = getPostHogServer();
 * if (posthog) {
 *   posthog.capture({
 *     distinctId: 'anonymous',
 *     event: 'api_call',
 *     properties: { endpoint: '/api/chat', status: 200 }
 *   });
 * }
 * ```
 *
 * @remarks
 * - Singleton pattern: Returns same instance across all calls
 * - Disabled in development (NODE_ENV === "development")
 * - Validates "phc_" prefix (project API key format)
 * - Logs warning in development if key is missing/invalid
 * - Safe to call repeatedly (no performance cost)
 */
export function getPostHogServer(): PostHog | null {
  const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const POSTHOG_HOST =
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  // Validate project API key (must start with phc_)
  const isProjectApiKey = Boolean(
    POSTHOG_KEY && POSTHOG_KEY.startsWith("phc_")
  );

  if (!isProjectApiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        '[PostHog] Skipping server analytics – provide NEXT_PUBLIC_POSTHOG_KEY (project key starting with "phc_") to enable tracking.'
      );
    }
    return null;
  }

  if (!posthogServerClient) {
    posthogServerClient = new PostHog(POSTHOG_KEY!, {
      host: POSTHOG_HOST,
      flushAt: 20,
      flushInterval: 10000,
      // Disable in development to prevent ECONNRESET errors
      disabled: process.env.NODE_ENV === "development",
    });
  }
  return posthogServerClient;
}
