# omerakben.com — Product Requirements Document (PRD)

Owner: Omer "Ozzy" Akben
Domain: <https://omerakben.com>
Contact: <me@omerakben.com>

## 1) Vision

Make omerakben.com a recruiter-magnet, portfolio, and live demo of modern agentic UX:

- Instant "Recruiter Mode" TL;DR + downloadable resume(s)
- A personable on-site assistant ("Ozzy") embedded via ChatKit, orchestrated with AgentKit (Agents SDK + Builder + Evals)
- Delightful OSS demos (tuel animations) and case studies (Elon AI Chat, AI Toolbar)
- Polished performance, security, SEO, and accessibility

## 2) Goals & Non-Goals

**Goals**

1. < 2 clicks to download resume (PDF/DOCX)
2. 60-second recruiter TL;DR visible above the fold
3. Embedded agent (ChatKit) themed to the site; no API keys in browser
4. Case-study pages with a single clear outcome metric each
5. Demos page for `tuel` packages (live previews + "copy import")
6. Lighthouse ≥ 95 mobile/desktop; a11y AA

**Non-Goals**

- General multi-tenant chat platform (this is personal portfolio)
- External web browsing by the agent (keep tool allowlist closed)

## 3) Personas & Top Stories

- **Recruiter/Hiring Manager**: "I need the 5-line TL;DR, resume, and quick proof of shipped work."
- **Peer Engineer**: "Show me code, stack choices, and live demos."
- **Client/Professor**: "What did you deliver and what were the outcomes?"
- **Self**: "I can send one link that answers all of the above."

## 4) Scope — Pages & Features

- **/ (Home)**: hero, highlights, selected projects, CTA to /recruiter and /ai
- **/recruiter**: TL;DR, buttons (PDF, DOCX, LinkedIn, GitHub, email)
- **/ai**: ChatKit widget (Ozzy assistant)
- **/projects** + **/projects/[slug]**: Elon AI Chat, AI Toolbar (Problem → Solution → Stack → Outcome → Demo → Links)
- **/demos/tuel**: gallery of OSS UI components with live previews
- **Global**: 7-stop brightness control (−3…+3) mapping to theming tokens

## 5) System Architecture

- **Frontend**: Next.js (App Router), Tailwind, shadcn/ui, Framer Motion (selected)
- **Agent UI**: **ChatKit** embed (short-lived client secrets via hosted/custom backend)
- **Agent brain**: **Agents SDK** (TypeScript) as the orchestration layer, optionally composed/observed in **Agent Builder**; eval with **Evals** for regressions
- **Content**: local facts file + project pages (agent grounding)
- **Hosting**: Vercel
- **Analytics**: minimal page analytics + simple event logging (resume downloads, TL;DR opens, chat starts)

## 6) Identity & Brand Policy

- **Formal**: "Omer Akben" (resume, JSON-LD, legal)
- **Casual & bot name**: "Ozzy"
- Ozzy must switch to "Omer Akben" for formal intros/resume.

## 7) Agent Tools (allowlist)

- `download_resume(format: "pdf"|"docx") -> { url }`
- `list_projects(tag?) -> { items }`
- `open_project(slug) -> { url }`
- `get_contact() -> { email }`

> Implemented server-side; exposed to Agents SDK/Builder. No web fetch tool enabled.

## 8) Security & Safety

- Short-lived client tokens for ChatKit; no API key in browser
- Strict tool allowlist and input schema validation
- CSP headers; iframe sandbox for external demos; rate limits; basic PII redaction in logs
- Don't echo system or internal prompts. Refuse jailbreaks.

## 9) SEO & A11y

- JSON-LD: `Person`, `SoftwareApplication`, `Article`
- Per-page OG images + sitemap/robots
- Color-contrast AA across brightness −3…+3
- Keyboard & screen-reader friendly ChatKit container

## 10) Success Metrics

- Resume download CTR ≥ 35% from /recruiter
- Time-to-resume ≤ 10s for first-time user
- Chat starts/session ≥ 20%
- Case-study dwell time ≥ 45s

## 11) Milestones

M1: Scaffold + /recruiter + /ai with token flow + brightness tokens
M2: Two case studies + tuel gallery + SEO
M3: Agent tools wired + eval harness with 10 golden tasks
M4: Security/CSP + Playwright suite + polish + launch

## 12) Risks & Mitigations

- Token flow misconfig → follow ChatKit auth guide & add integration test
- Theming mismatch → map `--brand` to ChatKit theme
- Scope creep → lock M1–M4 deliverables
