import https from 'node:https';
const BASE = 'https://open.feishu.cn/open-apis/bitable/v1/apps';
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
export class FeishuClient {
    auth;
    appToken;
    tableId;
<<<<<<< HEAD
    tokens = 5;
    lastRefill = Date.now();
=======
    tks = 5;
    lr = Date.now();
>>>>>>> origin/feat/gh-57-cloud-cli
    constructor(auth, appToken, tableId) {
        this.auth = auth;
        this.appToken = appToken;
        this.tableId = tableId;
    }
<<<<<<< HEAD
    async rateLimit() {
        const now = Date.now();
        this.tokens = Math.min(5, this.tokens + (now - this.lastRefill) * 5 / 1000);
        this.lastRefill = now;
        if (this.tokens < 1)
            await delay(200);
        this.tokens = Math.max(0, this.tokens - 1);
    }
    async request(path, method, body) {
        await this.rateLimit();
        const token = await this.auth.getToken();
        const url = new URL(`${BASE}/${this.appToken}/${path}`);
        const data = body ? JSON.stringify(body) : '';
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                return await new Promise((resolve, reject) => {
                    const req = https.request(url, {
                        method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) },
                    }, (res) => {
                        let d = '';
                        res.on('data', c => d += c);
                        res.on('end', () => {
                            try {
                                const j = JSON.parse(d);
                                if (j.code === 0)
                                    resolve(j.data);
<<<<<<< HEAD
<<<<<<< HEAD
                                else if (res.statusCode === 429)
                                    reject(new Error('Feishu 429: Rate limited'));
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
                                else
                                    reject(new Error(`Feishu ${j.code}: ${j.msg}`));
                            }
                            catch {
<<<<<<< HEAD
<<<<<<< HEAD
                                if (res.statusCode === 429)
                                    reject(new Error('Feishu 429: Rate limited'));
                                else
                                    reject(new Error('Invalid response'));
=======
                                reject(new Error('Invalid response'));
>>>>>>> origin/feat/gh-54-feishu-client
=======
                                reject(new Error('Invalid response'));
>>>>>>> origin/feat/gh-55-feishu-mappers
                            }
                        });
                    });
                    req.on('error', reject);
                    if (data)
                        req.write(data);
                    req.end();
                });
            }
            catch (e) {
<<<<<<< HEAD
<<<<<<< HEAD
                if (attempt < 2 && (e.message?.includes('Rate') || e.message?.includes('99991663') || e.message?.includes('99991664'))) {
=======
                if (attempt < 2 && e.message?.includes('Rate')) {
>>>>>>> origin/feat/gh-54-feishu-client
=======
                if (attempt < 2 && e.message?.includes('Rate')) {
>>>>>>> origin/feat/gh-55-feishu-mappers
                    await delay(1000 * Math.pow(2, attempt));
=======
    async rl() { const n = Date.now(); this.tks = Math.min(5, this.tks + (n - this.lr) * 5 / 1000); this.lr = n; if (this.tks < 1)
        await delay(200); this.tks = Math.max(0, this.tks - 1); }
    async req(path, method, body) {
        await this.rl();
        const token = await this.auth.getToken();
        const url = new URL(`${BASE}/${this.appToken}/${path}`);
        const data = body ? JSON.stringify(body) : '';
        for (let a = 0; a < 3; a++) {
            try {
                return await new Promise((resolve, reject) => { const r = https.request(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } }, (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try {
                    const j = JSON.parse(d);
                    if (j.code === 0)
                        resolve(j.data);
                    else
                        reject(new Error(`Feishu ${j.code}: ${j.msg}`));
                }
                catch {
                    reject(new Error('Invalid response'));
                } }); }); r.on('error', reject); if (data)
                    r.write(data); r.end(); });
            }
            catch (e) {
                if (a < 2 && e.message?.includes('Rate')) {
                    await delay(1000 * Math.pow(2, a));
>>>>>>> origin/feat/gh-57-cloud-cli
                    continue;
                }
                throw e;
            }
        }
    }
<<<<<<< HEAD
    async listRecords(pageSize = 500, pageToken) {
        let p = `tables/${this.tableId}/records?page_size=${pageSize}`;
        if (pageToken)
            p += `&page_token=${pageToken}`;
        const d = await this.request(p, 'GET');
<<<<<<< HEAD
<<<<<<< HEAD
        return { items: d.items || [], pageToken: d.page_token, hasMore: d.has_more || false };
=======
        return { items: d.items || [], hasMore: d.has_more || false };
>>>>>>> origin/feat/gh-54-feishu-client
=======
        return { items: d.items || [], hasMore: d.has_more || false };
>>>>>>> origin/feat/gh-55-feishu-mappers
    }
    async createRecord(fields) {
        const d = await this.request(`tables/${this.tableId}/records`, 'POST', { fields });
        return d.record?.record_id || '';
    }
    async updateRecord(recordId, fields) {
        await this.request(`tables/${this.tableId}/records/${recordId}`, 'PUT', { fields });
    }
    async batchCreate(records) {
        const ids = [];
        for (let i = 0; i < records.length; i += 500) {
            const chunk = records.slice(i, i + 500);
            const d = await this.request(`tables/${this.tableId}/records/batch_create`, 'POST', { records: chunk });
            ids.push(...(d.records || []).map((r) => r.record_id));
            if (i + 500 < records.length)
                await delay(500);
        }
        return ids;
    }
=======
    async listRecords(ps = 500, pt) { let p = `tables/${this.tableId}/records?page_size=${ps}`; if (pt)
        p += `&page_token=${pt}`; const d = await this.req(p, 'GET'); return { items: d.items || [], hasMore: d.has_more || false }; }
    async createRecord(fields) { const d = await this.req(`tables/${this.tableId}/records`, 'POST', { fields }); return d.record?.record_id || ''; }
    async updateRecord(rid, fields) { await this.req(`tables/${this.tableId}/records/${rid}`, 'PUT', { fields }); }
    async batchCreate(records) { const ids = []; for (let i = 0; i < records.length; i += 500) {
        const c = records.slice(i, i + 500);
        const d = await this.req(`tables/${this.tableId}/records/batch_create`, 'POST', { records: c });
        ids.push(...(d.records || []).map((r) => r.record_id));
        if (i + 500 < records.length)
            await delay(500);
    } return ids; }
>>>>>>> origin/feat/gh-57-cloud-cli
}
//# sourceMappingURL=client.js.map