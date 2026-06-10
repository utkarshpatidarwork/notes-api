//profileValidators
const {
  body
} = require(
  "express-validator"
);

const updateProfileValidation = [

  body("name")
    .notEmpty()
    .withMessage(
      "Name is required"
    ),

  body("email")
    .isEmail()
    .withMessage(
      "Valid email is required"
    )
];

const changePasswordValidation = [

  body("currentPassword")
    .notEmpty()
    .withMessage(
      "Current password is required"
    ),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage(
      "New password must be at least 6 characters"
    )
];

module.exports = {
  updateProfileValidation,
  changePasswordValidation
};