require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

/**
 * Service tạo user mới (Register)
 * - Kiểm tra email đã tồn tại chưa
 * - Hash password trước khi lưu
 * - Lưu user vào database
 */
const createUserService = async (name, email, password) => {
  try {
    // Kiểm tra user đã tồn tại chưa
    const user = await User.findOne({ email });
    if (user) {
      console.log(`>>> user exist, chọn 1 email khác: ${email}`);
      return null;
    }

    // Hash password trước khi lưu vào DB
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Lưu user vào database
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "User",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Service xử lý đăng nhập (Login)
 * - Tìm user theo email
 * - So sánh password đã hash
 * - Tạo JWT access token nếu đúng
 */
const loginService = async (email1, password) => {
  try {
    // Tìm user theo email
    const user = await User.findOne({ email: email1 });
    if (user) {
      // So sánh password nhập vào với password đã hash trong DB
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password không hợp lệ",
        };
      } else {
        // Tạo payload chứa thông tin user để ký vào JWT
        const payload = {
          email: user.email,
          name: user.name,
        };

        // Ký JWT token với secret key và thời hạn từ .env
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Service lấy danh sách tất cả user
 * - Trả về tất cả user, ẩn trường password
 */
const getUserService = async () => {
  try {
    let result = await User.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
};
