import { z } from 'zod';
import { BandScoreSchema } from './profile.schema.js';

export const CalibrationRecordSchema = z.object({
  type: z.literal('calibration'),
  createdAt: z.string().datetime(),
  taskType: z.enum(['task1', 'task2', 'letter']),
  aiScores: z.object({ tr: BandScoreSchema, cc: BandScoreSchema, lr: BandScoreSchema, gra: BandScoreSchema, overall: BandScoreSchema }),
  humanScores: z.object({ tr: BandScoreSchema, cc: BandScoreSchema, lr: BandScoreSchema, gra: BandScoreSchema, overall: BandScoreSchema }),
  notes: z.string().default(''),
});
export type CalibrationRecord = z.infer<typeof CalibrationRecordSchema>;
