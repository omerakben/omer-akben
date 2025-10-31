import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Banner, BannerDescription, BannerTitle } from "./banner";

describe("Banner", () => {
  describe("Rendering", () => {
    it("should render banner with children", () => {
      render(<Banner>Test Banner Content</Banner>);
      expect(screen.getByText("Test Banner Content")).toBeInTheDocument();
    });

    it("should have role='banner' attribute", () => {
      render(<Banner>Content</Banner>);
      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();
    });

    it("should render dismiss button by default", () => {
      const mockDismiss = vi.fn();
      render(<Banner onDismiss={mockDismiss}>Content</Banner>);

      const dismissButton = screen.getByLabelText("Dismiss banner");
      expect(dismissButton).toBeInTheDocument();
    });

    it("should render X icon in dismiss button", () => {
      const mockDismiss = vi.fn();
      render(<Banner onDismiss={mockDismiss}>Content</Banner>);

      const dismissButton = screen.getByLabelText("Dismiss banner");
      const icon = dismissButton.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should apply default variant classes", () => {
      render(<Banner>Content</Banner>);
      const banner = screen.getByRole("banner");
      expect(banner.className).toContain("bg-surf-1");
      expect(banner.className).toContain("text-text-1");
      expect(banner.className).toContain("border-border-line");
    });

    it("should apply info variant classes", () => {
      render(<Banner variant="info">Content</Banner>);
      const banner = screen.getByRole("banner");
      expect(banner.className).toContain("bg-brand-primary/10");
      expect(banner.className).toContain("border-brand-primary/30");
    });

    it("should apply warning variant classes", () => {
      render(<Banner variant="warning">Content</Banner>);
      const banner = screen.getByRole("banner");
      expect(banner.className).toContain("bg-yellow-500/10");
      expect(banner.className).toContain("border-yellow-500/30");
    });
  });

  describe("Dismiss functionality", () => {
    it("should call onDismiss when dismiss button is clicked", () => {
      const mockDismiss = vi.fn();
      render(<Banner onDismiss={mockDismiss}>Content</Banner>);

      const dismissButton = screen.getByLabelText("Dismiss banner");
      fireEvent.click(dismissButton);

      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });

    it("should not render dismiss button when onDismiss is not provided", () => {
      render(<Banner>Content</Banner>);

      const dismissButton = screen.queryByLabelText("Dismiss banner");
      expect(dismissButton).not.toBeInTheDocument();
    });

    it("should not render dismiss button when showDismiss is false", () => {
      const mockDismiss = vi.fn();
      render(
        <Banner onDismiss={mockDismiss} showDismiss={false}>
          Content
        </Banner>
      );

      const dismissButton = screen.queryByLabelText("Dismiss banner");
      expect(dismissButton).not.toBeInTheDocument();
    });

    it("should render dismiss button when showDismiss is true and onDismiss is provided", () => {
      const mockDismiss = vi.fn();
      render(
        <Banner onDismiss={mockDismiss} showDismiss={true}>
          Content
        </Banner>
      );

      const dismissButton = screen.getByLabelText("Dismiss banner");
      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("should merge custom className with default classes", () => {
      render(<Banner className="custom-class">Content</Banner>);
      const banner = screen.getByRole("banner");
      expect(banner.className).toContain("custom-class");
      expect(banner.className).toContain("border-b"); // default class
    });
  });

  describe("Forward ref", () => {
    it("should forward ref to div element", () => {
      const ref = vi.fn();
      render(<Banner ref={ref}>Content</Banner>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("Layout structure", () => {
    it("should have proper flex container for layout", () => {
      render(<Banner>Content</Banner>);
      const banner = screen.getByRole("banner");
      const flexContainer = banner.firstChild as HTMLElement;
      expect(flexContainer.className).toContain("flex");
      expect(flexContainer.className).toContain("items-center");
      expect(flexContainer.className).toContain("justify-between");
    });

    it("should wrap children in flex-1 div", () => {
      const { container } = render(<Banner>Test Content</Banner>);
      // Find the flex-1 wrapper div that contains the children
      const flex1Div = container.querySelector('.flex-1');
      expect(flex1Div).toBeInTheDocument();
      expect(flex1Div?.textContent).toBe("Test Content");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA label for dismiss button", () => {
      const mockDismiss = vi.fn();
      render(<Banner onDismiss={mockDismiss}>Content</Banner>);

      const dismissButton = screen.getByRole("button", { name: /dismiss banner/i });
      expect(dismissButton).toBeInTheDocument();
    });
  });
});

describe("BannerTitle", () => {
  describe("Rendering", () => {
    it("should render title with children", () => {
      render(<BannerTitle>Test Title</BannerTitle>);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render as h5 element", () => {
      const { container } = render(<BannerTitle>Test Title</BannerTitle>);
      const h5 = container.querySelector("h5");
      expect(h5).toBeInTheDocument();
      expect(h5?.textContent).toBe("Test Title");
    });

    it("should have font-medium class", () => {
      const { container } = render(<BannerTitle>Test Title</BannerTitle>);
      const h5 = container.querySelector("h5");
      expect(h5?.className).toContain("font-medium");
    });

    it("should have mb-1 class", () => {
      const { container } = render(<BannerTitle>Test Title</BannerTitle>);
      const h5 = container.querySelector("h5");
      expect(h5?.className).toContain("mb-1");
    });
  });

  describe("Custom className", () => {
    it("should merge custom className with default classes", () => {
      const { container } = render(
        <BannerTitle className="custom-title">Test Title</BannerTitle>
      );
      const h5 = container.querySelector("h5");
      expect(h5?.className).toContain("custom-title");
      expect(h5?.className).toContain("font-medium");
    });
  });

  describe("Forward ref", () => {
    it("should forward ref to h5 element", () => {
      const ref = vi.fn();
      render(<BannerTitle ref={ref}>Test Title</BannerTitle>);
      expect(ref).toHaveBeenCalled();
    });
  });
});

describe("BannerDescription", () => {
  describe("Rendering", () => {
    it("should render description with children", () => {
      render(<BannerDescription>Test Description</BannerDescription>);
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("should render as div element", () => {
      const { container } = render(
        <BannerDescription>Test Description</BannerDescription>
      );
      const div = container.querySelector("div");
      expect(div).toBeInTheDocument();
      expect(div?.textContent).toBe("Test Description");
    });

    it("should have text-sm class", () => {
      const { container } = render(
        <BannerDescription>Test Description</BannerDescription>
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("text-sm");
    });

    it("should support complex children with paragraphs", () => {
      render(
        <BannerDescription>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </BannerDescription>
      );
      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("should merge custom className with default classes", () => {
      const { container } = render(
        <BannerDescription className="custom-description">
          Test Description
        </BannerDescription>
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("custom-description");
      expect(div?.className).toContain("text-sm");
    });
  });

  describe("Forward ref", () => {
    it("should forward ref to div element", () => {
      const ref = vi.fn();
      render(<BannerDescription ref={ref}>Test Description</BannerDescription>);
      expect(ref).toHaveBeenCalled();
    });
  });
});

describe("Banner composition", () => {
  it("should work with Banner + BannerTitle + BannerDescription", () => {
    render(
      <Banner variant="info">
        <BannerTitle>Important Notice</BannerTitle>
        <BannerDescription>
          This is important information you should know.
        </BannerDescription>
      </Banner>
    );

    expect(screen.getByText("Important Notice")).toBeInTheDocument();
    expect(
      screen.getByText("This is important information you should know.")
    ).toBeInTheDocument();
  });

  it("should maintain proper styling when composed", () => {
    const { container } = render(
      <Banner variant="warning">
        <BannerTitle>Warning</BannerTitle>
        <BannerDescription>Please read carefully</BannerDescription>
      </Banner>
    );

    const banner = screen.getByRole("banner");
    expect(banner.className).toContain("bg-yellow-500/10");

    const h5 = container.querySelector("h5");
    expect(h5?.className).toContain("font-medium");

    const description = container.querySelector("div.text-sm");
    expect(description).toBeInTheDocument();
  });
});
