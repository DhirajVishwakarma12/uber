const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklisting.model");

/**
 * @name captainRegisterController
 * @description register the new captain
 * @access public
 */
module.exports.registerCaptain = async (req, res) => {
  // Validate incoming request data before creating a captain.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password, vehicle } = req.body;

    const isCaptainExits = await captainService.isCaptainExits(email);

    if (isCaptainExits) {
      return res.status(400).json({
        message: "captain already exits",
      });
    }

    const hashpassword = await captainModel.hashPassword(password);

    const result = await captainService.createCaptain({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashpassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to register captain",
    });
  }
};

/**
 * @name captainLoginController
 * @description login the captain
 * @access public
 */
module.exports.loginCaptain = async (req, res) => {
  // Validate login input before checking credentials.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const isCaptain = await captainService.isCaptainExits(email);

    if (!isCaptain) {
      return res.status(400).json({
        message: "Invalid Captain..",
      });
    }

    const isMatch = await isCaptain.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = await isCaptain.generateToken();

    // Set cookie
    res.cookie("token", token);

    return res.status(200).json({
      message: "captain logged in successfully.",
      captain: {
        id: isCaptain._id,
        fullName: isCaptain.fullName,
        email: isCaptain.email,
      },
      token,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to log in captain",
    });
  }
};

/**
 * @name getCaptainProfileController
 * @description get the authenticated captain profile
 * @access private
 */
module.exports.getCaptainProfile = async (req, res) => {
  // Return the authenticated captain data from the request context.
  return res.status(200).json({ captain: req.cap });
};

/**
 * @name captainLogoutController
 * @description log out the captain
 * @access private
 */
module.exports.logoutCaptain = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await blacklistModel.create({ token });
  }
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};
