import { z } from 'zod';
import { BandScoreSchema } from './profile.schema';

export const ListeningSection = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

export const ListeningErrorCategory = z.enum([
  'spelling', 'number', 'distraction', 'speed', 'inference',
]);

export const ListeningErrorSchema = z.object({
  questionNumber: z.number().int().positive(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
  errorCategory: ListeningErrorCategory,
});

export const ListeningRecordSchema = z.object({
  type: z.literal('listening'),
  section: ListeningSection,
  totalQuestions: z.number().int().positive(),
  correctCount: z.number().int().min(0),
  bandEstimate: BandScoreSchema,
  errors: z.array(ListeningErrorSchema).default([]),
  createdAt: z.string().datetime(),
}).refine(r => r.correctCount <= r.totalQuestions, {
  message: 'correctCount must not exceed totalQuestions',
});

export type ListeningRecord = z.infer<typeof ListeningRecordSchema>;
