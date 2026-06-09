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

export function registerCloudCommands(program: Command): void {
  const cloud = program.command('cloud').description('Feishu cloud sync');

  cloud.command('setup').description('Configure Feishu app credentials')
    .action(() => { console.log('Edit ~/.ielts/secrets.json with: {"app_id":"...","app_secret":"...","app_token":"..."}'); });

  cloud.command('init-feishu').description('Initialize Feishu Bitable tables and fields')
    .action(async () => {
      const s = loadSecrets();
      if (!s?.app_id || !s?.app_secret || !s?.app_token) { console.log('Run ielts cloud setup first'); return; }
      try {
        const auth = new FeishuAuth(s.app_id, s.app_secret);
        const client = new FeishuClient(auth, s.app_token, '');
        const mgr = new FeishuTableManager(client);
        const r = await mgr.initialize();
        console.log('Created: ' + (r.created.length ? r.created.join(', ') : 'none'));
        console.log('Existing: ' + (r.existing.length ? r.existing.join(', ') : 'none'));
        if (r.fieldsAdded.length) console.log('Fields added: ' + r.fieldsAdded.length);
      } catch (e: any) { console.log('Init failed: ' + e.message); }
    });

  cloud.command('doctor').description('Check Feishu configuration and table schemas')
    .action(async () => {
      const s = loadSecrets(); if (!s) { console.log('No secrets.json'); return; }
      const ok = !!(s.app_id&&typeof s.app_id==='string')&&!!(s.app_secret&&typeof s.app_secret==='string');
      console.log(ok?'[PASS] Credentials OK':'[FAIL] Credentials missing');
      if (!ok) return;
      try { const a=new FeishuAuth(s.app_id,s.app_secret); const t=await a.getToken(); console.log('[PASS] Auth: '+t.slice(0,8));
        if (!s.app_token) { console.log('[WARN] No app_token'); return; }
        const c=new FeishuClient(a,s.app_token,''); const tables=await c.listTables(); console.log('[PASS] Base: '+tables.length+' tables');
        for (const def of getTableDefs()) {
          const tb=tables.find((t:any)=>t.name===def.name);
          if (!tb) { console.log('[WARN] Table "'+def.name+'" missing'); continue; }
          const fields=await c.listFields(tb.table_id);
          const miss=def.fields.filter(f=>!fields.some((ff:any)=>ff.field_name===f.field_name));
          console.log(miss.length===0?'[PASS] '+def.name:'[WARN] '+def.name+': '+miss.length+' fields missing');
        }
      } catch(e:any){console.log('[FAIL] Error: '+e.message);}
    });

  cloud.command('test').description('Verify Feishu auth')
    .action(async () => {
      const s = loadSecrets(); if (!s?.app_id) { console.log('Run setup first'); return; }
      try { const a = new FeishuAuth(s.app_id, s.app_secret); const t = await a.getToken(); console.log('Auth: OK (' + t.slice(0, 8) + ')');
        if (s.app_token) { const c = new FeishuClient(a, s.app_token, s.table_id ?? ''); const r = await c.listRecords(1); console.log('Base: OK (' + r.items.length + ' records)'); }
      } catch (e: any) { console.log('Error: ' + e.message); }
    });

  cloud.command('sync').description('Upload local records to Feishu')
    .action(async () => {
      const s = loadSecrets(); if (!s?.app_id) { console.log('Run cloud setup first'); return; }
      const state = new SyncState(); console.log('Last sync: ' + (state.getLastSyncTime() || 'never'));
      if (!existsSync(STATS)) { console.log('No stats.json found. Run snapshot first.'); return; }
      const stats = JSON.parse(readFileSync(STATS, 'utf-8'));
      const modules = ['writing', 'reading', 'listening', 'speaking', 'vocab'];
      const locals = modules.filter(m => stats[m]).map(m => ({ localId: m + ':' + stats.lastSnapshot, hash: m + ':' + JSON.stringify(stats[m]) }));
      const diff = state.computeDiff(locals);
      console.log(diff.toCreate.length + ' to create, ' + diff.toUpdate.length + ' to update, ' + diff.unchanged.length + ' unchanged');
      let failed = false;
      if (s.app_token && s.app_secret) {
        try {
          const auth = new FeishuAuth(s.app_id, s.app_secret);
          const client = new FeishuClient(auth, s.app_token, s.table_id ?? '');
          for (const item of diff.toCreate) {
            try { const rid = await client.createRecord({ module: item.localId.split(':')[0], note: 'synced' }); state.set(item.localId, item.hash, rid); console.log('  Created: ' + item.localId); }
            catch (e: any) { console.log('  Failed: ' + item.localId + ' - ' + e.message); failed = true; }
          }
          for (const item of diff.toUpdate) {
            try { await client.updateRecord(item.remoteId, { module: item.localId.split(':')[0], note: 'updated' }); state.set(item.localId, item.hash, item.remoteId); console.log('  Updated: ' + item.localId); }
            catch (e: any) { console.log('  Failed: ' + item.localId + ' - ' + e.message); failed = true; }
          }
          console.log(failed ? 'Sync completed with errors.' : 'Sync complete.');
      if (failed) process.exitCode = 1;
        } catch (e: any) { console.log('Sync failed: ' + e.message); }
      }
    });

  cloud.command('status').description('Show sync state')
    .action(() => {
      const s = loadSecrets(); console.log('Feishu: ' + (s?.app_id ? 'configured' : 'not configured'));
      const state = new SyncState(); console.log('Last sync: ' + (state.getLastSyncTime() || 'never'));
      const st = state.getStats(); console.log('Synced: ' + st.synced + '/' + st.total + ' records');
    });
}
