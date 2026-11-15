
const { validationResult } = require("express-validator");
const userService = require("../services/user.services");
const userModel = require("../models/user.model");

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

    res.cookie("registerToken",token)
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


module.exports.userLoginController = async (req ,res) =>{
    
}
