# Codebase Architecture Overview

## Stack At A Glance

- **Framework**: Next.js 15 App Router on React 19, types enforced via TypeScript.
- **Styling**: Tailwind CSS 4 with a custom seven-stop brightness system and shadcn/ui primitives.
- **Agent Surface**: Next.js API routes expose the `download_resume`, `list_projects`, `open_project`, and `get_contact` tools; schemas are enforced with Zod.

## Application Layout & Providers

- `src/app/layout.tsx` wires the global frame: it loads the Inter font, wraps pages in an `ErrorBoundary`, injects the `BrightnessProvider`, and mounts shared chrome (`AppHeader`, `AppFooter`, `Toaster`) [src/app/layout.tsx:1-42](src/app/layout.tsx:1-42).
- Brightness controls are handled client-side by `BrightnessProvider`, which syncs the selected mode to `localStorage` and updates `data-brightness` on `<html>` for CSS token switching [src/lib/brightness-context.tsx:1-91](src/lib/brightness-context.tsx:1-91).
- Global gradients, typography, and the seven brightness modes live in `src/app/globals.css`; each `data-brightness` value remaps surface, border, and text tokens consumed by Tailwind utility classes [src/app/globals.css:1-140](src/app/globals.css:1-140).

## UI Composition

- Page shells and reusable sections sit in `src/components`. For example, `HeroSection` combines shadcn buttons with Framer Motion timings for entrance and scroll affordances [src/components/hero-section.tsx:1-131](src/components/hero-section.tsx:1-131).
- Navigation logic resides in `AppHeader`, which feeds route metadata into responsive shadcn Radix sheets and buttons. Brightness controls render inline on large screens for instant theme feedback.
- `ErrorBoundary` guards the entire client tree and provides a branded fallback + reload affordance [src/components/error-boundary.tsx:1-63](src/components/error-boundary.tsx:1-63).

## Data & Content Layer

- Structured content lives in `src/data`. `facts.ts` grounds the agent with curated biography, skills, and project metadata, exposing helper accessors for tooling [src/data/facts.ts:1-118](src/data/facts.ts:1-118).
- `projects.ts` centralizes project cards, including metadata needed for recruiter filtering and tool responses. Selectors such as `getFeaturedProjects` keep page components declarative [src/data/projects.ts:1-150](src/data/projects.ts:1-150).
- Pages (for example `src/app/page.tsx`) remain presentational by pulling pre-filtered data and composing UI primitives [src/app/page.tsx:1-132](src/app/page.tsx:1-132).

## Agent Tool Surface

- All tool schemas are defined once in `src/lib/agent-tools/schemas.ts`. Zod validates both inputs and outputs, ensuring parity between the Next.js routes and the Agents SDK contracts [src/lib/agent-tools/schemas.ts:1-86](src/lib/agent-tools/schemas.ts:1-86).
- API routes under `src/app/api/tools/*` parse incoming JSON with those schemas before returning normalized payloads. Example: `list-projects` filters the dataset by category, featured flag, and limit before responding with a `{ success, data }` envelope [src/app/api/tools/list-projects/route.ts:1-47](src/app/api/tools/list-projects/route.ts:1-47).
- Tool endpoints are intentionally side-effect free so they can be invoked safely by both the embedded agent and standard UI flows (e.g., resume download buttons).

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
- **Design System**: The brightness system exposes seven distinct tokens that propagate through Tailwind via CSS variables, keeping accessibility targets intact across light/dark ranges.

## Suggested Next Documentation Steps

1. Add Agent SDK orchestration details once the Ozzy runtime is wired into `/ai`.
2. Document the ChatKit authentication flow in the `/api/chatkit/*` routes when implemented.
3. Capture deployment/environment notes (Vercel, analytics, secrets rotation) to align with the rules in `Rules.md`.
