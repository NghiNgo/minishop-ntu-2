/*
 * VÍ DỤ MINH HỌA BUỔI 5 — đọc file này trước khi làm bài.
 *
 * Trang được kiểm thử: tests/vi-du-e2e/trang-vi-du.html (KHÔNG thuộc MiniShop).
 * Chạy riêng ví dụ:  npx playwright test tests/vi-du-e2e
 */
const { test, expect } = require('@playwright/test');
const path = require('path');

const TRANG_VI_DU = 'file://' + path.join(__dirname, 'trang-vi-du.html');

test.beforeEach(async ({ page }) => {
  await page.goto(TRANG_VI_DU);
});

// ---------------------------------------------------------------
// 1. Cấu trúc một ca kiểm thử E2E: điều hướng, thao tác, khẳng định
// ---------------------------------------------------------------
test('đăng ký hợp lệ hiển thị thông báo thành công', async ({ page }) => {
  await page.getByLabel('Mã số sinh viên').fill('64130001');
  await page.getByLabel('Học phần').selectOption('SOT357');
  await page.getByRole('button', { name: 'Đăng ký' }).click();

  // Web-first assertion: Playwright tự chờ cho tới khi điều kiện đúng
  await expect(page.getByRole('status')).toHaveText('Đăng ký thành công học phần SOT357');
});

// ---------------------------------------------------------------
// 2. Thứ tự ưu tiên khi chọn locator
//    getByRole > getByLabel > getByText > getByTestId > CSS > XPath
//    Locator càng gần cách NGƯỜI DÙNG nhìn thấy thì càng ít gãy khi giao diện đổi.
// ---------------------------------------------------------------
test('các cách định vị cùng một nút', async ({ page }) => {
  // Nên dùng: mô tả theo vai trò và tên hiển thị
  await expect(page.getByRole('button', { name: 'Đăng ký' })).toBeVisible();

  // Chấp nhận được khi phần tử không có vai trò rõ ràng
  await expect(page.locator('#btn-dang-ky')).toBeVisible();

  // Hạn chế dùng: phụ thuộc cấu trúc DOM, gãy ngay khi lập trình viên đổi thẻ bọc
  await expect(page.locator('body > button:nth-child(5)')).toBeVisible();
});

// ---------------------------------------------------------------
// 3. Kiểm tra thông báo lỗi
// ---------------------------------------------------------------
test('MSSV sai định dạng bị từ chối', async ({ page }) => {
  await page.getByLabel('Mã số sinh viên').fill('123');
  await page.getByLabel('Học phần').selectOption('SOT357');
  await page.getByRole('button', { name: 'Đăng ký' }).click();

  const thongBao = page.getByRole('status');
  await expect(thongBao).toHaveText('MSSV phải gồm đúng 8 chữ số');
  await expect(thongBao).toHaveClass(/loi/);
});

// ---------------------------------------------------------------
// 4. CA KIỂM THỬ FLAKY VÀ CÁCH SỬA
//    Nút "Tải danh sách" trả kết quả sau độ trễ NGẪU NHIÊN 200–1700ms.
// ---------------------------------------------------------------
test.describe('Minh họa ca kiểm thử flaky', () => {
  // CÁCH SAI: chờ một khoảng thời gian cố định rồi mới kiểm tra.
  // Khi độ trễ ngẫu nhiên vượt quá 800ms, ca này thất bại — lúc xanh lúc đỏ.
  // (Đã đánh dấu test.skip để bộ kiểm thử không bị đỏ thất thường;
  //  bỏ .skip và chạy lại nhiều lần để tự quan sát hiện tượng.)
  test.skip('CÁCH SAI — dùng waitForTimeout', async ({ page }) => {
    await page.getByLabel('Mã số sinh viên').fill('64130001');
    await page.getByLabel('Học phần').selectOption('SOT357');
    await page.getByRole('button', { name: 'Đăng ký' }).click();

    await page.getByRole('button', { name: 'Tải danh sách' }).click();
    await page.waitForTimeout(800); // phỏng đoán thời gian chờ
    await expect(page.locator('#bang-ds')).toBeVisible();
  });

  // CÁCH ĐÚNG: khẳng định vào KẾT QUẢ mong muốn và để Playwright tự chờ.
  // expect(...).toBeVisible() thử lại liên tục cho tới khi đúng hoặc hết timeout.
  test('CÁCH ĐÚNG — web-first assertion tự chờ', async ({ page }) => {
    await page.getByLabel('Mã số sinh viên').fill('64130001');
    await page.getByLabel('Học phần').selectOption('SOT357');
    await page.getByRole('button', { name: 'Đăng ký' }).click();

    await page.getByRole('button', { name: 'Tải danh sách' }).click();
    await expect(page.locator('#bang-ds')).toBeVisible();
    await expect(page.locator('#bang-ds')).toContainText('64130001');
  });
});
