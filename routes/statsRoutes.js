const express = require("express");
const { stats } = require("../controllers/statsController");

const router = express.Router();

// GET /stats
router.get("/", stats);

module.exports = router;
