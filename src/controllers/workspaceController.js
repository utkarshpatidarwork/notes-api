//workspaceController.js
const asyncHandler =
  require("express-async-handler");

const Workspace =
  require("../models/workspaceModel");

// Create Workspace
const createWorkspace =
  asyncHandler(async (
    req,
    res
  ) => {

    const { name } = req.body;

    const inviteCode =
        Math.random()
            .toString(36)
            .substring(2, 8);

    const workspace =
      await Workspace.create({

        name,

        inviteCode,

        owner: req.user._id,

        members: [req.user._id]
      });

    res.status(201).json(
      workspace
    );
  });

// Get User Workspaces
const getWorkspaces =
  asyncHandler(async (
    req,
    res
  ) => {

    const workspaces =
      await Workspace.find({

        members: req.user._id
      });

    res.status(200).json(
      workspaces
    );
  });

// Join Workspace
const joinWorkspace =
  asyncHandler(async (
    req,
    res
  ) => {

    const { inviteCode } =
      req.body;

    const workspace =
      await Workspace.findOne({
        inviteCode
      });

    if (!workspace) {

      res.status(404);

      throw new Error(
        "Workspace not found"
      );
    }

    if (
      !workspace.members.includes(
        req.user._id
      )
    ) {

      workspace.members.push(
        req.user._id
      );

      await workspace.save();
    }

    res.status(200).json(
      workspace
    );
  });

module.exports = {
  createWorkspace,
  getWorkspaces,
  joinWorkspace
};