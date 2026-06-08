export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
    private pending;
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    private requestToken;
}
//# sourceMappingURL=auth.d.ts.map