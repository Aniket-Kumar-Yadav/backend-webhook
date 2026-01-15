const crypto = require("crypto");

const hmacValidator = (req, res, next) => {
  const secret = process.env.WEBHOOK_SECRET;

  // 1️⃣ Secret missing → service ready nahi
  if (!secret) {
    return res.status(503).json({
      detail: "WEBHOOK_SECRET not configured",
    });
  }

  // 2️⃣ Signature header check
  const signature = req.header("X-Signature");
  if (!signature) {
    return res.status(401).json({
      detail: "invalid signature",
    });
  }

  // 3️⃣ Raw body se HMAC compute
  const rawBody = req.rawBody;
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // 4️⃣ Compare signatures
  if (computedSignature !== signature) {
    return res.status(401).json({
      detail: "invalid signature",
    });
  }

  // 5️⃣ Signature valid → allow request
  next();
};

module.exports = hmacValidator;
