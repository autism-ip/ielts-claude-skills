import { describe, it, expect } from 'vitest';
import { BandScoreSchema, ProfileSchema } from '../src/index.js';

describe('BandScoreSchema', () => {
  it('accepts valid 0.5-increment scores', () => {
    expect(BandScoreSchema.parse(0)).toBe(0);
    expect(BandScoreSchema.parse(6.0)).toBe(6.0);
    expect(BandScoreSchema.parse(6.5)).toBe(6.5);
    expect(BandScoreSchema.parse(7.5)).toBe(7.5);
    expect(BandScoreSchema.parse(9)).toBe(9);
  });

  it('rejects scores > 9', () => {
    expect(() => BandScoreSchema.parse(9.5)).toThrow();
  });

  it('rejects scores < 0', () => {
    expect(() => BandScoreSchema.parse(-0.5)).toThrow();
  });

  it('rejects non-0.5 increments', () => {
    expect(() => BandScoreSchema.parse(6.3)).toThrow();
    expect(() => BandScoreSchema.parse(7.2)).toThrow();
    expect(() => BandScoreSchema.parse(8.7)).toThrow();
  });
});

describe('ProfileSchema', () => {
  const validProfile = {
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-05T00:00:00.000Z',
    target: { overall: 7.0, writing: 6.5, reading: 7.5, listening: 7.5, speaking: 6.5 },
    examDate: '2026-08-15',
  };

  it('accepts a valid profile', () => {
    const result = ProfileSchema.parse(validProfile);
    expect(result.version).toBe('3.0.0');
    expect(result.target.overall).toBe(7.0);
  });

  it('rejects invalid examDate format', () => {
    expect(() => ProfileSchema.parse({ ...validProfile, examDate: '15-08-2026' })).toThrow();
  });

  it('rejects band score with wrong increment', () => {
    expect(() => ProfileSchema.parse({
      ...validProfile,
      target: { ...validProfile.target, overall: 6.3 },
    })).toThrow();
  });
});
