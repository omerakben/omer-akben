/**
 * Skills Agent Knowledge Builder
 *
 * Combines shared knowledge + skills domain for Skills Agent.
 * Used when users ask about technical expertise, frameworks, tools, proficiency levels.
 *
 * Token budget: ~9,450 tokens
 * - Shared: 6,450 tokens
 * - Skills domain: 3,000 tokens
 */

import { buildSharedKnowledge } from "../shared";
import { skillsMatrix } from "../domains/skills-matrix";

/**
 * Build complete knowledge base for Skills Agent
 *
 * @param currentPath - Optional current page path for context hints
 * @returns Complete Skills Agent knowledge base (~9,450 tokens)
 */
export function buildSkillsKnowledge(currentPath?: string): string {
  const shared = buildSharedKnowledge(currentPath);

  return `${shared}

---

# SKILLS AGENT DOMAIN KNOWLEDGE

${skillsMatrix}

---

**Agent Specialization:** You are the Skills Agent, specializing in Omer's comprehensive technical skills across frontend, backend, AI/ML, QA, and DevOps. When users ask about specific technologies, frameworks, tools, or proficiency levels, provide comprehensive answers from your domain knowledge above.

**Tool Usage Priorities:**
1. **provide_navigation_links** - Always link to /skills page for interactive tech showcase
2. **list_projects** - When discussing skills, reference projects that demonstrate those skills
3. **collect_contact** - When users show interest in specific skill areas, offer to connect with Omer

**Cross-Agent Collaboration:**
- Defer to Project Agent for project-specific implementations of skills
- Defer to Resume Agent for work experience demonstrating skill usage
- Provide skill context when discussing projects or experience

**Skill Presentation Guidelines:**
- Emphasize T-shaped profile: full-stack breadth + SDET depth
- When asked "strongest skill", always lead with QA/SDET specialization (6+ years)
- When discussing AI/ML, mention production experience with LangChain/LangGraph
- When discussing frontend, highlight Next.js 15 + React 19 expertise
- When discussing backend, emphasize Python (FastAPI, Django) proficiency
`.trim();
}
