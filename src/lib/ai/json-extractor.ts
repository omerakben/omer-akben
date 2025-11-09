/**
 * Robust JSON Extraction Utility
 *
 * Handles various response formats from LLM models (especially Grok) that may wrap
 * JSON in markdown code blocks or include additional text before/after the JSON.
 *
 * Extraction fallback chain:
 * 1. Direct JSON.parse() - handles clean JSON responses
 * 2. Strip markdown code blocks - handles ```json\n{...}\n``` format
 * 3. Regex extraction - finds JSON objects/arrays in text
 *
 * Usage:
 * ```typescript
 * const json = extractJSON(llmResponse);
 * const validated = schema.parse(json);
 * ```
 */

/**
 * Extract JSON from LLM response with multiple fallback strategies
 *
 * @param text - Raw text response from LLM
 * @returns Parsed JSON object
 * @throws {JSONExtractionError} If JSON cannot be extracted
 *
 * @example
 * ```typescript
 * // Handles clean JSON
 * extractJSON('{"key": "value"}') // { key: "value" }
 *
 * // Handles markdown code blocks
 * extractJSON('```json\n{"key": "value"}\n```') // { key: "value" }
 *
 * // Handles mixed content
 * extractJSON('Here is the data:\n{"key": "value"}\nDone!') // { key: "value" }
 * ```
 */
export function extractJSON(text: string): unknown {
  // Strategy 1: Try direct JSON.parse() for clean responses
  try {
    return JSON.parse(text);
  } catch {
    // Continue to fallback strategies
  }

  // Strategy 2: Strip markdown code blocks
  try {
    const stripped = stripMarkdownCodeBlocks(text);
    return JSON.parse(stripped);
  } catch {
    // Continue to regex extraction
  }

  // Strategy 3: Regex extraction - find JSON object or array in text
  const extracted = regexExtractJSON(text);
  if (extracted) {
    try {
      return JSON.parse(extracted);
    } catch {
      throw new JSONExtractionError(
        "Found potential JSON structure but failed to parse",
        text
      );
    }
  }

  // All strategies failed
  throw new JSONExtractionError("Could not extract valid JSON from response", text);
}

/**
 * Strip markdown code blocks from text
 *
 * Handles formats:
 * - ```json\n{...}\n```
 * - ```\n{...}\n```
 * - Single or triple backticks
 *
 * @param text - Text potentially containing markdown code blocks
 * @returns Text with code blocks removed
 */
function stripMarkdownCodeBlocks(text: string): string {
  // Remove triple backtick code blocks with optional language identifier
  // Pattern: ```json\n...\n``` or ```\n...\n```
  let stripped = text.replace(/```(?:json|javascript|js)?\s*\n?([\s\S]*?)\n?```/g, "$1");

  // Remove single backticks (inline code)
  stripped = stripped.replace(/`([^`]+)`/g, "$1");

  return stripped.trim();
}

/**
 * Extract JSON object or array using brace counting
 *
 * Finds the first valid JSON structure (object or array) in the text.
 * Handles nested structures by counting opening/closing braces.
 *
 * @param text - Text potentially containing JSON
 * @returns Extracted JSON string or null if not found
 */
function regexExtractJSON(text: string): string | null {
  // Try to extract JSON object first
  const objectStart = text.indexOf("{");
  if (objectStart !== -1) {
    const extracted = extractBracedContent(text, objectStart, "{", "}");
    if (extracted) {
      return extracted;
    }
  }

  // Try to extract JSON array
  const arrayStart = text.indexOf("[");
  if (arrayStart !== -1) {
    const extracted = extractBracedContent(text, arrayStart, "[", "]");
    if (extracted) {
      return extracted;
    }
  }

  return null;
}

/**
 * Extract content between matching braces/brackets by counting nesting level
 *
 * @param text - Full text to search
 * @param startIndex - Index of opening brace/bracket
 * @param openChar - Opening character ('{' or '[')
 * @param closeChar - Closing character ('}' or ']')
 * @returns Extracted string including braces, or null if unmatched
 */
function extractBracedContent(
  text: string,
  startIndex: number,
  openChar: string,
  closeChar: string
): string | null {
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    // Handle escape sequences in strings
    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    // Track string boundaries (JSON strings use double quotes)
    if (char === '"') {
      inString = !inString;
      continue;
    }

    // Only count braces/brackets outside of strings
    if (!inString) {
      if (char === openChar) {
        depth++;
      } else if (char === closeChar) {
        depth--;

        // Found matching closing brace/bracket
        if (depth === 0) {
          return text.substring(startIndex, i + 1);
        }
      }
    }
  }

  // No matching closing brace/bracket found
  return null;
}

/**
 * Custom error for JSON extraction failures
 *
 * Includes the original text for debugging and error reporting
 */
export class JSONExtractionError extends Error {
  constructor(
    message: string,
    public readonly originalText: string
  ) {
    super(message);
    this.name = "JSONExtractionError";

    // Truncate long text for error messages
    const preview =
      originalText.length > 200
        ? `${originalText.substring(0, 200)}... (${originalText.length} chars total)`
        : originalText;

    this.message = `${message}. Original text: ${preview}`;
  }
}

/**
 * Type guard to check if an error is a JSONExtractionError
 */
export function isJSONExtractionError(error: unknown): error is JSONExtractionError {
  return error instanceof JSONExtractionError;
}
