/**
 * Metrics Row Component
 *
 * Displays a responsive grid of metric badges with labels and values.
 * Each metric supports an optional tooltip for additional context.
 *
 * @module components/status/MetricsRow
 *
 * @example
 * ```tsx
 * <MetricsRow
 *   items={[
 *     { label: "Deploy", value: "2025-11-11 15:30 UTC", tooltip: "Server build timestamp" },
 *     { label: "Commit", value: "abcdef1", tooltip: "Current commit SHA" }
 *   ]}
 * />
 * ```
 */

import type { MetricBadge } from "@/data/status";

/**
 * Props for the MetricsRow component
 */
interface MetricsRowProps {
  /** Array of metric badges to display */
  items: MetricBadge[];
}

/**
 * Responsive grid of metric badges
 *
 * Displays metrics in a grid that adapts from 2 columns (mobile) to 4 columns (lg screens).
 * Uses semantic HTML (dl/dt/dd) for proper accessibility.
 *
 * @param props - Component props
 * @returns Rendered metrics row with description list
 */
export function MetricsRow({ items }: MetricsRowProps) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-border-line bg-surf-1 p-4 shadow-sm"
          title={metric.tooltip}
        >
          <dt className="text-sm font-medium text-text-3">{metric.label}</dt>
          <dd className="mt-2 text-2xl font-semibold text-text-1">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
