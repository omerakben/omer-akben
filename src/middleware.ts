import { apiRateLimit, chatRateLimit, toolsRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

function getRateLimitKey(request: NextRequest): string {
  // Use IP address from x-forwarded-for header or fallback to anonymous
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return ip;
}

export async function middleware(request: NextRequest) {
  // Generate cryptographic nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
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
      response.headers.set(
        "X-RateLimit-Remaining",
        result.remaining.toString()
      );
      response.headers.set("X-RateLimit-Reset", result.reset.toString());

      // Add nonce header for CSP
      response.headers.set("x-nonce", nonce);

      return response;
    }
  }

  // Add nonce header and CSP to all responses
  const response = NextResponse.next();
  response.headers.set("x-nonce", nonce);

  // Detect development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  // Set Content Security Policy with nonce (replaces next.config.ts CSP)
  // In development: Allow unsafe-inline for Turbopack HMR style injection
  // In production: Nonce-based for <style> tags + 'unsafe-inline' for inline style attributes
  // SECURITY TRADE-OFF: 'unsafe-inline' required for third-party libraries (Framer Motion, Radix UI)
  // that inject inline styles for animations/positioning. Script-src remains strict (nonce-only)
  // preventing code execution. Attack surface: CSS injection possible, but no JS execution.
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com ${isDevelopment ? "'unsafe-eval'" : ""}`,
    isDevelopment
      ? "style-src 'self' 'unsafe-inline'" // Dev: Allow Turbopack HMR
      : `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`, // Prod: Nonce for <style> tags + unsafe-inline for attributes
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    `connect-src 'self' https://api.openai.com https://vercel-insights.com https://*.vercel-analytics.com https://va.vercel-scripts.com ${isDevelopment ? "wss://localhost:* ws://localhost:*" : ""}`.trim(),
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes for nonce generation
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
