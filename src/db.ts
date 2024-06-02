import Database, { Database as DatabaseType } from 'better-sqlite3';
export const db: DatabaseType = new Database("users.db");
