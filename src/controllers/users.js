const { User } = require("../models");

const retrieveUserById = async (userId) => {
  return await User.findById(userId);
}

module.exports = {
  retrieveUserById
}