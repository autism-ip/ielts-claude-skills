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
    totalMin += picked.duration;
  }
  return tasks;
}

export function planWeek(stats: any, profile: any): AdaptiveTask[] {
  const all: AdaptiveTask[] = [];
  for (let d = 0; d < 7; d++) {
    const day = planToday(stats, profile);
    for (const t of day) { t.id = nextId(t.module); all.push(t); }
  }
  return all;
}

export function planComplete(_taskId: string): void {}
export function planSkip(_taskId: string): void {}
