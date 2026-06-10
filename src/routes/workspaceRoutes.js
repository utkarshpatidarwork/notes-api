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
  leaveWorkspace,
  deleteWorkspace
} = require(
  "../controllers/workspaceController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const validate = require(
  "../middleware/validationMiddleware"
);

const {
  createWorkspaceValidation,
  joinWorkspaceValidation
} = require(
  "../validators/workspaceValidator"
);

router
  .route("/")
  .post(
    protect,
    createWorkspaceValidation,
    validate,
    createWorkspace
  )
  .get(
    protect,
    getWorkspaces
  );

router.post(
  "/join",
  protect,
  joinWorkspaceValidation,
  validate,
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

router.delete(
  "/:id",
  protect,
  deleteWorkspace
);

module.exports = router;