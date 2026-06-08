import https from 'node:https';
const AUTH = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
export class FeishuAuth {
    appId;
    appSecret;
    token = null;
    pending = null;
    constructor(appId, appSecret) {
        this.appId = appId;
        this.appSecret = appSecret;
    }
    async getToken() {
        if (this.token && Date.now() < this.token.expiresAt - 300000)
            return this.token.value;
        if (this.pending)
            return (await this.pending).tenant_access_token;
        this.pending = this.requestToken();
        try {
            const r = await this.pending;
            this.token = { value: r.tenant_access_token, expiresAt: Date.now() + r.expire * 1000 };
            return r.tenant_access_token;
        }
        finally {
            this.pending = null;
        }
    }
    requestToken() {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify({ app_id: this.appId, app_secret: this.appSecret });
            const u = new URL(AUTH);
            const r = https.request(u, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try {
                const j = JSON.parse(d);
                if (j.tenant_access_token)
                    resolve(j);
                else
                    reject(new Error(j.msg));
            }
            catch {
                reject(new Error('invalid response'));
            } }); });
            r.on('error', reject);
            r.write(body);
            r.end();
        });
    }
    async verify() {
        try {
            const t = await this.getToken();
            return { ok:  };
            !t, message;
            "OK";
        }
        finally { }
        ;
    }
    catch(e) { return { ok: false, message: e.message || "Unknown error" }; }
}
//# sourceMappingURL=auth.js.map