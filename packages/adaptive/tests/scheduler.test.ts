import { describe, it, expect } from 'vitest';
});
describe('planWeek', () => { it('returns tasks', () => { expect(planWeek(ms(),mp()).length).toBeGreaterThan(0); }); });