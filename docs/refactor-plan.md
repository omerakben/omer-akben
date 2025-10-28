# `/lib` Refactor Plan

## Baseline Snapshot
- **Package manager:** npm (lockfile detected).
- **Baseline build:** `npm run build` fails due to missing Resend API key during `/api/tools/collect-contact` page data collection. Logged for future gating.
- **Key references reviewed:** `src/lib/lib.md`, `src/lib/TODO.md`, `src/lib/DOC.md`, root `AGENTS.md`.

## Current `src/lib` Topology
```text
src/lib
├── agent-tools/ (legacy tool schemas + tests)
├── cache/ (OpenAI cache tests + impl)
├── email/ (send-zoom-link + validation)
├── mastra/
│   ├── agents/ (coordinator + specialists)
│   ├── memory/ (episodic + semantic + checkpointer)
│   └── workflows/ (workflow executor + definitions)
├── memory/ (fact extractor + semantic helpers)
├── redis/ (client, embeddings, vector search)
├── rate-limit.ts (current RL helpers)
├── log.ts, utils.ts, constants.ts, etc.
└── docs (`DOC.md`, `TODO.md`, `lib.md`)
```

### Mapping to `DOC.md` Files-to-Change
| Area | Existing Assets | Target Updates |
| --- | --- | --- |
| Schemas | `agent-tools/schemas.ts`, `agent-tools/navigation-schema.ts` | Migrate into new `tools/zod-schemas.ts`, keep re-export shim. |
| Tools Registry | `mastra/tools.ts`, HTTP `/api/tools/*` routes | Replace with `tools/index.ts` + `tools/implementations/*`, update agents to import directly. |
| Agents | `mastra/agents/coordinator.ts` | Swap regex classifier for structured output + integrate tool registry + streaming. |
| Workflows | `mastra/workflows/workflow-executor.ts` | Convert to async generator streaming; update consumers. |
| Embeddings | `redis/embeddings.ts`, `mastra/memory/episodic.ts` | Route through new `ai/embeddings.ts`; document 1536 dim. |
| Cache | `cache/openai-cache.ts` (+ tests) | Add model/version keying + counters. |
| Rate Limit | `rate-limit.ts`, middleware/proxy gap | Introduce root `proxy.ts`, adjust RL helpers. |
| Observability | (missing dedicated infra) | Add `instrumentation.ts` + `infra/observability.ts` with OTel spans. |
| Email | `email/send-zoom-link.ts`, etc. | Add domain verification guards + webhook route. |
| Docs | `DOC.md`, `docs/architecture-overview.md` | Author `docs/architecture.md` + update references. |

## Task Graph & Suggested Boundaries
1. **Tools Migration (in-process tools + schemas).**
   - Create `tools/zod-schemas.ts`, implement tool modules, central registry, update agents/workflows to consume.
   - Add targeted unit tests for schemas + registry wiring.
2. **Foundations (Zod v4, embeddings wrapper, cache upgrades).**
   - Ensure dependency alignment, create `src/lib/ai/embeddings.ts`, refactor cache keying & metrics.
3. **Coordinator & Streaming.**
   - Replace intent classifier with structured output; refactor workflow executor to async generator & integrate streaming helper; update chat route glue if required.
4. **Infrastructure: Rate Limiting & Observability.**
   - Introduce `proxy.ts`, refactor `rate-limit.ts`, add OTel instrumentation + observability helpers.
5. **Email & Security Hardening.**
   - Add domain verification checks, webhook route, ensure CSP/security headers adjustments.
6. **Docs & Testing Enhancements.**
   - Update `docs/architecture.md`, add perf benchmarks/tests (cache p95, RL key tests, streaming order), ensure E2E adjustments.

Each numbered item represents a review-friendly commit group within the single PR, executed sequentially to maintain stability.

## Immediate Next Step
Proceed with **Tools Migration** tasks (Task Group 1) in alignment with kickoff instructions, while tracking build failure (Resend key) for follow-up gating.
