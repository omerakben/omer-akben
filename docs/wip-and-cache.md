# Work-in-Progress Gate & Cache Preferences

This document describes the banner, modal, and API plumbing that power the new Work-in-Progress (WIP) UX and caching controls on **omerakben.com**.

## Build identity

| Variable | Source | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` | Vercel (auto) | Preferred commit SHA surfaced to the client |
| `VERCEL_GIT_COMMIT_SHA` | Vercel (fallback) | Build ID when `NEXT_PUBLIC_*` version is absent |
| `NEXT_PUBLIC_BUILD_ID` | Optional override | Manual build identifier outside of Vercel |
| `NEXT_PUBLIC_BUILD_DATE` | Optional override | Timestamp override used when reproducible builds are required |

The runtime exports these values via `src/lib/build.ts` as `BUILD_ID` and `BUILD_DATE`. Components and pages render `BUILD_ID.slice(0, 7)` for human-friendly labels.

## Cookies

| Cookie | Description | TTL |
| --- | --- | --- |
| `ozzy_wip_ack` | Stores the last build ID the visitor acknowledged so the modal resurfaces only when a new deploy ships. | 1 year |
| `ozzy_cache_pref` | Persists the visitor cache preference (`performance` vs `fresh`). | 1 year |

Cookies are SameSite `lax`, non-HTTPOnly, and secured in production builds. Clearing preferences removes both cookies and resets Cache Storage plus web storage.

## API routes

- `app/api/preferences/wip/route.ts` &rarr; POST to acknowledge the current build (`Cache-Control: no-store`).
- `app/api/preferences/cache/route.ts` &rarr; POST to set cache preference, DELETE to clear (`Cache-Control: no-store`).
- `app/api/example/route.ts` demonstrates how to respect `ozzy_cache_pref`, returning `no-store` for `fresh` and `s-maxage=60, stale-while-revalidate=120` for performance.

## UI surfaces

- `components/SiteStatus.tsx` renders the sticky banner, build-aware modal, and "What's new" toast per build.
- `components/StatusPill.tsx` provides Beta / In Progress / Planned / Placeholder pills for inline status indicators.
- `app/status/page.tsx` lists what is working vs. missing and includes a mini changelog with build metadata.
- `app/legal/cookies/page.tsx` outlines the two cookies and explains how the cache toggle behaves.

## Testing

Vitest coverage includes:

- `src/components/SiteStatus.test.tsx` verifies toggle + clear actions call the preference endpoints and trigger reloads.
- `src/app/api/example/route.test.ts` validates `Cache-Control` headers for both cache modes and ensures preference routes are `no-store`.

Run locally with:

```bash
pnpm lint
pnpm test
```
