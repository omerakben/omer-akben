"use client";

import { DURATION, EASING, STAGGER } from "@/lib/animations";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

/**
 * Reusable page header component for consistent design across all pages
 */
export function PageHeader({
  icon: Icon,
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: STAGGER.normal, delayChildren: 0.1 } },
      }}
      initial="hidden"
      animate="visible"
      className={`mb-12 border-b-2 border-border-line pb-8 ${className}`}
    >
      <motion.h1
        variants={headerSlide}
        className="mb-4 flex items-center gap-4 text-4xl font-black uppercase tracking-tight text-text-1 md:text-5xl"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-synth-volt text-synth-volt-fg md:h-14 md:w-14">
          <Icon aria-hidden="true" className="h-6 w-6 md:h-7 md:w-7" />
        </span>
        {title}
      </motion.h1>
      <motion.p
        variants={headerSlide}
        className="max-w-2xl text-lg text-text-2"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

// Keep text opaque throughout entrance motion so its contrast stays readable.
const headerSlide = {
  hidden: { y: 20 },
  visible: {
    y: 0,
    transition: { duration: DURATION.normal, ease: EASING.default },
  },
};
