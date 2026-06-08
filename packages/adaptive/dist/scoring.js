<<<<<<< HEAD
<<<<<<< HEAD
/**
 * [INPUT]: 依赖 stats.json 和 profile.json 的数据结构
 * [OUTPUT]: 对外提供 PriorityFactor 类型、computePriority、getAllScores
 * [POS]: packages/adaptive 的确定性评分引擎，纯函数
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
/* target-gap (35%): profile.target - current band, 归一化到 0-100 */
function targetGapScore(stats, profile) {
    const bandMap = { writing: 'writing', reading: 'reading', listening: 'listening', speaking: 'speaking' };
    let totalGap = 0.0;
    let count = 0;
    for (const [mod, statKey] of Object.entries(bandMap)) {
        const target = profile.target?.[mod] ?? 0;
        const current = stats[statKey]?.averageBand ?? 0;
        if (target > 0) {
            totalGap += Math.max(0, target - current);
            count++;
        }
    }
    return count > 0 ? Math.min(100, (totalGap / count) * 25) : 0;
}
function targetGapReason(_stats, profile) {
    const t = profile.target;
    return t ? `target set` : `no target`;
}
/* error-rate (25%): topErrors 总数密度 */
function errorRateScore(stats) {
    let total = 0;
    for (const mod of ['writing', 'reading', 'listening']) {
        const errs = stats[mod]?.topErrors ?? [];
        total += errs.reduce((s, e) => s + e.count, 0);
    }
    return Math.min(100, total * 6);
}
function errorRateReason(stats) {
    const counts = ['writing', 'reading', 'listening'].map(m => (stats[m]?.topErrors ?? []).reduce((s, e) => s + e.count, 0));
    return `errors: ${counts.join('/')}`;
}
/* recency (15%): 距 snapshot 天数，指数衰减 */
function recencyScore(stats) {
    if (!stats.lastSnapshot)
        return 50;
    const days = Math.round((Date.now() - new Date(stats.lastSnapshot).getTime()) / 86400000);
    return Math.max(0, 100 - days * 5);
}
function recencyReason(stats) {
    if (!stats.lastSnapshot)
        return `no snapshot`;
    return `${Math.round((Date.now() - new Date(stats.lastSnapshot).getTime()) / 86400000)}d ago`;
}
/* exam-urgency (15%): 按天数分段 */
function examUrgencyScore(_stats, profile) {
    if (!profile.examDate)
        return 20;
    const days = Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000));
    if (days <= 7)
        return 100;
    if (days <= 30)
        return 80;
    if (days <= 60)
        return 50;
    if (days <= 90)
        return 30;
    return 10;
}
function examUrgencyReason(_stats, profile) {
    if (!profile.examDate)
        return `no exam date`;
    return `${Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000))}d left`;
}
/* srs-due (10%): 低 retention → 高分数 */
function srsDueScore(stats) {
    const reviewed = stats.vocab?.wordsReviewed ?? 0;
    if (reviewed === 0)
        return 30;
    return Math.min(100, Math.max(0, (1 - (stats.vocab?.retentionRate ?? 0)) * 100));
}
function srsDueReason(stats) {
    const r = stats.vocab?.wordsReviewed ?? 0;
    return `${r} words reviewed`;
}
const FACTORS = [
    { name: 'target-gap', weight: 0.35, score: targetGapScore, reason: targetGapReason },
    { name: 'error-rate', weight: 0.25, score: errorRateScore, reason: errorRateReason },
    { name: 'recency', weight: 0.15, score: recencyScore, reason: recencyReason },
    { name: 'exam-urgency', weight: 0.15, score: examUrgencyScore, reason: examUrgencyReason },
    { name: 'srs-due', weight: 0.10, score: srsDueScore, reason: srsDueReason },
=======
const FACTORS = [
    { name: 'target-gap', weight: 0.35,
        score: (s, p) => { const tgt = p.target?.['writing'] ?? 0; const cur = s.writing?.averageScores?.overall ?? 0; return tgt > 0 ? Math.min(100, (tgt - cur) * 25) : 0; },
        reason: (s, p) => `gap ${((p.target?.writing ?? 0) - (s.writing?.averageScores?.overall ?? 0)).toFixed(1)}` },
    { name: 'error-rate', weight: 0.25,
        score: (s) => { let t = 0; for (const m of ['writing', 'reading', 'listening'])
            t += (s[m]?.topErrors ?? []).reduce((a, e) => a + e.count, 0); return Math.min(100, t * 6); },
        reason: s => `errors ${['writing', 'reading', 'listening'].map(m => (s[m]?.topErrors ?? []).reduce((a, e) => a + e.count, 0)).join('/')}` },
    { name: 'recency', weight: 0.15,
        score: s => s.lastSnapshot ? Math.max(0, 100 - Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000) * 5) : 50,
        reason: s => s.lastSnapshot ? `${Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000)}d ago` : 'no snapshot' },
    { name: 'exam-urgency', weight: 0.15,
        score: (_s, p) => { if (!p.examDate)
            return 20; const d = Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000)); return d <= 7 ? 100 : d <= 30 ? 80 : d <= 60 ? 50 : d <= 90 ? 30 : 10; },
        reason: (_s, p) => p.examDate ? `${Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000))}d left` : 'no exam date' },
    { name: 'srs-due', weight: 0.10,
        score: s => s.vocab?.wordsReviewed > 0 ? Math.min(100, Math.max(0, (1 - (s.vocab?.retentionRate ?? 0)) * 100)) : 30,
        reason: s => `${s.vocab?.wordsReviewed ?? 0} words reviewed` },
>>>>>>> origin/feat/gh-49-plan-cli
];
export function computePriority(module, stats, profile) {
    let total = 0;
    const reasons = [];
    for (const f of FACTORS) {
        const s = f.score(stats, profile) * f.weight;
        total += s;
        reasons.push(`${f.name}: ${s.toFixed(1)}`);
    }
    return { module, score: Math.min(100, Math.max(0, Math.round(total))), reasons };
}
export function getAllScores(modules, stats, profile) {
    return modules.map(m => computePriority(m, stats, profile)).sort((a, b) => b.score - a.score);
}
<<<<<<< HEAD
=======
export function computePriority(_m, _s, _p) { return { module: _m, score: 0, reasons: [] }; }
>>>>>>> origin/feat/gh-48-intervention-library
=======
>>>>>>> origin/feat/gh-49-plan-cli
//# sourceMappingURL=scoring.js.map