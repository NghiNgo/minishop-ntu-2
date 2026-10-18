# BUỔI 5 – BÁO CÁO KIỂM THỬ TỰ ĐỘNG GIAO DIỆN

<!-- CHUA_DIEN: xóa dòng này sau khi đã điền xong file -->

- **Họ tên:**
- **MSSV:**
- **Phiên bản phần mềm:** MiniShop NTU v1.1.0
- **Tài liệu yêu cầu:** SRS v1.2

## 1. Tổng hợp kết quả chạy `npm run e2e`

| Chỉ số | Giá trị |
|---|---|
| Tổng số ca E2E | |
| Số ca đạt | |
| Số ca thất bại | |
| Thời gian chạy toàn bộ | |

So sánh với việc chạy tay ở Buổi 4: cùng số lượng kịch bản tương đương thì chạy tay mất khoảng bao lâu?

## 2. Các ca đã tự động hóa ở Phần 1

| Mã ca Buổi 2 | Yêu cầu (SRS v1.2) | Tên ca E2E | Kết quả |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

## 3. Lựa chọn locator

Với **ba** phần tử bất kỳ đã dùng trong bài, ghi lại lựa chọn và lý do.

| Phần tử | Locator đã dùng | Vì sao chọn cách này thay vì cách khác |
|---|---|---|
| | | |
| | | |
| | | |

**Câu hỏi:** nếu lập trình viên đổi nhãn nút "Đăng nhập" thành "Vào hệ thống", những ca kiểm thử nào của mình sẽ gãy? Nếu đổi thuộc tính `data-testid` thì sao?

## 4. Kết quả kiểm thử hồi quy FR-06 (Phần 4)

| Yêu cầu | Tên ca E2E | Kết quả mong đợi | Kết quả thực tế | Pass/Fail |
|---|---|---|---|---|
| FR-06.2 | | | | |
| FR-06.4 | | | | |
| FR-06.5 (tăng dần) | | | | |
| FR-06.5 (giảm dần) | | | | |
| FR-06.6 | | | | |
| FR-06.7 | | | | |

## 5. Phân tích các ca thất bại

Với mỗi ca thất bại trong toàn bộ bài, điền một dòng. Phân loại nguyên nhân giống Buổi 3 và Buổi 4: **LỖI MÃ NGUỒN**, **LỖI CA KIỂM THỬ**, hoặc **YÊU CẦU CHƯA RÕ**.

| Tên ca E2E | Kết quả mong đợi | Kết quả thực tế | Phân loại | Căn cứ (SRS v1.2) |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

### 5.1. Đối chiếu với Buổi 4

Lỗi nào trong bảng trên đã được phát hiện bằng tay ở Buổi 4? Lỗi nào lần này mới thấy? Nếu có lỗi đã báo ở Buổi 4 mà bộ E2E không bắt được, giải thích vì sao.

## 6. Dùng Trace Viewer

Chọn **một** ca thất bại, mở dấu vết bằng lệnh mà Playwright gợi ý ở cuối kết quả chạy:

```
npx playwright show-trace test-results/<thư-mục-ca-thất-bại>/trace.zip
```

| Mục | Nội dung |
|---|---|
| Ca kiểm thử đã xem | |
| Bước nào thất bại | |
| Ảnh chụp màn hình tại thời điểm đó cho thấy điều gì | |
| Thông tin nào trong Trace Viewer hữu ích nhất khi tìm nguyên nhân | |

Chèn ảnh chụp màn hình Trace Viewer vào thư mục `bai-nop/hinh/` và dẫn link tại đây.
