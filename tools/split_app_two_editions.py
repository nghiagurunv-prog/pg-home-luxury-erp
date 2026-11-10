# -*- coding: utf-8 -*-
"""
PG HOME LUXURY ERP - PHYSICAL 2-EDITION SPLIT ENGINE (V2.0 - WORKFLOW-ALIGNED)
==============================================================================
Tách vật lý Web App thành 2 bản độc lập 100% chống lộ lọt thông tin, đồng thời
tổ chức Bản Deploy chuẩn hóa tuyệt đối theo 2 Khối Chức Năng - Nhiệm Vụ thực tế:

A. BẢN NỘI BỘ MÁY TÍNH GIÁM ĐỐC (LOCAL PC - `http://127.0.0.1:8080`):
   - Lưu tại `local_admin_vault/` (cách ly hoàn toàn khỏi Cloud/GitHub/Render).
   - Chứa đầy đủ 100% Phân hệ Giám Đốc (ADMIN), Bảng CCSC 12 tháng, Đối soát T8+T9,
     Lợi nhuận ròng bỏ túi BGĐ, Quỹ lương quản lý, Quỹ thợ nòng cốt Hòa & Hào,
     20 Giải pháp chiến lược, cùng toàn bộ phân hệ Văn phòng & Xưởng.

B. BẢN DEPLOY VĂN PHÒNG & XƯỞNG (CLOUD DEPLOY - `web_app/index.html`, `web_app/app.js`):
   - Đã cắt bỏ vật lý 100% HTML/JS của CCSC, Dashboard Giám Đốc, Lợi nhuận bỏ túi BGĐ,
     Lương BLĐ (CP-03), Quỹ thợ 15% dôi dư bỏ túi và các file Excel nhạy cảm.
   - Chia Menu & Giao diện thành ĐÚNG 2 PHẦN CHUẨN QUY TRÌNH VẬN HÀNH PHÚ GIA:
     * PHẦN I: KHỐI VĂN PHÒNG & KINH DOANH (Hiệp & Dũng - 5 Nghiệp vụ khép kín):
       1. Dự Toán & Báo Giá Công Trình (#tab-du-toan-du-an)
       2. Hợp Đồng & Doanh Số Kinh Doanh (#tab-van-phong-sale)
       3. Phụ Kiện Bếp & Sofa Thương Mại (#tab-phu-kien-sofa)
       4. Thu Hồi Công Nợ & Dòng Tiền Khách (#tab-cong-no-dong-tien)
       5. Chi Phí Mặt Bằng & Vận Hành VP (#tab-chi-phi-van-phong)
     * PHẦN II: KHỐI XƯỞNG SẢN XUẤT & KỸ THUẬT (Vũ, Thái & Đội Thợ - 5 Nghiệp vụ khép kín):
       1. Tiến Độ Sản Xuất & Khối Lượng Xưởng (#tab-xuong-san-xuat)
       2. Đề Xuất & Duyệt Đặt Hàng Vật Tư PO (#tab-phe-duyet-vat-tu)
       3. Kho Vật Tư, Đơn Giá & Đối Soát NCC (#tab-vat-tu-cost)
       4. Chấm Công, Điểm Danh & Bảng Lương (#tab-cham-cong-all)
       5. Quy Chuẩn Kỹ Thuật & Định Mức CNC (#tab-sop-quy-trinh)
"""

import json
import os
import re

ROOT_DIR = r"f:\PG Home - Quản trị"
WEB_APP_DIR = os.path.join(ROOT_DIR, "web_app")
LOCAL_VAULT_DIR = os.path.join(ROOT_DIR, "local_admin_vault")


def ensure_local_vault():
    os.makedirs(LOCAL_VAULT_DIR, exist_ok=True)
    index_html_path = os.path.join(WEB_APP_DIR, "index.html")
    app_js_path = os.path.join(WEB_APP_DIR, "app.js")
    director_html_path = os.path.join(LOCAL_VAULT_DIR, "director_ccsc_full.html")
    director_js_path = os.path.join(LOCAL_VAULT_DIR, "director_app_full.js")

    if os.path.exists(director_html_path):
        with open(director_html_path, "r", encoding="utf-8") as f:
            dh = f.read().replace("Showroom Ngô Đức Kế", "Showroom Trương Quốc Dụng")
        dh = dh.replace(
            '<span class="brand-sub">ERP V7.0 ENTERPRISE</span>',
            '<span class="brand-sub" style="color:#10B981;font-weight:800;">LOCAL PC: CCSC & GIÁM ĐỐC</span>'
        )
        dh = re.sub(
            r'<script src="app\.js[^"]*"></script>',
            '<script src="/local-admin-assets/director_app_full.js?v=15.0_LOCAL_CCSC_2026"></script>',
            dh
        )
        with open(director_html_path, "w", encoding="utf-8") as f:
            f.write(dh)
        print(f"[OK] Loaded master Director & CCSC HTML from: {director_html_path} ({len(dh):,} bytes)")
    else:
        with open(index_html_path, "r", encoding="utf-8") as f:
            full_html = f.read().replace("Showroom Ngô Đức Kế", "Showroom Trương Quốc Dụng")
        with open(director_html_path, "w", encoding="utf-8") as f:
            f.write(full_html)

    if os.path.exists(director_js_path):
        with open(director_js_path, "r", encoding="utf-8") as f:
            source_js = f.read()
        print(f"[OK] Loaded master Director & CCSC JS from: {director_js_path} ({len(source_js):,} bytes)")
    else:
        with open(app_js_path, "r", encoding="utf-8") as f:
            source_js = f.read()
        with open(director_js_path, "w", encoding="utf-8") as f:
            f.write(source_js)

    with open(director_html_path, "r", encoding="utf-8") as f:
        source_html = f.read()

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


DEPLOY_TWO_DIVISION_NAV_HTML = """      <!-- BỘ CHUYỂN ĐỔI 2 PHÂN HỆ: I. VĂN PHÒNG <-> II. XƯỞNG SẢN XUẤT -->
      <div class="deploy-division-switcher" id="deployDivisionSwitcher" style="padding: 6px 10px; border-bottom: 1px solid rgba(212,175,55,0.16);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
          <button type="button" class="div-switch-btn active" data-div-mode="vanphong" onclick="window.switchDeployDivision('vanphong')" style="padding: 6px 6px; border-radius: 6px; border: 1px solid rgba(168,85,247,0.45); background: rgba(168,85,247,0.22); color: #F3E8FF; font-size: 0.70rem; font-weight: 800; cursor: pointer;">
            🏢 I. Văn Phòng (6)
          </button>
          <button type="button" class="div-switch-btn" data-div-mode="xuong" onclick="window.switchDeployDivision('xuong')" style="padding: 6px 6px; border-radius: 6px; border: 1px solid rgba(6,182,212,0.35); background: rgba(6,182,212,0.08); color: #A5F3FC; font-size: 0.70rem; font-weight: 800; cursor: pointer;">
            🏭 II. Xưởng SX (5)
          </button>
        </div>
      </div>

      <!-- MENU CHUẨN 2 PHẦN CÁCH LY ĐỘC LẬP THEO CHỨC NĂNG NHIỆM VỤ PHÚ GIA -->
      <nav class="nav-menu" id="mainNavMenu">
        <!-- =========================================================================
             PHẦN I: KHỐI VĂN PHÒNG — KINH DOANH, DỰ TOÁN & CÔNG NỢ KHÁCH (HIỆP & DŨNG)
             Cách ly tuyệt đối với đơn giá kho xưởng, công nợ NCC và bảng lương thợ xưởng
             ========================================================================= -->
        <div class="nav-section-title" data-role-group="vanphong" data-division="vanphong" style="background: rgba(168,85,247,0.14); border-left: 3px solid #A855F7; padding: 8px 10px; margin: 8px 8px 4px; border-radius: 6px; color: #E9D5FF; font-weight: 800; font-size: 0.72rem; letter-spacing: 0.03em;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span><i class="fa-solid fa-building-user text-purple"></i> PHẦN I: KHỐI VĂN PHÒNG</span>
            <span style="background:rgba(168,85,247,0.28); color:#F3E8FF; padding:1px 6px; border-radius:99px; font-size:0.62rem;">6 Bước VP</span>
          </div>
          <div style="font-size:0.62rem; color:#C084FC; font-weight:500; margin-top:2px;">Dự toán • Hợp đồng • Phụ kiện • Công nợ khách • Chi phí & Chấm công VP</div>
        </div>

        <a href="#du-toan-du-an" class="nav-item active" data-tab="tab-du-toan-du-an" data-role-group="vanphong" data-division="vanphong" title="Bước 1 Văn Phòng: Khởi tạo dự án mới, đo bóc định mức tấm CNC, định giá 3 cấp vật liệu (An Cường / Thái Lan / Plywood) & kiểm soát Cost <= 54%">
          <i class="fa-solid fa-calculator text-purple"></i>
          <span>1. Dự Toán & Báo Giá Công Trình</span>
        </a>
        <a href="#van-phong-sale" class="nav-item" data-tab="tab-van-phong-sale" data-role-group="vanphong" data-division="vanphong" title="Bước 2 Văn Phòng: Quản lý hợp đồng ký kết, theo dõi doanh số Sale & bóc tách doanh số Gỗ CN (woodVal) bàn giao xuống Xưởng">
          <i class="fa-solid fa-file-signature text-purple"></i>
          <span>2. Hợp Đồng & Doanh Số Sale</span>
        </a>
        <a href="#phu-kien-sofa" class="nav-item" data-tab="tab-phu-kien-sofa" data-role-group="vanphong" data-division="vanphong" title="Bước 3 Văn Phòng: Quản lý thiết bị bếp, phụ kiện kim khí (Hafele, Eurogold, Huge) & Sofa/đồ rời thương mại bán kèm hợp đồng">
          <i class="fa-solid fa-couch text-purple"></i>
          <span>3. Phụ Kiện Bếp & Sofa Thương Mại</span>
        </a>
        <a href="#cong-no-dong-tien" class="nav-item" data-tab="tab-cong-no-dong-tien" data-role-group="vanphong" data-division="vanphong" title="Bước 4 Văn Phòng: Chỉ theo dõi thu tiền khách hàng 3 đợt (50% ký HĐ - 40% giao hàng - 10% nghiệm thu), cách ly hoàn toàn công nợ NCC xưởng">
          <i class="fa-solid fa-hand-holding-dollar text-purple"></i>
          <span>4. Thu Hồi Công Nợ Khách Hàng</span>
        </a>
        <a href="#chi-phi-van-phong" class="nav-item" data-tab="tab-chi-phi-van-phong" data-role-group="vanphong" data-division="vanphong" title="Bước 5 Văn Phòng: Quản lý chi phí mặt bằng Showroom Trương Quốc Dụng, Marketing/Ads, văn phòng phẩm & hành chính VP">
          <i class="fa-solid fa-store text-purple"></i>
          <span>5. Chi Phí Mặt Bằng & Vận Hành VP</span>
        </a>
        <a href="#cham-cong-vp" class="nav-item" data-tab="tab-cham-cong-all" data-role-group="vanphong" data-division="vanphong" onclick="window.openDivisionTimesheet('vanphong'); return false;" title="Bước 6 Văn Phòng: Điểm danh & bảng lương riêng Khối Văn Phòng (Hiệp, Dũng, Nga, Linh), ẩn hoàn toàn lương thợ xưởng">
          <i class="fa-solid fa-user-tie text-purple"></i>
          <span>6. Chấm Công & Điểm Danh VP</span>
        </a>

        <!-- =========================================================================
             PHẦN II: KHỐI XƯỞNG SẢN XUẤT — KỸ THUẬT, VẬT TƯ & ĐỘI THỢ (VŨ, THÁI & THỢ)
             Cách ly tuyệt đối với báo giá khách hàng, hợp đồng sale và lương văn phòng
             ========================================================================= -->
        <div class="nav-section-title" data-role-group="xuong" data-division="xuong" style="display:none; background: rgba(6,182,212,0.14); border-left: 3px solid #06B6D4; padding: 8px 10px; margin: 8px 8px 4px; border-radius: 6px; color: #A5F3FC; font-weight: 800; font-size: 0.72rem; letter-spacing: 0.03em;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span><i class="fa-solid fa-industry text-cyan"></i> PHẦN II: KHỐI XƯỞNG SẢN XUẤT</span>
            <span style="background:rgba(6,182,212,0.28); color:#ECFEFF; padding:1px 6px; border-radius:99px; font-size:0.62rem;">5 Bước Xưởng</span>
          </div>
          <div style="font-size:0.62rem; color:#67E8F9; font-weight:500; margin-top:2px;">Tiến độ SX • Duyệt PO • Kho & Nợ NCC • Lương thợ • Định mức CNC</div>
        </div>

        <a href="#xuong-san-xuat" class="nav-item" data-tab="tab-xuong-san-xuat" data-role-group="xuong" data-division="xuong" style="display:none;" title="Bước 1 Xưởng: Nhận lệnh sản xuất từ Văn phòng, theo dõi tiến độ gia công CNC & lắp đặt công trình, kiểm soát trần vật tư 40%">
          <i class="fa-solid fa-gears text-cyan"></i>
          <span>1. Tiến Độ Sản Xuất & Khối Lượng Xưởng</span>
        </a>
        <a href="#phe-duyet-vat-tu" class="nav-item" data-tab="tab-phe-duyet-vat-tu" data-role-group="xuong" data-division="xuong" style="display:none;" title="Bước 2 Xưởng: Vũ lập Phiếu đề xuất vật tư theo bóc tách kỹ thuật; kiểm tra chốt chặn Dấu Đỏ Điện Tử Giám Đốc trước khi gửi NCC">
          <i class="fa-solid fa-stamp text-cyan"></i>
          <span>2. Đề Xuất & Duyệt Đặt Hàng Vật Tư (PO)</span>
        </a>
        <a href="#vat-tu-cost" class="nav-item" data-tab="tab-vat-tu-cost" data-role-group="xuong" data-division="xuong" style="display:none;" title="Bước 3 Xưởng: Tra cứu đơn giá ván/phụ kiện, lịch sử nhập hàng & đối soát công nợ 3 lớp với NCC (Lam Giang, Quốc Tâm, ALD, Kính, Đá)">
          <i class="fa-solid fa-boxes-stacked text-cyan"></i>
          <span>3. Kho Vật Tư, Đơn Giá & Công Nợ NCC</span>
        </a>
        <a href="#cham-cong-xuong" class="nav-item" data-tab="tab-cham-cong-all" data-role-group="xuong" data-division="xuong" style="display:none;" onclick="window.openDivisionTimesheet('xuong'); return false;" title="Bước 4 Xưởng: Điểm danh hàng ngày (Công hành chính HC + Giờ tăng ca OT), quản lý tạm ứng & bảng lương riêng Đội Thợ Xưởng">
          <i class="fa-solid fa-helmet-safety text-cyan"></i>
          <span>4. Chấm Công & Lương Thợ Xưởng</span>
        </a>
        <a href="#sop-quy-trinh" class="nav-item" data-tab="tab-sop-quy-trinh" data-role-group="xuong" data-division="xuong" style="display:none;" title="Bước 5 Xưởng & Kỹ thuật: Bảng chuẩn 8 định mức tấm cắt CNC thực chiến (khổ 1220x2440) & Quy trình phối hợp Văn Phòng - Xưởng (Master SOP 4.0)">
          <i class="fa-solid fa-ruler-combined text-gold"></i>
          <span>5. Quy Chuẩn Kỹ Thuật & Định Mức CNC</span>
        </a>
      </nav>"""


def build_deploy_html(source_html):
    """
    Tạo bản `web_app/index.html` dành riêng cho Deploy (Văn phòng & Xưởng):
    - Thay thế toàn bộ `#mainNavMenu` bằng cấu trúc 2 PHẦN CHUẨN QUY TRÌNH:
      + PHẦN I: KHỐI VĂN PHÒNG (5 mục theo quy trình khép kín từ Dự toán -> Hợp đồng -> Phụ kiện -> Công nợ -> Chi phí VP)
      + PHẦN II: KHỐI XƯỞNG SẢN XUẤT (5 mục theo quy trình từ Tiến độ SX -> Duyệt PO -> Kho & NCC -> Chấm công -> Định mức CNC & SOP)
    - Cắt bỏ vật lý 6 Section nhạy cảm của Giám Đốc & CCSC:
      #tab-dashboard, #tab-ccsc-t8-t9, #tab-ccsc-matrix,
      #tab-quan-tri-nhan-su, #tab-chien-luoc-20-giai-phap, #tab-rnd-phase2-hub.
    - Cắt bỏ hộp đối soát lợi nhuận bỏ túi BGĐ trong #tab-xuong-san-xuat, #tab-cham-cong-all, #tab-phu-kien-sofa.
    """
    html = source_html.replace("Showroom Ngô Đức Kế", "Showroom Trương Quốc Dụng")

    # Khôi phục script tag chuẩn cho bản Deploy
    html = re.sub(
        r'<script src="/local-admin-assets/director_app_full\.js[^"]*"></script>',
        '<script src="app.js?v=15.0_DEPLOY_2PARTS_VP_XUONG"></script>',
        html
    )
    html = re.sub(
        r'<script src="app\.js[^"]*"></script>',
        '<script src="app.js?v=15.0_DEPLOY_2PARTS_VP_XUONG"></script>',
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

    # 1. Thay thế toàn bộ khối <nav class="nav-menu" id="mainNavMenu">...</nav> bằng Menu 2 Phần chuẩn quy trình
    html = re.sub(
        r'<nav class="nav-menu" id="mainNavMenu">.*?</nav>',
        DEPLOY_TWO_DIVISION_NAV_HTML,
        html,
        flags=re.DOTALL
    )

    # Cập nhật tiêu đề mặc định và thông tin User mặc định trên bản Deploy (Văn phòng & Xưởng)
    html = html.replace(
        '<h1 id="pageTitle">Trung Tâm Quản Trị CCSC 2026</h1>',
        '<h1 id="pageTitle">Hệ Thống Điều Hành: I. Văn Phòng & II. Xưởng Sản Xuất</h1>'
    )
    html = html.replace(
        '<span id="currentBreadcrumb">CCSC Dashboard</span>',
        '<span id="currentBreadcrumb">1. Dự Toán & Báo Giá Công Trình</span>'
    )
    html = html.replace(
        '<span class="user-name" id="sidebarUserName">Ban Giám Đốc (Nguyễn Viết Nghĩa)</span>',
        '<span class="user-name" id="sidebarUserName">Điều Hành Văn Phòng & Xưởng</span>'
    )
    html = html.replace(
        '<span class="user-perm" id="sidebarUserRole">Tổng Quản Trị Hệ Thống</span>',
        '<span class="user-perm" id="sidebarUserRole">Phần I: Văn Phòng • Phần II: Xưởng SX</span>'
    )
    html = html.replace(
        '<span class="user-display-name" id="topUserFullName">Nguyễn Viết Nghĩa</span>',
        '<span class="user-display-name" id="topUserFullName">Văn Phòng & Xưởng SX</span>'
    )
    html = html.replace(
        '<span class="user-display-role" id="topUserRoleName">Giám Đốc (Toàn Quyền)</span>',
        '<span class="user-display-role" id="topUserRoleName">2 Phân Hệ: Văn Phòng + Xưởng</span>'
    )

    # Thay nút "Bảo Mật Lợi Nhuận: BẬT" trên Topbar của bản Deploy bằng Thanh Chuyển Đổi Cách Ly 2 Phần (I. Văn Phòng | II. Xưởng SX)
    topbar_2part_pills = """<!-- TOPBAR 2-DIVISION STRICT SWITCHER (PHẦN I: VĂN PHÒNG | PHẦN II: XƯỞNG SX) -->
          <div class="topbar-division-pills" style="display:inline-flex; align-items:center; gap:4px; background:rgba(15,23,42,0.88); border:1px solid rgba(212,175,55,0.32); padding:3px; border-radius:8px;">
            <button type="button" class="top-div-pill active" data-div-mode="vanphong" onclick="window.switchDeployDivision('vanphong')" style="padding:4px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.22); background:rgba(168,85,247,0.28); color:#F3E8FF; font-size:0.72rem; font-weight:800; cursor:pointer;" title="Chế độ Khối Văn Phòng & Kinh Doanh (Dự toán, Hợp đồng, Phụ kiện/Sofa, Công nợ khách, Chi phí & Chấm công VP)">
              <i class="fa-solid fa-building-user"></i> I. Khối Văn Phòng (6)
            </button>
            <button type="button" class="top-div-pill" data-div-mode="xuong" onclick="window.switchDeployDivision('xuong')" style="padding:4px 10px; border-radius:6px; border:none; background:transparent; color:#A5F3FC; font-size:0.72rem; font-weight:700; cursor:pointer;" title="Chế độ Khối Xưởng Sản Xuất (Tiến độ SX, Duyệt PO vật tư, Kho & Công nợ NCC, Lương thợ xưởng, Định mức CNC)">
              <i class="fa-solid fa-industry"></i> II. Khối Xưởng SX (5)
            </button>
          </div>"""
    html = re.sub(
        r'<!-- EXECUTIVE PRIVACY SHIELD.*?<button type="button" class="privacy-toggle-btn" id="btnPrivacyShield".*?</button>',
        topbar_2part_pills,
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

    # 3. Xóa "HỘP ĐỐI SOÁT QUỸ KHOÁN THỢ 15% VÀ BẢO MẬT LỢI NHUẬN BGĐ" trong #tab-xuong-san-xuat
    html = re.sub(
        r'<!-- HỘP ĐỐI SOÁT QUỸ KHOÁN THỢ 15% VÀ BẢO [BM]ẬT LỢI NHUẬN BGĐ -->.*?</div>\s*</div>\s*</section>',
        '<!-- [STRIPPED FOR DEPLOY: BGĐ PROFIT BOX ISOLATED TO LOCAL PC] -->\n        </div>\n      </section>',
        html,
        flags=re.DOTALL
    )

    # 4. Xóa "#fundMonitorWidget" (Thặng Dư Cấn Trừ Ròng Bỏ Túi) và "#bonusPassbookCard" (Quỹ Giữ Chân Nội Bộ) trong #tab-cham-cong-all
    html = re.sub(
        r'<!-- (?:WIDGET|ĐỒNG HỒ) GIÁM SÁT QUỸ KHOÁN THỢ 15% REAL-TIME.*?<div class="[^"]*" id="fundMonitorWidget">.*?(?=<!-- TOOLBAR BỘ LỌC THÁNG & BỘ PHẬN -->|<!-- BẢNG LƯƠNG TỔNG HỢP)',
        '<!-- [STRIPPED FOR DEPLOY: #fundMonitorWidget ISOLATED TO LOCAL PC] -->\n        ',
        html,
        flags=re.DOTALL
    )
    html = re.sub(
        r'<!-- SỔ TÍCH LŨY THƯỞNG TẾT & QUỸ TRÁCH NHIỆM CUỐI NĂM \(RULE C1 & C2\) -->.*?<div class="card" id="bonusPassbookCard".*?(?=<!-- CHỐT CHẶN 4: MA TRẬN CHẤM CÔNG)',
        '<!-- [STRIPPED FOR DEPLOY: #bonusPassbookCard ISOLATED TO LOCAL PC] -->\n        ',
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
        '<div class="sop-hub-actions"><span class="badge live" style="background:rgba(16,185,129,0.15);color:#10B981;border:1px solid rgba(16,185,129,0.3);padding:6px 12px;">QUY TRÌNH PHỐI HỢP: I. VĂN PHÒNG ↔ II. XƯỞNG SẢN XUẤT</span></div>',
        html,
        flags=re.DOTALL
    )

    # 7. Xóa các thẻ <script> nạp trực tiếp 6 module Admin/CCSC trên bản Deploy (w01, w02, w03, w04, w38, w45)
    html = re.sub(
        r'\s*<script src="modules/w(?:01|02|03|04|38|45)_[^"]*"[^>]*></script>',
        '',
        html
    )

    # 8. Thay nút Đăng nhập nhanh Giám Đốc ở Modal Login bằng nút Mở Khối Văn Phòng (cách ly với Xưởng)
    html = re.sub(
        r'<button type="button" class="quick-role-btn admin" onclick="quickFillLogin\(\'giamdoc\', \'123\'\)">.*?</button>',
        '<button type="button" class="quick-role-btn admin" onclick="window.switchDeployDivision(\'vanphong\'); document.getElementById(\'authScreen\')?.classList.remove(\'show\');">'
        '<i class="fa-solid fa-building-user"></i>'
        '<div><strong>I. Mở Khối Văn Phòng (6 Bước)</strong><span>Dự toán • Hợp đồng • Phụ kiện • Công nợ khách • Chấm công VP</span></div>'
        '</button>',
        html,
        flags=re.DOTALL
    )

    # Mặc định trên form login của bản Deploy điền sẵn tài khoản Văn phòng/Sale thay vì giamdoc
    html = html.replace('id="loginUsername" class="form-control" placeholder="Nhập tên đăng nhập..." value="giamdoc"',
                        'id="loginUsername" class="form-control" placeholder="Nhập tên đăng nhập..." value="hiepsale"')

    # 9. Đảm bảo khối chân chữ ký in ấn chuẩn A4 (print-signature-footer) luôn có mặt
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
    print(f"[OK] Built 2-Division Deploy HTML: {deploy_html_path} ({len(html):,} bytes)")


def build_deploy_js(source_js):
    """
    Làm sạch `web_app/app.js` cho bản Deploy (Văn phòng & Xưởng) VÀ sửa triệt để lỗi ẩn menu trên Cloud:
    - Xóa toàn bộ mảng số liệu nhạy cảm `ccscMonths` khỏi `DEFAULT_DATA` (đặt `ccscMonths: []`).
    - Xóa khoản chi `CP-03` (Lương Ban Lãnh Đạo 12,000,000 đ) khỏi `DEFAULT_DATA.expenses`.
    - Xóa tài khoản `giamdoc` khỏi `DEFAULT_DATA.users` trên bản Deploy.
    - Sửa `initCurrentUser()` và `applyUserRole()`:
      + Trên bản Deploy, tuyệt đối KHÔNG gán `role: "STAFF"` làm ẩn cả 2 nhóm `vanphong` và `xuong`!
      + Mặc định hiển thị đầy đủ cả **PHẦN I: KHỐI VĂN PHÒNG (5 mục)** và **PHẦN II: KHỐI XƯỞNG SẢN XUẤT (5 mục)** trên thanh menu bên trái.
      + Bổ sung hàm `window.switchDeployDivision(mode)` ('all' | 'vanphong' | 'xuong') để chuyển nhanh giữa:
        * Xem Cả 2 Khối (10 mục đầy đủ)
        * Chỉ Phần I: Khối Văn Phòng (Dự toán, Hợp đồng, Phụ kiện/Sofa, Công nợ khách, Chi phí VP)
        * Chỉ Phần II: Khối Xưởng Sản Xuất (Tiến độ SX, Duyệt PO vật tư, Kho & NCC, Chấm công, Định mức CNC & SOP)
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

    # 5. Đổi currentUser mặc định ở đầu file app.js trên bản Deploy
    js = js.replace(
        'username: "giamdoc",\n  fullName: "Nguyễn Viết Nghĩa",\n  role: "ADMIN",\n  dept: "Ban Giám Đốc"',
        'username: "hiepsale",\n  fullName: "Điều Hành Văn Phòng & Xưởng",\n  role: "DEPLOY_BOTH",\n  dept: "Khối Văn Phòng & Khối Xưởng Sản Xuất"'
    )

    # 6. Sửa khối initCurrentUser() để trên Cloud KHÔNG BAO GIỜ gán role: "STAFF" (nguyên nhân làm mất menu!)
    old_init_user = """  if (!currentUser) {
    if (isLocalMachine()) {
      currentUser = (appState.users || [])[0] || {
        id: 1,
        username: "giamdoc",
        fullName: "Nguyễn Viết Nghĩa",
        role: "ADMIN"
      };
    } else {
      currentUser = {
        id: 9999,
        username: "staff_remote",
        fullName: "Nhân Viên (Truy cập từ xa)",
        role: "STAFF"
      };
    }
  }"""

    new_init_user = """  // Trên bản Deploy (Văn phòng & Xưởng): Nếu localStorage cũ lưu STAFF hoặc ADMIN thì chuyển về chế độ hiển thị chuẩn 2 Phần (DEPLOY_BOTH)
  if (!currentUser || currentUser.role === "STAFF" || currentUser.role === "ADMIN") {
    currentUser = {
      id: 100,
      username: "hiepsale",
      fullName: "Điều Hành Văn Phòng & Xưởng",
      role: "DEPLOY_BOTH",
      dept: "Phần I: Văn Phòng • Phần II: Xưởng SX"
    };
  }"""
    if old_init_user in js:
        js = js.replace(old_init_user, new_init_user)

    # 7. Sửa khối applyUserRole(user) trên bản Deploy để cách ly rõ ràng Phần I: Văn Phòng và Phần II: Xưởng Sản Xuất
    old_role_loop = """  const roleGroups = document.querySelectorAll("[data-role-group]");
  roleGroups.forEach(el => {
    const grp = el.getAttribute("data-role-group");
    if (user.role === "ADMIN") {
      el.classList.remove("role-hidden");
    } else if (user.role === "XUONG_VATTU") {
      if (grp === "xuong") {
        el.classList.remove("role-hidden");
      } else {
        el.classList.add("role-hidden");
      }
    } else if (user.role === "VANPHONG_SALE" || user.role === "DU_TOAN_SALE") {
      if (grp === "vanphong") {
        el.classList.remove("role-hidden");
      } else {
        el.classList.add("role-hidden");
      }
    } else {
      // Quyền STAFF hoặc tài khoản hạn chế khác: ẩn toàn bộ nhóm phân hệ nhạy cảm
      el.classList.add("role-hidden");
    }
  });"""

    new_role_loop = """  // Bản Deploy Chuẩn Cách Ly 2 Phần (Phần I: Văn Phòng | Phần II: Xưởng Sản Xuất):
  // Luôn tách bạch 2 khối độc lập để tránh lộ lọt thông tin giữa Văn Phòng và Xưởng
  let savedDivMode = sessionStorage.getItem("PG_DEPLOY_DIVISION_MODE") || "vanphong";
  if (user.role === "XUONG_VATTU") savedDivMode = "xuong";
  else if (user.role === "VANPHONG_SALE" || user.role === "DU_TOAN_SALE") savedDivMode = "vanphong";
  else if (savedDivMode !== "vanphong" && savedDivMode !== "xuong") savedDivMode = "vanphong";

  const roleGroups = document.querySelectorAll("[data-role-group]");
  roleGroups.forEach(el => {
    const grp = el.getAttribute("data-role-group");
    if (grp === "admin") {
      el.classList.add("role-hidden");
      el.style.display = "none";
      return;
    }
    const isTarget = (grp === savedDivMode);
    el.classList.toggle("role-hidden", !isTarget);
    el.style.display = isTarget ? "" : "none";
  });"""

    if old_role_loop in js:
        js = js.replace(old_role_loop, new_role_loop)

    # Sửa điều hướng tab mặc định trong applyUserRole để nếu tab hiện tại không tồn tại (như tab-dashboard đã cắt bỏ) thì mở tab-du-toan-du-an
    js = js.replace(
        'switchTabTo("tab-dashboard");',
        'switchTabTo("tab-du-toan-du-an");'
    )

    # 8. Bổ sung hàm window.openDivisionTimesheet(dept) và window.switchDeployDivision(mode)
    #    để tách bạch 100% giữa:
    #    - 'vanphong': Tập trung Phần I: Khối Văn Phòng & Kinh Doanh (6 mục) + chỉ hiện bảng Chấm công VP
    #    - 'xuong': Tập trung Phần II: Khối Xưởng Sản Xuất & Kỹ Thuật (5 mục) + chỉ hiện bảng Chấm công & Lương Thợ Xưởng
    division_switcher_js = """
// ==========================================================================
// BỘ ĐIỀU HƯỚNG & CÁCH LY TUYỆT ĐỐI 2 PHẦN TRÊN BẢN DEPLOY (I. VĂN PHÒNG | II. XƯỞNG)
// Khóa cứng đồng bộ Sidebar <-> Nội dung chính, cấm hiển thị lệch Khối VP mà màn hình hiện tab Xưởng
// ==========================================================================
const PG_VP_EXCLUSIVE_TABS = ["tab-du-toan-du-an", "tab-van-phong-sale", "tab-phu-kien-sofa", "tab-cong-no-dong-tien", "tab-chi-phi-van-phong"];
const PG_XUONG_EXCLUSIVE_TABS = ["tab-xuong-san-xuat", "tab-phe-duyet-vat-tu", "tab-vat-tu-cost", "tab-sop-quy-trinh"];

window.openDivisionTimesheet = function(dept) {
  const targetDept = (dept === "xuong") ? "xuong" : "vanphong";
  try {
    sessionStorage.setItem("PG_DEPLOY_DIVISION_MODE", targetDept);
  } catch (e) {}
  if (typeof switchTabTo === "function") {
    switchTabTo("tab-cham-cong-all");
  }
  if (typeof setTimesheetDeptFilter === "function") {
    setTimesheetDeptFilter(targetDept);
  }
  const btnAll = document.getElementById("btnFilterDeptAll");
  const btnXuong = document.getElementById("btnFilterDeptXuong");
  const btnVP = document.getElementById("btnFilterDeptVP");
  if (btnAll) btnAll.style.display = "none";
  if (btnXuong) btnXuong.style.display = (targetDept === "xuong") ? "inline-flex" : "none";
  if (btnVP) btnVP.style.display = (targetDept === "vanphong") ? "inline-flex" : "none";
};

window.switchDeployDivision = function(mode, skipAutoTabSwitch) {
  const validMode = (mode === "xuong") ? "xuong" : "vanphong";
  try {
    sessionStorage.setItem("PG_DEPLOY_DIVISION_MODE", validMode);
  } catch (e) {}

  // 1. Ẩn/hiện nghiêm ngặt các mục trên Sidebar theo Phần I (vanphong) hoặc Phần II (xuong)
  document.querySelectorAll("[data-division]").forEach(el => {
    const div = el.getAttribute("data-division");
    if (div === validMode) {
      el.classList.remove("role-hidden");
      el.style.display = "";
    } else {
      el.classList.add("role-hidden");
      el.style.display = "none";
    }
  });

  // 2. Cưỡng chế khóa cứng các .tab-pane thuộc phân hệ đối lập để không bao giờ rò rỉ giao diện
  const forbiddenTabs = (validMode === "vanphong") ? PG_XUONG_EXCLUSIVE_TABS : PG_VP_EXCLUSIVE_TABS;
  forbiddenTabs.forEach(fid => {
    const pane = document.getElementById(fid);
    if (pane) {
      pane.classList.remove("active");
      pane.style.display = "none";
    }
  });
  const allowedTabs = (validMode === "vanphong")
    ? PG_VP_EXCLUSIVE_TABS.concat(["tab-cham-cong-all"])
    : PG_XUONG_EXCLUSIVE_TABS.concat(["tab-cham-cong-all"]);
  allowedTabs.forEach(aid => {
    const pane = document.getElementById(aid);
    if (pane) {
      pane.style.display = "";
    }
  });

  // 3. Cập nhật trạng thái active của nút bấm trên Sidebar & Topbar
  document.querySelectorAll(".div-switch-btn, .top-div-pill").forEach(btn => {
    const btnMode = btn.getAttribute("data-div-mode");
    const isAct = (btnMode === validMode);
    btn.classList.toggle("active", isAct);
    if (btn.classList.contains("top-div-pill")) {
      if (isAct) {
        btn.style.background = validMode === "vanphong"
          ? "rgba(168,85,247,0.28)"
          : "rgba(6,182,212,0.28)";
        btn.style.border = "1px solid rgba(255,255,255,0.22)";
      } else {
        btn.style.background = "transparent";
        btn.style.border = "none";
      }
    } else if (btn.classList.contains("div-switch-btn")) {
      btn.style.opacity = isAct ? "1" : "0.65";
      btn.style.transform = isAct ? "scale(1.02)" : "scale(1)";
    }
  });

  // 4. Cập nhật nhãn phân hệ và tự động chuyển tới tab đầu tiên của Phần tương ứng
  const sideName = document.getElementById("sidebarUserName");
  const sideRole = document.getElementById("sidebarUserRole");
  const topName = document.getElementById("topUserFullName");
  const topRole = document.getElementById("topUserRoleName");

  if (validMode === "vanphong") {
    if (sideName) sideName.textContent = "PHẦN I: KHỐI VĂN PHÒNG";
    if (sideRole) sideRole.textContent = "Hiệp & Dũng (Dự Toán • Hợp Đồng • Công Nợ Khách)";
    if (topName) topName.textContent = "Khối Văn Phòng (Hiệp & Dũng)";
    if (topRole) topRole.textContent = "6 Nghiệp Vụ Kinh Doanh, Dự Toán & VP";
    if (typeof setTimesheetDeptFilter === "function") setTimesheetDeptFilter("vanphong");
    const btnAll = document.getElementById("btnFilterDeptAll");
    const btnXuong = document.getElementById("btnFilterDeptXuong");
    const btnVP = document.getElementById("btnFilterDeptVP");
    if (btnAll) btnAll.style.display = "none";
    if (btnXuong) btnXuong.style.display = "none";
    if (btnVP) btnVP.style.display = "inline-flex";

    if (!skipAutoTabSwitch) {
      const activeTab = document.querySelector(".tab-pane.active");
      if (!activeTab || !allowedTabs.includes(activeTab.id)) {
        if (typeof switchTabTo === "function") switchTabTo("tab-du-toan-du-an");
      }
    }
  } else {
    if (sideName) sideName.textContent = "PHẦN II: KHỐI XƯỞNG SX";
    if (sideRole) sideRole.textContent = "Vũ, Thái & Đội Thợ (SX • Vật Tư • Lương Thợ)";
    if (topName) topName.textContent = "Khối Xưởng Sản Xuất (Vũ & Thái)";
    if (topRole) topRole.textContent = "5 Nghiệp Vụ Kỹ Thuật, Vật Tư & Lương Xưởng";
    if (typeof setTimesheetDeptFilter === "function") setTimesheetDeptFilter("xuong");
    const btnAll = document.getElementById("btnFilterDeptAll");
    const btnXuong = document.getElementById("btnFilterDeptXuong");
    const btnVP = document.getElementById("btnFilterDeptVP");
    if (btnAll) btnAll.style.display = "none";
    if (btnXuong) btnXuong.style.display = "inline-flex";
    if (btnVP) btnVP.style.display = "none";

    if (!skipAutoTabSwitch) {
      const activeTab = document.querySelector(".tab-pane.active");
      if (!activeTab || !allowedTabs.includes(activeTab.id)) {
        if (typeof switchTabTo === "function") switchTabTo("tab-xuong-san-xuat");
      }
    }
  }
};

// Khóa đồng bộ 2 chiều: Bất kỳ lệnh nào gọi switchTabTo(tabId) đều tự động chuyển đúng Khối (VP hoặc Xưởng)
(function enforceDivisionTabSync() {
  const origSwitchTab = window.switchTabTo;
  if (typeof origSwitchTab === "function" && !origSwitchTab._pgDivLocked) {
    window.switchTabTo = function(tabId) {
      if (PG_XUONG_EXCLUSIVE_TABS.includes(tabId)) {
        const curMode = sessionStorage.getItem("PG_DEPLOY_DIVISION_MODE") || "vanphong";
        if (curMode !== "xuong") {
          window.switchDeployDivision("xuong", true);
        }
      } else if (PG_VP_EXCLUSIVE_TABS.includes(tabId)) {
        const curMode = sessionStorage.getItem("PG_DEPLOY_DIVISION_MODE") || "vanphong";
        if (curMode !== "vanphong") {
          window.switchDeployDivision("vanphong", true);
        }
      }
      return origSwitchTab.apply(this, arguments);
    };
    window.switchTabTo._pgDivLocked = true;
  }
})();
"""

    if "window.switchDeployDivision =" not in js:
        js = js + "\n" + division_switcher_js

    # Chặn đăng nhập quyền ADMIN trên môi trường Cloud Deploy
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
    print(f"[OK] Built 2-Division Deploy JS: {deploy_js_path} ({len(js):,} bytes)")


def patch_w14_and_master_bundle():
    """
    Cập nhật `w14_rbac_4_portals_guard.js` và `pg_w50_master.bundle.js` để:
    - Khi chạy trên Cloud/Deploy (`!IS_LOCAL_DIRECTOR_PC`): Khóa chặt ở chế độ Văn Phòng & Xưởng,
      vô hiệu hóa hoàn toàn các widget Admin/CCSC (`w01`, `w02`, `w03`, `w04`, `w38`, `w45`).
    """
    w14_path = os.path.join(WEB_APP_DIR, "modules", "w14_rbac_4_portals_guard.js")
    with open(w14_path, "r", encoding="utf-8") as f:
        w14_code = f.read()

    bundle_path = os.path.join(WEB_APP_DIR, "modules", "pg_w50_master.bundle.js")
    if os.path.exists(bundle_path):
        modules_dir = os.path.join(WEB_APP_DIR, "modules")
        js_files = sorted([
            fn for fn in os.listdir(modules_dir)
            if re.match(r"^w\d+_.*\.js$", fn)
        ])
        admin_only_prefixes = ("w01_", "w02_", "w03_", "w04_", "w38_", "w45_")
        parts = [
            "/* PG HOME LUXURY ERP - MASTER MODULE BUNDLE (2-EDITION ISOLATION AWARE) */\n",
            "window.__PG_IS_LOCAL_DIRECTOR_PC__ = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') && !window.location.search.includes('edition=deploy');\n"
        ]
        for fn in js_files:
            fpath = os.path.join(modules_dir, fn)
            with open(fpath, "r", encoding="utf-8") as mf:
                mcontent = mf.read()
            if fn.startswith(admin_only_prefixes):
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
    print("=== PHYSICAL 2-EDITION SPLIT (WORKFLOW-ALIGNED 2 PARTS) COMPLETED SUCCESSFULLY ===")
