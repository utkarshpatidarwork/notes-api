//workspacePermissionMiddleware.js
const Workspace =
  require("../models/workspaceModel");

const canWriteWorkspace =
  async (
    workspaceId,
    userId
  ) => {

    const workspace =
      await Workspace.findById(
        workspaceId
      );

    if (!workspace) {
      return false;
    }

    const member =
      workspace.members.find(
        (member) =>
          member.user.toString()
          ===
          userId.toString()
      );

    if (!member) {
      return false;
    }

    return (
      member.role === "owner"
      ||
      member.role === "editor"
    );
  };

module.exports = {
  canWriteWorkspace
};