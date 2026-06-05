# IELTS Claude Skills v3.0 — Dashboard Specification

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + React 18 |
| Language | TypeScript |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Data source | Local JSON snapshot (`~/.ielts/stats.json`) |

## Pages

### Overview (`/`)

```
┌──────────────────────────────────────────┐
│  📊 IELTS Dashboard                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ 6.5  │ │ 6.0  │ │ 6.5  │ │ 6.0  │    │
│  │Overall│ │Writing│ │Reading│ │Listening│
│  └──────┘ └──────┘ └──────┘ └──────┘    │
│  📈 Writing Trend (TR/CC/LR/GRA)         │
│  🎯 Radar Chart (4 skills vs target)     │
│  🔥 Error Heatmap (top error categories)  │
│  Exam in 71 days · 2026-08-15            │
└──────────────────────────────────────────┘
```

### Writing Detail (`/writing`)
- Per-essay score history with dimension breakdown
- Top error categories bar chart
- Word count trend

### Reading Detail (`/reading`)
- Passage score history
- Error category breakdown
- Question-type performance matrix
- Synonym count gauge

### Listening Detail (`/listening`)
- Section-level scores (S1-S4)
- Error category breakdown
- Scene vocabulary coverage

### Diagnosis (`/diagnosis`)
- Weakness radar by skill
- Priority action items
- Training plan phase timeline

## Data Flow

1. `ielts snapshot` generates `~/.ielts/stats.json`
2. Dashboard reads snapshot at page load
3. "Refresh" re-reads the file

```bash
cd packages/dashboard
pnpm install
pnpm dev       # localhost:5173
pnpm build     # static build
```

## Offline

- 100% local files, zero network
- No tracking, no telemetry
- Refresh button re-reads snapshot
