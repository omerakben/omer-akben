import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("/api/example", () => {
  it("uses performance cache headers by default", async () => {
    const request = new NextRequest("http://localhost/api/example");
    const response = await GET(request);

    expect(response.headers.get("Cache-Control")).toBe(
      "s-maxage=60, stale-while-revalidate=120"
    );
    const json = await response.json();
    expect(json.pref).toBe("performance");
  });

  it("returns no-store when preference is fresh", async () => {
    const request = new NextRequest("http://localhost/api/example", {
      headers: {
        cookie: "ozzy_cache_pref=fresh",
      },
    });
    const response = await GET(request);

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const json = await response.json();
    expect(json.pref).toBe("fresh");
  });
});
