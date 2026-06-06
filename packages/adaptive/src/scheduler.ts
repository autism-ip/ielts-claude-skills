/**
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
    totalMin += picked.duration;
  }
  return tasks;
}

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
  }
  return all;
}

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
}
