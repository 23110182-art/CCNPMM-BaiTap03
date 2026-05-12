import { CrownOutlined } from "@ant-design/icons";
import { Result } from "antd";

/**
 * HomePage - Trang chủ của ứng dụng
 * Hiển thị thông báo chào mừng với icon và tiêu đề
 */
const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <Result
        icon={<CrownOutlined />}
        title="JSON Web Token (React/Node.JS) - iotstar.vn"
      />
    </div>
  );
};

export default HomePage;
