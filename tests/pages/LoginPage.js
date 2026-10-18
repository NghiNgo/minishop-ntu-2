/*
 * Page Object cho màn hình Đăng nhập — VÍ DỤ MẪU ĐÃ HOÀN THIỆN.
 *
 * Nguyên tắc của Page Object Model:
 *   - Lớp này giữ TOÀN BỘ locator và thao tác của một màn hình.
 *   - Lớp này KHÔNG chứa expect(). Khẳng định thuộc về ca kiểm thử.
 *   - Giao diện đổi id hay đổi nhãn: chỉ sửa ở đây, mọi ca kiểm thử giữ nguyên.
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    this.oEmail = page.getByTestId('login-email');
    this.oMatKhau = page.getByTestId('login-password');
    this.nutDangNhap = page.getByTestId('btn-login');
    this.thongBao = page.getByTestId('login-msg');
    this.thanhNguoiDung = page.getByTestId('user-bar');
  }

  async moTrang() {
    await this.page.goto('/');
  }

  async dangNhap(email, matKhau) {
    await this.oEmail.fill(email);
    await this.oMatKhau.fill(matKhau);
    await this.nutDangNhap.click();
  }

  /** Đăng nhập sai mật khẩu `soLan` lần liên tiếp. */
  async dangNhapSaiNhieuLan(email, soLan) {
    for (let i = 0; i < soLan; i++) {
      await this.dangNhap(email, 'MatKhauSai' + i);
      // Chờ thông báo xuất hiện rồi mới sang lần kế tiếp, tránh bấm chồng lệnh
      await this.thongBao.waitFor({ state: 'visible' });
    }
  }
}

module.exports = { LoginPage };
