//userModel.js
const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,

      validate: [
        validator.isEmail,
        "Please enter valid email"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },

    role: {
      type: String,

      enum: ["user", "admin"],

      default: "user"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);