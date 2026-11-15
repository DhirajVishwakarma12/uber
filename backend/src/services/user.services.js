
const userModel = require("../models/user.model");

// Create User
module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required.");
  }

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
  });

  return user;
};

// Check Whether User Exists
module.exports.isUserExits = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required.");
  }

  const user = await userModel.findOne({ email }).select("+password");

  return user;
};
