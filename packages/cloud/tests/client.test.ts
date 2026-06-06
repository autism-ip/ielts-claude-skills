import { describe, it, expect } from 'vitest';
import { FeishuClient } from '../src/providers/feishu/client.js';
import { FeishuAuth } from '../src/providers/feishu/auth.js';

describe('FeishuClient', () => {
  it('listRecords throws on bad credentials', async () => {
    const auth = new FeishuAuth('id', 'secret');
    (auth as any).requestToken = async () => ({ tenant_access_token: 't', expire: 7200 });
    const c = new FeishuClient(auth, 'bad-app', 'bad-table');
    await expect(c.listRecords()).rejects.toThrow();
  });

  it('constructs with required params', () => {
    const a = new FeishuAuth('id', 's');
    const c = new FeishuClient(a, 'tok', 'tid');
    expect(c).toBeInstanceOf(FeishuClient);
  });
});
