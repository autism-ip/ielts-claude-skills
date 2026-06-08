import { describe, it, expect } from 'vitest';
import { FeishuAuth } from '../src/providers/feishu/auth.js';

describe('FeishuAuth', () => {
  it('caches token and avoids re-request', async () => {
    let calls = 0;
    const auth = new FeishuAuth('id', 'secret');
    (auth as any).requestToken = async () => { calls++; return { tenant_access_token: 't', expire: 7200 }; };
    const t1 = await auth.getToken();
    const t2 = await auth.getToken();
    expect(t1).toBe('t');
    expect(t2).toBe('t');
    expect(calls).toBe(1);
  });

  it('verify fails silently on bad token', async () => {
    const auth = new FeishuAuth('bad', 'bad');
    (auth as any).requestToken = async () => { throw new Error('Invalid credentials'); };
    try { await auth.getToken(); expect(true).toBe(false); }
    catch (e: any) { expect(e.message).toContain('Invalid'); }
  });
});
