import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE, POST } from "@/app/api/preferences/cache/route";

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: () => cookieStore,
}));

describe("/api/preferences/cache", () => {
  beforeEach(() => {
    cookieStore.get.mockReset();
    cookieStore.set.mockReset();
  });

  it("sets cache preference and disables caching", async () => {
    const request = new NextRequest("http://localhost/api/preferences/cache", {
      method: "POST",
      body: JSON.stringify({ mode: "performance" }),
    });

    const response = await POST(request);

    expect(cookieStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "ozzy_cache_pref",
        value: "performance",
      })
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("clears cookies on DELETE", async () => {
    const response = await DELETE();

    expect(cookieStore.set).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: "ozzy_cache_pref",
        maxAge: 0,
      })
    );
    expect(cookieStore.set).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: "ozzy_wip_ack",
        maxAge: 0,
      })
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
