/**
 * Unit tests for fact extraction module
 * Tests OpenAI-based extraction, validation, confidence thresholds, and integration
 */

import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExtractedFacts } from "./types";

const generateWithFallbackMock = vi.fn();
const mergeSemanticMemoryMock = vi.fn();
const getCachedCompletionMock = vi.fn();
const setCachedCompletionMock = vi.fn();
const recordCacheHitMock = vi.fn();
const recordCacheMissMock = vi.fn();

vi.mock("@/lib/ai/model-fallback", () => ({
  generateWithFallback: generateWithFallbackMock,
}));

vi.mock("@/lib/memory/semantic-memory", () => ({
  mergeSemanticMemory: mergeSemanticMemoryMock,
}));

vi.mock("@/lib/cache/openai-cache", () => ({
  getCachedCompletion: getCachedCompletionMock,
  setCachedCompletion: setCachedCompletionMock,
  recordCacheHit: recordCacheHitMock,
  recordCacheMiss: recordCacheMissMock,
}));

describe("fact-extractor", () => {
  beforeEach(() => {
    generateWithFallbackMock.mockReset();
    mergeSemanticMemoryMock.mockReset();
    getCachedCompletionMock.mockReset();
    setCachedCompletionMock.mockReset();
    recordCacheHitMock.mockReset();
    recordCacheMissMock.mockReset();

    // Default: cache miss (return null) so generateText is always called
    getCachedCompletionMock.mockResolvedValue(null);
    setCachedCompletionMock.mockResolvedValue(undefined);
    recordCacheHitMock.mockResolvedValue(undefined);
    recordCacheMissMock.mockResolvedValue(undefined);
  });

  describe("extractFacts", () => {
    it("should return null for conversations with less than 2 messages", async () => {
      const { extractFacts } = await import("./fact-extractor");

      const result = await extractFacts([]);
      expect(result).toBeNull();

      const singleMessage: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
      ];
      const result2 = await extractFacts(singleMessage);
      expect(result2).toBeNull();
    });

    it("should extract facts from valid conversation", async () => {
      const validFacts: ExtractedFacts = {
        role: "developer",
        company: "Acme Corp",
        newInterests: ["React", "TypeScript"],
        experienceLevel: "senior",
        newVisitedProjects: ["ai-agent"],
        newTechFocus: ["frontend", "ai-ml"],
        jobSearch: false,
        confidence: 0.85,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(validFacts),
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [
            {
              type: "text" as const,
              text: "I'm a senior developer at Acme Corp working with React and TypeScript",
            },
          ],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [
            {
              type: "text" as const,
              text: "Great! I can help you with your React projects.",
            },
          ],
        },
      ];

      const result = await extractFacts(messages);

      expect(result).toEqual(validFacts);
      expect(generateWithFallbackMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: "non-reasoning",
          temperature: 0.3,
        })
      );
    });

    it("should reject extractions with low confidence", async () => {
      const lowConfidenceFacts: ExtractedFacts = {
        role: "developer",
        confidence: 0.5, // Below 0.7 threshold
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(lowConfidenceFacts),
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi there!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toBeNull();
    });

    it("should handle invalid JSON response", async () => {
      generateWithFallbackMock.mockResolvedValueOnce({
        text: "Not valid JSON",
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toBeNull();
    });

    it("should handle OpenAI API errors", async () => {
      generateWithFallbackMock.mockRejectedValueOnce(new Error("OpenAI API error"));

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toBeNull();
    });

    it("should validate role field", async () => {
      const invalidRole = {
        role: "invalid-role", // Not a valid UserRole
        confidence: 0.8,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(invalidRole),
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toBeNull();
    });

    it("should validate experienceLevel field", async () => {
      const invalidLevel = {
        role: "developer",
        experienceLevel: "expert", // Not a valid ExperienceLevel
        confidence: 0.8,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(invalidLevel),
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toBeNull();
    });

    it("should validate array fields", async () => {
      const invalidArrays = {
        role: "developer",
        newInterests: "React,TypeScript", // Should be array, not string
        confidence: 0.8,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(invalidArrays),
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toBeNull();
    });

    it("should validate confidence range", async () => {
      const invalidConfidence = {
        role: "developer",
        confidence: 1.5, // Should be 0-1
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(invalidConfidence),
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toBeNull();
    });

    it("should accept facts without confidence field", async () => {
      const noConfidence: ExtractedFacts = {
        role: "developer",
        newInterests: ["React"],
        // No confidence field
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(noConfidence),
      });

      const { extractFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "I work with React" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Great!" }],
        },
      ];

      const result = await extractFacts(messages);
      expect(result).toEqual(noConfidence);
    });

    it("should limit context to last 10 messages", async () => {
      const validFacts: ExtractedFacts = {
        role: "developer",
        confidence: 0.8,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(validFacts),
      });

      const { extractFacts } = await import("./fact-extractor");

      // Create 15 messages
      const manyMessages: UIMessage[] = Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
        parts: [{ type: "text" as const, text: `Message ${i}` }],
      }));

      await extractFacts(manyMessages);

      // Check that prompt was called with context from last 10 messages
      const callArgs = generateWithFallbackMock.mock.calls[0][0];
      const prompt = callArgs.prompt as string;

      // Should include Message 5 (index 5 is the 6th message, so last 10 would be indices 5-14)
      expect(prompt).toContain("Message 5");
      // Should NOT include Message 4 (too old)
      expect(prompt).not.toContain("Message 4");
    });
  });

  describe("extractAndSaveFacts", () => {
    it("should skip anonymous users", async () => {
      const { extractAndSaveFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      await expect(
        extractAndSaveFacts("anonymous", messages)
      ).resolves.not.toThrow();
      expect(generateWithFallbackMock).not.toHaveBeenCalled();
      expect(mergeSemanticMemoryMock).not.toHaveBeenCalled();
    });

    it("should skip if extraction returns null", async () => {
      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify({ confidence: 0.5 }), // Low confidence
      });

      const { extractAndSaveFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      await extractAndSaveFacts("user-123", messages);

      expect(generateWithFallbackMock).toHaveBeenCalled();
      expect(mergeSemanticMemoryMock).not.toHaveBeenCalled();
    });

    it("should merge facts into semantic memory", async () => {
      const validFacts: ExtractedFacts = {
        role: "developer",
        newInterests: ["React", "TypeScript"],
        confidence: 0.85,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(validFacts),
      });

      mergeSemanticMemoryMock.mockResolvedValueOnce(undefined);

      const { extractAndSaveFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [
            { type: "text" as const, text: "I work with React and TypeScript" },
          ],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Great!" }],
        },
      ];

      await extractAndSaveFacts("user-123", messages);

      expect(generateWithFallbackMock).toHaveBeenCalled();
      expect(mergeSemanticMemoryMock).toHaveBeenCalledWith(
        "user-123",
        validFacts
      );
    });

    it("should handle merge errors gracefully", async () => {
      const validFacts: ExtractedFacts = {
        role: "developer",
        confidence: 0.85,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(validFacts),
      });

      mergeSemanticMemoryMock.mockRejectedValueOnce(new Error("Redis error"));

      const { extractAndSaveFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text" as const, text: "Hi!" }],
        },
      ];

      // Should not throw even if merge fails
      await expect(
        extractAndSaveFacts("user-123", messages)
      ).resolves.not.toThrow();
    });

    it("should extract from conversations with UIMessage content variations", async () => {
      const validFacts: ExtractedFacts = {
        role: "student",
        confidence: 0.8,
      };

      generateWithFallbackMock.mockResolvedValueOnce({
        text: JSON.stringify(validFacts),
      });

      const { extractAndSaveFacts } = await import("./fact-extractor");

      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text" as const, text: "I'm learning programming" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [
            {
              type: "text" as const,
              text: "That's great! What are you learning?",
            },
          ],
        },
      ];

      await extractAndSaveFacts("user-123", messages);

      expect(generateWithFallbackMock).toHaveBeenCalled();
    });
  });
});
