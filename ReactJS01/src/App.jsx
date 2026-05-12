import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

/**
 * App Component - Root component của ứng dụng
 *
 * Nhiệm vụ chính:
 * 1. Khi app khởi động, gọi API /v1/api/account để kiểm tra
 *    xem localStorage có token hợp lệ không
 * 2. Nếu có token hợp lệ -> tự động đăng nhập (setAuth isAuthenticated=true)
 * 3. Nếu không có / token hết hạn -> giữ isAuthenticated=false
 * 4. Trong thời gian kiểm tra, hiển thị spinner toàn màn hình (appLoading)
 *
 * Layout: Header (menu nav) + Outlet (nội dung trang hiện tại)
 */
function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        // Gọi API account - token được tự động gắn bởi axios interceptor
        // API này có delay 3 giây (middleware delay ở backend)
        const res = await axios.get(`/v1/api/account`);
        if (res && !res.message) {
          // Token hợp lệ -> cập nhật trạng thái đăng nhập
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.email,
              name: res.name,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching account:", error);
        // Token không hợp lệ hoặc API lỗi -> giữ isAuthenticated=false
      } finally {
        setAppLoading(false);
      }
    };
    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === true ? (
        // Màn hình loading toàn màn hình khi đang kiểm tra token
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
