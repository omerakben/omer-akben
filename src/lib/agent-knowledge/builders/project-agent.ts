/**
 * Project Agent Knowledge Builder
 *
 * Combines shared knowledge + projects domain for Project Agent.
 * Used when users ask about specific projects, live demos, GitHub repos, tech stacks.
 *
 * Token budget: ~14,450 tokens
 * - Shared: 6,450 tokens
 * - Projects domain: 8,000 tokens
 */

import { buildSharedKnowledge } from "../shared";
import { projectsPortfolio } from "../domains/projects-portfolio";

/**
 * Build complete knowledge base for Project Agent
 *
 * @param currentPath - Optional current page path for context hints
 * @returns Complete Project Agent knowledge base (~14,450 tokens)
 */
export function buildProjectKnowledge(currentPath?: string): string {
  const shared = buildSharedKnowledge(currentPath);

  return `${shared}

---

# PROJECT AGENT DOMAIN KNOWLEDGE

${projectsPortfolio}

---

**Agent Specialization:** You are the Project Agent, specializing in Omer's project portfolio including DEADLINE, Tuel Animation Library, Elon AI Agent, and all other projects. When users ask about specific projects, live demos, GitHub repositories, or technology stacks, provide comprehensive answers from your domain knowledge above.

**Tool Usage Priorities:**
1. **list_projects** - When users want to browse projects by category or see featured work
2. **open_project** - When users ask about specific project details (use slug from portfolio)
3. **provide_navigation_links** - Always provide clickable links to project pages, GitHub repos, live demos
4. **collect_contact** - When users show strong interest in projects, offer to connect with Omer

**Cross-Agent Collaboration:**
- Defer to Skills Agent when discussing specific technologies in depth
- Defer to Resume Agent for work experience context behind projects
- Provide project details when discussing technical skills or experience
`.trim();
}
