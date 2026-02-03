/**
 * Unit tests for List Projects API Route
 * Tests filtering by category, featured status, limit, and validation
 */

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import {
  createMockRequest,
  getResponseJson,
  isErrorResponse,
  isSuccessResponse,
} from "../test-utils";
import { POST } from "./route";

describe("POST /api/tools/list-projects", () => {
  describe("Valid requests - no filters", () => {
    it("should return all projects when no filters provided", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("projects");
        expect(json.data).toHaveProperty("total");
        const data = json.data as { projects: unknown[]; total: unknown };
        expect(Array.isArray(data.projects)).toBe(true);
        expect(data.projects.length).toBeGreaterThan(0);
        expect(data.total).toBe(data.projects.length);
      }
    });

    it("should include required project fields", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        const firstProject = data.projects[0];
        expect(firstProject).toHaveProperty("id");
        expect(firstProject).toHaveProperty("slug");
        expect(firstProject).toHaveProperty("title");
        expect(firstProject).toHaveProperty("description");
        expect(firstProject).toHaveProperty("technologies");
        expect(firstProject).toHaveProperty("role");
        expect(firstProject).toHaveProperty("category");
        expect(firstProject).toHaveProperty("featured");
      }
    });
  });

  describe("Category filtering", () => {
    it("should filter by ai-ml category", async () => {
      const req = createMockRequest({ category: "ai-ml" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        data.projects.forEach((project: unknown) => {
          expect((project as { category: string }).category).toBe("ai-ml");
        });
      }
    });

    it("should filter by web category", async () => {
      const req = createMockRequest({ category: "web" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        data.projects.forEach((project: unknown) => {
          expect((project as { category: string }).category).toBe("web");
        });
      }
    });

    it("should return all projects when category is 'all'", async () => {
      const req = createMockRequest({ category: "all" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        // Should include projects from multiple categories
        const data = json.data as { projects: unknown[] };
        const categories = new Set(
          data.projects.map(
            (p: unknown) => (p as { category: string }).category
          )
        );
        expect(categories.size).toBeGreaterThan(0);
      }
    });

    it("should return 400 for invalid category", async () => {
      const req = createMockRequest({ category: "invalid" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Featured filtering", () => {
    it("should filter by featured=true", async () => {
      const req = createMockRequest({ featured: true });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        data.projects.forEach((project: unknown) => {
          expect((project as { featured: boolean }).featured).toBe(true);
        });
      }
    });

    it("should filter by featured=false", async () => {
      const req = createMockRequest({ featured: false });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        data.projects.forEach((project: unknown) => {
          expect((project as { featured: boolean }).featured).toBe(false);
        });
      }
    });

    it("should return 400 for non-boolean featured value", async () => {
      const req = createMockRequest({ featured: "yes" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Limit filtering", () => {
    it("should respect limit parameter", async () => {
      const limit = 3;
      const req = createMockRequest({ limit });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[]; total: unknown };
        expect(data.projects.length).toBeLessThanOrEqual(limit);
        // Total should reflect unfiltered count
        expect(data.total).toBeGreaterThanOrEqual(data.projects.length);
      }
    });

    it("should handle limit=1", async () => {
      const req = createMockRequest({ limit: 1 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        expect(data.projects.length).toBe(1);
      }
    });

    it("should handle maximum limit=50", async () => {
      const req = createMockRequest({ limit: 50 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should return 400 for limit below minimum (0)", async () => {
      const req = createMockRequest({ limit: 0 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for limit above maximum (51)", async () => {
      const req = createMockRequest({ limit: 51 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-number limit", async () => {
      const req = createMockRequest({ limit: "5" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Combined filters", () => {
    it("should apply category and featured filters together", async () => {
      const req = createMockRequest({
        category: "ai-ml",
        featured: true,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        data.projects.forEach((project: unknown) => {
          expect(
            (project as { category: string; featured: boolean }).category
          ).toBe("ai-ml");
          expect(
            (project as { category: string; featured: boolean }).featured
          ).toBe(true);
        });
      }
    });

    it("should apply all three filters together", async () => {
      const req = createMockRequest({
        category: "web",
        featured: true,
        limit: 2,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown[] };
        expect(data.projects.length).toBeLessThanOrEqual(2);
        data.projects.forEach((project: unknown) => {
          expect((project as { category: string }).category).toBe("web");
          expect((project as { featured: boolean }).featured).toBe(true);
        });
      }
    });

    it("should return empty array when filters match no projects", async () => {
      const req = createMockRequest({
        category: "mobile",
        featured: true,
        limit: 1,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        // May return empty array if no mobile featured projects exist
        const data = json.data as { projects: unknown; total: unknown };
        expect(Array.isArray(data.projects)).toBe(true);
        expect(data.total).toBe(0);
      }
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request("http://localhost:3001/api/tools/list-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json{",
      });

      const response = await POST(req as NextRequest);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle array instead of object", async () => {
      const req = createMockRequest([{ category: "ai-ml" }] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        category: "ai-ml",
        extraField: "should be ignored",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should return correct total count with limit applied", async () => {
      const req = createMockRequest({ limit: 2 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        // Total should reflect count before limit is applied
        const data = json.data as { total: unknown; projects: unknown[] };
        expect(data.total).toBeGreaterThanOrEqual(data.projects.length);
      }
    });

    it("should handle category filter with no matches", async () => {
      // Using "other" category which may have no projects
      const req = createMockRequest({ category: "other" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { projects: unknown };
        expect(Array.isArray(data.projects)).toBe(true);
      }
    });
  });
});
