import { describe, it, expect } from 'vitest';
import { CalibrationRecordSchema } from '../src/index.js';
describe('CalibrationRecordSchema', () => {
  const valid = { type: 'calibration', createdAt: '2026-06-08T10:00:00.000Z', taskType: 'task2',
    aiScores: { tr: 6.5, cc: 6.0, lr: 6.5, gra: 6.0, overall: 6.0 },
    humanScores: { tr: 7.0, cc: 6.5, lr: 6.5, gra: 6.5, overall: 6.5 } };
  it('accepts valid calibration', () => { const r = CalibrationRecordSchema.parse(valid); expect(r.type).toBe('calibration'); });
  it('rejects invalid band score', () => { expect(() => CalibrationRecordSchema.parse({...valid, aiScores: {...valid.aiScores, tr: 6.3}})).toThrow(); });
  it('defaults notes to empty', () => { expect(CalibrationRecordSchema.parse(valid).notes).toBe(''); });
});
