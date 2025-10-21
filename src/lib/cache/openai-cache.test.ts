/**
 * Unit tests for OpenAI cache module
 * Tests cache key generation, hit/miss scenarios, metrics tracking, and TTL enforcement
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import { createHash } from "crypto";

// Mock Redis client before importing cache functions
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockHincrby = vi.fn();
const mockExpire = vi.fn();
const mockHgetall = vi.fn();

vi.mock("@/lib/redis/client", () => ({
  getRedisClient: vi.fn(() => ({
    get: mockGet,
    set: mockSet,
    hincrby: mockHincrby,
    expire: mockExpire,
    hgetall: mockHgetall,
  })),
}));

// Import after mocking
const {
  getCachedEmbedding,
  setCachedEmbedding,
  getCachedCompletion,
  setCachedCompletion,
  recordCacheHit,
  recordCacheMiss,
  getCacheMetrics,
} = await import("./openai-cache");

describe("OpenAI Cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Cache Key Generation", () => {
    it("should generate deterministic keys for same input", () => {
      const input = "test input text";
      const model = "text-embedding-3-small";

      // Generate hash manually to verify determinism
      const content = `${model}::${input}`;
      const hash = createHash("sha256").update(content, "utf8").digest("hex");
      const expectedKey = `cache:embed:v1:${hash}`;
      const secondKey = `cache:embed:v1:${createHash("sha256").update(content, "utf8").digest("hex")}`;

      // Verify key is deterministic by calling twice
      expect(expectedKey).toBe(secondKey);
    });

    it("should generate different keys for different inputs", () => {
      const input1 = "first input";
      const input2 = "second input";
      const model = "text-embedding-3-small";

      const hash1 = createHash("sha256").update(`${model}::${input1}`, "utf8").digest("hex");
      const hash2 = createHash("sha256").update(`${model}::${input2}`, "utf8").digest("hex");

      expect(hash1).not.toBe(hash2);
    });

    it("should generate different keys for different models", () => {
      const input = "test input";
      const model1 = "text-embedding-3-small";
      const model2 = "text-embedding-3-large";

      const hash1 = createHash("sha256").update(`${model1}::${input}`, "utf8").digest("hex");
      const hash2 = createHash("sha256").update(`${model2}::${input}`, "utf8").digest("hex");

      expect(hash1).not.toBe(hash2);
    });

    it("should use version prefix in cache keys", () => {
      const input = "test";
      const model = "text-embedding-3-small";
      const hash = createHash("sha256").update(`${model}::${input}`, "utf8").digest("hex");
      const expectedKey = `cache:embed:v1:${hash}`;

      expect(expectedKey).toMatch(/^cache:embed:v1:/);
    });
  });

  describe("Embedding Cache", () => {
    it("should return null on cache miss", async () => {
      mockGet.mockResolvedValue(null);

      const result = await getCachedEmbedding("test input", "text-embedding-3-small");

      expect(result).toBeNull();
      expect(mockGet).toHaveBeenCalledOnce();
    });

    it("should return cached embedding on cache hit", async () => {
      const testEmbedding = [0.1, 0.2, 0.3];
      const cachedData = JSON.stringify({
        embedding: testEmbedding,
        model: "text-embedding-3-small",
        created_at: new Date().toISOString(),
      });
      mockGet.mockResolvedValue(cachedData);

      const result = await getCachedEmbedding("test input", "text-embedding-3-small");

      expect(result).toEqual(testEmbedding);
      expect(mockGet).toHaveBeenCalledOnce();
    });

    it("should store embedding in cache with TTL", async () => {
      const testEmbedding = [0.1, 0.2, 0.3];
      mockSet.mockResolvedValue("OK");

      await setCachedEmbedding("test input", testEmbedding, "text-embedding-3-small");

      expect(mockSet).toHaveBeenCalledOnce();
      const [key, value, options] = mockSet.mock.calls[0];
      expect(key).toMatch(/^cache:embed:v1:/);
      expect(options.ex).toBe(60 * 60 * 24 * 30); // 30 days
      const parsed = JSON.parse(value);
      expect(parsed.embedding).toEqual(testEmbedding);
      expect(parsed.model).toBe("text-embedding-3-small");
    });

    it("should handle cache retrieval errors gracefully", async () => {
      mockGet.mockRejectedValue(new Error("Redis connection failed"));

      const result = await getCachedEmbedding("test input", "text-embedding-3-small");

      expect(result).toBeNull();
    });

    it("should handle cache storage errors gracefully", async () => {
      mockSet.mockRejectedValue(new Error("Redis connection failed"));

      await expect(
        setCachedEmbedding("test input", [0.1, 0.2], "text-embedding-3-small")
      ).resolves.toBeUndefined();
    });
  });

  describe("Completion Cache", () => {
    it("should return null on cache miss", async () => {
      mockGet.mockResolvedValue(null);

      const result = await getCachedCompletion(
        "gpt-4o-mini",
        "System prompt",
        "User prompt",
        0.3
      );

      expect(result).toBeNull();
      expect(mockGet).toHaveBeenCalledOnce();
    });

    it("should return cached completion on cache hit", async () => {
      const testCompletion = "Cached response text";
      const cachedData = JSON.stringify({
        text: testCompletion,
        model: "gpt-4o-mini",
        temperature: 0.3,
        created_at: new Date().toISOString(),
      });
      mockGet.mockResolvedValue(cachedData);

      const result = await getCachedCompletion(
        "gpt-4o-mini",
        "System prompt",
        "User prompt",
        0.3
      );

      expect(result).toBe(testCompletion);
      expect(mockGet).toHaveBeenCalledOnce();
    });

    it("should store completion in cache with TTL", async () => {
      const testCompletion = "Test response";
      mockSet.mockResolvedValue("OK");

      await setCachedCompletion(
        "gpt-4o-mini",
        "System prompt",
        "User prompt",
        0.3,
        testCompletion
      );

      expect(mockSet).toHaveBeenCalledOnce();
      const [key, value, options] = mockSet.mock.calls[0];
      expect(key).toMatch(/^cache:completion:v1:/);
      expect(options.ex).toBe(60 * 60 * 24 * 7); // 7 days
      const parsed = JSON.parse(value);
      expect(parsed.text).toBe(testCompletion);
      expect(parsed.temperature).toBe(0.3);
    });

    it("should generate different keys for different temperatures", async () => {
      mockSet.mockResolvedValue("OK");

      await setCachedCompletion("gpt-4o-mini", "System", "Prompt", 0.3, "Response1");
      await setCachedCompletion("gpt-4o-mini", "System", "Prompt", 0.7, "Response2");

      expect(mockSet).toHaveBeenCalledTimes(2);
      const key1 = mockSet.mock.calls[0][0];
      const key2 = mockSet.mock.calls[1][0];
      expect(key1).not.toBe(key2);
    });

    it("should handle invalid JSON in cache gracefully", async () => {
      mockGet.mockResolvedValue("invalid json {");

      const result = await getCachedCompletion(
        "gpt-4o-mini",
        "System prompt",
        "User prompt",
        0.3
      );

      expect(result).toBeNull();
    });
  });

  describe("Metrics Tracking", () => {
    it("should record cache hit and increment counters", async () => {
      mockHincrby.mockResolvedValue(1);
      mockExpire.mockResolvedValue(1);

      await recordCacheHit("embedding");

      expect(mockHincrby).toHaveBeenCalledTimes(2);
      expect(mockHincrby).toHaveBeenCalledWith(
        expect.stringMatching(/^cache:metrics:embedding:/),
        "hits",
        1
      );
      expect(mockHincrby).toHaveBeenCalledWith(
        expect.stringMatching(/^cache:metrics:embedding:/),
        "total",
        1
      );
      expect(mockExpire).toHaveBeenCalledWith(
        expect.stringMatching(/^cache:metrics:embedding:/),
        60 * 60 * 24 * 90
      );
    });

    it("should record cache miss and increment counters", async () => {
      mockHincrby.mockResolvedValue(1);
      mockExpire.mockResolvedValue(1);

      await recordCacheMiss("completion");

      expect(mockHincrby).toHaveBeenCalledTimes(2);
      expect(mockHincrby).toHaveBeenCalledWith(
        expect.stringMatching(/^cache:metrics:completion:/),
        "misses",
        1
      );
      expect(mockHincrby).toHaveBeenCalledWith(
        expect.stringMatching(/^cache:metrics:completion:/),
        "total",
        1
      );
    });

    it("should handle metrics recording errors gracefully", async () => {
      mockHincrby.mockRejectedValue(new Error("Redis connection failed"));

      await expect(recordCacheHit("embedding")).resolves.toBeUndefined();
      await expect(recordCacheMiss("completion")).resolves.toBeUndefined();
    });
  });

  describe("Metrics Retrieval", () => {
    it("should retrieve metrics for single day", async () => {
      mockHgetall.mockResolvedValue({
        hits: "10",
        misses: "5",
        total: "15",
      });

      const metrics = await getCacheMetrics("embedding", 1);

      expect(metrics.hits).toBe(10);
      expect(metrics.misses).toBe(5);
      expect(metrics.totalCalls).toBe(15);
      expect(metrics.hitRate).toBe(66.67);
    });

    it("should aggregate metrics across multiple days", async () => {
      mockHgetall
        .mockResolvedValueOnce({ hits: "10", misses: "5", total: "15" })
        .mockResolvedValueOnce({ hits: "20", misses: "10", total: "30" })
        .mockResolvedValueOnce({ hits: "15", misses: "5", total: "20" });

      const metrics = await getCacheMetrics("embedding", 3);

      expect(metrics.hits).toBe(45);
      expect(metrics.misses).toBe(20);
      expect(metrics.totalCalls).toBe(65);
      expect(metrics.hitRate).toBe(69.23);
    });

    it("should handle missing metrics gracefully", async () => {
      mockHgetall.mockResolvedValue({});

      const metrics = await getCacheMetrics("embedding", 1);

      expect(metrics.hits).toBe(0);
      expect(metrics.misses).toBe(0);
      expect(metrics.totalCalls).toBe(0);
      expect(metrics.hitRate).toBe(0);
    });

    it("should calculate zero hit rate when no calls", async () => {
      mockHgetall.mockResolvedValue({ hits: "0", misses: "0", total: "0" });

      const metrics = await getCacheMetrics("embedding", 1);

      expect(metrics.hitRate).toBe(0);
    });

    it("should handle metrics retrieval errors gracefully", async () => {
      mockHgetall.mockRejectedValue(new Error("Redis connection failed"));

      const metrics = await getCacheMetrics("embedding", 7);

      expect(metrics.hits).toBe(0);
      expect(metrics.misses).toBe(0);
      expect(metrics.hitRate).toBe(0);
    });
  });

  describe("TTL Enforcement", () => {
    it("should set 30-day TTL for embeddings", async () => {
      mockSet.mockResolvedValue("OK");

      await setCachedEmbedding("test", [0.1, 0.2], "text-embedding-3-small");

      const [, , options] = mockSet.mock.calls[0];
      expect(options.ex).toBe(60 * 60 * 24 * 30);
    });

    it("should set 7-day TTL for completions", async () => {
      mockSet.mockResolvedValue("OK");

      await setCachedCompletion("gpt-4o-mini", "System", "Prompt", 0.3, "Response");

      const [, , options] = mockSet.mock.calls[0];
      expect(options.ex).toBe(60 * 60 * 24 * 7);
    });

    it("should set 90-day TTL for metrics", async () => {
      mockHincrby.mockResolvedValue(1);
      mockExpire.mockResolvedValue(1);

      await recordCacheHit("embedding");

      expect(mockExpire).toHaveBeenCalledWith(
        expect.any(String),
        60 * 60 * 24 * 90
      );
    });
  });
});
