/**
 * Semantic Memory Manager
 *
 * Manages user semantic memory for personalization using Redis Hash storage.
 * Stores user context (role, interests, experience level) with intelligent
 * array merging and 90-day TTL for privacy compliance.
 */

import { getRedisClient } from "@/lib/redis/client";
import type {
  SemanticMemory,
  ExtractedFacts,
  UserRole,
  ExperienceLevel,
} from "@/lib/memory/types";
import {
  DEFAULT_SEMANTIC_MEMORY,
  SEMANTIC_MEMORY_TTL,
  SEMANTIC_MEMORY_LIMITS,
} from "@/lib/memory/types";

const SEMANTIC_MEMORY_PREFIX = "memory:semantic:";

/**
 * Builds Redis key for user semantic memory
 * Pattern: memory:semantic:{userId}
 */
function buildKey(userId: string): string {
  return `${SEMANTIC_MEMORY_PREFIX}${userId}`;
}

/**
 * Parses stored semantic memory from Redis Hash format
 */
function parseSemanticMemory(data: Record<string, string>): SemanticMemory {
  return {
    role: (data.role as UserRole) || DEFAULT_SEMANTIC_MEMORY.role,
    company: data.company || null,
    interests: data.interests ? JSON.parse(data.interests) : [],
    experienceLevel:
      (data.experienceLevel as ExperienceLevel) || DEFAULT_SEMANTIC_MEMORY.experienceLevel,
    visitedProjects: data.visitedProjects ? JSON.parse(data.visitedProjects) : [],
    techFocus: data.techFocus ? JSON.parse(data.techFocus) : [],
    jobSearch: data.jobSearch === "true",
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
}

/**
 * Serializes semantic memory for Redis Hash storage
 */
function serializeSemanticMemory(memory: SemanticMemory): Record<string, string> {
  return {
    role: memory.role,
    company: memory.company || "",
    interests: JSON.stringify(memory.interests),
    experienceLevel: memory.experienceLevel,
    visitedProjects: JSON.stringify(memory.visitedProjects),
    techFocus: JSON.stringify(memory.techFocus),
    jobSearch: String(memory.jobSearch),
    lastUpdated: memory.lastUpdated,
  };
}

/**
 * Merges arrays with deduplication and limit enforcement
 * Uses Set for union operation, then truncates to limit
 */
function mergeArrayWithLimit(
  existing: string[],
  newItems: string[],
  limit: number
): string[] {
  const merged = Array.from(new Set([...existing, ...newItems]));
  return merged.slice(0, limit);
}

/**
 * Retrieves semantic memory for a user from Redis
 *
 * @param userId - User identifier (skips if "anonymous")
 * @returns SemanticMemory object or null if not found
 *
 * @example
 * const memory = await getSemanticMemory("user-123");
 * if (memory) {
 *   console.log(memory.role, memory.interests);
 * }
 */
export async function getSemanticMemory(userId: string): Promise<SemanticMemory | null> {
  // Skip anonymous users
  if (userId === "anonymous") {
    return null;
  }

  try {
    const redis = getRedisClient();
    const key = buildKey(userId);
    const data = await redis.hgetall<Record<string, string>>(key);

    // No data stored for this user
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return parseSemanticMemory(data);
  } catch (error) {
    console.error("[SemanticMemory] Failed to retrieve semantic memory", { userId, error });
    return null;
  }
}

/**
 * Saves complete semantic memory for a user to Redis
 * Overwrites any existing memory and sets 90-day TTL
 *
 * @param userId - User identifier (skips if "anonymous")
 * @param memory - Complete SemanticMemory object
 *
 * @example
 * await saveSemanticMemory("user-123", {
 *   role: "developer",
 *   company: "Acme Corp",
 *   interests: ["React", "TypeScript"],
 *   experienceLevel: "senior",
 *   visitedProjects: ["ai-agent"],
 *   techFocus: ["frontend", "ai"],
 *   jobSearch: false,
 *   lastUpdated: new Date().toISOString(),
 * });
 */
export async function saveSemanticMemory(
  userId: string,
  memory: SemanticMemory
): Promise<void> {
  // Skip anonymous users
  if (userId === "anonymous") {
    return;
  }

  try {
    const redis = getRedisClient();
    const key = buildKey(userId);
    const serialized = serializeSemanticMemory(memory);

    // Store in Redis Hash with HSET
    await redis.hset(key, serialized);

    // Set TTL to 90 days for privacy compliance
    await redis.expire(key, SEMANTIC_MEMORY_TTL);
  } catch (error) {
    console.error("[SemanticMemory] Failed to save semantic memory", { userId, error });
    throw error;
  }
}

/**
 * Intelligently merges new facts with existing semantic memory
 *
 * Merge Strategy:
 * - Single values (role, company, experienceLevel, jobSearch): Replace if provided
 * - Arrays (interests, visitedProjects, techFocus): Union with deduplication + limit enforcement
 *
 * If no existing memory, creates new memory with default values + extracted facts
 *
 * @param userId - User identifier (skips if "anonymous")
 * @param newFacts - Extracted facts to merge
 *
 * @example
 * await mergeSemanticMemory("user-123", {
 *   role: "developer",
 *   newInterests: ["Vue.js", "Nuxt"],
 *   newTechFocus: ["frontend"],
 * });
 */
export async function mergeSemanticMemory(
  userId: string,
  newFacts: ExtractedFacts
): Promise<void> {
  // Skip anonymous users
  if (userId === "anonymous") {
    return;
  }

  try {
    // Get existing memory or use defaults
    const existing = (await getSemanticMemory(userId)) || { ...DEFAULT_SEMANTIC_MEMORY };

    // Merge single values (replace if provided)
    const merged: SemanticMemory = {
      role: newFacts.role || existing.role,
      company: newFacts.company || existing.company,
      experienceLevel: newFacts.experienceLevel || existing.experienceLevel,
      jobSearch: newFacts.jobSearch ?? existing.jobSearch,

      // Merge arrays with union + limit enforcement
      interests: mergeArrayWithLimit(
        existing.interests,
        newFacts.newInterests || [],
        SEMANTIC_MEMORY_LIMITS.MAX_INTERESTS
      ),
      visitedProjects: mergeArrayWithLimit(
        existing.visitedProjects,
        newFacts.newVisitedProjects || [],
        SEMANTIC_MEMORY_LIMITS.MAX_VISITED_PROJECTS
      ),
      techFocus: mergeArrayWithLimit(
        existing.techFocus,
        newFacts.newTechFocus || [],
        SEMANTIC_MEMORY_LIMITS.MAX_TECH_FOCUS
      ),

      lastUpdated: new Date().toISOString(),
    };

    // Save merged memory
    await saveSemanticMemory(userId, merged);
  } catch (error) {
    console.error("[SemanticMemory] Failed to merge semantic memory", { userId, error });
    // Graceful degradation: log error but don't throw
  }
}

/**
 * Deletes all semantic memory for a user
 * Used for privacy compliance and account deletion
 *
 * @param userId - User identifier (skips if "anonymous")
 *
 * @example
 * await clearSemanticMemory("user-123");
 */
export async function clearSemanticMemory(userId: string): Promise<void> {
  // Skip anonymous users
  if (userId === "anonymous") {
    return;
  }

  try {
    const redis = getRedisClient();
    const key = buildKey(userId);
    await redis.del(key);
  } catch (error) {
    console.error("[SemanticMemory] Failed to clear semantic memory", { userId, error });
    throw error;
  }
}
