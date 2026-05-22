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

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    res.status(200).json({
      message:
        "File uploaded successfully",

      imageUrl: req.file.path
    });
  }
);

module.exports = router;