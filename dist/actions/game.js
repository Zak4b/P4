import { db } from "../db.js";
import { getUser } from "./user.js";
export const saveGame = (uuid1, uuid2, result, board) => {
	const id1 = getUser(uuid1);
	const id2 = getUser(uuid2);
	if (id1 & id2) {
		db.prepare("INSERT INTO GAMES (player_1, player_2, result, board) VALUES (?, ?, ?, ?)").run(id1, id2, result, board);
	} else {
		throw new Error();
	}
};
