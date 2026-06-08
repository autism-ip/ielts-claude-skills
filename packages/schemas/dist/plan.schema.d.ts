import { z } from 'zod';
export declare const ModuleEnum: z.ZodEnum<["writing", "reading", "listening", "speaking", "vocab"]>;
export type Module = z.infer<typeof ModuleEnum>;
export declare const TaskStatusEnum: z.ZodEnum<["todo", "done", "skipped"]>;
export type TaskStatus = z.infer<typeof TaskStatusEnum>;
export declare const AdaptiveTaskSchema: z.ZodObject<{
    id: z.ZodString;
    module: z.ZodEnum<["writing", "reading", "listening", "speaking", "vocab"]>;
    taskType: z.ZodString;
    priorityScore: z.ZodDefault<z.ZodNumber>;
    reason: z.ZodDefault<z.ZodString>;
    estimatedMinutes: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["todo", "done", "skipped"]>>;
    completedAt: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    skippedAt: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    dueDate: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "skipped" | "todo" | "done";
    taskType: string;
    id: string;
    module: "writing" | "reading" | "listening" | "speaking" | "vocab";
    priorityScore: number;
    reason: string;
    estimatedMinutes: number;
    completedAt: string | null;
    skippedAt: string | null;
    dueDate: string | null;
}, {
    taskType: string;
    id: string;
    module: "writing" | "reading" | "listening" | "speaking" | "vocab";
    status?: "skipped" | "todo" | "done" | undefined;
    priorityScore?: number | undefined;
    reason?: string | undefined;
    estimatedMinutes?: number | undefined;
    completedAt?: string | null | undefined;
    skippedAt?: string | null | undefined;
    dueDate?: string | null | undefined;
}>;
export type AdaptiveTask = z.infer<typeof AdaptiveTaskSchema>;
export declare const PlanSummarySchema: z.ZodObject<{
    total: z.ZodDefault<z.ZodNumber>;
    completed: z.ZodDefault<z.ZodNumber>;
    skipped: z.ZodDefault<z.ZodNumber>;
    completionRate: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    total: number;
    completed: number;
    skipped: number;
    completionRate: number;
}, {
    total?: number | undefined;
    completed?: number | undefined;
    skipped?: number | undefined;
    completionRate?: number | undefined;
}>;
export declare const AdaptivePlanSchema: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"adaptive-plan">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    startDate: z.ZodEffects<z.ZodString, string, string>;
    endDate: z.ZodEffects<z.ZodDefault<z.ZodNullable<z.ZodString>>, string | null, string | null | undefined>;
    tasks: z.ZodEffects<z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        module: z.ZodEnum<["writing", "reading", "listening", "speaking", "vocab"]>;
        taskType: z.ZodString;
        priorityScore: z.ZodDefault<z.ZodNumber>;
        reason: z.ZodDefault<z.ZodString>;
        estimatedMinutes: z.ZodDefault<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<["todo", "done", "skipped"]>>;
        completedAt: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        skippedAt: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        dueDate: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status: "skipped" | "todo" | "done";
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        priorityScore: number;
        reason: string;
        estimatedMinutes: number;
        completedAt: string | null;
        skippedAt: string | null;
        dueDate: string | null;
    }, {
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        status?: "skipped" | "todo" | "done" | undefined;
        priorityScore?: number | undefined;
        reason?: string | undefined;
        estimatedMinutes?: number | undefined;
        completedAt?: string | null | undefined;
        skippedAt?: string | null | undefined;
        dueDate?: string | null | undefined;
    }>, "many">>, {
        status: "skipped" | "todo" | "done";
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        priorityScore: number;
        reason: string;
        estimatedMinutes: number;
        completedAt: string | null;
        skippedAt: string | null;
        dueDate: string | null;
    }[], {
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        status?: "skipped" | "todo" | "done" | undefined;
        priorityScore?: number | undefined;
        reason?: string | undefined;
        estimatedMinutes?: number | undefined;
        completedAt?: string | null | undefined;
        skippedAt?: string | null | undefined;
        dueDate?: string | null | undefined;
    }[] | undefined>;
    summary: z.ZodDefault<z.ZodObject<{
        total: z.ZodDefault<z.ZodNumber>;
        completed: z.ZodDefault<z.ZodNumber>;
        skipped: z.ZodDefault<z.ZodNumber>;
        completionRate: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        total: number;
        completed: number;
        skipped: number;
        completionRate: number;
    }, {
        total?: number | undefined;
        completed?: number | undefined;
        skipped?: number | undefined;
        completionRate?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate: string | null;
    tasks: {
        status: "skipped" | "todo" | "done";
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        priorityScore: number;
        reason: string;
        estimatedMinutes: number;
        completedAt: string | null;
        skippedAt: string | null;
        dueDate: string | null;
    }[];
    summary: {
        total: number;
        completed: number;
        skipped: number;
        completionRate: number;
    };
}, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate?: string | null | undefined;
    tasks?: {
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        status?: "skipped" | "todo" | "done" | undefined;
        priorityScore?: number | undefined;
        reason?: string | undefined;
        estimatedMinutes?: number | undefined;
        completedAt?: string | null | undefined;
        skippedAt?: string | null | undefined;
        dueDate?: string | null | undefined;
    }[] | undefined;
    summary?: {
        total?: number | undefined;
        completed?: number | undefined;
        skipped?: number | undefined;
        completionRate?: number | undefined;
    } | undefined;
}>, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate: string | null;
    tasks: {
        status: "skipped" | "todo" | "done";
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        priorityScore: number;
        reason: string;
        estimatedMinutes: number;
        completedAt: string | null;
        skippedAt: string | null;
        dueDate: string | null;
    }[];
    summary: {
        total: number;
        completed: number;
        skipped: number;
        completionRate: number;
    };
}, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate?: string | null | undefined;
    tasks?: {
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        status?: "skipped" | "todo" | "done" | undefined;
        priorityScore?: number | undefined;
        reason?: string | undefined;
        estimatedMinutes?: number | undefined;
        completedAt?: string | null | undefined;
        skippedAt?: string | null | undefined;
        dueDate?: string | null | undefined;
    }[] | undefined;
    summary?: {
        total?: number | undefined;
        completed?: number | undefined;
        skipped?: number | undefined;
        completionRate?: number | undefined;
    } | undefined;
}>, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate: string | null;
    tasks: {
        status: "skipped" | "todo" | "done";
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        priorityScore: number;
        reason: string;
        estimatedMinutes: number;
        completedAt: string | null;
        skippedAt: string | null;
        dueDate: string | null;
    }[];
    summary: {
        total: number;
        completed: number;
        skipped: number;
        completionRate: number;
    };
}, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate?: string | null | undefined;
    tasks?: {
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        status?: "skipped" | "todo" | "done" | undefined;
        priorityScore?: number | undefined;
        reason?: string | undefined;
        estimatedMinutes?: number | undefined;
        completedAt?: string | null | undefined;
        skippedAt?: string | null | undefined;
        dueDate?: string | null | undefined;
    }[] | undefined;
    summary?: {
        total?: number | undefined;
        completed?: number | undefined;
        skipped?: number | undefined;
        completionRate?: number | undefined;
    } | undefined;
}>, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate: string | null;
    tasks: {
        status: "skipped" | "todo" | "done";
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        priorityScore: number;
        reason: string;
        estimatedMinutes: number;
        completedAt: string | null;
        skippedAt: string | null;
        dueDate: string | null;
    }[];
    summary: {
        total: number;
        completed: number;
        skipped: number;
        completionRate: number;
    };
}, {
    type: "adaptive-plan";
    createdAt: string;
    updatedAt: string;
    id: string;
    startDate: string;
    endDate?: string | null | undefined;
    tasks?: {
        taskType: string;
        id: string;
        module: "writing" | "reading" | "listening" | "speaking" | "vocab";
        status?: "skipped" | "todo" | "done" | undefined;
        priorityScore?: number | undefined;
        reason?: string | undefined;
        estimatedMinutes?: number | undefined;
        completedAt?: string | null | undefined;
        skippedAt?: string | null | undefined;
        dueDate?: string | null | undefined;
    }[] | undefined;
    summary?: {
        total?: number | undefined;
        completed?: number | undefined;
        skipped?: number | undefined;
        completionRate?: number | undefined;
    } | undefined;
}>;
export type AdaptivePlan = z.infer<typeof AdaptivePlanSchema>;
//# sourceMappingURL=plan.schema.d.ts.map