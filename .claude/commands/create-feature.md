Create a new feature branch following the project's git workflow:

1. Switch to pre-deployment and pull latest:

```bash
git checkout pre-deployment
git pull origin pre-deployment
```

2. Create feature branch:

```bash
git checkout -b feature/[feature-name]
```

3. Remind developer to:

- Use descriptive feature name (e.g., feature/contact-collection)
- Follow conventional commit format (feat:, fix:, docs:, etc.)
- Run quality gates before committing
- Test all 8 brightness modes
- Add tests for new functionality

4. When ready to commit:

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build && npm run size
git add .
git commit -m "feat: description of feature"
git push origin feature/[feature-name]
```

5. Create PR to pre-deployment branch
6. Wait for CI/CD quality gates to pass
7. After approval and merge, auto-deployment handles rest

Feature branch naming conventions:

- feature/* - New features
- fix/* - Bug fixes
- docs/* - Documentation updates
- refactor/* - Code refactoring
- test/* - Test additions/updates
