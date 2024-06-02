import { db } from "../db.js";

export const createUser = (name: string, uuid: string | null = null): number => {
	const res = db.prepare("INSERT INTO USERS (name) VALUES (?)").run(name);
	const userid = res.lastInsertRowid as number;
	if (userid && uuid) {
		db.prepare("INSERT INTO TOKEN (userid, uuid) VALUES (?, ?)").run(userid, uuid);
	}
	return userid;
};

export const getUser = (uuid: string): number => {
	const row = db.prepare("SELECT userid FROM TOKEN INNER JOIN USERS on TOKEN.userid = USERS.id WHERE token.uuid = ?").get(uuid) as {userid?:number};
	if(row?.userid){
		return row.userid;
	}else{
		throw new Error()
	}

};

export const deleteUser = () => {
	//
};

export const mergeUser = (id1: number, id2: number) => {
	db.prepare("UPDATE TOKEN SET userid = ? WHERE userid = ?").run(id1,id2);
	db.prepare("UPDATE GAMES SET player_1 = ? WHERE player_1 = ?").run(id1,id2);
	db.prepare("UPDATE GAMES SET player_2 = ? WHERE player_2 = ?").run(id1,id2);
	db.prepare("DELETE FROM USERS WHERE id = ?").run(id2);
};
