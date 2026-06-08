export interface Intervention {
    module: string;
    errorTag: string;
    duration: number;
    instructions: string;
    successCriteria: string;
}
export declare function getInterventions(errorTag?: string): Intervention[];
//# sourceMappingURL=interventions.d.ts.map