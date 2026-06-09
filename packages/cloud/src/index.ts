export type { SyncResult, ConnectionResult } from "./provider.js";
export { FeishuAuth } from "./providers/feishu/auth.js";
export { FeishuClient } from "./providers/feishu/client.js";
export { FeishuTableManager, getTableDefs } from "./providers/feishu/tables.js";
export { mapProfile, mapWriting, mapReading, mapListening, mapVocab, mapSpeaking, mapPlan } from "./providers/feishu/mappers.js";
export { SyncState } from "./sync-state.js";
