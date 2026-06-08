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