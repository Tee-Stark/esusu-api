const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    amountSaved: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  },
  {
    timeStamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  return next();
});

const user = model("User", UserSchema);
module.exports = user;
