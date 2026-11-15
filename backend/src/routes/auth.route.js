const router = require("express").Router();
const authController = require("../controller/auth.controller");
const { body } = require("express-validator");

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

module.exports = router;
