import { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Cookie preferences",
  description: "How ozzy_wip_ack and ozzy_cache_pref control the in-progress experience.",
  path: "/legal/cookies",
});

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-surf-0 py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 md:px-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold text-text-1">Cookie preferences</h1>
          <p className="text-lg text-text-2">
            Two lightweight cookies keep the shipping-in-public experience predictable. They never
            store personal data and you can reset them at any time.
          </p>
        </header>

        <section className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-text-1">ozzy_wip_ack</h2>
          <p className="mt-3 text-sm text-text-2">
            Tracks whether you acknowledged the Work-in-Progress modal for the current build. When a
            new deploy ships (different build ID) the modal reappears so you can review changes and
            update your expectations.
          </p>
        </section>

        <section className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-text-1">ozzy_cache_pref</h2>
          <p className="mt-3 text-sm text-text-2">
            Remembers if you prefer faster cached responses (Performance) or always fresh data.
            Choosing Performance enables CDN caching with background revalidation. Always fresh
            forces API routes to bypass caches with <code className="rounded bg-surf-2 px-1 py-0.5">Cache-Control: no-store</code>.
          </p>
        </section>

        <section className="rounded-2xl border border-border-line bg-surf-1 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-text-1">Resetting</h2>
          <p className="mt-3 text-sm text-text-2">
            Use the “Clear cache” action in the banner or modal to delete both cookies and clear
            browser storage. You can also remove them manually via browser developer tools if you
            prefer.
          </p>
        </section>
      </div>
    </main>
  );
}
