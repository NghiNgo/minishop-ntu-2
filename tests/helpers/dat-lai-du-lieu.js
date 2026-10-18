/*
 * Đặt lại dữ liệu MiniShop về trạng thái ban đầu trước mỗi ca kiểm thử E2E.
 * Sinh viên KHÔNG cần sửa file này.
 *
 * Vì sao cần: MiniShop lưu giỏ hàng, đơn hàng và trạng thái khóa tài khoản trong
 * bộ nhớ của máy chủ. Nếu không đặt lại, một ca làm khóa tài khoản sẽ khiến các
 * ca chạy sau thất bại, và kết quả phụ thuộc thứ tự chạy — đúng vấn đề đã gặp
 * ở Buổi 3 khi chưa dùng mock.
 *
 * Cách dùng trong file *.spec.js:
 *   const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');
 *   test.beforeEach(async ({ request }) => { await datLaiDuLieu(request); });
 */
async function datLaiDuLieu(request) {
  const res = await request.post('/api/test/reset');
  if (!res.ok()) {
    throw new Error(
      'Không đặt lại được dữ liệu. Hãy chạy kiểm thử bằng "npm run e2e" ' +
      'để Playwright tự khởi động máy chủ ở chế độ kiểm thử.'
    );
  }
}

module.exports = { datLaiDuLieu };
