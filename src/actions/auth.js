import { v4 as uuidv4 } from "uuid";
import { createUser } from "./user.js";
export const cookieName = "token";
/**
 * @param {import('express').Request} req
 * @returns
 */
export const cookie = (req) => req.signedCookies[cookieName];
/**
 * @param {import('express').Request} req
 * @returns {boolean}
 */
export const isLogged = (req) => !!cookie(req);
/**
 * @param {string} username
 * @returns
 */
export const loggin = async (username) => {
	return new Promise((resolve, reject) => {
		try {
			const uuid = uuidv4();
			createUser(username, uuid);
			return resolve({ cookieContent: { username, uuid } });
		} catch (error) {
			console.error(error);
			return reject();
		}
	});
};
