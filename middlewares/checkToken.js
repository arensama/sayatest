const jtw = require("jsonwebtoken");
const userModel = require("../models/user.model");
const handle = async (req, res, next, access) => {
  try {
    let token = req.get("authorization");
    if (token) {
      token = token.split(" ")?.[1];
      console.log("token", token);
      jtw.verify(
        token,
        process.env.JSON_WEB_TOKEN_PRIVATE_KEY,
        async (err, decoded) => {
          if (err && err.name === "TokenExpiredError") {
            return res
              .status(400)
              .send({ message: "session expired. login required!" });
          } else if (err) {
            return res.status(400).send({ message: err.message });
          } else {
            console.log("decode", decoded);
            const user = await userModel.findOne({
              _id: decoded._id,
            });
            if (!user) {
              return res.status(400).send({
                message: "something went wrong! please signin again.",
              });
            }
            req.user = user;
            next();
          }
        }
      );
    } else {
      return res.status(400).send({
        message: "please signin to continue.",
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};

const decode = async (token) => {
  try {
    const decode = await jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_PRIVATE_KEY
      // { ignoreExpiration: true }
    );
    const instance = await userModel.findOne({ _id: decode.id });
    return instance;
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};
module.exports = { handle, decode };
