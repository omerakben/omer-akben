export default function Privacy() {
  return (
    <main className="container mx-auto max-w-3xl py-12 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>
        We collect basic analytics and do not train models on visitor content.
        Resume downloads are served as static files. For erasure or questions:
        <a href="mailto:me@omerakben.com"> me@omerakben.com</a>.
      </p>
      <ul>
        <li>Data retention: minimal, logs for troubleshooting only.</li>
        <li>No sale of personal data. No third-party trackers beyond analytics.</li>
        <li>Contact for requests: me@omerakben.com</li>
      </ul>
    </main>
  );
}
