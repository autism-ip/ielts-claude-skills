export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
<<<<<<< HEAD
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    private requestToken;
=======
    private pending;
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    private requestToken;
    verify(): Promise<{
        ok: boolean;
        message: string;
    }>;
>>>>>>> origin/feat/gh-53-feishu-auth
}
//# sourceMappingURL=auth.d.ts.map