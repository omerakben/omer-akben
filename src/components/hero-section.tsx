"use client";

import { RobotIllustration } from "@/components/robot-illustration";
import { Button } from "@/components/ui/button";
import { DURATION, EASING, slideUp, staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";
import {
  ArrowRight,
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
              Building intelligent automation systems that eliminate repetitive
              work for engineering teams — 7 years shipping production AI tools
              and enterprise automation
            </motion.p>

            {/* Proof Chips */}
            <motion.ul
              aria-label="Highlights"
              className="flex flex-wrap gap-2 text-sm text-text-3 mb-8"
              variants={slideUp}
            >
              {[
                { text: "15+ workflow automations", title: undefined },
                {
                  text: "90% critical-path tests",
                  title:
                    "Achieved 90% test coverage on critical features and workflows",
                },
                {
                  text: "RAG + pgvector",
                  title:
                    "Built AI retrieval systems using RAG (Retrieval-Augmented Generation) and vector databases",
                },
                { text: "Playwright + Selenium", title: undefined },
                { text: "Nashville Software School", title: undefined },
              ].map((chip) => (
                <li
                  key={chip.text}
                  title={chip.title}
                  className="rounded-full border border-border-line bg-surf-1 px-3 py-1 cursor-default"
                >
                  {chip.text}
                </li>
              ))}
            </motion.ul>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col gap-3" variants={slideUp}>
              {/* Tier 1: Primary Gradient CTA */}
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#10B981] to-[#2563EB] hover:from-[#0EA472] hover:to-[#1D4ED8] text-surf-0 font-semibold group focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
              >
                <Link href="/projects">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Tier 2: Secondary Solid CTA */}
              <Button
                asChild
                size="lg"
                className="bg-accent-primary hover:bg-accent-primary/90 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
              >
                <Link href="/recruiter">
                  <UserCheck className="mr-2 h-4 w-4" />
                  For Recruiters
                </Link>
              </Button>

              {/* Tier 3 & 4: Ghost CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="sm:flex-1 border border-border-line bg-surf-1/50 hover:bg-surf-2 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
                >
                  <a
                    href="/assets/Omer_Akben_Resume_2025-10.pdf"
                    download="Omer_Akben_Resume_Full.pdf"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="sm:flex-1 border border-border-line bg-surf-1/50 hover:bg-surf-2 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0"
                  aria-label="Talk to Ozzy"
                >
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Talk to Ozzy
                  </Link>
                </Button>
              </div>

              {/* SDET Acknowledgment */}
              <p className="mt-4 text-sm text-text-2">
                Previously: Built enterprise test automation reducing QA time by
                70%
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
