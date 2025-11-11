/**
 * Lessons Component
 *
 * Displays a chronologically sorted list of project lessons learned.
 * Each lesson includes a formatted date and observation note.
 *
 * @module components/status/Lessons
 *
 * @example
 * ```tsx
 * <Lessons
 *   items={[
 *     {
 *       date: "2025-11-09",
 *       note: "XAI Grok models show 40% faster response times"
 *     }
 *   ]}
 * />
 * ```
 */

import type { Lesson } from "@/data/status";

/**
 * Props for the Lessons component
 */
interface LessonsProps {
  /** Array of lesson objects to display */
  items: Lesson[];
}

/**
 * Formats ISO date string to localized format
 *
 * @param value - ISO date string (YYYY-MM-DD)
 * @returns Formatted date (e.g., "Nov 9, 2025")
 *
 * @example
 * ```ts
 * formatDate("2025-11-09") // "Nov 9, 2025"
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
 * Chronologically sorted lessons list
 *
 * Displays lessons in reverse chronological order (newest first).
 * Each lesson card includes a date badge and observation note.
 *
 * @param props - Component props
 * @returns Rendered unordered list of lesson cards
 */
export function Lessons({ items }: LessonsProps) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul className="space-y-3">
      {sorted.map((lesson) => (
        <li
          key={`${lesson.date}-${lesson.note}`}
          className="rounded-2xl border border-border-line bg-surf-1 p-4 shadow-sm"
        >
          <div className="text-sm font-medium text-brand-primary">
            {formatDate(lesson.date)}
          </div>
          <p className="mt-1 text-base text-text-1">{lesson.note}</p>
        </li>
      ))}
    </ul>
  );
}
