import Database from "better-sqlite3";
import fs from "node:fs";
const dbName = "users.db";
export const db = (() => {
    const dbExists = fs.existsSync(dbName);
    const database = new Database(dbName);
    if (!dbExists) {
        console.log("Creating database and tables...");
        database.exec(`CREATE TABLE "USERS" (
          "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "name"	INTEGER NOT NULL DEFAULT 'Bob'
      );
      CREATE TABLE "TOKEN" (
          "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "uuid"	TEXT NOT NULL UNIQUE,
          "userid" INTEGER NOT NULL,
          FOREIGN KEY(userid) REFERENCES USERS(id)
      );
      CREATE TABLE "GAMES" (
          "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "player_1"	INTEGER NOT NULL,
          "player_2"	INTEGER NOT NULL,
          "result"	INTEGER NOT NULL,
          "board"	TEXT NOT NULL,
          "time"	INTEGER NOT NULL,
          FOREIGN KEY("player_1") REFERENCES "USERS"("id"),
          FOREIGN KEY("player_2") REFERENCES "USERS"("id")
      );`);
        console.log("Database and tables created successfully.");
    }
    return database;
})();
