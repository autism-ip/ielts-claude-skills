/**
 * [INPUT]: 依赖 node:http 发送 HTTPS 请求
 * [OUTPUT]: 对外提供 FeishuAuth 类（租户访问令牌管理）
 * [POS]: packages/cloud/providers/feishu 的认证层，被 FeishuClient 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export { FeishuAuth } from './providers/feishu/auth.js';
export type { SyncResult, ConnectionResult } from './provider.js';
//# sourceMappingURL=index.d.ts.map