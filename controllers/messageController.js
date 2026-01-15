const asyncHandler = require("express-async-handler");
const { getMessages } = require("../models/messageModel");

/**
 * @desc Get messages with pagination & filters
 * @route GET /messages
 * @access public
 */
const listMessages = asyncHandler(async (req, res) => {
  let { limit = 50, offset = 0, from, since, q } = req.query;

  // Convert to numbers
  limit = Math.min(Math.max(parseInt(limit), 1), 100);
  offset = Math.max(parseInt(offset), 0);

  const result = getMessages({
    limit,
    offset,
    from,
    since,
    q,
  });

  res.status(200).json({
    data: result.data,
    total: result.total,
    limit,
    offset,
  });
});

module.exports = { listMessages };
