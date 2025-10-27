"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ContactBrand } from "@/config/contact-brands";
import { getBrandColorVars } from "@/config/contact-brands";
import { motion } from "framer-motion";
import { ExternalLink, type LucideIcon } from "lucide-react";

interface ContactMethodCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  href: string;
  brandColor: ContactBrand | "brand" | "accent";
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
  const brandVars = getBrandColorVars(brandColor);

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
        className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surf-0 rounded-xl"
        aria-label={`${label}: ${value}${subtitle ? ` - ${subtitle}` : ""}${external ? " (opens in new tab)" : ""}`}
      >
        <Card
          className="relative overflow-hidden border-border-line transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group-focus-visible:scale-[1.02] group-focus-visible:shadow-xl"
          style={brandVars}
        >
          {/* Hover gradient overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, rgba(var(--contact-rgb), 0.03), rgba(var(--contact-rgb), 0.08))`,
            }}
          />

          <CardContent className="relative p-6">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className="flex-shrink-0 p-3 rounded-xl bg-surf-2 border border-border-line transition-all duration-300 group-hover:border-[rgb(var(--contact-rgb)_/_0.3)] group-focus-visible:border-[rgb(var(--contact-rgb)_/_0.3)]"
                style={{
                  backgroundColor: "var(--surf-2)",
                }}
              >
                <Icon
                  className="w-6 h-6 text-text-2 transition-colors duration-300 group-hover:text-[rgb(var(--contact-rgb))] group-focus-visible:text-[rgb(var(--contact-rgb))]"
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
                  className="w-4 h-4 text-text-3 transition-colors duration-300 flex-shrink-0 group-hover:text-[rgb(var(--contact-rgb))] group-focus-visible:text-[rgb(var(--contact-rgb))]"
                  aria-label="Opens in new tab"
                />
              )}
            </div>

            {/* Decorative corner accent */}
            <div
              className="absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: `rgba(var(--contact-rgb), 0.2)`,
              }}
            />
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}
