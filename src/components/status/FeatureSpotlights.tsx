import type { Spotlight } from "@/data/status";

interface FeatureSpotlightsProps {
  items: Spotlight[];
}

export function FeatureSpotlights({ items }: FeatureSpotlightsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.id}
          id={`spotlight-${item.id}`}
          className="rounded-2xl border border-brand-primary/30 bg-surf-1 p-5 shadow-lg shadow-brand-primary/10"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-text-1">{item.title}</h3>
            {item.badge ? (
              <span className="rounded-full bg-brand-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                {item.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-text-2">{item.summary}</p>
          <ul className="mt-4 space-y-2 text-sm text-text-1">
            {item.details.map((detail, idx) => (
              <li key={`${item.id}-${idx}`} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          {item.link ? (
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
              href={item.link.href}
            >
              {item.link.label}
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
