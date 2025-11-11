import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WIPBanner } from "@/components/wip-banner";
import { posthog } from "@/lib/analytics/posthog-client";
import * as WIPContext from "@/lib/wip-context";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from "next/navigation";

const mockPathname = vi.mocked(usePathname);
const dismissSpy = vi.fn();
const captureMock = posthog.capture as unknown as ReturnType<typeof vi.fn>;
const useWIPSpy = vi.spyOn(WIPContext, "useWIP");

const setContext = (overrides?: Partial<ReturnType<typeof WIPContext.useWIP>>) => {
  useWIPSpy.mockReturnValue({
    isModalDismissed: true,
    isBannerDismissed: false,
    dismissModal: vi.fn(),
    dismissBanner: dismissSpy,
    isMounted: true,
    bannerVersionKey: "abcdef1",
    ...overrides,
  });
};

beforeEach(() => {
  dismissSpy.mockReset();
  captureMock.mockReset();
  mockPathname.mockReturnValue("/");
  setContext();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("WIPBanner", () => {
  it("renders when user has not dismissed banner", () => {
    const { container } = render(<WIPBanner />);

    expect(container.querySelector("aside")).toBeInTheDocument();
    expect(screen.getByText(/Site under active development/i)).toBeVisible();
  });

  it("hides on status page", () => {
    mockPathname.mockReturnValue("/status");

    const { container } = render(<WIPBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("fires view analytics event when shown", () => {
    render(<WIPBanner />);

    expect(captureMock).toHaveBeenCalledWith(
      "status_banner.view",
      expect.objectContaining({ sha: "abcdef1" })
    );
  });

  it("dismisses and tracks analytics when close button clicked", () => {
    render(<WIPBanner />);

    fireEvent.click(screen.getByLabelText(/dismiss site status banner/i));

    expect(dismissSpy).toHaveBeenCalled();
    expect(captureMock).toHaveBeenCalledWith(
      "status_banner.dismiss",
      expect.objectContaining({ sha: "abcdef1" })
    );
  });

  it("dismisses when Escape key is pressed", () => {
    render(<WIPBanner />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(dismissSpy).toHaveBeenCalled();
  });

  it("tracks CTA click when View status link pressed", () => {
    render(<WIPBanner />);

    fireEvent.click(screen.getByRole("link", { name: /view status/i }));
    expect(dismissSpy).toHaveBeenCalled();
    expect(captureMock).toHaveBeenCalledWith(
      "status_banner.click_view_status",
      expect.objectContaining({ path: "/" })
    );
  });

  it("renders playful copy when variant is playful", () => {
    render(<WIPBanner variant="playful" />);

    expect(screen.getByText(/Still cooking\./i)).toBeVisible();
    expect(screen.getByText(/Some features are in the pan/i)).toBeVisible();
  });

  it("renders egg icon when icon prop is egg", () => {
    render(<WIPBanner icon="egg" />);

    expect(screen.getByText("\uD83C\uDF73")).toBeVisible();
  });

  it("does not render until mounted", () => {
    setContext({ isMounted: false });
    const { container } = render(<WIPBanner />);

    expect(container.firstChild).toBeNull();
  });
});
