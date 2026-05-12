require("dotenv").config();

let User;

switch (process.env.DB_TYPE) {
  case "mysql":
    User = require("./mysql/user.model");
    break;

  case "mongodb":
  default:
    User = require("./mongodb/user.model");
    break;
}

module.exports = User;
