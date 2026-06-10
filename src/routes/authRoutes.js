//authRoutes.js
const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");

const {
  protect
} = require("../middleware/authMiddleware");

const validate =
  require(
    "../middleware/validationMiddleware"
  );

const {
  registerValidation,
  loginValidation
} = require(
  "../validators/authValidator"
);

const {
  authLimiter
} = require(
  "../middleware/rateLimitMiddleware"
);

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validate,
  registerUser
);

router.post(
  "/login",
  authLimiter,
  loginValidation,
  validate,
  loginUser
);

// Protected Route
router.get("/profile", protect, getProfile);

module.exports = router;