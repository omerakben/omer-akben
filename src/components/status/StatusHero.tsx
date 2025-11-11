import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusHeroProps {
  title: string;
  subtitle: string;
  ctas: {
    chatHref: string;
    resumeHref: string;
  };
}

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
