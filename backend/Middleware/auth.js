const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Extract token from cookies

  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({success: false, message: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  } catch (err) {
    res.status(401).json({ err: err, message: "Token is not present" });
  }
};

module.exports = auth;
