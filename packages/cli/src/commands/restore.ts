import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DEST = join(homedir(), '.ielts');

export function restoreCommand(src: string): void {
  if (!existsSync(src)) { console.log(`Not found: ${src}`); return; }
  if (!existsSync(join(src, 'profile.json'))) { console.log(`Invalid backup: ${src}`); return; }
  if (existsSync(DEST)) { console.log(`${DEST} exists. Remove it first or use a different path.`); return; }
  execSync(`cp -r "${src}" "${DEST}"`, { stdio: 'inherit' });
  console.log(`Restored ${src} → ${DEST}`);
}
