// activityController.js
const asyncHandler =
  require("express-async-handler");

const Activity =
  require("../models/activityModel");

const getActivities =
  asyncHandler(async (
    req,
    res
  ) => {

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
      });

    res.status(200).json(
      activities
    );
  });

module.exports = {
  getActivities
};