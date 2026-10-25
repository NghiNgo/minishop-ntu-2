/*
 * BUỔI 6 — PHẦN 1A
 * Kiểm thử API tầng xác thực và phân quyền của MiniShop.
 *
 * Ba ca đầu đã được viết sẵn làm mẫu, thể hiện ba mức kiểm tra bắt buộc
 * của một ca kiểm thử API:
 *   (a) mã trạng thái HTTP;
 *   (b) cấu trúc thân phản hồi;
 *   (c) giá trị nghiệp vụ bên trong thân phản hồi.
 *
 * Nhiệm vụ của sinh viên: hoàn thành TODO (1) đến TODO (4).
 * Không mở trình duyệt trong file này — chỉ dùng fixture `request`.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

const TK_THUONG = { email: 'sv@ntu.edu.vn', password: 'Matkhau123' };
const TK_VIP = { email: 'vip@ntu.edu.vn', password: 'Matkhau123' };

async function layToken(request, tk) {
  const res = await request.post('/api/login', { data: tk });
  return (await res.json()).token;
}

// Đặt lại dữ liệu trước mỗi ca. Thiếu dòng này, một ca làm khóa tài khoản
// sẽ khiến các ca sau chạy sai và kết quả phụ thuộc thứ tự chạy.
test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
});

// ---------------------------------------------------------------
// CA MẪU 1 — kiểm đủ ba mức: trạng thái, cấu trúc, giá trị nghiệp vụ
// ---------------------------------------------------------------
test('POST /api/login đúng thông tin trả về 200 kèm token', async ({ request }) => {
  const res = await request.post('/api/login', { data: TK_THUONG });

  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(data.ok).toBe(true);
  expect(typeof data.token).toBe('string');
  expect(data.token.length).toBeGreaterThan(0);
  expect(data.user).toMatchObject({ email: TK_THUONG.email, type: 'THUONG' });
});

// ---------------------------------------------------------------
// CA MẪU 2 — ca âm: kiểm cả mã trạng thái và thông báo lỗi
// ---------------------------------------------------------------
test('POST /api/login sai mật khẩu trả về 401', async ({ request }) => {
  const res = await request.post('/api/login', {
    data: { email: TK_THUONG.email, password: 'SaiMatKhau' },
  });

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Sai email hoặc mật khẩu');
});

// ---------------------------------------------------------------
// CA MẪU 3 — yêu cầu không kèm token
// ---------------------------------------------------------------
test('GET /api/cart không kèm token trả về 401', async ({ request }) => {
  const res = await request.get('/api/cart');

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Bạn cần đăng nhập');
});

// ---------------------------------------------------------------
// TODO (1): FR-02.3 — sai mật khẩu đủ 3 lần liên tiếp thì khóa tài khoản.
//   Hai lần đầu phải nhận 401; lần thứ ba phải nhận 423 kèm thông báo
//   chứa 'Tài khoản đã bị khóa'. Mỗi lần dùng một mật khẩu sai khác nhau.
//   Xóa dòng TODO này sau khi hoàn thành.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (2): FR-02.4 — tài khoản đang bị khóa thì mật khẩu ĐÚNG vẫn bị
//   từ chối. Dựng trạng thái khóa trước, sau đó gọi lại với TK_THUONG
//   và kiểm mã trạng thái cùng thông báo.
//   Xóa dòng TODO này sau khi hoàn thành.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (3): GET /api/cart với token không tồn tại phải trả về 401.
//   Gửi header Authorization: 'Bearer <một chuỗi bất kỳ>'.
//   Xóa dòng TODO này sau khi hoàn thành.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (4): FR-05.5 — một tài khoản KHÔNG được hủy đơn hàng của tài
//   khoản khác. Đây là ca quan trọng nhất của Phần 1A, vì giao diện web
//   không có đường nào dựng được tình huống này.
//   Các bước:
//     1. Lấy token của TK_THUONG và của TK_VIP bằng layToken().
//     2. Dùng token của TK_THUONG: thêm sản phẩm 4 vào giỏ, rồi tạo đơn
//        với zone 'noi-thanh'. Kiểm tra tạo đơn trả về 201 và lưu lại id.
//     3. Dùng token của TK_VIP gọi DELETE /api/orders/<id> đó.
//        Theo FR-05.5, phản hồi phải là 404 (coi như không tìm thấy đơn).
//     4. Kiểm tra TÁC DỤNG PHỤ: gọi lại GET /api/orders bằng token của
//        TK_THUONG, đơn hàng vẫn phải ở trạng thái 'CHO_XAC_NHAN'.
//   Bước 4 là bắt buộc: một mã trạng thái đúng không chứng minh được dữ
//   liệu không bị thay đổi.
//   Xóa dòng TODO này sau khi hoàn thành.
// ---------------------------------------------------------------

// Hằng TK_VIP và hàm layToken ở trên dành cho TODO (4).
// Dòng dưới chỉ để file khung chạy được; xóa nó khi làm TODO (4).
test('TODO: thay khối này bằng bốn ca ở TODO (1) đến TODO (4)', async ({ request }) => {
  expect(typeof layToken).toBe('function');
  expect(TK_VIP.email).toContain('@');
  expect((await request.get('/api/health')).status()).toBe(200);
});
