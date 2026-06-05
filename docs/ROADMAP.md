# IELTS Claude Skills v3.0 — Roadmap

---

## M1 · Foundation (3 days)

| # | Issue | Title | Deps |
|---|-------|-------|------|
| 1 | ZEN-50 | Add v3.0 architecture and roadmap docs | — |
| 2 | ZEN-51 | Restructure repository into v3.0 monorepo layout | 1 |

**Output:** `docs/` + monorepo layout with pnpm workspace

## M2 · Schema & Local Core (3 days)

| # | Issue | Title | Deps |
|---|-------|-------|------|
| 3 | ZEN-52 | Implement Zod schemas for v3.0 data records | 2 |
| 4 | ZEN-53 | Build IELTS CLI local data core | 3 |

**Output:** `packages/schemas/` + `packages/cli/`

## M3 · Structured Training Archive (4 days)

| # | Issue | Title | Deps |
|---|-------|-------|------|
| 5 | ZEN-54 | Refactor writing skill for structured reports | 4 |
| 6 | ZEN-55 | Refactor reading skill for structured error analysis | 4 |
| 14 | ZEN-63 | Refactor router skill into v3.0 control coach | 5, 6 |

**Output:** Refactored writing/reading/router skills with archive support

## M4 · Listening & Vocab MVP (3 days)

| # | Issue | Title | Deps |
|---|-------|-------|------|
| 7 | ZEN-56 | Add listening diagnosis skill and archive pipeline | 4 |
| 8 | ZEN-57 | Add vocabulary skill, review queue, and Anki export | 4 |
| 13 | ZEN-62 | Refactor speaking skill into reusable story bank system | 4 |

**Output:** New listening/vocab skills + refactored speaking

## M5 · Diagnosis & Dashboard (4 days)

| # | Issue | Title | Deps |
|---|-------|-------|------|
| 9 | ZEN-58 | Add diagnosis skill and training priority model | M3 |
| 10 | ZEN-59 | Build dashboard snapshot generator and local React dashboard | 4, 9 |

**Output:** Diagnosis skill + React dashboard

## M6 · Packaging & Release (3 days)

| # | Issue | Title | Deps |
|---|-------|-------|------|
| 11 | ZEN-60 | Add backup, restore, and migration utilities | 4 |
| 12 | ZEN-61 | Package v3.0 as a Claude Code plugin | M5 |
| 15 | ZEN-64 | Add automated tests and fixture-based smoke checks | M5 |

**Output:** Full v3.0 release

---

## Timeline

```
Week 1:  M1 + M2
Week 2:  M3
Week 3:  M4 + M5 start
Week 4:  M5 finish + M6
```

## Release Stages

- v3.0.0-beta: After M4 (core skills feature-complete)
- v3.0.0-rc: After M5 (dashboard + diagnosis)
- v3.0.0: After M6 (tested, packaged)
