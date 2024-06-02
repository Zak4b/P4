export declare const cookieName: string;
export declare const cookie: (req: import('express').Request) => object | null;
export declare const isLogged: (req: import('express').Request, res: import('express').Response) => boolean;
export declare const loggin: (username: string) => Promise<{
    cookieContent: {
        userId: number;
        username: string;
        uuid: string;
    };
}>;
