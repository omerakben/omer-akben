/**
 * Unit tests for Get Contact API Route
 * Tests contact info retrieval (no input parameters required)
 */

import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { createMockRequest, getResponseJson, isSuccessResponse, isErrorResponse } from "../test-utils";

describe("POST /api/tools/get-contact", () => {
  describe("Valid requests", () => {
    it("should return contact info with empty request", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("contact");
        expect(json.data.contact).toBeDefined();
      }
    });

    it("should include required contact fields", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const contact = json.data.contact;
        expect(contact).toHaveProperty("email");
        expect(contact).toHaveProperty("location");
        expect(contact).toHaveProperty("linkedin");
        expect(contact).toHaveProperty("github");
      }
    });

    it("should return valid email format", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const email = json.data.contact.email;
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    });

    it("should return valid LinkedIn URL", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const linkedin = json.data.contact.linkedin;
        expect(linkedin).toMatch(/^https?:\/\//);
      }
    });

    it("should return valid GitHub URL", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const github = json.data.contact.github;
        expect(github).toMatch(/^https?:\/\//);
      }
    });
  });

  describe("Request variations", () => {
    it("should ignore request body parameters", async () => {
      const req = createMockRequest({
        ignoreMe: "this should be ignored",
        anotherField: 123,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Schema accepts empty object, so extra fields are ignored
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle request with various parameter types", async () => {
      const req = createMockRequest({
        string: "test",
        number: 123,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: "value" },
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // All parameters ignored, should still succeed
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should succeed even with invalid JSON body (route doesn't parse request)", async () => {
      const req = new Request("http://localhost:3000/api/tools/get-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json{",
      });

      const response = await POST(req as any);
      const json = await getResponseJson(response);

      // Route doesn't accept request parameter, so it never parses JSON
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should succeed with array instead of object (route doesn't parse request)", async () => {
      const req = createMockRequest([{ test: "value" }] as any);
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Route doesn't accept request parameter, so it ignores request body
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Response consistency", () => {
    it("should return same contact info on multiple calls", async () => {
      const req1 = createMockRequest({});
      const response1 = await POST(req1);
      const json1 = await getResponseJson(response1);

      const req2 = createMockRequest({});
      const response2 = await POST(req2);
      const json2 = await getResponseJson(response2);

      if (isSuccessResponse(json1) && isSuccessResponse(json2)) {
        expect(json1.data.contact).toEqual(json2.data.contact);
      }
    });

    it("should not expose sensitive data beyond specified fields", async () => {
      const req = createMockRequest({});
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const contact = json.data.contact;
        const keys = Object.keys(contact);

        // Should only include expected contact fields
        const allowedFields = ["email", "phone", "location", "linkedin", "github", "twitter"];
        keys.forEach(key => {
          expect(allowedFields).toContain(key);
        });
      }
    });
  });
});
