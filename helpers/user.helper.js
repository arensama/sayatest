const bcrypt = require("bcrypt");
const hashPassword = async function (data) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data, salt);
  return hash;
};

const compareHash = async function (user, input) {
  if (!bcrypt.compareSync(input, user)) {
    return false;
  }
  return true;
};
module.exports = { hashPassword, compareHash };
