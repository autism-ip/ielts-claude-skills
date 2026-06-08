<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
/**
<<<<<<< HEAD
 * [INPUT]: 依赖 scoring.ts 的 PriorityScore
 * [OUTPUT]: 对外提供 planToday, planWeek 函数
 * [POS]: packages/adaptive 的调度器，编排日/周计划
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export function planToday(stats: Record<string, any>, profile: Record<string, any>): any[] {
  return [];
}

export function planWeek(stats: Record<string, any>, profile: Record<string, any>): any[] {
  return [];
=======
=======
/**
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
/**
>>>>>>> origin/feat/gh-51-dashboard-plan
 * [INPUT]: 依赖 scoring.ts 的 getAllScores, interventions.ts 的 getInterventions
 * [OUTPUT]: 对外提供 planToday, planWeek, planComplete, planSkip 函数
 * [POS]: packages/adaptive 的调度器，编排日/周计划，处理任务完成/跳过
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { getAllScores } from './scoring.js';
import { getInterventions } from './interventions.js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface AdaptiveTask {
  id: string;
  module: string;
  taskType: string;
  priorityScore: number;
  estimatedMinutes: number;
  status: 'todo' | 'done' | 'skipped';
  completedAt?: string;
  skippedAt?: string;
}

const PLANS = join(homedir(), '.ielts', 'plans', 'current.json');

let taskCounter = 0;

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++taskCounter}`;
}

function loadPlan(): any {
  if (!existsSync(PLANS)) return null;
  return JSON.parse(readFileSync(PLANS, 'utf-8'));
}

function savePlan(p: any) {
  writeFileSync(PLANS, JSON.stringify(p, null, 2));
}

export function planToday(
  stats: Record<string, any>,
  profile: Record<string, any>,
): AdaptiveTask[] {
  const modules = ['writing', 'reading', 'listening', 'speaking', 'vocab'];
  const scores = getAllScores(modules, stats, profile);
  const dailyGoal = profile.preferences?.dailyGoal ?? 60;
  const tasks: AdaptiveTask[] = [];
  let totalMin = 0;

  /* 按优先级遍历模块，从 stats 读 topErrors 匹配干预措施 */
  for (const score of scores) {
    if (totalMin >= dailyGoal && tasks.length > 0) break;
    const interventions = getInterventions(undefined, score.module);
    const errorTags = (stats[score.module]?.topErrors || []).map(
      (e: any) => e.category,
    );
    const matched = interventions.filter((i) =>
      errorTags.includes(i.errorTag),
    );
    const picked = (matched.length > 0 ? matched : interventions)[0];
    if (!picked) continue;
    if (totalMin + picked.duration > dailyGoal && tasks.length > 0) break;
    tasks.push({
      id: nextId(score.module),
      module: score.module,
      taskType: picked.taskType,
      priorityScore: score.score,
      estimatedMinutes: picked.duration,
      status: 'todo',
    });
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { getAllScores } from './scoring.js';
import { getInterventions } from './interventions.js';

export interface AdaptiveTask { id: string; module: string; taskType: string; priorityScore: number; reason: string; estimatedMinutes: number; status: 'todo'; }
export interface Plan { id: string; type: 'adaptive-plan'; createdAt: string; updatedAt: string; startDate: string; tasks: AdaptiveTask[]; }

let taskCounter = 0;
function nextId(prefix: string): string { return `${prefix}-${Date.now()}-${++taskCounter}`; }
function todayStr(): string { return new Date().toISOString().slice(0, 10); }
function isoStr(): string { return new Date().toISOString(); }

function weekNumber(): string {
  const now = new Date(); const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return `${now.getFullYear()}-W${String(Math.ceil((days + start.getDay() + 1) / 7)).padStart(2, '0')}`;
}

export function planToday(stats: any, profile: any): AdaptiveTask[] {
  const modules = ['writing', 'reading', 'listening', 'speaking', 'vocab'];
  const scores = getAllScores(modules, stats, profile);
  const threshold = Math.max(20, scores.length > 0 ? scores[0].score * 0.5 : 0);
  const dailyGoal = profile.preferences?.dailyGoal ?? 60;
  const tasks: AdaptiveTask[] = [];
  let totalMin = 0;
  for (const score of scores) {
    if (score.score < threshold && tasks.length >= 1) break;
    const interventions = getInterventions(undefined, score.module);
    const errorTags = (stats[score.module]?.topErrors || []).map((e: any) => e.category);
    const matched = interventions.filter(i => errorTags.includes(i.errorTag));
    const picked = (matched.length > 0 ? matched : interventions)[0];
    if (!picked) continue;
    if (totalMin + picked.duration > dailyGoal && tasks.length > 0) break;
    tasks.push({ id: nextId(score.module), module: score.module, taskType: picked.taskType, priorityScore: score.score, reason: score.reasons[0] || '', estimatedMinutes: picked.duration, status: 'todo' });
>>>>>>> origin/feat/gh-49-plan-cli
=======
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
    totalMin += picked.duration;
  }
  return tasks;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
export function planWeek(
  stats: Record<string, any>,
  profile: Record<string, any>,
): AdaptiveTask[] {
  const all: AdaptiveTask[] = [];
  for (let d = 0; d < 7; d++) {
    const day = planToday(stats, profile);
    for (const t of day) {
      all.push({ ...t, id: nextId(t.module) });
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
export function planWeek(stats: any, profile: any): AdaptiveTask[] {
  const all: AdaptiveTask[] = [];
  for (let d = 0; d < 7; d++) {
    const day = planToday(stats, profile);
    for (const t of day) { t.id = nextId(t.module); all.push(t); }
>>>>>>> origin/feat/gh-49-plan-cli
=======
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
  }
  return all;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
export function planComplete(taskId: string): boolean {
  const plan = loadPlan();
  if (!plan) return false;
  for (const t of plan.tasks || []) {
    if (t.id === taskId && t.status === 'todo') {
      t.status = 'done';
      t.completedAt = new Date().toISOString();
      savePlan(plan);
      return true;
    }
  }
  return false;
}

export function planSkip(taskId: string): boolean {
  const plan = loadPlan();
  if (!plan) return false;
  for (const t of plan.tasks || []) {
    if (t.id === taskId && t.status === 'todo') {
      t.status = 'skipped';
      t.skippedAt = new Date().toISOString();
      savePlan(plan);
      return true;
    }
  }
  return false;
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> origin/feat/gh-46-adaptive-plan-schema
}
=======
export function planToday(stats: Record<string, any>, profile: Record<string, any>): any[] { return []; }
export function planWeek(stats: Record<string, any>, profile: Record<string, any>): any[] { return []; }
>>>>>>> origin/feat/gh-47-priority-scoring
=======
export function planToday(_a: any, _b: any): any[] { return []; }
export function planWeek(_a: any, _b: any): any[] { return []; }
>>>>>>> origin/feat/gh-48-intervention-library
=======
export function planComplete(_taskId: string): void {}
export function planSkip(_taskId: string): void {}
>>>>>>> origin/feat/gh-49-plan-cli
=======
}
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
}
>>>>>>> origin/feat/gh-51-dashboard-plan
