/**
 * Unit tests for Download Certificate API Route
 * Tests type validation, certificate info retrieval, and error handling
 */

import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { createMockRequest, getResponseJson, isSuccessResponse, isErrorResponse } from "../test-utils";

describe("POST /api/tools/download-certificate", () => {
  describe("Valid requests", () => {
    it("should return AWS certificate info for 'aws' type", async () => {
      const req = createMockRequest({ type: "aws" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toMatchObject({
          url: "/assets/Omer-Akben-AWS-Certificate.pdf",
          filename: "Omer-Akben-AWS-Certificate.pdf",
          format: "pdf",
          size: expect.any(Number),
          googleDriveUrl: expect.stringContaining("drive.google.com"),
          certificateName: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          year: "2024",
        });
      }
    });

    it("should return NSS certificate info for 'nss' type", async () => {
      const req = createMockRequest({ type: "nss" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toMatchObject({
          url: "/assets/Omer-Akben-NSS-Certificate.pdf",
          filename: "Omer-Akben-NSS-Certificate.pdf",
          format: "pdf",
          size: expect.any(Number),
          certificateName: "Nashville Software School Graduate",
          issuer: "Nashville Software School",
          year: "2025",
        });
        // NSS certificate doesn't have Google Drive URL
        const data = json.data as { googleDriveUrl?: unknown };
        expect(data.googleDriveUrl).toBeUndefined();
      }
    });

    it("should include all required fields in response", async () => {
      const req = createMockRequest({ type: "aws" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("url");
        expect(json.data).toHaveProperty("filename");
        expect(json.data).toHaveProperty("format");
        expect(json.data).toHaveProperty("size");
        expect(json.data).toHaveProperty("certificateName");
        expect(json.data).toHaveProperty("issuer");
        expect(json.data).toHaveProperty("year");
      }
    });
  });

  describe("Invalid type parameter", () => {
    it("should return 400 for missing type", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
      if (isErrorResponse(json)) {
        expect(json.error).toBeDefined();
      }
    });

    it("should return 400 for invalid type", async () => {
      const req = createMockRequest({ type: "invalid" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
      if (isErrorResponse(json)) {
        expect(json.error).toBeDefined();
      }
    });

    it("should return 400 for null type", async () => {
      const req = createMockRequest({ type: null });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for empty string type", async () => {
      const req = createMockRequest({ type: "" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request("http://localhost:3000/api/tools/download-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json{",
      });

      const response = await POST(req as NextRequest);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle wrong data type for type", async () => {
      const req = createMockRequest({ type: 123 });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle array instead of object", async () => {
      const req = createMockRequest([{ type: "aws" }] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle type with extra whitespace", async () => {
      const req = createMockRequest({ type: " aws " });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should fail validation (schema doesn't trim)
      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle case-sensitive type", async () => {
      const req = createMockRequest({ type: "AWS" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should fail - type is case-sensitive
      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        type: "aws",
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
