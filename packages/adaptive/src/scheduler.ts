import { getAllScores } from "./scoring.js";
import { getInterventions } from "./interventions.js";
export interface AdaptiveTask { id: string; module: string; taskType: string; priorityScore: number; reason: string; estimatedMinutes: number; status: "todo"; }
let c = 0;
function nid(p: string): string { return `${p}-${Date.now()}-${++c}`; }
export function planToday(stats: any, profile: any): AdaptiveTask[] {
  const scores = getAllScores(["writing","reading","listening","speaking","vocab"], stats, profile);
  const goal = profile.preferences?.dailyGoal ?? 60; const tasks: AdaptiveTask[] = []; let total = 0;
  for (const s of scores) {
    const tags = (stats[s.module]?.topErrors || []).map((e: any) => e.category || e.errorCategory);
    const ip = getInterventions(undefined, s.module);
    const match = tags.length ? ip.filter(i => tags.includes(i.errorTag)) : ip;
    const picked = match.length ? match[0] : ip[0];
    if (!picked || total + picked.duration > goal) continue;
    tasks.push({ id: nid(s.module), module: s.module, taskType: picked.taskType, priorityScore: s.score, reason: s.reasons[0]||"", estimatedMinutes: picked.duration, status: "todo" });
    total += picked.duration;
  }
  return tasks;
}
export function planWeek(stats: any, profile: any): AdaptiveTask[] { return planToday(stats, profile); }
export function planComplete(_id: string): void {}
export function planSkip(_id: string): void {}
