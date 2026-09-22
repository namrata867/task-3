// Middleware that protects routes by checking the JWT token
const jwt = require("jsonwebtoken");

// tokens of users who logged out are kept here so they cannot be used again
const blacklist = new Set();

function verifyToken(req, res, next) {
  const header = req.headers["authorization"];

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, please login" });
  }

  const token = header.split(" ")[1];

  if (blacklist.has(token)) {
    return res.status(401).json({ message: "Session expired, please login again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { verifyToken, blacklist };
