# ADR-001: Package Scope Rename `@ielcts` → `@ielts`

**Status**: Accepted
**Date**: 2026-06-06
**Issue**: [#61](https://github.com/autism-ip/ielts-claude-skills/issues/61) / ZEN-81

## Context

Current package names use `@ielcts/*` scope. Before adding new packages (`packages/adaptive/`, `packages/cloud/`), normalize to `@ielts/*` for consistency and clarity.

## Decision

Rename all `@ielcts/*` references to `@ielts/*` across the monorepo.

## Affected Files

| File | Current | Target |
|------|---------|--------|
| `packages/cli/package.json` | `@ielcts/cli` (name), `@ielcts/schemas` (dep) | `@ielts/cli`, `@ielts/schemas` |
| `packages/schemas/package.json` | `@ielcts/schemas` (name) | `@ielts/schemas` |
| `packages/dashboard/package.json` | `@ielcts/dashboard` (name) | `@ielts/dashboard` |
| `package.json` | `@ielcts/schemas`, `@ielcts/cli` (filters) | `@ielts/schemas`, `@ielts/cli` |
| `skills/ielts-dashboard/SKILL.md` | `@ielcts/dashboard` | `@ielts/dashboard` |

## Consequences

- Clean workspace builds after rename
- No behavior changes — only npm scope renaming
- Version bump `root package.json` scripts from explicit ordering to `pnpm -r build` for future-proofing

## Verification

1. `pnpm install` succeeds
2. `pnpm build` succeeds for all packages
3. `pnpm test` passes
4. `node packages/cli/dist/index.js --version` prints version
