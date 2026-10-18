/*
 * BUỔI 5 — PHẦN 4: Tự động hóa kiểm thử hồi quy cho FR-06
 *
 * Ở Buổi 4, màn hình lọc sản phẩm được kiểm thử THỦ CÔNG, mỗi tổ hợp mất vài phút.
 * Phần này biến chúng thành bộ kiểm thử chạy lại được trong vài giây — đó chính là
 * lý do tồn tại của kiểm thử tự động.
 *
 * Dùng ProductPage đã hoàn thiện ở Phần 3.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');
const { ProductPage } = require('../pages/ProductPage');

let trangSanPham;

test.beforeEach(async ({ page, request }) => {
  await datLaiDuLieu(request);
  trangSanPham = new ProductPage(page);
  await trangSanPham.moTrang();
});

// ---------------------------------------------------------------
// CA MẪU ĐÃ VIẾT SẴN
// ---------------------------------------------------------------
test('FR-06.3 — lọc theo danh mục Đồ dùng học tập', async () => {
  await trangSanPham.loc({ danhMuc: 'do-dung-hoc-tap' });
  const ten = await trangSanPham.danhSachTen();

  expect(ten).toHaveLength(3);
  expect(ten).toEqual(expect.arrayContaining(['Sổ tay sinh viên', 'Bút ký NTU', 'Balo laptop']));
});

// ---------------------------------------------------------------
// TODO (9): viết các ca kiểm thử cho FR-06.
//
// Tối thiểu 5 ca, phủ các yêu cầu sau:
//   FR-06.2  lọc theo từ khóa (khớp một phần, không phân biệt hoa thường)
//   FR-06.4  lọc theo khoảng giá, chú ý BIÊN của khoảng 100.000đ–300.000đ
//   FR-06.5  sắp xếp giá tăng dần VÀ sắp xếp giá giảm dần (hai ca riêng)
//   FR-06.6  chỉ hiện sản phẩm còn hàng
//   FR-06.7  tổ hợp nhiều tiêu chí, và trường hợp không có kết quả
//
// Kết quả mong đợi phải dẫn từ SRS v1.2, KHÔNG suy ra từ hành vi hiện tại
// của hệ thống. Sẽ có ca thất bại — đó là điều được mong đợi.
//
// Gợi ý kiểm tra thứ tự sắp xếp mà không cần liệt kê từng giá:
//   const gia = await trangSanPham.danhSachGia();
//   expect(gia).toEqual([...gia].sort((a, b) => a - b));   // tăng dần
//
// Viết xong thì xóa ca giữ chỗ bên dưới.
// ---------------------------------------------------------------
test.skip('TODO (9) — bộ ca kiểm thử FR-06', async () => {
  expect(trangSanPham).toBeTruthy();
});
