import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Cookie Preferences | omerakben.com",
  description:
    "Learn how omerakben.com uses ozzy_wip_ack and ozzy_cache_pref cookies to personalize caching and Work-in-Progress messaging.",
  path: "/legal/cookies",
});

const cookiesList = [
  {
    name: "ozzy_wip_ack",
    description:
      "Stores the latest build ID you have acknowledged so the Work-in-Progress modal only appears when there is a new deploy.",
  },
  {
    name: "ozzy_cache_pref",
    description:
      "Tracks whether you prefer performance caching (s-maxage=60, stale-while-revalidate=120) or always fresh responses (no-store).",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="bg-surf-0 py-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 md:px-6">
        <header className="space-y-3">
          <p className="text-sm font-medium text-brand-primary">Transparency</p>
          <h1 className="text-4xl font-bold text-text-1">Cookie preferences</h1>
          <p className="text-text-2">
            I use a minimal set of cookies to deliver the Work-in-Progress experience and let you control caching.
            These cookies never store personal information.
          </p>
        </header>

        <section className="space-y-4 rounded-[20px] border border-border-line bg-surf-1 p-6">
          {cookiesList.map((cookie) => (
            <article key={cookie.name} className="rounded-[16px] border border-border-line bg-surf-2 p-4">
              <h2 className="text-lg font-semibold text-text-1">{cookie.name}</h2>
              <p className="mt-2 text-sm text-text-2">{cookie.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[20px] border border-border-line bg-surf-1 p-6 text-sm text-text-2">
          <h2 className="text-lg font-semibold text-text-1">Cache controls</h2>
          <p className="mt-3">
            The banner at the top of the site includes a toggle between <strong>Performance</strong> (cached) and
            <strong> Always fresh</strong>. When you change the toggle, an API request updates <code>ozzy_cache_pref</code>
            and reloads the page to hydrate server components with your preference.
          </p>
          <p className="mt-3">
            Selecting <strong>Clear cache</strong> removes both cookies, clears browser Cache Storage, and wipes local/session
            storage so the next visit starts from a clean slate.
          </p>
        </section>
      </div>
    </main>
  );
}
