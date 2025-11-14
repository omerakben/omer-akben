# CLAUDE.MD - Strategic Router & Quick Reference

**Purpose:** Navigate to the right agent, skill, or command for any task.

---

## 🎯 Quick Start (5 Essential Commands)

```bash
# 1. Development server with hot reload
npm run dev

# 2. Run all 6 quality gates (BEFORE committing)
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size && npm run test:e2e

# 3. Test-driven development mode
npm test -- --watch

# 4. E2E tests with visible browser
npm run test:e2e -- --headed

# 5. Bundle size analysis
npm run analyze
```

---

## 🤖 Agent Selection Guide

**Use this decision tree to select the right agent:**

### Frontend & UI Changes

**Agent:** `ui-ux-developer` + `nextjs-architect`

- Styling, layout, responsive design
- Component creation/modification
- Brightness system implementation
- Animation and transitions

**Skills:** brightness-system, hydration-safety

### API & Backend Logic

**Agent:** `ai-sdk-specialist` + `nextjs-architect`

- AI agent tools
- API route handlers
- Server actions
- Vercel AI SDK integration

**Skills:** aI-agent-implementation, environment-configuration

### Testing & Quality

**Agent:** `test-engineer`

- Writing unit tests
- E2E test creation
- Fixing test failures
- Quality gate debugging

**Skills:** testing-and-quality-gates
**Commands:** quality-gates

### Performance & Optimization

**Agent:** `mastra-optimization-researcher`

- Bundle size reduction
- Memory optimization
- Vector search tuning
- Agent performance

**Skills:** bundle-optimization (coming Phase 2), redis-integration (coming Phase 2)

### Deployment & CI/CD

**Agent:** `deployment-engineer`

- GitHub Actions workflows
- Vercel configuration
- Environment variables
- Production deployments

**Skills:** git-workflow-and-deployment, environment-configuration
**Commands:** quality-gates

### Database & Caching

**Agent:** `database-redis-specialist` (coming Phase 3)

- Redis integration
- Rate limiting
- Vector search
- Upstash configuration

**Skills:** redis-integration (coming Phase 2)

### Security & Validation

**Agent:** `security-specialist` (coming Phase 3)

- Input validation
- API security
- PII handling
- Rate limiting

**Skills:** api-security (coming Phase 4)

### XAI Integration

**Agent:** `xai-integration-optimizer`

- Grok model integration
- Fallback strategies
- LLM metrics
- Model configuration

---

## 📚 Skills Library (Organized by Category)

### 🏗️ Architecture & Patterns

**brightness-system-skill**
8-mode brightness system, CSS custom properties, color tokens
*Use when:* Implementing theme switching, fixing color issues

**hydration-safety-skill** ⭐ NEW
Next.js SSR patterns, isMounted pattern, browser API safety
*Use when:* Fixing hydration errors, using localStorage/window

**data-architecture-skill** (coming Phase 2)
facts.ts patterns, single source of truth, type safety
*Use when:* Working with project data, adding new facts

**mastra-agent-skill** (coming Phase 4)
Agent architecture, tool creation, workflows
*Use when:* Creating new AI agents or tools

### 🧪 Testing & Quality

**testing-and-quality-gates-skill**
Unit tests, E2E tests, quality gate execution
*Use when:* Writing tests, debugging failures

### ⚡ Performance & Optimization

**bundle-optimization-skill** (coming Phase 2)
Icon manifest, tree-shaking, bundle analysis
*Use when:* Reducing bundle size, optimizing imports

**redis-integration-skill** (coming Phase 2)
Rate limiting, caching, vector search, memory systems
*Use when:* Working with Redis/Upstash

### 🔒 Security & Validation

**environment-configuration-skill**
Environment variables, API keys, deployment config
*Use when:* Setting up env vars, adding secrets

**api-security-skill** (coming Phase 4)
Input validation, security headers, PII protection
*Use when:* Creating secure API routes

### 🚀 Infrastructure & Deployment

**git-workflow-and-deployment-skill**
Branch strategy, CI/CD, quality gates, auto-merge
*Use when:* Deploying, creating PRs, configuring workflows

---

## 📋 Commands Reference

**quality-gates** ⭐ MOST USED
Run all 6 quality gates before committing

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size && npm run test:e2e
```

**create-ai-tool**
Step-by-step workflow for creating new AI agent tools

**create-feature**
Feature development workflow with quality checks

**create-skill** (coming Phase 3)
Template for creating new skill documentation

**debug-hydration** (coming Phase 3)
Common hydration debugging steps

**analyze-bundle** (coming Phase 3)
Bundle size investigation workflow

---

## ⚠️ CRITICAL RULES (Non-Negotiable)

These rules apply to ALL work, regardless of agent or skill:

### 1. Import Standards

✅ USE: `@/` imports only (e.g., `import { facts } from '@/data/facts'`)
❌ NEVER: Relative imports (`../../`) or archive imports (`/archive/`)
❌ NEVER: Wildcard icon imports (`import * as Icons from 'simple-icons'`)

### 2. Quality Gates (ALL Must Pass)

```bash
✅ ESLint:     npm run lint           # 0 errors required
✅ TypeScript: npx tsc --noEmit      # 0 errors required
✅ Unit Tests: npm test              # 776/776 passing required
✅ Build:      npm run build         # Success required
✅ Bundle:     npm run size          # Within limits required
✅ E2E Tests:  npm run test:e2e      # 66 passing required
```

### 3. Zero Technical Debt Policy

❌ NO TODO comments - implement completely or don't start
❌ NO console.log - use console.error/warn only
❌ NO hardcoded colors - use CSS custom properties only
❌ NO inline styles - use Tailwind or CSS custom properties
❌ NO disabled/skipped tests - fix root causes
❌ NO TypeScript `any` - use proper types

### 4. Server-Side Security

✅ ALL API calls server-side - no exposed API keys
✅ Environment variables server-side only
❌ NEVER expose secrets in client code

### 5. Design System Compliance

✅ Test all 8 brightness modes (-3 to +3, auto)
✅ Use CSS custom properties: `bg-surf-{0,1,2}`, `text-text-{1,2,3}`
✅ Use Lucide icons only (never emojis)
✅ Reference `/archive/` patterns only (never import)

### 6. Hydration Safety

✅ Use isMounted pattern for browser APIs
✅ All hooks before conditional returns
✅ E2E tests wait for hydration
❌ NEVER access localStorage during SSR

---

## 🚀 Production Status

**Live Site:** <https://omerakben.com/>
**Deployment:** Vercel (main branch auto-deploys)
**Current Branch:** `pre-deployment` (all features branch from here)

### Recent Updates (Last 30 Days)

- ✅ Professional screenshots for 7 featured projects (4 new image directories)
- ✅ Elon University IP acknowledgments across 4 university projects
- ✅ Dynamic knowledge base architecture (hybrid template approach)
- ✅ Project cross-referencing patterns for intelligent navigation
- ✅ Enhanced AI Ozzy with screenshot awareness and project context
- ✅ Contact collection with email delivery (5/IP/24h rate limit)
- ✅ Proactive Zoom link sharing with resume download links
- ✅ LLM error classification with intelligent retry logic

### Quality Metrics (Current)

```
✅ TypeScript:    0 errors
✅ ESLint:        0 errors, 0 warnings
✅ Unit Tests:    776/776 passing (100%)
✅ E2E Tests:     66 passing, 14 skipped (OpenAI/WIP modal timing)
✅ Bundle Size:   7.73KB / 40KB homepage (within limits)
✅ Accessibility: 8/8 routes WCAG 2A compliant
```

### CI/CD Status

- Workflow: `.github/workflows/pre-deployment-to-main.yml`
- Auto-merge: `pre-deployment` → `main` after all gates pass
- Deployment tags: Track every production release

---

## 📐 Tech Stack & Architecture

### Core Technologies

- **Framework:** Next.js 15.1 (App Router, Turbopack)
- **React:** 19.0 (Server Components, Actions)
- **TypeScript:** 5.7 (strict mode)
- **Styling:** Tailwind CSS 4.0
- **UI Components:** 40+ shadcn/ui primitives
- **AI:** Vercel AI SDK v5 + XAI (Grok) + OpenAI (fallback)
- **Database:** Upstash Redis + Upstash Vector
- **Email:** Resend with React Email templates
- **Testing:** Vitest (776 tests) + Playwright (66 E2E)
- **Deployment:** Vercel with zero-downtime

### Directory Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/tools/    # 11 AI agent tools
│   └── (pages)/      # Frontend routes
├── components/       # React components
│   ├── ui/           # shadcn/ui primitives
│   └── chat/         # Sidebar assistant
├── data/             # Source of truth (facts, projects)
├── lib/              # Utilities, contexts, AI logic
│   ├── agent-tools/  # Tool schemas (Zod)
│   ├── mastra/       # Memory systems
│   └── redis/        # Vector search, rate limiting
└── config/           # Configuration files

.claude/              # Claude Code configuration
├── agents/           # 7 specialized agents
├── commands/         # 3 quick commands
└── skills/           # 6 skills (growing)

archive/              # Reference only (never import)
```

### Path Aliases

- `@/*` → `./src/*` (ALWAYS use this)

---

## 🤖 AI Agent System (11 Server-Side Tools)

All tools in `src/app/api/tools/`:

1. **download_resume** - 4 formats (Original PDF, Extended PDF, Short PDF, Two-Page PDF)
2. **download_certificate** - AWS, NSS certificates
3. **list_projects** - Filterable project catalog
4. **open_project** - Project details by slug
5. **get_contact** - Contact information
6. **collect_contact** - Proactive email delivery (5/IP/24h)
7. **navigate_page** - Page navigation
8. **provide_navigation_links** - Navigation structure
9. **extract_summary** - Content summarization
10. **profile_performance** - Performance profiling
11. **trigger_workflow** - Workflow execution

### Data Flow

```
Chat UI → AI SDK streaming → Tool call → Zod validation → Handler → JSON response
```

### Knowledge Base

**Location:** `lib/agent-knowledge-base.ts`

- Curated context for AI responses
- Work authorization info (Green Card/LPR)
- Conversation guidelines
- Sample interactions

**Dynamic Project Queries:** `lib/agent-knowledge/helpers/project-queries.ts`

- 15 helper functions for real-time project data
- Hybrid template approach (static context + runtime injection)
- Zero-staleness architecture (single source of truth: `@/data/projects`)
- Cross-referencing logic for Elon University and Tuel projects
- Screenshot awareness and visual asset documentation

---

## 🔑 Environment Variables

### Required for Development

```bash
# XAI API (Primary LLM)
XAI_API_KEY=xai-...

# OpenAI API (Fallback + Embeddings)
OPENAI_API_KEY=sk-...

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Upstash Vector (Episodic Memory)
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...

# Resend (Email Service)
RESEND_API_KEY=re_...
OMER_EMAIL=me@omerakben.com
OMER_ZOOM_LINK=https://calendly.com/...

# Vercel Cron Security
CRON_SECRET=your-random-secret

# Optional
NODE_ENV=development|production
ANALYZE=true  # Bundle analyzer
```

### Setup

1. Copy `.env.example` to `.env.local`
2. Add your API keys
3. Never commit `.env*` files

---

## 🎨 Design Patterns (Unique to This Project)

### 1. 8-Mode Brightness System ⚠️ CRITICAL

See: `.claude/skills/brightness-system-skill/`

**Modes:** -3 (darkest) → 0 (baseline) → +3 (brightest) + auto
**Implementation:** `data-brightness` on `<html>`, CSS custom properties
**Mandatory:** Test all 8 modes for every UI change

### 2. Hydration Safety ⚠️ CRITICAL

See: `.claude/skills/hydration-safety-skill/`

**Pattern:** isMounted for browser APIs
**E2E Tests:** Must wait for hydration before interactions
**Common Bug:** localStorage access during SSR

### 3. Sidebar Assistant (Ozzy AI)

**State:** `lib/chat-sidebar-context.tsx`
**Persistence:** `lib/thread-memory.ts` (localStorage)
**Features:** Pinning, resizing (320-800px), follow-ups
**Memory:** Episodic (Vector search) + Semantic (Redis)

### 4. Icon Optimization

**Achievement:** 90% bundle reduction (2.33MB → 236KB)
**Pattern:** Icon manifest (`lib/icon-manifest.ts`)
**Rule:** Never wildcard import simple-icons

### 5. Rate Limiting

**Implementation:** Redis-backed via Upstash
**Tiers:**

- Chat API: 30 req/min
- Tools API: 60 req/min
- Contact: 5 req/IP/24h

---

## 🧪 Testing Standards

### Unit Tests (Vitest)

- **Current:** 776 tests passing
- **Coverage:** Components, API routes, integrations
- **Run:** `npm test`
- **Watch:** `npm test -- --watch`

### E2E Tests (Playwright)

- **Current:** 66 passing, 14 skipped
- **Coverage:** User journeys, accessibility (WCAG 2A)
- **Run:** `npm run test:e2e`
- **Debug:** `npm run test:e2e -- --headed`

### Hydration Testing Pattern

```typescript
await page.goto("/", { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="ready"]');
await page.waitForTimeout(500); // Stabilization
// Now safe to interact
```

---

## 🐛 Common Pitfalls (AVOID THESE)

1. **Icon imports** - Never `import * as Icons from 'simple-icons'`
2. **Archive imports** - Never `import from '/archive/'`
3. **Hardcoded colors** - Only CSS custom properties
4. **Brightness testing** - Must test all 8 modes
5. **Hydration errors** - Use isMounted pattern
6. **Client API calls** - All server-side
7. **Quality gates** - Never skip to make builds pass
8. **TypeScript `any`** - Use proper types

---

## 🔧 Git Workflow

### Branch Strategy

- `main` - Production (auto-deploys)
- `pre-deployment` - Staging (all features branch from here)
- `feature/*` - Feature branches

### Workflow

```bash
git checkout pre-deployment
git pull origin pre-deployment
git checkout -b feature/new-feature

# Make changes, test locally
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size && npm run test:e2e

git commit -m "feat: description"
git push origin feature/new-feature
# Create PR to pre-deployment
# CI/CD auto-merges to main after all gates pass
```

### CI/CD Auto-Merge

1. Push to `pre-deployment`
2. GitHub Actions runs 6 quality gates
3. If all pass → auto-merge to `main`
4. Vercel deploys to production

---

## 📖 Deep Dive Documentation

For comprehensive details, see:

- **AGENTS.md** - Unified coding standards for all AI assistants
- **README.md** - Project overview and architecture
- **TODO.md** - Implementation roadmap
- **AI_AGENT.md** - Agent capabilities and tools

For agent-specific guidance:

- `.claude/agents/` - 7 specialized agents with roles
- `.claude/skills/` - 6 skills with implementation patterns
- `.claude/commands/` - 3 quick reference commands

---

## 🎯 Getting Help

**Can't find what you need?**

1. Check Agent Selection Guide (above)
2. Browse Skills Library (above)
3. Search Commands Reference (above)
4. Review Critical Rules (above)
5. Read deep dive docs (AGENTS.md, README.md)

**For specific scenarios:**

- UI/styling issues → ui-ux-developer + brightness-system-skill
- Hydration errors → nextjs-architect + hydration-safety-skill
- Test failures → test-engineer + testing-and-quality-gates-skill
- Bundle size → mastra-optimization-researcher + bundle-optimization-skill
- Deployment → deployment-engineer + git-workflow-and-deployment-skill

---

**Version:** 2.0 (Restructured 2025-11-08)
**Purpose:** Strategic router - navigate to agents, skills, commands
**Maintenance:** Keep this file concise - extract details to skills/agents
