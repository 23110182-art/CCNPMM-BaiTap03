/**
 * Middleware tạo độ trễ (delay) cho request
 * Mục đích: Mô phỏng network latency, dùng để test loading state ở frontend
 * Delay 3000ms = 3 giây trước khi chuyển sang handler tiếp theo
 */
const delay = (req, res, next) => {
  setTimeout(() => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log(">>> check token: ", token);
    }

    next();
  }, 3000);
};

module.exports = delay;
