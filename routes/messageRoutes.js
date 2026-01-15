const express = require("express");
const { listMessages } = require("../controllers/messageController");

const router = express.Router();

// GET /messages
router.get("/", listMessages);

module.exports = router;
