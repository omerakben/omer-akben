# Claude Code Prompt — Ozzy AI Sidebar Assistant (Next.js + FastAPI + Dynamic Follow-ups)

## Role

You are a principal full-stack engineer (Next.js/React + TypeScript + Tailwind; FastAPI + Python). Produce concrete code changes, tests, and minimal docs.

## Tooling & Research

- If Perplexity MCP and/or web search are available, use them to:
  1) validate “pinnable side-panel assistant” UI patterns,
  2) confirm best practices for chat history + keyboard shortcuts,
  3) skim current guides for integrating n8n/Langflow/CopilotKit with Next.js.
- If tools are unavailable, proceed and note assumptions in DOCS.

## Repo Assumptions

- Next.js (App Router) + TypeScript + Tailwind.
- FastAPI backend exists for actions (email, resume). If missing, stub the route shapes.
- Public resumes at `/public/Omer_Akben_Resume.pdf` and `/public/Omer_Akben_Resume_Extended.pdf` (or create placeholders).

## Project Constraints

- We **remove** the full-screen chat page permanently; only a **sidebar assistant** panel remains.
- High quality: strict TS, accessible UI (ARIA), keyboard (⌘/Ctrl+K focus, Esc close).
- Keep changes PR-sized and composable.

## Tasks

1) **Delete full-screen chat**
   - Remove `/chat` routes/components and any “expand to full screen” triggers.
   - Remove dead imports/links; ensure builds pass.

2) **Implement Sidebar Assistant (panel, not a floating bubble)**
   - Left or right **pinnable** panel that can:
     - open/close (button + keyboard),
     - pin/unpin (persists across navigation),
     - resize (drag handle),
     - **New Chat**, **Clear Conversation**,
     - **Send Email**, **Send Resume** actions,
     - show **Suggested Questions** chips.
   - Persist threads in localStorage/IndexedDB with model:
     `{ id, title, messages[], createdAt, updatedAt, pinned?: boolean }`
   - Provide a minimal server route example for streaming model replies (stub ok).

3) **“Opener” & “Suggested Questions” (portfolio-safe)**
   - Starter chips + FAQ cards (no company context needed):
     - **Tell me about yourself.** (Present → Past → Future using Fact Bank)
     - **What problems do you love solving?** (3 themes in Fact Bank)
     - **Walk me through your portfolio project.** (STAR-lite “Ozzy AI Twin”)
   - Persistent follow-ups (chips always available):
     - “Tell me more about your technical skills”
     - “What’s your recent work experience?”

4) **Dynamic Follow-ups (new)**
   - After **every** assistant reply, generate **two clickable follow-up questions**.
   - Behavior:
     - If last turn matches a known **intent**, pick 2 from that intent’s library.
     - Else, detect **topics** from recent input/output via keyword regex and pick 2 from topic libraries.
     - Avoid duplicates (track recently shown).
     - Optional LLM mode: POST `/api/suggest-followups` to craft two suggestions; if disabled or errors, fall back to heuristics.
   - Provide a small, standalone module:
     - `config/assistantFaq.ts` — intents, fact bank, keyword→topic map, follow-up libraries.
     - `lib/followups.ts` — `classifyIntent()`, `getFollowups()` (LLM-first, else heuristic).
     - `components/FollowupChips.tsx` — accessible chip buttons (click = auto-send).
     - `app/api/suggest-followups/route.ts` — optional Anthropic-backed endpoint with server-side heuristic fallback.

5) **Actions**
   - **Send Email**: call FastAPI `/actions/email` to send via Google Workspace (`me@omerakben.com`). If not configured, **fallback** to:
     `mailto:me@omerakben.com?subject=Hello%20Ozzy&body=...`
   - **Send Resume**: show quick picker for `/Omer_Akben_Resume.pdf` and `/Omer_Akben_Resume_Extended.pdf`.

6) **Optional integrations (feature-flagged)**
   - `n8n`: POST webhook `{event, userMessage, threadId}`.
   - `Langflow`: REST client; configurable `flow_id`.
   - `CopilotKit`: adapter + toggled provider.

7) **Telemetry & UX polish**
   - Log: open/close, pin/unpin, new/clear chat, action clicks.
   - Keyboard: `Esc` close (when unpinned), `⌘/Ctrl+K` focus input, `⌘/Ctrl+Shift+N` new chat.
   - A11y: focus trap when open; aria-labels; visible focus rings.

## Fact Bank (use verbatim as needed)

- TMAY:
  - Present: “I’m an AI Engineer & Full-Stack dev focused on TypeScript/React and Python/FastAPI/Django. Lately I’ve shipped agentic/RAG features with OpenAI/Claude + LangGraph.”
  - Past: “Previously, I led QA automation at scale (Playwright/Selenium, CI/CD).”
  - Future: “Now I’m building production-grade AI agents and DX tooling.”
- Problems I love:
  1) turning messy knowledge into searchable RAG,
  2) agentic workflows that take actions (MCP/tools),
  3) bulletproof CI/CD + test automation so features ship reliably.
- Signature project (STAR-lite):
  - “**Ozzy AI Twin** — Goal: side-panel agent for my portfolio. I designed tool use (Playwright MCP, web browse, RAG on my docs), built a FastAPI backend + Next.js UI, and added eval tests in CI. Result: e.g., sub-1s retrieval, ~95% task success on scripted flows.”

## File Map (create/modify)

- Remove: `/app/chat/**` (or equivalent), expand-to-full-screen triggers.
- Add/modify:
  - `components/SidebarAssistant.tsx` (panel UI, wiring to follow-ups)
  - `providers/AssistantProvider.tsx` (state/context for panel + threads)
  - `components/FollowupChips.tsx`
  - `config/assistantFaq.ts`
  - `lib/followups.ts`
  - `app/api/suggest-followups/route.ts` (optional LLM)
  - `app/api/actions/email/route.ts` (workspace or mailto fallback)
  - `docs/sidebar-assistant.md`
  - `tests/e2e/sidebar-assistant.spec.ts`

## Environment & Flags

- `NEXT_PUBLIC_ENABLE_SERVER_SUGGEST=0|1`
- `ANTHROPIC_API_KEY` (if using LLM suggestions)
- Optional:
  - `N8N_WEBHOOK_URL`
  - `LANGFLOW_BASE_URL` / `LANGFLOW_TOKEN` / `LANGFLOW_FLOW_ID`
  - `COPILOTKIT_ENABLED=0|1`

## Output Contract (STRICT)

Respond in **exactly** these sections and nothing else:

1) **PLAN**
   - A numbered, concise plan referencing files/paths you will add, edit, or remove.
   - If Perplexity/web search used, include 3 bullet takeaways.

2) **PATCHES**
   - Unified diffs for all files you change or create (correct paths).
   - Include minimal Tailwind UI for the panel (`components/SidebarAssistant.tsx`), provider (`providers/AssistantProvider.tsx`), routes (`/app/api/actions/email/route.ts` and `/app/api/suggest-followups/route.ts`), resume picker, and the dynamic follow-ups module (`config/assistantFaq.ts`, `lib/followups.ts`, `components/FollowupChips.tsx`).

3) **TESTS**
   - Playwright tests covering: open/close, pin/unpin, resize, new chat, clear chat, suggested chips render + click, keyboard shortcuts, and “send resume” download.

4) **DOCS**
   - `docs/sidebar-assistant.md` explaining: enabling n8n/Langflow/CopilotKit, env vars, email fallback, and a11y/telemetry notes.

## Acceptance Criteria

- No full-screen chat page; no expand button anywhere.
- Sidebar opens, resizes, pins; keyboard shortcuts work.
- After each assistant reply, **two** follow-up chips appear; they adapt to last input/output; no immediate duplicates; clicking auto-sends.
- Starter chips + FAQ answers render using Fact Bank.
- “Send Email” falls back to `mailto:` when server creds absent.
- “Send Resume” offers one-page and extended PDFs.
- Playwright tests pass; TypeScript strict; no unused exports.
- Feature flags can enable n8n/Langflow/CopilotKit without breaking core UX.

## Style & Quality

- TypeScript strict; keep interactive pieces as client components; small, composable components.
- Include ARIA labels and focus management; no lorem ipsum; use Fact Bank text.
- Keep dependencies minimal; avoid vendor lock-in.

## Notes

- If required secrets are missing, provide graceful fallbacks and document them in DOCS.

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

APPENDIX A — Reference Implementations (for PATCHES)
(Implement these files functionally equivalent to the code below. You may copy verbatim.)

1) `config/assistantFaq.ts` — intents + fact bank + follow-up libraries + topic regex map.
2) `lib/followups.ts` — `classifyIntent()`, `getFollowups()` (tries `/api/suggest-followups` when `NEXT_PUBLIC_ENABLE_SERVER_SUGGEST=1`, else heuristic).
3) `components/FollowupChips.tsx` — accessible chip buttons that call `onClick(s)` to auto-send.
4) `app/api/suggest-followups/route.ts` — Edge runtime; if `ANTHROPIC_API_KEY` present, call Anthropic Messages API (`claude-3-7-sonnet-latest`) to return a JSON array of 2 strings; otherwise, server-side heuristic fallback.

### 1) config/assistantFaq.ts

<BEGIN FILE>
[Same contents as provided in the user prompt block under “config/assistantFaq.ts”.]
<END FILE>

### 2) lib/followups.ts

<BEGIN FILE>
[Same contents as provided in the user prompt block under “lib/followups.ts”.]
<END FILE>

### 3) components/FollowupChips.tsx

<BEGIN FILE>
[Same contents as provided in the user prompt block under “components/FollowupChips.tsx”.]
<END FILE>

### 4) app/api/suggest-followups/route.ts

<BEGIN FILE>
[Same contents as provided in the user prompt block under “app/api/suggest-followups/route.ts”.]
<END FILE>
