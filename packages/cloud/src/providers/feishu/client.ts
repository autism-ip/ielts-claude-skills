<<<<<<< HEAD
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
<<<<<<< HEAD
<<<<<<< HEAD
              try { const j = JSON.parse(d); if (j.code === 0) resolve(j.data); else if (res.statusCode === 429) reject(new Error('Feishu 429: Rate limited')); else reject(new Error(`Feishu ${j.code}: ${j.msg}`)); }
              catch { if (res.statusCode === 429) reject(new Error('Feishu 429: Rate limited')); else reject(new Error('Invalid response')); }
=======
              try { const j = JSON.parse(d); if (j.code === 0) resolve(j.data); else reject(new Error(`Feishu ${j.code}: ${j.msg}`)); }
              catch { reject(new Error('Invalid response')); }
>>>>>>> origin/feat/gh-54-feishu-client
=======
              try { const j = JSON.parse(d); if (j.code === 0) resolve(j.data); else reject(new Error(`Feishu ${j.code}: ${j.msg}`)); }
              catch { reject(new Error('Invalid response')); }
>>>>>>> origin/feat/gh-55-feishu-mappers
            });
          }); req.on('error', reject); if (data) req.write(data); req.end();
        });
      } catch (e: any) {
<<<<<<< HEAD
<<<<<<< HEAD
        if (attempt < 2 && (e.message?.includes('Rate') || e.message?.includes('99991663') || e.message?.includes('99991664'))) { await delay(1000 * Math.pow(2, attempt)); continue; }
=======
        if (attempt < 2 && e.message?.includes('Rate')) { await delay(1000 * Math.pow(2, attempt)); continue; }
>>>>>>> origin/feat/gh-54-feishu-client
=======
        if (attempt < 2 && e.message?.includes('Rate')) { await delay(1000 * Math.pow(2, attempt)); continue; }
>>>>>>> origin/feat/gh-55-feishu-mappers
        throw e;
      }
    }
  }

<<<<<<< HEAD
<<<<<<< HEAD
  async listRecords(pageSize = 500, pageToken?: string): Promise<{ items: any[]; pageToken?: string; hasMore: boolean }> {
    let p = `tables/${this.tableId}/records?page_size=${pageSize}`;
    if (pageToken) p += `&page_token=${pageToken}`;
    const d = await this.request(p, 'GET');
    return { items: d.items || [], pageToken: d.page_token, hasMore: d.has_more || false };
=======
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
  async listRecords(pageSize = 500, pageToken?: string): Promise<{ items: any[]; hasMore: boolean }> {
    let p = `tables/${this.tableId}/records?page_size=${pageSize}`;
    if (pageToken) p += `&page_token=${pageToken}`;
    const d = await this.request(p, 'GET');
    return { items: d.items || [], hasMore: d.has_more || false };
<<<<<<< HEAD
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
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
=======
import https from 'node:https'; import { FeishuAuth } from './auth.js';
const BASE='https://open.feishu.cn/open-apis/bitable/v1/apps'; function delay(ms: number): Promise<void>{return new Promise(r=>setTimeout(r,ms));}
export class FeishuClient {
  private tks=5; private lr=Date.now();
  constructor(private auth:FeishuAuth,private appToken:string,private tableId:string){}
  private async rl():Promise<void>{const n=Date.now();this.tks=Math.min(5,this.tks+(n-this.lr)*5/1000);this.lr=n;if(this.tks<1)await delay(200);this.tks=Math.max(0,this.tks-1);}
  private async req(path:string,method:string,body?:any):Promise<any>{
    await this.rl();const token=await this.auth.getToken();const url=new URL(`${BASE}/${this.appToken}/${path}`);const data=body?JSON.stringify(body):'';
    for(let a=0;a<3;a++){try{return await new Promise((resolve,reject)=>{const r=https.request(url,{method,headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json',...(data?{'Content-Length':Buffer.byteLength(data)}:{})}},(res)=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d);if(j.code===0)resolve(j.data);else reject(new Error(`Feishu ${j.code}: ${j.msg}`))}catch{reject(new Error('Invalid response'))}})});r.on('error',reject);if(data)r.write(data);r.end();});}catch(e:any){if(a<2&&e.message?.includes('Rate')){await delay(1000*Math.pow(2,a));continue;}throw e;}}
  }
  async listRecords(ps=500,pt?:string){let p=`tables/${this.tableId}/records?page_size=${ps}`;if(pt)p+=`&page_token=${pt}`;const d=await this.req(p,'GET');return{items:d.items||[],hasMore:d.has_more||false};}
  async createRecord(fields:Record<string,any>):Promise<string>{const d=await this.req(`tables/${this.tableId}/records`,'POST',{fields});return d.record?.record_id||'';}
  async updateRecord(rid:string,fields:Record<string,any>):Promise<void>{await this.req(`tables/${this.tableId}/records/${rid}`,'PUT',{fields});}
  async batchCreate(records:{fields:Record<string,any>}[]):Promise<string[]>{const ids:string[]=[];for(let i=0;i<records.length;i+=500){const c=records.slice(i,i+500);const d=await this.req(`tables/${this.tableId}/records/batch_create`,'POST',{records:c});ids.push(...(d.records||[]).map((r:any)=>r.record_id));if(i+500<records.length)await delay(500);}return ids;}
>>>>>>> origin/feat/gh-57-cloud-cli
}
