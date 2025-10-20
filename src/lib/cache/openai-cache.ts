/**
 * OpenAI Cache Module
 *
 * Redis-backed caching layer for OpenAI API calls (embeddings and completions).
 * Reduces costs, improves latency, and enables offline development.
 *
 * Features:
 * - Embedding cache with 30-day TTL (deterministic)
 * - Completion cache with 7-day TTL (semi-deterministic)
 * - Hit/miss metrics tracking
 * - Performance monitoring
 */

import { createHash } from "crypto";
import { getRedisClient } from "@/lib/redis/client";

// Cache configuration
const CACHE_VERSION = "v1";
const EMBEDDING_TTL = 60 * 60 * 24 * 30; // 30 days
const COMPLETION_TTL = 60 * 60 * 24 * 7; // 7 days
const METRICS_TTL = 60 * 60 * 24 * 90; // 90 days

// Cache key prefixes
const EMBEDDING_PREFIX = `cache:embed:${CACHE_VERSION}:`;
const COMPLETION_PREFIX = `cache:completion:${CACHE_VERSION}:`;
const METRICS_PREFIX = `cache:metrics:`;

/**
 * Cache types for metrics tracking
 */
export type CacheType = "embedding" | "completion";

/**
 * Cache metrics structure
 */
export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalCalls: number;
  avgLookupTime: number;
}

/**
 * Cached embedding structure
 */
interface CachedEmbedding {
  embedding: number[];
  model: string;
  created_at: string;
}

/**
 * Cached completion structure
 */
interface CachedCompletion {
  text: string;
  model: string;
  temperature: number;
  created_at: string;
}

/**
 * Generates SHA-256 hash for cache key
 */
function generateHash(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

/**
 * Builds cache key for embedding
 */
function buildEmbeddingKey(input: string, model: string): string {
  const content = `${model}::${input}`;
  const hash = generateHash(content);
  return `${EMBEDDING_PREFIX}${hash}`;
}

/**
 * Builds cache key for completion
 */
function buildCompletionKey(
  model: string,
  system: string,
  prompt: string,
  temperature: number
): string {
  const content = `${model}::${temperature}::${system}::${prompt}`;
  const hash = generateHash(content);
  return `${COMPLETION_PREFIX}${hash}`;
}

/**
 * Builds metrics key for date
 */
function buildMetricsKey(type: CacheType, date: string = getTodayDate()): string {
  return `${METRICS_PREFIX}${type}:${date}`;
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Retrieves cached embedding if exists
 *
 * @param input - Text to embed
 * @param model - Embedding model name
 * @returns Embedding vector or null if cache miss
 */
export async function getCachedEmbedding(
  input: string,
  model: string = "text-embedding-3-small"
): Promise<number[] | null> {
  const startTime = performance.now();

  try {
    const redis = getRedisClient();
    const key = buildEmbeddingKey(input, model);
    const cached = await redis.get<string>(key);

    const lookupTime = performance.now() - startTime;

    if (!cached) {
      return null;
    }

    const parsed: CachedEmbedding = JSON.parse(cached);

    // Log cache performance
    console.log(
      `[Cache:embedding] HIT - lookup: ${lookupTime.toFixed(2)}ms, model: ${model}`
    );

    return parsed.embedding;
  } catch (error) {
    console.error("[Cache:embedding] Failed to retrieve cached embedding", { error });
    return null;
  }
}

/**
 * Stores embedding in cache
 *
 * @param input - Text that was embedded
 * @param embedding - Embedding vector
 * @param model - Embedding model name
 */
export async function setCachedEmbedding(
  input: string,
  embedding: number[],
  model: string = "text-embedding-3-small"
): Promise<void> {
  try {
    const redis = getRedisClient();
    const key = buildEmbeddingKey(input, model);

    const payload: CachedEmbedding = {
      embedding,
      model,
      created_at: new Date().toISOString(),
    };

    await redis.set(key, JSON.stringify(payload), { ex: EMBEDDING_TTL });
  } catch (error) {
    console.error("[Cache:embedding] Failed to store embedding in cache", { error });
    // Graceful degradation: don't throw, caching is optional
  }
}

/**
 * Retrieves cached completion if exists
 *
 * @param model - Model name (e.g., "gpt-4o-mini")
 * @param system - System prompt
 * @param prompt - User prompt
 * @param temperature - Temperature setting
 * @returns Completion text or null if cache miss
 */
export async function getCachedCompletion(
  model: string,
  system: string,
  prompt: string,
  temperature: number
): Promise<string | null> {
  const startTime = performance.now();

  try {
    const redis = getRedisClient();
    const key = buildCompletionKey(model, system, prompt, temperature);
    const cached = await redis.get<string>(key);

    const lookupTime = performance.now() - startTime;

    if (!cached) {
      return null;
    }

    const parsed: CachedCompletion = JSON.parse(cached);

    // Log cache performance
    console.log(
      `[Cache:completion] HIT - lookup: ${lookupTime.toFixed(2)}ms, model: ${model}, temp: ${temperature}`
    );

    return parsed.text;
  } catch (error) {
    console.error("[Cache:completion] Failed to retrieve cached completion", { error });
    return null;
  }
}

/**
 * Stores completion in cache
 *
 * @param model - Model name
 * @param system - System prompt
 * @param prompt - User prompt
 * @param temperature - Temperature setting
 * @param text - Completion text
 */
export async function setCachedCompletion(
  model: string,
  system: string,
  prompt: string,
  temperature: number,
  text: string
): Promise<void> {
  try {
    const redis = getRedisClient();
    const key = buildCompletionKey(model, system, prompt, temperature);

    const payload: CachedCompletion = {
      text,
      model,
      temperature,
      created_at: new Date().toISOString(),
    };

    await redis.set(key, JSON.stringify(payload), { ex: COMPLETION_TTL });
  } catch (error) {
    console.error("[Cache:completion] Failed to store completion in cache", { error });
    // Graceful degradation: don't throw, caching is optional
  }
}

/**
 * Records cache hit in metrics
 *
 * @param type - Cache type (embedding or completion)
 */
export async function recordCacheHit(type: CacheType): Promise<void> {
  try {
    const redis = getRedisClient();
    const key = buildMetricsKey(type);

    await redis.hincrby(key, "hits", 1);
    await redis.hincrby(key, "total", 1);
    await redis.expire(key, METRICS_TTL);
  } catch (error) {
    console.error(`[Cache:${type}] Failed to record cache hit`, { error });
  }
}

/**
 * Records cache miss in metrics
 *
 * @param type - Cache type (embedding or completion)
 */
export async function recordCacheMiss(type: CacheType): Promise<void> {
  try {
    const redis = getRedisClient();
    const key = buildMetricsKey(type);

    await redis.hincrby(key, "misses", 1);
    await redis.hincrby(key, "total", 1);
    await redis.expire(key, METRICS_TTL);
  } catch (error) {
    console.error(`[Cache:${type}] Failed to record cache miss`, { error });
  }
}

/**
 * Retrieves cache metrics for specified type and date range
 *
 * @param type - Cache type (embedding or completion)
 * @param days - Number of days to aggregate (default: 1)
 * @returns Aggregated cache metrics
 */
export async function getCacheMetrics(
  type: CacheType,
  days: number = 1
): Promise<CacheMetrics> {
  try {
    const redis = getRedisClient();

    let totalHits = 0;
    let totalMisses = 0;
    let totalCalls = 0;

    // Aggregate metrics across date range
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const key = buildMetricsKey(type, dateStr);
      const metrics = await redis.hgetall<Record<string, string>>(key);

      if (metrics && Object.keys(metrics).length > 0) {
        totalHits += parseInt(metrics.hits || "0", 10);
        totalMisses += parseInt(metrics.misses || "0", 10);
        totalCalls += parseInt(metrics.total || "0", 10);
      }
    }

    const hitRate = totalCalls > 0 ? (totalHits / totalCalls) * 100 : 0;

    return {
      hits: totalHits,
      misses: totalMisses,
      hitRate: parseFloat(hitRate.toFixed(2)),
      totalCalls,
      avgLookupTime: 0, // TODO: Implement lookup time tracking
    };
  } catch (error) {
    console.error(`[Cache:${type}] Failed to retrieve cache metrics`, { error });
    return {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalCalls: 0,
      avgLookupTime: 0,
    };
  }
}

/**
 * Logs cache metrics summary
 *
 * @param type - Cache type (embedding or completion)
 * @param days - Number of days to aggregate
 */
export async function logCacheMetrics(type: CacheType, days: number = 7): Promise<void> {
  const metrics = await getCacheMetrics(type, days);

  console.log(`
╔════════════════════════════════════════╗
║   Cache Metrics (${type.toUpperCase()}) - Last ${days} days   ║
╠════════════════════════════════════════╣
║ Total Calls:     ${metrics.totalCalls.toString().padStart(20)} ║
║ Hits:            ${metrics.hits.toString().padStart(20)} ║
║ Misses:          ${metrics.misses.toString().padStart(20)} ║
║ Hit Rate:        ${metrics.hitRate.toFixed(1).padStart(18)}% ║
╚════════════════════════════════════════╝
  `);
}
