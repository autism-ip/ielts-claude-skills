import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
<<<<<<< HEAD
import https from 'node:https';
import { FeishuAuth, SyncState } from '@ielts/cloud';
=======
import { FeishuAuth, FeishuClient, SyncState } from '@ielts/cloud';
>>>>>>> origin/feat/gh-57-cloud-cli

const BASE = join(homedir(), '.ielts');
const SECRETS = join(BASE, 'secrets.json');
const STATS = join(BASE, 'stats.json');

function loadSecrets(): any {
  if (!existsSync(SECRETS)) return null;
  try { return JSON.parse(readFileSync(SECRETS, 'utf-8')); } catch { return null; }
}

<<<<<<< HEAD
function requestGet(url: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const r = https.get(url, { headers: { 'Authorization': `Bearer ${token}` } }, (res) => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch { reject(new Error('Invalid response')); }
      });
    }); r.on('error', reject); r.end();
  });
}

=======
>>>>>>> origin/feat/gh-57-cloud-cli
export function registerCloudCommands(program: Command): void {
  const cloud = program.command('cloud').description('Feishu cloud sync');

  cloud.command('setup')
    .description('Configure Feishu app credentials')
    .action(() => {
      console.log('Edit ~/.ielts/secrets.json with:');
      console.log('{"app_id": "...", "app_secret": "...", "app_token": "...", "table_id": "..."}');
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

        if (s.app_token) {
<<<<<<< HEAD
          try {
            const tablePath = s.table_id ? `/tables/${s.table_id}/records?page_size=1` : '';
            const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${s.app_token}${tablePath}`;
            const d = await requestGet(url, t);
            console.log(`Base: OK (${d?.data?.items?.length ?? 0} records)`);
          } catch (e2: any) { console.log(`Base failed: ${e2.message}`); }
        } else { console.log('Base: skipped (no app_token)'); }
      } catch (e: any) { console.log(`Auth failed: ${e.message}`); }
=======
          const client = new FeishuClient(auth, s.app_token, s.table_id ?? '');
          const r = await client.listRecords(1);
          console.log(`Base: OK (${r.items.length} records)`);
        } else {
          console.log('Base: skipped (no app_token)');
        }
      } catch (e: any) { console.log(`Error: ${e.message}`); }
>>>>>>> origin/feat/gh-57-cloud-cli
    });

  cloud.command('sync')
    .description('Upload local records to Feishu')
    .action(async () => {
      const s = loadSecrets();
      if (!s?.app_id) { console.log('Run ielts cloud setup first'); return; }
      const state = new SyncState();
      console.log(`Last sync: ${state.getLastSyncTime() || 'never'}`);

      if (!existsSync(STATS)) { console.log('No stats.json found. Run ielts snapshot first.'); return; }
      const stats = JSON.parse(readFileSync(STATS, 'utf-8'));
      const modules = ['writing', 'reading', 'listening', 'speaking', 'vocab'];
      const locals = modules.filter(m => stats[m]).map(m => ({
        localId: `${m}:${stats.lastSnapshot}`,
        hash: `${m}:${JSON.stringify(stats[m])}`,
      }));

      const diff = state.computeDiff(locals);
      console.log(`Records: ${diff.toCreate.length} to create, ${diff.toUpdate.length} to update, ${diff.unchanged.length} unchanged`);
      console.log('Sync complete.');
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
