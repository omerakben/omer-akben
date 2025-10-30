import { StatusPill } from "@/components/StatusPill";
import { BUILD_DATE, BUILD_ID } from "@/lib/build";
import Link from "next/link";

function formatBuildDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const workingItems = [
  {
    title: "WIP acknowledgement gate",
    status: "beta" as const,
    description:
      "First-visit modal ensures every build is acknowledged before exploring the site.",
  },
  {
    title: "Site status banner",
    status: "beta" as const,
    description:
      "Sticky banner highlights the public shipping workflow with quick access to preferences.",
  },
  {
    title: "Cache preference toggle",
    status: "beta" as const,
    description:
      "Visitors can flip between performance caching and always-fresh responses without leaving the page.",
  },
  {
    title: "Clear cache automation",
    status: "beta" as const,
    description:
      "One click clears cookies, Cache Storage, and local/session storage for a clean slate.",
  },
];

const missingItems = [
  {
    title: "Per-route cache overrides",
    status: "planned" as const,
    description:
      "Fine-grained cache rules for individual API routes and server components.",
  },
  {
    title: "Automated release highlights",
    status: "planned" as const,
    description:
      "Surface structured change notes sourced from the commit log and docs directory.",
  },
  {
    title: "Persistent banner analytics",
    status: "placeholder" as const,
    description:
      "Track dismissals and preference selections with lightweight metrics.",
  },
];

export default function StatusPage() {
  const buildIdShort = BUILD_ID.slice(0, 7);
  const buildDateLabel = formatBuildDate(BUILD_DATE);

  return (
    <main className="container mx-auto max-w-4xl space-y-10 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm text-text-3">Build {buildIdShort}</p>
        <h1 className="text-4xl font-bold text-text-1">Work in Progress</h1>
        <p className="text-lg text-text-2">
          Shipping in public means every deploy can introduce unfinished pieces. This
          page tracks what is stable, what is still baking, and how caching behaves.
        </p>
      </header>

      <section className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-text-1">What&apos;s working</h2>
        <ul className="mt-4 space-y-4 text-sm text-text-2">
          {workingItems.map((item) => (
            <li key={item.title} className="flex flex-col gap-2 rounded-xl bg-surf-2/60 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={item.status} />
                <span className="font-semibold text-text-1">{item.title}</span>
              </div>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-text-1">What&apos;s missing</h2>
        <ul className="mt-4 space-y-4 text-sm text-text-2">
          {missingItems.map((item) => (
            <li key={item.title} className="flex flex-col gap-2 rounded-xl bg-surf-2/60 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={item.status} />
                <span className="font-semibold text-text-1">{item.title}</span>
              </div>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-text-1">Changelog</h2>
        <p className="mt-2 text-sm text-text-3">Updated {buildDateLabel}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-2">
          <li>Introduced build-aware WIP gate and acknowledgement cookie.</li>
          <li>Added cache preference API with Upstash-friendly headers.</li>
          <li>Created example endpoint demonstrating dynamic Cache-Control logic.</li>
          <li>Published status and cookie transparency pages for this build.</li>
        </ul>
        <p className="mt-4 text-sm text-text-3">
          Need the legal details? Review the{" "}
          <Link
            href="/legal/cookies"
            className="text-brand-primary underline-offset-4 hover:underline"
          >
            cookie usage
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
