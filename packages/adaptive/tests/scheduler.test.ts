import { describe, it, expect } from 'vitest';
<<<<<<< HEAD
import { planToday, planWeek } from '../src/scheduler.js';

function makeStats() {
  return {
    lastSnapshot: new Date().toISOString(),
    writing: { totalEssays: 5, averageScores: { overall: 6.2 }, topErrors: [{ category: 'grammar', count: 3 }] },
    reading: { totalPassages: 3, averageBand: 6.0, topErrors: [{ category: 'tfng_logic', count: 5 }] },
    listening: { totalSections: 4, averageBand: 5.8, topErrors: [{ category: 'inference', count: 4 }] },
    speaking: { totalPractices: 2 }, vocab: { wordsReviewed: 55, retentionRate: 0.75 },
    combined: { overallBand: 6.0 },
  };
}

function makeProfile() {
  return { target: { overall: 7.0, writing: 6.5 }, examDate: '2026-08-23', preferences: { dailyGoal: 90 } };
}

describe('planToday', () => {
  it('returns tasks with required fields', () => {
    for (const t of planToday(makeStats(), makeProfile())) {
      expect(t.id).toBeTruthy(); expect(t.module).toBeTruthy(); expect(t.taskType).toBeTruthy();
      expect(t.priorityScore).toBeGreaterThanOrEqual(0); expect(t.estimatedMinutes).toBeGreaterThan(0);
      expect(t.status).toBe('todo');
    }
  });
  it('respects dailyGoal', () => {
    expect(planToday(makeStats(), makeProfile()).reduce((s: number, t: any) => s + t.estimatedMinutes, 0)).toBeLessThanOrEqual(90);
  });
  it('handles empty data', () => { expect(Array.isArray(planToday({}, {}))).toBe(true); });
});

describe('planWeek', () => {
  it('returns tasks', () => { expect(planWeek(makeStats(), makeProfile()).length).toBeGreaterThan(0); });
=======
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { planComplete, planSkip } from '../src/scheduler.js';

function setupTestPlan(): string {
  const base = join(homedir(), '.ielts', 'plans');
  mkdirSync(base, { recursive: true });
  const plan = {
    tasks: [
      { id: 'task-1', module: 'writing', status: 'todo' },
      { id: 'task-2', module: 'reading', status: 'todo' },
      { id: 'task-3', module: 'writing', status: 'done' },
    ],
  };
  writeFileSync(join(base, 'current.json'), JSON.stringify(plan));
  return 'task-1';
}

describe('planComplete', () => {
  it('marks todo task as done', () => {
    const id = setupTestPlan();
    expect(planComplete(id)).toBe(true);
    const plan = JSON.parse(readFileSync(join(homedir(), '.ielts', 'plans', 'current.json'), 'utf-8'));
    expect(plan.tasks.find((t: any) => t.id === id).status).toBe('done');
  });

  it('returns false for already done task', () => {
    setupTestPlan();
    expect(planComplete('task-3')).toBe(false);
  });
});

describe('planSkip', () => {
  it('marks todo task as skipped', () => {
    const id = setupTestPlan();
    expect(planSkip(id)).toBe(true);
    const plan = JSON.parse(readFileSync(join(homedir(), '.ielts', 'plans', 'current.json'), 'utf-8'));
    expect(plan.tasks.find((t: any) => t.id === id).status).toBe('skipped');
  });
>>>>>>> origin/feat/gh-50-plan-complete-skip
});
