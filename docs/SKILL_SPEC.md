# IELTS Claude Skills v3.0 — Skill Specifications

---

## 1. Router (`/ielts`)

**File:** `skills/ielts/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| init | First run | Ask 3 questions → save profile |
| route | `/ielts` + query | Read stats → recommend → route |
| diagnose | `/ielts diagnose` | Quick check → stats overview → suggest |
| daily | `/ielts daily` | Generate today's plan from stats |

**Data:** Reads `profile.json`, `stats.json`. Writes `profile.json`.

## 2. Writing (`/ielts-writing`)

**File:** `skills/ielts-writing/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| review | `/ielts-writing` + essay | TR/CC/LR/GRA, annotation, rewrite |
| rewrite | `/ielts-writing rewrite` | Section rewrite at target band |
| question-analysis | `/ielts-writing analyze` | Prompt breakdown |

**Data:** Writes `~/.ielts/writing/YYYY-MM-DD-{type}.md`

## 3. Reading (`/ielts-reading`)

**File:** `skills/ielts-reading/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| analyze | `/ielts-reading` + passage | Answer check, type breakdown, band estimate |
| error-diagnosis | `/ielts-reading diagnose` | Categorize errors, explain logic |
| synonyms | `/ielts-reading synonyms` | Extract and accumulate synonym pairs |

**Data:** Writes `~/.ielts/reading/`. Appends `synonyms.md`.

## 4. Listening (`/ielts-listening`)

**File:** `skills/ielts-listening/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| dictation | `/ielts-listening dictation` | Gap-fill drill |
| guided | `/ielts-listening` | Section analysis with transcript |
| scene-vocab | `/ielts-listening vocab` | 10 scene vocabulary sets |
| error-diag | `/ielts-listening diagnose` | 5 error categories |

**Data:** Writes `~/.ielts/listening/`

## 5. Speaking (`/ielts-speaking`)

**File:** `skills/ielts-speaking/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| story-bank | `/ielts-speaking` | Load story → generate response |
| part1 | `/ielts-speaking part1` | 15 topics with D-R-E template |
| part2 | `/ielts-speaking part2` | 200-250 word story adaptation |
| part3 | `/ielts-speaking part3` | 4-6 follow-ups with expressions |

**Data:** Reads `~/.ielts/speaking/`

## 6. Vocabulary (`/ielts-vocab`)

**File:** `skills/ielts-vocab/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| review | `/ielts-vocab review` | SRS review (B6/B7/B8 tiers) |
| new-words | `/ielts-vocab new` | Introduce N new words |
| anki-export | `/ielts-vocab anki` | Generate Anki deck |

**Data:** Reads `wordlist.md`. Writes `review_log.md`.

## 7. Diagnosis (`/ielts-diagnose`)

**File:** `skills/ielts-diagnose/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| full-diagnosis | `/ielts-diagnose full` | Cross-skill analysis, comprehensive report |
| quick-check | `/ielts-diagnose` | Current strengths/weaknesses |
| plan-gen | `/ielts-diagnose plan` | Multi-week training plan |

**Data:** Reads all `~/.ielts/`. Writes `diagnosis/`.

## 8. Dashboard (`/ielts-dashboard`)

**File:** `skills/ielts-dashboard/SKILL.md`

| Mode | Trigger | Behavior |
|------|---------|----------|
| snapshot | `/ielts-dashboard` | Generate JSON snapshot, summary table |
| trends | `/ielts-dashboard trends` | In-terminal trend display |
| launch | `/ielts-dashboard launch` | Start React dev server |

**Data:** Reads `stats.json`. Spawns `pnpm --filter dashboard dev`.
