import https from 'node:https';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const AUTH = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
=======
const AUTH_URL = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
>>>>>>> origin/feat/gh-53-feishu-auth
=======
const AUTH = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
>>>>>>> origin/feat/gh-54-feishu-client
=======
const AUTH = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
>>>>>>> origin/feat/gh-55-feishu-mappers
export class FeishuAuth {
    appId;
    appSecret;
    token = null;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
    pending = null;
>>>>>>> origin/feat/gh-53-feishu-auth
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
    constructor(appId, appSecret) {
        this.appId = appId;
        this.appSecret = appSecret;
    }
    async getToken() {
        if (this.token && Date.now() < this.token.expiresAt - 300000)
            return this.token.value;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        const { tenant_access_token, expire } = await this.requestToken();
        this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 };
        return this.token.value;
=======
        if (!this.pending) {
            this.pending = this.requestToken();
        }
        try {
            const { tenant_access_token, expire } = await this.pending;
            this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 };
            return this.token.value;
        }
        finally {
            this.pending = null;
        }
>>>>>>> origin/feat/gh-53-feishu-auth
=======
        const { tenant_access_token, expire } = await this.requestToken();
        this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 };
        return this.token.value;
>>>>>>> origin/feat/gh-54-feishu-client
=======
        const { tenant_access_token, expire } = await this.requestToken();
        this.token = { value: tenant_access_token, expiresAt: Date.now() + expire * 1000 };
        return this.token.value;
>>>>>>> origin/feat/gh-55-feishu-mappers
    }
    requestToken() {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify({ app_id: this.appId, app_secret: this.appSecret });
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
            const u = new URL(AUTH);
            const r = https.request(u, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => { try {
                    const j = JSON.parse(d);
                    if (j.tenant_access_token)
                        resolve(j);
                    else
                        reject(new Error(j.msg));
                }
                catch {
                    reject(new Error('invalid response'));
                } });
            });
            r.on('error', reject);
            r.write(body);
            r.end();
        });
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
            const url = new URL(AUTH_URL);
            const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
                let data = '';
                res.on('data', (c) => data += c);
                res.on('end', () => {
                    try {
                        const j = JSON.parse(data);
                        if (j.tenant_access_token)
                            resolve(j);
                        else
                            reject(new Error(j.msg || 'Feishu auth failed'));
                    }
                    catch {
                        reject(new Error('Feishu auth: invalid response'));
                    }
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });
    }
    async verify() {
        try {
            const token = await this.getToken();
            return { ok: !!token, message: 'Authenticated' };
        }
        catch (e) {
            return { ok: false, message: e.message || 'Unknown error' };
        }
    }
>>>>>>> origin/feat/gh-53-feishu-auth
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
}
//# sourceMappingURL=auth.js.map