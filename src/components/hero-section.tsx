"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, Briefcase, UserCheck, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RobotIllustration } from "@/components/robot-illustration";
import { staggerContainer, slideUp, DURATION, EASING } from "@/lib/animations";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
      </div>

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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 w-full"
              variants={slideUp}
            >
              <span className="flex items-center gap-3 mb-2 whitespace-nowrap">
                <span className="bg-gradient-to-r from-[#10B981] to-[#2563EB] bg-clip-text text-transparent">
                  Full-Stack Developer
                </span>
                <Circle className="w-3 h-3 fill-[#10B981] stroke-[#10B981] flex-shrink-0" />
              </span>
              <span className="flex items-center gap-3 mb-2">
                <span className="bg-gradient-to-r from-[#10B981] to-[#2563EB] bg-clip-text text-transparent">
                  AI Engineer
                </span>
                <Circle className="w-3 h-3 fill-[#10B981] stroke-[#10B981] flex-shrink-0" />
              </span>
              <span className="flex items-center gap-3">
                <span className="bg-gradient-to-r from-[#10B981] to-[#2563EB] bg-clip-text text-transparent">
                  SDET
                </span>
                <Circle className="w-3 h-3 fill-[#10B981] stroke-[#10B981] flex-shrink-0" />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg text-text-2 mb-8"
              variants={slideUp}
            >
              I build agentic systems, robust QA automation, and full-stack apps.
              6+ years shipping testable web applications and enterprise automation frameworks.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col gap-4"
              variants={slideUp}
            >
              {/* First Row - Get in Touch & For Recruiters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group sm:flex-1">
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" className="sm:flex-1">
                  <Link href="/recruiter">
                    <UserCheck className="mr-2 h-4 w-4" />
                    For Recruiters
                  </Link>
                </Button>
              </div>

              {/* Second Row - View My Work & Download Resume */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="ghost" size="lg" className="group sm:flex-1 bg-transparent hover:bg-text-1 text-text-1 hover:text-surf-0 border-2 border-text-1/20 hover:border-text-1 transition-all">
                  <Link href="/projects">
                    <Briefcase className="mr-2 h-4 w-4" />
                    View My Work
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="sm:flex-1 bg-transparent hover:bg-text-1 text-text-1 hover:text-surf-0 border-2 border-text-1/20 hover:border-text-1 transition-all">
                  <a href="/resume.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Robot Illustration */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.slower, delay: 0.3, ease: EASING.default }}
          >
            <RobotIllustration />
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
