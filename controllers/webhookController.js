const asyncHandler = require("express-async-handler");
const { insertMessage } = require("../models/messageModel");

/**
 * @desc Ingest webhook message (idempotent)
 * @route POST /webhook
 * @access public (HMAC protected)
 */
const handleWebhook = asyncHandler(async (req, res) => {
  const { message_id, from, to, ts, text } = req.body;

  // 🔹 Basic validation (Lyftr style)
  if (!message_id || !from || !to || !ts) {
    res.status(422);
    throw new Error("Invalid payload");
  }

  // 🔹 Insert message (idempotent)
  const inserted = insertMessage({
    message_id,
    from,
    to,
    ts,
    text,
  });

  /**
   * 🔹 Logging helpers (STEP 8 ke liye)
   * dup = true → duplicate message
   * result = created / duplicate
   */
  res.locals.dup = !inserted;
  res.locals.result = inserted ? "created" : "duplicate";

  // 🔹 Same response for new & duplicate
  res.status(200).json({ status: "ok" });
});

module.exports = { handleWebhook };
