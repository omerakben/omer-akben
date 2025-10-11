"use client";

import Link from "next/link";
import { Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto w-full py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Illustration */}
          <div className="relative flex items-center justify-center">
            <NotFoundIllustration />
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge
              variant="outline"
              className="bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
            >
              Oops! Route Not Found
            </Badge>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-bold text-text-1">
                Hmm, this page seems to be missing...
              </h1>
              <p className="text-[16px] md:text-[18px] leading-[28px] text-text-2">
                Looks like you&apos;ve ventured into uncharted territory! The page
                you&apos;re looking for doesn&apos;t exist or may have been moved.
              </p>
            </div>

            {/* Feedback Text */}
            <p className="text-[16px] leading-[24px] text-text-2">
              If you think this is an error or have feedback, I&apos;d love to hear
              from you! Feel free to reach out through the contact page.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-brand-primary hover:bg-brand-primary/90">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Feedback to Omer
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 pt-4">
              <p className="text-[14px] leading-[20px] text-text-3">
                Or explore these pages:
              </p>
              <div className="flex flex-wrap gap-3 text-[14px] leading-[20px]">
                <Link
                  href="/projects"
                  className="text-brand-primary hover:underline"
                >
                  Projects
                </Link>
                <span className="text-text-3">•</span>
                <Link
                  href="/journey"
                  className="text-brand-primary hover:underline"
                >
                  Journey
                </Link>
                <span className="text-text-3">•</span>
                <Link
                  href="/skills"
                  className="text-brand-primary hover:underline"
                >
                  Skills
                </Link>
                <span className="text-text-3">•</span>
                <Link
                  href="/credentials"
                  className="text-brand-primary hover:underline"
                >
                  Credentials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 404 Illustration Component
function NotFoundIllustration() {
  return (
    <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
      {/* Gradient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[350px] h-[350px] bg-brand-primary/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Circular border */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 550 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="275"
          cy="250"
          r="175"
          stroke="url(#borderGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <defs>
          <linearGradient
            id="borderGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--brand-primary)" />
            <stop offset="100%" stopColor="var(--accent-primary)" />
          </linearGradient>
        </defs>
      </svg>

      {/* 404 Numbers */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 4 - Top Left */}
        <span className="absolute top-[15%] left-[15%] text-[48px] font-bold text-brand-primary/60">
          4
        </span>
        {/* 0 - Top Right */}
        <span className="absolute top-[32%] right-[8%] text-[48px] font-bold text-brand-primary/60">
          0
        </span>
        {/* 4 - Bottom Left */}
        <span className="absolute bottom-[17%] left-[17.5%] text-[48px] font-bold text-brand-primary/60">
          4
        </span>
      </div>

      {/* Robot Container */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative w-[206px] h-[281px]">
          {/* Robot Body */}
          <div className="absolute bottom-0 left-0 right-0 w-full h-[175px] bg-gradient-to-br from-brand-primary to-accent-primary rounded-[20px] shadow-lg shadow-brand-primary/30" />

          {/* Robot Head */}
          <div className="absolute top-[62.5px] left-1/2 -translate-x-1/2 w-[137.5px] h-[75px] bg-gradient-to-br from-brand-primary to-accent-primary rounded-t-[15px] shadow-lg shadow-brand-primary/30" />

          {/* Antenna */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-[13.75px] h-[13.75px] bg-accent-primary rounded-full shadow-lg shadow-accent-primary/50" />
            <div className="w-[2px] h-[31.25px] bg-gradient-to-b from-accent-primary to-brand-primary" />
          </div>

          {/* Eyes */}
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2 flex gap-[48px]">
            <div className="w-[13.75px] h-[13.75px] bg-surf-0 rounded-full animate-pulse" />
            <div className="w-[22px] h-[20px] bg-accent-primary rounded-full animate-pulse" />
          </div>

          {/* Question Mark */}
          <div className="absolute top-[147.5px] left-1/2 -translate-x-1/2">
            <span className="text-[73px] font-bold text-surf-0">?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
