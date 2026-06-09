import { existsSync, readFileSync, writeFileSync, renameSync, constants } from "node:fs";
import { homedir } from "node:os"; import { join, dirname } from "node:path";

const P = join(homedir(), ".ielts", "plans", "current.json");
function atomicWrite(p: string, data: any): void {
  const dir = dirname(p);
  const tmp = join(dir, ".tmp-" + Date.now() + ".json");
  writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 });
  renameSync(tmp, p);
}
function updatePlan(taskId: string, status: string, tsField: string): void {
  if (!existsSync(P)) return;
  try {
    const p = JSON.parse(readFileSync(P, "utf-8"));
    for (const t of p.tasks||[]) {
      if (t.id===taskId && t.status==="todo") {
        const updated = { ...t, status, [tsField]: new Date().toISOString() };
        const newPlan = { ...p, tasks: p.tasks.map((x: any) => x.id === taskId ? updated : x) };
        atomicWrite(P, newPlan); return;
      }
    }
  } catch (e: any) { console.error("plan-store: " + e.message); }
}
export function planComplete(taskId: string): void { updatePlan(taskId, "done", "completedAt"); }
export function planSkip(taskId: string): void { updatePlan(taskId, "skipped", "skippedAt"); }
