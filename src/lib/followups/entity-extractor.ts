/**
 * Entity Extraction Module
 *
 * Analyzes conversation history to extract:
 * - Person type (recruiter, engineer, student, general, unknown)
 * - Topic (resume, project, skills, contact, other)
 * - Project mentions (validated against projects.ts)
 * - Confidence score (based on signal strength)
 *
 * Works alongside LLM entity extraction to provide validation and hints
 */

import { projects, getProjectBySlug } from "@/data/projects";
import type {
  PersonTypeEnum,
  TopicEnum,
  EntitiesType,
} from "@/lib/schemas/followup-schema";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface EntityExtractionResult {
  entities: EntitiesType;
  signals: {
    personTypeSignals: string[];
    topicSignals: string[];
    projectSignals: string[];
  };
}

/**
 * Person type detection patterns
 */
const PERSON_TYPE_PATTERNS: Record<
  Exclude<PersonTypeEnum, "unknown">,
  RegExp[]
> = {
  recruiter: [
    /\b(recruiter|recruiting|talent|hr|human resources|hiring manager)\b/i,
    /\b(role|position|job|opening|candidate|interview)\b/i,
    /\b(resume|cv|background|experience|years of)\b/i,
    /\b(team|company|organization)\s+(looking|searching|hiring)\b/i,
    /\b(visa|sponsorship|work authorization)\b/i,
  ],
  engineer: [
    /\b(engineer|developer|programmer|coder|architect)\b/i,
    /\b(tech stack|technology|framework|library|api)\b/i,
    /\b(code|implementation|architecture|design pattern)\b/i,
    /\b(how did you (build|implement|design|solve))\b/i,
    /\b(github|repository|open source)\b/i,
  ],
  student: [
    /\b(student|learning|studying|university|college|school)\b/i,
    /\b(course|bootcamp|tutorial|education)\b/i,
    /\b(beginner|new to|getting started)\b/i,
    /\b(how to learn|where to start)\b/i,
    /\b(internship|entry level)\b/i,
  ],
  general: [
    /\b(hello|hi|hey|greetings)\b/i,
    /\b(who are you|about you|tell me about)\b/i,
    /\b(portfolio|website|work|projects)\b/i,
    /\b(interesting|cool|impressive)\b/i,
  ],
};

/**
 * Topic detection patterns
 */
const TOPIC_PATTERNS: Record<Exclude<TopicEnum, "other">, RegExp[]> = {
  resume: [
    /\b(resume|cv|curriculum vitae)\b/i,
    /\b(download|view|see)\s+(your )?(resume|cv)\b/i,
    /\b(experience|background|qualification|credential)\b/i,
    /\b(work history|employment|job)\b/i,
  ],
  project: [
    /\b(project|app|application|system|platform)\b/i,
    /\b(built|created|developed|designed)\b/i,
    /\b(show me|tell me about|details|demo)\b/i,
    /\b(how (did|does) it work)\b/i,
    /\bportfolio\b/i,
  ],
  skills: [
    /\b(skill|technology|tech|stack|language)\b/i,
    /\b(react|nextjs|typescript|node|python|aws)\b/i,
    /\b(frontend|backend|fullstack|full-stack)\b/i,
    /\b(framework|library|tool)\b/i,
    /\b(certification|certified)\b/i,
  ],
  contact: [
    /\b(contact|reach|email|phone|call|message)\b/i,
    /\b(zoom|meeting|schedule|calendar|available)\b/i,
    /\b(chat|talk|discuss|connect)\b/i,
    /\b(send|share)\s+(link|info|details)\b/i,
  ],
};

/**
 * Extract entities from conversation history
 */
export function extractEntities(messages: Message[]): EntityExtractionResult {
  // Analyze recent messages (last 10 for context)
  const recentMessages = messages.slice(-10);
  const conversationText = recentMessages
    .map((m) => m.content)
    .join(" ")
    .toLowerCase();

  // Extract person type
  const { personType, personTypeSignals } = extractPersonType(conversationText);

  // Extract topic
  const { topic, topicSignals } = extractTopic(conversationText);

  // Extract project mentions
  const { project, projectSignals } = extractProject(conversationText);

  // Calculate confidence based on signal strength
  const confidence = calculateConfidence({
    personTypeSignals,
    topicSignals,
    projectSignals,
  });

  return {
    entities: {
      person_type: personType,
      topic,
      project,
      confidence,
    },
    signals: {
      personTypeSignals,
      topicSignals,
      projectSignals,
    },
  };
}

/**
 * Extract person type from conversation
 */
function extractPersonType(text: string): {
  personType: PersonTypeEnum;
  personTypeSignals: string[];
} {
  const signals: string[] = [];
  const scores: Record<Exclude<PersonTypeEnum, "unknown">, number> = {
    recruiter: 0,
    engineer: 0,
    student: 0,
    general: 0,
  };

  // Check patterns for each person type
  for (const [type, patterns] of Object.entries(PERSON_TYPE_PATTERNS)) {
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        scores[type as Exclude<PersonTypeEnum, "unknown">]++;
        signals.push(`${type}:${matches[0]}`);
      }
    }
  }

  // Determine person type (highest score wins)
  let maxScore = 0;
  let personType: PersonTypeEnum = "unknown";

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      personType = type as PersonTypeEnum;
    }
  }

  // Require at least 2 signals for confident classification
  if (maxScore < 2) {
    personType = "general"; // Default to general if signals are weak
  }

  return { personType, personTypeSignals: signals };
}

/**
 * Extract topic from conversation
 */
function extractTopic(text: string): {
  topic: TopicEnum;
  topicSignals: string[];
} {
  const signals: string[] = [];
  const scores: Record<Exclude<TopicEnum, "other">, number> = {
    resume: 0,
    project: 0,
    skills: 0,
    contact: 0,
  };

  // Check patterns for each topic
  for (const [topic, patterns] of Object.entries(TOPIC_PATTERNS)) {
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        scores[topic as Exclude<TopicEnum, "other">]++;
        signals.push(`${topic}:${matches[0]}`);
      }
    }
  }

  // Determine topic (highest score wins)
  let maxScore = 0;
  let topic: TopicEnum = "other";

  for (const [t, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      topic = t as TopicEnum;
    }
  }

  // Require at least 1 signal for classification
  if (maxScore === 0) {
    topic = "other";
  }

  return { topic, topicSignals: signals };
}

/**
 * Extract project mentions from conversation
 */
function extractProject(text: string): {
  project: string | null;
  projectSignals: string[];
} {
  const signals: string[] = [];
  const normalizedText = text.toLowerCase().replace(/[^a-z0-9\s-]/g, "");

  // Check for exact project slug matches
  for (const project of projects) {
    const slugPattern = new RegExp(`\\b${project.slug}\\b`, "i");
    const titlePattern = new RegExp(
      `\\b${project.title.toLowerCase().replace(/[^a-z0-9\s]/g, "")}\\b`,
      "i"
    );

    if (slugPattern.test(text) || titlePattern.test(normalizedText)) {
      signals.push(`project:${project.slug}`);
      return { project: project.slug, projectSignals: signals };
    }
  }

  // Check for partial matches (e.g., "nurse tracker" for "nurse-shift-tracker")
  for (const project of projects) {
    const titleWords = project.title.toLowerCase().split(/\s+/);
    const slugWords = project.slug.split("-");

    // Check if at least 2 words from title/slug appear in text
    const matchCount = [...titleWords, ...slugWords].filter((word) =>
      normalizedText.includes(word)
    ).length;

    if (matchCount >= 2) {
      signals.push(`project:${project.slug}(partial)`);
      return { project: project.slug, projectSignals: signals };
    }
  }

  return { project: null, projectSignals: signals };
}

/**
 * Calculate confidence score based on signal strength
 */
function calculateConfidence(signals: {
  personTypeSignals: string[];
  topicSignals: string[];
  projectSignals: string[];
}): number {
  const { personTypeSignals, topicSignals, projectSignals } = signals;

  // Base confidence on signal counts
  const personScore = Math.min(personTypeSignals.length * 0.15, 0.4); // Max 0.4
  const topicScore = Math.min(topicSignals.length * 0.2, 0.4); // Max 0.4
  const projectScore = projectSignals.length > 0 ? 0.2 : 0; // Flat 0.2 if project mentioned

  // Sum scores (max 1.0)
  const confidence = Math.min(personScore + topicScore + projectScore, 1.0);

  // Floor at 0.3 (always have some confidence)
  return Math.max(confidence, 0.3);
}

/**
 * Validate extracted entities against schema
 */
export function validateExtractedEntities(
  entities: EntitiesType
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate person_type
  const validPersonTypes: PersonTypeEnum[] = [
    "recruiter",
    "engineer",
    "student",
    "general",
    "unknown",
  ];
  if (!validPersonTypes.includes(entities.person_type)) {
    errors.push(`Invalid person_type: ${entities.person_type}`);
  }

  // Validate topic
  const validTopics: TopicEnum[] = [
    "resume",
    "project",
    "skills",
    "contact",
    "other",
  ];
  if (!validTopics.includes(entities.topic)) {
    errors.push(`Invalid topic: ${entities.topic}`);
  }

  // Validate project slug if present
  if (entities.project) {
    const project = getProjectBySlug(entities.project);
    if (!project) {
      errors.push(`Invalid project slug: ${entities.project}`);
    }
  }

  // Validate confidence range
  if (entities.confidence < 0 || entities.confidence > 1) {
    errors.push(`Confidence must be between 0 and 1, got: ${entities.confidence}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
