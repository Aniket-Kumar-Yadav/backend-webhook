const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // 🔴 FIX 1: Authorization header missing
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token missing");
  }

  const token = authHeader.split(" ")[1];

  // 🔴 FIX 2: Token verify
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }

    // 🔴 FIX 3: decoded user attach
    req.user = decoded.user;
    next();
  });
});

module.exports = validateToken;
