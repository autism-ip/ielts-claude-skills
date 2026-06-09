<<<<<<< HEAD
/**
 * [INPUT]: 依赖 @ielts/schemas 的类型定义
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions、getAllModules 函数
 * [POS]: packages/adaptive 的干预库
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
=======
>>>>>>> origin/main
export interface Intervention {
    module: string;
    errorTag: string;
    taskType: string;
    duration: number;
    instructions: string;
    successCriteria: string;
}
export declare function getInterventions(errorTag?: string, module?: string): Intervention[];
export declare function getAllModules(): string[];
//# sourceMappingURL=interventions.d.ts.map