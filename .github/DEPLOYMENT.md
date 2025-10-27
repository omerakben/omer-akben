# Deployment Guide

## Environment Variables Required

The following environment variables must be configured in both GitHub Actions Secrets and Vercel:

### Required for Build & Runtime

- `OPENAI_API_KEY` - OpenAI API key for AI agent functionality
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST API token
- `UPSTASH_VECTOR_REST_URL` - Upstash Vector REST API URL
- `UPSTASH_VECTOR_REST_TOKEN` - Upstash Vector REST API token

### Verification Steps

1. **GitHub Actions Secrets**: Navigate to Settings > Secrets and variables > Actions
2. **Vercel Environment Variables**: Navigate to Project Settings > Environment Variables
3. Ensure all variables are set for Production, Preview, and Development environments

## CI/CD Pipeline

### GitHub Actions Workflow

- **Trigger**: Push to `main` or `develop` branches, or PRs targeting these branches
- **Jobs**:
  - Quality Checks & Build (linting, type checking, tests, build, bundle size)
  - E2E Tests (Playwright tests after quality checks pass)

### Vercel Deployment

- **Automatic**: Deploys on every push to `main` (production) or PR branches (preview)
- **Build Command**: `npm install && npm run build`
- **Framework**: Next.js

## Troubleshooting

### Pipeline Failures

1. **Build Failures**: Check if all environment variables are set
2. **Test Failures**: Review Playwright reports in GitHub Actions artifacts
3. **Bundle Size**: Check if new code exceeds size limits defined in `package.json`

### Vercel Deployment Failures

1. Verify environment variables are set in Vercel dashboard
2. Check build logs in Vercel deployment details
3. Ensure `vercel.json` configuration is correct

## Manual Deployment

To manually deploy to Vercel:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Link to project (first time only)
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Rollback Procedure

See [RUNBOOK.md](../docs/RUNBOOK.md) for detailed rollback procedures.
