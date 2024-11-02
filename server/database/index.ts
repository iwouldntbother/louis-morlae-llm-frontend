import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db: any = null;

export function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(path.join(__dirname, '../../conversations.db'));

    // Simplified table structure
    db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        conversation_data TEXT
      )
    `);
  }
  return db;
}
