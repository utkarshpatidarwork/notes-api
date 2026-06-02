//workspaceModel.js
const mongoose =
  require("mongoose");

const workspaceSchema =
  mongoose.Schema(
    {

      name: {
        type: String,
        required: true
      },

      owner: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true
      },

      members: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User"
        }
      ],

      inviteCode: {
        type: String
    },

    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Workspace",
    workspaceSchema
  );