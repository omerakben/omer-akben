/**
 * Status Hero Component
 *
 * Hero section for the /status page featuring title, subtitle, and primary CTAs.
 * Provides quick access to AI chat and resume download.
 *
 * @module components/status/StatusHero
 *
 * @example
 * ```tsx
 * <StatusHero
 *   title="Live Status & Roadmap"
 *   subtitle="Production MVP details"
 *   ctas={{ chatHref: "/?openChat=1", resumeHref: "/resume.pdf" }}
 * />
 * ```
 */

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for the StatusHero component
 */
interface StatusHeroProps {
  /** Main heading text */
  title: string;
  /** Descriptive subtitle text */
  subtitle: string;
  /** Call-to-action links */
  ctas: {
    /** URL to open chat with AI assistant */
    chatHref: string;
    /** URL to download resume PDF */
    resumeHref: string;
  };
}

/**
 * Status page hero section with title, description, and CTAs
 *
 * @param props - Component props
 * @returns Rendered hero section with responsive layout
 */
export function StatusHero({ title, subtitle, ctas }: StatusHeroProps) {
  return (
    <section
      aria-labelledby="status-hero-title"
      className={cn(
        "w-full py-16 sm:py-20",
        "bg-surf-0",
        "border-b border-border-line"
      )}
      data-testid="status-hero"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-3">
          Production build snapshot
        </p>
        <h1
          id="status-hero-title"
          className="mt-4 text-4xl font-bold tracking-tight text-text-1 sm:text-5xl"
        >
          {title}
        </h1>
        <p className="mt-4 text-lg text-text-2 sm:text-xl">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href={ctas.chatHref}>Open Chat</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={ctas.resumeHref} rel="noopener noreferrer" target="_blank">
              Download Resume
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
