<<<<<<< HEAD
/**
 * [INPUT]: 依赖 @ielts/schemas 的 Stats/Profile 类型
 * [OUTPUT]: 对外提供 PriorityFactor 类型、computePriority、getAllScores 函数
 * [POS]: packages/adaptive 的评分引擎，纯函数，无副作用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const FACTORS = [
    {
        name: 'target-gap', weight: 0.35,
        score: (s, p) => { const tgt = p.target?.writing ?? 0; const cur = s.writing?.averageScores?.overall ?? 0; return tgt > 0 ? Math.min(100, (tgt - cur) * 25) : 0; },
        reason: (s, p) => `gap ${((p.target?.writing ?? 0) - (s.writing?.averageScores?.overall ?? 0)).toFixed(1)}`,
    },
    {
        name: 'error-rate', weight: 0.25,
        score: (s) => { let t = 0; for (const m of ['writing', 'reading', 'listening'])
            t += (s[m]?.topErrors ?? []).reduce((a, e) => a + e.count, 0); return Math.min(100, t * 6); },
        reason: (s) => `errors ${['writing', 'reading', 'listening'].map((m) => (s[m]?.topErrors ?? []).reduce((a, e) => a + e.count, 0)).join('/')}`,
    },
    {
        name: 'recency', weight: 0.15,
        score: (s) => s.lastSnapshot ? Math.max(0, 100 - Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000) * 5) : 50,
        reason: (s) => s.lastSnapshot ? `${Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000)}d ago` : 'no snapshot',
    },
    {
        name: 'exam-urgency', weight: 0.15,
        score: (_s, p) => { if (!p.examDate)
            return 20; const d = Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000)); return d <= 7 ? 100 : d <= 30 ? 80 : d <= 60 ? 50 : d <= 90 ? 30 : 10; },
        reason: (_s, p) => p.examDate ? `${Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000))}d left` : 'no exam date',
    },
    {
        name: 'srs-due', weight: 0.1,
        score: (s) => s.vocab?.wordsReviewed > 0 ? Math.min(100, Math.max(0, (1 - (s.vocab?.retentionRate ?? 0)) * 100)) : 30,
        reason: (s) => `${s.vocab?.wordsReviewed ?? 0} words reviewed`,
    },
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
    return modules.map((m) => computePriority(m, stats, profile)).sort((a, b) => b.score - a.score);
}
=======
function tgs(m, s, p) { const k = m === "writing" ? "writing" : m === "reading" ? "reading" : m === "listening" ? "listening" : m === "speaking" ? "speaking" : ""; if (!k)
    return 0; const t = p.target?.[m] ?? 0; if (t <= 0)
    return 0; const c = s[k]?.averageBand ?? s[k]?.averageScores?.overall ?? 0; return Math.min(100, Math.max(0, t - c) * 25); }
function tgr(m, _s, p) { const t = p.target?.[m]; return t ? `target ${t}` : "no target"; }
function ers(m, s) { const e = s[m]?.topErrors ?? []; return Math.min(100, e.reduce((a, x) => a + x.count, 0) * 8); }
function err(m, s) { const e = s[m]?.topErrors ?? []; return `${e.reduce((a, x) => a + x.count, 0)} errors`; }
function rcs(_m, s) { if (!s.lastSnapshot)
    return 50; const d = Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000); return Math.max(0, 100 - d * 5); }
function rcr(_m, s) { if (!s.lastSnapshot)
    return "no snapshot"; return `${Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000)}d ago`; }
function eus(_m, _s, p) { if (!p.examDate)
    return 20; const ms = new Date(p.examDate).getTime(); if (isNaN(ms))
    return 20; const d = Math.max(0, Math.ceil((ms - Date.now()) / 86400000)); return d <= 7 ? 100 : d <= 30 ? 80 : d <= 60 ? 50 : d <= 90 ? 30 : 10; }
function eur(_m, _s, p) { if (!p.examDate)
    return "no exam date"; return `${Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000))}d left`; }
function sds(m, s) { if (m !== "vocab")
    return 0; const r = s.vocab?.wordsReviewed ?? 0; if (r === 0)
    return 30; return Math.min(100, Math.max(0, (1 - (s.vocab?.retentionRate ?? 0)) * 100)); }
function sdr(m, s) { if (m !== "vocab")
    return "n/a"; return `${s.vocab?.wordsReviewed ?? 0} words`; }
const F = [{ name: "target-gap", w: .35, s: tgs, r: tgr }, { name: "error-rate", w: .25, s: ers, r: err }, { name: "recency", w: .15, s: rcs, r: rcr }, { name: "exam-urgency", w: .15, s: eus, r: eur }, { name: "srs-due", w: .10, s: sds, r: sdr }];
export function computePriority(module, stats, profile) { let t = 0; const rs = []; for (const f of F) {
    const raw = f.s(module, stats, profile);
    const s = raw * f.w;
    t += s;
    rs.push(`${f.name}: ${f.r(module, stats, profile)} (${s.toFixed(1)})`);
} return { module, score: Math.min(100, Math.max(0, Math.round(t))), reasons: rs }; }
export function getAllScores(modules, stats, profile) { return modules.map(m => computePriority(m, stats, profile)).sort((a, b) => b.score - a.score); }
>>>>>>> 52e6d5a32c86d1e584bce03b444aeaa61adca72e
//# sourceMappingURL=scoring.js.map