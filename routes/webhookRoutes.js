const express = require("express");
const { handleWebhook } = require("../controllers/webhookController");
const hmacValidator = require("../middleware/hmacValidator");

const router = express.Router();

router.post("/", hmacValidator, handleWebhook);

module.exports = router;
