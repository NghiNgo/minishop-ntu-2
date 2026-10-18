// Cấu hình Playwright cho học phần Kiểm thử phần mềm (SOT357)
// Sinh viên KHÔNG sửa file này.
const { defineConfig, devices } = require('@playwright/test');

const CONG = 3000;

module.exports = defineConfig({
  // Playwright chỉ nhận file *.spec.js; Jest chỉ nhận *.test.js — hai bộ không giẫm chân nhau.
  testDir: './tests',
  testMatch: '**/*.spec.js',
  // Không chạy song song trong buổi học: MiniShop dùng dữ liệu chung trong bộ nhớ,
  // chạy song song sẽ khiến các ca ảnh hưởng lẫn nhau.
  fullyParallel: false,
  workers: 1,

  // Số lần chạy lại khi một ca thất bại. Đặt 0 có chủ đích: buổi học cần
  // NHÌN THẤY ca flaky, không che nó đi bằng cách chạy lại.
  retries: 0,

  timeout: 30 * 1000,
  expect: { timeout: 5 * 1000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: `http://localhost:${CONG}`,
    // Lưu lại dấu vết khi ca thất bại để phân tích bằng Trace Viewer
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10 * 1000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Tự khởi động MiniShop trước khi chạy, tự tắt sau khi xong.
  webServer: {
    command: 'npm start',
    // Bật điểm cuối đặt lại dữ liệu, chỉ dùng khi chạy kiểm thử tự động
    env: { ...process.env, MINISHOP_TEST_MODE: '1' },
    url: `http://localhost:${CONG}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
});
