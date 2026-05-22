const asyncHandler = require(
  "express-async-handler"
);

const Note = require("../models/noteModel");

// Create Note
const createNote = asyncHandler(
  async (req, res) => {

    const {
      title,
      content,
      image,
      category
    } = req.body;

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
      image,
      category
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

    // Query
    const notes = await Note.find({
      user: req.user._id,
      ...keyword
    })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Total Count
    const total = await Note.countDocuments({
      user: req.user._id,
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

    if (
      note.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const updatedNote =
      await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

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

    if (
      note.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401);
      throw new Error("Not authorized");
    }

    await Note.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "Note deleted successfully"
    });
  }
);

module.exports = {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote
};