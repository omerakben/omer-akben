/**
 * Unit tests for Profile Performance API Route
 * Tests performance profiling (development-only feature)
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { createMockRequest, getResponseJson, isSuccessResponse, isErrorResponse } from "../test-utils";

describe("POST /api/tools/profile-performance", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Set to development by default for most tests
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  describe("Valid requests (development mode)", () => {
    it("should return performance metrics with default parameters", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("metrics");
        expect(json.data).toHaveProperty("suggestions");
        expect(json.data.metrics).toHaveProperty("lcp");
        expect(json.data.metrics).toHaveProperty("fid");
        expect(json.data.metrics).toHaveProperty("cls");
        expect(json.data.metrics).toHaveProperty("ttfb");
        expect(Array.isArray(json.data.suggestions)).toBe(true);
      }
    });

    it("should not include traceUrl when includeScreenshots is false", async () => {
      const req = createMockRequest({ includeScreenshots: false });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data.traceUrl).toBeUndefined();
      }
    });

    it("should include traceUrl when includeScreenshots is true", async () => {
      const req = createMockRequest({ includeScreenshots: true });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data.traceUrl).toBeDefined();
        expect(typeof json.data.traceUrl).toBe("string");
      }
    });

    it("should accept custom duration parameter", async () => {
      const req = createMockRequest({ duration: 10000 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should accept minimum duration (1000ms)", async () => {
      const req = createMockRequest({ duration: 1000 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should accept maximum duration (30000ms)", async () => {
      const req = createMockRequest({ duration: 30000 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should return realistic performance metrics", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const { metrics } = json.data;
        // Verify metrics are numbers
        expect(typeof metrics.lcp).toBe("number");
        expect(typeof metrics.fid).toBe("number");
        expect(typeof metrics.cls).toBe("number");
        expect(typeof metrics.ttfb).toBe("number");

        // Verify metrics are in realistic ranges
        expect(metrics.lcp).toBeGreaterThan(0);
        expect(metrics.fid).toBeGreaterThan(0);
        expect(metrics.cls).toBeGreaterThanOrEqual(0);
        expect(metrics.ttfb).toBeGreaterThan(0);
      }
    });

    it("should return performance suggestions", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        expect(Array.isArray(json.data.suggestions)).toBe(true);
        expect(json.data.suggestions.length).toBeGreaterThan(0);
        json.data.suggestions.forEach((suggestion: any) => {
          expect(typeof suggestion).toBe("string");
        });
      }
    });
  });

  describe("Production environment restriction", () => {
    it("should return 403 in production mode", async () => {
      process.env.NODE_ENV = "production";

      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(403);
      expect(isErrorResponse(json)).toBe(true);

      if (isErrorResponse(json)) {
        expect(json.error).toContain("development mode");
      }
    });

    it("should return 403 regardless of valid parameters in production", async () => {
      process.env.NODE_ENV = "production";

      const req = createMockRequest({
        duration: 5000,
        includeScreenshots: true,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(403);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Invalid parameters", () => {
    it("should return 400 for duration below minimum (999ms)", async () => {
      const req = createMockRequest({ duration: 999 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for duration above maximum (30001ms)", async () => {
      const req = createMockRequest({ duration: 30001 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for negative duration", async () => {
      const req = createMockRequest({ duration: -1000 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-number duration", async () => {
      const req = createMockRequest({ duration: "5000" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-boolean includeScreenshots", async () => {
      const req = createMockRequest({ includeScreenshots: "true" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request("http://localhost:3000/api/tools/profile-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json{",
      });

      const response = await POST(req as any);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle array instead of object", async () => {
      const req = createMockRequest([{ duration: 5000 }] as any);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        duration: 5000,
        extraField: "should be ignored",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle both parameters together", async () => {
      const req = createMockRequest({
        duration: 10000,
        includeScreenshots: true,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data.traceUrl).toBeDefined();
      }
    });

    it("should handle boundary duration values", async () => {
      // Test min boundary
      const reqMin = createMockRequest({ duration: 1000 });
      const responseMin = await POST(reqMin);
      expect(responseMin.status).toBe(200);

      // Test max boundary
      const reqMax = createMockRequest({ duration: 30000 });
      const responseMax = await POST(reqMax);
      expect(responseMax.status).toBe(200);
    });
  });
});
