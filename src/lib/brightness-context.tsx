"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FAVICON_SOURCES, LIGHT_BRIGHTNESS_MODES } from "@/lib/constants";

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

type ThemeTone = keyof typeof FAVICON_SOURCES;
type FaviconSourceKey = keyof typeof FAVICON_SOURCES.light;

const LIGHT_MODE_SET = new Set<(typeof LIGHT_BRIGHTNESS_MODES)[number]>(
  LIGHT_BRIGHTNESS_MODES
);

const MANAGED_FAVICONS: Array<{
  id: string;
  rel: string;
  sourceKey: FaviconSourceKey;
  sizes?: string;
  type?: string;
}> = [
  {
    id: "theme-favicon-16",
    rel: "icon",
    sourceKey: "icon16",
    sizes: "16x16",
    type: "image/png",
  },
  {
    id: "theme-favicon-32",
    rel: "icon",
    sourceKey: "icon32",
    sizes: "32x32",
    type: "image/png",
  },
  { id: "theme-favicon-ico", rel: "shortcut icon", sourceKey: "iconIco" },
  {
    id: "theme-favicon-apple",
    rel: "apple-touch-icon",
    sourceKey: "appleTouch",
    sizes: "180x180",
  },
  {
    id: "theme-favicon-192",
    rel: "icon",
    sourceKey: "android192",
    sizes: "192x192",
    type: "image/png",
  },
  {
    id: "theme-favicon-512",
    rel: "icon",
    sourceKey: "android512",
    sizes: "512x512",
    type: "image/png",
  },
  { id: "theme-favicon-manifest", rel: "manifest", sourceKey: "manifest" },
];

function toneFromMode(mode: BrightnessMode): ThemeTone {
  if (mode === "auto") {
    return "dark";
  }

  return LIGHT_MODE_SET.has(mode as (typeof LIGHT_BRIGHTNESS_MODES)[number])
    ? "light"
    : "dark";
}

function ensureManagedLink(config: (typeof MANAGED_FAVICONS)[number]) {
  if (typeof document === "undefined") {
    return null;
  }

  const selector = `link[data-theme-managed="${config.id}"]`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("data-theme-managed", config.id);
    document.head.appendChild(link);
  }

  link.rel = config.rel;

  if (config.type) {
    link.type = config.type;
  } else {
    link.removeAttribute("type");
  }

  if (config.sizes) {
    link.setAttribute("sizes", config.sizes);
  } else {
    link.removeAttribute("sizes");
  }

  return link;
}

function updateFaviconsForTone(tone: ThemeTone) {
  if (typeof document === "undefined") {
    return;
  }

  const sources = FAVICON_SOURCES[tone];

  MANAGED_FAVICONS.forEach((config) => {
    const href = sources[config.sourceKey];
    if (!href) {
      return;
    }

    const link = ensureManagedLink(config);
    if (!link) {
      return;
    }

    if (link.getAttribute("href") !== href) {
      link.setAttribute("href", href);
    }
  });
}

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

        root.setAttribute("data-brightness", targetMode);
        updateFaviconsForTone(toneFromMode(targetMode));
      };

      applyAutoTheme();

      const handler = () => {
        applyAutoTheme();
      };

      darkModeQuery.addEventListener("change", handler);

      // Also check every hour for time-based adjustments
      const interval = setInterval(applyAutoTheme, 60 * 60 * 1000);

      return () => {
        darkModeQuery.removeEventListener("change", handler);
        clearInterval(interval);
      };
    } else {
      root.setAttribute("data-brightness", brightness);
      updateFaviconsForTone(toneFromMode(brightness));
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
