/*
 * BUOI 6 - PHAN 1A
 * Kiem thu API tang xac thuc va phan quyen cua MiniShop.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

const TK_THUONG = { email: 'sv@ntu.edu.vn', password: 'Matkhau123' };
const TK_VIP = { email: 'vip@ntu.edu.vn', password: 'Matkhau123' };

async function layToken(request, tk) {
  const res = await request.post('/api/login', { data: tk });
  return (await res.json()).token;
}

test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
});

test('POST /api/login dung thong tin tra ve 200 kem token', async ({ request }) => {
  const res = await request.post('/api/login', { data: TK_THUONG });

  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(data.ok).toBe(true);
  expect(typeof data.token).toBe('string');
  expect(data.token.length).toBeGreaterThan(0);
  expect(data.user).toMatchObject({ email: TK_THUONG.email, type: 'THUONG' });
});

test('POST /api/login sai mat khau tra ve 401', async ({ request }) => {
  const res = await request.post('/api/login', {
    data: { email: TK_THUONG.email, password: 'SaiMatKhau' },
  });

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Sai email hoặc mật khẩu');
});

test('GET /api/cart khong kem token tra ve 401', async ({ request }) => {
  const res = await request.get('/api/cart');

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Bạn cần đăng nhập');
});

test('FR-02.3 - dang nhap sai 3 lan lien tiep thi khoa tai khoan', async ({ request }) => {
  for (let i = 0; i < 2; i++) {
    const res = await request.post('/api/login', {
      data: { email: TK_THUONG.email, password: `SaiMatKhau${i}` },
    });
    expect(res.status()).toBe(401);
  }

  const lanThuBa = await request.post('/api/login', {
    data: { email: TK_THUONG.email, password: 'SaiMatKhauCuoi' },
  });
  expect(lanThuBa.status()).toBe(423);
  expect((await lanThuBa.json()).message).toContain('Tài khoản đã bị khóa');
});

test('FR-02.4 - tai khoan dang khoa van tu choi mat khau dung', async ({ request }) => {
  for (let i = 0; i < 3; i++) {
    await request.post('/api/login', {
      data: { email: TK_THUONG.email, password: `SaiMatKhau${i}` },
    });
  }

  const res = await request.post('/api/login', { data: TK_THUONG });
  expect(res.status()).toBe(423);
  expect((await res.json()).message).toContain('Tài khoản đã bị khóa');
});

test('GET /api/cart voi token khong ton tai tra ve 401', async ({ request }) => {
  const res = await request.get('/api/cart', {
    headers: { Authorization: 'Bearer chuoi-token-bat-ky' },
  });

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Bạn cần đăng nhập');
});

test('FR-05.5 - tai khoan khong duoc huy don hang cua tai khoan khac', async ({ request }) => {
  const tokenThuong = await layToken(request, TK_THUONG);
  const tokenVip = await layToken(request, TK_VIP);

  const them = await request.post('/api/cart', {
    headers: { Authorization: `Bearer ${tokenThuong}` },
    data: { productId: 4, qty: 1 },
  });
  expect(them.status()).toBe(200);

  const taoDon = await request.post('/api/orders', {
    headers: { Authorization: `Bearer ${tokenThuong}` },
    data: { zone: 'noi-thanh' },
  });
  expect(taoDon.status()).toBe(201);
  const don = await taoDon.json();

  const huy = await request.delete(`/api/orders/${don.id}`, {
    headers: { Authorization: `Bearer ${tokenVip}` },
  });
  expect(huy.status()).toBe(404);

  const kiemTra = await request.get('/api/orders', {
    headers: { Authorization: `Bearer ${tokenThuong}` },
  });
  const danhSach = await kiemTra.json();
  expect(danhSach).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: don.id, status: 'CHO_XAC_NHAN' }),
  ]));
});
