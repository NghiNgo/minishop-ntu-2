# BUOI 6 - TONG KET CHUOI SAU BUOI THUC HANH

- **Ho ten:**
- **MSSV:** 65133295
- **Duong dan repo:** https://github.com/thaoptt65cntt-spec/sot357-65133295

## 1. Ho so kiem thu da xay dung

| Buoi | San pham | Vi tri trong repo | So luong |
|---|---|---|---|
| 1 | Review SRS va phan tich tinh | bai-nop/Buoi01-*; src/lab-static | 12 loi/tai lieu va ma da phan tich |
| 2 | Bo ca thiet ke | bai-nop/Buoi02-* | Xem bao cao du lieu/TestCase |
| 3 | Kiem thu don vi | tests/unit; tests/vi-du | 12 ca dat trong Jest chinh |
| 4 | Test plan, xac nhan, hoi quy | bai-nop/Buoi04-* | It nhat 4 issue hien huu |
| 5 | Kiem thu E2E/Page Object | tests/e2e; tests/pages | 11 ca E2E o thu muc e2e |
| 6 | API va pipeline CI | tests/api; .github/workflows; bai-nop/Buoi06-* | 20 ca API |

## 2. Ban do loi theo tang kiem thu

| Loi | Review tinh | Don vi | API | E2E | Thu cong/tham do |
|---|---|---|---|---|---|
| Chap nhan tuoi duoi gioi han | X | X | | X | |
| Mat khau 8 ky tu bi tu choi | X | X | | | |
| Mat khau chu in hoa bi tu choi | X | X | | | |
| Gio hang cong don khi cap nhat | | X | X | X | |
| Tai khoan tu mo khoa qua som | X | X | | | |
| Huy duoc don cua tai khoan khac | | | X | | |
| Tong tien thieu phi van chuyen | | | X | X | |
| Sap xep gia giam dan khong hoat dong | | | X | X | X |
| Loc chi con hang khong hoat dong | | | X | X | X |
| **Tong so dau theo tang** | 4 | 4 | 5 | 5 | 2 |

### 2.1. Nhận xét

**2.1.1.** Lỗi chỉ tài khoản hủy đơn của người khác chỉ có API phát hiện trực tiếp vì giao diện không lộ luồng này; nếu bỏ API, lỗi có thể phát hành tới môi trường production. Lỗi hủy trạng thái và phân quyền là lớp riêng.

**2.1.2.** Tầng API phát hiện 5 lỗi; nhưng E2E cũng phát hiện 5 ở bản đồ. Mỗi tầng có giá trị riêng, không tồn tại một tầng duy nhất quan trọng nhất.

**2.1.3.** Tỷ lệ ca trong repo: đơn vị khoảng 12, API 20, E2E 11 (hoặc 41 nếu tính toàn bộ testMatch). Tháp kiểm thử lý tưởng nghiêng về đơn vị và giữ ít API/E2E hơn; E2E hiện có TODO/skip nên chưa tăng ca manh.

## 3. Chi phi va gia tri cua tung tang

| Tang | So ca | Thoi gian chay (do that) | Thoi gian viet (uoc luong) | Loi rieng tang nay phat hien |
|---|---|---|---|---|
| Review tinh | Khong phai ca | | 2 gio | 2 |
| Don vi | 12 dat | 0,925 giay | 4 gio | 1 |
| API | 20 | 9,1 giay | 2,5 gio | 2 |
| E2E | 11 | 12,5 giay | 4 gio | 1 |
| Thu cong/tham do | Khong co so ca co dinh | Chua ghi thoi gian tren lan chay | 2 gio | 1 |

**3.1.** Với một nửa thời gian, ưu tiên giữ API, review tinh/rui ro va mot so don vi; sau do là E2E cho luong nghiep vu then chot. Ly do: API chi 9,1 giay phat hien loi phan quyen va 4 loi HTTP; đơn vị nhanh va bat duoc loigiá tri.

**3.2.** Nếu chỉ còn 10 ca, viết ở API vì lớp này có thời gian chạy 9,1 giây, phát hiện lỗi phân quyền không qua được Unit/E2E và kiểm mã trạng thái/tác dụng phụ trực tiếp.

## 4. Danh gia chat luong va khuyen nghi phat hanh

### 4.1. Doi chieu tieu chi ket thuc

| Tieu chi ket thuc (nguyen van Buoi 4) | Trang thai hien tai | Dat/Khong dat |
|---|---|---|
| Tat ca loi nghiêm trọng va cao da duoc sua | Van con loi phan quyen/tong tien | Không đạt |
| Bo ca hoi quy chay dat | Unit co 1 suite CSV loi; API 4/20, E2E 3/11 đỏ | Không đạt |
| Phu tat ca mui nghiep vu rui ro cao | API da phu login/cart/order/filter | Chưa đủ |
| Co tai lieu va ban giao hien vat | Bao cao Buoi 6 dang hoan thien | Chưa đủ hoàn toàn |

### 4.2. Tom tat tinh trang chat luong

API chay 20 ca: 16 dat, 4 đỏ; E2E directory chay 11 ca: 2 dat, 3 đỏ, 6 bỏ/TODO; unit có 12 ca dat nhưng một suite CSV load thất bại. Lỗi nghiêm trọng nhất là phân quyền hủy đơn tài khoản khác, kèm lỗi tổng tiền và sắp xếp/lọc. Vùng rủi ro cao nhất là đặt hàng/chi phí và phân quyền.

### 4.3. Khuyen nghi

- **Kết luận:** không đủ điều kiện phát hành.
- **Căn cứ:** API 4 đỏ, E2E 3 đỏ và unit pipeline không sạch.
- **Việc làm trước:** 1) sửa kiểm tra chủ đơn và trả 404; 2) cộng phí vào tổng đơn; 3) sửa sắp xếp/lọc; 4) sửa suite CSV và bỏ/TODO còn lại trước khi mở release.

### 4.4. Ba viec tiep theo ve kiem thu

1. Bổ sung ca API cho các biên filter, zone và quyền.
2. Tự động hóa cửa sau đơn hàng và trạng thái hủy trong E2E.
3. Thêm đường mốc issue và gate CI bắt các ca mới đỏ nhưng không che ca cũ.

## 5. Tu danh gia

**5.1. Ba điều làm tốt nhất:** phân tầng kiểm thử rõ ràng, phát hiện lỗi bằng API thực, dùng đặc tả để phân loại lỗi.

**5.2. Ba điều làm khác nếu bắt đầu lại:** thiết kế dữ liệu 2 ca tổng tiền độc lập, hoàn thiện E2E TODO trước, lưu thời gian GitHub Actions ngay sau khi push.

**5.3. Kỹ thuật muốn học sâu hơn:** kiểm thử contract/API vì giúp phát hiện sai schema, mã trạng thái và tác dụng phụ trước UI.

## 6. Danh muc chuyen giao

### 6.1. Doc file

| Thu tu | File | Vi sao can doc |
|---|---|---|
| 1 | docs/SRS-MiniShop-v1.2.md | Đặc tả mong đợi |
| 2 | docs/Buoi06-DeBai.md | Quy trình buổi 6 |
| 3 | bai-nop/Buoi06-BaoCaoAPI-CI.md | Kết quả API/CI |
| 4 | bai-nop/Buoi06-TongKet.md | Kết luận phát hành |

### 6.2. Lenh

| Lenh | Ket qua mong doi |
|---|---|
| npm install | Cai dependencies |
| npm run api | 20 API, hiện tại 16 đạt/4 đỏ |
| npm test | 12 ca đạt Unit nhưng có suite CSV load lỗi phải xử lý |
| npx playwright test tests/e2e | Hiện tại 2 đạt/3 đỏ/6 TODO |
| node scripts/kiem-tra-buoi06.js | Kiểm tra hình thức bài nộp |

### 6.3. Ca dang do

4 API: phân quyền đơn hàng, total thiếu phí, sort giá giảm, lọc hết hàng. Unit: suite CSV load lỗi. E2E: danh sách 7 item, phí thành viên thường, lọc danh mục.

### 6.4. Xac nhan trang thai repo

- [ ] `npm run lint` chạy được
- [x] `npm test` đã chạy, 12 ca đơn vị đạt, 1 suite CSV lỗi
- [x] `npm run api` đã chạy, 20 ca, 4 đỏ
- [x] `npm run e2e` đã chạy qua Playwright, 11 ca E2E directory, 3 đỏ/6 skip/2 đạt
- [ ] Quy trình CI đã cấu hình đầy đủ và đã chạy ít nhất một lần
- [x] Mọi báo cáo Buoi 1 đến Buoi 6 đã có trong `bai-nop/`
