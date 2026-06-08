import { describe, it, expect } from 'vitest';
import { processPatterns, getPatternRules } from '../src/diagnosis/patterns.js';

describe('processPatterns', () => {
  const stats = {
    writing: { topErrors: [{ category: 'grammar', count: 4 }, { category: 'coherence', count: 2 }] },
    reading: { topErrors: [{ category: 'tfng_logic', count: 5 }] },
    listening: { topErrors: [{ category: 'distraction', count: 3 }, { category: 'inference', count: 2 }] },
    speaking: { totalPractices: 2, topErrors: [] },
    vocab: { wordsReviewed: 55, retentionRate: 0.75 },
  };

  it('returns sorted patterns', () => {
    const r = processPatterns(stats);
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].score).toBeGreaterThanOrEqual(r[1].score);
  });
  it('each has required fields', () => {
    for (const r of processPatterns(stats)) { expect(r.pattern.name).toBeTruthy(); expect(r.score).toBeGreaterThan(0); expect(r.evidence.summary).toBeTruthy(); }
  });
  it('empty stats returns empty', () => { expect(processPatterns({})).toHaveLength(0); });
});

describe('getPatternRules', () => {
  it('returns 12 rules', () => { expect(getPatternRules()).toHaveLength(12); });
  it('filters by module', () => { expect(getPatternRules('writing').every(r => r.module === 'writing')).toBe(true); });
});
