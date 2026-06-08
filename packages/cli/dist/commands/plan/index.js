import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const BASE = join(homedir(), '.ielts');
export function registerPlanCommands(program) {
    const plan = program.command('plan').description('Adaptive study plan');
    plan.command('today').description("Generate today's training plan")
        .action(() => {
        const sp = join(BASE, 'stats.json');
        const pp = join(BASE, 'profile.json');
        if (!existsSync(sp) || !existsSync(pp)) {
            console.log('Run ielts init and ielts snapshot first');
            return;
        }
        try {
            const stats = JSON.parse(readFileSync(sp, 'utf-8'));
            const profile = JSON.parse(readFileSync(pp, 'utf-8'));
            const now = new Date();
            const planData = { id: 'plan-' + now.toISOString().slice(0, 10), type: 'adaptive-plan', createdAt: now.toISOString(), updatedAt: now.toISOString(), startDate: now.toISOString().slice(0, 10), tasks: [] };
            mkdirSync(join(BASE, 'plans'), { recursive: true });
            writeFileSync(join(BASE, 'plans', 'current.json'), JSON.stringify(planData, null, 2));
            console.log("Today's plan generated. " + planData.tasks.length + ' tasks.');
        }
        catch (e) {
            console.log('Error generating plan: ' + e.message);
        }
    });
    plan.command('week').description('Generate weekly training plan')
        .action(() => { console.log('Weekly plan: use ielts plan today for now.'); });
    plan.command('complete').argument('<task-id>', 'Task ID').description('Mark a plan task as completed')
        .action((id) => {
        const pf = join(BASE, 'plans', 'current.json');
        if (!existsSync(pf)) {
            console.log('No plan found');
            return;
        }
        const p = JSON.parse(readFileSync(pf, 'utf-8'));
        for (const t of p.tasks || []) {
            if (t.id === id && t.status === 'todo') {
                t.status = 'done';
                t.completedAt = new Date().toISOString();
                writeFileSync(pf, JSON.stringify(p, null, 2));
                console.log('Task ' + id + ' completed');
                return;
            }
        }
        console.log('Task ' + id + ' not found or already done');
    });
    plan.command('skip').argument('<task-id>', 'Task ID').description('Skip a plan task')
        .action((id) => {
        const pf = join(BASE, 'plans', 'current.json');
        if (!existsSync(pf)) {
            console.log('No plan found');
            return;
        }
        const p = JSON.parse(readFileSync(pf, 'utf-8'));
        for (const t of p.tasks || []) {
            if (t.id === id && t.status === 'todo') {
                t.status = 'skipped';
                t.skippedAt = new Date().toISOString();
                writeFileSync(pf, JSON.stringify(p, null, 2));
                console.log('Task ' + id + ' skipped');
                return;
            }
        }
        console.log('Task ' + id + ' not found or already done');
    });
}
//# sourceMappingURL=index.js.map