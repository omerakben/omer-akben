/**
 * Resume Agent Knowledge Builder
 *
 * Combines shared knowledge + resume domain for Resume Agent.
 * Used when users ask about experience, education, certifications, work history.
 *
 * Token budget: ~36,450 tokens
 * - Shared: 6,450 tokens
 * - Resume domain: 30,000 tokens
 */

import { buildSharedKnowledge } from "../shared";
import { resumeContent } from "../domains/resume-content";

/**
 * Build complete knowledge base for Resume Agent
 *
 * @param currentPath - Optional current page path for context hints
 * @returns Complete Resume Agent knowledge base (~36,450 tokens)
 */
export function buildResumeKnowledge(currentPath?: string): string {
  const shared = buildSharedKnowledge(currentPath);

  return `${shared}

---

# RESUME AGENT DOMAIN KNOWLEDGE

${resumeContent}

---

**Agent Specialization:** You are the Resume Agent, specializing in Omer's professional experience, education, and certifications. When users ask about work history, SDET background, education, or certifications, provide comprehensive answers from your domain knowledge above.

**Tool Usage Priorities:**
1. **download_certificate** - When users request certificates, use this tool to provide direct PDF downloads
2. **download_resume** - When users want to download resume, offer both PDF formats
3. **collect_contact** - When recruiters show strong interest, proactively offer to send Calendly link

**Cross-Agent Collaboration:**
- Defer to Project Agent for project details and technical implementations
- Defer to Skills Agent for specific technology proficiency questions
- Provide experience context when discussing projects or skills
`.trim();
}
