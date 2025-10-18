# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TL;DR - Quick Start

**What**: Personal portfolio site with embedded AI assistant
**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 4 + Turbopack + AI SDK
**Key Feature**: 8-mode brightness system (-3 to +3 plus auto)

**Essential Commands**:
```bash
npm run dev                      # Dev server (http://localhost:3000)
npm test                         # Run Vitest unit tests (72 tests)
npm test -- --watch              # TDD watch mode
npm run test:e2e                 # Playwright E2E tests
npm run lint                     # ESLint check
npx tsc --noEmit                 # TypeScript check
npm run build                    # Production build + quality gates
npm run analyze                  # Bundle size analysis
```

**Critical Rules**:
- ✅ Use `@/` path alias for all src imports (never relative imports)
- ✅ Test all 8 brightness modes (-3 to +3 plus auto)
- ✅ Use CSS custom properties (never hardcoded colors like `#00FFC6`)
- ❌ Never import from `/archive/` paths in main `src/` code
- ❌ Never expose API keys in browser (always server-side API routes)

---

## Project Overview

**omerakben.com** is a personal portfolio showcasing Omer "Ozzy" Akben's work with an embedded AI assistant built using Vercel AI SDK. The site demonstrates modern agentic UX patterns with server-side tool execution.

**Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Turbopack, Vercel AI SDK

## Architecture Overview

### Directory Structure
```
src/
  app/
    layout.tsx              # Root layout with BrightnessProvider
    page.tsx                # Home page with hero + projects
    globals.css             # Global styles + 8-mode brightness tokens
    chat/                   # AI chat interface with AI SDK
      page.tsx              # Chat UI with sidebar
      layout.tsx            # Chat-specific layout
    api/
      chat/                 # AI SDK chat endpoint (streaming)
      tools/                # Agent tool API endpoints (6 tools)
        download-resume/    # Resume downloads (4 formats)
        download-certificate/ # Certificates (AWS, NSS)
        list-projects/      # Project listing
        open-project/       # Project details
        get-contact/        # Contact info
        navigate-page/      # Page navigation
  components/
    ui/                     # shadcn/ui primitives (40+ components)
    chat/                   # Chat-specific components
      chat-interface.tsx    # Main chat UI
      chat-sidebar.tsx      # Sidebar with quick actions
    brightness-control.tsx  # 8-stop brightness slider
    hero-section.tsx        # Animated hero with RobotIllustration
    robot-illustration.tsx  # Animated robot with speech balloons
  data/
    facts.ts                # Agent grounding data (source of truth)
    projects.ts             # Project catalog (9 projects)
    journey.ts              # Career timeline
    skills.ts               # Skills and expertise
    credentials.ts          # Certifications and credentials
  lib/
    agent-tools/schemas.ts  # Zod schemas for all tools
    agent-knowledge-base.ts # Curated knowledge for AI agent
    brightness-context.tsx  # Brightness state management
    chat-sidebar-context.tsx # Chat sidebar state
    structured-data.ts      # JSON-LD for SEO
    metadata.ts             # SEO metadata utilities
archive/                    # Portfolio demos (9 projects)
  omer-akben-design/        # Figma reference (Vite + Wouter)
  [8 other demo projects]   # See "Archive Directory" section
claudedocs/                 # Claude Code documentation
  bundle-analysis.md        # Bundle performance analysis
```

### Path Aliases
- `@/*` → `./src/*` (configured in `tsconfig.json`)

### Agent Architecture

**AI Chat Interface** (implemented with Vercel AI SDK):
- **Model**: gpt-4o-mini (via AI SDK)
- **UI**: Custom chat interface at `/chat` with sidebar
- **Tools**: 6 server-side tools with Zod validation
- **Security**: All tool execution server-side, no API keys in browser
- **Knowledge Base**: `lib/agent-knowledge-base.ts` provides curated context

**Tool Allowlist** (all server-side POST endpoints):
1. `download_resume(format: "full"|"short"|"two-page"|"docx")` → Resume downloads
2. `download_certificate(type: "aws"|"nss")` → Certificate downloads with metadata
3. `list_projects(category?, featured?, limit?)` → Project listing with filtering
4. `open_project(slug)` → Project details and links
5. `get_contact()` → Contact information
6. `navigate_page(page)` → Page navigation with URL response

**Data Flow**: Chat UI → AI SDK → Tool call → API route → Zod validation → Handler → Structured JSON response

**Implementation Status**:
- ✅ Chat interface with AI SDK streaming
- ✅ 6 agent tools implemented and validated
- ✅ Knowledge base with curated facts
- ✅ Sidebar with quick actions
- ✅ Test suite (72 unit tests + E2E setup)

### Key Design Patterns

**1. 8-Mode Brightness System** (Critical Understanding Required)
- **Implementation**: `data-brightness` attribute on `<html>` element
- **Range**: 🌙 -3 (darkest) → 0 (baseline) → +3 (brightest) ☀️ + `auto` mode
- **CSS Tokens**: All colors as custom properties in `globals.css`
- **Context**: `lib/brightness-context.tsx` manages state
- **Auto Mode**: System preference + time-based adjustment

**Design Tokens** (never use hardcoded colors):
```tsx
// Surfaces
bg-surf-0  // Page background
bg-surf-1  // Card backgrounds
bg-surf-2  // Elevated surfaces

// Text hierarchy
text-text-1  // Primary text (headings)
text-text-2  // Body text
text-text-3  // Captions, labels

// Brand
bg-brand-primary  // Primary brand color
border-border-line  // All borders
```

**2. Tool Validation Pattern**
- All tool inputs validated with Zod schemas (`lib/agent-tools/schemas.ts`)
- Response format: `{ success: boolean, data?: any, error?: string }`
- Server-side only execution (never expose API keys)

**3. Data Architecture**
- **Source of Truth**: `data/facts.ts` (personal info, skills, education)
- **Project Catalog**: `data/projects.ts` (9 projects across 3 tiers)
- **Helper Functions**: Exported from each data file (e.g., `getContactInfo()`)

**4. Archive Directory Pattern**
- **Purpose**: Portfolio demos referenced but never imported
- **Use for**: Design patterns, reference implementations
- **Never**: Import from `/archive/` in `src/` code
- **Adapt**: Convert patterns to Next.js App Router structure

## 🎨 Archive Directory - Demo Projects

Contains 9 portfolio demos showcased at omerakben.com:

- **omer-akben-design/**: Figma reference implementation (Vite + Wouter) - **use as design pattern reference**
- **elon-ai-agent/**: Elon AI Chat demo (Next.js + OpenAI)
- **elon-ai-toolbox/**: AI Toolbar demo (Next.js + Chrome Extension)
- **north-glass/**: North Glass LLC website (React + Vite)
- **oteemo-ai-roadmap/**: Oteemo AI Roadmap (React + D3.js)
- **developer-cheat-sheets/**: Developer cheat sheets (HTML/CSS/JS)
- **capstone/**: Capstone project (FastAPI + React)
- **tuel/**: Tuel UI components library (React + TypeScript)
- **tuel-chatbot/**: Tuel chatbot demo (React + AI)

**Usage**: Search and analyze for patterns, adapt to Next.js App Router, never import directly.

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
   - ✅ Server-side API routes (`/api/*`) with Zod validation

4. **🚫 Relative Imports**: Never use relative imports - always use `@/` alias
   - ❌ `import { utils } from '../../lib/utils'`
   - ✅ `import { utils } from '@/lib/utils'`

5. **🚫 Skip Brightness Testing**: Never ship without testing all 8 modes
   - ❌ Test only at mode 0 (default)
   - ✅ Test modes: -3, -2, -1, 0, +1, +2, +3, auto

6. **🚫 Assume Data**: Never make up personal information
   - ❌ Guess email, phone, or project details
   - ✅ Use only data from `src/data/facts.ts` (source of truth)

7. **🚫 Use Emojis in UI**: Never use emojis - always use Lucide React icons
   - ❌ Display emojis in buttons, cards, or UI components
   - ✅ Use Lucide icons for consistent design across all brightness modes

---

## Development Workflow

### Quality Gates (Run Before Commit)
```bash
npm test                    # 72/72 tests must pass
npm run lint                # Zero errors/warnings
npx tsc --noEmit            # Zero type errors (strict mode)
npm run build               # Production build must succeed
```

### Testing Patterns

**Unit Tests** (Vitest + React Testing Library):
```bash
npm test                    # Run all unit tests
npm test -- --watch         # TDD watch mode
npm test -- --coverage      # Generate coverage report
```

**E2E Tests** (Playwright):
```bash
npm run test:e2e            # Run all E2E tests
npm run test:e2e:ui         # Run with Playwright UI
npm run test:e2e:headed     # Run in headed mode
```

**Test Configuration**:
- **Unit Tests**: `vitest.config.ts` - tests in `src/**/*.test.{ts,tsx}`
- **E2E Tests**: `playwright.config.ts` - tests in root directory
- Place unit tests next to source files with `.test.ts` or `.test.tsx`

**Current Coverage**:
- 72 unit tests passing (~529ms)
- Test files: `brightness-control.test.tsx`, `projects.test.ts`, `schemas.test.ts`

### Common Development Tasks

**Creating New Agent Tools**:
1. Define Zod schema in `lib/agent-tools/schemas.ts`
2. Implement POST handler in `src/app/api/tools/[tool-name]/route.ts`
3. Validate input: `schema.parse(body)` → return `{ success, data?, error? }`
4. Test with curl:
   ```bash
   curl -X POST http://localhost:3000/api/tools/[tool-name] \
     -H "Content-Type: application/json" -d '{}'
   ```
5. Update knowledge base in `lib/agent-knowledge-base.ts`

**Adding New Pages**:
1. Create route in `src/app/[route]/page.tsx` with metadata export
2. Test all 8 brightness modes for color contrast (AA compliance)
3. Ensure keyboard navigation works
4. Add to sitemap if public page

**Working with Data Files**:
- **facts.ts**: Personal info, professional background, skills (source of truth)
- **projects.ts**: Project catalog with helper functions
- **journey.ts**: Career timeline data
- **skills.ts**: Skills organized by category
- **credentials.ts**: Certifications and credentials

## Design System

### Figma Integration

**Design File**: [omerakben.com Figma](https://www.figma.com/design/GGCkxSgirBbmjQlioQKWEa/omerakben.com?node-id=0-1)
- **Design Mode**: Visual designs and prototypes
- **Dev Mode**: Inspect spacing, colors, typography
- **Reference**: `/archive/omer-akben-design/` for implementation patterns

### Component Library (shadcn/ui)

**Available Components** (40+ in `src/components/ui/`):
- Layout: `card`, `dialog`, `sheet`, `drawer`, `popover`
- Form: `button`, `input`, `textarea`, `select`, `checkbox`, `slider`
- Navigation: `dropdown-menu`, `tabs`
- Feedback: `alert`, `badge`, `avatar`
- And 30+ more components

**Usage Pattern**:
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card className="bg-surf-1 border-border-line">
  <CardHeader>
    <CardTitle className="text-text-1">Title</CardTitle>
  </CardHeader>
  <CardContent className="text-text-2">Content</CardContent>
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

**Critical Design Rule**: 🚫 **Never use emojis** - always use Lucide React icons for consistency across all 8 brightness modes and professional design standards.

**Animation**: Framer Motion (`motion`)
```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

### Typography Scale

**Font Family**: Inter (with fallbacks)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Text Styles** (Tailwind utilities):
```tsx
// Hero headings
className="text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-bold"

// Section headings
className="text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] font-bold"

// Body text
className="text-[16px] md:text-[18px] leading-[28px]"

// Small text
className="text-[14px] leading-[20px]"
```

## Next.js Configuration

**Security & Performance** (`next.config.ts`):
- **Security Headers**: X-Frame-Options, CSP, X-Content-Type-Options
- **Icon Optimization**: Lucide icons tree-shaking via `modularizeImports`
- **Image Optimization**: AVIF/WebP formats, lazy loading
- **Caching**: 1-year for `/assets/*`, 1-day for images
- **Production**: Console logs removed (except errors/warnings)

**Important**: Use named imports from `lucide-react` for automatic tree-shaking.

## Common Pitfalls to Avoid

### 1. Archive Directory Usage
- ✅ Search, analyze, and reference archive projects
- ✅ Use `omer-akben-design/` for design patterns
- ✅ Adapt patterns to Next.js App Router
- ❌ Copy files directly without adaptation
- ❌ Import from archive paths in main `src/`

### 2. Brightness Mode Testing
- ✅ Test all 8 modes (-3 to +3, plus auto)
- ✅ Verify text contrast and borders
- ❌ Test only at default brightness (0)
- **Range**: 🌙 -3 (darkest) → 0 → +3 (brightest) ☀️

### 3. Color Usage
- ✅ Use CSS custom properties (`bg-brand-primary`)
- ❌ Hardcode hex colors (`#00FFC6` or `bg-[#00FFC6]`)
- **Why**: Colors must adapt to brightness mode changes

### 4. Data Source of Truth
- ✅ Update `src/data/facts.ts` for personal info
- ❌ Assume or make up information
- **Source**: All data from actual resume

## Troubleshooting

**Build Errors**:
- "Module not found" → Use `@/` path alias, never relative imports or archive imports
- TypeScript errors in archive → Archive excluded from tsconfig

**Brightness Testing**:
- Toggle `data-brightness` attribute on `<html>` in DevTools
- If colors don't change → Using hardcoded hex instead of CSS custom properties

**Development Server**:
- Port 3000 in use → `lsof -ti:3000 | xargs kill`
- Slow hot reload → Restart server, clear `.next/` directory

**Testing Agent Tools**:
```bash
# All endpoints: POST with JSON body → { success, data?, error? }
curl -X POST http://localhost:3000/api/tools/download-resume \
  -H "Content-Type: application/json" -d '{"format": "short"}'

curl -X POST http://localhost:3000/api/tools/list-projects \
  -H "Content-Type: application/json" -d '{"category": "ai-ml", "limit": 5}'
```

## Quality Metrics

**Production Build** (All Passing ✅):
- Build Time: ~1.5-1.7 seconds
- Bundle: 166 kB shared chunks, 3-13 kB per page
- First Load JS: 153 kB - 2.33 MB
- Actual Transfer: ~30KB gzipped
- TypeScript: Strict mode, zero errors
- ESLint: Zero errors/warnings
- Tests: 72/72 passing

**Performance Analysis**: See `claudedocs/bundle-analysis.md`

## Documentation Files

**Product & Architecture**:
- `PRD.md` - Product requirements and vision
- `Agents.md` - Agent architecture, tools, data flow
- `TODO.md` - Implementation roadmap

**Code References**:
- `src/data/facts.ts` - Source of truth for personal data
- `src/data/projects.ts` - Project catalog
- `src/lib/agent-tools/schemas.ts` - Zod schemas for tools
- `src/lib/agent-knowledge-base.ts` - Curated agent knowledge

**Quality & Analysis**:
- `claudedocs/bundle-analysis.md` - Bundle size analysis

## Quick Reference

### File Locations
- **Pages**: `src/app/[route]/page.tsx`
- **API Routes**: `src/app/api/[endpoint]/route.ts`
- **Components**: `src/components/` (custom) or `src/components/ui/` (shadcn)
- **Data**: `src/data/*.ts` (facts, projects, journey, skills, credentials)
- **Schemas**: `src/lib/agent-tools/schemas.ts`
- **Tests**: `src/**/*.test.{ts,tsx}` (co-located)
- **E2E Tests**: Root directory `*.spec.ts`
- **Documentation**: `claudedocs/`
- **Archive**: `archive/*/` (demo projects)

### Import Patterns
```typescript
// Components and UI
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/hero-section';

// Data
import { facts } from '@/data/facts';
import { projects } from '@/data/projects';

// Utilities
import { cn } from '@/lib/utils';
import { useBrightness } from '@/lib/brightness-context';

// Next.js
import Link from 'next/link';
import { NextRequest, NextResponse } from 'next/server';
```

### Theming Pattern
```tsx
import { useBrightness } from "@/lib/brightness-context";

const { brightness, setBrightness } = useBrightness();
// brightness: '-3' | '-2' | '-1' | '0' | '+1' | '+2' | '+3' | 'auto'

// Use design tokens
<div className="bg-surf-0">           {/* Page background */}
<Card className="bg-surf-1 border-border-line">  {/* Cards */}
<h1 className="text-text-1">          {/* Primary text */}
<Button className="bg-brand-primary"> {/* Brand CTA */}
```

---

**Note**: The project emphasizes security (server-side tools), accessibility (AA contrast), and performance (Lighthouse ≥95). All agent tools are server-side only with strict input validation.
