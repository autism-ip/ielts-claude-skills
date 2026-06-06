export interface AdaptiveTask {
    id: string;
    module: string;
    taskType: string;
    priorityScore: number;
    estimatedMinutes: number;
    status: 'todo' | 'done' | 'skipped';
    completedAt?: string;
    skippedAt?: string;
}
export declare function planToday(_s: any, _p: any): AdaptiveTask[];
export declare function planWeek(_s: any, _p: any): AdaptiveTask[];
export declare function planComplete(taskId: string): boolean;
export declare function planSkip(taskId: string): boolean;
//# sourceMappingURL=scheduler.d.ts.map