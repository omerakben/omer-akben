import { describe, expect, test, vi, beforeEach } from "vitest";

import { GET as exampleGet } from "./route";
import { DELETE as clearCache, POST as setCache } from "../preferences/cache/route";
import { POST as acknowledgeWip } from "../preferences/wip/route";

const getMock = vi.fn();
const setMock = vi.fn();
const deleteMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: getMock,
    set: setMock,
    delete: deleteMock,
  }),
}));

describe("API cache preferences", () => {
  beforeEach(() => {
    getMock.mockReset();
    setMock.mockReset();
    deleteMock.mockReset();
  });

  test("example route returns performance caching headers by default", async () => {
    getMock.mockReturnValue(undefined);

    const response = await exampleGet();
    const json = await response.json();

    expect(json.pref).toBe("performance");
    expect(response.headers.get("Cache-Control")).toBe(
      "s-maxage=60, stale-while-revalidate=120"
    );
  });

  test("example route respects fresh preference", async () => {
    getMock.mockReturnValue({ value: "fresh" });

    const response = await exampleGet();

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  test("preference routes always return no-store", async () => {
    getMock.mockReturnValue({ value: "performance" });

    const setResponse = await setCache(
      new Request("http://localhost/api/preferences/cache", {
        method: "POST",
        body: JSON.stringify({ mode: "fresh" }),
      })
    );
    const ackResponse = await acknowledgeWip(new Request("http://localhost"));
    const deleteResponse = await clearCache(new Request("http://localhost", { method: "DELETE" }));

    expect(setResponse.headers.get("Cache-Control")).toBe("no-store");
    expect(ackResponse.headers.get("Cache-Control")).toBe("no-store");
    expect(deleteResponse.headers.get("Cache-Control")).toBe("no-store");
    expect(setMock).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledWith("ozzy_cache_pref");
    expect(deleteMock).toHaveBeenCalledWith("ozzy_wip_ack");
  });
});
