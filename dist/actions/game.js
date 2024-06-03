import { db } from "../db.js";
import user from "./user.js";
const save = (uuid1, uuid2, result, board) => {
    const id1 = user.get(uuid1);
    const id2 = user.get(uuid2);
    if (id1 & id2) {
        db.prepare("INSERT INTO GAMES (player_1, player_2, result, board, time) VALUES (?, ?, ?, ?, ?)").run(id1, id2, result, board, new Date().getTime());
    }
    else {
        throw new Error();
    }
};
const playerScore = () => {
    const row = db
        .prepare(`SELECT p,e,count(*) 
		FROM 
			(
				SELECT id, player_1 as p, player_2 as e
				FROM GAMES
				WHERE result = 1
				UNION 
				SELECT id, player_2 as p, player_1 as e
				FROM GAMES
				WHERE result = 2
			)
		GROUP by p`)
        .get();
    return row;
};
const history = (limit, startFrom) => {
    const row = db.prepare(`SELECT * FROM GAMES ${startFrom ? `WHERE id < ${startFrom}` : ""} ORDER BY id DESC ${limit ? `LIMIT ${limit}` : ""}`).get();
    return row;
};
export default { save, playerScore, history };
