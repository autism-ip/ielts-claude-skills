<<<<<<< HEAD
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const P = join(homedir(), '.ielts', 'plans', 'current.json');
export function planComplete(taskId) {
    if (!existsSync(P))
        return;
    const p = JSON.parse(readFileSync(P, 'utf-8'));
    for (const t of p.tasks || []) {
        if (t.id === taskId && t.status === 'todo') {
            t.status = 'done';
=======
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const P = join(homedir(), ".ielts", "plans", "current.json");
export function planComplete(taskId) {
    if (!existsSync(P))
        return;
    const p = JSON.parse(readFileSync(P, "utf-8"));
    for (const t of p.tasks || []) {
        if (t.id === taskId && t.status === "todo") {
            t.status = "done";
>>>>>>> origin/main
            t.completedAt = new Date().toISOString();
            writeFileSync(P, JSON.stringify(p, null, 2));
            return;
        }
    }
}
export function planSkip(taskId) {
    if (!existsSync(P))
        return;
<<<<<<< HEAD
    const p = JSON.parse(readFileSync(P, 'utf-8'));
    for (const t of p.tasks || []) {
        if (t.id === taskId && t.status === 'todo') {
            t.status = 'skipped';
=======
    const p = JSON.parse(readFileSync(P, "utf-8"));
    for (const t of p.tasks || []) {
        if (t.id === taskId && t.status === "todo") {
            t.status = "skipped";
>>>>>>> origin/main
            t.skippedAt = new Date().toISOString();
            writeFileSync(P, JSON.stringify(p, null, 2));
            return;
        }
    }
}
//# sourceMappingURL=plan-store.js.map