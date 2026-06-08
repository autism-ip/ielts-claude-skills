export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
<<<<<<< HEAD
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
=======
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    private requestToken;
>>>>>>> origin/feat/gh-54-feishu-client
}
//# sourceMappingURL=auth.d.ts.map