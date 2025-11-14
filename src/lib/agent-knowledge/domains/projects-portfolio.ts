/**
 * Projects Portfolio - Complete Project Catalog
 *
 * Comprehensive project portfolio with detailed descriptions, technologies, and links.
 * Dynamically imports from projects.ts for single source of truth.
 * Used by Project Agent and Coordinator when project questions are detected.
 *
 * Architecture: Hybrid template approach (Industry Best Practice 2025)
 * - Static context for LLM understanding
 * - Dynamic data queries for volatile project details
 * - Runtime data injection ensures zero staleness
 *
 * Token budget: ~8,000 tokens
 */

import { projects } from "@/data/projects";
import {
  getFeaturedProjects,
  getLiveProductionProjects,
  getProjectsByCategory,
  getProjectTechStack,
  formatProjectList,
  getProjectsWithScreenshots,
  getElonUniversityContext,
  getElonUniversityProjects,
} from "../helpers/project-queries";

export const projectsPortfolio = `
<section name="projects-portfolio">
<purpose>Provide comprehensive project portfolio with detailed case studies</purpose>
<domain>projects</domain>

# COMPLETE PROJECT PORTFOLIO (${projects.length} Projects)

${projects
  .map(
    (project, idx) => `
## ${idx + 1}. ${project.title}${project.shortTitle && project.shortTitle !== project.title ? ` (Display: "${project.shortTitle}")` : ""}
**Slug:** ${project.slug}
**Category:** ${project.category.toUpperCase()}
**Role:** ${project.role}
**Status:** ${project.status}
${project.featured ? `**⭐ FEATURED PROJECT** ${project.displayOrder ? `(Display Order: #${project.displayOrder})` : ""}` : ""}
${project.image ? `**📸 Screenshot Available:** ${project.image}` : ""}

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

---

# ELON UNIVERSITY PROJECTS - INTELLECTUAL PROPERTY NOTICE

${getElonUniversityContext()}

**Cross-Linking Pattern:**
When user asks about ANY of these 4 Elon projects, mention the other 3 related projects and offer to explore them.

---

# VISUAL PORTFOLIO ASSETS (Professional Screenshots)

${(() => {
  const screenshots = getProjectsWithScreenshots();

  return `**${screenshots.length} Projects with Professional Screenshots:**

${screenshots.map(s => `- **${s.title}**: \`${s.image}\` → [View](/projects/${s.slug})`).join('\n')}

**Image Organization by Directory:**
- \`/elon_ai_img/\` - 3 Elon University project screenshots (AI Toolbox, ElonGPT/LSB AI Studio hub images)
- \`/nort_glass_img/\` - North Glass LLC production site (hero + custom components)
- \`/tuel_chatbot_img/\` - AI Chatbot Builder demo (landing page + chat interface)
- \`/tuel_animations_img/\` - Animation Library showcase

**Proactive Screenshot Offering:**
When users ask about projects, proactively offer:
- "Would you like to see screenshots of these projects?"
- "All featured projects include professional screenshots showcasing their UI design"
- "I can show you screenshots of [project name] - would you like to see them?"

**Homepage Display:**
Featured projects appear in a 2-2-3 grid layout on the homepage with professional screenshots.`;
})()}

---

# SAMPLE PROJECT QUESTIONS & RESPONSES
## (Dynamic templates using helper functions - always current)

**"What are your best projects?"**
${(() => {
  const featured = getFeaturedProjects();
  const screenshots = getProjectsWithScreenshots();

  return `"I'd love to show you my top ${featured.length} featured projects! Here are the highlights:

${featured.map((p, idx) => {
  const screenshotTag = p.image ? ' • [Screenshot Available]' : '';
  const demoLink = p.demoUrl && !p.demoUrl.includes('TEMPORARILY DISABLED')
    ? ` • [Live Demo](${p.demoUrl})`
    : '';
  const status = p.status === 'completed' && p.demoUrl && !p.demoUrl.includes('TEMPORARILY DISABLED')
    ? ' • LIVE'
    : '';

  return `**${idx + 1}. ${p.title}${status}**
${p.description}
[View Project](/projects/${p.slug})${demoLink}${screenshotTag}`;
}).join('\n\n')}

All ${screenshots.length} featured projects include screenshots showcasing their professional UI design. Want to explore all projects? Visit [/projects](/projects) to filter by category (AI/ML, Web, Tools)."`;
})()}

**"Show me AI projects"**
${(() => {
  const aiProjects = getProjectsByCategory('AI/ML');
  const featuredAI = aiProjects.filter(p => p.featured);
  const elonProjects = getElonUniversityProjects();

  return `"I have ${aiProjects.length} AI/ML projects demonstrating production experience:

**⭐ Featured AI Work:**
${formatProjectList(featuredAI, true)}

**Elon University AI Initiative (${elonProjects.length} projects):**
${elonProjects.map(p => `- **${p.title}** - ${p.description}`).join('\n')}

*Note: These ${elonProjects.length} Elon projects are university intellectual property with source code in private repositories. All cross-reference each other on portfolio pages. See detailed case studies with screenshots.*

**Other AI Projects:**
${formatProjectList(aiProjects.filter(p => !p.featured && !elonProjects.some(ep => ep.slug === p.slug)), true)}

All projects use modern AI stack (OpenAI/XAI APIs, LangChain/LangGraph, vector search). Visit [/projects](/projects) and filter by AI/ML to see detailed case studies with screenshots. Which project interests you most?"`;
})()}

**"What's your capstone project?"**
"My capstone is **DEADLINE - Developer Command Center**, achieving an **A- (92/100) UI/UX grade**.

**Mission:** Eliminate developer context-switching chaos by centralizing scattered artifacts (ENV variables, AI prompts, documentation) into a secure, workspace-isolated command center.

**Tech Stack:**
- Backend: Django 5 + PostgreSQL (Railway)
- Frontend: Next.js 15 + React 19 (Vercel)
- Auth: Firebase (Email/Password + Google OAuth)
- Testing: 64/64 backend tests passing, Playwright visual testing

**Key Features:**
- Polymorphic artifact system (ENV_VAR, PROMPT, DOC_LINK)
- Multi-environment management (DEV/STAGING/PROD)
- Masked sensitive values with explicit reveal tracking
- Immutable audit logs for compliance (HIPAA, SOC 2, GDPR)
- Rate limiting prevents credential harvesting
- Mobile-responsive (375px-1512px validated)

**Live Deployments:**
- Frontend: https://deadline-demo.vercel.app
- Backend API: https://deadline-production.up.railway.app/api/v1/
- GitHub: https://github.com/omerakben/deadline

Check out [/projects/capstone-deadline](/projects/capstone-deadline) for the complete case study with architecture diagrams and development process!"

**"Do you have any live demos?"**
${(() => {
  const liveProjects = getLiveProductionProjects();
  const featured = liveProjects.filter(p => p.featured);
  const other = liveProjects.filter(p => !p.featured);

  return `"Yes! I have ${liveProjects.length} projects with live demos you can try right now:

**⭐ Featured Projects with Live Demos:**

${featured.map((p, idx) => {
  const isProduction = p.demoUrl?.includes('northglassnc.com') ||
                       p.demoUrl?.includes('elon.edu') ||
                       p.demoUrl?.includes('azurewebsites.net');
  const productionNote = isProduction ? '\n**Real production website serving customers**' : '';
  const screenshot = p.image ? '\nProfessional screenshots available on portfolio page' : '';

  return `**${idx + 1}. ${p.title}**
Live at: ${p.demoUrl}${productionNote}${screenshot}`;
}).join('\n\n')}

${other.length > 0 ? `**Other Live Projects:**
${other.map(p => `- **${p.title}** - ${p.demoUrl ? `Live at: ${p.demoUrl}` : 'Demo available'}`).join('\n')}` : ''}

*Note: Some projects (Developer Cheat Sheets, Oteemo AI Roadmap, AI Tutor) are temporarily being updated with original sources and demos are not currently available.*

Want to explore more? Visit [/projects](/projects) to see all demos, repositories, and screenshots. Which project would you like to dive into?"`;
})()}

**"What technologies do you use?"**
${(() => {
  const techStack = getProjectTechStack();
  const aiProjects = getProjectsByCategory('AI/ML');

  return `"My projects demonstrate expertise across the modern tech stack with ${techStack.length}+ technologies:

**Frontend Frameworks & Libraries:**
- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- Animation: Three.js, Framer Motion, GSAP
- UI: shadcn/ui, Radix UI, Lucide Icons
- Projects: ${projects.filter(p => p.technologies.some(t => ['Next.js', 'React', 'TypeScript'].includes(t))).length} projects

**Backend & Infrastructure:**
- Django 5, FastAPI, Node.js, PostgreSQL, Redis
- Authentication: Firebase Auth, OAuth 2.0, JWT
- Projects: DEADLINE (Django + Next.js), Elon AI Agent (FastAPI)

**AI/ML Stack:**
- LLMs: OpenAI GPT-4o, XAI Grok, Gemini
- Frameworks: Vercel AI SDK, LangChain, LangGraph, Mastra
- Vector Search: Upstash Vector, pgvector, Pinecone
- Projects: ${aiProjects.length} AI/ML projects

**Testing & Quality:**
- E2E: Playwright (${projects.filter(p => p.technologies.includes('Playwright')).length} projects), Selenium WebDriver
- Unit: Vitest, pytest, Jest
- Projects: DEADLINE (776 unit tests), Tuel Selenium Framework

**Cloud & Deployment:**
- Platforms: Vercel, Railway, Azure, AWS
- DevOps: Docker, GitHub Actions, CI/CD pipelines
- Projects: ${getLiveProductionProjects().length} live deployments

**Complete Tech Stack:**
${techStack.slice(0, 50).join(', ')}${techStack.length > 50 ? `, +${techStack.length - 50} more` : ''}

Visit [/skills](/skills) for the comprehensive skills matrix with all ${techStack.length} frameworks and tools."`;
})()}

</section>
`.trim();
