# Work-in-Progress gate & cache preferences

This repository now ships a lightweight WIP experience so visitors understand the current stability of each deploy while choosing their preferred caching strategy.

## Build identity

- `lib/build.ts` resolves `BUILD_ID`, `SHORT_BUILD_ID`, and `BUILD_DATE` from environment variables.
- Preferred env variables (in order):
  - `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`
  - `VERCEL_GIT_COMMIT_SHA`
  - `NEXT_PUBLIC_BUILD_ID`
- `BUILD_DATE` comes from `NEXT_PUBLIC_BUILD_DATE` or falls back to the runtime ISO timestamp.
- Expose commit SHA to the client on Vercel via `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` so the banner/modal stay in sync.

## Visitor experience

| Surface | Purpose |
| --- | --- |
| SiteStatus banner | Sticky gradient banner that shows WIP state, lets visitors toggle cache mode, clear browser storage, and dismiss per build. |
| First-visit modal | Blocks interaction until the user acknowledges the current build (stores `ozzy_wip_ack=<BUILD_ID>`). |
| Status pills | Inline badges (Beta/In Progress/Planned/Placeholder) added to project cards and the `/status` report. |
| What’s New toast | Triggered once per build after acknowledgement to highlight changes. |

## Cookies

| Cookie | Values | Notes |
| --- | --- | --- |
| `ozzy_wip_ack` | `BUILD_ID` | Marks the current build as acknowledged. Expires in 30 days. |
| `ozzy_cache_pref` | `performance` \| `fresh` | Controls API caching behavior. Expires in 30 days. |

## API endpoints

All preference endpoints return `Cache-Control: no-store` to avoid intermediary caching.

- `POST /api/preferences/wip` → sets `ozzy_wip_ack` to the resolved `BUILD_ID`.
- `POST /api/preferences/cache` → accepts `{ mode: "fresh" | "performance" }` and writes `ozzy_cache_pref`.
- `DELETE /api/preferences/cache` → clears both cookies (used by the “Clear cache” button).
- `GET /api/example` → demonstrates how to read the cookie and emit different Cache-Control headers (`no-store` vs `s-maxage=60, stale-while-revalidate=120`).

## UI controls

- Banner toggle swaps between performance (cached) and always fresh (no-store) requests and forces a reload for server component hydration.
- “Clear cache” clears Cache Storage, `localStorage`, `sessionStorage`, and resets cookies via the DELETE endpoint.
- Modal acknowledgement, toggle, and clear operations all call the appropriate endpoints and refresh the page to sync server state.

## Pages & docs

- `/status` surfaces the current build, what works, what is still in progress, and a short changelog.
- `/legal/cookies` documents both cookies, expiration, and reset methods.
- README now links to both pages under “WIP + Cache Preferences”.

## Testing

- `SiteStatus` is covered by unit tests for rendering, toggling cache modes, and clearing cache state.
- API routes include tests to verify Cache-Control headers obey `ozzy_cache_pref` and stay `no-store` where required.
