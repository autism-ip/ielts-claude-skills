import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { FeishuAuth, FeishuClient, FeishuTableManager, SyncState } from '@ielts/cloud';
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
    cloud.command('setup')
        .description('Configure Feishu app credentials')
        .action(() => {
        console.log('Edit ~/.ielts/secrets.json with:');
        console.log('{"app_id": "...", "app_secret": "...", "app_token": "..."}');
    });
    cloud.command('init-feishu')
        .description('Initialize Feishu Bitable tables and fields')
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
            console.log(`Created: ${r.created.length ? r.created.join(', ') : 'none'}`);
            console.log(`Existing: ${r.existing.length ? r.existing.join(', ') : 'none'}`);
            if (r.fieldsAdded.length)
                console.log(`Fields added: ${r.fieldsAdded.length}`);
            console.log('Done.');
        }
        catch (e) {
            console.log(`Init failed: ${e.message}`);
        }
    });
    cloud.command('test')
        .description('Verify Feishu auth and base access')
        .action(async () => {
        const s = loadSecrets();
        if (!s?.app_id) {
            console.log('Run ielts cloud setup first');
            return;
        }
        try {
            const auth = new FeishuAuth(s.app_id, s.app_secret);
            const t = await auth.getToken();
            console.log(`Auth: OK (token=${t.slice(0, 8)}...)`);
            if (s.app_token) {
                const client = new FeishuClient(auth, s.app_token, s.table_id ?? '');
                const r = await client.listRecords(1);
                console.log(`Base: OK (${r.items.length} records)`);
            }
            else {
                console.log('Base: not tested (no app_token)');
            }
        }
        catch (e) {
            console.log(`Error: ${e.message}`);
        }
    });
    cloud.command('sync')
        .description('Upload local records to Feishu')
        .action(async () => {
        const s = loadSecrets();
        if (!s?.app_id) {
            console.log('Run ielts cloud setup first');
            return;
        }
        const state = new SyncState();
        console.log(`Last sync: ${state.getLastSyncTime() || 'never'}`);
        if (!existsSync(STATS)) {
            console.log('No stats.json found. Run ielts snapshot first.');
            return;
        }
        const stats = JSON.parse(readFileSync(STATS, 'utf-8'));
        const modules = ['writing', 'reading', 'listening', 'speaking', 'vocab'];
        const locals = modules.filter(m => stats[m]).map(m => ({
            localId: `${m}:${stats.lastSnapshot}`,
            hash: `${m}:${JSON.stringify(stats[m])}`,
        }));
        const diff = state.computeDiff(locals);
        console.log(`${diff.toCreate.length} to create, ${diff.toUpdate.length} to update, ${diff.unchanged.length} unchanged`);
    });
    cloud.command('status')
        .description('Show sync state')
        .action(() => {
        const s = loadSecrets();
        console.log(`Feishu: ${s?.app_id ? 'configured' : 'not configured'}`);
        const state = new SyncState();
        console.log(`Last sync: ${state.getLastSyncTime() || 'never'}`);
        const st = state.getStats();
        console.log(`Synced: ${st.synced}/${st.total} records`);
    });
}
//# sourceMappingURL=index.js.map