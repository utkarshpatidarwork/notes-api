const multer = require("multer");

const {
  CloudinaryStorage
} = require(
  "multer-storage-cloudinary"
);

const cloudinary = require(
  "../config/cloudinary"
);

// Cloudinary Storage
const storage =
  new CloudinaryStorage({

    cloudinary,

    params: {
      folder: "notes-app",

      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "webp",
        "pdf",
        "txt",
        "docx"
      ]
    }
  });

const upload = multer({
  storage
});

module.exports = upload;