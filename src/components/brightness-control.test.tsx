import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrightnessControl } from "./brightness-control";
import * as BrightnessContext from "@/lib/brightness-context";

// Mock the brightness context
const mockSetBrightness = vi.fn();

describe("BrightnessControl", () => {
  const renderWithBrightness = (brightness: string) => {
    vi.spyOn(BrightnessContext, "useBrightness").mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      brightness: brightness as any,
      setBrightness: mockSetBrightness,
    });
    return render(<BrightnessControl />);
  };

  beforeEach(() => {
    mockSetBrightness.mockClear();
  });

  describe("Rendering", () => {
    it("should render all brightness mode buttons", () => {
      renderWithBrightness("0");

      // Check for moon button
      expect(screen.getByLabelText("Set minimum brightness")).toBeInTheDocument();

      // Check for numeric mode buttons
      const modes = ["-3", "-2", "-1", "0", "+1", "+2", "+3"];
      modes.forEach((mode) => {
        expect(screen.getByText(mode)).toBeInTheDocument();
      });

      // Check for sun button
      expect(screen.getByLabelText("Set maximum brightness")).toBeInTheDocument();

      // Check for auto button
      expect(screen.getByText("Auto")).toBeInTheDocument();
    });

    it("should highlight current brightness mode", () => {
      renderWithBrightness("+1");
      const activeButton = screen.getByText("+1");
      expect(activeButton.className).toContain("bg-brand-primary");
    });

    it("should highlight auto mode when active", () => {
      renderWithBrightness("auto");
      const autoButton = screen.getByText("Auto");
      expect(autoButton.className).toContain("bg-brand-primary");
    });

    it("should render Moon icon for dark mode trigger", () => {
      renderWithBrightness("0");
      const moonButton = screen.getByLabelText("Set minimum brightness");
      expect(moonButton).toBeInTheDocument();
    });

    it("should render Sun icon for bright mode trigger", () => {
      renderWithBrightness("0");
      const sunButton = screen.getByLabelText("Set maximum brightness");
      expect(sunButton).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call setBrightness when moon button is clicked", () => {
      renderWithBrightness("0");
      const moonButton = screen.getByLabelText("Set minimum brightness");
      fireEvent.click(moonButton);
      expect(mockSetBrightness).toHaveBeenCalledWith("-3");
    });

    it("should call setBrightness when sun button is clicked", () => {
      renderWithBrightness("0");
      const sunButton = screen.getByLabelText("Set maximum brightness");
      fireEvent.click(sunButton);
      expect(mockSetBrightness).toHaveBeenCalledWith("+3");
    });

    it("should call setBrightness when numeric mode is clicked", () => {
      renderWithBrightness("0");
      const plusTwoButton = screen.getByText("+2");
      fireEvent.click(plusTwoButton);
      expect(mockSetBrightness).toHaveBeenCalledWith("+2");
    });

    it("should call setBrightness when auto is clicked", () => {
      renderWithBrightness("0");
      const autoButton = screen.getByText("Auto");
      fireEvent.click(autoButton);
      expect(mockSetBrightness).toHaveBeenCalledWith("auto");
    });

    it("should handle all mode transitions", () => {
      renderWithBrightness("0");
      const modes = ["-3", "-2", "-1", "0", "+1", "+2", "+3"];

      modes.forEach((mode) => {
        const button = screen.getByText(mode);
        fireEvent.click(button);
        expect(mockSetBrightness).toHaveBeenCalledWith(mode);
      });
    });
  });

  describe("Visual States", () => {
    it("should show correct hover styles for dark mode", () => {
      renderWithBrightness("-1");
      const button = screen.getByText("0");
      expect(button.className).toContain("hover:bg-white/10");
    });

    it("should show correct hover styles for light mode", () => {
      renderWithBrightness("+2");
      const button = screen.getByText("+1");
      expect(button.className).toContain("hover:bg-black/10");
    });

    it("should apply dark mode styles for negative brightness values", () => {
      renderWithBrightness("-2");
      const button = screen.getByText("-1");
      expect(button.className).toContain("hover:bg-white/10");
    });

    it("should apply light mode styles for positive brightness values", () => {
      renderWithBrightness("+1");
      const button = screen.getByText("+2");
      expect(button.className).toContain("hover:bg-black/10");
    });

    it("should apply dark mode styles for brightness 0", () => {
      renderWithBrightness("0");
      const button = screen.getByText("+1");
      expect(button.className).toContain("hover:bg-white/10");
    });

    it("should apply dark mode styles for auto mode", () => {
      renderWithBrightness("auto");
      const button = screen.getByText("0");
      expect(button.className).toContain("hover:bg-white/10");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible button labels for icon buttons", () => {
      renderWithBrightness("0");
      expect(screen.getByLabelText("Set minimum brightness")).toBeInTheDocument();
      expect(screen.getByLabelText("Set maximum brightness")).toBeInTheDocument();
    });

    it("should have text labels for mode buttons", () => {
      renderWithBrightness("0");
      const modes = ["-3", "-2", "-1", "0", "+1", "+2", "+3"];
      modes.forEach((mode) => {
        expect(screen.getByText(mode)).toBeInTheDocument();
      });
    });

    it("should have text label for auto button", () => {
      renderWithBrightness("0");
      expect(screen.getByText("Auto")).toBeInTheDocument();
    });

    it("buttons should be focusable", () => {
      renderWithBrightness("0");
      const autoButton = screen.getByText("Auto");
      autoButton.focus();
      expect(document.activeElement).toBe(autoButton);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid mode changes", () => {
      renderWithBrightness("0");
      const modes = [
        { text: "+1", value: "+1" },
        { text: "-1", value: "-1" },
        { text: "+2", value: "+2" },
        { text: "-2", value: "-2" },
        { text: "Auto", value: "auto" },
      ];

      modes.forEach((mode) => {
        const button = screen.getByText(mode.text);
        fireEvent.click(button);
      });

      expect(mockSetBrightness).toHaveBeenCalledTimes(5);
    });

    it("should not break when clicking already active mode", () => {
      renderWithBrightness("+1");
      const activeButton = screen.getByText("+1");
      fireEvent.click(activeButton);
      expect(mockSetBrightness).toHaveBeenCalledWith("+1");
    });

    it("should maintain state consistency across mode changes", () => {
      const { rerender } = renderWithBrightness("0");

      // Simulate brightness change
      vi.spyOn(BrightnessContext, "useBrightness").mockReturnValue({
        brightness: "+2",
        setBrightness: mockSetBrightness,
      });

      rerender(<BrightnessControl />);

      const activeButton = screen.getByText("+2");
      expect(activeButton.className).toContain("bg-brand-primary");
    });
  });
});
