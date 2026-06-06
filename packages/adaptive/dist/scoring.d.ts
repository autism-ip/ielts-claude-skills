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
export declare function computePriority(module: string, stats: any, profile: any): PriorityScore;
export declare function getAllScores(modules: string[], stats: any, profile: any): PriorityScore[];
//# sourceMappingURL=scoring.d.ts.map