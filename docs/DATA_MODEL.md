# IELTS Claude Skills v3.0 — Data Model

> All records stored under `~/.ielts/`.

---

## 1. Profile (`profile.json`)

```json
{
  "version": "3.0.0",
  "createdAt": "2026-06-01T00:00:00.000Z",
  "updatedAt": "2026-06-05T00:00:00.000Z",
  "target": { "overall": 7.0, "writing": 6.5, "reading": 7.5, "listening": 7.5, "speaking": 6.5 },
  "examDate": "2026-08-15",
  "timezone": "Asia/Shanghai",
  "preferences": { "dailyGoal": 60, "focusAreas": ["writing", "reading"] }
}
```

## 2. Writing (`writing/YYYY-MM-DD-{task-type}.md`)

```yaml
---
type: "writing"
taskType: "task1" | "task2" | "letter"
topic: "..."
wordCount: 285
bandScore: { tr: 6.5, cc: 6.0, lr: 6.5, gra: 6.0, overall: 6.5 }
errors:
  - category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling"
    severity: "major" | "minor"
    location: "paragraph 2"
    description: "..."
rewritten: true
createdAt: "2026-06-01T10:00:00.000Z"
---
```

## 3. Reading (`reading/YYYY-MM-DD-passage.md`)

```yaml
---
type: "reading"
passageTitle: "..."
questionTypes: ["tfng", "matching-headings", "gap-fill", "heading", "true-false"]
totalQuestions: 13
correctCount: 10
bandEstimate: 6.5
errors:
  - questionNumber: 5
    type: "tfng"
    userAnswer: "FALSE"
    correctAnswer: "NOT GIVEN"
    errorCategory: "tfng_logic"
createdAt: "2026-06-01T10:00:00.000Z"
synonymsExtracted:
  - source: "rapidly"
    match: "at a fast pace"
    context: "..."
---
```

## 4. Listening (`listening/YYYY-MM-DD-section.md`)

```yaml
---
type: "listening"
section: 1 | 2 | 3 | 4
totalQuestions: 10
correctCount: 7
bandEstimate: 6.5
errors:
  - questionNumber: 3
    errorCategory: "spelling" | "number" | "distraction" | "speed" | "inference"
createdAt: "2026-06-01T10:00:00.000Z"
---
```

## 5. Speaking (`speaking/`)

```yaml
# topic_groups.md
---
type: "speaking-topic-group"
groups:
  - name: "人物"
    stories: ["家人", "朋友", "名人"]
    part2Count: 8
```

```yaml
# stories/travel.md
---
type: "speaking-story"
name: "一次难忘的旅行"
applicableTopics: ["旅行经历", "难忘的经历"]
part2Length: 230
---
```

## 6. Vocab (`vocab/`)

```yaml
# wordlist.md
type: "vocab-wordlist"
tiers: { band6: 150, band7: 150, band8: 150 }
```

```yaml
# review_log.md
type: "vocab-review-log"
## Day 1: 2026-06-01  review:20 new:10 correct:18/20
```

## 7. Stats (`stats.json`)

```json
{
  "version": "3.0.0",
  "writing": {
    "totalEssays": 12,
    "averageScores": { "tr": 6.2, "cc": 6.0, "lr": 6.3, "gra": 5.8, "overall": 6.1 },
    "topErrors": [{ "category": "grammar", "count": 8 }]
  },
  "reading": { "totalPassages": 8, "averageCorrect": 10.2, "averageBand": 6.5 },
  "listening": { "totalSections": 6, "averageCorrect": 7.0, "averageBand": 6.5 },
  "speaking": { "totalPractices": 5, "topicsCovered": 8 },
  "vocab": { "wordsReviewed": 120, "retentionRate": 0.85 },
  "combined": { "overallBand": 6.3, "daysUntilExam": 71 }
}
```

## 8. Diagnosis (`diagnosis/YYYY-MM-DD-report.md`)

```yaml
---
type: "diagnosis-report"
mode: "full" | "weekly" | "quick"
weaknesses:
  - skill: "writing"
    area: "grammar"
    severity: "high"
priorities: ["writing grammar (high)", "reading tfng (medium)"]
planWeeks: 8
generatedAt: "2026-06-01T00:00:00.000Z"
---
```

## Band Score Rule

All band scores: `number`, range `0–9`, increment `0.5`.
