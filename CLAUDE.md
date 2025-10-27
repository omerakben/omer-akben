# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Production Status

**Live Site:** <https://omerakben.com/>
**Status:** Production deployment active
**Deployment:** Vercel (main branch → production)

## Git Workflow

**Branch Strategy:**

- `main` - Production branch (auto-deploys to <https://omerakben.com/>)
- `pre-deployment` - Pre-production staging branch (all features branch from here)
- `feature/*` - Feature branches (branch from `pre-deployment`, merge back via PR)

**Critical Rules:**

1. **Always branch from `pre-deployment`** for new features
2. **All 6 quality gates MUST pass** before merging to `pre-deployment`
3. **Pre-deployment → main** merges require manual approval after testing
4. **Never commit directly to main** - production deployments are intentional

**Workflow Example:**

```bash
git checkout pre-deployment
git pull origin pre-deployment
git checkout -b feature/contact-collection
# Make changes, test locally
npm test && npm run lint && npx tsc --noEmit && npm run build && npm run size
git commit -m "feat: add contact collection tool"
git push origin feature/contact-collection
# Create PR to pre-deployment, wait for CI/CD
# After approval, merge to pre-deployment
# Test on staging, then merge pre-deployment → main for production
```

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

**Critical Rules** (Zero Technical Debt Enforcement):

- Use `@/` imports only (never relative or `/archive/` imports - **archive is reference only**)
- Test all 8 brightness modes (-3 to +3, auto)
- Use CSS custom properties only (never hardcoded colors)
- All API calls server-side (never expose keys in browser)
- Never use emojis in UI (use Lucide icons)
- Redis rate limiting active (requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)
- **All 6 quality gates MUST pass before committing**: lint, tsc, test, build, size, e2e
- **Never skip tests or bypass validation** - fix root causes, not symptoms
- **E2E tests must wait for hydration** - account for SSR → client-side hydration timing
- **No TODO comments, console.log, or hardcoded values** - production-ready code only

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

**11 Server-Side Tools** (all in `src/app/api/tools/`):

1. `download_resume` - 4 formats (full, short, two-page, docx)
2. `download_certificate` - AWS, NSS certs
3. `list_projects` - Filter by category, featured, limit
4. `open_project` - Get project details by slug
5. `get_contact` - Contact information
6. `collect_contact` - Collect visitor info, send Zoom link via email (with rate limiting)
7. `navigate_page` - Page navigation links
8. `provide_navigation_links` - Navigation menu structure
9. `extract_summary` - Extract summaries from content
10. `profile_performance` - Performance profiling
11. `trigger_workflow` - Workflow execution

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
- **Episodic Memory**: `lib/mastra/memory/episodic.ts` - semantic search across conversations using Upstash Vector (1536-dim embeddings, KNN search)
- **Proactive Contact Collection**: `collect_contact` tool - Ozzy proactively offers to send Zoom link after 3+ engaged messages, sends via Resend email service with rate limiting (1 per IP per 24h)
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

**6. Proactive Contact Collection** ⚠️ **In Development**

See [OZZY_CONTACT_COLLECTION_PLAN.md](OZZY_CONTACT_COLLECTION_PLAN.md) for complete implementation plan.

**Overview**: Ozzy AI proactively collects visitor contact information and sends Zoom meeting links when conversations show mutual interest.

**Key Components:**

- **Email Service**: Resend with React Email templates
- **Tool**: `collect_contact` - Collects name, email, company, purpose
- **Rate Limiting**: 1 collection per IP per 24 hours (Redis-backed)
- **Engagement Tracking**: Proactive prompt after 3+ positive messages
- **Security**: Email validation, disposable email blocking, PII redaction, 7-day TTL

**Trigger Conditions:**

1. **Explicit Request**: User asks "send me the link", "email me", "schedule a call"
2. **Engagement Score ≥60**: Based on message count, topics discussed, projects viewed, resume downloads
3. **High-Value User**: Recruiter/hiring manager role + 3+ messages + multiple topics

**Email Flow:**

```text
User shows interest → Ozzy asks permission → User provides contact →
API validates email → Save to Redis (7-day TTL) → Send Resend email →
Return Zoom link immediately → Continue conversation
```

**Environment Variables Required:**

```bash
RESEND_API_KEY=re_...                              # Email service
OMER_ZOOM_LINK=https://calendly.com/.../30min     # Meeting link
OMER_EMAIL=me@omerakben.com                        # Reply-to address
```

**Implementation Status:**

- ✅ Resend account configured
- ✅ Email templates designed (React Email)
- ✅ Domain verification completed
- ⏳ Tool implementation in progress
- ⏳ Engagement tracking in progress
- ⏳ System prompt updates pending

---

## Development

### 🎯 Code Quality Standards (ZERO TECHNICAL DEBT)

**Status:** Production-ready codebase with comprehensive quality enforcement (achieved 2025-10-20)

All code changes MUST pass these quality gates before committing:

```bash
# 1. TypeScript Compilation (STRICT - 0 errors policy)
npx tsc --noEmit                    # Must return: 0 errors

# 2. ESLint (0 errors enforced, warnings reviewed)
npm run lint                        # Must return: 0 errors

# 3. Unit Tests (100% pass rate required)
npm test                            # Must return: 531/531 passing

# 4. Production Build (Must succeed)
npm run build                       # Must complete successfully

# 5. Bundle Size (Enforced via size-limit)
npm run size                        # Must not exceed configured limits
```

**CI/CD Integration:**

- GitHub Actions workflow: `.github/workflows/quality-gates.yml`
- Runs on every push/PR: lint → typecheck → test → build → size-limit
- Deployment blocked if any gate fails

### TypeScript Standards

**Strict Mode Enabled** - `tsconfig.json` with zero-tolerance error policy:

- ✅ `strict: true` - All strict checks enabled
- ✅ `noImplicitAny: true` - No implicit any types
- ✅ `strictNullChecks: true` - Null/undefined handled explicitly
- ✅ `noUnusedLocals: true` - Unused variables flagged
- ✅ `noUnusedParameters: true` - Unused params flagged
- ✅ `noFallthroughCasesInSwitch: true` - Switch completeness

**Type Assertion Pattern for Tests:**
When working with `json.data` after type guards, always use explicit assertions:

```typescript
// ✅ CORRECT - Explicit type assertion
if (isSuccessResponse(json)) {
  const data = json.data as { property: unknown };
  expect(data.property).toBe(value);
}

// ❌ WRONG - Direct access causes TS18046 error
if (isSuccessResponse(json)) {
  expect(json.data.property).toBe(value);  // Error: json.data is unknown
}
```

**Why:** Type guards narrow to `ApiResponse<T>` but T remains generic/unknown. Each test must document expected response shape via type assertions.

### ESLint Rules

**Zero Errors Policy** - ESLint configured with:

- ✅ TypeScript ESLint rules enabled
- ✅ React/React Hooks rules enforced
- ✅ Next.js specific rules active
- ✅ 0 errors, minimal warnings (<25)
- ✅ `scripts/` directory excluded (build scripts exempt)

**Current Status:**

- Errors: **0** (enforced in CI)
- Warnings: **20** (unused variables in tests - acceptable, not blocking)

**Acceptable Warnings:**

- Unused test utilities (e.g., `vi` import for type checking)
- Unused destructured variables in tests (e.g., `_` placeholder)
- Performance monitoring variables in tests

### Test Coverage

**531 Tests Across 27 Test Files** (100% pass rate required):

**API Route Tests** (12 files, 268 tests):

- Tool endpoint validation and error handling
- Zod schema compliance testing
- Response structure verification
- Edge case coverage

**Component Tests** (8 files, 155 tests):

- Global chat button (32 tests)
- Brightness control (23 tests)
- Navigation and UI components

**Integration Tests** (7 files, 108 tests):

- Thread memory persistence (27 tests)
- Follow-up suggestions (23 tests)
- Workflows (48 tests)
- AI agent orchestration

**Test Requirements:**

- All new features must include tests
- Minimum 80% code coverage for new code
- No skipped or disabled tests allowed
- TDD encouraged for complex logic

### Bundle Size Budget

**Enforced via `size-limit` package:**

```json
{
  "path": ".next/static/chunks/app/page.js",
  "limit": "260 KB",
  "current": "236 KB" ✅
}
```

**Achievements:**

- 90% bundle reduction (2.33MB → 236KB)
- Icon manifest generation (42 curated icons)
- Tree-shaking optimization (Lucide, simple-icons)
- Production build: 102KB shared chunks

### Quality Gates (All Must Pass)

**Pre-Commit Requirements:**

```bash
npm test          # 531/531 tests passing ✅
npm run lint      # 0 errors ✅
npx tsc --noEmit  # 0 TypeScript errors ✅
npm run build     # Build successful ✅
npm run size      # Within budget limits ✅
```

**Recent Quality Achievements:**

- ✅ TypeScript: 0 errors (fixed 90+ test errors) - achieved 2025-10-20
- ✅ ESLint clean (0 errors, 20 warnings) - achieved 2025-10-18
- ✅ Bundle optimization (236KB homepage, 193KB /skills) - achieved 2025-10-19
- ✅ Redis rate limiting implemented - achieved 2025-10-18
- ✅ No inline styles (all converted to Tailwind/CSS) - achieved 2025-10-19
- ✅ Debug logs removed (console.error retained for production) - achieved 2025-10-19
- ✅ Sidebar assistant with pinning, resizing, persistence - achieved 2025-10-19
- ✅ Hydration-safe Next.js patterns (isMounted) - achieved 2025-10-19
- ✅ 531 unit tests passing (from 72 → 175 → 531) - achieved 2025-10-20
- ✅ CI/CD quality gates workflow created - achieved 2025-10-20
- ✅ WCAG 2A compliance (8/8 E2E accessibility tests passing) - achieved 2025-10-21
- ✅ CI/CD environment variables configured for production deployment - achieved 2025-10-21

**Zero Technical Debt Status:**

- No TODO comments for core functionality
- No skipped/disabled tests
- No TypeScript `any` types (except third-party types)
- No ESLint disable comments (except justified cases)
- No inline styles or hardcoded colors
- No console.log statements (only console.error/warn for monitoring)

### 🚀 Launch Readiness Status

**Status: READY FOR PRODUCTION DEPLOYMENT** (as of 2025-10-21)

All quality gates passing, zero technical debt, WCAG 2A compliant, CI/CD configured.

**Recent Pre-Launch Hardening (2025-10-21):**

1. **Accessibility Compliance** - Fixed race conditions in E2E tests:
   - Root Cause: Playwright was running axe scans before React hydration completed
   - Solution: Added wait strategies (`waitUntil: "networkidle"`, loading spinner detection, 500ms stabilization)
   - Files Modified: `e2e/a11y.spec.ts`, `src/app/recruiter/page.tsx` (H3→H2 heading fixes)
   - Result: 8/8 routes passing WCAG 2A compliance (/, /projects, /skills, /journey, /credentials, /contact, /recruiter, /chat)

2. **CI/CD Environment Configuration**:
   - GitHub Actions secrets configured for production environment variables
   - Workflow updated to pass all Upstash secrets (Redis + Vector) to build/test/E2E steps
   - File Modified: `.github/workflows/quality-gates.yml`
   - Environment Variables Added: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`

**Quality Gates Status:**

```bash
✅ TypeScript:     0 errors (npx tsc --noEmit)
✅ ESLint:         0 errors, 21 warnings (npm run lint)
✅ Unit Tests:     531/531 passing (npm test)
✅ Build:          Success (npm run build)
✅ Bundle Size:    Within limits (npm run size)
✅ E2E Tests:      8/8 passing WCAG 2A (npm run test:e2e)
✅ CI/CD:          All gates green, env vars configured
```

**Deployment Checklist:**

- ✅ All environment variables in GitHub Actions secrets
- ✅ Production build succeeds with all environment variables
- ✅ Rate limiting configured (Redis-backed via Upstash)
- ✅ Episodic memory configured (Vector search via Upstash)
- ✅ Security headers configured (CSP, HSTS, X-Frame-Options)
- ✅ SEO metadata and OG images on all routes
- ✅ Privacy and Terms pages deployed and linked
- ✅ All 8 routes tested for accessibility (WCAG 2A)
- ✅ Bundle size within budget (7.73 KB / 40 KB homepage)
- ✅ PII redaction logger in place

**Critical Pre-Launch Rules:**

1. **Never Commit Without Passing Gates**: All 6 quality gates must pass (lint, tsc, test, build, size, e2e)
2. **Never Skip Tests**: No disabled, skipped, or commented-out tests allowed
3. **Never Bypass Validation**: No workarounds to make tests pass - fix root causes
4. **Zero Technical Debt**: No TODO comments, no console.log, no hardcoded values
5. **Always Wait for Hydration**: E2E tests must account for SSR → hydration timing
6. **Environment Variables Required**: All 8 env vars must be set in deployment environment (OpenAI, Upstash Redis, Upstash Vector, Resend)

### Test Configuration

- **Unit Tests**: Vitest + React Testing Library (`src/**/*.test.{ts,tsx}`) - **531 tests across 27 files**
  - API Routes (12 files, 268 tests) - Tool validation and error handling
  - Components (8 files, 155 tests) - UI behavior and interactions
  - Integration (7 files, 108 tests) - Workflows, memory, follow-ups
  - Watch mode: `npm test -- --watch`
  - Coverage: `npm test -- --coverage`
  - Single file: `npm test -- filename.test.tsx`

- **E2E Tests**: Playwright (`e2e/*.spec.ts`)
  - `a11y.spec.ts` - **WCAG 2A compliance on 8 routes** (/, /projects, /skills, /journey, /credentials, /contact, /recruiter, /chat)
  - `agentic-sidebar.spec.ts` - Sidebar pinning, resizing, persistence
  - `brightness-modes.spec.ts` - Brightness mode switching (8 modes)
  - Run all: `npm run test:e2e`
  - UI mode: `npm run test:e2e:ui`
  - Headed: `npm run test:e2e:headed`

  **Critical: Wait for Hydration** - E2E tests must account for SSR → client-side hydration:

  ```typescript
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".animate-spin", { state: "detached", timeout: 10000 });
  await page.waitForTimeout(500); // DOM stabilization
  ```

  Without these waits, axe scans run on intermediate DOM state before React hydration completes.

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

# Upstash Vector for Episodic Memory (Required for Production)
UPSTASH_VECTOR_REST_URL=https://your-vector-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-token

# Email Service - Resend (Required for Contact Collection)
RESEND_API_KEY=re_...
OMER_EMAIL=me@omerakben.com
OMER_ZOOM_LINK=https://us06web.zoom.us/j/2675124566?pwd=...

# Optional
NODE_ENV=development|production
ANALYZE=true  # Enable bundle analyzer
```

**Setup**:

1. Copy `.env.example` to `.env.local`
2. Add your API keys
3. Never commit `.env*` files (already in `.gitignore`)
4. For Resend: Set up domain verification at <https://resend.com/domains>

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
10. **TypeScript errors in tests**: Always use type assertions for `json.data` access after type guards (see TypeScript Standards section)
11. **Quality gates**: Never commit code that fails any quality gate (TypeScript, ESLint, tests, build, bundle size)

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
- `src/lib/mastra/memory/episodic.ts` - Episodic memory with Vector embeddings
- `src/lib/redis/vector-client.ts` - Upstash Vector client (singleton)
- `src/lib/redis/vector-search.ts` - KNN search abstraction layer
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
