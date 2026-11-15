const { request, json } = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength:3
    },
    lastName: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
    minlength:6,
    select: false,
  },
  socketId: {
    type: String,
  },
});

// methods
userSchema.methods.authToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SCRECT, {
    expiresIn: "1d",
  });
};

userSchema.statics.hashpassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.camparepassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};


const userModel = mongoose.model("users",userSchema)
module.exports = userModel