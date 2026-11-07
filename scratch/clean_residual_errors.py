import sys, re
sys.stdout.reconfigure(encoding='utf-8')

app_path = r'f:\PG Home - Quản trị\web_app\app.js'
html_path = r'f:\PG Home - Quản trị\web_app\index.html'

with open(app_path, 'r', encoding='utf-8') as f:
    js = f.read()

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

print("Bắt đầu xử lý triệt để các tồn dư lỗi...")

# 1. Clean xuongRecords in app.js: Xóa id 9, 10, 11 (Anh Trung Tuyết, Anh Hoàn, Anh Minh)
js = re.sub(r'\{\s*id:\s*9,\s*month:\s*10,\s*client:\s*"Anh Trung Tuyết"[\s\S]*?\},', '', js)
js = re.sub(r'\{\s*id:\s*10,\s*month:\s*10,\s*client:\s*"Biệt thự Cẩm Xuyên \(Anh Hoàn\)"[\s\S]*?\},', '', js)
js = re.sub(r'\{\s*id:\s*11,\s*month:\s*10,\s*client:\s*"Nội thất Shophouse Vinhomes \(Anh Minh\)"[\s\S]*?\},', '', js)
print("1. Đã dọn sạch xuongRecords!")

# 2. Clean accessories in app.js: Xóa PK-05, PK-06, PK-07
js = re.sub(r'\{\s*id:\s*"PK-05"[\s\S]*?\},', '', js)
js = re.sub(r'\{\s*id:\s*"PK-06"[\s\S]*?\},', '', js)
js = re.sub(r'\{\s*id:\s*"PK-07"[\s\S]*?\},', '', js)
print("2. Đã dọn sạch accessories!")

# 3. Clean materials in app.js: Sửa tên project nếu dính Anh Trung Tuyết
js = js.replace("Công trình Nhà Chị Hoa & Anh Trung Tuyết", "Công trình Nhà Chị Hoa (Thạch Bàn)")
print("3. Đã dọn sạch tên dự án trong materials!")

# 4. Clean zaloSupplierGroups: Sửa nợ theo PO ảo thành nợ thực tế
js = js.replace('debt: "Theo PO-2026-1009 (6,810,000 đ)"', 'debt: "6,800,000 đ (Gia công kính gương)"')
js = js.replace('debt: "Theo PO-2026-1011 (8,490,000 đ)"', 'debt: "0 đ (Đã thanh toán)"')
print("4. Đã dọn sạch tham chiếu PO ảo trong zaloSupplierGroups!")

# 5. Clean workers allowance per Rule C1:
# Tháng 9: chuyển allowance vào ot, allowance = 0
js = js.replace('{ code: "NV01", name: "HÀ VIẾT HOÀ", skill: "Thợ Cả / Kết cấu", base: 13780000, days: 26, daySalary: 12720000, ot: 0, allowance: 1093125, advance: 0, total: 13813125 }',
                '{ code: "NV01", name: "HÀ VIẾT HOÀ", skill: "Thợ Cả / Kết cấu", base: 13780000, days: 26, daySalary: 12720000, ot: 1093125, allowance: 0, advance: 0, total: 13813125 }')

js = js.replace('{ code: "NV02", name: "LÊ VĂN THOAN", skill: "Thợ Chính / Dán cạnh", base: 11700000, days: 26, daySalary: 9225000, ot: 0, allowance: 885938, advance: 0, total: 10110938 }',
                '{ code: "NV02", name: "LÊ VĂN THOAN", skill: "Thợ Chính / Dán cạnh", base: 11700000, days: 26, daySalary: 9225000, ot: 885938, allowance: 0, advance: 0, total: 10110938 }')

js = js.replace('{ code: "NV03", name: "LƯƠNG THỂ HÀO", skill: "Thợ Chính / Lắp ráp", base: 11700000, days: 26, daySalary: 8325000, ot: 0, allowance: 1096875, advance: 0, total: 9421875 }',
                '{ code: "NV03", name: "LƯƠNG THỂ HÀO", skill: "Thợ Chính / Lắp ráp", base: 11700000, days: 26, daySalary: 8325000, ot: 1096875, allowance: 0, advance: 0, total: 9421875 }')

js = js.replace('{ code: "NV04", name: "TRẦN VĂN ANH", skill: "Thợ Lắp đặt / Hoàn thiện", base: 10400000, days: 26, daySalary: 7200000, ot: 0, allowance: 600000, advance: 0, total: 7800000 }',
                '{ code: "NV04", name: "TRẦN VĂN ANH", skill: "Thợ Lắp đặt / Hoàn thiện", base: 10400000, days: 26, daySalary: 7200000, ot: 600000, allowance: 0, advance: 0, total: 7800000 }')

js = js.replace('{ code: "NV05", name: "LÊ TUẤN ANH", skill: "Thợ Phụ / Đóng gói", base: 7800000, days: 26, daySalary: 2850000, ot: 0, allowance: 56250, advance: 0, total: 2906250 }',
                '{ code: "NV05", name: "LÊ TUẤN ANH", skill: "Thợ Phụ / Đóng gói", base: 7800000, days: 26, daySalary: 2850000, ot: 56250, allowance: 0, advance: 0, total: 2906250 }')

# In DEFAULT_DATA.workers
js = js.replace('{ code: "NV01", name: "HÀ VIẾT HOÀ", skill: "Thợ Cả / Kết cấu", base: 13780000, days: 26, daySalary: 12720000, ot: 0, allowance: 1093125, advance: 0, total: 13813125 }',
                '{ code: "NV01", name: "HÀ VIẾT HOÀ", skill: "Thợ Cả / Kết cấu", base: 13780000, days: 26, daySalary: 12720000, ot: 1093125, allowance: 0, advance: 0, total: 13813125 }')

# 6. Clean HTML boastful words
html = html.replace("đẳng cấp thế giới", "quản trị chuyên sâu")
html = html.replace("ĐẲNG CẤP THẾ GIỚI", "QUẢN TRỊ CHUYÊN SÂU")
html = html.replace("ánh kim lộng lẫy", "tinh tế")
html = html.replace("shimmer-gold", "")
print("6. Đã dọn sạch từ ngữ sáo rỗng trong HTML!")

# Write files
with open(app_path, 'w', encoding='utf-8') as f:
    f.write(js)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Đã ghi thành công các tệp sau khi thanh lọc triệt để!")

