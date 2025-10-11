"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border-line -translate-x-1/2" />

      <div className="space-y-12">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={`${item.year}-${item.title}`}
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content */}
              <div
                className={`flex-1 ${
                  isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                } pl-8 md:pl-0`}
              >
                <div className="bg-surf-1 border border-border-line rounded-[20px] p-6 hover:border-brand-primary/50 transition-all duration-300">
                  <div className={`text-sm font-semibold mb-2 ${typeColors[item.type]}`}>
                    {item.year}
                  </div>
                  <h3 className="text-xl font-bold text-text-1 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-text-2 font-medium mb-3">
                    {item.organization}
                  </p>
                  <p className="text-text-3 mb-4">{item.description}</p>

                  {item.technologies && item.technologies.length > 0 && (
                    <div className={`flex flex-wrap gap-2 ${
                      isEven ? "md:justify-end" : "md:justify-start"
                    }`}>
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-primary border-4 border-surf-0 z-10" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
