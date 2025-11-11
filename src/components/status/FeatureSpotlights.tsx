/**
 * Feature Spotlights Component
 *
 * Displays highlighted features in a responsive two-column grid.
 * Each spotlight includes title, summary, detailed points, and optional link.
 *
 * @module components/status/FeatureSpotlights
 *
 * @example
 * ```tsx
 * <FeatureSpotlights
 *   items={[
 *     {
 *       id: "sidebar-pin",
 *       title: "Pinned Ozzy Sidebar",
 *       summary: "Desktop visitors can lock Ozzy to the right edge",
 *       badge: "New",
 *       details: ["Auto margin", "Local persistence", "Keyboard shortcut"],
 *       link: { label: "See guidance", href: "/status#sidebar-pin" }
 *     }
 *   ]}
 * />
 * ```
 */

import type { Spotlight } from "@/data/status";

/**
 * Props for the FeatureSpotlights component
 */
interface FeatureSpotlightsProps {
  /** Array of spotlight features to display */
  items: Spotlight[];
}

/**
 * Responsive grid of feature spotlight cards
 *
 * Displays spotlights in a 2-column grid (stacks on mobile).
 * Returns null if no spotlights provided (empty state).
 * Spotlight cards are visually distinct with brand-colored borders and shadows.
 *
 * @param props - Component props
 * @returns Rendered spotlight grid or null if empty
 */
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
