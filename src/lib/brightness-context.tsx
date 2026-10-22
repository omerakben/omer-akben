"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type BrightnessMode =
  | "-3"
  | "-2"
  | "-1"
  | "0"
  | "+1"
  | "+2"
  | "+3"
  | "auto";

interface BrightnessContextType {
  brightness: BrightnessMode;
  setBrightness: (mode: BrightnessMode) => void;
}

const BrightnessContext = createContext<BrightnessContextType | undefined>(
  undefined
);

export function BrightnessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brightness, setBrightnessState] = useState<BrightnessMode>("0");

  useEffect(() => {
    const saved = localStorage.getItem("brightness-mode");
    const validModes: BrightnessMode[] = [
      "-3",
      "-2",
      "-1",
      "0",
      "+1",
      "+2",
      "+3",
      "auto",
    ];
    if (saved && validModes.includes(saved as BrightnessMode)) {
      setBrightnessState(saved as BrightnessMode);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let restoreFrame = 0;
    const applyTheme = (mode: BrightnessMode) => {
      if (root.getAttribute("data-brightness") === mode) return;
      cancelAnimationFrame(restoreFrame);
      // Text and surfaces must change together, without low-contrast midpoints.
      root.setAttribute("data-brightness-changing", "true");
      root.setAttribute("data-brightness", mode);
      restoreFrame = requestAnimationFrame(() => {
        restoreFrame = requestAnimationFrame(() => {
          root.removeAttribute("data-brightness-changing");
        });
      });
    };
    const finishThemeChange = () => {
      cancelAnimationFrame(restoreFrame);
      root.removeAttribute("data-brightness-changing");
    };

    if (brightness === "auto") {
      // Auto mode: use system preference + time-based adjustment
      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const applyAutoTheme = () => {
        const hour = new Date().getHours();
        const isDarkOS = darkModeQuery.matches;
        let targetMode: BrightnessMode = "0";

        // If OS prefers dark OR it's nighttime (8pm-6am), use dark themes
        if (isDarkOS) {
          // Use darker modes at night (10pm-5am), medium dark otherwise
          targetMode = hour >= 22 || hour < 5 ? "-1" : "0";
        } else {
          // Light mode: use brighter during day, softer in evening
          targetMode = hour >= 18 || hour < 8 ? "+1" : "+2";
        }

        applyTheme(targetMode);
      };

      applyAutoTheme();

      const handler = () => {
        applyAutoTheme();
      };

      darkModeQuery.addEventListener("change", handler);

      // Also check every hour for time-based adjustments
      const interval = setInterval(applyAutoTheme, 60 * 60 * 1000);

      return () => {
        finishThemeChange();
        darkModeQuery.removeEventListener("change", handler);
        clearInterval(interval);
      };
    } else {
      applyTheme(brightness);
      return finishThemeChange;
    }
  }, [brightness]);

  const setBrightness = (mode: BrightnessMode) => {
    setBrightnessState(mode);
    localStorage.setItem("brightness-mode", mode);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ brightness, setBrightness }),
    [brightness]
  );

  return (
    <BrightnessContext.Provider value={contextValue}>
      {children}
    </BrightnessContext.Provider>
  );
}

export function useBrightness() {
  const context = useContext(BrightnessContext);
  if (!context) {
    throw new Error("useBrightness must be used within BrightnessProvider");
  }
  return context;
}
