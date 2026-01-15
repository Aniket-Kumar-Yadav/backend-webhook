const asyncHandler = require("express-async-handler");
const { getStats } = require("../models/messageModel");

/**
 * @desc Get message statistics
 * @route GET /stats
 * @access public
 */
const stats = asyncHandler(async (req, res) => {
  const result = getStats();

  res.status(200).json({
    total_messages: result.total_messages,
    senders_count: result.senders_count,
    messages_per_sender: result.messages_per_sender,
    first_message_ts: result.first_message_ts,
    last_message_ts: result.last_message_ts,
  });
});

module.exports = { stats };
