import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client for production rate limiting
// Falls back to null if environment variables are not set (development mode)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Chat endpoint rate limit: 30 requests per minute
// More restrictive because of OpenAI API costs
export const chatRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "ratelimit:chat",
    })
  : null;

// Tools endpoints rate limit: 60 requests per minute
// Less restrictive since tools are lightweight operations
export const toolsRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "ratelimit:tools",
    })
  : null;

// Generic API rate limit: 100 requests per minute
// For any other API endpoints
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null;

// Contact collection rate limit: 5 requests per 24 hours per IP
// Allows recruiters to share with colleagues while preventing spam
export const contactCollectionRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "24 h"),
      analytics: true,
      prefix: "ratelimit:contact-collection",
    })
  : null;

/**
 * Check if an IP address has exceeded the contact collection rate limit
 */
export async function checkContactRateLimit(ip: string): Promise<boolean> {
  if (!contactCollectionRateLimit) {
    return true; // No rate limiting in dev mode
  }

  const result = await contactCollectionRateLimit.limit(ip);
  return result.success;
}
