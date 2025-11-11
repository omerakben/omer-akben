import { act, render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WIPProvider, useWIP } from "./wip-context";

process.env.NEXT_PUBLIC_GIT_SHA = "testsha";
const TEST_BANNER_KEY = `wip_banner_dismissed:${process.env.NEXT_PUBLIC_GIT_SHA ?? "local"}`;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("WIPContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("useWIP hook", () => {
    it("should throw error when used outside WIPProvider", () => {
      // Suppress console.error for this test
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useWIP());
      }).toThrow("useWIP must be used within WIPProvider");

      consoleError.mockRestore();
    });

    it("should return context value when used within WIPProvider", () => {
      const { result } = renderHook(() => useWIP(), {
        wrapper: WIPProvider,
      });

      expect(result.current).toHaveProperty("isModalDismissed");
      expect(result.current).toHaveProperty("isBannerDismissed");
      expect(result.current).toHaveProperty("dismissModal");
      expect(result.current).toHaveProperty("dismissBanner");
      expect(result.current).toHaveProperty("isMounted");
    });
  });

  describe("WIPProvider", () => {
    describe("Mounting state", () => {
      it("should set isMounted to true after mounting", async () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isMounted).toBe(true);
      });
    });

    describe("Initial state (first visit behavior)", () => {
      it("should show modal on first visit (null localStorage)", () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        expect(result.current.isModalDismissed).toBe(false);
      });

      it("should show banner on first visit (null localStorage)", () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        expect(result.current.isBannerDismissed).toBe(false);
      });
    });

    describe("localStorage persistence - Modal", () => {
      it("should load modal dismissed state from localStorage on mount", async () => {
        localStorageMock.setItem("wip_modal_dismissed", "false");

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isModalDismissed).toBe(false);
        expect(localStorageMock.getItem).toHaveBeenCalledWith(
          "wip_modal_dismissed"
        );
      });

      it("should save modal dismissed state to localStorage when dismissModal is called", async () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissModal();
        });

        expect(result.current.isModalDismissed).toBe(true);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "wip_modal_dismissed",
          "true"
        );
      });

      it("should handle localStorage getItem error gracefully for modal", async () => {
        const consoleError = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        localStorageMock.getItem.mockImplementationOnce(() => {
          throw new Error("localStorage error");
        });

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        // Should remain with default state
        expect(result.current.isModalDismissed).toBe(true);
        expect(consoleError).toHaveBeenCalledWith(
          "[WIPContext] Failed to load persisted state:",
          expect.any(Error)
        );

        consoleError.mockRestore();
      });

      it("should handle localStorage setItem error gracefully for modal", async () => {
        const consoleError = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        localStorageMock.setItem.mockImplementationOnce(() => {
          throw new Error("localStorage error");
        });

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissModal();
        });

        // State should still update even if persistence fails
        expect(result.current.isModalDismissed).toBe(true);
        expect(consoleError).toHaveBeenCalledWith(
          "[WIPContext] Failed to persist modal dismissal:",
          expect.any(Error)
        );

        consoleError.mockRestore();
      });
    });

    describe("localStorage persistence - Banner", () => {
      it("should load banner dismissed state from localStorage on mount", async () => {
        localStorageMock.setItem(TEST_BANNER_KEY, "false");

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isBannerDismissed).toBe(false);
        expect(localStorageMock.getItem).toHaveBeenCalledWith(
          TEST_BANNER_KEY
        );
      });

      it("should save banner dismissed state to localStorage when dismissBanner is called", async () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissBanner();
        });

        expect(result.current.isBannerDismissed).toBe(true);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          TEST_BANNER_KEY,
          "true"
        );
      });

      it("should handle localStorage getItem error gracefully for banner", async () => {
        const consoleError = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        localStorageMock.getItem.mockImplementationOnce(() => {
          throw new Error("localStorage error");
        });

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        // Should remain with default state
        expect(result.current.isBannerDismissed).toBe(true);
        expect(consoleError).toHaveBeenCalledWith(
          "[WIPContext] Failed to load persisted state:",
          expect.any(Error)
        );

        consoleError.mockRestore();
      });

      it("should handle localStorage setItem error gracefully for banner", async () => {
        const consoleError = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        localStorageMock.setItem.mockImplementationOnce(() => {
          throw new Error("localStorage error");
        });

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissBanner();
        });

        // State should still update even if persistence fails
        expect(result.current.isBannerDismissed).toBe(true);
        expect(consoleError).toHaveBeenCalledWith(
          "[WIPContext] Failed to persist banner dismissal:",
          expect.any(Error)
        );

        consoleError.mockRestore();
      });
    });

    describe("localStorage parsing", () => {
      it("should correctly parse 'true' string from localStorage for modal", async () => {
        localStorageMock.setItem("wip_modal_dismissed", "true");

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isModalDismissed).toBe(true);
      });

      it("should correctly parse 'false' string from localStorage for modal", async () => {
        localStorageMock.setItem("wip_modal_dismissed", "false");

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isModalDismissed).toBe(false);
      });

      it("should correctly parse 'true' string from localStorage for banner", async () => {
        localStorageMock.setItem(TEST_BANNER_KEY, "true");

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isBannerDismissed).toBe(true);
      });

      it("should correctly parse 'false' string from localStorage for banner", async () => {
        localStorageMock.setItem(TEST_BANNER_KEY, "false");

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isBannerDismissed).toBe(false);
      });
    });

    describe("Children rendering", () => {
      it("should render children components", () => {
        const TestChild = () => <div data-testid="test-child">Test Child</div>;

        const { getByTestId } = render(
          <WIPProvider>
            <TestChild />
          </WIPProvider>
        );

        expect(getByTestId("test-child")).toBeInTheDocument();
      });
    });

    describe("Multiple dismissals", () => {
      it("should remain dismissed after multiple dismissModal calls", async () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissModal();
          result.current.dismissModal();
          result.current.dismissModal();
        });

        expect(result.current.isModalDismissed).toBe(true);
        // Should still only persist once per call
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
      });

      it("should remain dismissed after multiple dismissBanner calls", async () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissBanner();
          result.current.dismissBanner();
          result.current.dismissBanner();
        });

        expect(result.current.isBannerDismissed).toBe(true);
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
      });
    });

    describe("Independent state management", () => {
      it("should manage modal and banner state independently", async () => {
        localStorageMock.setItem("wip_modal_dismissed", "true");
        localStorageMock.setItem(TEST_BANNER_KEY, "false");

        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current.isModalDismissed).toBe(true);
        expect(result.current.isBannerDismissed).toBe(false);
      });

      it("dismissModal should not affect banner state", async () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissModal();
        });

        expect(result.current.isModalDismissed).toBe(true);
        expect(result.current.isBannerDismissed).toBe(false); // Should remain default (first visit)
      });

      it("dismissBanner should not affect modal state", async () => {
        const { result } = renderHook(() => useWIP(), {
          wrapper: WIPProvider,
        });

        await act(async () => {
          result.current.dismissBanner();
        });

        expect(result.current.isBannerDismissed).toBe(true);
        expect(result.current.isModalDismissed).toBe(false); // Should remain default (first visit)
      });
    });
  });
});
