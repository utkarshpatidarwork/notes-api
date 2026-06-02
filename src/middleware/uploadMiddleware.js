//uploadMiddleware.js
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

      const isPreviewable =
        file.mimetype.startsWith(
          "image"
        )
        
        ||
        
        file.mimetype.includes(
          "pdf"
        );

      return {

        folder: "notes-app",

        resource_type:
          isPreviewable
            ? "image"
            : "raw"
      };
    }
  });

const upload = multer({
  storage
});

module.exports = upload;