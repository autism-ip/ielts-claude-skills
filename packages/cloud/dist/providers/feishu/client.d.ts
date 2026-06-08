import { FeishuAuth } from './auth.js';
export declare class FeishuClient {
    private auth;
    private appToken;
    private tableId;
<<<<<<< HEAD
    private tokens;
    private lastRefill;
    constructor(auth: FeishuAuth, appToken: string, tableId: string);
    private rateLimit;
    private request;
    listRecords(pageSize?: number, pageToken?: string): Promise<{
        items: any[];
<<<<<<< HEAD
<<<<<<< HEAD
        pageToken?: string;
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
        hasMore: boolean;
    }>;
    createRecord(fields: Record<string, any>): Promise<string>;
    updateRecord(recordId: string, fields: Record<string, any>): Promise<void>;
=======
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
>>>>>>> origin/feat/gh-57-cloud-cli
    batchCreate(records: {
        fields: Record<string, any>;
    }[]): Promise<string[]>;
}
//# sourceMappingURL=client.d.ts.map