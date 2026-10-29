/*
 * BUỔI 6 — PHẦN 1B
 * Kiểm thử API tầng nghiệp vụ: giỏ hàng, đơn hàng và bộ lọc sản phẩm.
 *
 * Bốn ca đầu đã được viết sẵn làm mẫu cho ba nhóm kiểm tra:
 *   - ca âm trả về 4xx kèm thông báo;
 *   - quy tắc nghiệp vụ trong thân phản hồi;
 *   - tác dụng phụ, kiểm bằng một lời gọi API thứ hai.
 *
 * Nhiệm vụ của sinh viên: hoàn thành TODO (5) đến TODO (12).
 * Không mở trình duyệt trong file này — chỉ dùng fixture `request`.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

let token;

async function dangNhap(request, email = 'sv@ntu.edu.vn') {
  const res = await request.post('/api/login', { data: { email, password: 'Matkhau123' } });
  return (await res.json()).token;
}

function kemToken(tok = token) {
  return { headers: { Authorization: `Bearer ${tok}` } };
}

test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
  token = await dangNhap(request);
});

// ---------------------------------------------------------------
// GIỎ HÀNG — ca mẫu
// ---------------------------------------------------------------
test('FR-03.2 — thêm sản phẩm với số lượng 0 trả về 400', async ({ request }) => {
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 0 } });

  expect(res.status()).toBe(400);
  expect((await res.json()).message).toContain('Số lượng phải là số nguyên từ 1 đến 99');
});

test('FR-03.6 — thêm sản phẩm không tồn tại trả về 404', async ({ request }) => {
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 999, qty: 1 } });

  expect(res.status()).toBe(404);
  expect((await res.json()).message).toBe('Sản phẩm không tồn tại');
});

test('FR-03.3 — thêm lại sản phẩm đã có thì CẬP NHẬT số lượng, không cộng dồn', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 2 } });
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 5 } });

  expect(res.status()).toBe(200);
  const gio = (await res.json()).cart;
  expect(gio.items).toHaveLength(1);
  expect(gio.items[0].qty).toBe(5);
  expect(gio.subtotal).toBe(250000); // 5 × 50.000đ
});

// Ca mẫu về TÁC DỤNG PHỤ: lời gọi thứ hai mới kiểm được trạng thái sau đó.
test('FR-05.1 — đặt hàng thành công thì giỏ hàng được làm trống', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 1 } });
  await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });

  const gio = await (await request.get('/api/cart', kemToken())).json();
  expect(gio.items).toHaveLength(0);
  expect(gio.subtotal).toBe(0);
});

// ---------------------------------------------------------------
// TODO (5): FR-03.5 — xóa một sản phẩm KHÔNG có trong giỏ phải trả về 404.
//   Gọi DELETE /api/cart/3 khi giỏ đang trống.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (6): FR-05.1 — đặt hàng khi giỏ TRỐNG phải trả về 400 kèm thông báo
//   'Giỏ hàng đang trống'.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (7): FR-05.2 — kiểm công thức tổng tiền của đơn hàng.
//   Thêm sản phẩm 4 (350.000đ) vào giỏ, tạo đơn với zone 'noi-thanh'.
//   Phản hồi phải là 201. Trong thân phản hồi, kiểm từng thành phần:
//     subtotal = 350000; discount = 0; shippingFee = 20000;
//   và quan trọng nhất là quan hệ giữa chúng:
//     total === subtotal - discount + shippingFee
//   Viết dòng cuối theo đúng dạng quan hệ đó, đừng viết số cứng: khi ca
//   thất bại, thông báo sẽ cho thấy ngay phép tính nào bị sai.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (8): FR-05.3 + FR-04.3 — thành viên VIP.
//   Đăng nhập 'vip@ntu.edu.vn' bằng dangNhap(request, 'vip@ntu.edu.vn'),
//   dùng kemToken(tokenVip) cho mọi lời gọi. Thêm sản phẩm 4, tạo đơn với
//   zone 'ngoai-thanh'. Kiểm discount = 5% của tạm tính, shippingFee = 0,
//   và total đúng theo công thức.
//   Lưu ý khi phân tích kết quả: ca này có thể XANH trong khi TODO (7) ĐỎ.
//   Hãy giải thích hiện tượng đó trong báo cáo.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (9): FR-05.5 — hủy một đơn hàng KHÔNG tồn tại.
//   DELETE /api/orders/9999 phải trả về 404.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (10): FR-05.5 — hủy LẠI một đơn đã hủy.
//   Tạo đơn, hủy lần một (phải được 200), hủy lần hai phải trả về 409.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (11): FR-06.5 và FR-06.6 — bộ lọc sản phẩm. Viết hai ca:
//   (a) GET /api/products?sapXep=gia-giam — danh sách trả về phải được
//       sắp xếp giảm dần theo price. Cách kiểm không phụ thuộc dữ liệu:
//       so mảng giá với chính nó sau khi sắp xếp giảm dần.
//   (b) GET /api/products?conHang=co — danh sách không rỗng, và MỌI phần
//       tử phải có stock > 0. Dùng vòng lặp để kiểm từng phần tử.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// TODO (12): FR-06.7 — tổ hợp nhiều tiêu chí trong một lời gọi.
//   GET /api/products?danhMuc=do-dung-hoc-tap&khoangGia=duoi-100k
//   Kiểm danh sách tên sản phẩm trả về đúng bằng tập mong đợi suy ra từ
//   dữ liệu mẫu trong SRS v1.2. Sắp xếp tên trước khi so để ca không phụ
//   thuộc thứ tự trả về.
// ---------------------------------------------------------------

// Dòng dưới chỉ để file khung chạy được; xóa nó khi đã làm xong các TODO.
test('TODO: thay khối này bằng các ca ở TODO (5) đến TODO (12)', async ({ request }) => {
  expect(typeof dangNhap).toBe('function');
  expect((await request.get('/api/products')).status()).toBe(200);
});
