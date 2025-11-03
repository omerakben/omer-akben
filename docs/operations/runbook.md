---
title: "Production Runbook"
description: "Incident response playbook: monitoring, common incidents (rate limits, OpenAI outages, Redis failures), rollback procedures, and operational workflows"
date: 2025-11-02
status: stable
tags: [operations, runbook, incident-response, monitoring, troubleshooting]
---

# Production Runbook

Operational guide for responding to common incidents across the portfolio assistant stack.

## Monitoring & Observability

- **Vercel Logs**: Primary source for API route failures (`vercel logs <deployment-url>`).
- **Redis Metrics**: Check Upstash dashboard for rate limits and latency spikes.
- **OpenAI Status**: <https://status.openai.com> for model availability.

## Incident Playbooks

### 1. HTTP 429 — Rate Limit (OpenAI or Redis)

- **User impact**: Chat UI displays "Too many requests" toast; API returns `429` JSON error.
- **Diagnosis**:
  1. Inspect `@/lib/log.ts` output in Vercel logs for `[chat:POST]` errors.
  2. Check Upstash rate-limit analytics for spikes.
- **Mitigation**:
  - Temporarily increase `@upstash/ratelimit` thresholds in environment variables or add exponential backoff in the agent if sustainable.
  - For emergency relief, disable chat features by setting `CHAT_DISABLED=true` (layout renders maintenance banner).
- **Follow-up**: Re-enable after traffic normalizes and document in incident tracker.

### 2. OpenAI Outage / 5xx Responses

- **User impact**: Chat returns generic "Failed to process chat request" message.
- **Diagnosis**:
  1. Review `[chat:POST]` logs for upstream 5xx details (`logError` redacts PII but retains status text).
  2. Confirm outage on <https://status.openai.com>.
- **Mitigation**:
  - Fail open by serving cached project data only. Consider toggling `NEXT_PUBLIC_DISABLE_CHAT` flag to hide chat entrypoints.
  - Communicate status on landing page banner if outage extends beyond 30 minutes.
- **Follow-up**: Once restored, run `npm run test:e2e` to ensure chat regressions not introduced.

### 3. Missing Redis / Vector Environment Variables

- **User impact**: Semantic search (`/api/tools/search-projects-semantic`) returns 500 with "Failed to search projects".
- **Diagnosis**:
  1. Vercel logs show `[search-projects-semantic:GET]` or `:POST` errors complaining about undefined Redis URL/token.
  2. Verify environment variables (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`).
- **Mitigation**:
  - Populate missing env vars in Vercel > Project Settings > Environment Variables and redeploy.
  - For immediate mitigation, short-circuit the route to return static project data by flipping `FEATURE_SEMANTIC_SEARCH=false`.
- **Follow-up**: After redeploy, hit `/api/tools/search-projects-semantic?query=test` and expect `200` with results.

## Rollback Procedure

1. In GitHub, revert the latest release commit or click "Revert" on the merged PR.
2. Trigger a redeploy in Vercel (either via git push or dashboard).
3. Validate smoke tests:

   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   npm run test:e2e
   ```

4. Once stable, update incident notes with root cause and resolution.

Keep this runbook versioned alongside the codebase; update it when feature flags or infrastructure dependencies change.
