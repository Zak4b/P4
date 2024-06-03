import { db } from "../db.js";
import user from "./user.js";

const save = (uuid1: string, uuid2: string, result: number, board: any) => {
	const id1 = user.get(uuid1);
	const id2 = user.get(uuid2);
	if (id1 & id2) {
		db.prepare("INSERT INTO GAMES (player_1, player_2, result, board, time) VALUES (?, ?, ?, ?, ?)").run(id1, id2, result, board, new Date().getTime());
	} else {
		throw new Error();
	}
};

export default { save };
