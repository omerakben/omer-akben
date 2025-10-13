"use client";

import { LazyMotion as FramerLazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";

/**
 * Lazy-loaded Framer Motion with reduced bundle size
 *
 * This uses Framer Motion's LazyMotion with the domAnimation feature set
 * to reduce bundle size while keeping all your complex animations.
 *
 * Key Strategy:
 * - Uses `m` components instead of `motion` (smaller)
 * - Loads domAnimation features (~30KB instead of full ~100KB)
 * - Wraps entire route/page for optimal code splitting
 *
 * Usage Pattern (CORRECT):
 * ```tsx
 * // In your page.tsx
 * import { LazyMotion } from "@/components/lazy-motion";
 * import { m } from "framer-motion";
 *
 * export default function Page() {
 *   return (
 *     <LazyMotion>
 *       <m.div
 *         initial={{ opacity: 0 }}
 *         animate={{ opacity: 1 }}
 *       >
 *         Content
 *       </m.div>
 *     </LazyMotion>
 *   );
 * }
 * ```
 *
 * IMPORTANT: Always use `m` (not `motion`) inside LazyMotion!
 * This is required for tree-shaking to work properly.
 */

interface LazyMotionProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides lazy-loaded animation features
 * Use this at the page level to wrap your animated content
 */
export function LazyMotion({ children }: LazyMotionProps) {
  return (
    <FramerLazyMotion features={domAnimation} strict>
      {children}
    </FramerLazyMotion>
  );
}

// Re-export `m` for convenience
export { m } from "framer-motion";
