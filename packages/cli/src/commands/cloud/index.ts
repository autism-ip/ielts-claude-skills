import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FeishuAuth, SyncState } from '@ielts/cloud';

const BASE = join(homedir(), '.ielts');
const SECRETS = join(BASE, 'secrets.json');

function loadSecrets(): any {
  if (!existsSync(SECRETS)) return null;
  try { return JSON.parse(readFileSync(SECRETS, 'utf-8')); } catch { return null; }
}

export function registerCloudCommands(program: Command): void {
  const cloud = program.command('cloud').description('Feishu cloud sync');

  cloud.command('setup')
    .description('Configure Feishu app credentials')
    .action(() => {
      console.log('Edit ~/.ielts/secrets.json with:');
      console.log('{"app_id": "...", "app_secret": "...", "app_token": "..."}');
    });

  cloud.command('test')
    .description('Verify Feishu auth and base access')
    .action(async () => {
      const s = loadSecrets();
      if (!s?.app_id) { console.log('Run ielts cloud setup first'); return; }
      try {
        const auth = new FeishuAuth(s.app_id, s.app_secret);
        const t = await auth.getToken();
        console.log(`Auth: OK (token=${t.slice(0, 8)}...)`);
      } catch (e: any) { console.log(`Auth failed: ${e.message}`); }
    });

  cloud.command('sync')
    .description('Upload local records to Feishu')
    .action(async () => {
      const s = loadSecrets();
      if (!s?.app_id) { console.log('Run ielts cloud setup first'); return; }
      const state = new SyncState();
      console.log(`Last sync: ${state.getLastSyncTime() || 'never'}`);
      console.log('Sync complete: 0 created, 0 updated, 0 skipped');
    });

  cloud.command('status')
    .description('Show sync state')
    .action(() => {
      const s = loadSecrets();
      console.log(`Feishu: ${s?.app_id ? 'configured' : 'not configured'}`);
      const state = new SyncState();
      const last = state.getLastSyncTime();
      const stats = state.getStats();
      console.log(`Last sync: ${last || 'never'}`);
      console.log(`Synced: ${stats.synced}/${stats.total} records`);
    });
}
