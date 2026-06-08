import { z } from 'zod';
export declare const CalibrationRecordSchema: z.ZodObject<{
    type: z.ZodLiteral<"calibration">;
    createdAt: z.ZodString;
    taskType: z.ZodEnum<["task1", "task2", "letter"]>;
    aiScores: z.ZodObject<{
        tr: z.ZodEffects<z.ZodNumber, number, number>;
        cc: z.ZodEffects<z.ZodNumber, number, number>;
        lr: z.ZodEffects<z.ZodNumber, number, number>;
        gra: z.ZodEffects<z.ZodNumber, number, number>;
        overall: z.ZodEffects<z.ZodNumber, number, number>;
    }, "strip", z.ZodTypeAny, {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    }, {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    }>;
    humanScores: z.ZodObject<{
        tr: z.ZodEffects<z.ZodNumber, number, number>;
        cc: z.ZodEffects<z.ZodNumber, number, number>;
        lr: z.ZodEffects<z.ZodNumber, number, number>;
        gra: z.ZodEffects<z.ZodNumber, number, number>;
        overall: z.ZodEffects<z.ZodNumber, number, number>;
    }, "strip", z.ZodTypeAny, {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    }, {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    }>;
    notes: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "calibration";
    createdAt: string;
    taskType: "task1" | "task2" | "letter";
    aiScores: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    humanScores: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    notes: string;
}, {
    type: "calibration";
    createdAt: string;
    taskType: "task1" | "task2" | "letter";
    aiScores: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    humanScores: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    notes?: string | undefined;
}>;
export type CalibrationRecord = z.infer<typeof CalibrationRecordSchema>;
//# sourceMappingURL=calibration.schema.d.ts.map