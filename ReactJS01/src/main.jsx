import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RegisterPage from "./pages/register.jsx";
import UserPage from "./pages/user.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import ForgotPasswordPage from "./pages/forgotPassword.jsx";
import ResetPasswordPage from "./pages/resetPassword.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";

/**
 * Cấu hình React Router v6 (Data Router)
 *
 * Cấu trúc route:
 * / (App layout - có Header)
 * ├── / (index) → HomePage
 * ├── /user     → UserPage
 * ├── /register → RegisterPage (ngoài layout của App)
 * └── /login    → LoginPage (ngoài layout của App)
 *
 * Lưu ý: RegisterPage và LoginPage vẫn được bao bởi App layout
 * (có Header), nhưng không hiển thị Header vì chúng là trang auth.
 * Nếu muốn ẩn Header ở trang register/login, có thể dùng nested routes riêng.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* AuthWrapper bao bọc toàn bộ app để cung cấp auth context */}
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
);
