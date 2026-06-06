export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    private requestToken;
}
//# sourceMappingURL=auth.d.ts.map