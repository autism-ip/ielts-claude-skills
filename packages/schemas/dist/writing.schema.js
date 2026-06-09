import { z } from 'zod';
import { BandScoreSchema } from './profile.schema.js';
export const WritingTaskType = z.enum(['task1', 'task2', 'letter']);
export const WritingExamType = z.enum(['academic', 'general-training']);
export const WritingErrorCategory = z.enum([
    'task_response', 'coherence', 'lexical', 'grammar', 'spelling',
]);
export const WritingErrorSchema = z.object({
    category: WritingErrorCategory,
    severity: z.enum(['major', 'minor']),
    location: z.string(),
    description: z.string(),
});
export const WritingScoresSchema = z.object({
    tr: BandScoreSchema,
    cc: BandScoreSchema,
    lr: BandScoreSchema,
    gra: BandScoreSchema,
    overall: BandScoreSchema,
});
export const WritingRecordSchema = z.object({
    type: z.literal('writing'),
    taskType: WritingTaskType,
    topic: z.string().min(1),
    wordCount: z.number().int().positive(),
    bandScore: WritingScoresSchema,
    errors: z.array(WritingErrorSchema).default([]),
    rewritten: z.boolean().default(false),
    createdAt: z.string().datetime(),
    examType: WritingExamType.optional(),
}).refine(r => {
    const exam = r.examType || 'academic';
    if (r.taskType === 'letter' && exam === 'academic')
        return false;
    if (r.taskType === 'task1' && exam === 'general-training')
        return false;
    return true;
}, 'Incompatible taskType and examType combination');
//# sourceMappingURL=writing.schema.js.map