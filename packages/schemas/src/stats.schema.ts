import { z } from 'zod';

const StatsErrorSummarySchema = z.object({
  category: z.string(),
  count: z.number().int().default(0),
});

export const WritingStatsSchema = z.object({
  totalEssays: z.number().int().default(0),
  averageScores: z.object({
    tr: z.number(), cc: z.number(), lr: z.number(), gra: z.number(), overall: z.number(),
  }).optional(),
  topErrors: z.array(StatsErrorSummarySchema).default([]),
});

export const ReadingStatsSchema = z.object({
  totalPassages: z.number().int().default(0),
  averageCorrect: z.number().default(0),
  averageBand: z.number().default(0),
  topErrors: z.array(StatsErrorSummarySchema).default([]),
});

export const ListeningStatsSchema = z.object({
  totalSections: z.number().int().default(0),
  averageCorrect: z.number().default(0),
  averageBand: z.number().default(0),
  topErrors: z.array(StatsErrorSummarySchema).default([]),
});

export const SpeakingStatsSchema = z.object({
  totalPractices: z.number().int().default(0),
  topicsCovered: z.number().int().default(0),
});

export const VocabStatsSchema = z.object({
  wordsReviewed: z.number().int().default(0),
  retentionRate: z.number().min(0).max(1).default(0),
});

export const CombinedStatsSchema = z.object({
  overallBand: z.number().default(0),
  daysUntilExam: z.number().int().default(0),
});

export const StatsSchema = z.object({
  version: z.string().default('3.0.0'),
  lastSnapshot: z.string().datetime(),
  writing: WritingStatsSchema.default({}),
  reading: ReadingStatsSchema.default({}),
  listening: ListeningStatsSchema.default({}),
  speaking: SpeakingStatsSchema.default({}),
  vocab: VocabStatsSchema.default({}),
  combined: CombinedStatsSchema.default({}),
});

export type Stats = z.infer<typeof StatsSchema>;
