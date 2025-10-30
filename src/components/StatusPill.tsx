"use client";

import { cn } from "@/lib/utils";

export type StatusLabel = "beta" | "in-progress" | "planned" | "placeholder";

const STATUS_LABELS: Record<StatusLabel, string> = {
  beta: "Beta",
  "in-progress": "In Progress",
  planned: "Planned",
  placeholder: "Placeholder",
};

const STATUS_STYLES: Record<StatusLabel, string> = {
  beta: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
  "in-progress": "bg-accent-primary/10 text-accent-primary border border-accent-primary/20",
  planned: "bg-surf-2/80 text-text-2 border border-border-line/50",
  placeholder: "bg-surf-2 text-text-3 border border-border-line/40 border-dashed",
};

interface StatusPillProps {
  status: StatusLabel;
  label?: string;
  className?: string;
}

export default function StatusPill({ status, label, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
        STATUS_STYLES[status],
        className
      )}
    >
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      <span>{label ?? STATUS_LABELS[status]}</span>
    </span>
  );
}
