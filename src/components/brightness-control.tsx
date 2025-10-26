"use client";

import { useBrightness } from "@/lib/brightness-context";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

export function BrightnessControl() {
  const { brightness, setBrightness } = useBrightness();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastClickTimeRef = useRef<number>(0);

  const modes = useMemo(
    () => ["-3", "-2", "-1", "0", "+1", "+2", "+3"] as const,
    []
  );

  const brightnessValue = useMemo(() => {
    if (brightness === "auto") {
      return null;
    }
    const parsed = parseInt(brightness, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [brightness]);

  const knobTheme =
    brightness === "auto"
      ? "auto"
      : brightnessValue !== null && brightnessValue <= 0
        ? "dark"
        : "light";

  const isMinBrightness = brightness === "-3";
  const isMaxBrightness = brightness === "+3";
  const knobIcon = isMinBrightness ? "moon" : isMaxBrightness ? "sun" : null;

  const ariaValueText = useMemo(() => {
    if (brightness === "auto") return "Automatic brightness";
    if (brightnessValue === null) return "Brightness";
    if (brightnessValue === 0) return "Brightness neutral";
    const magnitude = Math.abs(brightnessValue);
    const direction = brightnessValue > 0 ? "increase" : "decrease";
    return `Brightness ${direction} ${magnitude}`;
  }, [brightness, brightnessValue]);

  const sliderValue = brightnessValue ?? 0;

  const sliderAriaProps = useMemo(
    () => ({
      role: "slider" as const,
      "aria-valuemin": -3,
      "aria-valuemax": 3,
      "aria-valuenow": sliderValue,
      "aria-valuetext": ariaValueText,
      "aria-label": "Brightness control slider",
      "aria-orientation": "horizontal" as const,
      tabIndex: 0,
    }),
    [ariaValueText, sliderValue]
  );

  const knobStateClass = useMemo(() => {
    if (brightness === "auto") return "brightness-knob--state-auto";
    if (brightness === "0") return "brightness-knob--state-zero";

    const numeric = parseInt(brightness, 10);
    if (Number.isNaN(numeric)) {
      return "brightness-knob--state-zero";
    }

    if (numeric < 0) {
      return `brightness-knob--state-neg-${Math.abs(numeric)}`;
    }

    if (numeric > 0) {
      return `brightness-knob--state-pos-${numeric}`;
    }

    return "brightness-knob--state-zero";
  }, [brightness]);

  const knobThemeClass = useMemo(() => {
    return `brightness-knob--theme-${knobTheme}`;
  }, [knobTheme]);

  // Handle track click to jump to position
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || e.target !== e.currentTarget) return;

      const rect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;

      // Find nearest mode
      const index = Math.round(percentage * (modes.length - 1));
      const clampedIndex = Math.max(0, Math.min(modes.length - 1, index));
      const targetMode = modes[clampedIndex];

      // Double-click on center (0) toggles auto
      if (targetMode === "0") {
        const now = Date.now();
        if (now - lastClickTimeRef.current < 300) {
          setBrightness("auto");
          lastClickTimeRef.current = 0;
          return;
        }
        lastClickTimeRef.current = now;
      }

      setBrightness(targetMode);
    },
    [modes, setBrightness]
  );

  // Handle knob drag
  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const dragX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, dragX / rect.width));

      // Find nearest mode
      const index = Math.round(percentage * (modes.length - 1));
      const clampedIndex = Math.max(0, Math.min(modes.length - 1, index));
      setBrightness(modes[clampedIndex]);
    },
    [modes, setBrightness]
  );

  const handleKnobMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const handleMouseMove = (e: MouseEvent) => {
        handleDragMove(e.clientX);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleDragMove]
  );

  // Touch support
  const handleKnobTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          handleDragMove(e.touches[0].clientX);
        }
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [handleDragMove]
  );

  return (
    <div className="relative w-full min-w-[280px] max-w-md">
      {/* Track with gradient background */}
      <div
        ref={trackRef}
        data-testid="brightness-track"
        onClick={handleTrackClick}
        className={cn(
          "brightness-track relative h-11 w-full rounded-full cursor-pointer overflow-visible",
          "transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        )}
        {...sliderAriaProps}
      >
        {/* Moon icon - left */}
        <div
          data-testid="brightness-track-icon-moon"
          aria-hidden="true"
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity duration-200",
            knobIcon === "moon" && "opacity-0"
          )}
        >
          <Moon className="h-5 w-5 text-[#60a5fa] drop-shadow-lg" />
        </div>

        {/* Sun icon - right */}
        <div
          data-testid="brightness-track-icon-sun"
          aria-hidden="true"
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity duration-200",
            knobIcon === "sun" && "opacity-0"
          )}
        >
          <Sun className="h-5 w-5 text-[#facc15] drop-shadow-lg" />
        </div>

        {/* Position markers (subtle) */}
        <div className="brightness-track-markers absolute inset-0 flex items-center justify-between px-12 pointer-events-none">
          {modes.map((mode) => (
            <div
              key={mode}
              className={cn(
                "brightness-track-marker",
                brightness === mode && "brightness-track-marker--active"
              )}
            />
          ))}
        </div>

        {/* Draggable knob */}
        <div
          data-testid="brightness-knob"
          className={cn(
            "brightness-knob absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
            knobThemeClass,
            knobStateClass,
            knobIcon && "brightness-knob--with-icon",
            isDragging
              ? "brightness-knob--dragging cursor-grabbing !duration-75"
              : "cursor-grab"
          )}
          onMouseDown={handleKnobMouseDown}
          onTouchStart={handleKnobTouchStart}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="brightness-knob-shell relative flex items-center justify-center">
              <div className="brightness-knob-glow" />
              <div className="brightness-knob-face">
                <div
                  className={cn(
                    "brightness-knob-indicator pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out",
                    knobIcon && "brightness-knob-indicator--icon"
                  )}
                >
                  {knobIcon === "moon" && (
                    <Moon
                      data-testid="brightness-knob-icon-moon"
                      aria-hidden="true"
                      className="brightness-knob-icon brightness-knob-icon--moon"
                      strokeWidth={1.75}
                    />
                  )}
                  {knobIcon === "sun" && (
                    <Sun
                      data-testid="brightness-knob-icon-sun"
                      aria-hidden="true"
                      className="brightness-knob-icon brightness-knob-icon--sun"
                      strokeWidth={1.75}
                    />
                  )}
                  {!knobIcon && <div className="brightness-knob-line" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
