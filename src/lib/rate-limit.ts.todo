import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client for production rate limiting
// Falls back to null if environment variables are not set (development mode)
const redis =
  process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_URL,
        token: process.env.UPSTASH_REDIS_TOKEN,
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
