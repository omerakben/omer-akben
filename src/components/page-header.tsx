"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { slideUp, staggerContainer, VIEWPORT } from "@/lib/animations";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

/**
 * Reusable page header component for consistent design across all pages
 */
export function PageHeader({ icon: Icon, title, description, className = "" }: PageHeaderProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT.default}
      className={`text-center mb-12 ${className}`}
    >
      <motion.h1
        variants={slideUp}
        className="text-4xl md:text-5xl font-bold text-text-1 mb-6 flex items-center justify-center gap-4"
      >
        <Icon className="w-10 h-10 md:w-12 md:h-12 text-brand-primary flex-shrink-0" />
        {title}
      </motion.h1>
      <motion.p
        variants={slideUp}
        className="text-lg text-text-2 max-w-2xl mx-auto"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
