import { z } from 'zod';
export declare const WritingTaskType: z.ZodEnum<["task1", "task2", "letter"]>;
export declare const WritingExamType: z.ZodEnum<["academic", "general-training"]>;
export declare const WritingErrorCategory: z.ZodEnum<["task_response", "coherence", "lexical", "grammar", "spelling"]>;
export declare const WritingErrorSchema: z.ZodObject<{
    category: z.ZodEnum<["task_response", "coherence", "lexical", "grammar", "spelling"]>;
    severity: z.ZodEnum<["major", "minor"]>;
    location: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
    severity: "major" | "minor";
    location: string;
    description: string;
}, {
    category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
    severity: "major" | "minor";
    location: string;
    description: string;
}>;
export declare const WritingScoresSchema: z.ZodObject<{
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
export declare const WritingRecordSchema: z.ZodEffects<z.ZodObject<{
    type: z.ZodLiteral<"writing">;
    taskType: z.ZodEnum<["task1", "task2", "letter"]>;
    topic: z.ZodString;
    wordCount: z.ZodNumber;
    bandScore: z.ZodObject<{
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
    errors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["task_response", "coherence", "lexical", "grammar", "spelling"]>;
        severity: z.ZodEnum<["major", "minor"]>;
        location: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
        severity: "major" | "minor";
        location: string;
        description: string;
    }, {
        category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
        severity: "major" | "minor";
        location: string;
        description: string;
    }>, "many">>;
    rewritten: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    examType: z.ZodOptional<z.ZodEnum<["academic", "general-training"]>>;
}, "strip", z.ZodTypeAny, {
    type: "writing";
    createdAt: string;
    taskType: "task1" | "task2" | "letter";
    topic: string;
    wordCount: number;
    bandScore: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    errors: {
        category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
        severity: "major" | "minor";
        location: string;
        description: string;
    }[];
    rewritten: boolean;
    examType?: "academic" | "general-training" | undefined;
}, {
    type: "writing";
    createdAt: string;
    taskType: "task1" | "task2" | "letter";
    topic: string;
    wordCount: number;
    bandScore: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    errors?: {
        category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
        severity: "major" | "minor";
        location: string;
        description: string;
    }[] | undefined;
    rewritten?: boolean | undefined;
    examType?: "academic" | "general-training" | undefined;
}>, {
    type: "writing";
    createdAt: string;
    taskType: "task1" | "task2" | "letter";
    topic: string;
    wordCount: number;
    bandScore: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    errors: {
        category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
        severity: "major" | "minor";
        location: string;
        description: string;
    }[];
    rewritten: boolean;
    examType?: "academic" | "general-training" | undefined;
}, {
    type: "writing";
    createdAt: string;
    taskType: "task1" | "task2" | "letter";
    topic: string;
    wordCount: number;
    bandScore: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    };
    errors?: {
        category: "task_response" | "coherence" | "lexical" | "grammar" | "spelling";
        severity: "major" | "minor";
        location: string;
        description: string;
    }[] | undefined;
    rewritten?: boolean | undefined;
    examType?: "academic" | "general-training" | undefined;
}>;
export type WritingRecord = z.infer<typeof WritingRecordSchema>;
//# sourceMappingURL=writing.schema.d.ts.map