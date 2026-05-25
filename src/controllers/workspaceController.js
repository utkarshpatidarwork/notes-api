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

    const workspace =
      await Workspace.create({

        name,

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

module.exports = {
  createWorkspace,
  getWorkspaces
};