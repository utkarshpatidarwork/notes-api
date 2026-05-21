const express = require("express");

const {
  getUsers
} = require("../controllers/adminController");

const {
  protect,
  admin
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Route
router.get(
  "/users",
  protect,
  admin,
  getUsers
);

module.exports = router;