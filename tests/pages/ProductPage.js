/*
 * Page Object cho màn hình Sản phẩm và bộ lọc (FR-06).
 *
 * TODO (4): hoàn thiện lớp này ở Phần 3.
 * Gợi ý các locator cần có (xem data-testid trong public/index.html):
 *   f-tukhoa · f-danhmuc · f-khoanggia · f-sapxep · f-conhang
 *   btn-loc · btn-xoabo-loc · product-list · khong-co-ket-qua
 */
class ProductPage {
  constructor(page) {
    this.page = page;
    this.danhSach = page.getByTestId('product-list');
    this.nutLoc = page.getByTestId('btn-loc');
    this.thongBaoRong = page.getByTestId('khong-co-ket-qua');
    // TODO (4a): bổ sung các locator còn lại
  }

  async moTrang() {
    await this.page.goto('/');
    await this.chokKetQua();
  }

  /**
   * Chờ danh sách tải xong. Danh sách sản phẩm có độ trễ ngẫu nhiên, nên
   * mọi thao tác với nó đều phải chờ qua phương thức này.
   * ĐÃ VIẾT SẴN — dùng làm mẫu cho cách chờ đúng, không dùng waitForTimeout.
   */
  async chokKetQua() {
    await this.danhSach.locator('table, [data-testid="khong-co-ket-qua"]').first()
      .waitFor({ state: 'visible' });
  }

  /**
   * Áp dụng bộ lọc. Tham số là một đối tượng, chỉ truyền tiêu chí cần dùng:
   *   await trangSP.loc({ danhMuc: 'qua-luu-niem', sapXep: 'gia-giam' });
   */
  async loc({ tuKhoa, danhMuc, khoangGia, sapXep, conHang } = {}) {
    // TODO (4b): điền từng tiêu chí nếu được truyền, sau đó bấm nút Lọc.
    //   - Ô văn bản dùng .fill(), danh sách chọn dùng .selectOption()
    //   - Ô đánh dấu dùng .check() hoặc .uncheck()
    //   - Sau khi bấm Lọc, gọi this.chokKetQua() rồi mới trả về.
    throw new Error('Chưa hoàn thành TODO (4b) trong ProductPage.loc()');
  }

  /** Trả về mảng tên sản phẩm đang hiển thị, theo đúng thứ tự trên màn hình. */
  async danhSachTen() {
    // TODO (4c)
    //   Gợi ý: allTextContents() trả về mảng nội dung của mọi phần tử khớp locator.
    //   Nhớ xử lý trường hợp danh sách rỗng (có thongBaoRong) thì trả về [].
    throw new Error('Chưa hoàn thành TODO (4c) trong ProductPage.danhSachTen()');
  }

  /**
   * Trả về mảng giá dạng SỐ, theo đúng thứ tự trên màn hình.
   * Trên giao diện giá hiển thị dạng "150.000đ" nên phải bỏ dấu chấm và chữ đ.
   */
  async danhSachGia() {
    // TODO (4d)
    throw new Error('Chưa hoàn thành TODO (4d) trong ProductPage.danhSachGia()');
  }

  /** Trả về mảng nội dung cột Tồn kho, theo đúng thứ tự trên màn hình. */
  async danhSachTonKho() {
    // TODO (4e)
    throw new Error('Chưa hoàn thành TODO (4e) trong ProductPage.danhSachTonKho()');
  }

  /** Thêm một sản phẩm vào giỏ theo mã sản phẩm. ĐÃ VIẾT SẴN. */
  async themVaoGio(maSanPham, soLuong) {
    await this.page.getByTestId(`qty-${maSanPham}`).fill(String(soLuong));
    await this.page.getByTestId(`add-${maSanPham}`).click();
  }
}

module.exports = { ProductPage };
