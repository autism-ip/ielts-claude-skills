/**
 * [INPUT]: 无
 * [OUTPUT]: 对外提供 PriorityScore, PriorityFactor, computePriority, getAllScores
 * [POS]: packages/adaptive 的优先级评分引擎
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface PriorityFactor {
  name: string;
  weight: number;
  score: (s: any, p: any) => number;
  reason: (s: any, p: any) => string;
}

export interface PriorityScore {
  module: string;
  score: number;
  reasons: string[];
}

const FACTORS: PriorityFactor[] = [
  {
    name: 'target-gap', weight: 0.35,
    score: (s, p) => { const tgt = p.target?.writing ?? 0; const cur = s.writing?.averageScores?.overall ?? 0; return tgt > 0 ? Math.min(100, (tgt - cur) * 25) : 0; },
    reason: (s, p) => `gap ${((p.target?.writing ?? 0) - (s.writing?.averageScores?.overall ?? 0)).toFixed(1)}`,
  },
  {
    name: 'error-rate', weight: 0.25,
    score: (s) => { let t = 0; for (const m of ['writing', 'reading', 'listening']) t += (s[m]?.topErrors ?? []).reduce((a: number, e: any) => a + e.count, 0); return Math.min(100, t * 6); },
    reason: (s) => `errors ${['writing', 'reading', 'listening'].map((m) => (s[m]?.topErrors ?? []).reduce((a: number, e: any) => a + e.count, 0)).join('/')}`,
  },
  {
    name: 'recency', weight: 0.15,
    score: (s) => s.lastSnapshot ? Math.max(0, 100 - Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000) * 5) : 50,
    reason: (s) => s.lastSnapshot ? `${Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000)}d ago` : 'no snapshot',
  },
  {
    name: 'exam-urgency', weight: 0.15,
    score: (_s, p) => { if (!p.examDate) return 20; const d = Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000)); return d <= 7 ? 100 : d <= 30 ? 80 : d <= 60 ? 50 : d <= 90 ? 30 : 10; },
    reason: (_s, p) => p.examDate ? `${Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000))}d left` : 'no exam date',
  },
  {
    name: 'srs-due', weight: 0.1,
    score: (s) => s.vocab?.wordsReviewed > 0 ? Math.min(100, Math.max(0, (1 - (s.vocab?.retentionRate ?? 0)) * 100)) : 30,
    reason: (s) => `${s.vocab?.wordsReviewed ?? 0} words reviewed`,
  },
];

export function computePriority(module: string, stats: any, profile: any): PriorityScore {
  let total = 0; const reasons: string[] = [];
  for (const f of FACTORS) { const s = f.score(stats, profile) * f.weight; total += s; reasons.push(`${f.name}: ${s.toFixed(1)}`); }
  return { module, score: Math.min(100, Math.max(0, Math.round(total))), reasons };
}

export function getAllScores(modules: string[], stats: any, profile: any): PriorityScore[] {
  return modules.map((m) => computePriority(m, stats, profile)).sort((a, b) => b.score - a.score);
}
