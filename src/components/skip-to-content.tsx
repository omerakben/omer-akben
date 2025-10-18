"use client";

/**
 * Skip to Content Link
 * 
 * Accessibility component that allows keyboard users to skip navigation
 * and jump directly to the main content.
 * 
 * Features:
 * - Hidden until focused via Tab key
 * - Positioned at top of viewport when visible
 * - High contrast for visibility
 * - Smooth scroll behavior
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-surf-0 focus:rounded-md focus:font-semibold focus:shadow-lg focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
