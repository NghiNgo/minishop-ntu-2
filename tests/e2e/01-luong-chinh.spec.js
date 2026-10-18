/*
 * BUỔI 5 — PHẦN 1: Tự động hóa ca kiểm thử ưu tiên Cao
 *
 * Chuyển ba ca đã thiết kế ở Buổi 2 thành ca kiểm thử E2E chạy trên trình duyệt thật.
 *
 * Chạy riêng file này:  npx playwright test tests/e2e/01-luong-chinh
 * Xem trình duyệt chạy: npx playwright test tests/e2e/01-luong-chinh --headed
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

const TK_THUONG = { email: 'sv@ntu.edu.vn', matKhau: 'Matkhau123' };
const TK_VIP = { email: 'vip@ntu.edu.vn', matKhau: 'Matkhau123' };

// Mỗi ca kiểm thử bắt đầu từ dữ liệu sạch: giỏ hàng trống, không tài khoản nào bị khóa.
test.beforeEach(async ({ page, request }) => {
  await datLaiDuLieu(request);
  await page.goto('/');
});

// ---------------------------------------------------------------
// CA MẪU ĐÃ VIẾT SẴN — đọc kỹ trước khi làm các TODO bên dưới.
// Tương ứng ca BVA của Buổi 2: đăng ký với tuổi dưới giới hạn.
// ---------------------------------------------------------------
test('FR-01.3 — đăng ký với tuổi 17 bị từ chối', async ({ page }) => {
  await page.getByTestId('reg-name').fill('Nguyen Van A');
  await page.getByTestId('reg-email').fill(`e2e-${Date.now()}@ntu.edu.vn`);
  await page.getByTestId('reg-age').fill('17');
  await page.getByTestId('reg-password').fill('Matkhau123');
  await page.getByTestId('btn-register').click();

  await expect(page.getByTestId('reg-msg')).toHaveText(/Tuổi không nằm trong phạm vi/);
});

// ---------------------------------------------------------------
// TODO (1): FR-02.3 — khóa tài khoản sau 3 lần đăng nhập sai liên tiếp
//
// Các bước:
//   1. Đăng nhập sai mật khẩu 3 lần liên tiếp với tài khoản sv@ntu.edu.vn
//   2. Khẳng định thông báo lần thứ ba nói rõ tài khoản bị khóa
//
// Lưu ý: mỗi lần bấm Đăng nhập là một yêu cầu mạng. Phải CHỜ thông báo của
// lần trước hiện ra rồi mới bấm lần kế tiếp, nếu không các lần bấm chồng lên nhau.
// Viết xong thì xóa .skip.
// ---------------------------------------------------------------
test.skip('TODO (1) — FR-02.3: khóa tài khoản sau 3 lần sai', async ({ page }) => {
  expect(TK_THUONG.email).toBeTruthy();
});

// ---------------------------------------------------------------
// TODO (2): FR-04.3 — thành viên VIP được miễn phí vận chuyển ở MỌI khu vực
//
// Các bước:
//   1. Đăng nhập bằng tài khoản VIP
//   2. Thêm một sản phẩm bất kỳ vào giỏ
//   3. Chọn khu vực "Ngoại thành" rồi bấm Tính phí vận chuyển
//   4. Khẳng định thông báo hiển thị phí vận chuyển 0đ
//
// Lưu ý: danh sách sản phẩm tải về có độ trễ ngẫu nhiên. Phải chờ bảng sản phẩm
// hiện ra trước khi thao tác với ô số lượng.
// ---------------------------------------------------------------
test.skip('TODO (2) — FR-04.3: VIP miễn phí vận chuyển ở ngoại thành', async ({ page }) => {
  expect(TK_VIP.email).toBeTruthy();
});

// ---------------------------------------------------------------
// TODO (3): chọn MỘT ca ưu tiên Cao thuộc nhóm bảng quyết định trong bộ ca
// Buổi 2 của mình (phí vận chuyển và tổng tiền), rồi tự động hóa ca đó.
//
// Ghi mã ca Buổi 2 tương ứng vào tên ca kiểm thử, ví dụ:
//   test('TC-64130001-22 — FR-05.2: đơn 450.000đ nội thành', ...)
//
// Gợi ý: để kiểm tra TỔNG TIỀN cuối cùng, phải bấm nút Đặt hàng chứ không
// dừng ở nút Tính phí vận chuyển.
// ---------------------------------------------------------------
test.skip('TODO (3) — ca bảng quyết định tự chọn', async ({ page }) => {
  expect(page).toBeTruthy();
});
