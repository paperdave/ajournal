import { readFileSync } from 'fs';
import Database from "bun:sqlite";
import { join } from 'path';

export const db = new Database("ajournal.db");

const existing_tables = db.query('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'file\';').all();
if (existing_tables.length === 0) {
  console.log('Initializing Database');
  const sql = readFileSync(join(import.meta.dir, "schema.sql"), "utf-8");

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s);

  db.transaction(() => {
    for (const statement of statements) {
      db.run(statement);
    }
  })();
}
