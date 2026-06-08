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