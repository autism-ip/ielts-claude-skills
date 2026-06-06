import { z } from 'zod';
/**
 * Band score: 0–9, 0.5 increments
 */
export declare const BandScoreSchema: z.ZodEffects<z.ZodNumber, number, number>;
export type BandScore = z.infer<typeof BandScoreSchema>;
export declare const TargetScoresSchema: z.ZodObject<{
    overall: z.ZodEffects<z.ZodNumber, number, number>;
    writing: z.ZodEffects<z.ZodNumber, number, number>;
    reading: z.ZodEffects<z.ZodNumber, number, number>;
    listening: z.ZodEffects<z.ZodNumber, number, number>;
    speaking: z.ZodEffects<z.ZodNumber, number, number>;
}, "strip", z.ZodTypeAny, {
    overall: number;
    writing: number;
    reading: number;
    listening: number;
    speaking: number;
}, {
    overall: number;
    writing: number;
    reading: number;
    listening: number;
    speaking: number;
}>;
export declare const PreferencesSchema: z.ZodObject<{
    dailyGoal: z.ZodDefault<z.ZodNumber>;
    focusAreas: z.ZodDefault<z.ZodArray<z.ZodEnum<["writing", "reading", "listening", "speaking", "vocab"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    dailyGoal: number;
    focusAreas: ("writing" | "reading" | "listening" | "speaking" | "vocab")[];
}, {
    dailyGoal?: number | undefined;
    focusAreas?: ("writing" | "reading" | "listening" | "speaking" | "vocab")[] | undefined;
}>;
export declare const ProfileSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    target: z.ZodObject<{
        overall: z.ZodEffects<z.ZodNumber, number, number>;
        writing: z.ZodEffects<z.ZodNumber, number, number>;
        reading: z.ZodEffects<z.ZodNumber, number, number>;
        listening: z.ZodEffects<z.ZodNumber, number, number>;
        speaking: z.ZodEffects<z.ZodNumber, number, number>;
    }, "strip", z.ZodTypeAny, {
        overall: number;
        writing: number;
        reading: number;
        listening: number;
        speaking: number;
    }, {
        overall: number;
        writing: number;
        reading: number;
        listening: number;
        speaking: number;
    }>;
    examDate: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    timezone: z.ZodDefault<z.ZodString>;
    preferences: z.ZodDefault<z.ZodObject<{
        dailyGoal: z.ZodDefault<z.ZodNumber>;
        focusAreas: z.ZodDefault<z.ZodArray<z.ZodEnum<["writing", "reading", "listening", "speaking", "vocab"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        dailyGoal: number;
        focusAreas: ("writing" | "reading" | "listening" | "speaking" | "vocab")[];
    }, {
        dailyGoal?: number | undefined;
        focusAreas?: ("writing" | "reading" | "listening" | "speaking" | "vocab")[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    version: string;
    createdAt: string;
    updatedAt: string;
    target: {
        overall: number;
        writing: number;
        reading: number;
        listening: number;
        speaking: number;
    };
    examDate: string | null;
    timezone: string;
    preferences: {
        dailyGoal: number;
        focusAreas: ("writing" | "reading" | "listening" | "speaking" | "vocab")[];
    };
}, {
    createdAt: string;
    updatedAt: string;
    target: {
        overall: number;
        writing: number;
        reading: number;
        listening: number;
        speaking: number;
    };
    version?: string | undefined;
    examDate?: string | null | undefined;
    timezone?: string | undefined;
    preferences?: {
        dailyGoal?: number | undefined;
        focusAreas?: ("writing" | "reading" | "listening" | "speaking" | "vocab")[] | undefined;
    } | undefined;
}>;
export type Profile = z.infer<typeof ProfileSchema>;
//# sourceMappingURL=profile.schema.d.ts.map