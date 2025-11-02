---
title: "Environment Variables Reference"
description: "Complete environment variable configuration for development and production: OpenAI, Upstash Redis/Vector, Resend, and optional settings"
date: 2025-11-02
status: stable
tags: [configuration, environment, setup, secrets]
---

# Environment Variables Reference

Complete reference for all environment variables required for local development and production deployment of omerakben.com.

## Required Variables (Production)

### OpenAI API

```bash
OPENAI_API_KEY=sk-...
```

- **Purpose**: Powers AI assistant (Ozzy) using GPT-4o-mini model
- **Required for**: `/api/chat` endpoint, all AI tool calls
- **Where to get**: [OpenAI API Keys](https://platform.openai.com/api-keys)
- **Pricing**: Pay-per-use (see OpenAI pricing)

### Upstash Redis (Rate Limiting)

```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

- **Purpose**: Redis-backed rate limiting via middleware
- **Required for**: Production rate limits, request throttling
- **Where to get**: [Upstash Console](https://console.upstash.com/)
- **Limits**: 30 req/min chat, 60 req/min tools, 100 req/min generic
- **Fallback**: In-memory rate limiting (dev mode only)

### Upstash Vector (Episodic Memory)

```bash
UPSTASH_VECTOR_REST_URL=https://your-vector-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-token
```

- **Purpose**: Semantic search across conversation history
- **Required for**: AI episodic memory, context-aware responses
- **Where to get**: [Upstash Console](https://console.upstash.com/) → Create Vector Index
- **Dimensions**: 1536 (OpenAI text-embedding-3-small)
- **Algorithm**: KNN search for conversation context

### Resend (Email Service)

```bash
RESEND_API_KEY=re_...
OMER_EMAIL=me@omerakben.com
OMER_ZOOM_LINK=https://us06web.zoom.us/j/2675124566?pwd=...
```

- **Purpose**: Sends Zoom meeting links via email (contact collection)
- **Required for**: `collect_contact` tool, proactive contact collection
- **Where to get**: [Resend](https://resend.com/api-keys)
- **Setup**: Domain verification required (see [Resend Domains](https://resend.com/domains))
- **Rate limit**: 5 collections per IP per 24h (Redis-backed)

## Optional Variables

### Development

```bash
NODE_ENV=development|production
```

- **Purpose**: Environment detection, conditional logic
- **Default**: `development` in local, `production` on Vercel
- **Usage**: Controls logging, error handling, optimizations

### Bundle Analysis

```bash
ANALYZE=true
```

- **Purpose**: Enable Next.js bundle analyzer
- **Usage**: `ANALYZE=true npm run build`
- **Output**: Opens browser with interactive bundle visualization

## Setup Instructions

### Local Development

1. **Create `.env.local` file** in project root:

   ```bash
   cp .env.example .env.local
   ```

2. **Add all required variables**:

   ```bash
   # .env.local
   OPENAI_API_KEY=sk-...
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   UPSTASH_VECTOR_REST_URL=https://...
   UPSTASH_VECTOR_REST_TOKEN=...
   RESEND_API_KEY=re_...
   OMER_EMAIL=me@omerakben.com
   OMER_ZOOM_LINK=https://...
   ```

3. **Verify setup**:

   ```bash
   npm run dev
   # Visit http://localhost:3000 and test chat
   ```

### Vercel Deployment

1. **Navigate to** [Vercel Project Settings](https://vercel.com/dashboard) → Environment Variables

2. **Add all 8 required variables** (same as `.env.local`)

3. **Set environment scope**:
   - Production: All required variables
   - Preview: Same as production
   - Development: Optional (use `.env.local`)

4. **Redeploy** after adding variables

### CI/CD (GitHub Actions)

All required variables configured as GitHub Secrets for quality gates workflow (`.github/workflows/quality-gates.yml`).

**Configured secrets**:

- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`

## Security Best Practices

### Never Commit Secrets

```bash
# .gitignore (already configured)
.env*
!.env.example
```

### Client vs Server

- ✅ **Server-side only**: All API keys live in server components/routes
- ❌ **Never expose in browser**: No `NEXT_PUBLIC_*` prefix for secrets
- ✅ **Middleware protection**: Rate limiting prevents abuse

### Key Rotation

1. Generate new API key in provider dashboard
2. Update environment variable in Vercel
3. Redeploy application
4. Delete old API key

## Troubleshooting

### Missing Environment Variables

**Symptom**: 500 error, "undefined API key" in logs

**Solution**:

1. Check `.env.local` exists and has all 8 variables
2. Restart dev server: `npm run dev`
3. For Vercel: Add variables in project settings, redeploy

### Redis Connection Failures

**Symptom**: "Failed to connect to Redis" in logs

**Solution**:

1. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are correct
2. Check Upstash Console for database status
3. Test connection: `curl $UPSTASH_REDIS_REST_URL/ping`

### Email Send Failures

**Symptom**: "Resend API error" in collect_contact logs

**Solution**:

1. Verify domain verification at [Resend Domains](https://resend.com/domains)
2. Check `RESEND_API_KEY` is correct
3. Verify `OMER_EMAIL` matches verified domain

## Related Documentation

- [Operations Runbook](../operations/runbook.md) - Incident response for env var failures
- [Tech Stack](tech-stack.md) - Complete technology stack reference
- [API Documentation](../api/index.md) - Tool endpoints requiring env vars
