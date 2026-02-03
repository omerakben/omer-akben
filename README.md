<div align="center">

# omerakben.com

### AI-Powered Portfolio with Proactive Visitor Engagement

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-omerakben.com-brightgreen?style=for-the-badge)](https://omerakben.com)
[![Build Status](https://img.shields.io/github/actions/workflow/status/omerakben/omer-akben/quality-gates.yml?branch=pre-deployment&style=for-the-badge&label=Quality%20Gates)](https://github.com/omerakben/omer-akben/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-814/814_passing-success?style=for-the-badge)](package.json)
[![Bundle](https://img.shields.io/badge/Bundle-7.66KB/40KB-success?style=for-the-badge)](package.json)

[View Live Site](https://omerakben.com) | [Download Resume](https://drive.google.com/file/d/1La3VElM0vVNJDz867bUIXDb1HggHFYQL/view) | [Contact Me](mailto:me@omerakben.com)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
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

**The Challenge**: Traditional portfolios are static resumes that hiring managers scan in 6 seconds. Standing out in a crowded market requires more than just listing projects—it demands demonstrating skills in action.

**The Solution**: This portfolio transforms passive browsing into active engagement. An AI assistant (Ozzy) understands visitor intent through engagement scoring, proactively offers to collect contact information, and maintains context across conversations using episodic memory with semantic search.

**The Impact**: Built with Next.js 15, React 19, and TypeScript, this project demonstrates production-ready code quality with enterprise-level standards:

- **🤖 AI-Powered Engagement**: "Ozzy" AI assistant with 12 specialized tools that don't just showcase capabilities—they provide them
- **📧 Smart Contact Collection**: Permission-based outreach triggered by engagement scoring (message count, topics explored, time spent)
- **🧠 Episodic Memory**: Semantic search across conversation history using 1536-dim OpenAI embeddings—conversations that remember
- **♿ Accessibility Innovation**: WCAG 2A compliant with unique 8-mode brightness system (darkest to brightest)
- **⚡ Performance Excellence**: 90% bundle reduction (2.33MB → 236KB) through intelligent icon manifesting
- **✅ Zero Technical Debt**: 814 automated tests, 0 TypeScript errors, 0 ESLint errors—production-ready from day one

---

## ✨ Key Features

### 🤖 Intelligent AI Assistant

- **12 Server-Side Tools** enabling intelligent assistance—from resume downloads to semantic project search with vector embeddings. Each tool validates inputs server-side, ensuring security while providing rich functionality.
- **Proactive Engagement** - detects organic interest through engagement scoring (message count, topics explored, time spent) and asks permission to collect contact information—permission-based, never pushy
- **Follow-Up Suggestions** - contextual question chips generated from conversation analysis, guiding users to relevant topics they haven't explored
- **Thread Persistence** - maintains conversation context across sessions using episodic memory with semantic search, creating continuous conversations that remember

### 🎨 Innovative Design

- **8-Mode Brightness System** - accessibility feature with brightness levels from -3 (darkest) to +3 (brightest)
- **Responsive Sidebar** - pin/unpin with width resizing (320-800px) and localStorage persistence
- **Design System** - 40+ shadcn/ui components with CSS custom properties for theming
- **Global Chat Access** - floating button on all pages with keyboard shortcuts (Cmd/Ctrl+Shift+N)

### 📧 Contact Collection System

- **Intelligent Email Delivery** - Resend integration with React Email templates that include meeting links and resume downloads, sent only after explicit permission
- **Smart Triggers** - activates when engagement score ≥60 (organic interest threshold), explicit meeting request, or high-value user detected (recruiter + 3+ messages + multiple topics explored)
- **Professional Outreach** - branded emails that feel personal, not automated, with clear next steps for scheduling
- **Security & Privacy** - email validation, PII redaction in logs, 7-day TTL on stored contacts, 5 requests per IP per 24h rate limit prevents abuse

### 🧠 Memory Systems

- **Episodic Memory** - semantic search across conversation history using Upstash Vector with 1536-dimensional OpenAI embeddings. Ozzy can reference discussions from weeks ago, answering "What were those Python projects you mentioned?" without users repeating themselves.
- **Thread Memory** - conversation state persists across sessions using localStorage, creating continuous dialogue that picks up exactly where you left off
- **Dual Vector Search** - separate optimized paths for projects (Redis FT.SEARCH for keyword matching) and conversations (Upstash Vector for semantic similarity)

### ⚡ Performance & Quality

- **Bundle Optimization** - 90% reduction (2.33MB → 236KB) via icon manifest system, achieving sub-second page loads and Lighthouse scores 95+
- **Comprehensive Test Coverage** - 814 automated tests across 53 files (100% pass rate) covering API routes, components, integrations, and edge cases
- **Automated Quality Gates** - 6 gates enforced on every commit: TypeScript (0 errors), ESLint (0 warnings), Tests (100%), Build, Bundle Size, E2E
- **Zero-Downtime Deployment** - Vercel hosting with automated CI/CD pipeline, production-ready from day one

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
- **XAI (Grok)** - Primary LLM with OpenAI fallback for reliability
- **OpenAI** - Fallback LLM + embeddings for semantic search
- **Upstash Redis** - Rate limiting and caching
- **Upstash Vector** - Episodic memory with semantic search
- **Resend** - Email delivery service
- **React Email** - Email template system

### Development & Testing

- **Vitest** - Unit testing framework (814 tests)
- **Playwright** - E2E testing and accessibility validation
- **ESLint** - Code quality and consistency
- **Size Limit** - Bundle size monitoring
- **GitHub Actions** - CI/CD with automated quality gates

---

## 🤖 AI Features (Ozzy Assistant)

Ozzy is an intelligent AI assistant powered by XAI (Grok) with OpenAI fallback and 12 specialized tools for visitor engagement.

### Available Tools

| Tool                       | Description                                   | Rate Limit       |
| -------------------------- | --------------------------------------------- | ---------------- |
| `download_resume`          | Download resume in PDF format                 | 60/min           |
| `download_certificate`     | Download AWS/NSS certifications               | 60/min           |
| `list_projects`            | Browse portfolio projects with filters        | 60/min           |
| `open_project`             | Get detailed project information              | 60/min           |
| `get_contact`              | Retrieve contact information                  | 60/min           |
| `collect_contact`          | Proactive contact collection + email delivery | 5 per IP per 24h |
| `navigate_page`            | Navigate to specific pages                    | 60/min           |
| `provide_navigation_links` | Get site navigation structure                 | 60/min           |
| `extract_summary`          | Extract concise content summaries             | 60/min           |
| `profile_performance`      | Performance profiling utilities               | 60/min           |
| `search_projects_semantic` | Semantic vector search using OpenAI embeddings | 60/min          |
| `trigger_workflow`         | Execute predefined workflows                  | 60/min           |

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
   CRON_SECRET=your-random-secret-key  # For Vercel cron job authentication

   # Optional - Monitoring
   SENTRY_AUTH_TOKEN=sntryu_...         # Error tracking and monitoring
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) in your browser.

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

- **814 Unit Tests** - 100% pass rate across 53 test files
- **8 E2E Tests** - WCAG 2A accessibility compliance on all routes
- **Zero Errors** - TypeScript strict mode, ESLint zero-error policy
- **CI/CD Pipeline** - 6 quality gates enforced on every commit
- **Bundle Optimization** - 90% reduction (2.33MB → 236KB homepage)

### Technical Achievements

| Achievement       | Metric          | Status  |
| ----------------- | --------------- | ------- |
| Test Coverage     | 814/814 passing | ✅ 100%  |
| TypeScript Errors | 0               | ✅ Clean |
| ESLint Errors     | 0               | ✅ Clean |
| WCAG Compliance   | 8/8 routes      | ✅ 2A    |
| Bundle Size       | 7.66 KB / 40 KB | ✅ 19%   |
| Page Load         | < 1s            | ✅ Fast  |

### Unique Features

- **8-Mode Brightness** - innovative accessibility feature (darkest to brightest)
- **Icon Optimization** - manifest system reduced bundle by 90%
- **Episodic Memory** - semantic search across conversation history
- **Proactive Engagement** - AI assistant initiates contact collection
- **Rate Limiting** - Redis-backed, configured per route pattern

---

## 🔬 Technical Challenges & Solutions

Building a production-ready AI portfolio required solving complex engineering problems:

### Challenge 1: Episodic Memory Without Context Loss

**Problem**: Traditional chat systems lose context between sessions, forcing users to repeat themselves and breaking conversation flow.

**Solution**: Implemented semantic search using Upstash Vector with OpenAI embeddings (1536-dim). Conversations are vectorized and stored, enabling similarity-based retrieval across sessions. The system maintains a rolling window of recent context while searching historical conversations for relevant information.

**Result**: Ozzy can reference discussions from weeks ago, creating a continuous conversation experience. For example, if a recruiter asks "What were those Python projects you mentioned?" days later, Ozzy retrieves the relevant context automatically.

### Challenge 2: 90% Bundle Size Reduction

**Problem**: Initial bundle size was 2.33MB, resulting in 49-second load times—unacceptable for a portfolio's first impression.

**Solution**: Created an icon manifest system with tree-shaking, curating 42 essential icons instead of importing the entire simple-icons library (11,000+ icons). Implemented lazy loading for non-critical components and aggressive code splitting.

**Result**: Bundle reduced to 236KB (90% reduction), achieving sub-second page loads with Lighthouse scores consistently above 95.

### Challenge 3: Proactive Engagement Without Being Intrusive

**Problem**: How to collect visitor contact information without annoying pop-ups or aggressive tactics that damage user experience?

**Solution**: Built an engagement scoring system that considers message count, topics explored, time spent, and conversation depth. Contact collection is only triggered when:
- Engagement score reaches ≥60 (organic interest threshold)
- User explicitly requests a meeting
- High-value user detected (recruiter + 3+ messages + multiple topics)

**Result**: Permission-based outreach that feels helpful rather than pushy. Ozzy asks, "I notice we've been discussing several projects. Would you like me to collect your contact information to schedule a meeting?" This approach respects user autonomy while maximizing conversion opportunities.

### Challenge 4: Time Awareness for LLM Accuracy

**Problem**: LLMs with January 2025 knowledge cutoff couldn't accurately reference current dates or understand temporal context. When users asked "What's today's date?" or "Can we meet this week?", responses relied on potentially outdated training data.

**Solution**: Implemented server-authoritative time context injection with explicit anti-hallucination directives. Every agent response includes:
- Current UTC timestamp
- Portfolio timezone context (EST/EDT, America/New_York)
- Clear instructions to trust server time over learned dates

**Result**: Ozzy now accurately handles scheduling requests, understands "today", "this week", "next month" correctly, and provides business hours context (e.g., "It's after hours—Omer may respond slower tomorrow morning").

---

## 🎯 Featured Projects

Showcasing 5 production-ready projects with live demos and professional screenshots:

### 1. [North Glass LLC](https://omerakben.com/projects/north-glass) • **LIVE PRODUCTION**

Modern e-commerce site for glass installation company serving North Carolina.

- **Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Features**: Product catalog, service area mapping, contact forms, mobile-responsive
- **Live Demo**: [northglassnc.com](https://www.northglassnc.com/)
- **Status**: Production deployment serving real customers

### 2. [DEADLINE - Developer Command Center](https://omerakben.com/projects/capstone-deadline)

Centralized workspace management system for developers (**A- Capstone Grade: 92/100 UI/UX**).

- **Stack**: Django 5 + PostgreSQL (Railway) | Next.js 15 + React 19 (Vercel)
- **Features**: ENV variables, AI prompts, docs, multi-environment support, audit logs
- **Testing**: 64/64 backend tests passing, Playwright visual testing
- **Live Demos**: [Frontend](https://deadline-demo.vercel.app) | [API](https://deadline-production.up.railway.app/api/v1/)
- **Source**: [GitHub](https://github.com/omerakben/deadline)

### 3. [ElonGPT - Campus AI Assistant](https://omerakben.com/projects/elongpt) • **LIVE @ ELON UNIVERSITY**

AI-powered chatbot serving Elon University students and faculty.

- **Stack**: Next.js 14, TypeScript, OpenAI API, Vercel AI SDK
- **Features**: Campus information, academic resources, event lookup
- **Live Demo**: [elon.edu/ai/elongpt](https://www.elon.edu/u/ai/elongpt/)
- **IP Notice**: Elon University property (part of 4-project AI initiative)

### 4. [LSB AI Studio](https://omerakben.com/projects/lsb-ai-studio) • **LIVE @ ELON UNIVERSITY**

Business education platform with AI-powered learning tools.

- **Stack**: Next.js 14, Azure deployment, OpenAI integration
- **Features**: Business AI education, case studies, interactive learning
- **Live Demo**: [lsb-ai.azurewebsites.net](https://lsb-ai.azurewebsites.net/)
- **IP Notice**: Elon University property (part of 4-project AI initiative)

### 5. [Tuel AI Chatbot Builder](https://omerakben.com/projects/tuel-chatbot)

Multi-provider chatbot platform with drag-and-drop interface.

- **Stack**: Next.js 14, React, OpenAI + Claude + Gemini integration
- **Features**: Visual chatbot builder, multi-LLM support, conversation management
- **Screenshots**: Professional UI showcasing builder interface
- **Portfolio**: [View Project Page](https://omerakben.com/projects/tuel-chatbot)

**View All 12 Projects**: [omerakben.com/projects](https://omerakben.com/projects)

**Project Categories**: AI/ML (5 projects) • Web Development (4 projects) • Tools & Frameworks (3 projects)

---

## 📊 Quality Metrics

### Test Distribution

| Category    | Files  | Tests   | Coverage                        |
| ----------- | ------ | ------- | ------------------------------- |
| API Routes  | 12     | 268     | Tool validation, error handling |
| Components  | 8      | 155     | UI behavior, interactions       |
| Integration | 7      | 121     | Workflows, memory, follow-ups   |
| **Total**   | **53** | **814** | **100% pass rate**              |

### Bundle Sizes

| Page     | Size    | Limit | Status |
| -------- | ------- | ----- | ------ |
| Homepage | 7.66 KB | 40 KB | ✅ 19%  |
| Skills   | 3.55 KB | 10 KB | ✅ 35%  |
| Projects | 7.91 KB | 15 KB | ✅ 53%  |
| Contact  | 4.31 KB | 10 KB | ✅ 43%  |

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
├── app/api/tools/          # 12 AI agent tools (server-side)
├── components/chat/        # Sidebar assistant components
├── data/                   # Source of truth (facts, projects)
├── lib/
│   ├── agent-tools/        # Tool schemas and validation
│   ├── mastra/memory/      # Episodic memory system
│   └── redis/              # Vector search + rate limiting
└── config/                 # Configuration files
```

---

## 📈 Results & Impact

### What This Project Demonstrates

**Production-Ready Development Practices**
- **814 automated tests** (100% pass rate) across 53 test files—every feature validated
- **Zero TypeScript errors, zero ESLint warnings**—strict quality gates enforced
- **CI/CD pipeline with 6 quality gates**—automated testing, linting, building, bundle analysis
- **WCAG 2A compliance** on all 8 routes—accessibility built in, not bolted on

**AI Engineering Expertise**
- **Multi-provider LLM strategy**: XAI (Grok) as primary for cost efficiency (~60% savings vs GPT-4), intelligent fallback to OpenAI for reliability
- **Episodic memory with semantic search**: 1536-dimensional vector embeddings enabling context retention across sessions
- **12 server-side tools** with proper Zod validation, rate limiting, and error handling
- **Cost optimization**: Intelligent retry vs. fallback logic based on error classification

**Performance Optimization**
- **90% bundle reduction** (2.33MB → 236KB) through icon manifesting and tree-shaking
- **Sub-second page loads** with Lighthouse scores consistently 95+
- **Smart caching strategies**: Redis for rate limiting, Upstash Vector for semantic search
- **Core Web Vitals compliance**: Optimized for LCP, FID, CLS metrics

**Product Thinking & UX Design**
- **Engagement scoring system**: Permission-based contact collection triggered by organic interest (score ≥60)
- **Accessibility innovation**: 8-mode brightness system serving users with photosensitivity or vision impairments
- **Conversation continuity**: Cross-session memory persistence creates seamless experience
- **Proactive assistance**: AI that anticipates needs without being intrusive

### Key Learnings

**1. Cost Optimization Through Provider Strategy**

Switching from OpenAI to XAI (Grok) as primary LLM reduced costs by ~60% while maintaining quality through intelligent fallback. Error classification determines whether to retry XAI or fallback to OpenAI:
- **Transient errors** (rate limits, timeouts) → Retry with XAI
- **Persistent errors** (model failures) → Fallback to OpenAI

This dual-provider approach balances cost efficiency with reliability.

**2. Engagement Scoring for Proactive Features**

The engagement score threshold of 60 was discovered through experimentation:
- **Too low (< 40)**: Felt pushy, interrupted natural conversation flow
- **Too high (> 80)**: Missed conversion opportunities, users expected prompting
- **Sweet spot (60)**: Respects user autonomy while maximizing helpfulness

This demonstrates the importance of tuning AI interactions to human expectations.

**3. Testing as a Development Accelerator**

814 tests might seem excessive, but they enable **fearless refactoring**. Recent example: Refactoring the memory system required touching 15 files. Tests caught 8 edge cases that would have been production bugs. Time saved in debugging far exceeded time spent writing tests.

**4. Accessibility as Innovation Opportunity**

The 8-mode brightness system started as a "nice to have" feature. User feedback revealed it's essential for:
- Users with photosensitivity who can't use standard dark mode
- Users with low vision who need higher contrast than standard light mode
- Users working in varying ambient light conditions

Accessibility features often benefit a broader audience than initially intended.

**5. Time Awareness Solves Real Problems**

Before implementing server-authoritative time context, Ozzy would sometimes reference dates incorrectly ("Let's meet next week" when "next week" was already past based on knowledge cutoff). This eroded trust. Server-side timestamps with anti-hallucination directives solved this completely—a reminder that LLMs need external context for temporal accuracy.

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
