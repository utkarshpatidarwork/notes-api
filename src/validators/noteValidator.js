//noteValidator.js
const { body } = require("express-validator");

const noteValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({
      min: 1,
      max: 200
    })
    .withMessage(
      "Title cannot exceed 200 characters"
    ),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({
      max: 50000
    })
    .withMessage(
      "Content cannot exceed 50000 characters"
    ),

  body("category")
    .optional()
    .trim()
    .isLength({
      max: 50
    })
    .withMessage(
      "Category cannot exceed 50 characters"
    )
];

module.exports = {
  noteValidation
};