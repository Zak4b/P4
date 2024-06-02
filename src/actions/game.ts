import { db } from "../db.js";
import { getUser } from "./user.js";

export const saveGame = (uuid1: string, uuid2: string, result: 0 | 1 | 2, board: any) => {
	const id1 = getUser(uuid1);
	const id2 = getUser(uuid2);
	if (id1 & id2) {
		db.prepare("INSERT INTO GAMES (player_1, player_2, result, board, time) VALUES (?, ?, ?, ?)").run(id1, id2, result, board, new Date().getTime());
	}else{
        throw new Error()
    }
};
