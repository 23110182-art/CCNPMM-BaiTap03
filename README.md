# FullStack NodeJS01 — Express.js + ReactJS + MongoDB

> Dự án FullStack xây dựng hệ thống xác thực người dùng (Register / Login / JWT)  
> Môn: Công Nghệ Phần Mềm Mới (MTSE431179) — ThS. Nguyễn Hữu Trung  
> Trường Đại học Sư Phạm Kỹ Thuật TP.HCM

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Yêu cầu cài đặt](#4-yêu-cầu-cài-đặt)
5. [Cấu hình dự án](#5-cấu-hình-dự-án)
6. [Khởi chạy dự án](#6-khởi-chạy-dự-án)
7. [Luồng hoạt động chi tiết](#7-luồng-hoạt-động-chi-tiết)
8. [API Reference](#8-api-reference)
9. [Test API bằng Postman](#9-test-api-bằng-postman)
10. [Giải thích code quan trọng](#10-giải-thích-code-quan-trọng)
11. [Xử lý lỗi thường gặp](#11-xử-lý-lỗi-thường-gặp)

---

## 1. Tổng quan dự án

Dự án gồm 2 phần tách biệt hoàn toàn, giao tiếp qua REST API:

| Phần | Công nghệ | Port | Vai trò |
|------|-----------|------|---------|
| **Backend** | Node.js + Express.js + MongoDB | `8080` | Cung cấp REST API, xác thực JWT |
| **Frontend** | React.js + Vite + Ant Design | `5173` | Giao diện người dùng |

**Tính năng chính:**
- ✅ Đăng ký tài khoản mới (Register)
- ✅ Đăng nhập và nhận JWT token (Login)
- ✅ Xác thực JWT cho các route được bảo vệ
- ✅ Xem danh sách người dùng (cần đăng nhập)
- ✅ Tự động kiểm tra token khi khởi động app
- ✅ Đăng xuất (xóa token, reset state)

---

## 2. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                    │
│                   localhost:5173                        │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │
│  │ HomePage │  │LoginPage │  │RegisterPg│  │UserPage │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │           AuthContext (Global State)               │ │
│  │  isAuthenticated | user: {email, name} | loading   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Axios Instance (axios.customize.js)        │ │
│  │  - baseURL: VITE_BACKEND_URL                       │ │
│  │  - Request Interceptor: tự động gắn Bearer Token   │ │
│  │  - Response Interceptor: trả về response.data      │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP REST API
                         │ (có CORS headers)
┌────────────────────────▼────────────────────────────────┐
│                     BACKEND (Express)                   │
│                   localhost:8080                        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  server.js                        │  │
│  │  Express App | CORS | JSON Parser | Routes        │  │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │             routes/api.js (/v1/api/*)             │  │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │           middleware/auth.js (JWT verify)         │  │
│  │  White list: /register, /login (không cần token)  │  │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │            controllers/ (xử lý request)           │  │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │            services/ (business logic)             │  │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────▼───────────────────────────┐   │
│  │            models/ (Mongoose Schema)              │  │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
└─────────────────────────┼───────────────────────────────┘
                          │ Mongoose ODM
┌─────────────────────────▼───────────────────────────────┐
│                  MongoDB (localhost:27017)              │
│                  Database: fullstack                    │
│                  Collection: users                      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Cấu trúc thư mục

```
FullStackNodeJS01/
│
├── ExpressJS01/                    ← BACKEND
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js         ← Kết nối MongoDB bằng Mongoose
│   │   │   └── viewEngine.js       ← Cấu hình EJS template engine
│   │   │
│   │   ├── controllers/
│   │   │   ├── homeController.js   ← Xử lý render trang EJS
│   │   │   └── userController.js   ← Nhận request, gọi service, trả response
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js             ← Xác thực JWT token
│   │   │   └── delay.js            ← Tạo độ trễ 3s (test loading state)
│   │   │
│   │   ├── models/
│   │   │   └── user.js             ← Mongoose Schema cho User
│   │   │
│   │   ├── routes/
│   │   │   └── api.js              ← Định nghĩa tất cả API routes
│   │   │
│   │   ├── services/
│   │   │   └── userService.js      ← Business logic (hash pw, verify jwt,...)
│   │   │
│   │   ├── views/
│   │   │   └── index.ejs           ← Template EJS cho trang web (ít dùng)
│   │   │
│   │   └── server.js               ← Entry point của backend
│   │
│   ├── .env                        ← Biến môi trường (PORT, DB URL, JWT...)
│   ├── .gitignore
│   └── package.json
│
└── ReactJS01/                      ← FRONTEND
    ├── src/
    │   ├── components/
    │   │   ├── context/
    │   │   │   └── auth.context.jsx ← Global state: isAuthenticated, user
    │   │   └── layout/
    │   │       └── header.jsx       ← Thanh menu điều hướng
    │   │
    │   ├── pages/
    │   │   ├── home.jsx             ← Trang chủ
    │   │   ├── login.jsx            ← Trang đăng nhập
    │   │   ├── register.jsx         ← Trang đăng ký
    │   │   └── user.jsx             ← Trang danh sách user
    │   │
    │   ├── styles/
    │   │   └── global.css           ← CSS toàn cục
    │   │
    │   ├── util/
    │   │   ├── api.js               ← Các hàm gọi API
    │   │   └── axios.customize.js   ← Axios instance + interceptors
    │   │
    │   ├── App.jsx                  ← Root component (kiểm tra token khi khởi động)
    │   └── main.jsx                 ← Entry point + Router config
    │
    ├── .env.development             ← Biến môi trường khi dev
    ├── .env.production              ← Biến môi trường khi build production
    ├── index.html                   ← HTML entry point
    ├── vite.config.js               ← Cấu hình Vite
    └── package.json
```

---

## 4. Yêu cầu cài đặt

### Phần mềm bắt buộc

| Phần mềm | Phiên bản | Link tải | Kiểm tra |
|----------|-----------|----------|---------|
| **Node.js** | >= 18.x | https://nodejs.org | `node --version` |
| **MongoDB** | >= 6.x | https://www.mongodb.com/try/download/community | `mongod --version` |
| **MongoDB Compass** | Mới nhất | https://www.mongodb.com/products/compass | (GUI tool) |
| **Postman** | Mới nhất | https://www.postman.com/downloads | (test API) |

### Kiểm tra môi trường trước khi bắt đầu

```bash
# Kiểm tra Node.js (cần >= 18)
node --version
# Output mong đợi: v18.x.x hoặc v20.x.x hoặc v22.x.x

# Kiểm tra npm
npm --version
# Output mong đợi: 9.x.x hoặc 10.x.x

# Kiểm tra MongoDB đã cài chưa
mongod --version
# Output mong đợi: db version v6.x.x hoặc v7.x.x

# Kiểm tra MongoDB có đang chạy không (Windows)
sc query MongoDB
# Hoặc mở Services và tìm MongoDB

# Kiểm tra MongoDB có đang chạy không (macOS/Linux)
brew services list | grep mongodb   # macOS với Homebrew
sudo systemctl status mongod        # Linux
```

---

## 5. Cấu hình dự án

### 5.1 Cấu hình Backend (.env)

File: `ExpressJS01/.env`

```env
NODE_ENV=development
PORT=8080
MONGO_DB_URL=mongodb://localhost:27017/fullstack02
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=1d
```

| Biến | Ý nghĩa | Ghi chú |
|------|---------|---------|
| `NODE_ENV` | Môi trường chạy | `development` hoặc `production` |
| `PORT` | Cổng server lắng nghe | Mặc định `8080` nếu không có |
| `MONGO_DB_URL` | Chuỗi kết nối MongoDB | Thay `fullstack02` nếu muốn tên DB khác |
| `JWT_SECRET` | Khóa bí mật ký JWT | **QUAN TRỌNG**: đổi giá trị này trong production |
| `JWT_EXPIRE` | Thời hạn token | `1d` = 1 ngày, `1h` = 1 giờ, `7d` = 7 ngày |

### 5.2 Cấu hình Frontend (.env.development)

File: `ReactJS01/.env.development`

```env
VITE_BACKEND_URL=http://localhost:8080
```

> ⚠️ Vite chỉ nhận biến môi trường có prefix `VITE_`. Nếu đặt tên khác sẽ không hoạt động.

---

## 6. Khởi chạy dự án

### Bước 1: Khởi động MongoDB

**Windows (nếu MongoDB chạy như Service):**
```
Vào Services -> Tìm "MongoDB" -> Start
```

**Windows (thủ công):**
```cmd
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

**macOS:**
```bash
brew services start mongodb/brew/mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Kiểm tra MongoDB đã sẵn sàng:**  
Mở MongoDB Compass → kết nối tới `mongodb://localhost:27017` → nếu kết nối được là OK.

---

### Bước 2: Khởi động Backend

```bash
# Di chuyển vào thư mục backend
cd FullStackNodeJS01/ExpressJS01

# Cài đặt dependencies (chỉ cần làm lần đầu)
npm install

# Khởi động server (dùng nodemon - tự reload khi thay đổi code)
npm start
```

**Output khi thành công:**
```
[nodemon] 3.1.4
[nodemon] watching path(s): *.*
[nodemon] starting `node ./src/server.js`
Connected to database
Backend Nodejs App listening on port 8080
```

> ❌ Nếu thấy `Error connect to DB: MongooseServerSelectionError` → MongoDB chưa chạy, xem lại Bước 1.

---

### Bước 3: Khởi động Frontend

Mở terminal **mới** (giữ nguyên terminal backend):

```bash
# Di chuyển vào thư mục frontend
cd FullStackNodeJS01/ReactJS01

# Cài đặt dependencies (chỉ cần làm lần đầu)
npm install

# Khởi động development server
npm start
# hoặc: npm run dev
```

**Output khi thành công:**
```
  VITE v5.3.4  ready in 535 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Mở trình duyệt tại `http://localhost:5173`

---

### Tóm tắt — 3 cửa sổ terminal

```
Terminal 1: MongoDB     → mongod (hoặc chạy như service)
Terminal 2: Backend     → cd ExpressJS01 && npm start      (port 8080)
Terminal 3: Frontend    → cd ReactJS01 && npm start        (port 5173)
```

---

## 7. Luồng hoạt động chi tiết

### 7.1 Khi người dùng mở ứng dụng lần đầu

```
Người dùng mở http://localhost:5173
        │
        ▼
App.jsx khởi động → useEffect chạy
        │
        ▼
Gọi GET /v1/api/account
(axios interceptor tự động lấy token từ localStorage và gắn vào header)
        │
        ├── Không có token → API trả 401
        │       └── setAppLoading(false)
        │           → Hiển thị app bình thường, isAuthenticated = false
        │           → Menu: Home | Setting > Đăng nhập
        │
        └── Có token hợp lệ → API trả thông tin user
                └── setAuth({ isAuthenticated: true, user: {...} })
                    setAppLoading(false)
                    → Menu: Home | Users | Setting > Welcome email | Đăng xuất
```

### 7.2 Luồng Đăng ký (Register)

```
User điền form (name, email, password) → Submit
        │
        ▼
pages/register.jsx: onFinish()
        │
        ▼
util/api.js: createUserApi(name, email, password)
        │
        ▼
axios.customize.js: POST http://localhost:8080/v1/api/register
        │
        ▼
Backend: routes/api.js → middleware/auth.js
        │
        ├── "/register" nằm trong white_list → bỏ qua xác thực JWT
        │
        ▼
controllers/userController.js: createUser()
        │
        ▼
services/userService.js: createUserService(name, email, password)
        │
        ├── Kiểm tra email đã tồn tại chưa (User.findOne)
        │       └── Tồn tại → return null → FE hiển thị lỗi
        │
        ├── bcryptjs.hash(password, 10) → hashPassword
        │
        └── User.create({ name, email, password: hashPassword, role: "User" })
                └── Thành công → trả về user object
                        │
                        ▼
                FE: notification.success → navigate("/login")
```

### 7.3 Luồng Đăng nhập (Login)

```
User nhập email/password → Login
        │
        ▼
pages/login.jsx: onFinish()
        │
        ▼
util/api.js: loginApi(email, password)
        │
        ▼
axios: POST http://localhost:8080/v1/api/login
        │
        ▼
services/userService.js: loginService(email, password)
        │
        ├── User.findOne({ email }) → tìm user
        │       └── Không tìm thấy → { EC: 1, EM: "Email/Password không hợp lệ" }
        │
        ├── bcrypt.compare(password, user.password) → so sánh password
        │       └── Sai → { EC: 2, EM: "Email/Password không hợp lệ" }
        │
        └── jwt.sign({ email, name }, JWT_SECRET, { expiresIn: "1d" })
                └── Thành công → { EC: 0, access_token, user: { email, name } }
                        │
                        ▼
                FE: localStorage.setItem("access_token", token)
                    setAuth({ isAuthenticated: true, user: {...} })
                    navigate("/")
```

### 7.4 Luồng xem danh sách User (protected route)

```
User nhấn menu "Users" → navigate("/user")
        │
        ▼
pages/user.jsx: useEffect → fetchUser()
        │
        ▼
util/api.js: getUserApi()
        │
        ▼
axios interceptor: lấy token từ localStorage
        Authorization: "Bearer eyJhbGci..."
        │
        ▼
GET http://localhost:8080/v1/api/user
        │
        ▼
middleware/auth.js: "/user" KHÔNG trong white_list
        │
        ├── Không có header Authorization → 401 "Bạn chưa truyền Access Token"
        │
        └── Có token → jwt.verify(token, JWT_SECRET)
                ├── Token hết hạn/sai → 401 "Token bị hết hạn"
                └── Token hợp lệ → req.user = { email, name }
                        │
                        ▼
                services: User.find({}).select("-password")
                        └── Trả về mảng user (ẩn password)
                                │
                                ▼
                        FE: setDataSource(res) → hiển thị Table
```

### 7.5 Luồng Đăng xuất

```
User nhấn "Đăng xuất" trong menu
        │
        ▼
header.jsx: onClick handler
        │
        ├── localStorage.clear("access_token")  ← Xóa token khỏi storage
        │
        ├── setAuth({ isAuthenticated: false, user: { email: "", name: "" } })
        │         ← Reset global state
        │
        └── navigate("/")  ← Chuyển về trang chủ
```

---

## 8. API Reference

Base URL: `http://localhost:8080`

### Public Routes (không cần token)

| Method | Endpoint | Body | Response | Mô tả |
|--------|----------|------|----------|-------|
| `POST` | `/v1/api/register` | `{ name, email, password }` | User object | Đăng ký tài khoản |
| `POST` | `/v1/api/login` | `{ email, password }` | `{ EC, access_token, user }` | Đăng nhập |

**Response login thành công:**
```json
{
  "EC": 0,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "name": "Nguyen Van A"
  }
}
```

**Response login thất bại:**
```json
{
  "EC": 1,
  "EM": "Email/Password không hợp lệ"
}
```

---

### Protected Routes (cần Bearer Token)

Gắn header: `Authorization: Bearer <access_token>`

| Method | Endpoint | Response | Middleware | Mô tả |
|--------|----------|----------|------------|-------|
| `GET` | `/v1/api/` | `"Hello world api"` | auth | Test route |
| `GET` | `/v1/api/user` | `[...users]` | auth | Danh sách user |
| `GET` | `/v1/api/account` | `{ email, name }` | auth + delay(3s) | Thông tin tài khoản |

**Response /v1/api/user:**
```json
[
  {
    "_id": "66b1a00f8168d49adfea80fe",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "User"
  }
]
```

> Lưu ý: trường `password` bị ẩn bởi `.select("-password")`

**Response khi không có token (401):**
```json
{
  "message": "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
}
```

---

## 9. Test API bằng Postman

### Bước 1: Đăng ký user

```
Method: POST
URL: http://localhost:8080/v1/api/register
Body: x-www-form-urlencoded
  name     = Nguyen Van A
  email    = test@example.com
  password = 123456
```

### Bước 2: Đăng nhập

```
Method: POST
URL: http://localhost:8080/v1/api/login
Body: x-www-form-urlencoded
  email    = test@example.com
  password = 123456
```
→ Copy `access_token` từ response

### Bước 3: Lấy danh sách user (cần token)

```
Method: GET
URL: http://localhost:8080/v1/api/user
Authorization: Bearer Token
  Token: <dán access_token vào đây>
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

## 10. Giải thích code quan trọng

### Tại sao dùng bcryptjs thay vì bcrypt?

`bcrypt` là thư viện native (C++) cần compiler để build. Trong một số môi trường không có build tools sẽ thất bại. `bcryptjs` là bản pure JavaScript, hoạt động ở mọi nơi, API hoàn toàn tương thích.

### JWT hoạt động như thế nào?

```
                    ┌─────────────────────────────┐
                    │         JWT Token            │
                    │ eyJhbGci.eyJlbWFpbC.signature│
                    └─────────────────────────────┘
                           │         │          │
                    Header (base64) Payload  Signature
                    { alg: HS256 }  { email,  HMAC(header+payload,
                                    name,     JWT_SECRET)
                                    exp }

Khi login: jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" })
           → tạo token và trả về client

Khi request protected route:
           → client gắn token vào header
           → server: jwt.verify(token, JWT_SECRET)
           → nếu valid: decode và lấy payload (email, name)
           → nếu invalid/expired: throw error → 401
```

### Axios Interceptor hoạt động như thế nào?

```javascript
// Mỗi khi gọi API, interceptor tự động chạy:
config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;

// Thay vì phải viết thủ công ở mọi nơi:
axios.get("/api/user", { headers: { Authorization: `Bearer ${token}` } })

// Chỉ cần gọi:
axios.get("/api/user")  // interceptor lo phần còn lại
```

### AuthContext và appLoading

```
App khởi động
      │
      ├─ appLoading = true → Hiển thị Spinner (tránh "flash" nội dung)
      │
      ├─ Gọi /v1/api/account (delay 3s do middleware backend)
      │
      └─ appLoading = false → Hiển thị app thật sự
         (đã biết user đăng nhập hay chưa, menu hiển thị đúng)
```

---

## 11. Xử lý lỗi thường gặp

### ❌ `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Nguyên nhân:** MongoDB chưa chạy  
**Giải pháp:** Khởi động MongoDB service (xem Bước 1 ở trên)

---

### ❌ `Error: JWT_SECRET is not defined`

**Nguyên nhân:** File `.env` chưa được tạo hoặc thiếu biến  
**Giải pháp:** Kiểm tra file `ExpressJS01/.env` có đủ các biến không

---

### ❌ Frontend gọi API bị lỗi CORS

**Nguyên nhân:** Backend chưa cấu hình CORS cho port của frontend  
**Giải pháp:** Kiểm tra `server.js`, phần CORS config:
```javascript
cors({ origin: ["http://localhost:5173", "http://localhost:3000"] })
```

---

### ❌ `VITE_BACKEND_URL is undefined`

**Nguyên nhân:** Biến môi trường Vite không có prefix `VITE_`  
**Giải pháp:** Đảm bảo file `.env.development` có:
```
VITE_BACKEND_URL=http://localhost:8080
```

---

### ❌ Token không được gắn tự động

**Nguyên nhân:** `localStorage.getItem("access_token")` trả về `null`  
**Giải pháp:** Kiểm tra sau khi login, `localStorage.setItem("access_token", ...)` có chạy không. Mở DevTools → Application → Local Storage → localhost:5173

---

### ❌ Đăng nhập xong vẫn không thấy menu Users

**Nguyên nhân:** `AuthContext` chưa được cập nhật  
**Giải pháp:** Kiểm tra trong `login.jsx`, `setAuth(...)` có được gọi sau khi login thành công không


