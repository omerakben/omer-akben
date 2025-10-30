import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/example/route";

describe("/api/example", () => {
  it("returns no-store when preference is fresh", async () => {
    const request = new NextRequest("http://localhost/api/example", {
      headers: {
        cookie: "ozzy_cache_pref=fresh",
      },
    });

    const response = await GET(request);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const data = await response.json();
    expect(data.pref).toBe("fresh");
  });

  it("defaults to performance caching", async () => {
    const request = new NextRequest("http://localhost/api/example");
    const response = await GET(request);

    expect(response.headers.get("Cache-Control")).toBe(
      "s-maxage=60, stale-while-revalidate=120"
    );
    const data = await response.json();
    expect(data.pref).toBe("performance");
  });
});
