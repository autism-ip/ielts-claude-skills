/**
 * [INPUT]: 依赖 @ielts/schemas 的 Stats/Profile 类型
 * [OUTPUT]: 对外提供 PriorityFactor 类型、computePriority 函数
 * [POS]: packages/adaptive 的评分引擎，纯函数，无副作用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const DEFAULT_FACTORS = [
    { name: 'target-gap', weight: 0.35, score: () => 0, reason: () => 'no data' },
    { name: 'error-rate', weight: 0.25, score: () => 0, reason: () => 'no data' },
    { name: 'recency', weight: 0.15, score: () => 0, reason: () => 'no data' },
    { name: 'exam-urgency', weight: 0.15, score: () => 0, reason: () => 'no data' },
    { name: 'srs-due', weight: 0.10, score: () => 0, reason: () => 'no data' },
];
export function computePriority(module, stats, profile) {
    let total = 0;
    const reasons = [];
    for (const f of DEFAULT_FACTORS) {
        const s = f.score(stats, profile) * f.weight;
        total += s;
        reasons.push(f.reason(stats, profile));
    }
    return { module, score: Math.min(100, Math.max(0, total)), reasons };
}
//# sourceMappingURL=scoring.js.map