/**
 * Unit tests for Download Resume API Route
 * Tests format validation, file info retrieval, and error handling
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

describe("POST /api/tools/download-resume", () => {
  describe("Valid requests", () => {
    it("should return resume info for standard format", async () => {
      const req = createMockRequest({ format: "resume" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toMatchObject({
          url: "/assets/Omer_Akben_Resume.pdf",
          filename: "Omer_Akben_Resume.pdf",
          format: "pdf",
          size: expect.any(Number),
          googleDriveUrl: expect.stringContaining("drive.google.com"),
        });
      }
    });

    it("should reject extended format (no longer supported)", async () => {
      const req = createMockRequest({ format: "extended" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should fail - only "resume" format is accepted (literal type)
      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should include all required fields in response", async () => {
      const req = createMockRequest({ format: "resume" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("url");
        expect(json.data).toHaveProperty("filename");
        expect(json.data).toHaveProperty("format");
        expect(json.data).toHaveProperty("size");
        expect(json.data).toHaveProperty("googleDriveUrl");
      }
    });
  });

  describe("Invalid format parameter", () => {
    it("should default to 'resume' format when format is missing", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        const data = json.data as { filename: unknown };
        expect(data.filename).toBe("Omer_Akben_Resume.pdf");
      }
    });

    it("should return 400 for invalid format", async () => {
      const req = createMockRequest({ format: "invalid" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
      if (isErrorResponse(json)) {
        // Zod validation error message
        expect(json.error).toBeDefined();
      }
    });

    it("should return 400 for null format", async () => {
      const req = createMockRequest({ format: null });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for empty string format", async () => {
      const req = createMockRequest({ format: "" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request(
        "http://localhost:3000/api/tools/download-resume",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid json{",
        }
      );

      const response = await POST(req as NextRequest);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle wrong data type for format", async () => {
      const req = createMockRequest({ format: 123 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle array instead of object", async () => {
      const req = createMockRequest([{ format: "resume" }] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle format with extra whitespace", async () => {
      const req = createMockRequest({ format: " resume " });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should fail validation (schema doesn't trim)
      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle case-sensitive format", async () => {
      const req = createMockRequest({ format: "RESUME" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should fail - format is case-sensitive
      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        format: "resume",
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
