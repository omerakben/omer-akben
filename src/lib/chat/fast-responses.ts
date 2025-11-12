import { facts } from "@/data/facts";
import type { UIMessage } from "ai";

const overviewPattern =
  /skill|stack|tech|technology|expertise|strength|specialize|what do you do|tell me about (yourself|you)|who\s*(are|r)\s*(you|u)|who is omer|background|bio|profile|introduce|introduction|summary of experience|about you|hi\b|hello\b|hey\b/;

const FIRST_NAME = facts.personal.fullName.split(" ")[0];

export const FAST_INTRO_RESPONSE = `I'm ${FIRST_NAME}, a full-stack AI engineer blending ${facts.professional.yearsOfExperience}+ years of product development with QA automation roots.

• **AI & Agentic Apps:** LangChain/LangGraph, OpenAI/Grok, vector search with Redis & Pinecone
• **Full-Stack:** Next.js 15 + React 19 frontends with FastAPI/Django/Python backends and PostgreSQL
• **Quality DNA:** 98%+ test reliability via Playwright/Selenium, CI/CD pipelines, and HIPAA-ready releases

Want to dive into projects, skills, or get contact details? I'm ready when you are.`;

export function shouldUseFastIntro(
  userInput: string,
  messages: UIMessage[]
): boolean {
  if (!userInput.trim()) {
    return false;
  }

  const hasAssistantMessage = messages.some((m) => m.role === "assistant");
  if (hasAssistantMessage) {
    return false;
  }

  return overviewPattern.test(userInput.toLowerCase());
}
