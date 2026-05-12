import axios from "axios";

/**
 * Tạo axios instance với baseURL từ biến môi trường
 * VITE_BACKEND_URL được định nghĩa trong .env.development / .env.production
 */
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// ========== REQUEST INTERCEPTOR ==========
// Tự động gắn Bearer Token vào header của MỌI request
instance.interceptors.request.use(
  function (config) {
    // Lấy access_token từ localStorage (được lưu khi login thành công)
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========
instance.interceptors.response.use(
  function (response) {
    // Chỉ trả về response.data thay vì toàn bộ response object
    // Giúp code ở component gọn hơn: const res = await api() thay vì res.data
    if (response && response.data) return response.data;
    return response;
  },
  function (error) {
    // Nếu server trả về lỗi (4xx, 5xx), trả về error.response.data
    if (error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
  }
);

export default instance;
