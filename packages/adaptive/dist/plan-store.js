<<<<<<< HEAD
<<<<<<< HEAD
export function planComplete(_taskId) { }
export function planSkip(_taskId) { }
=======
export function planComplete(_id) { }
export function planSkip(_id) { }
>>>>>>> origin/feat/gh-48-intervention-library
=======
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const PLANS_DIR = join(homedir(), '.ielts', 'plans');
export function planComplete(taskId) {
    const p = join(PLANS_DIR, 'current.json');
    if (!existsSync(p))
        return;
    const plan = JSON.parse(readFileSync(p, 'utf-8'));
    for (const t of plan.tasks || []) {
        if (t.id === taskId) {
            t.status = 'done';
            t.completedAt = new Date().toISOString();
            break;
        }
    }
    writeFileSync(p, JSON.stringify(plan, null, 2));
}
export function planSkip(taskId) {
    const p = join(PLANS_DIR, 'current.json');
    if (!existsSync(p))
        return;
    const plan = JSON.parse(readFileSync(p, 'utf-8'));
    for (const t of plan.tasks || []) {
        if (t.id === taskId) {
            t.status = 'skipped';
            t.skippedAt = new Date().toISOString();
            break;
        }
    }
    writeFileSync(p, JSON.stringify(plan, null, 2));
}
>>>>>>> origin/feat/gh-49-plan-cli
//# sourceMappingURL=plan-store.js.map