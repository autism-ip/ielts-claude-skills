import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { planToday } from '@ielts/adaptive';

const BASE = join(homedir(), '.ielts');

export function registerPlanCommands(program: Command): void {
  const plan = program.command('plan').description('Adaptive study plan');

  plan.command('today').description("Generate today's training plan")
    .action(() => {
      const sp = join(BASE, 'stats.json');
      const pp = join(BASE, 'profile.json');
      if (!existsSync(sp) || !existsSync(pp)) { console.log('Run ielts init and ielts snapshot first'); return; }
      try {
        const stats = JSON.parse(readFileSync(sp, 'utf-8'));
        const profile = JSON.parse(readFileSync(pp, 'utf-8'));
        const tasks = planToday(stats, profile);
        const now = new Date();
        const planData = { id: 'plan-' + now.toISOString().slice(0, 10), type: 'adaptive-plan', createdAt: now.toISOString(), updatedAt: now.toISOString(), startDate: now.toISOString().slice(0, 10), tasks };
        mkdirSync(join(BASE, 'plans'), { recursive: true });
        writeFileSync(join(BASE, 'plans', 'current.json'), JSON.stringify(planData, null, 2));
        console.log("Today's plan: " + tasks.length + ' tasks.');
      } catch (e: any) { console.log('Error: ' + e.message); }
    });

  plan.command('week').description('Generate weekly training plan')
    .action(() => {
      const sp = join(BASE, 'stats.json');
      const pp = join(BASE, 'profile.json');
      if (!existsSync(sp) || !existsSync(pp)) { console.log('Run ielts init and ielts snapshot first'); return; }
      try {
        const stats = JSON.parse(readFileSync(sp, 'utf-8'));
        const profile = JSON.parse(readFileSync(pp, 'utf-8'));
        const week: any[] = [];
        for (let d = 0; d < 7; d++) { week.push(...planToday(stats, profile)); }
        mkdirSync(join(BASE, 'plans'), { recursive: true });
        writeFileSync(join(BASE, 'plans', 'week.json'), JSON.stringify({ tasks: week }, null, 2));
        console.log('Weekly plan: ' + week.length + ' tasks across 7 days.');
      } catch (e: any) { console.log('Error: ' + e.message); }
    });

  plan.command('complete').argument('<task-id>', 'Task ID').description('Mark a plan task as completed')
    .action((id: string) => {
      const pf = join(BASE, 'plans', 'current.json');
      if (!existsSync(pf)) { console.log('No plan found'); return; }
      const p = JSON.parse(readFileSync(pf, 'utf-8'));
      for (const t of p.tasks || []) {
        if (t.id === id && t.status === 'todo') { t.status = 'done'; t.completedAt = new Date().toISOString(); writeFileSync(pf, JSON.stringify(p, null, 2)); console.log('Task ' + id + ' completed'); return; }
      }
      console.log('Task ' + id + ' not found or already done');
    });

  plan.command('skip').argument('<task-id>', 'Task ID').description('Skip a plan task')
    .action((id: string) => {
      const pf = join(BASE, 'plans', 'current.json');
      if (!existsSync(pf)) { console.log('No plan found'); return; }
      const p = JSON.parse(readFileSync(pf, 'utf-8'));
      for (const t of p.tasks || []) {
        if (t.id === id && t.status === 'todo') { t.status = 'skipped'; t.skippedAt = new Date().toISOString(); writeFileSync(pf, JSON.stringify(p, null, 2)); console.log('Task ' + id + ' skipped'); return; }
      }
      console.log('Task ' + id + ' not found or already done');
    });
}
