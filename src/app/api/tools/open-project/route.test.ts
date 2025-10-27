/**
 * Unit tests for Open Project API Route
 * Tests project retrieval by slug, not found handling, and validation
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

describe("POST /api/tools/open-project", () => {
  describe("Valid requests", () => {
    it("should return project for valid slug", async () => {
      // Using a known project slug from projects.ts
      const req = createMockRequest({ slug: "north-glass" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("project");
        const data = json.data as { project: { slug: unknown } };
        expect(data.project).toHaveProperty("slug");
        expect(data.project.slug).toBe("north-glass");
      }
    });

    it("should include all required project fields", async () => {
      const req = createMockRequest({ slug: "elon-ai-agent" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        const data = json.data as { project: unknown };
        const project = data.project as Record<string, unknown>;
        expect(project).toHaveProperty("id");
        expect(project).toHaveProperty("slug");
        expect(project).toHaveProperty("title");
        expect(project).toHaveProperty("description");
        expect(project).toHaveProperty("technologies");
        expect(project).toHaveProperty("role");
        expect(project).toHaveProperty("category");
        expect(project).toHaveProperty("featured");
      }
    });

    it("should handle slugs with hyphens", async () => {
      const req = createMockRequest({ slug: "north-glass" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle multi-word slugs", async () => {
      const req = createMockRequest({ slug: "elon-ai-agent" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Project not found", () => {
    it("should return 404 for non-existent slug", async () => {
      const req = createMockRequest({ slug: "non-existent-project" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(404);
      expect(isErrorResponse(json)).toBe(true);
      if (isErrorResponse(json)) {
        expect(json.error).toContain("not found");
        expect(json.error).toContain("non-existent-project");
      }
    });

    it("should return 404 with descriptive error message", async () => {
      const slug = "invalid-slug-123";
      const req = createMockRequest({ slug });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(404);
      if (isErrorResponse(json)) {
        expect(json.error).toBe(`Project with slug "${slug}" not found`);
      }
    });
  });

  describe("Invalid slug parameter", () => {
    it("should return 400 for missing slug", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for null slug", async () => {
      const req = createMockRequest({ slug: null });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-string slug", async () => {
      const req = createMockRequest({ slug: 123 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should accept empty string slug (schema allows it)", async () => {
      const req = createMockRequest({ slug: "" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Schema has no .min(1), so empty string is valid but will return 404
      expect(response.status).toBe(404);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request("http://localhost:3000/api/tools/open-project", {
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
      const req = createMockRequest([{ slug: "test" }] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle slug with special characters", async () => {
      const req = createMockRequest({ slug: "project-name_123" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Will return 404 if project doesn't exist, but request is valid
      expect([200, 404]).toContain(response.status);
      expect(isSuccessResponse(json) || isErrorResponse(json)).toBe(true);
    });

    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        slug: "north-glass",
        extraField: "should be ignored",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should be case-sensitive for slug matching", async () => {
      const req = createMockRequest({ slug: "NORTH-GLASS" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Slugs are case-sensitive, so uppercase version should not match
      expect(response.status).toBe(404);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle slug with leading/trailing whitespace", async () => {
      const req = createMockRequest({ slug: " north-glass " });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Schema doesn't trim, so whitespace will cause mismatch
      expect(response.status).toBe(404);
      expect(isErrorResponse(json)).toBe(true);
    });
  });
});
