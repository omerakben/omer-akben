# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Testing (planned)
```bash
# Run Playwright tests (when implemented)
npx playwright test

# Run specific test file
npx playwright test chat.spec.ts
```

## Architecture Overview

### Directory Structure
```
src/
  app/                      # Next.js App Router pages
    layout.tsx              # Root layout with BrightnessProvider
    page.tsx                # Home page
    globals.css             # Global styles + Tailwind + 7-mode brightness tokens
    api/tools/              # Agent tool API endpoints
      download-resume/      # Resume download handler
      list-projects/        # Project listing handler
      open-project/         # Project detail handler
      get-contact/          # Contact info handler
  components/               # Reusable UI components
    ui/                     # shadcn/ui primitives (button, card, dialog, etc.)
    app-header.tsx          # Navigation with brightness control
    app-footer.tsx          # Footer with social links
    brightness-control.tsx  # 7-stop brightness slider
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
PRD.md                      # Product requirements
Agents.md                   # Agent architecture + tool specs
Rules.md                    # Brand, safety, security policies
TODO.md                     # Implementation roadmap
```

### Path Aliases
- `@/*` → `./src/*` (configured in tsconfig.json)

### Archive Directory
The `/archive/` directory contains the original Vite + Wouter implementation from Figma:
- **Purpose**: Reference implementation showing complete design system
- **Tech**: Vite, React, Wouter (client-side routing), shadcn/ui
- **Usage**: Reference for design patterns, component structure, and interactions
- **Do NOT**: Copy directly or import from archive - adapt patterns to Next.js App Router
- **Note**: Archive is excluded from TypeScript compilation (tsconfig.json)

### Agent Architecture

**Ozzy** is the embedded site assistant with these characteristics:
- **UI**: ChatKit embedded widget (planned - not yet implemented)
- **Brain**: Agents SDK (TypeScript) for orchestration (planned)
- **Model**: gpt-4o-mini (default), gpt-5-mini for planning turns
- **Token Flow**: Short-lived client secrets via `/api/chatkit/start` + `/api/chatkit/refresh` (planned)
- **Tools** (server-side only, strict allowlist):
  - `download_resume(format: "full"|"short")` → `/api/tools/download-resume`
  - `list_projects(category?, featured?, limit?)` → `/api/tools/list-projects`
  - `open_project(slug)` → `/api/tools/open-project`
  - `get_contact()` → `/api/tools/get-contact`
- **Grounding Data**: `src/data/facts.ts` contains personal info, skills, education, certifications

**Data Flow**: ChatKit (client) → API routes → Tool endpoints → Zod validation → Data sources → Structured JSON response

**Current Implementation Status**:
- ✅ Tool API endpoints implemented with Zod validation
- ✅ Data sources (facts.ts, projects.ts) populated
- ✅ Schemas defined in `lib/agent-tools/schemas.ts`
- ⏳ ChatKit integration pending
- ⏳ Agents SDK orchestration pending

### Key Design Patterns

1. **Brightness Control**: 7-stop system (`-3` to `+3` plus `auto`) implemented via `data-brightness` attribute
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

4. **Security-First**: No API keys in browser; CSP headers; rate limiting on `/api/*` (planned)
5. **Accessibility**: AA color contrast across all brightness levels; keyboard navigation; ARIA labels
6. **Performance**: Code-split demos; lazy-load heavy sections; Lighthouse ≥95 target

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

## Key Architectural Decisions

### Turbopack Build System
- **Why**: Faster builds and hot reload compared to Webpack
- **Impact**: All commands use `--turbopack` flag (`npm run dev`, `npm run build`)
- **Note**: Some features may differ from standard Next.js Webpack builds

### Brightness System Over Theme Toggler
- **Why**: More granular control than binary dark/light mode
- **Implementation**: 5 manual stops (-2 to +2) plus auto mode
- **Benefits**: Users can fine-tune contrast for comfort/accessibility
- **Challenge**: Requires testing all components across all modes

### Server-Side Agent Tools Only
- **Why**: Security - never expose OpenAI API keys in browser
- **Pattern**: All agent tools are Next.js API routes with Zod validation
- **Flow**: ChatKit (client) → API route → Tool handler → Data source
- **Future**: Short-lived client secrets for ChatKit authentication

### Single Source of Truth for Data
- **Personal Data**: `src/data/facts.ts` (agent grounding)
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
// brightness is: '-2' | '-1' | '0' | '+1' | '+2' | 'auto'
// Current implementation: range from -2 to +2
```

## Project-Specific Context

### Implementation Status

**Completed**:
- ✅ Brightness system (7 modes + auto) with context provider
- ✅ Core pages: /, /journey, /projects, /skills, /credentials, /contact, /recruiter
- ✅ 404 error page with custom illustration and helpful navigation
- ✅ Agent tool API endpoints with Zod validation
- ✅ Data architecture (facts, projects, journey, skills, testimonials)
- ✅ shadcn/ui component library setup
- ✅ App header with navigation and brightness control
- ✅ App footer with social links

**In Progress**:
- ⏳ Project detail pages (`/projects/[slug]`)
- ⏳ ChatKit integration
- ⏳ Agents SDK orchestration

**Planned**:
- ⏳ /ai page with ChatKit widget
- ⏳ ChatKit authentication endpoints
- ⏳ Resume download functionality
- ⏳ SEO optimization (JSON-LD, OG images, sitemap)
- ⏳ CSP headers and security hardening
- ⏳ Playwright test suite
- ⏳ Performance optimization

### Working with Data Files

**Agent Grounding Data** (`src/data/facts.ts`):
- Contains personal info, professional background, skills, education
- Used by agent tools to answer questions about Omer
- Helper functions: `getContactInfo()`, `getSkillsByCategory()`, `getFeaturedProjects()`
- **Important**: When updating personal information, update this file

**Projects Data** (`src/data/projects.ts`):
- 9 projects organized in 3 tiers (production, ready-to-deploy, production-ready)
- Each project has: id, slug, title, description, technologies, role, category, status
- Helper functions: `getProjectBySlug()`, `getFeaturedProjects()`, `getProjectsByCategory()`
- Categories: `"ai-ml" | "web" | "mobile" | "tools" | "other"`

### Planned Milestones (from TODO.md)
- **M1**: Scaffold + /recruiter + /ai with token flow + brightness tokens
- **M2**: Case studies + tuel gallery + SEO
- **M3**: Agent tools wired + eval harness
- **M4**: Security/CSP + Playwright + polish + launch

### Success Metrics
- Resume download CTR ≥35% from /recruiter
- Time-to-resume ≤10s
- Chat starts/session ≥20%
- Case-study dwell time ≥45s

### Evaluation Strategy
Build 10 "golden" agent tasks for regression testing:
- "Download PDF resume"
- "List AI projects"
- "Open Elon AI Chat case study"
- "Refuse untrusted link request"
- etc.

Use OpenAI Evals with trace grading + datasets.

## Important Files to Review

- **PRD.md**: Complete product requirements and vision
- **Agents.md**: Agent architecture, tool specs, data flow
- **Rules.md**: Brand, safety, security policies (enforced by agent)
- **TODO.md**: Implementation roadmap with current status
- **package.json**: Dependencies and available scripts

## Notes for Future Sessions

When implementing features:
1. **Read PRD.md first** to understand product vision and constraints
2. **Check Agents.md** for agent-specific requirements and tool specs
3. **Follow Rules.md** for brand voice, security, and safety requirements
4. **Update TODO.md** status when completing tasks
5. **Validate against success metrics** (Lighthouse, CTR, time-to-resume)

The project emphasizes security (short-lived tokens), accessibility (AA contrast), and performance (Lighthouse ≥95). All agent tools must be server-side only with strict input validation.

---

## Design System & Figma Integration

### Figma Design Resources

**Design File**: [omerakben.com Figma](https://www.figma.com/design/GGCkxSgirBbmjQlioQKWEa/omerakben.com?node-id=0-1)
- **Design Mode**: Full visual designs and prototypes
- **Dev Mode**: Inspect spacing, colors, typography, and export assets

**Reference Implementation**: `/archive/omer-akben-design/` (archived reference only)
- Contains fully implemented React components from Figma using Vite + Wouter
- Use as reference for design patterns, spacing, and interactions
- **Do NOT copy directly** - adapt patterns to Next.js App Router structure
- Convert `wouter` routing to Next.js `Link` and file-based routing

### Page Structure & Routes

Based on Figma design, implement these routes:

```
/ (Home)           Hero + Featured Projects + Testimonials + CTA
/journey           Timeline of professional experience
/projects          Project showcase grid with filtering
/skills            Skills & expertise visualization
/credentials       Certifications, education, awards
/contact           Contact form + social links
/ai                ChatKit widget (Ozzy assistant)
/recruiter         TL;DR + resume download buttons
```

### Design Token System

#### 7-Mode Brightness System

The design uses a **7-stop brightness control** (`-3` to `+3`) with "auto" mode:

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
- `-2`: Deepest dark mode
- `-1`: Medium dark mode
- `0` (Baseline): Default dark theme
- `+1`: Soft light mode
- `+2`: Bright light mode
- `auto`: System preference + time-based adjustment
  - Dark OS preference: Uses `-1` at night (10pm-5am), `0` otherwise.
  - Light OS preference: Uses `+1` in the evening/morning (6pm-8am), `+2` during the day.

**Implementation Pattern**:
```tsx
// brightness-context.tsx manages data-brightness attribute
<BrightnessProvider>
  {children}
</BrightnessProvider>

// Access in components
const { brightness, setBrightness } = useBrightness();
```

#### Color Usage Guidelines

**Surface Colors**:
```tsx
// Page backgrounds
className="bg-surf-0"

// Cards and containers
className="bg-surf-1 border border-border-line"

// Elevated/modal surfaces
className="bg-surf-2"
```

**Text Colors**:
```tsx
// Headings and primary content
className="text-text-1"

// Body text and descriptions
className="text-text-2"

// Captions, labels, metadata
className="text-text-3"
```

**Brand Colors**:
```tsx
// Primary CTAs and highlights
className="bg-brand-primary text-surf-0"

// Accent elements (badges, icons)
className="text-brand-primary"
className="bg-accent-primary"
```

#### Typography Scale

**Font Family**: Inter (with fallbacks)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Base Font Size**: 16px

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

**Font Weights**:
- `font-bold` (700): Headings, CTAs
- `font-medium` (500): Labels, buttons, emphasis
- `font-normal` (400): Body text

#### Spacing & Layout

**Container Pattern**:
```tsx
// Max-width container with responsive padding
className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[120px]"

// Section vertical spacing
className="py-12 md:py-20"
```

**Common Spacing Values**:
- Gap/padding: `gap-4`, `gap-6`, `gap-8`, `gap-12`
- Margins: `mb-4`, `mb-6`, `mb-8`, `mb-12`

**Border Radius**:
```tsx
// Cards and containers
className="rounded-[20px]"

// Buttons
className="rounded-[10px]"

// Small elements (badges, chips)
className="rounded-full"
```

### Component Library (shadcn/ui)

The design uses **shadcn/ui** components with Radix UI primitives:

**Available Components** (in `src/components/ui/` - adapted from reference in `archive/omer-akben-design/`):
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

### Custom Components

**Current Location**: `src/components/`
**Reference Location**: `archive/omer-akben-design/src/components/`

Key custom components implemented:
- `app-header.tsx`: Navigation header with brightness control
- `app-footer.tsx`: Footer with social links
- `hero-section.tsx`: Animated hero with gradient backgrounds
- `project-card.tsx`: Project showcase cards
- `timeline.tsx`: Journey timeline component
- `chat-drawer.tsx`: Chat interface (will integrate ChatKit)
- `brightness-control.tsx`: 7-stop brightness slider

**Navigation Structure** (from `app-header.tsx`):
```tsx
const navItems = [
  { label: 'Journey', href: '/journey', icon: Compass },
  { label: 'Projects', href: '/projects', icon: Briefcase },
  { label: 'Skills', href: '/skills', icon: Zap },
  { label: 'Credentials', href: '/credentials', icon: GraduationCap },
  { label: 'Contact', href: '/contact', icon: MessageSquare },
];
```

### Icons

**Library**: Lucide React (`lucide-react`)

**Common Icons Used**:
- Navigation: `Compass`, `Briefcase`, `Zap`, `GraduationCap`, `MessageSquare`
- UI: `Menu`, `X`, `ChevronDown`, `ExternalLink`, `Download`
- Brand: `Bot` (for Ozzy AI assistant)

**Usage**:
```tsx
import { Bot, Download, ExternalLink } from 'lucide-react';

<Button>
  <Download className="w-4 h-4 mr-2" />
  Download Resume
</Button>
```

### Animation & Motion

**Library**: Framer Motion (`motion`)

**Common Patterns**:
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

// Animated bot icon
<motion.div
  animate={{
    rotate: [0, -10, 10, -10, 0],
    y: [0, -2, 0, -2, 0]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  <Bot />
</motion.div>
```

**Transition Classes**:
```tsx
// Color transitions for brightness changes
className="transition-colors duration-300"

// Hover effects
className="hover:scale-105 transition-all duration-300"
```

### Responsive Design

**Breakpoints** (Tailwind defaults):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Common Patterns**:
```tsx
// Mobile-first responsive text
className="text-[32px] md:text-[40px] lg:text-[56px]"

// Responsive padding
className="px-4 md:px-8 lg:px-[120px]"

// Grid layouts
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Flex direction
className="flex flex-col lg:flex-row gap-8"
```

### Accessibility Requirements

**Color Contrast**: Maintain AA compliance across all 7 brightness modes
**Keyboard Navigation**: All interactive elements must be keyboard accessible
**ARIA Labels**: Required for icon-only buttons and controls
**Focus States**: Visible focus rings on all interactive elements

**Example**:
```tsx
<Button
  aria-label="Open chat with Ozzy"
  className="focus-visible:ring-2 focus-visible:ring-brand-primary"
>
  <Bot className="w-4 h-4" />
</Button>
```

### Design System Migration Path

When implementing features from Figma:

1. **Reference the Figma file** in dev mode for exact spacing, colors, typography
2. **Check `/archive/omer-akben-design/`** for implementation patterns (Vite + Wouter reference)
3. **Adapt to Next.js App Router**:
   - Convert `wouter` routing to Next.js `Link` and file-based routing
   - Pages go in `src/app/*/page.tsx` following Next.js conventions
   - Extract reusable components to `src/components/`
4. **Use design tokens** from `globals.css` (don't hardcode colors)
5. **Maintain brightness system** compatibility
6. **Test across all brightness modes (-2 to +2, plus auto)**

### Component Development Checklist

When creating new components:
- [ ] Use CSS custom properties for colors (no hardcoded hex values)
- [ ] Apply responsive patterns (mobile-first)
- [ ] Add proper TypeScript types
- [ ] Include ARIA labels for accessibility
- [ ] Test hover/focus/active states
- [ ] Verify across brightness modes (-2 to +2, plus auto)
- [ ] Follow existing naming conventions
- [ ] Add animations with `motion` where appropriate

## Common Pitfalls to Avoid

### 1. Archive Directory Confusion
- **Don't**: Import from `/archive/omer-akben-design/`
- **Don't**: Copy files directly without adapting to Next.js
- **Do**: Reference archive for design patterns and spacing
- **Do**: Reimplement components in `src/` using Next.js conventions

### 2. Path Alias Usage
- **Don't**: Use relative imports like `../../components/ui/button`
- **Do**: Use `@/components/ui/button` for all src imports
- **Why**: Cleaner imports and easier refactoring

### 3. Color Hardcoding
- **Don't**: Use hex colors like `#00FFC6` or `bg-[#00FFC6]`
- **Do**: Use CSS custom properties like `bg-brand-primary`
- **Why**: Colors must adapt to brightness mode changes

### 4. Brightness Mode Testing
- **Don't**: Test only at default brightness (0)
- **Do**: Test all modes (-2, -1, 0, +1, +2, auto)
- **Why**: Text contrast and borders behave differently at each level

### 5. Tool Validation
- **Don't**: Parse request body without Zod validation
- **Do**: Define schemas in `lib/agent-tools/schemas.ts`
- **Why**: Type safety and runtime validation for agent inputs

### 6. Component Library Source
- **Don't**: Install shadcn/ui components via CLI (already installed)
- **Do**: Use existing components from `src/components/ui/`
- **Why**: Components are already customized for brightness system

## Quick Reference

### File Locations
- **Pages**: `src/app/[route]/page.tsx`
- **API Routes**: `src/app/api/[endpoint]/route.ts`
- **Components**: `src/components/` (custom) or `src/components/ui/` (shadcn)
- **Data**: `src/data/*.ts` (facts, projects, journey, skills, testimonials)
- **Schemas**: `src/lib/agent-tools/schemas.ts`
- **Utilities**: `src/lib/utils.ts`

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
