"use client";

import { cn } from "@/lib/utils";

export type StatusKind = "beta" | "in-progress" | "planned" | "placeholder";

const LABELS: Record<StatusKind, string> = {
  beta: "Beta",
  "in-progress": "In Progress",
  planned: "Planned",
  placeholder: "Placeholder",
};

const STYLES: Record<StatusKind, string> = {
  beta: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
  "in-progress": "bg-amber-500/10 text-amber-200 border-amber-400/30",
  planned: "bg-sky-500/10 text-sky-200 border-sky-400/30",
  placeholder: "bg-zinc-500/10 text-zinc-200 border-zinc-400/30",
};

interface StatusPillProps {
  status: StatusKind;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
        STYLES[status],
        className
      )}
    >
      {label ?? LABELS[status]}
    </span>
  );
}
