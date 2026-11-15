# Local website maintenance — 2026-11-15

Branch: feature/security-and-site-maintenance, based on origin/pre-deployment b55e33d (same tree as main40feb5d). No push, merge or deployment performed.

## Security outcome

Registry audit fell from 61 findings (1 critical, 15 high, 36 moderate, 9 low) to 1 low, with no ignored advisories. Production-only audit has the same residual. Dependency count fell from 1202 to 1047 in audit metadata. Audit is not an exploitability proof.

Residual: deepmerge: deepmerge mergeObject() allows prototype poisoning of returned objects (https://github.com/advisories/GHSA-gcqx-w48m-w2h4)

No patched deepmerge version is available. It arrives through React Email's html-to-text; current email code calls render without plainText and does not exercise that options-merging path. Keep tracked; do not claim zero vulnerabilities.

Updates include Next 16.4.5 and matching analyzer/lint config, DOMPurify 3.4.18, Zod 4.6.7, Vite 8.3.7, Vitest 4.1.12, Mastra core 1.83.0/memory 1.41.1/AI adapter 1.11.2, React Email render 2.1.0, and targeted transitive patches. Current upstream advisories required newer versions than several pending PRs.

Removed @size-limit/preset-app in favor of @size-limit/file. All five existing byte budgets are unchanged. This removes the unnecessary browser-download dependency chain and its unpatched extract-zip issues; unbudgeted execution-time output is no longer produced. No page performance gain is claimed.

## Open PR disposition

| PR | Local disposition |
|---|---|
|179 DOMPurify|Covered by newer3.4.18 fix; proposed 3.4.17 is insufficient for latest advisory|
|180 Zod|Covered by patched 4.6.7|
|164 older Zod|Superseded by180 and local fix|
|172 Next|Proposed16.3.3 already behind base; local16.4.5 addresses newer advisories|
|165 Vite|Proposed8.2.2 already behind base override; local8.3.7 addresses newer advisory|
|160 Mastra|Same-major update applied and tested locally|
|167 React Email render|2.1.0 applied to satisfy updated dependency peer|
|173 testing group|Security-relevant Vitest 4 patch applied; major toolchain migration deferred|
|159 AI SDK group|Major AI6-to 7 migration deferred; vulnerable nested SDK paths removed by Mastra update|
|178 demo/chat fixes|Integrated and extended with reduced-motion behavior|
|174 title|Integrated|
|168 tailwind-merge, 166 Resend, 163 PostHog, 161 Radix|Non-security upgrades reviewed at inventory level, left for a separate compatibility change|

No GitHub PR was modified, closed, merged or commented on.

## Review decisions

Independent plan review: accepted pinned pnpm10, identical base trees, real test counts, production auto-merge awareness, and live-service validation limits. Suggested matching CI Node 22; unavailable locally, so retained installed Node 26 and explicitly report mismatch. No global install.

Security reviewer recommended DOMPurify 3.4.18/Next 16.4.5 beyond existing PR versions, scoped overrides and removal of unused size-time tooling: accepted. Vite 8.2.5 suggested by advisory was unavailable in npm; used published patched 8.3.7 instead. Rejected blanket major overrides and a fake deepmerge replacement.

Independent final code review found no actionable defects. Mastra's installed declarations remain compatible, but mocked responses cannot validate live provider/tool streaming.

## Verification

821 unit tests passed across 69 files. Production build and all five byte budgets passed. Final lint/types/browser outcomes in modern-web-guidance-results.md. Node 26.13.0 differs from CI Node 22.22.0. Real AI, Redis and email unverified; no real keys loaded. Build/browser processes used explicit local-test-placeholder values, with Redis/vector pointed at loopback.

The build first exposed import-time OpenAI construction in text-editor; now valid requests without a key return503 and invalid requests400. Other application configuration still requires service variables; this change does not make the entire site configuration-free.

## Sources

- [DOMPurify 3.4.18](https://github.com/cure53/DOMPurify/releases/tag/3.4.18)
- [Next 16.4.5](https://github.com/vercel/next.js/releases/tag/v16.4.5)
- [Vite security advisory](https://github.com/vitejs/vite/security/advisories/GHSA-p4f5-76q4-ffq7)
- [Size Limit plugin documentation](https://github.com/ai/size-limit#plugins-and-presets)

Merging into pre-deployment can automatically update main and deploy production. Approval for that action must account for the deployment consequence.

Final browser result: 115 passed, 12 pre-existing explicit/conditional skips. All six local quality gates passed. No live-service or Node22 CI claim.

Local commit attempt failed in the configured 1Password signer: "failed to fill whole buffer". No commit was created. All changes remain staged on the local feature branch; signing configuration was not bypassed.
