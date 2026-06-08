export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
    private pending;
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    private requestToken;
    verify(): Promise<{
        ok: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=auth.d.ts.map