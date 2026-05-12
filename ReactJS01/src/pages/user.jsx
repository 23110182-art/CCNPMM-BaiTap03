import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

/**
 * UserPage - Trang danh sách người dùng
 *
 * Luồng hoạt động:
 * 1. Khi component mount -> gọi API GET /v1/api/user
 * 2. Nếu thành công -> hiển thị danh sách trong Table
 * 3. Nếu thất bại (401 Unauthorized) -> hiển thị thông báo lỗi
 *
 * Route này cần JWT token (được gắn tự động bởi axios interceptor)
 */
const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserApi();
      // Nếu không có message lỗi -> thành công
      if (!res?.message) {
        setDataSource(res);
      } else {
        notification.error({
          message: "Unauthorized",
          description: res.message,
        });
      }
    };
    fetchUser();
  }, []);

  // Định nghĩa các cột cho bảng Ant Design
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={"_id"}
      />
    </div>
  );
};

export default UserPage;
