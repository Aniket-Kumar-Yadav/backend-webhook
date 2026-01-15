const db = require("../config/sqlite");

/**
 * Insert message (idempotent)
 * Agar same message_id dobara aaye → insert nahi hoga
 */
const insertMessage = (message) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO messages
    (message_id, from_msisdn, to_msisdn, ts, text, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    message.message_id,
    message.from,
    message.to,
    message.ts,
    message.text || null,
    new Date().toISOString()
  );

  // changes === 1 → new insert
  // changes === 0 → duplicate
  return result.changes === 1;
};

/**
 * Get messages with pagination + filters
 */
const getMessages = ({ limit, offset, from, since, q }) => {
  let whereClause = "WHERE 1=1";
  const params = [];

  if (from) {
    whereClause += " AND from_msisdn = ?";
    params.push(from);
  }

  if (since) {
    whereClause += " AND ts >= ?";
    params.push(since);
  }

  if (q) {
    whereClause += " AND text LIKE ?";
    params.push(`%${q}%`);
  }

  // total count (without limit/offset)
  const total = db
    .prepare(`SELECT COUNT(*) as count FROM messages ${whereClause}`)
    .get(...params).count;

  // actual data
  const data = db
    .prepare(`
      SELECT 
        message_id,
        from_msisdn AS "from",
        to_msisdn AS "to",
        ts,
        text
      FROM messages
      ${whereClause}
      ORDER BY ts ASC, message_id ASC
      LIMIT ? OFFSET ?
    `)
    .all(...params, limit, offset);

  return { total, data };
};

/**
 * Stats endpoint data
 */
const getStats = () => {
  const total_messages = db
    .prepare("SELECT COUNT(*) as count FROM messages")
    .get().count;

  const messages_per_sender = db
    .prepare(`
      SELECT from_msisdn AS "from", COUNT(*) as count
      FROM messages
      GROUP BY from_msisdn
      ORDER BY count DESC
      LIMIT 10
    `)
    .all();

  const first = db
    .prepare("SELECT ts FROM messages ORDER BY ts ASC LIMIT 1")
    .get();

  const last = db
    .prepare("SELECT ts FROM messages ORDER BY ts DESC LIMIT 1")
    .get();

  return {
    total_messages,
    senders_count: messages_per_sender.length,
    messages_per_sender,
    first_message_ts: first ? first.ts : null,
    last_message_ts: last ? last.ts : null,
  };
};

module.exports = {
  insertMessage,
  getMessages,
  getStats,
};
