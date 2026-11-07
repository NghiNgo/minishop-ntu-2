/*
 * BUOI 6 - PHAN 1B
 * Kiem thu API tang nghiep vu: gio hang, don hang va loc san pham.
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

test('FR-03.2 - them san pham voi so luong 0 tra ve 400', async ({ request }) => {
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 0 } });

  expect(res.status()).toBe(400);
  expect((await res.json()).message).toContain('Số lượng phải là số nguyên từ 1 đến 99');
});

test('FR-03.6 - them san pham khong ton tai tra ve 404', async ({ request }) => {
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 999, qty: 1 } });

  expect(res.status()).toBe(404);
  expect((await res.json()).message).toBe('Sản phẩm không tồn tại');
});

test('FR-03.3 - them lai san pham thi cap nhat so luong', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 2 } });
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 5 } });

  expect(res.status()).toBe(200);
  const gio = (await res.json()).cart;
  expect(gio.items).toHaveLength(1);
  expect(gio.items[0].qty).toBe(5);
  expect(gio.subtotal).toBe(250000);
});

test('FR-05.1 - dat hang thanh cong thi lam trong gio hang', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 1 } });
  await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });

  const gio = await (await request.get('/api/cart', kemToken())).json();
  expect(gio.items).toHaveLength(0);
  expect(gio.subtotal).toBe(0);
});

test('FR-03.5 - xoa san pham khong co trong gio tra ve 404', async ({ request }) => {
  const res = await request.delete('/api/cart/3', kemToken());

  expect(res.status()).toBe(404);
  expect((await res.json()).message).toBe('Sản phẩm không có trong giỏ');
});

test('FR-05.1 - dat hang khi gio trong tra ve 400', async ({ request }) => {
  const res = await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });

  expect(res.status()).toBe(400);
  expect((await res.json()).message).toBe('Giỏ hàng đang trống');
});

test('FR-05.2 - thanh vien thuong tinh tong tien dung cong thuc', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 4, qty: 1 } });
  const res = await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });

  expect(res.status()).toBe(201);
  const don = await res.json();
  expect(don.subtotal).toBe(350000);
  expect(don.discount).toBe(0);
  expect(don.shippingFee).toBe(20000);
  expect(don.total).toBe(don.subtotal - don.discount + don.shippingFee);
});

test('FR-05.3 + FR-04.3 - VIP tinh giam gia va mien phi van chuyen', async ({ request }) => {
  const tokenVip = await dangNhap(request, 'vip@ntu.edu.vn');
  await request.post('/api/cart', { ...kemToken(tokenVip), data: { productId: 4, qty: 1 } });
  const res = await request.post('/api/orders', { ...kemToken(tokenVip), data: { zone: 'ngoai-thanh' } });

  expect(res.status()).toBe(201);
  const don = await res.json();
  const discount = Math.round(don.subtotal * 0.05);
  expect(don.discount).toBe(discount);
  expect(don.shippingFee).toBe(0);
  expect(don.total).toBe(don.subtotal - don.discount + don.shippingFee);
});

test('FR-05.5 - huy don khong ton tai tra ve 404', async ({ request }) => {
  const res = await request.delete('/api/orders/9999', kemToken());

  expect(res.status()).toBe(404);
  expect((await res.json()).message).toBe('Không tìm thấy đơn hàng');
});

test('FR-05.5 - huy lai don da huy tra ve 409', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 1 } });
  const tao = await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });
  const don = await tao.json();

  const lanMot = await request.delete(`/api/orders/${don.id}`, kemToken());
  expect(lanMot.status()).toBe(200);
  const lanHai = await request.delete(`/api/orders/${don.id}`, kemToken());
  expect(lanHai.status()).toBe(409);
  expect((await lanHai.json()).message).toContain('Chỉ hủy được đơn ở trạng thái Chờ xác nhận');
});

test('FR-06.5 - sap xep san pham theo gia giam dan', async ({ request }) => {
  const res = await request.get('/api/products?sapXep=gia-giam');
  expect(res.status()).toBe(200);
  const danhSach = await res.json();
  const gia = danhSach.map((p) => p.price);
  expect(gia).toEqual(gia.slice().sort((a, b) => b - a));
});

test('FR-06.6 - chi hien san pham con hang', async ({ request }) => {
  const res = await request.get('/api/products?conHang=co');
  expect(res.status()).toBe(200);
  const danhSach = await res.json();
  expect(danhSach.length).toBeGreaterThan(0);
  for (const sanPham of danhSach) {
    expect(sanPham.stock).toBeGreaterThan(0);
  }
});

test('FR-06.7 - to hop danh muc va khoang gia', async ({ request }) => {
  const res = await request.get('/api/products?danhMuc=do-dung-hoc-tap&khoangGia=duoi-100k');
  expect(res.status()).toBe(200);
  const danhSach = await res.json();
  const ten = danhSach.map((p) => p.name).sort();
  expect(ten).toEqual(['Bút ký NTU', 'Sổ tay sinh viên'].sort());
});
