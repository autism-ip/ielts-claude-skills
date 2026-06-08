import { z } from 'zod';
export declare const WritingStatsSchema: z.ZodObject<{
    totalEssays: z.ZodDefault<z.ZodNumber>;
    averageScores: z.ZodOptional<z.ZodObject<{
        tr: z.ZodNumber;
        cc: z.ZodNumber;
        lr: z.ZodNumber;
        gra: z.ZodNumber;
        overall: z.ZodNumber;
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
    }>>;
    topErrors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        category: z.ZodString;
        count: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        category: string;
        count: number;
    }, {
        category: string;
        count?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    totalEssays: number;
    topErrors: {
        category: string;
        count: number;
    }[];
    averageScores?: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    } | undefined;
}, {
    totalEssays?: number | undefined;
    averageScores?: {
        overall: number;
        tr: number;
        cc: number;
        lr: number;
        gra: number;
    } | undefined;
    topErrors?: {
        category: string;
        count?: number | undefined;
    }[] | undefined;
}>;
export declare const ReadingStatsSchema: z.ZodObject<{
    totalPassages: z.ZodDefault<z.ZodNumber>;
    averageCorrect: z.ZodDefault<z.ZodNumber>;
    averageBand: z.ZodDefault<z.ZodNumber>;
    topErrors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        category: z.ZodString;
        count: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        category: string;
        count: number;
    }, {
        category: string;
        count?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    topErrors: {
        category: string;
        count: number;
    }[];
    totalPassages: number;
    averageCorrect: number;
    averageBand: number;
}, {
    topErrors?: {
        category: string;
        count?: number | undefined;
    }[] | undefined;
    totalPassages?: number | undefined;
    averageCorrect?: number | undefined;
    averageBand?: number | undefined;
}>;
export declare const ListeningStatsSchema: z.ZodObject<{
    totalSections: z.ZodDefault<z.ZodNumber>;
    averageCorrect: z.ZodDefault<z.ZodNumber>;
    averageBand: z.ZodDefault<z.ZodNumber>;
    topErrors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        category: z.ZodString;
        count: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        category: string;
        count: number;
    }, {
        category: string;
        count?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    topErrors: {
        category: string;
        count: number;
    }[];
    averageCorrect: number;
    averageBand: number;
    totalSections: number;
}, {
    topErrors?: {
        category: string;
        count?: number | undefined;
    }[] | undefined;
    averageCorrect?: number | undefined;
    averageBand?: number | undefined;
    totalSections?: number | undefined;
}>;
export declare const SpeakingStatsSchema: z.ZodObject<{
    totalPractices: z.ZodDefault<z.ZodNumber>;
    topicsCovered: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    totalPractices: number;
    topicsCovered: number;
}, {
    totalPractices?: number | undefined;
    topicsCovered?: number | undefined;
}>;
export declare const VocabStatsSchema: z.ZodObject<{
    wordsReviewed: z.ZodDefault<z.ZodNumber>;
    retentionRate: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    wordsReviewed: number;
    retentionRate: number;
}, {
    wordsReviewed?: number | undefined;
    retentionRate?: number | undefined;
}>;
export declare const CombinedStatsSchema: z.ZodObject<{
    overallBand: z.ZodDefault<z.ZodNumber>;
    daysUntilExam: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    overallBand: number;
    daysUntilExam: number;
}, {
    overallBand?: number | undefined;
    daysUntilExam?: number | undefined;
}>;
export declare const StatsSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodString>;
    lastSnapshot: z.ZodString;
    writing: z.ZodDefault<z.ZodObject<{
        totalEssays: z.ZodDefault<z.ZodNumber>;
        averageScores: z.ZodOptional<z.ZodObject<{
            tr: z.ZodNumber;
            cc: z.ZodNumber;
            lr: z.ZodNumber;
            gra: z.ZodNumber;
            overall: z.ZodNumber;
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
        }>>;
        topErrors: z.ZodDefault<z.ZodArray<z.ZodObject<{
            category: z.ZodString;
            count: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            category: string;
            count: number;
        }, {
            category: string;
            count?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        totalEssays: number;
        topErrors: {
            category: string;
            count: number;
        }[];
        averageScores?: {
            overall: number;
            tr: number;
            cc: number;
            lr: number;
            gra: number;
        } | undefined;
    }, {
        totalEssays?: number | undefined;
        averageScores?: {
            overall: number;
            tr: number;
            cc: number;
            lr: number;
            gra: number;
        } | undefined;
        topErrors?: {
            category: string;
            count?: number | undefined;
        }[] | undefined;
    }>>;
    reading: z.ZodDefault<z.ZodObject<{
        totalPassages: z.ZodDefault<z.ZodNumber>;
        averageCorrect: z.ZodDefault<z.ZodNumber>;
        averageBand: z.ZodDefault<z.ZodNumber>;
        topErrors: z.ZodDefault<z.ZodArray<z.ZodObject<{
            category: z.ZodString;
            count: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            category: string;
            count: number;
        }, {
            category: string;
            count?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        topErrors: {
            category: string;
            count: number;
        }[];
        totalPassages: number;
        averageCorrect: number;
        averageBand: number;
    }, {
        topErrors?: {
            category: string;
            count?: number | undefined;
        }[] | undefined;
        totalPassages?: number | undefined;
        averageCorrect?: number | undefined;
        averageBand?: number | undefined;
    }>>;
    listening: z.ZodDefault<z.ZodObject<{
        totalSections: z.ZodDefault<z.ZodNumber>;
        averageCorrect: z.ZodDefault<z.ZodNumber>;
        averageBand: z.ZodDefault<z.ZodNumber>;
        topErrors: z.ZodDefault<z.ZodArray<z.ZodObject<{
            category: z.ZodString;
            count: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            category: string;
            count: number;
        }, {
            category: string;
            count?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        topErrors: {
            category: string;
            count: number;
        }[];
        averageCorrect: number;
        averageBand: number;
        totalSections: number;
    }, {
        topErrors?: {
            category: string;
            count?: number | undefined;
        }[] | undefined;
        averageCorrect?: number | undefined;
        averageBand?: number | undefined;
        totalSections?: number | undefined;
    }>>;
    speaking: z.ZodDefault<z.ZodObject<{
        totalPractices: z.ZodDefault<z.ZodNumber>;
        topicsCovered: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        totalPractices: number;
        topicsCovered: number;
    }, {
        totalPractices?: number | undefined;
        topicsCovered?: number | undefined;
    }>>;
    vocab: z.ZodDefault<z.ZodObject<{
        wordsReviewed: z.ZodDefault<z.ZodNumber>;
        retentionRate: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        wordsReviewed: number;
        retentionRate: number;
    }, {
        wordsReviewed?: number | undefined;
        retentionRate?: number | undefined;
    }>>;
    combined: z.ZodDefault<z.ZodObject<{
        overallBand: z.ZodDefault<z.ZodNumber>;
        daysUntilExam: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        overallBand: number;
        daysUntilExam: number;
    }, {
        overallBand?: number | undefined;
        daysUntilExam?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    writing: {
        totalEssays: number;
        topErrors: {
            category: string;
            count: number;
        }[];
        averageScores?: {
            overall: number;
            tr: number;
            cc: number;
            lr: number;
            gra: number;
        } | undefined;
    };
    reading: {
        topErrors: {
            category: string;
            count: number;
        }[];
        totalPassages: number;
        averageCorrect: number;
        averageBand: number;
    };
    listening: {
        topErrors: {
            category: string;
            count: number;
        }[];
        averageCorrect: number;
        averageBand: number;
        totalSections: number;
    };
    speaking: {
        totalPractices: number;
        topicsCovered: number;
    };
    vocab: {
        wordsReviewed: number;
        retentionRate: number;
    };
    version: string;
    lastSnapshot: string;
    combined: {
        overallBand: number;
        daysUntilExam: number;
    };
}, {
    lastSnapshot: string;
    writing?: {
        totalEssays?: number | undefined;
        averageScores?: {
            overall: number;
            tr: number;
            cc: number;
            lr: number;
            gra: number;
        } | undefined;
        topErrors?: {
            category: string;
            count?: number | undefined;
        }[] | undefined;
    } | undefined;
    reading?: {
        topErrors?: {
            category: string;
            count?: number | undefined;
        }[] | undefined;
        totalPassages?: number | undefined;
        averageCorrect?: number | undefined;
        averageBand?: number | undefined;
    } | undefined;
    listening?: {
        topErrors?: {
            category: string;
            count?: number | undefined;
        }[] | undefined;
        averageCorrect?: number | undefined;
        averageBand?: number | undefined;
        totalSections?: number | undefined;
    } | undefined;
    speaking?: {
        totalPractices?: number | undefined;
        topicsCovered?: number | undefined;
    } | undefined;
    vocab?: {
        wordsReviewed?: number | undefined;
        retentionRate?: number | undefined;
    } | undefined;
    version?: string | undefined;
    combined?: {
        overallBand?: number | undefined;
        daysUntilExam?: number | undefined;
    } | undefined;
}>;
export type Stats = z.infer<typeof StatsSchema>;
//# sourceMappingURL=stats.schema.d.ts.map