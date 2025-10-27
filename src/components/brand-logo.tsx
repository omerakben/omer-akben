"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { BrightnessMode, useBrightness } from "@/lib/brightness-context";
import { getDocumentBrightness } from "@/lib/brightness-utils";
import {
  LIGHT_BRIGHTNESS_MODES,
  LOGO_SIZE,
  LOGO_SOURCES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const LIGHT_MODE_SET = new Set<(typeof LIGHT_BRIGHTNESS_MODES)[number]>(
  LIGHT_BRIGHTNESS_MODES
);

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  alt?: string;
  width?: number;
  height?: number;
  /**
   * Custom sizes descriptor for responsive layouts.
   * Defaults to exact pixel width to avoid unnecessary resizing.
   */
  sizes?: string;
};

function isLightMode(mode: BrightnessMode | null): boolean {
  if (!mode || mode === "auto") {
    return false;
  }

  return LIGHT_MODE_SET.has(mode as (typeof LIGHT_BRIGHTNESS_MODES)[number]);
}

function resolveInitialBrightness(): BrightnessMode {
  if (typeof document === "undefined") {
    return "0";
  }

  return getDocumentBrightness() ?? "0";
}

export function BrandLogo({
  className,
  priority = false,
  alt = "Omer Akben logo",
  width = LOGO_SIZE.width,
  height = LOGO_SIZE.height,
  sizes,
}: BrandLogoProps) {
  const { brightness } = useBrightness();
  const [resolvedBrightness, setResolvedBrightness] = useState<BrightnessMode>(
    resolveInitialBrightness
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (brightness === "auto") {
      const updateFromDocument = () => {
        const current = getDocumentBrightness();
        if (!current) {
          return;
        }

        setResolvedBrightness((prev) => (prev === current ? prev : current));
      };

      updateFromDocument();

      const observer = new MutationObserver(updateFromDocument);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-brightness"],
      });

      return () => observer.disconnect();
    }

    setResolvedBrightness((prev) => (prev === brightness ? prev : brightness));
  }, [brightness]);

  const tone = useMemo(
    () => (isLightMode(resolvedBrightness) ? "light" : "dark"),
    [resolvedBrightness]
  );
  const logoSrc = useMemo(
    () => (tone === "light" ? LOGO_SOURCES.light : LOGO_SOURCES.dark),
    [tone]
  );

  const containerClasses = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-3xl border transition-all duration-300 ease-out",
    tone === "light"
      ? "border-slate-200/70 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),rgba(241,245,249,0.85))] shadow-[0_16px_38px_rgba(15,23,42,0.12)]"
      : "border-white/12 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),rgba(15,23,42,0.6))] shadow-[0_20px_48px_rgba(10,37,64,0.45)] backdrop-blur-sm",
    LOGO_SIZE.className,
    className
  );

  return (
    <span className={containerClasses} style={{ width, height }}>
      <Image
        src={logoSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="relative h-full w-full object-cover"
        sizes={sizes ?? `${width}px`}
      />
    </span>
  );
}
