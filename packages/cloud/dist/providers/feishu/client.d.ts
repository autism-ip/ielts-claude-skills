import { FeishuAuth } from './auth.js';
export declare class FeishuClient {
    private auth;
    private appToken;
    private tableId;
    private tokens;
    private lastRefill;
    constructor(auth: FeishuAuth, appToken: string, tableId: string);
    private rateLimit;
    private request;
    listRecords(pageSize?: number, pageToken?: string): Promise<{
        items: any[];
        pageToken?: string;
        hasMore: boolean;
    }>;
    createRecord(fields: Record<string, any>): Promise<string>;
    updateRecord(recordId: string, fields: Record<string, any>): Promise<void>;
    batchCreate(records: {
        fields: Record<string, any>;
    }[]): Promise<string[]>;
    listTables(): Promise<any[]>;
    createTable(name: string): Promise<string>;
    listFields(tableId: string): Promise<any[]>;
    createField(tableId: string, def: {
        field_name: string;
        type: number;
        property?: Record<string, any>;
    }): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map