import type { Roadmap as RoadmapData } from "@/data/status";

interface RoadmapProps {
  data: RoadmapData;
}

const phases: Array<{
  key: keyof RoadmapData;
  label: string;
}> = [
  { key: "now", label: "Now" },
  { key: "next", label: "Next" },
  { key: "later", label: "Later" },
];

export function Roadmap({ data }: RoadmapProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {phases.map(({ key, label }) => (
        <section
          key={key}
          aria-labelledby={`roadmap-${key}`}
          className="rounded-2xl border border-border-line bg-surf-1 p-4 shadow-sm"
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
