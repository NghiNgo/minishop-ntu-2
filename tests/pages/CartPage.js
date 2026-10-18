/*
 * Page Object cho khu vực Giỏ hàng và đặt hàng.
 *
 * TODO (5): hoàn thiện lớp này ở Phần 3.
 */
class CartPage {
  constructor(page) {
    this.page = page;
    this.gio = page.getByTestId('cart');
    this.tamTinh = page.getByTestId('subtotal');
    // TODO (5a): bổ sung locator cho ô chọn khu vực (zone), nút Tính phí vận chuyển
    //            (btn-fee), nút Đặt hàng (btn-order) và vùng thông báo phí (fee-msg).
  }

  /** Chọn khu vực rồi bấm Tính phí vận chuyển, chờ thông báo hiện ra. */
  async tinhPhi(khuVuc) {
    // TODO (5b)
    throw new Error('Chưa hoàn thành TODO (5b) trong CartPage.tinhPhi()');
  }

  /** Chọn khu vực rồi bấm Đặt hàng, chờ thông báo hiện ra. */
  async datHang(khuVuc) {
    // TODO (5c)
    throw new Error('Chưa hoàn thành TODO (5c) trong CartPage.datHang()');
  }

  /** Xóa một sản phẩm khỏi giỏ theo mã sản phẩm. ĐÃ VIẾT SẴN. */
  async xoaSanPham(maSanPham) {
    await this.page.getByTestId(`remove-${maSanPham}`).click();
  }
}

module.exports = { CartPage };
