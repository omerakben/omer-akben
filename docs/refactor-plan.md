# `/src/lib` Refactor Plan

## Scope Mapping
- **Schemas & Tools** → `src/lib/agent-tools/**`, new `src/lib/tools/**` (maps to DOC.md table rows 1-2).
- **Coordinator & Workflows** → `src/lib/mastra/agents/**`, `src/lib/mastra/workflows/**`.
- **AI Integrations** → `src/lib/ai/**` (new), `src/lib/cache/openai-cache.ts`, `src/lib/redis/**`, `src/lib/memory/**`.
- **Infrastructure** → `src/lib/rate-limit.ts`, new `proxy.ts`, `instrumentation.ts`, `src/lib/infra/observability.ts` (new).
- **Email** → `src/lib/email/**`, `/api/resend/webhook/route.ts` (new minimal glue).
- **Docs & Tests** → `docs/**`, `src/lib/**/*.test.ts`.

## Task Graph
1. **Foundational Upgrades**
   - Upgrade repo to **Zod v4** and adjust imports.
   - Create `src/lib/ai/embeddings.ts`; refactor Redis/Vector usage; update caches.
   - Output: deterministic typing baseline.
2. **Tooling Refactor** *(depends on 1)*
   - Move schemas into `src/lib/tools/zod-schemas.ts`.
   - Implement AI SDK v5 in-process tools + registry + unit tests.
   - Update agents/workflows to consume registry.
3. **Coordinator & Streaming** *(depends on 2)*
   - Structured intent classifier (Zod enum, temp 0).
   - Refactor workflow executor to async generator; integrate streaming helper + chat route glue.
4. **Infrastructure Hardening** *(parallelizable with 3 where safe)*
   - Rate limiting via `proxy.ts`; update `src/lib/rate-limit.ts` strategies.
   - OpenTelemetry instrumentation: `instrumentation.ts`, `src/lib/infra/observability.ts`, span coverage in agents/tools/memory/email.
   - Observability tests/fixtures.
5. **Email & Security Enhancements** *(depends on 4 for observability hooks)*
   - SPF/DKIM verification guard, webhook route for Resend events, redaction review.
   - Add CSP updates in `next.config.ts` if needed.
6. **Testing & Documentation Closure** *(final step)*
   - Expand unit/E2E tests (schemas, classifier determinism, streaming order, RL identifiers, cache metrics).
   - Update `docs/architecture.md`, `DOC.md` references; record perf measurements.

## Estimated PR Boundaries
- **PR 1:** Tasks 1-2 (schema/tool migration) – unlocks downstream refactors.
- **PR 2:** Tasks 3-4 (streaming + proxy/OTel) – coordinated rollout.
- **PR 3:** Tasks 5-6 (email/security/docs/tests) – finalize compliance.

> Current branch: `pre-deployment-fix-lib`. Commits will stay small (Conventional) while keeping a single PR per boundary.

## Testing Strategy
- Run quality gates after each milestone: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.
- Add focused Vitest suites for tool schemas, classifier enum output, streaming generator ordering, cache version keys, RL identifiers.
- Smoke-test chat streaming locally (`npm run dev`) verifying SSE handshake timing (<500ms first token).
- Capture OTel traces using local collector; validate span attributes (`threadId`, `agent`, `tool`, `cache_hit`).

## Risks & Mitigations
- **Zod upgrade regressions:** mitigate by updating schemas + tests first.
- **Streaming integration complexity:** develop async generator with unit tests + fallback path behind feature flag if needed.
- **Proxy rate limit conflicts:** log RL decisions, provide bypass for internal tools via env guard.
- **Observability overhead:** keep instrumentation lazy-loaded, ensure exporters configurable via env.
