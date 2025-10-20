/**
 * Fact Extraction Module
 *
 * Extracts user facts from conversations using OpenAI gpt-4o-mini with
 * structured JSON output. Identifies role, interests, experience level,
 * and other semantic context for personalization.
 */

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { UIMessage } from "ai";
import type { ExtractedFacts, UserRole, ExperienceLevel } from "@/lib/memory/types";
import {
  getCachedCompletion,
  setCachedCompletion,
  recordCacheHit,
  recordCacheMiss,
} from "@/lib/cache/openai-cache";

/**
 * Extracts text content from a UIMessage
 * Handles AI SDK v5 message structure with parts array
 */
function extractMessageText(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) {
    return "";
  }
  const textPart = message.parts.find((part) => part.type === "text");
  return textPart && "text" in textPart ? textPart.text : "";
}

const FACT_EXTRACTION_SYSTEM_PROMPT = `You are a fact extraction system that analyzes portfolio assistant conversations to extract user context.

**Your Task**: Extract facts about the user from the conversation to enable personalization.

**Extract ONLY if confident (>70% certainty)**:
- **role**: User's professional role (recruiter, developer, hiring_manager, student, founder, unknown)
- **company**: Company name if mentioned (null if not mentioned)
- **newInterests**: Technologies, topics, or domains user shows interest in (array of strings)
- **experienceLevel**: User's experience level (junior, mid, senior, lead, unknown)
- **newVisitedProjects**: Project slugs user explicitly asked about or viewed (array of strings)
- **newTechFocus**: Technology areas user is focused on (frontend, backend, ai-ml, devops, testing, etc.) (array of strings)
- **jobSearch**: Whether user is actively job searching (boolean, only true if explicitly mentioned)
- **confidence**: Confidence score 0.0-1.0 for extraction quality

**Critical Rules**:
1. **NO PII**: Never extract names, emails, phone numbers, addresses, or personal identifiers
2. **Only extract what's clearly stated**: Don't infer or assume beyond what's explicit in conversation
3. **Use standard values**: For role and experienceLevel, use ONLY the predefined values listed above
4. **Be conservative**: It's better to extract nothing than to extract incorrectly
5. **Context matters**: Use the full conversation history to understand context

**Indicators**:
- **Recruiter**: Mentions hiring, recruiting, candidates, job postings, talent acquisition
- **Developer**: Discusses coding, building projects, technical implementation, debugging
- **Hiring Manager**: Talks about team building, technical hiring, evaluating candidates
- **Student**: Mentions learning, courses, university, assignments, career exploration
- **Founder**: Discusses startups, founding, entrepreneurship, business building
- **Junior**: 0-2 years experience, asks basic questions, learning fundamentals
- **Mid**: 3-5 years experience, comfortable with concepts, some leadership
- **Senior**: 6+ years experience, deep expertise, architecture discussions
- **Lead**: Staff/Principal level, system design, mentoring, strategic decisions

**Response Format**: JSON object with extracted facts, omit fields if not found:
{
  "role": "developer",
  "company": "Acme Corp",
  "newInterests": ["React", "TypeScript", "AI"],
  "experienceLevel": "senior",
  "newVisitedProjects": ["elon-ai-agent"],
  "newTechFocus": ["frontend", "ai-ml"],
  "jobSearch": false,
  "confidence": 0.85
}

Return ONLY the JSON object, nothing else.`;

/**
 * Converts UIMessage array to analysis context string
 * Takes last N messages to provide sufficient context
 */
function buildAnalysisContext(messages: UIMessage[], limit = 10): string {
  const recentMessages = messages.slice(-limit);

  return recentMessages
    .map((msg) => {
      const role = msg.role === "user" ? "User" : "Assistant";
      const content = extractMessageText(msg);
      return `${role}: ${content}`;
    })
    .join("\n\n");
}

/**
 * Validates extracted facts against known types
 * Returns true if facts are structurally valid
 */
function validateExtractedFacts(facts: unknown): facts is ExtractedFacts {
  if (typeof facts !== "object" || facts === null) {
    return false;
  }

  const obj = facts as Record<string, unknown>;

  // Validate role if present
  if (obj.role !== undefined) {
    const validRoles: UserRole[] = [
      "recruiter",
      "developer",
      "hiring_manager",
      "student",
      "founder",
      "unknown",
    ];
    if (!validRoles.includes(obj.role as UserRole)) {
      return false;
    }
  }

  // Validate experienceLevel if present
  if (obj.experienceLevel !== undefined) {
    const validLevels: ExperienceLevel[] = ["junior", "mid", "senior", "lead", "unknown"];
    if (!validLevels.includes(obj.experienceLevel as ExperienceLevel)) {
      return false;
    }
  }

  // Validate arrays if present
  if (obj.newInterests !== undefined && !Array.isArray(obj.newInterests)) {
    return false;
  }
  if (obj.newVisitedProjects !== undefined && !Array.isArray(obj.newVisitedProjects)) {
    return false;
  }
  if (obj.newTechFocus !== undefined && !Array.isArray(obj.newTechFocus)) {
    return false;
  }

  // Validate confidence if present
  if (obj.confidence !== undefined) {
    if (typeof obj.confidence !== "number" || obj.confidence < 0 || obj.confidence > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Extracts facts from conversation messages using OpenAI gpt-4o-mini
 *
 * Analyzes last 10 messages to extract user context including role, interests,
 * experience level, visited projects, and tech focus areas.
 *
 * @param messages - Array of conversation messages (UIMessage format)
 * @returns ExtractedFacts object or null if extraction fails
 *
 * @example
 * const facts = await extractFacts(conversationMessages);
 * if (facts && facts.confidence > 0.7) {
 *   await mergeSemanticMemory(userId, facts);
 * }
 */
export async function extractFacts(messages: UIMessage[]): Promise<ExtractedFacts | null> {
  // Need at least 2 messages for meaningful extraction (user + assistant)
  if (messages.length < 2) {
    return null;
  }

  try {
    const context = buildAnalysisContext(messages, 10);

    const prompt = `Analyze this conversation and extract user facts:

${context}

Extract facts as JSON:`;

    // Check cache for completion
    const cachedCompletion = await getCachedCompletion(
      "gpt-4o-mini",
      FACT_EXTRACTION_SYSTEM_PROMPT,
      prompt,
      0.3
    );

    let responseText: string;

    if (cachedCompletion !== null) {
      // Cache hit - use cached completion
      responseText = cachedCompletion;
      await recordCacheHit("completion");
    } else {
      // Cache miss - generate completion
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: FACT_EXTRACTION_SYSTEM_PROMPT,
        prompt,
        temperature: 0.3, // Low temperature for consistent, focused extraction
      });

      responseText = result.text;

      // Store in cache for future extractions
      await setCachedCompletion(
        "gpt-4o-mini",
        FACT_EXTRACTION_SYSTEM_PROMPT,
        prompt,
        0.3,
        responseText
      );
      await recordCacheMiss("completion");
    }

    // Parse JSON response
    let facts: unknown;
    try {
      facts = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error("[FactExtractor] Failed to parse OpenAI response", {
        response: responseText,
        error: parseError,
      });
      return null;
    }

    // Validate structure
    if (!validateExtractedFacts(facts)) {
      console.error("[FactExtractor] Invalid facts structure", { facts });
      return null;
    }

    // Check confidence threshold (reject low-confidence extractions)
    if (facts.confidence !== undefined && facts.confidence < 0.7) {
      console.warn("[FactExtractor] Low confidence extraction, skipping", {
        confidence: facts.confidence,
      });
      return null;
    }

    return facts;
  } catch (error) {
    console.error("[FactExtractor] Failed to extract facts", { error });
    return null;
  }
}

/**
 * Extracts facts from conversation and saves to semantic memory
 *
 * Convenience function that combines extraction and storage.
 * Skips if userId is "anonymous" or extraction fails.
 *
 * @param userId - User identifier (skips if "anonymous")
 * @param messages - Array of conversation messages
 *
 * @example
 * // In chat API onFinish callback:
 * await extractAndSaveFacts(userId, finalMessages);
 */
export async function extractAndSaveFacts(
  userId: string,
  messages: UIMessage[]
): Promise<void> {
  // Skip anonymous users
  if (userId === "anonymous") {
    return;
  }

  // Extract facts
  const facts = await extractFacts(messages);

  // Skip if extraction failed or no facts found
  if (!facts) {
    return;
  }

  // Merge with existing semantic memory
  try {
    const { mergeSemanticMemory } = await import("@/lib/memory/semantic-memory");
    await mergeSemanticMemory(userId, facts);
  } catch (error) {
    console.error("[FactExtractor] Failed to merge facts into semantic memory", {
      userId,
      error,
    });
    // Graceful degradation - don't throw, extraction succeeded even if merge failed
  }
}
