import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { planToday, planWeek, planComplete, planSkip } from '@ielts/adaptive';

const BASE = join(homedir(), '.ielts');

export function registerPlanCommands(program: Command): void {
  const plan = program.command('plan').description('Adaptive study plan');

  plan.command('today')
    .description("Generate today's training plan")
    .action(() => {
      const stats = loadJSON(join(BASE, 'stats.json'));
      const profile = loadJSON(join(BASE, 'profile.json'));
      if (!stats || !profile) { console.log('Run ielts init and ielts snapshot first'); process.exit(1); }
      const tasks = planToday(stats, profile);
      const now = new Date();
      mkdirSync(join(BASE, 'plans'), { recursive: true });
      writeFileSync(join(BASE, 'plans', 'current.json'), JSON.stringify({ id: `plan-${now.toISOString().slice(0, 10)}`, type: 'adaptive-plan', createdAt: now.toISOString(), updatedAt: now.toISOString(), startDate: now.toISOString().slice(0, 10), tasks }, null, 2));
      printTasks(tasks, `Today's Plan — ${now.toISOString().slice(0, 10)}`);
    });

  plan.command('week')
    .description('Generate weekly training plan')
    .action(() => {
      const stats = loadJSON(join(BASE, 'stats.json'));
      const profile = loadJSON(join(BASE, 'profile.json'));
      if (!stats || !profile) { console.log('Run ielts init and ielts snapshot first'); process.exit(1); }
      const tasks = planWeek(stats, profile);
      mkdirSync(join(BASE, 'plans'), { recursive: true });
      writeFileSync(join(BASE, 'plans', 'week.json'), JSON.stringify({ tasks }, null, 2));
      printTasks(tasks, 'Weekly Plan');
    });

  plan.command('complete')
    .argument('<task-id>', 'Task ID to mark complete')
    .description('Mark a plan task as completed')
    .action((id: string) => {
      if (planComplete(id)) console.log(`Task ${id} marked as completed`);
      else console.log(`Task ${id} not found or already completed`);
    });

  plan.command('skip')
    .argument('<task-id>', 'Task ID to skip')
    .description('Skip a plan task')
    .action((id: string) => {
      if (planSkip(id)) console.log(`Task ${id} marked as skipped`);
      else console.log(`Task ${id} not found or already completed`);
    });
}

function loadJSON(path: string): any {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function printTasks(tasks: any[], label: string): void {
  const b = '─'.repeat(46);
  console.log(`\n  ┌${b}┐\n  │  ${label}\n  ├${b}┤`);
  let total = 0; const icons: Record<string, string> = { writing: '✍', reading: '📖', listening: '🎧', speaking: '🎤', vocab: '📝' };
  for (const t of tasks) { console.log(`  │  ${icons[t.module] || '•'} [${t.priorityScore}] ${t.module}: ${t.taskType} (${t.estimatedMinutes}min)`); total += t.estimatedMinutes; }
  console.log(`  └${b}┘\n  Total: ${total}min | Tasks: ${tasks.length}\n`);
}
