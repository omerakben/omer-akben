'use client'

import posthog from 'posthog-js'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

const isBrowser = typeof window !== 'undefined'
const isProjectApiKey = Boolean(POSTHOG_KEY && POSTHOG_KEY.startsWith('phc_'))

if (isBrowser && isProjectApiKey) {
  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    autocapture: false,
    capture_pageview: false,
    defaults: '2025-05-24',
    capture_pageleave: true,
    loaded: (client) => {
      if (process.env.NODE_ENV === 'development') client.debug()
    },
  })
} else if (isBrowser) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[PostHog] Skipping browser analytics – provide NEXT_PUBLIC_POSTHOG_KEY (project key starting with "phc_") and NEXT_PUBLIC_POSTHOG_HOST to enable tracking.'
    )
  }

  // Ensure capture calls become no-ops when PostHog is disabled
  posthog.opt_out_capturing?.()
}

export default posthog
