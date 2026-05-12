import axios from "./axios.customize";

/**
 * Gọi API đăng ký tài khoản mới
 * POST /v1/api/register
 * @param {string} name - Tên người dùng
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 */
const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

/**
 * Gọi API đăng nhập
 * POST /v1/api/login
 * @param {string} email
 * @param {string} password
 */
const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

/**
 * Gọi API lấy danh sách user
 * GET /v1/api/user
 * Cần: Bearer Token trong header (tự động gắn bởi interceptor)
 */
const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API);
};

/**
 * Gọi API lấy thông tin tài khoản hiện tại
 * GET /v1/api/account
 * Cần: Bearer Token trong header
 * Lưu ý: API này có delay 3 giây (do middleware delay ở backend)
 */
const getAccountApi = () => {
  return axios.get("/v1/api/account");
};

/**
 * Gọi API quên mật khẩu
 * POST /v1/api/forgot-password
 * @param {string} email
 */
const forgotPasswordApi = (email) => {
  const URL_API = "/v1/api/forgot-password";

  return axios.post(URL_API, { email });
};

/**
 * Gọi API reset mật khẩu
 * POST /v1/api/reset-password
 * @param {string} token
 * @param {string} newPassword
 */
const resetPasswordApi = (token, newPassword) => {
  const URL_API = "/v1/api/reset-password";

  const data = {
    token,
    newPassword,
  };

  return axios.post(URL_API, data);
};

export { createUserApi, loginApi, getUserApi, getAccountApi, forgotPasswordApi, resetPasswordApi };
