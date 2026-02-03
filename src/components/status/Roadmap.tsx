/**
 * Roadmap Component
 *
 * Displays a three-phase project roadmap (Now, Next, Later) in a responsive grid.
 * Each phase shows a list of planned features or improvements.
 *
 * @module components/status/Roadmap
 *
 * @example
 * ```tsx
 * <Roadmap
 *   data={{
 *     now: ["Pre-screen flow", "Perf snapshot card"],
 *     next: ["Upload JD flow", "Shareable conversation link"],
 *     later: ["Multi-agent research pipeline"]
 *   }}
 * />
 * ```
 */

import type { Roadmap as RoadmapData } from "@/data/status";
import { cn } from "@/lib/utils";

/**
 * Props for the Roadmap component
 */
interface RoadmapProps {
  /** Roadmap data with now, next, and later phases */
  data: RoadmapData;
}

/**
 * Roadmap phases configuration
 * Defines the order and labels for roadmap sections
 */
const phases: Array<{
  key: keyof RoadmapData;
  label: string;
}> = [
  { key: "now", label: "Now" },
  { key: "next", label: "Next" },
  { key: "later", label: "Later" },
];

/**
 * Three-column roadmap grid
 *
 * Displays roadmap phases in a responsive grid (stacks on mobile, 3 columns on lg).
 * Each phase is a semantic section with heading and bulleted list.
 *
 * @param props - Component props
 * @returns Rendered roadmap grid with phase cards
 */
export function Roadmap({ data }: RoadmapProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {phases.map(({ key, label }) => (
        <section
          key={key}
          aria-labelledby={`roadmap-${key}`}
          className={cn(
            "rounded-2xl border p-4 shadow-sm",
            key === "now"
              ? "border-brand-primary/50 bg-brand-primary/5 shadow-brand-primary/10"
              : "border-border-line bg-surf-1"
          )}
        >
          <h3
            id={`roadmap-${key}`}
            className="text-lg font-semibold text-text-1"
          >
            {label}
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-2">
            {data[key].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
