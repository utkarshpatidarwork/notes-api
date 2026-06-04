const Workspace =
  require("../models/workspaceModel");

const checkWorkspaceRole =
  (...roles) =>
  async (
    req,
    res,
    next
  ) => {

    const workspace =
      await Workspace.findById(
        req.body.workspace
        ||
        req.query.workspace
      );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    const member =
      workspace.members.find(
        (m) =>
          m.user.toString()
          ===
          req.user._id.toString()
      );

    if (!member) {

      return res.status(403).json({
        message:
          "Not a workspace member"
      });
    }

    if (
      !roles.includes(
        member.role
      )
    ) {

      return res.status(403).json({
        message:
          "Insufficient permissions"
      });
    }

    next();
  };

module.exports = {
  checkWorkspaceRole
};