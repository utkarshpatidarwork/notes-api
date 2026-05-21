const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

      // Get Token
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Get Full User
      req.user = await User.findById(decoded.id)
        .select("-password");

      next();

    } catch (error) {
      res.status(401).json({
        message: "Not authorized"
      });
    }

  } else {
    res.status(401).json({
      message: "No token provided"
    });
  }
};

const admin = (req, res, next) => {

  if (req.user && req.user.role === "admin") {
    next();

  } else {
    res.status(403);

    throw new Error(
      "Admin access only"
    );
  }
};

module.exports = {
  protect,
  admin
};