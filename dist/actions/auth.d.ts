/// <reference types="qs" />
/// <reference types="express" />
declare const _default: {
    loggin: (username: string) => Promise<{
        cookieContent: {
            userId: number;
            username: string;
            uuid: string;
        };
    }>;
    isLogged: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>) => boolean;
    cookie: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => object | null;
    cookieName: string;
};
export default _default;
