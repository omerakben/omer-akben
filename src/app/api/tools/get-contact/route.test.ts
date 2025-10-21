/**
 * Unit tests for Get Contact API Route
 * Tests contact info retrieval (no input parameters required)
 */

import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { getResponseJson, isSuccessResponse } from "../test-utils";

describe("POST /api/tools/get-contact", () => {
  describe("Valid requests", () => {
    it("should return contact info with empty request", async () => {
      const response = await POST();
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("contact");
        const data = json.data as { contact: unknown };
        expect(data.contact).toBeDefined();
      }
    });

    it("should include required contact fields", async () => {
      const response = await POST();
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { contact: unknown };
        const contact = data.contact;
        expect(contact).toHaveProperty("email");
        expect(contact).toHaveProperty("location");
        expect(contact).toHaveProperty("linkedin");
        expect(contact).toHaveProperty("github");
      }
    });

    it("should return valid email format", async () => {
      const response = await POST();
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { contact: { email: unknown } };
        const email = data.contact.email;
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      }
    });

    it("should return valid LinkedIn URL", async () => {
      const response = await POST();
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { contact: { linkedin: unknown } };
        const linkedin = data.contact.linkedin;
        expect(linkedin).toMatch(/^https?:\/\//);
      }
    });

    it("should return valid GitHub URL", async () => {
      const response = await POST();
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { contact: { github: unknown } };
        const github = data.contact.github;
        expect(github).toMatch(/^https?:\/\//);
      }
    });
  });

  describe("Response consistency", () => {
    it("should return same contact info on multiple calls", async () => {
      const response1 = await POST();
      const json1 = await getResponseJson(response1);

      const response2 = await POST();
      const json2 = await getResponseJson(response2);

      if (isSuccessResponse(json1) && isSuccessResponse(json2)) {
        const data1 = json1.data as { contact: unknown };
        const data2 = json2.data as { contact: unknown };
        expect(data1.contact).toEqual(data2.contact);
      }
    });

    it("should not expose sensitive data beyond specified fields", async () => {
      const response = await POST();
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { contact: unknown };
        const contact = data.contact as Record<string, unknown>;
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
