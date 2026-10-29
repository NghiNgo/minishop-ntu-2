# THỰC HÀNH BUỔI 6
# KIỂM THỬ API, TÍCH HỢP LIÊN TỤC VÀ TỔNG KẾT ĐỢT KIỂM THỬ
### Tài liệu hướng dẫn thực hành từng bước

**Học phần:** Kiểm thử phần mềm (SOT357) · **Thời lượng:** 3 giờ · **Hình thức:** Cá nhân
**Liên quan lý thuyết:** Chương 6 (Kiểm thử tự động), Chương 7 (Công cụ và xu hướng)
**Tài liệu gốc:** `docs/SRS-MiniShop-v1.2.md` · **Phần mềm:** MiniShop NTU v1.1.0

---

## BỐI CẢNH

Năm buổi trước đã dựng được một bộ kiểm thử nhiều tầng:

| Tầng | Buổi | Kiểm cái gì | Thời gian chạy |
|---|---|---|---|
| Kiểm thử tĩnh | 1 | Tài liệu và mã nguồn, chưa cần chạy | — |
| Thiết kế ca kiểm thử | 2 | Bộ ca hộp đen suy từ SRS | — |
| Kiểm thử đơn vị (Jest) | 3 | Từng hàm nghiệp vụ | Vài giây |
| Kiểm thử xác nhận và hồi quy | 4 | Bản vá v1.1, thủ công | Vài chục phút |
| Kiểm thử đầu cuối (Playwright) | 5 | Toàn luồng qua trình duyệt thật | Vài chục giây |

Giữa tầng đơn vị và tầng đầu cuối còn một khoảng trống. Tầng đơn vị gọi hàm trực tiếp, nên không kiểm được định tuyến, mã trạng thái HTTP và phân quyền. Tầng đầu cuối đi qua trình duyệt, nên chỉ chạm tới những gì giao diện cho phép làm — và giao diện MiniShop không có nút nào để một tài khoản thử hủy đơn hàng của tài khoản khác.

Buổi này lấp khoảng trống đó bằng **kiểm thử API**, sau đó đưa cả bộ bốn tầng vào một **quy trình tự động** chạy trên GitHub, phản biện một bộ ca do **Gen-AI** sinh ra, và cuối cùng **tổng kết toàn đợt kiểm thử** thành một khuyến nghị phát hành.

> Đây là buổi cuối của chuỗi thực hành. Phần 4 không giới thiệu kỹ thuật mới mà yêu cầu nhìn lại toàn bộ hiện vật của năm buổi trước, nên hãy mở sẵn các báo cáo cũ trong `bai-nop/`.

## CẤU TRÚC TÀI LIỆU

| Mục | Nội dung |
|---|---|
| **Cơ sở lý thuyết** | Tóm tắt kỹ thuật trong 5–6 dòng |
| **Ví dụ minh họa** | Mã nguồn mẫu đã chạy được, nằm trong `tests/vi-du-api/` |
| **Yêu cầu thực hiện** | Phần bài tập phải làm, kèm quy trình từng bước |
| **Tự kiểm tra trước khi tiếp tục** | Danh mục tự kiểm trước khi chuyển sang phần kế tiếp |

Ví dụ minh họa dùng một API quản lý sách thư viện nằm ngoài MiniShop, nhằm minh họa kỹ thuật mà không làm lộ đáp án.

## Mục tiêu

Sau buổi thực hành, sinh viên có khả năng:

1. Viết được ca **kiểm thử API** bằng fixture `request` của Playwright, kiểm đủ ba mức: mã trạng thái, cấu trúc phản hồi và giá trị nghiệp vụ.
2. Giải thích được **vì sao cần tầng API** bằng một lỗi mà hai tầng kia không thể phát hiện.
3. Dựng được một **quy trình tích hợp liên tục** chạy đủ bốn tầng kiểm thử trên GitHub Actions và lưu lại hiện vật.
4. Phân biệt `continue-on-error` và `if: always()`, và chọn đúng cấu hình cho một quy trình **báo cáo trung thực**.
5. **Phản biện** một bộ ca kiểm thử do Gen-AI sinh ra: phát hiện ca sai kết quả, ca thừa, ca không bao giờ thất bại và ca còn thiếu.
6. **Tổng kết** một đợt kiểm thử: lập bản đồ lỗi theo tầng phát hiện, đánh giá chi phí và giá trị của từng tầng, đưa ra khuyến nghị phát hành có căn cứ.

## CHUẨN BỊ TRƯỚC BUỔI HỌC — BẮT BUỘC

> **Phải làm ở nhà.** Buổi này cần GitHub Actions chạy được trên repo cá nhân. Lần chạy đầu tiên tải thư viện và trình duyệt mất khoảng 4–6 phút; không kịp làm trong giờ nếu chưa chuẩn bị.

```bash
git checkout main
git config pull.rebase false      # chỉ cần chạy một lần cho repo này
git pull --no-rebase upstream main
git push origin main
npm install
npx playwright install chromium
```

> **Vì sao phải có `--no-rebase`.** Nhánh `main` của repo cá nhân đã khác `main` của repo gốc, vì nó chứa các commit gộp từ `buoi-01` đến `buoi-05`. Khi hai nhánh đã rẽ nhau, Git từ bản 2.27 trở lên **từ chối** lệnh `git pull` trần và báo *fatal: Need to specify how to reconcile divergent branches*. Thêm `--no-rebase` là nói rõ: gộp hai lịch sử lại bằng một commit merge, giữ nguyên các commit cũ. Dòng `git config pull.rebase false` đặt sẵn lựa chọn đó cho repo, nên các lần sau chỉ cần `git pull upstream main`.

Kiểm tra đã sẵn sàng:

```bash
npx playwright test tests/vi-du-api
```

Kết quả đúng là **5 ca đạt**. Nếu lệnh này chạy được, máy đã sẵn sàng.

Ngoài ra, mở repo cá nhân trên GitHub, vào tab **Actions**. Nếu thấy dòng *"Workflows aren't being run on this forked repository"* hoặc Actions bị tắt, bật lên ở **Settings → Actions → General → Allow all actions**. Báo giảng viên **trước buổi học** nếu không bật được.

## Lịch trình

| Thời gian | Nội dung |
|---|---|
| 0:00 – 0:10 | **Bước 0.** Kiểm tra môi trường, tạo nhánh |
| 0:10 – 0:25 | Giảng viên trình bày ví dụ minh họa tầng API |
| 0:25 – 1:15 | **Phần 1.** Kiểm thử API (1A xác thực, 1B nghiệp vụ) |
| 1:15 – 1:25 | Nghỉ giải lao |
| 1:25 – 2:00 | **Phần 2.** Quy trình tích hợp liên tục |
| 2:00 – 2:30 | **Phần 3.** Phản biện bộ ca do Gen-AI sinh ra |
| 2:30 – 2:50 | **Phần 4.** Tổng kết đợt kiểm thử |
| 2:50 – 3:00 | Hoàn thiện báo cáo, mở Pull Request |

---

# BƯỚC 0. CHUẨN BỊ (10 phút)

## 0.1. Tạo nhánh làm bài

```bash
git checkout main
git pull --no-rebase upstream main
git push origin main
git checkout -b buoi-06
```

Nếu bước chuẩn bị ở nhà đã chạy `git config pull.rebase false` thì ở đây dùng `git pull upstream main` cũng được.

## 0.2. Những gì vừa được thêm vào repo

| Đường dẫn | Vai trò |
|---|---|
| `tests/vi-du-api/` | Ví dụ minh họa tầng API, **không sửa** |
| `tests/api/01-xac-thuc.spec.js` | Khung bài Phần 1A |
| `tests/api/02-nghiep-vu.spec.js` | Khung bài Phần 1B |
| `.github/workflows/kiem-thu-day-du.yml` | Khung bài Phần 2 |
| `docs/Buoi06-TestCaseDoAISinh.md` | Dữ liệu đầu vào Phần 3, **không sửa** |
| `tests/gen-ai/ai-sinh.test.js` | Bộ ca do Gen-AI sinh, đã chép sẵn để chạy |
| `bai-nop/Buoi06-BaoCaoAPI-CI.md` | Báo cáo Phần 1 và Phần 2 |
| `bai-nop/Buoi06-GenAI.md` | Báo cáo Phần 3 |
| `bai-nop/Buoi06-TongKet.md` | Báo cáo Phần 4 |

Các lệnh npm mới:

| Lệnh | Tác dụng |
|---|---|
| `npm run api` | Chạy toàn bộ ca kiểm thử API |
| `npm run test:ai` | Chạy riêng bộ ca do Gen-AI sinh ra |
| `npm run coverage:ai` | Chạy bộ ca đó kèm đo bao phủ `shipping.js` |

## 0.3. Hai thư mục, hai công cụ

| Thư mục | Công cụ | Phần mở rộng | Chạy bằng |
|---|---|---|---|
| `tests/unit/` | Jest | `*.test.js` | `npm test` |
| `tests/gen-ai/` | Jest | `*.test.js` | `npm run test:ai` |
| `tests/api/`, `tests/e2e/` | Playwright | `*.spec.js` | `npm run api`, `npm run e2e` |

Chú ý thư mục `tests/gen-ai/`: nó **bị loại khỏi `npm test`** một cách có chủ ý, qua `testPathIgnorePatterns` trong `package.json`. Lý do là nguyên tắc nghề: **một bộ ca chưa được kiểm chứng thì không được đưa vào quy trình tự động**. Nếu đưa vào, hai ca sai của nó sẽ làm quy trình báo đỏ vì lý do không liên quan đến sản phẩm, và báo động giả lặp lại nhiều lần sẽ khiến cả nhóm mất lòng tin vào quy trình. Phần 3 sẽ quay lại điểm này.

## 0.4. Tự kiểm tra trước khi tiếp tục

- [ ] `npx playwright test tests/vi-du-api` cho 5 ca đạt
- [ ] Đang ở nhánh `buoi-06` (`git branch --show-current`)
- [ ] Tab **Actions** trên repo cá nhân đã bật

---

# PHẦN 1. KIỂM THỬ API (50 phút)

## 1.1. Cơ sở lý thuyết

- **Kiểm thử API** gọi trực tiếp vào điểm cuối HTTP của hệ thống, không qua giao diện. Nhanh hơn kiểm thử đầu cuối khoảng mười lần và ổn định hơn, vì không phụ thuộc vào kết xuất trang.
- Một ca kiểm thử API đầy đủ phải khẳng định **ba mức**: (a) **mã trạng thái** HTTP; (b) **cấu trúc** thân phản hồi, nghĩa là có đủ trường và đúng kiểu; (c) **giá trị nghiệp vụ** bên trong, suy từ SRS.
- Chỉ kiểm mã trạng thái là không đủ: một điểm cuối trả về `200` kèm thân phản hồi sai vẫn là lỗi. Ngược lại, chỉ kiểm giá trị mà bỏ mã trạng thái sẽ bỏ sót trường hợp hệ thống trả về `200` cho một yêu cầu đáng lẽ phải bị từ chối.
- Ngoài phản hồi, còn phải kiểm **tác dụng phụ**: dữ liệu trong hệ thống đã thay đổi đúng như mong đợi hay chưa. Việc này cần một lời gọi API thứ hai để đọc lại trạng thái.
- Tầng API kiểm được những điều hai tầng kia không chạm tới: **phân quyền** (một tài khoản tác động lên dữ liệu của tài khoản khác), **dữ liệu sai định dạng** mà giao diện đã chặn trước, và **mã trạng thái** mà giao diện chuyển hết thành một thông báo chung.

## 1.2. Ví dụ minh họa

Mở `tests/vi-du-api/vi-du-api.spec.js`. Ví dụ dùng một API quản lý sách thư viện, tự khởi động trên cổng 3987.

```bash
npx playwright test tests/vi-du-api --reporter=list
```

Đọc kỹ ba điểm:

1. **Ca mẫu đầu tiên** kiểm đủ ba mức. Thử xóa dòng kiểm cấu trúc rồi đổi mã nguồn cho API trả về thiếu một trường: ca vẫn xanh. Đó là lý do mức (b) không được bỏ.
2. **Hai ca âm** kiểm `404` và `400`. Mỗi ca kiểm cả mã trạng thái và thông báo lỗi.
3. **Ca cuối** kiểm tác dụng phụ: sau khi mượn một quyển sách, ca gọi tiếp `GET` để xác nhận số lượng còn lại đã giảm. Nếu bỏ lời gọi thứ hai, một lỗi "trả về thành công nhưng không ghi dữ liệu" sẽ không bị phát hiện.

Cú pháp cần nhớ:

```javascript
const res = await request.post('/api/cart', {
  headers: { Authorization: `Bearer ${token}` },
  data: { productId: 3, qty: 2 },
});

expect(res.status()).toBe(200);        // mức (a)
const body = await res.json();
expect(body.cart.items).toHaveLength(1); // mức (b)
expect(body.cart.subtotal).toBe(100000); // mức (c)
```

## 1.3. Danh mục điểm cuối của MiniShop

| Phương thức | Đường dẫn | Cần token | Chức năng |
|---|---|---|---|
| `GET` | `/api/health` | Không | Kiểm tra máy chủ sống |
| `GET` | `/api/products` | Không | Danh sách sản phẩm, nhận tham số `tuKhoa`, `danhMuc`, `khoangGia`, `sapXep`, `conHang` |
| `POST` | `/api/register` | Không | Đăng ký tài khoản |
| `POST` | `/api/login` | Không | Đăng nhập, trả về `token` |
| `GET` | `/api/cart` | Có | Xem giỏ hàng |
| `POST` | `/api/cart` | Có | Thêm hoặc cập nhật sản phẩm trong giỏ |
| `DELETE` | `/api/cart/:productId` | Có | Xóa một sản phẩm khỏi giỏ |
| `POST` | `/api/shipping-fee` | Có | Báo giá phí vận chuyển cho giỏ hiện tại, nhận `{ zone }` |
| `POST` | `/api/orders` | Có | Tạo đơn hàng từ giỏ |
| `GET` | `/api/orders` | Có | Danh sách đơn hàng của chính mình |
| `DELETE` | `/api/orders/:id` | Có | Hủy đơn hàng |

Tài khoản mẫu: `sv@ntu.edu.vn` (loại `THUONG`) và `vip@ntu.edu.vn` (loại `VIP`), mật khẩu đều là `Matkhau123`.

## 1.4. Yêu cầu thực hiện

**Bước 1 — Phần 1A.** Mở `tests/api/01-xac-thuc.spec.js`. Ba ca đầu đã viết sẵn làm mẫu. Hoàn thành **TODO (1)** đến **TODO (4)**, rồi xóa khối giữ chỗ ở cuối file.

**Bước 2 — Phần 1B.** Mở `tests/api/02-nghiep-vu.spec.js`. Bốn ca đầu đã viết sẵn. Hoàn thành **TODO (5)** đến **TODO (12)**, rồi xóa khối giữ chỗ ở cuối file.

Tổng số ca sau khi làm xong phải **từ 12 ca trở lên**, phủ các mã trạng thái `400`, `401`, `404` và `423`.

**Bước 3 — Chạy và ghi kết quả.**

```bash
npm run api
```

Ghi số liệu và phân tích từng ca thất bại vào mục 1 và mục 2 của `bai-nop/Buoi06-BaoCaoAPI-CI.md`.

**Bước 4 — Trả lời câu hỏi then chốt.** Trong các ca vừa viết có **một ca mà cả Buổi 3 lẫn Buổi 5 đều không thể viết được**. Xác định đó là ca nào và giải thích ở mục 3 của báo cáo:

- vì sao kiểm thử đơn vị không viết được ca này;
- vì sao kiểm thử đầu cuối không viết được ca này;
- lỗi này có mức nghiêm trọng nào, và hậu quả gì nếu phát hành.

**Bước 5 — Một hiện tượng cần giải thích.** Ca ở TODO (7) và ca ở TODO (8) cùng kiểm công thức tổng tiền, nhưng kết quả hai ca khác nhau. Giải thích ở mục 4 của báo cáo: vì sao cùng một lỗi trong mã nguồn mà một ca phát hiện được, một ca thì không. Rút ra kết luận về cách chọn dữ liệu kiểm thử.

> Gợi ý: so sánh giá trị `shippingFee` của hai ca.

## 1.5. Tự kiểm tra trước khi tiếp tục

- [ ] `npm run api` chạy được, không còn lỗi cú pháp
- [ ] Không còn mục `TODO` nào trong hai file, đã xóa hai khối giữ chỗ
- [ ] Có từ 12 ca trở lên, phủ đủ bốn mã trạng thái
- [ ] Hai file **không** chứa `page.goto`, `page.getBy` hay `page.locator`
- [ ] Mỗi ca thất bại đều đã được đối chiếu với một mục trong SRS v1.2

---

# PHẦN 2. QUY TRÌNH TÍCH HỢP LIÊN TỤC (35 phút)

## 2.1. Cơ sở lý thuyết

- **Tích hợp liên tục (CI)** là việc chạy tự động toàn bộ bộ kiểm thử mỗi khi mã nguồn thay đổi, trên một máy sạch do hệ thống cấp, không phải máy của lập trình viên.
- Giá trị không nằm ở chỗ "chạy hộ", mà ở ba điều: kết quả **không phụ thuộc máy cá nhân**; lỗi hồi quy bị phát hiện **trong vài phút** thay vì tới đợt kiểm thử sau; và mọi lần chạy đều để lại **hiện vật** có thể tra lại.
- Trên GitHub, quy trình được mô tả bằng một file YAML trong `.github/workflows/`. Mỗi quy trình gồm các **job**, mỗi job gồm các **bước** chạy tuần tự.
- Mặc định, GitHub **dừng job ngay** khi một bước thất bại. Có hai cách xử lý, và chúng khác nhau về bản chất:
  - `continue-on-error: true` — bước thất bại được coi như thành công, **job vẫn xanh**. Dùng cho bước không mang tính quyết định, ví dụ phân tích tĩnh đang còn nợ kỹ thuật.
  - `if: always()` — bước **vẫn chạy** dù bước trước đã thất bại, nhưng **job vẫn đỏ**. Dùng cho các bước kiểm thử và bước lưu hiện vật.
- Một quy trình xanh trong khi sản phẩm còn lỗi là quy trình **nói dối**. Mục tiêu của buổi này là một quy trình **chạy đủ và báo đúng**, không phải một quy trình xanh.

## 2.2. Yêu cầu thực hiện

**Bước 1 — Hoàn thành khung.** Mở `.github/workflows/kiem-thu-day-du.yml`. Bốn bước đầu đã có. Hoàn thành **TODO (5a)** đến **TODO (5f)**.

Thứ tự các bước là bắt buộc: bước cài trình duyệt phải đứng **trước** hai bước chạy Playwright, vì máy ảo của GitHub không có trình duyệt sẵn.

**Bước 2 — Kiểm tra cú pháp trước khi đẩy.** YAML rất nhạy với thụt lề. Sai một dấu cách thì GitHub bỏ qua cả file và tab Actions không hiện gì, rất khó đoán nguyên nhân.

```bash
node -e "const y=require('fs').readFileSync('.github/workflows/kiem-thu-day-du.yml','utf8'); console.log(y.split('\n').filter(d=>/^\s+- name:/.test(d)).length + ' buoc')"
```

Lệnh trên đếm số bước đã khai báo. Kết quả đúng là **9 bước**.

**Bước 3 — Đẩy lên và quan sát.**

```bash
git add .github tests bai-nop
git commit -m "Buoi 6: kiem thu API va quy trinh tich hop lien tuc"
git push -u origin buoi-06
```

Mở tab **Actions** trên GitHub, bấm vào lần chạy vừa xuất hiện. Ghi vào mục 5 của báo cáo:

- tổng thời gian chạy;
- thời gian của từng bước;
- trạng thái cuối cùng của job;
- số ca thất bại ở từng tầng.

**Kết quả đúng là job ĐỎ.** MiniShop v1.1 còn lỗi thật, nên một quy trình trung thực phải báo đỏ. Điều cần kiểm là **mọi bước đều đã chạy** và **hiện vật đã được tải lên**, chứ không phải màu của job.

**Bước 4 — Lấy hiện vật.** Ở cuối trang kết quả, mục **Artifacts**, tải `bao-cao-kiem-thu` về. Giải nén và mở `api/index.html` và `e2e/index.html`. Ghi vào mục 6: hai thư mục có đúng hai báo cáo riêng biệt hay không, và nếu bỏ biến `PLAYWRIGHT_HTML_REPORT` thì điều gì xảy ra.

**Bước 5 — Lập đường mốc đỏ đã biết.** Trong thực tế, một đội không thể chờ hết lỗi mới bật CI. Họ lập một **đường mốc**: danh sách các ca đang đỏ đã được xác định nguyên nhân và đã có issue. Từ đó trở đi, chỉ ca đỏ **mới** mới là tín hiệu đáng báo động.

Lập bảng đường mốc ở mục 7, mỗi dòng gồm: tầng, tên ca, mã lỗi đã biết hoặc số issue Buổi 4.

**Bước 6 — Thực nghiệm: quy trình có bắt được lỗi mới không.** Đường mốc chỉ có giá trị nếu quy trình thật sự phát hiện được một ca **chuyển từ xanh sang đỏ**.

```bash
git checkout -b thu-ci
```

Chọn **một ca đang xanh** trong bộ của mình, rồi sửa mã nguồn trong `src/` sao cho đúng ca đó thất bại. Ví dụ: đổi hằng phí vận chuyển nội thành từ 20000 thành 25000.

```bash
git add src
git commit -m "Thu nghiem CI: co tinh gay loi de kiem tra quy trinh"
git push -u origin thu-ci
```

Quan sát lần chạy mới. Ghi vào mục 8: ca nào chuyển sang đỏ, số ca đỏ tăng từ bao nhiêu lên bao nhiêu, và quy trình mất bao lâu để báo.

Sau đó làm tiếp hai việc ở mục 8.3 và 8.4, quan trọng không kém:

- Chạy lại cả ba tầng tại máy và tìm những ca **đáng lẽ phải đỏ mà vẫn xanh**. Mở từng ca đó ra, đọc dòng khẳng định và giải thích vì sao nó không phát hiện được thay đổi vừa rồi.
- Từ đó kết luận: kết quả mong đợi của một ca kiểm thử nên suy từ **đặc tả** hay từ **mã nguồn**?

Sau khi ghi xong, **quay về nhánh làm bài và không gộp nhánh thử nghiệm**:

```bash
git checkout buoi-06
```

Nhánh `thu-ci` được giữ lại làm bằng chứng, **không mở pull request cho nhánh này**.

**Bước 7 — Trả lời ba câu ở mục 9 của báo cáo.**

1. Nếu đặt `continue-on-error: true` cho cả hai bước kiểm thử, job sẽ xanh. Vì sao đó là một cấu hình có hại, dù trông gọn gàng hơn?
2. Bước cài trình duyệt mất khoảng một phút mỗi lần chạy. Nêu một cách giảm thời gian này mà không bỏ bước đó.
3. Quy trình hiện chạy trên mọi lần đẩy ở mọi nhánh. Với một lớp 50 sinh viên cùng dùng một repo tổ chức, điều này gây ra vấn đề gì, và nên giới hạn thế nào?

## 2.3. Tự kiểm tra trước khi tiếp tục

- [ ] File YAML có đúng 9 bước, không còn mục `TODO`
- [ ] Tab Actions hiện lần chạy của nhánh `buoi-06`
- [ ] Mọi bước trong job đều đã chạy, không có bước nào bị bỏ qua
- [ ] Tải được `bao-cao-kiem-thu` và mở được hai báo cáo HTML riêng biệt
- [ ] Nhánh `thu-ci` đã đẩy lên và có một lần chạy riêng

---

# PHẦN 3. PHẢN BIỆN BỘ CA DO GEN-AI SINH RA (30 phút)

## 3.1. Cơ sở lý thuyết

- Công cụ Gen-AI sinh ca kiểm thử rất nhanh, nhưng nó **suy diễn từ văn bản mô tả**, không chạy thử mã nguồn. Vì vậy nó có thể khẳng định một hành vi mà hệ thống không có.
- Bốn dạng khuyết điểm thường gặp:
  - **Sai kết quả mong đợi** — ca mô tả một hành vi hợp lý nhưng hệ thống làm khác. Ca này đỏ, và người đọc dễ kết luận sai rằng sản phẩm có lỗi.
  - **Thừa** — nhiều ca cùng rơi vào một lớp tương đương. Chúng làm bộ ca dài ra mà không tăng khả năng bắt lỗi.
  - **Luôn xanh** — ca dùng khẳng định quá yếu, ví dụ `toBeDefined()` hay `toBeGreaterThanOrEqual(0)`. Ca này không bao giờ thất bại dù mã nguồn sai, nên vô giá trị, nhưng vẫn làm số ca và độ bao phủ trông đẹp.
  - **Thiếu** — những lớp tương đương và giá trị biên mà AI bỏ sót, thường là biên đúng tại ngưỡng và các tổ hợp điều kiện.
- Một ca luôn xanh vẫn **làm tăng độ bao phủ**. Đó là lý do độ bao phủ không bao giờ được dùng một mình để đánh giá chất lượng bộ kiểm thử.
- Vai trò của kiểm thử viên không phải nhận hay từ chối toàn bộ kết quả của AI, mà **phân loại từng ca** và nêu rõ phần còn thiếu.

## 3.2. Yêu cầu thực hiện

**Bước 1 — Đọc dữ liệu đầu vào.** Mở `docs/Buoi06-TestCaseDoAISinh.md`. File ghi lại câu lệnh đã dùng, 11 ca mà công cụ sinh ra và lời giải thích kèm theo của nó. Bộ ca này đã được chép sẵn vào `tests/gen-ai/ai-sinh.test.js`.

> Sinh viên có thể tự sinh một bộ ca khác bằng công cụ Gen-AI mình đang dùng, với cùng hàm `calcShippingFee`. Nếu chọn cách này, dán nguyên văn câu lệnh và kết quả vào mục 1 của báo cáo và phản biện bộ ca của mình. Số ca phải từ 8 trở lên.

**Bước 2 — Đối chiếu với đặc tả.** Mở `src/services/shipping.js` và mục FR-04 của `docs/SRS-MiniShop-v1.2.md`. Đọc từng ca AI sinh ra và **dự đoán** ca nào sẽ đỏ, **trước khi chạy**. Ghi dự đoán vào mục 2.

**Bước 3 — Chạy thử.**

```bash
npm run test:ai
```

Ghi kết quả thật vào mục 2, cạnh phần dự đoán.

**Bước 4 — Phân loại 11 ca.** Điền bảng ở mục 3 của `bai-nop/Buoi06-GenAI.md`. Mỗi ca nhận **đúng một** nhãn trong bốn nhãn: `ĐÚNG`, `SAI KẾT QUẢ`, `THỪA`, `LUÔN XANH`, kèm một dòng căn cứ.

Lưu ý khi phân loại:

- Một ca đỏ **không** tự động là `SAI KẾT QUẢ`. Phải đối chiếu mã nguồn và SRS để xác định bên nào sai: ca kiểm thử hay sản phẩm. Hai khả năng dẫn tới hai hành động hoàn toàn khác nhau.
- Một ca xanh **không** tự động là `ĐÚNG`. Ca luôn xanh cũng xanh.
- `THỪA` phải chỉ rõ nó trùng lớp tương đương với ca nào.

**Bước 5 — Chỉ ra phần còn thiếu.** Ở mục 4, liệt kê những lớp tương đương và giá trị biên mà AI bỏ sót, đối chiếu với bộ ca chính mình đã thiết kế ở Buổi 2. Mỗi dòng gồm: trường hợp thiếu, căn cứ trong SRS, hậu quả nếu không kiểm.

**Bước 6 — Kiểm chứng lời tuyên bố của AI.** Công cụ khẳng định bộ ca "đạt 100% độ bao phủ câu lệnh". Đo lại:

```bash
npm run coverage:ai
```

Ghi số đo thật vào mục 5, kèm số dòng chưa được phủ. So với lời tuyên bố và kết luận.

**Bước 7 — Ba kết luận.** Trả lời ở mục 6:

1. Trong 11 ca, bao nhiêu ca dùng được ngay, bao nhiêu phải sửa, bao nhiêu nên bỏ? Tính tỷ lệ dùng được.
2. Giữa hai việc — tự viết bộ ca từ đầu, và sửa bộ ca do AI sinh ra — việc nào mất ít công hơn cho hàm này? Trả lời có số liệu, không trả lời theo cảm nhận.
3. Mục 0.3 của tài liệu này đã loại `tests/gen-ai/` khỏi `npm test`. Sau khi phản biện xong, nêu điều kiện cụ thể để một bộ ca do AI sinh ra được phép đưa vào quy trình tự động.

## 3.3. Tự kiểm tra trước khi tiếp tục

- [ ] Bảng mục 3 có đủ 11 dòng, mỗi dòng đúng một nhãn kèm căn cứ
- [ ] Phần dự đoán ở mục 2 được ghi **trước** khi chạy, và giữ nguyên dù dự đoán sai
- [ ] Mục 4 nêu được ít nhất 3 trường hợp còn thiếu, có dẫn mục SRS
- [ ] Mục 5 có số đo bao phủ thật, không chép lại lời tuyên bố của AI

---

# PHẦN 4. TỔNG KẾT ĐỢT KIỂM THỬ (20 phút)

## 4.1. Cơ sở lý thuyết

- Kết thúc một đợt kiểm thử, kiểm thử viên phải trả lời được một câu duy nhất mà người quản lý cần: **sản phẩm này có nên phát hành hay không, và vì sao**.
- Câu trả lời phải dựa trên **tiêu chí kết thúc** đã đặt ra từ đầu đợt, không dựa trên cảm nhận về số lượng ca đã chạy.
- Một bộ kiểm thử nhiều tầng cần được đánh giá theo **giá trị biên của từng tầng**: tầng đó phát hiện được lỗi nào mà các tầng khác không phát hiện, và phải trả giá bao nhiêu về thời gian viết và thời gian chạy.
- **Bản đồ lỗi theo tầng phát hiện** là công cụ trực tiếp để làm việc đó: mỗi lỗi một dòng, mỗi tầng một cột. Một dòng chỉ có duy nhất một dấu cho thấy tầng ấy là tầng không thể thay thế đối với lỗi đó.

## 4.2. Yêu cầu thực hiện

Mở `bai-nop/Buoi06-TongKet.md`. Báo cáo này tổng hợp cả năm buổi, nên cần mở lại các báo cáo cũ trong `bai-nop/`.

**Bước 1 — Kiểm kê hiện vật.** Mục 1: liệt kê hiện vật kiểm thử đã tạo qua sáu buổi, mỗi dòng gồm loại hiện vật, số lượng, đường dẫn trong repo.

**Bước 2 — Bản đồ lỗi theo tầng.** Mục 2: bảng có 5 cột tương ứng 5 tầng (tĩnh, đơn vị, thủ công, đầu cuối, API) và một dòng cho mỗi lỗi đã phát hiện trong cả đợt. Đánh dấu `X` vào tầng đã phát hiện được lỗi đó. Phải điền **ít nhất 9 dấu**.

Sau bảng, trả lời: lỗi nào chỉ có **một** dấu `X`? Với mỗi lỗi như vậy, nếu bỏ tầng đó khỏi quy trình thì lỗi sẽ thoát ra tới đâu?

**Bước 3 — Chi phí và giá trị.** Mục 3: với mỗi tầng, ghi thời gian viết (ước lượng, theo giờ), thời gian chạy (đo thật), số lỗi riêng tầng đó phát hiện. Từ bảng này, nêu thứ tự ưu tiên nếu chỉ còn một nửa thời gian.

**Bước 4 — Đánh giá chất lượng và khuyến nghị phát hành.** Mục 4:

- dẫn lại tiêu chí kết thúc đã viết trong kế hoạch kiểm thử Buổi 4;
- đối chiếu từng tiêu chí với trạng thái hiện tại;
- kết luận **đủ** hay **không đủ** điều kiện phát hành;
- nếu không đủ, nêu danh sách việc phải làm trước, theo thứ tự.

Kết luận phải dẫn số liệu cụ thể. Một câu như "sản phẩm còn nhiều lỗi nên chưa nên phát hành" không được tính điểm.

**Bước 5 — Tự đánh giá.** Mục 5: ba điều đã làm tốt nhất trong đợt, ba điều sẽ làm khác nếu bắt đầu lại, và một kỹ thuật muốn học sâu hơn kèm lý do.

**Bước 6 — Danh mục chuyển giao.** Mục 6: giả định có người khác tiếp nhận công việc kiểm thử MiniShop. Ghi những gì người đó cần để bắt đầu trong vòng một giờ: đọc file nào, chạy lệnh nào, biết trước điều gì về các ca đang đỏ.

## 4.3. Tự kiểm tra trước khi tiếp tục

- [ ] Bản đồ lỗi có ít nhất 9 dấu `X`, và đã chỉ ra được lỗi chỉ một tầng phát hiện
- [ ] Mục 3 có thời gian chạy **đo thật**, không ước lượng
- [ ] Khuyến nghị phát hành dẫn được tiêu chí kết thúc và số liệu
- [ ] Danh mục chuyển giao đủ để người khác chạy lại bộ kiểm thử mà không cần hỏi

---

# NỘP BÀI

| Nội dung | Repo | Nhánh | Hạn |
|---|---|---|---|
| Toàn bộ Buổi 6 | `sot357-<MSSV>` | `buoi-06` | **Mở PR** trước khi kết thúc buổi; push bổ sung đến **23:59 cùng ngày** |

```bash
git checkout buoi-06
git add .github tests bai-nop
git commit -m "Buoi 6: kiem thu API, CI va tong ket dot kiem thu"
git push -u origin buoi-06
```

Mở Pull Request từ `buoi-06` vào `main` của repo cá nhân, tiêu đề `[Buổi 6] <MSSV> - <Họ tên>`. Trong phần mô tả PR, dán **đường dẫn tới lần chạy Actions của nhánh `buoi-06`** và **đường dẫn tới lần chạy của nhánh `thu-ci`**.

File được phép sửa: `tests/api/*.spec.js`, `tests/gen-ai/ai-sinh.test.js`, `.github/workflows/kiem-thu-day-du.yml`, `bai-nop/Buoi06-*.md`, `bai-nop/hinh/`.

**Không sửa** `src/`, `playwright.config.js`, `tests/helpers/`, `tests/vi-du-api/`, `docs/`.

> Ngoại lệ duy nhất: nhánh `thu-ci` ở Phần 2 **được phép** sửa `src/`, vì đó là mục đích của thực nghiệm. Nhánh `buoi-06` thì không, và cũng không gộp `thu-ci` vào bất kỳ nhánh nào.

Kiểm tra tự động sẽ chạy bộ ca API và soát hình thức ba báo cáo. **Ca thất bại do lỗi cài sẵn không bị tính là lỗi bài nộp**; kiểm tra chỉ báo đỏ khi còn mục `TODO`, thiếu số ca tối thiểu, thiếu bước trong quy trình CI, hoặc báo cáo chưa điền xong.

Chạy thử trước khi mở PR:

```bash
node scripts/kiem-tra-buoi06.js
```

## Bảng tra lỗi

| Thông báo | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `apiRequestContext.get: connect ECONNREFUSED` | Máy chủ chưa chạy | Dùng `npm run api`, để Playwright tự khởi động máy chủ |
| `Error: Process from config.webServer exited early` | Cổng 3000 đang bị chiếm | Tắt tiến trình `npm start` cũ, hoặc đóng terminal đang chạy MiniShop |
| `Không đặt lại được dữ liệu` | Chạy kiểm thử khi máy chủ khởi động thủ công | Dùng `npm run api` thay vì `npx playwright test` trên máy chủ tự bật |
| Ca đầu xanh, các ca sau đỏ hết | Thiếu `datLaiDuLieu` trong `beforeEach` | Kiểm tra lại khối `beforeEach` ở đầu file |
| `expect(received).toBe(expected)` với `received: undefined` | Đọc trường không tồn tại trong thân phản hồi | In thân phản hồi bằng `console.log(await res.json())` để xem cấu trúc thật |
| Tab Actions trống, không có lần chạy nào | File YAML sai cú pháp, hoặc Actions bị tắt | Kiểm tra thụt lề bằng dấu cách; bật Actions ở Settings |
| `Executable doesn't exist at ...` trong Actions | Thiếu bước cài trình duyệt, hoặc đặt sau bước chạy Playwright | Xem lại TODO (5b) và thứ tự các bước |
| Bước API và E2E chạy xong nhưng không có hiện vật | Thiếu `if: always()` ở bước tải lên | Xem lại TODO (5e) và TODO (5f) |
| Chỉ có một báo cáo HTML trong hiện vật | Hai tầng ghi cùng một thư mục | Đặt `PLAYWRIGHT_HTML_REPORT` khác nhau cho hai bước |
| `npm ci` lỗi `package-lock.json not found` trong Actions | Chưa commit `package-lock.json` | `git add package-lock.json` rồi commit lại |
| `npm run test:ai` báo `No tests found` | Chạy sai thư mục, hoặc đã xóa `tests/gen-ai/` | Khôi phục bằng `git checkout main -- tests/gen-ai` |
| `fatal: Need to specify how to reconcile divergent branches` | Nhánh `main` cá nhân đã rẽ khỏi `main` của repo gốc sau khi gộp các nhánh `buoi-0x` | `git pull --no-rebase upstream main`, hoặc đặt một lần `git config pull.rebase false` |
| `fatal: refusing to merge unrelated histories` | Repo cá nhân được tạo mới thay vì clone từ repo gốc | Báo giảng viên; không tự thêm `--allow-unrelated-histories` vì sẽ trộn hai cây thư mục khác nhau |
| `error: Your local changes would be overwritten by merge` | Còn thay đổi chưa commit khi kéo tài liệu mới về | `git stash`, kéo về, rồi `git stash pop` |

---

# THANG ĐIỂM (10 điểm)

| Phần | Tiêu chí | Điểm |
|---|---|---|
| 1 | Đủ từ 12 ca API, chạy được, phủ bốn mã trạng thái | 1,0 |
| 1 | Các ca kiểm đủ ba mức; ca TODO (4) kiểm cả tác dụng phụ | 1,0 |
| 1 | Mục 3: giải thích đúng vì sao hai tầng kia không phát hiện được lỗi FR-05.5 | 1,0 |
| 1 | Mục 4: giải thích đúng hiện tượng TODO (7) đỏ mà TODO (8) xanh | 0,5 |
| 2 | Quy trình đủ 9 bước, thứ tự đúng, báo cáo tách theo tầng | 1,0 |
| 2 | Dùng đúng `if: always()`, mọi bước đều chạy, hiện vật tải lên được | 1,0 |
| 2 | Đường mốc đỏ đã biết và thực nghiệm nhánh `thu-ci` có số liệu | 0,5 |
| 2 | Mục 8.3–8.4: tìm được ca đáng lẽ phải đỏ mà vẫn xanh, kết luận đúng | 0,5 |
| 2 | Mục 9: trả lời ba câu, phân biệt rõ hai cấu hình | 0,5 |
| 3 | Phân loại đủ 11 ca, nhãn đúng, có căn cứ | 1,0 |
| 3 | Nêu được phần còn thiếu, dẫn mục SRS; kiểm chứng được tuyên bố bao phủ | 0,5 |
| 4 | Bản đồ lỗi theo tầng đầy đủ, chỉ ra được tầng không thể thay thế | 1,0 |
| 4 | Khuyến nghị phát hành dẫn tiêu chí kết thúc và số liệu cụ thể | 0,5 |
| | **Tổng** | **10** |

**Trừ điểm quy trình nộp bài** (tối đa −1,0): giữ nguyên quy định Buổi 1. Sửa `src/` trên nhánh `buoi-06`, hoặc gộp nhánh `thu-ci` vào `buoi-06` hay `main`, bị trừ 2,0 điểm.
