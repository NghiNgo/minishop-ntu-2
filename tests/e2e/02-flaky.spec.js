/*
 * BUỔI 5 — PHẦN 2: Nhận diện và sửa ca kiểm thử flaky
 *
 * "Flaky" là ca kiểm thử cho kết quả KHÁC NHAU giữa các lần chạy dù mã nguồn
 * và dữ liệu không đổi. Nó tệ hơn ca luôn đỏ: cả nhóm mất niềm tin vào bộ kiểm thử
 * và bắt đầu bỏ qua mọi ca đỏ.
 *
 * Chạy nhiều lần để quan sát:  npx playwright test tests/e2e/02-flaky --repeat-each=5
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
});

// ---------------------------------------------------------------
// CA FLAKY SỐ 1 — ĐÃ CHO SẴN, PHẢI SỬA
//
// Danh sách sản phẩm được trả về sau độ trễ ngẫu nhiên 100–1500ms
// (xem GET /api/products trong src/server.js).
// Ca này chờ cứng 600ms rồi mới kiểm tra, nên lúc xanh lúc đỏ.
//
// TODO (6a): sửa ca này để nó ổn định. KHÔNG dùng waitForTimeout.
// ---------------------------------------------------------------
test('danh sách sản phẩm hiển thị đủ 7 mặt hàng', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(600); // ← nguyên nhân gây flaky
  const soDong = await page.getByTestId('product-list').locator('tr').count();
  expect(soDong).toBe(8); // 7 sản phẩm + 1 dòng tiêu đề
});

// ---------------------------------------------------------------
// CA FLAKY SỐ 2 — ĐÃ CHO SẴN, PHẢI SỬA
//
// Ca này đọc nội dung thông báo NGAY sau khi bấm nút, trong khi thông báo
// chỉ xuất hiện sau khi máy chủ phản hồi.
//
// TODO (6b): sửa ca này bằng web-first assertion.
// ---------------------------------------------------------------
test('tính phí vận chuyển cho thành viên thường', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-email').fill('sv@ntu.edu.vn');
  await page.getByTestId('login-password').fill('Matkhau123');
  await page.getByTestId('btn-login').click();

  await expect(page.getByTestId('product-list').locator('table')).toBeVisible();
  await page.getByTestId('qty-4').fill('1');
  await page.getByTestId('add-4').click();

  await page.getByTestId('zone').selectOption('noi-thanh');
  await page.getByTestId('btn-fee').click();

  const thongBao = await page.getByTestId('fee-msg').textContent(); // ← đọc quá sớm
  expect(thongBao).toContain('Phí vận chuyển');
});
