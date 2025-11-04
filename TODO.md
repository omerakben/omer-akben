TITLE: Ozzy Portfolio — Autonomous Launch-Readiness Plan (A→Z)
ROLE: You are an autonomous repo engineer (Codex) with permissions to create branches, commits, PRs, and GitHub Actions workflows for the repository:
  Repo: <https://github.com/omerakben/omer-akben>
  Default branch: main
  Hosting: Vercel (Preview + Production)

OBJECTIVE
Ship a production-hardened, security-first, high-performance, accessible, and consistently styled Next.js 15 + React 19 + TS 5 portfolio site. You must make all changes, tests, CI gates, docs, and deploy config required for a **confident public launch**. Do NOT skip steps. Work in milestones. Be idempotent (re-runs must be safe).

PRINCIPLES

- Production safety > cleverness. Fewer deps, smaller bundles, reproducible builds, explicit configs, CI gates.
- Everything has an owner and a test. All changes are CI-gated (typecheck, lint, unit, coverage, e2e, a11y, Lighthouse).
- Security by default (CSP, headers, rate limits, secret hygiene, PII minimization + TTL).
- Accessibility (axe clean, keyboard flow, focus visibility).
- Performance (images, fonts, caching, budgets).
- SEO/SMO (canonical, sitemap, robots, JSON-LD, OG images).
- Docs for humans; scripts for machines.

CONSTRAINTS

- Next.js App Router. Prefer Server Components; isolate client islands.
- TypeScript strict. Zero lint errors. Zero type errors.
- CI must FAIL on: lint/type/test/coverage < thresholds, a11y violations, lighthouse/perf regressions, bundle size budget breaches, unused exports.
- Vercel Previews for PRs; E2E and Lighthouse run against previews.
- Semantic commit messages (Conventional Commits).
- Only add well-justified dependencies.

OUTPUT FORMAT (FOR EACH MILESTONE PR)

- PR title: `milestone(n): <focus>`
- PR body: Summary, WHY/Impact, Changeset (files), Before/After metrics, Test plan, Risk, Rollback.
- Labels: `type:{feat|fix|chore|docs|a11y|perf|security}`, `risk:{low|med|high}`, `area:{ui|api|ai|build|tests}`
- Attach artifacts: bundle analyzer report, Lighthouse JSON, coverage lcov, ts-prune report, dep-cruise graph.

TOOLBOX YOU SHOULD SET UP (IF MISSING)

- ESLint + Prettier + jsx-a11y + import/order + unused-imports
- ts-prune + dependency-cruiser
- Vitest (unit/component) + React Testing Library
- Playwright (E2E + @axe-core/playwright for a11y)
- Lighthouse CI (lhci)
- @next/bundle-analyzer
- Sentry (server & client) with sourcemaps
- Web Vitals logging
- Release-please (semantic versioning)
- GitHub Actions workflows for PR and main
- Vercel preview checks in CI
- (Optional) PostHog if analytics desired; wire as a feature flag.

==============================================================================
PHASE 0 — DISCOVERY & BASELINE (open PR: milestone(0): baseline-report)

1) Inventory repo & env:
   - Parse package.json, next.config.ts, tsconfig.json, eslint config, playwright/vitest configs, vercel.json, docs/.
   - Record Node & pnpm/npm engine; if absent, set Node 22.x in `.nvmrc` and package.json `engines.node`.
2) Baseline measurements (run locally or in CI preview if available):
   - `tsc --noEmit`, `eslint .`, `vitest --coverage`, build size via Next + bundle analyzer, `ts-prune`, `depcruise`, Lighthouse (Home + Projects) desktop/mobile, axe on key routes, Web Vitals (if available).
3) Create `REPORT_BASELINE.md` with metrics tables, and commit on a new branch.
4) Open PR milestone(0). No app changes; just visibility.

Acceptance:

- Baseline report attached.
- No broken builds.

==============================================================================
PHASE 1 — TYPESCRIPT STRICTNESS & STYLE (PR: milestone(1): ts+lint-hardening)
A) tsconfig.json — set strict posture (merge if exists):

- "strict": true,
- "noUncheckedIndexedAccess": true,
- "exactOptionalPropertyTypes": true,
- "noImplicitOverride": true,
- "noPropertyAccessFromIndexSignature": true,
- "moduleResolution": "Bundler",
- baseUrl + paths { "@/*": ["src/*"] } if using src.

B) ESLint/Prettier:

- Add eslint plugins: @typescript-eslint, jsx-a11y, import, unused-imports, next core rules.
- Rules (error-level):
  - no-explicit-any, consistent-type-imports, unused-imports/no-unused-imports, import/order (grouped + newlines), @next/next/no-img-element, jsx-a11y recommended.
- Add `.editorconfig` to unify line endings, charset, final newline.

C) Auto-fix and refactor:

- Organize imports, remove unused vars/exports, enforce consistent naming (PascalCase components, kebab-case route segments).
- Convert stray `any` → `unknown` or explicit types.

D) CI gates:

- Add `npm run typecheck`, `npm run lint` to workflows; fail on warnings/errors.

Acceptance:

- `tsc` clean; ESLint zero errors; style consistent repo-wide.

==============================================================================
PHASE 2 — DEAD CODE & MODULE BOUNDARIES (PR: milestone(2): dead-code-sweep)

- Add `ts-prune` and `dependency-cruiser` configs.
- Run and remove/inline unused exports, unreachable pages/components.
- Introduce a simple layering rule with dep-cruise (e.g., components → lib only; no circular deps).
- Commit sweep with before/after bundle size delta.

Acceptance:

- ts-prune and dep-cruise integrated + scripted in package.json.
- CI fails if new dead code appears.

==============================================================================
PHASE 3 — NEXT ROUTING & RESILIENCE (PR: milestone(3): routes+errors)

- Ensure App Router structure is consistent. For significant route segments:
  - Add `error.tsx` and `loading.tsx`.
  - Prefer Server Components; mark minimal client islands with `use client`.
  - Set revalidate/static hints (`export const revalidate = N`, `dynamic = 'force-static'` when content is static).
- Centralize fetch helpers with stable cache keys; short TTL for rarely changing data.
- Add top-level error boundary to log to Sentry (next step wires Sentry).

Acceptance:

- Explicit error/loading boundaries present.
- Segment configs intentional (static vs dynamic).

==============================================================================
PHASE 4 — SECURITY HARDENING (PR: milestone(4): security-headers+csp)

- Add strict security headers via `next.config.ts` (or `vercel.json` if preferred):
  - Content-Security-Policy (default-src 'self'; strict script-src with 'strict-dynamic'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; connect/img/style/font-src minimal).
  - Strict-Transport-Security (1yr, includeSubDomains, preload)
  - X-Content-Type-Options nosniff
  - Referrer-Policy strict-origin-when-cross-origin
  - Permissions-Policy disabling camera/mic/geolocation by default.
- Adjust CSP for any required third-party (images, fonts) using nonces or hashes as needed. Replace inline scripts.
- Verify no secrets in repo; enable GH secret scanning & Dependabot alerts; add `npm audit` high/critical fail step.

Acceptance:

- Pages render with CSP enforced; no blocked critical assets.
- Security headers verified in response.
- CI contains audit step.

==============================================================================
PHASE 5 — PERFORMANCE (PR: milestone(5): perf-budgets+assets)

- Fonts: use `next/font` with `display: 'swap'`.
- Images: replace `<img>` with `next/image`; add `sizes`, use `priority` only for above-the-fold hero; convert large assets to AVIF/WEBP; check `/public` and optimize.
- Code-splitting: dynamic imports for non-critical components; avoid `ssr:false` unless strictly necessary.
- Add @next/bundle-analyzer; commit analyzer script and CI artifact upload.
- Set bundle size budgets (e.g., initial client < 250KB gz); fail CI if exceeded.

Acceptance:

- Lighthouse Perf ≥ 90 on Home & Projects (desktop/mobile) in preview.
- Bundle under budgets; analyzer artifacts in PR.

==============================================================================
PHASE 6 — ACCESSIBILITY (PR: milestone(6): a11y-access+keyboard)

- Add skip-to-content link early in `body`.
- Ensure all interactive elements are semantic (`<button>`, `<a>`, labels).
- Visible focus states across controls; respect `prefers-reduced-motion`.
- Add Playwright + `@axe-core/playwright` scans on main routes; fail CI on violations of critical rules.
- Verify chat launcher “Open Chat” is keyboard reachable + labelled; ensure focus trap when modal is open.

Acceptance:

- Axe clean (no serious/critical).
- Keyboard-only nav works in CI e2e.

==============================================================================
PHASE 7 — SEO / SMO (PR: milestone(7): seo-structured-data)

- Add/verify `robots.txt` and `sitemap.xml` (Next SSG util).
- Per-route metadata with `generateMetadata`: titles, descriptions, canonical.
- JSON-LD: `Person`, `WebSite`, `BreadcrumbList` (and `SoftwareSourceCode` for project pages if applicable).
- OG/Twitter images: default and per-route (optionally add an OG image generation route).
- Verify links use `rel="noopener noreferrer"` for external.

Acceptance:

- Lighthouse SEO ≥ 95; rich results test OK.

==============================================================================
PHASE 8 — TESTING (PR: milestone(8): unit+e2e+a11y+lighthouse)

- Vitest: set coverage gates: lines 95%, branches 90%, statements 95%.
- Add representative unit/component tests for lib and core UI atoms.
- Playwright E2E on Preview URL:
  - Smoke: navigation; chat open/close (focus trap); resume download (Content-Disposition set); contact form happy path (mock email); projects tiles/links; 404 page.
  - Mobile + desktop projects.
- Lighthouse CI against preview URLs; budget thresholds Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95.

Acceptance:

- CI runs unit+e2e+a11y+lhci on PRs; failures block merge.

==============================================================================
PHASE 9 — CI/CD (PR: milestone(9): gh-actions+vercel-gates)

- Add `.github/workflows/ci.yml` (PRs):
  1) setup Node 22, install, cache deps
  2) typecheck, lint
  3) unit tests w/coverage (upload lcov)
  4) build
  5) bundle analyzer (upload artifact)
  6) deploy preview to Vercel (or wait for Vercel’s integration check)
  7) run Playwright against preview
  8) run Lighthouse CI against preview
  9) ts-prune & dep-cruise (fail if issues)
  10) npm audit (fail on high/critical)
- Add `.github/workflows/release.yml` (on main): build, upload sourcemaps to Sentry, release-please tag.

Acceptance:

- Every PR shows green checks only if all gates pass.
- Main auto-releases with semver tags when changes land.

==============================================================================
PHASE 10 — MONITORING & ANALYTICS (PR: milestone(10): sentry+vitals)

- Integrate Sentry (server+client) with DSN via env; upload sourcemaps on build.
- Add Web Vitals logging (LCP, CLS, INP) to console and/or an analytics endpoint (feature-flag gate).
- Create `src/app/error.tsx` to capture and show friendly errors; ensure server error logging.

Acceptance:

- Test exception visible in Sentry on preview; sourcemaps resolve.

==============================================================================
PHASE 11 — PRIVACY, CONTACT, & PII (PR: milestone(11): pii-controls)

- Create `src/lib/env.ts` (zod) to validate env vars on boot; crash fast if invalid.
- Contact route (if present): add server-side honeypot + rate limiting; redact PII in logs; enforce short TTL for stored submissions (≤ 7 days). Do NOT store chat free-text beyond minimal operational need.
- Email sending: ensure SPF/DKIM/DMARC alignment (doc in README). If using Resend/Sendgrid, use domain-verified sender.
- Add/update Privacy Policy to explicitly cover retention windows and user rights (access, correction, deletion process).

Acceptance:

- API route protected; basic spam defended; TTL documented and tested.

==============================================================================
PHASE 12 — SEO/CONTENT CLEANUP & PUBLISH (PR: milestone(12): final-polish)

- 404 / 500 custom pages with helpful links.
- Normalize CTA copy and button tiers (primary/secondary).
- Ensure legal pages linked in footer; external links hardened.
- Final Lighthouse/axe runs and artifacts.
- Update README badges (CI, coverage, Lighthouse).

Acceptance:

- All budgets met; docs updated; ready to merge and tag.

==============================================================================
CROSS-CUTTING DELIVERABLES (ADD IN FIRST RELEVANT PR)

- `.editorconfig`, `CODEOWNERS`, `CONTRIBUTING.md`, `SECURITY.md`
- Issue templates (bug/feature/chore) + PR template
- `DOC.md`: architecture, routes, data flow, testing, deploy, analytics
- `TODO.md`: backlog grouped by area; everything not automated becomes an issue with labels.
- `REPORT_BASELINE.md` and `REPORT_FINAL.md` with metric diffs.
- `scripts/`:
  - `analyze:bundle` → bundle analyzer
  - `test:unit` `test:e2e` `test:a11y`
  - `perf:lhci`
  - `code:prune` (ts-prune) / `code:deps` (dep-cruise)
  - `typecheck` / `lint` / `format`

==============================================================================
CONFIG SNIPPETS TO APPLY (ADAPT IF FILES EXIST)

1) next.config.ts (security headers)

- Add async headers() returning: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Ensure CSP allows only required sources; no inline without nonce/hash.

2) tsconfig.json (strict)

- Add: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride, noPropertyAccessFromIndexSignature, baseUrl/paths.

3) eslint config

- Plugins: @typescript-eslint, jsx-a11y, import, unused-imports, next
- Rules: no-explicit-any, consistent-type-imports, unused-imports/no-unused-imports, import/order, @next/next/no-img-element, jsx-a11y/recommended.

4) vitest.config.ts

- jsdom env, setup file, coverage gates: lines 95, branches 90, functions 95, statements 95.

5) playwright.config.ts

- `use.baseURL` fed by PREVIEW URL; projects for desktop+mobile; traces on-first-retry.

6) Lighthouse CI

- `lighthouserc.json` with tested routes; assert perf≥90, a11y≥95, best-practices≥95.

7) ts-prune & dependency-cruiser

- Add configs, NPM scripts, and CI steps to fail on dead code or forbidden deps.

8) Sentry

- SDK init in `src/sentry.*` (client+server), sourcemap upload in CI.

9) SEO

- Per-route `generateMetadata`; OG image assets; JSON-LD injection util; robots/sitemap.

10) Vercel

- If using `vercel.json` for headers, sync with next.config.ts to avoid duplication.

==============================================================================
CI GATES (REQUIRED)

- typecheck, lint → fail on any error
- vitest (coverage thresholds)
- build
- bundle analyzer (budget fail if exceeded)
- deploy preview
- playwright e2e + axe
- lighthouse ci
- ts-prune & dep-cruise (fail on issues)
- npm audit (fail on high/critical)
- (on main) release-please + sentry sourcemaps

==============================================================================
ACCEPTANCE CRITERIA (FINAL)

- Zero type/lint errors; strict TS enabled.
- Axe critical/serious violations: 0.
- Lighthouse: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95 across key routes.
- Bundle: initial client under target budget (≤ 250KB gz; adjust if justified).
- CSP + security headers active; no broken assets.
- Contact/PII controls implemented; retention ≤ 7 days; docs reflect policy.
- Sentry receiving mapped stack traces; Web Vitals logged.
- README, DOC.md, TODO.md, SECURITY.md, CONTRIBUTING.md up to date.
- CI fully green; main tagged with release-please.

==============================================================================
BEHAVIORAL CONTRACT

- Do not ask for clarifications; infer from repo. If a block is truly hard, open an issue with a recommended default and proceed with that default in the same PR.
- Prefer additive diffs over disruptive rewrites. Where rewrites are beneficial (e.g., image optimization, metadata), keep commits atomic with clear messages and tests.
- Keep runs idempotent. If config/files already exist, merge safely.
- Provide clear commit messages, e.g.:
  - feat(seo): add JSON-LD (Person/WebSite) and per-route OG images
  - chore(ci): add lighthouse ci with budgets (perf≥90 a11y≥95)
  - perf(images): convert hero assets to AVIF and tune sizes/priority
  - fix(a11y): add skip link and focus-visible states
  - feat(security): enforce CSP/HSTS/Permissions-Policy
  - test(e2e): playwright smoke + axe scans on preview
- On completion, produce `REPORT_FINAL.md` comparing baseline vs final and link to passing production deploy.

BEGIN EXECUTION.
