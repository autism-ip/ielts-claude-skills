import { existsSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
const P = join(homedir(), ".ielts", "plans", "current.json");
function atomicWrite(p, data) {
    const dir = dirname(p);
    const tmp = join(dir, ".tmp-" + Date.now() + ".json");
    writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
    renameSync(tmp, p);
}
function updatePlan(taskId, status, tsField) {
    if (!existsSync(P))
        return;
    try {
        const p = JSON.parse(readFileSync(P, "utf-8"));
        for (const t of p.tasks || []) {
            if (t.id === taskId && t.status === "todo") {
                const updated = { ...t, status, [tsField]: new Date().toISOString() };
                const newPlan = { ...p, tasks: p.tasks.map((x) => x.id === taskId ? updated : x) };
                atomicWrite(P, newPlan);
                return;
            }
        }
    }
    catch (e) {
        console.error("plan-store: " + e.message);
    }
}
export function planComplete(taskId) { updatePlan(taskId, "done", "completedAt"); }
export function planSkip(taskId) { updatePlan(taskId, "skipped", "skippedAt"); }
//# sourceMappingURL=plan-store.js.map