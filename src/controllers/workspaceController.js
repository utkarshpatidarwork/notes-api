//workspaceController.js
const asyncHandler = require("express-async-handler");

const Workspace = require("../models/workspaceModel");

const Note = require("../models/noteModel");

const Activity = require("../models/activityModel");

const logActivity = require("../utils/logActivity");

// Create Workspace
const createWorkspace =
  asyncHandler(async (
    req,
    res
  ) => {

    const { name } = req.body;

    let inviteCode;

    do {

      inviteCode =
        Math.random()
          .toString(36)
          .substring(2, 8);

    } while (

      await Workspace.findOne({
        inviteCode
      })

    );

    const workspace =
      await Workspace.create({

        name,

        inviteCode,

        owner: req.user._id,

        members: [
          {
            user: req.user._id,
            role: "owner"
          }
        ]
      });

    await logActivity({
      workspace:
        workspace._id,
      user:
        req.user._id,
      action:
        "WORKSPACE_CREATED",
      target:
        workspace.name
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

        "members.user":
          req.user._id
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

    const alreadyMember =
      workspace.members.some(
        (member) =>
          member.user.toString()
          ===
          req.user._id.toString()
      );

    if (alreadyMember) {

      return res.status(409).json({
        message:
          "Already a member of this workspace"
      });
    }

    workspace.members.push({
      user: req.user._id,
      role: "viewer"
    });

    await logActivity({
      workspace:
        workspace._id,
      user:
        req.user._id,
      action:
        "MEMBER_JOINED",
      target:
        workspace.name
    });

    await workspace.save();

    const io = req.app.get("io");

    io.to(workspace._id.toString())
      .emit("membersUpdated");

    io.to(workspace._id.toString())
      .emit("activityUpdated");

    res.status(200).json(
      workspace
    );
  });

// Change Member Role
const changeMemberRole =
  asyncHandler(async (
    req,
    res
  ) => {

    const {
      workspaceId,
      memberId,
      role
    } = req.body;

    const workspace =
      await Workspace.findById(
        workspaceId
      );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    const owner =
      workspace.members.find(
        (member) =>
          member.user.toString()
          ===
          req.user._id.toString()
          &&
          member.role === "owner"
      );

    if (!owner) {

      return res.status(403).json({
        message:
          "Only owner can change roles"
      });
    }

    const member =
      workspace.members.find(
        (member) =>
          member.user.toString()
          === memberId
      );

    if (!member) {

      return res.status(404).json({
        message:
          "Member not found"
      });
    }

    if (
      member.user.toString()
      ===
      workspace.owner.toString()
    ) {

      return res.status(400).json({
        message:
          "Owner role cannot be changed"
      });
    }

    member.role = role;

    await workspace.save();

    const io = req.app.get("io");

    io.to(workspace._id.toString())
      .emit("membersUpdated");

    io.to(workspace._id.toString())
      .emit("activityUpdated");

    await logActivity({
      workspace:
        workspace._id,
      user:
        req.user._id,
      action:
        "ROLE_CHANGED",
      target:
        role
    });

    res.json({
      message:
        "Role updated"
    });
  });

// Remove Member
const removeMember =
  asyncHandler(async (
    req,
    res
  ) => {

    const {
      workspaceId,
      memberId
    } = req.body;

    const workspace =
      await Workspace.findById(
        workspaceId
      );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    const owner =
      workspace.members.find(
        (member) =>
          member.user.toString()
          ===
          req.user._id.toString()
          &&
          member.role === "owner"
      );

    if (!owner) {

      return res.status(403).json({
        message:
          "Only owner can remove members"
      });
    }

    if (
      memberId
      ===
      workspace.owner.toString()
    ) {

      return res.status(400).json({
        message:
          "Owner cannot be removed"
      });
    }

    workspace.members =
      workspace.members.filter(
        (member) =>
          member.user.toString()
          !== memberId
      );

    await workspace.save();

    const io = req.app.get("io");

    io.to(workspace._id.toString())
      .emit("membersUpdated");

    io.to(workspace._id.toString())
      .emit(
        "memberRemoved",
        {
          workspaceId,
          memberId
        }
      );

    io.to(workspace._id.toString())
      .emit("activityUpdated");

    await logActivity({
      workspace:
        workspace._id,
      user:
        req.user._id,
      action:
        "MEMBER_REMOVED",
      target:
        memberId
    });

    res.json({
      message:
        "Member removed"
    });
  });

// Get Workspace Members
const getWorkspaceMembers =
  asyncHandler(async (
    req,
    res
  ) => {

    const workspace =
      await Workspace
        .findById(
          req.params.id
        )
        .populate(
          "members.user",
          "name email"
        );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    res.json(
      workspace.members
    );
  });

const leaveWorkspace =
  asyncHandler(async (
    req,
    res
  ) => {

    const { workspaceId } =
      req.body;

    const workspace =
      await Workspace.findById(
        workspaceId
      );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    if (
      workspace.owner.toString()
      ===
      req.user._id.toString()
    ) {

      return res.status(400).json({
        message:
          "Owner cannot leave workspace"
      });
    }

    workspace.members =
      workspace.members.filter(
        (member) =>
          member.user.toString()
          !==
          req.user._id.toString()
      );

    await workspace.save();

    const io = req.app.get("io");

    io.to(workspace._id.toString())
      .emit("membersUpdated");

    io.to(workspace._id.toString())
      .emit("activityUpdated");

    await logActivity({
      workspace:
        workspace._id,
      user:
        req.user._id,
      action:
        "MEMBER_LEFT",
      target:
        workspace.name
    });

    res.json({
      message:
        "Workspace left successfully"
    });
  });

const deleteWorkspace =
  asyncHandler(async (
    req,
    res
  ) => {

    const workspace =
      await Workspace.findById(
        req.params.id
      );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    if (
      workspace.owner.toString()
      !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "Only owner can delete workspace"
      });
    }

    await Note.deleteMany({
      workspace:
        workspace._id
    });

    await Activity.deleteMany({
      workspace:
        workspace._id
    });

    req.app
      .get("io")
      .to(workspace._id.toString())
      .emit(
        "workspaceDeleted",
        workspace._id
      );

    await Workspace.findByIdAndDelete(
      workspace._id
    );

    res.json({
      message:
        "Workspace deleted successfully"
    });
  });

const transferOwnership =
  asyncHandler(async (
    req,
    res
  ) => {

    const {
      workspaceId,
      memberId
    } = req.body;

    const workspace =
      await Workspace.findById(
        workspaceId
      );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    if (
      workspace.owner.toString()
      !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "Only owner can transfer ownership"
      });
    }

    const newOwner =
      workspace.members.find(
        (member) =>
          member.user.toString()
          === memberId
      );

    if (!newOwner) {

      return res.status(404).json({
        message:
          "Member not found"
      });
    }

    const currentOwner =
      workspace.members.find(
        (member) =>
          member.user.toString()
          ===
          req.user._id.toString()
      );

    currentOwner.role =
      "editor";

    newOwner.role =
      "owner";

    workspace.owner =
      memberId;

    await workspace.save();

    const io =
      req.app.get("io");

    io.to(
      workspace._id.toString()
    ).emit(
      "membersUpdated"
    );

    io.to(
      workspace._id.toString()
    ).emit(
      "activityUpdated"
    );

    res.json({
      message:
        "Ownership transferred"
    });
  });

const renameWorkspace =
  asyncHandler(async (
    req,
    res
  ) => {

    const {
      workspaceId,
      name
    } = req.body;

    const workspace =
      await Workspace.findById(
        workspaceId
      );

    if (!workspace) {

      return res.status(404).json({
        message:
          "Workspace not found"
      });
    }

    if (
      String(workspace.owner)
      !==
      String(req.user._id)
    ) {

      return res.status(403).json({
        message:
          "Only owner can rename workspace"
      });
    }

    workspace.name = name;

    await workspace.save();

    req.app
      .get("io")
      .to(workspace._id.toString())
      .emit(
        "workspaceRenamed"
      );

    res.json({
      message:
        "Workspace renamed successfully"
    });
  });

module.exports = {
  createWorkspace,
  getWorkspaces,
  joinWorkspace,
  changeMemberRole,
  removeMember,
  getWorkspaceMembers,
  leaveWorkspace,
  deleteWorkspace,
  transferOwnership,
  renameWorkspace
};