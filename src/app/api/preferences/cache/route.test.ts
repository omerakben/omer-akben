import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { createMockRequest, createMockGetRequest, getResponseJson, isSuccessResponse, isErrorResponse } from "../../tools/test-utils";

// Mock Redis client
vi.mock("@/lib/redis/client", () => ({
  getRedisClient: vi.fn(),
}));

import { getRedisClient } from "@/lib/redis/client";

describe("Cache Preferences API", () => {
  const mockRedisGet = vi.fn();
  const mockRedisSet = vi.fn();
  const mockRedisClient = {
    get: mockRedisGet,
    set: mockRedisSet,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: Redis available
    vi.mocked(getRedisClient).mockReturnValue(mockRedisClient as unknown as ReturnType<typeof getRedisClient>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/preferences/cache", () => {
    describe("Success cases", () => {
      it("should retrieve cache preference for valid clientId", async () => {
        mockRedisGet.mockResolvedValue("performance");
        const request = createMockGetRequest({ clientId: "test-client-123" });

        const response = await GET(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        if (isSuccessResponse(json)) {
          const data = json.data as { preference: string | null };
          expect(data.preference).toBe("performance");
        }
        expect(mockRedisGet).toHaveBeenCalledWith("cache_pref:test-client-123");
      });

      it("should return null preference when not found in Redis", async () => {
        mockRedisGet.mockResolvedValue(null);
        const request = createMockGetRequest({ clientId: "new-client" });

        const response = await GET(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        if (isSuccessResponse(json)) {
          const data = json.data as { preference: string | null };
          expect(data.preference).toBeNull();
        }
      });

      it("should handle quality preference", async () => {
        mockRedisGet.mockResolvedValue("quality");
        const request = createMockGetRequest({ clientId: "quality-client" });

        const response = await GET(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        if (isSuccessResponse(json)) {
          const data = json.data as { preference: string | null };
          expect(data.preference).toBe("quality");
        }
      });
    });

    describe("Error cases", () => {
      it("should return error when clientId is missing", async () => {
        const request = createMockGetRequest({});

        const response = await GET(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(400);
        expect(isErrorResponse(json)).toBe(true);
        if (isErrorResponse(json)) {
          expect(json.error).toBe("Client ID is required");
        }
        expect(mockRedisGet).not.toHaveBeenCalled();
      });

      it("should return error when clientId is empty string", async () => {
        const request = createMockGetRequest({ clientId: "" });

        const response = await GET(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(400);
        expect(isErrorResponse(json)).toBe(true);
      });
    });

    describe("Graceful degradation", () => {
      it("should return null preference when Redis is unavailable", async () => {
        vi.mocked(getRedisClient).mockImplementation(() => {
          throw new Error("Redis connection failed");
        });
        const request = createMockGetRequest({ clientId: "test-client" });

        const response = await GET(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        if (isSuccessResponse(json)) {
          const data = json.data as { preference: string | null };
          expect(data.preference).toBeNull();
        }
      });

      it("should handle Redis get errors gracefully", async () => {
        mockRedisGet.mockRejectedValue(new Error("Redis get failed"));
        const request = createMockGetRequest({ clientId: "test-client" });

        const response = await GET(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(500);
        expect(isErrorResponse(json)).toBe(true);
        if (isErrorResponse(json)) {
          expect(json.error).toBe("Failed to retrieve cache preference");
        }
      });
    });
  });

  describe("POST /api/preferences/cache", () => {
    describe("Success cases", () => {
      it("should save performance preference", async () => {
        mockRedisSet.mockResolvedValue("OK");
        const request = createMockRequest({
          clientId: "test-client-123",
          preference: "performance",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        if (isSuccessResponse(json)) {
          const data = json.data as { preference: string };
          expect(data.preference).toBe("performance");
        }
        expect(mockRedisSet).toHaveBeenCalledWith(
          "cache_pref:test-client-123",
          "performance",
          { ex: 90 * 24 * 60 * 60 }
        );
      });

      it("should save quality preference", async () => {
        mockRedisSet.mockResolvedValue("OK");
        const request = createMockRequest({
          clientId: "quality-client",
          preference: "quality",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        if (isSuccessResponse(json)) {
          const data = json.data as { preference: string };
          expect(data.preference).toBe("quality");
        }
      });

      it("should use correct Redis key format", async () => {
        mockRedisSet.mockResolvedValue("OK");
        const request = createMockRequest({
          clientId: "abc-123",
          preference: "performance",
        });

        await POST(request);

        expect(mockRedisSet).toHaveBeenCalledWith(
          "cache_pref:abc-123",
          "performance",
          expect.any(Object)
        );
      });

      it("should set 90-day TTL", async () => {
        mockRedisSet.mockResolvedValue("OK");
        const request = createMockRequest({
          clientId: "test",
          preference: "quality",
        });

        await POST(request);

        const expectedTTL = 90 * 24 * 60 * 60; // 90 days in seconds
        expect(mockRedisSet).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
          { ex: expectedTTL }
        );
      });
    });

    describe("Validation errors", () => {
      it("should reject missing clientId", async () => {
        const request = createMockRequest({
          preference: "performance",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(400);
        expect(isErrorResponse(json)).toBe(true);
        if (isErrorResponse(json)) {
          expect(json.error).toMatch(/Required|expected/i);
        }
        expect(mockRedisSet).not.toHaveBeenCalled();
      });

      it("should reject empty clientId", async () => {
        const request = createMockRequest({
          clientId: "",
          preference: "performance",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(400);
        expect(isErrorResponse(json)).toBe(true);
        if (isErrorResponse(json)) {
          expect(json.error).toContain("required");
        }
      });

      it("should reject missing preference", async () => {
        const request = createMockRequest({
          clientId: "test-client",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(400);
        expect(isErrorResponse(json)).toBe(true);
      });

      it("should reject invalid preference value", async () => {
        const request = createMockRequest({
          clientId: "test-client",
          preference: "invalid-preference",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(400);
        expect(isErrorResponse(json)).toBe(true);
      });

      it("should reject preference with wrong type", async () => {
        const request = createMockRequest({
          clientId: "test-client",
          preference: 123,
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(400);
        expect(isErrorResponse(json)).toBe(true);
      });

      it("should reject extra fields", async () => {
        const request = createMockRequest({
          clientId: "test-client",
          preference: "performance",
          extraField: "should-be-ignored",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        // Zod strips extra fields by default, so this should succeed
        expect(isSuccessResponse(json)).toBe(true);
      });
    });

    describe("Graceful degradation", () => {
      it("should succeed even when Redis is unavailable", async () => {
        vi.mocked(getRedisClient).mockImplementation(() => {
          throw new Error("Redis connection failed");
        });
        const request = createMockRequest({
          clientId: "test-client",
          preference: "performance",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        if (isSuccessResponse(json)) {
          const data = json.data as { preference: string };
          expect(data.preference).toBe("performance");
        }
      });

      it("should handle Redis set errors gracefully", async () => {
        mockRedisSet.mockRejectedValue(new Error("Redis set failed"));
        const request = createMockRequest({
          clientId: "test-client",
          preference: "quality",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(500);
        expect(isErrorResponse(json)).toBe(true);
        if (isErrorResponse(json)) {
          expect(json.error).toBe("Failed to save cache preference");
        }
      });
    });

    describe("Edge cases", () => {
      it("should handle very long clientId", async () => {
        mockRedisSet.mockResolvedValue("OK");
        const longClientId = "a".repeat(500);
        const request = createMockRequest({
          clientId: longClientId,
          preference: "performance",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
        expect(mockRedisSet).toHaveBeenCalledWith(
          `cache_pref:${longClientId}`,
          expect.any(String),
          expect.any(Object)
        );
      });

      it("should handle special characters in clientId", async () => {
        mockRedisSet.mockResolvedValue("OK");
        const specialClientId = "client-123!@#$%^&*()";
        const request = createMockRequest({
          clientId: specialClientId,
          preference: "quality",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(isSuccessResponse(json)).toBe(true);
      });

      it("should handle malformed JSON", async () => {
        const request = new NextRequest("http://localhost:3000/api/preferences/cache", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "invalid-json{",
        });

        const response = await POST(request);
        const json = await getResponseJson(response);

        expect(response.status).toBe(500);
        expect(isErrorResponse(json)).toBe(true);
      });
    });
  });
});
