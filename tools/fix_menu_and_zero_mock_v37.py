# -*- coding: utf-8 -*-
"""
fix_menu_and_zero_mock_v37.py
1. Fix Sidebar Menu (#sidebar) in director_ccsc_full.html, styles.css, and w41_luxury_gold_theme_tokens.css:
   - Fix Bug #1 where `.sidebar .brand-logo` was set to 34px x 34px instead of `.sidebar .logo-icon`, crushing the header!
   - Target actual DOM selectors (`.logo-icon`, `.logo-text h2`, `.logo-text .sub`, `.role-badge-box`, `.role-icon`,
     `.role-info .user-name`, `.role-info .user-perm`, `.div-switch-btn`, `.nav-item span`, `.pwa-install-btn`, `.btn-reset`)
     so all 5 sections and 16 nav items fit 100% on 1 screen (820px-880px height) without wrapping or clipping.
   - Fix Bug #3 where clicking `[Quét Zalo Ngay]` or `openDivisionTimesheet` called `switchDeployDivision("xuong", true)`
     even in Admin mode, hiding 11 of the 16 menu items!
2. Restore all hidden UI sections ("các mục") in `styles.css` & `director_app_full.js`:
   - Restore `#liveTelemetryRibbon`, `#pgZeroErrorCommandCenter`, `#btnZeroErrorHubToggle`, `#atelierMaterialShowcase`,
     `.alert-banner`, `.zalo-v4-telemetry-strip`.
   - Keep Topbar action buttons directly visible on `.topbar-right`.
   - Default `optimizePoApprovalTab` to `"all"` and `optimizeVatTuCostTab` to `"all_filters"` so all cards/sections are visible.
   - Raise table collapse `ROW_LIMIT` from 15 to 200 so all table rows are visible by default.
3. Fix `w29_command_palette_ctrl_k.js` tab navigation IDs and purge 100% of remaining mock project/phone strings across
   HTML, JS, W11, W21, W29, W33, JSON state files, and SQLite WAL DB.
"""
import json
import os
import re
import shutil
import sqlite3

ROOT = r"f:\PG Home - Quản trị"
HTML_PATH = os.path.join(ROOT, "local_admin_vault", "director_ccsc_full.html")
JS_PATH = os.path.join(ROOT, "local_admin_vault", "director_app_full.js")
CSS_LOCAL = os.path.join(ROOT, "local_admin_vault", "styles.css")
CSS_WEB = os.path.join(ROOT, "web_app", "styles.css")
W41_LOCAL = os.path.join(ROOT, "local_admin_vault", "modules", "w41_luxury_gold_theme_tokens.css")
W41_WEB = os.path.join(ROOT, "web_app", "modules", "w41_luxury_gold_theme_tokens.css")


def fix_html():
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    orig_len = len(html)

    # Replace any remaining mock names in HTML
    replacements = [
        ("Nhà Anh Trung Tuyết (Trần Phú, TP Hà Tĩnh)", "Bác Sĩ Duẫn (TP. Hà Tĩnh)"),
        ("Anh Trung Tuyết (Trần Phú)", "Bác Sĩ Duẫn (TP. Hà Tĩnh)"),
        ("Anh Trung Tuyết", "Bác Sĩ Duẫn (TP. Hà Tĩnh)"),
        ("Trần Phú, TP Hà Tĩnh (HĐ Tháng 10)", "TP. Hà Tĩnh (Tủ bếp & Nội thất gỗ công nghiệp)"),
        ("Biệt thự Cẩm Xuyên (Anh Hoàn)", "Bác Phát (Đường 26/03 - TP. Hà Tĩnh)"),
        ("(Anh Hoàn)", "(Bác Phát - Đường 26/03)"),
        ("Cẩm Xuyên, Hà Tĩnh (HĐ Tháng 10)", "Đường 26/03 - TP. Hà Tĩnh (Tủ áo & Giường)"),
        ("Shophouse Vinhomes (Anh Minh)", "Nhà Anh Công (Hà Tĩnh)"),
        ("Hàm Nghi, TP Hà Tĩnh (HĐ Tháng 10)", "TP. Hà Tĩnh (Combo Phòng Khách & Bếp)"),
        ("Chị Phượng (Vinhomes)", "Chị Phượng (Nghi Xuân)"),
        ("Chị Hương (Vinhomes)", "Chị Hương (Can Lộc)"),
    ]
    for old_s, new_s in replacements:
        html = html.replace(old_s, new_s)

    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"[OK] Updated {HTML_PATH} ({orig_len} -> {len(html)} bytes)")


SIDEBAR_COMPACT_CSS = """
/* === V37 ULTRA-COMPACT FULL-VIEW SIDEBAR MENU (5 SECTIONS + 16 ITEMS 100% VISIBLE ON 1 SCREEN) === */
.sidebar {
  height: 100vh !important;
  max-height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}
.sidebar .brand-logo {
  width: 100% !important;
  height: auto !important;
  min-height: 44px !important;
  padding: 8px 12px !important;
  gap: 10px !important;
  display: flex !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  border-radius: 0 !important;
}
.sidebar .brand-logo .logo-icon {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  font-size: 0.95rem !important;
  border-radius: 8px !important;
}
.sidebar .brand-logo .logo-text h2 {
  font-size: 0.92rem !important;
  line-height: 1.15 !important;
  margin: 0 !important;
  white-space: nowrap !important;
}
.sidebar .brand-logo .logo-text .sub {
  font-size: 0.60rem !important;
  letter-spacing: 1.2px !important;
  display: block !important;
  white-space: nowrap !important;
}
.sidebar .role-badge-box {
  margin: 4px 10px 3px !important;
  padding: 5px 10px !important;
  border-radius: 7px !important;
  gap: 8px !important;
  flex-shrink: 0 !important;
}
.sidebar .role-badge-box .role-icon {
  width: 26px !important;
  height: 26px !important;
  font-size: 0.80rem !important;
}
.sidebar .role-badge-box .role-info .user-name {
  font-size: 0.74rem !important;
  line-height: 1.15 !important;
  white-space: nowrap !important;
}
.sidebar .role-badge-box .role-info .user-perm {
  font-size: 0.62rem !important;
  line-height: 1.15 !important;
  white-space: nowrap !important;
}
.sidebar #deployDivisionSwitcher {
  padding: 3px 10px !important;
  gap: 4px !important;
  flex-shrink: 0 !important;
}
.sidebar #deployDivisionSwitcher > div:first-child {
  font-size: 0.56rem !important;
  margin-bottom: 2px !important;
}
.sidebar #deployDivisionSwitcher .div-switch-btn,
.sidebar #deployDivisionSwitcher button {
  padding: 3px 5px !important;
  font-size: 0.66rem !important;
  white-space: nowrap !important;
}
.sidebar .pg-sidebar-search-wrap {
  padding: 2px 10px 3px !important;
  flex-shrink: 0 !important;
}
.sidebar .pg-sidebar-search-input {
  padding: 4px 8px !important;
  font-size: 0.72rem !important;
  height: 24px !important;
}
.sidebar .nav-menu,
#mainNavMenu {
  flex: 1 1 auto !important;
  padding: 2px 8px 4px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  scrollbar-width: thin !important;
  scrollbar-color: rgba(212, 168, 83, 0.35) transparent !important;
}
.sidebar .nav-menu::-webkit-scrollbar,
#mainNavMenu::-webkit-scrollbar {
  width: 4px !important;
}
.sidebar .nav-menu::-webkit-scrollbar-thumb,
#mainNavMenu::-webkit-scrollbar-thumb {
  background: rgba(212, 168, 83, 0.35) !important;
  border-radius: 4px !important;
}
.sidebar .nav-section-title,
#mainNavMenu .nav-section-title {
  padding: 4px 8px 1px !important;
  margin-top: 1px !important;
  font-size: 0.60rem !important;
  letter-spacing: 0.7px !important;
  line-height: 1.15 !important;
  white-space: nowrap !important;
}
.sidebar .nav-section-title:first-child,
#mainNavMenu .nav-section-title:first-child {
  padding-top: 2px !important;
  margin-top: 0 !important;
}
.sidebar .nav-item,
#mainNavMenu .nav-item {
  padding: 4px 8px !important;
  min-height: 25px !important;
  margin-bottom: 1px !important;
  font-size: 0.76rem !important;
  line-height: 1.15 !important;
  gap: 7px !important;
  border-radius: 6px !important;
  white-space: nowrap !important;
}
.sidebar .nav-item span:not(.nav-badge),
#mainNavMenu .nav-item span:not(.nav-badge) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.sidebar .nav-item i,
#mainNavMenu .nav-item i {
  width: 15px !important;
  font-size: 0.78rem !important;
  flex-shrink: 0 !important;
}
.sidebar .nav-badge,
#mainNavMenu .nav-badge {
  padding: 1px 5px !important;
  font-size: 0.60rem !important;
  flex-shrink: 0 !important;
}
.sidebar .sidebar-footer {
  padding: 4px 10px 6px !important;
  gap: 4px !important;
  flex-shrink: 0 !important;
}
.sidebar .sidebar-footer .pwa-install-btn,
.sidebar .sidebar-footer .btn-reset {
  padding: 4px 8px !important;
  font-size: 0.70rem !important;
  margin-bottom: 0 !important;
  min-height: 24px !important;
}
.sidebar .sidebar-footer .copyright {
  font-size: 0.58rem !important;
  line-height: 1.15 !important;
}
/* === END V37 ULTRA-COMPACT FULL-VIEW SIDEBAR MENU === */
"""


def update_css_file(path):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        css = f.read()

    # 1. Restore hidden UI sections in styles.css (only hide #pgModalToolTabsBar)
    old_hide_rule = """/* 1. Ẩn triệt để mọi khối mock/ribbon/command center thừa */
#liveTelemetryRibbon,
#pgZeroErrorCommandCenter,
#btnZeroErrorHubToggle,
#atelierMaterialShowcase,
#pgModalToolTabsBar {
  display: none !important;
}"""
    new_hide_rule = """/* 1. Chỉ ẩn thanh công cụ modal trùng lặp (#pgModalToolTabsBar), giữ nguyên 100% các mục giao diện của Giám Đốc */
#pgModalToolTabsBar {
  display: none !important;
}"""
    if old_hide_rule in css:
        css = css.replace(old_hide_rule, new_hide_rule)
        print(f"[OK] Restored visible UI sections in {path}")

    # 2. Replace V37 sidebar CSS block
    css = re.sub(
        r"/\* === V37 ULTRA-COMPACT FULL-VIEW SIDEBAR MENU.*?/\* === END V37 ULTRA-COMPACT FULL-VIEW SIDEBAR MENU === \*/\s*",
        "",
        css,
        flags=re.S,
    )
    css = css.rstrip() + "\n\n" + SIDEBAR_COMPACT_CSS.strip() + "\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(css)
    print(f"[OK] Updated V37 compact sidebar CSS in {path}")


def fix_js():
    with open(JS_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # 1. Bump CURRENT_APP_VERSION
    js = re.sub(
        r'const CURRENT_APP_VERSION = "[^"]+";',
        'const CURRENT_APP_VERSION = "2026.11.14_v38_FULL_MENU_AND_SECTIONS_RESTORED";',
        js,
        count=1,
    )

    # 2. Prevent triggerZaloInstantScan from hiding Admin menu items via switchDeployDivision("xuong", true)
    old_zalo_nav = """  if (navigateIfOutside) {
    if (typeof window.switchDeployDivision === "function") {
      window.switchDeployDivision("xuong", true);
    }"""
    new_zalo_nav = """  if (navigateIfOutside) {
    const curDivMode = sessionStorage.getItem("PG_DEPLOY_DIVISION_MODE") || "admin";
    if (curDivMode !== "admin" && typeof window.switchDeployDivision === "function") {
      window.switchDeployDivision("xuong", true);
    }"""
    if old_zalo_nav in js:
        js = js.replace(old_zalo_nav, new_zalo_nav, 1)
        print("[OK] Fixed triggerZaloInstantScan so it preserves Admin 16-item menu")

    # 3. Prevent openDivisionTimesheet from hiding Admin menu items
    old_ts_nav = """  if (typeof window.openDivisionTimesheet !== "function") {
    window.openDivisionTimesheet = function(dept) {
      const validDept = (dept === "xuong") ? "xuong" : "vanphong";
      if (typeof window.switchDeployDivision === "function") {
        window.switchDeployDivision(validDept, true);
      }"""
    new_ts_nav = """  if (typeof window.openDivisionTimesheet !== "function") {
    window.openDivisionTimesheet = function(dept) {
      const validDept = (dept === "xuong") ? "xuong" : "vanphong";
      const curDivMode = sessionStorage.getItem("PG_DEPLOY_DIVISION_MODE") || "admin";
      if (curDivMode !== "admin" && typeof window.switchDeployDivision === "function") {
        window.switchDeployDivision(validDept, true);
      }"""
    if old_ts_nav in js:
        js = js.replace(old_ts_nav, new_ts_nav, 1)
        print("[OK] Fixed openDivisionTimesheet so it preserves Admin 16-item menu")

    # 4. Keep Topbar buttons directly visible on .topbar-right instead of moving them into hidden moreMenu
    old_topbar_move = """    // Di chuyển các nút phụ vào menu tiện ích để Topbar gọn gàng
    const secondarySelectors = [
      "#btnBossPrivacyBlur",
      "#themeToggleBtn",
      "#btnExportReport",
      "#btnBackupJson",
      'label[for="restoreJsonInput"]'
    ];

    secondarySelectors.forEach(sel => {
      const el = topbarRight.querySelector(sel);
      if (el) {
        moreMenu.appendChild(el);
      }
    });

    moreWrap.appendChild(moreBtn);
    moreWrap.appendChild(moreMenu);

    const logoutBtn = document.getElementById("btnLogoutPortal");
    if (logoutBtn && logoutBtn.parentNode === topbarRight) {
      topbarRight.insertBefore(densityBtn, logoutBtn);
      topbarRight.insertBefore(moreWrap, logoutBtn);
    } else {
      topbarRight.appendChild(densityBtn);
      topbarRight.appendChild(moreWrap);
    }"""

    new_topbar_move = """    // Giữ nguyên 100% các nút công cụ trực tiếp trên Topbar để Giám Đốc bấm 1 chạm
    const logoutBtn = document.getElementById("btnLogoutPortal");
    if (logoutBtn && logoutBtn.parentNode === topbarRight) {
      topbarRight.insertBefore(densityBtn, logoutBtn);
    } else {
      topbarRight.appendChild(densityBtn);
    }"""
    if old_topbar_move in js:
        js = js.replace(old_topbar_move, new_topbar_move, 1)
        print("[OK] Restored all Topbar buttons directly on .topbar-right")

    # 5. Keep Alert Banners & Telemetry Strip visible
    old_banners = """  // 4. Loại bỏ hoàn toàn các khối .alert-banner trang trí không cần thiết theo lệnh Giám Đốc
  function compactAllAlertBanners() {
    const banners = document.querySelectorAll(".alert-banner, .zalo-v4-telemetry-strip");
    banners.forEach(banner => {
      if (banner.id === "timesheetLockBanner") return;
      banner.style.display = "none";
    });
  }

  // 5. Ẩn hẳn Lookbook Vật Liệu trang trí trên Dashboard (#atelierMaterialShowcase) để vào thẳng KPI & Biểu đồ
  function streamlineDashboardShowcase() {
    const showcase = document.getElementById("atelierMaterialShowcase");
    if (showcase) showcase.style.display = "none";
    const toggleBar = document.getElementById("pgShowcaseToggleBar");
    if (toggleBar) toggleBar.style.display = "none";
  }"""

    new_banners = """  // 4. Giữ nguyên hiển thị các thanh thông báo quy chuẩn & Zalo Telemetry Strip
  function compactAllAlertBanners() {
    const banners = document.querySelectorAll(".alert-banner, .zalo-v4-telemetry-strip");
    banners.forEach(banner => {
      banner.style.display = "";
    });
  }

  // 5. Giữ nguyên hiển thị Lookbook Vật Liệu trên Dashboard (#atelierMaterialShowcase)
  function streamlineDashboardShowcase() {
    const showcase = document.getElementById("atelierMaterialShowcase");
    if (showcase) showcase.style.display = "";
  }"""
    if old_banners in js:
        js = js.replace(old_banners, new_banners, 1)
        print("[OK] Restored .alert-banner, .zalo-v4-telemetry-strip, and #atelierMaterialShowcase")

    # 6. Default PO Approval Tab to show all 5 sections ("all") so no PO cards disappear
    old_po_subview_html = """        <button type="button" class="pg-subview-btn active" data-po-subview="po_list" onclick="switchPoTabSubView('po_list')">
          📋 1. Danh Sách PO & Duyệt Dấu Đỏ
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_stats" onclick="switchPoTabSubView('po_stats')">
          📊 2. Thống Kê Đa Chiều (Pivot 3 Chiều)
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_quota40" onclick="switchPoTabSubView('po_quota40')">
          ⚖️ 3. Đối Sánh Thực Đặt vs Khoán 40%
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_workstation" onclick="switchPoTabSubView('po_workstation')">
          ⚡ 4. Bàn Lập Đơn Zalo & 18 Nhóm NCC
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_zalo_inbox" onclick="switchPoTabSubView('po_zalo_inbox')">
          📥 5. Hộp Thư Hóa Đơn Zalo
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="all" onclick="switchPoTabSubView('all')">
          👁️ Hiện Tất Cả
        </button>
      </div>
      <div style="font-size:11px;color:#94a3b8;">
        Mặc định hiển thị gọn <strong>1 bảng Danh Sách PO</strong>
      </div>"""
    new_po_subview_html = """        <button type="button" class="pg-subview-btn active" data-po-subview="all" onclick="switchPoTabSubView('all')">
          👁️ Hiện Tất Cả (5 Phân Khu)
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_list" onclick="switchPoTabSubView('po_list')">
          📋 1. Danh Sách PO & Duyệt Dấu Đỏ
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_stats" onclick="switchPoTabSubView('po_stats')">
          📊 2. Thống Kê Đa Chiều (Pivot 3 Chiều)
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_quota40" onclick="switchPoTabSubView('po_quota40')">
          ⚖️ 3. Đối Sánh Thực Đặt vs Khoán 40%
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_workstation" onclick="switchPoTabSubView('po_workstation')">
          ⚡ 4. Bàn Lập Đơn Zalo & 18 Nhóm NCC
        </button>
        <button type="button" class="pg-subview-btn" data-po-subview="po_zalo_inbox" onclick="switchPoTabSubView('po_zalo_inbox')">
          📥 5. Hộp Thư Hóa Đơn Zalo
        </button>
      </div>
      <div style="font-size:11px;color:#94a3b8;">
        Hiển thị đầy đủ <strong>5 phân khu PO</strong> (bấm từng nút để lọc riêng)
      </div>"""
    if old_po_subview_html in js:
        js = js.replace(old_po_subview_html, new_po_subview_html, 1)

    old_po_default = """    // Mặc định hiển thị phân khu 1: Danh sách PO & Duyệt Dấu Đỏ gọn gàng (1 bảng duy nhất)
    window.switchPoTabSubView("po_list");"""
    new_po_default = """    // Mặc định hiển thị đầy đủ tất cả 5 phân khu PO (có thể bấm từng tab phía trên để lọc riêng)
    window.switchPoTabSubView("all");"""
    if old_po_default in js:
        js = js.replace(old_po_default, new_po_default, 1)
        print("[OK] Set PO Approval Tab default subview to 'all' (all 5 sections visible)")

    # 7. Keep .radio-pill-group visible in VatTu Cost Tab by defaulting to 'all_filters'
    old_vt_hide = """    // Ẩn dải 7 nút lọc cũ bị trùng lặp với 8 thẻ danh mục thông minh (#vtCategorySummaryStrip)
    if (legacyPillGroup) {
      legacyPillGroup.style.display = "none";
      if (legacyFilterLabel && legacyFilterLabel.classList.contains("filter-label")) {
        legacyFilterLabel.style.display = "none";
      }
    }"""
    new_vt_hide = """    // Giữ hiển thị đầy đủ cả dải nút lọc và 8 thẻ danh mục thông minh (#vtCategorySummaryStrip)
    if (legacyPillGroup) {
      legacyPillGroup.style.display = "";
      if (legacyFilterLabel && legacyFilterLabel.classList.contains("filter-label")) {
        legacyFilterLabel.style.display = "";
      }
    }"""
    if old_vt_hide in js:
        js = js.replace(old_vt_hide, new_vt_hide, 1)
        print("[OK] Restored filter pills in #tab-vat-tu-cost")

    # 8. In apply100UiMasterOptimizations: do NOT hide liveTelemetryRibbon, pgZeroErrorCommandCenter, btnZeroErrorHubToggle, atelierMaterialShowcase, and set ROW_LIMIT = 200
    old_ui100 = """    // (A) Ẩn triệt để mọi khối mock/showcase/telemetry thừa từ các module phụ
    const unwantedIds = [
      "liveTelemetryRibbon",
      "pgZeroErrorCommandCenter",
      "btnZeroErrorHubToggle",
      "atelierMaterialShowcase",
      "pgModalToolTabsBar"
    ];
    unwantedIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });"""
    new_ui100 = """    // (A) Chỉ ẩn thanh công cụ modal trùng lặp, giữ nguyên 100% các mục chức năng
    const unwantedIds = [
      "pgModalToolTabsBar"
    ];
    unwantedIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    ["liveTelemetryRibbon", "pgZeroErrorCommandCenter", "btnZeroErrorHubToggle", "atelierMaterialShowcase"].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.style.display === "none") el.style.display = "";
    });"""
    if old_ui100 in js:
        js = js.replace(old_ui100, new_ui100, 1)
        print("[OK] Restored liveTelemetryRibbon, pgZeroErrorCommandCenter, btnZeroErrorHubToggle, atelierMaterialShowcase in JS")

    old_row_limit = "const ROW_LIMIT = 15;"
    new_row_limit = "const ROW_LIMIT = 200;"
    if old_row_limit in js:
        js = js.replace(old_row_limit, new_row_limit, 1)
        print("[OK] Raised table ROW_LIMIT from 15 to 200 so all rows are visible by default")

    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"[OK] Saved {JS_PATH}")


def fix_modules():
    # 1. Fix w29_command_palette_ctrl_k.js
    for base_dir in ("local_admin_vault", "web_app"):
        w29_path = os.path.join(ROOT, base_dir, "modules", "w29_command_palette_ctrl_k.js")
        if not os.path.exists(w29_path):
            continue
        with open(w29_path, "r", encoding="utf-8") as f:
            w29 = f.read()

        # Replace mock FALLBACK_ENTITIES contracts
        old_contracts = """        contracts: [
            { id: 'HD-BACPHAT', title: 'Hợp Đồng: Bác Phát (Biệt Thự Cẩm Xuyên)', customer: 'Bác Phát', phone: '0912.xxx.xxx', value: '425.000.000đ', type: 'Gỗ thịt gõ đỏ + MDF An Cường' },
            { id: 'HD-ANHNAM', title: 'Hợp Đồng: Anh Nam (Chung Cư Vinhomes)', customer: 'Anh Nam', phone: '0988.xxx.xxx', value: '185.000.000đ', type: 'MDF Thái Lan + Acrylic WPB' },
            { id: 'HD-CHILAN', title: 'Hợp Đồng: Chị Lan (Nhà Phố Trần Phú)', customer: 'Chị Lan', phone: '0945.xxx.xxx', value: '310.000.000đ', type: 'Nội thất Full Căn' },
            { id: 'HD-ANHTUAN', title: 'Hợp Đồng: Anh Tuấn (Thạch Hà)', customer: 'Anh Tuấn', phone: '0973.xxx.xxx', value: '95.000.000đ', type: 'Tủ Bếp Acrylic + Tủ Áo' }
        ],"""
        new_contracts = """        contracts: [
            { id: 'HD-BACPHAT', title: 'Hợp Đồng: Bác Phát (Đường 26/03 - TP. Hà Tĩnh)', customer: 'Bác Phát', phone: '0986.722.324', value: '182.890.000đ', type: 'Nội thất gỗ công nghiệp & Tủ bếp' },
            { id: 'HD-ANHNAM', title: 'Hợp Đồng: Anh Nam (Thạch Trung - TP. Hà Tĩnh)', customer: 'Anh Nam', phone: '0986.722.324', value: '253.860.000đ', type: 'Full nội thất MDF Thái Lan + WPB' },
            { id: 'HD-BSDUAN', title: 'Hợp Đồng: Bác Sĩ Duẫn (TP. Hà Tĩnh)', customer: 'Bác Sĩ Duẫn', phone: '0986.722.324', value: '250.340.000đ', type: 'Nội thất Full Căn Cao Cấp' },
            { id: 'HD-ANHCONG', title: 'Hợp Đồng: Nhà Anh Công (Hà Tĩnh)', customer: 'Anh Công', phone: '0986.722.324', value: '215.000.000đ', type: 'Combo Phòng Khách & Tủ Bếp' }
        ],"""
        if old_contracts in w29:
            w29 = w29.replace(old_contracts, new_contracts, 1)

        # Upgrade triggerTabSwitch in w29 to map logical keys to real DOM data-tab IDs and call window.switchTabTo
        old_trigger = """    function triggerTabSwitch(tabKey, candidateSelectors = []) {
        if (typeof window.switchTab === 'function') {"""
        new_trigger = """    const TAB_KEY_MAP = {
        'ccsc': 'tab-ccsc-matrix',
        'tab-ccsc': 'tab-ccsc-matrix',
        'cham_cong': 'tab-cham-cong-all',
        'tab-cham-cong': 'tab-cham-cong-all',
        'bac_phat': 'tab-xuong-san-xuat',
        'tab-project-bac-phat': 'tab-xuong-san-xuat',
        'anh_nam': 'tab-du-toan-du-an',
        'tab-project-anh-nam': 'tab-du-toan-du-an',
        'lam_giang': 'tab-vat-tu-cost',
        'tab-ncc-lam-giang': 'tab-vat-tu-cost',
        'duyet_po': 'tab-phe-duyet-vat-tu',
        'tab-duyet-po': 'tab-phe-duyet-vat-tu',
        'tab-po-approval': 'tab-phe-duyet-vat-tu',
        'zalo_v6': 'tab-phe-duyet-vat-tu',
        'tab-zalo-v6': 'tab-phe-duyet-vat-tu',
        'du_toan': 'tab-du-toan-du-an',
        'tab-du-toan': 'tab-du-toan-du-an',
        'phan_quyen': 'tab-quan-tri-nhan-su',
        'tab-phan-quyen': 'tab-quan-tri-nhan-su'
    };

    function triggerTabSwitch(tabKey, candidateSelectors = []) {
        const resolvedTab = TAB_KEY_MAP[tabKey] || tabKey;
        if (typeof window.switchTabTo === 'function') {
            try { window.switchTabTo(resolvedTab); return true; } catch (e) { console.warn(e); }
        }
        const navEl = document.querySelector(`.nav-item[data-tab="${resolvedTab}"]`);
        if (navEl) {
            navEl.click();
            return true;
        }
        if (typeof window.switchTab === 'function') {"""
        if old_trigger in w29 and "TAB_KEY_MAP" not in w29:
            w29 = w29.replace(old_trigger, new_trigger, 1)

        with open(w29_path, "w", encoding="utf-8") as f:
            f.write(w29)
        print(f"[OK] Updated {w29_path}")

    # 2. Clean remaining mock project names in w11, w21, w33
    module_replacements = {
        "w11_supplier_fitting_glass_stone.js": [
            ("Vinhomes Anh Minh", "Nhà Anh Công"),
        ],
        "w21_quotations_excel_vault.js": [
            ("Anh Trung Tuyết", "Bác Sĩ Duẫn (TP. Hà Tĩnh)"),
            ('"Anh Hoàn"', '"Bác Phát (Đường 26/03)"'),
        ],
        "w33_verified_entities_inspector.js": [
            ("Anh Minh Hồng Lĩnh", "Nhà Anh Công (Hà Tĩnh)"),
        ],
    }
    for mod_name, pairs in module_replacements.items():
        for base_dir in ("local_admin_vault", "web_app"):
            p = os.path.join(ROOT, base_dir, "modules", mod_name)
            if not os.path.exists(p):
                continue
            with open(p, "r", encoding="utf-8") as f:
                txt = f.read()
            for old_s, new_s in pairs:
                txt = txt.replace(old_s, new_s)
            with open(p, "w", encoding="utf-8") as f:
                f.write(txt)
            print(f"[OK] Cleaned mock names in {p}")


SYNTH_KW = [
    "anh trung tuyết",
    "biệt thự cẩm xuyên",
    "shophouse vinhomes",
    "shophouse anh minh",
    "chị hương (vinhomes)",
    "chị phượng (vinhomes)",
    "đường hàm nghi",
    "35 ngô đức kế",
]


def is_synth_obj(item):
    if not isinstance(item, dict):
        return False
    txt = " ".join(str(item.get(k, "")) for k in ("client", "project", "category", "address", "note", "name")).lower()
    return any(kw in txt for kw in SYNTH_KW)


def clean_state_dict(state):
    if not isinstance(state, dict):
        return state, False
    changed = False
    for key in ("xuongRecords", "contracts", "debts", "supplierDebts", "accessories", "materials", "poList"):
        arr = state.get(key)
        if isinstance(arr, list):
            new_arr = [x for x in arr if not is_synth_obj(x)]
            if len(new_arr) != len(arr):
                state[key] = new_arr
                changed = True
    state["appVersion"] = "2026.11.14_v38_FULL_MENU_AND_SECTIONS_RESTORED"
    return state, changed


def clean_persisted_state_files():
    for rel in ("data/pg_home_live_state.json", "data/app_state.json"):
        p = os.path.join(ROOT, rel)
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    st = json.load(f)
                st, changed = clean_state_dict(st)
                with open(p, "w", encoding="utf-8") as f:
                    json.dump(st, f, ensure_ascii=False, indent=2)
                print(f"[OK] Cleaned {rel} (removed_mock={changed})")
            except Exception as e:
                print(f"[WARN] Could not clean {rel}: {e}")

    db_path = os.path.join(ROOT, "data", "pg_home_state_wal.db")
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [r[0] for r in cur.fetchall()]
            for tbl in tables:
                cur.execute(f"PRAGMA table_info({tbl})")
                cols = [c[1] for c in cur.fetchall()]
                if "state_json" in cols:
                    cur.execute(f"SELECT rowid, state_json FROM {tbl}")
                    for rowid, sjson in cur.fetchall():
                        if sjson:
                            try:
                                st = json.loads(sjson)
                                st, _ = clean_state_dict(st)
                                cur.execute(
                                    f"UPDATE {tbl} SET state_json = ? WHERE rowid = ?",
                                    (json.dumps(st, ensure_ascii=False), rowid),
                                )
                            except Exception:
                                pass
                elif "value" in cols and "key" in cols:
                    cur.execute(f"SELECT key, value FROM {tbl}")
                    for k, val in cur.fetchall():
                        if val and isinstance(val, str) and val.strip().startswith("{"):
                            try:
                                st = json.loads(val)
                                st, _ = clean_state_dict(st)
                                cur.execute(
                                    f"UPDATE {tbl} SET value = ? WHERE key = ?",
                                    (json.dumps(st, ensure_ascii=False), k),
                                )
                            except Exception:
                                pass
            conn.commit()
            conn.close()
            print(f"[OK] Cleaned SQLite {db_path} tables={tables}")
        except Exception as e:
            print(f"[WARN] SQLite clean error: {e}")


if __name__ == "__main__":
    fix_html()
    for css_p in (CSS_LOCAL, CSS_WEB, W41_LOCAL, W41_WEB):
        update_css_file(css_p)
    fix_js()
    fix_modules()
    clean_persisted_state_files()
    print("[DONE] fix_menu_and_zero_mock_v37.py completed successfully.")
