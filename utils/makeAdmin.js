const { UpdateUser } = require("../services/UserServices");

exports.makeAdmin = async (user) => {
  try {
    const newAdmin = await UpdateUser(user._id, { role: "admin" });
    if (!newAdmin) {
      throw new Error("unable to make admin of this group");
    }
    return newAdmin;
  } catch (err) {
    throw new Error(err.message);
  }
};
