import { z } from 'zod';
export declare const ListeningSection: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
export declare const ListeningErrorCategory: z.ZodEnum<["spelling", "number", "distraction", "speed", "inference"]>;
export declare const ListeningErrorSchema: z.ZodObject<{
    questionNumber: z.ZodNumber;
    userAnswer: z.ZodString;
    correctAnswer: z.ZodString;
    errorCategory: z.ZodEnum<["spelling", "number", "distraction", "speed", "inference"]>;
}, "strip", z.ZodTypeAny, {
    questionNumber: number;
    userAnswer: string;
    correctAnswer: string;
    errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
}, {
    questionNumber: number;
    userAnswer: string;
    correctAnswer: string;
    errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
}>;
export declare const ListeningRecordSchema: z.ZodEffects<z.ZodObject<{
    type: z.ZodLiteral<"listening">;
    section: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    totalQuestions: z.ZodNumber;
    correctCount: z.ZodNumber;
    bandEstimate: z.ZodEffects<z.ZodNumber, number, number>;
    errors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        questionNumber: z.ZodNumber;
        userAnswer: z.ZodString;
        correctAnswer: z.ZodString;
        errorCategory: z.ZodEnum<["spelling", "number", "distraction", "speed", "inference"]>;
    }, "strip", z.ZodTypeAny, {
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
    }, {
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
    }>, "many">>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "listening";
    createdAt: string;
    errors: {
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
    }[];
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    section: 1 | 2 | 3 | 4;
}, {
    type: "listening";
    createdAt: string;
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    section: 1 | 2 | 3 | 4;
    errors?: {
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
    }[] | undefined;
}>, {
    type: "listening";
    createdAt: string;
    errors: {
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
    }[];
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    section: 1 | 2 | 3 | 4;
}, {
    type: "listening";
    createdAt: string;
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    section: 1 | 2 | 3 | 4;
    errors?: {
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory: "number" | "spelling" | "distraction" | "speed" | "inference";
    }[] | undefined;
}>;
export type ListeningRecord = z.infer<typeof ListeningRecordSchema>;
//# sourceMappingURL=listening.schema.d.ts.map