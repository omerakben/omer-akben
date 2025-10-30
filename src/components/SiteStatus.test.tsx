import { BUILD_ID } from "@/lib/build";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import SiteStatus from "@/components/SiteStatus";

declare global {
  var ResizeObserver: typeof window.ResizeObserver;
}

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.ResizeObserver = ResizeObserverMock as unknown as typeof window.ResizeObserver;
});

const mockCaches = () => {
  const keys = vi.fn().mockResolvedValue<string[]>([]);
  const del = vi.fn().mockResolvedValue(true);
  Object.defineProperty(window, "caches", {
    value: {
      keys,
      delete: del,
    },
    configurable: true,
  });
  return { keys, del };
};

beforeEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
  mockCaches();
  Object.defineProperty(window, "location", {
    value: {
      reload: vi.fn(),
    },
    writable: true,
    configurable: true,
  });
  global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 }) as unknown as typeof fetch;
});

describe("SiteStatus", () => {
  it("renders banner and toggles cache preference", async () => {
    render(
      <SiteStatus
        initialCachePref="performance"
        acknowledgedBuildId={BUILD_ID}
      />
    );

    expect(screen.getByText(/Under construction/i)).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Always fresh/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    expect(JSON.parse((global.fetch as vi.Mock).mock.calls[0][1]?.body as string)).toEqual({ mode: "fresh" });
    expect((window.location.reload as unknown as vi.Mock).mock.calls).toHaveLength(1);
  });

  it("clears cache and resets storage", async () => {
    const { keys, del } = mockCaches();
    keys.mockResolvedValue(["prefetch"]);
    window.localStorage.setItem("to-clear", "1");
    window.sessionStorage.setItem("to-clear", "1");

    render(
      <SiteStatus
        initialCachePref="fresh"
        acknowledgedBuildId={BUILD_ID}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Clear cache/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    await waitFor(() => {
      expect(keys).toHaveBeenCalled();
      expect(del).toHaveBeenCalledWith("prefetch");
      expect(window.localStorage.getItem("to-clear")).toBeNull();
      expect(window.sessionStorage.getItem("to-clear")).toBeNull();
      expect((window.location.reload as unknown as vi.Mock).mock.calls).toHaveLength(1);
    });
  });

  it("shows modal when acknowledgement is missing", () => {
    render(
      <SiteStatus
        initialCachePref="performance"
        acknowledgedBuildId={null}
      />
    );

    expect(
      screen.getByRole("heading", { name: /Welcome to the public build/i })
    ).toBeInTheDocument();
  });
});
