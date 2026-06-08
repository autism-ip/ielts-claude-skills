/**
 * [INPUT]: 依赖 stats.json 和 profile.json 的数据结构
 * [OUTPUT]: 对外提供 PriorityFactor 类型、computePriority、getAllScores
 * [POS]: packages/adaptive 的确定性评分引擎，纯函数
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export interface PriorityFactor {
    name: string;
    weight: number;
    score: (stats: Record<string, any>, profile: Record<string, any>) => number;
    reason: (stats: Record<string, any>, profile: Record<string, any>) => string;
}
export interface PriorityScore {
    module: string;
    score: number;
    reasons: string[];
}
export declare function computePriority(module: string, stats: Record<string, any>, profile: Record<string, any>): PriorityScore;
export declare function getAllScores(modules: string[], stats: Record<string, any>, profile: Record<string, any>): PriorityScore[];
//# sourceMappingURL=scoring.d.ts.map