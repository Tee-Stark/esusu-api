const UserModel = require("../model/User");
const GroupModel = require("../model/Group");
const logger = require("../config/logger");

const saveMoney = async (amount, groupId) => {
  try {
    const group = await GroupModel.findById(groupId);
    if (group) {
      const groupMembers = await UserModel.find({ group: groupId });
      for (member of groupMembers) {
        if(member.amountSaved == Infinity || typeof member.amountSaved !== "number") {
          member.amountSaved = 0;
          logger.info(member.amountSaved);
        }
        const updatedSaving = parseInt(Number(member.amountSaved) + Number(amount));
        console.log(updatedSaving)
        const saved = await UserModel.findByIdAndUpdate(
          member._id,
          { $set: { amountSaved: updatedSaving } },
          { new: true }
        );
        if (!saved) {
          throw new Error("Unable to save 5k for this member!");
          return false;
        }
        logger.info(`Saved ${amount} for ${member.name}`);
      }
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
        logger.info(`Saved ${amt} for ${group.groupName}`);
      });
      logger.info(
        "Save new 5K for all group members successfully completed!!!"
      );
      return true;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
