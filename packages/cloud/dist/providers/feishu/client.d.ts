import { FeishuAuth } from './auth.js';
export declare class FeishuClient {
    private auth;
    private appToken;
    private tableId;
    private tks;
    private lr;
    constructor(auth: FeishuAuth, appToken: string, tableId: string);
    private rl;
    private req;
    listRecords(ps?: number, pt?: string): Promise<{
        items: any;
        hasMore: any;
    }>;
    createRecord(fields: Record<string, any>): Promise<string>;
    updateRecord(rid: string, fields: Record<string, any>): Promise<void>;
    batchCreate(records: {
        fields: Record<string, any>;
    }[]): Promise<string[]>;
}
//# sourceMappingURL=client.d.ts.map