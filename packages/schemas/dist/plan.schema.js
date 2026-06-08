import { z } from 'zod';
export const ModuleEnum = z.enum(['writing', 'reading', 'listening', 'speaking', 'vocab']);
export const TaskStatusEnum = z.enum(['todo', 'done', 'skipped']);
export const AdaptiveTaskSchema = z.object({
    id: z.string().min(1),
    module: ModuleEnum,
    taskType: z.string().min(1),
    priorityScore: z.number().min(0).max(100).default(0),
    reason: z.string().default(''),
    estimatedMinutes: z.number().int().positive().default(30),
    status: TaskStatusEnum.default('todo'),
    completedAt: z.string().datetime().nullable().default(null),
    skippedAt: z.string().datetime().nullable().default(null),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
});
export const PlanSummarySchema = z.object({
    total: z.number().int().default(0),
    completed: z.number().int().default(0),
    skipped: z.number().int().default(0),
    completionRate: z.number().min(0).max(1).default(0),
});
export const AdaptivePlanSchema = z.object({
    id: z.string().min(1),
    type: z.literal('adaptive-plan'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => !isNaN(new Date(v).getTime()), 'Invalid date'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null).refine((v) => v === null || !isNaN(new Date(v).getTime()), 'Invalid date'),
    tasks: z.array(AdaptiveTaskSchema).default([]).refine((ts) => new Set(ts.filter(t => t.id).map(t => t.id)).size === ts.filter(t => t.id).length, 'Duplicate task IDs'),
    summary: PlanSummarySchema.default({}),
}).refine((p) => !p.endDate || p.endDate >= p.startDate, 'endDate before startDate')
    .refine((p) => { const ts = p.tasks || []; return !p.summary.total || (p.summary.total === ts.length && p.summary.completed === ts.filter((t) => t.status === 'done').length && p.summary.skipped === ts.filter((t) => t.status === 'skipped').length); }, 'Summary must match task counts')
    .refine((p) => p.tasks.filter((t) => (t.status === 'done' && !t.completedAt) || (t.status === 'skipped' && !t.skippedAt)).length === 0, 'Status requires matching timestamp');
//# sourceMappingURL=plan.schema.js.map