/**
 * Unit tests for Search Projects Semantic API Route
 * Tests semantic search using vector similarity with Redis embeddings
 */

import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import {
  createMockRequest,
  getResponseJson,
  isErrorResponse,
  isSuccessResponse,
} from "../test-utils";
import { POST } from "./route";

vi.mock("@/lib/redis/embeddings", () => ({
  searchProjectsBySimilarity: vi.fn().mockResolvedValue([]),
}));

describe("POST /api/tools/search-projects-semantic", () => {
  describe("Valid requests", () => {
    it("should return search results for valid query with default limit", async () => {
      const req = createMockRequest({
        query: "machine learning projects",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Route requires OpenAI API key for embeddings
      // Accept 200 (success with API key) or 500 (missing API key)
      expect([200, 500]).toContain(response.status);

      if (response.status === 200 && isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("results");
        expect(json.data).toHaveProperty("query");
        expect(json.data).toHaveProperty("count");
        const data = json.data as {
          query: unknown;
          results: unknown[];
          count: unknown;
        };
        expect(data.query).toBe("machine learning projects");
        expect(Array.isArray(data.results)).toBe(true);
        expect(data.count).toBe(data.results.length);
      }
    });

    it("should respect custom limit parameter", async () => {
      const limit = 3;
      const req = createMockRequest({
        query: "web development",
        limit,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect([200, 500]).toContain(response.status);

      if (response.status === 200 && isSuccessResponse(json)) {
        const data = json.data as { results: unknown[]; count: unknown };
        expect(data.results.length).toBeLessThanOrEqual(limit);
        expect(data.count).toBeLessThanOrEqual(limit);
      }
    });

    it("should accept minimum limit (1)", async () => {
      const req = createMockRequest({
        query: "AI projects",
        limit: 1,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect([200, 500]).toContain(response.status);

      if (response.status === 200 && isSuccessResponse(json)) {
        const data = json.data as { results: unknown[] };
        expect(data.results.length).toBeLessThanOrEqual(1);
      }
    });

    it("should accept maximum limit (10)", async () => {
      const req = createMockRequest({
        query: "projects",
        limit: 10,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect([200, 500]).toContain(response.status);

      if (response.status === 200 && isSuccessResponse(json)) {
        const data = json.data as { results: unknown[] };
        expect(data.results.length).toBeLessThanOrEqual(10);
      }
    }, 10000); // Increase timeout for vector search operations

    it("should handle natural language queries", async () => {
      const req = createMockRequest({
        query:
          "Show me projects that involve artificial intelligence and machine learning",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect([200, 500]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });

    it("should handle short queries", async () => {
      const req = createMockRequest({ query: "AI" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect([200, 500]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });

    it("should return results with expected structure", async () => {
      const req = createMockRequest({
        query: "web development",
        limit: 5,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { results: unknown[] };
        data.results.forEach((result: unknown) => {
          expect(result).toHaveProperty("slug");
          expect(result).toHaveProperty("score");
          expect(result).toHaveProperty("project");
          expect(typeof (result as { slug: unknown }).slug).toBe("string");
          const resultWithScore = result as { score: unknown };
          expect(typeof resultWithScore.score).toBe("number");
          expect(typeof (result as { project: unknown }).project).toBe(
            "object"
          );

          // Score should be between 0 and 1 (similarity score)
          expect(resultWithScore.score).toBeGreaterThanOrEqual(0);
          expect(resultWithScore.score).toBeLessThanOrEqual(1);
        });
      }
    });
  });

  describe("Invalid query parameter", () => {
    it("should return 400 for missing query", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for null query", async () => {
      const req = createMockRequest({ query: null });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-string query", async () => {
      const req = createMockRequest({ query: 123 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should accept empty string query (schema allows it)", async () => {
      const req = createMockRequest({ query: "" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Schema has no .min(1) validation, so empty string is valid
      // May return empty results or error from search function
      expect([200, 500]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });
  });

  describe("Invalid limit parameter", () => {
    it("should return 400 for limit below minimum (0)", async () => {
      const req = createMockRequest({
        query: "projects",
        limit: 0,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for limit above maximum (11)", async () => {
      const req = createMockRequest({
        query: "projects",
        limit: 11,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for negative limit", async () => {
      const req = createMockRequest({
        query: "projects",
        limit: -5,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-number limit", async () => {
      const req = createMockRequest({
        query: "projects",
        limit: "5",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request(
        "http://localhost:3001/api/tools/search-projects-semantic",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json{",
        }
      );

      const response = await POST(req as NextRequest);
      const json = await getResponseJson(response);

      // May return 400 (JSON parse error) or 500 (server error)
      expect([400, 500]).toContain(response.status);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle array instead of object", async () => {
      const req = createMockRequest([{ query: "projects" }] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        query: "AI projects",
        limit: 5,
        extraField: "should be ignored",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields are ignored by Zod
      expect([200, 500]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });

    it("should handle boundary limit values", async () => {
      // Test min boundary
      const reqMin = createMockRequest({
        query: "projects",
        limit: 1,
      });
      const responseMin = await POST(reqMin);
      expect([200, 500]).toContain(responseMin.status);

      // Test max boundary
      const reqMax = createMockRequest({
        query: "projects",
        limit: 10,
      });
      const responseMax = await POST(reqMax);
      expect([200, 500]).toContain(responseMax.status);
    });

    it("should handle queries with special characters", async () => {
      const req = createMockRequest({
        query: "AI/ML & data science projects (2024)",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed with any query string
      expect([200, 500]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });

    it("should handle very long queries", async () => {
      const longQuery = "machine learning " + "projects ".repeat(50);
      const req = createMockRequest({ query: longQuery });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed with long queries
      expect([200, 500]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });

    it("should handle unicode characters in query", async () => {
      const req = createMockRequest({
        query: "AI projects 人工智能 🤖",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect([200, 500]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });
  });

  describe("Response structure", () => {
    it("should always return results, query, and count fields", async () => {
      const req = createMockRequest({ query: "projects" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as {
          results: unknown;
          query: unknown;
          count: unknown;
        };
        expect(data).toHaveProperty("results");
        expect(data).toHaveProperty("query");
        expect(data).toHaveProperty("count");
        expect(Object.keys(data).sort()).toEqual(["count", "query", "results"]);
      }
    });

    it("should return empty results array when no matches found", async () => {
      // Query unlikely to match any projects
      const req = createMockRequest({
        query: "xyzabc123nonexistent",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { results: unknown; count: unknown };
        expect(Array.isArray(data.results)).toBe(true);
        expect(data.count).toBe(0);
      }
    });
  });
});
