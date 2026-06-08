import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FeishuAuth, FeishuClient, getTableDefs, SyncState } from '@ielts/cloud';
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
        .action(() => { console.log('Edit ~/.ielts/secrets.json'); });
    cloud.command('doctor').description('Check Feishu configuration')
        .action(async () => {
        const s = loadSecrets();
        if (!s) {
            console.log('No config');
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
            console.log('[FAIL] ' + e.message);
        }
    });
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
            console.log('Auth: OK (' + t.slice(0, 8) + ')');
            if (s.app_token) {
                const c = new FeishuClient(a, s.app_token, s.table_id ?? '');
                const r = await c.listRecords(1);
                console.log('Base: OK (' + r.items.length + ' records)');
            }
        }
        catch (e) {
            console.log('Error: ' + e.message);
        }
    });
    cloud.command('pull').description('Dry-run restore from Feishu').option('--dry-run', 'Preview restore')
        .action(async (opts) => {
        const s = loadSecrets();
        if (!s?.app_id || !s?.app_token) {
            console.log('Run setup first');
            return;
        }
        try {
            const a = new FeishuAuth(s.app_id, s.app_secret);
            const c = new FeishuClient(a, s.app_token, '');
            const tables = await c.listTables();
            const expected = ['Writing', 'Reading', 'Listening', 'Vocab', 'Speaking', 'Plans'];
            console.log('Feishu pull dry-run' + (opts.dryRun ? ' (preview)' : ''));
            for (const tname of expected) {
                const tb = tables.find((t) => t.name === tname);
                if (!tb) {
                    console.log('  ' + tname + ': not found');
                    continue;
                }
                const r = await c.listRecords(1);
                console.log('  ' + tname + ': ' + r.items.length + ' records');
            }
            console.log('Dry-run complete. No local files modified.');
        }
        catch (e) {
            console.log('Error: ' + e.message);
        }
    });
    cloud.command('sync').description('Upload local records')
        .action(async () => {
        const s = loadSecrets();
        if (!s?.app_id) {
            console.log('Run setup first');
            return;
        }
        const state = new SyncState();
        console.log('Last sync: ' + (state.getLastSyncTime() || 'never'));
        if (!existsSync(STATS)) {
            console.log('No stats.json');
            return;
        }
        const stats = JSON.parse(readFileSync(STATS, 'utf-8'));
        const locals = ['writing', 'reading', 'listening', 'speaking', 'vocab'].filter(m => stats[m]).map(m => ({ localId: m + ':' + stats.lastSnapshot, hash: m + ':' + JSON.stringify(stats[m]) }));
        const diff = state.computeDiff(locals);
        console.log(diff.toCreate.length + ' to create, ' + diff.toUpdate.length + ' to update, ' + diff.unchanged.length + ' unchanged');
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