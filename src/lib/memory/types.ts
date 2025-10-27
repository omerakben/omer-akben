/**
 * Semantic Memory Type Definitions
 *
 * Defines TypeScript types for user semantic memory system that extracts
 * and stores user facts from conversations for personalized interactions.
 */

/**
 * User professional role classification
 */
export type UserRole =
  | "recruiter" // Hiring manager or talent acquisition
  | "developer" // Software engineer or developer
  | "hiring_manager" // Technical hiring manager
  | "student" // Student or learner
  | "founder" // Startup founder or entrepreneur
  | "unknown"; // Unable to determine

/**
 * User experience level classification
 */
export type ExperienceLevel =
  | "junior" // 0-2 years experience
  | "mid" // 3-5 years experience
  | "senior" // 6+ years experience
  | "lead" // Lead/Staff/Principal level
  | "unknown"; // Unable to determine

/**
 * Complete semantic memory profile for a user
 * Stored in Redis Hash with 90-day TTL
 */
export interface SemanticMemory {
  /** User's professional role */
  role: UserRole;

  /** Company name (if mentioned) */
  company: string | null;

  /** Topics/technologies user is interested in */
  interests: string[];

  /** User's experience level */
  experienceLevel: ExperienceLevel;

  /** Project slugs user has visited or asked about */
  visitedProjects: string[];

  /** Technology areas user is focused on */
  techFocus: string[];

  /** Whether user is actively job searching */
  jobSearch: boolean;

  /** Timestamp of last update (ISO 8601) */
  lastUpdated: string;
}

/**
 * Facts extracted from a conversation
 * Used for incremental updates to semantic memory
 */
export interface ExtractedFacts {
  /** Detected user role (only if identified with high confidence) */
  role?: UserRole;

  /** Detected company (only if mentioned) */
  company?: string;

  /** New interests to add to existing list */
  newInterests?: string[];

  /** Detected experience level (only if identified) */
  experienceLevel?: ExperienceLevel;

  /** New project slugs to add to visited list */
  newVisitedProjects?: string[];

  /** New technology focus areas to add */
  newTechFocus?: string[];

  /** Whether user mentioned job search */
  jobSearch?: boolean;

  /** Confidence score (0-1) for extraction quality */
  confidence?: number;
}

/**
 * Default semantic memory for new users
 */
export const DEFAULT_SEMANTIC_MEMORY: SemanticMemory = {
  role: "unknown",
  company: null,
  interests: [],
  experienceLevel: "unknown",
  visitedProjects: [],
  techFocus: [],
  jobSearch: false,
  lastUpdated: new Date().toISOString(),
};

/**
 * Maximum array sizes to prevent memory bloat
 */
export const SEMANTIC_MEMORY_LIMITS = {
  MAX_INTERESTS: 10,
  MAX_VISITED_PROJECTS: 20,
  MAX_TECH_FOCUS: 10,
} as const;

/**
 * TTL for semantic memory (90 days in seconds)
 */
export const SEMANTIC_MEMORY_TTL = 90 * 24 * 60 * 60; // 90 days
