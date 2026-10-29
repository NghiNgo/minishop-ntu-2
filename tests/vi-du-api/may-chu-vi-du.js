/*
 * Máy chủ API ví dụ cho Buổi 6 — KHÔNG thuộc MiniShop.
 * Mô phỏng dịch vụ mượn sách thư viện, dùng để minh họa kỹ thuật kiểm thử API.
 */
const express = require('express');

function taoMayChuViDu() {
  const app = express();
  app.use(express.json());

  const sach = [
    { id: 1, tenSach: 'Nhập môn kiểm thử', soBanConLai: 2 },
    { id: 2, tenSach: 'Lập trình hướng đối tượng', soBanConLai: 0 },
  ];
  const phieuMuon = [];

  const timSach = (id) => sach.find((s) => s.id === Number(id));

  app.get('/sach', (req, res) => res.json(sach));

  app.get('/sach/:id', (req, res) => {
    const s = timSach(req.params.id);
    if (!s) return res.status(404).json({ thongBao: 'Không tìm thấy sách' });
    return res.json(s);
  });

  app.post('/phieu-muon', (req, res) => {
    const { maSach, maTheDocGia } = req.body || {};
    if (!maTheDocGia) {
      return res.status(400).json({ thongBao: 'Thiếu mã thẻ độc giả' });
    }
    const s = timSach(maSach);
    if (!s) return res.status(404).json({ thongBao: 'Không tìm thấy sách' });
    if (s.soBanConLai === 0) {
      return res.status(409).json({ thongBao: 'Sách đã hết bản để mượn' });
    }
    s.soBanConLai -= 1;
    const phieu = { id: phieuMuon.length + 1, maSach: s.id, maTheDocGia, trangThai: 'DANG_MUON' };
    phieuMuon.push(phieu);
    return res.status(201).json(phieu);
  });

  return app;
}

module.exports = { taoMayChuViDu };
