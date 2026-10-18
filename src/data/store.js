// Dữ liệu mẫu lưu trong bộ nhớ (khởi động lại server là dữ liệu trở về ban đầu)

const products = [
  { id: 1, name: 'Áo thun NTU', price: 150000, category: 'qua-luu-niem', stock: 12 },
  { id: 2, name: 'Bình nước giữ nhiệt', price: 100000, category: 'qua-luu-niem', stock: 0 },
  { id: 3, name: 'Sổ tay sinh viên', price: 50000, category: 'do-dung-hoc-tap', stock: 40 },
  { id: 4, name: 'Balo laptop', price: 350000, category: 'do-dung-hoc-tap', stock: 5 },
  { id: 5, name: 'Nón bảo hiểm NTU', price: 200000, category: 'qua-luu-niem', stock: 0 },
  { id: 6, name: 'Bút ký NTU', price: 35000, category: 'do-dung-hoc-tap', stock: 100 },
  { id: 7, name: 'Áo khoác gió NTU', price: 450000, category: 'qua-luu-niem', stock: 3 },
];

function nguoiDungBanDau() {
  return [
    {
      email: 'sv@ntu.edu.vn',
      password: 'Matkhau123',
      fullName: 'Nguyễn Văn Sinh Viên',
      age: 20,
      type: 'THUONG',
      failedAttempts: 0,
      locked: false,
    },
    {
      email: 'vip@ntu.edu.vn',
      password: 'Matkhau123',
      fullName: 'Trần Thị Thân Thiết',
      age: 35,
      type: 'VIP',
      failedAttempts: 0,
      locked: false,
    },
  ];;
}

const users = nguoiDungBanDau();

const carts = {}; // email -> [{ productId, qty }]
const orders = []; // { id, email, items, subtotal, shippingFee, total, status }

function findUser(email) {
  return users.find((u) => u.email === String(email || '').toLowerCase());
}

function findProduct(id) {
  return products.find((p) => p.id === Number(id));
}

/*
 * Đặt lại toàn bộ dữ liệu về trạng thái ban đầu.
 * Chỉ dùng cho kiểm thử tự động: mỗi ca kiểm thử cần bắt đầu từ trạng thái sạch,
 * nếu không thứ tự chạy sẽ quyết định kết quả.
 */
function datLaiDuLieu() {
  for (const email of Object.keys(carts)) delete carts[email];
  orders.length = 0;
  users.length = 0;
  users.push(...nguoiDungBanDau());
}

module.exports = { products, users, carts, orders, findUser, findProduct, datLaiDuLieu };
