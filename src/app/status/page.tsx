import StatusPill, { type StatusLabel } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { BUILD_DATE, BUILD_ID, SHORT_BUILD_ID } from "@/lib/build";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Build status",
  description:
    "Track what is shipping right now, what is still planned, and how caching preferences influence the experience.",
});

const whatsWorking: Array<{ label: string; status: StatusLabel; description: string }> = [
  {
    label: "WIP gate + cache banner",
    status: "beta",
    description:
      "The top banner and modal let you acknowledge public builds, choose cache behavior, and clear local state on demand.",
  },
  {
    label: "API cache headers",
    status: "beta",
    description:
      "Example and preference endpoints respect `ozzy_cache_pref` so Agentic Ozzy can negotiate Upstash-backed freshness.",
  },
  {
    label: "Project status surfacing",
    status: "beta",
    description: "Projects now expose inline status pills to signal Beta vs Planned work at a glance.",
  },
];

const whatsMissing: Array<{ label: string; status: StatusLabel; description: string }> = [
  {
    label: "Ozzy cache heuristics",
    status: "in-progress",
    description:
      "Redis fan-out for multi-agent cache coordination is prototyped but not yet exposed through the public UI toggles.",
  },
  {
    label: "Status archives",
    status: "planned",
    description:
      "Historical deploy snapshots and diff visualizations will live here so recruiters can audit feature velocity.",
  },
  {
    label: "Interactive project placeholders",
    status: "placeholder",
    description:
      "Some sections still render copy-only placeholders until the corresponding demos are hardened for production.",
  },
];

const buildHighlights = [
  "Modal acknowledgement stored per build via `ozzy_wip_ack`.",
  "Visitor-controlled cache preference cookie (`ozzy_cache_pref`).",
  "Sample API route illustrating Cache-Control negotiation.",
  "Docs + legal copy explaining the two cookies and cache clearing behavior.",
];

export default function StatusPage() {
  return (
    <main className="container mx-auto max-w-4xl space-y-12 px-4 py-16">
      <header className="space-y-3">
        <StatusPill status="beta" label="Active public build" />
        <h1 className="text-4xl font-bold text-text-1">Shipping status</h1>
        <p className="text-lg text-text-2">
          Transparency for anyone following along while Agentic Ozzy evolves. Review what works today, what is still baking,
          and how this deploy ({SHORT_BUILD_ID}) behaves.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-text-3">
          <span className="rounded-full border border-border-line/40 bg-surf-1/70 px-3 py-1 font-mono text-xs text-text-2">
            Build ID: {BUILD_ID}
          </span>
          <span className="rounded-full border border-border-line/40 bg-surf-1/70 px-3 py-1 text-xs text-text-2">
            Deployed: {BUILD_DATE}
          </span>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-1">What&apos;s working</h2>
        <div className="space-y-4">
          {whatsWorking.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-border-line/60 bg-surf-1/80 p-5 shadow-lg shadow-surf-0/20"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-text-1">{item.label}</h3>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-2 text-sm text-text-2">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-1">What&apos;s missing</h2>
        <div className="space-y-4">
          {whatsMissing.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-border-line/60 bg-surf-1/80 p-5 shadow-lg shadow-surf-0/20"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-text-1">{item.label}</h3>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-2 text-sm text-text-2">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-text-1">Mini changelog</h2>
        <div className="rounded-3xl border border-border-line/60 bg-surf-1/80 p-6 shadow-lg shadow-surf-0/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-text-3">Current build</p>
              <p className="text-xl font-semibold text-text-1">{SHORT_BUILD_ID}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start">
              <Link href="/legal/cookies">Review cookie policy</Link>
            </Button>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-text-2">
            {buildHighlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
