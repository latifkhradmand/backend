const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, excluding password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user.isVerified) {
        return res.status(403).json({ message: "Email not verified" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });
};
