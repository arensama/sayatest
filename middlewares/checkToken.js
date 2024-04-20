const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const handle = async (req, res, next, access) => {
  try {
    let token = req.get("authorization");
    if (token) {
      token = token.split(" ")?.[1];
      console.log("token", token);
      jwt.verify(
        token,
        process.env.JSON_WEB_TOKEN_PRIVATE_KEY,
        async (err, decoded) => {
          if (err && err.name === "TokenExpiredError") {
            return res
              .status(401) // Unauthorized
              .send({ message: "Session expired. Please login again." });
          } else if (err) {
            return res.status(401).send({ message: "Invalid token." });
          } else {
            console.log("decoded", decoded);
            const user = await userModel.findOne({
              _id: decoded._id,
            });
            if (!user) {
              return res.status(404).send({
                message: "User not found. Please sign in again.",
              });
            }
            req.user = user;
            next();
          }
        }
      );
    } else {
      return res.status(400).send({
        message: "Please provide a token.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: "Internal server error.",
    });
  }
};

const decode = async (token) => {
  try {
    const decoded = await jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_PRIVATE_KEY
      // { ignoreExpiration: true }
    );
    const user = await userModel.findOne({ _id: decoded._id });
    return user;
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};

module.exports = { handle, decode };
