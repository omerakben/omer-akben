import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import SiteStatus from "./SiteStatus";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("sonner", () => ({
  toast: Object.assign(() => undefined, { error: vi.fn() }),
}));

const originalLocation = window.location;

describe("SiteStatus", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        reload: vi.fn(),
      },
      configurable: true,
      writable: true,
    });

    document.cookie = "ozzy_wip_ack=dev";
    window.localStorage.clear();
    window.sessionStorage?.clear();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    ) as unknown as typeof fetch;

    pushMock.mockClear();
    refreshMock.mockClear();
  });

  test("renders banner and toggles cache preference", async () => {
    const user = userEvent.setup();
    render(<SiteStatus initialCachePref="performance" />);

    const freshButton = await screen.findByRole("button", { name: "Always fresh" });
    await user.click(freshButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ mode: "fresh" }),
        })
      );
    });

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test("clears cache and preferences", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("foo", "bar");
    window.sessionStorage?.setItem("baz", "qux");

    render(<SiteStatus initialCachePref="performance" />);

    const clearButton = await screen.findByRole("button", { name: /Clear cache/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/preferences/cache",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });

    expect(window.localStorage.getItem("foo")).toBeNull();
    expect(window.sessionStorage?.getItem("baz")).toBeNull();
  });
});

afterAll(() => {
  Object.defineProperty(window, "location", {
    value: originalLocation,
    configurable: true,
  });
});
