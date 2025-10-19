import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit, chatRateLimit, toolsRateLimit } from "@/lib/rate-limit";

function getRateLimitKey(request: NextRequest): string {
  // Use IP address from x-forwarded-for header or fallback to anonymous
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return ip;
}

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = getRateLimitKey(request);

    // Select rate limiter based on route
    let rateLimit;
    if (request.nextUrl.pathname.startsWith("/api/chat")) {
      rateLimit = chatRateLimit;
    } else if (request.nextUrl.pathname.startsWith("/api/tools/")) {
      rateLimit = toolsRateLimit;
    } else {
      rateLimit = apiRateLimit;
    }

    // Apply rate limiting if Redis is configured
    if (rateLimit) {
      const result = await rateLimit.limit(ip);

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
              "X-RateLimit-Limit": result.limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": result.reset.toString(),
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Limit", result.limit.toString());
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
      response.headers.set("X-RateLimit-Reset", result.reset.toString());

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
