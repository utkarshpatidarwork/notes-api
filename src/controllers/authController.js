//authController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");

const Workspace =
  require("../models/workspaceModel");

const Note =
  require("../models/noteModel");

const crypto =
  require("crypto");

const sendEmail =
  require("../utils/sendEmail");

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
  
const deleteAccount =
  async (req, res) => {

    const userId =
      req.user._id;

    const io =
      req.app.get("io");

    // Delete owned workspaces

    const ownedWorkspaces =
      await Workspace.find({
        owner: userId
      });

    const workspaceIds =
      ownedWorkspaces.map(
        (workspace) =>
          workspace._id
      );

    await Note.deleteMany({
      workspace: {
        $in: workspaceIds
      }
    });

    const memberWorkspaces =
      await Workspace.find({
        "members.user": userId
      })
      .select("_id");

    await Workspace.updateMany(
      {},
      {
        $pull: {
          members: {
            user: userId
          }
        }
      }
    );

    for (
      const workspace
      of memberWorkspaces
    ) {

      io.to(
        workspace._id.toString()
      ).emit(
        "memberRemoved",
        {
          workspaceId:
            workspace._id,
          memberId:
            userId
        }
      );

      io.to(
        workspace._id.toString()
      ).emit(
        "membersUpdated"
      );
    }

    await Workspace.deleteMany({
      owner: userId
    });

    // Delete personal notes

    await Note.deleteMany({
      user: userId
    });

    // Delete user

    await User.findByIdAndDelete(
      userId
    );

    res.json({
      message:
        "Account deleted successfully"
    });
  };

const forgotPassword =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found"
        });
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");

      user.resetPasswordToken =
        hashedToken;

      user.resetPasswordExpire =
        Date.now()
        +
        15 * 60 * 1000;

      await user.save();

      const resetUrl =
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      await sendEmail(
        user.email,
        "Password Reset",
        `
          <h2>Password Reset</h2>

          <p>
            Click the link below:
          </p>

          <a href="${resetUrl}">
            Reset Password
          </a>

          <p>
            Expires in 15 minutes.
          </p>
        `
      );

      res.json({
        message:
          "Reset email sent"
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });
    }
  };

const resetPassword =
  async (req, res) => {

    try {

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(
            req.params.token
          )
          .digest("hex");

      const user =
        await User.findOne({
          resetPasswordToken:
            hashedToken,

          resetPasswordExpire:
            {
              $gt: Date.now()
            }
        });

      if (!user) {

        return res.status(400).json({
          message:
            "Invalid or expired token"
        });
      }

      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(
          req.body.password,
          salt
        );

      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpire =
        undefined;

      await user.save();

      res.json({
        message:
          "Password reset successful"
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });
    }
  };

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword
};