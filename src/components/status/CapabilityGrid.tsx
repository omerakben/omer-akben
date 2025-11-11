import Link from "next/link";

import type { Capability } from "@/data/status";
import { cn } from "@/lib/utils";

interface CapabilityGridProps {
  items: Capability[];
}

const baseCardClasses = cn(
  "flex h-full flex-col gap-2 rounded-2xl border p-4",
  "border-border-line bg-surf-1 shadow-sm transition-all",
  "hover:border-brand-primary/60 hover:bg-surf-0/80 hover:shadow-lg hover:shadow-brand-primary/10"
);

export function CapabilityGrid({ items }: CapabilityGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const cardContent = (
          <div className="flex h-full flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-text-1">{item.title}</h3>
              {item.badge ? (
                <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-medium text-brand-primary">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-text-2">{item.summary}</p>
          </div>
        );

        if (item.link) {
          return (
            <Link
              key={item.id}
              className={cn(
                baseCardClasses,
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              )}
              href={item.link}
            >
              {cardContent}
            </Link>
          );
        }

        return (
          <article key={item.id} className={baseCardClasses}>
            {cardContent}
          </article>
        );
      })}
    </div>
  );
}
