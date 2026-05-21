const multer = require("multer");

const path = require("path");

// Storage Config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  }
});

// File Filter
const fileFilter = (req, file, cb) => {

  const fileTypes =
    /jpg|jpeg|png|webp|pdf/;

  const mimeType =
    fileTypes.test(file.mimetype);

  const extName =
    fileTypes.test(
      path.extname(file.originalname)
        .toLowerCase()
    );

  if (mimeType && extName) {
    return cb(null, true);

  } else {
    cb(
      new Error(
        "Only images and pdf files allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;