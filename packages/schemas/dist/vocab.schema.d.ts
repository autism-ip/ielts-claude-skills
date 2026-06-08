import { z } from 'zod';
export declare const WordTier: z.ZodEnum<["B6", "B7", "B8"]>;
export declare const WordEntrySchema: z.ZodObject<{
    word: z.ZodString;
    tier: z.ZodEnum<["B6", "B7", "B8"]>;
    definition: z.ZodString;
    example: z.ZodString;
}, "strip", z.ZodTypeAny, {
    word: string;
    tier: "B6" | "B7" | "B8";
    definition: string;
    example: string;
}, {
    word: string;
    tier: "B6" | "B7" | "B8";
    definition: string;
    example: string;
}>;
export declare const VocabWordlistSchema: z.ZodObject<{
    type: z.ZodLiteral<"vocab-wordlist">;
    tiers: z.ZodObject<{
        band6: z.ZodDefault<z.ZodNumber>;
        band7: z.ZodDefault<z.ZodNumber>;
        band8: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        band6: number;
        band7: number;
        band8: number;
    }, {
        band6?: number | undefined;
        band7?: number | undefined;
        band8?: number | undefined;
    }>;
    entries: z.ZodDefault<z.ZodArray<z.ZodObject<{
        word: z.ZodString;
        tier: z.ZodEnum<["B6", "B7", "B8"]>;
        definition: z.ZodString;
        example: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        word: string;
        tier: "B6" | "B7" | "B8";
        definition: string;
        example: string;
    }, {
        word: string;
        tier: "B6" | "B7" | "B8";
        definition: string;
        example: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    entries: {
        word: string;
        tier: "B6" | "B7" | "B8";
        definition: string;
        example: string;
    }[];
    type: "vocab-wordlist";
    tiers: {
        band6: number;
        band7: number;
        band8: number;
    };
}, {
    type: "vocab-wordlist";
    tiers: {
        band6?: number | undefined;
        band7?: number | undefined;
        band8?: number | undefined;
    };
    entries?: {
        word: string;
        tier: "B6" | "B7" | "B8";
        definition: string;
        example: string;
    }[] | undefined;
}>;
export type VocabWordlist = z.infer<typeof VocabWordlistSchema>;
export declare const ReviewDaySchema: z.ZodObject<{
    date: z.ZodString;
    reviewed: z.ZodDefault<z.ZodNumber>;
    newWords: z.ZodDefault<z.ZodNumber>;
    correct: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    date: string;
    reviewed: number;
    newWords: number;
    correct: number;
}, {
    date: string;
    reviewed?: number | undefined;
    newWords?: number | undefined;
    correct?: number | undefined;
}>;
export declare const VocabReviewLogSchema: z.ZodObject<{
    type: z.ZodLiteral<"vocab-review-log">;
    days: z.ZodDefault<z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        reviewed: z.ZodDefault<z.ZodNumber>;
        newWords: z.ZodDefault<z.ZodNumber>;
        correct: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        reviewed: number;
        newWords: number;
        correct: number;
    }, {
        date: string;
        reviewed?: number | undefined;
        newWords?: number | undefined;
        correct?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "vocab-review-log";
    days: {
        date: string;
        reviewed: number;
        newWords: number;
        correct: number;
    }[];
}, {
    type: "vocab-review-log";
    days?: {
        date: string;
        reviewed?: number | undefined;
        newWords?: number | undefined;
        correct?: number | undefined;
    }[] | undefined;
}>;
export type VocabReviewLog = z.infer<typeof VocabReviewLogSchema>;
//# sourceMappingURL=vocab.schema.d.ts.map