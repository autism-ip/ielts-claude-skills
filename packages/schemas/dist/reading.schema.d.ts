import { z } from 'zod';
export declare const ReadingQuestionType: z.ZodEnum<["tfng", "matching-headings", "gap-fill", "heading", "true-false"]>;
export declare const ReadingErrorCategory: z.ZodEnum<["tfng_logic", "matching", "gap_fill", "heading", "true_false", "time_pressure"]>;
export declare const ReadingErrorSchema: z.ZodObject<{
    questionNumber: z.ZodNumber;
    type: z.ZodEnum<["tfng", "matching-headings", "gap-fill", "heading", "true-false"]>;
    userAnswer: z.ZodString;
    correctAnswer: z.ZodString;
    errorCategory: z.ZodOptional<z.ZodEnum<["tfng_logic", "matching", "gap_fill", "heading", "true_false", "time_pressure"]>>;
}, "strip", z.ZodTypeAny, {
    type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
    questionNumber: number;
    userAnswer: string;
    correctAnswer: string;
    errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
}, {
    type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
    questionNumber: number;
    userAnswer: string;
    correctAnswer: string;
    errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
}>;
export declare const SynonymSchema: z.ZodObject<{
    source: z.ZodString;
    match: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    source: string;
    match: string;
    context?: string | undefined;
}, {
    source: string;
    match: string;
    context?: string | undefined;
}>;
export declare const ReadingRecordSchema: z.ZodEffects<z.ZodObject<{
    type: z.ZodLiteral<"reading">;
    passageTitle: z.ZodString;
    questionTypes: z.ZodArray<z.ZodEnum<["tfng", "matching-headings", "gap-fill", "heading", "true-false"]>, "many">;
    totalQuestions: z.ZodNumber;
    correctCount: z.ZodNumber;
    bandEstimate: z.ZodEffects<z.ZodNumber, number, number>;
    errors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        questionNumber: z.ZodNumber;
        type: z.ZodEnum<["tfng", "matching-headings", "gap-fill", "heading", "true-false"]>;
        userAnswer: z.ZodString;
        correctAnswer: z.ZodString;
        errorCategory: z.ZodOptional<z.ZodEnum<["tfng_logic", "matching", "gap_fill", "heading", "true_false", "time_pressure"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
    }, {
        type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
    }>, "many">>;
    createdAt: z.ZodString;
    synonymsExtracted: z.ZodDefault<z.ZodArray<z.ZodObject<{
        source: z.ZodString;
        match: z.ZodString;
        context: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: string;
        match: string;
        context?: string | undefined;
    }, {
        source: string;
        match: string;
        context?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "reading";
    createdAt: string;
    errors: {
        type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
    }[];
    passageTitle: string;
    questionTypes: ("tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false")[];
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    synonymsExtracted: {
        source: string;
        match: string;
        context?: string | undefined;
    }[];
}, {
    type: "reading";
    createdAt: string;
    passageTitle: string;
    questionTypes: ("tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false")[];
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    errors?: {
        type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
    }[] | undefined;
    synonymsExtracted?: {
        source: string;
        match: string;
        context?: string | undefined;
    }[] | undefined;
}>, {
    type: "reading";
    createdAt: string;
    errors: {
        type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
    }[];
    passageTitle: string;
    questionTypes: ("tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false")[];
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    synonymsExtracted: {
        source: string;
        match: string;
        context?: string | undefined;
    }[];
}, {
    type: "reading";
    createdAt: string;
    passageTitle: string;
    questionTypes: ("tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false")[];
    totalQuestions: number;
    correctCount: number;
    bandEstimate: number;
    errors?: {
        type: "tfng" | "matching-headings" | "gap-fill" | "heading" | "true-false";
        questionNumber: number;
        userAnswer: string;
        correctAnswer: string;
        errorCategory?: "heading" | "tfng_logic" | "matching" | "gap_fill" | "true_false" | "time_pressure" | undefined;
    }[] | undefined;
    synonymsExtracted?: {
        source: string;
        match: string;
        context?: string | undefined;
    }[] | undefined;
}>;
export type ReadingRecord = z.infer<typeof ReadingRecordSchema>;
//# sourceMappingURL=reading.schema.d.ts.map