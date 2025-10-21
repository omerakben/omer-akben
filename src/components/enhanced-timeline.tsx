"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, CheckCircle2, MapPin, Building2 } from "lucide-react";
import { useState, memo } from "react";
import { DURATION } from "@/lib/animations";

export interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: "work" | "education" | "achievement";
  technologies?: string[];
  location?: string;
  highlights?: string[];
}

export interface TimelineProps {
  items: TimelineItem[];
}

const typeColors = {
  work: "text-brand-primary",
  education: "text-accent-primary",
  achievement: "text-text-1",
} as const;

const typeIcons = {
  work: Building2,
  education: Building2,
  achievement: CheckCircle2,
} as const;

// Memoized to prevent unnecessary re-renders when parent updates
const TimelineCard = memo(function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0); // First card expanded by default
  const Icon = typeIcons[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: DURATION.normal, delay: index * 0.1 }}
      className="relative flex items-start md:flex-row"
    >
      {/* Content */}
      <div className="flex-1 md:pl-12 pl-8"
      >
        {/* Removed layout prop for better performance - expand/collapse handled by AnimatePresence */}
        <motion.div
          className="relative bg-surf-1/80 backdrop-blur-sm border border-border-line rounded-[24px] p-6 hover:border-brand-primary/50 transition-all duration-300 shadow-lg shadow-surf-2/50 hover:shadow-xl hover:shadow-brand-primary/10 group"
        >
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-accent-primary/5 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content container */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold mb-1 ${typeColors[item.type]}`}>
                  {item.year}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-text-1 mb-1">
                  {item.title}
                </h2>
                <div className="flex items-center gap-2 text-text-2 font-medium">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span>{item.organization}</span>
                </div>
                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-text-3 mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-text-2 mb-4">{item.description}</p>

            {/* Highlights section */}
            {item.highlights && item.highlights.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  <span>{isExpanded ? "Hide" : "Show"} Key Achievements</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, maxHeight: 0 }}
                      animate={{ opacity: 1, maxHeight: "500px" }}
                      exit={{ opacity: 0, maxHeight: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 mt-4">
                        {item.highlights.map((highlight, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className="flex items-start gap-2 text-sm text-text-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                            <span className="flex-1">{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Technologies */}
            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/20 transition-all duration-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-primary/20 group-hover:bg-brand-primary/40 transition-colors duration-500" />
        </motion.div>
      </div>

      {/* Timeline dot with connecting hook - creates "holding" visual */}
      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 -top-2 z-20">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.normal, delay: index * 0.1 }}
          className="relative flex flex-col items-center"
        >
          {/* Glowing dot container */}
          <div className="relative">
            {/* Outer pulse ring - CSS animation for better performance */}
            <div
              className="absolute inset-0 rounded-full bg-brand-primary animate-pulse-ring"
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            />

            {/* Main dot - anchor point with glow */}
            <div className="relative w-5 h-5 rounded-full bg-brand-primary border-4 border-surf-0 shadow-lg shadow-brand-primary/50" />
          </div>

          {/* Connecting line - solid string that fades out at bottom */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: "2rem", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            className="w-0.5 bg-gradient-to-b from-brand-primary/40 to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  );
});

export function EnhancedTimeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line with gradient */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-brand-primary via-accent-primary to-brand-primary opacity-30" />

      <div className="space-y-16">
        {items.map((item, index) => (
          <TimelineCard key={`${item.year}-${item.title}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
