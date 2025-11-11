import type { MetricBadge } from "@/data/status";

interface MetricsRowProps {
  items: MetricBadge[];
}

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
