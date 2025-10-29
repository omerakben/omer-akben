# AGENTS.md

**Unified Coding Standards for All AI Assistants**

This document provides mandatory guidelines for ALL AI coding agents (Claude Code, GitHub Copilot, Cursor, etc.) working on this repository. These rules ensure consistency, quality, and zero technical debt regardless of which AI assistant is being used.

> **Note**: This file is derived from CLAUDE.md but is agent-agnostic. Claude-specific workflows remain in CLAUDE.md. All agents must follow the standards defined here.

---

## 🚀 Production Status

**Live Site:** <https://omerakben.com/>
**Status:** Production deployment active
**Platform:** Vercel (main branch → production)

---

## 🎯 Quick Reference

### Essential Commands

```bash
npm run dev                                      # Dev server (Turbopack)
npm test                                         # Unit tests (531 tests)
npm test -- --watch                              # TDD mode
npm run test:e2e                                 # E2E tests (Playwright)
npm run build                                    # Production build
npm run lint                                     # ESLint check
npx tsc --noEmit                                 # TypeScript check
npm run size                                     # Bundle size check
npm run analyze                                  # Bundle analysis
```

### Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 + CSS Custom Properties
- **UI Components:** 40+ shadcn/ui primitives
- **AI:** Vercel AI SDK v5 + OpenAI API
- **Database:** Upstash Redis (rate limiting, caching) + Upstash Vector (episodic memory)
- **Testing:** Vitest (531 unit tests) + Playwright (E2E + A11y)

---

## ⚠️ MANDATORY RULES (Zero-Tolerance Policy)

These rules are **non-negotiable** and must be followed by all AI agents without exception:

### 1. Import Standards

- ✅ **USE:** `@/` imports only (e.g., `import { facts } from '@/data/facts'`)
- ❌ **NEVER:** Relative imports (`../../data/facts`) or archive imports (`/archive/...`)
- ❌ **NEVER:** Wildcard imports for icons (`import * as Icons from 'simple-icons'`)
- ✅ **ALWAYS:** Use icon manifest (`import { getIcon } from '@/lib/icon-manifest'`)

### 2. Quality Gates (All Must Pass Before Commit)

```bash
# Run ALL 6 gates before committing - NO EXCEPTIONS
npm run lint          # Must return: 0 errors
npx tsc --noEmit      # Must return: 0 errors
npm test              # Must return: 531/531 passing
npm run build         # Must complete successfully
npm run size          # Must not exceed limits
npm run test:e2e      # Must pass all E2E tests
```

**Consequence**: Code that fails ANY quality gate MUST NOT be committed.

### 3. Zero Technical Debt Policy

- ❌ **NO TODO comments** - implement features completely or don't start
- ❌ **NO console.log** - use console.error/warn for monitoring only
- ❌ **NO hardcoded colors** - use CSS custom properties only (`bg-brand-primary`, never `#00FFC6`)
- ❌ **NO inline styles** - use Tailwind classes or CSS custom properties
- ❌ **NO disabled/skipped tests** - fix root causes, don't bypass validation
- ❌ **NO TypeScript `any`** - use proper types (except third-party declarations)
- ❌ **NO ESLint disable comments** - fix issues, don't suppress them

### 4. Server-Side Security

- ✅ **ALL API calls server-side** - OpenAI, Redis, Resend, all secrets in API routes
- ❌ **NEVER expose API keys** - no secrets in client-side code or browser
- ✅ **Environment variables** - server-side only, never in `NEXT_PUBLIC_*` unless explicitly public

### 5. Design System Compliance

- ✅ **Brightness modes:** Test all 8 modes (-3 to +3, auto) for every UI change
- ✅ **CSS custom properties:** Use `bg-surf-{0,1,2}`, `text-text-{1,2,3}`, `border-border-line`
- ✅ **Icons:** Lucide React only (never emojis) with named imports
- ✅ **Archive directory:** Reference patterns only, NEVER import from `/archive/`

### 6. Data Integrity

- ✅ **Single source of truth:** `src/data/facts.ts` for personal info
- ❌ **NEVER fabricate data** - use only what exists in data files
- ❌ **NEVER assume personal details** - verify in `facts.ts` first

### 7. Next.js Hydration Safety

- ✅ **Always use `isMounted` pattern** for localStorage/client-only state
- ✅ **E2E tests must wait for hydration** - use `waitUntil: "networkidle"` + stabilization delays
- ❌ **NEVER access localStorage during SSR** - causes hydration mismatches

---

## 📐 Git Workflow

### Branch Strategy

- `main` - Production branch (auto-deploys to <https://omerakben.com/>)
- `pre-deployment` - Pre-production staging (all features branch from here)
- `feature/*` - Feature branches (branch from `pre-deployment`, merge back via PR)

### Workflow Rules

1. **Always branch from `pre-deployment`** for new features
2. **All 6 quality gates MUST pass** before merging to `pre-deployment`
3. **Pre-deployment → main** auto-merges after all quality gates pass (no manual intervention)
4. **Never commit directly to main** - all production deployments go through `pre-deployment`

### Example Workflow

```bash
git checkout pre-deployment
git pull origin pre-deployment
git checkout -b feature/new-tool
# Make changes, test locally
npm test && npm run lint && npx tsc --noEmit && npm run build && npm run size && npm run test:e2e
git commit -m "feat(tools): add new AI agent tool"
git push origin feature/new-tool
# Create PR to pre-deployment, wait for CI/CD
# After approval, merge to pre-deployment
# CI/CD auto-merges pre-deployment → main after all gates pass
```

### CI/CD Auto-Merge Workflow

**Workflow File:** `.github/workflows/pre-deployment-to-main.yml`

When you push to `pre-deployment`, GitHub Actions automatically:

**1. Runs 6 Quality Gates:**

- Gate 1: ESLint (0 errors)
- Gate 2: TypeScript (0 errors)
- Gate 3: Unit Tests (541/541 passing)
- Gate 4: Production Build (success)
- Gate 5: Bundle Size (within limits)
- Gate 6: E2E Tests (8/8 routes WCAG 2A)

**2. Auto-Merges to Main** (if all gates pass):

- Fast-forward merge `pre-deployment` → `main`
- Creates deployment tag (`deploy-YYYYMMDD-HHMMSS`)
- Triggers Vercel production deployment

**3. Deployment** (Vercel):

- `main` branch auto-deploys to <https://omerakben.com/>
- Environment variables from Vercel project settings
- Zero-downtime deployment

**Safety Mechanisms:**

- ✅ **No manual main commits** - All changes go through `pre-deployment` first
- ✅ **Atomic quality gates** - One failure blocks entire workflow
- ✅ **Fast-forward only** - Prevents merge conflicts, ensures linear history
- ✅ **Deployment tags** - Track every production deployment

**Monitoring:**

- GitHub Actions: <https://github.com/omerakben/omer-akben/actions>
- Workflow runs on every `pre-deployment` push
- Email notifications on workflow failure
- Deployment tags for rollback capability

---

## 🏗️ Architecture Overview

### Key Directories

```
src/
├── app/              # Next.js App Router pages + API routes
│   ├── api/tools/    # 11 AI agent tools (all server-side)
│   └── (pages)/      # Frontend routes
├── components/       # React components
│   ├── ui/           # 40+ shadcn/ui primitives
│   └── chat/         # Sidebar assistant components
├── data/             # Source of truth (facts, projects, skills)
├── lib/              # Utilities, contexts, AI logic
│   ├── agent-tools/  # Tool schemas (Zod validation)
│   ├── mastra/       # Memory systems (episodic, semantic)
│   └── redis/        # Vector search + rate limiting
└── config/           # Configuration files

archive/              # Portfolio demos (REFERENCE ONLY - never import)
```

### Path Aliases

- `@/*` → `./src/*` (ALWAYS use this for imports)

---

## 🤖 AI Agent Architecture (Vercel AI SDK v5)

### 11 Server-Side Tools

All tools in `src/app/api/tools/`:

1. `download_resume` - 4 resume formats
2. `download_certificate` - AWS, NSS certificates
3. `list_projects` - Filterable project catalog
4. `open_project` - Project details by slug
5. `get_contact` - Contact information
6. `collect_contact` - Proactive contact collection with email delivery (rate limit: 5/IP/24h)
7. `navigate_page` - Page navigation
8. `provide_navigation_links` - Navigation structure
9. `extract_summary` - Content summarization
10. `profile_performance` - Performance profiling
11. `trigger_workflow` - Workflow execution

### Data Flow

```
Chat UI → AI SDK streaming → Tool call → Zod validation → Handler → JSON response
```

### Critical Tool Implementation Details

**AI SDK v5 Tool Rendering:**
- Tool invocations in `message.parts` array, NOT `toolInvocations` property
- Filter by `part.type === "tool-{toolName}"` and check `part.result` exists
- Structure: `{ type: "tool-{name}", toolCallId: "...", result: {...} }`

**Knowledge Base:**
- Single source: `lib/agent-knowledge-base.ts`
- Curated context for AI responses
- Updated via data files, never hardcoded

---

## 🎨 Unique Design Patterns

### 1. 8-Mode Brightness System (CRITICAL)

**Implementation:**
- Modes: -3 (darkest) → 0 (baseline) → +3 (brightest) + auto
- `data-brightness` attribute on `<html>` element
- CSS custom properties in `globals.css`
- State: `lib/brightness-context.tsx`

**Mandatory Usage:**
- ✅ **ALWAYS:** `bg-surf-{0,1,2}`, `text-text-{1,2,3}`, `bg-brand-primary`, `border-border-line`
- ❌ **NEVER:** Hardcoded colors like `#00FFC6` or `bg-[#00FFC6]`

**Testing Requirement:**
- MUST test all 8 modes for every UI change
- Toggle in DevTools: modify `data-brightness` on `<html>`

### 2. Sidebar Assistant (Ozzy AI)

**State Management:**
- Context: `lib/chat-sidebar-context.tsx`
- Persistence: `lib/thread-memory.ts` (localStorage)
- States: `isOpen`, `isPinned`, `width` (320-800px), `threadId`

**Layout Integration:**
- Single constraint source: `LayoutContainer` in `app/layout.tsx`
- Applies `marginRight` when sidebar is pinned
- Navbar/footer naturally constrained

**Hydration Safety:**
- Uses `isMounted` pattern to prevent mismatches
- localStorage access only after client-side mount

**Features:**
- Pinned/unpinned modes with persistence
- Resizable width (320-800px)
- Follow-up question suggestions (`FollowupChips.tsx`)
- Action buttons (email, resume download)
- Keyboard shortcuts (Cmd/Ctrl+Shift+N for new chat)

### 3. Icon Optimization (CRITICAL)

**Achievement:** 90% bundle reduction (2.33MB → 236KB)

**Implementation:**
- Icon manifest: `src/lib/icon-manifest.ts` (42 curated icons)
- Generation script: `scripts/generate-icons.js` (runs during build)
- Usage: `import { getIcon } from '@/lib/icon-manifest'` then `getIcon('react')`

**Enforcement:**
- ❌ **NEVER:** `import * as Icons from 'simple-icons'`
- ✅ **ALWAYS:** Use manifest for tree-shaking

### 4. Data Architecture

**Source of Truth:**
- `data/facts.ts` - Personal information (skills, experience, education)
- `data/projects.ts` - Project catalog with helper functions
- `config/assistantFaq.ts` - FAQ and intent libraries

**Export Pattern:**
- Typed objects + helper functions
- TypeScript interfaces for type safety
- Validation via Zod schemas where needed

### 5. Memory Systems

**Episodic Memory:**
- Implementation: `lib/mastra/memory/episodic.ts`
- Storage: Upstash Vector (1536-dim OpenAI embeddings)
- KNN search for conversation history retrieval
- Client: `lib/redis/vector-client.ts` (singleton pattern)

**Semantic Memory:**
- User facts stored as JSON in Redis
- Thread state persistence in `lib/thread-memory.ts`

**Vector Search:**
- Dual-path routing in `lib/redis/vector-search.ts`
- Projects → Redis FT.SEARCH (`project_embeddings_idx`)
- Episodic → Upstash Vector (conversation history)

### 6. Rate Limiting (Production-Ready)

**Implementation:**
- Redis-backed via Upstash (`@upstash/ratelimit`)
- Configuration: `src/lib/rate-limit.ts`
- Middleware: `src/middleware.ts` (applied before request processing)

**Tiers:**
- Chat API (`/api/chat`): 30 requests/min
- Tools API (`/api/tools/*`): 60 requests/min
- Generic API (`/api/*`): 100 requests/min

**Graceful Degradation:**
- Falls back to in-memory rate limiting if Redis unavailable

### 7. Contact Collection System (Production-Ready)

**Feature:** `collect_contact` tool - Proactive visitor engagement with automated email delivery

**Implementation:** `src/lib/tools/implementations/collect-contact.ts`

**Components:**
- **Email Service:** Resend API with React Email templates (`lib/email/templates/ZoomLinkEmail.tsx`)
- **Rate Limiting:** 5 requests per IP per 24 hours (increased from 1 for recruiter team sharing)
- **Storage:** Redis-backed contact persistence with 7-day TTL
- **Validation:** Email format validation, disposable email blocking, PII redaction

**Trigger Conditions:**
1. **Explicit Request:** User asks "send me the link", "email me", "schedule a call"
2. **Engagement Score ≥60:** Based on message count, topics discussed, projects viewed
3. **High-Value User:** Recruiter/hiring manager + 3+ messages + multiple topics

**Email Flow:**
```
User shows interest → Ozzy asks permission → User provides contact →
Validate email → Save to Redis (7-day TTL) → Send via Resend →
Return Zoom link immediately → Continue conversation
```

**Email Template Features:**
- Professional branding with Omer's contact info
- Direct Calendly/Zoom meeting link
- Resume download links (Original + Extended PDF formats)
- Clean HTML/text fallback design
- Reply-to address configured

**Environment Variables Required:**
```bash
RESEND_API_KEY=re_...                              # Email service
OMER_ZOOM_LINK=https://calendly.com/.../30min     # Meeting link
OMER_EMAIL=me@omerakben.com                        # Reply-to address
```

**Security Features:**
- Server-side only (no client exposure of API keys)
- Email validation with format checking
- Rate limiting prevents spam (5 per IP per 24h)
- PII redaction in logs
- 7-day contact data retention

**Rationale for 5/24h Limit:**
- Original: 1 request per 24 hours per IP (too restrictive)
- Updated: 5 requests per 24 hours per IP
- Reasoning: Allows recruiting teams at same company (shared IP) to each use the feature
- Balance: Prevents spam while supporting legitimate business use case

---

## 🧪 Quality Standards

### TypeScript (Strict Mode)

**Configuration:** `tsconfig.json` with zero-tolerance error policy

**Enabled Checks:**
- ✅ `strict: true` - All strict checks
- ✅ `noImplicitAny: true` - No implicit any types
- ✅ `strictNullChecks: true` - Explicit null/undefined handling
- ✅ `noUnusedLocals: true` - Flag unused variables
- ✅ `noUnusedParameters: true` - Flag unused parameters
- ✅ `noFallthroughCasesInSwitch: true` - Switch completeness

**Type Assertion Pattern for Tests:**
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

**Current Status:** 0 errors (enforced in CI/CD)

### ESLint (Zero Errors Policy)

**Configuration:**
- TypeScript ESLint rules enabled
- React/React Hooks rules enforced
- Next.js specific rules active
- `scripts/` directory excluded (build scripts exempt)

**Current Status:**
- Errors: **0** (enforced in CI/CD)
- Warnings: **21** (acceptable, not blocking)

**Acceptable Warnings:**
- Unused test utilities (e.g., `vi` import for type checking)
- Unused destructured variables in tests (e.g., `_` placeholder)

### Test Coverage

**531 Tests Across 27 Files** (100% pass rate required)

**Distribution:**
- API Routes: 12 files, 268 tests
- Components: 8 files, 155 tests
- Integration: 7 files, 108 tests

**Test Types:**
- Unit: Vitest + React Testing Library (`src/**/*.test.{ts,tsx}`)
- E2E: Playwright (`e2e/*.spec.ts`) including WCAG 2A compliance
- Watch mode: `npm test -- --watch`
- Coverage: `npm test -- --coverage`
- Single file: `npm test -- filename.test.tsx`

**E2E Critical Pattern - Wait for Hydration:**
```typescript
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector(".animate-spin", { state: "detached", timeout: 10000 });
await page.waitForTimeout(500); // DOM stabilization
```

Without these waits, E2E tests run on intermediate DOM state before React hydration completes.

### Bundle Size Budget

**Enforced via `size-limit`:**
- Homepage: 7.73 KB / 40 KB limit ✅
- Skills page: 6.31 KB / 40 KB limit ✅

**Achievements:**
- 90% bundle reduction (2.33MB → 236KB) via icon optimization
- 102KB shared chunks in production build

### Accessibility (WCAG 2A Compliance)

**Status:** 8/8 routes passing (achieved 2025-10-21)

**E2E Tests:** `e2e/a11y.spec.ts` scans all key routes:
- `/` (homepage)
- `/projects` (project catalog)
- `/skills` (skills showcase)
- `/journey` (career timeline)
- `/credentials` (certifications)
- `/contact` (contact form)
- `/recruiter` (recruiter landing)
- `/chat` (AI assistant)

**Requirements:**
- Zero critical violations from axe-core
- Proper heading hierarchy
- Color contrast AA compliance (all 8 brightness modes)
- Keyboard navigation support
- Screen reader compatibility

---

## 🚨 Common Pitfalls (AVOID THESE)

1. **Icon imports** - Never `import * as Icons from 'simple-icons'` (use icon manifest)
2. **Archive imports** - Never `import from '/archive/'` (reference patterns only)
3. **Hardcoded colors** - Only CSS custom properties (`bg-brand-primary`), never hex (`#00FFC6`)
4. **Brightness testing** - Must test all 8 modes (-3 to +3, auto), not just default
5. **Data fabrication** - Use `data/facts.ts` only, never assume personal info
6. **Client API calls** - All OpenAI/Redis calls server-side, never expose keys in browser
7. **Inline styles** - Use Tailwind classes or CSS custom properties, never `style={{...}}`
8. **Hydration mismatches** - Always use `isMounted` pattern for localStorage/client-only state
9. **Layout constraints** - Single source of truth is `LayoutContainer` in root layout
10. **TypeScript errors in tests** - Always use type assertions for `json.data` access after type guards
11. **Quality gates** - Never commit code that fails any quality gate
12. **Skipping tests** - Never disable/skip tests to make builds pass - fix root causes

---

## 📝 Environment Variables

### Required for Development

```bash
# OpenAI API (Required)
OPENAI_API_KEY=sk-...

# Upstash Redis - Rate Limiting & Caching (Required for Production)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Upstash Vector - Episodic Memory (Required for Production)
UPSTASH_VECTOR_REST_URL=https://your-vector-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-token

# Resend - Email Service (Required for Contact Collection)
RESEND_API_KEY=re_...
OMER_EMAIL=me@omerakben.com
OMER_ZOOM_LINK=https://calendly.com/omerakben/30min
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/omerakben/30min

# Optional
NODE_ENV=development|production
ANALYZE=true  # Enable bundle analyzer
```

### Setup Instructions

1. Copy `.env.example` to `.env.local`
2. Add your API keys
3. Never commit `.env*` files (already in `.gitignore`)
4. For Resend: Set up domain verification at <https://resend.com/domains>

---

## 🔑 Key Files Reference

### Data (Source of Truth)

- `src/data/facts.ts` - Personal info, skills, experience
- `src/data/projects.ts` - Project catalog with helpers
- `src/config/assistantFaq.ts` - FAQ and intent libraries
- `src/lib/agent-knowledge-base.ts` - AI agent context

### Sidebar Assistant (Ozzy AI)

- `src/lib/chat-sidebar-context.tsx` - State management
- `src/components/chat/chat-sidebar.tsx` - Main sidebar UI
- `src/lib/thread-memory.ts` - Conversation persistence
- `src/lib/mastra/memory/episodic.ts` - Episodic memory (Vector embeddings)
- `src/lib/redis/vector-client.ts` - Upstash Vector client (singleton)
- `src/lib/redis/vector-search.ts` - KNN search abstraction
- `src/lib/followups.ts` - Intent detection and follow-up generation
- `src/components/chat/FollowupChips.tsx` - Question suggestions

### Configuration

- `src/lib/agent-tools/schemas.ts` - Zod validation schemas
- `src/lib/rate-limit.ts` - Redis rate limiting config
- `src/middleware.ts` - Rate limiting and request processing
- `next.config.ts` - Security headers, optimizations, Lucide tree-shaking
- `vitest.config.ts` - Unit test config (excludes archive/)
- `playwright.config.ts` - E2E test config
- `.gitignore` - Test artifacts excluded

### Scripts

- `scripts/generate-icons.js` - Build-time icon manifest generation
- `scripts/health-100-day1.sh` - Health score improvement automation

### Documentation

- `README.md` - Project overview and architecture
- `TODO.md` - Implementation roadmap
- `CLAUDE.md` - Claude-specific workflows (extends this file)
- `AI_AGENT.md` - Agent documentation and capabilities
- `OZZY_CONTACT_COLLECTION_PLAN.md` - Contact collection implementation plan

---

## 🎓 Adding New Agent Tools

To add a new AI agent tool:

1. **Define Schema** - Add Zod schema in `lib/agent-tools/schemas.ts`
2. **Create Handler** - New file: `src/app/api/tools/[name]/route.ts`
   - Export POST function
   - Validate request with schema
   - Return `{success: boolean, data?: T, error?: string}`
3. **Update Knowledge Base** - Add tool to `lib/agent-knowledge-base.ts`
4. **Write Tests** - Create `src/app/api/tools/[name]/route.test.ts`
5. **Test Locally** - `curl -X POST http://localhost:3000/api/tools/[name] -H "Content-Type: application/json" -d '{}'`
6. **Run Quality Gates** - All 6 must pass before committing

---

## 🐛 Troubleshooting

### Build Errors

- "Module not found" → Use `@/` imports, not relative or `/archive/`
- TypeScript errors → Run `npx tsc --noEmit` to see all errors
- ESLint errors → Run `npm run lint` (scripts/ excluded from linting)

### Development

- Port occupied → `lsof -ti:3000 | xargs kill`
- Brightness modes → Toggle `data-brightness` on `<html>` in DevTools
- Bundle size → Run `npm run analyze` to see bundle composition

### AI Chat Debugging

- Tool rendering → Check `message.parts` array (NOT `toolInvocations`)
- Rate limits → Check middleware logs, verify Redis env vars
- Hydration errors → Ensure `isMounted` pattern for localStorage state
- Sidebar state → Check localStorage keys: `sidebar_pinned`, `sidebar_width`

### Tests

- Single test → `npm test -- filename.test.tsx`
- E2E failures → `npm run test:e2e:headed` to see browser
- Coverage → `npm test -- --coverage`
- E2E hydration issues → Add wait strategies (networkidle + stabilization)

---

## ✅ Launch Readiness Status

**Current Status:** READY FOR PRODUCTION DEPLOYMENT (as of 2025-10-21)

### Quality Gates Status

```bash
✅ TypeScript:     0 errors (npx tsc --noEmit)
✅ ESLint:         0 errors, 21 warnings (npm run lint)
✅ Unit Tests:     531/531 passing (npm test)
✅ Build:          Success (npm run build)
✅ Bundle Size:    Within limits (npm run size)
✅ E2E Tests:      8/8 passing WCAG 2A (npm run test:e2e)
✅ CI/CD:          All gates green, env vars configured
```

### Pre-Launch Checklist

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

---

## 📚 Recent Implementation Notes (October 2025)

### Contact Collection Feature

**PR:** #43 - Recruiter Email System with Proactive Contact Collection

**Timeline:** October 27-29, 2025

**Key Implementation:**

1. **Rate Limit Optimization**
   - Initial: 1 request per IP per 24 hours (too restrictive)
   - Final: 5 requests per IP per 24 hours
   - Rationale: Support recruiting teams at same company (shared IP) while preventing spam
   - Files: `src/lib/rate-limit.ts`, `src/lib/tools/implementations/collect-contact.ts`

2. **Email Template Enhancement**
   - Added resume download links directly in email (Google Drive)
   - Original Resume: [Link](https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view?usp=sharing)
   - Extended Resume: [Link](https://drive.google.com/file/d/1LiK6Q6BpnbfitPR-diaWR3ckGFv7yNFo/view?usp=sharing)
   - Professional branding with React Email components
   - File: `src/lib/email/templates/ZoomLinkEmail.tsx`

3. **Resume Format Standardization**
   - Removed ALL DOCX mentions from AI knowledge base
   - Only 2 PDF formats available: Original and Extended
   - DOCX kept private for direct job applications only
   - Updated 3 schema files: `agent-knowledge-base.ts`, `tools/zod-schemas.ts`, `agent-tools/schemas.ts`

4. **Tool Description Updates**
   - Mastra tool: `downloadResumeTool` - explicitly states "Only 2 PDF formats available"
   - AI SDK tool: `downloadResume` - schema validation enforces PDF-only
   - Prevented AI Ozzy from offering unavailable DOCX format

**Testing Approach:**
- Manual validation via Playwright for real browser testing
- Verified email template rendering and link accessibility
- Tested AI agent responses to ensure no DOCX mentions
- All 6 quality gates passed (lint, tsc, test, build, size, e2e)

**Security Considerations:**
- Server-side API key management (Resend)
- Rate limiting via Redis (Upstash)
- Email validation and sanitization
- PII redaction in logs
- 7-day contact data retention

---

### Lessons Learned

**1. Rate Limiting Strategy**
- **Learning:** Initial rate limits may be too conservative for real-world usage patterns
- **Solution:** Consider business context (recruiting teams share IPs) when setting limits
- **Balance:** 5 requests per 24h prevents spam while supporting legitimate collaboration
- **Implementation:** Simple numeric change in `Ratelimit.slidingWindow()` configuration

**2. Email Template Design**
- **Learning:** Include all relevant resources (resume links) directly in email
- **Benefit:** Reduces friction - recipients get everything they need in one message
- **Implementation:** Direct Google Drive links with descriptive labels
- **User Experience:** Recipients can download resumes without additional navigation

**3. AI Knowledge Base Consistency**
- **Learning:** AI agent knowledge base must be single source of truth
- **Problem:** Multiple schema files caused inconsistent AI responses about resume formats
- **Solution:** Updated ALL schema locations (3 files) + knowledge base documentation
- **Prevention:** Document which formats exist and explicitly state unavailable formats

**4. Manual Testing for AI Behavior**
- **Learning:** Unit tests validate API logic, but can't verify AI agent responses
- **Tool:** Playwright for real browser testing of AI conversations
- **Validation:** Manually tested that AI Ozzy no longer mentions DOCX format
- **Coverage:** Tested edge cases like "do you have Word format?" queries

**5. Documentation Completeness**
- **Learning:** Implementation notes should capture rationale, not just changes
- **Important:** Document WHY decisions were made (e.g., rate limit increase from 1→5)
- **Benefit:** Future developers understand trade-offs and business context
- **Practice:** Update AGENTS.md and CLAUDE.md after significant implementations

**6. Environment Variable Management**
- **Learning:** New features often require new environment variables
- **Checklist:** Update `.env.example`, document in AGENTS.md/CLAUDE.md, configure in CI/CD
- **Security:** Never expose secrets in client-side code or commit to version control
- **Verification:** Test that production deployment has all required env vars

**7. Quality Gate Enforcement**
- **Learning:** All 6 quality gates must pass before merge (no exceptions)
- **Gates:** TypeScript (0 errors), ESLint (0 errors), Tests (531/531), Build, Size, E2E
- **Benefit:** Catches regressions early, maintains zero technical debt
- **CI/CD:** GitHub Actions enforces gates on every push to pre-deployment

---

## 📋 Summary: Core Principles

1. **Quality First** - All 6 quality gates must pass before commit
2. **Zero Technical Debt** - No TODO, console.log, hardcoded values, or disabled tests
3. **Type Safety** - Strict TypeScript, 0 errors policy
4. **Accessibility** - WCAG 2A compliance on all routes
5. **Performance** - Bundle size budgets enforced, icon optimization active
6. **Security** - Server-side secrets only, rate limiting active, PII redaction
7. **Testing** - 531 unit tests + E2E coverage, 100% pass rate
8. **Consistency** - Design tokens only, 8 brightness modes tested
9. **Documentation** - Code is self-documenting, patterns are clear
10. **Production Ready** - Live deployment, CI/CD configured, monitoring active

---

**Version:** 1.0
**Last Updated:** October 27, 2025
**Maintained By:** All AI coding agents working on this repository
**Related Files:** CLAUDE.md (Claude-specific), README.md (project overview)
