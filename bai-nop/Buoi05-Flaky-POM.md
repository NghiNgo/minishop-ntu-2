# BUỔI 5 – CA KIỂM THỬ FLAKY VÀ PAGE OBJECT MODEL

<!-- CHUA_DIEN: xóa dòng này sau khi đã điền xong file -->

- **Họ tên:**
- **MSSV:**

## 1. Ca kiểm thử flaky

### 1.1. Quan sát trước khi sửa

Chạy `npx playwright test tests/e2e/02-flaky --repeat-each=5` **trước khi sửa** và ghi lại.

| Ca kiểm thử | Số lần đạt / tổng số lần chạy | Thông báo lỗi khi thất bại |
|---|---|---|
| danh sách sản phẩm hiển thị đủ 7 mặt hàng | | |
| tính phí vận chuyển cho thành viên thường | | |

### 1.2. Nguyên nhân

| Ca kiểm thử | Dòng lệnh gây flaky | Vì sao nó không ổn định |
|---|---|---|
| | | |
| | | |

### 1.3. Cách sửa

| Ca kiểm thử | Đã thay bằng gì | Vì sao cách mới ổn định |
|---|---|---|
| | | |
| | | |

### 1.4. Xác nhận sau khi sửa

Chạy lại `npx playwright test tests/e2e/02-flaky --repeat-each=5`:

| Ca kiểm thử | Số lần đạt / tổng số lần chạy |
|---|---|
| | |
| | |

### 1.5. Câu hỏi phân tích

**1.5.1.** Playwright có tùy chọn `retries` để chạy lại ca thất bại. Vì sao cấu hình của học phần đặt `retries: 0`? Trong dự án thật, đặt `retries: 2` có phải cách tốt để xử lý ca flaky không?

**1.5.2.** Một ca flaky gây thiệt hại gì cho nhóm phát triển? Vì sao ca flaky nguy hiểm hơn ca luôn thất bại?

**1.5.3.** Ngoài độ trễ mạng, nêu **hai** nguyên nhân khác thường gây ra ca kiểm thử flaky.

## 2. Page Object Model

### 2.1. Các lớp đã xây dựng

| Lớp | Số locator | Số phương thức | Màn hình tương ứng |
|---|---|---|---|
| LoginPage | | | |
| ProductPage | | | |
| CartPage | | | |

### 2.2. So sánh trước và sau

Chọn **một** ca kiểm thử đã viết ở cả hai dạng (Phần 1 và Phần 3).

| Chỉ số | Bản ở Phần 1 (không POM) | Bản ở Phần 3 (có POM) |
|---|---|---|
| Số dòng trong thân ca kiểm thử | | |
| Số locator xuất hiện trong file spec | | |

Dán hai đoạn mã cạnh nhau:

```javascript
// Phần 1 — không dùng Page Object

```

```javascript
// Phần 3 — dùng Page Object

```

### 2.3. Kịch bản thay đổi giao diện

Giả sử lập trình viên đổi `data-testid="btn-login"` thành `data-testid="nut-dang-nhap"`.

| Câu hỏi | Trả lời |
|---|---|
| Nếu **không** dùng POM, phải sửa bao nhiêu chỗ trong bài của mình? | |
| Nếu **có** dùng POM, phải sửa bao nhiêu chỗ? | |

### 2.4. Câu hỏi phân tích

**2.4.1.** Vì sao Page Object **không được** chứa `expect()`? Điều gì xảy ra nếu đặt khẳng định vào trong Page Object?

**2.4.2.** Phương thức `dangNhapSaiNhieuLan()` trong `LoginPage` có chờ thông báo hiện ra sau mỗi lần bấm. Nếu bỏ phần chờ đó thì ca kiểm thử khóa tài khoản sẽ ra sao?

**2.4.3.** Bài này dùng `datLaiDuLieu()` để đặt lại dữ liệu trước mỗi ca. Liên hệ với kỹ thuật **mock** đã học ở Buổi 3: hai cách này giống và khác nhau ở điểm nào?
