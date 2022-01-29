const { Schema, model } = require("mongoose");
const { v4 } = require("uuid");

const GroupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    inviteId: String,
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    nextReceipients: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

GroupSchema.pre("save", (next) => {
  if (!this.inviteId) {
    this.inviteId = v4();
  }
  next();
});

const group = model("Group", GroupSchema);
module.exports = group;
