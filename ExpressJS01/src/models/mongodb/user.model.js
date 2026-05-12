const mongoose = require("mongoose");

// ==================================================
// Schema
// ==================================================
const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      default: "User",
    },
  },
  {
    timestamps: true,
  },
);

// ==================================================
// Model
// ==================================================
const UserModel = mongoose.model("user", userSchema);

// ==================================================
// Abstraction Layer
// ==================================================
const User = {
  // Tìm user theo email
  findByEmail: async (email) => {
    return await UserModel.findOne({ email });
  },

  // Tạo user mới
  createUser: async (data) => {
    return await UserModel.create(data);
  },

  // Lấy tất cả user
  getAllUsers: async () => {
    return await UserModel.find({}).select("-password");
  },
};

module.exports = User;
