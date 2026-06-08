export declare class FeishuAuth {
    private appId;
    private appSecret;
    private token;
    private pending;
    constructor(appId: string, appSecret: string);
    getToken(): Promise<string>;
<<<<<<< HEAD
    verify(): Promise<{
        ok: boolean;
        message: string;
    }>;
=======
>>>>>>> 52e6d5a32c86d1e584bce03b444aeaa61adca72e
    private requestToken;
}
//# sourceMappingURL=auth.d.ts.map