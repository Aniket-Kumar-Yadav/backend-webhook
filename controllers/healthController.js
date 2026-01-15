const asyncHandler = require("express-async-handler");
const db = require("../config/sqlite");

/**
 * @desc Liveness probe
 * @route GET /health/live
 */
const live = asyncHandler(async (req, res) => {
  res.status(200).json({ status: "live" });
});

/**
 * @desc Readiness probe
 * @route GET /health/ready
 */
const ready = asyncHandler(async (req, res) => {
  // 1️⃣ WEBHOOK_SECRET check
  if (!process.env.WEBHOOK_SECRET) {
    return res.status(503).json({ status: "not ready" });
  }

  // 2️⃣ SQLite DB check
  try {
    db.prepare("SELECT 1").get();
  } catch (err) {
    return res.status(503).json({ status: "not ready" });
  }

  res.status(200).json({ status: "ready" });
});

module.exports = { live, ready };
