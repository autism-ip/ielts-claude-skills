import { describe, it, expect } from 'vitest';
import { computePriority, getAllScores } from '../src/scoring.js';

function makeStats(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    version: '3.0.0', lastSnapshot: new Date().toISOString(),
    writing: { totalEssays: 5, averageBand: 6.2, topErrors: [{ category: 'grammar', count: 3 }, { category: 'coherence', count: 2 }] },
    reading: { totalPassages: 3, averageBand: 6.0, topErrors: [{ category: 'tfng_logic', count: 5 }, { category: 'gap_fill', count: 3 }] },
    listening: { totalSections: 4, averageBand: 5.8, topErrors: [{ category: 'inference', count: 4 }, { category: 'distraction', count: 3 }] },
    speaking: { totalPractices: 2, topicsCovered: 4 },
    vocab: { wordsReviewed: 55, retentionRate: 0.75 },
    combined: { overallBand: 6.0, daysUntilExam: 78 },
    ...overrides,
  };
}

function makeProfile(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    target: { overall: 7.0, writing: 6.5, reading: 7.5, listening: 8.0, speaking: 7.0 },
    examDate: '2026-08-23',
    preferences: { dailyGoal: 90, focusAreas: ['writing', 'reading'] },
    ...overrides,
  };
}

describe('computePriority', () => {
  it('returns deterministic score for writing', () => {
    const r = computePriority('writing', makeStats(), makeProfile());
    expect(r.module).toBe('writing');
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.reasons).toHaveLength(5);
  });

  it('higher score with larger target gap', () => {
    const big = computePriority('writing', makeStats({ writing: { totalEssays: 1, averageBand: 5, topErrors: [] } }), makeProfile());
    const small = computePriority('writing', makeStats({ writing: { totalEssays: 10, averageBand: 7, topErrors: [] } }), makeProfile());
    expect(big.score).toBeGreaterThan(small.score);
  });

  it('near exam scores higher than far exam', () => {
    const near = computePriority('reading', makeStats(), makeProfile({ examDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10) }));
    const far = computePriority('reading', makeStats(), makeProfile({ examDate: new Date(Date.now() + 200 * 86400000).toISOString().slice(0, 10) }));
    expect(near.score).toBeGreaterThan(far.score);
  });

  it('works without exam date', () => {
    const r = computePriority('listening', makeStats(), makeProfile({ examDate: null }));
    expect(r.score).toBeGreaterThanOrEqual(0);
  });

  it('is deterministic', () => {
    const stats = makeStats(); const profile = makeProfile();
    expect(computePriority('vocab', stats, profile)).toEqual(computePriority('vocab', stats, profile));
  });
});

describe('getAllScores', () => {
  it('scores all 5 modules descending', () => {
    const scores = getAllScores(['writing', 'reading', 'listening', 'speaking', 'vocab'], makeStats(), makeProfile());
    expect(scores).toHaveLength(5);
    expect(scores[0].score).toBeGreaterThanOrEqual(scores[1].score);
  });
});
