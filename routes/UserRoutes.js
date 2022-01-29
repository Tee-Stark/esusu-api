const express = require("express");
const {
  CreateNewUser,
  UpdateMemberProfile,
  DeleteUser,
  LoginUser,
  GetUser,
  GetAllUsers,
} = require("../controllers/UserController");
const { signinRequired, adminOnly } = require("../middleware/authMiddleware");

const Router = express.Router();

// Router.get("/", signinRequired, adminOnly, GetAllUsers);
Router.route("/")
   .get([signinRequired, adminOnly], GetAllUsers)
   .post(CreateNewUser);

Router.route("/auth").post(LoginUser);

Router.route("/:userId")
  .get([signinRequired, adminOnly], GetUser)
  .put([signinRequired], UpdateMemberProfile)
  .delete([signinRequired], DeleteUser);

module.exports = Router;