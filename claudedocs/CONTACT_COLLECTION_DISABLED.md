# Contact Collection Feature - Temporarily Disabled

**Date**: 2025-10-29
**Reason**: Missing email dependencies during PR #40 tool migration
**Status**: Temporarily disabled, ready for re-enablement

## Why Disabled

During the PR #40 tool migration (HTTP → in-process AI SDK v5 tools), the contact collection feature was temporarily disabled because it requires email dependencies that are not yet installed:

- `@react-email/render`
- `@react-email/components`
- `resend`

These dependencies are optional and marked as "In Development" per CLAUDE.md's Proactive Contact Collection section.

## What Was Disabled

### Files Renamed to `.disabled`

1. **Tool Implementation**
   - `src/lib/tools/implementations/collect-contact.ts` → `collect-contact.ts.disabled`

2. **API Route**
   - `src/app/api/tools/collect-contact/route.ts` → `route.ts.disabled`

3. **API Route Test**
   - `src/app/api/tools/collect-contact/route.test.ts` → `route.test.ts.disabled`

4. **Email Service**
   - `src/lib/email/send-zoom-link.ts` → `send-zoom-link.ts.disabled`

5. **Email Template**
   - `src/lib/email/templates/ZoomLinkEmail.tsx` → `ZoomLinkEmail.tsx.disabled`

6. **Agent**
   - `src/lib/mastra/agents/contact-agent.ts` → `contact-agent.ts.disabled`

### Code Sections Commented Out

All sections marked with `// TODO: Re-enable when email dependencies are installed`

1. **`src/lib/tools/index.ts`**
   - Line 6: `import { collectContact }`
   - Line 54: `collect_contact: collectContact` in `aiToolRegistry`
   - Line 104-107: `collect_contact` adapter in `mastraToolRegistry`
   - Line 128: `export const collectContactTool`

2. **`src/lib/mastra/tools.ts`**
   - Line 3: `collectContactTool` re-export

3. **`src/lib/mastra/agents/coordinator.ts`**
   - Lines 6-9: Contact agent import
   - Line 37: `"contact"` from `PortfolioIntent` type
   - Lines 49-50: Contact route in `ROUTES` object
   - Lines 83-86: Contact intent detection regex

4. **`src/lib/mastra/config.ts`**
   - Lines 1-2: Contact agent import
   - Lines 15-16: Contact agent in Mastra config

## Re-enablement Checklist

When email dependencies are installed, follow these steps to re-enable contact collection:

### 1. Install Dependencies

```bash
npm install @react-email/render @react-email/components resend
```

### 2. Rename Files

```bash
mv src/lib/tools/implementations/collect-contact.ts.disabled src/lib/tools/implementations/collect-contact.ts
mv src/app/api/tools/collect-contact/route.ts.disabled src/app/api/tools/collect-contact/route.ts
mv src/app/api/tools/collect-contact/route.test.ts.disabled src/app/api/tools/collect-contact/route.test.ts
mv src/lib/email/send-zoom-link.ts.disabled src/lib/email/send-zoom-link.ts
mv src/lib/email/templates/ZoomLinkEmail.tsx.disabled src/lib/email/templates/ZoomLinkEmail.tsx
mv src/lib/mastra/agents/contact-agent.ts.disabled src/lib/mastra/agents/contact-agent.ts
```

### 3. Uncomment Code Sections

Search for `// TODO: Re-enable when email dependencies are installed` and uncomment the following lines in:

- `src/lib/tools/index.ts` - Import, registry entries, export
- `src/lib/tools/index.test.ts` - Expected tool ID, test case
- `src/lib/mastra/tools.ts` - Re-export
- `src/lib/mastra/agents/coordinator.ts` - Import, type, route, intent detection
- `src/lib/mastra/config.ts` - Import, agent registration

### 4. Verify Quality Gates

```bash
npx tsc --noEmit    # TypeScript compilation
npm run lint        # ESLint
npm test            # Unit tests
npm run build       # Production build
npm run size        # Bundle size
```

### 5. Update Environment Variables

Ensure these are set in production:

```bash
RESEND_API_KEY=re_...
OMER_EMAIL=me@omerakben.com
OMER_ZOOM_LINK=https://us06web.zoom.us/j/...
```

## Feature Status

Once re-enabled, the contact collection feature provides:

- Proactive contact information collection
- Email validation and disposable email blocking
- Rate limiting (1 per IP per 24h)
- Zoom link delivery via Resend
- PII redaction and 7-day TTL
- Engagement tracking (3+ messages threshold)

## Related Documentation

- `CLAUDE.md` - Section: "Proactive Contact Collection"
- `OZZY_CONTACT_COLLECTION_PLAN.md` - Complete implementation plan
- `src/lib/tools/zod-schemas/collect-contact.ts` - Schema definitions
