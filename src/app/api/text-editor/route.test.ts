import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createCompletion, constructClient } = vi.hoisted(() => ({
  createCompletion: vi.fn(),
  constructClient: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({ textEditorRateLimit: null }));
vi.mock("openai", () => {
  class OpenAI {
    static APIError = class extends Error {};
    chat = { completions: { create: createCompletion } };

    constructor(options: { apiKey: string }) {
      constructClient(options);
    }
  }
  return { default: OpenAI };
});

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
    vi.clearAllMocks();
    vi.stubEnv("OPENAI_API_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("imports without credentials and returns 503 for a valid request", async () => {
    const { POST } = await import("@/app/api/text-editor/route");
    expect(constructClient).not.toHaveBeenCalled();

    const response = await POST(request({ text: "Hello", operation: "shorten" }));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      success: false,
      error: "Text editing is temporarily unavailable.",
    });
    expect(constructClient).not.toHaveBeenCalled();
    expect(createCompletion).not.toHaveBeenCalled();
  });

  it.each([
    { text: "", operation: "shorten" },
    { text: "Hello", operation: "custom" },
  ])("validates requests before checking credentials: %j", async (body) => {
    const { POST } = await import("@/app/api/text-editor/route");

    const response = await POST(request(body));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ success: false });
    expect(constructClient).not.toHaveBeenCalled();
    expect(createCompletion).not.toHaveBeenCalled();
  });

  it("reads credentials at request time and returns the edited text", async () => {
    const { POST } = await import("@/app/api/text-editor/route");
    vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
    createCompletion.mockResolvedValue({
      choices: [{ message: { content: "  Hello!  " } }],
    });

    const response = await POST(request({ text: "Hello there!", operation: "shorten" }));

    expect(constructClient).toHaveBeenCalledWith({ apiKey: "test-placeholder" });
    expect(createCompletion).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      data: { original: "Hello there!", edited: "Hello!", operation: "shorten" },
    });
  });
});
