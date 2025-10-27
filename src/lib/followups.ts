/**
 * Follow-up Question Generation System
 *
 * Provides intent classification, topic detection, and dynamic follow-up generation
 * with LLM-first approach and heuristic fallback.
 */

import {
  type Intent,
  type Topic,
  INTENTS,
  TOPIC_FOLLOWUPS,
  TOPIC_KEYWORDS,
  containsAnyKeyword,
} from "@/config/assistantFaq";
import type { SemanticMemory } from "@/lib/memory/types";

// ============================================================================
// INTENT CLASSIFICATION
// ============================================================================

/**
 * Classify user message into an intent using keyword matching
 * Returns null if no clear intent is detected
 */
export function classifyIntent(message: string): Intent | null {
  const intents = Object.entries(INTENTS) as Array<
    [Exclude<Intent, "general">, (typeof INTENTS)[keyof typeof INTENTS]]
  >;

  for (const [intent, pattern] of intents) {
    if (containsAnyKeyword(message, pattern.keywords)) {
      return intent;
    }
  }

  return null;
}

// ============================================================================
// TOPIC DETECTION
// ============================================================================

/**
 * Detect topics in message using keyword matching
 * Returns array of detected topics (can be multiple)
 */
export function detectTopics(message: string): Topic[] {
  const topics: Topic[] = [];

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (containsAnyKeyword(message, keywords)) {
      topics.push(topic as Topic);
    }
  }

  return topics;
}

// ============================================================================
// PERSONALIZED FOLLOW-UP GENERATION
// ============================================================================

/**
 * Personalized follow-up templates based on semantic memory
 * Maps user context to relevant follow-up questions
 */
const PERSONALIZED_FOLLOWUPS = {
  recruiter: {
    general: [
      "Which projects best demonstrate leadership at scale?",
      "Tell me about team collaboration in your projects",
      "What metrics did you achieve in production systems?",
    ],
    withInterests: (interests: string[]) => [
      `Which projects use ${interests[0]}?`,
      `Tell me about production experience with ${interests.slice(0, 2).join(" and ")}`,
    ],
    jobSearch: [
      "What kind of engineering team are you looking for?",
      "Which projects best showcase relevant skills for your search?",
    ],
  },
  developer: {
    junior: [
      "Which projects are good for learning ${interests}?",
      "Can you explain the architecture of a beginner-friendly project?",
      "What resources helped you learn these technologies?",
    ],
    mid: [
      "How did you handle scalability in your projects?",
      "Tell me about debugging complex issues",
      "What's your approach to code quality and testing?",
    ],
    senior: [
      "What architectural decisions did you make in ${project}?",
      "How did you mentor team members on these projects?",
      "Tell me about system design trade-offs you considered",
    ],
    withInterests: (interests: string[]) => [
      `Tell me about ${interests[0]} implementation details`,
      `What challenges did you solve with ${interests.slice(0, 2).join(" and ")}?`,
    ],
  },
  hiring_manager: [
    "How do you evaluate technical candidates?",
    "Tell me about building high-performing engineering teams",
    "What's your approach to technical leadership?",
  ],
  student: [
    "Which projects are best for learning?",
    "Can you recommend resources for getting started?",
    "What would you advise someone starting their career?",
  ],
  founder: [
    "How do you balance technical work and business needs?",
    "Tell me about scaling challenges you've faced",
    "What's your approach to product development?",
  ],
};

/**
 * Generate personalized follow-ups based on semantic memory
 * Returns null if no semantic memory or can't generate good personalized follow-ups
 */
function generatePersonalizedFollowups(
  semanticMemory: SemanticMemory | null,
  recentlyShown: string[]
): string[] | null {
  if (!semanticMemory) {
    return null;
  }

  const { role, experienceLevel, interests, techFocus, jobSearch } =
    semanticMemory;

  // Skip if role is unknown and no other context
  if (role === "unknown" && interests.length === 0 && techFocus.length === 0) {
    return null;
  }

  const followups: string[] = [];

  // Role-based personalization
  if (role === "recruiter") {
    if (jobSearch) {
      followups.push(...PERSONALIZED_FOLLOWUPS.recruiter.jobSearch);
    }
    if (interests.length > 0) {
      followups.push(
        ...PERSONALIZED_FOLLOWUPS.recruiter.withInterests(interests)
      );
    }
    followups.push(...PERSONALIZED_FOLLOWUPS.recruiter.general);
  } else if (role === "developer") {
    if (interests.length > 0) {
      followups.push(
        ...PERSONALIZED_FOLLOWUPS.developer.withInterests(interests)
      );
    }
    if (experienceLevel === "junior") {
      followups.push(...PERSONALIZED_FOLLOWUPS.developer.junior);
    } else if (experienceLevel === "mid") {
      followups.push(...PERSONALIZED_FOLLOWUPS.developer.mid);
    } else if (experienceLevel === "senior" || experienceLevel === "lead") {
      followups.push(...PERSONALIZED_FOLLOWUPS.developer.senior);
    }
  } else if (role === "hiring_manager") {
    followups.push(...PERSONALIZED_FOLLOWUPS.hiring_manager);
  } else if (role === "student") {
    followups.push(...PERSONALIZED_FOLLOWUPS.student);
  } else if (role === "founder") {
    followups.push(...PERSONALIZED_FOLLOWUPS.founder);
  }

  // Tech focus-based personalization (if no role-specific questions added yet)
  if (followups.length === 0 && techFocus.length > 0) {
    followups.push(
      `Tell me about your ${techFocus[0]} expertise`,
      `Which projects best demonstrate ${techFocus[0]} skills?`
    );
  }

  // Filter out recently shown
  const available = followups.filter((q) => !recentlyShown.includes(q));

  // Return 2 personalized follow-ups if available
  if (available.length >= 2) {
    return [available[0], available[1]];
  }

  return null;
}

// ============================================================================
// HEURISTIC FOLLOW-UP GENERATION
// ============================================================================

/**
 * Generate follow-up questions using heuristic approach
 * Priority: Intent-based → Topic-based → General fallback
 */
function generateHeuristicFollowups(
  userMessage: string,
  assistantMessage: string,
  recentlyShown: string[]
): string[] {
  const combined = `${userMessage} ${assistantMessage}`;

  // Try intent-based follow-ups first
  const intent = classifyIntent(combined);
  if (intent && intent !== "general") {
    const followups = INTENTS[intent].followups;
    const available = followups.filter((q) => !recentlyShown.includes(q));
    if (available.length >= 2) {
      return [available[0], available[1]];
    }
    if (available.length === 1) {
      // Mix with topic-based
      const topics = detectTopics(combined);
      if (topics.length > 0) {
        const topicFollowups = TOPIC_FOLLOWUPS[topics[0]].filter(
          (q) => !recentlyShown.includes(q)
        );
        if (topicFollowups.length > 0) {
          return [available[0], topicFollowups[0]];
        }
      }
      return [available[0], "What else would you like to know?"];
    }
  }

  // Try topic-based follow-ups
  const topics = detectTopics(combined);
  if (topics.length > 0) {
    const allTopicFollowups: string[] = [];
    for (const topic of topics) {
      allTopicFollowups.push(...TOPIC_FOLLOWUPS[topic]);
    }
    const available = allTopicFollowups.filter(
      (q) => !recentlyShown.includes(q)
    );
    if (available.length >= 2) {
      return [available[0], available[1]];
    }
    if (available.length === 1) {
      return [available[0], "Tell me more about your work"];
    }
  }

  // General fallback
  const fallbacks = [
    "What else would you like to know?",
    "Tell me more about your experience",
    "What projects have you worked on?",
    "What are your technical strengths?",
  ];

  const available = fallbacks.filter((q) => !recentlyShown.includes(q));
  return available.length >= 2
    ? [available[0], available[1]]
    : [fallbacks[0], fallbacks[1]];
}

// ============================================================================
// LLM-BASED FOLLOW-UP GENERATION
// ============================================================================

/**
 * Generate follow-ups using LLM endpoint (server-side)
 * Falls back to heuristic if disabled or fails
 */
async function generateLLMFollowups(
  userMessage: string,
  assistantMessage: string,
  recentlyShown: string[]
): Promise<string[] | null> {
  // Check if LLM mode is enabled
  const enableServerSuggest =
    process.env.NEXT_PUBLIC_ENABLE_SERVER_SUGGEST === "1";
  if (!enableServerSuggest) {
    return null; // Fall back to heuristic
  }

  try {
    const response = await fetch("/api/suggest-followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        assistantMessage,
        recentlyShown,
      }),
    });

    if (!response.ok) {
      console.warn(
        "[FollowUps] LLM endpoint failed, falling back to heuristic"
      );
      return null;
    }

    const data = await response.json();
    if (
      data.suggestions &&
      Array.isArray(data.suggestions) &&
      data.suggestions.length === 2
    ) {
      return data.suggestions;
    }

    console.warn(
      "[FollowUps] Invalid LLM response format, falling back to heuristic"
    );
    return null;
  } catch (error) {
    console.error("[FollowUps] LLM endpoint error:", error);
    return null;
  }
}

// ============================================================================
// MAIN API
// ============================================================================

/**
 * Generate 2 follow-up questions after assistant message
 * Uses personalized → LLM → heuristic cascade approach
 *
 * @param userMessage - Last user message
 * @param assistantMessage - Last assistant message
 * @param recentlyShown - Array of recently shown follow-ups to avoid duplicates
 * @param semanticMemory - Optional user semantic memory for personalization
 * @returns Array of exactly 2 follow-up question strings
 */
export async function getFollowups(
  userMessage: string,
  assistantMessage: string,
  recentlyShown: string[] = [],
  semanticMemory: SemanticMemory | null = null
): Promise<string[]> {
  // Try personalized follow-ups first if semantic memory available
  if (semanticMemory) {
    const personalizedFollowups = generatePersonalizedFollowups(
      semanticMemory,
      recentlyShown
    );
    if (personalizedFollowups) {
      return personalizedFollowups;
    }
  }

  // Try LLM if enabled
  const llmFollowups = await generateLLMFollowups(
    userMessage,
    assistantMessage,
    recentlyShown
  );
  if (llmFollowups) {
    return llmFollowups;
  }

  // Fallback to heuristic
  return generateHeuristicFollowups(
    userMessage,
    assistantMessage,
    recentlyShown
  );
}
