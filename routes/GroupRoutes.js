const express = require("express");
const {
  CreateNewGroup,
  GetGroupById,
  UpdateGroup,
  DeleteGroup,
  GetAllGroups,
  AddNewMember,
  StartNewTenure,
  InviteToGroup,
  JoinGroup
} = require("../controllers/GroupController");
const { GetGroupMembers } = require("../controllers/UserController");
const { signinRequired, adminOnly } = require("../middleware/authMiddleware");

const Router = express.Router();

Router.route("/")
  .get([signinRequired], GetAllGroups)
  .post([signinRequired], CreateNewGroup);

Router.route("/:groupId")
  .get([signinRequired, adminOnly], GetGroupById)
  .put([signinRequired, adminOnly], UpdateGroup)
  .delete([signinRequired, adminOnly], DeleteGroup);

Router.route("/:groupId/newTenure").post(
  [signinRequired, adminOnly],
  StartNewTenure
);

Router.route("/:groupId/members")
  .post([signinRequired, adminOnly], AddNewMember)
  .get([signinRequired], GetGroupMembers)
  .delete([signinRequired, adminOnly], DeleteGroup);

Router.route("/invite/:inviteId")
  .post([signinRequired, adminOnly], InviteToGroup)

Router.route("/join/:inviteId")
  .post(JoinGroup);


module.exports = Router;
