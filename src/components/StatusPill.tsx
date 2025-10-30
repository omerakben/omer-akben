"use client";

import { cn } from "@/lib/utils";

const STATUS_LABELS = {
  beta: "Beta",
  "in-progress": "In Progress",
  planned: "Planned",
  placeholder: "Placeholder",
} as const;

const STATUS_STYLES = {
  beta: "bg-brand-primary/15 text-brand-primary border-brand-primary/40",
  "in-progress":
    "bg-accent-primary/15 text-accent-primary border-accent-primary/40",
  planned: "bg-surf-2 text-text-2 border-border-line/80",
  placeholder: "bg-transparent text-text-3 border-border-line/60",
} as const;

export type WorkStatus = keyof typeof STATUS_LABELS;

interface StatusPillProps {
  status: WorkStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export const statusLabelFor = (status: WorkStatus | undefined) =>
  status ? STATUS_LABELS[status] : undefined;
