# BUỔI 6 – BÁO CÁO KIỂM THỬ API VÀ TÍCH HỢP LIÊN TỤC

- **Họ tên:**
- **MSSV:** 65133295
- **Phiên bản phần mềm:** MiniShop NTU v1.1.0
- **Tài liệu yêu cầu:** SRS v1.2

---

# PHẦN 1 — KIỂM THỬ API

## 1. Tổng hợp kết quả

Chạy `npm run api`.

| Chỉ số | Giá trị |
|---|---|
| Tổng số ca API | 20 |
| Số ca đạt | 16 |
| Số ca thất bại | 4 |
| Thời gian chạy | 9,1 giây |

## 2. Danh mục ca đã viết và phân tích ca thất bại

### 2.1. Danh mục ca kiểm thử API

| Điểm cuối | Phương thức | Yêu cầu (SRS v1.2) | Mã trạng thái mong đợi | Kết quả |
|---|---|---|---|---|
| `/api/login` | POST | FR-02.3, FR-02.4 | 401 / 423 | Đạt (7 ca mẫu/xác thực) |
| `/api/cart` | GET | FR-03.1 | 401 | Đạt |
| `/api/cart` | POST/DELETE | FR-03.2, FR-03.3, FR-03.5, FR-03.6 | 200 / 400 / 404 | Đạt |
| `/api/orders` | POST | FR-05.1, FR-05.2 | 201 / 400 | 1 đỏ, 1 đạt |
| `/api/orders` | DELETE | FR-05.5 | 200 / 404 / 409 | 1 đỏ, 1 đạt |
| `/api/orders/:id` | DELETE | FR-05.5 phân quyền | 404 | Đỏ |
| `/api/products` | GET | FR-06.5, FR-06.6, FR-06.7 | 200 | 2 đỏ, 1 đạt |

### 2.2. Phân tích các ca thất bại

Phân loại nguyên nhân: **lỗi sản phẩm** / **ca kiểm thử sai** / **đặc tả chưa rõ**.

| Tên ca | Kết quả mong đợi | Kết quả thực tế | Phân loại nguyên nhân | Căn cứ (SRS v1.2) |
|---|---|---|---|---|
| Hủy đơn của tài khoản khác | 404 | Phản hồi 200; đơn của chủ tài khoản bị đổi trạng thái DA_HUY | Lỗi sản phẩm | FR-05.5 |
| Tổng tiền thành viên thường | `total = subtotal - discount + shippingFee = 370000` | Thực tế total = 350000 | Lỗi sản phẩm | FR-05.2 |
| Sắp xếp giá giảm dần | Giá giảm dần | Server trả giá tăng dần | Lỗi sản phẩm | FR-06.5 |
| Lọc chỉ còn hàng | Mọi phần tử stock > 0 | Trả thêm sản phẩm stock = 0 | Lỗi sản phẩm | FR-06.6 |

## 3. Lỗi chỉ phát hiện được ở tầng API

Buổi 3 kiểm thử ở mức hàm, Buổi 5 kiểm thử qua giao diện. Có lỗi mà cả hai tầng đều không chạm tới.

| Lỗi | Vì sao kiểm thử đơn vị không viết được ca này | Vì sao kiểm thử đầu cuối không viết được ca này | Ca API nào bắt được |
|---|---|---|---|
| Hủy đơn của tài khoản khác | Unit chỉ gọi hàm/token nghiệp vụ, không kiểm quyền tác động qua HTTP | E2E không có giao diện gửi yêu cầu thay tài khoản hủy đơn | `tài khoản không được hủy đơn hàng của tài khoản khác` |

**3.1.** Mức nghiêm trọng của lỗi này là CAO/NHIỀU TRỌNG: người dùng có thể thay đổi hoặc hủy đơn không thuộc quyền sở hữu. Nếu phát hành, dữ liệu đơn hàng có thể bị xóa ngoài ý chủ đơn, gây tranh chấp và mất uy tín.

**3.2.** Chỉ dựa vào một tầng kiểm thử sẽ bỏ sót các lỗi thuộc phân quyền, định dạng HTTP và tác dụng phụ qua API. Ba tầng bổ sung cho nhau chứ không thay thế nhau.

## 4. Hiện tượng hai ca cùng kiểm một công thức nhưng khác kết quả

Ca ở TODO (7) và ca ở TODO (8) đều kiểm công thức `total = subtotal − discount + shippingFee`.

| Mục | TODO (7) — thành viên THUONG | TODO (8) — thành viên VIP |
|---|---|---|
| `subtotal` | 350000 | 350000 |
| `discount` | 0 | 17500 |
| `shippingFee` | 20000 | 0 |
| `total` mong đợi | 370000 | 332500 |
| `total` thực tế | 350000 | 332500 |
| Kết quả ca | Đỏ | Xanh |

**4.1.** Lỗi nằm tại dòng tính `total` trong `src/server.js`: `total: detail.subtotal - discount` bỏ mất `shippingFee`. TODO (7) phát hiện vì thành viên thường có phí 20.000; TODO (8) lại xanh vì VIP có cả discount lẫn shippingFee = 0, hai giá trị tác động lên công thức triệt tiêu nhầm lẫn.

**4.2.** Phải chọn dữ liệu có sức phân biệt các thành phần phí: dữ liệu dựa trên biên đặc tả, không dùng dữ liệu tiện để mã nguồn cộng/gộp theo cách sai. Phải kiểm tổng riêng biệt thay vì kết luận từ một tổ hợp trùng giá trị.

---

# PHẦN 2 — QUY TRÌNH TÍCH HỢP LIÊN TỤC

## 5. Cấu trúc quy trình và lần chạy đầu tiên

### 5.1. Các bước đã khai báo

| Thứ tự | Tên bước | Lệnh hoặc action | Vì sao đặt ở vị trí này |
|---|---|---|---|
| 1 | Lấy mã nguồn | actions/checkout@v4 | Tạo môi trường làm việc sạch |
| 2 | Cài Node.js | actions/setup-node@v4, Node 20 | Đồng nhất runtime |
| 3 | Cài thư viện | npm ci | Cài đúng lockfile |
| 4 | Phân tích tĩnh | npm run lint | Chạy kiểm tra tĩnh; cảnh báo không che các bước khác |
| 5 | Kiểm thử đơn vị | npm test | Phát hiện lỗi hồi quy ở lớp hàm |
| 6 | Cài trình duyệt | npx playwright install --with-deps chromium | Chuẩn bị trình duyệt trước API/E2E |
| 7 | Kiểm thử API | npx playwright test tests/api | Chạy riêng tầng HTTP |
| 8 | Kiểm thử đầu cuối | npx playwright test tests/e2e | Chạy luồng qua giao diện |
| 9 | Tải báo cáo | actions/upload-artifact@v4 | Lưu hiện vật dù các bước trước đỏ |

### 5.2. Số liệu lần chạy trên nhánh `buoi-06`

| Mục | Giá trị |
|---|---|
| Đường dẫn tới lần chạy | Chưa có vì đây là môi trường máy cá nhân, chưa đẩy workflow lên GitHub |
| Tổng thời gian chạy | Chưa đo trên Actions |
| Thời gian bước cài thư viện | Chưa đo trên Actions |
| Thời gian bước cài trình duyệt | Chưa đo trên Actions |
| Thời gian bước kiểm thử đơn vị | Chưa đo trên Actions; local 0,925 giây |
| Thời gian bước kiểm thử API | Chưa đo trên Actions; local 9,1 giây |
| Thời gian bước kiểm thử đầu cuối | Chưa đo trên Actions; local 12,5 giây |
| Trạng thái cuối cùng của job | Mong đợi: ĐỎ; chờ lần chạy GitHub |
| Số ca thất bại: đơn vị / API / đầu cuối | Unit: 1 suite lỗi; API: 4; E2E: 3 |

**5.3.** Khi đẩy, các bước `always()` phải chạy kể cả khi npm test/API/E2E đỏ. Bước upload cũng phải chạy bằng `always()`.

**5.4.** Máy GitHub không có Chromium sẵn, nên Playwright API/E2E phải chạy sau bước cài trình duyệt. Kiểm thử đơn vị trước tạo nhanh tín hiệu từ lớp hẹp nhất; API/E2E sau kiểm mức tích hợp rộng hơn.

## 6. Hiện vật kiểm thử

| Mục | Nội dung |
|---|---|
| Tên gói hiện vật tải lên | `bao-cao-kiem-thu` |
| Các thư mục bên trong gói | `api/` và `e2e/` |
| Hai báo cáo HTML có riêng biệt không | Có, khi workflow dùng `PLAYWRIGHT_HTML_REPORT`/`PLAYWRIGHT_HTML_OUTPUT_DIR` riêng cho từng tầng |
| Nếu bỏ biến `PLAYWRIGHT_HTML_REPORT` thì điều gì xảy ra | Hai tầng dùng cùng thư mục mặc định `playwright-report` nên báo cáo sau ghi đè báo cáo trước |
| Vì sao bước tải lên phải có `if: always()` | Để lưu hiện vật kể cả khi bước kiểm thử trước thất bại |

Chèn ảnh chụp trang kết quả Actions vào `bai-nop/hinh/` và dẫn đường dẫn tại đây.

## 7. Đường mốc đỏ đã biết

Danh sách các ca đang đỏ đã xác định được nguyên nhân. Từ đường mốc này trở đi, chỉ ca đỏ **mới** là tín hiệu đáng báo động.

| Tầng | Tên ca | Nguyên nhân đã biết | Issue Buổi 4 hoặc mã lỗi |
|---|---|---|---|
| API | Hủy đơn tài khoản khác | Trả 200 thay 404 | FR-05.5 |
| API | Tổng tiền thiếu phí vận chuyển | total = subtotal - discount | FR-05.2 |
| API | Sắp xếp giá giảm dần | Mã server luôn sắp tăng | FR-06.5 |
| API | Chỉ còn hàng chứa sản phẩm hết hàng | Điều kiện stock >= 0 | FR-06.6 |
| E2E | Danh sách sản phẩm không đủ 7 item | Môi trường/fixture hiện thời | Lỗi Buổi 5 |
| E2E | Phí vận chuyển thành viên thường | Kết quả hiển thị không khớp mong đợi | FR-04.1 |
| E2E | Lọc danh mục đồ dùng học tập | Kết quả lọc chưa đúng | FR-06.3 |
| Đơn vị | Suite dữ liệu CSV không load | Thiếu dòng validateQuantity trong CSV | Buổi 3 |

**Tổng số ca đỏ ở đường mốc:** 8 ca đã biết / số ca thực tế trên lần chạy Actions

## 8. Thực nghiệm: quy trình có bắt được lỗi mới không

Nhánh `thu-ci`, cố ý sửa `src/` để làm một ca **đang xanh** chuyển sang đỏ.

| Mục | Nội dung |
|---|---|
| Đã sửa gì trong `src/` | Sẽ đổi phí nội thành từ 20.000đ thành 25.000đ trên nhánh `thu-ci` |
| Ca nào chuyển từ xanh sang đỏ | Ca API kiểm FR-05.2 của thành viên thường |
| Số ca đỏ: trước thực nghiệm → sau thực nghiệm | Chưa đo trên GitHub; kế hoạch là 4 → 5 ca API tại máy |
| Thời gian từ lúc push tới lúc biết kết quả | Chưa đo, còn phụ thuộc thời gian Actions |
| Đường dẫn tới lần chạy của nhánh `thu-ci` | Chưa có vì GitHub chưa cung cấp thông tin đăng nhập thành công |

**8.1.** Không lập đường mốc thì chỉ thấy tổng số ca đỏ tăng hoặc không tăng, không phân biệt được ca mới với ca đã biết. Vì vậy không thể xác định chất lượng thay đổi đang bị suy giảm.

**8.2.** Ca thuộc buổi 6, nằm tại `tests/api/02-nghiep-vu.spec.js` với tên "thanh viên thường tính tổng tiền đúng công thức".

**8.3.** Liệt kê những ca **đáng lẽ phải đỏ mà vẫn xanh** sau khi sửa mã nguồn. Với mỗi ca, mở ra đọc dòng khẳng định và giải thích vì sao nó không phát hiện được thay đổi.

> Gợi ý: nếu kết quả mong đợi của một ca được lấy từ chính mã nguồn, thì khi mã nguồn đổi, cả hai phía của phép so sánh đổi theo nhau.

**8.4.** Kết quả mong đợi phải suy từ SRS/đặc tả, không từ mã nguồn. Số cứng như 350000, 20000 là điều cần thiết khi số đó là biên đặc tả; không lấy kết quả mong đợi bằng cách gọi chính hàm đang kiểm thử.

> Nhắc lại: nhánh `thu-ci` **không** được gộp vào `buoi-06` hay `main`.

## 9. Câu hỏi phân tích

**9.1.** `continue-on-error` của ESLint cho phép bước đỏ được xem như không chặn job; áp dụng nó cho API/E2E làm job che dấu lỗi sản phẩm và giữ trạng thái xanh sai thực tế.

**9.2.** Dùng cache cho thư mục cache của Playwright sau khi đã cài phụ thuộc; giữ lại bước cài Chromium nhưng chạy từ cache khi lần cài trước hợp lệ.

**9.3.** Chạy mọi nhánh làm tăng runner, thời gian chờ và chi phí song song. Nên giới hạn push cho `buoi-*`, `main`, pull request vào `main`; nhánh cá nhân hoặc nhánh thử nghiệm có thể chạy thủ công hoặc theo nhịp thấp hơn.
