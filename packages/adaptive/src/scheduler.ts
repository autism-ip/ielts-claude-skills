export interface AdaptiveTask { id: string; module: string; taskType: string; priorityScore: number; estimatedMinutes: number; status: 'todo'|'done'|'skipped'; completedAt?: string; skippedAt?: string; }

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const PLANS = join(homedir(), '.ielts', 'plans', 'current.json');

function loadPlan(): any { if (!existsSync(PLANS)) return null; return JSON.parse(readFileSync(PLANS, 'utf-8')); }
function savePlan(p: any) { writeFileSync(PLANS, JSON.stringify(p, null, 2)); }

export function planToday(_s: any, _p: any): AdaptiveTask[] { return []; }
export function planWeek(_s: any, _p: any): AdaptiveTask[] { return []; }

export function planComplete(taskId: string): boolean {
  const plan = loadPlan(); if (!plan) return false;
  for (const t of plan.tasks || []) { if (t.id === taskId && t.status === 'todo') { t.status = 'done'; t.completedAt = new Date().toISOString(); savePlan(plan); return true; } }
  return false;
}

export function planSkip(taskId: string): boolean {
  const plan = loadPlan(); if (!plan) return false;
  for (const t of plan.tasks || []) { if (t.id === taskId && t.status === 'todo') { t.status = 'skipped'; t.skippedAt = new Date().toISOString(); savePlan(plan); return true; } }
  return false;
}
