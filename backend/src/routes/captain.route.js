const express = require("express");
const { body } = require("express-validator");
const captainController = require("../controller/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @route POST /api/captain/register
 * @description Register a captain
 * @access Public
 */
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("first name is greater than 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Vehicle color must be at least 3 characters long"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Vehicle plate must be at least 3 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be at least 1"),
    body("vehicle.vehicleType")
      .isIn(["car", "motorcycle", "auto"])
      .withMessage("Invalid vehicle type"),
  ],
  captainController.registerCaptain,
);

/**
 * @route POST /api/captain/login
 * @description Log in a captain
 * @access Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.loginCaptain,
);

/**
 * @route GET /api/captain/profile
 * @description Get the captain profile
 * @access Private
 */
router.get('/profile', authMiddleware.Authcaptain, captainController.getCaptainProfile);

/**
 * @route GET /api/captain/logout
 * @description Log out a captain
 * @access Private
 */
router.get('/logout', authMiddleware.Authcaptain, captainController.logoutCaptain);

module.exports = router;
