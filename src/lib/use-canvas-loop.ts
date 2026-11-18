"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  /** CSS pixel size of the canvas. */
  width: number;
  height: number;
  /** Elapsed time in 60fps frame units (1 = 16.67ms). 0 for a still redraw. */
  dt: number;
  /** False under prefers-reduced-motion: render the settled state. */
  animated: boolean;
}

type Ticker = (now: number) => void;

const FRAME_MS = 1000 / 60;
const MAX_DPR = 2;

// One requestAnimationFrame callback drives every visible canvas on the page.
const tickers = new Set<Ticker>();
let frameId = 0;

function runTickers(now: number) {
  // Schedule first so one throwing renderer cannot stall every other canvas.
  frameId = tickers.size > 0 ? requestAnimationFrame(runTickers) : 0;
  tickers.forEach((ticker) => ticker(now));
}

function addTicker(ticker: Ticker) {
  tickers.add(ticker);
  if (!frameId) frameId = requestAnimationFrame(runTickers);
}

function removeTicker(ticker: Ticker) {
  tickers.delete(ticker);
  if (tickers.size === 0 && frameId) {
    cancelAnimationFrame(frameId);
    frameId = 0;
  }
}

// One MutationObserver on <html data-brightness> is shared by every canvas.
const themeListeners = new Set<() => void>();
let themeObserver: MutationObserver | null = null;

function subscribeToTheme(listener: () => void): () => void {
  themeListeners.add(listener);
  if (!themeObserver && typeof MutationObserver !== "undefined") {
    themeObserver = new MutationObserver(() => {
      themeListeners.forEach((notify) => notify());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-brightness"],
    });
  }
  return () => {
    themeListeners.delete(listener);
    if (themeListeners.size === 0) {
      themeObserver?.disconnect();
      themeObserver = null;
    }
  };
}

/**
 * Reads a CSS custom property from <html>, falling back to the element's own
 * text color so canvas drawing never needs a hardcoded color.
 */
export function readCanvasToken(element: Element, token: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value || getComputedStyle(element).color;
}

/**
 * Drives a 2D canvas: DPR-aware sizing, a shared frame loop that only runs
 * while the canvas is on screen, the tab is visible and motion is allowed,
 * and a still redraw on resize or brightness change.
 *
 * `render` and `onThemeChange` may change every render without restarting
 * the loop. Returns a stable `redraw` for state changes made outside it.
 */
export function useCanvasLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  render: (frame: CanvasFrame) => void,
  onThemeChange?: (canvas: HTMLCanvasElement) => void
): () => void {
  const renderRef = useRef(render);
  const themeRef = useRef(onThemeChange);
  const redrawRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    renderRef.current = render;
    themeRef.current = onThemeChange;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    let width = 0;
    let height = 0;
    let lastTime = 0;
    let isVisible = typeof IntersectionObserver === "undefined";
    let isRunning = false;

    const paint = (dt: number) => {
      if (width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);
      renderRef.current({
        ctx,
        width,
        height,
        dt,
        animated: !motionQuery?.matches,
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const pixelWidth = Math.round(rect.width * dpr);
      const pixelHeight = Math.round(rect.height * dpr);
      width = rect.width;
      height = rect.height;
      // Assigning canvas.width reallocates the bitmap, so only do it on change.
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(0);
    };

    const tick: Ticker = (now) => {
      // Clamp so a long pause never produces a visible jump.
      const dt = lastTime ? Math.min(3, (now - lastTime) / FRAME_MS) : 1;
      lastTime = now;
      paint(dt);
    };

    const syncLoop = () => {
      const shouldRun = isVisible && !document.hidden && !motionQuery?.matches;
      if (shouldRun === isRunning) return;
      isRunning = shouldRun;
      lastTime = 0;
      if (shouldRun) addTicker(tick);
      else removeTicker(tick);
    };

    const handleMotionChange = () => {
      syncLoop();
      paint(0);
    };

    themeRef.current?.(canvas);
    resize();
    redrawRef.current = () => paint(0);

    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry?.isIntersecting ?? true;
              syncLoop();
            },
            { rootMargin: "100px" }
          )
        : null;
    intersectionObserver?.observe(canvas);

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);

    const unsubscribeTheme = subscribeToTheme(() => {
      themeRef.current?.(canvas);
      paint(0);
    });

    // Browser zoom and display changes alter devicePixelRatio without
    // resizing the element, so ResizeObserver alone would miss them.
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", syncLoop);
    motionQuery?.addEventListener("change", handleMotionChange);
    syncLoop();

    return () => {
      removeTicker(tick);
      redrawRef.current = () => undefined;
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      unsubscribeTheme();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncLoop);
      motionQuery?.removeEventListener("change", handleMotionChange);
    };
  }, [canvasRef]);

  return useCallback(() => redrawRef.current(), []);
}
