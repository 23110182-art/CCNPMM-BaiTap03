require("dotenv").config();

const mongoose = require("mongoose");
const mysql = require("mysql2/promise");

// ==================================================
// MongoDB States
// ==================================================
const dbState = [
  {
    value: 0,
    label: "Disconnected",
  },
  {
    value: 1,
    label: "Connected",
  },
  {
    value: 2,
    label: "Connecting",
  },
  {
    value: 3,
    label: "Disconnecting",
  },
];

// ==================================================
// MongoDB Connection
// ==================================================
const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);

  const state = Number(mongoose.connection.readyState);

  console.log(
    dbState.find((f) => f.value === state).label,
    "to MongoDB database"
  );

  return mongoose.connection;
};

// ==================================================
// MySQL Connection
// ==================================================
const connectMySQL = async () => {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // test connection
  const connection = await pool.getConnection();

  console.log("Connected to MySQL database");

  connection.release();

  return pool;
};

// ==================================================
// Main Connection
// ==================================================
const connection = async () => {
  try {
    const dbType = process.env.DB_TYPE;

    switch (dbType) {
      case "mysql":
        return await connectMySQL();

      case "mongodb":
      default:
        return await connectMongoDB();
    }
  } catch (error) {
    console.log(">>> Error connecting to DB:", error);
    throw error;
  }
};

module.exports = connection;