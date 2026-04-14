---
title: "Operations Documentation"
description: "Production operations: runbook, security headers, performance testing, monitoring, and incident response"
date: 2025-11-02
status: stable
tags: [operations, production, security, performance, monitoring]
---

# Operations Documentation

Production operations documentation covering incident response, security configuration, performance validation, and operational workflows.

## Contents

### [Production Runbook](runbook.md)

Incident response playbook for common production issues:

- **Monitoring & Observability**: Vercel logs, Redis metrics, OpenAI status
- **Incident Playbooks**:
  - HTTP 429 rate limits (OpenAI, Redis)
  - OpenAI outages / 5xx responses
  - Missing Redis/Vector environment variables
- **Rollback Procedure**: Git revert + redeploy workflow
- **Smoke Tests**: Quality gates validation

**Key Use**: First reference during production incidents for rapid diagnosis and recovery.

### [Security Headers Playbook](security-headers.md)

Production security headers configuration and validation:

- **Header Inventory**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Content Security Policy**: Script, style, image, font, connect sources
- **Validation Checklist**: Local smoke test, curl verification, Mozilla Observatory
- **Configuration**: `next.config.ts` headers function

**Key Achievement**: A/A+ security score with HSTS preload compliance.

### [Performance Testing Checklist](performance-testing.md)

Performance validation workflow for UI refinements:

- **Static Analysis**: ESLint for layout thrash prevention
- **Production Build Profiling**: Bundle analysis and optimization
- **UI Interaction Performance**: Framer Motion animation profiling
- **Bundle Budget**: Homepage <300KB target

**Key Use**: Run before shipping UI changes to prevent performance regressions.

### [Maintenance Plan](maintenance-plan.md)

Cadenced maintenance plan (weekly / monthly / quarterly) for dependencies,
security, project data, and docs — keeping the repo and live site aligned with
external sources (tuel.ai, opus-nx, GitHub).

- **Weekly**: Dependabot triage and merge
- **Monthly**: Security audit + project metrics refresh + doc truth-check
- **Quarterly**: Major upgrades + branch hygiene + workflow audit

**Key Use**: Reference for routine maintenance cycles; keeps dependency lag and
doc drift bounded.

## Operational Workflows

### Pre-Deployment Checklist

1. **Quality Gates**: All 6 gates must pass (lint, tsc, test, build, size, e2e)
2. **Environment Variables**: Verify all 8 env vars configured (OpenAI, Upstash Redis/Vector, Resend)
3. **Security Headers**: Validate CSP and HSTS via curl
4. **Performance**: Bundle size within budget, Lighthouse >90 score

### Incident Response

1. **Check Monitoring**: Vercel logs → Redis metrics → OpenAI status
2. **Follow Runbook**: Use playbook for known incidents
3. **Rollback if Needed**: Git revert + redeploy
4. **Document**: Update runbook with new patterns

### Performance Validation

1. **Static Analysis**: `npm run lint`
2. **Production Build**: `npm run build`
3. **Bundle Analysis**: `npm run analyze`
4. **Lighthouse**: Run on key routes (/, /projects, /chat)

## Monitoring & Alerts

### Vercel Logs

Primary source for API route failures:

```bash
vercel logs <deployment-url>
```

### Redis Metrics

Upstash dashboard for:

- Rate limit violations
- Latency spikes
- Memory usage

### OpenAI Status

Model availability: <https://status.openai.com>

## Related Documentation

- [Architecture](../architecture/index.md) - System architecture and dependencies
- [API Documentation](../api/index.md) - Tool endpoints and rate limits
- [Reference](../reference/index.md) - Environment variables configuration
