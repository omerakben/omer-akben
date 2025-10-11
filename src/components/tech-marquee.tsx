"use client";

import { motion } from "framer-motion";
import * as SimpleIcons from "simple-icons";
import type { Technology } from "@/data/technologies";

interface TechMarqueeProps {
  technologies: Technology[];
  direction?: "left" | "right";
  speed?: number; // Duration in seconds
}

export function TechMarquee({
  technologies,
  direction = "left",
  speed = 40
}: TechMarqueeProps) {
  // Duplicate items for seamless infinite loop
  const duplicatedTechnologies = [...technologies, ...technologies];

  return (
    <div className="relative overflow-hidden py-4">
      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surf-0 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surf-0 to-transparent z-10" />

      <motion.div
        className="flex gap-12 items-center"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ width: "max-content" }}
      >
        {duplicatedTechnologies.map((tech, index) => {
          // Get icon from simple-icons
          const icon = SimpleIcons[`si${tech.iconName.charAt(0).toUpperCase()}${tech.iconName.slice(1)}` as keyof typeof SimpleIcons];

          return (
            <div
              key={`${tech.iconName}-${index}`}
              className="group flex flex-col items-center gap-2 flex-shrink-0"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-110 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current ${tech.colorClass}`}
                dangerouslySetInnerHTML={{
                  __html: icon?.svg || ""
                }}
              />

              {/* Label (hidden on mobile, visible on hover on desktop) */}
              <span className="hidden md:block text-xs text-text-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                {tech.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export function TechMarqueeSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-surf-0">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-text-1 mb-2">
            Technologies I Work With
          </h2>
          <p className="text-text-2">
            Building modern solutions with cutting-edge tools
          </p>
        </motion.div>

        {/* Marquee Rows */}
        <div className="space-y-8">
          {/* Import rows dynamically to avoid circular dependencies */}
          <TechMarqueeRows />
        </div>
      </div>
    </section>
  );
}

// Separate component to handle data imports
function TechMarqueeRows() {
  // Dynamic import to avoid issues
  const { technologiesRow1, technologiesRow2 } = require("@/data/technologies");

  return (
    <>
      {/* Row 1: Left to Right */}
      <TechMarquee technologies={technologiesRow1} direction="left" speed={40} />

      {/* Row 2: Right to Left */}
      <TechMarquee technologies={technologiesRow2} direction="right" speed={35} />
    </>
  );
}
