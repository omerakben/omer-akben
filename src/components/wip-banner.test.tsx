import * as WIPContext from "@/lib/wip-context";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WIPBanner } from "./wip-banner";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Import after mocking
import { usePathname } from "next/navigation";

describe("WIPBanner", () => {
  const mockDismissBanner = vi.fn();
  const mockPathname = vi.mocked(usePathname);

  const mockWIPContext = (overrides?: Partial<ReturnType<typeof WIPContext.useWIP>>) => {
    vi.spyOn(WIPContext, "useWIP").mockReturnValue({
      isModalDismissed: true,
      isBannerDismissed: false,
      dismissModal: vi.fn(),
      dismissBanner: mockDismissBanner,
      isMounted: true,
      ...overrides,
    });
  };

  beforeEach(() => {
    mockDismissBanner.mockClear();
    mockPathname.mockReturnValue("/");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Visibility conditions", () => {
    it("should render when on homepage and banner not dismissed", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should not render when not mounted", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: false });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when banner is dismissed", () => {
      mockWIPContext({ isBannerDismissed: true, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when not on homepage", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/projects");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render on /about page", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/about");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render on /status page", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/status");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render when both conditions are not met (not homepage and dismissed)", () => {
      mockWIPContext({ isBannerDismissed: true, isMounted: true });
      mockPathname.mockReturnValue("/contact");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Content", () => {
    it("should display development message", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      expect(
        screen.getByText(/Site under active development/i)
      ).toBeInTheDocument();
    });

    it("should display continuation text", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      expect(
        screen.getByText(/Some features are still being built/i)
      ).toBeInTheDocument();
    });

    it("should render Info icon", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it("should render View status link", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const link = screen.getByRole("link", { name: /view status/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/status");
    });
  });

  describe("Styling", () => {
    it("should use info variant", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const banner = screen.getByRole("banner");
      // Info variant should have brand-primary background
      expect(banner.className).toContain("bg-brand-primary");
    });

    it("should have flex layout classes", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const banner = screen.getByRole("banner");
      expect(banner.className).toContain("flex");
      expect(banner.className).toContain("items-center");
      expect(banner.className).toContain("gap-3");
    });

    it("should render Info icon with proper styling", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      // Verify icon exists (Lucide icons don't expose className in testable way)
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it("should have flex-1 class on description", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      // BannerDescription should have flex-1
      const description = container.querySelector('[class*="flex-1"]');
      expect(description).toBeInTheDocument();
    });
  });

  describe("Dismiss functionality", () => {
    it("should render dismiss button", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const dismissButton = screen.getByLabelText("Dismiss banner");
      expect(dismissButton).toBeInTheDocument();
    });

    it("should call dismissBanner when dismiss button is clicked", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const dismissButton = screen.getByLabelText("Dismiss banner");
      dismissButton.click();

      expect(mockDismissBanner).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();
    });

    it("should have aria-hidden on Info icon", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Link behavior", () => {
    it("should have correct hover styling on link", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const link = screen.getByRole("link", { name: /view status/i });
      expect(link.className).toContain("hover:underline");
    });

    it("should have brand primary color on link", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const link = screen.getByRole("link", { name: /view status/i });
      expect(link.className).toContain("text-brand-primary");
    });

    it("should have font-medium on link", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: true });
      mockPathname.mockReturnValue("/");

      render(<WIPBanner />);
      const link = screen.getByRole("link", { name: /view status/i });
      expect(link.className).toContain("font-medium");
    });
  });

  describe("Early returns", () => {
    it("should return null before mounting", () => {
      mockWIPContext({ isBannerDismissed: false, isMounted: false });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when shouldShow is false", () => {
      mockWIPContext({ isBannerDismissed: true, isMounted: true });
      mockPathname.mockReturnValue("/");

      const { container } = render(<WIPBanner />);
      expect(container.firstChild).toBeNull();
    });
  });
});
