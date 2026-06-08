import { getAllScores } from './scoring.js';
import { getInterventions } from './interventions.js';
import { planComplete as psComplete, planSkip as psSkip } from './plan-store.js';
export interface AdaptiveTask { id: string; module: string; taskType: string; priorityScore: number; reason: string; estimatedMinutes: number; status: 'todo'; }
let c = 0;
function nid(p: string): string { return `${p}-${Date.now()}-${++c}`; }
export function planToday(stats: any, profile: any): AdaptiveTask[] {
<<<<<<< HEAD
  const scores = getAllScores(['writing','reading','listening','speaking','vocab'], stats, profile);
=======
  const scores = getAllScores(["writing","reading","listening","speaking","vocab"], stats, profile);
>>>>>>> 52e6d5a32c86d1e584bce03b444aeaa61adca72e
  const goal = profile.preferences?.dailyGoal ?? 60; const tasks: AdaptiveTask[] = []; let total = 0;
  for (const s of scores) {
    const tags = (stats[s.module]?.topErrors || []).map((e: any) => e.category || e.errorCategory);
    const ip = getInterventions(undefined, s.module);
    const match = tags.length ? ip.filter(i => tags.includes(i.errorTag)) : ip;
    const picked = match.length ? match[0] : ip[0];
    if (!picked || total + picked.duration > goal) continue;
<<<<<<< HEAD
    tasks.push({ id: nid(s.module), module: s.module, taskType: picked.taskType, priorityScore: s.score, reason: s.reasons[0]||'', estimatedMinutes: picked.duration, status: 'todo' });
=======
    tasks.push({ id: nid(s.module), module: s.module, taskType: picked.taskType, priorityScore: s.score, reason: s.reasons[0]||"", estimatedMinutes: picked.duration, status: "todo" });
>>>>>>> 52e6d5a32c86d1e584bce03b444aeaa61adca72e
    total += picked.duration;
  }
  return tasks;
}
export function planWeek(stats: any, profile: any): AdaptiveTask[] {
  const all: AdaptiveTask[] = [];
  for (let d = 0; d < 7; d++) { all.push(...planToday(stats, profile)); }
  return all;
}
export function planComplete(id: string): void { psComplete(id); }
export function planSkip(id: string): void { psSkip(id); }