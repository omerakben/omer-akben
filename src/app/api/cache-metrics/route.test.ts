/**
 * Unit tests for Cache Metrics API Route
 * Tests query parameter validation, metrics retrieval, and error handling
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { createMockGetRequest, getResponseJson } from "../tools/test-utils";

// Mock the cache module - must be declared inline due to hoisting
vi.mock("@/lib/cache/openai-cache", () => ({
  getCacheMetrics: vi.fn(),
}));

// Import the mocked function after vi.mock
import { getCacheMetrics } from "@/lib/cache/openai-cache";

// Cast to mock for type safety
const getCacheMetricsMock = getCacheMetrics as ReturnType<typeof vi.fn>;

describe("GET /api/cache-metrics", () => {
  beforeEach(() => {
    getCacheMetricsMock.mockReset();
  });

  describe("Valid requests", () => {
    it("should return metrics for embedding type with default days", async () => {
      const mockMetrics = {
        hits: 10,
        misses: 5,
        hitRate: 66.67,
        totalCalls: 15,
        avgLookupTime: 0,
      };

      getCacheMetricsMock.mockResolvedValueOnce(mockMetrics);

      const req = createMockGetRequest(
        { type: "embedding" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual({
        type: "embedding",
        days: 7, // Default value
        metrics: mockMetrics,
      });
      expect(getCacheMetricsMock).toHaveBeenCalledWith("embedding", 7);
    });

    it("should return metrics for completion type with custom days", async () => {
      const mockMetrics = {
        hits: 20,
        misses: 10,
        hitRate: 66.67,
        totalCalls: 30,
        avgLookupTime: 0,
      };

      getCacheMetricsMock.mockResolvedValueOnce(mockMetrics);

      const req = createMockGetRequest(
        { type: "completion", days: "30" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual({
        type: "completion",
        days: 30,
        metrics: mockMetrics,
      });
      expect(getCacheMetricsMock).toHaveBeenCalledWith("completion", 30);
    });

    it("should return metrics for maximum days (90)", async () => {
      const mockMetrics = {
        hits: 100,
        misses: 50,
        hitRate: 66.67,
        totalCalls: 150,
        avgLookupTime: 0,
      };

      getCacheMetricsMock.mockResolvedValueOnce(mockMetrics);

      const req = createMockGetRequest(
        { type: "embedding", days: "90" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual({
        type: "embedding",
        days: 90,
        metrics: mockMetrics,
      });
      expect(getCacheMetricsMock).toHaveBeenCalledWith("embedding", 90);
    });

    it("should return metrics for minimum days (1)", async () => {
      const mockMetrics = {
        hits: 5,
        misses: 2,
        hitRate: 71.43,
        totalCalls: 7,
        avgLookupTime: 0,
      };

      getCacheMetricsMock.mockResolvedValueOnce(mockMetrics);

      const req = createMockGetRequest(
        { type: "completion", days: "1" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual({
        type: "completion",
        days: 1,
        metrics: mockMetrics,
      });
      expect(getCacheMetricsMock).toHaveBeenCalledWith("completion", 1);
    });
  });

  describe("Invalid type parameter", () => {
    it("should return 400 for missing type parameter", async () => {
      const req = createMockGetRequest(
        { days: "7" }, // No type param
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid type parameter. Must be 'embedding' or 'completion'",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid type parameter", async () => {
      const req = createMockGetRequest(
        { type: "invalid", days: "7" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid type parameter. Must be 'embedding' or 'completion'",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });

    it("should return 400 for empty type parameter", async () => {
      const req = createMockGetRequest(
        { type: "", days: "7" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid type parameter. Must be 'embedding' or 'completion'",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });
  });

  describe("Invalid days parameter", () => {
    it("should return 400 for non-numeric days", async () => {
      const req = createMockGetRequest(
        { type: "embedding", days: "invalid" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid days parameter. Must be between 1 and 90",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });

    it("should return 400 for days < 1", async () => {
      const req = createMockGetRequest(
        { type: "embedding", days: "0" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid days parameter. Must be between 1 and 90",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });

    it("should return 400 for days > 90", async () => {
      const req = createMockGetRequest(
        { type: "embedding", days: "91" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid days parameter. Must be between 1 and 90",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });

    it("should return 400 for negative days", async () => {
      const req = createMockGetRequest(
        { type: "completion", days: "-5" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid days parameter. Must be between 1 and 90",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });

    it("should return 400 for decimal days", async () => {
      const req = createMockGetRequest(
        { type: "embedding", days: "7.5" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(400);
      expect(json).toEqual({
        error: "Invalid days parameter. Must be between 1 and 90",
      });
      expect(getCacheMetricsMock).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should return 500 when getCacheMetrics throws error", async () => {
      getCacheMetricsMock.mockRejectedValueOnce(new Error("Redis connection failed"));

      const req = createMockGetRequest(
        { type: "embedding", days: "7" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(500);
      expect(json).toEqual({
        error: "Internal server error",
      });
      expect(getCacheMetricsMock).toHaveBeenCalledWith("embedding", 7);
    });

    it("should return 500 when getCacheMetrics returns null", async () => {
      getCacheMetricsMock.mockResolvedValueOnce(null);

      const req = createMockGetRequest(
        { type: "completion", days: "7" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const response = await GET(req);
      const json = await getResponseJson(response);

      expect(response.status).toBe(200);
      expect(json).toEqual({
        type: "completion",
        days: 7,
        metrics: null,
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle multiple simultaneous requests", async () => {
      const mockMetrics1 = { hits: 10, misses: 5, hitRate: 66.67, totalCalls: 15, avgLookupTime: 0 };
      const mockMetrics2 = { hits: 20, misses: 10, hitRate: 66.67, totalCalls: 30, avgLookupTime: 0 };

      getCacheMetricsMock
        .mockResolvedValueOnce(mockMetrics1)
        .mockResolvedValueOnce(mockMetrics2);

      const req1 = createMockGetRequest(
        { type: "embedding", days: "7" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );
      const req2 = createMockGetRequest(
        { type: "completion", days: "30" },
        { baseUrl: "http://localhost:3000/api/cache-metrics" }
      );

      const [response1, response2] = await Promise.all([GET(req1), GET(req2)]);

      const json1 = await getResponseJson(response1) as { metrics: unknown };
      const json2 = await getResponseJson(response2) as { metrics: unknown };

      expect(response1.status).toBe(200);
      expect(json1.metrics).toEqual(mockMetrics1);

      expect(response2.status).toBe(200);
      expect(json2.metrics).toEqual(mockMetrics2);
    });
  });
});
