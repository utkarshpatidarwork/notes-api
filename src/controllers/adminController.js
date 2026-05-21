const asyncHandler = require(
  "express-async-handler"
);

const User = require("../models/userModel");

// Get All Users
const getUsers = asyncHandler(
  async (req, res) => {

    const users = await User.find()
      .select("-password");

    res.status(200).json(users);
  }
);

module.exports = {
  getUsers
};