/**
 * Animated Blob Container
 *
 * Smart wrapper that detects WebGL support and conditionally renders:
 * - ShaderBlob (WebGL supported)
 * - ShaderBlobFallback (CSS gradient fallback)
 *
 * Includes SSR-safe feature detection and hydration-safe pattern.
 */

'use client';

import { useState, useEffect } from 'react';
import { ShaderBlob } from './shader-blob';
import { ShaderBlobFallback } from './shader-blob-fallback';
import { isWebGLSupported } from '@/lib/webgl-utils';

interface AnimatedBlobContainerProps {
  /** Size of the blob in pixels */
  size?: number;
  /** Click handler for interaction */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable center dimming effect (WebGL only) */
  disableCenterDimming?: boolean;
}

export function AnimatedBlobContainer({
  size = 300,
  onClick,
  className,
  disableCenterDimming = false,
}: AnimatedBlobContainerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setHasWebGL(isWebGLSupported());
  }, []);

  // SSR: Render nothing initially to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  // Client-side: Render appropriate component based on WebGL support
  return hasWebGL ? (
    <ShaderBlob
      size={size}
      onClick={onClick}
      className={className}
      disableCenterDimming={disableCenterDimming}
    />
  ) : (
    <ShaderBlobFallback
      size={size}
      onClick={onClick}
      className={className}
    />
  );
}
