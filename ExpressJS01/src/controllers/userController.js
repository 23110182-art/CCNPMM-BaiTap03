const {
  createUserService,
  loginService,
  getUserService,
} = require("../services/userService");

/**
 * Controller xử lý đăng ký user mới
 * POST /v1/api/register
 * Body: { name, email, password }
 */
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  console.log("data from controller", data);
  return res.status(200).json(data);
};

/**
 * Controller xử lý đăng nhập
 * POST /v1/api/login
 * Body: { email, password }
 */
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

/**
 * Controller lấy danh sách user (cần xác thực JWT)
 * GET /v1/api/user
 */
const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

/**
 * Controller lấy thông tin tài khoản đang đăng nhập
 * GET /v1/api/account (cần xác thực JWT + có delay middleware)
 * req.user được gắn vào bởi middleware auth.js
 */
const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
};
