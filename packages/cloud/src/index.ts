<<<<<<< HEAD
<<<<<<< HEAD
export type { MappedRecord, PrivacyConfig, FeishuFieldValue } from './providers/feishu/mappers.js';
export { mapProfile, mapWriting, mapReading, mapListening, mapVocab, mapSpeaking, mapPlan } from './providers/feishu/mappers.js';
=======
/**
 * [INPUT]: 依赖 node:http 发送 HTTPS 请求
 * [OUTPUT]: 对外提供 FeishuAuth 类（租户访问令牌管理）
 * [POS]: packages/cloud/providers/feishu 的认证层，被 FeishuClient 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export { FeishuAuth } from './providers/feishu/auth.js';
export type { SyncResult, ConnectionResult } from './provider.js';
>>>>>>> origin/feat/gh-53-feishu-auth
=======
export { FeishuAuth } from './providers/feishu/auth.js';
export { FeishuClient } from './providers/feishu/client.js';
export type { SyncResult, ConnectionResult } from './provider.js';
>>>>>>> origin/feat/gh-54-feishu-client
