# TODO — From A → Z

> Status: ☐ Not started  ⊡ In progress  ☐ Blocked  ☑ Done

## A) Foundations

- [ ] Create branch `feat/site-basics`
- [ ] Add brightness slider (−3…+3) mapping to `--brand`
- [ ] Header nav + footer w/ contact (<me@omerakben.com>)

## B) ChatKit & Tokens

- [ ] Install `@openai/chatkit` + `@openai/chatkit-react` and `@openai/agents`
- [ ] Add `/ai` with `<ChatKit/>` and `useChatKit({ api.getClientSecret })`
- [ ] Implement `/api/chatkit/start` + `/api/chatkit/refresh` (hosted token flow) :contentReference[oaicite:10]{index=10}
- [ ] Theme ChatKit via CSS var `--brand` (brightness aware)

## C) Agent (Agents SDK)

- [ ] Create `lib/agent/ozzyAgent.ts` with System prompt from Prompts.md
- [ ] Define tools: download_resume, list_projects, open_project, get_contact
- [ ] Add zod schemas and server endpoints for each tool
- [ ] Wire tool calls to pages/assets; unit tests
- [ ] (Phase 2) Optional sub-agents; escalate model for planning turns :contentReference[oaicite:11]{index=11}

## D) Content & Demos

- [ ] `public/resume/ozzy.pdf` + `ozzy.docx` mirrors
- [ ] `/recruiter` TL;DR + buttons
- [ ] `/projects/[slug]` (Elon AI Chat, AI Toolbar) with outcomes and demo embeds
- [ ] `/demos/tuel` gallery with live previews + copy buttons

## E) SEO & A11y

- [ ] JSON-LD (Person, SoftwareApplication, Article)
- [ ] Per-page OG images; sitemap/robots
- [ ] Keyboard paths & labels for all controls; color contrast AA

## F) Security & Observability

- [ ] Add CSP headers + iframe sandbox
- [ ] IP/session rate limit on `/api/*`
- [ ] Log events: resume downloads, chat starts (w/ PII redaction)
- [ ] Evals: 10 golden tasks + trace grading CI gate :contentReference[oaicite:12]{index=12}

## G) QA

- [ ] Playwright: `chat.spec.ts` (token refresh, refusal), `downloads.spec.ts`, `demos.spec.ts`
- [ ] Lighthouse ≥ 95; mobile and desktop

## H) Launch

- [ ] Connect domain to Vercel; SSL green
- [ ] Final pass on copy & analytics
- [ ] Tag v1.0 and deploy
