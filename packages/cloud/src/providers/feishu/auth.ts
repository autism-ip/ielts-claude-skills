import https from 'node:https';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
=======
>>>>>>> origin/feat/gh-57-cloud-cli
const AUTH = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
export class FeishuAuth {
  private token: { value: string; expiresAt: number } | null = null;
  constructor(private appId: string, private appSecret: string) {}
  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt - 300000) return this.token.value;
    const { tenant_access_token, expire } = await this.requestToken();
<<<<<<< HEAD
    this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 };
    return this.token.value;
  }
  private requestToken(): Promise<{ tenant_access_token: string; expire: number }> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ app_id: this.appId, app_secret: this.appSecret });
      const u = new URL(AUTH);
      const r = https.request(u, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => { try { const j = JSON.parse(d); if (j.tenant_access_token) resolve(j); else reject(new Error(j.msg)); } catch { reject(new Error('invalid response')); } });
      }); r.on('error', reject); r.write(body); r.end();
    });
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======

const AUTH_URL = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';

export class FeishuAuth {
  private token: { value: string; expiresAt: number } | null = null;
  private pending: Promise<{ tenant_access_token: string; expire: number }> | null = null;

  constructor(private appId: string, private appSecret: string) {}

  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt - 300000) return this.token.value;
    if (!this.pending) {
      this.pending = this.requestToken();
    }
    try {
      const { tenant_access_token, expire } = await this.pending;
      this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 };
      return this.token.value;
    } finally {
      this.pending = null;
    }
  }

  private requestToken(): Promise<{ tenant_access_token: string; expire: number }> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ app_id: this.appId, app_secret: this.appSecret });
      const url = new URL(AUTH_URL);
      const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
        let data = '';
        res.on('data', (c) => data += c);
        res.on('end', () => {
          try { const j = JSON.parse(data); if (j.tenant_access_token) resolve(j); else reject(new Error(j.msg || 'Feishu auth failed')); }
          catch { reject(new Error('Feishu auth: invalid response')); }
        });
      });
      req.on('error', reject); req.write(body); req.end();
    });
  }

  async verify(): Promise<{ ok: boolean; message: string }> {
    try { const token = await this.getToken(); return { ok: !!token, message: 'Authenticated' }; }
    catch (e: any) { return { ok: false, message: e.message || 'Unknown error' }; }
  }
>>>>>>> origin/feat/gh-53-feishu-auth
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
=======
    this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 }; return this.token.value;
  }
  private requestToken(): Promise<{ tenant_access_token: string; expire: number }> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ app_id: this.appId, app_secret: this.appSecret }); const u = new URL(AUTH);
      const r = https.request(u,{method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},(res)=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d);if(j.tenant_access_token)resolve(j);else reject(new Error(j.msg))}catch{reject(new Error('invalid response'))}})});r.on('error',reject);r.write(body);r.end();
    });
  }
>>>>>>> origin/feat/gh-57-cloud-cli
}
