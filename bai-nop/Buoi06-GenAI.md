# BUỔI 6 – PHẢN BIỆN CA KIỂM THỬ DO GEN-AI SINH RA

<!-- CHUA_DIEN: xóa dòng này sau khi đã điền xong file -->

- **Họ tên:**
- **MSSV:**

## 1. Nguồn bộ ca được phản biện

Đánh dấu một lựa chọn:

- [ ] Dùng bộ ca có sẵn trong `docs/Buoi06-TestCaseDoAISinh.md`, đã chép vào `tests/gen-ai/ai-sinh.test.js`
- [ ] Tự sinh bằng công cụ: …………… (ghi rõ tên công cụ, phiên bản và câu lệnh đã dùng)

Nếu tự sinh, dán nguyên văn câu lệnh và kết quả vào phụ lục cuối file. Số ca phải từ 8 trở lên.

## 2. Dự đoán trước khi chạy, và kết quả thật

Đọc `src/services/shipping.js` và mục FR-04 của SRS v1.2, **dự đoán trước** ca nào sẽ đỏ. Sau đó chạy `npm run test:ai` và ghi kết quả thật vào cột bên cạnh.

> Giữ nguyên phần dự đoán kể cả khi dự đoán sai. Chỗ lệch giữa hai cột là chỗ đáng học nhất.

| Mã ca | Dự đoán (xanh/đỏ) | Kết quả thật | Lệch? |
|---|---|---|---|
| AI-01 | | | |
| AI-02 | | | |
| AI-03 | | | |
| AI-04 | | | |
| AI-05 | | | |
| AI-06 | | | |
| AI-07 | | | |
| AI-08 | | | |
| AI-09 | | | |
| AI-10 | | | |
| AI-11 | | | |

| Chỉ số | Giá trị |
|---|---|
| Tổng số ca | |
| Số ca đạt | |
| Số ca thất bại | |
| Số ca dự đoán đúng | |

## 3. Phản biện từng ca

Phân loại mỗi ca theo **đúng một** trong bốn nhãn:

- **ĐÚNG** – ca hợp lệ, kết quả mong đợi đúng theo SRS v1.2;
- **SAI KẾT QUẢ** – AI bịa ra hành vi mà hệ thống không có (hallucination);
- **THỪA** – trùng lớp tương đương với ca khác, không tăng khả năng bắt lỗi;
- **LUÔN XANH** – ca không thể thất bại dù mã nguồn sai, nên vô giá trị.

Hai lưu ý khi phân loại: một ca **đỏ** không tự động là `SAI KẾT QUẢ` — phải xác định bên nào sai, ca kiểm thử hay sản phẩm; một ca **xanh** không tự động là `ĐÚNG` — ca luôn xanh cũng xanh. Với nhãn `THỪA`, phải chỉ rõ trùng với ca nào.

| Mã ca | Phân loại | Giải thích | Căn cứ (SRS v1.2 hoặc mã nguồn) |
|---|---|---|---|
| AI-01 | | | |
| AI-02 | | | |
| AI-03 | | | |
| AI-04 | | | |
| AI-05 | | | |
| AI-06 | | | |
| AI-07 | | | |
| AI-08 | | | |
| AI-09 | | | |
| AI-10 | | | |
| AI-11 | | | |

**Tổng hợp:** ĐÚNG …… / SAI KẾT QUẢ …… / THỪA …… / LUÔN XANH ……

## 4. Những gì AI bỏ sót

Đối chiếu với bộ ca của chính mình ở Buổi 2 và Buổi 3.

| Trường hợp bị bỏ sót | Căn cứ trong SRS v1.2 | Hậu quả nếu không kiểm |
|---|---|---|
| | | |
| | | |
| | | |
| | | |

## 5. Kiểm chứng lời tuyên bố của AI

AI khẳng định bộ ca của nó *"đạt 100% độ bao phủ câu lệnh và có thể dùng ngay trong dự án"*.

Đo thật bằng `npm run coverage:ai`.

| Chỉ số | AI tuyên bố | Đo được thực tế |
|---|---|---|
| Bao phủ câu lệnh | 100% | |
| Bao phủ nhánh | (không nêu) | |
| Dòng chưa được phủ | (không nêu) | |

**5.1.** Nhận xét về độ tin cậy của lời tuyên bố này:

**5.2.** Trong bộ ca này có ca thuộc nhãn `LUÔN XANH`. Những ca đó có làm **tăng** độ bao phủ hay không? Điều đó nói lên hạn chế gì của việc dùng độ bao phủ làm thước đo chất lượng bộ kiểm thử?

## 6. Kết luận

**6.1.** Trong 11 ca, bao nhiêu ca **dùng được ngay**, bao nhiêu ca **phải sửa**, bao nhiêu ca **nên bỏ**? Tính tỷ lệ dùng được. Viết thêm 4–6 dòng như một nhận xét review nếu nhận bộ ca này từ một đồng nghiệp mới vào nghề.

**6.2.** Giữa hai việc — tự viết bộ ca từ đầu, và sửa bộ ca do AI sinh ra — việc nào mất ít công hơn cho hàm `calcShippingFee`? Trả lời **có số liệu** (số ca phải đọc, số ca phải sửa, số ca phải viết thêm), không trả lời theo cảm nhận.

**6.3.** Mục 0.3 của đề bài đã loại `tests/gen-ai/` khỏi `npm test`. Sau khi phản biện xong, nêu **điều kiện cụ thể** để một bộ ca do AI sinh ra được phép đưa vào quy trình tự động.

## Phụ lục (nếu tự sinh bộ ca)

Câu lệnh đã dùng:

Kết quả nguyên văn:
