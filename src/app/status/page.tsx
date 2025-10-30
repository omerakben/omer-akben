import { Metadata } from "next";

import { StatusPill } from "@/components/StatusPill";
import { createMetadata } from "@/lib/metadata";
import { BUILD_DATE, BUILD_ID } from "@/lib/build";

export const metadata: Metadata = createMetadata({
  title: "Build status",
  description: "Track what's working, what's in progress, and the latest deploy details.",
  path: "/status",
});

const workingItems = [
  "Core pages (Home, Projects, Skills, Contact) render end-to-end",
  "AI assistant sidebar + recruiter contact flows",
  "Upstash Redis integrations for rate limits and caching",
];

const missingItems = [
  "Detailed case studies for every project",
  "Interactive demos for planned features",
  "Full design polish on placeholder pages",
];

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-surf-0 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 md:px-8">
        <header className="space-y-4">
          <StatusPill status="beta" />
          <h1 className="text-4xl font-bold text-text-1">Shipping in public</h1>
          <p className="text-lg text-text-2">
            This portfolio is evolving in real time. Below is a snapshot of what currently works,
            what&apos;s still being built, and the latest deployment metadata.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-1">What&apos;s working</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-text-2">
              {workingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-1">What&apos;s missing</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-text-2">
              {missingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-text-1">Latest build</h2>
          <div className="mt-4 space-y-3 text-sm text-text-2">
            <p>
              <span className="font-semibold text-text-1">Build ID:</span> {BUILD_ID}
            </p>
            <p>
              <span className="font-semibold text-text-1">Deployed:</span>{" "}
              {new Date(BUILD_DATE).toLocaleString()}
            </p>
            <p className="text-text-3">
              Next deploy will reset the WIP acknowledgement so you can review changes per build.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
