import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const BASE = join(homedir(), '.ielts');
export function registerPlanCommands(program) {
    const plan = program.command('plan').description('Adaptive study plan');
    plan.command('today')
        .description("Generate today's training plan")
        .action(() => {
        if (!existsSync(join(BASE, 'stats.json'))) {
            console.log('Run ielts init and ielts snapshot first');
            return;
        }
        console.log('Today\'s plan feature (requires @ielts/adaptive)');
    });
    plan.command('week')
        .description('Generate weekly training plan')
        .action(() => { console.log('Weekly plan feature'); });
    plan.command('complete')
        .argument('<task-id>', 'Task ID to mark complete')
        .description('Mark a plan task as completed')
        .action((id) => {
        const pf = join(BASE, 'plans', 'current.json');
        if (!existsSync(pf)) {
            console.log('No plan found');
            return;
        }
        const plan = JSON.parse(readFileSync(pf, 'utf-8'));
        for (const t of plan.tasks || []) {
            if (t.id === id && t.status === 'todo') {
                t.status = 'done';
                t.completedAt = new Date().toISOString();
                writeFileSync(pf, JSON.stringify(plan, null, 2));
                console.log('Task ' + id + ' completed');
                return;
            }
        }
        console.log('Task ' + id + ' not found or already done');
    });
    plan.command('skip')
        .argument('<task-id>', 'Task ID to skip')
        .description('Skip a plan task')
        .action((id) => {
        const pf = join(BASE, 'plans', 'current.json');
        if (!existsSync(pf)) {
            console.log('No plan found');
            return;
        }
        const plan = JSON.parse(readFileSync(pf, 'utf-8'));
        for (const t of plan.tasks || []) {
            if (t.id === id && t.status === 'todo') {
                t.status = 'skipped';
                t.skippedAt = new Date().toISOString();
                writeFileSync(pf, JSON.stringify(plan, null, 2));
                console.log('Task ' + id + ' skipped');
                return;
            }
        }
        console.log('Task ' + id + ' not found or already done');
    });
}
//# sourceMappingURL=index.js.map