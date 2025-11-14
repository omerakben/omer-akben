/**
 * Shared Knowledge Builder
 *
 * Combines all universal knowledge modules (security, constraints, identity, guidelines)
 * into a single buildSharedKnowledge() function.
 *
 * Total token budget: ~6,450 tokens
 * - security-directive.ts: 250 tokens
 * - response-constraints.ts: 900 tokens
 * - core-identity.ts: 800 tokens
 * - conversation-guidelines.ts: 4,500 tokens
 */

import { securityDirective } from "./security-directive";
import { responseConstraints } from "./response-constraints";
import { coreIdentity } from "./core-identity";
import { conversationGuidelines } from "./conversation-guidelines";

/**
 * Build shared knowledge base for all agents
 *
 * This function combines universal modules that every agent needs:
 * 1. Security rules (prevent prompt injection, protect implementation details)
 * 2. Response formatting (200-word limit, mobile-friendly structure)
 * 3. Core identity (who Omer is, work authorization, contact info)
 * 4. Conversation guidelines (how to interact with users)
 *
 * @param currentPath - Optional current page path for context hints
 * @returns Complete shared knowledge base string (~6,450 tokens)
 */
export function buildSharedKnowledge(currentPath?: string): string {
  // STATIC CONTENT (XAI will cache this portion - 99% of prompt)
  const staticContent = `# OZZY AI - PORTFOLIO ASSISTANT

You are Ozzy, Omer Akben's AI assistant and portfolio guide. Your primary role is to be **helpful and conversational** - think of yourself as a friendly colleague who happens to know Omer's work really well. You're here to help visitors (especially recruiters and employers) understand what Omer brings to the table in a natural, engaging way.

---

${securityDirective}

---

${responseConstraints}

---

${coreIdentity}

---

${conversationGuidelines}

---

**Remember:** This is a portfolio, not a resume dump. Help people understand Omer's work through stories and outcomes, with technical details available when they want to dig deeper.`;

  // DYNAMIC CONTENT (placed at end for XAI prompt caching optimization)
  let contextHint = "";
  if (currentPath) {
    if (currentPath === "/") {
      contextHint =
        "\n\n---\n\n**CURRENT PAGE CONTEXT:** User is on the homepage. Suggest exploring projects, viewing skills, or downloading resume.";
    } else if (currentPath.startsWith("/projects")) {
      contextHint =
        "\n\n---\n\n**CURRENT PAGE CONTEXT:** User is viewing the projects page. Offer to explain specific projects, filter by category, or show similar work.";
    } else if (currentPath === "/skills") {
      contextHint =
        "\n\n---\n\n**CURRENT PAGE CONTEXT:** User is on the skills page. Focus on technical expertise, frameworks, and tool proficiency.";
    } else if (currentPath === "/journey") {
      contextHint =
        "\n\n---\n\n**CURRENT PAGE CONTEXT:** User is on the journey page. Focus on career progression, education, and certifications.";
    } else if (currentPath === "/contact") {
      contextHint =
        "\n\n---\n\n**CURRENT PAGE CONTEXT:** User is on the contact page. Offer to help with contact information, resume downloads, or scheduling.";
    } else if (currentPath === "/recruiter") {
      contextHint =
        "\n\n---\n\n**CURRENT PAGE CONTEXT:** User is on the recruiter page. Prioritize work authorization, resume downloads, and scheduling meetings.";
    }
  }

  return `${staticContent}${contextHint}`.trim();
}
