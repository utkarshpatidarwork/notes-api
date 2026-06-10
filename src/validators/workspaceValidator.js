//workspaceValidator.js
const {
  body
} = require(
  "express-validator"
);

const createWorkspaceValidation = [

  body("name")
    .notEmpty()
    .withMessage(
      "Workspace name is required"
    )
];

const joinWorkspaceValidation = [

  body("inviteCode")
    .notEmpty()
    .withMessage(
      "Invite code is required"
    )
];

module.exports = {
  createWorkspaceValidation,
  joinWorkspaceValidation
};