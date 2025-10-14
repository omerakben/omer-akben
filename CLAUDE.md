# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TL;DR - Quick Start

**What**: Personal portfolio site with embedded AI assistant (ChatKit + Agents SDK)
**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 4 + Turbopack
**Key Feature**: 8-mode brightness system (-3 to +3 plus auto)

**Essential Commands**:
```bash
npm run dev                      # Start dev server (http://localhost:3000)
npm test                         # Run Vitest test suite (72 tests)
npm test -- --watch              # Watch mode for TDD
npm run lint                     # ESLint check
npx tsc --noEmit                 # TypeScript check
npm run build                    # Production build (validates all quality gates)
npm run analyze                  # Bundle size analysis
```

**Critical Rules**:
- ✅ Use `@/` path alias for all src imports (never relative imports)
- ✅ Test all 8 brightness modes (-3 to +3 plus auto)
- ✅ Use CSS custom properties (not hex colors like `bg-[#00FFC6]`)
- ❌ Never import from `/archive/` paths in main `src/` code
- ❌ Never expose API keys in browser (always server-side API routes)

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

### 8-Mode Brightness System (Critical Understanding Required)
- **Why**: More granular control than binary dark/light mode
- **Implementation**: `data-brightness` attribute on `<html>` element (managed by BrightnessProvider)
- **Range**: 🌙 -3 (darkest) → 0 (baseline) → +3 (brightest) ☀️ + `auto` mode
- **CSS Tokens**: All colors defined as CSS custom properties in `globals.css` that adapt per mode
- **Challenge**: Every component must work across all 8 modes - test thoroughly

**Critical Rule**: Never use hardcoded colors (like `#00FFC6` or `bg-[#00FFC6]`). Always use design tokens:
- `bg-surf-0/1/2` for surfaces
- `text-text-1/2/3` for text hierarchy
- `bg-brand-primary` for brand colors
- `border-border-line` for borders

### Server-Side Agent Tools Only (Security Pattern)
- **Why**: Never expose OpenAI API keys in browser
- **Pattern**: All agent tools are Next.js API routes (`/api/tools/*`) with Zod validation
- **Flow**: ChatKit client → API route → Zod validate → Tool handler → Data source → JSON response
- **Response Format**: `{ success: boolean, data?: any, error?: string }`

### Single Source of Truth for Data
- `src/data/facts.ts` → Personal info, skills, education (uses actual resume data)
- `src/data/projects.ts` → Project catalog with 9 projects across 3 tiers
- Helper functions exported from each file (e.g., `getContactInfo()`, `getFeaturedProjects()`)

### Archive Directory Pattern (Reference, Never Import)
- `/archive/*` contains 9 portfolio demo projects
- **Use for**: Design patterns, reference implementations, code analysis
- **Never**: Import from archive paths in main `src/` code
- **Adapt, Don't Copy**: Convert patterns to Next.js App Router structure

## Common Development Patterns

### Creating New Agent Tools
1. Define Zod schemas in `lib/agent-tools/schemas.ts`
2. Implement POST handler in `src/app/api/tools/[tool-name]/route.ts`
3. Validate input with `schema.parse(body)`, return `{ success, data?, error? }`
4. Test with curl: `curl -X POST http://localhost:3000/api/tools/[tool-name] -H "Content-Type: application/json" -d '{}'`
5. Update `Agents.md` documentation

**Pattern**: All agent tools are Next.js API routes with Zod validation, never expose tools directly to browser.

### Adding New Pages
1. Create route in `src/app/[route]/page.tsx` with metadata export
2. Test all 8 brightness modes for color contrast (AA compliance)
3. Ensure keyboard navigation and ARIA labels work properly

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

**Critical Design Rule**: 🚫 **Never use emojis** - always use Lucide React icons for consistency across all 8 brightness modes and professional design standards.

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

### Robot Illustration Component (`src/components/robot-illustration.tsx`)

**Purpose**: Animated hero illustration demonstrating automation workflow through conversation-style speech balloons.

**Key Features**:
- **Speech Balloons**: 4 sequential messages with Lucide React icons (Code2, Brain, TestTube, Rocket)
- **12-Second Animation Cycle**: Staggered timing (0.8s, 2.8s, 4.8s, 6.8s delays)
- **Conversation Flow**: "Writing code" → "AI enhanced" → "Running tests" → "Deployed! 90% coverage"
- **Accessibility**: Full `prefers-reduced-motion` support
- **Positioning**: Speech balloons at `top-12` for proper spacing

**Animation Pattern**:
```tsx
// Animation cycle state triggers restart via keyed components
const [animationCycle, setAnimationCycle] = useState(0);

useEffect(() => {
  if (prefersReducedMotion) return;
  const timer = setInterval(() => {
    setAnimationCycle((prev) => prev + 1);
  }, 12000);
  return () => clearInterval(timer);
}, [prefersReducedMotion]);

// Keyed components restart animation on cycle change
<motion.div key={`${animationCycle}-msg-${message.id}`}>
```

**Speech Balloon Design**:
- Full `rounded-xl` borders (no cut-off corners)
- Border: `border-brand-primary/50`
- Background: `bg-surf-1` with `backdrop-blur-sm`
- SVG tail with matching border stroke for seamless connection
- Icon + text layout: `flex items-center gap-2`

**Floating Code Elements**:
- `</>` symbol: `bottom-8 right-10` (bottom-right position)
- `{ }` symbol: `bottom-20 left-10` (bottom-left position)
- `[ ]` symbol: `top-1/2 right-5` (right-side position)

**Critical Rules**:
- ✅ Always use Lucide React icons (never emojis)
- ✅ GPU-accelerated animations (transform/opacity only)
- ✅ Respect `prefers-reduced-motion` for accessibility
- ✅ Use design tokens (never hardcoded colors)
- ❌ No positioning that creates awkward visual overlaps

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

**Initial Setup**:
```bash
npm install
npm run dev  # Visit http://localhost:3000
```

**Development Workflow**:
1. Always work on feature branches: `git checkout -b feature/your-feature`
2. Make changes in `src/` using `@/` imports (never relative paths)
3. Write co-located tests: `src/components/my-component.test.tsx`
4. Use TDD with watch mode: `npm test -- --watch`
5. Test all 8 brightness modes (-3 to +3 plus auto)
6. Run quality gates before commit:
   ```bash
   npm test && npm run lint && npx tsc --noEmit && npm run build
   ```

**First Steps**:
- Review `PRD.md` for project vision and goals
- Check `Agents.md` for agent architecture and tool specs
- Read `src/data/facts.ts` (single source of truth for personal data)

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

**Build Errors**:
- "Module not found" → Use `@/` path alias, never relative imports or archive imports
- TypeScript errors in archive → Archive excluded from tsconfig, don't import from it

**Brightness Testing**:
- Toggle `data-brightness` attribute on `<html>` in DevTools to test all 8 modes
- If colors don't change → You're using hardcoded hex instead of CSS custom properties

**Development Server**:
- Port 3000 in use → `lsof -ti:3000 | xargs kill`
- Slow hot reload → Restart dev server, clear `.next/` directory

**Testing Agent Tools** (curl examples):
```bash
# All endpoints: POST with JSON body → { success, data?, error? }
curl -X POST http://localhost:3000/api/tools/download-resume \
  -H "Content-Type: application/json" -d '{"format": "short"}'

curl -X POST http://localhost:3000/api/tools/list-projects \
  -H "Content-Type: application/json" -d '{"category": "ai-ml", "limit": 5}'
```

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
```bash
npm test                # 72/72 tests passing (Vitest)
npm run lint            # Zero errors/warnings (ESLint)
npx tsc --noEmit        # Zero type errors (strict mode)
npm run build           # 22 routes, ~1.5s build time
```

**Current Metrics**:
- Build Time: ~1.5-1.7 seconds (excellent)
- Bundle: 166 kB shared chunks, 3-13 kB per page
- First Load JS: 153 kB - 2.33 MB (home/skills use Framer Motion)
- Actual Transfer: ~30KB gzipped (excellent)

**Key Quality Decisions**:
- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- AA color contrast across all 8 brightness modes
- Bundle size accepted (Framer Motion required for animations)
- See `claudedocs/bundle-analysis.md` for detailed performance analysis

## Important Documentation Files

**Product & Architecture**:
- `PRD.md` - Product requirements and vision
- `Agents.md` - Agent architecture, tools, data flow
- `TODO.md` - Implementation roadmap

**Code References**:
- `src/data/facts.ts` - Single source of truth for personal data
- `src/data/projects.ts` - Project catalog (9 projects)
- `src/lib/agent-tools/schemas.ts` - Zod schemas for all agent tools

**Quality & Analysis**:
- `claudedocs/bundle-analysis.md` - Bundle size analysis
- `Analyze.md` - Pre-launch QA checklist


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
