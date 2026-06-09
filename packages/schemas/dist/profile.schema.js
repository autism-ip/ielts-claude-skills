import { z } from 'zod';
/**
 * Band score: 0–9, 0.5 increments
 */
export const BandScoreSchema = z
    .number()
    .min(0)
    .max(9)
    .refine((v) => v * 10 % 5 === 0, {
    message: 'Band score must be in 0.5 increments (e.g. 6.0, 6.5)',
});
export const TargetScoresSchema = z.object({
    overall: BandScoreSchema,
    writing: BandScoreSchema,
    reading: BandScoreSchema,
    listening: BandScoreSchema,
    speaking: BandScoreSchema,
});
export const PreferencesSchema = z.object({
    dailyGoal: z.number().int().min(5).max(480).default(60),
    focusAreas: z.array(z.enum(['writing', 'reading', 'listening', 'speaking', 'vocab'])).default([]),
});
export const ProfileSchema = z.object({
    version: z.string().default('3.0.0'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    target: TargetScoresSchema,
    examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').refine(v => !isNaN(new Date(v).getTime()), 'Invalid calendar date').nullable().default(null),
    timezone: z.string().default('Asia/Shanghai'),
    preferences: PreferencesSchema.default({}),
});
//# sourceMappingURL=profile.schema.js.map