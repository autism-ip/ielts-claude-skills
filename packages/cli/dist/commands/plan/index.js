import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { planToday, planWeek } from '@ielts/adaptive';
const BASE = join(homedir(), '.ielts');
function loadJSON(path) {
    if (!existsSync(path))
        return null;
    return JSON.parse(readFileSync(path, 'utf-8'));
}
function printPlan(tasks, label) {
    const border = '─'.repeat(46);
    console.log(`\n  ┌${border}┐`);
    console.log(`  │  ${label}`);
    console.log(`  ├${border}┤`);
    let total = 0;
    const icons = { writing: '✍', reading: '📖', listening: '🎧', speaking: '🎤', vocab: '📝' };
    for (const t of tasks) {
        console.log(`  │  ${icons[t.module] || '•'} [${t.priorityScore}] ${t.module}: ${t.taskType} (${t.estimatedMinutes}min)`);
        total += t.estimatedMinutes;
    }
    console.log(`  └${border}┘`);
    console.log(`  Total: ${total}min | Tasks: ${tasks.length}\n`);
}
export function registerPlanCommands(program) {
    const plan = program.command('plan').description('Adaptive study plan');
    plan.command('today')
        .description("Generate today's training plan")
        .action(() => {
        const stats = loadJSON(join(BASE, 'stats.json'));
        const profile = loadJSON(join(BASE, 'profile.json'));
        if (!stats || !profile) {
            console.log('Run ielts init and ielts snapshot first');
            process.exit(1);
        }
        const tasks = planToday(stats, profile);
        const now = new Date();
        mkdirSync(join(BASE, 'plans'), { recursive: true });
        writeFileSync(join(BASE, 'plans', 'current.json'), JSON.stringify({
            id: `plan-${now.toISOString().slice(0, 10)}`, type: 'adaptive-plan',
            createdAt: now.toISOString(), updatedAt: now.toISOString(),
            startDate: now.toISOString().slice(0, 10), tasks,
        }, null, 2));
        printPlan(tasks, `Today's Plan — ${now.toISOString().slice(0, 10)}`);
    });
    plan.command('week')
        .description('Generate weekly training plan')
        .action(() => {
        const stats = loadJSON(join(BASE, 'stats.json'));
        const profile = loadJSON(join(BASE, 'profile.json'));
        if (!stats || !profile) {
            console.log('Run ielts init and ielts snapshot first');
            process.exit(1);
        }
        const tasks = planWeek(stats, profile);
        const now = new Date();
        const wn = `W${Math.ceil((now.getDate() - new Date(now.getFullYear(), 0, 1).getDate() + now.getDay() + 1) / 7)}`;
        mkdirSync(join(BASE, 'plans'), { recursive: true });
        writeFileSync(join(BASE, 'plans', `week-${wn}.json`), JSON.stringify({ tasks }, null, 2));
        printPlan(tasks, `Weekly Plan — ${now.getFullYear()} ${wn}`);
    });
}
//# sourceMappingURL=index.js.map