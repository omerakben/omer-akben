# Agents — Architecture & Tools

## Overview

We use **ChatKit** for the embedded UI and **Agents SDK** for orchestration. Ozzy is a single agent with a strict tool allowlist. We may add sub-agents later (e.g., “ProjectFinder”, “ResumeNarrator”). :contentReference[oaicite:6]{index=6}

## Main Agent: Ozzy

- **Model**: gpt-4o-mini by default; escalate single turn to gpt-5-mini for planning if latency budget allows.
- **Instructions**: see `Prompts.md` System block.
- **Tools**:
  - `download_resume(format: "pdf"|"docx") -> { url }`
  - `list_projects(tag?: string) -> { items: {title, slug, summary}[] }`
  - `open_project(slug: string) -> { url }`
  - `get_contact() -> { email }`
- **Grounding Data**: `facts.ts` (bio, skills, highlights), page content, project metadata.
- **Guardrails**: jailbreak detector prompt, refusal templates, output length clamp.

## Optional Sub-Agents (Phase 2)

- **ProjectFinder**: filters/labels projects by tag; returns chips.
- **ResumeNarrator**: adapts TL;DR for recruiter vs. eng-peer; formats bullets.
- **DemoDocent**: explains `tuel` component APIs and links to npm.

## Data Flow

ChatKit (token) → Ozzy (Agents SDK) → if tool needed → call Next.js API tool endpoint → return structured result → ChatKit renders widgets/links. (Authentication via short-lived client secrets.) :contentReference[oaicite:7]{index=7}

## Evaluation (Evals)

- Build 10 “golden” tasks: “Download PDF”, “List AI projects”, “Open Elon case study”, “Refuse untrusted link”…
- Use Evals trace grading + datasets to measure regressions per release. :contentReference[oaicite:8]{index=8}
