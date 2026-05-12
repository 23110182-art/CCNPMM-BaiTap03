import { createContext, useState } from "react";

/**
 * AuthContext - Context lưu trạng thái xác thực toàn cục
 *
 * Các giá trị được chia sẻ cho toàn bộ ứng dụng:
 * - isAuthenticated: boolean - người dùng đã đăng nhập chưa
 * - user: { email, name } - thông tin người dùng hiện tại
 * - appLoading: boolean - ứng dụng đang kiểm tra token lúc khởi động không
 */
export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    name: "",
  },
  appLoading: true,
});

/**
 * AuthWrapper - Component bao bọc toàn bộ ứng dụng
 * Cung cấp auth state và setters cho tất cả component con
 */
export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
    },
  });

  // appLoading: true khi app đang fetch /v1/api/account để kiểm tra token
  // Hiển thị màn hình loading spinner trong thời gian này
  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
