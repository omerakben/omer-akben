---
title: "Reference Documentation"
description: "Technical reference: environment variables, tech stack, configuration, and quick reference guides"
date: 2025-11-02
status: stable
tags: [reference, configuration, tech-stack, environment]
---

# Reference Documentation

Quick reference guides for environment configuration, technology stack, and common development patterns.

## Contents

### [Environment Variables](environment-variables.md)

Complete environment variable reference:

- **Required for Production**: OpenAI, Upstash Redis, Upstash Vector, Resend
- **Optional**: Analytics, feature flags
- **Local Development**: `.env.local` setup guide
- **CI/CD Configuration**: GitHub Actions secrets
- **Security**: Best practices for secret management

**Key Use**: Initial project setup and troubleshooting missing env vars.

### [Tech Stack](tech-stack.md)

Complete technology stack reference:

- **Framework**: Next.js 15 App Router + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui + Framer Motion
- **AI**: Vercel AI SDK + OpenAI + Mastra
- **Data**: Upstash Vector (memory) + Redis (rate limiting)
- **Testing**: Vitest (667 tests) + Playwright (E2E + WCAG)
- **Deployment**: Vercel with CI/CD
- **Email**: Resend + React Email

**Key Use**: Understanding architecture decisions and dependency management.

## Quick Reference

### Development Commands

```bash
npm run dev           # Dev server (Turbopack)
npm test              # Run all 667 unit tests
npm run test:e2e      # E2E tests (Playwright)
npm run lint          # ESLint validation
npx tsc --noEmit      # TypeScript check
npm run build         # Production build
npm run analyze       # Bundle analysis
```

### Quality Gates (All Must Pass)

1. TypeScript: `npx tsc --noEmit` → 0 errors
2. ESLint: `npm run lint` → 0 errors
3. Tests: `npm test` → 667/667 passing
4. Build: `npm run build` → success
5. Bundle Size: `npm run size` → within budget
6. E2E: `npm run test:e2e` → 8/8 WCAG 2A passing

### Path Aliases

- `@/*` → `./src/*` (always use `@/` imports, never relative)
- No `/archive/` imports (reference only)

### Critical Rules

- ✅ Use CSS custom properties (never hardcoded colors)
- ✅ Test all 8 brightness modes (-3 to +3, auto)
- ✅ All API calls server-side (never expose keys)
- ✅ 6 quality gates must pass before commit
- ❌ Never skip tests or bypass validation
- ❌ No TODO comments, console.log, or hardcoded values

## Configuration Files

| File                   | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `next.config.ts`       | Next.js config, security headers, optimizations |
| `tailwind.config.ts`   | Tailwind config, design system tokens           |
| `tsconfig.json`        | TypeScript strict mode configuration            |
| `.eslintrc.json`       | ESLint rules and plugins                        |
| `vitest.config.ts`     | Unit test configuration                         |
| `playwright.config.ts` | E2E test configuration                          |
| `package.json`         | Dependencies and scripts                        |

## Related Documentation

- [Architecture](../architecture/index.md) - Technical architecture and design patterns
- [API Documentation](../api/index.md) - Tool schemas and endpoints
- [Operations](../operations/index.md) - Runbook, security, performance
- [Guides](../guides/index.md) - Accessibility, SEO implementation
