require("dotenv").config();

const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendResetEmail = require("../config/mailer");

const saltRounds = 10;

// ==================================================
// REGISTER SERVICE
// ==================================================
const createUserService = async (name, email, password) => {
  try {
    // kiểm tra email đã tồn tại chưa
    const user = await User.findByEmail(email);

    if (user) {
      return {
        EC: 1,
        EM: "Email đã tồn tại",
      };
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // tạo user mới
    const newUser = await User.createUser({
      name,
      email,
      password: hashPassword,
      role: "User",
    });

    return {
      EC: 0,
      EM: "Tạo user thành công",
      data: newUser,
    };
  } catch (error) {
    console.log(error);

    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

// ==================================================
// LOGIN SERVICE
// ==================================================
const loginService = async (email, password) => {
  try {
    // tìm user theo email
    const user = await User.findByEmail(email);

    if (!user) {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ",
      };
    }

    // so sánh password
    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: "Email/Password không hợp lệ",
      };
    }

    // payload JWT
    const payload = {
      email: user.email,
      name: user.name,
    };

    // tạo access token
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      EC: 0,
      EM: "Đăng nhập thành công",
      access_token,
      user: {
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

// ==================================================
// GET ALL USERS
// ==================================================
const getUserService = async () => {
  try {
    const users = await User.getAllUsers();

    return {
      EC: 0,
      EM: "Lấy danh sách user thành công",
      data: users,
    };
  } catch (error) {
    console.log(error);

    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

//Logout service
const logoutService = async () => {
  try {
    return {
      EC: 0,
      EM: "Đăng xuất thành công",
    };
  } catch (error) {
    console.log(error);

    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

// ===============================
// FORGOT PASSWORD
// ===============================
const forgotPasswordService = async (email) => {
  const user = await User.findByEmail(email);

  if (!user) {
    return {
      EC: 1,
      EM: "Email không tồn tại",
    };
  }

  // tạo reset token (JWT ngắn hạn)
  const resetToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  // ở đây thường sẽ gửi email
  console.log("RESET LINK:");
  console.log(`http://localhost:3000/reset-password?token=${resetToken}`);

    // gửi email thật
  await sendResetEmail(email, resetToken);
  return {
    EC: 0,
    EM: "Đã gửi link reset password",
  };
};

// ===============================
// RESET PASSWORD
// ===============================
const resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByEmail(decoded.email);

    if (!user) {
      return {
        EC: 1,
        EM: "Token không hợp lệ",
      };
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await User.updatePassword(decoded.email, hashPassword);

    return {
      EC: 0,
      EM: "Đổi mật khẩu thành công",
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Token hết hạn hoặc không hợp lệ",
    };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
};
