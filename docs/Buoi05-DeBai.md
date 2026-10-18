# THỰC HÀNH BUỔI 5
# KIỂM THỬ TỰ ĐỘNG GIAO DIỆN VỚI PLAYWRIGHT
### Tài liệu hướng dẫn thực hành từng bước

**Học phần:** Kiểm thử phần mềm (SOT357) · **Thời lượng:** 3 giờ · **Hình thức:** Cá nhân
**Liên quan lý thuyết:** Chương 6 (Kiểm thử tự động)
**Tài liệu gốc:** `docs/SRS-MiniShop-v1.2.md` · **Phần mềm:** MiniShop NTU v1.1.0

---

## BỐI CẢNH

Ba buổi vừa qua đã xây được hai tầng kiểm thử:

| Tầng | Buổi | Kiểm cái gì | Tốc độ |
|---|---|---|---|
| Kiểm thử đơn vị (Jest) | 3 | Từng hàm nghiệp vụ, không cần trình duyệt | Vài giây |
| Kiểm thử thủ công | 2, 4 | Toàn hệ thống qua giao diện | Vài chục phút |

Tầng giữa còn trống: kiểm thử **toàn luồng, tự động, chạy trên trình duyệt thật**. Buổi này lấp chỗ trống đó bằng **Playwright**.

Mục tiêu cụ thể: những tổ hợp lọc sản phẩm mà Buổi 4 phải bấm tay từng cái, hôm nay sẽ chạy lại hết trong chưa tới một phút.

## CẤU TRÚC TÀI LIỆU

| Mục | Nội dung |
|---|---|
| **Cơ sở lý thuyết** | Tóm tắt kỹ thuật trong 5–6 dòng |
| **Ví dụ minh họa** | Mã nguồn mẫu đã chạy được, nằm trong `tests/vi-du-e2e/` |
| **Yêu cầu thực hiện** | Phần bài tập phải làm, kèm quy trình từng bước |
| **Tự kiểm tra trước khi tiếp tục** | Danh mục tự kiểm trước khi chuyển sang phần kế tiếp |

Ví dụ minh họa dùng một trang đăng ký lớp học phần nằm ngoài MiniShop, nhằm minh họa kỹ thuật mà không làm lộ đáp án.

## Mục tiêu

Sau buổi thực hành, sinh viên có khả năng:

1. Viết được ca kiểm thử **đầu cuối (E2E)** bằng Playwright chạy trên trình duyệt thật.
2. Chọn **locator** theo thứ tự ưu tiên, hiểu vì sao locator gần người dùng thì bền hơn.
3. Nhận diện và sửa **ca kiểm thử flaky** bằng web-first assertion.
4. Tổ chức bộ kiểm thử theo **Page Object Model**, tách locator khỏi logic nghiệp vụ.
5. Đọc **báo cáo HTML** và **Trace Viewer** để tìm nguyên nhân một ca thất bại.

## CHUẨN BỊ TRƯỚC BUỔI HỌC — BẮT BUỘC

> **Phải làm ở nhà.** Playwright cần tải trình duyệt riêng, dung lượng khoảng 150 MB. Nếu cả lớp cùng tải trong giờ, mạng phòng máy sẽ nghẽn và mất gần hết buổi học.

```bash
git checkout main
git pull upstream main
git push origin main
npm install
npx playwright install chromium      # tải trình duyệt, khoảng 150 MB
```

Kiểm tra đã sẵn sàng:

```bash
npx playwright test tests/vi-du-e2e
```

Kết quả đúng là **4 ca đạt, 1 ca bỏ qua**. Nếu lệnh này chạy được, máy đã sẵn sàng.

Nếu gặp lỗi, xem bảng xử lý sự cố ở cuối tài liệu và báo giảng viên **trước buổi học**, không đợi tới giờ.

## Lịch trình

| Thời gian | Nội dung |
|---|---|
| 0:00 – 0:10 | **Bước 0.** Kiểm tra môi trường, tạo nhánh |
| 0:10 – 0:25 | Giảng viên trình bày ví dụ minh họa và công cụ `codegen` |
| 0:25 – 1:05 | **Phần 1.** Tự động hóa ca kiểm thử ưu tiên Cao |
| 1:05 – 1:25 | **Phần 2.** Nhận diện và sửa ca flaky |
| 1:25 – 1:35 | Nghỉ giải lao |
| 1:35 – 2:15 | **Phần 3.** Page Object Model |
| 2:15 – 2:45 | **Phần 4.** Kiểm thử hồi quy FR-06 và đọc báo cáo |
| 2:45 – 3:00 | Hoàn thiện báo cáo, mở Pull Request |

---

# BƯỚC 0. CHUẨN BỊ (10 phút)

## 0.1. Tạo nhánh làm bài

```bash
git checkout main
git pull upstream main
git push origin main
git checkout -b buoi-05
```

## 0.2. Những gì vừa được thêm vào repo

| Đường dẫn | Vai trò |
|---|---|
| `playwright.config.js` | Cấu hình Playwright, **không sửa** |
| `tests/vi-du-e2e/` | Ví dụ minh họa, **không sửa** |
| `tests/helpers/dat-lai-du-lieu.js` | Đặt lại dữ liệu trước mỗi ca, **không sửa** |
| `tests/pages/LoginPage.js` | Page Object mẫu đã hoàn thiện |
| `tests/pages/ProductPage.js`, `CartPage.js` | Khung bài Phần 3 |
| `tests/e2e/01` đến `04` | Khung bài bốn phần |
| `bai-nop/Buoi05-BaoCaoE2E.md`, `Buoi05-Flaky-POM.md` | Hai báo cáo |

Các lệnh npm mới:

| Lệnh | Tác dụng |
|---|---|
| `npm run e2e` | Chạy toàn bộ ca E2E |
| `npm run e2e:report` | Mở báo cáo HTML của lần chạy gần nhất |
| `npm run e2e:codegen` | Mở công cụ ghi thao tác thành mã |
| `npx playwright test <đường-dẫn>` | Chạy riêng một file |
| `npx playwright test --headed` | Chạy có hiển thị trình duyệt |
| `npx playwright test --repeat-each=5` | Chạy lặp lại, dùng để phát hiện ca flaky |

## 0.3. Máy chủ tự khởi động

Không cần tự chạy `npm start`. Cấu hình Playwright tự bật MiniShop trước khi chạy và tự tắt sau khi xong.

Cấu hình cũng bật một điểm cuối đặc biệt `POST /api/test/reset` để đặt lại dữ liệu. Điểm cuối này chỉ hoạt động khi chạy kiểm thử, không tồn tại trên môi trường thật.

**Vì sao cần đặt lại dữ liệu:** MiniShop lưu giỏ hàng, đơn hàng và trạng thái khóa tài khoản trong bộ nhớ máy chủ. Nếu không đặt lại, một ca làm khóa tài khoản sẽ khiến các ca chạy sau thất bại, và kết quả phụ thuộc thứ tự chạy. Đây chính là vấn đề đã gặp ở Buổi 3 khi chưa dùng mock, nhưng lần này giải quyết bằng cách khác.

## 0.4. Tự kiểm tra trước khi tiếp tục

- [ ] `npx playwright test tests/vi-du-e2e` cho 4 ca đạt
- [ ] Đang ở nhánh `buoi-05` (`git branch --show-current`)

---

# PHẦN 1. TỰ ĐỘNG HÓA CA KIỂM THỬ ƯU TIÊN CAO (40 phút)

## 1.1. Cơ sở lý thuyết

- Ca kiểm thử E2E mô phỏng **người dùng thật**: mở trình duyệt, gõ, bấm, rồi kiểm tra kết quả hiển thị.
- Ba bước của một ca: **điều hướng** (`page.goto`), **thao tác** (`fill`, `click`, `selectOption`), **khẳng định** (`expect`).
- **Web-first assertion**: `await expect(locator).toHaveText(...)` tự thử lại liên tục cho tới khi đúng hoặc hết thời gian chờ. Nhờ đó không cần tự đoán thời gian chờ.
- Thứ tự ưu tiên khi chọn locator: `getByRole` → `getByLabel` → `getByText` → `getByTestId` → CSS → XPath. Càng gần cách người dùng nhìn thấy thì càng ít gãy khi giao diện đổi.

## 1.2. Ví dụ minh họa

Mở `tests/vi-du-e2e/vi-du.spec.js`, đọc **khối 1, 2 và 3**. Trang được kiểm thử là `trang-vi-du.html`, một biểu mẫu đăng ký lớp học phần nằm ngoài MiniShop.

Khối 2 cho thấy ba cách định vị cùng một nút, kèm nhận xét cách nào nên dùng và vì sao.

**Công cụ `codegen`:** chạy `npm run e2e:codegen` (cần mở `npm start` ở cửa sổ khác), thao tác trên trình duyệt và Playwright sẽ sinh mã tương ứng. Công cụ này hữu ích để tìm locator, nhưng mã nó sinh ra **thường dùng locator kém bền và thiếu khẳng định**, nên phải viết lại chứ không chép nguyên.

## 1.3. Yêu cầu thực hiện

Mở `tests/e2e/01-luong-chinh.spec.js`. Ca đầu tiên đã viết sẵn làm mẫu. Hoàn thành ba TODO.

**TODO (1) — FR-02.3: khóa tài khoản sau 3 lần đăng nhập sai**
- Đăng nhập sai mật khẩu 3 lần liên tiếp với `sv@ntu.edu.vn`;
- Khẳng định thông báo lần thứ ba nói rõ tài khoản bị khóa.

Lưu ý: mỗi lần bấm Đăng nhập là một yêu cầu mạng. Phải **chờ thông báo của lần trước hiện ra** rồi mới bấm lần kế tiếp.

**TODO (2) — FR-04.3: VIP miễn phí vận chuyển ở mọi khu vực**
- Đăng nhập bằng `vip@ntu.edu.vn`, thêm một sản phẩm vào giỏ;
- Chọn khu vực Ngoại thành, bấm Tính phí vận chuyển;
- Khẳng định phí hiển thị là 0đ.

Lưu ý: danh sách sản phẩm có độ trễ ngẫu nhiên, phải chờ bảng hiện ra trước khi thao tác với ô số lượng.

**TODO (3) — ca bảng quyết định tự chọn**
- Chọn một ca ưu tiên Cao thuộc nhóm `DT` trong bộ ca Buổi 2 **của mình**;
- Ghi mã ca Buổi 2 vào tên ca kiểm thử, ví dụ `TC-64130001-22 — FR-05.2: ...`.

Gợi ý: muốn kiểm tra **tổng tiền cuối cùng** thì phải bấm nút Đặt hàng, chứ dừng ở nút Tính phí vận chuyển là chưa đủ.

Viết xong mỗi ca thì xóa `.skip` và chạy:

```bash
npx playwright test tests/e2e/01-luong-chinh
```

**Sẽ có ca thất bại. Đó là điều được mong đợi** — MiniShop v1.1 vẫn còn lỗi. Không sửa mã nguồn trong `src/`, cũng không sửa kết quả mong đợi cho khớp hành vi hiện tại.

## 1.4. Tự kiểm tra trước khi tiếp tục

- [ ] Không còn `.skip` trong file
- [ ] Mỗi ca dùng `await expect(...)`, không dùng `waitForTimeout`
- [ ] Tên ca TODO (3) có chứa mã ca Buổi 2
- [ ] Chạy file hai lần liên tiếp cho kết quả **giống nhau**

---

# PHẦN 2. CA KIỂM THỬ FLAKY (20 phút)

## 2.1. Cơ sở lý thuyết

- **Flaky** là ca kiểm thử cho kết quả khác nhau giữa các lần chạy dù mã nguồn và dữ liệu không đổi.
- Nguyên nhân phổ biến nhất: ca kiểm thử **đoán** thời gian chờ thay vì chờ đúng điều kiện cần.
- Ca flaky nguy hiểm hơn ca luôn thất bại: nhóm phát triển dần quen với việc "chạy lại là xanh" và bỏ qua cả những ca đỏ thật.
- Cách sửa đúng là khẳng định vào **kết quả mong muốn** và để Playwright tự chờ, không phải tăng thời gian chờ cứng.

## 2.2. Ví dụ minh họa

Đọc **khối 4** trong `tests/vi-du-e2e/vi-du.spec.js`. Nút "Tải danh sách" của trang ví dụ trả kết quả sau độ trễ ngẫu nhiên 200–1700ms. Khối này có hai ca: cách sai dùng `waitForTimeout(800)` và cách đúng dùng web-first assertion.

Muốn tự quan sát hiện tượng, bỏ `.skip` ở ca "CÁCH SAI" rồi chạy:

```bash
npx playwright test tests/vi-du-e2e --repeat-each=5
```

## 2.3. Yêu cầu thực hiện

File `tests/e2e/02-flaky.spec.js` chứa hai ca flaky đã cho sẵn.

**Bước 1 — Quan sát trước khi sửa.** Chạy và ghi lại số lần đạt:

```bash
npx playwright test tests/e2e/02-flaky --repeat-each=5
```

Ghi kết quả vào mục 1.1 của `bai-nop/Buoi05-Flaky-POM.md`.

**Bước 2 — Tìm nguyên nhân.** Với mỗi ca, chỉ ra dòng lệnh gây flaky và giải thích vì sao. Ghi vào mục 1.2.

**Bước 3 — Sửa.** Hoàn thành **TODO (6a)** và **TODO (6b)**. Không được dùng `waitForTimeout`, cũng không được tăng thời gian chờ.

**Bước 4 — Xác nhận.** Chạy lại với `--repeat-each=5`, cả hai ca phải đạt 5/5. Ghi vào mục 1.4.

**Bước 5 — Trả lời ba câu phân tích** ở mục 1.5.

## 2.4. Tự kiểm tra trước khi tiếp tục

- [ ] Không còn `waitForTimeout` trong file
- [ ] Chạy `--repeat-each=5` cho 10/10 ca đạt
- [ ] Mục 1.5 đã trả lời đủ ba câu

---

# PHẦN 3. PAGE OBJECT MODEL (40 phút)

## 3.1. Cơ sở lý thuyết

- **Page Object Model (POM)** gom toàn bộ locator và thao tác của một màn hình vào một lớp riêng.
- Ca kiểm thử chỉ gọi phương thức của lớp đó, nên đọc như mô tả **nghiệp vụ** chứ không phải chuỗi thao tác kỹ thuật.
- Khi giao diện đổi, chỉ sửa một chỗ trong Page Object, mọi ca kiểm thử giữ nguyên.
- Quy tắc quan trọng: **Page Object không chứa `expect()`**. Khẳng định thuộc về ca kiểm thử, vì mỗi ca khẳng định một điều khác nhau trên cùng màn hình.

## 3.2. Ví dụ minh họa

Đọc `tests/pages/LoginPage.js` — Page Object đã hoàn thiện. Lớp này có:
- các locator khai báo trong `constructor`;
- phương thức `dangNhap()` gói trọn ba thao tác;
- phương thức `dangNhapSaiNhieuLan()` gói một kịch bản lặp, có chờ đúng cách giữa các lần.

Rồi đọc ca mẫu trong `tests/e2e/03-pom.spec.js` để thấy ca kiểm thử ngắn đi bao nhiêu.

## 3.3. Yêu cầu thực hiện

**Bước 1 — Hoàn thiện `tests/pages/ProductPage.js`**, các mục TODO (4a) đến (4e):
- bổ sung locator cho năm ô lọc và hai nút;
- `loc()` nhận một đối tượng tiêu chí, điền những tiêu chí được truyền rồi bấm Lọc và chờ kết quả;
- `danhSachTen()`, `danhSachGia()`, `danhSachTonKho()` trả về mảng theo đúng thứ tự trên màn hình.

Phương thức `chokKetQua()` đã viết sẵn, dùng làm mẫu cho cách chờ đúng. Gợi ý: `allTextContents()` trả về mảng nội dung của mọi phần tử khớp locator; giá hiển thị dạng `150.000đ` nên phải bỏ dấu chấm và chữ đ trước khi đổi sang số.

**Bước 2 — Hoàn thiện `tests/pages/CartPage.js`**, các mục TODO (5a) đến (5c).

**Bước 3 — Viết lại hai ca bằng Page Object**, các mục TODO (7) và (8) trong `tests/e2e/03-pom.spec.js`.

Trong file này **không được gọi** `page.getByTestId(...)` hay `page.locator(...)`. Mọi locator phải nằm trong `tests/pages/`.

**Bước 4 — Điền mục 2** của `bai-nop/Buoi05-Flaky-POM.md`, gồm bảng so sánh trước và sau, kịch bản đổi giao diện, và ba câu phân tích.

## 3.4. Tự kiểm tra trước khi tiếp tục

- [ ] `npx playwright test tests/e2e/03-pom` đạt toàn bộ
- [ ] Không còn locator trực tiếp trong file spec
- [ ] Page Object không chứa `expect()`
- [ ] Mỗi phương thức có thao tác bất đồng bộ đều chờ đúng cách

---

# PHẦN 4. KIỂM THỬ HỒI QUY FR-06 VÀ ĐỌC BÁO CÁO (30 phút)

## 4.1. Cơ sở lý thuyết

- Bộ kiểm thử E2E có giá trị nhất khi dùng làm **kiểm thử hồi quy**: chạy lại sau mỗi lần sửa mã để phát hiện hư hại.
- **Báo cáo HTML** cho biết ca nào đỏ, đỏ ở bước nào, kèm ảnh chụp màn hình tại thời điểm thất bại.
- **Trace Viewer** mạnh hơn: nó ghi lại toàn bộ phiên chạy, cho phép tua lại từng thao tác, xem ảnh chụp trước và sau mỗi bước, xem cả DOM và các yêu cầu mạng.

## 4.2. Yêu cầu thực hiện

**Bước 1 — Viết bộ ca FR-06.** Hoàn thành **TODO (9)** trong `tests/e2e/04-loc-san-pham.spec.js`, tối thiểu 5 ca tự viết, phủ các yêu cầu FR-06.2, FR-06.4, FR-06.5 (cả tăng dần và giảm dần), FR-06.6, FR-06.7.

Kết quả mong đợi dẫn từ SRS v1.2. Ở Buổi 4 nhiều tổ hợp đã được kiểm bằng tay; lần này viết lại thành mã để chạy lại được bất cứ lúc nào.

Gợi ý kiểm tra thứ tự sắp xếp mà không cần liệt kê từng giá:

```javascript
const gia = await trangSanPham.danhSachGia();
expect(gia).toEqual([...gia].sort((a, b) => a - b));   // tăng dần
```

**Bước 2 — Chạy toàn bộ bộ kiểm thử:**

```bash
npm run e2e
```

Ghi số liệu vào mục 1 của `bai-nop/Buoi05-BaoCaoE2E.md`, và so sánh thời gian với việc chạy tay ở Buổi 4.

**Bước 3 — Đọc báo cáo HTML:**

```bash
npm run e2e:report
```

**Bước 4 — Dùng Trace Viewer.** Chọn một ca thất bại, mở dấu vết bằng lệnh Playwright gợi ý ở cuối kết quả chạy:

```bash
npx playwright show-trace test-results/<thư-mục-ca-thất-bại>/trace.zip
```

Chụp màn hình Trace Viewer, lưu vào `bai-nop/hinh/`, và điền mục 6 của báo cáo.

**Bước 5 — Phân tích các ca thất bại.** Điền mục 5 của `Buoi05-BaoCaoE2E.md`, phân loại nguyên nhân giống Buổi 3 và Buổi 4. Mục 5.1 đối chiếu với lỗi đã phát hiện bằng tay ở Buổi 4.

## 4.3. Tự kiểm tra trước khi tiếp tục

- [ ] `npm run e2e` chạy được toàn bộ, tổng số ca từ 15 trở lên
- [ ] Mọi ca thất bại đều có dòng phân tích kèm mã yêu cầu
- [ ] Đã có ảnh chụp Trace Viewer trong `bai-nop/hinh/`
- [ ] `node scripts/kiem-tra-buoi05.js` báo đạt

---

# NỘP BÀI

| Nội dung | Repo | Nhánh | Hạn |
|---|---|---|---|
| Toàn bộ Buổi 5 | `sot357-<MSSV>` | `buoi-05` | **Mở PR** trước khi kết thúc buổi; push bổ sung đến **23:59 cùng ngày** |

```bash
git add tests bai-nop
git commit -m "Buoi 5: kiem thu tu dong giao dien voi Playwright"
git push -u origin buoi-05
```

File được phép sửa: `tests/e2e/*.spec.js`, `tests/pages/*.js`, `bai-nop/Buoi05-*.md`, `bai-nop/hinh/`.

**Không sửa** `src/`, `playwright.config.js`, `tests/helpers/`, `tests/vi-du-e2e/`.

Kiểm tra tự động sẽ chạy toàn bộ bộ E2E. **Ca thất bại do lỗi cài sẵn không bị tính là lỗi bài nộp**; kiểm tra chỉ báo đỏ khi còn TODO, còn `waitForTimeout`, còn locator trực tiếp trong file POM, hoặc thiếu số ca tối thiểu.

## Bảng tra lỗi

| Thông báo | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `Executable doesn't exist at ...` | Chưa tải trình duyệt | `npx playwright install chromium` |
| `browserType.launch: Host system is missing dependencies` | Thiếu thư viện hệ thống (Linux) | `npx playwright install --with-deps chromium` |
| `Error: Process from config.webServer exited early` | Cổng 3000 đang bị chiếm | Tắt tiến trình `npm start` cũ, hoặc đóng terminal đang chạy MiniShop |
| `Không đặt lại được dữ liệu` | Chạy kiểm thử khi máy chủ khởi động thủ công | Dùng `npm run e2e`, để Playwright tự khởi động máy chủ |
| Lệnh `--reporter=html` treo terminal | Playwright mở máy chủ xem báo cáo | Dùng `npm run e2e` rồi `npm run e2e:report`; thoát bằng `Ctrl + C` |
| `Chưa hoàn thành TODO (...)` | Page Object chưa hoàn thiện | Làm Phần 3 trước khi chạy Phần 4 |
| Ca lúc xanh lúc đỏ | Còn chờ cứng hoặc đọc giá trị quá sớm | Xem lại Phần 2 |
| `Timed out 5000ms waiting for expect(locator)` | Locator sai, hoặc phần tử chưa xuất hiện | Chạy `--headed` để nhìn trình duyệt, hoặc xem Trace Viewer |

---

# THANG ĐIỂM (10 điểm)

| Phần | Tiêu chí | Điểm |
|---|---|---|
| 1 | Ba ca E2E chạy được, dùng web-first assertion | 1,5 |
| 1 | Locator chọn hợp lý; ca TODO (3) dẫn đúng mã ca Buổi 2 | 1,0 |
| 2 | Sửa được hai ca flaky, chạy `--repeat-each=5` ổn định | 1,0 |
| 2 | Phân tích đúng nguyên nhân, trả lời ba câu ở mục 1.5 | 1,0 |
| 3 | `ProductPage` và `CartPage` hoàn chỉnh, chờ đúng cách, không chứa `expect()` | 1,5 |
| 3 | Hai ca viết lại theo POM, không còn locator trong file spec | 1,0 |
| 3 | Bảng so sánh trước và sau, trả lời ba câu ở mục 2.4 | 0,5 |
| 4 | Bộ ca FR-06 đủ 5 ca tự viết, phủ đúng các yêu cầu | 1,5 |
| 4 | Phân tích ca thất bại có căn cứ, đối chiếu được với Buổi 4 | 0,5 |
| 4 | Dùng được Trace Viewer, báo cáo mục 6 cụ thể | 0,5 |
| | **Tổng** | **10** |

**Trừ điểm quy trình nộp bài** (tối đa −1,0): giữ nguyên quy định Buổi 1. Sửa `src/` hoặc `playwright.config.js` bị trừ 2,0 điểm.
