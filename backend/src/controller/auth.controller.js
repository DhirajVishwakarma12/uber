const { validationResult } = require("express-validator");
const userService = require("../services/user.services");
const userModel = require("../models/user.model");

/**
 * @name userRegisterController
 * @description register the new user
 * @access public
 */
module.exports.userRegisterController = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { fullName, email, password } = req.body;

    // Check whether user already exists
    const isUserExists = await userService.isUserExits({ email });

    if (isUserExists) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    // Hash password
    const hashedPassword = await userModel.hashpassword(password);

    // Create user
    const user = await userService.createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = await user.authToken();

    res.cookie("token",token)
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * @name userLoginController
 * @description login an a user
 * @access public
 */

module.exports.userLoginController = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await userService.isUserExits({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await user.camparepassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = await user.authToken();

    // Set cookie
    res.cookie("token", token);

    return res.status(200).json({
      message: "User logged in successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
