import { describe, expect, it, vi } from "vitest";

const PERFORMANCE_HEADER = "s-maxage=60, stale-while-revalidate=120";

describe("GET /api/example", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unmock("next/headers");
  });

  it("defaults to performance caching when no cookie is set", async () => {
    vi.doMock("next/headers", () => ({
      cookies: () => ({
        get: () => undefined,
      }),
    }));

    const { GET } = await import("./route");
    const response = await GET();
    const data = await response.json();

    expect(response.headers.get("Cache-Control")).toBe(PERFORMANCE_HEADER);
    expect(data.pref).toBe("performance");
  });

  it("honours the fresh preference", async () => {
    vi.doMock("next/headers", () => ({
      cookies: () => ({
        get: (name: string) =>
          name === "ozzy_cache_pref" ? { value: "fresh" } : undefined,
      }),
    }));

    const { GET } = await import("./route");
    const response = await GET();
    const data = await response.json();

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(data.pref).toBe("fresh");
  });
});
