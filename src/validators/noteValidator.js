//noteValidator.js
const {
  body
} = require(
  "express-validator"
);

const createNoteValidation = [

  body("title")
    .notEmpty()
    .withMessage(
      "Title is required"
    ),

  body("content")
    .notEmpty()
    .withMessage(
      "Content is required"
    ),

  body("workspace")
    .notEmpty()
    .withMessage(
      "Workspace is required"
    )
];

module.exports = {
  createNoteValidation
};