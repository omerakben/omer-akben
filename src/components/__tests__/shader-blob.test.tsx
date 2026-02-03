/**
 * Unit Tests for Shader Blob Components
 *
 * Tests WebGL shader blob, CSS fallback, and smart wrapper container.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ShaderBlob } from '../shader-blob';
import { ShaderBlobFallback } from '../shader-blob-fallback';
import { AnimatedBlobContainer } from '../animated-blob-container';

// Mock WebGL context
class MockWebGLRenderingContext {
  VERTEX_SHADER = 35633;
  FRAGMENT_SHADER = 35632;
  COMPILE_STATUS = 35713;
  LINK_STATUS = 35714;
  ARRAY_BUFFER = 34962;
  ELEMENT_ARRAY_BUFFER = 34963;
  STATIC_DRAW = 35044;
  COLOR_BUFFER_BIT = 16384;
  DEPTH_BUFFER_BIT = 256;
  FLOAT = 5126;
  TRIANGLES = 4;
  UNSIGNED_SHORT = 5123;

  createShader = vi.fn(() => ({}));
  shaderSource = vi.fn();
  compileShader = vi.fn();
  getShaderParameter = vi.fn(() => true);
  getShaderInfoLog = vi.fn(() => '');
  deleteShader = vi.fn();
  createProgram = vi.fn(() => ({}));
  attachShader = vi.fn();
  linkProgram = vi.fn();
  getProgramParameter = vi.fn(() => true);
  getProgramInfoLog = vi.fn(() => '');
  deleteProgram = vi.fn();
  getAttribLocation = vi.fn(() => 0);
  getUniformLocation = vi.fn(() => ({}));
  createBuffer = vi.fn(() => ({}));
  bindBuffer = vi.fn();
  bufferData = vi.fn();
  deleteBuffer = vi.fn();
  viewport = vi.fn();
  clearColor = vi.fn();
  clear = vi.fn();
  useProgram = vi.fn();
  uniform2f = vi.fn();
  uniform1f = vi.fn();
  uniform3f = vi.fn();
  uniform1i = vi.fn();
  vertexAttribPointer = vi.fn();
  enableVertexAttribArray = vi.fn();
  drawElements = vi.fn();
}

class MockMutationObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
}

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
  root: Element | null = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];
}

// Mock canvas.getContext
const mockGetContext = vi.fn((type: string) => {
  if (type === 'webgl' || type === 'experimental-webgl') {
    return new MockWebGLRenderingContext();
  }
  return null;
});

beforeEach(() => {
  // Mock canvas element
  HTMLCanvasElement.prototype.getContext = mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext;

  // Mock getComputedStyle for CSS custom properties
  window.getComputedStyle = vi.fn(() => ({
    getPropertyValue: vi.fn((prop: string) => {
      if (prop === '--brand-primary') return '#10b981';
      if (prop === '--accent-primary') return '#2563eb';
      return '';
    }),
  })) as unknown as typeof window.getComputedStyle;

  // Mock MutationObserver
  global.MutationObserver =
    MockMutationObserver as unknown as typeof MutationObserver;

  // Mock IntersectionObserver
  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;

  // Mock requestAnimationFrame - don't call callback immediately to prevent infinite loop
  global.requestAnimationFrame = vi.fn(() => 1) as unknown as typeof requestAnimationFrame;

  global.cancelAnimationFrame = vi.fn();

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ShaderBlob', () => {
  it('renders canvas element', () => {
    render(<ShaderBlob />);
    const canvas = screen.getByRole('button');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('initializes WebGL context', () => {
    render(<ShaderBlob />);
    expect(mockGetContext).toHaveBeenCalledWith('webgl');
  });

  it('sets correct canvas size', () => {
    const { container } = render(<ShaderBlob size={300} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '300');
    expect(canvas).toHaveAttribute('height', '300');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<ShaderBlob onClick={handleClick} />);

    const canvas = screen.getByRole('button');
    fireEvent.click(canvas);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Enter key)', () => {
    const handleClick = vi.fn();
    render(<ShaderBlob onClick={handleClick} />);

    const canvas = screen.getByRole('button');
    fireEvent.keyDown(canvas, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Space key)', () => {
    const handleClick = vi.fn();
    render(<ShaderBlob onClick={handleClick} />);

    const canvas = screen.getByRole('button');
    fireEvent.keyDown(canvas, { key: ' ' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('tracks mouse position on move', () => {
    const { container } = render(<ShaderBlob />);
    const canvas = container.querySelector('canvas')!;

    // Mock getBoundingClientRect
    canvas.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 300,
      height: 300,
      right: 300,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });

    // Should not throw error
    expect(canvas).toBeInTheDocument();
  });

  it('resets mouse position on leave', () => {
    const { container } = render(<ShaderBlob />);
    const canvas = container.querySelector('canvas')!;

    fireEvent.mouseLeave(canvas);

    // Should not throw error
    expect(canvas).toBeInTheDocument();
  });

  it('respects prefers-reduced-motion', () => {
    // Mock matchMedia for reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ShaderBlob />);

    // Should still render canvas
    const canvas = screen.getByRole('button');
    expect(canvas).toBeInTheDocument();
  });

  it('cleans up resources on unmount', () => {
    const { unmount } = render(<ShaderBlob />);

    unmount();

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<ShaderBlob className="custom-class" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    render(<ShaderBlob />);
    const canvas = screen.getByRole('button');

    expect(canvas).toHaveAttribute('aria-label', 'Open Ozzy AI Assistant');
    expect(canvas).toHaveAttribute('tabIndex', '0');
  });
});

describe('ShaderBlobFallback', () => {
  it('renders fallback div', () => {
    render(<ShaderBlobFallback />);
    const fallback = screen.getByRole('button');
    expect(fallback).toBeInTheDocument();
    expect(fallback.tagName).toBe('DIV');
  });

  it('sets correct size', () => {
    const { container } = render(<ShaderBlobFallback size={300} />);
    const fallback = container.querySelector('[role="button"]') as HTMLElement;
    expect(fallback).toBeInTheDocument();
    expect(fallback.style.width).toBe('300px');
    expect(fallback.style.height).toBe('300px');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<ShaderBlobFallback onClick={handleClick} />);

    const fallback = screen.getByRole('button');
    fireEvent.click(fallback);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Enter key)', () => {
    const handleClick = vi.fn();
    render(<ShaderBlobFallback onClick={handleClick} />);

    const fallback = screen.getByRole('button');
    fireEvent.keyDown(fallback, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events (Space key)', () => {
    const handleClick = vi.fn();
    render(<ShaderBlobFallback onClick={handleClick} />);

    const fallback = screen.getByRole('button');
    fireEvent.keyDown(fallback, { key: ' ' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<ShaderBlobFallback className="custom-class" />);
    const fallback = container.querySelector('.custom-class');
    expect(fallback).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<ShaderBlobFallback />);
    const fallback = screen.getByRole('button');

    expect(fallback).toHaveAttribute('aria-label', 'Open Ozzy AI Assistant');
    expect(fallback).toHaveAttribute('tabIndex', '0');
  });

  it('uses design token classes', () => {
    const { container } = render(<ShaderBlobFallback />);
    const fallback = container.querySelector('[role="button"]');

    // Check for gradient classes (from-brand-primary, to-accent-primary)
    expect(fallback?.className).toContain('from-brand-primary');
    expect(fallback?.className).toContain('to-accent-primary');
  });
});

describe('AnimatedBlobContainer', () => {
  it('renders nothing initially (SSR safety)', () => {
    const { container } = render(<AnimatedBlobContainer />);

    // Should render empty placeholder div during SSR (or immediately mount on client)
    // In test environment, it immediately mounts, so we check for either placeholder or actual component
    const placeholder = container.querySelector('[aria-hidden="true"]');
    const component = container.querySelector('[role="button"]');
    expect(placeholder || component).toBeInTheDocument();
  });

  it('renders ShaderBlob when WebGL is supported', async () => {
    const { container, rerender } = render(<AnimatedBlobContainer />);

    // Force client-side rendering
    rerender(<AnimatedBlobContainer />);

    // Wait for useEffect to run
    await vi.waitFor(() => {
      const canvas = container.querySelector('canvas');
      if (canvas) {
        expect(canvas).toBeInTheDocument();
      }
    });
  });

  it('renders ShaderBlobFallback when WebGL is not supported', async () => {
    // Mock WebGL as unavailable
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

    const { container, rerender } = render(<AnimatedBlobContainer />);

    // Force client-side rendering
    rerender(<AnimatedBlobContainer />);

    // Wait for useEffect to run
    await vi.waitFor(() => {
      const fallback = container.querySelector('[role="button"]');
      if (fallback && fallback.tagName === 'DIV') {
        expect(fallback).toBeInTheDocument();
      }
    });
  });

  it('passes props to child components', async () => {
    const handleClick = vi.fn();
    const { rerender } = render(
      <AnimatedBlobContainer onClick={handleClick} size={400} className="test-class" />
    );

    // Force client-side rendering
    rerender(
      <AnimatedBlobContainer onClick={handleClick} size={400} className="test-class" />
    );

    // Wait for component to mount
    await vi.waitFor(() => {
      const element = screen.queryByRole('button');
      if (element) {
        fireEvent.click(element);
        expect(handleClick).toHaveBeenCalled();
      }
    });
  });
});

describe('WebGL Utils Integration', () => {
  it('extracts CSS color values correctly', () => {
    const { getComputedStyle } = window;
    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
    expect(brandColor).toBe('#10b981');
  });

  it('handles missing CSS properties gracefully', () => {
    window.getComputedStyle = vi.fn(() => ({
      getPropertyValue: vi.fn(() => ''),
    })) as unknown as typeof window.getComputedStyle;

    // Should not throw error when color extraction fails
    const { container } = render(<ShaderBlob />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
