import { BUILD_ID, SHORT_BUILD_ID } from "@/lib/build";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Cookie preferences",
  description:
    "Plain-language breakdown of the Work-in-Progress acknowledgement cookie and cache preference cookie used on omerakben.com.",
});

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-8 px-4 py-16 text-text-2">
      <header className="space-y-3 text-text-1">
        <h1 className="text-3xl font-bold">Cookie preferences</h1>
        <p className="text-lg text-text-2">
          Only two first-party cookies power the public build experience. They are optional, scoped to this domain, and reset
          whenever a new build ({SHORT_BUILD_ID}) ships.
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-border-line/60 bg-surf-1/80 p-6 shadow-lg shadow-surf-0/20">
        <h2 className="text-2xl font-semibold text-text-1">What we store</h2>
        <dl className="space-y-4 text-sm">
          <div className="rounded-2xl border border-border-line/40 bg-surf-0/70 p-4">
            <dt className="font-semibold text-text-1">
              <code className="font-mono text-brand-primary">ozzy_wip_ack</code>
            </dt>
            <dd className="mt-2 space-y-2">
              <p>
                Records that you acknowledged the Work-in-Progress modal for build <span className="font-mono">{BUILD_ID}</span>.
                When the build ID changes the modal reappears automatically.
              </p>
              <p>
                Scope: <strong>first-party</strong>, expires after 30 days, accessible to client code so the banner can adapt
                instantly.
              </p>
            </dd>
          </div>
          <div className="rounded-2xl border border-border-line/40 bg-surf-0/70 p-4">
            <dt className="font-semibold text-text-1">
              <code className="font-mono text-accent-primary">ozzy_cache_pref</code>
            </dt>
            <dd className="mt-2 space-y-2">
              <p>
                Stores your caching mode: <em>performance</em> (CDN, `s-maxage=60` with `stale-while-revalidate=120`) or
                <em> fresh</em> (`Cache-Control: no-store`). API routes and future Agentic Ozzy calls inspect this cookie to honor
                your preference.
              </p>
              <p>
                Scope: <strong>first-party</strong>, expires after 30 days, readable by client and server components.
              </p>
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3 rounded-3xl border border-border-line/60 bg-surf-1/80 p-6 shadow-lg shadow-surf-0/20">
        <h2 className="text-2xl font-semibold text-text-1">How to reset</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
            Use the <strong>Clear cache</strong> button in the banner to delete both cookies, Cache Storage, localStorage, and
            sessionStorage in a single click.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
            Send a <code className="font-mono text-brand-primary">DELETE</code> request to
            <code className="font-mono text-brand-primary">/api/preferences/cache</code> if you prefer a scriptable reset.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
            Clearing your browser storage or visiting in a private window also removes the acknowledgement.
          </li>
        </ul>
      </section>

      <footer className="space-y-2 text-sm">
        <p>
          Curious what changed in this release? Visit the <Link className="text-brand-primary" href="/status">status page</Link>{" "}
          for a build-by-build changelog.
        </p>
        <p>
          Need the cookies removed manually? Email <a className="text-brand-primary" href="mailto:me@omerakben.com">
            me@omerakben.com
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
