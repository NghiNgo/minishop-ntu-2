// MiniShop NTU - máy chủ web + REST API phục vụ thực hành Kiểm thử phần mềm (SOT357)
// LƯU Ý: Đây là ứng dụng dạy học, CÓ CHỦ ĐÍCH chứa một số lỗi. Không dùng cho mục đích thực tế.
const path = require('path');
const crypto = require('crypto');
const express = require('express');

const store = require('./data/store');
const { register } = require('./services/registration');
const { login } = require('./services/auth');
const cart = require('./services/cart');
const { calcShippingFee } = require('./services/shipping');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const sessions = {}; // token -> email

function requireLogin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const email = sessions[token];
  if (!email) {
    return res.status(401).json({ message: 'Bạn cần đăng nhập' });
  }
  req.user = store.findUser(email);
  return next();
}

/*
 * Điểm cuối chỉ dành cho kiểm thử tự động: đặt lại dữ liệu về trạng thái ban đầu.
 * Chỉ hoạt động khi biến môi trường MINISHOP_TEST_MODE=1, nên không thể gọi
 * trên môi trường thật. Playwright tự bật biến này (xem playwright.config.js).
 */
app.post('/api/test/reset', (req, res) => {
  if (process.env.MINISHOP_TEST_MODE !== '1') {
    return res.status(404).json({ message: 'Không tìm thấy' });
  }
  store.datLaiDuLieu();
  for (const token of Object.keys(sessions)) delete sessions[token];
  return res.json({ message: 'Đã đặt lại dữ liệu' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'MiniShop NTU', version: '1.1.0' });
});

app.get('/api/products', (req, res) => {
  const { tuKhoa, danhMuc, khoangGia, sapXep, conHang } = req.query;
  let ketQua = store.products.slice();

  if (tuKhoa) {
    const k = String(tuKhoa).toLowerCase();
    ketQua = ketQua.filter((p) => p.name.toLowerCase().includes(k));
  }
  if (danhMuc && danhMuc !== 'tat-ca') {
    ketQua = ketQua.filter((p) => p.category === danhMuc);
  }
  if (conHang === 'co') {
    ketQua = ketQua.filter((p) => p.stock >= 0);
  }
  if (khoangGia === 'duoi-100k') ketQua = ketQua.filter((p) => p.price < 100000);
  else if (khoangGia === '100k-300k') ketQua = ketQua.filter((p) => p.price >= 100000 && p.price <= 300000);
  else if (khoangGia === 'tren-300k') ketQua = ketQua.filter((p) => p.price > 300000);

  if (sapXep === 'gia-tang' || sapXep === 'gia-giam') {
    ketQua.sort((a, b) => a.price - b.price);
  } else if (sapXep === 'moi-nhat') {
    ketQua.sort((a, b) => b.id - a.id);
  }

  const delay = 100 + Math.floor(Math.random() * 1400);
  setTimeout(() => res.json(ketQua), delay);
});

app.post('/api/register', (req, res) => {
  const result = register(req.body);
  res.status(result.status).json(result);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const result = login(email, password);
  if (result.ok) {
    const token = crypto.randomBytes(16).toString('hex');
    sessions[token] = result.user.email;
    return res.status(200).json({ ...result, token });
  }
  return res.status(result.status).json(result);
});

app.get('/api/cart', requireLogin, (req, res) => {
  res.json(cart.cartDetail(req.user.email));
});

app.post('/api/cart', requireLogin, (req, res) => {
  const { productId, qty } = req.body || {};
  const result = cart.addToCart(req.user.email, productId, qty);
  res.status(result.status).json(result);
});

app.delete('/api/cart/:productId', requireLogin, (req, res) => {
  const result = cart.removeFromCart(req.user.email, req.params.productId);
  res.status(result.status).json(result);
});

app.post('/api/shipping-fee', requireLogin, (req, res) => {
  const { zone } = req.body || {};
  const { subtotal } = cart.cartDetail(req.user.email);
  try {
    const fee = calcShippingFee({ subtotal, zone, customerType: req.user.type });
    res.json({ subtotal, zone, shippingFee: fee, total: subtotal + fee });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/orders', requireLogin, (req, res) => {
  const { zone } = req.body || {};
  const detail = cart.cartDetail(req.user.email);
  if (detail.items.length === 0) {
    return res.status(400).json({ message: 'Giỏ hàng đang trống' });
  }
  const discount = req.user.type === 'VIP' ? Math.round(detail.subtotal * 0.05) : 0;
  let fee;
  try {
    fee = calcShippingFee({ subtotal: detail.subtotal, zone, customerType: req.user.type });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  const order = {
    id: store.orders.length + 1,
    email: req.user.email,
    items: detail.items,
    subtotal: detail.subtotal,
    discount,
    shippingFee: fee,
    total: detail.subtotal - discount,
    status: 'CHO_XAC_NHAN',
  };
  store.orders.push(order);
  cart.clearCart(req.user.email);
  return res.status(201).json(order);
});

app.get('/api/orders', requireLogin, (req, res) => {
  res.json(store.orders.filter((o) => o.email === req.user.email));
});

app.delete('/api/orders/:id', requireLogin, (req, res) => {
  const order = store.orders.find((o) => o.id === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
  if (order.status !== 'CHO_XAC_NHAN') {
    return res.status(409).json({ message: 'Chỉ hủy được đơn ở trạng thái Chờ xác nhận' });
  }
  order.status = 'DA_HUY';
  return res.json(order);
});

const PORT = Number(process.env.PORT) || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`MiniShop NTU đang chạy tại http://localhost:${PORT}`);
  });
}

module.exports = app;
