"use client";

import { AnimatedBlobContainer } from "@/components/animated-blob-container";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { elonProofHighlights } from "@/lib/proof";
import { ArrowRight, Download, Mail, UserCheck } from "lucide-react";
import Link from "next/link";

export function HeroSectionStatic() {
  const { openSidebar } = useChatSidebar();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient accent - Dual radial gradients for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none hero-bg-gradient"
      />

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="hero-content-stagger">
            {/* Main Heading */}
            <h1 className="hero-slide-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#10B981] to-[#2563EB] bg-clip-text text-transparent">
                AI Full-Stack Engineer & EdTech Founder
              </span>
            </h1>

            {/* Subheadline */}
            <p className="hero-slide-up-delay-1 text-base sm:text-lg text-text-2 mb-8">
              I built TUEL so a university can verify every answer. Live at
              Elon.
            </p>

            {/* Proof & Capability Chips */}
            <div className="hero-slide-up-delay-2 flex flex-wrap gap-2 text-sm text-text-3 mb-8">
              {/* Proof Chips (metrics/outcomes) */}
              {elonProofHighlights.map((chip) => (
                <span
                  key={chip.text}
                  title={chip.title}
                  className="rounded-full border border-border-line bg-surf-1 px-3 py-1 cursor-default"
                >
                  {chip.text}
                </span>
              ))}

              {/* Capability Chips (skills/stack) - shown on desktop, hidden on mobile for space */}
              <span
                className="hidden md:inline-block rounded-full border border-border-line bg-surf-1 px-3 py-1 cursor-default"
                title="RAG pipelines and LangGraph orchestration"
              >
                RAG + LangGraph
              </span>
              <span
                className="hidden lg:inline-block rounded-full border border-border-line bg-surf-1 px-3 py-1 cursor-default"
                title="LLM evaluation and observability"
              >
                RAGAS / LangSmith
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="hero-slide-up-delay-3 flex flex-col gap-3">
              {/* Primary CTA */}
              <Button
                asChild
                size="lg"
                aria-label="View projects by Omer Akben"
                className="bg-gradient-to-r from-[#10B981] to-[#2563EB] hover:from-[#0EA472] hover:to-[#1D4ED8] text-surf-0 font-semibold group focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
              >
                <Link href="/projects">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Secondary CTA */}
              <Button
                asChild
                size="lg"
                variant="outline"
                aria-label="Information for recruiters"
                className="border-2 border-text-1/20 hover:bg-brand-primary hover:text-white hover:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
              >
                <Link href="/recruiter">
                  <UserCheck className="mr-2 h-4 w-4" />
                  For Recruiters
                </Link>
              </Button>

              {/* Utility CTA Group */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Download Resume */}
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  aria-label="Download professional resume"
                  className="sm:flex-1 border border-border-line bg-surf-1/50 hover:bg-brand-primary hover:text-white hover:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
                >
                  <a
                    href="/assets/Omer_Akben_Resume.pdf"
                    download="Omer_Akben_Resume.pdf"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>

                {/* Contact Omer */}
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  aria-label="Contact Omer"
                  className="sm:flex-1 border border-border-line bg-surf-1/50 hover:bg-brand-primary hover:text-white hover:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
                >
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Omer
                  </Link>
                </Button>
              </div>

              {/* Micro-proof footer */}
              <p className="mt-4 text-sm text-text-3">
                Selected for Elon University Business Faculty Pilot Program
                after 6 months production use.{" "}
                <Link href="https://tuel.ai" className="underline underline-offset-2">
                  tuel.ai
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Animated Shader Blob */}
          <div className="hidden lg:block relative hero-fade-in-right">
            {/* Glow effect behind blob */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-60
                         bg-gradient-to-br from-brand-primary/30 to-accent-primary/30"
            />
            {/* Shader blob with breathe animation */}
            <div
              className="shader-blob-breathe motion-reduce:animate-none"
              title="Talk to my AI twin, Ozzy"
            >
              <AnimatedBlobContainer
                onClick={openSidebar}
                size={300}
                disableCenterDimming={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-border-line rounded-full flex justify-center pt-2">
          <div className="hero-scroll-dot w-1.5 h-2 bg-brand-primary rounded-full" />
        </div>
      </div>
    </section>
  );
}
