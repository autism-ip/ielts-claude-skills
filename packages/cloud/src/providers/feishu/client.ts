import https from 'node:https';
import { FeishuAuth } from './auth.js';

const BASE = 'https://open.feishu.cn/open-apis/bitable/v1/apps';

function delay(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }

export class FeishuClient {
  private tokens = 5; private lastRefill = Date.now();

  constructor(private auth: FeishuAuth, private appToken: string, private tableId: string) {}

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    this.tokens = Math.min(5, this.tokens + (now - this.lastRefill) * 5 / 1000);
    this.lastRefill = now;
    if (this.tokens < 1) await delay(200);
    this.tokens = Math.max(0, this.tokens - 1);
  }

  private async request(path: string, method: string, body?: any): Promise<any> {
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
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => {
              try {
                const j = JSON.parse(d);
                if (j.code === 0) resolve(j.data);
                else if (res.statusCode === 429 || j.code === 99991663 || j.code === 99991664) reject(new Error('Rate limited'));
                else reject(new Error(`Feishu ${j.code}: ${j.msg}`));
              } catch { reject(new Error('Invalid response')); }
            });
          }); req.on('error', reject); if (data) req.write(data); req.end();
        });
      } catch (e: any) {
        if (attempt < 2 && (e.message?.includes('Rate') || e.message?.includes('99991663') || e.message?.includes('99991664'))) { await delay(1000 * Math.pow(2, attempt)); continue; }
        throw e;
      }
    }
  }

  async listRecords(pageSize = 500, pageToken?: string): Promise<{ items: any[]; pageToken?: string; hasMore: boolean }> {
    let p = `tables/${this.tableId}/records?page_size=${pageSize}`;
    if (pageToken) p += `&page_token=${pageToken}`;
    const d = await this.request(p, 'GET');
    return { items: d.items || [], pageToken: d.page_token, hasMore: d.has_more || false };
  }

  async createRecord(fields: Record<string, any>): Promise<string> {
    const d = await this.request(`tables/${this.tableId}/records`, 'POST', { fields });
    return d.record?.record_id || '';
  }

  async updateRecord(recordId: string, fields: Record<string, any>): Promise<void> {
    await this.request(`tables/${this.tableId}/records/${recordId}`, 'PUT', { fields });
  }

  async batchCreate(records: { fields: Record<string, any> }[]): Promise<string[]> {
    const ids: string[] = [];
    for (let i = 0; i < records.length; i += 500) {
      const chunk = records.slice(i, i + 500);
      const d = await this.request(`tables/${this.tableId}/records/batch_create`, 'POST', { records: chunk });
      ids.push(...(d.records || []).map((r: any) => r.record_id));
      if (i + 500 < records.length) await delay(500);
    }
    return ids;
  }

  async listTables(): Promise<any[]> {
    const d = await this.request('tables', 'GET');
    return d.items || [];
  }

  async createTable(name: string): Promise<string> {
    const d = await this.request('tables', 'POST', { table: { name, fields: [{ field_name: 'Name', type: 1 }] } });
    return d?.table_id || '';
  }

  async listFields(tableId: string): Promise<any[]> {
    const d = await this.request(`tables/${tableId}/fields`, 'GET');
    return d.items || [];
  }

  async createField(tableId: string, def: { field_name: string; type: number; property?: Record<string, any> }): Promise<void> {
    await this.request(`tables/${tableId}/fields`, 'POST', def);
  }
}
