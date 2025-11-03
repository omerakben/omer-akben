---
title: "Codebase Architecture Overview"
description: "Complete technical architecture of omerakben.com: Next.js 15 App Router, AI assistant with 11 server-side tools, episodic memory, and 8-mode brightness system"
date: 2025-11-02
status: stable
tags: [architecture, nextjs, ai-assistant, technical-overview]
---

# Codebase Architecture Overview

**Last Updated:** November 2, 2025

## Stack At A Glance

- **Framework**: Next.js 15 App Router on React 19, types enforced via TypeScript.
- **Styling**: Tailwind CSS 4 with a custom seven-stop brightness system and shadcn/ui primitives.
- **Agent Surface**: Next.js API routes expose **11 server-side tools** (`download_resume`, `download_certificate`, `list_projects`, `open_project`, `get_contact`, `collect_contact`, `navigate_page`, `provide_navigation_links`, `extract_summary`, `profile_performance`, `trigger_workflow`); schemas are enforced with Zod.
- **AI Assistant**: Sidebar assistant with episodic memory (Upstash Vector), thread persistence, follow-up suggestions, and proactive contact collection.

## Application Layout & Providers

- `src/app/layout.tsx` wires the global frame: it loads the Inter font, wraps pages in an `ErrorBoundary`, injects the `BrightnessProvider`, and mounts shared chrome (`AppHeader`, `AppFooter`, `Toaster`) [src/app/layout.tsx:1-42](src/app/layout.tsx:1-42).
- Brightness controls are handled client-side by `BrightnessProvider`, which syncs the selected mode to `localStorage` and updates `data-brightness` on `<html>` for CSS token switching [src/lib/brightness-context.tsx:1-91](src/lib/brightness-context.tsx:1-91).
- Global gradients, typography, and the seven brightness modes live in `src/app/globals.css`; each `data-brightness` value remaps surface, border, and text tokens consumed by Tailwind utility classes [src/app/globals.css:1-140](src/app/globals.css:1-140).

## UI Composition

- Page shells and reusable sections sit in `src/components`. For example, `HeroSection` combines shadcn buttons with Framer Motion timings for entrance and scroll affordances [src/components/hero-section.tsx:1-131](src/components/hero-section.tsx:1-131).
- Navigation logic resides in `AppHeader`, which feeds route metadata into responsive shadcn Radix sheets and buttons. Brightness controls render inline on large screens for instant theme feedback.
- `ErrorBoundary` guards the entire client tree and provides a branded fallback + reload affordance [src/components/error-boundary.tsx:1-63](src/components/error-boundary.tsx:1-63).

## Data & Content Layer

- Structured content lives in `src/data`. `facts.ts` grounds the agent with curated biography, skills, project metadata, and **work authorization** (U.S. Permanent Resident / Green Card status with official terminology), exposing helper accessors for tooling [src/data/facts.ts:1-118](src/data/facts.ts:1-118).
  - **Work Authorization** (added Nov 2, 2025): `facts.professional.workAuthorization` contains official U.S. immigration terminology for professional recruiter interactions
- `projects.ts` centralizes project cards, including metadata needed for recruiter filtering and tool responses. Selectors such as `getFeaturedProjects` keep page components declarative [src/data/projects.ts:1-150](src/data/projects.ts:1-150).
- Pages (for example `src/app/page.tsx`) remain presentational by pulling pre-filtered data and composing UI primitives [src/app/page.tsx:1-132](src/app/page.tsx:1-132).

## Agent Tool Surface

**11 Server-Side Tools** (all in `src/app/api/tools/`):

1. `download_resume` - 4 formats (full, short, two-page, docx)
2. `download_certificate` - AWS, NSS certificates
3. `list_projects` - Filter by category, featured flag, limit
4. `open_project` - Get project details by slug
5. `get_contact` - Contact information
6. **`collect_contact`** - Collect visitor info, send Zoom link via email with rate limiting (added Oct 27-29, 2025)
7. `navigate_page` - Page navigation links
8. `provide_navigation_links` - Navigation menu structure
9. `extract_summary` - Extract summaries from content
10. `profile_performance` - Performance profiling
11. `trigger_workflow` - Workflow execution

**Architecture:**

- All tool schemas defined in `src/lib/agent-tools/schemas.ts` - Zod validates inputs/outputs [src/lib/agent-tools/schemas.ts:1-86](src/lib/agent-tools/schemas.ts:1-86)
- API routes under `src/app/api/tools/*` parse JSON with schemas, return `{ success, data, error }` envelopes [src/app/api/tools/list-projects/route.ts:1-47](src/app/api/tools/list-projects/route.ts:1-47)
- Most endpoints are side-effect free (except `collect_contact` which sends email and stores contact data in Redis)
- Tool endpoints safely invoked by both AI agent and standard UI flows (e.g., resume download buttons)

## Essential Libraries & Their Roles

| Library                  | Why It’s Essential                                                                                                               | Key Integration Points                                                                                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Next.js**              | Provides the App Router, server components, and route handlers that underpin every page and API tool.                            | Global layout + metadata handling [src/app/layout.tsx:1-42](src/app/layout.tsx:1-42); tool endpoints in `src/app/api/tools/*`; metadata factory [src/lib/metadata.ts:1-48](src/lib/metadata.ts:1-48).                                |
| **Radix UI + shadcn/ui** | Supplies accessible primitives (buttons, sheets, dialogs, sliders) that align with the design system while staying theme-aware.  | UI layer in `src/components/ui/*.tsx` (e.g., Button variants [src/components/ui/button.tsx:1-55](src/components/ui/button.tsx:1-55)); `AppHeader` uses `Sheet` for mobile nav and `BrightnessControl` leverages Radix slider tokens. |
| **Framer Motion**        | Powers motion design across hero, project cards, timelines, and skills grids, delivering the “agentic” feel outlined in the PRD. | Hero introduction [src/components/hero-section.tsx:1-131](src/components/hero-section.tsx:1-131); project cards and timeline animations (`src/components/project-card.tsx`, `src/components/timeline.tsx`).                          |

## Architectural Design Notes

- **Separation of Concerns**: UI components are purely declarative and stateless; stateful logic (brightness, forms, tool validation) lives in targeted hooks/providers.
- **Content Source of Truth**: All resume, project, and skill copy is collocated in `src/data`, enabling agent responses, static pages, and API tools to share one canonical data set.
- **Guardrails & Resilience**: The app-wide `ErrorBoundary` plus schema validation ensures graceful degradation for both user and agent surfaces.
- **Design System**: The brightness system exposes eight brightness modes (-3 to +3, plus auto) that propagate through Tailwind via CSS variables, keeping accessibility targets intact across light/dark ranges.

## Production Status & Future Enhancements

**Current Status (November 2, 2025):**

- ✅ Ozzy AI fully operational with 11 production tools
- ✅ Episodic memory system deployed (Upstash Vector)
- ✅ Proactive contact collection with email integration (Resend)
- ✅ Thread persistence and sidebar assistant with pinning/resizing
- ✅ WCAG 2A compliant (8/8 routes E2E tested)
- ✅ Production deployment on Vercel with CI/CD quality gates

**Future Enhancement Opportunities:**

1. Expand episodic memory with conversation analytics and insights dashboard
2. Add multi-language support for international recruiters
3. Implement A/B testing framework for follow-up suggestion optimization
4. Enhanced monitoring with real-time analytics integration
5. Consider adding blog/articles section with SEO optimization
