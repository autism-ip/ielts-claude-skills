import { describe, it, expect } from 'vitest';
import { getInterventions, getAllModules } from '../src/interventions.js';

describe('Intervention Library', () => {
  it('returns all interventions by default', () => {
    expect(getInterventions().length).toBeGreaterThan(20);
  });

  it('filters by errorTag', () => {
    const r = getInterventions('tfng_logic');
    expect(r.every(i => i.errorTag === 'tfng_logic')).toBe(true);
  });

  it('filters by module', () => {
    expect(getInterventions(undefined, 'writing').every(i => i.module === 'writing')).toBe(true);
  });

  it('each has all required fields', () => {
    for (const i of getInterventions()) {
      expect(i.module).toBeTruthy();
      expect(i.errorTag).toBeTruthy();
      expect(i.taskType).toBeTruthy();
      expect(i.duration).toBeGreaterThan(0);
      expect(i.instructions).toBeTruthy();
      expect(i.successCriteria).toBeTruthy();
    }
  });

  it('covers all 5 modules', () => {
    expect(getAllModules()).toHaveLength(5);
  });

  it('returns empty for unknown tag', () => {
    expect(getInterventions('no-such-tag')).toHaveLength(0);
  });
});
