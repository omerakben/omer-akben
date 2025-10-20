# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TL;DR

Personal portfolio with AI assistant powered by Vercel AI SDK. Next.js 15 + React 19 + TypeScript + Tailwind 4.

**Commands**:
```bash
npm run dev                                      # Dev server (Turbopack)
npm test                                         # Unit tests (run all)
npm test -- --watch                              # TDD mode
npm test -- global-chat-button.test.tsx         # Single test file
npm run test:e2e                                 # E2E tests (Playwright)
npm run test:e2e -- agentic-sidebar.spec.ts     # Single E2E test
npm run build                                    # Production build
npm run analyze                                  # Bundle analysis
npm run lint                                     # ESLint check
npx tsc --noEmit                                 # TypeScript check
```

**Critical Rules**:
- Use `@/` imports only (never relative or `/archive/` imports - **archive is reference only**)
- Test all 8 brightness modes (-3 to +3, auto)
- Use CSS custom properties only (never hardcoded colors)
- All API calls server-side (never expose keys in browser)
- Never use emojis in UI (use Lucide icons)
- Redis rate limiting active (requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)

---

## Architecture

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (40+ shadcn/ui in `ui/`)
- `src/data/` - Source of truth for personal info, projects, skills
- `src/lib/` - Utilities, contexts, AI agent tools and schemas
- `archive/` - Portfolio demo projects (reference only, never import)
- Path alias: `@/*` → `./src/*`

### AI Agent (Vercel AI SDK v5)

**10 Server-Side Tools** (all in `src/app/api/tools/`):
1. `download_resume` - 4 formats (full, short, two-page, docx)
2. `download_certificate` - AWS, NSS certs
3. `list_projects` - Filter by category, featured, limit
4. `open_project` - Get project details by slug
5. `get_contact` - Contact information
6. `navigate_page` - Page navigation links
7. `provide_navigation_links` - Navigation menu structure
8. `extract_summary` - Extract summaries from content
9. `profile_performance` - Performance profiling
10. `trigger_workflow` - Workflow execution

**Data Flow**: Chat UI → AI SDK streaming → Tool call → Zod validation → Handler → JSON response

**Knowledge Base**: `lib/agent-knowledge-base.ts` - curated context for AI (single source of truth)

**AI SDK v5 Tool Rendering** (Critical):
- Tool invocations in `message.parts` array, NOT `toolInvocations` property
- Filter by `part.type === "tool-{toolName}"` and check `part.result` exists
- Use IIFE `(() => { ... })()` for complex conditional JSX rendering
- Structure: `{ type: "tool-{name}", toolCallId: "...", result: {...} }`

**Chat System Features** (Ozzy AI Agent - Portfolio Centerpiece):
- **Sidebar Assistant**: Pinned/unpinned mode with localStorage persistence, resizable width (320-800px)
- **Thread Memory**: `thread-memory.ts` - conversation state persistence with pinned/width state
- **Global Chat Button**: `global-chat-button.tsx` - floating access from any page (tested: 32 tests)
- **Follow-up Suggestions**: `FollowupChips.tsx` - contextual question suggestions after each response
- **Action Buttons**: Email (`EmailActionButton.tsx`) and Resume download (`ResumeDownloadButton.tsx`) integrated in sidebar
- **Keyboard Shortcuts**: Cmd/Ctrl+Shift+N for new chat
- **Hydration-Safe**: `isMounted` pattern prevents Next.js hydration mismatches
- **Layout Integration**: Single `LayoutContainer` applies margin when sidebar pinned, navbar/footer naturally constrained

### Unique Design Patterns

**1. 8-Mode Brightness System** ⚠️ **Critical**
- Modes: -3 (darkest) → 0 (baseline) → +3 (brightest) + auto
- Implementation: `data-brightness` attribute on `<html>`, CSS custom properties in `globals.css`
- State: `lib/brightness-context.tsx`
- **Always use design tokens**: `bg-surf-{0,1,2}`, `text-text-{1,2,3}`, `bg-brand-primary`, `border-border-line`
- **Never hardcode colors**: No `#00FFC6` or `bg-[#00FFC6]`

**2. Data Architecture**
- `data/facts.ts` - Single source of truth for personal info
- `data/projects.ts` - Project catalog with helper functions
- All data files export typed objects + helper functions

**3. Archive Directory** ⚠️ **Important**
- Contains 9 portfolio demos (reference only)
- `omer-akben-design/` - Figma implementation patterns
- **Never import from `/archive/`** - adapt patterns to `src/` with `@/` imports

**4. Sidebar Assistant Architecture** ⚠️ **Critical**
- **Context**: `lib/chat-sidebar-context.tsx` - manages state (isOpen, isPinned, width, threadId)
- **Component**: `components/chat/chat-sidebar.tsx` - main sidebar UI with resizing, pinning
- **Thread Memory**: `lib/thread-memory.ts` - localStorage persistence with pinned/width state
- **Layout Integration**: `app/layout.tsx` - `LayoutContainer` applies marginRight when pinned
- **Hydration Safety**: Uses `isMounted` pattern to prevent Next.js hydration mismatches
- **State Persistence**: localStorage keys: `sidebar_pinned`, `sidebar_width`
- **Constraints**: Width 320-800px, single source of layout constraint (LayoutContainer)
- **Follow-ups**: `lib/followups.ts` + `components/chat/FollowupChips.tsx` - contextual suggestions
- **Actions**: `components/actions/` - EmailActionButton, ResumeDownloadButton

**5. Icon Optimization** ⚠️ **Critical**
- **Never wildcard import simple-icons** - use generated manifest
- Icon manifest: `src/lib/icon-manifest.ts` (42 curated icons)
- Generation script: `scripts/generate-icons.js` (run during build)
- Achievement: 90% bundle reduction (2.33MB → 236KB)
- Pattern: `import { getIcon } from '@/lib/icon-manifest'` then `getIcon('react')`

---

## Development

### Quality Gates (All Must Pass)
```bash
npm test          # All unit tests (currently 175)
npm run lint      # Zero errors (scripts/ excluded)
npx tsc --noEmit  # Strict TypeScript compilation
npm run build     # Production build successful
```

**Recent Quality Achievements**:
- ✅ ESLint clean (0 errors, 0 warnings) - achieved 2025-10-18
- ✅ Bundle optimization (236KB homepage, 193KB /skills) - achieved 2025-10-19
- ✅ Redis rate limiting implemented - achieved 2025-10-18
- ✅ No inline styles (all converted to Tailwind/CSS) - achieved 2025-10-19
- ✅ Debug logs removed (console.error retained for production) - achieved 2025-10-19
- ✅ Sidebar assistant with pinning, resizing, persistence - achieved 2025-10-19
- ✅ Hydration-safe Next.js patterns (isMounted) - achieved 2025-10-19
- ✅ 175 unit tests passing (from 72) - achieved 2025-10-19

### Test Configuration
- **Unit Tests**: Vitest + React Testing Library (`src/**/*.test.{ts,tsx}`) - **175 tests**
  - `global-chat-button.test.tsx` (32 tests) - Global chat button behavior
  - `thread-memory.test.ts` (27 tests) - Conversation persistence, pinned state
  - `schemas.test.ts` (68 tests) - Agent tool Zod validation
  - `brightness-control.test.tsx` (23 tests) - Brightness mode switching
  - `projects.test.ts` (25 tests) - Project data helpers
  - Watch mode: `npm test -- --watch`
  - Coverage: `npm test -- --coverage`

- **E2E Tests**: Playwright (`e2e/*.spec.ts`)
  - `agentic-sidebar.spec.ts` - Sidebar pinning, resizing, persistence
  - `brightness-modes.spec.ts` - Brightness mode switching (8 modes)
  - Run all: `npm run test:e2e`
  - UI mode: `npm run test:e2e:ui`
  - Headed: `npm run test:e2e:headed`

### Rate Limiting (Production-Ready)
- **Implementation**: Redis-backed via Upstash (`@upstash/ratelimit`)
- **Configuration**: `src/lib/rate-limit.ts` with route-specific limits
- **Middleware**: `src/middleware.ts` applies limits before request processing

**Rate Limit Tiers**:
- Chat API (`/api/chat`): 30 requests/min (OpenAI cost control)
- Tools API (`/api/tools/*`): 60 requests/min (lightweight operations)
- Generic API (`/api/*`): 100 requests/min (other endpoints)

**Environment Variables Required**:
```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

**Graceful Degradation**: Falls back to in-memory rate limiting if Redis unavailable (dev mode)

### Environment Variables
Required environment variables for development and production:

```bash
# OpenAI API (Required)
OPENAI_API_KEY=sk-...

# Redis Rate Limiting (Required for Production)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Optional
NODE_ENV=development|production
ANALYZE=true  # Enable bundle analyzer
```

**Setup**:
1. Copy `.env.example` to `.env.local`
2. Add your API keys
3. Never commit `.env*` files (already in `.gitignore`)

### Adding Agent Tools
1. Schema in `lib/agent-tools/schemas.ts` (Zod)
2. Handler in `src/app/api/tools/[name]/route.ts` (POST, validate, return `{success, data?, error?}`)
3. Update `lib/agent-knowledge-base.ts`
4. Test: `curl -X POST http://localhost:3000/api/tools/[name] -H "Content-Type: application/json" -d '{}'`

## Design System

**Components**: 40+ shadcn/ui primitives in `src/components/ui/`
**Icons**: Lucide React (never emojis) - use named imports for tree-shaking
**Animation**: Framer Motion (`motion` from `motion/react`)
**Font**: Inter with fallbacks
**Figma**: [Design file](https://www.figma.com/design/GGCkxSgirBbmjQlioQKWEa/omerakben.com?node-id=0-1) + `/archive/omer-akben-design/` patterns

### Next.js Config Highlights
- **Security**: CSP headers, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Performance**: Lucide tree-shaking via `modularizeImports` (prevents full library import)
- **Images**: AVIF/WebP optimization, lazy loading, responsive sizing
- **Caching**: Aggressive (1-year `/assets/*`, 1-day images with stale-while-revalidate)
- **Console**: Logs removed in production (except `error`/`warn` for monitoring)
- **Bundle Analysis**: Enable with `ANALYZE=true npm run build`

### Middleware (`src/middleware.ts`)
- **Rate Limiting**: Redis-backed request throttling per route pattern
- **Monitoring**: Request tracking and limit violation logging
- **Headers**: Rate limit info in response (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`)
- **Paths**: Applies to `/api/*` routes only (excludes static assets)

## Common Pitfalls

1. **Icon imports**: Never `import * as Icons from 'simple-icons'` - use `getIcon()` from icon-manifest (2.3MB → 236KB)
2. **Archive imports**: Never `import from '/archive/'` - reference patterns only, adapt to `src/` with `@/` imports
3. **Hardcoded colors**: Only use CSS custom properties (`bg-brand-primary`), never hex (`#00FFC6`)
4. **Brightness testing**: Test all 8 modes (-3 to +3, auto), not just default
5. **Data fabrication**: Use `data/facts.ts` only, never assume personal info
6. **Client API calls**: All OpenAI calls server-side, never expose keys in browser
7. **Inline styles**: Use Tailwind classes or CSS custom properties, never `style={{...}}`
8. **Hydration mismatches**: Always use `isMounted` pattern when using localStorage/client-only state (see `app/layout.tsx`, `components/app-header.tsx`)
9. **Layout constraints**: Single source of truth is `LayoutContainer` in root layout - never duplicate width calculations

## Troubleshooting

**Build Errors**:
- "Module not found" → use `@/` imports, not relative or `/archive/`
- TypeScript errors → run `npx tsc --noEmit` to see all errors
- ESLint errors → `npm run lint` (scripts/ excluded from linting)

**Development**:
- Port occupied → `lsof -ti:3000 | xargs kill`
- Brightness modes → Toggle `data-brightness` on `<html>` in DevTools (-3 to +3, auto)
- Bundle size → `npm run analyze` to see bundle composition

**AI Chat Debugging**:
- Tool rendering → Check `message.parts` array (NOT `toolInvocations`)
- Filter by `part.type === "tool-{name}"` and verify `part.result` exists
- Rate limits → Check middleware logs, verify Redis env vars in production
- Hydration errors → Ensure `isMounted` pattern used for localStorage state
- Sidebar state → Check localStorage keys: `sidebar_pinned`, `sidebar_width`

**Tests**:
- Single test → `npm test -- filename.test.tsx`
- E2E failures → `npm run test:e2e:headed` to see browser
- Coverage → `npm test -- --coverage`

## Key Files

**Data** (source of truth):
- `src/data/facts.ts` - Personal info, skills
- `src/data/projects.ts` - Project catalog
- `src/lib/agent-knowledge-base.ts` - AI agent context
- `src/config/assistantFaq.ts` - Fact Bank and intent libraries for follow-ups

**Sidebar Assistant** (Ozzy AI):
- `src/lib/chat-sidebar-context.tsx` - State management (isOpen, isPinned, width, threadId)
- `src/components/chat/chat-sidebar.tsx` - Main sidebar UI with resizing, pinning
- `src/lib/thread-memory.ts` - Conversation persistence with pinned/width state
- `src/lib/followups.ts` - Intent detection and follow-up generation
- `src/components/chat/FollowupChips.tsx` - Contextual question suggestions
- `src/components/global-chat-button.tsx` - Floating chat access
- `src/components/actions/EmailActionButton.tsx` - mailto integration
- `src/components/actions/ResumeDownloadButton.tsx` - Multi-format download

**Config**:
- `src/lib/agent-tools/schemas.ts` - Zod validation schemas
- `src/lib/rate-limit.ts` - Redis rate limiting configuration
- `src/middleware.ts` - Rate limiting and request processing
- `next.config.ts` - Security headers, optimizations, Lucide tree-shaking
- `vitest.config.ts` - Unit test config (excludes archive/)
- `playwright.config.ts` - E2E test config
- `.gitignore` - Test artifacts excluded (playwright-report/, test-results/, .playwright-mcp/)

**Scripts**:
- `scripts/generate-icons.js` - Build-time icon manifest generation (42 icons, 90% bundle reduction)
- `scripts/health-100-day1.sh` - Health score improvement automation

**Docs**:
- `README.md` - PRD and architecture docs
- `TODO.md` - Implementation roadmap with health score tracking
- `AI_AGENT.md` - Agent documentation and capabilities
- `claudedocs/` - Additional documentation and analyses
