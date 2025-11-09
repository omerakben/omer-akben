'use client'

import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    autocapture: false,
    capture_pageview: false,
    defaults: '2025-05-24',
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })
}

export default posthog
