## 9. Test API bằng Postman

### Bước 1: Đăng ký user

```
Method: POST
URL: http://localhost:8080/v1/api/register
Body: x-www-form-urlencoded
  name     = Nguyen Van A
  email    = test@example.com
  password = 123456

hoặc json
{
    "name": "test1",
    "email": "test1@gmail.com",
    "password": "test1123456"
}

Kết quả: 200 OK
{
    "name": "test1",
    "email": "test1@gmail.com",
    "password": "$2b$10$weov9.QfEZJGYgL4iIfzs.Hr0B04dTUGAS3MPQp28WiRT7Z/eF/AG",
    "role": "User",
    "_id": "6a029c7a33ba2a8227385279",
    "__v": 0
}
```

### Bước 2: Đăng nhập

```
Method: POST
URL: http://localhost:8080/v1/api/login
Body: x-www-form-urlencoded
  email    = test@example.com
  password = 123456
hoặc json
{
    "username": "test1",
    "password": "test1123456"
}
Kết quả: 200 OK
{
    "EC": 0,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsIm5hbWUiOiJ0ZXN0MSIsImlhdCI6MTc3ODU1NjQzNSwiZXhwIjoxNzc4NjQyODM1fQ.pVuQoa_ppjjr-DBV0O546MR2fdBji2OVKjY1KAxBDag",
    "user": {
        "email": "test1@gmail.com",
        "name": "test1"
    }
}
```

### Bước 3: Lấy danh sách user (cần token)

```
Method: GET
URL: http://localhost:8080/v1/api/user
Authorization: Bearer Token
  Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsIm5hbWUiOiJ0ZXN0MSIsImlhdCI6MTc3ODU1NjQzNSwiZXhwIjoxNzc4NjQyODM1fQ.pVuQoa_ppjjr-DBV0O546MR2fdBji2OVKjY1KAxBDag

Kết quả: 200 OK
[
    {
        "_id": "6a029c3033ba2a8227385276",
        "name": "admin1",
        "email": "admin1@gmail.com",
        "role": "User",
        "__v": 0
    },
    {
        "_id": "6a029c7a33ba2a8227385279",
        "name": "test1",
        "email": "test1@gmail.com",
        "role": "User",
        "__v": 0
    }
]
```

### Bước 4: Test token hết hạn / sai

```
Method: GET
URL: http://localhost:8080/v1/api/user
Authorization: Bearer Token
  Token: sai_token_abc123
```

→ Server trả 401: "Token bị hết hạn/hoặc không hợp lệ"

---

### Bước 5: Quên mật khẩu
```
Method: POST
URL: http://localhost:8080/v1/api/forgot-password
Body json
{
    "email": "test1@gmail.com"
}
Kết quả: 200 OK
{
    "EC": 0,
    "EM": "Đã gửi link reset password"
}

RESET LINK:
http://localhost:3000/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsImlhdCI6MTc3ODU2NzgyMywiZXhwIjoxNzc4NTY4NDIzfQ.BXSmVYaT7XDsZDE_6ObjGMSE67supg8P0sM5ctAAEPc
```


### Bước 6: Đặt lại mật khẩu
```
Method: POST
URL: http://localhost:8080/v1/api/reset-password
Body json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsImlhdCI6MTc3ODU2NzgyMywiZXhwIjoxNzc4NTY4NDIzfQ.BXSmVYaT7XDsZDE_6ObjGMSE67supg8P0sM5ctAAEPc",
    "newPassword": "test1123456789"
}
Kết quả: 200 OK
{
    "EC": 0,
    "EM": "Đổi mật khẩu thành công"
}
```