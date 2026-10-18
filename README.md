# MiniShop NTU

**Phiên bản hiện tại: 1.1.0** — xem `docs/GhiChuPhatHanh-v1.1.md`. Tài liệu yêu cầu áp dụng: `docs/SRS-MiniShop-v1.2.md`.

Ứng dụng web mẫu dùng xuyên suốt 6 buổi thực hành học phần **Kiểm thử phần mềm (SOT357)**, Khoa Công nghệ Thông tin, Trường Đại học Nha Trang.

> Đây là ứng dụng **dạy học**. Hệ thống **có chủ đích chứa lỗi** để sinh viên luyện tập phát hiện. Không sử dụng cho mục đích thực tế.

> **Nộp bài:** mọi bài thực hành được nộp bằng Pull Request, xem [`docs/HuongDanNopBai-PullRequest.md`](docs/HuongDanNopBai-PullRequest.md).

## 1. Yêu cầu phần mềm

| Phần mềm | Phiên bản | Kiểm tra bằng lệnh |
|---|---|---|
| Node.js (bản LTS) | **18.18 trở lên** (khuyến nghị 20 hoặc 22) | `node -v` |
| npm | đi kèm Node.js | `npm -v` |
| Git | bất kỳ bản gần đây | `git --version` |
| Visual Studio Code | bản mới | — |
| Tiện ích ESLint cho VS Code | của Microsoft (`dbaeumer.vscode-eslint`) | — |
| Trình duyệt cho Playwright (từ Buổi 5) | tải bằng `npx playwright install chromium` | `npx playwright test tests/vi-du-e2e` |

## 2. Cài đặt và chạy

```bash
# 1. Lấy mã nguồn (thay <URL> bằng đường dẫn giảng viên cung cấp)
git clone <URL> minishop-ntu
cd minishop-ntu

# 2. Cài thư viện
npm install

# 3. Chạy ứng dụng
npm start
```

Mở trình duyệt tại **http://localhost:3000**. Để dừng server, nhấn `Ctrl + C` trong terminal.

Kiểm tra nhanh API: mở http://localhost:3000/api/health, kết quả đúng là `{"status":"ok",...}`.

### Tài khoản mẫu

| Email | Mật khẩu | Loại thành viên |
|---|---|---|
| sv@ntu.edu.vn | Matkhau123 | Thường |
| vip@ntu.edu.vn | Matkhau123 | VIP |

Dữ liệu lưu trong bộ nhớ: **khởi động lại server là mọi dữ liệu trở về ban đầu** (tài khoản bị khóa cũng được mở lại).

## 3. Các lệnh thường dùng

| Lệnh | Tác dụng |
|---|---|
| `npm start` | Chạy ứng dụng ở cổng 3000 |
| `npm run lint` | Phân tích tĩnh toàn bộ dự án bằng ESLint |
| `npm run lint:lab` | Phân tích tĩnh riêng thư mục bài tập `src/lab-static` |
| `npm test` | Chạy toàn bộ ca kiểm thử đơn vị (Jest) |
| `npm run coverage` | Chạy kiểm thử kèm đo bao phủ, báo cáo ở `coverage/lcov-report/index.html` |
| `npm run test:watch` | Tự chạy lại mỗi khi lưu file |
| `npm run e2e` | Chạy bộ kiểm thử tự động giao diện (Playwright) |
| `npm run e2e:report` | Mở báo cáo HTML của lần chạy E2E gần nhất |
| `npm run e2e:codegen` | Ghi thao tác trên trình duyệt thành mã kiểm thử |

Đổi cổng khi cổng 3000 bị chiếm:
- Command Prompt: `set PORT=3001 && npm start`
- PowerShell: `$env:PORT=3001; npm start`
- macOS/Linux: `PORT=3001 npm start`

## 4. Cấu trúc thư mục

```
minishop-ntu/
├── .github/               Mẫu Pull Request + kiểm tra tự động (GitHub Actions)
├── docs/                  Tài liệu: SRS, đề bài từng buổi, hướng dẫn nộp bài
├── bai-nop/               Mẫu bài nộp (sinh viên điền vào)
├── scripts/               Script kiểm tra bài nộp (không sửa)
├── tests/
│   ├── vi-du/             Ví dụ minh họa Jest (không sửa)
│   ├── helpers/           Tiện ích đọc dữ liệu kiểm thử (không sửa)
│   ├── unit/              Ca kiểm thử đơn vị do sinh viên viết
│   ├── vi-du-e2e/         Ví dụ minh họa Playwright (không sửa)
│   ├── pages/             Page Object cho các màn hình
│   └── e2e/               Ca kiểm thử đầu cuối do sinh viên viết
├── playwright.config.js   Cấu hình Playwright (không sửa)
├── public/                Giao diện web (HTML, CSS, JS)
├── src/
│   ├── server.js          Máy chủ Express + REST API
│   ├── data/store.js      Dữ liệu mẫu (trong bộ nhớ)
│   ├── services/          Nghiệp vụ: đăng ký, đăng nhập, giỏ hàng, phí vận chuyển
│   └── lab-static/        Mã nguồn dùng cho bài tập phân tích tĩnh (Buổi 1)
├── eslint.config.js       Cấu hình ESLint
└── package.json
```

## 5. REST API

| Phương thức | Đường dẫn | Mô tả | Cần đăng nhập |
|---|---|---|---|
| GET | `/api/health` | Kiểm tra trạng thái | Không |
| GET | `/api/products` | Danh sách sản phẩm; hỗ trợ lọc qua tham số `tuKhoa`, `danhMuc`, `khoangGia`, `sapXep`, `conHang` (FR-06) | Không |
| POST | `/api/register` | Đăng ký `{fullName, email, age, password}` | Không |
| POST | `/api/login` | Đăng nhập `{email, password}` → trả về `token` | Không |
| GET | `/api/cart` | Xem giỏ hàng | Có |
| POST | `/api/cart` | Thêm/cập nhật `{productId, qty}` | Có |
| DELETE | `/api/cart/:productId` | Xóa sản phẩm khỏi giỏ | Có |
| POST | `/api/shipping-fee` | Tính phí `{zone: "noi-thanh" \| "ngoai-thanh"}` | Có |
| POST | `/api/orders` | Đặt hàng `{zone}` | Có |
| GET | `/api/orders` | Danh sách đơn của tôi | Có |
| DELETE | `/api/orders/:id` | Hủy đơn | Có |

Các API cần đăng nhập nhận header `Authorization: Bearer <token>`.

## 6. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `'node' is not recognized...` | Cài lại Node.js, đóng và mở lại terminal/VS Code |
| PowerShell báo `running scripts is disabled on this system` | Dùng Command Prompt, hoặc chạy `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `EADDRINUSE: address already in use :::3000` | Đang có server khác chạy: tắt terminal cũ hoặc đổi cổng (mục 3) |
| `npm install` báo lỗi mạng/`ETIMEDOUT` | Kiểm tra Internet/proxy của phòng máy, báo giảng viên để nhận gói cài đặt ngoại tuyến |
| ESLint báo `Could not find config file` | Phải chạy lệnh trong thư mục gốc `minishop-ntu` |
| Tiếng Việt bị lỗi font trong terminal Windows | Chạy `chcp 65001` trước |
