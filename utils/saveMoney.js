const UserModel = require("../model/User");
const GroupModel = require("../model/Group");
const logger = require("../config/logger");

const saveMoney = async (amt, groupId) => {
  try {
    const group = await GroupModel.findById(groupId);
    if (group) {
      const groupMembers = await UserModel.find( { group: groupId } );
      for(member of groupMembers) {
        member.amountSaved += amt;
        await UserModel.findByIdAndUpdate(member._id, member);
        const saved = await UserModel.find(member._id);
        if (!saved) {
          throw new Error("Unable to save 5k for this member!");
          return false;
        }
        logger.info(`Saved ${amt} for ${member.name}`);
      };
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
      logger.info("Save new 5K for all group members successfully completed!!!");
      return true;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
