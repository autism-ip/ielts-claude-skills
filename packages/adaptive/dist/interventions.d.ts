export interface Intervention {
    module: string;
    errorTag: string;
    taskType: string;
    duration: number;
    instructions: string;
    successCriteria: string;
}
export declare function getInterventions(errorTag?: string, module?: string): Intervention[];
<<<<<<< HEAD
=======
export declare function getAllModules(): string[];
>>>>>>> origin/main
//# sourceMappingURL=interventions.d.ts.map