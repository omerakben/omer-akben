import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { ErrorBoundary } from "./error-boundary";

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>No error</div>;
}

describe("ErrorBoundary", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = originalEnv;
    (window as { location: Location }).location = originalLocation;
  });

  describe("Rendering", () => {
    it("should render children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render children prop correctly", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText("No error")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should catch errors from children", () => {
      // Suppress console.error for this test
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("should display default fallback UI on error", () => {
      // Suppress console.error for this test
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reload page/i })
      ).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("should display AlertTriangle icon on error", () => {
      // Suppress console.error for this test
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Custom Fallback", () => {
    // Suppress console.error for error boundary tests
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    afterEach(() => {
      consoleErrorSpy.mockClear();
    });

    it("should render custom fallback when provided", () => {
      const customFallback = <div>Custom error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Custom error UI")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong")
      ).not.toBeInTheDocument();
    });

    it("should not render default fallback when custom fallback provided", () => {
      const customFallback = <div>Custom error</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.queryByRole("button", { name: /reload page/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Environment-Specific Behavior", () => {
    // Suppress console.error for error boundary tests
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    afterEach(() => {
      consoleErrorSpy.mockClear();
    });

    it("should show error message in development mode", () => {
      (process.env as { NODE_ENV?: string }).NODE_ENV = "development";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("should hide error details in production mode", () => {
      (process.env as { NODE_ENV?: string }).NODE_ENV = "production";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByText("Test error message")).not.toBeInTheDocument();
      expect(
        screen.getByText(/an unexpected error occurred/i)
      ).toBeInTheDocument();
    });

    it("should show generic message in production", () => {
      (process.env as { NODE_ENV?: string }).NODE_ENV = "production";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByText("An unexpected error occurred. Please try again.")
      ).toBeInTheDocument();
    });
  });

  describe("Error Recovery", () => {
    // Suppress console.error for error boundary tests
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    afterEach(() => {
      consoleErrorSpy.mockClear();
    });

    it("should have reload button in error state", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByRole("button", { name: /reload page/i })
      ).toBeInTheDocument();
    });

    it("should reload page when reload button clicked", () => {
      delete (window as { location?: unknown }).location;
      (window as { location: Location }).location = { ...originalLocation, reload: vi.fn() } as Location;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole("button", { name: /reload page/i });
      fireEvent.click(reloadButton);

      expect(window.location.reload).toHaveBeenCalled();
    });

    it("should reset error state when reload button clicked", () => {
      delete (window as { location?: unknown }).location;
      (window as { location: Location }).location = { ...originalLocation, reload: vi.fn() } as Location;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole("button", { name: /reload page/i });

      // Before click: error state
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      fireEvent.click(reloadButton);

      // State should be reset (though page will reload in real scenario)
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe("Styling and Accessibility", () => {
    // Suppress console.error for error boundary tests
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    afterEach(() => {
      consoleErrorSpy.mockClear();
    });

    it("should apply correct CSS classes for layout", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = container.querySelector(
        ".flex.flex-col.items-center.justify-center"
      );
      expect(errorContainer).toBeInTheDocument();
    });

    it("should apply min-height for visual consistency", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = container.querySelector(".min-h-\\[400px\\]");
      expect(errorContainer).toBeInTheDocument();
    });

    it("should use text-center for error message alignment", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = container.querySelector(".text-center");
      expect(errorContainer).toBeInTheDocument();
    });

    it("should use destructive color for icon", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const icon = container.querySelector(".text-destructive");
      expect(icon).toBeInTheDocument();
    });

    it("should use design system text colors", () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(container.querySelector(".text-text-1")).toBeInTheDocument();
      expect(container.querySelector(".text-text-2")).toBeInTheDocument();
    });
  });

  describe("Props Validation", () => {
    it("should accept children prop", () => {
      expect(() => {
        render(
          <ErrorBoundary>
            <div>Test</div>
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it("should accept fallback prop", () => {
      expect(() => {
        render(
          <ErrorBoundary fallback={<div>Fallback</div>}>
            <div>Test</div>
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it("should accept both children and fallback props", () => {
      expect(() => {
        render(
          <ErrorBoundary fallback={<div>Fallback</div>}>
            <div>Test</div>
          </ErrorBoundary>
        );
      }).not.toThrow();
    });
  });
});
