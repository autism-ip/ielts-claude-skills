import { cpSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const DEST = join(homedir(), '.ielts');

export function restoreCommand(src: string): void {
  const resolved = resolve(src);
  if (!existsSync(resolved)) { console.log('Not found: ' + resolved); return; }
  if (!existsSync(join(resolved, 'profile.json'))) { console.log('Invalid backup: ' + resolved); return; }
  if (existsSync(DEST)) { console.log(DEST + ' exists. Remove it first or use a different path.'); return; }
  try {
    cpSync(resolved, DEST, { recursive: true });
    console.log('Restored ' + resolved + ' → ' + DEST);
  } catch (e: any) { console.log('Restore failed: ' + e.message); process.exitCode = 1; }
}
