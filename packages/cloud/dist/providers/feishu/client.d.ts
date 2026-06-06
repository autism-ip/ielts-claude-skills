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
        hasMore: boolean;
    }>;
    createRecord(fields: Record<string, any>): Promise<string>;
    updateRecord(recordId: string, fields: Record<string, any>): Promise<void>;
    batchCreate(records: {
        fields: Record<string, any>;
    }[]): Promise<string[]>;
}
//# sourceMappingURL=client.d.ts.map