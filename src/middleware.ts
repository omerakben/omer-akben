import { NextRequest, NextResponse } from "next/server";
// TODO: Uncomment when Upstash Redis is configured (P0-2 task)
// import { apiRateLimit, chatRateLimit, toolsRateLimit } from "@/lib/rate-limit";

// In-memory rate limiting (temporary until Upstash Redis is implemented)
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
  const recentRequests = requests.filter(
    (timestamp) => timestamp > windowStart
  );

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

    // TODO: When Upstash Redis is configured, use Redis-based rate limiting
    // For now, using in-memory fallback for all routes
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
    response.headers.set(
      "X-RateLimit-Limit",
      FALLBACK_RATE_LIMIT.max.toString()
    );
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
