import { BrightnessMode } from "@/lib/brightness-context";
import { DARK_BRIGHTNESS_MODES, LIGHT_BRIGHTNESS_MODES } from "@/lib/constants";

const LIGHT_MODE_SET = new Set<(typeof LIGHT_BRIGHTNESS_MODES)[number]>(LIGHT_BRIGHTNESS_MODES);
const DARK_MODE_SET = new Set<(typeof DARK_BRIGHTNESS_MODES)[number]>(DARK_BRIGHTNESS_MODES);

export type ThemeTone = "light" | "dark";

export function isLightTone(mode: BrightnessMode | null | undefined): boolean {
  if (!mode || mode === "auto") {
    return false;
  }

  return LIGHT_MODE_SET.has(mode as (typeof LIGHT_BRIGHTNESS_MODES)[number]);
}

export function isDarkTone(mode: BrightnessMode | null | undefined): boolean {
  if (!mode || mode === "auto") {
    return false;
  }

  return DARK_MODE_SET.has(mode as (typeof DARK_BRIGHTNESS_MODES)[number]);
}

export function getToneFromBrightness(mode: BrightnessMode | null | undefined): ThemeTone {
  if (mode === "auto") {
    return "dark";
  }

  return isLightTone(mode) ? "light" : "dark";
}

export function parseBrightnessMode(value: string | null | undefined): BrightnessMode | null {
  if (!value) {
    return null;
  }

  if (value === "auto") {
    return "auto";
  }

  if (
    LIGHT_MODE_SET.has(value as (typeof LIGHT_BRIGHTNESS_MODES)[number]) ||
    DARK_MODE_SET.has(value as (typeof DARK_BRIGHTNESS_MODES)[number])
  ) {
    return value as BrightnessMode;
  }

  return null;
}

export function getDocumentBrightness(): BrightnessMode | null {
  if (typeof document === "undefined") {
    return null;
  }

  return parseBrightnessMode(document.documentElement.getAttribute("data-brightness"));
}
