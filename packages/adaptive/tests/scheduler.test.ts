import { describe, it, expect } from 'vitest';
<<<<<<< HEAD
=======
import { planToday, planWeek } from '../src/scheduler.js';
function ms() { return { lastSnapshot:new Date().toISOString(), writing:{totalEssays:5,averageScores:{overall:6.2},topErrors:[{category:'grammar',count:3}]}, reading:{totalPassages:3,averageBand:6.0,topErrors:[{category:'tfng_logic',count:5}]}, listening:{totalSections:4,averageBand:5.8,topErrors:[{category:'inference',count:4}]}, speaking:{totalPractices:2}, vocab:{wordsReviewed:55,retentionRate:0.75}, combined:{overallBand:6.0} }; }
function mp() { return { target:{overall:7.0,writing:6.5}, examDate:'2026-08-23', preferences:{dailyGoal:90} }; }
describe('planToday', () => {
  it('returns tasks with required fields', () => { for (const t of planToday(ms(),mp())) { expect(t.id).toBeTruthy(); expect(t.module).toBeTruthy(); expect(t.taskType).toBeTruthy(); expect(t.priorityScore).toBeGreaterThanOrEqual(0); expect(t.estimatedMinutes).toBeGreaterThan(0); expect(t.status).toBe('todo'); } });
  it('respects dailyGoal', () => { expect(planToday(ms(),mp()).reduce((s:number,t:any)=>s+t.estimatedMinutes,0)).toBeLessThanOrEqual(90); });
  it('handles empty data', () => { expect(Array.isArray(planToday({},{}))).toBe(true); });
>>>>>>> origin/main
});
describe('planWeek', () => { it('returns tasks', () => { expect(planWeek(ms(),mp()).length).toBeGreaterThan(0); }); });