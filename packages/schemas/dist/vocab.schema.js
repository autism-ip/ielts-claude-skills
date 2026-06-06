import { z } from 'zod';
export const WordTier = z.enum(['B6', 'B7', 'B8']);
export const WordEntrySchema = z.object({
    word: z.string().min(1),
    tier: WordTier,
    definition: z.string(),
    example: z.string(),
});
export const VocabWordlistSchema = z.object({
    type: z.literal('vocab-wordlist'),
    tiers: z.object({
        band6: z.number().int().default(0),
        band7: z.number().int().default(0),
        band8: z.number().int().default(0),
    }),
    entries: z.array(WordEntrySchema).default([]),
});
export const ReviewDaySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reviewed: z.number().int().default(0),
    newWords: z.number().int().default(0),
    correct: z.number().int().default(0),
});
export const VocabReviewLogSchema = z.object({
    type: z.literal('vocab-review-log'),
    days: z.array(ReviewDaySchema).default([]),
});
//# sourceMappingURL=vocab.schema.js.map