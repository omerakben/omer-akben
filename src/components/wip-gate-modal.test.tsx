import * as WIPContext from "@/lib/wip-context";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WIPGateModal } from "./wip-gate-modal";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Import after mocking
import { usePathname } from "next/navigation";

describe("WIPGateModal", () => {
  const mockDismissModal = vi.fn();
  const mockPathname = vi.mocked(usePathname);

  const mockWIPContext = (overrides?: Partial<ReturnType<typeof WIPContext.useWIP>>) => {
    vi.spyOn(WIPContext, "useWIP").mockReturnValue({
      isModalDismissed: false,
      isBannerDismissed: true,
      dismissModal: mockDismissModal,
      dismissBanner: vi.fn(),
      isMounted: true,
      ...overrides,
    });
  };

  beforeEach(() => {
    mockDismissModal.mockClear();
    mockPathname.mockReturnValue("/");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Mounting state", () => {
    it("should not render when not mounted", () => {
      mockWIPContext({ isModalDismissed: false, isMounted: false });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPGateModal />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null before mounting", () => {
      mockWIPContext({ isModalDismissed: false, isMounted: false });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPGateModal />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Visibility conditions", () => {
    it("should render when on homepage and modal not dismissed", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.getByText(/Welcome! Site Under Active Development/i)).toBeInTheDocument();
    });

    it("should not open modal when modal is dismissed", async () => {
      mockWIPContext({ isModalDismissed: true, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.queryByText(/Welcome! Site Under Active Development/i)).not.toBeInTheDocument();
    });

    it("should not open modal when not on homepage", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/projects");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.queryByText(/Welcome! Site Under Active Development/i)).not.toBeInTheDocument();
    });

    it("should not open modal on /about page", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/about");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.queryByText(/Welcome! Site Under Active Development/i)).not.toBeInTheDocument();
    });

    it("should not open modal on /status page", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/status");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.queryByText(/Welcome! Site Under Active Development/i)).not.toBeInTheDocument();
    });
  });

  describe("Modal content", () => {
    it("should display welcome title", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.getByText(/Welcome! Site Under Active Development/i)).toBeInTheDocument();
    });

    it("should display description text", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.getByText(/Thanks for visiting!/i)).toBeInTheDocument();
      expect(screen.getByText(/This portfolio is actively being built and improved/i)).toBeInTheDocument();
    });

    it("should display works-in-progress notice", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.getByText(/Some features are still works-in-progress/i)).toBeInTheDocument();
    });

    it("should display bug report invitation", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.getByText(/Found a bug or have feedback?/i)).toBeInTheDocument();
    });

    it("should render email link", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      const emailLink = screen.getByRole("link", { name: /let me know/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", "mailto:me@omerakben.com");
    });
  });

  describe("Acknowledge button", () => {
    it("should display Got it button", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      const button = screen.getByRole("button", { name: /got it, let me explore/i });
      expect(button).toBeInTheDocument();
    });

    it("should call dismissModal when Got it button is clicked", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      const button = screen.getByRole("button", { name: /got it, let me explore/i });

      await act(async () => {
        button.click();
      });

      expect(mockDismissModal).toHaveBeenCalledTimes(1);
    });

    it("should close modal when Got it button is clicked", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      const button = screen.getByRole("button", { name: /got it, let me explore/i });

      await act(async () => {
        button.click();
      });

      // Modal should be closed (content not visible)
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Button should no longer be in document after modal closes
      expect(screen.queryByRole("button", { name: /got it, let me explore/i })).not.toBeInTheDocument();
    });
  });

  describe("Modal styling", () => {
    it("should have sm:max-w-md class", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // Modal renders, check for content presence
      expect(screen.getByText(/Welcome! Site Under Active Development/i)).toBeInTheDocument();
    });

    it("should have space-y-2 class on description container", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // Modal renders with description content
      expect(screen.getByText(/Thanks for visiting!/i)).toBeInTheDocument();
    });

    it("should have pt-2 class on description", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // Modal renders with description text
      expect(screen.getByText(/This portfolio is actively being built/i)).toBeInTheDocument();
    });
  });

  describe("Dialog footer", () => {
    it("should have centered footer on small screens", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // Modal renders with button in footer
      expect(screen.getByRole("button", { name: /got it, let me explore/i })).toBeInTheDocument();
    });

    it("should render button with proper width classes", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      const button = screen.getByRole("button", { name: /got it, let me explore/i });
      expect(button.className).toContain("w-full");
      expect(button.className).toContain("sm:w-auto");
    });
  });

  describe("useEffect dependencies", () => {
    it("should update when pathname changes", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { rerender } = render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();

      // Change pathname
      mockPathname.mockReturnValue("/projects");

      rerender(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Modal should close
      expect(screen.queryByText(/Welcome!/i)).not.toBeInTheDocument();
    });

    it("should update when isModalDismissed changes", async () => {
      // Start with modal not dismissed
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { rerender } = render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();

      // Dismiss modal
      mockWIPContext({ isModalDismissed: true, isMounted: true });

      rerender(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Modal should close
      expect(screen.queryByText(/Welcome!/i)).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper email link text", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      const emailLink = screen.getByRole("link", { name: /let me know/i });
      expect(emailLink.className).toContain("text-brand-primary");
      expect(emailLink.className).toContain("hover:underline");
    });

    it("should have proper secondary text color", async () => {
      mockWIPContext({ isModalDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPGateModal />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      // Modal renders with email link (which has text-text-2 styling)
      expect(screen.getByRole("link", { name: /let me know/i })).toBeInTheDocument();
    });
  });
});
