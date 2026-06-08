export interface AdaptiveTask {
    id: string;
    module: string;
    taskType: string;
    priorityScore: number;
    reason: string;
    estimatedMinutes: number;
    status: 'todo';
}
export declare function planToday(stats: any, profile: any): AdaptiveTask[];
export declare function planWeek(stats: any, profile: any): AdaptiveTask[];
export declare function planComplete(_id: string): void;
export declare function planSkip(_id: string): void;
//# sourceMappingURL=scheduler.d.ts.map