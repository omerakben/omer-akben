# TODO.md — `/lib` Improvement Plan (Codex-ready)

**Owner:** Codex
**Scope:** `src/lib/**` only (don’t change app UI except where noted)
**Goal:** Production-ready agentic portfolio with low latency, typed tools, real-time streaming, consistent validation, and solid observability.

---

## 0) Versions & Dependencies (blocking)

- [ ] **Unify Zod to v4** across repo. Remove any Zod v3 imports/lockfile pins.
  - Files to touch: `package.json`, any `import { z } from 'zod'` sites.
  - Accept: `zod` is `^4.x`; no v3 transitive imports.
- [ ] **Standardize embeddings** on AI SDK v5: replace manual `openai.embeddings.create` batches with `embed()` / `embedMany()` wrappers.
  - Files: `src/lib/redis/embeddings.ts`, `src/lib/mastra/memory/episodic.ts`, `src/lib/memory/fact-extractor.ts`, `src/lib/cache/openai-cache.ts` (use the wrapper).
  - Accept: single embeddings path; all calls flow through `lib/ai/embeddings.ts` wrapper.
- [ ] Confirm **Upstash Vector** index dim = **1536** for `text-embedding-3-small` and document in code.
  - Files: Vector index management / comments wherever dimensions are declared.

---

## 1) Tools: Move to in‑process (latency & reliability)

- [ ] Create **`src/lib/tools/zod-schemas.ts`** and migrate *all* tool input/output schemas from `agent-tools/` here (re-export for backward compatibility).
- [ ] Implement **AI SDK v5 tools** in `src/lib/tools/implementations/*.ts` (one file per tool) and a central **`src/lib/tools/index.ts`** registry.
  - Replace HTTP round-trips from agents with direct imports. Keep public API routes only where needed.
  - Files to refactor away from HTTP pattern:
    - `src/lib/mastra/tools.ts` (current HTTP wrappers) → import from `lib/tools`.
    - Any `/api/tools/*/route.ts` used *only* by agents → delete or leave as thin pass-throughs.
- [ ] Normalize tool result types: use `z.infer<>` for result payloads and avoid `unknown` in agent code.
- [ ] Unit tests: add schema tests for each tool (valid/invalid, edge cases).

**Acceptance:** Agents call tools via imports; no client→API round-trip for internal work; types are inferred from Zod without casts.

---

## 2) Coordinator: Deterministic intent + routing

- [ ] Replace regex classification with **structured-output** classification (Zod enum + temperature: 0).
  - Files: `src/lib/mastra/agents/coordinator.ts` (introduce `classifyIntentLLM()`), `src/lib/mastra/agents/base-agent.ts` (shared utils if needed).
  - Accept: classifier returns one of: `resume | projects | contact | navigation | performance` deterministically.
- [ ] Add fallback: if classification confidence < threshold, ask a clarifying question.

---

## 3) Streaming Workflows (major UX fix)

- [ ] Refactor `executeWorkflowStream` to **yield real-time step events** (start/progress/complete) instead of buffering.
  - Files: `src/lib/mastra/workflows/workflow-executor.ts`, `src/lib/ai/streaming.ts` (new helper).
  - Accept: Client sees partial updates as steps complete.
- [ ] Ensure **AI SDK v5** stream conversion produces SSE chunks compatible with `useChat()`.
  - Files: Chat route handler (e.g., `src/app/api/chat/route.ts`).

---

## 4) Memory & Cache

- [ ] Introduce **`src/lib/ai/embeddings.ts`**: export `embed`, `embedMany` (AI SDK v5), retries, logging, and model constant.
- [ ] Split namespaces in Redis/Vector: ensure **project embeddings** and **episodic chat** embeddings cannot mix.
- [ ] Include `(model, version)` in cache keys; confirm cache version bump available via constant.
  - Files: `src/lib/cache/openai-cache.ts`.
- [ ] Add small benchmark in tests (cache hit/miss, lookup p95).

---

## 5) Rate limiting & request pre‑processing

- [ ] Create **`proxy.ts`** at repo root (`src/proxy.ts` if using `src/`). Move rate-limit keys and header shaping here.
  - Identifier: `ip|path|userId|uaHash`.
  - Files: new `proxy.ts`, update any `middleware.ts` references.
- [ ] Chat: **sliding window**; Tools: choose `fixed` or token bucket as appropriate.
  - Files: `src/lib/rate-limit.ts`.

**Acceptance:** All rate limiting executes before route handlers, consistent across chat/tools.

---

## 6) Observability

- [ ] Add **OpenTelemetry** instrumentation via `instrumentation.ts`.
  - Spans for: coordinator routing, each tool call, memory retrieval, embedding, email send.
  - Attributes: `threadId`, `agent`, `tool`, `model`, `latency_ms`, `cache_hit`.
- [ ] Wire exporter of your choice (Axiom, SigNoz, etc.).
- [ ] Document how to run tracing locally.

---

## 7) Email & consent (Resend)

- [ ] Verify **SPF/DKIM** for `omerakben.com` and gate production email behind that check.
- [ ] Add **webhook endpoint** for `email.sent`, `email.bounced` (log and tag).
- [ ] Keep current allowlist & PII redaction; ensure *no* secrets in client bundles.

---

## 8) Security & headers

- [ ] Add **Content-Security-Policy** in `next.config.ts` or headers config; restrict `connect-src`, `frame-ancestors`, etc.
- [ ] Audit DOMPurify usage (server vs client).

---

## 9) DX & Tests

- [ ] Add unit tests for: tool schemas, structured classifier, workflow streaming order, RL identifiers, cache versioning.
- [ ] Update E2E happy-paths for Projects/Resume/Contact flows using streaming.
- [ ] Add a short “smoke” script to embed + search projects and measure p95 (<200ms cache hits).

---

## 10) Docs

- [ ] Update `docs/architecture.md` (or `DOC.md`) with: tool registry, streaming semantics, classifier, RL via proxy, OTel tracing.
- [ ] Fix Zod version mentions in existing docs.

---

### File Map (primary edits)

- `src/lib/mastra/agents/coordinator.ts` → LLM intent, routing tweaks, stream glue.
- `src/lib/mastra/workflows/workflow-executor.ts` → **true streaming**.
- `src/lib/tools/{index.ts,zod-schemas.ts,implementations/*.ts}` → new in‑process tools.
- `src/lib/cache/openai-cache.ts` → model/version in keys.
- `src/lib/ai/{embeddings.ts,streaming.ts}` → new helpers.
- `src/lib/rate-limit.ts` + new `proxy.ts` → central RL & pre-processing.
- `src/lib/email/*` → webhooks + domain checks.
- `instrumentation.ts` → OTel.

**Definition of Done:** All tasks green; latency reduced vs HTTP tools; streaming visibly incremental; OTel traces present; CI passes unit+E2E; docs updated.
