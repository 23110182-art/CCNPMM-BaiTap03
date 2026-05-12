const path = require("path");
const express = require("express");

const configViewEngine = (app) => {
  // Cấu hình thư mục views để chứa các file template EJS
  app.set("views", path.join("./src", "views"));
  // Sử dụng EJS làm template engine
  app.set("view engine", "ejs");

  // Cấu hình static files: image/css/js
  app.use(express.static(path.join("./src", "public")));
};

module.exports = configViewEngine;
