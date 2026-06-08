#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { profileCommand } from './commands/profile.js';
import { lsCommand } from './commands/ls.js';
import { snapshotCommand } from './commands/snapshot.js';
import { backupCommand } from './commands/backup.js';
import { restoreCommand } from './commands/restore.js';
import { doctorCommand } from './commands/doctor.js';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { registerPlanCommands } from './commands/plan/index.js';
>>>>>>> origin/feat/gh-49-plan-cli
=======
import { registerPlanCommands } from './commands/plan/index.js';
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
const program = new Command();
program
    .name('ielts')
    .description('IELTS Claude Skills v3.0 CLI')
    .version('3.0.0-alpha');
program
    .command('init')
    .description('Initialize ~/.ielts/ directory structure')
    .option('-f, --fixtures', 'Install fixture dataset for testing')
    .action(initCommand);
program
    .command('profile')
    .description('View current profile')
    .action(profileCommand);
program
    .command('ls')
    .argument('[module]', 'Module name (writing, reading, listening, speaking, vocab)')
    .description('List records for a module')
    .action(lsCommand);
program
    .command('snapshot')
    .description('Generate stats snapshot for dashboard')
    .action(snapshotCommand);
program
    .command('backup')
    .argument('<dest>', 'Destination path')
    .description('Backup ~/.ielts/ to destination')
    .action(backupCommand);
program
    .command('restore')
    .argument('<src>', 'Source backup path')
    .description('Restore ~/.ielts/ from backup')
    .action(restoreCommand);
program
    .command('doctor')
    .description('Diagnose installation health')
    .action(doctorCommand);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
registerPlanCommands(program);
>>>>>>> origin/feat/gh-49-plan-cli
=======
registerPlanCommands(program);
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
program.parse();
//# sourceMappingURL=index.js.map