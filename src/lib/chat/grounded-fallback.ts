import { facts } from "@/data/facts";
import { formatElonAcademicProofLine } from "@/lib/proof";

const PRESENCE_PATTERN =
  /^(are\s+(you|u)\s+there|you\s+there|hello|hi|hey|ping)\b/i;
const ABOUT_PATTERN =
  /\b(tell me about your\s*self|who are you|who is omer|about yourself|about you)\b/i;
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
    return [
      "TUEL (Trusted Unified Education & Learning) is Omer Akben's course-grounded higher-ed AI platform at tuel.ai.",
      `The flagship deployment is TUEL AI (Elon AI Platform) at Elon University (${formatElonAcademicProofLine()}).`,
      "Ask about a specific project if you want a deeper walkthrough.",
    ].join(" ");
  }

  return "I can help with Omer's projects, skills, and career. Ask about TUEL AI, the portfolio, or how to get in touch.";
}
