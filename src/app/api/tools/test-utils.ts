/**
 * Test Utilities for API Route Testing
 *
 * Provides reusable helpers for testing Next.js App Router API routes
 * including mock request/response factories and common test patterns.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Creates a mock NextRequest object for testing API routes
 *
 * @param data - Request body data to be JSON stringified
 * @param options - Optional request configuration
 * @returns Mock NextRequest instance
 *
 * @example
 * ```ts
 * const req = createMockRequest({ slug: "ai-agent" });
 * const response = await POST(req);
 * ```
 */
export function createMockRequest(
  data: unknown,
  options?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
  }
): NextRequest {
  const url = options?.url || "http://localhost:3001/api/tools/test";
  const method = options?.method || "POST";
  const headers = options?.headers || { "Content-Type": "application/json" };

  return new NextRequest(url, {
    method,
    headers,
    body: JSON.stringify(data),
  });
}

/**
 * Extracts and parses JSON from Response or NextResponse
 *
 * @param response - Response or NextResponse from API route
 * @returns Parsed JSON data
 *
 * @example
 * ```ts
 * const response = await POST(req);
 * const json = await getResponseJson(response);
 * expect(json.success).toBe(true);
 * ```
 */
export async function getResponseJson(
  response: Response | NextResponse
): Promise<unknown> {
  const text = await response.text();
  return JSON.parse(text);
}

/**
 * Standard API response type for tool routes
 *
 * All tool routes return this structure for consistency
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Type guard for successful API responses
 *
 * @param response - API response object
 * @returns True if response is successful
 *
 * @example
 * ```ts
 * const json = await getResponseJson(response);
 * if (isSuccessResponse(json)) {
 *   // TypeScript knows json.data exists
 *   console.log(json.data);
 * }
 * ```
 */
export function isSuccessResponse<T>(
  response: unknown
): response is ApiResponse<T> & { success: true; data: T } {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === true &&
    "data" in response
  );
}

/**
 * Type guard for error API responses
 *
 * @param response - API response object
 * @returns True if response is an error
 *
 * @example
 * ```ts
 * const json = await getResponseJson(response);
 * if (isErrorResponse(json)) {
 *   // TypeScript knows json.error exists
 *   console.error(json.error);
 * }
 * ```
 */
export function isErrorResponse(
  response: unknown
): response is ApiResponse & { success: false; error: string } {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false &&
    "error" in response &&
    typeof (response as { error?: unknown }).error === "string"
  );
}

/**
 * Creates a mock GET request (for routes that accept query params)
 *
 * @param params - Query parameters as key-value pairs
 * @param options - Optional request configuration
 * @returns Mock NextRequest instance
 *
 * @example
 * ```ts
 * const req = createMockGetRequest({ type: "embedding", days: "7" });
 * const response = await GET(req);
 * ```
 */
export function createMockGetRequest(
  params: Record<string, string>,
  options?: {
    baseUrl?: string;
    headers?: Record<string, string>;
  }
): NextRequest {
  const baseUrl = options?.baseUrl || "http://localhost:3001/api/test";
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const headers = options?.headers || {};

  return new NextRequest(url.toString(), {
    method: "GET",
    headers,
  });
}
