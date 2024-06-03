import { db } from "../db.js";
const create = (name, uuid = null) => {
    const res = db.prepare("INSERT INTO USERS (name) VALUES (?)").run(name);
    const userid = res.lastInsertRowid;
    if (userid && uuid) {
        db.prepare("INSERT INTO TOKEN (userid, uuid) VALUES (?, ?)").run(userid, uuid);
    }
    return userid;
};
const get = (uuid) => {
    const row = db.prepare("SELECT userid FROM TOKEN INNER JOIN USERS on TOKEN.userid = USERS.id WHERE token.uuid = ?").get(uuid);
    if (row?.userid) {
        return row.userid;
    }
    else {
        throw new Error();
    }
};
const merge = (id1, id2) => {
    db.prepare("UPDATE TOKEN SET userid = ? WHERE userid = ?").run(id1, id2);
    db.prepare("UPDATE GAMES SET player_1 = ? WHERE player_1 = ?").run(id1, id2);
    db.prepare("UPDATE GAMES SET player_2 = ? WHERE player_2 = ?").run(id1, id2);
    db.prepare("DELETE FROM USERS WHERE id = ?").run(id2);
};
export default { create, get, merge };
