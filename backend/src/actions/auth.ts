import { v4 as uuidv4 } from "uuid";
import user from "./user.js";

const cookieName: string = "token";

const cookie = (req: import("express").Request): object | null => req.signedCookies[cookieName];

const isLogged = (req: import("express").Request, res: import("express").Response): boolean => {
	const data = cookie(req);
	return !!data;
};

const loggin = async (username: string): Promise<{ cookieContent: { userId: number; username: string; uuid: string } }> => {
	return new Promise((resolve, reject) => {
		try {
			const uuid = uuidv4();
			const userId = user.create(username, uuid);
			resolve({ cookieContent: { userId, username, uuid } });
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

export default { loggin, isLogged, cookie, cookieName };
