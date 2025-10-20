/**
 * Unit tests for Navigate Page API Route
 * Tests domain validation, URL validation, and navigation parameters
 */

import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { createMockRequest, getResponseJson, isSuccessResponse, isErrorResponse } from "../test-utils";

describe("POST /api/tools/navigate-page", () => {
  describe("Valid requests", () => {
    it("should navigate to omerakben.com domain", async () => {
      const req = createMockRequest({ url: "https://omerakben.com" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toMatchObject({
          url: "https://omerakben.com",
          message: expect.stringContaining("Navigating"),
        });
      }
    });

    it("should navigate to omerakben.com subdomain", async () => {
      const req = createMockRequest({ url: "https://blog.omerakben.com" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should navigate to localhost (for development)", async () => {
      const req = createMockRequest({ url: "http://localhost:3000" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should default waitUntil to 'load'", async () => {
      const req = createMockRequest({ url: "https://omerakben.com" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { waitUntil: unknown };
        expect(data.waitUntil).toBe("load");
      }
    });

    it("should accept waitUntil='domcontentloaded'", async () => {
      const req = createMockRequest({
        url: "https://omerakben.com",
        waitUntil: "domcontentloaded",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        const data = json.data as { waitUntil: unknown };
        expect(data.waitUntil).toBe("domcontentloaded");
      }
    });

    it("should accept waitUntil='networkidle'", async () => {
      const req = createMockRequest({
        url: "https://omerakben.com",
        waitUntil: "networkidle",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Domain validation", () => {
    it("should reject external domain (google.com)", async () => {
      const req = createMockRequest({ url: "https://google.com" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(403);
      expect(isErrorResponse(json)).toBe(true);
      if (isErrorResponse(json)) {
        expect(json.error).toContain("restricted");
        expect(json.error).toContain("omerakben.com");
      }
    });

    it("should reject external domain (example.com)", async () => {
      const req = createMockRequest({ url: "https://example.com" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(403);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should reject malicious subdomain attempt", async () => {
      const req = createMockRequest({ url: "https://omerakben.com.evil.com" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(403);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Invalid URL parameter", () => {
    it("should return 400 for missing url", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for null url", async () => {
      const req = createMockRequest({ url: null });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-URL string", async () => {
      const req = createMockRequest({ url: "not-a-url" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for invalid waitUntil value", async () => {
      const req = createMockRequest({
        url: "https://omerakben.com",
        waitUntil: "invalid",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request("http://localhost:3000/api/tools/navigate-page", {
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
      const req = createMockRequest([{ url: "https://omerakben.com" }] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle URL with path and query params", async () => {
      const req = createMockRequest({
        url: "https://omerakben.com/projects?category=ai-ml&featured=true",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle URL with fragment", async () => {
      const req = createMockRequest({
        url: "https://omerakben.com/about#skills",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        url: "https://omerakben.com",
        extraField: "should be ignored",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });
});
