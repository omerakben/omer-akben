# Website maintenance validation — 2026-11-15

Baseline: b55e33d80aad4b92fcd95f81eeee8ab4b6061e53 (pre-deployment; same tree as main 40feb5d). Local branch: feature/security-and-site-maintenance. No push, merge, deployment, external messages or real provider requests authorized for this run.

## Scope and acceptance

Security PR triage and patched dependencies first, followed by PR178 chat scrolling/demo links and PR174 title consistency. Preserve existing branding, personal facts, explicit test skips, all eight brightness modes and byte budgets. Validate keyboard/focus, fast replies, scroll overflow and reduced motion.

## Environment and guidance

macOS arm64; Node 26.13.0 through mise; pnpm 10.28.2 through npm exec. Host pnpm11 ignores package.json overrides and was not used for installation. CI specifies Node22.22.0, unavailable locally; this runtime remains unverified. No global runtime installed.

Shared skill source: 4dd968349e54ca45a05dd5c818fb035c9054b022; skill version 2026_11_09-5bcc021b; CLI 1.0.0. Queried scroll chat messages and respect reduced motion; retrieved motion. Guide requires: "Always respect reduced motion preferences." No custom browser support policy found; preserve existing fallback behavior.

## Baseline evidence

- Dependency audit: 61 findings (1 critical, 15 high, 36 moderate, 9 low); work/audit-baseline.json. Audit counts are registry reports, not verified exploitability.
- Unit tests: 816 passed across 68 files; work/tests-baseline.log.
- Code inspection: chat effect cancels its 100ms scroll on a fast response; pending follow intent is not retained.
- Default title differs from homepage role line.
- First updated production build fails at import-time OpenAI initialization in /api/text-editor without credentials; work/build-security.log. No real secrets loaded.

## Measurements

| Check | Baseline | After | Evidence |
|---|---|---|---|
| Unit tests | 816/816 | 821/821 | work/tests-*.log |
| Registry dependency findings | 61 | 1 low (final) | work/audit-*.json |
| Lint / TypeScript | not run before dependency changes | passed security phase | work/lint-security.log, work/types-security.log |
| Accessibility severity | unmeasured | zero violations in 8 route axe scans and status scan | work/e2e-final.log |
| Brightness / reduced motion | not measured | all eight modes pass with reduced motion and manual position assertions | work/e2e-final.log |
| Build / byte budgets | no clean baseline | passed, five byte budgets preserved | build and size logs |
| LCP / CLS / interaction latency | unmeasured | unmeasured | No speed claim; no matched three-run traces |

No causal claim about the skill's effect. Active implementation time was not separately measured.

## Final verification

- Full Chromium suite: 115 passed, 12 existing explicit/conditional skips, 127 discovered; no new skips. Run: PLAYWRIGHT_BROWSERS_PATH="$PWD/work/browsers" npm exec --yes --package=pnpm@10.28.2 -- pnpm test:e2e --workers=4 --reporter=line.
- Chromium151.0.7922.34, Playwright1.62.1, headless on local dev server; Desktop Chrome test viewport1280x720, no CPU/network throttling. Chat regressions use reduced motion; eight saved brightness modes verified.
- Desktop spot check1440x1000 and mobile390x844; mobile horizontal overflow false. Default document and OpenGraph titles match homepage heading. Screenshots in work/home-final.png and work/home-mobile-final.png.
- Accessibility: all8 route axe checks and status axe check passed with zero reported violations; skills contrast passes all8 modes. This is automated Chromium coverage, not a manual screen-reader audit.
- Unit tests821/821 across69 files; lint and TypeScript passed. Lint excludes only local scratch/browser downloads via --ignore-pattern work/**.
- Production build passed with explicit non-secret local-test-placeholder values; Redis/vector point to loopback. Real provider calls, email, Redis persistence and production middleware integration not verified.
- Brotli byte budgets: Homepage22.53/40kB; Skills5.4/10kB; Projects12.88/15kB; Contact6.04/10kB; shared25.77/90kB. No matched before build, so no byte/performance delta claimed.
- Browser suite initially could not launch until a project-local browser download. Next run timed out on networkidle while chat-history GET awaited placeholder Redis. Migrated remaining browser UI specs to existing deterministic chat fixture; all assertions retained. Request-only resume-download test remains unmocked and passed. This validates UI contracts, not backend services.
- Unit correction: jsdom lacked matchMedia; scoped mock plus reduced-motion assertion added, no production fallback introduced solely for tests.
- Active implementation time was not separately measured. Three validation correction rounds (import-time client, browser/service fixtures, jsdom media mock); counts describe this task, not skill causality.
- Warnings retained: existing Sentry configuration deprecations, Next image-cache warning, Vite future config-loader warning; optional dependency build scripts blocked by pnpm defaults.
- Independent agent plan and code reviews completed; no actionable final findings. Node22CI and live service compatibility remain unverified.

## 2026-11-17 — Cyber-Synth wave review (canvas loop, tabs, tokens)

Baseline: working tree on feature/ai-editor-provider-fix at ed6c397 plus the uncommitted Cyber-Synth redesign. Skill version 2026_11_09-5bcc021b (CLI reports 2026_11_10-47b4c80e available). Guides retrieved: efficient-background-processing, tabs. No custom browser support policy found.

Changes: shared `src/lib/use-canvas-loop.ts` (one rAF and one brightness MutationObserver for all canvases, loop stops off-screen / hidden tab / reduced motion, dt-based time); wave deck eases between channels and cross-fades engines instead of restarting; ARIA tabs with roving tabindex, arrow/Home/End keys and a labelled tabpanel; `--wave-crest` token; +1 `--synth-emerald` darkened; focus-visible no longer forces a 4px radius.

| Check | Baseline | After | Evidence |
|---|---|---|---|
| Lint / TypeScript | pass (reported) | pass | npm run lint, npx tsc --noEmit |
| Unit tests | 828/828 (reported) | 829/829, 70 files | npm test -- --run |
| Build / size / Playwright | pass (reported) | NOT RUN | sandbox denies the local port Turbopack needs |
| +1 emerald text on surf-0 | 4.46:1 | 6.25:1 | computed WCAG ratio |
| Light-mode wave crest vs surf-0 | 1.55–2.13:1 | uses --text-1 | computed ratio; seen in browser with injected token |
| rAF callbacks on /projects (26 canvases) | 26 per frame, always | 1 per frame, visible canvases only | code inspection; not profiled |
| LCP / CLS / interaction latency | unmeasured | unmeasured | no traces taken |

Not verified: globals.css edits in the running dev server (it kept serving a stale stylesheet), 8-mode axe/contrast E2E, mobile GPU behaviour, Safari/Firefox. `focusgroup` from the tabs guide was not used (limited availability; its fallback is a new polyfill dependency) — manual roving tabindex instead. No causal claim about the skill.

## 2026-11-17 (later) — site-wide Cyber-Synth conversion with Codex review

Scope: shared Button/Card/Badge/Input/Textarea, `--radius` tokens set to 0, floating chat and scroll-to-top keys, footer, PageHeader, gradient and pill sweep across subpages, OG images, `/chat` redirect, screenshot reveal on project cards (dynamic import), `qualityProof` floors. Codex (gpt-6.2-astra, read-only) reviewed the plan; its 8 points are in work/codex-review-2026-11-17.md and all were checked against source.

| Check | Result | Evidence |
|---|---|---|
| Lint / TypeScript | pass | npm run lint, npx tsc --noEmit |
| Unit tests | 829/829, 70 files | npm test -- --run |
| Build | 46/46 routes, with non-secret placeholder env (no Upstash vars in this shell) | npm run build |
| Size (brotli) | Home 24.29/40, Skills 5.42/10, Projects 11.13/15, Contact 6.07/10, Shared 25.77/90 kB | npm run size |
| Playwright | 115 passed, 12 skipped (unchanged skips) | npm run test:e2e --workers=4 |
| Visual | 6 full-page screenshots, modes -3, 0, +1, +2 | Playwright script, reviewed by eye |
| LCP / CLS / interaction latency | unmeasured | no traces |

Not verified: 8-mode contrast on routes other than /skills (the only route the contrast spec covers), mobile layouts, Safari/Firefox, real provider/Redis calls, OG image rendering in a share debugger. No guides beyond the earlier two were retrieved for this pass.
