// activityController.js
const asyncHandler =
  require("express-async-handler");

const Workspace =
  require("../models/workspaceModel");

const Activity =
  require("../models/activityModel");

const getActivities =
  asyncHandler(async (
    req,
    res
  ) => {

    const workspace =
      await Workspace.findOne({

        _id:
          req.params.workspaceId,

        "members.user":
          req.user._id
      });

    if (!workspace) {

      res.status(403);

      throw new Error(
        "Workspace access denied"
      );
    }

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 20;

    const skip =
      (page - 1) * limit;

    const activities =
      await Activity.find({
        workspace:
          req.params.workspaceId
      })
      .populate(
        "user",
        "name"
      )
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limit);

    const total =
      await Activity.countDocuments({
        workspace:
          req.params.workspaceId
      });

    res.status(200).json({
      activities,
      page,
      pages:
        Math.ceil(total / limit),
      total
    });
  });

module.exports = {
  getActivities
};