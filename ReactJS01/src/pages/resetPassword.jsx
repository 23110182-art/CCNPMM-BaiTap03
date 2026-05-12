import React, { useState } from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../util/api";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

/**
 * ResetPasswordPage
 *
 * Luồng:
 * 1. User click link từ email -> có token trong URL
 * 2. Nhập password mới + confirm password
 * 3. Submit -> gửi token + password lên backend
 * 4. Backend verify token -> update password
 */

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const { password } = values;

      const res = await resetPasswordApi(token, password);

      notification.success({
        message: "RESET PASSWORD",
        description: res?.data?.message || "Đổi mật khẩu thành công!",
      });

      // chuyển về login
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      notification.error({
        message: "RESET PASSWORD",
        description:
          error?.response?.data?.message || "Reset password thất bại!",
      });
    } finally {
      setLoading(false);
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
          <legend>Reset Password</legend>

          <p style={{ marginBottom: 15 }}>
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>

          <Form
            name="reset-password"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Password mới"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
                {
                  min: 6,
                  message: "Mật khẩu ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Nhập lại password"
              name="confirm"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <Link to={"/login"}>
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>

          <Divider />

          <div style={{ textAlign: "center" }}>
            <Link to={"/register"}>Tạo tài khoản mới</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default ResetPasswordPage;