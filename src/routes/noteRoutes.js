//noteRoutes.js
const express = require("express");

const {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  getArchivedNotes,
  restoreNote,
  permanentlyDeleteNote
} = require("../controllers/noteController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Routes
router.route("/")
  .post(protect, createNote)
  .get(protect, getNotes);

router.get(
  "/trash",
  protect,
  getArchivedNotes
);

router.put(
  "/restore/:id",
  protect,
  restoreNote
);

router.delete(
  "/permanent/:id",
  protect,
  permanentlyDeleteNote
);

router.route("/:id")
  .get(protect, getSingleNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;