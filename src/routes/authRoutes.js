//authRoutes.js
const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword
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

const {
  updateProfile,
  changePassword,
  deleteAccount
} = require(
  "../controllers/authController"
);

const {
  updateProfileValidation,
  changePasswordValidation
} = require(
  "../validators/profileValidator"
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

router.post(
  "/forgot-password",
  authLimiter,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  authLimiter,
  resetPassword
);

// Protected Route
router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  updateProfileValidation,
  validate,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePasswordValidation,
  validate,
  changePassword
);

router.delete(
  "/account",
  protect,
  deleteAccount
);

module.exports = router;