const {
  createUserService,
  loginService,
  getUserService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
} = require("../services/userService");

/**
 * Controller xử lý đăng ký user mới
 * POST /v1/api/register
 * Body: { name, email, password }
 */
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
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

// Controller xử lý đăng xuất (xóa token ở client)
const handleLogout = async (req, res) => {
  // Ở đây do chúng ta không lưu token ở server nên việc logout chỉ cần xóa token ở client là được

  const result = await logoutService();
  // Nếu muốn có thêm tính năng blacklist token thì có thể lưu token vào Redis hoặc database và kiểm tra ở middleware auth.js
  return res.status(200).json({ message: "Logout successful" });
};

// gửi link reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email);

  return res.json(result);
};

// reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const result = await resetPasswordService(token, newPassword);

  return res.json(result);
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  handleLogout,
  forgotPassword,
  resetPassword,
};
