#!/usr/bin/env node
/*
 * Kiểm tra hình thức bài nộp Buổi 5 (chạy trong GitHub Actions khi mở/cập nhật PR).
 *
 * Script KHÔNG yêu cầu mọi ca kiểm thử phải xanh: MiniShop v1.1 vẫn còn lỗi,
 * và phát hiện chúng chính là mục tiêu của buổi học.
 *
 * Chạy thử trên máy:  node scripts/kiem-tra-buoi05.js
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..');
const FILE_SPEC = [
  'tests/e2e/01-luong-chinh.spec.js',
  'tests/e2e/02-flaky.spec.js',
  'tests/e2e/03-pom.spec.js',
  'tests/e2e/04-loc-san-pham.spec.js',
];
const FILE_POM = ['tests/pages/ProductPage.js', 'tests/pages/CartPage.js'];
const FILE_MD = ['Buoi05-BaoCaoE2E.md', 'Buoi05-Flaky-POM.md'];
const TOI_THIEU_E2E = 15;

const loi = [];
const doc = (p) => fs.readFileSync(path.join(GOC, p), 'utf8');
const ton_tai = (p) => fs.existsSync(path.join(GOC, p));

// ---------- 1. Khung bài đã hoàn thành ----------
for (const f of [...FILE_SPEC, ...FILE_POM]) {
  if (!ton_tai(f)) { loi.push(`Không tìm thấy ${f}`); continue; }
  const nd = doc(f);
  const soTodo = (nd.match(/TODO \(\d+[a-z]?\)/g) || []).length;
  if (soTodo > 0) loi.push(`${f}: còn ${soTodo} mục TODO chưa làm`);
  if (/Chưa hoàn thành TODO/.test(nd)) loi.push(`${f}: còn phương thức ném lỗi "Chưa hoàn thành TODO"`);
  const soSkip = (nd.match(/test\.skip\(/g) || []).length;
  if (soSkip > 0 && f !== 'tests/e2e/02-flaky.spec.js') {
    loi.push(`${f}: còn ${soSkip} ca đánh dấu test.skip, hãy hoàn thành rồi bỏ .skip`);
  }
}

// ---------- 2. Kỹ thuật bắt buộc ----------
if (ton_tai('tests/e2e/02-flaky.spec.js')) {
  const nd = doc('tests/e2e/02-flaky.spec.js');
  // Bỏ qua dòng chú thích, chỉ bắt lệnh gọi thật
  const maLenh = nd.split('\n').filter((d) => !d.trim().startsWith('//') && !d.trim().startsWith('*')).join('\n');
  if (/waitForTimeout\s*\(/.test(maLenh)) {
    loi.push('tests/e2e/02-flaky.spec.js: vẫn còn waitForTimeout. Hãy thay bằng web-first assertion');
  }
  if (!/await expect\(/.test(maLenh)) loi.push('tests/e2e/02-flaky.spec.js: chưa dùng web-first assertion (await expect)');
}
if (ton_tai('tests/e2e/03-pom.spec.js')) {
  const nd = doc('tests/e2e/03-pom.spec.js');
  const ma = nd.split('\n').filter((d) => !d.trim().startsWith('//') && !d.trim().startsWith('*')).join('\n');
  if (/page\.getByTestId|page\.locator\(/.test(ma)) {
    loi.push('tests/e2e/03-pom.spec.js: còn gọi locator trực tiếp. Mọi locator phải nằm trong tests/pages/');
  }
  for (const lop of ['LoginPage', 'ProductPage', 'CartPage']) {
    if (!nd.includes(lop)) loi.push(`tests/e2e/03-pom.spec.js: chưa dùng ${lop}`);
  }
}
if (ton_tai('tests/e2e/04-loc-san-pham.spec.js')) {
  const nd = doc('tests/e2e/04-loc-san-pham.spec.js');
  const soCa = (nd.match(/^test\(/gm) || []).length;
  if (soCa < 6) loi.push(`tests/e2e/04-loc-san-pham.spec.js: mới có ${soCa} ca, cần ít nhất 6 (1 ca mẫu + 5 ca tự viết)`);
  for (const yc of ['FR-06.5', 'FR-06.6']) {
    if (!nd.includes(yc)) loi.push(`tests/e2e/04-loc-san-pham.spec.js: chưa có ca cho ${yc}`);
  }
}
for (const f of FILE_POM) {
  if (!ton_tai(f)) continue;
  const nd = doc(f);
  if (/expect\(/.test(nd)) loi.push(`${f}: Page Object không được chứa expect(); khẳng định thuộc về ca kiểm thử`);
}

// ---------- 3. Hai báo cáo ----------
for (const f of FILE_MD) {
  const p = 'bai-nop/' + f;
  if (!ton_tai(p)) { loi.push(`Không tìm thấy ${p}`); continue; }
  const nd = doc(p);
  if (nd.includes('CHUA_DIEN')) loi.push(`${p}: chưa điền xong (vẫn còn dòng đánh dấu CHUA_DIEN)`);
  if (!/\*\*MSSV:\*\*\s*\S/.test(nd)) loi.push(`${p}: chưa điền MSSV`);
}

// ---------- 4. Chạy bộ kiểm thử E2E ----------
const fileKq = path.join(GOC, 'ket-qua-e2e.json');
const chay = spawnSync('npx', ['playwright', 'test', '--reporter=json'], {
  cwd: GOC, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: fileKq, CI: '1' },
});

if (!fs.existsSync(fileKq)) {
  const err = String(chay.stderr || chay.stdout || '').split('\n').slice(-6).join(' | ');
  loi.push('Không chạy được Playwright: ' + err);
} else {
  const kq = JSON.parse(fs.readFileSync(fileKq, 'utf8'));
  fs.unlinkSync(fileKq);
  let tong = 0, dat = 0, truot = 0, boQua = 0;
  const duyet = (bo) => {
    for (const s of bo.suites || []) duyet(s);
    for (const sp of bo.specs || []) {
      for (const t of sp.tests || []) {
        tong++;
        const kquaCuoi = t.results[t.results.length - 1];
        if (t.status === 'skipped' || kquaCuoi.status === 'skipped') boQua++;
        else if (kquaCuoi.status === 'passed') dat++;
        else truot++;
      }
    }
  };
  for (const bo of kq.suites || []) duyet(bo);
  console.log(`   Playwright: ${tong} ca E2E (${dat} đạt, ${truot} thất bại, ${boQua} bỏ qua)`);
  if (tong - boQua < TOI_THIEU_E2E) {
    loi.push(`Mới có ${tong - boQua} ca E2E chạy thật, cần ít nhất ${TOI_THIEU_E2E}`);
  }
  if ((kq.errors || []).length > 0) {
    loi.push(`Có ${kq.errors.length} lỗi khi nạp file kiểm thử (lỗi cú pháp hoặc thiếu module)`);
  }
}

// ---------- Kết luận ----------
if (loi.length === 0) {
  console.log('Bài nộp Buổi 5 đạt các kiểm tra hình thức.');
  console.log('   (Ca E2E thất bại do lỗi cài sẵn của MiniShop không bị tính là lỗi bài nộp.)');
  process.exit(0);
}
console.log(`\nCòn ${loi.length} vấn đề cần sửa:`);
loi.forEach((l, i) => {
  console.log(`   ${i + 1}. ${l}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::error::${l}`);
});
process.exit(1);
