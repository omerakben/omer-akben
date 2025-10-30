<div align="center">

# omerakben.com

### AI-Powered Portfolio with Proactive Visitor Engagement

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-omerakben.com-brightgreen?style=for-the-badge)](https://omerakben.com)
[![Build Status](https://img.shields.io/github/actions/workflow/status/omerakben/omer-akben/quality-gates.yml?branch=pre-deployment&style=for-the-badge&label=Quality%20Gates)](https://github.com/omerakben/omer-akben/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-544/544_passing-success?style=for-the-badge)](package.json)
[![Bundle](https://img.shields.io/badge/Bundle-7.66KB/40KB-success?style=for-the-badge)](package.json)

[View Live Site](https://omerakben.com) | [Download Resume](https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view) | [Contact Me](mailto:me@omerakben.com)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [WIP + Cache Preferences](#-wip--cache-preferences)
- [Tech Stack](#-tech-stack)
- [AI Features](#-ai-features-ozzy-assistant)
- [Getting Started](#-getting-started)
- [Project Highlights](#-project-highlights)
- [Quality Metrics](#-quality-metrics)
- [Documentation](#-documentation)
- [Contact](#-contact)
- [License](#-license)

---

## 🎯 About

**omerakben.com** is a modern portfolio website showcasing full-stack development expertise with an intelligent AI assistant that proactively engages visitors. Built with Next.js 15, React 19, and TypeScript, it demonstrates production-ready code quality with enterprise-level standards.

### What Makes This Special

- **🤖 AI-Powered Engagement**: "Ozzy" AI assistant with 11 specialized tools for visitor interaction
- **📧 Proactive Contact Collection**: Automatically collects visitor information and sends meeting invitations
- **🧠 Contextual Memory**: Episodic memory system with semantic search for personalized conversations
- **♿ Accessibility First**: WCAG 2A compliant across all 8 routes with unique 8-mode brightness system
- **⚡ Performance Optimized**: 90% bundle reduction (2.33MB → 236KB), sub-second page loads
- **✅ Zero Technical Debt**: 544 passing tests, 0 TypeScript errors, 0 ESLint errors

---

## ✨ Key Features

### 🤖 Intelligent AI Assistant
- **11 Server-Side Tools** for resume downloads, project exploration, and contact management
- **Proactive Engagement** - asks permission to collect contact info and send Zoom links after detecting visitor interest
- **Follow-Up Suggestions** - contextual question chips based on conversation topics
- **Thread Persistence** - maintains conversation context across sessions

### 🎨 Innovative Design
- **8-Mode Brightness System** - accessibility feature with brightness levels from -3 (darkest) to +3 (brightest)
- **Responsive Sidebar** - pin/unpin with width resizing (320-800px) and localStorage persistence
- **Design System** - 40+ shadcn/ui components with CSS custom properties for theming
- **Global Chat Access** - floating button on all pages with keyboard shortcuts (Cmd/Ctrl+Shift+N)

### 📧 Contact Collection System
- **Rate-Limited Email Delivery** - Resend integration with React Email templates
- **Smart Triggers** - activates on explicit request, engagement score ≥60, or high-value user detection
- **Professional Templates** - branded emails with meeting links and resume downloads
- **Security Focused** - email validation, PII redaction, 7-day TTL on stored contacts

### 🧠 Memory Systems
- **Episodic Memory** - semantic search across conversation history using Upstash Vector (1536-dim OpenAI embeddings)
- **Thread Memory** - conversation state persistence with localStorage
- **Vector Search** - dual-path routing for projects (Redis FT.SEARCH) and conversations (Upstash Vector)

### ⚡ Performance & Quality
- **Bundle Optimization** - 90% reduction via icon manifest (42 curated icons, tree-shaking enabled)
- **Test Coverage** - 544 tests across 27 files (100% pass rate)
- **CI/CD Pipeline** - 6 quality gates enforced on every commit
- **Production Ready** - deployed on Vercel with zero-downtime updates

- **🚧 Work-in-Progress Experience** - banner + modal keep visitors informed of live iterations
- **🧭 Cache Controls** - visitors can choose performance or always-fresh API responses

---

## 🚧 WIP + Cache Preferences

- **First-visit modal** tied to the active build ID communicates that pages are shipping in public.
- **Sticky SiteStatus banner** surfaces build metadata, cache toggle, and a one-click clear cache action.
- **Caching preferences** are persisted via `ozzy_cache_pref` and honored by API routes (e.g. [`/api/example`](src/app/api/example/route.ts)).
- **Status resources**: [Status dashboard](/status) and [Cookie policy](/legal/cookies) outline what is working, what is missing, and how cookies behave.

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - App Router with React Server Components
- **React 19** - Latest features and optimizations
- **TypeScript 5** - Strict mode with zero-error policy
- **Tailwind CSS 4** - Utility-first styling with CSS custom properties
- **shadcn/ui** - 40+ accessible UI primitives
- **Framer Motion** - Smooth animations and transitions
- **Lucide Icons** - Tree-shaken icon system

### AI & Backend
- **Vercel AI SDK v5** - Streaming AI responses with tool calling
- **OpenAI GPT-4** - Language model for conversational AI
- **Upstash Redis** - Rate limiting and caching
- **Upstash Vector** - Episodic memory with semantic search
- **Resend** - Email delivery service
- **React Email** - Email template system

### Development & Testing
- **Vitest** - Unit testing framework (544 tests)
- **Playwright** - E2E testing and accessibility validation
- **ESLint** - Code quality and consistency
- **Size Limit** - Bundle size monitoring
- **GitHub Actions** - CI/CD with automated quality gates

---

## 🤖 AI Features (Ozzy Assistant)

Ozzy is an intelligent AI assistant powered by OpenAI's GPT-4 with 11 specialized tools for visitor engagement.

### Available Tools

| Tool | Description | Rate Limit |
|------|-------------|------------|
| `download_resume` | Download resume in PDF format | 60/min |
| `download_certificate` | Download AWS/NSS certifications | 60/min |
| `list_projects` | Browse portfolio projects with filters | 60/min |
| `open_project` | Get detailed project information | 60/min |
| `get_contact` | Retrieve contact information | 60/min |
| `collect_contact` | Proactive contact collection + email delivery | 5 per IP per 24h |
| `navigate_page` | Navigate to specific pages | 60/min |
| `provide_navigation_links` | Get site navigation structure | 60/min |
| `extract_summary` | Extract concise content summaries | 60/min |
| `profile_performance` | Performance profiling utilities | 60/min |
| `trigger_workflow` | Execute predefined workflows | 60/min |

### Proactive Engagement

Ozzy intelligently offers to collect contact information when:
1. **Explicit Request** - user asks to schedule a meeting
2. **Engagement Score ≥60** - based on message count, topics discussed, projects viewed
3. **High-Value User** - recruiter/hiring manager + 3+ messages + multiple topics explored

Upon permission, Ozzy:
- Collects name, email, company, purpose
- Validates email format and blocks disposable addresses
- Sends professional email with Zoom link and resume downloads
- Stores contact securely in Redis with 7-day TTL
- Returns meeting link immediately in chat

### Memory & Context

- **Episodic Memory** - semantic search across past conversations using vector embeddings
- **Thread Persistence** - conversation history maintained across sessions
- **Follow-Up Suggestions** - contextual questions based on detected topics

For complete AI architecture details, see [AGENTS.md](AGENTS.md).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- **OpenAI API Key** - for AI assistant functionality
- **Upstash Account** - for Redis and Vector services (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omerakben/omer-akben.git
   cd omer-akben
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Add your API keys to `.env.local`:
   ```bash
   # Required
   OPENAI_API_KEY=sk-...

   # Optional (for full functionality)
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   UPSTASH_VECTOR_REST_URL=https://...
   UPSTASH_VECTOR_REST_TOKEN=...
   RESEND_API_KEY=re_...
   OMER_EMAIL=me@omerakben.com
   OMER_ZOOM_LINK=https://calendly.com/.../30min
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

```bash
npm run dev          # Start development server (Turbopack)
npm test             # Run all unit tests (544 tests)
npm test -- --watch  # Run tests in watch mode
npm run build        # Create production build
npm run lint         # Run ESLint
npx tsc --noEmit     # Check TypeScript errors
npm run size         # Check bundle size limits
npm run test:e2e     # Run E2E tests with Playwright
npm run analyze      # Analyze bundle composition
```

---

## 🎯 Project Highlights

### Production-Ready Quality

- **544 Unit Tests** - 100% pass rate across 27 test files
- **8 E2E Tests** - WCAG 2A accessibility compliance on all routes
- **Zero Errors** - TypeScript strict mode, ESLint zero-error policy
- **CI/CD Pipeline** - 6 quality gates enforced on every commit
- **Bundle Optimization** - 90% reduction (2.33MB → 236KB homepage)

### Technical Achievements

| Achievement | Metric | Status |
|-------------|--------|--------|
| Test Coverage | 544/544 passing | ✅ 100% |
| TypeScript Errors | 0 | ✅ Clean |
| ESLint Errors | 0 | ✅ Clean |
| WCAG Compliance | 8/8 routes | ✅ 2A |
| Bundle Size | 7.66 KB / 40 KB | ✅ 19% |
| Page Load | < 1s | ✅ Fast |

### Unique Features

- **8-Mode Brightness** - innovative accessibility feature (darkest to brightest)
- **Icon Optimization** - manifest system reduced bundle by 90%
- **Episodic Memory** - semantic search across conversation history
- **Proactive Engagement** - AI assistant initiates contact collection
- **Rate Limiting** - Redis-backed, configured per route pattern

---

## 📊 Quality Metrics

### Test Distribution

| Category | Files | Tests | Coverage |
|----------|-------|-------|----------|
| API Routes | 12 | 268 | Tool validation, error handling |
| Components | 8 | 155 | UI behavior, interactions |
| Integration | 7 | 121 | Workflows, memory, follow-ups |
| **Total** | **27** | **544** | **100% pass rate** |

### Bundle Sizes

| Page | Size | Limit | Status |
|------|------|-------|--------|
| Homepage | 7.66 KB | 40 KB | ✅ 19% |
| Skills | 3.55 KB | 10 KB | ✅ 35% |
| Projects | 7.91 KB | 15 KB | ✅ 53% |
| Contact | 4.31 KB | 10 KB | ✅ 43% |

### Build Performance

- **Compilation Time**: 8.6s
- **Static Pages**: 40/40 generated
- **First Load JS** (shared): 102 KB
- **Lighthouse Score**: ≥95 (mobile & desktop)

---

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - Agent architecture, tools, and implementation details
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines and Claude Code workflows

### Internal Documentation

- **[PRD](claudedocs/PRD.md)** - Product requirements document
- **[Ozzy Implementation Guide](claudedocs/ozzy-implementation-guide.md)** - Step-by-step agent setup

### Key Files Reference

```
src/
├── app/api/tools/          # 11 AI agent tools (server-side)
├── components/chat/        # Sidebar assistant components
├── data/                   # Source of truth (facts, projects)
├── lib/
│   ├── agent-tools/        # Tool schemas and validation
│   ├── mastra/memory/      # Episodic memory system
│   └── redis/              # Vector search + rate limiting
└── config/                 # Configuration files
```

---

## 📧 Contact

**Omer "Ozzy" Akben**

- **Email**: [me@omerakben.com](mailto:me@omerakben.com)
- **Website**: [omerakben.com](https://omerakben.com)
- **LinkedIn**: [omerakben](https://linkedin.com/in/omerakben)
- **GitHub**: [@omerakben](https://github.com/omerakben)

### Download Resume

- **[Original Resume (PDF)](https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view)** - Concise 2-page version
- **[Extended Resume (PDF)](https://drive.google.com/file/d/1LiK6Q6BpnbfitPR-diaWR3ckGFv7yNFo/view)** - Detailed work history

### Schedule a Meeting

Visit the [live site](https://omerakben.com) and chat with Ozzy to schedule a meeting automatically!

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with ❤️ using Next.js 15, React 19, TypeScript, and AI**

[⬆ Back to Top](#omerakbencom)

</div>
