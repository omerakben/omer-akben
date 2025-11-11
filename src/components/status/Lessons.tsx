import type { Lesson } from "@/data/status";

interface LessonsProps {
  items: Lesson[];
}

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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
