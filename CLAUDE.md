# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TL;DR - Quick Start

**What**: Personal portfolio site with embedded AI assistant (ChatKit + Agents SDK)
**Stack**: Next.js 15 + React 19 + TypeScript + Tailwind 4 + Turbopack
**Key Feature**: 8-mode brightness system (-3 to +3 plus auto)

**Essential Commands**:
```bash
npm run dev                           # Start development server
npm test                              # Run test suite
npm run lint && npx tsc --noEmit      # Quality checks
npm run build                         # Production build
```

**Critical Rules**:
- ✅ Use `@/` path alias for all src imports
- ✅ Test all 8 brightness modes (-3 to +3)
- ✅ Use CSS custom properties (not hex colors)
- ❌ Never import from `/archive/` in main src
- ❌ Never expose API keys in browser

**Start Here**: Read [Quick Start for New Developers](#quick-start-for-new-developers) section below.

---

## Project Overview

This is **omerakben.com** — a personal portfolio and recruiter-magnet site showcasing Omer "Ozzy" Akben's work. The site features an embedded AI assistant ("Ozzy") built with OpenAI's ChatKit and Agents SDK, demonstrating modern agentic UX patterns.

**Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Turbopack

## Essential Commands

### Development
```bash
# Start dev server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Quality Assurance
```bash
# Type check without building
npx tsc --noEmit

# Run type check and linting together
npm run lint && npx tsc --noEmit

# Check for common Next.js issues
npx next doctor

# Analyze bundle size (after build)
npx @next/bundle-analyzer
```

### Testing
```bash
# Run all unit tests with Vitest
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Future: Run Playwright E2E tests (when implemented)
npx playwright test

# Future: Run specific test file
npx playwright test chat.spec.ts
```

## Architecture Overview

### Directory Structure
```
src/
  app/                      # Next.js App Router pages
    layout.tsx              # Root layout with BrightnessProvider
    page.tsx                # Home page
    globals.css             # Global styles + Tailwind + 8-mode brightness tokens
    api/tools/              # Agent tool API endpoints
      download-resume/      # Resume download handler (4 formats)
      download-certificate/  # Certificate download handler (AWS, NSS)
      list-projects/        # Project listing handler
      open-project/         # Project detail handler
      get-contact/          # Contact info handler
  components/               # Reusable UI components
    ui/                     # shadcn/ui primitives (button, card, dialog, etc.)
    app-header.tsx          # Navigation with brightness control
    app-footer.tsx          # Footer with social links
    brightness-control.tsx  # 8-stop brightness slider (-3 to +3 + auto)
    hero-section.tsx        # Animated hero component
    project-card.tsx        # Project showcase cards
    timeline.tsx            # Journey timeline
  data/                     # Static data files
    facts.ts                # Agent grounding data (personal, skills, projects)
    projects.ts             # Full project details with metadata
    journey.ts              # Career timeline data
    skills.ts               # Skills and expertise
    testimonials.ts         # Testimonials data
  lib/                      # Utilities and shared code
    agent-tools/schemas.ts  # Zod schemas for agent tools
    brightness-context.tsx  # Brightness mode state management
    metadata.ts             # SEO metadata utilities
    utils.ts                # General utilities (cn, etc.)
archive/                    # Portfolio project demos
  omer-akben-design/        # Figma reference implementation (Vite + Wouter)
  elon-ai-agent/            # Elon AI Chat demo project
  elon-ai-toolbox/          # AI Toolbar demo project
  north-glass/              # North Glass demo project
  oteemo-ai-roadmap/        # Oteemo AI Roadmap demo
  developer-cheat-sheets/   # Developer cheat sheets demo
  capstone/                 # Capstone project demo
  tuel/                     # Tuel UI components library
  tuel-chatbot/             # Tuel chatbot demo
claudedocs/                 # Claude Code documentation
  bundle-analysis.md        # Bundle size analysis and recommendations
PRD.md                      # Product requirements
Agents.md                   # Agent architecture + tool specs
Rules.md                    # Brand, safety, security policies
TODO.md                     # Implementation roadmap
Review-TODO.md              # Completed systematic improvements (2025-10-12)
vitest.config.ts            # Vitest test configuration
vitest.setup.ts             # Vitest setup file with testing-library config
```

### Path Aliases
- `@/*` → `./src/*` (configured in tsconfig.json)

## 🎨 Archive Directory - Demo Projects

The `/archive/` directory is a **key feature** containing live portfolio demos showcased at omerakben.com:

**Projects** (9 total):
- **omer-akben-design/**: Figma reference implementation (Vite + Wouter) - **use as design pattern reference**
- **elon-ai-agent/**: Elon AI Chat demo (Next.js + OpenAI)
- **elon-ai-toolbox/**: AI Toolbar demo (Next.js + Chrome Extension)
- **north-glass/**: North Glass LLC website (React + Vite)
- **oteemo-ai-roadmap/**: Oteemo AI Roadmap (React + D3.js)
- **developer-cheat-sheets/**: Developer cheat sheets (HTML/CSS/JS)
- **capstone/**: Capstone project (FastAPI + React)
- **tuel/**: Tuel UI components library (React + TypeScript)
- **tuel-chatbot/**: Tuel chatbot demo (React + AI)

**Usage Patterns**:
- ✅ **Search & analyze**: Use grep/search to find implementation patterns
- ✅ **Reference designs**: Use `omer-akben-design/` for spacing, layout, interactions
- ✅ **Adapt patterns**: Convert Wouter routing → Next.js Link/routing
- ❌ **Never import**: Don't import from `/archive/` paths in main `src/` code
- ❌ **Don't copy directly**: Adapt patterns to Next.js App Router structure

**Development Notes**:
- **TypeScript**: Archive excluded from main tsconfig.json compilation
- **Separate builds**: Each project has own build system (see project README)
- **Working on archive**: `cd archive/[project-name]` and use project-specific commands
- **Integration status**: Active development - being integrated into main portfolio

### Agent Architecture

**Ozzy** is the embedded site assistant with these characteristics:
- **UI**: ChatKit embedded widget (planned - not yet implemented)
- **Brain**: Agents SDK (TypeScript) for orchestration (planned)
- **Model**: gpt-4o-mini (default), gpt-5-mini for planning turns
- **Token Flow**: Short-lived client secrets via `/api/chatkit/start` + `/api/chatkit/refresh` (planned)
- **Tools** (server-side only, strict allowlist):
  - `download_resume(format: "full"|"short"|"two-page"|"docx")` → `/api/tools/download-resume`
  - `download_certificate(type: "aws"|"nss")` → `/api/tools/download-certificate`
  - `list_projects(category?, featured?, limit?)` → `/api/tools/list-projects`
  - `open_project(slug)` → `/api/tools/open-project`
  - `get_contact()` → `/api/tools/get-contact`
- **Grounding Data**: `src/data/facts.ts` contains personal info, skills, education, certifications

**Data Flow**: ChatKit (client) → API routes → Tool endpoints → Zod validation → Data sources → Structured JSON response

**Current Implementation Status**:
- ✅ Tool API endpoints implemented with Zod validation (5 tools)
  - ✅ Resume downloads (4 formats: full, short, two-page, docx)
  - ✅ Certificate downloads (AWS, NSS with metadata)
  - ✅ Project listing and details
  - ✅ Contact information
- ✅ Data sources (facts.ts, projects.ts) populated with actual data
- ✅ Schemas defined in `lib/agent-tools/schemas.ts`
- ✅ Core pages implemented (/, /journey, /projects, /skills, /credentials, /contact, /recruiter)
  - ✅ Recruiter page with profile photo and download grid
- ✅ Brightness system (8 modes: -3 to +3 + auto) with context provider
- ✅ 404 error page with custom illustration
- ✅ Comprehensive test suite with Vitest (72 tests passing)
- ✅ Production build passing all quality gates
- ✅ Bundle analyzer configured and documented
- ⏳ Project detail pages (in progress - some implemented at /projects/[slug])
- ⏳ ChatKit integration (pending)
- ⏳ Agents SDK orchestration (pending)

### Key Design Patterns

1. **Brightness Control**: 8-mode system (`-3` to `+3` plus `auto`) implemented via `data-brightness` attribute
   - Range: 🌙 Moon (darkest) → -3, -2, -1, 0, +1, +2, +3 → ☀️ Sun (brightest)
   - Context provider: `lib/brightness-context.tsx`
   - CSS tokens: `app/globals.css` with mode-specific color palettes
   - Auto mode: System preference + time-based adjustment (darker at night)

2. **Tool Validation**: All tool inputs validated with Zod schemas before execution
   - Schemas: `lib/agent-tools/schemas.ts`
   - Pattern: Request → Zod parse → Handler → Structured response

3. **Data Architecture**:
   - Agent grounding: `data/facts.ts` (personal, professional, skills)
   - Project catalog: `data/projects.ts` (9 projects across 3 tiers)
   - Content separation: Journey, skills, testimonials in dedicated files
   - **Source of Truth**: All data in `facts.ts` uses actual resume details

4. **Security-First**: No API keys in browser; CSP headers; rate limiting on `/api/*` (planned)
5. **Accessibility**: AA color contrast across all brightness levels; keyboard navigation; ARIA labels
6. **Performance**: Code-split demos; lazy-load heavy sections; Lighthouse ≥95 target

## ⚠️ Critical Don'ts

**These mistakes will break the build or compromise security:**

1. **🚫 Archive Imports**: Never `import` from `/archive/` paths in `src/` code
   - ❌ `import { Component } from '../../../archive/project/component'`
   - ✅ Reference patterns, then reimplement in `src/` using `@/` imports

2. **🚫 Hardcoded Colors**: Never use hex colors - always use CSS custom properties
   - ❌ `className="bg-[#00FFC6]"` or `style={{ color: '#00FFC6' }}`
   - ✅ `className="bg-brand-primary text-brand-primary"`

3. **🚫 API Keys in Browser**: Never expose OpenAI/API keys in client-side code
   - ❌ Direct API calls from React components
   - ✅ Server-side API routes (`/api/tools/*`) with Zod validation

4. **🚫 Relative Imports in src**: Never use relative imports - always use `@/` alias
   - ❌ `import { utils } from '../../lib/utils'`
   - ✅ `import { utils } from '@/lib/utils'`

5. **🚫 Skip Brightness Testing**: Never ship without testing all 8 modes
   - ❌ Test only at mode 0 (default)
   - ✅ Test modes: -3, -2, -1, 0, +1, +2, +3, auto (check contrast/borders)

6. **🚫 Assume Data**: Never make up personal information
   - ❌ Guess email, phone, or project details
   - ✅ Use only data from `src/data/facts.ts` (source of truth)

---

## Critical Rules & Conventions

### Brand Identity
- **Formal**: "Omer Akben" (resume, JSON-LD, legal contexts)
- **Casual**: "Ozzy" (UI, bot name, site voice)
- Agent switches to "Omer Akben" for formal requests

### Security Requirements
- **Never** expose API keys in client-side code
- **Always** use short-lived ChatKit client tokens
- **Validate** all tool inputs with Zod schemas
- **Redact** PII in server logs
- **Rate-limit** all `/api/*` endpoints
- **Refuse** jailbreak attempts in agent prompts

### Agent Safety
- No external web browsing tools (closed allowlist)
- No system/developer message disclosure
- Treat all user links as untrusted
- Output length clamping for agent responses

### Development Standards
- Use `@/` path alias for all src imports
- Follow Next.js App Router conventions
- Server-side API routes for all agent tools
- TypeScript strict mode enabled
- Turbopack for builds

## Next.js Configuration Highlights

**Security & Performance** (`next.config.ts`):
- **Security Headers**: X-Frame-Options: DENY, CSP for images, X-Content-Type-Options
- **Icon Optimization**: Lucide icons tree-shaking via `modularizeImports`
- **Image Optimization**: AVIF/WebP formats, SVG with CSP sandbox
- **Caching**: 1-year cache for `/assets/*`, 1-day cache for images
- **Production**: Console logs auto-removed (except errors/warnings)

**Important**: When adding new icon imports, use named imports from `lucide-react` for automatic tree-shaking.

## Key Architectural Decisions

### Turbopack Build System
- **Why**: Faster builds and hot reload compared to Webpack
- **Impact**: All commands use `--turbopack` flag (`npm run dev`, `npm run build`)
- **Note**: Some features may differ from standard Next.js Webpack builds

### 8-Mode Brightness System
- **Why**: More granular control than binary dark/light mode
- **Implementation**: 7 manual stops (-3 to +3) plus auto mode = 8 total modes
- **Range**: 🌙 -3 (darkest) → 0 (baseline) → +3 (brightest) ☀️
- **Benefits**: Users can fine-tune contrast for comfort/accessibility
- **Challenge**: Requires testing all components across all modes

### Server-Side Agent Tools Only
- **Why**: Security - never expose OpenAI API keys in browser
- **Pattern**: All agent tools are Next.js API routes with Zod validation
- **Flow**: ChatKit (client) → API route → Tool handler → Data source
- **Future**: Short-lived client secrets for ChatKit authentication

### Single Source of Truth for Data
- **Personal Data**: `src/data/facts.ts` (agent grounding - uses actual resume data)
- **Projects**: `src/data/projects.ts` (catalog + metadata)
- **Content**: Journey, skills, testimonials in dedicated `data/` files
- **Why**: Consistency across pages and agent responses

## Common Development Patterns

### Creating New Agent Tools
1. Define input/output schemas in `lib/agent-tools/schemas.ts` (Zod)
   ```typescript
   export const myToolInputSchema = z.object({
     param: z.string(),
   });
   export const myToolOutputSchema = z.object({
     result: z.string(),
   });
   ```

2. Implement handler in `src/app/api/tools/[tool-name]/route.ts`
   ```typescript
   import { NextRequest, NextResponse } from "next/server";
   import { myToolInputSchema } from "@/lib/agent-tools/schemas";

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json();
       const input = myToolInputSchema.parse(body);

       // Your logic here

       return NextResponse.json({
         success: true,
         data: { /* result */ },
       });
     } catch (error) {
       return NextResponse.json(
         { success: false, error: error.message },
         { status: 400 }
       );
     }
   }
   ```

3. Register tool in Agents SDK agent definition (when implementing ChatKit)
4. Add integration test in `tests/tools/[tool-name].spec.ts` (when implementing Playwright)
5. Update `Agents.md` documentation

### Adding New Pages
1. Create route in `src/app/[route]/page.tsx`
2. Add metadata (title, description, OG image)
3. Implement JSON-LD structured data
4. Ensure AA color contrast at all brightness levels
5. Add keyboard navigation support

### Theming Pattern
```tsx
// Use CSS custom properties defined in globals.css
// Surface colors
<div className="bg-surf-0">           {/* Page background */}
<Card className="bg-surf-1 border-border-line">  {/* Cards */}
<Dialog className="bg-surf-2">        {/* Elevated surfaces */}

// Text hierarchy
<h1 className="text-text-1">          {/* Primary text */}
<p className="text-text-2">           {/* Body text */}
<span className="text-text-3">        {/* Captions */}

// Brand colors
<Button className="bg-brand-primary"> {/* Primary CTAs */}
<Badge className="bg-accent-primary"> {/* Accent elements */}

// Brightness control in components
import { useBrightness } from "@/lib/brightness-context";

const { brightness, setBrightness } = useBrightness();
// brightness is: '-3' | '-2' | '-1' | '0' | '+1' | '+2' | '+3' | 'auto'
// Range: 🌙 -3 (darkest) to +3 (brightest) ☀️
```

## Design System & Figma Integration

### Figma Design Resources

**Design File**: [omerakben.com Figma](https://www.figma.com/design/GGCkxSgirBbmjQlioQKWEa/omerakben.com?node-id=0-1)
- **Design Mode**: Full visual designs and prototypes
- **Dev Mode**: Inspect spacing, colors, typography, and export assets

**Reference Implementation**: `/archive/omer-akben-design/`
- Figma-to-code implementation using Vite + Wouter
- Use as reference for design patterns, spacing, and interactions
- Adapt patterns to Next.js App Router structure (don't copy directly)
- Convert `wouter` routing to Next.js `Link` and file-based routing

### Design Token System

**8-Mode Brightness System** (🌙 -3 → +3 ☀️):

**CSS Custom Properties** (defined in `globals.css`):
```css
/* Surface colors (backgrounds) */
--surf-0        /* Page background */
--surf-1        /* Card backgrounds */
--surf-2        /* Elevated surfaces */

/* Border */
--border-line   /* All border colors */

/* Text hierarchy */
--text-1        /* Primary text (highest contrast) */
--text-2        /* Secondary text */
--text-3        /* Tertiary text (lowest contrast) */

/* Brand colors */
--brand-primary /* Primary brand color (#00FFC6 at mode 0) */
--accent-primary /* Accent color (#2563EB at mode 0) */
```

**Brightness Mode Mapping**:
- `-3`: Deepest dark mode (moon)
- `-2`: Very dark mode
- `-1`: Medium dark mode
- `0` (Baseline): Default dark theme
- `+1`: Soft light mode
- `+2`: Medium light mode
- `+3`: Bright light mode (sun)
- `auto`: System preference + time-based adjustment

**Implementation Pattern**:
```tsx
// brightness-context.tsx manages data-brightness attribute
<BrightnessProvider>
  {children}
</BrightnessProvider>

// Access in components
const { brightness, setBrightness } = useBrightness();
```

### Typography Scale

**Font Family**: Inter (with fallbacks)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Text Styles** (applied via Tailwind utilities):
```tsx
// Hero headings
className="text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-bold"

// Section headings
className="text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] font-bold"

// Card titles
className="text-[24px] leading-[32px] font-bold"

// Body text
className="text-[16px] md:text-[18px] leading-[28px]"

// Small text / captions
className="text-[14px] leading-[20px]"
```

### Component Library (shadcn/ui)

**Available Components** (in `src/components/ui/`):
- `button`, `badge`, `card`, `avatar`
- `dialog`, `sheet`, `drawer`, `popover`
- `tabs`, `accordion`, `tooltip`
- `select`, `input`, `textarea`, `checkbox`
- `slider`, `switch`, `toggle`
- And 30+ more components

**Component Usage Pattern**:
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Button variants
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>

// Card pattern
<Card className="bg-surf-1 border-border-line">
  <CardHeader>
    <CardTitle className="text-text-1">Title</CardTitle>
  </CardHeader>
  <CardContent className="text-text-2">
    Content
  </CardContent>
</Card>
```

### Icons & Animation

**Icons**: Lucide React (`lucide-react`)
```tsx
import { Bot, Download, ExternalLink } from 'lucide-react';

<Button>
  <Download className="w-4 h-4 mr-2" />
  Download Resume
</Button>
```

**Animation**: Framer Motion (`motion`)
```tsx
import { motion } from 'motion/react';

// Fade in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

## Working with Data Files

**Agent Grounding Data** (`src/data/facts.ts`):
- Contains personal info, professional background, skills, education
- Uses actual resume details (email: akbenof@gmail.com, phone placeholder needs update)
- Used by agent tools to answer questions about Omer
- Helper functions: `getContactInfo()`, `getSkillsByCategory()`, `getFeaturedProjects()`
- **Important**: Source of truth for all personal data

**Projects Data** (`src/data/projects.ts`):
- 9 projects organized in 3 tiers (production, ready-to-deploy, production-ready)
- Each project has: id, slug, title, description, technologies, role, category, status
- Helper functions: `getProjectBySlug()`, `getFeaturedProjects()`, `getProjectsByCategory()`
- Categories: `"ai-ml" | "web" | "mobile" | "tools" | "other"`

## Quick Start for New Developers

1. **Initial Setup**:
   ```bash
   npm install
   npm run dev
   ```
   Visit http://localhost:3000

2. **Before Making Changes**:
   ```bash
   git status && git branch  # Verify you're on a feature branch
   npm run lint              # Check for linting issues
   npx tsc --noEmit          # Verify type safety
   ```

3. **Common Workflow**:
   - Create feature branch: `git checkout -b feature/your-feature`
   - Make changes in `src/`
   - Write tests for new functionality
   - Test all 8 brightness modes (🌙 -3 to +3 ☀️)
   - Run quality checks:
     ```bash
     npm test                  # Run test suite
     npm run lint              # Check for linting issues
     npx tsc --noEmit          # Verify type safety
     npm run build             # Test production build
     ```
   - Commit with descriptive message
   - PR to `main` branch

4. **Adding New Features with Tests**:
   ```bash
   # 1. Create component
   touch src/components/my-component.tsx

   # 2. Create test file
   touch src/components/my-component.test.tsx

   # 3. Write component and tests together (TDD approach)
   npm test -- --watch  # Watch mode for rapid feedback

   # 4. Verify all quality gates before commit
   npm test && npm run lint && npx tsc --noEmit
   ```

## Common Pitfalls to Avoid

### 1. Archive Directory Usage
- **Do**: Search, analyze, and improve archive projects
- **Do**: Reference `omer-akben-design/` for design patterns
- **Do**: Adapt patterns to Next.js App Router structure
- **Don't**: Copy files directly without adaptation
- **Don't**: Import from archive paths in main src

### 2. Brightness Mode Testing
- **Do**: Test all 8 modes (-3 to +3, plus auto)
- **Do**: Verify text contrast and borders at each level
- **Don't**: Test only at default brightness (0)
- **Range**: 🌙 -3 (darkest) → 0 → +3 (brightest) ☀️

### 3. Color Usage
- **Do**: Use CSS custom properties (`bg-brand-primary`)
- **Don't**: Hardcode hex colors (`#00FFC6` or `bg-[#00FFC6]`)
- **Why**: Colors must adapt to brightness mode changes

### 4. Data Source of Truth
- **Do**: Update `src/data/facts.ts` for personal info changes
- **Don't**: Assume or make up information
- **Source**: All data comes from actual resume

## Common Issues & Troubleshooting

### Build Errors
- **"Module not found"**: Ensure you're using `@/` path alias for all `src/` imports
- **TypeScript errors in archive**: Archive is excluded - don't import from it
- **Turbopack warnings**: Some features differ from Webpack - see Next.js docs

### Brightness Mode Issues
- **Colors not changing**: Ensure using CSS custom properties, not hardcoded hex colors
- **Testing**: Use browser DevTools to toggle `data-brightness` attribute on `<html>` element

### Development Server
- **Port already in use**: Kill existing process on port 3000: `lsof -ti:3000 | xargs kill`
- **Slow hot reload**: Restart dev server, clear `.next` directory

### Testing Agent Tool Endpoints

Agent tool endpoints can be tested directly:

```bash
# Test download-resume endpoint (4 formats available)
curl -X POST http://localhost:3000/api/tools/download-resume \
  -H "Content-Type: application/json" \
  -d '{"format": "short"}'  # Options: "full", "short", "two-page", "docx"

# Test download-certificate endpoint
curl -X POST http://localhost:3000/api/tools/download-certificate \
  -H "Content-Type: application/json" \
  -d '{"type": "aws"}'  # Options: "aws", "nss"

# Test list-projects endpoint
curl -X POST http://localhost:3000/api/tools/list-projects \
  -H "Content-Type: application/json" \
  -d '{"category": "ai-ml", "limit": 5}'

# Test open-project endpoint
curl -X POST http://localhost:3000/api/tools/open-project \
  -H "Content-Type: application/json" \
  -d '{"slug": "elon-ai-agent"}'

# Test get-contact endpoint
curl -X POST http://localhost:3000/api/tools/get-contact \
  -H "Content-Type: application/json"
```

All endpoints expect POST with JSON body and return `{ success: boolean, data?: any, error?: string }`.

## Testing Infrastructure

**Test Framework**: Vitest 3.2.4 with React Testing Library
- **Environment**: jsdom for DOM testing
- **Setup**: `vitest.setup.ts` with @testing-library/react configuration
- **Coverage**: v8 provider with text/json/html reporters

**Current Test Coverage** (as of 2025-10-12):
- **Test Files**: 3 files (src directory only)
- **Total Tests**: 72 tests passing
- **Duration**: ~529ms average
- **Files Tested**:
  - `src/components/brightness-control.test.tsx` (23 tests)
  - `src/data/projects.test.ts` (25 tests)
  - `src/lib/agent-tools/schemas.test.ts` (24 tests)

**Test Configuration** (`vitest.config.ts`):
```typescript
{
  include: ["src/**/*.test.{ts,tsx}"],
  exclude: ["**/node_modules/**", "**/archive/**", "**/.next/**"],
  coverage: {
    exclude: ["node_modules/", "vitest.setup.ts", "vitest.config.ts",
              "next.config.ts", "*.d.ts", "**/*.config.*", "**/archive/**"]
  }
}
```

**Testing Best Practices**:
1. Place tests next to source files with `.test.ts` or `.test.tsx` extension
2. Use descriptive test names with behavior-driven format
3. Group related tests with `describe` blocks
4. Test component rendering, interactions, visual states, accessibility, and edge cases
5. Mock context providers and external dependencies as needed

**Running Tests**:
```bash
npm test                    # Run all tests once
npm test -- --watch         # Watch mode for development
npm test -- --coverage      # Generate coverage report
```

## Quality Assurance

**Production Build Quality Gates** (All Passing ✅):
1. **Type Safety**: `npx tsc --noEmit` - Zero errors
2. **Linting**: `npm run build` ESLint - Zero warnings/errors
3. **Build Success**: Next.js production build - 22 routes generated
4. **Test Suite**: `npm test` - 72/72 tests passing
5. **Bundle Analysis**: Documented in `claudedocs/bundle-analysis.md`

**Code Quality Metrics** (as of 2025-10-12):
- **Build Time**: ~1.5 seconds (excellent)
- **Bundle Size**: 166 kB shared chunks (optimized)
- **Page Sizes**: 3-13 kB individual pages (excellent)
- **Routes**: 22 total (18 static, 4 edge functions)
- **First Load JS**: 153 kB - 2.33 MB (optimization opportunities on home/skills)

**Recent Improvements** (Review-TODO Implementation):
- ✅ Fixed animation system duration consistency (Phase 1)
- ✅ Installed and configured Vitest + React Testing Library
- ✅ Created comprehensive test suite (72 tests across 3 files)
- ✅ Fixed 8 ESLint errors (quote escaping, unused imports, any types)
- ✅ Configured bundle analyzer with @next/bundle-analyzer
- ✅ Verified simple-icons tree-shaking optimization
- ✅ Ensured TypeScript strict mode compliance
- ✅ Documented bundle sizes and optimization opportunities

**Bundle Analysis Highlights**:
- **Critical Finding**: Home and skills pages have large First Load JS (2.3+ MB)
- **Root Cause**: Likely Framer Motion animation library
- **Recommendation**: Implement lazy loading for motion components
- **Full Report**: See `claudedocs/bundle-analysis.md` for detailed findings

**Quality Standards**:
- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- Prettier formatting (if configured)
- Zero production build warnings
- AA color contrast across all brightness modes
- Lighthouse target: ≥95 score (to be implemented)

## Project Status

**Active Development Areas**:
- ⏳ Performance optimization (lazy loading motion components)
- ⏳ Integrating archive demo projects into portfolio
- ⏳ Project detail pages implementation
- ⏳ ChatKit integration preparation
- ⏳ E2E testing with Playwright (planned)

**Completed Milestones**:
- ✅ Animation system duration standardization (Phase 1)
- ✅ Comprehensive unit test suite implementation
- ✅ Production build quality gates established
- ✅ Bundle analysis and optimization documentation
- ✅ ESLint error resolution and code quality improvements
- ✅ Cloud assets implementation (resumes + certificates)
  - ✅ 4 resume formats with Google Drive fallbacks
  - ✅ Certificate downloads (AWS, NSS) with metadata
  - ✅ Profile photo on recruiter page
  - ✅ 2x2 download grid with responsive design

**Important Files to Review**:
- **PRD.md**: Complete product requirements and vision
- **Agents.md**: Agent architecture, tool specs, data flow
- **Rules.md**: Brand, safety, security policies (enforced by agent)
- **TODO.md**: Implementation roadmap with current status
- **Review-TODO.md**: Recently completed systematic improvements
- **Analyze.md**: Pre-launch QA checklist + site analysis (performance, SEO, accessibility)
- **CLOUD-ASSETS-TODO.md**: Cloud assets implementation (resumes + certificates) - COMPLETE
- **claudedocs/bundle-analysis.md**: Bundle size analysis and recommendations
- **package.json**: Dependencies and available scripts

## 📋 Pre-Launch Analysis

**Analyze.md** contains comprehensive site analysis and pre-launch QA:

**Key Sections**:
1. **What's Working**: Current strengths (positioning, tech stack, projects, testimonials)
2. **Areas for Improvement**: Pre-launch polish recommendations
3. **QA Checklist**: 10-category validation framework
   - Performance & Metrics (Lighthouse, bundle size, CLS)
   - Cross-Browser & Device Testing
   - Accessibility (keyboard nav, screen readers, contrast)
   - SEO/Metadata/Social Sharing
   - Links & Navigation
   - Forms & Contact flows
   - Security Basics (HTTPS, CSP headers)
   - Analytics & Monitoring
   - Deployment & Infrastructure
   - Backup & Version Control

**When to Use**:
- Before deploying major updates
- Pre-launch final review
- Post-release validation
- Performance optimization planning

## Quick Reference

### File Locations
- **Pages**: `src/app/[route]/page.tsx`
- **API Routes**: `src/app/api/[endpoint]/route.ts`
- **Components**: `src/components/` (custom) or `src/components/ui/` (shadcn)
- **Data**: `src/data/*.ts` (facts, projects, journey, skills, testimonials)
- **Schemas**: `src/lib/agent-tools/schemas.ts`
- **Utilities**: `src/lib/utils.ts`
- **Tests**: `src/**/*.test.{ts,tsx}` (co-located with source files)
- **Test Config**: `vitest.config.ts`, `vitest.setup.ts`
- **Documentation**: `claudedocs/` (bundle analysis, architecture docs)
- **Archive**: `archive/*/` (demo projects for portfolio)

### Import Patterns
```typescript
// Pages and components
import { Button } from '@/components/ui/button';
import { facts } from '@/data/facts';
import { projects } from '@/data/projects';

// Utilities
import { cn } from '@/lib/utils';
import { useBrightness } from '@/lib/brightness-context';

// Next.js
import Link from 'next/link';
import { NextRequest, NextResponse } from 'next/server';
```

### Color Class Reference
```typescript
// Surfaces (backgrounds)
bg-surf-0  // Page background
bg-surf-1  // Card backgrounds
bg-surf-2  // Elevated surfaces

// Text (hierarchy)
text-text-1  // Primary text (headings)
text-text-2  // Body text
text-text-3  // Captions, labels

// Brand
bg-brand-primary  // Primary brand color
text-brand-primary  // Brand color text
bg-accent-primary  // Accent color

// Borders
border-border-line  // All borders
```

---

**Note**: The project emphasizes security (short-lived tokens), accessibility (AA contrast), and performance (Lighthouse ≥95). All agent tools must be server-side only with strict input validation.
