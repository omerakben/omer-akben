# Work-in-Progress Gate & Cache Preferences

This document describes the WIP acknowledgement flow, cache preference controls,
and related environment variables introduced for the Site Status experience.

## Build identity

- `BUILD_ID` is derived from `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`,
  `NEXT_PUBLIC_BUILD_ID`, or `VERCEL_GIT_COMMIT_SHA` (fallback `"dev"`).
- `BUILD_DATE` is read from `NEXT_PUBLIC_BUILD_DATE` or defaults to the current
  ISO timestamp when the build runs.
- Both values live in `src/lib/build.ts` and are used by the banner, modal, and
  status page. Expose `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` on Vercel to surface
  the commit hash client-side.

## Cookies

| Cookie | Purpose | Scope |
| --- | --- | --- |
| `ozzy_wip_ack` | Stores the last acknowledged build ID so the modal can reappear on new deploys. | Path `/`, non-HTTP only |
| `ozzy_cache_pref` | Tracks cache preference (`performance` or `fresh`) for API responses. | Path `/`, non-HTTP only |

Clearing the cache banner action removes both cookies and wipes Cache Storage,
`localStorage`, and `sessionStorage` before calling
`DELETE /api/preferences/cache`.

## API endpoints

- `POST /api/preferences/wip` – sets `ozzy_wip_ack` to the active `BUILD_ID`.
- `POST /api/preferences/cache` – accepts `{ mode: "fresh" | "performance" }`
  and sets the cache preference cookie.
- `DELETE /api/preferences/cache` – removes both cookies and triggers the client
  cache clear routine.
- `GET /api/example` – demonstrates how the cache preference influences the
  `Cache-Control` header (`no-store` vs `s-maxage=60, stale-while-revalidate=120`).

All preference routes send `Cache-Control: no-store` to avoid unintended
caching.

## UI flow

1. Layout renders `<SiteStatus>` with the initial cookie value from the server.
2. On mount, the banner checks for dismissal state and surfaces a “What’s New”
   toast once per build.
3. If the acknowledgement cookie does not match the current build, a modal
   blocks interaction until the visitor accepts.
4. Cache preference toggles call the API and refresh server components so
   Upstash-backed routes respect the new headers.

Refer to `/status` for a build-specific changelog and `/legal/cookies` for the
plain-English explanation linked from the modal.
