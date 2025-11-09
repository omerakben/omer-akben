/**
 * Tests for JSON extraction utility
 *
 * Covers all extraction strategies and edge cases for Grok response handling
 */

import { describe, it, expect } from "vitest";
import { extractJSON, JSONExtractionError, isJSONExtractionError } from "./json-extractor";

describe("extractJSON", () => {
  describe("Strategy 1: Direct JSON parsing", () => {
    it("should parse clean JSON object", () => {
      const input = '{"key": "value", "number": 42}';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value", number: 42 });
    });

    it("should parse clean JSON array", () => {
      const input = '[1, 2, 3, "four"]';
      const result = extractJSON(input);

      expect(result).toEqual([1, 2, 3, "four"]);
    });

    it("should parse nested JSON structures", () => {
      const input = '{"outer": {"inner": {"deep": "value"}}}';
      const result = extractJSON(input);

      expect(result).toEqual({
        outer: { inner: { deep: "value" } },
      });
    });

    it("should handle JSON with whitespace", () => {
      const input = `
        {
          "key": "value",
          "array": [1, 2, 3]
        }
      `;
      const result = extractJSON(input);

      expect(result).toEqual({
        key: "value",
        array: [1, 2, 3],
      });
    });
  });

  describe("Strategy 2: Markdown code block stripping", () => {
    it("should extract JSON from triple backtick code block with json language", () => {
      const input = '```json\n{"key": "value"}\n```';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });

    it("should extract JSON from triple backtick code block without language", () => {
      const input = '```\n{"key": "value"}\n```';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });

    it("should extract JSON from code block with javascript language", () => {
      const input = '```javascript\n{"key": "value"}\n```';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });

    it("should extract JSON from code block with js language", () => {
      const input = '```js\n{"key": "value"}\n```';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });

    it("should handle code blocks with extra whitespace", () => {
      const input = '```json\n\n  {"key": "value"}  \n\n```';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });

    it("should handle code blocks with text before/after", () => {
      const input = 'Here is the JSON:\n```json\n{"key": "value"}\n```\nThat was the JSON.';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });

    it("should extract array from code block", () => {
      const input = '```json\n[1, 2, 3]\n```';
      const result = extractJSON(input);

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Strategy 3: Regex extraction", () => {
    it("should extract JSON object from mixed content", () => {
      const input = 'The data you requested is: {"key": "value"} as shown above.';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });

    it("should extract JSON array from mixed content", () => {
      const input = 'Here are the items: [1, 2, 3] from the database.';
      const result = extractJSON(input);

      expect(result).toEqual([1, 2, 3]);
    });

    it("should extract first JSON object when multiple present", () => {
      const input = 'First: {"a": 1} Second: {"b": 2}';
      const result = extractJSON(input);

      // Should extract first occurrence
      expect(result).toEqual({ a: 1 });
    });

    it("should extract nested JSON from text", () => {
      const input = 'Response: {"outer": {"inner": "value"}} Done.';
      const result = extractJSON(input);

      expect(result).toEqual({ outer: { inner: "value" } });
    });
  });

  describe("Error handling", () => {
    it("should throw JSONExtractionError for invalid JSON", () => {
      const input = "This is not JSON at all";

      expect(() => extractJSON(input)).toThrow(JSONExtractionError);
    });

    it("should throw JSONExtractionError for malformed JSON object", () => {
      const input = '{"key": "value"'; // Missing closing brace

      expect(() => extractJSON(input)).toThrow(JSONExtractionError);
    });

    it("should throw JSONExtractionError for empty string", () => {
      const input = "";

      expect(() => extractJSON(input)).toThrow(JSONExtractionError);
    });

    it("should include original text in error message", () => {
      const input = "Invalid content";

      try {
        extractJSON(input);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).toBeInstanceOf(JSONExtractionError);
        if (error instanceof JSONExtractionError) {
          expect(error.message).toContain("Invalid content");
          expect(error.originalText).toBe(input);
        }
      }
    });

    it("should truncate long text in error message", () => {
      const input = "a".repeat(500);

      try {
        extractJSON(input);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).toBeInstanceOf(JSONExtractionError);
        if (error instanceof JSONExtractionError) {
          // Message should be truncated
          expect(error.message.length).toBeLessThan(input.length);
          expect(error.message).toContain("... (500 chars total)");
          // But originalText should preserve full content
          expect(error.originalText).toBe(input);
        }
      }
    });
  });

  describe("Edge cases", () => {
    it("should handle JSON with escaped quotes", () => {
      const input = '{"message": "He said \\"hello\\""}';
      const result = extractJSON(input);

      expect(result).toEqual({ message: 'He said "hello"' });
    });

    it("should handle JSON with newlines in strings", () => {
      const input = '{"text": "Line 1\\nLine 2"}';
      const result = extractJSON(input);

      expect(result).toEqual({ text: "Line 1\nLine 2" });
    });

    it("should handle empty JSON object", () => {
      const input = "{}";
      const result = extractJSON(input);

      expect(result).toEqual({});
    });

    it("should handle empty JSON array", () => {
      const input = "[]";
      const result = extractJSON(input);

      expect(result).toEqual([]);
    });

    it("should handle JSON with null values", () => {
      const input = '{"key": null}';
      const result = extractJSON(input);

      expect(result).toEqual({ key: null });
    });

    it("should handle JSON with boolean values", () => {
      const input = '{"isTrue": true, "isFalse": false}';
      const result = extractJSON(input);

      expect(result).toEqual({ isTrue: true, isFalse: false });
    });

    it("should handle complex nested structures", () => {
      const input = '{"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}';
      const result = extractJSON(input);

      expect(result).toEqual({
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
      });
    });

    it("should handle code block without newlines after backticks", () => {
      const input = '```json{"key": "value"}```';
      const result = extractJSON(input);

      expect(result).toEqual({ key: "value" });
    });
  });

  describe("Real-world Grok response patterns", () => {
    it("should handle Grok response with explanation before JSON", () => {
      const input = `Here is the requested data in JSON format:

\`\`\`json
{
  "suggestions": ["Contact Omer", "View Projects", "Download Resume"]
}
\`\`\`

I hope this helps!`;

      const result = extractJSON(input);

      expect(result).toEqual({
        suggestions: ["Contact Omer", "View Projects", "Download Resume"],
      });
    });

    it("should handle Grok response with inline code block", () => {
      const input = "The response is `{\"status\": \"success\"}` as you can see.";
      const result = extractJSON(input);

      expect(result).toEqual({ status: "success" });
    });

    it("should handle Grok response with mixed markdown", () => {
      const input = `# Response

Here is the data:

\`\`\`json
{"followups": ["Question 1", "Question 2"]}
\`\`\`

## Summary

The data has been formatted.`;

      const result = extractJSON(input);

      expect(result).toEqual({
        followups: ["Question 1", "Question 2"],
      });
    });
  });
});

describe("isJSONExtractionError", () => {
  it("should return true for JSONExtractionError instances", () => {
    const error = new JSONExtractionError("test", "original");
    expect(isJSONExtractionError(error)).toBe(true);
  });

  it("should return false for regular Error instances", () => {
    const error = new Error("test");
    expect(isJSONExtractionError(error)).toBe(false);
  });

  it("should return false for non-error values", () => {
    expect(isJSONExtractionError("string")).toBe(false);
    expect(isJSONExtractionError(null)).toBe(false);
    expect(isJSONExtractionError(undefined)).toBe(false);
    expect(isJSONExtractionError({})).toBe(false);
  });
});
