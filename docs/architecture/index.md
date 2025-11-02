---
title: "Architecture Documentation"
description: "Technical architecture, system design, and implementation status for omerakben.com"
date: 2025-11-02
status: stable
tags: [architecture, system-design, overview]
---

# Architecture Documentation

Complete technical architecture and implementation documentation for omerakben.com AI portfolio.

## Contents

### [Codebase Architecture Overview](overview.md)

Comprehensive technical architecture covering:

- Next.js 15 App Router stack
- AI assistant with 11 server-side tools
- Episodic memory system (Upstash Vector)
- 8-mode brightness design system
- Component architecture and data flow

### [Implementation Status](implementation-status.md)

Current production status and feature completeness:

- Production deployment details
- Test coverage (667/667 passing)
- Quality gates compliance
- Feature roadmap and completion status
- Recent implementations and improvements

## Key Technologies

- **Framework**: Next.js 15 App Router + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui primitives
- **AI**: Vercel AI SDK + OpenAI GPT-4o-mini
- **Memory**: Upstash Vector (episodic) + Redis (rate limiting)
- **Email**: Resend with React Email templates
- **Testing**: Vitest (667 tests) + Playwright (WCAG 2A)
- **Deployment**: Vercel with CI/CD quality gates

## Related Documentation

- [API Documentation](../api/index.md) - Tool schemas and endpoints
- [Guides](../guides/index.md) - Accessibility, SEO implementation
- [Operations](../operations/index.md) - Runbook, security, performance
