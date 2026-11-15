const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters long"],
      },
      lastName: {
        type: String,
        minlength: [3, "Last name must be at least 3 characters long"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    socketId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    vehicle: {
      color: { type: String, required: true, trim: true },
      plate: { type: String, required: true, trim: true },
      capacity: { type: Number, required: true, min: 1 },
      vehicleType: {
        type: String,
        required: true,
        enum: ["car", "motorcycle", "auto"],
      },
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  { timestamps: true },
);
captainSchema.methods.generateToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SCRECT, {
    expiresIn: "1d",
  });
};

captainSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};

const captainModel = mongoose.model("Captain", captainSchema);
module.exports = captainModel;
