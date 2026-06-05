import { z } from 'zod';
import { BandScoreSchema } from './profile.schema.js';

export const ReadingQuestionType = z.enum([
  'tfng', 'matching-headings', 'gap-fill', 'heading', 'true-false',
]);

export const ReadingErrorCategory = z.enum([
  'tfng_logic', 'matching', 'gap_fill', 'heading', 'true_false', 'time_pressure',
]);

export const ReadingErrorSchema = z.object({
  questionNumber: z.number().int().positive(),
  type: ReadingQuestionType,
  userAnswer: z.string(),
  correctAnswer: z.string(),
  errorCategory: ReadingErrorCategory.optional(),
});

export const SynonymSchema = z.object({
  source: z.string(),
  match: z.string(),
  context: z.string().optional(),
});

export const ReadingRecordSchema = z.object({
  type: z.literal('reading'),
  passageTitle: z.string().min(1),
  questionTypes: z.array(ReadingQuestionType),
  totalQuestions: z.number().int().positive(),
  correctCount: z.number().int().min(0),
  bandEstimate: BandScoreSchema,
  errors: z.array(ReadingErrorSchema).default([]),
  createdAt: z.string().datetime(),
  synonymsExtracted: z.array(SynonymSchema).default([]),
}).refine(r => r.correctCount <= r.totalQuestions, {
  message: 'correctCount must not exceed totalQuestions',
});

export type ReadingRecord = z.infer<typeof ReadingRecordSchema>;
