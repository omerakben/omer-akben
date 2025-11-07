/**
 * Zod schemas for dynamic follow-up generation system
 *
 * Defines structured types for:
 * - Entity extraction (person type, topic, confidence)
 * - Follow-up suggestions (label, intent, action, args)
 * - Routing state machine (conversation flow)
 * - Complete follow-up response payload
 */

import { z } from "zod";

/**
 * Person type classification based on conversation patterns
 */
export const PersonType = z.enum([
  "recruiter",    // Hiring manager, recruiter, HR
  "engineer",     // Technical professional, developer
  "student",      // Learner, course participant
  "general",      // General visitor
  "unknown"       // Unable to determine
]);

export type PersonTypeEnum = z.infer<typeof PersonType>;

/**
 * Topic classification for conversation context
 */
export const Topic = z.enum([
  "resume",       // CV, experience, credentials
  "project",      // Portfolio, specific project discussion
  "skills",       // Technical capabilities, tech stack
  "contact",      // Hiring, scheduling, communication
  "other"         // General inquiry
]);

export type TopicEnum = z.infer<typeof Topic>;

/**
 * Intent classification for follow-up purpose
 */
export const Intent = z.enum([
  "clarify",      // Resolve ambiguity, get more details
  "qualify",      // Assess fit, interest level, requirements
  "cta",          // Call to action (download, view, contact)
  "route",        // Navigate conversation direction
  "explore"       // Deep dive into specific topic
]);

export type IntentEnum = z.infer<typeof Intent>;

/**
 * Action types mapped to repository tools and endpoints
 */
export const Action = z.enum([
  "download_resume",      // /api/tools/download-resume
  "open_project",         // /projects/{slug}
  "list_projects",        // /api/tools/list-projects
  "search_projects",      // /api/tools/search-projects-semantic
  "provide_nav",          // /api/tools/provide-navigation-links
  "collect_contact",      // /api/tools/collect-contact
  "none"                  // Pure conversational follow-up
]);

export type ActionEnum = z.infer<typeof Action>;

/**
 * Individual follow-up suggestion with action mapping
 */
export const FollowupSuggestion = z.object({
  label: z.string()
    .min(10, "Follow-up label must be at least 10 characters")
    .max(80, "Follow-up label must not exceed 80 characters"),
  intent: Intent,
  action: Action,
  args: z.object({
    slug: z.string().optional(),                           // Project slug for open_project
    url: z.string().url().optional(),                      // Full URL for navigation
    format: z.enum(["resume", "extended"]).optional(),     // Resume format
    category: z.string().optional(),                       // Project category filter
    query: z.string().optional()                           // Search query
  }).optional()
});

export type FollowupSuggestionType = z.infer<typeof FollowupSuggestion>;

/**
 * Extracted entities from conversation context
 */
export const Entities = z.object({
  person_type: PersonType,
  topic: Topic,
  project: z.string().nullable(),  // Project slug or null
  confidence: z.number()
    .min(0, "Confidence must be between 0 and 1")
    .max(1, "Confidence must be between 0 and 1")
});

export type EntitiesType = z.infer<typeof Entities>;

/**
 * Inline action for immediate execution (e.g., in assistant message)
 */
export const InlineAction = z.object({
  name: z.string(),
  args: z.record(z.string(), z.unknown()).optional()
});

export type InlineActionType = z.infer<typeof InlineAction>;

/**
 * Routing state for conversation flow tracking
 * Format: "{PersonType}>{Topic}>{Stage}"
 * Example: "Recruiter>Resume>Scheduling"
 */
export const Routing = z.object({
  next_state: z.string()
    .regex(/^[A-Za-z]+>[A-Za-z]+>[A-Za-z]+$/,
      "Routing state must follow format: PersonType>Topic>Stage"),
  reason: z.string()
    .max(100, "Routing reason must not exceed 100 characters")
});

export type RoutingType = z.infer<typeof Routing>;

/**
 * Complete follow-up response payload
 */
export const FollowupResponse = z.object({
  reply_markdown: z.string().optional(),  // Optional markdown for future use
  entities: Entities,
  suggested_followups: z.array(FollowupSuggestion)
    .min(2, "Must provide at least 2 follow-up suggestions")
    .max(4, "Must not exceed 4 follow-up suggestions"),
  actions_inline: z.array(InlineAction).optional(),
  routing: Routing
});

export type FollowupResponseType = z.infer<typeof FollowupResponse>;

/**
 * API request payload schema
 */
export const FollowupRequest = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string()
  })).min(1, "Must provide at least one message"),
  userId: z.string().optional(),  // Optional for personalization
  threadId: z.string().optional()  // Optional for conversation context
});

export type FollowupRequestType = z.infer<typeof FollowupRequest>;
