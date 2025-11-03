---
title: "Tech Stack Reference"
description: "Complete technology stack: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Vercel AI SDK, Upstash, Resend, and testing frameworks"
date: 2025-11-02
status: stable
tags: [tech-stack, dependencies, frameworks, tools]
---

# Tech Stack Reference

Complete technology stack reference for omerakben.com AI portfolio, including framework versions, libraries, and architectural decisions.

## Core Framework

### Next.js 15 + React 19 + TypeScript

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.3.0"
}
```

**Why Next.js 15**:

- **App Router**: File-based routing with server components
- **Turbopack**: Faster dev server (HMR <100ms)
- **Image Optimization**: AVIF/WebP with lazy loading
- **Built-in SEO**: Metadata API, sitemap.xml, robots.txt generation
- **Server Actions**: Type-safe mutations without API routes
- **Vercel Deployment**: Zero-config production deployments

**Why React 19**:

- **Server Components**: Reduced client bundle size (236KB homepage)
- **Automatic Batching**: Better rendering performance
- **useOptimistic**: Optimistic UI updates for chat
- **Concurrent Features**: Improved user experience

**Why TypeScript**:

- **Strict Mode**: Zero-tolerance error policy (`strict: true`)
- **Type Safety**: 0 TypeScript errors enforced in CI/CD
- **Autocomplete**: Enhanced DX with VSCode IntelliSense
- **Refactoring Confidence**: Safe large-scale changes

## Styling & UI

### Tailwind CSS 4 + shadcn/ui

```json
{
  "tailwindcss": "^4.0.0",
  "@radix-ui/react-*": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

**Why Tailwind 4**:

- **8-Mode Brightness System**: CSS custom properties for dynamic theming
- **Zero Runtime**: All CSS generated at build time
- **Tree-Shaking**: Unused styles removed (production: ~12KB)
- **Design Tokens**: Consistent spacing, colors, typography

**Why shadcn/ui**:

- **40+ Components**: Button, Card, Dialog, Slider, Sheet, etc.
- **Radix UI Primitives**: WCAG 2A accessible by default
- **Customizable**: Owns the code, not a dependency
- **Type-Safe**: Full TypeScript support

### Framer Motion

```json
{
  "motion": "^10.18.0"
}
```

**Why Framer Motion**:

- **Production-Grade**: Powers Stripe, Vercel, Linear animations
- **Layout Animations**: Smooth sidebar resizing (320-800px)
- **Gesture Support**: Drag, hover, tap with physics
- **Reduced Motion**: Respects `prefers-reduced-motion`

### Icons & Fonts

```json
{
  "lucide-react": "^0.344.0",
  "simple-icons": "^11.0.0"
}
```

- **Lucide React**: 1000+ icons, tree-shakeable (named imports only)
- **Simple Icons**: 2800+ brand icons (42 curated in manifest)
- **Inter Font**: Google Fonts with Next.js optimization

## AI & Data

### Vercel AI SDK + OpenAI

```json
{
  "ai": "^4.0.0",
  "@ai-sdk/openai": "^1.0.0",
  "mastra": "^0.1.0"
}
```

**Why Vercel AI SDK v5**:

- **Streaming**: React Server Components with streaming responses
- **Tool Calling**: 11 server-side tools with Zod validation
- **Type-Safe**: TypeScript inference for tool schemas
- **Edge Runtime**: Fast responses on Vercel Edge Network

**Why Mastra**:

- **Multi-Agent**: Orchestrate multiple AI agents
- **Tool Registry**: Centralized tool management
- **Memory Abstraction**: Episodic memory integration

### Upstash (Redis + Vector)

```json
{
  "@upstash/redis": "^1.28.0",
  "@upstash/ratelimit": "^1.0.0",
  "@upstash/vector": "^1.0.0"
}
```

**Why Upstash Redis**:

- **Rate Limiting**: 30/60/100 req/min tiers
- **Serverless**: HTTP-based (no persistent connections)
- **Global**: Edge-compatible with low latency
- **Free Tier**: 10K requests/day

**Why Upstash Vector**:

- **Semantic Search**: 1536-dim embeddings (OpenAI)
- **KNN Algorithm**: Fast nearest-neighbor search
- **Conversation Memory**: Context-aware AI responses
- **Serverless**: HTTP-based vector database

### Email (Resend + React Email)

```json
{
  "resend": "^3.0.0",
  "@react-email/components": "^0.0.14",
  "@react-email/render": "^0.0.12"
}
```

**Why Resend**:

- **React Email Templates**: Type-safe, component-based
- **Domain Verification**: SPF/DKIM for deliverability
- **Analytics**: Open rates, click tracking
- **Developer Experience**: Best-in-class API design

## Testing & Quality

### Vitest (667 Unit Tests)

```json
{
  "vitest": "^1.2.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0"
}
```

**Why Vitest**:

- **Fast**: 667 tests in ~8 seconds
- **ESM Native**: No transpilation needed
- **Watch Mode**: Instant feedback during TDD
- **Compatible**: Drop-in Jest replacement

**Test Coverage**:

- API Routes: 268 tests (12 files)
- Components: 155 tests (8 files)
- Integration: 108 tests (7 files)
- **Total**: 667 tests across 27 files

### Playwright (E2E + Accessibility)

```json
{
  "@playwright/test": "^1.40.0",
  "axe-core": "^4.8.0"
}
```

**Why Playwright**:

- **Multi-Browser**: Chromium, Firefox, WebKit
- **WCAG Testing**: axe-core integration (8/8 routes passing)
- **Reliable**: Auto-wait, retry logic
- **Fast**: Parallel test execution

**E2E Coverage**:

- `a11y.spec.ts`: WCAG 2A compliance (8 routes)
- `agentic-sidebar.spec.ts`: Sidebar pinning, resizing
- `brightness-modes.spec.ts`: 8-mode brightness system

### Code Quality

```json
{
  "eslint": "^8.56.0",
  "@typescript-eslint/parser": "^6.19.0",
  "prettier": "^3.1.0",
  "@size-limit/preset-next": "^11.0.0"
}
```

**Quality Gates (All Must Pass)**:

1. TypeScript: `npx tsc --noEmit` → 0 errors
2. ESLint: `npm run lint` → 0 errors
3. Tests: `npm test` → 667/667 passing
4. Build: `npm run build` → success
5. Bundle Size: `npm run size` → <260KB homepage
6. E2E: `npm run test:e2e` → 8/8 WCAG 2A passing

## Deployment & DevOps

### Vercel

- **Platform**: Vercel Edge Network (global CDN)
- **CI/CD**: Auto-deploy on push to `main`
- **Preview**: Branch previews for PRs
- **Analytics**: Core Web Vitals monitoring
- **Edge Functions**: Serverless API routes

### GitHub Actions

- **Quality Gates**: `.github/workflows/quality-gates.yml`
- **Auto-Merge**: `pre-deployment` → `main` after gates pass
- **Secrets**: 5 environment variables configured
- **Artifacts**: Test reports, build logs

## Development Tools

### Package Manager

```bash
npm  # npm 10.x (no Yarn/pnpm)
```

### Build Tools

- **Turbopack**: Next.js 15 dev server (default)
- **SWC**: Fast TypeScript/JSX compilation
- **Bundle Analyzer**: `ANALYZE=true npm run build`
- **size-limit**: Bundle size budget enforcement

### Editor

- **VSCode**: Recommended (`.vscode/settings.json`)
- **Extensions**: ESLint, Prettier, Tailwind CSS IntelliSense
- **TypeScript**: tsserver integration

## Dependencies Summary

### Production Dependencies (Key)

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "typescript": "^5.3.0",
  "tailwindcss": "^4.0.0",
  "motion": "^10.18.0",
  "ai": "^4.0.0",
  "@upstash/redis": "^1.28.0",
  "@upstash/vector": "^1.0.0",
  "resend": "^3.0.0",
  "zod": "^3.22.0"
}
```

### Dev Dependencies (Key)

```json
{
  "@playwright/test": "^1.40.0",
  "vitest": "^1.2.0",
  "eslint": "^8.56.0",
  "@typescript-eslint/parser": "^6.19.0",
  "@testing-library/react": "^14.0.0"
}
```

## Architectural Decisions

### Why This Stack?

1. **Performance**: 236KB homepage, 90+ Lighthouse score
2. **Type Safety**: 0 TypeScript errors enforced
3. **Accessibility**: WCAG 2A compliant (verified via E2E)
4. **Developer Experience**: Fast builds, instant feedback, great tooling
5. **Production-Ready**: Battle-tested by Vercel, Stripe, Linear
6. **Scalability**: Serverless architecture, global edge network
7. **Cost**: Free tier for most services (Upstash, Vercel, Resend)

### Trade-offs Made

| Decision          | Pros                        | Cons             | Rationale                     |
| ----------------- | --------------------------- | ---------------- | ----------------------------- |
| Next.js 15        | Best DX, Vercel integration | Vendor lock-in   | Worth it for performance      |
| Tailwind 4        | Fast, small bundle          | Learning curve   | Design system requirement     |
| Upstash           | Serverless, free tier       | Vendor lock-in   | Better than self-hosted Redis |
| React 19          | Server Components           | Breaking changes | Future-proof architecture     |
| TypeScript Strict | Type safety, refactoring    | More verbose     | Worth it for 0 errors         |

## Related Documentation

- [Environment Variables](environment-variables.md) - Setup and configuration
- [Architecture Overview](../architecture/overview.md) - System design
- [API Documentation](../api/index.md) - Tool endpoints and schemas
- [Operations](../operations/index.md) - Deployment and monitoring
