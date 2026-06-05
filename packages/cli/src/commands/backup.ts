import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SRC = join(homedir(), '.ielts');

export function backupCommand(dest: string): void {
  if (!existsSync(SRC)) { console.log('~/.ielts/ not found.'); return; }
  execSync(`cp -r "${SRC}" "${dest}"`, { stdio: 'inherit' });
  console.log(`Backed up → ${dest}`);
}
