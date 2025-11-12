/**
 * Shared regex patterns for chat message classification
 * Used across fast-responses (client-side preview) and coordinator (agent routing)
 */

/**
 * Pattern matching overview, greeting, and skills-related queries
 * Triggers fast intro response or skills agent routing
 *
 * Matches:
 * - Greetings: hi, hello, hey (word boundary required)
 * - Skills: skill, stack, tech, technology, expertise, strength, specialize
 * - About: tell me about yourself/you, who are you, who is omer
 * - Background: background, bio, profile, introduce, introduction, summary
 */
export const OVERVIEW_PATTERN =
  /skill|stack|tech|technology|expertise|strength|specialize|what do you do|tell me about (yourself|you)|who\s*(are|r)\s*(you|u)|who is omer|background|bio|profile|introduce|introduction|summary of experience|about you|hi\b|hello\b|hey\b/;
