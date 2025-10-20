/**
 * Unit tests for Extract Summary API Route
 * Tests summary extraction with maxLength parameter validation
 */

import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { createMockRequest, getResponseJson, isSuccessResponse, isErrorResponse } from "../test-utils";

describe("POST /api/tools/extract-summary", () => {
  describe("Valid requests", () => {
    it("should return summary with default maxLength", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("summary");
        expect(json.data).toHaveProperty("wordCount");
        expect(typeof json.data.summary).toBe("string");
        expect(typeof json.data.wordCount).toBe("number");
        // Default maxLength is 200
        expect(json.data.wordCount).toBeLessThanOrEqual(200);
      }
    });

    it("should respect custom maxLength parameter", async () => {
      const maxLength = 100;
      const req = createMockRequest({ maxLength });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data.wordCount).toBeLessThanOrEqual(maxLength);
      }
    });

    it("should accept minimum maxLength (50)", async () => {
      const req = createMockRequest({ maxLength: 50 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data.wordCount).toBeLessThanOrEqual(50);
      }
    });

    it("should accept maximum maxLength (500)", async () => {
      const req = createMockRequest({ maxLength: 500 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data.wordCount).toBeLessThanOrEqual(500);
      }
    });

    it("should return non-empty summary", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        expect(json.data.summary.length).toBeGreaterThan(0);
        expect(json.data.wordCount).toBeGreaterThan(0);
      }
    });
  });

  describe("Invalid maxLength parameter", () => {
    it("should return 400 for maxLength below minimum (49)", async () => {
      const req = createMockRequest({ maxLength: 49 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for maxLength above maximum (501)", async () => {
      const req = createMockRequest({ maxLength: 501 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for negative maxLength", async () => {
      const req = createMockRequest({ maxLength: -10 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for zero maxLength", async () => {
      const req = createMockRequest({ maxLength: 0 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-number maxLength", async () => {
      const req = createMockRequest({ maxLength: "100" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request("http://localhost:3000/api/tools/extract-summary", {
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
      const req = createMockRequest([{ maxLength: 100 }] as any);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        maxLength: 150,
        extraField: "should be ignored",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle boundary maxLength values", async () => {
      // Test min boundary
      const reqMin = createMockRequest({ maxLength: 50 });
      const responseMin = await POST(reqMin);
      expect(responseMin.status).toBe(200);

      // Test max boundary
      const reqMax = createMockRequest({ maxLength: 500 });
      const responseMax = await POST(reqMax);
      expect(responseMax.status).toBe(200);
    });

    it("should handle decimal maxLength by truncating", async () => {
      const req = createMockRequest({ maxLength: 100.7 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Zod coerces numbers, so decimals should work
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Response structure", () => {
    it("should always return summary and wordCount fields", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("summary");
        expect(json.data).toHaveProperty("wordCount");
        expect(Object.keys(json.data)).toEqual(["summary", "wordCount"]);
      }
    });

    it("should return consistent summary format", async () => {
      const req = createMockRequest({ maxLength: 100 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        // Summary should be a string with words
        const words = json.data.summary.split(' ');
        expect(words.length).toBeGreaterThan(0);
        expect(json.data.wordCount).toBe(Math.min(words.length, 100));
      }
    });
  });
});
