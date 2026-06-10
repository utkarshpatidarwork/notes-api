//workspaceValidator.js
const { body } = require("express-validator");

const createWorkspaceValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Workspace name is required")
    .isLength({
      min: 3,
      max: 100
    })
    .withMessage(
      "Workspace name must be between 3 and 100 characters"
    )
];

const joinWorkspaceValidation = [
  body("inviteCode")
    .trim()
    .notEmpty()
    .withMessage("Invite code is required")
    .isLength({
      min: 6,
      max: 6
    })
    .withMessage(
      "Invite code must be 6 characters"
    )
];

module.exports = {
  createWorkspaceValidation,
  joinWorkspaceValidation
};