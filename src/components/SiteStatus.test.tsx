import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SiteStatus from "@/components/SiteStatus";
import { BUILD_ID } from "@/lib/build";

type FetchMock = typeof fetch;

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

describe("SiteStatus", () => {
  const originalFetch = global.fetch;
  const originalCaches = (global as unknown as { caches?: CacheStorage }).caches;

  beforeEach(() => {
    vi.restoreAllMocks();
    document.cookie = "ozzy_wip_ack=dev";
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalCaches) {
      (global as unknown as { caches?: CacheStorage }).caches = originalCaches;
    } else {
      delete (global as unknown as { caches?: CacheStorage }).caches;
    }
  });

  it("renders the status banner", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 200 }))
    ) as FetchMock;

    render(<SiteStatus initialCachePref="performance" />);

    await waitFor(() => {
      expect(screen.getByText(/Under construction/i)).toBeInTheDocument();
    });
  });

  it("toggles cache preference via the API", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 200 }))
    );
    global.fetch = fetchMock as FetchMock;

    render(<SiteStatus initialCachePref="performance" />);

    const toggleButton = await screen.findByRole("button", {
      name: "Performance",
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ mode: "fresh" }),
        })
      );
    });
  });

  it("clears cache state and removes stored banner preferences", async () => {
    const bannerKey = `ozzy_wip_banner_${BUILD_ID}`;
    const customKey = "ozzy-test-key";

    const fetchMock = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 200 }))
    );
    global.fetch = fetchMock as FetchMock;

    (global as unknown as { caches?: CacheStorage }).caches = {
      keys: vi.fn().mockResolvedValue([]),
      delete: vi.fn().mockResolvedValue(true),
    } as unknown as CacheStorage;

    render(<SiteStatus initialCachePref="performance" />);

    const clearButton = await screen.findByRole("button", { name: "Clear cache" });

    window.localStorage.setItem(bannerKey, "dismissed");
    window.localStorage.setItem(customKey, "value");
    window.sessionStorage.setItem(customKey, "value");

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    expect(window.localStorage.getItem(bannerKey)).toBeNull();
    expect(window.localStorage.getItem(customKey)).toBeNull();
    expect(window.sessionStorage.getItem(customKey)).toBeNull();
  });
});
