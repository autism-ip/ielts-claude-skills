import { cpSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SRC = join(homedir(), '.ielts');

export function backupCommand(dest: string): void {
  if (!existsSync(SRC)) { console.log('~/.ielts/ not found.'); return; }
  cpSync(SRC, dest, { recursive: true });
  console.log(`Backed up → ${dest}`);
}
