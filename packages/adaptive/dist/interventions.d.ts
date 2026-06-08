<<<<<<< HEAD
export interface Intervention {
    module: string;
    errorTag: string;
=======
/**
 * [INPUT]: 依赖 @ielts/schemas
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions、getAllModules
 * [POS]: packages/adaptive 的干预库，写作/阅读/听力/口语/词汇错误标签→训练任务
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export interface Intervention {
    module: string;
    errorTag: string;
    taskType: string;
>>>>>>> origin/feat/gh-48-intervention-library
    duration: number;
    instructions: string;
    successCriteria: string;
}
<<<<<<< HEAD
export declare function getInterventions(errorTag?: string): Intervention[];
=======
export declare function getInterventions(errorTag?: string, module?: string): Intervention[];
export declare function getAllModules(): string[];
>>>>>>> origin/feat/gh-48-intervention-library
//# sourceMappingURL=interventions.d.ts.map