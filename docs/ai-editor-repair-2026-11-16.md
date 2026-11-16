# AI Editor provider repair — 2026-11-16

Production Shorten returned OpenAI HTTP 401 on November 15. The editor was calling
OpenAI directly, while the existing central model configuration selects xAI as primary
and explicitly assigns its non-reasoning model to editing. Ozzy chat worked in the
production smoke test.

The editor now uses the configured xAI non-reasoning model first, retaining the configured
OpenAI chat model as fallback. Missing credentials skip a provider. Each attempt has a
12-second abort signal, no SDK retries, and a 1,000 output-token limit. Empty results
try the next provider; exhaustion returns a safe 503. Raw provider exceptions and user
text are not logged. The request/response schema, operations and rate limit are unchanged.
No new dependencies, secret retrieval, credential change, or 1Password setup is involved.

Validation: lint, TypeScript, all 825 unit tests, production build, and all five size
limits passed. Tests cover xAI-only success, OpenAI-only success, fallback, safe errors,
missing credentials, invalid requests and rate limiting. Independent review found no
actionable findings. Local tests use placeholders and mock provider responses; actual
model compatibility and generation quality require a live Browser test after approval.

The rejected OpenAI credential is still unresolved: fallback and other OpenAI-only
features may remain unavailable. This change restores the editor's intended primary
provider path; it does not claim to repair the credential itself.

Browser regression: initial production-build run passed 114, skipped 12, and failed
the resume API test because the placeholder Redis URL used a browser-blocked port.
Attempts to omit the token were rejected by existing startup validation. The targeted
resume test passed with the dev server and a valid loopback port (65535), bringing
coverage to 115 passed across runs, 12 existing skips. No test or application code
was changed to bypass this failure; actual Redis behavior remains unverified locally.
