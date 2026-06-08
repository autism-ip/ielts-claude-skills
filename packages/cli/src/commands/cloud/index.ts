import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FeishuAuth, FeishuClient, FeishuTableManager, getTableDefs, SyncState } from '@ielts/cloud';

const BASE = join(homedir(), '.ielts');
const SECRETS = join(BASE, 'secrets.json');
const STATS = join(BASE, 'stats.json');

function loadSecrets(): any {
  if (!existsSync(SECRETS)) return null;
  try { return JSON.parse(readFileSync(SECRETS, 'utf-8')); } catch { return null; }
}

function color(s: string, t: string): string {
  if (s === 'pass') return '\x1b[32m[PASS]\x1b[0m ' + t;
  if (s === 'fail') return '\x1b[31m[FAIL]\x1b[0m ' + t;
  return '\x1b[33m[WARN]\x1b[0m ' + t;
}

export function registerCloudCommands(program: Command): void {
  const cloud = program.command('cloud').description('Feishu cloud sync');

  cloud.command('setup')
    .description('Configure Feishu app credentials')
    .action(() => {
      console.log('Edit ~/.ielts/secrets.json with:');
      console.log('{"app_id": "...", "app_secret": "...", "app_token": "..."}');
    });

  cloud.command('doctor')
    .description('Check Feishu configuration and table schemas')
    .action(async () => {
      const s = loadSecrets();
      if (!s) { console.log(color('fail', 'No secrets.json found. Run ielts cloud setup.')); return; }

      const hasAppId = !!(s.app_id && typeof s.app_id === 'string');
      const hasSecret = !!(s.app_secret && typeof s.app_secret === 'string');
      console.log(color(hasAppId && hasSecret ? 'pass' : 'fail', 'Credentials: ' + (hasAppId ? 'app_id OK' : 'missing app_id') + ', ' + (hasSecret ? 'app_secret OK' : 'missing app_secret')));

      if (!hasAppId || !hasSecret) return;

      let authOk = false;
      try {
        const auth = new FeishuAuth(s.app_id, s.app_secret);
        const t = await auth.getToken();
        authOk = !!t;
        console.log(color('pass', 'Auth: token obtained (' + t.slice(0, 8) + '...)'));
      } catch (e: any) { console.log(color('fail', 'Auth: ' + e.message)); }

      if (!authOk || !s.app_token) { if (!s.app_token) console.log(color('warn', 'No app_token configured')); return; }

      try {
        const auth = new FeishuAuth(s.app_id, s.app_secret);
        const client = new FeishuClient(auth, s.app_token, '');
        const tables = await client.listTables();
        console.log(color('pass', 'Base: ' + tables.length + ' tables found'));

        const defs = getTableDefs();
        for (const def of defs) {
          const table = tables.find((t: any) => t.name === def.name);
          if (!table) { console.log(color('warn', '  Table "' + def.name + '" missing. Run ielts cloud init-feishu')); continue; }
          try {
            const fields = await client.listFields(table.table_id);
            const missing = def.fields.filter(f => !fields.some((ff: any) => ff.field_name === f.field_name));
            if (missing.length === 0) console.log(color('pass', '  ' + def.name + ': all ' + def.fields.length + ' fields OK'));
            else console.log(color('warn', '  ' + def.name + ': ' + missing.length + ' fields missing: ' + missing.map(f => f.field_name).join(', ')));
          } catch { console.log(color('fail', '  ' + def.name + ': could not list fields')); }
        }
      } catch (e: any) { console.log(color('fail', 'Base check: ' + e.message)); }
    });

  cloud.command('test')
    .description('Verify Feishu auth and base access')
    .action(async () => {
      const s = loadSecrets();
      if (!s?.app_id) { console.log('Run ielts cloud setup first'); return; }
      try {
        const auth = new FeishuAuth(s.app_id, s.app_secret);
        const t = await auth.getToken();
        console.log('Auth: OK (token=' + t.slice(0, 8) + '...)');
        if (s.app_token) {
          const client = new FeishuClient(auth, s.app_token, s.table_id ?? '');
          const r = await client.listRecords(1);
          console.log('Base: OK (' + r.items.length + ' records)');
        } else { console.log('Base: skipped (no app_token)'); }
      } catch (e: any) { console.log('Error: ' + e.message); }
    });

  cloud.command('sync')
    .description('Upload local records to Feishu')
    .action(async () => {
      const s = loadSecrets();
      if (!s?.app_id) { console.log('Run ielts cloud setup first'); return; }
      const state = new SyncState();
      console.log('Last sync: ' + (state.getLastSyncTime() || 'never'));
      if (!existsSync(STATS)) { console.log('No stats.json found. Run ielts snapshot first.'); return; }
      const stats = JSON.parse(readFileSync(STATS, 'utf-8'));
      const modules = ['writing', 'reading', 'listening', 'speaking', 'vocab'];
      const locals = modules.filter(m => stats[m]).map(m => ({ localId: m + ':' + stats.lastSnapshot, hash: m + ':' + JSON.stringify(stats[m]) }));
      const diff = state.computeDiff(locals);
      console.log(diff.toCreate.length + ' to create, ' + diff.toUpdate.length + ' to update, ' + diff.unchanged.length + ' unchanged');
    });

  cloud.command('status')
    .description('Show sync state')
    .action(() => {
      const s = loadSecrets();
      console.log('Feishu: ' + (s?.app_id ? 'configured' : 'not configured'));
      const state = new SyncState();
      console.log('Last sync: ' + (state.getLastSyncTime() || 'never'));
      const st = state.getStats();
      console.log('Synced: ' + st.synced + '/' + st.total + ' records');
    });
}
