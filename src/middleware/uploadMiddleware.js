const multer = require("multer");

const path = require("path");

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

const allowedExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".pdf",
  ".docx"
];

// File Filter
const fileFilter = (
  req,
  file,
  cb
) => {

  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();

  const validMime =
    allowedMimeTypes.includes(
      file.mimetype
    );

  const validExtension =
    allowedExtensions.includes(
      extension
    );

  if (
    validMime &&
    validExtension
  ) {

    return cb(null, true);
  }

  cb(
    new Error(
      "Only PNG, JPG, JPEG, WEBP, PDF and DOCX files are allowed"
    ),
    false
  );
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
      5 * 1024 * 1024
  }
});

module.exports = upload;