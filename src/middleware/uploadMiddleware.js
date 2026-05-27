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

    params: async (req, file) => {

      const isImage =
        file.mimetype.startsWith(
          "image"
        );

      return {

        folder: "notes-app",

        resource_type:
          isImage
            ? "image"
            : "raw"
      };
    }
  });

const upload = multer({
  storage
});

module.exports = upload;