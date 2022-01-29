const UserModel = require("../model/User");
const GroupModel = require("../model/Group");
const logger = require("../config/logger");

saveMoney = async (amt, groupId) => {
  try {
    const group = await GroupModel.findById(groupId);
    if (group) {
      const groupMembers = await UserModel.find({ $where: { group: groupId } });
      groupMembers.forEach(async (member) => {
        let newSave = member.amountSaved + amt;
        const saved = await UserModel.findByIdAndUpdate(
          member._id,
          { $set: { amountSaved: newSave } },
          { new: true }
        );
        if (!saved) {
          throw new Error("Unable to save 5k for this member!");
          return false;
        }
      });
      return true;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.saveForAllGroups = async (amt) => {
  try {
    const groups = await GroupModel.find();
    if (groups) {
      groups.forEach((group) => {
        saveMoney(amt, group._id);
      });
      logger.info("Save new 5K for all group members successfully completed!!!");
      return true;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
