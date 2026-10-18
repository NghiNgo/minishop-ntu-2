/*
 * BUỔI 5 — PHẦN 3: Viết lại ca kiểm thử theo Page Object Model
 *
 * So sánh file này với 01-luong-chinh.spec.js: cùng kịch bản, nhưng mọi locator
 * đã chuyển vào tests/pages/. Ca kiểm thử chỉ còn mô tả NGHIỆP VỤ.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');
const { LoginPage } = require('../pages/LoginPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');

test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
});

// ---------------------------------------------------------------
// CA MẪU ĐÃ VIẾT SẴN — dùng LoginPage đã hoàn thiện.
// Đọc để thấy ca kiểm thử ngắn và dễ đọc hơn hẳn khi dùng Page Object.
// ---------------------------------------------------------------
test('FR-02.2 — đăng nhập sai mật khẩu bị từ chối', async ({ page }) => {
  const trangDangNhap = new LoginPage(page);
  await trangDangNhap.moTrang();
  await trangDangNhap.dangNhap('sv@ntu.edu.vn', 'MatKhauSai');

  await expect(trangDangNhap.thongBao).toHaveText('Sai email hoặc mật khẩu');
});

// ---------------------------------------------------------------
// TODO (7): viết lại ca TODO (2) của Phần 1 bằng Page Object.
//
// Ca kiểm thử chỉ được gọi phương thức của LoginPage, ProductPage, CartPage.
// KHÔNG được gọi page.getByTestId(...) hay page.locator(...) trong file này.
//
// Thân ca kiểm thử nên đọc gần như một câu tiếng Việt:
//   đăng nhập VIP → thêm sản phẩm vào giỏ → tính phí ngoại thành → khẳng định 0đ
// ---------------------------------------------------------------
test.skip('TODO (7) — FR-04.3 viết lại theo POM', async ({ page }) => {
  const trangDangNhap = new LoginPage(page);
  const trangSanPham = new ProductPage(page);
  const trangGio = new CartPage(page);
  expect([trangDangNhap, trangSanPham, trangGio]).toHaveLength(3);
});

// ---------------------------------------------------------------
// TODO (8): viết lại ca TODO (1) của Phần 1 (khóa tài khoản) bằng Page Object.
//
// Gợi ý: LoginPage đã có sẵn phương thức dangNhapSaiNhieuLan().
// ---------------------------------------------------------------
test.skip('TODO (8) — FR-02.3 viết lại theo POM', async ({ page }) => {
  expect(page).toBeTruthy();
});
