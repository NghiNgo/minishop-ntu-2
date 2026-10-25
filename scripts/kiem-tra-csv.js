#!/usr/bin/env node
/*
 * Kiểm tra hình thức bài nộp Buổi 2 (chạy trong GitHub Actions khi mở/cập nhật PR).
 * Chỉ kiểm tra HÌNH THỨC: định dạng file, mã ca, số ca tối thiểu, JSON hợp lệ.
 * Nội dung (giá trị biên, luật bảng quyết định…) do giảng viên chấm.
 *
 * Chạy thử trên máy:  node scripts/kiem-tra-csv.js
 */
const fs = require('fs');
const path = require('path');

const THU_MUC = path.join(__dirname, '..', 'bai-nop');
const FILE_CA = path.join(THU_MUC, 'Buoi02-TestCase.csv');
const FILE_DU_LIEU = path.join(THU_MUC, 'Buoi02-DuLieuKiemThu.csv');
const FILE_MD = ['Buoi02-PhanHoach.md', 'Buoi02-BangQuyetDinh.md', 'Buoi02-SoDoTrangThai.md', 'Buoi02-ThucThi-RTM.md'];

const COT_CA = ['MaCa', 'YeuCau', 'KyThuat', 'MucTieu', 'TienDieuKien', 'DuLieuVao', 'KetQuaMongDoi', 'DoUuTien'];
const COT_DU_LIEU = ['MaCa', 'Ham', 'ThamSo', 'KetQuaKyVong'];
const KY_THUAT = ['EP', 'BVA', 'DT', 'ST'];
const UU_TIEN = ['Cao', 'TrungBinh', 'Thap'];
const HAM = ['validateRegistration', 'validateQuantity', 'calcShippingFee'];
const TOI_THIEU = { 'EP+BVA': 12, DT: 8, ST: 8 };
const TOI_THIEU_DU_LIEU = 15;

const loi = [];
const canhBao = [];

// ---------- Đọc CSV (hỗ trợ dấu nháy kép và xuống dòng trong ô) ----------
function docCsv(noiDung) {
  const dong = [];
  let o = '', hang = [], trongNhay = false;
  for (let i = 0; i < noiDung.length; i++) {
    const c = noiDung[i];
    if (trongNhay) {
      if (c === '"') {
        if (noiDung[i + 1] === '"') { o += '"'; i++; } else { trongNhay = false; }
      } else o += c;
    } else if (c === '"') trongNhay = true;
    else if (c === ',') { hang.push(o); o = ''; }
    else if (c === '\n') { hang.push(o); dong.push(hang); hang = []; o = ''; }
    else if (c !== '\r') o += c;
  }
  if (o !== '' || hang.length) { hang.push(o); dong.push(hang); }
  return dong.filter((h) => h.some((x) => x.trim() !== ''));
}

function doc(file, cot, ten) {
  if (!fs.existsSync(file)) { loi.push(`Không tìm thấy file ${ten}`); return null; }

  // Kiểm tra mã hóa: file BẮT BUỘC phải là UTF-8 (có hoặc không có BOM đều được)
  const bytes = fs.readFileSync(file);
  let noiDung;
  try {
    noiDung = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    loi.push(`${ten}: file KHÔNG phải UTF-8 (nhiều khả năng đã lưu bằng Excel ở dạng ANSI/Windows-1258) nên tiếng Việt sẽ bị hỏng. Mở lại bằng Google Sheets rồi tải về dạng "Comma-separated values (.csv)", hoặc trong Excel chọn "CSV UTF-8 (Comma delimited)".`);
    return null;
  }
  if (noiDung.charCodeAt(0) === 0xfeff) noiDung = noiDung.slice(1);

  const dongDau = noiDung.split('\n')[0];
  if (dongDau.includes(';') && !dongDau.includes(',')) {
    loi.push(`${ten}: file đang dùng dấu CHẤM PHẨY làm dấu phân cách. Mở lại bằng Google Sheets rồi tải về dạng "Comma-separated values (.csv)".`);
    return null;
  }
  if (/Ã¡|Ã´|áº|â€|Ä‘/.test(noiDung) || noiDung.includes('\uFFFD')) {
    loi.push(`${ten}: tiếng Việt bị lỗi mã hóa (xuất hiện ký tự hỏng như "Ã", "áº" hoặc "�"). File phải lưu ở dạng UTF-8 — Google Sheets luôn xuất UTF-8.`);
    return null;
  }

  const bang = docCsv(noiDung);
  if (bang.length === 0) { loi.push(`${ten}: file rỗng`); return null; }
  const tieuDe = bang[0].map((x) => x.trim());
  if (tieuDe.join(',') !== cot.join(',')) {
    loi.push(`${ten}: dòng tiêu đề sai. Cần đúng: ${cot.join(',')} — đang có: ${tieuDe.join(',')}`);
    return null;
  }
  return bang.slice(1).map((h, i) => {
    const o = { _dong: i + 2 };
    cot.forEach((c, j) => { o[c] = (h[j] || '').trim(); });
    return o;
  });
}

// ---------- 1. File ca kiểm thử ----------
const ca = doc(FILE_CA, COT_CA, 'Buoi02-TestCase.csv');
let mssv = null;
if (ca) {
  const mau = ca.filter((r) => r.MaCa.startsWith('TC-00000000'));
  if (mau.length) loi.push(`Buoi02-TestCase.csv: còn dòng ví dụ mẫu (TC-00000000-00), hãy xóa đi`);

  const daThay = new Set();
  const dem = { EP: 0, BVA: 0, DT: 0, ST: 0 };
  for (const r of ca.filter((r) => !r.MaCa.startsWith('TC-00000000'))) {
    const m = r.MaCa.match(/^TC-(\d{6,10})-(\d{2})$/);
    if (!m) loi.push(`Dòng ${r._dong}: MaCa "${r.MaCa}" sai định dạng, phải là TC-<MSSV>-<2 chữ số>`);
    else { mssv = mssv || m[1]; if (m[1] !== mssv) loi.push(`Dòng ${r._dong}: MSSV trong mã ca không thống nhất (${m[1]} ≠ ${mssv})`); }

    if (daThay.has(r.MaCa)) loi.push(`Dòng ${r._dong}: mã ca "${r.MaCa}" bị trùng`);
    daThay.add(r.MaCa);

    if (!KY_THUAT.includes(r.KyThuat)) loi.push(`Dòng ${r._dong}: KyThuat phải là một trong ${KY_THUAT.join('/')}, đang là "${r.KyThuat}"`);
    else dem[r.KyThuat]++;

    if (!UU_TIEN.includes(r.DoUuTien)) loi.push(`Dòng ${r._dong}: DoUuTien phải là ${UU_TIEN.join('/')}, đang là "${r.DoUuTien}"`);
    if (!/^(FR|NFR)-\d{2}(\.\d)?$/.test(r.YeuCau)) loi.push(`Dòng ${r._dong}: YeuCau "${r.YeuCau}" phải là mã yêu cầu trong SRS v1.1, ví dụ FR-01.3`);

    for (const c of ['MucTieu', 'TienDieuKien', 'DuLieuVao', 'KetQuaMongDoi']) {
      if (!r[c]) loi.push(`Dòng ${r._dong}: thiếu nội dung cột ${c}`);
    }
    if (r.TienDieuKien && !/^TD[1-5]$/.test(r.TienDieuKien) && r.TienDieuKien.length < 15) {
      canhBao.push(`Dòng ${r._dong}: TienDieuKien "${r.TienDieuKien}" không phải mã TD1–TD5 và cũng quá ngắn`);
    }
    if (r.KetQuaMongDoi && r.KetQuaMongDoi.length < 25) {
      canhBao.push(`Dòng ${r._dong}: KetQuaMongDoi quá ngắn ("${r.KetQuaMongDoi}") — kết quả mong đợi phải kiểm chứng được`);
    }
  }

  const epbva = dem.EP + dem.BVA;
  if (epbva < TOI_THIEU['EP+BVA']) loi.push(`Phần 1: mới có ${epbva} ca EP/BVA, cần ít nhất ${TOI_THIEU['EP+BVA']}`);
  if (dem.DT < TOI_THIEU.DT) loi.push(`Phần 2: mới có ${dem.DT} ca DT, cần ít nhất ${TOI_THIEU.DT}`);
  if (dem.ST < TOI_THIEU.ST) loi.push(`Phần 3: mới có ${dem.ST} ca ST, cần ít nhất ${TOI_THIEU.ST}`);
  if (dem.DoUuTien !== undefined) { /* no-op */ }
  if (ca.filter((r) => r.DoUuTien === 'Cao').length < 5) loi.push(`Cần ít nhất 5 ca có DoUuTien = Cao (để chạy thử ở Phần 4)`);
  console.log(`   Số ca: EP ${dem.EP} · BVA ${dem.BVA} · DT ${dem.DT} · ST ${dem.ST} · tổng ${dem.EP + dem.BVA + dem.DT + dem.ST}`);
}

// ---------- 2. File dữ liệu cho Buổi 3 ----------
const dl = doc(FILE_DU_LIEU, COT_DU_LIEU, 'Buoi02-DuLieuKiemThu.csv');
if (dl) {
  const thuc = dl.filter((r) => !r.MaCa.startsWith('TC-00000000'));
  if (thuc.length < TOI_THIEU_DU_LIEU) loi.push(`Buoi02-DuLieuKiemThu.csv: mới có ${thuc.length} dòng, cần ít nhất ${TOI_THIEU_DU_LIEU}`);
  const maCa = new Set((ca || []).map((r) => r.MaCa));
  const hamDaDung = new Set();
  for (const r of thuc) {
    if (!HAM.includes(r.Ham)) loi.push(`DuLieuKiemThu dòng ${r._dong}: Ham phải là một trong ${HAM.join(', ')}`);
    else hamDaDung.add(r.Ham);
    if (maCa.size && !maCa.has(r.MaCa)) loi.push(`DuLieuKiemThu dòng ${r._dong}: mã ca "${r.MaCa}" không có trong Buoi02-TestCase.csv`);
    let ts;
    try { ts = JSON.parse(r.ThamSo); } catch (e) { loi.push(`DuLieuKiemThu dòng ${r._dong}: ThamSo không phải JSON hợp lệ (${e.message})`); }
    if (ts && typeof ts !== 'object') loi.push(`DuLieuKiemThu dòng ${r._dong}: ThamSo phải là một đối tượng JSON, ví dụ {"qty":0}`);
    if (r.Ham === 'calcShippingFee') {
      if (!/^\d+$/.test(r.KetQuaKyVong)) loi.push(`DuLieuKiemThu dòng ${r._dong}: với calcShippingFee, KetQuaKyVong phải là một con số (phí vận chuyển)`);
    } else if (!['HOP_LE', 'KHONG_HOP_LE'].includes(r.KetQuaKyVong)) {
      loi.push(`DuLieuKiemThu dòng ${r._dong}: KetQuaKyVong phải là HOP_LE hoặc KHONG_HOP_LE`);
    }
  }
  for (const h of HAM) if (!hamDaDung.has(h)) loi.push(`Buoi02-DuLieuKiemThu.csv: chưa có dòng nào cho hàm ${h}`);
}

// ---------- 3. Các file Markdown ----------
for (const f of FILE_MD) {
  const p = path.join(THU_MUC, f);
  if (!fs.existsSync(p)) { loi.push(`Không tìm thấy file ${f}`); continue; }
  const nd = fs.readFileSync(p, 'utf8');
  if (nd.includes('CHUA_DIEN')) loi.push(`${f}: chưa điền xong (vẫn còn dòng đánh dấu CHUA_DIEN)`);
  if (!/\*\*MSSV:\*\*\s*\S/.test(nd)) loi.push(`${f}: chưa điền MSSV`);
}
const sd = path.join(THU_MUC, 'Buoi02-SoDoTrangThai.md');
if (fs.existsSync(sd)) {
  const nd = fs.readFileSync(sd, 'utf8');
  const khoi = nd.match(/```mermaid([\s\S]*?)```/);
  if (!khoi) loi.push('Buoi02-SoDoTrangThai.md: không tìm thấy khối ```mermaid```');
  else {
    const than = khoi[1].trim();
    if (!/stateDiagram-v2/.test(than)) loi.push('Buoi02-SoDoTrangThai.md: khối mermaid phải bắt đầu bằng stateDiagram-v2');
    const soChuyen = (than.match(/-->/g) || []).length;
    if (soChuyen < 5) loi.push(`Buoi02-SoDoTrangThai.md: sơ đồ mới có ${soChuyen} chuyển đổi, còn sơ sài so với bảng chuyển đổi`);
  }
}

// ---------- Kết luận ----------
for (const c of canhBao) console.log(`⚠️  ${c}`);
if (loi.length === 0) {
  console.log('✅ Bài nộp Buổi 2 đạt các kiểm tra hình thức.');
  process.exit(0);
}
console.log(`\n❌ Còn ${loi.length} vấn đề cần sửa:`);
loi.forEach((l, i) => {
  console.log(`   ${i + 1}. ${l}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::error::${l}`);
});
process.exit(1);
