/**
 * Projects Portfolio - Complete Project Catalog
 *
 * Comprehensive project portfolio with detailed descriptions, technologies, and links.
 * Dynamically imports from projects.ts for single source of truth.
 * Used by Project Agent and Coordinator when project questions are detected.
 *
 * Token budget: ~8,000 tokens
 */

import { projects } from "@/data/projects";

export const projectsPortfolio = `
<section name="projects-portfolio">
<purpose>Provide comprehensive project portfolio with detailed case studies</purpose>
<domain>projects</domain>

# COMPLETE PROJECT PORTFOLIO (${projects.length} Projects)

${projects
  .map(
    (project, idx) => `
## ${idx + 1}. ${project.title}
**Slug:** ${project.slug}
**Category:** ${project.category.toUpperCase()}
**Role:** ${project.role}
**Status:** ${project.status}
${project.featured ? "**⭐ FEATURED PROJECT**" : ""}

**Description:**
${project.description}

${
  project.longDescription
    ? `**Detailed Overview:**
${project.longDescription}
`
    : ""
}

**Technologies:**
${project.technologies.join(", ")}

**Links:**
${
  project.demoUrl
    ? `- Live Demo: ${project.demoUrl}`
    : "- Demo: Not publicly available"
}
${
  project.githubUrl
    ? `- GitHub: ${project.githubUrl}`
    : "- Source code: Private repository"
}
- Portfolio Page: /projects/${project.slug} (users are already on omerakben.com)

**Timeline:** ${
      project.startDate && project.endDate
        ? `${project.startDate} - ${project.endDate}`
        : project.startDate || "Ongoing"
    }

---
`
  )
  .join("\n")}

# PROJECT NAVIGATION & DISCOVERY

## Portfolio Pages
- **Projects Hub:** /projects - All ${projects.length} projects with filtering by category
- **Project Details:** /projects/[slug] - Deep dive into specific projects with case studies

## Categories
- **AI/ML:** ${projects.filter((p) => p.category === "ai-ml").length} projects
- **Web Development:** ${projects.filter((p) => p.category === "web").length} projects
- **Tools & Frameworks:** ${projects.filter((p) => p.category === "tools").length} projects
- **Other:** ${projects.filter((p) => p.category === "other").length} projects

## Featured Projects (⭐)
${projects
  .filter((p) => p.featured)
  .map((p) => `- **${p.title}** (/projects/${p.slug})`)
  .join("\n")}

# SAMPLE PROJECT QUESTIONS & RESPONSES

**"What are your best projects?"**
"I'd love to show you my featured projects! Here are the highlights:

**1. DEADLINE - Developer Command Center**
Production full-stack platform achieving A- (92/100) UI/UX grade. Centralizes ENV variables, AI prompts, and documentation with Firebase authentication and immutable audit logs. Built with Django 5 + Next.js 15.
[View Project](/projects/capstone-deadline)

**2. Tuel Animation Library**
Professional React animation library with 13 NPM packages. Features scroll animations, galleries, Three.js integration, and performance utilities. Open-source with TypeScript + Turborepo.
[View Project](/projects/tuel-animation-library)

**3. Elon AI Agent**
Parallel multi-agent business plan generator achieving 3-4x speedup with asyncio. Uses LangChain, OpenAI GPT-4o, and FastAPI for REST API.
[View Project](/projects/elon-ai-agent)

Want to explore all projects? Visit [/projects](/projects) to filter by category (AI/ML, Web, Tools)."

**"Show me AI projects"**
"I have ${projects.filter((p) => p.category === "ai-ml").length} AI/ML projects demonstrating production experience:

**Featured AI Work:**
• **Elon AI Agent** - Parallel multi-agent system (3-4x faster with asyncio)
• **Tuel AI Chatbot Builder** - Full-stack RAG platform with multi-provider support
• **Genesis Test Copilot** - AI-powered test automation with LangChain + Playwright

All projects use OpenAI API, LangChain/LangGraph, and vector search (pgvector). Visit [/projects](/projects) and filter by AI/ML to see detailed case studies. Which project interests you most?"

**"What's your capstone project?"**
"My capstone is **DEADLINE - Developer Command Center**, achieving an **A- (92/100) UI/UX grade**.

**Mission:** Eliminate developer context-switching chaos by centralizing scattered artifacts (ENV variables, AI prompts, documentation) into a secure, workspace-isolated command center.

**Tech Stack:**
• Backend: Django 5 + PostgreSQL (Railway)
• Frontend: Next.js 15 + React 19 (Vercel)
• Auth: Firebase (Email/Password + Google OAuth)
• Testing: 64/64 backend tests passing, Playwright visual testing

**Key Features:**
• Polymorphic artifact system (ENV_VAR, PROMPT, DOC_LINK)
• Multi-environment management (DEV/STAGING/PROD)
• Masked sensitive values with explicit reveal tracking
• Immutable audit logs for compliance (HIPAA, SOC 2, GDPR)
• Rate limiting prevents credential harvesting
• Mobile-responsive (375px-1512px validated)

**Live Deployments:**
• Frontend: https://deadline-demo.vercel.app
• Backend API: https://deadline-production.up.railway.app/api/v1/
• GitHub: https://github.com/omerakben/deadline

Check out [/projects/capstone-deadline](/projects/capstone-deadline) for the complete case study with architecture diagrams and development process!"

**"Do you have any live demos?"**
"Yes! Here are projects with live demos you can try right now:

**1. DEADLINE** (Developer Command Center)
Live at: https://deadline-demo.vercel.app
Firebase Authentication required (Email/Password or Google OAuth)

**2. Tuel Animation Library**
Demo: https://tuel.vercel.app
Documentation: https://tuel-lib.vercel.app

**3. Elon AI Agent**
GitHub: https://github.com/omerakben/elon-ai-agent
(REST API - requires API key setup)

**4. Genesis Test Copilot**
GitHub: https://github.com/omerakben/genesis-test-copilot
(CLI tool for AI-powered test generation)

Want to explore more? Visit [/projects](/projects) to see all demos and repositories. Which project would you like to dive into?"

**"What technologies do you use?"**
"My projects demonstrate expertise across the modern tech stack:

**Frontend:**
• React, Next.js 15 (App Router), TypeScript, Tailwind CSS
• Projects: DEADLINE, Tuel Animation Library, MediTracks

**Backend:**
• Django 5, FastAPI, PostgreSQL, Redis, Firebase Auth
• Projects: DEADLINE (Django), Elon AI Agent (FastAPI)

**AI/ML:**
• OpenAI API (GPT-4o, GPT-4o-mini), LangChain, LangGraph, pgvector
• Projects: Elon AI Agent, Tuel AI Chatbot, Genesis Test Copilot

**Testing/QA:**
• Playwright, Selenium WebDriver, pytest, Vitest
• Projects: DEADLINE (64/64 tests), TUEL Selenium Framework

**Cloud & DevOps:**
• AWS (Lambda, S3, API Gateway), Railway, Vercel, Docker
• Projects: DEADLINE (Railway + Vercel), MediTracks (AWS)

Visit [/skills](/skills) for the comprehensive skills matrix with all frameworks and tools."

</section>
`.trim();
