const express = require("express");

const {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote
} = require("../controllers/noteController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.route("/")
  .post(protect, createNote)
  .get(protect, getNotes);

router.route("/:id")
  .get(protect, getSingleNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;