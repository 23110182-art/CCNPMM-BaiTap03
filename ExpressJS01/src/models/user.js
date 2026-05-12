const mongoose = require("mongoose");

// Định nghĩa schema (cấu trúc) cho collection "user" trong MongoDB
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

// Tạo Model từ schema - MongoDB sẽ tạo collection tên "users" (tự động thêm 's')
const User = mongoose.model("user", userSchema);

module.exports = User;
