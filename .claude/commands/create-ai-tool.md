Create a new AI agent tool following the established pattern:

**Step 1: Define Schema**
Create schema in `src/lib/agent-tools/schemas.ts`:

```typescript
export const myToolSchema = z.object({
  param1: z.string().min(1).max(100),
  param2: z.number().optional(),
});
```typescript

**Step 2: Create API Route**
Create `src/app/api/tools/my-tool/route.ts` with:

- Rate limiting (if needed)
- Input validation using Zod
- Error handling (400 for validation, 429 for rate limit, 500 for errors)
- Proper response format

**Step 3: Add to Mastra Tools**
Add tool to `src/lib/mastra/tools.ts`:

- Clear id and description
- Input/output schemas
- Execute function that calls API route

**Step 4: Update Knowledge Base**
Add tool documentation to `src/lib/agent-knowledge-base.ts`:

- Purpose and when to use
- Parameters
- Example usage

**Step 5: Write Tests**
Create `src/app/api/tools/my-tool/__tests__/route.test.ts`:

- Test input validation
- Test success cases
- Test error cases
- Test rate-limiting (if applicable)

**Step 6: Manual Testing**
Test tool via chat interface:

- Send message that triggers tool
- Verify tool response
- Check rate-limiting
- Test error scenarios

**Step 7: Documentation**
Update documentation files:

- AGENTS.md - Add tool to list with details
- CLAUDE.md - Add implementation notes
- .env.example - Add any new environment variables

**Step 8: Quality Gates**
Run all quality gates:

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size
```typescript

Checklist:

- [ ] Schema defined with proper validation
- [ ] API route with error handling
- [ ] Rate limiting configured (if needed)
- [ ] Mastra tool registered
- [ ] Knowledge base updated
- [ ] Tests written and passing
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] All quality gates pass

For guidance, review the ai-agent-implementation skill or check existing tools in `src/app/api/tools/`.
