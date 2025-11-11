/**
 * Next.js Middleware
 *
 * Handles rate limiting for API routes and applies Content Security Policy headers
 * to all responses. Generates cryptographic nonces for CSP script-src directives.
 *
 * @module middleware
 *
 * @features
 * - Rate limiting with Redis (Upstash) - tiered by route
 * - Content Security Policy with nonces for scripts
 * - Security headers (frame-ancestors, etc.)
 * - IP-based rate limit keying with x-forwarded-for support
 *
 * @example
 * ```ts
 * // Automatic middleware execution on all routes
 * // Rate limits applied to /api/* routes
 * // CSP headers applied to all responses
 * ```
 */

import { apiRateLimit, chatRateLimit, toolsRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

/**
 * Extracts rate limit key from request
 *
 * Uses x-forwarded-for header to identify client IP behind proxies (Vercel).
 * Falls back to "anonymous" if IP cannot be determined.
 *
 * @param request - Incoming Next.js request
 * @returns IP address or "anonymous"
 *
 * @example
 * ```ts
 * // Request with x-forwarded-for: "203.0.113.1, 198.51.100.1"
 * getRateLimitKey(request) // "203.0.113.1"
 *
 * // Request without x-forwarded-for
 * getRateLimitKey(request) // "anonymous"
 * ```
 */
function getRateLimitKey(request: NextRequest): string {
  // Use IP address from x-forwarded-for header or fallback to anonymous
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return ip;
}

/**
 * Next.js middleware function
 *
 * Executes on every request matching the config matcher.
 * Applies rate limiting to API routes and CSP headers to all routes.
 *
 * @param request - Incoming Next.js request
 * @returns NextResponse with rate limit/CSP headers or 429 error
 *
 * @remarks
 * Rate limit tiers:
 * - /api/chat: 30 req/min (chatRateLimit)
 * - /api/tools/*: 60 req/min (toolsRateLimit)
 * - Other /api/*: Standard limits (apiRateLimit)
 *
 * CSP differences by environment:
 * - Development: Allows unsafe-eval (for Turbopack HMR), unsafe-inline styles
 * - Production: Removes unsafe-eval, keeps unsafe-inline styles (required for Framer Motion/Radix)
 *
 * Security trade-off: unsafe-inline in style-src allows CSS injection but prevents JS execution
 * (script-src remains strict with nonce-only). Required for third-party animation libraries.
 */
export async function middleware(request: NextRequest) {
  // Generate cryptographic nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
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
  // In production: Allow unsafe-inline for style attributes (no nonce)
  // SECURITY TRADE-OFF: 'unsafe-inline' required for third-party libraries (Framer Motion, Radix UI)
  // that inject inline styles for animations/positioning. Script-src remains strict (nonce-only)
  // preventing code execution. Attack surface: CSS injection possible, but no JS execution.
  // CSP Spec: When nonce is present in style-src, 'unsafe-inline' is IGNORED per CSP Level 3.
  // Solution: Remove nonce from style-src to allow inline style attributes while keeping script-src strict.
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com ${isDevelopment ? "'unsafe-eval'" : ""}`,
    isDevelopment
      ? "style-src 'self' 'unsafe-inline'" // Dev: Allow Turbopack HMR
      : "style-src 'self' 'unsafe-inline'", // Prod: Allow inline styles (nonce removed - see comment above)
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    `connect-src 'self' https://api.openai.com https://vercel-insights.com https://*.vercel-analytics.com https://va.vercel-scripts.com https://*.i.posthog.com https://*.posthog.com ${isDevelopment ? "wss://localhost:* ws://localhost:*" : ""}`.trim(),
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

/**
 * Middleware configuration
 *
 * Matcher pattern applies middleware to all routes except Next.js internals.
 * Excludes _next/static, _next/image, and favicon.ico.
 */
export const config = {
  matcher: [
    // Apply to all routes for nonce generation
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
