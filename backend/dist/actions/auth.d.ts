declare const _default: {
    loggin: (username: string) => Promise<{
        cookieContent: {
            userId: number;
            username: string;
            uuid: string;
        };
    }>;
    isLogged: (req: import("express").Request, res: import("express").Response) => boolean;
    cookie: (req: import("express").Request) => object | null;
    cookieName: string;
};
export default _default;
