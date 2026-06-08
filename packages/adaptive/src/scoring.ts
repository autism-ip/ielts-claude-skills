/**
 * [INPUT]: 依赖 stats.json 和 profile.json 的数据结构
 * [OUTPUT]: 对外提供 PriorityFactor 类型、computePriority、getAllScores
 * [POS]: packages/adaptive 的确定性评分引擎，纯函数
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface PriorityFactor {
  name: string;
  weight: number;
  score: (module: string, stats: Record<string, any>, profile: Record<string, any>) => number;
  reason: (module: string, stats: Record<string, any>, profile: Record<string, any>) => string;
}

export interface PriorityScore {
  module: string;
  score: number;
  reasons: string[];
}

/* target-gap (35%): profile.target - current band, per-module */
function targetGapScore(module: string, stats: Record<string, any>, profile: Record<string, any>): number {
  const statKey = module === 'writing' ? 'writing' : module === 'reading' ? 'reading' : module === 'listening' ? 'listening' : module === 'speaking' ? 'speaking' : '';
  if (!statKey) return 0;
  const target = profile.target?.[module] ?? 0;
  if (target <= 0) return 0;
  const current = stats[statKey]?.averageBand ?? stats[statKey]?.averageScores?.overall ?? 0;
  const gap = Math.max(0, target - current);
  return Math.min(100, gap * 25);
}
function targetGapReason(module: string, _stats: Record<string, any>, profile: Record<string, any>): string {
  const t = profile.target?.[module]; return t ? `target ${t}` : `no target`;
}

/* error-rate (25%): per-module topErrors density */
function errorRateScore(module: string, stats: Record<string, any>): number {
  const errs: any[] = stats[module]?.topErrors ?? [];
  const total = errs.reduce((s: number, e: any) => s + e.count, 0);
  return Math.min(100, total * 8);
}
function errorRateReason(module: string, stats: Record<string, any>): string {
  const errs: any[] = stats[module]?.topErrors ?? [];
  const total = errs.reduce((s: number, e: any) => s + e.count, 0);
  return `${total} errors in ${module}`;
}

/* recency (15%): 距 snapshot 天数 */
function recencyScore(_module: string, stats: Record<string, any>): number {
  if (!stats.lastSnapshot) return 50;
  const days = Math.round((Date.now() - new Date(stats.lastSnapshot).getTime()) / 86400000);
  return Math.max(0, 100 - days * 5);
}
function recencyReason(_module: string, stats: Record<string, any>): string {
  if (!stats.lastSnapshot) return `no snapshot`;
  return `${Math.round((Date.now() - new Date(stats.lastSnapshot).getTime()) / 86400000)}d ago`;
}

/* exam-urgency (15%): 按天数分段 */
function examUrgencyScore(_module: string, _stats: Record<string, any>, profile: Record<string, any>): number {
  if (!profile.examDate) return 20;
  const days = Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000));
  if (days <= 7) return 100;
  if (days <= 30) return 80;
  if (days <= 60) return 50;
  if (days <= 90) return 30;
  return 10;
}
function examUrgencyReason(_module: string, _stats: Record<string, any>, profile: Record<string, any>): string {
  if (!profile.examDate) return `no exam date`;
  return `${Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000))}d left`;
}

/* srs-due (10%): retention rate */
function srsDueScore(module: string, stats: Record<string, any>): number {
  if (module !== "vocab") return 0;
  const reviewed = stats.vocab?.wordsReviewed ?? 0;
  if (reviewed === 0) return 30;
  return Math.min(100, Math.max(0, (1 - (stats.vocab?.retentionRate ?? 0)) * 100));
}
function srsDueReason(module: string, stats: Record<string, any>): string {
  if (module !== "vocab") return "not applicable";
  return `${stats.vocab?.wordsReviewed ?? 0} words reviewed`;
}

const FACTORS: PriorityFactor[] = [
  { name: 'target-gap', weight: 0.35, score: targetGapScore, reason: targetGapReason },
  { name: 'error-rate', weight: 0.25, score: errorRateScore, reason: errorRateReason },
  { name: 'recency', weight: 0.15, score: recencyScore, reason: recencyReason },
  { name: 'exam-urgency', weight: 0.15, score: examUrgencyScore, reason: examUrgencyReason },
  { name: 'srs-due', weight: 0.10, score: srsDueScore, reason: srsDueReason },
];

export function computePriority(module: string, stats: Record<string, any>, profile: Record<string, any>): PriorityScore {
  let total = 0;
  const reasons: string[] = [];
  for (const f of FACTORS) {
    const s = f.score(module, stats, profile) * f.weight;
    total += s;
    reasons.push(`${f.name}: ${f.reason(module, stats, profile)} (${s.toFixed(1)})`);
  }
  return { module, score: Math.min(100, Math.max(0, Math.round(total))), reasons };
}

export function getAllScores(modules: string[], stats: Record<string, any>, profile: Record<string, any>): PriorityScore[] {
  return modules.map(m => computePriority(m, stats, profile)).sort((a, b) => b.score - a.score);
}
