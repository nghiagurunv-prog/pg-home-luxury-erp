# -*- coding: utf-8 -*-
"""
Script cập nhật danh mục 41 chi tiết vật tư đã đặt năm 2026 vào app.js và index.html
Đồng thời khắc phục triệt để lỗi trống bảng do localStorage không đồng bộ.
"""
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

app_js_path = r"F:\PG Home - Quản trị\web_app\app.js"
index_html_path = r"F:\PG Home - Quản trị\web_app\index.html"

# Danh mục 41 chi tiết vật tư chuẩn xác 100% từ các PO và đơn vị cung ứng Zalo 2026
ALL_MATERIALS = [
  # PO-2026-0801: Chị Hiển (An Cường)
  { "code": "VT-01", "name": "Ván MDF chống ẩm Melamine An Cường 17mm (Mã MS 388 EV)", "project": "Chị Hiển (Thạch Linh)", "unit": "Tấm", "qty": 45, "price": 420000, "supplier": "Gỗ An Cường Hà Tĩnh", "status": "Đã xuất kho", "category": "wood", "po": "PO-2026-0801" },
  
  # PO-2026-0901: Chị Phượng (Hafele & An Cường)
  { "code": "VT-02", "name": "Bản lề giảm chấn Hafele SUS304 trùm ngoài", "project": "Chị Phượng (Nghi Xuân)", "unit": "Bộ", "qty": 80, "price": 28000, "supplier": "Phụ kiện Hafele Việt Nam", "status": "Đã xuất kho", "category": "hardware", "po": "PO-2026-0901" },
  { "code": "VT-03", "name": "Ray trượt giảm chấn 3 tầng Hafele 450mm", "project": "Chị Phượng (Nghi Xuân)", "unit": "Bộ", "qty": 24, "price": 95000, "supplier": "Phụ kiện Hafele Việt Nam", "status": "Đã xuất kho", "category": "hardware", "po": "PO-2026-0901" },
  { "code": "VT-04", "name": "Giá bát đĩa nâng hạ Eurogold SUS304 800mm", "project": "Chị Phượng (Nghi Xuân)", "unit": "Bộ", "qty": 1, "price": 5400000, "supplier": "Eurogold Việt Nam", "status": "Đã xuất kho", "category": "hardware", "po": "PO-2026-0901" },
  { "code": "VT-05", "name": "Tay nâng Blum HF25 cho cánh đôi tủ bếp", "project": "Chị Phượng (Nghi Xuân)", "unit": "Bộ", "qty": 1, "price": 3450000, "supplier": "Blum Austria", "status": "Đã xuất kho", "category": "hardware", "po": "PO-2026-0901" },
  { "code": "VT-06", "name": "Gỗ MDF chống ẩm phủ Melamine An Cường", "project": "Chị Phượng (Nghi Xuân)", "unit": "Tấm", "qty": 19, "price": 431000, "supplier": "Gỗ An Cường Hà Tĩnh", "status": "Đã xuất kho", "category": "wood", "po": "PO-2026-0901" },

  # PO-2026-0902: Anh Tuấn (An Cường Acrylic)
  { "code": "VT-07", "name": "Ván MDF chống ẩm phủ Acrylic bóng gương An Cường (Trắng tuyết)", "project": "Anh Tuấn (TP. Hà Tĩnh)", "unit": "Tấm", "qty": 28, "price": 780000, "supplier": "Gỗ An Cường", "status": "Đang nhập hàng", "category": "wood", "po": "PO-2026-0902" },

  # PO-2026-0903: Anh Hào (Eurogold / Taura / An Cường)
  { "code": "VT-08", "name": "Chỉ nẹp PVC đồng màu An Cường cuộn 100m", "project": "Anh Hào (Kỳ Anh)", "unit": "Cuộn", "qty": 6, "price": 320000, "supplier": "Gỗ An Cường", "status": "Đang nhập hàng", "category": "wood", "po": "PO-2026-0903" },
  { "code": "VT-09", "name": "Bản lề giảm chấn Taura inox 304", "project": "Anh Hào (Kỳ Anh)", "unit": "Bộ", "qty": 90, "price": 26000, "supplier": "Phụ kiện Taura", "status": "Đang nhập hàng", "category": "hardware", "po": "PO-2026-0903" },
  { "code": "VT-10", "name": "Thùng gạo âm tủ mặt gương Eurogold", "project": "Anh Hào (Kỳ Anh)", "unit": "Bộ", "qty": 1, "price": 1850000, "supplier": "Eurogold", "status": "Đang nhập hàng", "category": "hardware", "po": "PO-2026-0903" },
  { "code": "VT-11", "name": "Giá xoong nồi bát đĩa Eurogold 800mm", "project": "Anh Hào (Kỳ Anh)", "unit": "Bộ", "qty": 2, "price": 1870000, "supplier": "Eurogold", "status": "Đang nhập hàng", "category": "hardware", "po": "PO-2026-0903" },

  # PO-2026-1001: Kính Việt Nhật VSG
  { "code": "VT-12", "name": "Kính cường lực VSG 8mm trắng trong khổ bóc tách", "project": "Công trình Showroom & Nhà dân", "unit": "m2", "qty": 8.65, "price": 240000, "supplier": "Kính Việt Nhật VSG", "status": "Đã cọc 40%", "category": "glass", "po": "PO-2026-1001" },
  { "code": "VT-13", "name": "Kính dán an toàn 2 lớp 6.38mm trắng sữa", "project": "Vách ngăn kính văn phòng", "unit": "m2", "qty": 2.50, "price": 280000, "supplier": "Kính Việt Nhật VSG", "status": "Đã cọc 40%", "category": "glass", "po": "PO-2026-1001" },

  # PO-2026-1002: Nhà Chị Hoa (Chị Hoa kích thước chốt.pdf)
  { "code": "VT-14", "name": "Ván MDF cốt xanh chống ẩm phủ Melamine (Thùng tủ, vách ngăn)", "project": "Nhà Chị Hoa (Kích thước chốt)", "unit": "Tấm", "qty": 28, "price": 420000, "supplier": "Gỗ Thái Lan cốt xanh", "status": "Đã xuất kho", "category": "wood", "po": "PO-2026-1002" },
  { "code": "VT-15", "name": "Cánh kính cường lực khung nhôm Anode tủ trang trí", "project": "Nhà Chị Hoa (Kích thước chốt)", "unit": "m2", "qty": 6.58, "price": 1250000, "supplier": "Cánh Kính Nhôm Anode HN", "status": "Đã xuất kho", "category": "glass", "po": "PO-2026-1002" },
  { "code": "VT-16", "name": "Cánh phủ Acrylic bóng gương dán no-line tủ bếp trên & dưới", "project": "Nhà Chị Hoa (Kích thước chốt)", "unit": "md", "qty": 11.10, "price": 1100000, "supplier": "Acrylic ALD", "status": "Đã xuất kho", "category": "wood", "po": "PO-2026-1002" },
  { "code": "VT-17", "name": "Ván nhựa Picomat chống nước tủ bếp dưới", "project": "Nhà Chị Hoa (Kích thước chốt)", "unit": "Tấm", "qty": 8, "price": 820000, "supplier": "Picomat Hà Tĩnh", "status": "Đã xuất kho", "category": "wood", "po": "PO-2026-1002" },
  { "code": "VT-18", "name": "Hệ thanh nhôm Led định hình + nguồn 12V", "project": "Nhà Chị Hoa (Kích thước chốt)", "unit": "md", "qty": 18, "price": 120000, "supplier": "Phụ kiện Led định hình", "status": "Đã xuất kho", "category": "hardware", "po": "PO-2026-1002" },
  { "code": "VT-19", "name": "Phụ kiện bản lề giảm chấn & ray bi 3 tầng Hafele", "project": "Nhà Chị Hoa (Kích thước chốt)", "unit": "Bộ", "qty": 1, "price": 8500000, "supplier": "Hafele Việt Nam", "status": "Đã xuất kho", "category": "hardware", "po": "PO-2026-1002" },

  # PO-2026-1003: Nhà Bác Phát & Gỗ NT Cầu Vượt
  { "code": "VT-20", "name": "Đơn trả hàng Plywood E0 18 Ly 414 PL (Mã SON00337)", "project": "Kho xưởng trả hàng NCC", "unit": "Tấm", "qty": 1, "price": -750000, "supplier": "Gỗ NT Cầu Vượt Hà Tĩnh", "status": "Đã trừ công nợ", "category": "wood", "po": "PO-2026-1003" },
  { "code": "VT-21", "name": "Ván nhựa Picomat cốt đặc làm thùng tủ bếp chống nước", "project": "Nhà Bác Phát (Đường 26/03)", "unit": "Tấm", "qty": 12, "price": 850000, "supplier": "Gỗ NT Cầu Vượt Hà Tĩnh", "status": "Đang giao xưởng", "category": "wood", "po": "PO-2026-1003" },
  { "code": "VT-22", "name": "Ván MDF cốt xanh chống ẩm 17mm nhà Bác Phát", "project": "Nhà Bác Phát (Đường 26/03)", "unit": "Tấm", "qty": 16, "price": 410000, "supplier": "Gỗ NT Cầu Vượt Hà Tĩnh", "status": "Đang giao xưởng", "category": "wood", "po": "PO-2026-1003" },

  # PO-2026-1004: Gỗ thịt Cường Hà Nội
  { "code": "VT-23", "name": "Cửa gỗ thịt tự nhiên theo kích thước bóc tách (1.7M/m2)", "project": "Công trình Gỗ thịt cao cấp", "unit": "m2", "qty": 10.5, "price": 1700000, "supplier": "Anh Cường Gỗ Thịt Hà Nội", "status": "Đang ghép mộng", "category": "solid_wood", "po": "PO-2026-1004" },

  # PO-2026-1005: Đá Ceramic Hoàng Hà HY
  { "code": "VT-24", "name": "Đá nung kết Ceramic Calacatta Gold 12mm ốp mặt bếp & bàn đảo", "project": "Biệt thự TP Hà Tĩnh - Bàn đảo & Vách tivi", "unit": "m2", "qty": 4.8, "price": 1650000, "supplier": "Hoàng Hà Ceramic PVC", "status": "Đã duyệt cắt CNC", "category": "stone", "po": "PO-2026-1005" },
  { "code": "VT-25", "name": "Tấm than tre phủ kim loại chống xước vách tivi", "project": "Biệt thự TP Hà Tĩnh - Bàn đảo & Vách tivi", "unit": "Tấm", "qty": 6, "price": 680000, "supplier": "Hoàng Hà Ceramic PVC", "status": "Đã duyệt", "category": "stone", "po": "PO-2026-1005" },
  { "code": "VT-26", "name": "Nẹp nhôm chữ T mạ vàng PVD", "project": "Biệt thự TP Hà Tĩnh - Bàn đảo & Vách tivi", "unit": "Cây", "qty": 8, "price": 95000, "supplier": "Hoàng Hà Ceramic PVC", "status": "Đã duyệt", "category": "hardware", "po": "PO-2026-1005" },

  # PO-2026-1006: Lam Giang TP Hà Tĩnh
  { "code": "VT-27", "name": "Ray trượt âm giảm chấn DTC 450mm mở toàn phần", "project": "Tổng hợp công trình tháng 10", "unit": "Bộ", "qty": 35, "price": 115000, "supplier": "LamGiang - NT Phú Gia (TP HT)", "status": "Chờ duyệt", "category": "hardware", "po": "PO-2026-1006" },
  { "code": "VT-28", "name": "Bản lề giảm chấn inox 304 DTC", "project": "Tổng hợp công trình tháng 10", "unit": "Cái", "qty": 120, "price": 18000, "supplier": "LamGiang - NT Phú Gia (TP HT)", "status": "Chờ duyệt", "category": "hardware", "po": "PO-2026-1006" },
  { "code": "VT-29", "name": "Ván MDF phủ Melamine mã vân gỗ óc chó 17mm", "project": "Tổng hợp công trình tháng 10", "unit": "Tấm", "qty": 15, "price": 425000, "supplier": "LamGiang - NT Phú Gia (TP HT)", "status": "Chờ duyệt", "category": "wood", "po": "PO-2026-1006" },
  { "code": "VT-30", "name": "Chỉ dán cạnh nẹp PVC đồng màu vân gỗ Lam Giang", "project": "Tổng hợp công trình tháng 10", "unit": "Cuộn", "qty": 4, "price": 290000, "supplier": "LamGiang - NT Phú Gia (TP HT)", "status": "Chờ duyệt", "category": "wood", "po": "PO-2026-1006" },

  # PO-2026-1007: Cường Thịnh
  { "code": "VT-31", "name": "Ván Melamine Cường Thịnh mã vân sồi tự nhiên 17mm", "project": "Chốt ván Melamine các căn hộ T9", "unit": "Tấm", "qty": 22, "price": 395000, "supplier": "Cường Thịnh (Nga Melamine)", "status": "Đã xuất kho", "category": "wood", "po": "PO-2026-1007" },
  { "code": "VT-32", "name": "Ván Melamine đơn sắc màu ghi xám chì", "project": "Chốt ván Melamine các căn hộ T9", "unit": "Tấm", "qty": 10, "price": 385000, "supplier": "Cường Thịnh (Nga Melamine)", "status": "Đã xuất kho", "category": "wood", "po": "PO-2026-1007" },

  # PO-2026-1008: Đức Anh - Thu Hương HT
  { "code": "VT-33", "name": "Gỗ sồi Mỹ (Oak) xẻ sấy chuẩn FAS loại 1", "project": "Gỗ sồi tự nhiên phòng khách & cầu thang", "unit": "m3", "qty": 0.85, "price": 21500000, "supplier": "Sồi Đức Anh - Thu Hương HT", "status": "Đã nghiệm thu", "category": "solid_wood", "po": "PO-2026-1008" },
  { "code": "VT-34", "name": "Mộng ghép & tay vịn cầu thang sồi tự nhiên", "project": "Gỗ sồi tự nhiên phòng khách & cầu thang", "unit": "md", "qty": 12, "price": 450000, "supplier": "Sồi Đức Anh - Thu Hương HT", "status": "Đã nghiệm thu", "category": "solid_wood", "po": "PO-2026-1008" },

  # PO-2026-1009: Gương Bỉ theo yêu cầu
  { "code": "VT-35", "name": "Gương Bỉ AGC tráng bạc 8 lớp 5mm mài xiết bóng viền led", "project": "Căn hộ Duplex - Gương bàn phấn & phòng tắm", "unit": "Bộ", "qty": 3, "price": 1850000, "supplier": "Gương Bỉ Theo Yêu Cầu", "status": "Đang đặt hàng", "category": "glass", "po": "PO-2026-1009" },
  { "code": "VT-36", "name": "Cảm ứng 1 chạm đa năng tích hợp sấy phá sương", "project": "Căn hộ Duplex - Gương bàn phấn & phòng tắm", "unit": "Bộ", "qty": 3, "price": 420000, "supplier": "Gương Bỉ Theo Yêu Cầu", "status": "Đang đặt hàng", "category": "glass", "po": "PO-2026-1009" },

  # PO-2026-1010: Xưởng Đồ Rời Khánh HN (Phụ kiện bán kèm)
  { "code": "VT-37", "name": "Sofa bọc nỉ Hàn Quốc cao cấp kiểu chữ L (2m8 x 1m8)", "project": "Đồ rời bán kèm bàn giao căn hộ Chị Phượng", "unit": "Bộ", "qty": 1, "price": 16500000, "supplier": "Xưởng Sofa & Bàn Ăn Khánh HN", "status": "Đã bàn giao", "category": "loose_furniture", "po": "PO-2026-1010" },
  { "code": "VT-38", "name": "Bàn ăn thông minh kéo dài mặt đá Ceramic 6 ghế Monet", "project": "Đồ rời bán kèm bàn giao căn hộ Chị Phượng", "unit": "Bộ", "qty": 1, "price": 11500000, "supplier": "Xưởng Sofa & Bàn Ăn Khánh HN", "status": "Đã bàn giao", "category": "loose_furniture", "po": "PO-2026-1010" },

  # PO-2026-1011: Bọc Đệm Da Nỉ HT
  { "code": "VT-39", "name": "Gia công vách ốp mút D40 da microfiber nẹp inox mạ PVD", "project": "Vách ốp đầu giường phòng ngủ Master", "unit": "m2", "qty": 7.2, "price": 950000, "supplier": "Bọc Đệm Da - Nỉ Hà Tĩnh", "status": "Đã nghiệm thu", "category": "loose_furniture", "po": "PO-2026-1011" },
  { "code": "VT-40", "name": "Đệm tựa đầu giường bọc da cao cấp chống xẹp", "project": "Vách ốp đầu giường phòng ngủ Master", "unit": "Bộ", "qty": 1, "price": 1650000, "supplier": "Bọc Đệm Da - Nỉ Hà Tĩnh", "status": "Đã nghiệm thu", "category": "loose_furniture", "po": "PO-2026-1011" },

  # Kho xưởng
  { "code": "VT-41", "name": "Keo hạt dán cạnh nhiệt độ cao Jowat Đức", "project": "Tổng kho xưởng sản xuất", "unit": "Bao (25kg)", "qty": 4, "price": 1850000, "supplier": "Jowat Đức (Kho Vinh)", "status": "Nhập tồn kho", "category": "hardware", "po": "KHO-2026-01" }
]

print(f"Tổng số mục vật tư cấu hình: {len(ALL_MATERIALS)}")

# 1. Cập nhật DEFAULT_DATA.materials trong app.js
with open(app_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace DEFAULT_DATA.materials
materials_json_str = json.dumps(ALL_MATERIALS, ensure_ascii=False, indent=4)
# Build replacement for materials block
start_marker = "  // Danh mục vật tư & Giá Cost công trình\n  materials: ["
end_marker = "  // Quản lý Hợp đồng & Doanh số Văn phòng"

idx_start = js_content.find("materials: [")
if idx_start != -1:
    idx_end = js_content.find("contracts: [", idx_start)
    if idx_end != -1:
        # Find closing bracket before contracts
        idx_close = js_content.rfind("],", idx_start, idx_end)
        if idx_close != -1:
            old_block = js_content[idx_start:idx_close+2]
            new_block = "materials: " + materials_json_str + ","
            js_content = js_content[:idx_start] + new_block + js_content[idx_close+2:]
            print("SUCCESS: Replaced DEFAULT_DATA.materials in app.js!")

# 2. Cập nhật loadState() trong app.js để luôn đồng bộ materials
load_state_marker = "function loadState() {"
idx_ls = js_content.find(load_state_marker)
if idx_ls != -1:
    # Ensure data.materials is always synchronized from DEFAULT_DATA.materials
    target_sync = "data.zaloSupplierGroups = JSON.parse(JSON.stringify(DEFAULT_DATA.zaloSupplierGroups));"
    replacement_sync = """data.zaloSupplierGroups = JSON.parse(JSON.stringify(DEFAULT_DATA.zaloSupplierGroups));
      // Luôn đồng bộ 41 danh mục vật tư đã đặt từ DEFAULT_DATA
      data.materials = JSON.parse(JSON.stringify(DEFAULT_DATA.materials));"""
    if target_sync in js_content and "data.materials = JSON.parse(JSON.stringify(DEFAULT_DATA.materials));" not in js_content:
        js_content = js_content.replace(target_sync, replacement_sync, 1)
        print("SUCCESS: Added data.materials auto-sync in loadState()!")

# 3. Cập nhật setupNavigation() để gọi renderVatTu() khi click tab
target_nav = 'document.getElementById("currentBreadcrumb").textContent = item.querySelector("span").textContent;'
replacement_nav = """document.getElementById("currentBreadcrumb").textContent = item.querySelector("span").textContent;

      // Kích hoạt ngay lập tức render tương ứng khi chuyển tab để bảng không bị trắng
      if (targetTabId === "tab-vat-tu-cost") {
        renderVatTu();
      } else if (targetTabId === "tab-phe-duyet-vat-tu") {
        renderPOList();
        renderZaloSupplierGroups();
      } else if (targetTabId === "tab-van-phong-sale") {
        renderHopDong();
      } else if (targetTabId === "tab-xuong-san-xuat") {
        renderKhoiLuongXuong("9");
      } else if (targetTabId === "tab-ccsc-matrix") {
        renderCCSCTable();
      } else if (targetTabId === "tab-cong-no-dong-tien") {
        renderCongNo();
      }"""

if target_nav in js_content and 'if (targetTabId === "tab-vat-tu-cost")' not in js_content:
    js_content = js_content.replace(target_nav, replacement_nav, 1)
    print("SUCCESS: Added tab click hooks into setupNavigation()!")

# 4. Viết lại hàm renderVatTu() nâng cấp với bộ lọc category và tính toán KPI chuẩn xác
old_render_vattu_start = "// Render Materials & Cost Table\nfunction renderVatTu() {"
idx_rv = js_content.find("function renderVatTu()")
if idx_rv != -1:
    idx_rv_end = js_content.find("function renderHopDong()", idx_rv)
    if idx_rv_end != -1:
        new_render_vattu = """let currentActiveVatTuFilter = "all";

window.filterVatTuCategory = function(cat) {
  currentActiveVatTuFilter = cat;
  document.querySelectorAll(".vattu-filter-btn").forEach(btn => {
    if (btn.getAttribute("data-cat") === cat) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  renderVatTu();
};

function renderVatTu() {
  const tbody = document.getElementById("bodyVatTu");
  if (!tbody) return;

  tbody.innerHTML = "";

  // Luôn đảm bảo appState.materials có đủ dữ liệu
  if (!appState.materials || !Array.isArray(appState.materials) || appState.materials.length === 0) {
    appState.materials = JSON.parse(JSON.stringify(DEFAULT_DATA.materials));
  }

  let totalSpent = 0;
  let filteredItems = appState.materials;
  if (currentActiveVatTuFilter && currentActiveVatTuFilter !== "all") {
    filteredItems = appState.materials.filter(v => v.category === currentActiveVatTuFilter);
  }

  // Tính tổng chi phí thực tế từ toàn bộ danh mục vật tư đã đặt
  appState.materials.forEach(v => {
    const total = (v.qty || 0) * (v.price || 0);
    totalSpent += total;
  });

  filteredItems.forEach((v, idx) => {
    const total = (v.qty || 0) * (v.price || 0);
    const tr = document.createElement("tr");

    let statusPillClass = "green";
    if (v.status.includes("Đã xuất") || v.status.includes("Đã nghiệm thu") || v.status.includes("Đã bàn giao")) {
      statusPillClass = "green";
    } else if (v.status.includes("Chờ") || v.status.includes("Đang")) {
      statusPillClass = "yellow";
    } else if (v.status.includes("Đã cọc")) {
      statusPillClass = "cyan";
    }

    const isNegative = total < 0;
    const totalFormatted = isNegative ? `-${fmtCurr(Math.abs(total))}` : fmtCurr(total);
    const totalClass = isNegative ? "text-danger fw-bold" : "text-gold fw-bold";

    tr.innerHTML = `
      <td class="font-monospace text-center"><strong>${v.code || 'VT-' + (idx+1)}</strong></td>
      <td>
        <div class="fw-bold text-light">${v.name}</div>
        <div class="text-muted small">${v.po ? '<span class="badge info" style="font-size:0.65rem;">' + v.po + '</span>' : ''}</div>
      </td>
      <td><strong class="text-cyan">${v.project}</strong></td>
      <td class="text-center">${v.unit}</td>
      <td class="text-center font-monospace fw-bold">${v.qty}</td>
      <td class="text-end font-monospace">${fmtCurr(v.price)}</td>
      <td class="text-end font-monospace ${totalClass}">${totalFormatted}</td>
      <td><span class="text-light">${v.supplier}</span></td>
      <td class="text-center"><span class="status-pill ${statusPillClass}">${v.status}</span></td>
      <td class="text-center">
        <button class="btn-icon text-danger" title="Xóa" onclick="deleteVatTu('${v.code}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Kế hoạch vật tư định mức 40% Doanh số xưởng T9 (287,782,767 đ * 40% = 115,113,107 đ)
  const dsT9 = 287782767;
  const maxBudget = dsT9 * 0.40;
  const savings = maxBudget - totalSpent;

  const elMax = document.getElementById("costMaxBudget");
  if (elMax) elMax.textContent = fmtCurr(maxBudget);
  const elSpent = document.getElementById("costActualSpent");
  if (elSpent) elSpent.textContent = fmtCurr(totalSpent);
  const elSavings = document.getElementById("costSavings");
  if (elSavings) {
    if (savings >= 0) {
      elSavings.className = "stat-value text-emerald";
      elSavings.textContent = `+${fmtCurr(savings)} (Tiết kiệm)`;
    } else {
      elSavings.className = "stat-value text-rose";
      elSavings.textContent = `-${fmtCurr(Math.abs(savings))} (Bội chi)`;
    }
  }

  // Cập nhật số lượng hiển thị trên Badge tab
  const badgeVtCount = document.getElementById("badgeVatTuCount");
  if (badgeVtCount) badgeVtCount.textContent = `${appState.materials.length} Vật Tư`;
}

"""
        js_content = js_content[:idx_rv] + new_render_vattu + js_content[idx_rv_end:]
        print("SUCCESS: Replaced renderVatTu() with upgraded version!")

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)
print("SUCCESS: Saved updated app.js!")

# 5. Cập nhật index.html với thanh phân loại Category Filter Bar cho tab-vat-tu-cost
with open(index_html_path, 'r', encoding='utf-8') as f:
    idx_content = f.read()

target_stats_grid = """          <!-- Cost stats -->
          <div class="stats-grid compact">
            <div class="stat-card">
              <span class="stat-title">Kế Hoạch Vật Tư Dự Kiến</span>
              <div class="stat-value text-cyan" id="costMaxBudget">115,113,107 đ</div>
            </div>
            <div class="stat-card">
              <span class="stat-title">Tổng Chi Phí Vật Tư Thực Xuất</span>
              <div class="stat-value text-gold" id="costActualSpent">102,450,000 đ</div>
            </div>
            <div class="stat-card">
              <span class="stat-title">Tiết Kiệm Vật Tư</span>
              <div class="stat-value text-emerald" id="costSavings">+12,663,107 đ (Tiết kiệm)</div>
            </div>
          </div>"""

replacement_stats_grid = """          <!-- Cost stats -->
          <div class="stats-grid compact">
            <div class="stat-card cyan-glow">
              <div class="stat-header">
                <span class="stat-title">Định Mức Vật Tư Khoán 40% (T9)</span>
                <div class="stat-icon icon-cyan"><i class="fa-solid fa-calculator"></i></div>
              </div>
              <div class="stat-value text-cyan" id="costMaxBudget">115,113,107 đ</div>
              <div class="stat-meta">
                <span class="badge info">Chuẩn CCSC Col AU</span>
                <span class="stat-sub">Định mức xưởng gỗ công nghiệp</span>
              </div>
            </div>
            <div class="stat-card gold-glow">
              <div class="stat-header">
                <span class="stat-title">Tổng Vật Tư Thực Đặt / Xuất Kho</span>
                <div class="stat-icon icon-gold"><i class="fa-solid fa-boxes-packing"></i></div>
              </div>
              <div class="stat-value text-gold" id="costActualSpent">102,450,000 đ</div>
              <div class="stat-meta">
                <span class="badge warning" id="badgeVatTuCount">41 Chi Tiết Vật Tư</span>
                <span class="stat-sub">Tổng hợp 13 nhóm Zalo & PO 2026</span>
              </div>
            </div>
            <div class="stat-card emerald-glow">
              <div class="stat-header">
                <span class="stat-title">Chênh Lệch Dôi Dư / Tiết Kiệm</span>
                <div class="stat-icon icon-emerald"><i class="fa-solid fa-piggy-bank"></i></div>
              </div>
              <div class="stat-value text-emerald" id="costSavings">+12,663,107 đ (Tiết kiệm)</div>
              <div class="stat-meta">
                <span class="badge positive">Tối ưu chi phí</span>
                <span class="stat-sub">Nguồn ngân sách tái đầu tư Marketing</span>
              </div>
            </div>
          </div>

          <!-- BỘ LỌC PHÂN LOẠI VẬT TƯ -->
          <div class="filter-bar" style="margin-top: 1rem; margin-bottom: 1rem;">
            <span class="filter-label"><i class="fa-solid fa-filter"></i> Phân loại vật tư đã đặt:</span>
            <div class="radio-pill-group">
              <button type="button" class="btn btn-sm btn-outline vattu-filter-btn active" data-cat="all" onclick="filterVatTuCategory('all')">
                <i class="fa-solid fa-list-check"></i> Tất cả vật tư (41)
              </button>
              <button type="button" class="btn btn-sm btn-outline vattu-filter-btn" data-cat="wood" onclick="filterVatTuCategory('wood')">
                <i class="fa-solid fa-tree"></i> Ván gỗ & Bề mặt (An Cường, NT, Cường Thịnh)
              </button>
              <button type="button" class="btn btn-sm btn-outline vattu-filter-btn" data-cat="hardware" onclick="filterVatTuCategory('hardware')">
                <i class="fa-solid fa-screwdriver-wrench"></i> Phụ kiện & Ray bản lề (Hafele, DTC, Blum)
              </button>
              <button type="button" class="btn btn-sm btn-outline vattu-filter-btn" data-cat="glass" onclick="filterVatTuCategory('glass')">
                <i class="fa-regular fa-window-maximize"></i> Kính & Gương (Việt Nhật, Gương Bỉ)
              </button>
              <button type="button" class="btn btn-sm btn-outline vattu-filter-btn" data-cat="stone" onclick="filterVatTuCategory('stone')">
                <i class="fa-solid fa-gem"></i> Đá Ceramic & Than tre (Hoàng Hà HY)
              </button>
              <button type="button" class="btn btn-sm btn-outline vattu-filter-btn" data-cat="solid_wood" onclick="filterVatTuCategory('solid_wood')">
                <i class="fa-solid fa-door-open"></i> Gỗ thịt (Cường HN, Đức Anh HT)
              </button>
              <button type="button" class="btn btn-sm btn-outline vattu-filter-btn" data-cat="loose_furniture" onclick="filterVatTuCategory('loose_furniture')">
                <i class="fa-solid fa-couch"></i> Đồ rời & Đệm da (Khánh Sofa, Đệm HT)
              </button>
            </div>
          </div>"""

idx_norm = idx_content.replace('\r\n', '\n')
t_stats_norm = target_stats_grid.replace('\r\n', '\n')
r_stats_norm = replacement_stats_grid.replace('\r\n', '\n')

if t_stats_norm in idx_norm:
    new_idx = idx_norm.replace(t_stats_norm, r_stats_norm, 1)
    with open(index_html_path, 'w', encoding='utf-8') as f:
        f.write(new_idx)
    print("SUCCESS: Updated index.html with Category Filter Bar and upgraded stat cards!")
else:
    print("ERROR: target_stats_grid not found in index.html!")

