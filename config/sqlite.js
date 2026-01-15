const Database = require("better-sqlite3");
const path = require("path");

// DB file location (env se bhi le sakte ho)
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, "../data/app.db");

// Open or create database
const db = new Database(dbPath);

// Create table if not exists (Lyftr schema)
db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    message_id TEXT PRIMARY KEY,
    from_msisdn TEXT NOT NULL,
    to_msisdn TEXT NOT NULL,
    ts TEXT NOT NULL,
    text TEXT,
    created_at TEXT NOT NULL
  )
`).run();

module.exports = db;
