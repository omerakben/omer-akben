
# WIP Banner Revamp + /status Page Updates

> Goal: make the “Still Cooking / Site under active development” experience polished, accessible, and persisting across deploys. Guide users to **/status** and re‑show when a new build ships.

## 0) Deliverables

- [ ] New **`<WipBanner />`** component (data-driven, a11y, responsive).
- [ ] Centralized **copy & config** (microcopy, icons, version key).
- [ ] **Analytics** for view, click, dismiss.
- [ ] **Persisted dismissal** keyed by current commit SHA.
- [ ] **/status** page copy includes exact banner microcopy & rationale.
- [ ] Unit + E2E tests (keyboard, focus order, a11y, persistence).

## 1) Copy (final text + variants)

**Primary:** `Site under active development. Some features are still being built. View status`
**Playful:** `Still cooking. Some features are in the pan. View status`

- Default to **Primary**; allow Playful via config.
- “View status” is a link **and** visually a button; prefetch `/status`.

## 2) Component API & Placement

**File:** `src/components/wip/WipBanner.tsx`

```ts
export type WipBannerVariant = 'neutral' | 'playful';
export type WipBannerIcon = 'info' | 'egg';

interface WipBannerProps {
  variant?: WipBannerVariant;   // default 'neutral'
  icon?: WipBannerIcon;         // default 'info'
  statusHref?: string;          // default '/status'
  versionKey: string;           // short git SHA (re-show on new deploy)
}
```

**Placement**

- Render once, **above the site nav** in `app/layout.tsx`, wrapped in `<aside role="status" aria-live="polite">`.
- **Hide on `/status`** itself.
- Sticky top on scroll (no fixed overlay).

## 3) Visual Spec

- Container: `w-full border-b` + subtle gradient matching theme.
- Content: `max-w-6xl mx-auto px-4 sm:px-6 py-2.5`
- Row: `flex items-center gap-3 justify-center md:justify-between`
- Left cluster: `flex items-center gap-2`
- Icon: centered `h-5 w-5` (SVG or emoji), `shrink-0`
- Text: `text-sm leading-6`
- Link/Button: underline + focus ring; pill on desktop
- Dismiss “×” button: **≥ 40×40 px**, rounded, hover bg, focus ring
- Respect brightness tokens; ensure AA contrast for all modes.

## 4) Iconography

- **Default:** info (professional, universal).
- **Optional:** egg/frying pan for brand personality.
- Use emoji `🍳` or inline SVG (no heavy icon packs).

## 5) Behavior & Persistence

- Dismiss stores `localStorage.setItem('wip-dismissed:<sha>', '1')`.
- Show if key missing; hide if present.
- On **new deploy** (sha changed), re‑show.
- Keyboard: Tab order = link then dismiss; `Esc` dismisses.
- Click on “View status” also sets dismissal key.

## 6) Accessibility

- `<aside role="status" aria-live="polite" aria-label="Site status">`
- Icon `aria-hidden="true"` + `sr-only` text “Site status”.
- Dismiss button `aria-label="Dismiss site status banner"`.
- Link text is explicit (“View status”).
- Contrast verified in all brightness modes; reduced‑motion friendly.

## 7) Analytics

- `status_banner.view` (first visible render)
- `status_banner.click_view_status`
- `status_banner.dismiss`
- Include `{ sha, variant, icon, path }`

## 8) Code Skeleton

```tsx
// src/components/wip/WipBanner.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';

export function WipBanner({
  variant = 'neutral',
  icon = 'info',
  statusHref = '/status',
  versionKey,
}: {
  variant?: 'neutral' | 'playful';
  icon?: 'info' | 'egg';
  statusHref?: string;
  versionKey: string;
}) {
  const storageKey = useMemo(() => `wip-dismissed:${versionKey}`, [versionKey]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== 'undefined' && localStorage.getItem(storageKey);
    if (!dismissed) setVisible(true);
    // analytics: status_banner.view
  }, [storageKey]);

  if (!visible) return null;

  const Icon = () => (
    <span aria-hidden="true" className="h-5 w-5 grid place-items-center shrink-0">
      {icon === 'egg' ? '🍳' : (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" />
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
      )}
    </span>
  );

  const dismiss = () => {
    try { localStorage.setItem(storageKey, '1'); } catch {}
    setVisible(false);
    // analytics: status_banner.dismiss
  };

  const onViewStatus = () => {
    try { localStorage.setItem(storageKey, '1'); } catch {}
    // analytics: status_banner.click_view_status
  };

  return (
    <aside role="status" aria-live="polite" aria-label="Site status"
      className="w-full border-b bg-[var(--banner-bg)] text-[var(--banner-fg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-3 justify-center md:justify-between">
          <div className="flex items-center gap-2">
            <Icon />
            <div className="text-sm leading-6">
              <span className="sr-only">Site status: </span>
              <strong>Site under active development.</strong> Some features are still being built.
              {' '}
              <a href={statusHref} onClick={onViewStatus}
                className="underline underline-offset-2 focus:outline-none focus:ring">
                View status
              </a>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss site status banner"
            onClick={dismiss}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/5 focus:outline-none focus:ring">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
```

**Layout usage**

```tsx
// src/app/layout.tsx (snippet)
import { WipBanner } from '@/components/wip/WipBanner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sha = process.env.NEXT_PUBLIC_GIT_SHA ?? 'dev';
  return (
    <html lang="en">
      <body>
        {/* Hide conditionally in your actual code if pathname === '/status' */}
        <WipBanner versionKey={sha} />
        {children}
      </body>
    </html>
  );
}
```

## 9) /status Page Tie‑In

- Add a “Why you saw a banner” box at the top.
- Include the same microcopy string for consistency.
- Add a changelog item when banner copy/logic changes.
- Link to Quality/Perf sections so the banner isn’t the only story.

## 10) Tests

**Unit**

- Renders text, link, dismiss; icon swap; localStorage key set.
**E2E**
- Visible on pages ≠ `/status`; link routes; `Tab` order; `Esc` dismiss; Axe pass; persistence verified.

## 11) Definition of Done

- Clean on mobile/desktop; icon centered with text.
- “×” hit area ≥ 40px; keyboard + SR friendly.
- Link prefetches `/status`; dismissal persists by SHA.
- Variant + icon toggles without new dependencies.
- Tests pass; no ESLint/TS errors; no perf regressions.
