const {
  CreateUser,
  GetUsers,
  GetUsersByGroup,
  GetUserById,
  GetUserByEmail,
  RemoveUser,
  UpdateUser,
} = require("../services/UserServices");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { responseHandler } = require("../utils/responseHandler");
const { generateToken } = require("../middleware/authMiddleware");

exports.CreateNewUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, password, email } = req.body;
    const createdUser = await CreateUser({
      name,
      password,
      email,
    });
    if (createdUser) {
      createdUser.password = "";
      return responseHandler(res, {
        status: 201,
        message: "Succesfully registered new Esusu member!",
        data: createdUser,
      });
    } else {
      return responseHandler(res, {
        status: 400,
        message: "Unable to create new member!!!",
        data: null,
      });
    }
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});

exports.LoginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await GetUserByEmail(email);
    if (user) {
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return responseHandler(res, {
          status: 400,
          message: "Invalid credentials",
          data: null,
        });
      }
      user.password = "";
      let token = generateToken(user);
      return responseHandler(res, {
        status: 200,
        message: "Successfully logged user in",
        data: user,
        token,
      });
    }
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});

exports.GetAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await GetUsers();
    return responseHandler(res, {
      status: 200,
      message: "Successfully retrieved all users",
      data: users,
    });
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});

exports.GetGroupMembers = asyncHandler(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const members = await GetUsersByGroup(groupId);
    if (!members) {
      return responseHandler(res, {
        status: 404,
        message: "Group not found",
        data: null,
      });
    }
    return responseHandler(res, {
      status: 200,
      message: "Successfully retrieved group members",
      data: members,
    });
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});

exports.GetUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await GetUserById(userId);
    if (!user) {
      return responseHandler(res, {
        status: 404,
        message: "User not found",
        data: null,
      });
    }
    return responseHandler(res, {
      status: 200,
      message: "Successfully retrieved user",
      data: user,
    });
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});

exports.UpdateMemberProfile = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;
    const updatedUser = await UpdateUser(userId, {
      name,
      email,
    });
    if (!updatedUser) {
      return responseHandler(res, {
        status: 404,
        message: "User not found",
        data: null,
      });
    }
    return responseHandler(res, {
      status: 200,
      message: "Successfully updated user",
      data: updatedUser,
    });
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});

exports.DeleteUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deletedUser = await RemoveUser(userId);
    if (!deletedUser) {
      return responseHandler(res, {
        status: 404,
        message: "User not found",
        data: null,
      });
    }
    return responseHandler(res, {
      status: 200,
      message: "Successfully deleted user",
      data: deletedUser,
    });
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});
