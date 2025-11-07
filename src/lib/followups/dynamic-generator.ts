/**
 * Dynamic follow-up generator with A/B testing
 *
 * Generates context-aware follow-up questions using LLM with:
 * - A/B testing: 50/50 split between XAI Grok-2-1212 and GPT-4o-mini
 * - Conversation history analysis
 * - Entity extraction (person type, topic, confidence)
 * - Project slug validation against data/projects.ts
 * - Routing state tracking for conversation flow
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";
import {
  FollowupResponse,
  FollowupResponseType,
  PersonTypeEnum,
  TopicEnum,
} from "@/lib/schemas/followup-schema";
import { projects, getProjectBySlug } from "@/data/projects";
import type { SemanticMemory } from "@/lib/memory/types";
import { extractEntities, validateExtractedEntities } from "./entity-extractor";
import { determineNextState, suggestConversationFlow } from "./routing-state-machine";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DynamicGeneratorContext {
  messages: Message[];
  userId?: string;
  threadId?: string;
  semanticMemory?: SemanticMemory | null;
}

/**
 * Build system prompt for follow-up generation
 * Enhanced with entity hints from programmatic extraction
 */
function buildFollowupSystemPrompt(
  semanticMemory?: SemanticMemory | null,
  entityHints?: {
    person_type: PersonTypeEnum;
    topic: TopicEnum;
    project: string | null;
    confidence: number;
  }
): string {
  const validSlugs = projects.map(p => p.slug).join(", ");

  let personalizationContext = "";
  if (semanticMemory) {
    const { role, interests, visitedProjects, techFocus } = semanticMemory;
    personalizationContext = `

## User Profile (Personalization Context)
- Role: ${role || "unknown"}
- Interests: ${interests?.join(", ") || "none"}
- Tech Focus: ${techFocus?.join(", ") || "none"}
- Previously Viewed Projects: ${visitedProjects?.join(", ") || "none"}

Adapt follow-up suggestions based on this profile.`;
  }

  let entityHintsContext = "";
  if (entityHints) {
    entityHintsContext = `

## Entity Detection Hints (from conversation analysis)
- Detected Person Type: ${entityHints.person_type}
- Detected Topic: ${entityHints.topic}
- Detected Project: ${entityHints.project || "none"}
- Signal Strength: ${(entityHints.confidence * 100).toFixed(0)}%

Use these hints to validate your entity extraction, but trust your LLM analysis if there are clear signals in the conversation.`;
  }

  return `You are an expert at generating contextual follow-up questions for a portfolio chatbot conversation.

## Your Task
Analyze the conversation and generate 2-4 relevant follow-up questions that guide the user toward valuable actions or information.

## Available Actions
You can suggest follow-ups with these actions:
- download_resume: Resume download (formats: "resume" or "extended")
- open_project: Navigate to project detail page (requires valid slug)
- list_projects: List projects with optional category filter
- search_projects: Semantic search for projects (requires query string)
- provide_nav: Show navigation options
- collect_contact: Collect contact info and send Zoom link
- none: Pure conversational question (no side effect)

## Valid Project Slugs
${validSlugs}

IMPORTANT: Only use project slugs from the list above. If user mentions a project not in the list, use "search_projects" action instead.
${personalizationContext}${entityHintsContext}

## Response Format (JSON)
Return ONLY valid JSON matching this exact structure:

{
  "entities": {
    "person_type": "recruiter" | "engineer" | "student" | "general" | "unknown",
    "topic": "resume" | "project" | "skills" | "contact" | "other",
    "project": "valid-slug-or-null",
    "confidence": 0.0-1.0
  },
  "suggested_followups": [
    {
      "label": "Imperative statement expressing user intent (10-60 chars)",
      "intent": "clarify" | "qualify" | "cta" | "route" | "explore",
      "action": "download_resume" | "open_project" | "list_projects" | "search_projects" | "provide_nav" | "collect_contact" | "none",
      "args": { "slug": "optional", "format": "optional", "query": "optional" }
    }
  ],
  "routing": {
    "next_state": "PersonType>Topic>Stage",
    "reason": "Why this routing state (max 100 chars)"
  }
}

## Label Format Rules (CRITICAL)
- **Use imperative/declarative statements**, NOT questions
- Labels express what the USER wants to DO or KNOW
- When clicked, the label becomes the user's message to Ozzy
- ✅ GOOD: "Show me featured projects", "Download resume", "View technical skills"
- ❌ BAD: "Do you want to see projects?", "Would you like to download resume?"
- Keep labels concise (10-60 chars), action-oriented, and clear

## Guidelines
1. **Relevance**: Follow-ups must directly relate to last 2-3 exchanges
2. **Progression**: Guide conversation toward deeper engagement
3. **Actionable**: Always include at least 1 CTA (download, view project, contact)
4. **No Repetition**: Avoid suggesting already-discussed topics
5. **Specificity**: Use concrete statements over generic ones
6. **Confidence**: Set confidence based on clarity of user's intent
   - < 0.55: Use "clarify" intent
   - 0.55-0.75: Use "qualify" intent
   - > 0.75: Use "cta" intent

## Example Output
{
  "entities": {
    "person_type": "recruiter",
    "topic": "resume",
    "project": null,
    "confidence": 0.88
  },
  "suggested_followups": [
    {
      "label": "Download resume (PDF)",
      "intent": "cta",
      "action": "download_resume",
      "args": { "format": "resume" }
    },
    {
      "label": "Show me leadership projects",
      "intent": "qualify",
      "action": "list_projects",
      "args": { "category": "featured" }
    },
    {
      "label": "Tell me about AWS certification",
      "intent": "explore",
      "action": "none"
    }
  ],
  "routing": {
    "next_state": "Recruiter>Resume>Qualification",
    "reason": "Recruiter interested in credentials, next explore fit"
  }
}`;
}

/**
 * Validate project slug against projects.ts
 */
function validateProjectSlug(slug: string | null): {
  valid: boolean;
  correctedSlug?: string;
  suggestion: string;
} {
  if (!slug) {
    return { valid: true, suggestion: "No project mentioned" };
  }

  // Exact match
  const project = getProjectBySlug(slug);
  if (project) {
    return { valid: true, suggestion: `Valid slug: ${slug}` };
  }

  // Fuzzy match for typos
  const fuzzyMatch = projects.find(p => {
    const lowerSlug = slug.toLowerCase();
    const lowerProjectSlug = p.slug.toLowerCase();
    return (
      lowerProjectSlug.includes(lowerSlug) ||
      lowerSlug.includes(lowerProjectSlug) ||
      levenshteinDistance(lowerProjectSlug, lowerSlug) <= 2
    );
  });

  if (fuzzyMatch) {
    return {
      valid: false,
      correctedSlug: fuzzyMatch.slug,
      suggestion: `Did you mean: ${fuzzyMatch.slug}?`
    };
  }

  return {
    valid: false,
    suggestion: `Invalid slug: ${slug}. Use search_projects action instead.`
  };
}

/**
 * Simple Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Generate dynamic follow-ups using GPT-4o-mini
 * Enhanced with entity extraction and routing state machine
 */
export async function generateDynamicFollowups(
  context: DynamicGeneratorContext
): Promise<FollowupResponseType | null> {
  try {
    const { messages, semanticMemory } = context;

    // Take last 4 messages for context (2 Q/A pairs max) - optimized for speed
    const recentMessages = messages.slice(-4);

    // Extract entities programmatically for hints
    const { entities: extractedEntities, signals } = extractEntities(recentMessages);

    console.log("[DynamicGenerator] Extracted entities:", {
      entities: extractedEntities,
      signals: {
        personType: signals.personTypeSignals.length,
        topic: signals.topicSignals.length,
        project: signals.projectSignals.length,
      },
    });

    // A/B testing: 50/50 split between Grok-4-fast and GPT-4o-mini
    const USE_GROK = Math.random() < 0.5;
    const model = USE_GROK
      ? xai("grok-2-1212")
      : openai("gpt-4o-mini");

    const modelName = USE_GROK ? "grok-2-1212" : "gpt-4o-mini";
    const startTime = Date.now();

    console.log(`[DynamicGenerator] Using model: ${modelName}`);

    // Generate follow-ups with selected model
    const result = await generateText({
      model,
      system: buildFollowupSystemPrompt(semanticMemory, extractedEntities),
      messages: recentMessages,
      temperature: 0.5,
    });

    const duration = Date.now() - startTime;
    console.log(`[DynamicGenerator] ${modelName} generation time: ${duration}ms`);

    // Parse JSON response
    const parsed = JSON.parse(result.text);

    // Validate against Zod schema
    const validated = FollowupResponse.parse(parsed);

    // Validate project slug if mentioned
    if (validated.entities.project) {
      const slugValidation = validateProjectSlug(validated.entities.project);

      if (!slugValidation.valid) {
        console.warn(`[DynamicGenerator] ${slugValidation.suggestion}`);

        // Auto-correct if we found a fuzzy match
        if (slugValidation.correctedSlug) {
          validated.entities.project = slugValidation.correctedSlug;

          // Update any open_project actions
          validated.suggested_followups = validated.suggested_followups.map(f => {
            if (f.action === "open_project" && f.args?.slug === validated.entities.project) {
              return {
                ...f,
                args: { ...f.args, slug: slugValidation.correctedSlug }
              };
            }
            return f;
          });
        } else {
          // Invalid slug, convert to search
          validated.entities.project = null;
          validated.suggested_followups = validated.suggested_followups.map(f => {
            if (f.action === "open_project") {
              return {
                ...f,
                action: "search_projects" as const,
                args: { query: f.args?.slug || "" }
              };
            }
            return f;
          });
        }
      }
    }

    // Validate extracted entities
    const entityValidation = validateExtractedEntities(validated.entities);
    if (!entityValidation.valid) {
      console.warn("[DynamicGenerator] Entity validation warnings:", entityValidation.errors);
    }

    // Compare LLM entities with programmatic extraction
    const entityMatch = {
      personType: validated.entities.person_type === extractedEntities.person_type,
      topic: validated.entities.topic === extractedEntities.topic,
      project: validated.entities.project === extractedEntities.project,
    };

    console.log("[DynamicGenerator] Entity comparison (LLM vs Programmatic):", {
      llm: {
        personType: validated.entities.person_type,
        topic: validated.entities.topic,
        project: validated.entities.project || "none",
      },
      programmatic: {
        personType: extractedEntities.person_type,
        topic: extractedEntities.topic,
        project: extractedEntities.project || "none",
      },
      match: entityMatch,
    });

    // Enhance routing state using state machine
    const enhancedRouting = determineNextState(validated.entities);
    const flowSuggestion = suggestConversationFlow(enhancedRouting.next_state);

    console.log("[DynamicGenerator] Routing state:", {
      original: validated.routing,
      enhanced: enhancedRouting,
      flow: flowSuggestion,
    });

    // If LLM routing state differs from state machine suggestion, log it
    if (validated.routing.next_state !== enhancedRouting.next_state) {
      console.log("[DynamicGenerator] LLM routing differs from state machine:", {
        llm: validated.routing.next_state,
        stateMachine: enhancedRouting.next_state,
        reason: "Using LLM routing (more context-aware)",
      });
    }

    return validated;

  } catch (error) {
    if (error instanceof Error) {
      console.error("[DynamicGenerator] Generation failed:", error.message);
    } else {
      console.error("[DynamicGenerator] Unknown error:", error);
    }
    return null;
  }
}

/**
 * Extract entities from conversation (fallback if LLM fails)
 */
export function extractEntitiesHeuristic(messages: Message[]): {
  person_type: PersonTypeEnum;
  topic: TopicEnum;
  project: string | null;
  confidence: number;
} {
  const combined = messages
    .slice(-5)
    .map(m => m.content.toLowerCase())
    .join(" ");

  // Person type detection (priority order)
  let person_type: PersonTypeEnum = "unknown";
  if (/(hiring|recruit|candidate|role|position|job|team|interview)/i.test(combined)) {
    person_type = "recruiter";
  } else if (/(technical|implement|architecture|code|framework|library)/i.test(combined)) {
    person_type = "engineer";
  } else if (/(learn|study|course|tutorial|beginner)/i.test(combined)) {
    person_type = "student";
  } else if (combined.length > 50) {
    person_type = "general";
  }

  // Topic detection
  const topicScores = {
    resume: (combined.match(/(resume|cv|experience|background|certification)/gi) || []).length,
    project: (combined.match(/(project|portfolio|built|work|case study)/gi) || []).length,
    skills: (combined.match(/(skills|technology|tools|framework|stack)/gi) || []).length,
    contact: (combined.match(/(contact|email|hire|reach|schedule|meeting)/gi) || []).length,
  };

  const [topic, score] = Object.entries(topicScores)
    .sort((a, b) => b[1] - a[1])[0];

  // Project slug extraction (basic pattern matching)
  let project: string | null = null;
  const projectPatterns = projects.map(p => ({
    slug: p.slug,
    patterns: [
      new RegExp(`\\b${p.slug}\\b`, "i"),
      new RegExp(`\\b${p.title}\\b`, "i"),
      ...p.slug.split("-").map(word => new RegExp(`\\b${word}\\b`, "i"))
    ]
  }));

  for (const { slug, patterns } of projectPatterns) {
    if (patterns.some(pattern => pattern.test(combined))) {
      project = slug;
      break;
    }
  }

  return {
    person_type,
    topic: (score > 0 ? topic : "other") as TopicEnum,
    project,
    confidence: Math.min((person_type !== "unknown" ? 0.3 : 0) + (score / 5), 0.8)
  };
}
