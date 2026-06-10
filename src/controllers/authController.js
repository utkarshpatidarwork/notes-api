//authController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error(
        "Please provide all fields"
     );
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error(
        "Password must be at least 6 characters"
   );
    }

    // Check Existing User
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });

    // Check Password
    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });

    } else {
      res.status(401).json({
        message: "Invalid email or password"
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {

    res.status(200).json({
      message: "Protected Profile Access",
      userId: req.user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({
          message: "User not found"
        });
      }

      user.name =
        req.body.name || user.name;

      if (
        req.body.email &&
        req.body.email !== user.email
      ) {

        const emailExists =
          await User.findOne({
            email: req.body.email,
            _id: {
              $ne: req.user._id
            }
          });

        if (emailExists) {

          return res.status(400).json({
            message:
              "Email already in use"
          });
        }

        user.email =
          req.body.email;
      }

      await user.save();

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  };

const changePassword =
  async (req, res) => {

    try {

      const {
        currentPassword,
        newPassword
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Current password is incorrect"
        });
      }

      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(
          newPassword,
          salt
        );

      await user.save();

      res.status(200).json({
        message:
          "Password updated successfully"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  };

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
};