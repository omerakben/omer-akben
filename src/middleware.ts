import { NextRequest, NextResponse } from "next/server";

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
};

// In-memory store for rate limiting (use Redis in production)
const rateLimitMap = new Map<string, number[]>();

function getRateLimitKey(request: NextRequest): string {
  // Use IP address from x-forwarded-for header or fallback to anonymous
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  // Get existing requests for this key
  const requests = rateLimitMap.get(key) || [];

  // Filter out requests outside the current window
  const recentRequests = requests.filter((timestamp) => timestamp > windowStart);

  // Update the map with filtered requests
  rateLimitMap.set(key, recentRequests);

  // Check if rate limit exceeded
  if (recentRequests.length >= RATE_LIMIT.max) {
    return true;
  }

  // Add current request timestamp
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);

  return false;
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request);

    if (isRateLimited(key)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": RATE_LIMIT.max.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    const requests = rateLimitMap.get(key) || [];
    const remaining = Math.max(0, RATE_LIMIT.max - requests.length);

    response.headers.set("X-RateLimit-Limit", RATE_LIMIT.max.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
