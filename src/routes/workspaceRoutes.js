//workspaceRoutes.js
const express =
  require("express");

const router =
  express.Router();

const {
  createWorkspace,
  getWorkspaces,
  joinWorkspace,
  changeMemberRole,
  removeMember,
  getWorkspaceMembers,
  leaveWorkspace
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

router.get(
  "/:id/members",
  protect,
  getWorkspaceMembers
);

router.put(
  "/role",
  protect,
  changeMemberRole
);

router.delete(
  "/member",
  protect,
  removeMember
);

router.post(
  "/leave",
  protect,
  leaveWorkspace
);

module.exports = router;