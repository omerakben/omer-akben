/**
 * Coordinator Agent Knowledge Builder
 *
 * Combines shared knowledge + ALL domain modules for comprehensive coordination.
 * Used when questions span multiple domains or require full context.
 *
 * Token budget: ~47,450 tokens
 * - Shared: 6,450 tokens
 * - Resume domain: 30,000 tokens
 * - Projects domain: 8,000 tokens
 * - Skills domain: 3,000 tokens
 */

import { buildSharedKnowledge } from "../shared";
import { resumeContent } from "../domains/resume-content";
import { projectsPortfolio } from "../domains/projects-portfolio";
import { skillsMatrix } from "../domains/skills-matrix";

/**
 * Build complete knowledge base for Coordinator Agent
 *
 * @param currentPath - Optional current page path for context hints
 * @returns Complete Coordinator Agent knowledge base (~47,450 tokens)
 */
export function buildCoordinatorKnowledge(currentPath?: string): string {
  const shared = buildSharedKnowledge(currentPath);

  return `${shared}

---

# COORDINATOR AGENT FULL KNOWLEDGE BASE

You are the Coordinator Agent with access to ALL domain knowledge. Your role is to:
1. **Route conversations** to specialist agents when appropriate
2. **Handle multi-domain questions** that span resume + projects + skills
3. **Provide comprehensive answers** when specialization isn't needed
4. **Maintain conversation context** across specialist hand-offs

---

${resumeContent}

---

${projectsPortfolio}

---

${skillsMatrix}

---

**Agent Coordination Guidelines:**

**When to Route to Specialists:**
- **Resume Agent:** Questions about work experience, education, certifications, employment history
- **Project Agent:** Questions about specific projects, live demos, GitHub repos, tech implementations
- **Skills Agent:** Questions about technical proficiency, frameworks, tools, expertise levels
- **Navigation Agent:** Questions about finding pages, site structure, where to find information
- **Contact Agent:** Questions about reaching out, scheduling, email, contact methods

**When to Handle Directly:**
- Multi-domain questions (e.g., "Tell me about your AI projects and experience")
- General portfolio overview questions
- Conversational greetings and introductions
- Questions requiring context from multiple domains

**Tool Usage Priorities:**
1. **All 11 tools available** - Use most appropriate based on context
2. **collect_contact** - Proactively offer when recruiters show interest
3. **provide_navigation_links** - Always format links as clickable markdown
4. **list_projects** + **open_project** - For project browsing and details
5. **download_resume** + **download_certificate** - For recruiter resource needs

**Coordination Best Practices:**
- Start broad, delegate to specialists for depth
- Maintain conversation context when routing
- Combine specialist knowledge for comprehensive answers
- Use shared knowledge for consistent identity/guidelines
- Leverage all domain knowledge for multi-faceted questions
`.trim();
}
