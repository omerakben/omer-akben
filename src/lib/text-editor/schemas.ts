import { z } from "zod";

/**
 * Text editor operation types
 * Matches macOS Writing Tools functionality
 */
export const textEditorOperations = [
  "fix_grammar",
  "shorten",
  "lengthen",
  "friendly",
  "professional",
  "concise",
  "custom",
] as const;

export type TextEditorOperation = (typeof textEditorOperations)[number];

/**
 * Request schema for text editor API
 * @property text - Original text to edit (required, non-empty)
 * @property operation - Type of editing operation to perform
 * @property customPrompt - User's custom instruction (required only for 'custom' operation)
 */
export const textEditorRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Text cannot be empty")
    .max(5000, "Text too long (max 5000 characters)"),
  operation: z.enum(textEditorOperations),
  customPrompt: z
    .string()
    .min(1, "Custom prompt cannot be empty")
    .max(500, "Custom prompt too long (max 500 characters)")
    .optional(),
});

export type TextEditorRequest = z.infer<typeof textEditorRequestSchema>;

/**
 * Response schema for text editor API
 */
export const textEditorResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    original: z.string(),
    edited: z.string(),
    operation: z.enum(textEditorOperations),
  }),
});

export type TextEditorResponse = z.infer<typeof textEditorResponseSchema>;

/**
 * Error response schema
 */
export const textEditorErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export type TextEditorError = z.infer<typeof textEditorErrorSchema>;
