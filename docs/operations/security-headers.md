# Security Headers Playbook

This document captures the production security headers configured in `next.config.ts` and how to validate them before launch.

## Header Inventory

The `headers()` function applies the following key headers to all routes:

| Header                      | Value                                          | Notes                                                          |
| --------------------------- | ---------------------------------------------- | -------------------------------------------------------------- |
| `X-DNS-Prefetch-Control`    | `on`                                           | Enables faster DNS resolution for third-party calls.           |
| `X-Frame-Options`           | `DENY`                                         | Blocks clickjacking via iframes.                               |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevents MIME-type sniffing.                                   |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Limits referrer leakage.                                       |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     | Denies unused powerful APIs.                                   |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforces HTTPS for one year, required for HSTS preload.        |
| `Content-Security-Policy`   | see below                                      | Locked to self-hosted assets and approved analytics endpoints. |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
font-src 'self' data:;
connect-src 'self' https://api.openai.com https://vercel-insights.com https://*.vercel-analytics.com https://va.vercel-scripts.com wss://localhost:* ws://localhost:*;
frame-ancestors 'none';
```

> **Note:** `'unsafe-inline'` remains temporarily for inline styles/JSON-LD. Track the TODO in `next.config.ts` to migrate to nonce or hash-based policies before GA.

## Validation Checklist

1. **Local smoke test**

   ```bash
   npm run dev
   ```

   - Visit `http://localhost:3000` and inspect **Network → Headers** for `Strict-Transport-Security` and the CSP block.
   - Confirm DevTools **Console** is free of CSP violations when navigating core routes.

2. **curl verification**

   ```bash
   curl -I https://omerakben.com | grep -i "strict-transport-security"
   curl -I https://omerakben.com | grep -i "content-security-policy"
   ```

3. **Mozilla Observatory (optional)**
   - Run a scan at <https://observatory.mozilla.org/>.
   - Expect an A/A+ score once final assets are deployed.

Keep this document updated if analytics endpoints or inline allowances change.
