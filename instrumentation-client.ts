/**
 * PostHog Client-Side Analytics Initialization
 *
 * Initializes PostHog analytics for browser environments with the following features:
 * - Browser-only initialization (skips SSR)
 * - Project key validation (must start with "phc_")
 * - Opt-in capture with identified_only person profiles
 * - Manual pageview and pageleave tracking
 * - Debug mode in development environment
 *
 * @module instrumentation-client
 *
 * @example
 * ```tsx
 * import posthog from './instrumentation-client';
 *
 * // Analytics is automatically initialized on import
 * posthog.capture('custom_event', { property: 'value' });
 * ```
 *
 * @remarks
 * - Requires NEXT_PUBLIC_POSTHOG_KEY environment variable with "phc_" prefix
 * - Automatically exposes `window.posthog` in development for debugging
 * - Safe to import in both server and client components (only runs in browser)
 */

"use client";

import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

const isBrowser = typeof window !== "undefined";
const isProjectApiKey = Boolean(POSTHOG_KEY && POSTHOG_KEY.startsWith("phc_"));

if (isBrowser && isProjectApiKey) {
  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    autocapture: false,
    capture_pageview: true,
    defaults: "2025-05-24",
    capture_pageleave: true,
    loaded: (client) => {
      if (process.env.NODE_ENV === "development") client.debug();
      // Clear any previous opt-out when we have a valid key
      client.opt_in_capturing?.();

      // Expose to window for debugging
      if (typeof window !== "undefined") {
        (window as unknown as { posthog: typeof client }).posthog = client;
      }
    },
  });
} else if (isBrowser) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      '[PostHog] Skipping browser analytics – provide NEXT_PUBLIC_POSTHOG_KEY (project key starting with "phc_") and NEXT_PUBLIC_POSTHOG_HOST to enable tracking.'
    );
  }
}

export default posthog;
