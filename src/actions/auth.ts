import { v4 as uuidv4 } from "uuid";
import { createUser } from "./user.js";

export const cookieName:string = "token";

export const cookie = (req: import('express').Request): object | null => req.signedCookies[cookieName];

export const isLogged = (req: import('express').Request, res: import('express').Response): boolean => {
	const data = cookie(req);
	console.log(data);
	return !!data;
};

export const loggin = async (username: string) :Promise<{ cookieContent: { userId:number, username:string, uuid:string }; }> => {
	return new Promise((resolve, reject) => {
		try {
			const uuid = uuidv4();
			const userId = createUser(username, uuid);
			resolve ({ cookieContent: { userId, username, uuid } });
		} catch (error) {
			console.error(error);
			 reject(error);
		}
	});
};
