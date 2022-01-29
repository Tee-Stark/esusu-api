const UserModel = require("../model/User");
const errorHandler = require("../utils/errorHandler");

exports.CreateUser = async (user) => {
  try {
    const createdUser = await UserModel.create(user);
    return createdUser;
  } catch (err) {
    throw new Error(err);
  }
};

exports.GetUsers = async () => {
  try {
    const users = await UserModel.find().select('-password');
    if (users.length < 0 || !users) {
      throw new Error("No users found");
    }
    return users;
  } catch (err) {
    throw new Error(err);
  }
};

exports.GetUsersByGroup = async (groupId) => {
  try {
    const users = await UserModel.find({ group: groupId }).select('-password');
    if (users.length < 0 || !users) {
      throw new Error("No users found");
    }
    return users;
  } catch (err) {
    throw new Error(err);
  }
};

exports.GetUserById = async (userId) => {
  try {
    const user = await UserModel.findOne({ _id: userId }).select('-password');
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.GetUserByEmail = async (email) => {
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.UpdateUser = async (userId, updates) => {
  try {
    const updated = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    return updated;
  } catch (err) {
    throw new errorHandler(err);
  }
};

exports.RemoveUser = async (userId) => {
  try {
    const removed = await UserModel.findByIdAndDelete(userId);
    return removed;
  } catch (err) {
    throw new Error(err);
  }
};
