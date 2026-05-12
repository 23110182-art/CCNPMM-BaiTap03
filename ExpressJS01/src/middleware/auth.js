require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * Middleware xác thực JWT Token
 *
 * Luồng hoạt động:
 * 1. Kiểm tra xem route có trong white list không (không cần xác thực)
 * 2. Nếu không trong white list -> lấy token từ header Authorization
 * 3. Verify token với JWT_SECRET
 * 4. Gắn thông tin user vào req.user để controller sử dụng
 */
const auth = (req, res, next) => {
  // Danh sách các route KHÔNG cần xác thực JWT
  const white_lists = ["/", "/register", "/login"];

  // Kiểm tra nếu route hiện tại thuộc white list -> bỏ qua xác thực
  if (white_lists.find((item) => "/v1/api" + item === req.originalUrl)) {
    next();
  } else {
    // Lấy token từ header: Authorization: Bearer <token>
    if (req?.headers?.authorization?.split(" ")?.[1]) {
      const token = req.headers.authorization.split(" ")[1];

      // Verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Gắn thông tin user đã decode vào req để dùng ở controller
        req.user = {
          email: decoded.email,
          name: decoded.name,
          createdBy: "NQB",
        };
        console.log(">>> check token: ", decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Token bị hết hạn/hoặc không hợp lệ",
        });
      }
    } else {
      return res.status(401).json({
        message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn",
      });
    }
  }
};

module.exports = auth;
