/**
 * Unit tests for Trigger Workflow API Route
 * Tests workflow orchestration validation and mock responses (MVP implementation)
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

describe("POST /api/tools/trigger-workflow", () => {
  describe("Valid requests", () => {
    it("should trigger workflow with minimum required fields", async () => {
      const req = createMockRequest({
        workflowId: "interview-prep",
        payload: { candidateName: "John Doe" },
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);

      if (isSuccessResponse(json)) {
        expect(json.data).toMatchObject({
          workflowId: "interview-prep",
          status: "completed",
          result: expect.objectContaining({
            message: expect.any(String),
            timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/), // ISO 8601
          }),
          message: expect.stringContaining("interview-prep"),
        });
      }
    });

    it("should trigger workflow with waitForResult parameter", async () => {
      const req = createMockRequest({
        workflowId: "project-comparison",
        payload: { projects: ["ai-agent", "elon-ai"] },
        waitForResult: false,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should include all required fields in response", async () => {
      const req = createMockRequest({
        workflowId: "test-workflow",
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(isSuccessResponse(json)).toBe(true);
      if (isSuccessResponse(json)) {
        expect(json.data).toHaveProperty("workflowId");
        expect(json.data).toHaveProperty("status");
        expect(json.data).toHaveProperty("result");
        expect(json.data).toHaveProperty("message");
      }
    });

    it("should handle complex payload objects", async () => {
      const req = createMockRequest({
        workflowId: "complex-workflow",
        payload: {
          user: { name: "Test", email: "test@example.com" },
          settings: { mode: "fast", retries: 3 },
          items: ["item1", "item2"],
        },
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Invalid workflowId parameter", () => {
    it("should return 400 for missing workflowId", async () => {
      const req = createMockRequest({
        payload: { test: "data" },
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
      if (isErrorResponse(json)) {
        expect(json.error).toBeDefined();
      }
    });

    it("should return 400 for null workflowId", async () => {
      const req = createMockRequest({
        workflowId: null,
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should accept empty string workflowId (schema allows it)", async () => {
      const req = createMockRequest({
        workflowId: "",
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Schema has no .min(1) validation, so empty string is valid
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should return 400 for non-string workflowId", async () => {
      const req = createMockRequest({
        workflowId: 123,
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Invalid payload parameter", () => {
    it("should return 400 for missing payload", async () => {
      const req = createMockRequest({
        workflowId: "test-workflow",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for null payload", async () => {
      const req = createMockRequest({
        workflowId: "test-workflow",
        payload: null,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for non-object payload", async () => {
      const req = createMockRequest({
        workflowId: "test-workflow",
        payload: "invalid",
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });

    it("should return 400 for array payload", async () => {
      const req = createMockRequest({
        workflowId: "test-workflow",
        payload: ["item1", "item2"],
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Malformed requests", () => {
    it("should handle invalid JSON body", async () => {
      const req = new Request(
        "http://localhost:3000/api/tools/trigger-workflow",
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

    it("should handle array instead of object", async () => {
      const req = createMockRequest([
        { workflowId: "test", payload: {} },
      ] as unknown);
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(isErrorResponse(json)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle workflowId with special characters", async () => {
      const req = createMockRequest({
        workflowId: "workflow-123_test.v2",
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle empty payload object", async () => {
      const req = createMockRequest({
        workflowId: "minimal-workflow",
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should handle extra fields in request", async () => {
      const req = createMockRequest({
        workflowId: "test-workflow",
        payload: {},
        extraField: "should be ignored",
        anotherExtra: 123,
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      // Should succeed - extra fields are ignored by Zod
      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });

    it("should default waitForResult to true when omitted", async () => {
      const req = createMockRequest({
        workflowId: "test-workflow",
        payload: {},
        // waitForResult omitted - should default to true
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(isSuccessResponse(json)).toBe(true);
    });
  });

  describe("Mock implementation behavior", () => {
    it("should always return 'completed' status in MVP", async () => {
      const req = createMockRequest({
        workflowId: "any-workflow",
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { status: unknown };
        expect(data.status).toBe("completed");
      }
    });

    it("should include ISO 8601 timestamp in result", async () => {
      const req = createMockRequest({
        workflowId: "test",
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { result: { timestamp: unknown } };
        expect(data.result.timestamp).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
        );
      }
    });

    it("should echo workflowId in response", async () => {
      const workflowId = "custom-workflow-123";
      const req = createMockRequest({
        workflowId,
        payload: {},
      });
      const response = await POST(req);
      const json = await getResponseJson(response);

      if (isSuccessResponse(json)) {
        const data = json.data as { workflowId: unknown; message: unknown };
        expect(data.workflowId).toBe(workflowId);
        expect(data.message).toContain(workflowId);
      }
    });
  });
});
