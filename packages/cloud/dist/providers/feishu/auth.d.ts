export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
    private pending;
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    verify(): Promise<{
        ok: boolean;
        message: string;
    }>;
    private requestToken;
}
//# sourceMappingURL=auth.d.ts.map