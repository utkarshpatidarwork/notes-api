// logActivity.js
const Activity =
  require(
    "../models/activityModel"
  );

const logActivity =
  async ({
    workspace,
    user,
    action,
    target = ""
  }) => {

    await Activity.create({
      workspace,
      user,
      action,
      target
    });
  };

module.exports =
  logActivity;