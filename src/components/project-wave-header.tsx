"use client";

import { readCanvasToken, useCanvasLoop } from "@/lib/use-canvas-loop";
import { useRef, type ReactNode } from "react";

interface ProjectWaveHeaderProps {
  index?: number;
  status?: "completed" | "in-progress" | "planned";
  demoUrl?: string;
  slug?: string;
  /** Rendered between the wave and the badges, e.g. a screenshot reveal. */
  children?: ReactNode;
}

const RIBBON_TOKENS: readonly string[] = [
  "--synth-red",
  "--synth-emerald",
  "--synth-cyan",
  "--badge-violet",
  "--brand-aws",
  "--accent-primary",
] as const;

const RIBBON_LAYERS = 6;
const RIBBON_STEP = 6;
const RIBBON_SPEED = 0.018;

function resolveBadgeMeta(props: ProjectWaveHeaderProps): {
  label: string;
  className: string;
} {
  if (props.slug === "elon-ai") {
    return {
      label: "LIVE AT ELON",
      className: "bg-badge-orange text-white",
    };
  }
  if (props.slug === "tuel-animation-library") {
    return {
      label: "13 NPM PACKAGES",
      className: "bg-badge-emerald text-white",
    };
  }
  if (props.status === "completed" && props.demoUrl) {
    return {
      label: "● LIVE DEMO",
      className: "bg-badge-cyan text-white",
    };
  }
  if (props.status === "in-progress") {
    return {
      label: "IN PROGRESS",
      className: "bg-badge-violet text-white",
    };
  }
  return {
    label: "VERIFIED BUILD",
    className: "border border-border-line bg-surf-2 text-text-1",
  };
}

/**
 * Flowing 6-layer harmonic ribbon canvas header for Cyber-Synth project cards.
 * Adapts to the active 8-mode brightness palette and pauses when off-screen.
 */
export function ProjectWaveHeader({
  index = 0,
  status,
  demoUrl,
  slug,
  children,
}: ProjectWaveHeaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const badge = resolveBadgeMeta({ status, demoUrl, slug });
  const ordinal = String(index + 1).padStart(2, "0");

  const phaseRef = useRef(index * 0.9);
  const strokeRef = useRef("");
  const strokeIndexRef = useRef(index);

  useCanvasLoop(
    canvasRef,
    ({ ctx, width, height, dt }) => {
      // A filtered list can hand a mounted card a new index and palette slot.
      if (strokeIndexRef.current !== index) {
        strokeIndexRef.current = index;
        strokeRef.current = readCanvasToken(
          ctx.canvas,
          RIBBON_TOKENS[index % RIBBON_TOKENS.length]
        );
      }
      phaseRef.current += RIBBON_SPEED * dt;
      const phase = phaseRef.current;
      ctx.strokeStyle = strokeRef.current;
      for (let layer = 0; layer < RIBBON_LAYERS; layer++) {
        ctx.globalAlpha = 0.2 + (layer / RIBBON_LAYERS) * 0.65;
        ctx.lineWidth = layer === RIBBON_LAYERS - 1 ? 2 : 1.25;
        ctx.beginPath();
        for (let x = 0; x <= width + RIBBON_STEP; x += RIBBON_STEP) {
          const y =
            height * 0.58 +
            Math.sin(x * 0.02 + phase + layer * 0.52) * (12 + layer * 2.2) +
            Math.cos(x * 0.011 - phase * 0.65 + index) * 6.5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    (canvas) => {
      strokeRef.current = readCanvasToken(
        canvas,
        RIBBON_TOKENS[index % RIBBON_TOKENS.length]
      );
    }
  );

  return (
    <div className="relative h-36 w-full overflow-hidden border-b-2 border-border-line bg-surf-0">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full"
      />
      {children}
      <div className="pointer-events-none absolute top-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
        <span className="border border-border-line bg-surf-1 px-2.5 py-0.5 font-mono text-xs font-bold text-text-1">
          {ordinal}
        </span>
        <span
          className={`px-2.5 py-0.5 font-mono text-xs font-bold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
    </div>
  );
}
