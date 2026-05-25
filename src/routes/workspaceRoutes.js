const express =
  require("express");

const router =
  express.Router();

const {
  createWorkspace,
  getWorkspaces,
  joinWorkspace
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

router.post(
  "/join",
  protect,
  joinWorkspace
);

module.exports = router;