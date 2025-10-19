"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getIconBySlug } from "@/lib/icon-manifest";
import DOMPurify from "dompurify";
import type { Technology } from "@/data/technologies";
import { CustomTechIcons } from "@/components/custom-tech-icons";
import { DURATION } from "@/lib/animations";

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
  const iconWrapperClass =
    "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110";

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
          const iconSvg = resolveSimpleIconSvg(tech.iconName);
          const iconClasses = `${iconWrapperClass} ${tech.colorClass} [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current`;

          // Only sanitize on client side (DOMPurify requires DOM)
          const sanitizedIconSvg = iconSvg && typeof window !== "undefined"
            ? DOMPurify.sanitize(iconSvg, { USE_PROFILES: { svg: true } })
            : iconSvg;

          return (
            <div
              key={`${tech.iconName}-${index}`}
              className="group flex flex-col items-center gap-2 flex-shrink-0"
            >
              {/* Icon */}
              {sanitizedIconSvg ? (
                <div
                  className={iconClasses}
                  role="img"
                  aria-label={`${tech.name} icon`}
                  dangerouslySetInnerHTML={{
                    __html: sanitizedIconSvg
                  }}
                />
              ) : (
                <div className={`${iconWrapperClass} border border-border-line bg-surf-1`}>
                  <span className={`text-sm font-semibold ${tech.colorClass}`} aria-hidden="true">
                    {tech.name.charAt(0)}
                  </span>
                </div>
              )}

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
  const [technologyRows, setTechnologyRows] = useState<{
    row1: Technology[];
    row2: Technology[];
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    void import("@/data/technologies")
      .then((module) => {
        if (!isMounted) {
          return;
        }

        setTechnologyRows({
          row1: module.technologiesRow1,
          row2: module.technologiesRow2,
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setTechnologyRows({ row1: [], row2: [] });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-surf-0">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.normal }}
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
          {technologyRows ? (
            technologyRows.row1.length > 0 || technologyRows.row2.length > 0 ? (
              <>
                {technologyRows.row1.length > 0 && (
                  <TechMarquee technologies={technologyRows.row1} direction="left" speed={40} />
                )}

                {technologyRows.row2.length > 0 && (
                  <TechMarquee technologies={technologyRows.row2} direction="right" speed={35} />
                )}
              </>
            ) : (
              <p className="text-center text-sm text-text-3">Technologies are currently unavailable.</p>
            )
          ) : (
            <div className="space-y-4" role="status" aria-label="Loading technologies">
              <div className="h-12 rounded-full bg-surf-1/60 animate-pulse" />
              <div className="h-12 rounded-full bg-surf-1/60 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function resolveSimpleIconSvg(iconName: string) {
  // Check custom icons first
  // cspell:disable-next-line
  const customIconMap: Record<string, keyof typeof CustomTechIcons> = {
    'amazonaws': 'aws',
    'playwright': 'playwright',
    'visualstudiocode': 'vscode',
  };

  if (customIconMap[iconName]) {
    return CustomTechIcons[customIconMap[iconName]];
  }

  // Fall back to icon manifest (selective simple-icons imports)
  const icon = getIconBySlug(iconName);

  // Type guard: check if icon is a SimpleIcon object (has an svg property)
  if (icon && typeof icon === 'object' && 'svg' in icon) {
    return icon.svg;
  }

  return null;
}
