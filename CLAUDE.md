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

### Testing (when implemented)
```bash
# Run Playwright tests (planned)
npx playwright test

# Run specific test file
npx playwright test chat.spec.ts
```

## Architecture Overview

### Directory Structure
```
src/
  app/              # Next.js App Router pages
    layout.tsx      # Root layout
    page.tsx        # Home page
    globals.css     # Global styles + Tailwind
  lib/              # (planned) Utilities, agents, tools
    agent/          # Ozzy agent + Agents SDK orchestration
    tools/          # Server-side tool implementations
PRD.md              # Product requirements
Agents.md           # Agent architecture + tool specs
Rules.md            # Brand, safety, security policies
TODO.md             # Implementation roadmap
```

### Path Aliases
- `@/*` → `./src/*` (configured in tsconfig.json)

### Agent Architecture

**Ozzy** is the embedded site assistant with these characteristics:
- **UI**: ChatKit embedded widget
- **Brain**: Agents SDK (TypeScript) for orchestration
- **Model**: gpt-4o-mini (default), gpt-5-mini for planning turns
- **Token Flow**: Short-lived client secrets via `/api/chatkit/start` + `/api/chatkit/refresh`
- **Tools** (server-side only, strict allowlist):
  - `download_resume(format: "pdf"|"docx")`
  - `list_projects(tag?: string)`
  - `open_project(slug: string)`
  - `get_contact()`

**Data Flow**: ChatKit (client) → API routes → Agents SDK → Tool endpoints → Structured response → ChatKit widgets

### Key Design Patterns

1. **Brightness Control**: 7-stop slider (−3…+3) maps to CSS custom properties (`--brand`) for theming
2. **Tool Validation**: All tool inputs validated with Zod schemas before execution
3. **Security-First**: No API keys in browser; CSP headers; rate limiting on `/api/*`
4. **Accessibility**: AA color contrast across all brightness levels; keyboard navigation; ARIA labels
5. **Performance**: Code-split demos; lazy-load heavy sections; Lighthouse ≥95 target

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

## Common Development Patterns

### Creating New Agent Tools
1. Define schema in `lib/agent/schemas.ts` (Zod)
2. Implement handler in `src/app/api/tools/[tool-name]/route.ts`
3. Register tool in Agents SDK agent definition
4. Add integration test in `tests/tools/[tool-name].spec.ts`
5. Update `Agents.md` documentation

### Adding New Pages
1. Create route in `src/app/[route]/page.tsx`
2. Add metadata (title, description, OG image)
3. Implement JSON-LD structured data
4. Ensure AA color contrast at all brightness levels
5. Add keyboard navigation support

### Theming Pattern
```tsx
// Component should respond to brightness CSS vars
<div className="bg-[var(--brand)] text-[var(--brand-contrast)]">
  {/* Content */}
</div>
```

## Project-Specific Context

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

**Reference Implementation**: `/figma/omer-akben-design/` (gitignored, reference only)
- Contains fully implemented React components from Figma
- Use as reference for design patterns, spacing, and interactions
- **Do NOT copy directly** - adapt patterns to Next.js App Router structure

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
- `-3` (Darkest): Deepest dark mode, highest contrast
- `-2` to `-1`: Progressive dark modes
- `0` (Baseline): Default dark theme
- `+1` to `+3` (Lightest): Progressive light modes
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

**Available Components** (in `figma/omer-akben-design/src/components/ui/`):
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

### Custom Components (from Figma Reference)

**Location**: `figma/omer-akben-design/src/components/`

Key custom components to reference:
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
2. **Check `/figma/omer-akben-design/`** for implementation patterns
3. **Adapt to Next.js App Router**:
   - Convert `wouter` routing to Next.js `Link` and file-based routing
   - Move pages from `src/pages/*.tsx` to `src/app/*/page.tsx`
   - Extract reusable components to `src/components/`
4. **Use design tokens** from `globals.css` (don't hardcode colors)
5. **Maintain brightness system** compatibility
6. **Test across all 7 brightness modes**

### Component Development Checklist

When creating new components:
- [ ] Use CSS custom properties for colors (no hardcoded hex values)
- [ ] Apply responsive patterns (mobile-first)
- [ ] Add proper TypeScript types
- [ ] Include ARIA labels for accessibility
- [ ] Test hover/focus/active states
- [ ] Verify across brightness modes (-3 to +3)
- [ ] Follow existing naming conventions
- [ ] Add animations with `motion` where appropriate
