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
        .all();
    return row;
};
const history = (limit, startFrom) => {
    const rows = db
        .prepare(`SELECT GAMES.*, u1.name as name_1, u2.name as name_2 
			FROM GAMES
			INNER JOIN USERS as u1 on player_1 = u1.id
			INNER JOIN USERS as u2 on player_2 = u2.id
			${startFrom ? `WHERE GAMES.id < ${startFrom}` : ""}
			ORDER BY GAMES.id DESC ${limit ? `LIMIT ${limit}` : ""}`)
        .all();
    rows.map((e) => {
        e.board = JSON.parse(e.board);
        return e;
    });
    return rows;
};
export default { save, playerScore, history };
