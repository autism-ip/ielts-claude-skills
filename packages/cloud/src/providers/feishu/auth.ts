import https from 'node:https';
const AUTH = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
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
      const u = new URL(AUTH);
      const r = https.request(u, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => { try { const j = JSON.parse(d); if (j.tenant_access_token) resolve(j); else reject(new Error(j.msg)); } catch { reject(new Error('invalid response')); } });
      }); r.on('error', reject); r.write(body); r.end();
    });
  }
}
