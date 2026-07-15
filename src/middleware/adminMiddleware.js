exports.adminProtect = (req, res, next) => {
  // authMiddleware already attached req.user. We just check the role.
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
