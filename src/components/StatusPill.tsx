"use client";

import { cn } from "@/lib/utils";

export type StatusVariant = "beta" | "in-progress" | "planned" | "placeholder";

const LABELS: Record<StatusVariant, string> = {
  beta: "Beta",
  "in-progress": "In Progress",
  planned: "Planned",
  placeholder: "Placeholder",
};

const STYLES: Record<StatusVariant, string> = {
  beta: "bg-accent-primary/10 text-accent-primary border border-accent-primary/30",
  "in-progress": "bg-brand-primary/10 text-brand-primary border border-brand-primary/30",
  planned: "bg-surf-2 text-text-1 border border-border-line",
  placeholder: "bg-surf-1 text-text-3 border border-dashed border-border-line",
};

interface StatusPillProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        STYLES[status],
        className
      )}
    >
      {label ?? LABELS[status]}
    </span>
  );
}
