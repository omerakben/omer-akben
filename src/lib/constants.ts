/**
 * Project status color mappings
 * Used for displaying project completion status across the site
 */
export const statusColors = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  planned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
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
 * Resume configuration
 * Makes it easy to update resume details without changing code
 */
export const RESUME = {
  filename: "Omer_Akben_Resume_2025-10.pdf",
  path: "/assets/Omer_Akben_Resume_2025-10.pdf",
  downloadName: "Omer_Akben_Resume_Full.pdf",
} as const;
