/**
 * [INPUT]: 依赖 @ielts/schemas 的 Stats/Profile 类型
 * [OUTPUT]: 对外提供 PriorityFactor 类型、computePriority、getAllScores 函数
 * [POS]: packages/adaptive 的评分引擎，纯函数，无副作用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export interface PriorityFactor {
    name: string;
    weight: number;
    score: (s: Record<string, any>, p: Record<string, any>) => number;
    reason: (s: Record<string, any>, p: Record<string, any>) => string;
}
export interface PriorityScore {
    module: string;
    score: number;
    reasons: string[];
}
export declare function computePriority(module: string, stats: Record<string, any>, profile: Record<string, any>): PriorityScore;
export declare function getAllScores(modules: string[], stats: Record<string, any>, profile: Record<string, any>): PriorityScore[];
//# sourceMappingURL=scoring.d.ts.map