import { facts } from "@/data/facts";
import { getTuelProjects } from "@/lib/agent-knowledge/helpers/project-queries";
import { formatElonAcademicProofLine } from "@/lib/proof";

const PRESENCE_PATTERN =
  /^(are\s+(you|u)\s+there|you\s+there|hello|hi|hey|ping)\b/i;
const ABOUT_PATTERN =
  /\b(tell me about yourself|who are you|who is omer|about yourself|about you)\b/i;
const TUEL_PATTERN = /\btuel\b/i;

export function isPresenceQuery(query: string): boolean {
  return PRESENCE_PATTERN.test(query.trim());
}

export function isAboutQuery(query: string): boolean {
  return ABOUT_PATTERN.test(query.trim());
}

export function isTuelQuery(query: string): boolean {
  return TUEL_PATTERN.test(query);
}

/**
 * Deterministic, data-backed reply used when a model/tool turn finishes
 * with no assistant text. Keeps short TUEL / presence / intro questions
 * from rendering as empty bubbles.
 */
export function buildGroundedFallback(query: string): string {
  if (isPresenceQuery(query)) {
    return "Yes, I'm here! I'm Ozzy, Omer's AI portfolio assistant. How can I help you explore his work today?";
  }

  if (isAboutQuery(query)) {
    return [
      `I'm ${facts.personal.fullName}, ${facts.personal.title.toLowerCase()} with ${facts.professional.yearsOfExperience} years spanning QA/SDET and product delivery.`,
      `I built TUEL AI, a B2B edtech platform deployed at Elon University (${formatElonAcademicProofLine()}).`,
      "Would you like to explore projects, skills, or the career journey?",
    ].join(" ");
  }

  if (isTuelQuery(query)) {
    const projectNames = getTuelProjects()
      .map((project) => project.shortTitle ?? project.title)
      .filter((name) => name.trim().length > 0);

    const roster =
      projectNames.length > 0
        ? projectNames.join(", ")
        : "Elon AI, the animation library, the chatbot builder, and the Selenium framework";

    return [
      "TUEL is Omer Akben's product family.",
      `The flagship is TUEL AI (Elon AI Platform), a live FERPA-compliant learning platform at Elon University (${formatElonAcademicProofLine()}).`,
      `Related work includes ${roster}.`,
      "Ask about a specific project if you want a deeper walkthrough.",
    ].join(" ");
  }

  return "I can help with Omer's projects, skills, and career. Ask about TUEL AI, the portfolio, or how to get in touch.";
}
