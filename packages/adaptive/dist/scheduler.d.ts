/**
 * [INPUT]: 依赖 scoring.ts 的 PriorityScore
 * [OUTPUT]: 对外提供 planToday, planWeek 函数
 * [POS]: packages/adaptive 的调度器，编排日/周计划
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export declare function planToday(stats: Record<string, any>, profile: Record<string, any>): any[];
export declare function planWeek(stats: Record<string, any>, profile: Record<string, any>): any[];
//# sourceMappingURL=scheduler.d.ts.map