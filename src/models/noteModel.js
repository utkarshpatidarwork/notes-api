//noteModel.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

    workspace: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Workspace"
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

    isPinned: {
      type: Boolean,
      default: false
    },

    attachments: [
      {
        url: {
          type: String
        },

        type: {
          type: String
        },

        name: {
          type: String
        }
      }
    ],
  },
  {
    timestamps: true
  }
);

noteSchema.index({
  user: 1
});

noteSchema.index({
  workspace: 1
});

noteSchema.index({
  createdAt: -1
});

noteSchema.index({
  category: 1
});

module.exports = mongoose.model(
  "Note",
  noteSchema
);