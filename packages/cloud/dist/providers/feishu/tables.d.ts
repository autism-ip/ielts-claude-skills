/**
 * [INPUT]: 依赖 FeishuClient 的请求方法
 * [OUTPUT]: 对外提供 FeishuTableSchema 定义、FeishuTableManager（初始化/检查/创建表）
 * [POS]: packages/cloud/providers/feishu 的表结构管理，被 cloud init-feishu 命令消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { FeishuClient } from './client.js';
export interface FeishuFieldDef {
    field_name: string;
    type: number;
    property?: Record<string, any>;
}
export interface FeishuTableDef {
    name: string;
    fields: FeishuFieldDef[];
}
export declare const FIELD_TYPES: {
    readonly TEXT: 1;
    readonly NUMBER: 2;
    readonly SELECT: 3;
    readonly MULTI_SELECT: 4;
    readonly DATE: 5;
    readonly CHECKBOX: 7;
    readonly URL: 9;
    readonly PHONE: 11;
};
export declare function getTableDefs(): FeishuTableDef[];
export declare class FeishuTableManager {
    private client;
    constructor(client: FeishuClient);
    initialize(): Promise<{
        created: string[];
        existing: string[];
        fieldsAdded: string[];
    }>;
}
//# sourceMappingURL=tables.d.ts.map