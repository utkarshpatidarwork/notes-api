//uploadRoutes.js
const express = require("express");

const multer = require("multer");

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
  (req, res, next) => {

    upload.single("file")(
      req,
      res,
      function (err) {

        if (
          err instanceof multer.MulterError
        ) {

          return res.status(400).json({
            message:
              "File exceeds maximum size of 5MB"
          });
        }

        if (err) {

          return res.status(400).json({
            message: err.message
          });
        }

        next();
      }
    );
  },

  (req, res) => {

    if (!req.file) {

      return res.status(400).json({
        message:
          "No file uploaded"
      });
    }

    res.status(200).json({
      message:
        "File uploaded successfully",

      fileUrl:
        req.file.path
    });
  }
);

module.exports = router;