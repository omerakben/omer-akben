---
title: Maintenance Plan
description: Cadenced maintenance plan keeping the portfolio repo, dependencies, docs, and project data fresh and production-ready.
date: 2026-04-14
status: active
tags: [operations, maintenance, dependencies, cadence, release]
---

# Maintenance Plan

Living plan for keeping `omerakben/omer-akben` (https://omerakben.com) continuously
healthy in production. Pairs with `docs/operations/runbook.md` (incident response)
and `.github/dependabot.yml` (automation).

---

## 1. Current Snapshot (2026-04-14)

| Area | Signal | Notes |
| --- | --- | --- |
| Branch model | `main` (prod) ← `pre-deployment` (staging) ← `feature/*` | Auto-merge on 6 green gates. |
| Quality gates | ESLint, TSC, Vitest, Build, size-limit, Playwright | Enforced via `.github/workflows/pre-deployment-to-main.yml`. |
| Node runtime | `20` hardcoded in both CI workflows | No `.nvmrc` — see §5 hygiene. |
| Dependabot | Weekly (Mon), grouped: ai-sdk, mastra, radix-ui, testing, sentry | Limit 10 open PRs. |
| Open Dependabot PRs | **11** (next, ai-sdk group, mastra group, sentry group, testing group, openai, lucide-react, resend, posthog-js, posthog-node, simple-icons) | Needs triage — see §3.1. |
| Recent security work | Wave 1 & 2 CVE remediation (Mar 2026) | No critical/high advisories outstanding at last audit. |
| Last metrics refresh | Tuel/Elon AI platform metrics (Mar 22, 2026) | Source of truth: `@/data/projects`. |
| Docs changelog | Last entry 2025-11-02 (v2.0.0) | 5+ months stale — see §3.4. |
| Doc drift | Test count drift corrected to `815/815` across README/CLAUDE.md/AGENTS.md; tool count reconciled to 12 | Resolved 2026-04-14 in this branch. |

External canonical sources to sync from (monthly):

- https://tuel.ai/ — Tuel / Elon AI platform (production metrics, feature status)
- https://scribex-tuel-ai.vercel.app/ — ScribeX demo
- https://opus-nx.vercel.app/ + https://github.com/omerakben/opus-nx — Opus NX
- https://github.com/omerakben?tab=repositories — featured repo set

---

## 2. Objectives

1. Keep dependency lag ≤ 2 weeks for patch/minor, ≤ 1 quarter for major.
2. Keep CVE exposure at zero critical/high at all times.
3. Keep project facts (`@/data/projects`, metrics, screenshots) aligned with live
   external sources (tuel.ai, opus-nx, GitHub activity).
4. Keep docs (`README.md`, `CLAUDE.md`, `AGENTS.md`, `docs/CHANGELOG.md`) matching
   reality (tool count, test counts, bundle budget, deployment state).
5. Keep perf budgets (`.size-limit.cjs`) enforced; no silent regressions.

---

## 3. Cadence

### 3.1 Weekly — Dependency Triage (every Monday)

Trigger: Dependabot opens PRs each Monday; also addresses carry-over backlog.

Checklist (per PR):

1. Read release notes / diff summary.
2. If patch or minor in a grouped PR (ai-sdk, mastra, radix-ui, testing, sentry):
   - Run `pnpm install --frozen-lockfile` locally on a throwaway branch.
   - Run `pnpm run lint && pnpm exec tsc --noEmit && pnpm test -- --run && pnpm run build && pnpm run size`.
   - If green → approve and let auto-merge handle it.
3. If major version (e.g. `lucide-react 0.x → 1.0`, any framework major):
   - Open a dedicated tracking issue with breaking-change notes.
   - Do **not** merge until §3.3 Quarterly major-upgrade slot or a targeted
     feature branch.
4. If a PR sits > 10 days open: either merge or close with rationale. No stale
   backlog.

Batch script:

```bash
# Safe baseline before merging any PR
pnpm run lint \
  && pnpm exec tsc --noEmit \
  && pnpm test -- --run \
  && pnpm run build \
  && pnpm run size \
  && pnpm run test:e2e
```

Currently open (2026-04-14) — proposed disposition:

| PR | Type | Action |
| --- | --- | --- |
| #113 next 16.2.1→16.2.3 | minor | Merge this week after gates. |
| #101 ai-sdk group (4 updates) | grouped | Merge this week. |
| #99 mastra group (3 updates) | grouped | Merge this week — watch streaming regression (`maxSteps:1` rule, CLAUDE.md §Mastra). |
| #102 @sentry/nextjs 10.45→10.46 | patch | Merge. |
| #114 testing group (3 dev-dep updates) | grouped | Merge. |
| #106 openai 6.32→6.33 | patch | Merge. |
| #110 resend 6.9.4→6.10 | minor | Merge. |
| #108 simple-icons 16.12→16.15 | minor | Merge (icon manifest unaffected). |
| #111 posthog-js 1.363→1.364 | patch | Merge. |
| #112 posthog-node 5.28.5→5.28.11 | patch | Merge. |
| #104 lucide-react 0.577→1.7 | **major** | Defer to quarterly upgrade slot; open tracking issue. |

### 3.2 Monthly — Health + Data Refresh (1st Monday)

1. **Security audit**
   - `pnpm audit --prod`; reconcile any new advisories.
   - Review GitHub security tab and Dependabot alerts.
2. **Project data sync** (source → `@/data/projects`, `@/data/facts`)
   - Pull latest production metrics from https://tuel.ai/ and
     https://scribex-tuel-ai.vercel.app/ (visitors, models, conversion — whatever
     is surfaced publicly). Reuse the pattern from `b12259c` and `2a77f20`.
   - Refresh Opus NX status from https://opus-nx.vercel.app/ and
     `omerakben/opus-nx` README.
   - Re-shoot hero screenshots only if the live UI has changed materially.
3. **Doc truth-check** (do these three in one PR)
   - `CLAUDE.md` — tool count, test counts, bundle size, recent-updates list.
   - `README.md` — production status block.
   - `docs/CHANGELOG.md` — add an entry per meaningful production release.
4. **Perf spot-check**
   - `pnpm run analyze` and diff against previous bundle snapshot.
   - Lighthouse run on home + one featured project page.

### 3.3 Quarterly — Major Upgrades + Cleanup

1. **Major version upgrade slot** (one long-lived branch at a time):
   - Next.js, React, Tailwind, Vercel AI SDK, Mastra, lucide-react (0→1), zod.
   - Must land with all 6 gates plus a manual pass on 8 brightness modes and the
     Ozzy sidebar streaming flow.
2. **Branch hygiene**
   - Delete merged `feature/*` and `dependabot/*` branches older than 30 days.
   - Archive or close `claude/*` / `codex/*` experiment branches.
3. **Workflow audit**
   - Bump pinned action versions (`actions/checkout`, `actions/setup-node`,
     `pnpm/action-setup`, `actions/upload-artifact`) to latest stable majors.
   - Evaluate raising CI Node from `20` to the next LTS when it is ≥ 6 months old.
4. **Size budgets**
   - Revisit `.size-limit.cjs` thresholds; tighten if headroom > 20%.

### 3.4 Ad-hoc — Event-driven

- New CVE (critical/high) → ship within 48h on a dedicated branch; backport
  to `main` via the normal flow.
- Vercel/Upstash/Resend incident → document in `docs/operations/runbook.md`.
- External project (tuel.ai / opus-nx) ships a headline feature → mid-cycle
  data refresh instead of waiting for month boundary.

---

## 4. Automation Inventory

| Automation | File | Cadence |
| --- | --- | --- |
| Dependency PRs | `.github/dependabot.yml` | Weekly (Mon) |
| Quality gates on PR/push | `.github/workflows/quality-gates.yml` | On every PR/push |
| Pre-deployment → main auto-merge | `.github/workflows/pre-deployment-to-main.yml` | On push to `pre-deployment` |
| Claude Code review | `.github/workflows/claude-code-review.yml`, `.github/workflows/claude.yml` | On PR events |

Gaps to consider adding (not implemented; evaluate in next quarterly slot):

- Scheduled `pnpm audit` run (cron) that opens an issue on new advisories.
- Lighthouse CI on `pre-deployment` for perf regression gating.
- `actions-upgrader` or Dependabot for GitHub Actions ecosystem.

---

## 5. Hygiene Debt (small, actionable)

Track as individual issues; no single item blocks shipping.

- [x] Add `.nvmrc` = `20` (matches CI) — done 2026-04-14.
- [x] Reconcile CLAUDE.md / README.md / AGENTS.md tool count and test count (815/815, 54 files, 12 tools) — done 2026-04-14.
- [x] Add `github-actions` ecosystem to `.github/dependabot.yml` — done 2026-04-14.
- [x] Promote `docs/operations/maintenance-plan.md` from `docs/operations/index.md` — done 2026-04-13.
- [ ] Add a monthly "release" entry convention to `docs/CHANGELOG.md` even when
      changes are small — prevents the current 5-month gap recurring.

---

## 6. Known Blockers

### 6.1 Dependabot PRs cannot pass Quality Gates (CI secrets)

**Observed 2026-04-14.** All 11 open Dependabot PRs (#99, #101, #102, #104,
#106, #108, #110, #111, #112, #113, #114) show identical failure shape:

| Check | Conclusion |
| --- | --- |
| Vercel Preview Comments | ✅ success |
| Quality Checks & Build (`quality-gates.yml`) | ❌ failure |
| claude-review (`claude-code-review.yml`) | ❌ failure |
| E2E Tests (Playwright) | ⏭ skipped (depends on Quality Checks build artifact) |

**Root cause.** `.github/workflows/quality-gates.yml` starts with a "Verify
environment variables" step that hard-exits on empty `UPSTASH_REDIS_REST_URL`.
Since 2021 GitHub's default policy hides repository `secrets.*` from
Dependabot-triggered `pull_request` runs, so every secret-consuming step fails
before `pnpm test` / `pnpm build` even start. Same reason `claude-review`
fails: `CLAUDE_CODE_OAUTH_TOKEN` is unset for Dependabot.

This blocks auto-merge for the entire backlog. The `next 16.2.1 → 16.2.3`
bump (PR #113) closes the Next.js HIGH CVE and the mastra grouped PR (#99)
closes hono / picomatch / path-to-regexp — both are security-material and
currently stuck behind this blocker.

**Remediation options (one of):**

1. **Dependabot secrets (recommended, least workflow churn).** Settings →
   Secrets and variables → Dependabot → add the 8 required secrets there too
   (`XAI_API_KEY`, `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`,
   `UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_VECTOR_REST_URL`,
   `UPSTASH_VECTOR_REST_TOKEN`, `RESEND_API_KEY`, `CLAUDE_CODE_OAUTH_TOKEN`).
   After this, simply re-run the failing workflows and auto-merge resumes.
2. **Switch to `pull_request_target` with an allow-list.** Safe for Dependabot
   only because PRs come from the same repo; still requires careful review of
   any code that executes from the PR head (we do `pnpm install` with a
   `frozen-lockfile`, so the lockfile change is the only untrusted input).
3. **Downgrade the Verify step to a soft check** in Dependabot context — skip
   secret-dependent gates and require them only on direct pushes to
   `pre-deployment` / `main`. Simplest code change, weakest guarantee.

This blocker is out of scope for automated agent work (GitHub Settings UI
change) — surface in the weekly standup; one-shot fix then resume normal
triage flow.

---

## 7. Exit Criteria per Cycle

A cycle is "done" when:

- Weekly: 0 open Dependabot PRs older than 10 days.
- Monthly: `pnpm audit --prod` reports 0 critical/high; doc truth-check PR merged.
- Quarterly: all merged branches cleaned up; at most 1 active major-upgrade branch.

---

## 8. Ownership

Solo maintainer (Omer). All cadenced work is opened as PRs against
`pre-deployment` so the standard auto-merge pipeline enforces gates — no direct
pushes to `main`.
