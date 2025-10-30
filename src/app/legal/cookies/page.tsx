export default function CookiesPolicy() {
  return (
    <main className="container mx-auto max-w-3xl py-12 prose prose-invert">
      <h1>Cookie Preferences</h1>
      <p>
        This site ships in public and uses two lightweight cookies to remember how
        you prefer to browse. Both cookies are scoped to <code>omerakben.com</code>,
        contain no personal data, and can be cleared at any time from the site
        banner.
      </p>

      <h2>Cookies in use</h2>
      <ul>
        <li>
          <strong>ozzy_wip_ack</strong> — stores the current build ID after you
          acknowledge the work-in-progress modal. A new deploy (new build ID)
          prompts the modal again.
        </li>
        <li>
          <strong>ozzy_cache_pref</strong> — records whether you prefer
          performance caching or always-fresh responses. API routes, including the
          example endpoint, set <code>Cache-Control</code> headers based on this
          value.
        </li>
      </ul>

      <h2>Clearing your data</h2>
      <p>
        The “Clear cache” button in the site banner clears browser Cache Storage,
        localStorage, sessionStorage, and removes both cookies via the
        <code>DELETE /api/preferences/cache</code> endpoint. You can also delete
        them manually from your browser if you prefer.
      </p>

      <h2>Notes</h2>
      <ul>
        <li>No tracking pixels or advertising cookies are present.</li>
        <li>
          Cache preferences control headers for Upstash-backed API routes only;
          HTML rendering stays as configured per page.
        </li>
        <li>
          Questions? Email <a href="mailto:me@omerakben.com">me@omerakben.com</a>.
        </li>
      </ul>
    </main>
  );
}
