import re

# 1. Sửa index.html loại bỏ hoàn toàn 'đẳng cấp thế giới'
with open(r'f:\PG Home - Quản trị\web_app\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'đẳng cấp thế giới', 'thực chiến & chuyên nghiệp', html, flags=re.IGNORECASE)
html = html.replace('Đẳng Cấp Thế Giới', 'Thực Chiến & Chuyên Nghiệp')
html = html.replace('ĐẲNG CẤP THẾ GIỚI', 'THỰC CHIẾN & CHUYÊN NGHIỆP')

with open(r'f:\PG Home - Quản trị\web_app\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("1. Đã dọn sạch từ 'đẳng cấp thế giới' trong index.html")

# 2. Sửa app.js dọn sạch hàm loadSampleEstimatorDuAn
with open(r'f:\PG Home - Quản trị\web_app\app.js', 'r', encoding='utf-8') as f:
    js = f.read()

target_str = """// Nạp dự toán mẫu thực tế của Phú Gia (Công trình BS Duẩn 345 Triệu)
function loadSampleEstimatorDuAn() {
  currentEstimatorItems = [
    { room: "1 – TẦNG 1", name: "Tủ giày kịch trần 1", material: "MDF cốt xanh chống ẩm phủ Melamine", dim: "1000 x 350 x 2950", unit: "m2", qty: 2.95, price: 2500000, total: 7375000, type: "WOOD_CN" },
    { room: "1 – TẦNG 1", name: "Tủ giày kịch trần 2", material: "MDF cốt xanh chống ẩm phủ Melamine", dim: "1200 x 300 x 3000", unit: "m2", qty: 3.6, price: 2500000, total: 9000000, type: "WOOD_CN" },
    { room: "1 – TẦNG 1", name: "Tủ bếp trên cánh Melamine", material: "Thùng + Cánh MDF cốt xanh phủ Melamine", dim: "4840 x 350 x 900", unit: "md", qty: 4.84, price: 2100000, total: 10164000, type: "WOOD_CN" },
    { room: "1 – TẦNG 1", name: "Tủ bếp dưới thùng nhựa Picomat", material: "Thùng ván nhựa chịu nước, cánh Melamine", dim: "5420 x 600 x 860", unit: "md", qty: 5.42, price: 2500000, total: 13550000, type: "WOOD_CN" },
    { room: "1 – TẦNG 1", name: "Hệ tủ bao tủ lạnh", material: "MDF cốt xanh chống ẩm phủ Melamine", dim: "1000 x 600 x 2700", unit: "m2", qty: 2.7, price: 1600000, total: 4320000, type: "WOOD_CN" },
    { room: "1 – TẦNG 1", name: "Kệ tivi treo phòng khách", material: "MDF cốt xanh phủ Melamine", dim: "3410 x 300 x 250", unit: "md", qty: 3.41, price: 1650000, total: 5626500, type: "WOOD_CN" },
    { room: "1 – TẦNG 1", name: "Vách Sofa Nan Sóng + PVC", material: "MDF cốt xanh phủ Melamine + PVC giả đá", dim: "2960 x 17 x 2700", unit: "m2", qty: 7.99, price: 1200000, total: 9588000, type: "WOOD_CN" },
    { room: "2. TẦNG 2", name: "Tủ quần áo phòng Master", material: "MDF cốt xanh chống ẩm phủ Melamine", dim: "3360 x 600 x 2800", unit: "m2", qty: 9.41, price: 2000000, total: 18820000, type: "WOOD_CN" },
    { room: "2. TẦNG 2", name: "Tủ áo cánh kính cường lực", material: "Khung nhôm định hình xám khói + Kính 5mm", dim: "1290 x 600 x 2700", unit: "m2", qty: 3.48, price: 3700000, total: 12876000, type: "WOOD_CN" },
    { room: "2. TẦNG 2", name: "Giường ngủ Master 1m8 có ngăn kéo", material: "MDF cốt xanh Thái Lan phủ Melamine", dim: "1800 x 2000 x 350", unit: "Cái", qty: 1, price: 5700000, total: 5700000, type: "WOOD_CN" },
    { room: "3. TẦNG 3", name: "Tủ quần áo phòng con", material: "MDF cốt xanh phủ Melamine", dim: "1990 x 600 x 2800", unit: "m2", qty: 5.57, price: 2000000, total: 11140000, type: "WOOD_CN" },
    { room: "3. TẦNG 3", name: "Bàn học liền giá sách", material: "MDF cốt xanh phủ Melamine", dim: "1310 x 500 x 1500", unit: "md", qty: 1.31, price: 1650000, total: 2161500, type: "WOOD_CN" },
    { room: "3. TẦNG 3", name: "Kệ sách treo tường", material: "MDF cốt xanh phủ Melamine", dim: "1400 x 250 x 1200", unit: "m2", qty: 1.68, price: 1600000, total: 2688000, type: "WOOD_CN" },
    { room: "4. TẦNG 3", name: "Vách ngăn phòng thờ CNC", material: "MDF cốt xanh cắt hoa văn CNC chữ Vạn", dim: "1750 x 17 x 2800", unit: "m2", qty: 4.9, price: 1550000, total: 7595000, type: "WOOD_CN" },
    { room: "4. TẦNG 3", name: "Bàn thờ gia tiên gỗ gõ đỏ", material: "Gỗ gõ đỏ tự nhiên đục sen", dim: "1750 x 810 x 1270", unit: "Cái", qty: 1, price: 16500000, total: 16500000, type: "NATURAL_WOOD" },
    { room: "1 – TẦNG 1", name: "Bản lề Hafele giảm chấn (Bếp)", material: "Inox 304 chính hãng Hafele", dim: "Quy chuẩn", unit: "Bộ", qty: 24, price: 65000, total: 1560000, type: "ACCESSORY" },
    { room: "1 – TẦNG 1", name: "Ray trượt bi Hafele 3 tầng", material: "Thép sơn tĩnh điện chịu tải 35kg", dim: "L=450mm", unit: "Bộ", qty: 6, price: 145000, total: 870000, type: "ACCESSORY" }
  ];
  renderEstimatorTable();
}"""

replacement_str = """// Khởi tạo bảng dự toán công trình thực tế (Không dùng mock ảo)
function loadSampleEstimatorDuAn() {
  currentEstimatorItems = [];
  renderEstimatorTable();
  if (typeof showToast === 'function') {
    showToast('Bảng dự toán sẵn sàng nhập liệu thực tế công trình.', 'info');
  }
}"""

if target_str in js:
    js = js.replace(target_str, replacement_str)
    print("2. Đã thay thế thành công hàm loadSampleEstimatorDuAn trong app.js!")
else:
    print("2. CẢNH BÁO: Không tìm thấy khớp chính xác target_str, sẽ tìm regex...")
    pattern = re.compile(r'// Nạp dự toán mẫu thực tế của Phú Gia.*?renderEstimatorTable\(\);\s*}', re.DOTALL)
    if pattern.search(js):
        js = pattern.sub(replacement_str, js)
        print("2. Đã thay thế thành công loadSampleEstimatorDuAn bằng regex!")
    else:
        print("2. LỖI: Không tìm thấy khối hàm để thay thế!")

with open(r'f:\PG Home - Quản trị\web_app\app.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Hoàn tất!")

