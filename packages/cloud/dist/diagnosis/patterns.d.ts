/**
 * [INPUT]: 依赖 stats.json 的 topErrors 结构
 * [OUTPUT]: 对外提供 processPatterns、getPatternRules 函数和类型
 * [POS]: packages/cloud/diagnosis 的错误模式识别引擎
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export interface PatternRule {
    name: string;
    module: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    tags: string[];
    suggestedInterventions: string[];
}
export interface PatternResult {
    pattern: PatternRule;
    evidence: {
        recordIds: string[];
        summary: string;
    };
    score: number;
}
export declare function getPatternRules(module?: string): PatternRule[];
export declare function processPatterns(stats: Record<string, any>): PatternResult[];
//# sourceMappingURL=patterns.d.ts.map