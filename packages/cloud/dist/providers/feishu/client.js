import https from 'node:https';
const BASE = 'https://open.feishu.cn/open-apis/bitable/v1/apps';
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
export class FeishuClient {
    auth;
    appToken;
    tableId;
    tks = 5;
    lr = Date.now();
    constructor(auth, appToken, tableId) {
        this.auth = auth;
        this.appToken = appToken;
        this.tableId = tableId;
    }
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
                    continue;
                }
                throw e;
            }
        }
    }
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
}
//# sourceMappingURL=client.js.map