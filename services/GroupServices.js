const logger = require("../config/logger");
const GroupModel = require("../model/Group");
const UserModel = require("../model/User");

const { shuffleMembers } = require("../utils/randomGen");

exports.CreateGroup = async (group) => {
  try {
    const newGroup = await GroupModel.create(group);
    return newGroup;
  } catch (err) {
    throw new Error(err);
  }
};

exports.GetGroups = async () => {
  try {
    const groups = await GroupModel.find();
    if (!groups || groups.length < 1) {
      throw new Error("No groups found");
    }
    return groups;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.GetGroupById = async (groupId) => {
  try {
    const group = await GroupModel.findById(groupId)
      .populate({
        path: "members",
        select: "name _id",
      })
      .populate({
        path: "nextReceipients",
        select: "name _id",
      });
    if (!group) {
      throw new Error("Group not found!");
    }
    return group;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.AddToGroup = async (userId, groupId) => {
  try {
    // check if user is already in group
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    const group = await GroupModel.findById(groupId);
    if (!group) {
      throw new Error("Group not found!");
    }
    const userInGroup = group.members.find(
      (member) => member.toString() === userId
    );
    if (userInGroup) {
      throw new Error("User already in group!");
    }
    const addedUser = await GroupModel.findByIdAndUpdate(
      groupId,
      { $push: { members: userId, nextReceipients: userId } },
      { new: true }
    )
      .populate({
        path: "members",
        select: "name _id",
        receipientAdded,
      })
      .exec();
    await UserModel.findByIdAndUpdate(userId, { group: groupId });
    return addedUser;
  } catch (err) {
    throw new Error(err);
  }
};

exports.ClearReceipientList = async (groupId) => {
  try {
    const receipientCleared = await GroupModel.findByIdAndUpdate(
      groupId,
      { $set: { nextReceipients: [] } },
      { new: true }
    );
    if (receipientCleared) {
      return receipientCleared;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.GenerateRecipients = async (groupId) => {
  try {
    const members = await GroupModel.findById(groupId);
    let receipientTable = shuffleMembers(members.members);
    logger.info(`Receipient table: ${receipientTable}`);
    let receipientAdded = [];
    for (receipient of receipientTable) {
      logger.info(`Receipient: ${receipient}`);
      receipientAdded = await GroupModel.findByIdAndUpdate(
        groupId,
        { $push: { nextReceipients: receipient } },
        { new: true }
      );
    }
    return receipientAdded;
  } catch (err) {
    throw new Error(err);
  }
};

exports.RemoveGroup = async (groupId) => {
  try {
    const removed = await GroupModel.findByIdAndDelete(groupId);
    return removed;
  } catch (err) {
    throw new Error(err);
  }
};

exports.UpdateGroup = async (groupId, updates) => {
  try {
    const updated = await GroupModel.findByIdAndUpdate(groupId, updates, {
      new: true,
    });
    return updated;
  } catch (err) {
    throw new Error(err);
  }
};

exports.InviteToGroup = async (inviteId, userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    const group = await GroupModel.findOne({ inviteId });
    if (!group) {
      throw new Error("Group not found!");
    }
    const userInGroup = group.members.find(
      (member) => member.toString() === userId
    );
    if (userInGroup) {
      throw new Error("User already in group!");
    }
    const addedUser = await GroupModel.findByIdAndUpdate(
      group._id,
      { $push: { members: userId, nextReceipients: userId } },
      { new: true }
    );
    await UserModel.findByIdAndUpdate(userId, { group: group._id });
    return addedUser;
  } catch (err) {
    throw new Error(err);
  }
};
