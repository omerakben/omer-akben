Run all 6 quality gates locally before committing:

1. ESLint check (0 errors required)
2. TypeScript check (0 errors required)
3. Unit tests (776/776+ (Nov 8, 2025) passing required)
4. Production build (success required)
5. Bundle size analysis (within limits required)
6. E2E tests (66 passing required)

Execute in sequence:

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size && npm run test:e2e
```

If any gate fails, stop and fix before proceeding.

Report results:

- ✅ All gates passed - ready to commit
- ❌ Gate X failed - fix required

Never bypass quality gates. They protect production quality.
