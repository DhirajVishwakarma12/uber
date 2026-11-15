const mongoose = require("mongoose");

const blacklistingSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      default:Date.now(),
      expiresAt:"1d"
    },
  },
  {
    timestamps: true,
  },
);

const blacklistModel= mongoose.model("Blacklisting", blacklistingSchema);
module.exports = blacklistModel
