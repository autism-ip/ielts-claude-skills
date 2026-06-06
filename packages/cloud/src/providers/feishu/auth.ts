import https from 'node:https';

const AUTH_URL = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';

export class FeishuAuth {
  private token: { value: string; expiresAt: number } | null = null;

  constructor(private appId: string, private appSecret: string) {}

  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt - 300000) return this.token.value;
    const { tenant_access_token, expire } = await this.requestToken();
    this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 };
    return this.token.value;
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
}
