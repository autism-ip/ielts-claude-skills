import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
<<<<<<< HEAD
import { FeishuAuth, FeishuClient, getTableDefs, SyncState } from '@ielts/cloud';
=======
import { FeishuAuth, FeishuClient, FeishuTableManager, getTableDefs, SyncState } from '@ielts/cloud';
>>>>>>> origin/main
const BASE = join(homedir(), '.ielts');
const SECRETS = join(BASE, 'secrets.json');
const STATS = join(BASE, 'stats.json');
function loadSecrets() {
    if (!existsSync(SECRETS))
        return null;
    try {
        return JSON.parse(readFileSync(SECRETS, 'utf-8'));
    }
    catch {
        return null;
    }
}
export function registerCloudCommands(program) {
    const cloud = program.command('cloud').description('Feishu cloud sync');
    cloud.command('setup').description('Configure Feishu app credentials')
        .action(() => { console.log('Edit ~/.ielts/secrets.json with: {"app_id":"...","app_secret":"...","app_token":"..."}'); });
<<<<<<< HEAD
    cloud.command('doctor').description('Check Feishu configuration and table schemas')
        .action(async () => {
        const s = loadSecrets();
        if (!s) {
            console.log('No secrets.json. Run ielts cloud setup');
            return;
        }
        const okId = !!(s.app_id && typeof s.app_id === 'string');
        const okSec = !!(s.app_secret && typeof s.app_secret === 'string');
        console.log((okId && okSec ? '[PASS]' : '[FAIL]') + ' Credentials: app_id=' + (okId ? 'OK' : 'MISSING') + ' app_secret=' + (okSec ? 'OK' : 'MISSING'));
        if (!okId || !okSec)
            return;
        try {
            const a = new FeishuAuth(s.app_id, s.app_secret);
            const t = await a.getToken();
            console.log('[PASS] Auth: token ' + t.slice(0, 8) + '...');
            if (s.app_token) {
                const c = new FeishuClient(a, s.app_token, '');
                const tables = await c.listTables();
                console.log('[PASS] Base: ' + tables.length + ' tables');
                for (const def of getTableDefs()) {
                    const tb = tables.find((t) => t.name === def.name);
                    if (!tb) {
                        console.log('[WARN]  Table "' + def.name + '" missing. Run ielts cloud init-feishu');
                        continue;
                    }
                    const fields = await c.listFields(tb.table_id);
                    const miss = def.fields.filter(f => !fields.some((ff) => ff.field_name === f.field_name));
                    console.log(miss.length === 0 ? '[PASS]  ' + def.name + ': OK' : '[WARN]  ' + def.name + ': ' + miss.length + ' fields missing: ' + miss.map((f) => f.field_name).join(','));
                }
            }
            else {
                console.log('[WARN] No app_token configured');
            }
        }
        catch (e) {
            console.log('[FAIL] Error: ' + e.message);
        }
    });
=======
    cloud.command('init-feishu').description('Initialize Feishu Bitable tables and fields')
        .action(async () => {
        const s = loadSecrets();
        if (!s?.app_id || !s?.app_secret || !s?.app_token) {
            console.log('Run ielts cloud setup first');
            return;
        }
        try {
            const auth = new FeishuAuth(s.app_id, s.app_secret);
            const client = new FeishuClient(auth, s.app_token, '');
            const mgr = new FeishuTableManager(client);
            const r = await mgr.initialize();
            console.log('Created: ' + (r.created.length ? r.created.join(', ') : 'none'));
            console.log('Existing: ' + (r.existing.length ? r.existing.join(', ') : 'none'));
            if (r.fieldsAdded.length)
                console.log('Fields added: ' + r.fieldsAdded.length);
        }
        catch (e) {
            console.log('Init failed: ' + e.message);
        }
    });
    cloud.command('doctor').description('Check Feishu configuration and table schemas')
        .action(async () => {
        const s = loadSecrets();
        if (!s) {
            console.log('No secrets.json');
            return;
        }
        const ok = !!(s.app_id && typeof s.app_id === 'string') && !!(s.app_secret && typeof s.app_secret === 'string');
        console.log(ok ? '[PASS] Credentials OK' : '[FAIL] Credentials missing');
        if (!ok)
            return;
        try {
            const a = new FeishuAuth(s.app_id, s.app_secret);
            const t = await a.getToken();
            console.log('[PASS] Auth: ' + t.slice(0, 8));
            if (!s.app_token) {
                console.log('[WARN] No app_token');
                return;
            }
            const c = new FeishuClient(a, s.app_token, '');
            const tables = await c.listTables();
            console.log('[PASS] Base: ' + tables.length + ' tables');
            for (const def of getTableDefs()) {
                const tb = tables.find((t) => t.name === def.name);
                if (!tb) {
                    console.log('[WARN] Table "' + def.name + '" missing');
                    continue;
                }
                const fields = await c.listFields(tb.table_id);
                const miss = def.fields.filter(f => !fields.some((ff) => ff.field_name === f.field_name));
                console.log(miss.length === 0 ? '[PASS] ' + def.name : '[WARN] ' + def.name + ': ' + miss.length + ' fields missing');
            }
        }
        catch (e) {
            console.log('[FAIL] Error: ' + e.message);
        }
    });
>>>>>>> origin/main
    cloud.command('test').description('Verify Feishu auth')
        .action(async () => {
        const s = loadSecrets();
        if (!s?.app_id) {
            console.log('Run setup first');
            return;
        }
        try {
            const a = new FeishuAuth(s.app_id, s.app_secret);
            const t = await a.getToken();
<<<<<<< HEAD
            console.log('Auth: OK (token=' + t.slice(0, 8) + '...)');
=======
            console.log('Auth: OK (' + t.slice(0, 8) + ')');
>>>>>>> origin/main
            if (s.app_token) {
                const c = new FeishuClient(a, s.app_token, s.table_id ?? '');
                const r = await c.listRecords(1);
                console.log('Base: OK (' + r.items.length + ' records)');
            }
<<<<<<< HEAD
            else
                console.log('Base: skipped (no app_token)');
=======
>>>>>>> origin/main
        }
        catch (e) {
            console.log('Error: ' + e.message);
        }
    });
<<<<<<< HEAD
    cloud.command('sync').description('Upload local records')
        .action(async () => {
        const s = loadSecrets();
        if (!s?.app_id) {
            console.log('Run setup first');
=======
    cloud.command('sync').description('Upload local records to Feishu')
        .action(async () => {
        const s = loadSecrets();
        if (!s?.app_id) {
            console.log('Run cloud setup first');
>>>>>>> origin/main
            return;
        }
        const state = new SyncState();
        console.log('Last sync: ' + (state.getLastSyncTime() || 'never'));
        if (!existsSync(STATS)) {
<<<<<<< HEAD
            console.log('No stats.json. Run ielts snapshot.');
            return;
        }
        const stats = JSON.parse(readFileSync(STATS, 'utf-8'));
        const locals = ['writing', 'reading', 'listening', 'speaking', 'vocab'].filter(m => stats[m]).map(m => ({ localId: m + ':' + stats.lastSnapshot, hash: m + ':' + JSON.stringify(stats[m]) }));
        const diff = state.computeDiff(locals);
        console.log(diff.toCreate.length + ' to create, ' + diff.toUpdate.length + ' to update, ' + diff.unchanged.length + ' unchanged');
=======
            console.log('No stats.json found. Run snapshot first.');
            return;
        }
        const stats = JSON.parse(readFileSync(STATS, 'utf-8'));
        const modules = ['writing', 'reading', 'listening', 'speaking', 'vocab'];
        const locals = modules.filter(m => stats[m]).map(m => ({ localId: m + ':' + stats.lastSnapshot, hash: m + ':' + JSON.stringify(stats[m]) }));
        const diff = state.computeDiff(locals);
        console.log(diff.toCreate.length + ' to create, ' + diff.toUpdate.length + ' to update, ' + diff.unchanged.length + ' unchanged');
        if (s.app_token && s.app_secret) {
            try {
                const auth = new FeishuAuth(s.app_id, s.app_secret);
                const client = new FeishuClient(auth, s.app_token, s.table_id ?? '');
                for (const item of diff.toCreate) {
                    try {
                        const rid = await client.createRecord({ module: item.localId.split(':')[0], note: 'synced' });
                        state.set(item.localId, item.hash, rid);
                        console.log('  Created: ' + item.localId);
                    }
                    catch (e) {
                        console.log('  Failed: ' + item.localId + ' - ' + e.message);
                    }
                }
                console.log('Sync complete.');
            }
            catch (e) {
                console.log('Sync failed: ' + e.message);
            }
        }
>>>>>>> origin/main
    });
    cloud.command('status').description('Show sync state')
        .action(() => {
        const s = loadSecrets();
        console.log('Feishu: ' + (s?.app_id ? 'configured' : 'not configured'));
        const state = new SyncState();
        console.log('Last sync: ' + (state.getLastSyncTime() || 'never'));
        const st = state.getStats();
        console.log('Synced: ' + st.synced + '/' + st.total + ' records');
    });
}
//# sourceMappingURL=index.js.map