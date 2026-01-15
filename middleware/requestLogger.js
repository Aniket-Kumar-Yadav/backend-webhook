const { v4: uuidv4 } = require("uuid");
const {
  recordHttpRequest,
  recordWebhookResult,
} = require("../metrics/metrics");

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();

  req.requestId = requestId;

  res.on("finish", () => {
    const latency = Date.now() - start;

    // 🔹 Metrics increment
    recordHttpRequest(req.originalUrl, res.statusCode);

    if (req.originalUrl.startsWith("/webhook") && res.locals?.result) {
      recordWebhookResult(res.locals.result);
    }

    // 🔹 Structured JSON log
    const log = {
      ts: new Date().toISOString(),
      level: res.statusCode >= 500 ? "ERROR" : "INFO",
      request_id: requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      latency_ms: latency,
    };

    // 🔹 Webhook specific fields
    if (req.originalUrl.startsWith("/webhook")) {
      log.message_id = req.body?.message_id || null;
      log.dup = res.locals?.dup ?? false;
      log.result = res.locals?.result || null;
    }

    console.log(JSON.stringify(log));
  });

  next();
};

module.exports = requestLogger;
