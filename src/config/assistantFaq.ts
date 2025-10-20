/**
 * Assistant FAQ Configuration
 *
 * Contains Fact Bank, intent definitions, topic keywords, and follow-up question libraries
 * for the dynamic follow-up generation system.
 */

// ============================================================================
// FACT BANK (Use verbatim from AI_AGENT.md)
// ============================================================================

export const FACT_BANK = {
  tmay: {
    present: "I'm an AI Engineer & Full-Stack dev focused on TypeScript/React and Python/FastAPI/Django. Lately I've shipped agentic/RAG features with OpenAI/Claude + LangGraph.",
    past: "Previously, I led QA automation at scale (Playwright/Selenium, CI/CD).",
    future: "Now I'm building production-grade AI agents and DX tooling.",
  },
  problems: [
    "turning messy knowledge into searchable RAG",
    "agentic workflows that take actions (MCP/tools)",
    "bulletproof CI/CD + test automation so features ship reliably",
  ],
  signatureProject: {
    name: "Ozzy AI Twin",
    description: "Goal: side-panel agent for my portfolio. I designed tool use (Playwright MCP, web browse, RAG on my docs), built a FastAPI backend + Next.js UI, and added eval tests in CI. Result: e.g., sub-1s retrieval, ~95% task success on scripted flows.",
  },
} as const;

// ============================================================================
// INTENT DEFINITIONS
// ============================================================================

export type Intent =
  | 'tmay'           // Tell Me About Yourself
  | 'problems'       // Problems you love solving
  | 'portfolio'      // Signature project walkthrough
  | 'skills'         // Technical skills
  | 'experience'     // Work experience
  | 'general';       // Catch-all

export interface IntentPattern {
  keywords: string[];
  followups: string[];
}

export const INTENTS: Record<Exclude<Intent, 'general'>, IntentPattern> = {
  tmay: {
    keywords: ['about you', 'introduce yourself', 'who are you', 'tell me about yourself', 'background'],
    followups: [
      "What problems do you love solving?",
      "Walk me through your portfolio project",
      "What's your technical stack?",
      "Tell me about your work experience",
    ],
  },
  problems: {
    keywords: ['problems', 'solve', 'challenges', 'focus on', 'passionate about'],
    followups: [
      "Can you give an example of a RAG system you built?",
      "What agentic workflows have you implemented?",
      "How do you approach CI/CD automation?",
      "What's your testing philosophy?",
    ],
  },
  portfolio: {
    keywords: ['portfolio', 'project', 'ozzy ai twin', 'built', 'ship'],
    followups: [
      "What was the biggest technical challenge?",
      "How did you implement the MCP tools?",
      "What metrics did you achieve?",
      "Can I see the live demo?",
    ],
  },
  skills: {
    keywords: ['skills', 'technologies', 'tech stack', 'frameworks', 'tools'],
    followups: [
      "What's your experience with AI/ML?",
      "How proficient are you with TypeScript/React?",
      "Tell me about your Python experience",
      "What testing frameworks do you use?",
    ],
  },
  experience: {
    keywords: ['experience', 'work', 'career', 'roles', 'companies'],
    followups: [
      "What did you do as a QA Lead?",
      "Tell me about your AI engineering work",
      "What was your biggest impact?",
      "What kind of role are you looking for?",
    ],
  },
};

// ============================================================================
// TOPIC KEYWORDS & FOLLOW-UP LIBRARIES
// ============================================================================

export type Topic =
  | 'technical'
  | 'experience'
  | 'projects'
  | 'ai-ml'
  | 'frontend'
  | 'backend'
  | 'testing'
  | 'devops';

export const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  technical: ['code', 'programming', 'development', 'engineering', 'tech'],
  experience: ['worked', 'role', 'company', 'team', 'led', 'managed'],
  projects: ['built', 'created', 'developed', 'shipped', 'launched'],
  'ai-ml': ['ai', 'ml', 'machine learning', 'rag', 'llm', 'gpt', 'claude', 'agents'],
  frontend: ['react', 'next.js', 'ui', 'frontend', 'typescript', 'tailwind'],
  backend: ['fastapi', 'django', 'python', 'api', 'backend', 'server'],
  testing: ['test', 'playwright', 'selenium', 'qa', 'automation', 'ci/cd'],
  devops: ['deploy', 'ci/cd', 'docker', 'kubernetes', 'infrastructure'],
};

export const TOPIC_FOLLOWUPS: Record<Topic, string[]> = {
  technical: [
    "What's your preferred tech stack?",
    "How do you approach code quality?",
    "What development practices do you follow?",
  ],
  experience: [
    "Tell me about your most recent role",
    "What was your biggest achievement?",
    "What kind of teams have you worked with?",
  ],
  projects: [
    "What project are you most proud of?",
    "Can you walk me through your development process?",
    "What challenges did you overcome?",
  ],
  'ai-ml': [
    "What AI projects have you worked on?",
    "How do you implement RAG systems?",
    "What's your experience with LangChain/LangGraph?",
  ],
  frontend: [
    "How do you approach UI/UX design?",
    "What's your React development workflow?",
    "Tell me about your TypeScript experience",
  ],
  backend: [
    "What backend frameworks do you prefer?",
    "How do you design APIs?",
    "What's your database experience?",
  ],
  testing: [
    "What's your testing strategy?",
    "How do you ensure code quality?",
    "Tell me about your QA experience",
  ],
  devops: [
    "How do you handle deployments?",
    "What's your CI/CD setup?",
    "What cloud platforms do you use?",
  ],
};

// ============================================================================
// STARTER/SUGGESTED QUESTIONS
// ============================================================================

export const STARTER_QUESTIONS = [
  "Tell me about yourself",
  "What problems do you love solving?",
  "Walk me through your portfolio project",
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize text for keyword matching (lowercase, remove punctuation)
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ');
}

/**
 * Check if text contains any of the keywords
 */
export function containsAnyKeyword(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text);
  return keywords.some(keyword => normalized.includes(normalizeText(keyword)));
}
