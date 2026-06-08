import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const STATE = join(homedir(), '.ielts', 'sync', 'feishu.json');
export class SyncState {
    entries = new Map();
<<<<<<< HEAD
    statePath;
    constructor(statePath) { this.statePath = statePath ?? STATE; this.load(); }
    load() {
        try {
            for (const e of JSON.parse(readFileSync(this.statePath, 'utf-8')))
                this.entries.set(e.localId, e);
        }
        catch (err) {
            if (err?.code === 'ENOENT') { /* first use */ }
            else {
                console.warn('[SyncState] corrupted state file:', this.statePath);
            }
        }
    }
    saveDirPath() { return join(this.statePath, '..'); }
    save() {
        mkdirSync(this.saveDirPath(), { recursive: true });
        writeFileSync(this.statePath, JSON.stringify([...this.entries.values()], null, 2));
    }
    set(localId, hash, remoteId) {
        const ex = this.entries.get(localId);
        this.entries.set(localId, { localId, remoteId: remoteId || ex?.remoteId, hash, lastSyncedAt: new Date().toISOString() });
        this.save();
    }
    setBatch(items) { for (const i of items)
        this.set(i.localId, i.hash, i.remoteId); }
    get(localId) { return this.entries.get(localId); }
    computeDiff(locals) {
        const d = { toCreate: [], toUpdate: [], unchanged: [] };
        for (const l of locals) {
            const s = this.entries.get(l.localId);
            if (!s || !s.remoteId)
                d.toCreate.push({ localId: l.localId, hash: l.hash });
            else if (s.hash !== l.hash)
                d.toUpdate.push({ localId: l.localId, remoteId: s.remoteId, hash: l.hash });
            else
                d.unchanged.push({ localId: l.localId });
        }
        return d;
    }
    getLastSyncTime() {
        const t = [...this.entries.values()].map(e => e.lastSyncedAt).filter(Boolean);
        return t.length ? t.sort().reverse()[0] : null;
    }
=======
    constructor() { this.load(); }
    load() { try {
        for (const e of JSON.parse(readFileSync(STATE, 'utf-8')))
            this.entries.set(e.localId, e);
    }
    catch { } }
    save() { mkdirSync(join(homedir(), '.ielts', 'sync'), { recursive: true }); writeFileSync(STATE, JSON.stringify([...this.entries.values()], null, 2)); }
    set(localId, hash, remoteId) { const ex = this.entries.get(localId); this.entries.set(localId, { localId, remoteId: remoteId || ex?.remoteId, hash, lastSyncedAt: new Date().toISOString() }); this.save(); }
    setBatch(items) { for (const i of items)
        this.set(i.localId, i.hash, i.remoteId); }
    computeDiff(locals) { const d = { toCreate: [], toUpdate: [], unchanged: [] }; for (const l of locals) {
        const s = this.entries.get(l.localId);
        if (!s || !s.remoteId)
            d.toCreate.push({ localId: l.localId, hash: l.hash });
        else if (s.hash !== l.hash)
            d.toUpdate.push({ localId: l.localId, remoteId: s.remoteId, hash: l.hash });
        else
            d.unchanged.push({ localId: l.localId });
    } return d; }
    getLastSyncTime() { const t = [...this.entries.values()].map(e => e.lastSyncedAt).filter(Boolean); return t.length ? t.sort().reverse()[0] : null; }
>>>>>>> origin/feat/gh-57-cloud-cli
    getStats() { return { total: this.entries.size, synced: [...this.entries.values()].filter(e => e.remoteId).length }; }
}
//# sourceMappingURL=sync-state.js.map