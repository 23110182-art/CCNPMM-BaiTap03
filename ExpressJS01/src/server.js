require("dotenv").config();

// Import các nguồn cần dùng
const express = require("express"); // commonjs
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const connection = require("./config/database");
const { getHomepage } = require("./controllers/homeController");
const cors = require("cors");

const app = express(); // cấu hình app là express

// Cấu hình port, nếu tìm thấy port trong env, không thì trả về 8888
const port = process.env.PORT || 8888;

// Config CORS - cho phép ReactJS (port 5173) gọi API
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // config req.body cho json
app.use(express.urlencoded({ extended: true })); // for form data

configViewEngine(app); // config template engine

// Config route cho view ejs
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);

// Khai báo route cho API
app.use("/v1/api/", apiRoutes);

(async () => {
  try {
    // Kết nối database using mongoose
    await connection();
    // Lắng nghe port trong env
    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
