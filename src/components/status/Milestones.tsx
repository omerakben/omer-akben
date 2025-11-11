/**
 * Milestones Component
 *
 * Displays a chronologically sorted list of project milestones with dates and details.
 * Each milestone includes a formatted date, title, and bulleted list of accomplishments.
 *
 * @module components/status/Milestones
 *
 * @example
 * ```tsx
 * <Milestones
 *   items={[
 *     {
 *       date: "2025-11-10",
 *       title: "Skills Agent Launch",
 *       details: ["Implemented agent", "Automated PR merging"]
 *     }
 *   ]}
 * />
 * ```
 */

import type { Milestone } from "@/data/status";

/**
 * Props for the Milestones component
 */
interface MilestonesProps {
  /** Array of milestone objects to display */
  items: Milestone[];
}

/**
 * Formats ISO date string to localized format
 *
 * @param value - ISO date string (YYYY-MM-DD)
 * @returns Formatted date (e.g., "Nov 10, 2025")
 *
 * @example
 * ```ts
 * formatDate("2025-11-10") // "Nov 10, 2025"
 * ```
 */
const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Chronologically sorted milestone list
 *
 * Displays milestones in reverse chronological order (newest first).
 * Each milestone card includes a date badge, title, and details list.
 *
 * @param props - Component props
 * @returns Rendered ordered list of milestone cards
 */
export function Milestones({ items }: MilestonesProps) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ol className="space-y-4">
      {sorted.map((milestone) => (
        <li
          key={`${milestone.date}-${milestone.title}`}
          className="rounded-2xl border border-border-line bg-surf-1 p-4 shadow-sm"
        >
          <div className="text-sm font-medium text-brand-primary">
            {formatDate(milestone.date)}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-text-1">
            {milestone.title}
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text-2">
            {milestone.details.map((detail, idx) => (
              <li key={`${milestone.date}-${idx}`}>{detail}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
