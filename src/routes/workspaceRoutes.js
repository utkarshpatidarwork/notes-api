const express =
  require("express");

const router =
  express.Router();

const {
  createWorkspace,
  getWorkspaces
} = require(
  "../controllers/workspaceController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router
  .route("/")
  .post(protect, createWorkspace)
  .get(protect, getWorkspaces);

module.exports = router;