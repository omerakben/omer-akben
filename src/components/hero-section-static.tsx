"use client";

import { AnimatedBlobContainer } from "@/components/animated-blob-container";
import { Button } from "@/components/ui/button";
import { facts } from "@/data/facts";
import {
  useBrightness,
  type BrightnessMode,
} from "@/lib/brightness-context";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import {
  elonOperationalProof,
  elonProofHighlights,
  qualityProof,
} from "@/lib/proof";
import { ArrowRight, Download, Mail, UserCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const BRIGHTNESS_STOPS: readonly { mode: BrightnessMode; label: string }[] = [
  { mode: "-3", label: "-3" },
  { mode: "-2", label: "-2" },
  { mode: "-1", label: "-1" },
  { mode: "0", label: "0" },
  { mode: "+1", label: "+1" },
  { mode: "+2", label: "+2" },
  { mode: "+3", label: "+3" },
  { mode: "auto", label: "AUTO" },
] as const;

export function HeroSectionStatic() {
  const { openSidebar } = useChatSidebar();
  const { brightness, setBrightness } = useBrightness();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeBrightness: BrightnessMode = isMounted ? brightness : "0";

  return (
    <section className="cybersynth-grid relative overflow-hidden border-b-2 border-border-line px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left 8 Columns: Thesis, Proof Badges & Primary Actions */}
          <div className="flex flex-col justify-between gap-6 border-2 border-border-line bg-surf-1 p-6 sm:p-8 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="font-bold text-synth-red">
                ● SYSTEM_READY {"//"} ELON UNIVERSITY PRODUCTION
              </span>
              <span className="text-text-2">
                GREEN CARD (LPR) · {facts.personal.location.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="hero-slide-up text-3xl font-black leading-[1.04] tracking-tight text-text-1 sm:text-5xl lg:text-[3.35rem]">
                I BUILT TUEL SO A UNIVERSITY CAN VERIFY EVERY ANSWER.
              </h1>
              <p className="hero-slide-up-delay-1 max-w-2xl text-base leading-relaxed text-text-2 sm:text-lg">
                AI Full-Stack Engineer &amp; EdTech Founder combining{" "}
                <strong className="text-text-1">
                  Next.js 15, FastAPI, and LangGraph
                </strong>{" "}
                with{" "}
                <strong className="text-text-1">
                  6+ years of SDET automation rigor
                </strong>
                . Live at Elon University, with a public demo at{" "}
                <Link
                  href="https://tuel.ai/#demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline underline-offset-4 hover:text-brand-primary"
                >
                  tuel.ai
                </Link>{" "}
                and creator of the 13-package{" "}
                <code className="font-mono text-sm">@tuel/*</code> animation
                library.
              </p>
            </div>

            <div className="space-y-4">
              {/* Proof Telemetry Strip */}
              <div className="hero-slide-up-delay-2 flex flex-wrap gap-2.5 font-mono text-xs font-bold">
                {elonProofHighlights.map((chip, index) => (
                  <span
                    key={chip.text}
                    title={chip.title}
                    className={
                      index === 0
                        ? "border-2 border-border-line bg-synth-volt px-3.5 py-2 uppercase text-synth-volt-fg"
                        : "border-2 border-border-line bg-surf-0 px-3.5 py-2 uppercase text-text-1"
                    }
                  >
                    {chip.text}
                  </span>
                ))}
                <span
                  title="Production token throughput on Elon AI"
                  className="border-2 border-border-line bg-surf-0 px-3.5 py-2 uppercase text-text-1"
                >
                  {elonOperationalProof.totalTokens} tokens
                </span>
              </div>

              {/* Action Row */}
              <div className="hero-slide-up-delay-3 flex flex-wrap gap-2.5">
                <Button
                  asChild
                  size="lg"
                  aria-label="View projects by Omer Akben"
                  className="rounded-none border-2 border-border-line bg-synth-volt font-mono text-xs font-bold uppercase text-synth-volt-fg hover:opacity-90"
                >
                  <Link href="/projects">
                    View Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  aria-label="Information for recruiters"
                  className="rounded-none border-2 border-border-line bg-surf-0 font-mono text-xs font-bold uppercase text-text-1 hover:border-brand-primary hover:bg-surf-2 hover:text-text-1"
                >
                  <Link href="/recruiter">
                    <UserCheck className="mr-2 h-4 w-4" />
                    For Recruiters
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  aria-label="Download professional resume"
                  className="rounded-none border-2 border-transparent bg-transparent px-3 font-mono text-xs font-bold uppercase text-text-2 underline-offset-4 hover:bg-transparent hover:text-text-1 hover:underline"
                >
                  <a
                    href="/assets/Omer_Akben_Resume.pdf"
                    download="Omer_Akben_Resume.pdf"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Resume.PDF
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  aria-label="Contact Omer"
                  className="rounded-none border-2 border-transparent bg-transparent px-3 font-mono text-xs font-bold uppercase text-text-2 underline-offset-4 hover:bg-transparent hover:text-text-1 hover:underline"
                >
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: 8-Stop Luminosity Fader + Telemetry + Ozzy Core */}
          <div className="flex flex-col justify-between gap-4 border-2 border-border-line bg-surf-1 p-6 lg:col-span-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs font-bold">
                <span className="text-text-1">8-STOP LUMINOSITY FADER</span>
                <span className="bg-synth-volt px-2 py-0.5 uppercase text-synth-volt-fg">
                  {activeBrightness}
                </span>
              </div>

              <div
                className="grid grid-cols-4 gap-1.5"
                role="group"
                aria-label="8-stop luminosity presets"
              >
                {BRIGHTNESS_STOPS.map((stop) => {
                  const isActive = activeBrightness === stop.mode;
                  return (
                    <button
                      key={stop.mode}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setBrightness(stop.mode)}
                      className={
                        isActive
                          ? "cursor-pointer border-2 border-border-line bg-synth-volt py-2 font-mono text-xs font-bold text-synth-volt-fg transition-colors"
                          : "cursor-pointer border-2 border-border-line bg-surf-0 py-2 font-mono text-xs font-bold text-text-1 transition-colors hover:border-brand-primary"
                      }
                    >
                      {stop.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 border-2 border-border-line bg-surf-0 p-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-2">SESSIONS</span>
                <strong className="text-text-1">
                  {elonOperationalProof.sessions}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-2">ERROR_RATE</span>
                <strong className="uppercase text-synth-emerald">
                  {elonOperationalProof.errorRate}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-2">UNIT_TESTS</span>
                <strong className="text-text-1">
                  {qualityProof.unitTests} PASSING
                </strong>
              </div>
            </div>

            {/* Ozzy AI Neural Core Bay (Desktop) */}
            <div className="hidden lg:block relative hero-fade-in-right">
              <div className="flex items-center justify-between gap-3 border-2 border-border-line bg-surf-0 p-3">
                <div className="space-y-1 font-mono text-xs">
                  <div className="font-bold text-synth-red">
                    ● OZZY_AI {"//"} NEURAL CORE
                  </div>
                  <div className="text-text-2">
                    Click orb or press ⌘K to chat
                  </div>
                </div>
                <div
                  className="shader-blob-breathe motion-reduce:animate-none shrink-0"
                  title="Talk to my AI twin, Ozzy"
                >
                  <AnimatedBlobContainer
                    onClick={openSidebar}
                    size={72}
                    disableCenterDimming={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
