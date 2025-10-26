"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ExternalLink, type LucideIcon } from "lucide-react";

interface ContactMethodCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  href: string;
  brandColor: string;
  external?: boolean;
  delay?: number;
}

export function ContactMethodCard({
  icon: Icon,
  label,
  value,
  subtitle,
  href,
  brandColor,
  external = false,
  delay = 0,
}: ContactMethodCardProps) {
  // Use data attributes for brand colors to work with Tailwind
  const brandClass = `contact-card-${brandColor.replace("#", "")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay }}
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block group"
        aria-label={`${label}: ${value}`}
      >
        <Card
          className={`relative overflow-hidden border-border-line transition-all duration-300 ${brandClass}`}
          data-brand={brandColor}
        >
          {/* Hover gradient overlay - controlled by CSS */}
          <div className="contact-card-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardContent className="relative p-6">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="contact-card-icon flex-shrink-0 p-3 rounded-xl bg-surf-2 border border-border-line transition-all duration-300">
                <Icon
                  className="w-6 h-6 text-text-2 transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-3 uppercase tracking-wide mb-1 font-medium">
                  {label}
                </p>
                <p className="text-text-1 font-semibold truncate text-lg">
                  {value}
                </p>
                {subtitle && (
                  <p className="text-text-2 text-sm mt-1 line-clamp-1">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* External link indicator */}
              {external && (
                <ExternalLink
                  className="w-4 h-4 text-text-3 transition-colors flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Decorative corner accent */}
            <div className="contact-card-accent absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300" />
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}
