import * as BrightnessContext from "@/lib/brightness-context";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrightnessControl } from "./brightness-control";

type BrightnessValue = "-3" | "-2" | "-1" | "0" | "+1" | "+2" | "+3" | "auto";

const mockSetBrightness = vi.fn();
const useBrightnessSpy = vi.spyOn(BrightnessContext, "useBrightness");

const renderWithBrightness = (brightness: BrightnessValue) => {
  useBrightnessSpy.mockReturnValue({
    brightness,
    setBrightness: mockSetBrightness,
  } as ReturnType<typeof BrightnessContext.useBrightness>);

  return render(<BrightnessControl />);
};

describe("BrightnessControl", () => {
  beforeEach(() => {
    mockSetBrightness.mockClear();
    useBrightnessSpy.mockReset();
  });

  it("exposes slider semantics", () => {
    renderWithBrightness("0");
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "-3");
    expect(slider).toHaveAttribute("aria-valuemax", "3");
    expect(slider).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders moon icon on the knob at minimum brightness", () => {
    renderWithBrightness("-3");
    expect(screen.getByTestId("brightness-knob-icon-moon")).toBeInTheDocument();
    expect(screen.queryByTestId("brightness-knob-icon-sun")).toBeNull();
    expect(
      screen.getByTestId("brightness-track-icon-moon").className
    ).toContain("opacity-0");
  });

  it("renders sun icon on the knob at maximum brightness", () => {
    renderWithBrightness("+3");
    expect(screen.getByTestId("brightness-knob-icon-sun")).toBeInTheDocument();
    expect(screen.queryByTestId("brightness-knob-icon-moon")).toBeNull();
    expect(screen.getByTestId("brightness-track-icon-sun").className).toContain(
      "opacity-0"
    );
  });

  it("shows the indicator line for intermediate brightness values", () => {
    renderWithBrightness("0");
    const knob = screen.getByTestId("brightness-knob");
    const indicator = knob.querySelector(".brightness-knob-line");
    expect(indicator).not.toBeNull();
  });

  it("keeps track edge icons visible when not at extremes", () => {
    renderWithBrightness("+1");
    expect(
      screen.getByTestId("brightness-track-icon-moon").className
    ).not.toContain("opacity-0");
    expect(
      screen.getByTestId("brightness-track-icon-sun").className
    ).not.toContain("opacity-0");
  });

  it("handles clicking the track to jump to a brightness mode", () => {
    renderWithBrightness("-3");
    const track = screen.getByTestId("brightness-track");
    const rectSpy = vi.spyOn(track, "getBoundingClientRect").mockReturnValue({
      width: 300,
      height: 44,
      top: 0,
      left: 0,
      right: 300,
      bottom: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.click(track, { clientX: 150, clientY: 22 });

    expect(mockSetBrightness).toHaveBeenCalledWith("0");
    rectSpy.mockRestore();
  });

  it("supports dragging the knob to the maximum value", () => {
    renderWithBrightness("0");
    const track = screen.getByTestId("brightness-track");
    const knob = screen.getByTestId("brightness-knob");

    const rectSpy = vi.spyOn(track, "getBoundingClientRect").mockReturnValue({
      width: 240,
      height: 44,
      top: 0,
      left: 0,
      right: 240,
      bottom: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.mouseDown(knob, { clientX: 0, clientY: 22 });
    fireEvent.mouseMove(document, { clientX: 240, clientY: 22 });
    fireEvent.mouseUp(document);

    expect(mockSetBrightness).toHaveBeenLastCalledWith("+3");
    rectSpy.mockRestore();
  });

  it("announces automatic mode through aria-valuetext", () => {
    renderWithBrightness("auto");
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuetext", "Automatic brightness");
  });
});
