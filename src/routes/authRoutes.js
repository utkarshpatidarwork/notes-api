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

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);

router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

// Protected Route
router.get("/profile", protect, getProfile);

module.exports = router;