"use client";

import { facts } from "@/data/facts";
import {
  elonAcademicProof,
  elonOperationalProof,
  formatElonAcademicProofLine,
  qualityProof,
} from "@/lib/proof";
import {
  readCanvasToken,
  useCanvasLoop,
  type CanvasFrame,
} from "@/lib/use-canvas-loop";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type WaveMode = "dots" | "ribbons" | "mesh";

interface WaveOption {
  id: WaveMode;
  label: string;
}

interface ChannelSpec {
  id: string;
  label: string;
  freq: number;
  amp: number;
  title: string;
  summary: string;
  specs: readonly [string, string][];
  tags: readonly string[];
  actionHref?: string;
  actionLabel?: string;
}

const WAVE_OPTIONS: readonly WaveOption[] = [
  { id: "dots", label: "WAVE 01: 3D CONTOUR MATRIX" },
  { id: "ribbons", label: "WAVE 02: HARMONIC SILK" },
  { id: "mesh", label: "WAVE 03: 3D MESH TOPOLOGY" },
] as const;

const CHANNELS: readonly ChannelSpec[] = [
  {
    id: "CH_01",
    label: "ELON RAG & CITATIONS",
    freq: 1.0,
    amp: 1.0,
    title: "Citation-Grounded RAG with a 7-Layer Prompt System",
    summary: `Deployed at ${elonAcademicProof.institution} (${elonAcademicProof.deploymentWindow}): ${formatElonAcademicProofLine()}. Hybrid pgvector + keyword retrieval with Upstash Redis semantic caching, RAGAS evaluation, and Microsoft Entra ID RBAC.`,
    specs: [
      ["RETRIEVAL PRECISION", "+25% via hybrid pgvector + keyword search"],
      ["RETRIEVAL LATENCY", "P95 < 2s retrieval · semantic caching"],
      ["GOVERNANCE", "FERPA multi-tenant isolation · 35+ audit action types"],
    ],
    tags: [
      elonAcademicProof.activeUsers + " users",
      elonAcademicProof.voluntaryAdoption + " voluntary adoption",
      elonAcademicProof.averageExamScore + " exam average",
      elonOperationalProof.totalTokens + " tokens",
    ],
    actionHref: "/projects/elon-ai",
    actionLabel: "OPEN ELON AI CASE STUDY",
  },
  {
    id: "CH_02",
    label: "@TUEL/* & FULL-STACK",
    freq: 1.32,
    amp: 1.12,
    title: "13-Package @tuel/* Animation Library & Next.js 15",
    summary:
      "Open-source Turborepo monorepo publishing SSR-safe React 19 animation primitives, Three.js / WebGL scenes, GSAP scroll choreography, and Playwright visual verification paired with Python FastAPI backends.",
    specs: [
      ["OPEN SOURCE", "13 @tuel/* NPM packages with automated Changesets CI/CD"],
      ["CORE STACK", "Next.js 15 + React 19 + FastAPI + Pydantic + Drizzle"],
      ["PERFORMANCE", "60fps canvas rendering & hydration-safe SSR architecture"],
    ],
    tags: ["Next.js 15", "React 19", "Three.js", "GSAP", "FastAPI"],
    actionHref: "/projects/tuel-animation-library",
    actionLabel: "EXPLORE @TUEL/* ARCHITECTURE",
  },
  {
    id: "CH_03",
    label: "SDET QUALITY GATES",
    freq: 0.82,
    amp: 0.92,
    title: "Shift-Left Quality Engineering Across 6+ Years",
    summary:
      "Enterprise test automation architecture experience at Oteemo, ECS, Xsolis, and Fannie Mae applied directly to LLM applications—catching regressions before production.",
    specs: [
      [
        "PORTFOLIO GATES",
        `${qualityProof.unitTests} Vitest unit tests + ${qualityProof.e2eTests} Playwright E2E tests`,
      ],
      ["STATIC HYGIENE", "0 ESLint warnings · Strict TypeScript · Size-Limit CI"],
      ["LLM EVALS", "RAGAS + DeepEval golden datasets + LangSmith tracing"],
    ],
    tags: ["Playwright", "C# / .NET 8", "RAGAS", "DeepEval", "CI/CD"],
    actionHref: "/journey",
    actionLabel: "VIEW CAREER TIMELINE",
  },
  {
    id: "CH_04",
    label: "RECRUITER BRIEF",
    freq: 1.12,
    amp: 0.96,
    title: "Immediate U.S. Work Authorization & Target Roles",
    summary: `${facts.professional.workAuthorization.status} (${facts.professional.workAuthorization.officialTitle}) based in ${facts.personal.location}, open to remote or hybrid AI Engineer, Full-Stack Developer, and SDET Architect roles.`,
    specs: [
      ["AUTHORIZATION", facts.professional.workAuthorization.status],
      ["SPONSORSHIP", "No employer sponsorship required · Zero restrictions"],
      ["AVAILABILITY", facts.professional.availability],
    ],
    tags: [
      "Green Card (LPR)",
      `${facts.professional.yearsOfExperience} yrs exp`,
      facts.personal.location,
      facts.personal.email,
    ],
    actionHref: "/recruiter",
    actionLabel: "OPEN RECRUITER BRIEF",
  },
] as const;

interface CanvasPalette {
  crest: string;
  trough: string;
  accent: string;
  muted: string;
}

/** Eased simulation state, advanced once per frame outside React. */
interface WaveSim {
  time: number;
  amp: number;
  freq: number;
  shown: WaveMode;
  fade: number;
  pull: number;
  px: number;
  py: number;
}

interface WaveTarget {
  mode: WaveMode;
  amp: number;
  freq: number;
  nx: number;
  ny: number;
  inside: boolean;
}

const FOV = 320;
const EASE_PER_FRAME = 0.1;
const FADE_PER_FRAME = 0.09;
const TIME_PER_FRAME = 0.015;
const CULL_MARGIN = 6;

// Reused between frames so the dot matrix allocates nothing while animating.
const troughDots: number[] = [];

function drawContourMatrix(
  { ctx, width, height }: CanvasFrame,
  sim: WaveSim,
  palette: CanvasPalette
) {
  const cols = 48;
  const rows = 18;
  const horizon = height * 0.34;
  const tiltY = sim.py * 12 * sim.pull;
  const shiftX = sim.px * 0.55 * sim.pull;
  const crestAt = 8 * sim.amp;

  for (let r = 0; r < rows; r++) {
    const scale = FOV / (115 + r * 23);
    const depth = 1 - r / rows;
    const rad = Math.max(1, depth * 3.1);
    // Near rows project below the canvas; skip them before any trig.
    if (horizon + (108 - 38 * sim.amp + tiltY) * scale > height + rad) continue;
    troughDots.length = 0;

    // One fill per color per row instead of one per dot.
    ctx.globalAlpha = (0.26 + depth * 0.72) * sim.fade;
    ctx.fillStyle = palette.crest;
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const u = (c / cols - 0.5) * 2;
      const sx = width * 0.5 + u * 560 * scale;
      if (sx < -CULL_MARGIN || sx > width + CULL_MARGIN) continue;
      const elev =
        (Math.sin(u * 4.5 + sim.time + r * 0.28 + shiftX) * 24 +
          Math.cos(u * 2.2 - sim.time * 0.8 + r * 0.24) * 14) *
        sim.amp;
      const sy = horizon + (108 + elev + tiltY) * scale;
      if (elev > crestAt) {
        ctx.moveTo(sx + rad, sy);
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      } else {
        troughDots.push(sx, sy);
      }
    }
    ctx.fill();

    ctx.fillStyle = palette.trough;
    ctx.beginPath();
    for (let i = 0; i < troughDots.length; i += 2) {
      ctx.moveTo(troughDots[i] + rad, troughDots[i + 1]);
      ctx.arc(troughDots[i], troughDots[i + 1], rad, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}

function drawHarmonicRibbons(
  { ctx, width, height }: CanvasFrame,
  sim: WaveSim,
  palette: CanvasPalette
) {
  const layers = 9;
  const ampBoost = 1 + Math.abs(sim.py) * 0.35 * sim.pull;
  const phaseShift = sim.px * 0.7 * sim.pull;

  for (let l = 0; l < layers; l++) {
    ctx.strokeStyle = l % 2 === 0 ? palette.accent : palette.trough;
    ctx.globalAlpha = (0.18 + (l / layers) * 0.68) * sim.fade;
    ctx.lineWidth = l >= layers - 2 ? 2.2 : 1.3;
    ctx.beginPath();
    for (let x = 0; x <= width + 6; x += 6) {
      const nx = x / width;
      const y =
        height * 0.56 +
        (Math.sin(nx * 5.8 + sim.time + l * 0.36) * 32 * ampBoost +
          Math.cos(nx * 3.1 - sim.time * 0.75 + l * 0.24 + phaseShift) * 18) *
          sim.amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawWireframeMesh(
  { ctx, width, height }: CanvasFrame,
  sim: WaveSim,
  palette: CanvasPalette
) {
  const cols = 42;
  const rows = 20;
  const horizon = height * 0.34;
  const tiltY = sim.py * 14 * sim.pull;
  const shiftX = sim.px * 0.6 * sim.pull;

  const project = (c: number, r: number): [number, number] => {
    const u = (c / cols - 0.5) * 2;
    const scale = FOV / (120 + r * 22);
    const elev =
      (Math.sin(u * 4.1 + sim.time + r * 0.24 + shiftX) * 22 +
        Math.cos(u * 2.3 - sim.time * 0.72 + r * 0.3) * 14) *
      sim.amp;
    return [
      width * 0.5 + u * 580 * scale,
      horizon + (110 + elev + tiltY) * scale,
    ];
  };

  for (let r = 0; r < rows; r++) {
    ctx.strokeStyle = r % 4 === 0 ? palette.crest : palette.trough;
    ctx.globalAlpha = (0.18 + (1 - r / rows) * 0.68) * sim.fade;
    ctx.lineWidth = r < 5 ? 1.6 : 1;
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const [sx, sy] = project(c, r);
      if (c === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  // All longitudinal ribs share one style, so they share one path.
  ctx.strokeStyle = palette.muted;
  ctx.globalAlpha = 0.18 * sim.fade;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let c = 0; c <= cols; c += 4) {
    for (let r = 0; r < rows; r++) {
      const [sx, sy] = project(c, r);
      if (r === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
  }
  ctx.stroke();
}

const WAVE_RENDERERS: Record<
  WaveMode,
  (frame: CanvasFrame, sim: WaveSim, palette: CanvasPalette) => void
> = {
  dots: drawContourMatrix,
  ribbons: drawHarmonicRibbons,
  mesh: drawWireframeMesh,
};

/**
 * Cyber-Synth Fluid 3D Wave & Architecture Deck.
 * Defaults to WAVE 01: 3D Contour Matrix, with smooth Harmonic Silk and 3D Mesh Topology modes.
 * Mode and channel changes ease into the running wave instead of restarting it.
 */
export function CyberWaveDeck() {
  const [waveStyle, setWaveStyle] = useState<WaveMode>("dots");
  const [activeChannelIdx, setActiveChannelIdx] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const activeChannel = CHANNELS[activeChannelIdx];

  const paletteRef = useRef<CanvasPalette | null>(null);
  const simRef = useRef<WaveSim>({
    time: 0,
    amp: activeChannel.amp,
    freq: activeChannel.freq,
    shown: waveStyle,
    fade: 1,
    pull: 0,
    px: 0,
    py: 0,
  });
  const targetRef = useRef<WaveTarget>({
    mode: waveStyle,
    amp: activeChannel.amp,
    freq: activeChannel.freq,
    nx: 0,
    ny: 0,
    inside: false,
  });

  const redraw = useCanvasLoop(
    canvasRef,
    (frame) => {
      const palette = paletteRef.current;
      if (!palette) return;
      const sim = simRef.current;
      const target = targetRef.current;

      if (frame.animated) {
        const ease = 1 - Math.pow(1 - EASE_PER_FRAME, frame.dt);
        sim.amp += (target.amp - sim.amp) * ease;
        sim.freq += (target.freq - sim.freq) * ease;
        sim.pull += ((target.inside ? 1 : 0) - sim.pull) * ease;
        sim.px += (target.nx - sim.px) * ease;
        sim.py += (target.ny - sim.py) * ease;
        // Cross-fade: fade the old engine out, swap, fade the new one in.
        if (sim.shown !== target.mode) {
          sim.fade -= FADE_PER_FRAME * frame.dt;
          if (sim.fade <= 0) {
            sim.fade = 0;
            sim.shown = target.mode;
          }
        } else {
          sim.fade = Math.min(1, sim.fade + FADE_PER_FRAME * frame.dt);
        }
        sim.time += TIME_PER_FRAME * sim.freq * frame.dt;
      } else {
        sim.amp = target.amp;
        sim.freq = target.freq;
        sim.shown = target.mode;
        sim.fade = 1;
        sim.pull = 0;
      }

      WAVE_RENDERERS[sim.shown](frame, sim, palette);
      frame.ctx.globalAlpha = 1;
    },
    (canvas) => {
      paletteRef.current = {
        crest: readCanvasToken(canvas, "--wave-crest"),
        trough: readCanvasToken(canvas, "--synth-cyan"),
        accent: readCanvasToken(canvas, "--synth-emerald"),
        muted: readCanvasToken(canvas, "--text-3"),
      };
    }
  );

  useEffect(() => {
    const target = targetRef.current;
    target.mode = waveStyle;
    target.amp = activeChannel.amp;
    target.freq = activeChannel.freq;
    // The loop is stopped under reduced motion, so repaint the settled state.
    redraw();
  }, [waveStyle, activeChannel.amp, activeChannel.freq, redraw]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const target = targetRef.current;
    target.nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    target.ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    target.inside = true;
  };

  const handlePointerLeave = () => {
    targetRef.current.inside = false;
  };

  const selectChannel = (index: number, moveFocus: boolean) => {
    setActiveChannelIdx(index);
    if (moveFocus) tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = CHANNELS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") {
      next = activeChannelIdx === last ? 0 : activeChannelIdx + 1;
    } else if (e.key === "ArrowLeft") {
      next = activeChannelIdx === 0 ? last : activeChannelIdx - 1;
    } else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    selectChannel(next, true);
  };

  const activeTabId = `${baseId}-tab-${activeChannelIdx}`;

  return (
    <section
      id="wave-deck"
      aria-label="Interactive Fluid 3D Wave and Architecture Telemetry"
      className="mt-6 border-2 border-border-line bg-surf-1"
    >
      {/* Wave Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-line px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="bg-synth-volt px-2 py-0.5 font-bold text-synth-volt-fg">
            FLUID WAVE ENGINE
          </span>
          <span className="hidden text-text-2 [@media(hover:hover)]:inline">
            Hover canvas to gently modulate phase
          </span>
        </div>

        <div
          className="flex flex-wrap gap-1.5 font-mono text-xs font-bold"
          role="group"
          aria-label="Wave visualization mode"
        >
          {WAVE_OPTIONS.map((option) => {
            const isActive = waveStyle === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setWaveStyle(option.id)}
                className={
                  isActive
                    ? "cursor-pointer border-2 border-border-line bg-synth-volt px-3 py-1 text-synth-volt-fg transition-colors"
                    : "cursor-pointer border-2 border-border-line bg-surf-0 px-3 py-1 text-text-1 transition-colors hover:border-brand-primary"
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 3D Wave Canvas */}
      <div className="relative h-64 overflow-hidden bg-surf-0 sm:h-72">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="block h-full w-full"
        />
        <div className="pointer-events-none absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2 font-mono text-xs sm:left-6 sm:right-6">
          <span className="border border-border-line bg-surf-1/90 px-2.5 py-1 text-text-1">
            SIGNAL_CH:{" "}
            <strong className="text-synth-cyan">
              {activeChannel.id} {"//"} {activeChannel.label}
            </strong>
          </span>
          <span className="hidden border border-border-line bg-surf-1/90 px-2.5 py-1 text-text-2 sm:inline-block">
            FREQ {activeChannel.freq.toFixed(2)}Hz · AMP{" "}
            {activeChannel.amp.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* 4 Architecture & Proof Channels */}
      <div className="space-y-5 border-t-2 border-border-line p-5 sm:p-6">
        {/* Single scrolling row; padding keeps focus rings from being clipped. */}
        <div className="-mx-1.5 overflow-x-auto p-1.5">
          <div
            className="flex gap-2 font-mono text-xs font-bold"
            role="tablist"
            aria-label="Architecture and Proof Channels"
          >
            {CHANNELS.map((channel, index) => {
              const isSelected = activeChannelIdx === index;
              return (
                <button
                  key={channel.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`${baseId}-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectChannel(index, false)}
                  onKeyDown={handleTabKeyDown}
                  className={
                    isSelected
                      ? "relative shrink-0 cursor-pointer border-2 border-border-line bg-synth-volt px-3.5 py-2 text-synth-volt-fg transition-colors after:absolute after:inset-x-0 after:bottom-0 after:border-b-[3px] after:border-synth-volt-fg"
                      : "relative shrink-0 cursor-pointer border-2 border-border-line bg-surf-0 px-3.5 py-2 text-text-1 transition-colors hover:border-brand-primary"
                  }
                >
                  [{channel.id}: {channel.label}]
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="tabpanel"
          aria-labelledby={activeTabId}
          className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12"
        >
          <div className="space-y-3 lg:col-span-5">
            <h2 className="text-xl font-extrabold tracking-tight text-text-1 sm:text-2xl">
              {activeChannel.title}
            </h2>
            <p className="text-sm leading-relaxed text-text-2">
              {activeChannel.summary}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1 font-mono text-xs font-bold">
              {activeChannel.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border-line bg-surf-0 px-2.5 py-0.5 text-synth-emerald"
                >
                  {tag}
                </span>
              ))}
            </div>
            {activeChannel.actionHref && activeChannel.actionLabel && (
              <div className="pt-1">
                <Link
                  href={activeChannel.actionHref}
                  className="inline-block border-2 border-border-line bg-surf-0 px-3.5 py-1.5 font-mono text-xs font-bold text-text-1 transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  {activeChannel.actionLabel} →
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-7">
            {activeChannel.specs.map(([label, detail]) => (
              <div
                key={label}
                className="space-y-1.5 border-2 border-border-line bg-surf-0 p-4"
              >
                <div className="font-mono text-xs font-bold text-synth-cyan">
                  {label}
                </div>
                <div className="text-sm font-semibold leading-snug text-text-1">
                  {detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
