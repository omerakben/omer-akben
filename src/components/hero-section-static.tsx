"use client";

import { AnimatedBlobContainer } from "@/components/animated-blob-container";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/lib/chat-sidebar-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Mail,
  UserCheck,
} from "lucide-react";
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
                AI Engineer & Full-Stack Developer
              </span>
            </h1>

            {/* Subheadline */}
            <p className="hero-slide-up-delay-1 text-base sm:text-lg text-text-2 mb-8">
              I build GenAI/LLM apps and workflow automations with OpenAI
              Responses API and LangGraph—shipped with SDET-grade reliability.
              6+ years across QA and software engineering.
            </p>

            {/* Proof & Capability Chips */}
            <div className="hero-slide-up-delay-2 flex flex-wrap gap-2 text-sm text-text-3 mb-8">
              {/* Proof Chips (metrics/outcomes) */}
              {[
                {
                  text: "15+ workflow automations",
                  title: "Shipped 15+ production automation workflows",
                },
                {
                  text: "90% critical-path tests",
                  title:
                    "Achieved 90% test coverage on critical features and workflows",
                },
                {
                  text: "~98% suite pass rates",
                  title:
                    "Maintained ~98% test suite pass rates in enterprise environments",
                },
              ].map((chip) => (
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
                title="GenAI with OpenAI Responses API"
              >
                GenAI (OpenAI Responses API)
              </span>
              <span
                className="hidden lg:inline-block rounded-full border border-border-line bg-surf-1 px-3 py-1 cursor-default"
                title="Agent Builder and LangGraph"
              >
                Agents / LangGraph
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
                {/* Download Resume Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      aria-label="Download resume options"
                      className="sm:flex-1 border border-border-line bg-surf-1/50 hover:bg-brand-primary hover:text-white hover:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem asChild>
                      <a
                        href="/assets/Omer_Akben_Resume.pdf"
                        download="Omer_Akben_Resume.pdf"
                        className="cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Resume (PDF)
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href="/assets/Omer_Akben_Resume_Extended.pdf"
                        download="Omer_Akben_Resume_Extended.pdf"
                        className="cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Extended Resume (PDF)
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
                Previously: assetized an enterprise test framework; mature
                suites achieved ~98% pass rates.
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
