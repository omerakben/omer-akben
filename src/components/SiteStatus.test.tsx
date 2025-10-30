import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";

import SiteStatus from "@/components/SiteStatus";

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: toastMocks,
}));

describe("SiteStatus", () => {
  const originalFetch = global.fetch;
  const originalLocation = window.location;
  const cachesDescriptor = Object.getOwnPropertyDescriptor(window, "caches");
  let reloadMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    toastMocks.success.mockReset();
    toastMocks.error.mockReset();
    toastMocks.info.mockReset();
    window.localStorage.clear();
    window.sessionStorage.clear();
    reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        reload: reloadMock,
      } as unknown as Location,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    if (cachesDescriptor) {
      Object.defineProperty(window, "caches", cachesDescriptor);
    } else {
      delete (window as unknown as { caches?: unknown }).caches;
    }
  });

  const renderStatus = (props?: Partial<ComponentProps<typeof SiteStatus>>) =>
    render(
      <SiteStatus
        initialCachePref="performance"
        initialAcknowledged
        buildId="1234567abc"
        buildDate="2025-01-01T00:00:00.000Z"
        {...props}
      />
    );

  it("renders banner with cache mode details", () => {
    renderStatus();

    expect(screen.getByText(/under construction/i)).toBeInTheDocument();
    expect(screen.getByText(/uses caching with background refresh/i)).toBeInTheDocument();
  });

  it("switches to always fresh mode and calls the cache preference endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof global.fetch;

    renderStatus();

    const toggle = screen.getByRole("button", { name: /always fresh/i });
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ mode: "fresh" }),
        })
      );
    });

    expect(reloadMock).toHaveBeenCalled();
    expect(toastMocks.success).toHaveBeenCalledWith("Caching set to Always fresh");
  });

  it("clears cache storage and calls DELETE endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof global.fetch;
    const deleteSpy = vi.fn().mockResolvedValue(true);
    const keysSpy = vi.fn().mockResolvedValue(["app-cache"]);

    Object.defineProperty(window, "caches", {
      configurable: true,
      value: {
        keys: keysSpy,
        delete: deleteSpy,
      },
    });

    window.localStorage.setItem("example", "value");
    window.sessionStorage.setItem("example", "value");

    renderStatus();

    fireEvent.click(screen.getByRole("button", { name: /clear cache/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    await waitFor(() => {
      expect(keysSpy).toHaveBeenCalled();
    });

    expect(window.localStorage.getItem("example")).toBeNull();
    expect(window.sessionStorage.getItem("example")).toBeNull();
    expect(reloadMock).toHaveBeenCalled();
    expect(toastMocks.success).toHaveBeenCalledWith("Cache cleared. Reloading…");
  });

  it("acknowledges the modal and posts to the WIP endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof global.fetch;

    renderStatus({ initialAcknowledged: false });

    fireEvent.click(screen.getByRole("button", { name: /i understand/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/preferences/wip",
        expect.objectContaining({ method: "POST" })
      );
    });

    expect(reloadMock).toHaveBeenCalled();
    expect(toastMocks.success).toHaveBeenCalledWith("Thanks!", {
      description: "Preferences saved for this build.",
    });
  });
});
