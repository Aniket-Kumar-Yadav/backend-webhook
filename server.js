const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnections");
const requestLogger = require("./middleware/requestLogger");


// 🔹 DB connect (Mongo – users/contacts ke liye)
connectDb();

const app = express();
const port = process.env.PORT || 5000;

/**
 * 🔹 IMPORTANT
 * Raw body capture for HMAC (/webhook)
 */
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // HMAC ke liye raw body
    },
  })
);
app.use(requestLogger);

/**
 * 🔹 Routes
 */
app.use("/health", require("./routes/healthRoutes"));
app.use("/metrics", require("./routes/metricsRoutes"));
app.use("/webhook", require("./routes/webhookRoutes")); // Lyftr webhook
app.use("/messages", require("./routes/messageRoutes"));
app.use("/stats", require("./routes/statsRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


/**
 * 🔹 Error Handler (ALWAYS LAST)
 */
app.use(errorHandler);

/**
 * 🔹 Server start
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
