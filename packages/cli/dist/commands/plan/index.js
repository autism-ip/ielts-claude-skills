import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
<<<<<<< HEAD
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
=======
import { planToday, planWeek, planComplete, planSkip } from '@ielts/adaptive';
const BASE = join(homedir(), '.ielts');
>>>>>>> origin/feat/gh-50-plan-complete-skip
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
<<<<<<< HEAD
        writeFileSync(join(BASE, 'plans', 'current.json'), JSON.stringify({
            id: `plan-${now.toISOString().slice(0, 10)}`, type: 'adaptive-plan',
            createdAt: now.toISOString(), updatedAt: now.toISOString(),
            startDate: now.toISOString().slice(0, 10), tasks,
        }, null, 2));
        printPlan(tasks, `Today's Plan — ${now.toISOString().slice(0, 10)}`);
=======
        writeFileSync(join(BASE, 'plans', 'current.json'), JSON.stringify({ id: `plan-${now.toISOString().slice(0, 10)}`, type: 'adaptive-plan', createdAt: now.toISOString(), updatedAt: now.toISOString(), startDate: now.toISOString().slice(0, 10), tasks }, null, 2));
        printTasks(tasks, `Today's Plan — ${now.toISOString().slice(0, 10)}`);
>>>>>>> origin/feat/gh-50-plan-complete-skip
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
<<<<<<< HEAD
        const now = new Date();
        const wn = `W${Math.ceil((now.getDate() - new Date(now.getFullYear(), 0, 1).getDate() + now.getDay() + 1) / 7)}`;
        mkdirSync(join(BASE, 'plans'), { recursive: true });
        writeFileSync(join(BASE, 'plans', `week-${wn}.json`), JSON.stringify({ tasks }, null, 2));
        printPlan(tasks, `Weekly Plan — ${now.getFullYear()} ${wn}`);
    });
}
=======
        mkdirSync(join(BASE, 'plans'), { recursive: true });
        writeFileSync(join(BASE, 'plans', 'week.json'), JSON.stringify({ tasks }, null, 2));
        printTasks(tasks, 'Weekly Plan');
    });
    plan.command('complete')
        .argument('<task-id>', 'Task ID to mark complete')
        .description('Mark a plan task as completed')
        .action((id) => {
        if (planComplete(id))
            console.log(`Task ${id} marked as completed`);
        else
            console.log(`Task ${id} not found or already completed`);
    });
    plan.command('skip')
        .argument('<task-id>', 'Task ID to skip')
        .description('Skip a plan task')
        .action((id) => {
        if (planSkip(id))
            console.log(`Task ${id} marked as skipped`);
        else
            console.log(`Task ${id} not found or already completed`);
    });
}
function loadJSON(path) {
    if (!existsSync(path))
        return null;
    return JSON.parse(readFileSync(path, 'utf-8'));
}
function printTasks(tasks, label) {
    const b = '─'.repeat(46);
    console.log(`\n  ┌${b}┐\n  │  ${label}\n  ├${b}┤`);
    let total = 0;
    const icons = { writing: '✍', reading: '📖', listening: '🎧', speaking: '🎤', vocab: '📝' };
    for (const t of tasks) {
        console.log(`  │  ${icons[t.module] || '•'} [${t.priorityScore}] ${t.module}: ${t.taskType} (${t.estimatedMinutes}min)`);
        total += t.estimatedMinutes;
    }
    console.log(`  └${b}┘\n  Total: ${total}min | Tasks: ${tasks.length}\n`);
}
>>>>>>> origin/feat/gh-50-plan-complete-skip
//# sourceMappingURL=index.js.map