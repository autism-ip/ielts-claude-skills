#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { profileCommand } from './commands/profile.js';
import { lsCommand } from './commands/ls.js';
import { snapshotCommand } from './commands/snapshot.js';
import { backupCommand } from './commands/backup.js';
import { restoreCommand } from './commands/restore.js';
import { doctorCommand } from './commands/doctor.js';
import { registerPlanCommands } from './commands/plan/index.js';
import { registerCloudCommands } from './commands/cloud/index.js';
import { registerReportCommands } from './commands/report/index.js';

const program = new Command();
program.name('ielts').description('IELTS Claude Skills v3.0 CLI').version('3.0.0-alpha');
program.command('init').description('Initialize ~/.ielts/').option('-f,--fixtures','Install fixtures').action(initCommand);
program.command('profile').description('View profile').action(profileCommand);
program.command('ls').argument('[module]').description('List records').action(lsCommand);
program.command('snapshot').description('Generate snapshot').action(snapshotCommand);
program.command('backup').argument('<dest>').description('Backup').action(backupCommand);
program.command('restore').argument('<src>').description('Restore').action(restoreCommand);
program.command('doctor').description('Diagnose').action(doctorCommand);
registerPlanCommands(program);
registerCloudCommands(program);
registerReportCommands(program);
program.parse();
