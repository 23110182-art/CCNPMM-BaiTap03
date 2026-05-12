const pool = require("../../config/database");

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    return rows[0];
  },

  createUser: async (data) => {
    const [result] = await pool.execute(
      `INSERT INTO users(name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [
        data.name,
        data.email,
        data.password,
        data.role,
      ]
    );

    return result;
  },

  getAllUsers: async () => {
    const [rows] = await pool.execute(
      "SELECT id, name, email, role FROM users"
    );

    return rows;
  },
};

module.exports = User;