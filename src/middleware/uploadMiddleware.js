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

// Allowed File Types
const allowedMimeTypes = [

  "image/png",

  "image/jpeg",

  "image/jpg",

  "image/webp",

  "application/pdf",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

// File Filter
const fileFilter = (
  req,
  file,
  cb
) => {

  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only images, PDF, and DOCX files are allowed"
      ),
      false
    );
  }
};

// Cloudinary Storage
const storage =
  new CloudinaryStorage({

    cloudinary,

    params: async (
      req,
      file
    ) => {

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

  storage,

  fileFilter,

  limits: {

    fileSize:
      10 * 1024 * 1024
  }
});

module.exports = upload;