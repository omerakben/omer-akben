/**
 * Unit tests for Provide Navigation Links API Route
 * Tests navigation links validation and structure
 */

import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { createMockRequest, getResponseJson, isSuccessResponse, isErrorResponse } from "../test-utils";

describe("POST /api/tools/provide-navigation-links", () => {
  describe("Valid requests", () => {
    it("should accept single navigation link", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Projects",
            href: "/projects",
            type: "internal",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { links: unknown[] };
        expect(data.links).toHaveLength(1);
        expect(data.links[0]).toMatchObject({
          label: "Projects",
          href: "/projects",
          type: "internal",
        });
      }
    });

    it("should accept multiple navigation links", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Home",
            href: "/",
            type: "internal",
          },
          {
            label: "GitHub",
            href: "https://github.com/omerakben",
            type: "external",
            icon: "github",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        const data = json.data as { links: unknown[] };
        expect(data.links).toHaveLength(2);
      }
    });

    it("should accept link with valid icon", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Email",
            href: "mailto:test@example.com",
            type: "external",
            icon: "mail",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should accept link without icon", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "About",
            href: "/about",
            type: "internal",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should accept all valid icon types", async () => {
      const validIcons = ["briefcase", "github", "external-link", "arrow-right", "file-text", "zap", "mail"];
      const links = validIcons.map(icon => ({
        label: `Link with ${icon}`,
        href: "/test",
        type: "internal" as const,
        icon,
      }));

      const req = createMockRequest({ links });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should accept both internal and external link types", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Internal",
            href: "/page",
            type: "internal",
          },
          {
            label: "External",
            href: "https://example.com",
            type: "external",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Invalid links parameter", () => {
    it("should return 400 for missing links", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for null links", async () => {
      const req = createMockRequest({ links: null });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-array links", async () => {
      const req = createMockRequest({ links: "not-an-array" });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should accept empty links array (schema allows it)", async () => {
      const req = createMockRequest({ links: [] });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Schema has no .min(1) validation, so empty array is valid
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        const data = json.data as { links: unknown[] };
        expect(data.links).toEqual([]);
      }
    });
  });

  describe("Invalid link object structure", () => {
    it("should return 400 for missing label", async () => {
      const req = createMockRequest({
        links: [
          {
            href: "/test",
            type: "internal",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for missing href", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Test",
            type: "internal",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for missing type", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Test",
            href: "/test",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for invalid type value", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Test",
            href: "/test",
            type: "invalid",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for invalid icon value", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Test",
            href: "/test",
            type: "internal",
            icon: "invalid-icon",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-string label", async () => {
      const req = createMockRequest({
        links: [
          {
            label: 123,
            href: "/test",
            type: "internal",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request("http://localhost:3000/api/tools/provide-navigation-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json{",
      });

      const response = await POST(req as NextRequest);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should handle array instead of object at top level", async () => {
      const req = createMockRequest([
        { label: "Test", href: "/test", type: "internal" }
      ] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle link with extra fields", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Test",
            href: "/test",
            type: "internal",
            extraField: "should be ignored",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields in link objects are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle request with extra top-level fields", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "Test",
            href: "/test",
            type: "internal",
          },
        ],
        extraField: "should be ignored",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra top-level fields are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle empty string label", async () => {
      const req = createMockRequest({
        links: [
          {
            label: "",
            href: "/test",
            type: "internal",
          },
        ],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Schema has no .min(1) validation, so empty string is valid
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle large array of links", async () => {
      const links = Array.from({ length: 20 }, (_, i) => ({
        label: `Link ${i}`,
        href: `/page-${i}`,
        type: "internal" as const,
      }));

      const req = createMockRequest({ links });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        const data = json.data as { links: unknown[] };
        expect(data.links).toHaveLength(20);
      }
    });
  });
});
