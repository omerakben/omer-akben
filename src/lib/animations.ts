/**
 * Animation Constants
 *
 * Centralized animation timings and easings for consistent motion design
 * across the entire application.
 */

import { Variants } from "framer-motion";

/**
 * Standard animation durations (in seconds)
 */
export const DURATION = {
  /** Quick micro-interactions (0.2s) */
  fast: 0.2,
  /** Standard UI animations (0.3s) - optimized for responsive feel */
  normal: 0.3,
  /** Slower, more dramatic animations (0.6s) */
  slow: 0.6,
  /** Very slow, emphasis animations (0.8s) */
  slower: 0.8,
} as const;

/**
 * Standard easing curves
 */
export const EASING = {
  /** Smooth ease out - default for most animations */
  default: [0.22, 1, 0.36, 1] as const,
  /** Elastic ease - for playful interactions */
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  /** Linear - for continuous animations */
  linear: [0, 0, 1, 1] as const,
  /** Ease in-out - for reversible animations */
  inOut: [0.42, 0, 0.58, 1] as const,
} as const;

/**
 * Stagger delays for sequential animations
 */
export const STAGGER = {
  /** Minimal stagger (0.05s) */
  tight: 0.05,
  /** Standard stagger (0.1s) */
  normal: 0.1,
  /** Loose stagger (0.15s) */
  loose: 0.15,
  /** Very loose stagger (0.2s) */
  relaxed: 0.2,
} as const;

/**
 * Common animation variants for Framer Motion
 */

/** Fade in from invisible to visible */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.default,
    },
  },
};

/** Slide up with fade */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.default,
    },
  },
};

/** Slide down with fade */
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.default,
    },
  },
};

/** Slide in from left */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.default,
    },
  },
};

/** Slide in from right */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.default,
    },
  },
};

/** Scale up from 0.8 to 1 with fade */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASING.default,
    },
  },
};

/** Container with staggered children */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.1,
    },
  },
};

/** Container with tighter stagger */
export const staggerContainerTight: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.tight,
      delayChildren: 0.05,
    },
  },
};

/**
 * Viewport options for scroll-triggered animations
 */
export const VIEWPORT = {
  /** Standard viewport settings */
  default: { once: true, amount: 0.2 },
  /** More aggressive trigger (larger portion visible) */
  strict: { once: true, amount: 0.3 },
  /** Repeat animation on every view */
  repeat: { once: false, amount: 0.2 },
} as const;

/**
 * Hover animation presets
 */
export const HOVER = {
  /** Subtle lift effect */
  lift: {
    scale: 1.02,
    y: -4,
    transition: { duration: DURATION.fast, ease: EASING.default },
  },
  /** Scale slightly larger */
  scale: {
    scale: 1.05,
    transition: { duration: DURATION.fast, ease: EASING.default },
  },
  /** Glow effect (use with shadow) */
  glow: {
    boxShadow: "0 8px 30px rgba(16, 185, 129, 0.3)",
    transition: { duration: DURATION.fast, ease: EASING.default },
  },
} as const;

/**
 * Tap animation presets
 */
export const TAP = {
  /** Slight scale down */
  default: {
    scale: 0.98,
    transition: { duration: DURATION.fast, ease: EASING.default },
  },
  /** More pronounced scale */
  strong: {
    scale: 0.95,
    transition: { duration: DURATION.fast, ease: EASING.default },
  },
} as const;
