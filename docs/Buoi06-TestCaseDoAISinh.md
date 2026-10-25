# BỘ CA KIỂM THỬ DO CÔNG CỤ GEN-AI SINH RA

> Tài liệu này dùng cho **Phần 3 Buổi 6**. Nội dung bên dưới là kết quả thật do một công cụ Gen-AI sinh ra, **chưa qua kiểm chứng**. Nhiệm vụ của sinh viên là phản biện nó.

---

## Câu lệnh đã dùng

> Tôi có hàm JavaScript `calcShippingFee({ subtotal, zone, customerType })` tính phí vận chuyển cho một cửa hàng trực tuyến. Phí nội thành là 20.000đ, ngoại thành 35.000đ. Đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển. Thành viên VIP được miễn phí vận chuyển ở mọi khu vực. Hãy sinh bộ ca kiểm thử Jest đầy đủ cho hàm này.

## Kết quả do Gen-AI sinh ra

```javascript
const { calcShippingFee } = require('../../src/services/shipping');

describe('calcShippingFee', () => {
  // AI-01
  test('tính phí nội thành cho đơn hàng thông thường', () => {
    expect(calcShippingFee({ subtotal: 200000, zone: 'noi-thanh', customerType: 'THUONG' })).toBe(20000);
  });

  // AI-02
  test('tính phí ngoại thành cho đơn hàng thông thường', () => {
    expect(calcShippingFee({ subtotal: 200000, zone: 'ngoai-thanh', customerType: 'THUONG' })).toBe(35000);
  });

  // AI-03
  test('đơn hàng 300.000đ nội thành', () => {
    expect(calcShippingFee({ subtotal: 300000, zone: 'noi-thanh', customerType: 'THUONG' })).toBe(20000);
  });

  // AI-04
  test('đơn hàng 400.000đ nội thành', () => {
    expect(calcShippingFee({ subtotal: 400000, zone: 'noi-thanh', customerType: 'THUONG' })).toBe(20000);
  });

  // AI-05
  test('miễn phí vận chuyển cho đơn hàng lớn', () => {
    expect(calcShippingFee({ subtotal: 600000, zone: 'noi-thanh', customerType: 'THUONG' })).toBe(0);
  });

  // AI-06
  test('đơn hàng 499.999đ vẫn phải trả phí', () => {
    expect(calcShippingFee({ subtotal: 499999, zone: 'noi-thanh', customerType: 'THUONG' })).toBe(20000);
  });

  // AI-07
  test('thành viên VIP được miễn phí vận chuyển', () => {
    expect(calcShippingFee({ subtotal: 100000, zone: 'noi-thanh', customerType: 'VIP' })).toBe(0);
  });

  // AI-08
  test('phí vận chuyển luôn là số không âm', () => {
    const phi = calcShippingFee({ subtotal: 200000, zone: 'noi-thanh', customerType: 'THUONG' });
    expect(phi).toBeGreaterThanOrEqual(0);
  });

  // AI-09
  test('hàm trả về giá trị hợp lệ với dữ liệu bất kỳ', () => {
    const phi = calcShippingFee({ subtotal: 150000, zone: 'ngoai-thanh', customerType: 'THUONG' });
    expect(phi).toBeDefined();
  });

  // AI-10
  test('khu vực không hợp lệ trả về phí mặc định 20.000đ', () => {
    expect(calcShippingFee({ subtotal: 200000, zone: 'tinh-khac', customerType: 'THUONG' })).toBe(20000);
  });

  // AI-11
  test('tạm tính bằng 0 thì không tính phí', () => {
    expect(calcShippingFee({ subtotal: 0, zone: 'noi-thanh', customerType: 'THUONG' })).toBe(0);
  });
});
```

## Lời giải thích kèm theo của Gen-AI

> Bộ ca kiểm thử trên gồm 11 ca, bao phủ đầy đủ các nhánh của hàm `calcShippingFee`, bao gồm trường hợp thông thường, trường hợp biên, ưu đãi VIP và xử lý dữ liệu không hợp lệ. Bộ ca đạt 100% độ bao phủ câu lệnh và có thể dùng ngay trong dự án.
