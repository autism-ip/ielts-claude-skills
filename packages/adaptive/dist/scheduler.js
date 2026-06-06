import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const PLANS = join(homedir(), '.ielts', 'plans', 'current.json');
function loadPlan() { if (!existsSync(PLANS))
    return null; return JSON.parse(readFileSync(PLANS, 'utf-8')); }
function savePlan(p) { writeFileSync(PLANS, JSON.stringify(p, null, 2)); }
export function planToday(_s, _p) { return []; }
export function planWeek(_s, _p) { return []; }
export function planComplete(taskId) {
    const plan = loadPlan();
    if (!plan)
        return false;
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
export function planSkip(taskId) {
    const plan = loadPlan();
    if (!plan)
        return false;
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
//# sourceMappingURL=scheduler.js.map