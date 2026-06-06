import { describe, it, expect } from 'vitest';
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
});
