const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const routerAPI = express.Router();

// Áp dụng middleware auth cho TẤT CẢ các route trong routerAPI
routerAPI.all("*", auth);

// GET /v1/api/ - Hello world test
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

// POST /v1/api/register - Đăng ký tài khoản mới
routerAPI.post("/register", createUser);

// POST /v1/api/login - Đăng nhập
routerAPI.post("/login", handleLogin);

// GET /v1/api/user - Lấy danh sách user (cần JWT)
routerAPI.get("/user", getUser);

// GET /v1/api/account - Lấy thông tin tài khoản hiện tại (cần JWT + delay 3s)
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI; // export default
