#!/usr/bin/env node
/*
 * Kiểm tra hình thức bài nộp Buổi 6 (chạy trong GitHub Actions khi mở/cập nhật PR).
 *
 * Script KHÔNG yêu cầu mọi ca kiểm thử phải xanh: MiniShop v1.1 vẫn còn lỗi.
 *
 * Chạy thử trên máy:  node scripts/kiem-tra-buoi06.js
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..');
const FILE_API = ['tests/api/01-xac-thuc.spec.js', 'tests/api/02-nghiep-vu.spec.js'];
const FILE_MD = ['Buoi06-BaoCaoAPI-CI.md', 'Buoi06-GenAI.md', 'Buoi06-TongKet.md'];
const WORKFLOW = '.github/workflows/kiem-thu-day-du.yml';
const TOI_THIEU_API = 12;

const loi = [];
const doc = (p) => fs.readFileSync(path.join(GOC, p), 'utf8');
const ton_tai = (p) => fs.existsSync(path.join(GOC, p));
const boChuThich = (nd) => nd.split('\n').filter((d) => !d.trim().startsWith('//') && !d.trim().startsWith('#') && !d.trim().startsWith('*')).join('\n');

// ---------- 1. Hai file kiểm thử API ----------
let soCaApi = 0;
for (const f of FILE_API) {
  if (!ton_tai(f)) { loi.push(`Không tìm thấy ${f}`); continue; }
  const nd = doc(f);
  const soTodo = (nd.match(/TODO \(\d+[a-z]?\)/g) || []).length;
  if (soTodo > 0) loi.push(`${f}: còn ${soTodo} mục TODO chưa làm`);
  const soSkip = (nd.match(/test\.skip\(/g) || []).length;
  if (soSkip > 0) loi.push(`${f}: còn ${soSkip} ca đánh dấu test.skip`);
  soCaApi += (nd.match(/^test\(/gm) || []).length;

  const ma = boChuThich(nd);
  if (!/request\.(get|post|delete|put|patch)\(/.test(ma)) {
    loi.push(`${f}: chưa dùng đối tượng request của Playwright để gọi API`);
  }
  if (!/\.status\(\)/.test(ma)) {
    loi.push(`${f}: chưa khẳng định mã trạng thái HTTP bằng res.status()`);
  }
  if (/\bpage\.(goto|getBy|locator)/.test(ma)) {
    loi.push(`${f}: kiểm thử API không được mở trình duyệt; chỉ dùng request`);
  }
}
if (soCaApi < TOI_THIEU_API) {
  loi.push(`Mới có ${soCaApi} ca API, cần ít nhất ${TOI_THIEU_API}`);
}

// ---------- 2. Phủ các mã trạng thái và điểm cuối quan trọng ----------
if (FILE_API.every(ton_tai)) {
  // Bỏ chú thích trước khi dò: các mục TODO trong bản khung cũng nhắc tới
  // mã trạng thái và mã yêu cầu, nếu dò trên nội dung thô sẽ báo đạt oan.
  const gop = boChuThich(FILE_API.map(doc).join('\n'));
  for (const ma of ['400', '401', '404', '423']) {
    if (!new RegExp(`toBe\\(${ma}\\)`).test(gop)) {
      loi.push(`Chưa có ca nào khẳng định mã trạng thái ${ma}`);
    }
  }
  if (!/FR-05\.5/.test(gop)) loi.push('Chưa có ca kiểm thử cho FR-05.5 (hủy đơn hàng)');
  if (!/FR-06\./.test(gop)) loi.push('Chưa có ca kiểm thử API cho FR-06 (bộ lọc sản phẩm)');
}

// ---------- 3. Workflow CI ----------
if (!ton_tai(WORKFLOW)) {
  loi.push(`Không tìm thấy ${WORKFLOW}`);
} else {
  const ndTho = doc(WORKFLOW);
  const soTodo = (ndTho.match(/TODO \(\d+[a-z]?\)/g) || []).length;
  if (soTodo > 0) loi.push(`${WORKFLOW}: còn ${soTodo} mục TODO chưa làm`);
  // Mọi dò tìm bên dưới đều chạy trên nội dung đã bỏ dòng chú thích, vì bản
  // khung viết sẵn tên lệnh trong chú thích hướng dẫn.
  const nd = boChuThich(ndTho);
  const buoc = [
    ['npm test', 'chạy kiểm thử đơn vị'],
    ['playwright install', 'cài trình duyệt cho Playwright'],
    ['tests/api', 'chạy kiểm thử API'],
    ['tests/e2e', 'chạy kiểm thử đầu cuối'],
    ['upload-artifact', 'tải lên báo cáo Playwright'],
  ];
  for (const [mau, mo] of buoc) {
    if (!nd.includes(mau)) loi.push(`${WORKFLOW}: thiếu bước ${mo}`);
  }
  // MiniShop còn lỗi thật nên các bước kiểm thử sẽ đỏ. Không có if: always()
  // thì GitHub dừng job ngay ở bước đỏ đầu tiên và không còn báo cáo nào.
  const soAlways = (nd.match(/if:\s*always\(\)/g) || []).length;
  if (soAlways < 3) {
    loi.push(`${WORKFLOW}: mới có ${soAlways} bước đặt "if: always()", cần ít nhất 3 (các bước kiểm thử và bước tải báo cáo), nếu không job sẽ dừng ngay ở bước đỏ đầu tiên`);
  }
  // Hai tầng ghi cùng một thư mục báo cáo thì tầng sau xóa mất tầng trước.
  if (!/PLAYWRIGHT_HTML_REPORT/.test(nd)) {
    loi.push(`${WORKFLOW}: chưa tách thư mục báo cáo theo tầng bằng PLAYWRIGHT_HTML_REPORT, báo cáo API sẽ bị báo cáo đầu cuối ghi đè`);
  }
  const viTriCai = nd.indexOf('playwright install');
  const viTriApi = nd.indexOf('tests/api');
  if (viTriCai > -1 && viTriApi > -1 && viTriCai > viTriApi) {
    loi.push(`${WORKFLOW}: bước cài trình duyệt phải đứng TRƯỚC bước chạy kiểm thử API`);
  }
}

// ---------- 4. Ba báo cáo ----------
for (const f of FILE_MD) {
  const p = 'bai-nop/' + f;
  if (!ton_tai(p)) { loi.push(`Không tìm thấy ${p}`); continue; }
  const nd = doc(p);
  if (nd.includes('CHUA_DIEN')) loi.push(`${p}: chưa điền xong (vẫn còn dòng đánh dấu CHUA_DIEN)`);
  if (!/\*\*MSSV:\*\*\s*\S/.test(nd)) loi.push(`${p}: chưa điền MSSV`);
}
if (ton_tai('bai-nop/Buoi06-GenAI.md')) {
  const nd = doc('bai-nop/Buoi06-GenAI.md');
  // Chỉ đếm trong các dòng bảng "| AI-xx | <phân loại> | ...", không đếm phần
  // chú giải bốn nhãn ở trên bảng.
  const dongBang = nd.split('\n').filter((d) => /^\|\s*AI-\d+\s*\|/.test(d));
  const soPhanLoai = dongBang.filter((d) => /\|\s*(ĐÚNG|SAI KẾT QUẢ|THỪA|LUÔN XANH)\s*\|/.test(d)).length;
  if (soPhanLoai < 11) {
    loi.push(`Buoi06-GenAI.md: bảng phản biện mới có ${soPhanLoai}/11 dòng được phân loại bằng đúng một trong bốn nhãn`);
  }
}
if (ton_tai('bai-nop/Buoi06-TongKet.md')) {
  const nd = doc('bai-nop/Buoi06-TongKet.md');
  const soX = (nd.match(/\|\s*[Xx]\s*\|/g) || []).length;
  if (soX < 9) loi.push(`Buoi06-TongKet.md: bản đồ lỗi theo tầng mới điền ${soX} ô, cần ít nhất 9`);
}

// ---------- 5. Chạy toàn bộ bộ kiểm thử ----------
const fileKq = path.join(GOC, 'ket-qua-buoi06.json');
const chay = spawnSync('npx', ['playwright', 'test', 'tests/api', '--reporter=json'], {
  cwd: GOC, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: fileKq, CI: '1' },
});
if (!fs.existsSync(fileKq)) {
  loi.push('Không chạy được kiểm thử API: ' + String(chay.stderr || chay.stdout || '').split('\n').slice(-5).join(' | '));
} else {
  const kq = JSON.parse(fs.readFileSync(fileKq, 'utf8'));
  fs.unlinkSync(fileKq);
  let tong = 0, dat = 0, truot = 0;
  const duyet = (bo) => {
    for (const s of bo.suites || []) duyet(s);
    for (const sp of bo.specs || []) {
      for (const t of sp.tests || []) {
        tong++;
        const c = t.results[t.results.length - 1];
        if (t.status === 'skipped' || c.status === 'skipped') continue;
        if (c.status === 'passed') dat++; else truot++;
      }
    }
  };
  for (const bo of kq.suites || []) duyet(bo);
  console.log(`   Kiểm thử API: ${tong} ca (${dat} đạt, ${truot} thất bại)`);
  if ((kq.errors || []).length > 0) loi.push(`Có ${kq.errors.length} lỗi khi nạp file kiểm thử API`);
}

// ---------- Kết luận ----------
if (loi.length === 0) {
  console.log('Bài nộp Buổi 6 đạt các kiểm tra hình thức.');
  console.log('   (Ca thất bại do lỗi cài sẵn của MiniShop không bị tính là lỗi bài nộp.)');
  process.exit(0);
}
console.log(`\nCòn ${loi.length} vấn đề cần sửa:`);
loi.forEach((l, i) => {
  console.log(`   ${i + 1}. ${l}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::error::${l}`);
});
process.exit(1);
