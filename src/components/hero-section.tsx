"use client";

import { RobotIllustration } from "@/components/robot-illustration";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DURATION, EASING, slideUp, staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Mail,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient accent - Dual radial gradients for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(40% 40% at 60% 45%, rgba(16, 185, 129, 0.08), transparent 60%), radial-gradient(28% 28% at 48% 62%, rgba(37, 99, 235, 0.07), transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={slideUp}
            >
              <span className="bg-gradient-to-r from-[#10B981] to-[#2563EB] bg-clip-text text-transparent">
                AI Engineer & Full-Stack Developer
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-base sm:text-lg text-text-2 mb-8"
              variants={slideUp}
            >
              I build GenAI/LLM apps and workflow automations with OpenAI
              Responses API and LangGraph—shipped with SDET-grade reliability.
              6+ years across QA and software engineering.
            </motion.p>

            {/* Proof & Capability Chips */}
            <motion.div
              className="flex flex-wrap gap-2 text-sm text-text-3 mb-8"
              variants={slideUp}
            >
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
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col gap-3" variants={slideUp}>
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
            </motion.div>
          </motion.div>

          {/* Right Column - Robot Illustration */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: DURATION.slower,
              delay: 0.3,
              ease: EASING.default,
            }}
          >
            {/* Glow effect behind robot */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-60"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(56, 189, 248, 0.18), transparent 60%)",
              }}
            />
            {/* Robot with breathe animation */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="motion-reduce:animate-none"
              title="Talk to my AI twin, Ozzy"
            >
              <RobotIllustration />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: DURATION.slow,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: EASING.default,
        }}
      >
        <div className="w-6 h-10 border-2 border-border-line rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-2 bg-brand-primary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
