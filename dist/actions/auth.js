import { v4 as uuidv4 } from "uuid";
import { createUser } from "./user.js";
export const cookieName = "token";
/**
 * @param {import('express').Request} req
 * @returns {object|null}
 */
export const cookie = (req) => req.signedCookies[cookieName];
/**
 * @param {import('express').Request} req
 * @returns {boolean}
 */
export const isLogged = (req, res) => {
	const data = cookie(req);
	console.log(data);
	return !!data;
};
/**
 * @param {string} username
 * @returns
 */
export const loggin = async (username) => {
	return new Promise((resolve, reject) => {
		try {
			const uuid = uuidv4();
			const userId = createUser(username, uuid);
			return resolve({ cookieContent: { userId, username, uuid } });
		} catch (error) {
			console.error(error);
			return reject();
		}
	});
};
