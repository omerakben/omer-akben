# Documentation Changelog

All notable changes to the omerakben.com documentation will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Interactive component playground
- Search functionality across all documentation
- Versioned documentation for API changes

## [2.1.0] - 2026-04-14

### Added

- **Maintenance plan** (`docs/operations/maintenance-plan.md`) — weekly / monthly /
  quarterly cadence for dependencies, security audits, project-data sync
  (tuel.ai, opus-nx, GitHub), and doc truth-checks.
- **Top-level `.nvmrc`** pinned to Node 20 to match the CI matrix in
  `.github/workflows/quality-gates.yml` and
  `.github/workflows/pre-deployment-to-main.yml`.
- **GitHub Actions ecosystem** added to `.github/dependabot.yml` (weekly,
  grouped as `actions-core`).

### Changed

- **Doc truth-check**: reconciled test counts (815/815 across 54 files) and AI
  agent tool count (12) in `README.md`, `CLAUDE.md`, and `AGENTS.md`. Removes
  drift that accumulated since the 2.0.0 doc release.
- **Operations index** (`docs/operations/index.md`) now links the maintenance
  plan.

### Security

- Captured current `pnpm audit --prod` baseline in the maintenance plan:
  4 HIGH + 9 MODERATE advisories, all transitive. Remediation mapped onto open
  Dependabot PRs (`next 16.2.3` closes the Next.js DoS advisory; the mastra
  grouped PR closes the hono / picomatch / path-to-regexp chain).

## [2.0.0] - 2025-11-02

### Added

- **Hierarchical folder structure** with 5 categories (architecture, guides, api, operations, reference)
- **YAML frontmatter** to all documentation files for metadata consistency
- **11 API tool documentation files** in `/docs/api/tools/`:
  - download-resume.md
  - download-certificate.md
  - list-projects.md
  - open-project.md
  - get-contact.md
  - collect-contact.md
  - navigate-page.md
  - provide-navigation-links.md
  - extract-summary.md
  - profile-performance.md
  - trigger-workflow.md
- **5 index files** for category navigation (architecture/, guides/, api/, operations/, reference/)
- **Reference documentation**:
  - environment-variables.md (182 lines) - Complete environment variable reference
  - tech-stack.md (303 lines) - Technology stack with versions and rationale
- **CONTRIBUTING.md** - Comprehensive contribution guidelines
- **CHANGELOG.md** - This file

### Changed

- **Migrated 7 existing documentation files** to hierarchical structure (Git history preserved):
  - architecture-overview.md → architecture/overview.md
  - IMPLEMENTATION_SUMMARY.md → architecture/implementation-status.md
  - ACCESSIBILITY.md → guides/accessibility.md
  - SEO.md → guides/seo.md
  - RUNBOOK.md → operations/runbook.md
  - SECURITY_HEADERS.md → operations/security-headers.md
  - performance-testing.md → operations/performance-testing.md
- **File naming convention** from `UPPERCASE_NAMES.md` to `lowercase-kebab-case.md`
- **Standardized metadata** with YAML frontmatter (title, description, date, status, tags)

### Improved

- **Navigation**: Index files provide clear entry points with table of contents
- **Discoverability**: Hierarchical structure makes finding documentation easier
- **Consistency**: YAML frontmatter enables automated tooling and better metadata
- **API Documentation**: Comprehensive tool docs with examples, schemas, error handling

## [1.0.0] - 2025-10-20

### Added

- Initial documentation files in flat structure:
  - ARCHITECTURE_OVERVIEW.md
  - IMPLEMENTATION_SUMMARY.md
  - ACCESSIBILITY.md
  - SEO.md
  - RUNBOOK.md
  - SECURITY_HEADERS.md
  - performance-testing.md

### Context

- Codebase reached **zero technical debt** status
- 667 unit tests passing
- WCAG 2A compliance (8/8 E2E tests)
- Production deployment ready

## Documentation Statistics

### Version 2.0.0

- **Total Files**: 25 documentation files
- **Lines of Documentation**: ~12,000 lines
- **API Tools Documented**: 11 of 11 (100% coverage)
- **Categories**: 5 hierarchical categories
- **Index Files**: 5 navigation hubs

### Version 1.0.0

- **Total Files**: 7 documentation files
- **Lines of Documentation**: ~3,500 lines
- **Structure**: Flat (all files in `/docs/` root)

## Migration Guide

If you have bookmarks or references to old documentation paths:

| Old Path                          | New Path                                      |
| --------------------------------- | --------------------------------------------- |
| `/docs/architecture-overview.md`  | `/docs/architecture/overview.md`              |
| `/docs/IMPLEMENTATION_SUMMARY.md` | `/docs/architecture/implementation-status.md` |
| `/docs/ACCESSIBILITY.md`          | `/docs/guides/accessibility.md`               |
| `/docs/SEO.md`                    | `/docs/guides/seo.md`                         |
| `/docs/RUNBOOK.md`                | `/docs/operations/runbook.md`                 |
| `/docs/SECURITY_HEADERS.md`       | `/docs/operations/security-headers.md`        |
| `/docs/performance-testing.md`    | `/docs/operations/performance-testing.md`     |

**Note**: Old paths will redirect automatically once Nextra integration is complete.

## Upcoming Changes

### Phase 2: Nextra Integration (Planned)

- Install Nextra 4 with Next.js 15 App Router support
- Create `/app/docs/` route structure mirroring `/docs/`
- Integrate 8-mode brightness system into Nextra theme
- Override Nextra components with shadcn/ui primitives
- Enable full-text search across all documentation
- Add MDX support for interactive examples

### Estimated Timeline

- **Phase 1 (Documentation Reorganization)**: ✅ Complete (2025-11-02)
- **Phase 2 (Nextra Integration)**: In Progress (ETA: 2025-11-03)
- **Total Effort**: 10-12 hours

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this documentation.

## License

Documentation is part of the omerakben.com project and follows the same license.
