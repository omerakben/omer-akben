# `/lib` Refactor Plan

## Task Graph Overview

- **Foundation & Typing**
  - Upgrade validation layer to Zod v4 throughout tools and agents.
  - Establish shared schema library in `src/lib/tools/zod-schemas.ts`.
- **Tooling Rework**
  - Port HTTP-based tools into in-process AI SDK v5 implementations.
  - Expose registry through `src/lib/tools/index.ts` for agents and workflows.
- **Routing & Streaming**
  - Replace regex intent router with structured classification in `mastra/agents/coordinator.ts`.
  - Refactor `mastra/workflows/workflow-executor.ts` into an async generator feeding streaming helpers under `src/lib/ai`.
- **Infrastructure Enhancements**
  - Consolidate embeddings through `src/lib/ai/embeddings.ts` with retries, observability, and Upstash Vector constraints.
  - Version-aware caching in `src/lib/cache/openai-cache.ts` and namespace separation in Redis/Vector helpers.
  - Centralize rate limiting via root `proxy.ts` backed by helpers in `src/lib/upstash` and `src/lib/rate-limit.ts`.
- **Observability & Email**
  - Initialize OpenTelemetry (`instrumentation.ts`, `src/lib/infra/observability.ts`).
  - Harden email flows (`src/lib/email/**`, `/api/resend/webhook/route.ts`) with SPF/DKIM gates and event logging.
- **Docs & Tests**
  - Document architecture changes in `docs/architecture.md` and update references in `DOC.md`.
  - Add targeted unit tests (schemas, classifier, streaming order, rate limit identifiers, cache metrics).

## PR Boundaries & Sequencing

1. **Schema & Tool Foundation**
   - Files: `src/lib/tools/**`, `src/lib/agent-tools/**` (migration layer), related tests.
   - Risk: Type mismatches; mitigate with incremental exports and tests.
   - Tests: `npm test`, targeted schema suites.
2. **Coordinator & Streaming Pipeline**
   - Files: `src/lib/mastra/agents/coordinator.ts`, `src/lib/mastra/workflows/workflow-executor.ts`, `src/lib/ai/streaming.ts`, chat route glue.
   - Risk: Breaking SSE contract; verify with local smoke via `npm run dev` and streaming unit tests.
3. **Embeddings, Cache, Memory**
   - Files: `src/lib/ai/embeddings.ts`, `src/lib/cache/openai-cache.ts`, `src/lib/redis/**`, `src/lib/memory/**`.
   - Risk: Cache invalidation; cover with metrics tests and integration harness.
4. **Rate Limiting & Proxy**
   - Files: `proxy.ts`, `src/lib/rate-limit.ts`, new `src/lib/upstash/**`, affected routes.
   - Risk: Request blocking; include bench tests for RL identifier formatting.
5. **Observability & Email**
   - Files: `instrumentation.ts`, `src/lib/infra/observability.ts`, `src/lib/email/**`, `/api/resend/webhook/route.ts`.
   - Risk: Exporter configuration; ensure defaults no-op in local dev.
6. **Docs & Final QA**
   - Files: `docs/architecture.md`, `src/lib/DOC.md`, `src/lib/TODO.md` status updates.
   - Risk: Documentation drift; review against implementation before final commit.

## Current Repository Mapping (`src/lib/**`)

- Agents & Coordinator: `src/lib/mastra/agents/*.ts`
- Workflows: `src/lib/mastra/workflows/**`
- Tools (legacy HTTP): `src/lib/mastra/tools.ts`, `src/lib/agent-tools/**`
- Memory & Cache: `src/lib/memory/**`, `src/lib/redis/**`, `src/lib/cache/**`
- Email: `src/lib/email/**`
- Rate Limiting: `src/lib/rate-limit.ts`
- Utilities & Logging: `src/lib/log.ts`, `src/lib/utils.ts`, `src/lib/constants.ts`

This plan will be refined per task group before implementation, adhering to the sequencing above.

## Current Task Group: Tools Migration

- **Scope:** `src/lib/tools/**`, `src/lib/agent-tools/**`, `src/lib/mastra/tools.ts`, unit tests under `src/lib` or `src/app/api/tools` as adapters.
- **Objectives:**
  - Establish shared Zod v4 schemas in `src/lib/tools/zod-schemas.ts` and re-export legacy entry points.
  - Implement in-process Vercel AI SDK v5 tools under `src/lib/tools/implementations/` with deterministic behavior.
  - Provide central registry via `src/lib/tools/index.ts` for coordinator/agents.
  - Update Mastra agent bindings to consume the registry directly instead of HTTP fetch helpers.
- **Risks & Mitigations:**
  - *Schema drift*: keep type exports aligned via `z.infer` and add regression tests.
  - *Runtime regressions*: maintain HTTP routes as thin proxies temporarily for external callers.
  - *Latency expectations*: ensure tools avoid network fetch when data is local (e.g., project metadata from data files).
- **Test Plan:**
  - Expand `src/lib/agent-tools/schemas.test.ts` to cover new shared schemas.
  - Add targeted unit tests for tool registry (ensures expected ids) and deterministic outputs using mocks.
  - Run `npm test` focused suites before full gate execution.
