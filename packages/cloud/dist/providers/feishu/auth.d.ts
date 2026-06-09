export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
    private pending;
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
    private requestToken;
<<<<<<< HEAD
=======
    verify(): Promise<{
        ok: boolean;
        message: string;
    }>;
>>>>>>> origin/main
}
//# sourceMappingURL=auth.d.ts.map