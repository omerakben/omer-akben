/**
 * Project status color mappings
 * Used for displaying project completion status across the site
 */
export const statusColors = {
  beta: "bg-brand-primary/15 text-brand-primary border-brand-primary/30",
  "in-progress":
    "bg-accent-primary/15 text-accent-primary border-accent-primary/30",
  planned: "bg-surf-2 text-text-2 border-border-line/80",
  placeholder: "bg-transparent text-text-3 border-border-line/60",
} as const;

/**
 * Project role color mappings
 * Used for displaying developer role badges across project pages
 */
export const roleColors = {
  "Full-Stack": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  AI: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  QA: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "QA/AI": "bg-pink-500/10 text-pink-400 border-pink-500/20",
} as const;

/**
 * Type helpers for type-safe color access
 */
export type ProjectStatus = keyof typeof statusColors;
export type ProjectRole = keyof typeof roleColors;

/**
 * Logo size configuration
 * Used for consistent logo sizing across the application
 */
export const LOGO_SIZE = {
  width: 64,
  height: 64,
  className: "w-16 h-16", // Tailwind equivalent of 64px
} as const;

/**
 * Logo source files by theme
 */
export const LOGO_SOURCES = {
  light: "/OA-logo-light.png",
  dark: "/OA-logo-dark.png",
} as const;

/**
 * Brightness presets grouped by light/dark tone
 */
export const LIGHT_BRIGHTNESS_MODES = ["+1", "+2", "+3"] as const;
export const DARK_BRIGHTNESS_MODES = ["-3", "-2", "-1", "0"] as const;

/**
 * Favicon assets by tone and size
 */
export const FAVICON_SOURCES = {
  light: {
    icon16: "/favicon_light/favicon-16x16.png",
    icon32: "/favicon_light/favicon-32x32.png",
    iconIco: "/favicon_light/favicon.ico",
    appleTouch: "/favicon_light/apple-touch-icon.png",
    android192: "/favicon_light/android-chrome-192x192.png",
    android512: "/favicon_light/android-chrome-512x512.png",
    manifest: "/favicon_light/site.webmanifest",
  },
  dark: {
    icon16: "/favicon_dark/favicon-16x16.png",
    icon32: "/favicon_dark/favicon-32x32.png",
    iconIco: "/favicon_dark/favicon.ico",
    appleTouch: "/favicon_dark/apple-touch-icon.png",
    android192: "/favicon_dark/android-chrome-192x192.png",
    android512: "/favicon_dark/android-chrome-512x512.png",
    manifest: "/favicon_dark/site.webmanifest",
  },
} as const;

/**
 * Resume configuration
 * Makes it easy to update resume details without changing code
 */
export const RESUME = {
  filename: "Omer_Akben_Resume.pdf",
  path: "/assets/Omer_Akben_Resume.pdf",
  downloadName: "Omer_Akben_Resume.pdf",
} as const;
