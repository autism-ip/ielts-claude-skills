import { z } from 'zod';
import { BandScoreSchema } from './profile.schema.js';

export const WritingTaskType = z.enum(['task1', 'task2', 'letter']);

export const WritingErrorCategory = z.enum([
  'task_response', 'coherence', 'lexical', 'grammar', 'spelling',
]);

export const WritingErrorSchema = z.object({
  category: WritingErrorCategory,
  severity: z.enum(['major', 'minor']),
  location: z.string(),
  description: z.string(),
});

export const WritingScoresSchema = z.object({
  tr: BandScoreSchema,
  cc: BandScoreSchema,
  lr: BandScoreSchema,
  gra: BandScoreSchema,
  overall: BandScoreSchema,
});

export const WritingRecordSchema = z.object({
  type: z.literal('writing'),
  taskType: WritingTaskType,
  topic: z.string().min(1),
  wordCount: z.number().int().positive(),
  bandScore: WritingScoresSchema,
  errors: z.array(WritingErrorSchema).default([]),
  rewritten: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export type WritingRecord = z.infer<typeof WritingRecordSchema>;
