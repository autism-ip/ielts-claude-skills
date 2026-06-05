# IELTS Claude Skills v3.0 — Architecture

> 从无状态 skill 集合到本地持久化数据驱动的备考系统。

---

## Overview

v3.0 将 v1.0 的 4 个独立 skill 升级为 **数据持久化 + 8 skill 协同** 的系统。数据存在用户本地 `~/.ielts/` 目录，前端可选 React Dashboard 可视化。

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Code CLI                        │
│  ┌──────────┐  ┌───────────┐  ┌────────┐  ┌────────┐   │
│  │ /ielts   │  │ /ielts-   │  │ /ielts-│  │ /ielts-│   │
│  │ (router) │  │ writing   │  │ reading│  │ speaking│  │
│  ├──────────┤  ├───────────┤  ├────────┤  ├────────┤   │
│  │ /ielts-  │  │ /ielts-   │  │ /ielts-│  │ /ielts-│   │
│  │ listening│  │ vocab     │  │ diagnose│ │ dashboard│  │
│  └──────────┘  └───────────┘  └────────┘  └────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ reads/writes
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   ~/.ielts/ (Local FS)                   │
│  profile.json  ·  writing/*.md  ·  reading/*.md         │
│  listening/*.md  ·  speaking/*.md  ·  vocab/*.md        │
│  stats.json    ·  synonyms.md    ·  wordlist.md          │
│  diagnosis/*.md                                         │
└──────────────────────┬──────────────────────────────────┘
                       │ reads
                       ▼
┌─────────────────────────────────────────────────────────┐
│          ielts stats snapshot (CLI command)              │
│                       │                                  │
│                       ▼                                  │
┌─────────────────────────────────────────────────────────┐
│       Local React Dashboard (localhost:5173)             │
│  Trend charts · Radar chart · Error heatmap · Stats      │
└─────────────────────────────────────────────────────────┘
```

## Layers

### 1. Skill Layer (Claude Code Prompts)

每个 SKILL.md 是一个独立的 Claude Code skill，通过 `name` 字段触发。

| Skill | File | Trigger | Modes |
|-------|------|---------|-------|
| Router | `skills/ielts/SKILL.md` | `/ielts` | init, route, diagnose, daily |
| Writing | `skills/ielts-writing/SKILL.md` | `/ielts-writing` | review, rewrite, question-analysis |
| Reading | `skills/ielts-reading/SKILL.md` | `/ielts-reading` | analyze, error-diagnosis, synonyms |
| Listening | `skills/ielts-listening/SKILL.md` | `/ielts-listening` | dictation, guided, scene-vocab, error-diag |
| Speaking | `skills/ielts-speaking/SKILL.md` | `/ielts-speaking` | story-bank, part1, part2, part3 |
| Vocab | `skills/ielts-vocab/SKILL.md` | `/ielts-vocab` | review, new-words, anki-export |
| Diagnose | `skills/ielts-diagnose/SKILL.md` | `/ielts-diagnose` | full-diagnosis, quick-check, plan-gen |
| Dashboard | `skills/ielts-dashboard/SKILL.md` | `/ielts-dashboard` | snapshot, trends, launch |

### 2. Data Layer (~/.ielts/)

纯文件系统，无数据库依赖。每个记录以 markdown + YAML frontmatter 存储。

```
~/.ielts/
├── profile.json              # 用户档案
├── stats.json                # 汇总统计缓存
├── writing/
│   ├── 2026-06-01-task1.md
│   └── 2026-06-02-task2.md
├── reading/
│   ├── 2026-06-01-passage.md
│   └── synonyms.md
├── listening/
│   └── 2026-06-01-section.md
├── speaking/
│   ├── topic_groups.md
│   └── stories/
├── vocab/
│   ├── wordlist.md
│   └── review_log.md
└── diagnosis/
    └── 2026-06-01-report.md
```

### 3. CLI Layer (packages/cli)

Node.js CLI 工具。

```bash
ielts init          # 初始化 ~/.ielts/
ielts profile       # 查看/编辑档案
ielts ls [module]   # 列出指定模块的记录
ielts snapshot      # 生成统计快照
ielts backup        # 备份
ielts restore       # 恢复
ielts migrate       # 迁移
```

### 4. Schema Layer (packages/schemas)

Zod schemas 定义所有数据记录的运行时校验规则。

### 5. Dashboard Layer (packages/dashboard)

Vite + React 本地网页。

---

## Data Flow

```
User writes essay → /ielts-writing → AI scores → saves to ~/.ielts/writing/
 → updates stats.json → ielts snapshot refreshes dashboard → Dashboard shows new scores
```

## Key Decisions

1. **No database** — Pure filesystem, zero deps
2. **Markdown + YAML frontmatter** — Human-readable, grep-able
3. **CLI-first** — All data ops go through CLI
4. **Optional dashboard** — Non-essential
5. **Backward compatible** — v1.0 skills remain usable
