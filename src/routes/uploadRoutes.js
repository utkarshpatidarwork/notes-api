const express = require("express");

const router = express.Router();

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

// Upload Route
router.post(
  "/",
  protect,
  upload.single("file"),
  (req, res) => {

    // Check File Exists
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file.filename
    });
  }
);

module.exports = router;