/**
 * Unit tests for Dynamic Follow-Up Suggestions API Route
 * Tests schema validation, semantic memory integration, and error handling
 */

import { NextRequest } from "next/server";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { FollowupResponseType } from "@/lib/schemas/followup-schema";

// Mock dependencies
vi.mock("@/lib/log", () => ({
  logError: vi.fn(),
}));

vi.mock("@/lib/memory/redis-memory", () => ({
  RedisMemoryManager: vi.fn().mockImplementation(() => ({
    getSemantic: vi.fn().mockResolvedValue(null),
  })),
}));

vi.mock("@/lib/followups/dynamic-generator", () => ({
  generateDynamicFollowups: vi.fn(),
}));

// Import after mocking
import { POST } from "./route";
import { generateDynamicFollowups } from "@/lib/followups/dynamic-generator";

/**
 * Helper to create mock NextRequest
 */
function createMockRequest(data: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/suggest-followups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Helper to extract JSON from Response
 */
async function getResponseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return JSON.parse(text);
}

/**
 * Mock follow-up response factory
 */
function createMockFollowupResponse(): FollowupResponseType {
  return {
    entities: {
      person_type: "recruiter",
      topic: "resume",
      project: null,
      confidence: 0.85,
    },
    suggested_followups: [
      {
        label: "Download resume (PDF)",
        intent: "cta",
        action: "download_resume",
        args: { format: "resume" },
      },
      {
        label: "View featured projects",
        intent: "explore",
        action: "list_projects",
        args: { category: "featured" },
      },
    ],
    routing: {
      next_state: "Recruiter>Resume>Qualification",
      reason: "User interested in credentials",
    },
  };
}

describe("POST /api/suggest-followups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Valid requests", () => {
    it("should return dynamic follow-ups for valid message array", async () => {
      const mockResponse = createMockFollowupResponse();
      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const req = createMockRequest({
        messages: [
          { role: "user", content: "Can I see your resume?" },
          { role: "assistant", content: "Of course! I can provide my resume." },
        ],
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual(mockResponse);
      expect(generateDynamicFollowups).toHaveBeenCalledWith({
        messages: [
          { role: "user", content: "Can I see your resume?" },
          { role: "assistant", content: "Of course! I can provide my resume." },
        ],
        userId: undefined,
        threadId: undefined,
        semanticMemory: null,
      });
    });

    it("should include userId and threadId when provided", async () => {
      const mockResponse = createMockFollowupResponse();
      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const req = createMockRequest({
        messages: [{ role: "user", content: "Hello" }],
        userId: "user123",
        threadId: "thread456",
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual(mockResponse);
      expect(generateDynamicFollowups).toHaveBeenCalledWith({
        messages: [{ role: "user", content: "Hello" }],
        userId: "user123",
        threadId: "thread456",
        semanticMemory: null,
      });
    });

    it("should handle multiple follow-up suggestions (2-4 range)", async () => {
      const mockResponse: FollowupResponseType = {
        entities: {
          person_type: "engineer",
          topic: "project",
          project: "ai-agent",
          confidence: 0.92,
        },
        suggested_followups: [
          {
            label: "What tech stack did you use?",
            intent: "explore",
            action: "none",
          },
          {
            label: "View project details",
            intent: "cta",
            action: "open_project",
            args: { slug: "ai-agent" },
          },
          {
            label: "See similar projects",
            intent: "qualify",
            action: "list_projects",
            args: { category: "ai" },
          },
          {
            label: "Search for AI projects",
            intent: "route",
            action: "search_projects",
            args: { query: "artificial intelligence" },
          },
        ],
        routing: {
          next_state: "Engineer>Project>DeepDive",
          reason: "Technical exploration phase",
        },
      };

      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const req = createMockRequest({
        messages: [{ role: "user", content: "Tell me about your AI agent project" }],
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual(mockResponse);
    });

    it("should return all entity fields", async () => {
      const mockResponse = createMockFollowupResponse();
      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const req = createMockRequest({
        messages: [{ role: "user", content: "Test" }],
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as FollowupResponseType;

      expect(json.entities).toHaveProperty("person_type");
      expect(json.entities).toHaveProperty("topic");
      expect(json.entities).toHaveProperty("project");
      expect(json.entities).toHaveProperty("confidence");
    });

    it("should return routing state information", async () => {
      const mockResponse = createMockFollowupResponse();
      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const req = createMockRequest({
        messages: [{ role: "user", content: "Test" }],
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as FollowupResponseType;

      expect(json.routing).toHaveProperty("next_state");
      expect(json.routing).toHaveProperty("reason");
      expect(json.routing.next_state).toMatch(/^[A-Za-z]+>[A-Za-z]+>[A-Za-z]+$/);
    });
  });

  describe("Invalid JSON payload", () => {
    it("should return 400 for invalid JSON", async () => {
      const req = new NextRequest("http://localhost:3000/api/suggest-followups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json {",
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string };

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid JSON payload");
    });
  });

  describe("Schema validation errors", () => {
    it("should return 400 when messages array is missing", async () => {
      const req = createMockRequest({
        userId: "user123",
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string; details: unknown };

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid request format");
      expect(json.details).toBeDefined();
    });

    it("should return 400 for empty messages array", async () => {
      const req = createMockRequest({
        messages: [],
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string; details: unknown };

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid request format");
      expect(json.details).toBeDefined();
    });

    it("should return 400 for invalid message format", async () => {
      const req = createMockRequest({
        messages: [
          { role: "invalid_role", content: "Hello" },
        ],
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string; details: unknown };

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid request format");
    });

    it("should return 400 for missing message content", async () => {
      const req = createMockRequest({
        messages: [
          { role: "user" },
        ],
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string; details: unknown };

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid request format");
    });

    it("should return 400 for null messages", async () => {
      const req = createMockRequest({
        messages: null,
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string; details: unknown };

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid request format");
    });
  });

  describe("Generation failures", () => {
    it("should return 500 when generation returns null", async () => {
      vi.mocked(generateDynamicFollowups).mockResolvedValue(null);

      const req = createMockRequest({
        messages: [{ role: "user", content: "Test" }],
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string; fallback: boolean };

      expect(response.status).toBe(500);
      expect(json.error).toBe("Failed to generate follow-ups");
      expect(json.fallback).toBe(true);
    });

    it("should return 500 when generation throws error", async () => {
      vi.mocked(generateDynamicFollowups).mockRejectedValue(
        new Error("OpenAI API error")
      );

      const req = createMockRequest({
        messages: [{ role: "user", content: "Test" }],
      });

      const response = await POST(req);
      const json = (await getResponseJson(response)) as { error: string };

      expect(response.status).toBe(500);
      expect(json.error).toBe("Internal server error during follow-up generation");
    });
  });

  describe("Edge cases", () => {
    it("should handle system messages in conversation", async () => {
      const mockResponse = createMockFollowupResponse();
      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const req = createMockRequest({
        messages: [
          { role: "system", content: "You are a helpful assistant" },
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there!" },
        ],
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual(mockResponse);
    });

    it("should handle long message arrays", async () => {
      const mockResponse = createMockFollowupResponse();
      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const longMessages = Array.from({ length: 20 }, (_, i) => ({
        role: i % 2 === 0 ? "user" as const : "assistant" as const,
        content: `Message ${i}`,
      }));

      const req = createMockRequest({
        messages: longMessages,
      });

      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual(mockResponse);
      expect(generateDynamicFollowups).toHaveBeenCalledWith({
        messages: longMessages,
        userId: undefined,
        threadId: undefined,
        semanticMemory: null,
      });
    });

    it("should handle anonymous userId correctly", async () => {
      const mockResponse = createMockFollowupResponse();
      vi.mocked(generateDynamicFollowups).mockResolvedValue(mockResponse);

      const req = createMockRequest({
        messages: [{ role: "user", content: "Test" }],
        userId: "anonymous",
      });

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(generateDynamicFollowups).toHaveBeenCalledWith({
        messages: [{ role: "user", content: "Test" }],
        userId: "anonymous",
        threadId: undefined,
        semanticMemory: null,
      });
    });
  });
});
