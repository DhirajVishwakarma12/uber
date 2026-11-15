const router = require("express").Router();
const authController = require("../controller/auth.controller");
const { body } = require("express-validator");

/**
 * @route api/auth/register
 * @description register the user
 * @access public
 */

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("invalid Email"),
    body("password")
      .isLength({ min:6 })
      .withMessage("Password must be at least 6 characters"),
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("first name is greater than 3 characters"),
  ],
  authController.userRegisterController,
);


/**
 * @route api/auth/login
 * @description login the user
 * @access public
 */

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid Email"),
    body("password")
      .isLength({ min:6 })
      .withMessage("Password must be at least 6 characters")
  ],
  authController.userLoginController,
);
module.exports = router;
