export interface AdaptiveTask {
    id: string;
    module: string;
    taskType: string;
    priorityScore: number;
    reason: string;
    estimatedMinutes: number;
    status: 'todo';
}
export interface Plan {
    id: string;
    type: 'adaptive-plan';
    createdAt: string;
    updatedAt: string;
    startDate: string;
    tasks: AdaptiveTask[];
}
export declare function planToday(stats: any, profile: any): AdaptiveTask[];
export declare function planWeek(stats: any, profile: any): AdaptiveTask[];
export declare function planComplete(_taskId: string): void;
export declare function planSkip(_taskId: string): void;
//# sourceMappingURL=scheduler.d.ts.map