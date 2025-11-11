import type { Milestone } from "@/data/status";

interface MilestonesProps {
  items: Milestone[];
}

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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
            {milestone.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
