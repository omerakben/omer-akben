import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";
import { BUILD_DATE, BUILD_ID } from "@/lib/build";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Site Status | omerakben.com",
  description:
    "Live status for omerakben.com including what is working, what is shipping next, and build details.",
  path: "/status",
});

const workingItems = [
  "Core marketing pages (Home, Projects, Skills, Contact)",
  "AI assistant baseline experience with chat sidebar",
  "Project data model with Beta/In Progress surfacing",
];

const missingItems = [
  "Detailed case studies for all projects",
  "Automated visual regression gallery",
  "Fine-tuned Ozzy agent flows for recruiter outreach",
];

export default function StatusPage() {
  const formattedDate = new Date(BUILD_DATE).toLocaleString();

  return (
    <main className="bg-surf-0 py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 md:px-6">
        <header className="space-y-3">
          <p className="text-sm font-medium text-brand-primary">Shipping in public</p>
          <h1 className="text-4xl font-bold text-text-1">Build status</h1>
          <p className="text-text-2">
            Transparency first. This page tracks what is currently working, what is planned,
            and how caching preferences impact the experience.
          </p>
        </header>

        <section className="grid gap-6 rounded-[20px] border border-border-line bg-surf-1 p-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-text-1">What&apos;s working</h2>
            <ul className="mt-4 space-y-3 text-sm text-text-2">
              {workingItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-1">What&apos;s missing</h2>
            <ul className="mt-4 space-y-3 text-sm text-text-2">
              {missingItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[20px] border border-border-line bg-surf-1 p-6">
          <h2 className="text-xl font-semibold text-text-1">Build details</h2>
          <dl className="mt-4 grid gap-4 text-sm text-text-2 md:grid-cols-2">
            <div>
              <dt className="font-semibold text-text-1">Build ID</dt>
              <dd className="font-mono text-base text-text-2">{BUILD_ID}</dd>
            </div>
            <div>
              <dt className="font-semibold text-text-1">Build date</dt>
              <dd>{formattedDate}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-semibold text-text-1">Cache modes</dt>
              <dd className="mt-2 flex flex-wrap gap-2 text-xs text-text-2">
                <StatusPill status="beta" label="Performance (cached)" />
                <StatusPill status="in-progress" label="Always fresh" />
                <StatusPill status="planned" label="Clear cache resets" />
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-text-2">
            <Button asChild variant="outline">
              <Link href="/legal/cookies">Read cookie policy</Link>
            </Button>
            <Button asChild>
              <Link href="/projects">Browse projects</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-[20px] border border-border-line bg-surf-1 p-6">
          <h2 className="text-xl font-semibold text-text-1">Changelog</h2>
          <div className="mt-4 space-y-4">
            <article className="rounded-[16px] border border-border-line bg-surf-2 p-4">
              <p className="text-xs uppercase tracking-wide text-text-3">
                Build {BUILD_ID.slice(0, 7)}
              </p>
              <p className="text-sm text-text-2">{formattedDate}</p>
              <ul className="mt-3 space-y-2 text-sm text-text-2">
                <li>Introduced Work-in-Progress gate and caching preferences.</li>
                <li>Added status pills across project listings.</li>
                <li>Documented cookie usage for transparency.</li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
