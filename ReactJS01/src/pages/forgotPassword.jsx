import React from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { forgotPasswordApi } from "../util/api";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

/**
 * ForgotPasswordPage
 *
 * Luồng:
 * 1. User nhập email
 * 2. Submit -> gọi API forgot password
 * 3. Backend gửi email chứa link reset
 * 4. Hiển thị thông báo thành công / thất bại
 */

const ForgotPasswordPage = () => {
  const onFinish = async (values) => {
    try {
      const { email } = values;

      const res = await forgotPasswordApi(email);

      notification.success({
        message: "FORGOT PASSWORD",
        description:
          res?.data?.message || "Link reset password đã được gửi tới email!",
      });
    } catch (error) {
      notification.error({
        message: "FORGOT PASSWORD",
        description: error?.response?.data?.message || "Gửi email thất bại!",
      });
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Quên Mật Khẩu</legend>

          <p style={{ marginBottom: 15 }}>
            Nhập email của bạn để nhận link đặt lại mật khẩu
          </p>

          <Form
            name="forgot-password"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="example@gmail.com" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Gửi link reset password
              </Button>
            </Form.Item>
          </Form>

          <Link to={"/login"}>
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>

          <Divider />

          <div style={{ textAlign: "center" }}>
            Chưa có tài khoản? <Link to={"/register"}>Đăng ký</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;
