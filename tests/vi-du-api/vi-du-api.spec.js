/*
 * VÍ DỤ MINH HỌA BUỔI 6 — đọc file này trước khi làm bài.
 *
 * API được kiểm thử: dịch vụ mượn sách thư viện (KHÔNG thuộc MiniShop),
 * khởi động ngay trong file này ở một cổng riêng.
 *
 * Chạy riêng ví dụ:  npx playwright test tests/vi-du-api
 */
const { test, expect, request: apiRequest } = require('@playwright/test');
const { taoMayChuViDu } = require('./may-chu-vi-du');

const CONG = 3987;
let mayChu;
let api;

test.beforeAll(async () => {
  mayChu = taoMayChuViDu().listen(CONG);
  api = await apiRequest.newContext({ baseURL: `http://localhost:${CONG}` });
});

test.afterAll(async () => {
  await api.dispose();
  mayChu.close();
});

// ---------------------------------------------------------------
// 1. Ba điều cần khẳng định ở mỗi ca kiểm thử API
//    (a) mã trạng thái HTTP   (b) cấu trúc dữ liệu trả về   (c) giá trị nghiệp vụ
// ---------------------------------------------------------------
test('GET /sach trả về danh sách sách', async () => {
  const res = await api.get('/sach');

  expect(res.status()).toBe(200);                  // (a)
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);          // (b)
  expect(data[0]).toHaveProperty('tenSach');       // (b)
  expect(data).toHaveLength(2);                    // (c)
});

// ---------------------------------------------------------------
// 2. Ca âm: dữ liệu không tồn tại phải trả 404, không phải 200 với mảng rỗng
// ---------------------------------------------------------------
test('GET /sach/:id với mã không tồn tại trả về 404', async () => {
  const res = await api.get('/sach/999');

  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ thongBao: 'Không tìm thấy sách' });
});

// ---------------------------------------------------------------
// 3. Ca âm: thiếu trường bắt buộc phải trả 400
// ---------------------------------------------------------------
test('POST /phieu-muon thiếu mã thẻ độc giả trả về 400', async () => {
  const res = await api.post('/phieu-muon', { data: { maSach: 1 } });

  expect(res.status()).toBe(400);
  expect((await res.json()).thongBao).toContain('Thiếu mã thẻ độc giả');
});

// ---------------------------------------------------------------
// 4. Phân biệt 404 và 409: không tìm thấy khác với tìm thấy nhưng không làm được
// ---------------------------------------------------------------
test('POST /phieu-muon với sách đã hết bản trả về 409', async () => {
  const res = await api.post('/phieu-muon', { data: { maSach: 2, maTheDocGia: 'DG001' } });

  expect(res.status()).toBe(409);
  expect((await res.json()).thongBao).toContain('hết bản');
});

// ---------------------------------------------------------------
// 5. Kiểm tra TÁC DỤNG PHỤ: gọi API xong, trạng thái hệ thống có đổi đúng không?
//    Đây là điểm kiểm thử API mạnh hơn hẳn kiểm thử giao diện.
// ---------------------------------------------------------------
test('POST /phieu-muon thành công thì giảm số bản còn lại', async () => {
  const truoc = (await (await api.get('/sach/1')).json()).soBanConLai;

  const res = await api.post('/phieu-muon', { data: { maSach: 1, maTheDocGia: 'DG001' } });
  expect(res.status()).toBe(201);
  expect(await res.json()).toMatchObject({ maSach: 1, trangThai: 'DANG_MUON' });

  const sau = (await (await api.get('/sach/1')).json()).soBanConLai;
  expect(sau).toBe(truoc - 1);
});
