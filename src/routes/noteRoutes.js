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
  permanentlyDeleteNote,
  getNoteVersions,
  restoreVersion
} = require("../controllers/noteController");

const {
  protect
} = require("../middleware/authMiddleware");

const validate =
  require(
    "../middleware/validationMiddleware"
  );

const {
  createNoteValidation
} = require(
  "../validators/noteValidator"
);

const router = express.Router();

// Protected Routes
router.route("/")
  .post(
    protect,
    createNoteValidation,
    validate,
    createNote
  )
  .get(
    protect,
    getNotes
  );

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

router.get(
  "/versions/:id",
  protect,
  getNoteVersions
);

router.put(
  "/restore-version/:id",
  protect,
  restoreVersion
);

router.route("/:id")
  .get(protect, getSingleNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;