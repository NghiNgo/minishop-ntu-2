# BUỔI 6 – TỔNG KẾT CHUỖI SÁU BUỔI THỰC HÀNH

<!-- CHUA_DIEN: xóa dòng này sau khi đã điền xong file -->

- **Họ tên:**
- **MSSV:**
- **Đường dẫn repo:**

## 1. Hồ sơ kiểm thử đã xây dựng

| Buổi | Sản phẩm | Vị trí trong repo | Số lượng |
|---|---|---|---|
| 1 | Phiếu review SRS, mã đã sửa theo ESLint | | …… lỗi tài liệu |
| 2 | Bộ ca kiểm thử thiết kế | | …… ca |
| 3 | Bộ kiểm thử đơn vị | | …… ca |
| 4 | Test plan, kết quả xác nhận và hồi quy, báo cáo lỗi | | …… issue |
| 5 | Bộ kiểm thử đầu cuối, Page Object | | …… ca |
| 6 | Bộ kiểm thử API, pipeline CI | | …… ca |

## 2. Bản đồ lỗi theo tầng kiểm thử

Với mỗi lỗi đã phát hiện trong cả khóa, ghi lại **tầng nào bắt được**. Đánh dấu `X` vào các cột tương ứng; một lỗi có thể bị bắt ở nhiều tầng. Phải điền **ít nhất 9 dấu `X`**.

Chín dòng đầu đã được ghi tên sẵn. Các dòng trống ở cuối dành cho những lỗi khác mà bản thân đã phát hiện trong cả đợt — kể cả lỗi tài liệu tìm được ở Buổi 1 và lỗi chỉ tầng đơn vị bắt được; thêm dòng nếu cần.

| Lỗi | Review tĩnh | Đơn vị | API | E2E | Thủ công / thăm dò |
|---|---|---|---|---|---|
| Chấp nhận tuổi dưới giới hạn | | | | | |
| Mật khẩu 8 ký tự bị từ chối | | | | | |
| Mật khẩu chữ in hoa bị từ chối | | | | | |
| Giỏ hàng cộng dồn khi cập nhật số lượng | | | | | |
| Tài khoản tự mở khóa quá sớm | | | | | |
| Hủy được đơn của tài khoản khác | | | | | |
| Tổng tiền thiếu phí vận chuyển | | | | | |
| Sắp xếp giá giảm dần không hoạt động | | | | | |
| Lọc "chỉ còn hàng" không hoạt động | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |
| **Tổng số dấu theo tầng** | | | | | |

### 2.1. Nhận xét

**2.1.1.** Lỗi nào **chỉ** bắt được ở một tầng duy nhất? Lập bảng, mỗi dòng gồm: lỗi, tầng duy nhất bắt được, và hậu quả nếu bỏ tầng đó khỏi chiến lược kiểm thử.

**2.1.2.** Tầng nào bắt được nhiều lỗi nhất? Có phải tầng đó quan trọng nhất không? Giải thích.

**2.1.3.** Đối chiếu với **tháp kiểm thử** (Chương 6): tỷ lệ số ca giữa ba tầng trong repo của mình là bao nhiêu? Tỷ lệ đó có hợp lý không?

## 3. Chi phí và giá trị của từng tầng

Thời gian chạy phải **đo thật**, không ước lượng. Cột cuối đếm số lỗi mà **chỉ** tầng đó phát hiện được, lấy từ bản đồ ở mục 2.

| Tầng | Số ca | Thời gian chạy (đo thật) | Thời gian viết (ước lượng, giờ) | Số lỗi riêng tầng này bắt được |
|---|---|---|---|---|
| Review tĩnh | | | | |
| Đơn vị | | | | |
| API | | | | |
| E2E | | | | |
| Thủ công / thăm dò | | | | |

**3.1.** Nếu đợt kiểm thử chỉ còn **một nửa** thời gian, thứ tự ưu tiên giữ lại các tầng là gì? Căn cứ vào bảng trên, không căn cứ vào cảm nhận.

**3.2.** Nếu chỉ còn thời gian viết thêm 10 ca kiểm thử cho MiniShop, sẽ viết ở tầng nào? Vì sao?

## 4. Đánh giá chất lượng và khuyến nghị phát hành

Trả lời như một kiểm thử viên báo cáo với quản lý dự án. Mọi kết luận phải dẫn số liệu. Một câu như "sản phẩm còn nhiều lỗi nên chưa nên phát hành" không được tính điểm.

### 4.1. Đối chiếu tiêu chí kết thúc

Dẫn lại tiêu chí kết thúc đã viết trong kế hoạch kiểm thử Buổi 4 (`bai-nop/Buoi04-TestPlan.md`).

| Tiêu chí kết thúc (nguyên văn Buổi 4) | Trạng thái hiện tại | Đạt / Không đạt |
|---|---|---|
| | | |
| | | |
| | | |
| | | |

### 4.2. Tóm tắt tình trạng chất lượng

Năm đến bảy dòng: còn bao nhiêu lỗi mở, mức nghiêm trọng cao nhất, vùng chức năng rủi ro nhất.

### 4.3. Khuyến nghị

- **Kết luận:** đủ / không đủ điều kiện phát hành
- **Căn cứ:**
- **Nếu không đủ, danh sách việc phải làm trước, theo thứ tự:**

### 4.4. Ba việc nên làm tiếp theo về mặt kiểm thử nếu dự án tiếp tục

## 5. Tự đánh giá

**5.1.** Ba điều đã làm tốt nhất trong cả đợt:

**5.2.** Ba điều sẽ làm khác nếu bắt đầu lại:

**5.3.** Một kỹ thuật muốn học sâu hơn, kèm lý do:

## 6. Danh mục chuyển giao

Giả định có người khác tiếp nhận công việc kiểm thử MiniShop. Ghi những gì người đó cần để bắt đầu làm việc trong vòng **một giờ**.

### 6.1. Cần đọc gì, theo thứ tự

| Thứ tự | File | Vì sao cần đọc |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |

### 6.2. Cần chạy lệnh nào

| Lệnh | Kết quả mong đợi |
|---|---|
| | |
| | |
| | |
| | |

### 6.3. Cần biết trước điều gì về các ca đang đỏ

### 6.4. Xác nhận trạng thái repo khi bàn giao

- [ ] `npm run lint` chạy được
- [ ] `npm test` chạy được, số ca đơn vị: …… , số ca đỏ: ……
- [ ] `npm run api` chạy được, số ca: …… , số ca đỏ: ……
- [ ] `npm run e2e` chạy được, số ca: …… , số ca đỏ: ……
- [ ] Quy trình CI đã cấu hình đầy đủ và đã chạy ít nhất một lần
- [ ] Mọi báo cáo từ Buổi 1 đến Buổi 6 đều có trong `bai-nop/`
