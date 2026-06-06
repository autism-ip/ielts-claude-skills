import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { installFixtures } from '../fixtures.js';

const IELTS_DIR = join(homedir(), '.ielts');
const DIRS = ['writing', 'reading', 'listening', 'speaking/stories', 'vocab', 'diagnosis'];

export function initCommand(options: { fixtures?: boolean }): void {
  if (existsSync(IELTS_DIR) && !options.fixtures) {
    console.log('~/.ielts/ already exists. Skipping init.');
    return;
  }
  if (options.fixtures) {
    installFixtures();
    return;
  }
  mkdirSync(IELTS_DIR, { recursive: true });
  for (const dir of DIRS) {
    mkdirSync(join(IELTS_DIR, dir), { recursive: true });
  }
  const profile = {
    version: '3.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    target: { overall: 0, writing: 0, reading: 0, listening: 0, speaking: 0 },
    examDate: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferences: { dailyGoal: 60, focusAreas: [] },
  };
  writeFileSync(join(IELTS_DIR, 'profile.json'), JSON.stringify(profile, null, 2));
  const emptyStats = {
    version: '3.0.0', lastSnapshot: new Date().toISOString(),
    writing: {}, reading: {}, listening: {}, speaking: {}, vocab: {},
    combined: { overallBand: 0, daysUntilExam: 0 },
  };
  writeFileSync(join(IELTS_DIR, 'stats.json'), JSON.stringify(emptyStats, null, 2));
  console.log(`Initialized ~/.ielts/ (${DIRS.length + 2} items).`);
}
