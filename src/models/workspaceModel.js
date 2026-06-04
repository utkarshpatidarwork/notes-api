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
          user: {
            type:
              mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true
          },

          role: {
            type: String,

            enum: [
              "owner",
              "editor",
              "viewer"
            ],

            default: "viewer"
          }
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