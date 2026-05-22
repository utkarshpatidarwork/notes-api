const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true
    },

    category: {
      type: String,
      default: "General"
    },

    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Note",
  noteSchema
);