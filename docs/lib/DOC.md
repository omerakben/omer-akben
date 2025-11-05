# DOC.md — Codex Guide for `/lib` Improvements

This document equips **Codex** to autonomously refactor and enhance `src/lib/**` into a production‑ready, agentic foundation. It summarizes the existing structure (from `lib.md`), maps file‑level changes, and links **official** docs + real examples for each library.

---

## 1) Current Structure (from `lib.md`)

- **Agents:** coordinator + specialists (resume, projects, contact, navigation, performance). Workflows exist but **buffer before streaming** (needs fix). Tools currently call **HTTP API routes**; schemas are Zod‑validated. Memory is **dual‑layer** (Upstash Vector episodic + Redis semantic). Rate‑limit tiers include contact collection **1/24h**. Resend handles Zoom link email with React Email template and tagging.
  _See: Directory + pain points in `lib.md`._

**Key file paths to know (partial):**

- `src/lib/mastra/agents/{base-agent.ts,coordinator.ts,*.ts}`
- `src/lib/mastra/workflows/{workflow-executor.ts,index.ts,...}`
- `src/lib/agent-tools/{schemas.ts,navigation-schema.ts}` (schemas source of truth today)
- `src/lib/cache/openai-cache.ts`
- `src/lib/{rate-limit.ts,log.ts,utils.ts}`
- `src/lib/email/{send-zoom-link.ts,templates/ZoomLinkEmail.tsx}`
- `src/lib/redis/{client.ts,vector-client.ts,embeddings.ts,vector-search.ts}`

> When progress stalls, **search the repo first** for symbols like: `classifyIntent`, `executeWorkflowStream`, `createTool`, `/api/tools/`, `embed(`, `embedMany(`, `Ratelimit.slidingWindow`, `ZoomLinkEmail`. If still unclear, consult referenced docs below.

---

## 2) What to Change (summary)

1) **Tools in‑process:** Replace HTTP tool round‑trips with AI SDK v5 tools (Zod‑typed), called directly by agents. Keep an HTTP route _only_ if it must be public.
2) **True streaming:** Emit per‑step workflow chunks; no buffering.
3) **Deterministic intent:** Replace regex with structured output classification (Zod enum, temp 0).
4) **Unify embeddings:** AI SDK `embed`/`embedMany` wrapper; set Upstash Vector dim **1536** for `text-embedding-3-small`.
5) **Proxy‑level rate limit:** Use `proxy.ts` to compute identifiers and enforce RL centrally.
6) **Observability:** Add OpenTelemetry spans around agents/tools/memory/email.
7) **Security & email:** Verify SPF/DKIM, add Resend webhooks, CSP headers.

---

## 3) File‑level Plan (mapping)

| Area               | Files to Create / Edit                                                           | Actions                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Schemas**        | `src/lib/tools/zod-schemas.ts`                                                   | Move all tool schemas from `agent-tools/` here; re‑export for backwards compatibility.                                           |
| **Tools registry** | `src/lib/tools/index.ts`, `src/lib/tools/implementations/*.ts`                   | Implement each tool as an **AI SDK v5 tool** using Zod schemas; export a registry for agents. Remove or thin out `/api/tools/*`. |
| **Agents**         | `src/lib/mastra/agents/coordinator.ts`                                           | Swap regex → **LLM structured classifier**; plug into tools registry; keep memory injection from base agent.                     |
| **Workflows**      | `src/lib/mastra/workflows/workflow-executor.ts`                                  | Convert to **async generator** that yields step events; add helper in `src/lib/ai/streaming.ts`.                                 |
| **Embeddings**     | `src/lib/ai/embeddings.ts` (new)                                                 | Wrap `embed`/`embedMany` (AI SDK v5), retries, logging; update all call‑sites to use this.                                       |
| **Cache**          | `src/lib/cache/openai-cache.ts`                                                  | Include `(model, version)` in keys; keep version bump constant; expose simple metrics getters.                                   |
| **Memory**         | `src/lib/mastra/memory/{episodic.ts,semantic.ts}`, `src/lib/redis/embeddings.ts` | Separate namespaces for episodic vs projects; document 1536 dims.                                                                |
| **Rate limit**     | `proxy.ts` (root) + `src/lib/rate-limit.ts`                                      | Move RL identification to `proxy.ts`; unify per‑endpoint strategies (sliding, fixed, token bucket).                              |
| **Observability**  | `instrumentation.ts` (root) + `src/lib/infra/observability.ts`                   | Initialize OTel, add spans/attributes; exporter config (Axiom/SigNoz/etc.).                                                      |
| **Email**          | `src/lib/email/*` + `/api/resend/webhook/route.ts`                               | Add webhook route for `email.sent`/`bounced`; ensure domain verification checks; keep PII redaction.                             |
| **Docs**           | `DOC.md`, `docs/architecture.md`                                                 | Document new tools registry, streaming semantics, classifier contract, RL/OTel setup.                                            |

---

## 4) Official Docs (primary references)

- **Next.js**
  - Production checklist: <https://nextjs.org/docs/app/guides/production-checklist>
  - `proxy.ts` file convention & getting started: <https://nextjs.org/docs/app/api-reference/file-conventions/proxy> , <https://nextjs.org/docs/app/getting-started/proxy>
  - Route Handlers: <https://nextjs.org/docs/app/getting-started/route-handlers>
  - Server Actions (mutations): <https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations>
  - OpenTelemetry (instrumentation): <https://nextjs.org/docs/app/guides/open-telemetry>

- **React 19**
  - Release & upgrade: <https://react.dev/blog/2024/12/05/react-19> , <https://react.dev/blog/2024/04/25/react-19-upgrade-guide>
  - Strict Mode: <https://react.dev/reference/react/StrictMode>

- **TypeScript**
  - Handbook: <https://www.typescriptlang.org/docs/handbook/intro.html>
  - TSConfig strict: <https://www.typescriptlang.org/tsconfig/strict.html>

- **Mastra**
  - Docs intro: <https://mastra.ai/docs>
  - Agent networks / memory: <https://mastra.ai/en/docs/agents/networks> , <https://mastra.ai/docs/agents/agent-memory>

- **Vercel AI SDK (v5)**
  - Introduction: <https://ai-sdk.dev/docs/introduction>
  - `useChat` streaming: <https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat>
  - Tools & tool calling: <https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling>
  - Structured data (`generateObject`): <https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data>

- **OpenAI**
  - Responses API: <https://platform.openai.com/docs/api-reference/responses>
  - Structured Outputs: <https://platform.openai.com/docs/guides/structured-outputs>
  - Embeddings (`text-embedding-3-small`, 1536 dims): <https://platform.openai.com/docs/guides/embeddings/how-to-get-embeddings>

- **Upstash**
  - Redis (TS SDK): <https://upstash.com/docs/redis/sdks/ts/overview>
  - Vector (TS SDK): <https://upstash.com/docs/vector/sdks/ts/getting-started>
  - Rate Limit (TS): <https://upstash.com/docs/redis/sdks/ratelimit-ts/overview>

- **Zod**
  - Intro: <https://zod.dev/>

- **Resend**
  - Introduction & API: <https://resend.com/docs/introduction> , <https://resend.com/docs/api-reference/introduction>
  - Domains (SPF/DKIM): <https://resend.com/docs/dashboard/domains/introduction>
  - Webhooks: <https://resend.com/docs/dashboard/webhooks/introduction>

---

## 5) Concrete Examples for Codex

- **AI SDK tools pattern**: <https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling>
- **`useChat` SSE streaming**: <https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat>
- **Structured classification with Zod**: <https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data>
- **Next `proxy.ts`** (central request pre‑processing): <https://nextjs.org/docs/app/getting-started/proxy>
- **OpenTelemetry in Next.js**: <https://nextjs.org/docs/app/guides/open-telemetry>
- **Upstash Rate Limit methods**: <https://upstash.com/docs/redis/sdks/ratelimit-ts/methods>
- **Resend domain verification & webhooks**: <https://resend.com/docs/dashboard/domains/introduction> , <https://resend.com/docs/dashboard/webhooks/introduction>

---

## 6) When You Get Stuck — Search Heuristics

1) **Repo search (priority):**
   - _Tools:_ look for `/api/tools/` routes and `createTool(` patterns; replace with in‑process calls.
   - _Streaming:_ search `executeWorkflowStream` and `ReadableStream` usage.
   - _Embeddings:_ search `embeddings.create`, `embed(`, `embedMany(`.
   - _RL:_ search `Ratelimit.` and `ratelimit:` prefixes.
   - _Email:_ search `send-zoom-link` and `tags:`.

2) **Docs (above):** if API shape or file conventions are unclear.

3) **Add logs/traces:** instrument spans around failing steps; inspect attributes (`agent`, `tool`, `model`).

---

## 7) Acceptance Criteria (definition of done)

- Tools invoked in‑process; HTTP round‑trips removed except public endpoints.
- Workflows stream **progress events**; UI updates live via `useChat`.
- Classifier is deterministic (Zod enum; temp 0).
- Embedding calls routed through a single wrapper; Upstash Vector uses **1536** dim.
- Proxy‑level RL consistently applied; identifiers include IP, path, user/session, UA hash.
- OTel traces present for agents/tools/memory/email; spans include latency + cache hit attrs.
- Zod v4 across repo; CI green on unit + E2E; docs updated.

---

## 8) Notes for Safe Changes

- **Secrets** (OpenAI, Resend) must remain server‑only.
- Keep **PII redaction** in logging and email flows.
- Prefer **typed** responses everywhere (`z.infer<typeof Schema>`).
- Add **feature flags** if needed to roll out streaming refactor gradually.

Good luck — ship it! 🚀
