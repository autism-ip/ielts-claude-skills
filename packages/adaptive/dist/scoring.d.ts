export interface PriorityFactor {
    name: string;
    weight: number;
    score: (m: string, s: any, p: any) => number;
    reason: (m: string, s: any, p: any) => string;
}
export interface PriorityScore {
    module: string;
    score: number;
    reasons: string[];
}
export declare function computePriority(module: string, stats: any, profile: any): PriorityScore;
export declare function getAllScores(modules: string[], stats: any, profile: any): PriorityScore[];
//# sourceMappingURL=scoring.d.ts.map