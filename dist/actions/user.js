import { db } from "../db.js";
/**
 * @param {string} name
 * @param {string} uuid
 * @returns {number | null}
 */
export const createUser = (name, uuid = null) => {
	const res = db.prepare("INSERT INTO USERS (name) VALUES (?)").run(name);
	const userid = res.lastInsertRowid;
	if (userid && uuid) {
		db.prepare("INSERT INTO TOKEN (userid, uuid) VALUES (?, ?)").run(userid, uuid);
	}
	return userid;
};
/**
 * @param {string} uuid
 * @returns
 */
export const getUser = (uuid) => {
	const row = db.prepare("SELECT userid FROM TOKEN INNER JOIN USERS on TOKEN.userid = USERS.id WHERE token.uuid = ?").get(uuid);
	return row?.userid;
};

export const deleteUser = () => {
	//
};

export const mergeUser = (uuid1, uuid2) => {
	//
};
