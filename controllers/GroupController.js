const {
  CreateGroup,
  UpdateGroup,
  RemoveGroup,
  AddToGroup,
  GetGroups,
  GenerateRecipients,
  ClearReceipientList,
  GetGroupById,
  InviteToGroup,
} = require("../services/GroupServices");
const { v4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { responseHandler } = require("../utils/responseHandler");
const { makeAdmin } = require("../utils/makeAdmin");
const logger = require("../config/logger");

exports.CreateNewGroup = asyncHandler(async (req, res, next) => {
  try {
    const { groupName } = req.body;
    const admin = req.user;

    const newGroup = await CreateGroup({
      groupName,
      admin,
      inviteId: v4()
    });
    if (newGroup) {
      await AddToGroup(admin, newGroup._id);
      await makeAdmin(admin);
      return responseHandler(res, {
        status: 201,
        message: "Successfully created new Esusu Group!",
        data: newGroup,
      });
    } else {
      return responseHandler(res, {
        status: 400,
        message: "Group creation failed!",
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

exports.GetAllGroups = asyncHandler(async (req, res, next) => {
  try {
    const groups = await GetGroups();
    if (groups) {
      return responseHandler(res, {
        status: 200,
        message: "Successfully returned all groups!",
        data: groups,
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

exports.GetGroupById = asyncHandler(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await GetGroupById(groupId);
    if (group) {
      return responseHandler(res, {
        status: 200,
        message: "Successfully returned group!",
        data: group,
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

exports.AddNewMember = asyncHandler(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.query;
    const userAdded = await AddToGroup(userId, groupId);
    if (userAdded) {
      return responseHandler(res, {
        status: 200,
        message: "Successfully added user to group!",
        data: userAdded,
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

exports.StartNewTenure = asyncHandler(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const clearOld = await ClearReceipientList(groupId);
    if (clearOld) {
      logger.info("Cleared previous tenure receipients data!");
      const newTenure = await GenerateRecipients(groupId);
      if (newTenure) {
        logger.info("starting new Tenure already");
        return responseHandler(res, {
          status: 200,
          message: "Successfully started a new tenure!!!",
          data: newTenure,
        });
      }
    }
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: err.stack,
    });
  }
});

exports.DeleteGroup = asyncHandler(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const deletedGroup = await RemoveGroup(groupId);
    if (deletedGroup) {
      return responseHandler(res, {
        status: 200,
        message: "Esusu group successfully deleted!",
        data: deletedGroup,
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

exports.UpdateGroup = asyncHandler(async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const updates = req.body;
    const updatedGroup = await UpdateGroup(groupId, updates);
    if (updatedGroup) {
      return responseHandler(res, {
        status: 200,
        message: "Successfully updated Esusu group!",
        data: updatedGroup,
      });
    }
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: null,
    });
  }
});

exports.InviteToGroup = asyncHandler(async (req, res, next) => {
  try {
    const { inviteId } = req.params;
    const { userId } = req.query;
    if (!userId) {
      return responseHandler(res, {
        status: 400,
        message: "User Id is required!",
        data: null,
      });
    }
    const inviteLink = `${process.env.DEV_BASE_URL}/api/v1/group/join/${inviteId}?userId=${userId}`;
    // const invited = await inviteToGroup(inviteId, userId);
    // if (invited) {
    return responseHandler(res, {
      status: 200,
      message: "Successfully invited user to group!",
      data: {
        invitationLink: inviteLink,
      },
    });
    // }
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: null,
    });
  }
});

exports.JoinGroup = asyncHandler(async (req, res, next) => {
  try {
    const { inviteId } = req.params;
    const { userId } = req.query;
    if (!userId) {
      return responseHandler(res, {
        status: 400,
        message: "User Id is required!",
        data: null,
      });
    }
    const invited = await InviteToGroup(inviteId, userId);
    if (invited) {
      return responseHandler(res, {
        status: 200,
        message: "Successfully Joined group!",
        data: invited,
      });
    }
  } catch (err) {
    return responseHandler(res, {
      status: 500,
      message: err.message,
      data: null,
    });
  }
});
