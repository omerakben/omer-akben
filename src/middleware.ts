import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit, chatRateLimit, toolsRateLimit } from "@/lib/rate-limit";

// Fallback in-memory rate limiting for development (when Redis is not configured)
const FALLBACK_RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
};

const rateLimitMap = new Map<string, number[]>();

function getRateLimitKey(request: NextRequest): string {
  // Use IP address from x-forwarded-for header or fallback to anonymous
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return ip;
}

function fallbackRateLimitCheck(key: string): {
  success: boolean;
  remaining: number;
} {
  const now = Date.now();
  const windowStart = now - FALLBACK_RATE_LIMIT.windowMs;

  // Get existing requests for this key
  const requests = rateLimitMap.get(key) || [];

  // Filter out requests outside the current window
  const recentRequests = requests.filter((timestamp) => timestamp > windowStart);

  // Update the map with filtered requests
  rateLimitMap.set(key, recentRequests);

  // Check if rate limit exceeded
  if (recentRequests.length >= FALLBACK_RATE_LIMIT.max) {
    return { success: false, remaining: 0 };
  }

  // Add current request timestamp
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);

  return {
    success: true,
    remaining: FALLBACK_RATE_LIMIT.max - recentRequests.length,
  };
}

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = getRateLimitKey(request);

    // Choose rate limiter based on path
    let limiter = apiRateLimit;
    if (request.nextUrl.pathname.startsWith("/api/chat")) {
      limiter = chatRateLimit;
    } else if (request.nextUrl.pathname.startsWith("/api/tools")) {
      limiter = toolsRateLimit;
    }

    // Use Redis-based rate limiting if available, otherwise fallback to in-memory
    if (limiter) {
      const { success, reset } = await limiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
              "X-RateLimit-Limit": limiter === chatRateLimit ? "30" : limiter === toolsRateLimit ? "60" : "100",
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set(
        "X-RateLimit-Limit",
        limiter === chatRateLimit ? "30" : limiter === toolsRateLimit ? "60" : "100"
      );

      return response;
    } else {
      // Fallback to in-memory rate limiting for development
      const result = fallbackRateLimitCheck(ip);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": "60",
              "X-RateLimit-Limit": FALLBACK_RATE_LIMIT.max.toString(),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Limit", FALLBACK_RATE_LIMIT.max.toString());
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString());

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
