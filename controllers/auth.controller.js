const userHelper = require("../helpers/user.helper");
const userController = require("./user.controller");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const signUp = async (req, res, next) => {
  try {
    let { name, username, email, password, phoneNumber } = req.body;
    password = await userHelper.hashPassword(password);
    const user = await userController.FindUserByUsername(username);
    if (user) {
      return res.status(401).json({ error: "username already taken." });
    }
    const newUser = await userModel.create({
      name,
      username,
      email,
      password,
      phoneNumber,
    });

    let token = await jwt
      .sign(
        {
          _id: newUser._id,
        },
        process.env.JSON_WEB_TOKEN_PRIVATE_KEY,
        { expiresIn: "1h" }
      )
      .toString();

    res.status(200).json({ message: "User signed up successfully", token });
  } catch (error) {
    console.log("error", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).send({ message: `${field} is already in use.` });
    } else if (error.name === "ValidationError") {
      return res.status(400).send({ message: error.message });
    } else {
      return res
        .status(500)
        .send({ message: "An error occurred while signing you up." });
    }
  }
};
const signIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userController.FindUserByUsername(username);
    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const checkPassword = await userHelper.compareHash(user.password, password);

    if (!checkPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    let token = await jwt
      .sign(
        {
          _id: user._id,
        },
        process.env.JSON_WEB_TOKEN_PRIVATE_KEY,
        { expiresIn: "1h" }
      )
      .toString();

    res.status(200).json({ message: "User signed in successfully", token });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { signUp, signIn };
