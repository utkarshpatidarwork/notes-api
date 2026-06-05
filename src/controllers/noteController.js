//noteController.js
const asyncHandler = require(
  "express-async-handler"
);

const Note = require("../models/noteModel");

const Workspace = require("../models/workspaceModel");

const logActivity = require("../utils/logActivity");

const { canWriteWorkspace } = require("../middleware/workspacePermissionMiddleware");

// Create Note
const createNote = asyncHandler(
  async (req, res) => {

    const {
      title,
      content,
      attachments,
      category,
      workspace
    } = req.body;

    const canWrite =
      await canWriteWorkspace(
        workspace,
        req.user._id
      );

    if (!canWrite) {

      res.status(403);

      throw new Error(
        "You do not have permission to create notes"
      );
    }

    if (!title || !content) {
      res.status(400);
      throw new Error(
        "Please provide title and content"
      );
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      attachments,
      category,
      workspace
    });

    req.app
      .get("io")
      .to(workspace.toString())
      .emit("notesUpdated");

    await logActivity({
      workspace,
      user: req.user._id,
      action: "NOTE_CREATED",
      target: title
    });

    res.status(201).json(note);
  }
);

// Get Notes
const getNotes = asyncHandler(
  async (req, res) => {

    // Pagination
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 100;

    const skip = (page - 1) * limit;

    // Search
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i"
          }
        }
      : {};

    // Sorting
    let sortOption = {
      isPinned: -1,
      createdAt: -1
    };

    if (req.query.sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    // Validate Workspace Access
    const workspace =
    
      await Workspace.findOne({

        _id: req.query.workspace,

        "members.user":
          req.user._id
      });

    if (!workspace) {

      res.status(403);

      throw new Error(
        "Workspace access denied"
      );
    }

    // Query
    const notes = await Note.find({
      workspace: req.query.workspace,
      isArchived: false,
      ...keyword
    })
      .populate(
        "user",
        "name"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Total Count
    const total = await Note.countDocuments({
      workspace: req.query.workspace,
      isArchived: false,
      ...keyword
    });

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      notes
    });
  }
);

const getArchivedNotes =
  asyncHandler(async (
    req,
    res
  ) => {

    const notes =
      await Note.find({

        workspace:
          req.query.workspace,

        user:
          req.user._id,

        isArchived: true
      })
      .populate(
        "user",
        "name"
      )
      .sort({
        createdAt: -1
      });

    res.json(notes);
  });

const restoreNote =
  asyncHandler(async (
    req,
    res
  ) => {

    const note =
      await Note.findById(
        req.params.id
      );

    if (!note) {

      res.status(404);

      throw new Error(
        "Note not found"
      );
    }

    if (
      note.user.toString()
      !==
      req.user._id.toString()
    ) {

      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    note.isArchived = false;

    await note.save();

    await logActivity({
      workspace:
        note.workspace,

      user:
        req.user._id,

      action:
        "NOTE_RESTORED",

      target:
        note.title
    });

    res.json({
      message:
        "Note restored"
    });
  });

const permanentlyDeleteNote =
  asyncHandler(async (
    req,
    res
  ) => {

    const note =
      await Note.findById(
        req.params.id
      );

    if (!note) {

      res.status(404);

      throw new Error(
        "Note not found"
      );
    }

    if (
      note.user.toString()
      !==
      req.user._id.toString()
    ) {

      res.status(401);

      throw new Error(
        "Not authorized"
      );
    }

    await logActivity({
      workspace:
        note.workspace,

      user:
        req.user._id,

      action:
        "NOTE_PERMANENTLY_DELETED",

      target:
        note.title
    });

    await Note.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Note permanently deleted"
    });
  });

// Get Single Note
const getSingleNote = asyncHandler(
  async (req, res) => {

    const note = await Note.findById(
      req.params.id
    );

    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }

    if (
      note.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);
      throw new Error("Not authorized");
    }

    res.status(200).json(note);
  }
);

// Update Note
const updateNote = asyncHandler(
  async (req, res) => {

    const note = await Note.findById(
      req.params.id
    );

    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }

    const canWrite =
      await canWriteWorkspace(
        note.workspace,
        req.user._id
      );

    if (!canWrite) {

      res.status(403);

      throw new Error(
        "You do not have permission to edit notes"
      );
    }

    if (
      note.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const workspace =
      note.workspace;

    const updatedNote =
      await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    req.app
      .get("io")
      .to(workspace.toString())
      .emit("notesUpdated");

    await logActivity({
      workspace,
      user: req.user._id,
      action: "NOTE_UPDATED",
      target: note.title
    });

    res.status(200).json(updatedNote);
  }
);

// Delete Note
const deleteNote = asyncHandler(
  async (req, res) => {

    const note = await Note.findById(
      req.params.id
    );

    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }

    const canWrite =
      await canWriteWorkspace(
        note.workspace,
        req.user._id
      );

    if (!canWrite) {

      res.status(403);

      throw new Error(
        "You do not have permission to delete notes"
      );
    }

    if (
      note.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const workspace =
      note.workspace;

    await logActivity({
      workspace,
      user: req.user._id,
      action: "NOTE_ARCHIVED",
      target: note.title
    });

    note.isArchived = true;

    await note.save();

    req.app
      .get("io")
      .to(workspace.toString())
      .emit("notesUpdated");

    res.status(200).json({
      message:
        "Note moved to trash"
    });
  }
);

module.exports = {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  getArchivedNotes,
  restoreNote,
  permanentlyDeleteNote
};