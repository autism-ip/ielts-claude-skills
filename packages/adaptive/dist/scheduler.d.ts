<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export declare function planToday(stats: Record<string, any>, profile: Record<string, any>): any[];
export declare function planWeek(stats: Record<string, any>, profile: Record<string, any>): any[];
=======
export declare function planToday(_a: any, _b: any): any[];
export declare function planWeek(_a: any, _b: any): any[];
>>>>>>> origin/feat/gh-48-intervention-library
=======
=======
>>>>>>> origin/feat/gh-50-plan-complete-skip
export interface AdaptiveTask {
    id: string;
    module: string;
    taskType: string;
    priorityScore: number;
<<<<<<< HEAD
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
>>>>>>> origin/feat/gh-49-plan-cli
=======
    estimatedMinutes: number;
    status: 'todo' | 'done' | 'skipped';
    completedAt?: string;
    skippedAt?: string;
}
export declare function planToday(_s: any, _p: any): AdaptiveTask[];
export declare function planWeek(_s: any, _p: any): AdaptiveTask[];
export declare function planComplete(taskId: string): boolean;
export declare function planSkip(taskId: string): boolean;
>>>>>>> origin/feat/gh-50-plan-complete-skip
//# sourceMappingURL=scheduler.d.ts.map