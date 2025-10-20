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
  TOPIC_KEYWORDS,
  TOPIC_FOLLOWUPS,
  containsAnyKeyword,
} from '@/config/assistantFaq';

// ============================================================================
// INTENT CLASSIFICATION
// ============================================================================

/**
 * Classify user message into an intent using keyword matching
 * Returns null if no clear intent is detected
 */
export function classifyIntent(message: string): Intent | null {
  const intents = Object.entries(INTENTS) as Array<[Exclude<Intent, 'general'>, typeof INTENTS[keyof typeof INTENTS]]>;

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
  if (intent && intent !== 'general') {
    const followups = INTENTS[intent].followups;
    const available = followups.filter(q => !recentlyShown.includes(q));
    if (available.length >= 2) {
      return [available[0], available[1]];
    }
    if (available.length === 1) {
      // Mix with topic-based
      const topics = detectTopics(combined);
      if (topics.length > 0) {
        const topicFollowups = TOPIC_FOLLOWUPS[topics[0]].filter(q => !recentlyShown.includes(q));
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
    const available = allTopicFollowups.filter(q => !recentlyShown.includes(q));
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

  const available = fallbacks.filter(q => !recentlyShown.includes(q));
  return available.length >= 2 ? [available[0], available[1]] : [fallbacks[0], fallbacks[1]];
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
  const enableServerSuggest = process.env.NEXT_PUBLIC_ENABLE_SERVER_SUGGEST === '1';
  if (!enableServerSuggest) {
    return null; // Fall back to heuristic
  }

  try {
    const response = await fetch('/api/suggest-followups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage,
        assistantMessage,
        recentlyShown,
      }),
    });

    if (!response.ok) {
      console.warn('[FollowUps] LLM endpoint failed, falling back to heuristic');
      return null;
    }

    const data = await response.json();
    if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length === 2) {
      return data.suggestions;
    }

    console.warn('[FollowUps] Invalid LLM response format, falling back to heuristic');
    return null;
  } catch (error) {
    console.error('[FollowUps] LLM endpoint error:', error);
    return null;
  }
}

// ============================================================================
// MAIN API
// ============================================================================

/**
 * Generate 2 follow-up questions after assistant message
 * Uses LLM-first approach with heuristic fallback
 *
 * @param userMessage - Last user message
 * @param assistantMessage - Last assistant message
 * @param recentlyShown - Array of recently shown follow-ups to avoid duplicates
 * @returns Array of exactly 2 follow-up question strings
 */
export async function getFollowups(
  userMessage: string,
  assistantMessage: string,
  recentlyShown: string[] = []
): Promise<string[]> {
  // Try LLM first if enabled
  const llmFollowups = await generateLLMFollowups(userMessage, assistantMessage, recentlyShown);
  if (llmFollowups) {
    return llmFollowups;
  }

  // Fallback to heuristic
  return generateHeuristicFollowups(userMessage, assistantMessage, recentlyShown);
}
