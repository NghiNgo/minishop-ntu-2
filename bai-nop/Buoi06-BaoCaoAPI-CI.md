# BUỔI 6 – BÁO CÁO KIỂM THỬ API VÀ TÍCH HỢP LIÊN TỤC

<!-- CHUA_DIEN: xóa dòng này sau khi đã điền xong file -->

- **Họ tên:**
- **MSSV:**
- **Phiên bản phần mềm:** MiniShop NTU v1.1.0
- **Tài liệu yêu cầu:** SRS v1.2

---

# PHẦN 1 — KIỂM THỬ API

## 1. Tổng hợp kết quả

Chạy `npm run api`.

| Chỉ số | Giá trị |
|---|---|
| Tổng số ca API | |
| Số ca đạt | |
| Số ca thất bại | |
| Thời gian chạy | |

## 2. Danh mục ca đã viết và phân tích ca thất bại

### 2.1. Danh mục ca kiểm thử API

| Điểm cuối | Phương thức | Yêu cầu (SRS v1.2) | Mã trạng thái mong đợi | Kết quả |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

### 2.2. Phân tích các ca thất bại

Phân loại nguyên nhân: **lỗi sản phẩm** / **ca kiểm thử sai** / **đặc tả chưa rõ**.

| Tên ca | Kết quả mong đợi | Kết quả thực tế | Phân loại nguyên nhân | Căn cứ (SRS v1.2) |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |

## 3. Lỗi chỉ phát hiện được ở tầng API

Buổi 3 kiểm thử ở mức hàm, Buổi 5 kiểm thử qua giao diện. Có lỗi mà cả hai tầng đều không chạm tới.

| Lỗi | Vì sao kiểm thử đơn vị không viết được ca này | Vì sao kiểm thử đầu cuối không viết được ca này | Ca API nào bắt được |
|---|---|---|---|
| | | | |

**3.1.** Mức nghiêm trọng của lỗi này, và hậu quả cụ thể nếu phát hành:

**3.2.** Điều này nói lên điều gì về việc chỉ dựa vào một tầng kiểm thử duy nhất?

## 4. Hiện tượng hai ca cùng kiểm một công thức nhưng khác kết quả

Ca ở TODO (7) và ca ở TODO (8) đều kiểm công thức `total = subtotal − discount + shippingFee`.

| Mục | TODO (7) — thành viên THUONG | TODO (8) — thành viên VIP |
|---|---|---|
| `subtotal` | | |
| `discount` | | |
| `shippingFee` | | |
| `total` mong đợi | | |
| `total` thực tế | | |
| Kết quả ca | | |

**4.1.** Lỗi nằm ở dòng nào trong `src/server.js`? Vì sao cùng lỗi đó mà một ca phát hiện được, một ca thì không?

**4.2.** Kết luận về cách chọn dữ liệu kiểm thử:

---

# PHẦN 2 — QUY TRÌNH TÍCH HỢP LIÊN TỤC

## 5. Cấu trúc quy trình và lần chạy đầu tiên

### 5.1. Các bước đã khai báo

| Thứ tự | Tên bước | Lệnh hoặc action | Vì sao đặt ở vị trí này |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |

### 5.2. Số liệu lần chạy trên nhánh `buoi-06`

| Mục | Giá trị |
|---|---|
| Đường dẫn tới lần chạy | |
| Tổng thời gian chạy | |
| Thời gian bước cài thư viện | |
| Thời gian bước cài trình duyệt | |
| Thời gian bước kiểm thử đơn vị | |
| Thời gian bước kiểm thử API | |
| Thời gian bước kiểm thử đầu cuối | |
| Trạng thái cuối cùng của job | |
| Số ca thất bại: đơn vị / API / đầu cuối | |

**5.3.** Mọi bước đều đã chạy hay có bước bị bỏ qua? Nếu có, vì sao?

**5.4.** Vì sao bước cài trình duyệt phải đứng trước hai bước Playwright? Vì sao đặt kiểm thử đơn vị trước kiểm thử đầu cuối chứ không ngược lại?

## 6. Hiện vật kiểm thử

| Mục | Nội dung |
|---|---|
| Tên gói hiện vật tải lên | |
| Các thư mục bên trong gói | |
| Hai báo cáo HTML có riêng biệt không | |
| Nếu bỏ biến `PLAYWRIGHT_HTML_REPORT` thì điều gì xảy ra | |
| Vì sao bước tải lên phải có `if: always()` | |

Chèn ảnh chụp trang kết quả Actions vào `bai-nop/hinh/` và dẫn đường dẫn tại đây.

## 7. Đường mốc đỏ đã biết

Danh sách các ca đang đỏ đã xác định được nguyên nhân. Từ đường mốc này trở đi, chỉ ca đỏ **mới** là tín hiệu đáng báo động.

| Tầng | Tên ca | Nguyên nhân đã biết | Issue Buổi 4 hoặc mã lỗi |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

**Tổng số ca đỏ ở đường mốc:** …… / …… ca

## 8. Thực nghiệm: quy trình có bắt được lỗi mới không

Nhánh `thu-ci`, cố ý sửa `src/` để làm một ca **đang xanh** chuyển sang đỏ.

| Mục | Nội dung |
|---|---|
| Đã sửa gì trong `src/` | |
| Ca nào chuyển từ xanh sang đỏ | |
| Số ca đỏ: trước thực nghiệm → sau thực nghiệm | |
| Thời gian từ lúc push tới lúc biết kết quả | |
| Đường dẫn tới lần chạy của nhánh `thu-ci` | |

**8.1.** Nếu không lập đường mốc ở mục 7, có nhận ra được ca mới đỏ này giữa các ca đỏ cũ hay không? Vì sao?

**8.2.** Ca vừa chuyển sang đỏ được viết ở **buổi nào**? Nó nằm trong file nào?

**8.3.** Liệt kê những ca **đáng lẽ phải đỏ mà vẫn xanh** sau khi sửa mã nguồn. Với mỗi ca, mở ra đọc dòng khẳng định và giải thích vì sao nó không phát hiện được thay đổi.

> Gợi ý: nếu kết quả mong đợi của một ca được lấy từ chính mã nguồn, thì khi mã nguồn đổi, cả hai phía của phép so sánh đổi theo nhau.

**8.4.** Từ quan sát ở 8.3, kết quả mong đợi của một ca kiểm thử nên suy từ đâu? Số cứng trong ca kiểm thử là mùi mã xấu hay là điều cần thiết? Trả lời có dẫn ví dụ cụ thể từ repo của mình.

> Nhắc lại: nhánh `thu-ci` **không** được gộp vào `buoi-06` hay `main`.

## 9. Câu hỏi phân tích

**9.1.** `continue-on-error: true` ở bước ESLint nghĩa là gì? Nếu đặt nó cho cả hai bước kiểm thử thì job sẽ xanh — vì sao đó là một cấu hình có hại, dù trông gọn gàng hơn?

**9.2.** Bước cài trình duyệt mất khoảng một phút mỗi lần chạy. Nêu một cách giảm thời gian này mà **không** bỏ bước đó.

**9.3.** Quy trình hiện chạy trên mọi lần đẩy ở mọi nhánh. Với một lớp 50 sinh viên cùng dùng một repo tổ chức, điều này gây ra vấn đề gì, và nên giới hạn thế nào?
