import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { generate, primary, fallback, limit } = vi.hoisted(() => ({
  generate: vi.fn(),
  primary: { provider: "xai" },
  fallback: { provider: "openai" },
  limit: vi.fn(),
}));
vi.mock("@/lib/rate-limit", () => ({ textEditorRateLimit: { limit } }));
vi.mock("ai", () => ({ generateText: generate }));
vi.mock("@ai-sdk/xai", () => ({ xai: () => primary }));
vi.mock("@ai-sdk/openai", () => ({ openai: { chat: () => fallback } }));

function request(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3001/api/text-editor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/text-editor", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    limit.mockResolvedValue({ success: true });
    vi.stubEnv("XAI_API_KEY", "");
    vi.stubEnv("OPENAI_API_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("imports without credentials and returns 503 for a valid request", async () => {
    const { POST } = await import("@/app/api/text-editor/route");

    const response = await POST(request({ text: "Hello", operation: "shorten" }));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      success: false,
      error: "Text editing is temporarily unavailable.",
    });
    expect(generate).not.toHaveBeenCalled();
  });

  it.each([
    { text: "", operation: "shorten" },
    { text: "Hello", operation: "custom" },
  ])("validates requests before checking credentials: %j", async (body) => {
    const { POST } = await import("@/app/api/text-editor/route");

    const response = await POST(request(body));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ success: false });
    expect(generate).not.toHaveBeenCalled();
  });

  it("reads credentials at request time and returns the edited text", async () => {
    const { POST } = await import("@/app/api/text-editor/route");
    vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
    generate.mockResolvedValue({ text: "  Hello!  " });

    const response = await POST(request({ text: "Hello there!", operation: "shorten" }));

    expect(generate).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      data: { original: "Hello there!", edited: "Hello!", operation: "shorten" },
    });
  });
  it("prefers xAI without requiring the broken OpenAI credential", async () => {
    vi.stubEnv("XAI_API_KEY", "test-placeholder");
    generate.mockResolvedValue({ text: "Hello!" });
    const { POST } = await import("@/app/api/text-editor/route");
    const response = await POST(request({ text: "Hello there!", operation: "shorten" }));
    expect(response.status).toBe(200);
    expect(generate).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      model: primary, maxOutputTokens: 1000, maxRetries: 0,
    }));
  });

  it("falls back without logging provider error details", async () => {
    vi.stubEnv("XAI_API_KEY", "test-placeholder");
    vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    generate.mockRejectedValueOnce(new Error("sensitive-provider-response"))
      .mockResolvedValueOnce({ text: "Edited" });
    const { POST } = await import("@/app/api/text-editor/route");
    const response = await POST(request({ text: "Hello there!", operation: "shorten" }));
    expect(response.status).toBe(200);
    expect(generate.mock.calls.map(([options]) => options.model)).toEqual([primary, fallback]);
    expect(JSON.stringify(warn.mock.calls)).not.toContain("sensitive-provider-response");
    warn.mockRestore();
  });

  it("returns a safe 503 when all providers fail or return empty text", async () => {
    vi.stubEnv("XAI_API_KEY", "test-placeholder");
    vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    generate.mockRejectedValueOnce(new Error("sensitive-provider-response"))
      .mockResolvedValueOnce({ text: "  " });
    const { POST } = await import("@/app/api/text-editor/route");
    const response = await POST(request({ text: "Hello there!", operation: "shorten" }));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ success: false, error: "Text editing is temporarily unavailable." });
    warn.mockRestore();
  });

  it("does not call a provider when rate limited", async () => {
    limit.mockResolvedValue({ success: false, limit: 10, remaining: 0, reset: Date.now() });
    vi.stubEnv("XAI_API_KEY", "test-placeholder");
    const { POST } = await import("@/app/api/text-editor/route");
    const response = await POST(request({ text: "Hello there!", operation: "shorten" }));
    expect(response.status).toBe(429);
    expect(generate).not.toHaveBeenCalled();
  });

});
