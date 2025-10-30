# Work-in-Progress gate & cache preferences

This document explains how the WIP experience and caching preferences are implemented.

## Build identity

- `lib/build.ts` exports `BUILD_ID` and `BUILD_DATE`.
- Values prefer Vercel-provided commit SHA (`NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` → `VERCEL_GIT_COMMIT_SHA`) and optional `NEXT_PUBLIC_BUILD_ID` fallback.
- `BUILD_DATE` uses `NEXT_PUBLIC_BUILD_DATE` when set, otherwise falls back to the runtime ISO timestamp created when the module loads.

## Cookies

| Name | Purpose | Set by |
| --- | --- | --- |
| `ozzy_wip_ack` | Stores the build identifier once the user acknowledges the modal. Cleared on preference reset. | `POST /api/preferences/wip` |
| `ozzy_cache_pref` | Stores caching preference (`performance` or `fresh`). Cleared on preference reset. | `POST /api/preferences/cache` |

Both cookies:

- Use `SameSite=Lax` and are secure in production.
- Are readable on the client (no `HttpOnly`) so UI can toggle behaviour.

## Cache modes

- **Performance**: API responses return `Cache-Control: s-maxage=60, stale-while-revalidate=120`.
- **Always fresh**: API responses return `Cache-Control: no-store`.
- Example route: `app/api/example/route.ts` inspects the cookie and adjusts headers per request.

## UI

- `SiteStatus` renders the sticky banner, modal gate, cache toggle, and “Clear cache” button.
- Banner controls call:
  - `POST /api/preferences/cache` with `{ mode: "fresh" | "performance" }`.
  - `DELETE /api/preferences/cache` to clear cookies and browser storage.
- Modal acknowledgement calls `POST /api/preferences/wip` and reloads the app.
- Optional “What’s new” toast appears once per build for returning visitors.

## Reset behaviour

- “Clear cache” clears Cache Storage, `localStorage`, `sessionStorage`, and deletes both cookies via the API.
- After clearing, the next page load will show the modal again.

## Environment variables

Expose these to Vercel during deployment:

- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`
- `VERCEL_GIT_COMMIT_SHA` (set automatically by Vercel)
- Optional: `NEXT_PUBLIC_BUILD_ID`, `NEXT_PUBLIC_BUILD_DATE`

When running locally you can set `NEXT_PUBLIC_BUILD_ID`/`NEXT_PUBLIC_BUILD_DATE` to test specific versions.
