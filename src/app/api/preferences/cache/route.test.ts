import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { DELETE, POST } from "./route";

describe("/api/preferences/cache", () => {
  it("sets cache preference cookie and disables caching", async () => {
    const request = new NextRequest("http://localhost/api/preferences/cache", {
      method: "POST",
      body: JSON.stringify({ mode: "fresh" }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("ozzy_cache_pref=fresh");
  });

  it("clears cookies on DELETE", async () => {
    const response = await DELETE();

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("ozzy_cache_pref=");
    expect(setCookie).toContain("ozzy_wip_ack=");
  });
});
