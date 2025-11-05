/**
 * Shader Blob Fallback Component
 *
 * Pure CSS gradient circle fallback for browsers without WebGL support.
 * Uses design system tokens to match the shader blob's color scheme.
 */

'use client';

import { cn } from '@/lib/utils';

interface ShaderBlobFallbackProps {
  /** Size of the blob in pixels */
  size?: number;
  /** Click handler for interaction */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** When true, renders as decorative icon without button semantics */
  asIcon?: boolean;
}

export function ShaderBlobFallback({
  size = 300,
  onClick,
  className,
  asIcon = false,
}: ShaderBlobFallbackProps) {
  return (
    <div
      className={cn(
        // Base styles
        'relative rounded-full',
        // Gradient using design tokens (brand-primary → accent-primary)
        'bg-gradient-to-br from-brand-primary via-brand-primary/80 to-accent-primary',
        // Interactive styles
        !asIcon && 'cursor-pointer transition-transform duration-300',
        !asIcon && 'hover:scale-105 active:scale-95',
        // Accessibility
        !asIcon && 'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
        className
      )}
      style={{
        width: size,
        height: size,
      }}
      onClick={onClick}
      {...(!asIcon && {
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Open Ozzy AI Assistant',
      })}
      {...(!asIcon && {
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        },
      })}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent-primary/40 to-transparent blur-xl" />

      {/* Subtle pulse animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/10 to-transparent animate-pulse" />
    </div>
  );
}
