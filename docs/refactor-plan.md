# `/lib` Refactor Plan

## Current `src/lib` Structure Snapshot

- agent-knowledge-base.{ts,test.ts}
- agent-tools/
  - schemas.ts
  - navigation-schema.ts
  - schemas.test.ts
- cache/
  - openai-cache.ts
  - openai-cache.test.ts
- email/
  - send-zoom-link.ts
  - templates/ZoomLinkEmail.tsx
  - validation.ts
- mastra/
  - agents/{base-agent.ts,coordinator.ts,contact-agent.ts,navigation-agent.ts,performance-agent.ts,project-agent.ts,resume-agent.ts}
  - memory/{checkpointer.ts,episodic.ts,episodic.test.ts,semantic.ts,semantic.test.ts}
  - tools.ts
  - workflows/{index.ts,types.ts,workflow-executor.ts,project-comparison.ts,project-comparison.test.ts,interview-prep.ts,interview-prep.test.ts}
- memory/{fact-extractor.ts,fact-extractor.test.ts,redis-memory.ts,semantic-memory.ts,semantic-memory.test.ts,types.ts}
- redis/{client.ts,client.test.ts,contact-storage.ts,embeddings.ts,vector-client.ts,vector-search.ts}
- rate-limit.ts
- log.ts, utils.ts, constants.ts, metadata.ts, structured-data.ts, thread-memory.{ts,test.ts}, followups.{ts,test.ts}, skill-icons.tsx, brightness-*.{ts,tsx}, animations.ts

This inventory maps directly to the File-to-Change table in `src/lib/DOC.md`. The directories slated for heavy changes are `tools`, `mastra/agents`, `mastra/workflows`, `ai` (to be created), `cache`, `redis`, `email`, and infra glue (proxy/instrumentation outside `src/lib`).

## Task Graph Overview

```text
Unify Zod v4
  └─> Tools migration
        ├─> Schema consolidation (`tools/zod-schemas.ts`)
        ├─> Tool implementations & registry
        ├─> Agent/tool integration updates
        └─> Unit tests for schemas & tools
  └─> Embeddings wrapper (`ai/embeddings.ts`)
        ├─> Redis/vector namespace updates
        └─> Cache versioning changes
  └─> Coordinator classifier refactor
Streaming workflows
  ├─> Async generator executor
  ├─> AI streaming helper & chat route glue
  └─> Workflow tests & smoke checks
Rate limiting proxy
  ├─> proxy.ts introduction
  ├─> rate-limit helpers rewrite
  └─> Route handler updates
Observability & Email
  ├─> instrumentation.ts + observability helpers
  ├─> Tool/agent span instrumentation
  └─> Resend domain checks + webhook endpoint
Security & Docs
  ├─> CSP/header updates
  ├─> DOMPurify audit
  └─> docs/architecture.md + metrics docs
```

Dependencies:
- Zod v4 unification precedes any schema/tool/agent refactors.
- Streaming executor depends on tool registry availability for step execution telemetry.
- Proxy + rate-limit refactor must precede route handler rewrites to avoid regressions.
- Observability hooks should wrap finalized tool/agent APIs.

## Proposed PR Boundaries

1. **Foundation & Schemas**: Upgrade to Zod v4, introduce `src/lib/tools/zod-schemas.ts`, update imports, add baseline tests.
2. **Tool Migration**: Implement in-process AI SDK v5 tools, create registry, refactor agents/workflows to consume them, adjust cache/embedding wrappers as needed for tool outputs.
3. **Streaming & Coordinator**: Convert workflow executor to async generator, integrate AI SDK streaming helper, implement structured intent classifier, update chat route glue, add streaming tests.
4. **Infra & Observability**: Introduce `proxy.ts`, refactor `rate-limit.ts`, add OpenTelemetry instrumentation + observability helpers, ensure spans emitted for agents/tools/memory/embeddings/email.
5. **Email & Security Enhancements**: Add Resend webhook + domain verification guard, tighten CSP/security headers, update docs (`docs/architecture.md`, metrics). Include performance benchmarks + tests for cache/versioning.

Each PR will target a discrete area, ensuring reviewable diffs and allowing sequential verification of CI gates.

## Current Batch: Foundation & Schemas

**Targets**
- Bump `zod` dependency to v4 in `package.json`/lockfile.
- Audit `import { z } from 'zod'` usages; ensure compatibility with v4 APIs.
- Create `src/lib/tools/zod-schemas.ts` consolidating existing tool schema exports from `src/lib/agent-tools`.
- Maintain backward compatibility by re-exporting from legacy modules or updating imports.
- Establish placeholder registry structure (`src/lib/tools/index.ts`) wired to schemas for next batch.

**Risks**
- Zod v4 introduces subtle `.array()` inference changes; need to check downstream generics.
- Vitest snapshot/tests may rely on error message strings from v3; update expectations if necessary.
- Circular imports if both legacy and new schema files import each other—prefer single source with explicit re-exports.

**Test Plan**
- `npm run lint`
- `npx tsc --noEmit`
- `npm test` (focus on schema/unit suites)
- `npm run build` as regression check
