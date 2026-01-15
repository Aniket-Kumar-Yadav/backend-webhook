const express = require("express");
const { renderMetrics } = require("../metrics/metrics");

const router = express.Router();

router.get("/", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.status(200).send(renderMetrics());
});

module.exports = router;   // ✅ MUST
