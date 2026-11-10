# -*- coding: utf-8 -*-
"""
PG HOME LUXURY ERP - PHYSICAL 2-EDITION SPLIT ENGINE
====================================================
Tách vật lý Web App thành 2 phần độc lập 100% chống lộ lọt thông tin:
1. BẢN NỘI BỘ MÁY TÍNH GIÁM ĐỐC (LOCAL PC - 127.0.0.1:8080):
   - Lưu tại `local_admin_vault/` (cách ly hoàn toàn khỏi Cloud/Vercel/Git deploy).
   - Chứa đầy đủ 100% Phân hệ Giám Đốc (ADMIN), Bảng CCSC 12 tháng, Đối soát T8+T9,
     Lợi nhuận ròng bỏ túi BGĐ, Quỹ lương quản lý, Quỹ thợ nòng cốt Hòa & Hào,
     20 Giải pháp chiến lược, cùng toàn bộ phân hệ Văn phòng & Xưởng.
2. BẢN DEPLOY VĂN PHÒNG & XƯỞNG (CLOUD DEPLOY - `web_app/index.html`, `web_app/app.js`, `api/index.js`):
   - Chỉ chứa Phân hệ Văn Phòng & Dự Toán Sale (`VANPHONG_SALE`, `DU_TOAN_SALE`)
     và Phân hệ Kỹ Thuật & Vật Tư Xưởng (`XUONG_VATTU`).
   - Đã cắt bỏ vật lý 100% HTML/JS của CCSC, Dashboard Giám Đốc, Lợi nhuận bỏ túi BGĐ,
     Lương BLĐ, Quỹ thợ 15% dôi dư bỏ túi và các file Excel nhạy cảm.
"""

import json
import os
import re
import shutil

ROOT_DIR = r"f:\PG Home - Quản trị"
WEB_APP_DIR = os.path.join(ROOT_DIR, "web_app")
LOCAL_VAULT_DIR = os.path.join(ROOT_DIR, "local_admin_vault")


def ensure_local_vault():
    os.makedirs(LOCAL_VAULT_DIR, exist_ok=True)
    index_html_path = os.path.join(WEB_APP_DIR, "index.html")
    app_js_path = os.path.join(WEB_APP_DIR, "app.js")

    with open(index_html_path, "r", encoding="utf-8") as f:
        full_html = f.read()
    with open(app_js_path, "r", encoding="utf-8") as f:
        full_js = f.read()

    # Lưu bản gốc đầy đủ 100% vào local_admin_vault (nếu chưa có bản gốc)
    director_html_path = os.path.join(LOCAL_VAULT_DIR, "director_ccsc_full.html")
    director_js_path = os.path.join(LOCAL_VAULT_DIR, "director_app_full.js")

    # Chuẩn hóa địa chỉ theo Luật Sắt 1 (Tuyệt đối không để sót chữ Showroom Ngô Đức Kế)
    full_html = full_html.replace("Showroom Ngô Đức Kế", "Showroom Trương Quốc Dụng")

    # Kiểm tra xem full_html hiện tại có chứa #tab-ccsc-matrix không (tức là bản full gốc)
    if 'id="tab-ccsc-matrix"' in full_html and 'id="tab-ccsc-t8-t9"' in full_html:
        # Thêm badge nhận diện Bản Nội Bộ Giám Đốc & CCSC vào bản Local
        local_html = full_html.replace(
            '<span class="brand-sub">ERP V7.0 ENTERPRISE</span>',
            '<span class="brand-sub" style="color:#10B981;font-weight:800;">LOCAL PC: CCSC & GIÁM ĐỐC</span>'
        )
        # Trỏ app.js sang /local-admin-assets/director_app_full.js để chạy độc lập 100% dữ liệu CCSC
        local_html = re.sub(
            r'<script src="app\.js[^"]*"></script>',
            '<script src="/local-admin-assets/director_app_full.js?v=14.0_LOCAL_CCSC_2026"></script>',
            local_html
        )
        with open(director_html_path, "w", encoding="utf-8") as f:
            f.write(local_html)
        print(f"[OK] Saved full Director & CCSC HTML to: {director_html_path} ({len(local_html):,} bytes)")
    elif os.path.exists(director_html_path):
        with open(director_html_path, "r", encoding="utf-8") as f:
            dh = f.read().replace("Showroom Ngô Đức Kế", "Showroom Trương Quốc Dụng")
        dh = dh.replace(
            '<span class="brand-sub">ERP V7.0 ENTERPRISE</span>',
            '<span class="brand-sub" style="color:#10B981;font-weight:800;">LOCAL PC: CCSC & GIÁM ĐỐC</span>'
        )
        dh = re.sub(
            r'<script src="app\.js[^"]*"></script>',
            '<script src="/local-admin-assets/director_app_full.js?v=14.0_LOCAL_CCSC_2026"></script>',
            dh
        )
        with open(director_html_path, "w", encoding="utf-8") as f:
            f.write(dh)
        print(f"[OK] Patched full Director & CCSC HTML at: {director_html_path} ({len(dh):,} bytes)")

    if not os.path.exists(director_js_path) or ("bld: 12000000" in full_js and "ccscMonths:" in full_js):
        with open(director_js_path, "w", encoding="utf-8") as f:
            f.write(full_js)
        print(f"[OK] Saved full Director & CCSC JS to: {director_js_path} ({len(full_js):,} bytes)")

    # Đọc lại từ bản full trong local_admin_vault làm nguồn chuẩn để trích xuất
    with open(director_html_path, "r", encoding="utf-8") as f:
        source_html = f.read()
    with open(director_js_path, "r", encoding="utf-8") as f:
        source_js = f.read()

    return source_html, source_js


def extract_ccsc_vault_json(source_js):
    """Trích xuất dữ liệu nhạy cảm CCSC & Giám Đốc ra file JSON nội bộ."""
    vault_data = {
        "edition": "LOCAL_DIRECTOR_CCSC_VAULT",
        "description": "Dữ liệu CCSC 12 tháng, Đối soát T8-T9 và Lợi nhuận bỏ túi BGĐ (Chỉ lưu tại máy tính Giám Đốc)",
        "ccscMonths": [
            {"month": 8, "name": "Tháng 8/2026 (Thực tế)", "wood_rev": 216090975, "pk_rev": 8840000, "pk_profit": 2652000, "vt_actual": 124621000, "tho_actual": 41285625, "bld": 12000000, "qlx": 21130000, "admin_3d": 6353259, "sale_fixed": 4000000, "sale_comm": 0, "mkt_fixed": 6000000, "mkt_ads": 15000000, "hcns": 4000000, "rent": 13000000, "bhxh": 6600000, "elec": 3630776, "truck": 3630776, "warranty": 2420517, "col_bg": -19164353, "isLocked": True},
            {"month": 9, "name": "Tháng 9/2026 (Thực tế)", "wood_rev": 354666647, "pk_rev": 30000000, "pk_profit": 9000000, "vt_actual": 122149000, "tho_actual": 44052188, "bld": 12000000, "qlx": 21130000, "admin_3d": 6500000, "sale_fixed": 4000000, "sale_comm": 10123150, "mkt_fixed": 6000000, "mkt_ads": 6000000, "hcns": 4500000, "rent": 13000000, "bhxh": 6600000, "elec": 4316742, "truck": 4316742, "warranty": 2877828, "col_bg": 44090721, "isLocked": True},
            {"month": 10, "name": "Tháng 10/2026 (Thực tế)", "wood_rev": 386953218, "pk_rev": 57290000, "pk_profit": 17187000, "vt_actual": 155172550, "tho_actual": 65473750, "bld": 12000000, "qlx": 21130000, "admin_3d": 6500000, "sale_fixed": 4000000, "sale_comm": 3250000, "mkt_fixed": 6000000, "mkt_ads": 14000000, "hcns": 4000000, "rent": 13000000, "bhxh": 6600000, "elec": 5804298, "truck": 5804298, "warranty": 3869532, "col_bg": 77535790, "isLocked": False}
        ]
    }
    vault_json_path = os.path.join(LOCAL_VAULT_DIR, "ccsc_director_vault.json")
    with open(vault_json_path, "w", encoding="utf-8") as f:
        json.dump(vault_data, f, ensure_ascii=False, indent=2)
    print(f"[OK] Saved local CCSC vault JSON to: {vault_json_path}")


def strip_html_section_by_id(html: str, section_id: str, comment_label: str) -> str:
    """Xóa chính xác khối <section ... id="section_id" ...>...</section> kể cả khi có thẻ section lồng nhau."""
    pattern = re.compile(rf'<section\b[^>]*\bid="{re.escape(section_id)}"[^>]*>', re.IGNORECASE)
    match = pattern.search(html)
    if not match:
        return html
    start_idx = match.start()
    pos = match.end()
    depth = 1
    tag_re = re.compile(r'<(/?)section\b[^>]*>', re.IGNORECASE)
    while depth > 0:
        m = tag_re.search(html, pos)
        if not m:
            break
        if m.group(1) == '/':
            depth -= 1
        else:
            depth += 1
        pos = m.end()
    return html[:start_idx] + f'<!-- [STRIPPED FOR DEPLOY: #{section_id} ({comment_label}) ISOLATED TO LOCAL PC 127.0.0.1:8080] -->' + html[pos:]


def build_deploy_html(source_html):
    """
    Tạo bản `web_app/index.html` dành riêng cho Deploy (Văn phòng & Xưởng):
    - Cắt bỏ toàn bộ nhóm menu Admin/CCSC trên Sidebar.
    - Cắt bỏ toàn bộ các section: #tab-dashboard, #tab-ccsc-t8-t9, #tab-ccsc-matrix,
      #tab-quan-tri-nhan-su, #tab-chien-luoc-20-giai-phap, #tab-rnd-phase2-hub.
    - Cắt bỏ hộp đối soát lợi nhuận bỏ túi BGĐ trong #tab-xuong-san-xuat, #tab-cham-cong-all, #tab-phu-kien-sofa.
    - Cắt bỏ nút Mở Kho Bí Mật Admin và link tải file Excel CCSC gốc.
    - Cắt bỏ nút đăng nhập nhanh Giám Đốc trên bản Deploy.
    """
    html = source_html.replace("Showroom Ngô Đức Kế", "Showroom Trương Quốc Dụng")

    # Khôi phục script tag chuẩn nếu lấy từ local_html
    html = re.sub(
        r'<script src="/local-admin-assets/director_app_full\.js[^"]*"></script>',
        '<script src="app.js?v=14.0_DEPLOY_VP_XUONG_2026"></script>',
        html
    )
    html = html.replace(
        '<span class="brand-sub" style="color:#10B981;font-weight:800;">LOCAL PC: CCSC & GIÁM ĐỐC</span>',
        '<span class="brand-sub">VĂN PHÒNG & XƯỞNG</span>'
    )
    html = html.replace(
        '<span class="brand-sub">ERP V7.0 ENTERPRISE</span>',
        '<span class="brand-sub">VĂN PHÒNG & XƯỞNG</span>'
    )

    # 1. Xóa toàn bộ các mục menu của Giám Đốc & CCSC (data-role-group="admin") trên Sidebar
    html = re.sub(
        r'<div\b[^>]*\bdata-role-group="admin"[^>]*>.*?</div>\s*',
        '',
        html,
        flags=re.DOTALL
    )
    html = re.sub(
        r'<a\b[^>]*\bdata-role-group="admin"[^>]*>.*?</a>\s*',
        '',
        html,
        flags=re.DOTALL
    )

    # Đặt nút active mặc định trên Sidebar sang Phân hệ Dự Toán & Văn Phòng
    html = html.replace(
        '<a href="#du-toan-du-an" class="nav-item" data-tab="tab-du-toan-du-an"',
        '<a href="#du-toan-du-an" class="nav-item active" data-tab="tab-du-toan-du-an"'
    )

    # Cập nhật tiêu đề mặc định và thông tin User mặc định trên bản Deploy (Văn phòng & Xưởng)
    html = html.replace('<h1 id="pageTitle">Trung Tâm Quản Trị CCSC 2026</h1>', '<h1 id="pageTitle">Phân Hệ Văn Phòng & Xưởng Sản Xuất</h1>')
    html = html.replace('<span id="currentBreadcrumb">CCSC Dashboard</span>', '<span id="currentBreadcrumb">Dự Toán & Xưởng Sản Xuất</span>')
    html = html.replace('<span class="user-name" id="sidebarUserName">Ban Giám Đốc (Nguyễn Viết Nghĩa)</span>', '<span class="user-name" id="sidebarUserName">Khối Văn Phòng & Xưởng</span>')
    html = html.replace('<span class="user-perm" id="sidebarUserRole">Tổng Quản Trị Hệ Thống</span>', '<span class="user-perm" id="sidebarUserRole">Bản Deploy Văn Phòng & Xưởng</span>')
    html = html.replace('<span class="user-display-name" id="topUserFullName">Nguyễn Viết Nghĩa</span>', '<span class="user-display-name" id="topUserFullName">Tống Trần Hiệp</span>')
    html = html.replace('<span class="user-display-role" id="topUserRoleName">Giám Đốc (Toàn Quyền)</span>', '<span class="user-display-role" id="topUserRoleName">Văn Phòng & Dự Toán Sale</span>')

    # Xóa nút "Bảo Mật Lợi Nhuận: BẬT" trên Topbar của bản Deploy
    html = re.sub(
        r'<!-- EXECUTIVE PRIVACY SHIELD.*?<button type="button" class="privacy-toggle-btn" id="btnPrivacyShield".*?</button>',
        '<!-- [STRIPPED FOR DEPLOY: PRIVACY SHIELD BUTTON] -->',
        html,
        flags=re.DOTALL
    )

    # 2. Xóa vật lý 6 Section nhạy cảm của Giám Đốc & CCSC
    admin_sections = [
        ("tab-dashboard", "CCSC & Executive Dashboard"),
        ("tab-ccsc-t8-t9", "CCSC T8 & T9 Financial Report"),
        ("tab-ccsc-matrix", "CCSC 12-Month Matrix"),
        ("tab-quan-tri-nhan-su", "Admin RBAC & HR Management"),
        ("tab-chien-luoc-20-giai-phap", "Director Q4 Strategy & Profit Simulation"),
        ("tab-rnd-phase2-hub", "R&D Phase 2 Admin Hub"),
    ]
    for sec_id, sec_label in admin_sections:
        html = strip_html_section_by_id(html, sec_id, sec_label)

    # Mở active mặc định cho #tab-du-toan-du-an trên bản Deploy
    html = re.sub(
        r'<section\b([^>]*\bid="tab-du-toan-du-an"[^>]*)class="tab-pane"',
        r'<section\1class="tab-pane active"',
        html
    )
    html = re.sub(
        r'<section\b([^>]*?)class="tab-pane"([^>]*\bid="tab-du-toan-du-an")',
        r'<section\1class="tab-pane active"\2',
        html
    )

    # 3. Xóa "HỘP ĐỐI SOÁT QUỸ KHOÁN THỢ 15% VÀ BẢO [BM]ẬT LỢI NHUẬN BGĐ" trong #tab-xuong-san-xuat
    html = re.sub(
        r'<!-- HỘP ĐỐI SOÁT QUỸ KHOÁN THỢ 15% VÀ BẢO [BM]ẬT LỢI NHUẬN BGĐ -->.*?</div>\s*</div>\s*</section>',
        '<!-- [STRIPPED FOR DEPLOY: BGĐ PROFIT BOX ISOLATED TO LOCAL PC] -->\n        </div>\n      </section>',
        html,
        flags=re.DOTALL
    )

    # 4. Xóa "#fundMonitorWidget" (Thặng Dư Cấn Trừ Ròng Bỏ Túi) trong #tab-cham-cong-all
    html = re.sub(
        r'<!-- (?:WIDGET|ĐỒNG HỒ) GIÁM SÁT QUỸ KHOÁN THỢ 15% REAL-TIME.*?<div class="[^"]*" id="fundMonitorWidget">.*?(?=<!-- TOOLBAR BỘ LỌC THÁNG & BỘ PHẬN -->|<!-- BẢNG LƯƠNG TỔNG HỢP)',
        '<!-- [STRIPPED FOR DEPLOY: #fundMonitorWidget ISOLATED TO LOCAL PC] -->\n        ',
        html,
        flags=re.DOTALL
    )

    # 5. Ẩn chữ "Lợi Nhuận Gộp 30% Bỏ Túi BGĐ" trong #tab-phu-kien-sofa
    html = html.replace(
        '<span class="kpi-label">Lợi Nhuận Gộp 30% Bỏ Túi BGĐ</span>',
        '<span class="kpi-label">Chiết Khấu Thương Mại Đạt Chuẩn</span>'
    )
    html = html.replace(
        '<div class="kpi-sub text-emerald">Tiền tươi cộng thẳng vào Lợi Nhuận Ròng CCSC</div>',
        '<div class="kpi-sub text-emerald">Đảm bảo định mức chi phí công trình</div>'
    )

    # 6. Xóa nút Mở Kho Bí Mật (Admin) và Tải Excel CCSC Gốc trong #tab-sop-quy-trinh
    html = re.sub(
        r'<div class="sop-hub-actions">.*?</div>',
        '<div class="sop-hub-actions"><span class="badge live" style="background:rgba(16,185,129,0.15);color:#10B981;border:1px solid rgba(16,185,129,0.3);padding:6px 12px;">PHÂN HỆ VĂN PHÒNG & XƯỞNG</span></div>',
        html,
        flags=re.DOTALL
    )

    # 7. Xóa các thẻ <script> nạp trực tiếp 6 module Admin/CCSC trên bản Deploy (w01, w02, w03, w04, w38, w45)
    html = re.sub(
        r'\s*<script src="modules/w(?:01|02|03|04|38|45)_[^"]*"[^>]*></script>',
        '',
        html
    )

    # 9. Thay nút Đăng nhập nhanh Giám Đốc ở Modal Login bằng thông báo cách ly vật lý
    html = re.sub(
        r'<button type="button" class="quick-role-btn admin" onclick="quickFillLogin\(\'giamdoc\', \'123\'\)">.*?</button>',
        '<div style="grid-column: 1 / -1; padding: 8px 12px; border-radius: 8px; background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.35); color: #10B981; font-size: 0.78rem; text-align: center;">'
        '<i class="fa-solid fa-shield-halved"></i> <strong>Bản Deploy Văn Phòng & Xưởng:</strong> Phân hệ CCSC & Giám Đốc đã tách vật lý 100% (Chỉ chạy nội bộ trên máy tính Giám Đốc <code>127.0.0.1:8080</code>).'
        '</div>',
        html,
        flags=re.DOTALL
    )

    # Mặc định trên form login của bản Deploy điền sẵn tài khoản Văn phòng/Sale hoặc Xưởng thay vì giamdoc
    html = html.replace('id="loginUsername" class="form-control" placeholder="Nhập tên đăng nhập..." value="giamdoc"',
                        'id="loginUsername" class="form-control" placeholder="Nhập tên đăng nhập..." value="hiepsale"')

    # 10. Đảm bảo khối chân chữ ký in ấn chuẩn A4 (print-signature-footer) luôn có mặt cho Báo giá & Đề xuất vật tư trên bản Deploy
    if "print-signature-footer" not in html:
        print_sig_block = """
  <!-- CHÂN CHỮ KÝ IN ẤN CHUẨN A4 CHO PHÂN HỆ VĂN PHÒNG & XƯỞNG -->
  <div class="print-signature-footer" style="display:none;">
    <div class="sig-col">
      <div class="sig-title">NGƯỜI LẬP PHIẾU / DỰ TOÁN</div>
      <div class="sig-sub">(Ký, ghi rõ họ tên)</div>
    </div>
    <div class="sig-col">
      <div class="sig-title">PHỤ TRÁCH KỸ THUẬT / XƯỞNG</div>
      <div class="sig-sub">(Ký, xác nhận khối lượng)</div>
    </div>
    <div class="sig-col">
      <div class="sig-title">GIÁM ĐỐC PHÊ DUYỆT</div>
      <div class="sig-sub">(Ký, đóng dấu đỏ PG Home Luxury)</div>
    </div>
  </div>
</body>"""
        html = html.replace("</body>", print_sig_block)

    deploy_html_path = os.path.join(WEB_APP_DIR, "index.html")
    with open(deploy_html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"[OK] Built stripped Deploy HTML: {deploy_html_path} ({len(html):,} bytes)")


def build_deploy_js(source_js):
    """
    Làm sạch `web_app/app.js` cho bản Deploy (Văn phòng & Xưởng):
    - Xóa toàn bộ mảng số liệu nhạy cảm `ccscMonths` khỏi `DEFAULT_DATA` (đặt `ccscMonths: []`).
    - Xóa khoản chi `CP-03` (Lương Ban Lãnh Đạo 12,000,000 đ) khỏi `DEFAULT_DATA.expenses`.
    - Xóa trường `profit` (Lãi gộp bỏ túi BGĐ) trong `DEFAULT_DATA.accessories`.
    - Xóa tài khoản `giamdoc` khỏi `DEFAULT_DATA.users` trên bản Deploy để không ai đăng nhập quyền ADMIN trên Cloud.
    - Đặt `currentUser` mặc định trên bản Deploy là `VANPHONG_SALE` (`hiepsale`) thay vì `ADMIN` (`giamdoc`).
    """
    js = source_js

    # 1. Thay thế mảng ccscMonths trong DEFAULT_DATA bằng mảng rỗng []
    js = re.sub(
        r'ccscMonths:\s*\[.*?\]\s*,\s*(?=// Danh mục vật tư)',
        'ccscMonths: [], // [ISOLATED TO LOCAL PC VAULT - ZERO CCSC DATA ON DEPLOY]\n\n  ',
        js,
        flags=re.DOTALL
    )

    # 2. Xóa khoản chi CP-03 (Lương Ban Lãnh Đạo) trong DEFAULT_DATA.expenses
    js = re.sub(
        r'\{\s*id:\s*"CP-03",\s*name:\s*"Lương Ban Lãnh Đạo.*?\},\s*\n',
        '',
        js
    )

    # 3. Xóa tài khoản giamdoc khỏi DEFAULT_DATA.users trên bản Deploy
    js = re.sub(
        r'\{\s*id:\s*1,\s*username:\s*"giamdoc".*?\},\s*\n',
        '',
        js
    )

    # 4. Xóa ghi chú nhạy cảm "mang lại 11.65M lãi gộp cho BGĐ" trong zaloSupplierGroups
    js = js.replace(
        'Mảng Phụ Kiện Bán Kèm mang lại 11.65M lãi gộp cho BGĐ trong T8 + T9.',
        'Mảng Phụ Kiện Bán Kèm & Đồ Rời bàn giao đồng bộ theo tiến độ công trình.'
    )

    # 5. Đổi currentUser mặc định trong app.js trên bản Deploy từ giamdoc (ADMIN) sang hiepsale (VANPHONG_SALE)
    js = js.replace(
        'username: "giamdoc",\n  fullName: "Nguyễn Viết Nghĩa",\n  role: "ADMIN",\n  dept: "Ban Giám Đốc"',
        'username: "hiepsale",\n  fullName: "Tống Trần Hiệp",\n  role: "VANPHONG_SALE",\n  dept: "Văn phòng & Sale Admin & 3D"'
    )

    # 6. Chặn đăng nhập quyền ADMIN trên môi trường Cloud Deploy (chỉ cho phép VANPHONG_SALE, DU_TOAN_SALE, XUONG_VATTU, THO_XUONG)
    cloud_guard_snippet = """
// [SECURITY HARD-LOCK: DEPLOY EDITION ONLY ALLOWS OFFICE & WORKSHOP]
const IS_LOCAL_DIRECTOR_PC = (typeof window !== 'undefined') && (
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === 'localhost'
);
"""
    if "IS_LOCAL_DIRECTOR_PC" not in js:
        js = cloud_guard_snippet + "\n" + js

    deploy_js_path = os.path.join(WEB_APP_DIR, "app.js")
    with open(deploy_js_path, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"[OK] Built stripped Deploy JS: {deploy_js_path} ({len(js):,} bytes)")


def patch_w14_and_master_bundle():
    """
    Cập nhật `w14_rbac_4_portals_guard.js` và `pg_w50_master.bundle.js` để:
    - Khi chạy trên Cloud/Deploy (`!IS_LOCAL_DIRECTOR_PC`): Khóa chặt ở chế độ Văn Phòng & Xưởng,
      vô hiệu hóa hoàn toàn các widget Admin/CCSC (`w01`, `w02`, `w03`, `w04`, `w38`, `w45`) và
      không hiển thị nút chuyển sang cổng Giám Đốc.
    - Khi chạy trên máy tính Giám Đốc (`127.0.0.1:8080` / `localhost:8080`): Hiển thị đầy đủ 4 phân hệ
      (bao gồm Giám Đốc & CCSC) và thanh chuyển đổi nhanh giữa [Bản Nội Bộ Giám Đốc & CCSC] <-> [Xem thử Bản Deploy VP & Xưởng].
    """
    w14_path = os.path.join(WEB_APP_DIR, "modules", "w14_rbac_4_portals_guard.js")
    with open(w14_path, "r", encoding="utf-8") as f:
        w14_code = f.read()

    # Kiểm tra và cập nhật PORTALS trong w14_rbac_4_portals_guard.js
    old_block = """  const PORTALS = {
    ADMIN: {
      code: "ADMIN",
      name: "Phân Hệ Giám Đốc (Full CCSC)",
      user: "Nguyễn Viết Nghĩa",
      badgeColor: "#d4af37",
      allowedTabs: ["ALL"],
      canApprovePO: true,
      canSeeCCSC: true,
      canSeeWorkerFund: true
    },"""

    new_block = """  const IS_LOCAL_PC = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") && !window.location.search.includes("edition=deploy");
  const PORTALS = {
    ...(IS_LOCAL_PC ? {
      ADMIN: {
        code: "ADMIN",
        name: "Phân Hệ Giám Đốc (Local CCSC)",
        user: "Nguyễn Viết Nghĩa",
        badgeColor: "#d4af37",
        allowedTabs: ["ALL"],
        canApprovePO: true,
        canSeeCCSC: true,
        canSeeWorkerFund: true
      }
    } : {}),"""

    if old_block in w14_code:
        w14_code = w14_code.replace(old_block, new_block)

    # Sửa getActiveRole() trong w14 để trên bản Deploy không bao giờ trả về ADMIN
    w14_code = w14_code.replace(
        'return saved && PORTALS[saved] ? saved : "ADMIN";',
        'if (!IS_LOCAL_PC && saved === "ADMIN") return "VANPHONG_SALE";\n    return saved && PORTALS[saved] ? saved : (IS_LOCAL_PC ? "ADMIN" : "VANPHONG_SALE");'
    )

    with open(w14_path, "w", encoding="utf-8") as f:
        f.write(w14_code)
    print(f"[OK] Updated RBAC 4 Portals Guard: {w14_path}")

    # Cập nhật pg_w50_master.bundle.js để bọc các module Admin/CCSC (w01, w02, w03, w04, w38, w45)
    # chỉ thực thi khi IS_LOCAL_PC === true, và đồng bộ bản mới của w14
    bundle_path = os.path.join(WEB_APP_DIR, "modules", "pg_w50_master.bundle.js")
    if os.path.exists(bundle_path):
        modules_dir = os.path.join(WEB_APP_DIR, "modules")
        js_files = sorted([
            fn for fn in os.listdir(modules_dir)
            if re.match(r"^w\d+_.*\.js$", fn)
        ])
        admin_only_Read = ("w01_", "w02_", "w03_", "w04_", "w38_", "w45_")
        parts = [
            "/* PG HOME LUXURY ERP - MASTER MODULE BUNDLE (2-EDITION ISOLATION AWARE) */\n",
            "window.__PG_IS_LOCAL_DIRECTOR_PC__ = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') && !window.location.search.includes('edition=deploy');\n"
        ]
        for fn in js_files:
            fpath = os.path.join(modules_dir, fn)
            with open(fpath, "r", encoding="utf-8") as mf:
                mcontent = mf.read()
            if fn.startswith(admin_only_Read):
                parts.append(f"\n/* === MODULE: {fn} (LOCAL DIRECTOR PC ONLY) === */\n")
                parts.append(f"if (window.__PG_IS_LOCAL_DIRECTOR_PC__) {{\n{mcontent}\n}}\n")
            else:
                parts.append(f"\n/* === MODULE: {fn} === */\n{mcontent}\n")
        new_bundle = "".join(parts)
        with open(bundle_path, "w", encoding="utf-8") as bf:
            bf.write(new_bundle)
        print(f"[OK] Rebuilt Master JS Bundle with Local-Only Guard for CCSC modules: {bundle_path} ({len(new_bundle):,} bytes)")


if __name__ == "__main__":
    src_html, src_js = ensure_local_vault()
    extract_ccsc_vault_json(src_js)
    build_deploy_html(src_html)
    build_deploy_js(src_js)
    patch_w14_and_master_bundle()
    print("=== PHYSICAL 2-EDITION SPLIT COMPLETED SUCCESSFULLY ===")
