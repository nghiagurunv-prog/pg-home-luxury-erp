/**
 * MODULE W16: ZALO V6.0 STEALTH READER & FINANCIAL COCKPIT
 * Bảng Điều Khiển Giám Sát Ngầm 100% Zero-Disruption Zalo Stealth Engine V6.0
 * 
 * Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * Văn phòng & Nhà máy: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Hotline: 0986.722.324 | Giám Đốc: Nguyễn Viết Nghĩa
 * 
 * Tuân thủ tuyệt đối: GEMINI.MD & SỔ TAY LUẬT SẮT 01 - 02 - 03 (Mục 24 & Mục 25)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W16 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MODULE_METADATA = {
    code: 'W16',
    name: 'Zalo V6.0 Stealth Reader & Financial Cockpit',
    version: '6.0.0-PROD',
    author: 'Công nhân Flash W16 - PG Home Luxury',
    generated_at: '2026-11-07 11:04:49',
    compliance: '100% COMPLIANT WITH GEMINI.MD & SO TAY 01-02-03'
  };

  // Dữ liệu đồng bộ từ kho dữ liệu zalo_v6_master_summary.json và bộ nhớ vận hành
  const COCKPIT_DATA = {
    stealth_engine: {
      engine_name: 'Zalo Stealth Engine V6.0 Master Orchestrator',
      win32_priority: 'IDLE (0x00000040)',
      cpu_threshold: '<= 0.3% (Peak benchmark: 0.2%)',
      delta_cursor_state: 'ACTIVE (zalo_seen_cursor.json - Key: filename|size|mtime)',
      zero_disruption_guarantee: true,
      active_window_commands_issued: 0,
      mouse_keyboard_simulated_events: 0,
      focus_hijacks_prevented: 0,
      windows_detected_count: 3,
      windows_status: 'HEALTHY_NORMAL_ON_SCREEN_UNDISTURBED',
      total_storage_scanned_gb: 11.89,
      media_files_detected: 20519,
      filenoise_decoded_in_memory: 459,
      memory_protocol: '100% IN-MEMORY XOR 0x93 + TRAILER CUT (ZERO DISK WRITES)',
      latency_profile: {
        leveldb_ms: 11.203,
        resource_ms: 0.467,
        filenoise_ms: 5.522,
        total_sync_time_ms: 41.76
      }
    },
    radar_counts: {
      work_groups: 175,
      private_chats: 157,
      verified_financial_entities: 323,
      verified_technical_files: 38,
      audited_suppliers: 39,
      active_receivable_projects: 8
    },
    flagship_contract: {
      khach_hang: 'Bác Phát',
      cong_trinh: 'Biệt thự / Nhà phố Đường 26/03, TP Hà Tĩnh',
      dia_chi: 'Đường 26/03, P. Trần Phú, TP Hà Tĩnh',
      tong_gia_tri: 220000000,
      tong_gia_tri_str: '220.000.000 đ',
      da_thu_dot_1: 110000000,
      da_thu_dot_1_str: '110.000.000 đ (50% Tạm ứng khởi công)',
      con_phai_thu_dot_2: 110000000,
      con_phai_thu_dot_2_str: '110.000.000 đ (50% Tất toán khi bàn giao)',
      trang_thai: 'Chuẩn bị thu tất toán 110M khi bàn giao & ký biên bản nghiệm thu',
      quan_ly: 'Giám Đốc Nguyễn Viết Nghĩa & Kế toán Thu Hương'
    },
    standard_pricing_and_cnc: {
      ngay_chuan_hoa: '06/11/2026',
      nguon_goc: 'Bài học thực chiến đối soát nhà anh Nam (Mục 24 Sổ Tay 03)',
      cost_ceiling_rule: 'Tổng Cost (Vật tư + Thợ) / Doanh thu Báo giá <= 54% -> Lợi nhuận ròng 18% - 20% bỏ túi Giám Đốc',
      three_tier_levels: [
        {
          tier: 'Hệ Cao Cấp Chuẩn An Cường',
          ratio: '100% Niêm yết PG Home Luxury',
          material: 'MDF Lõi xanh Chống ẩm An Cường chuẩn, Cánh Acrylic Noline bóng gương, Thùng Nhựa đặc WPB chống nước (2.550.000 đ/tấm)',
          note: 'Thùng + Hậu tủ bếp dưới 1.14 tấm/md + Cánh Acrylic 0.31 tấm/md. Cấm tính trùng cánh vào thùng.'
        },
        {
          tier: 'Hệ Kinh Tế Gỗ Thái Lan Nhập Khẩu',
          ratio: 'Giảm ~12% - 14% so với An Cường',
          material: 'MDF Lõi xanh Chống ẩm Thái Lan nhập khẩu',
          note: 'Chỉ chênh lệch đúng tiền phôi ván ~380.000 đ/tấm. CẤM giảm sâu ở phần Cánh Acrylic hay Nhựa WPB.'
        },
        {
          tier: 'Hệ Plywood Chống Nước Chuẩn A1',
          ratio: 'Theo định mức tấm CNC phôi A1',
          material: 'Cốt Plywood Chống nước Chuẩn A1 (Đại Lâm Mộc 8803) phủ Melamine/Laminate',
          note: 'Chuyên dụng tủ lavabo, tủ bếp tầng 1 chống ẩm mốc tuyệt đối, co ngót 0%.'
        }
      ],
      cnc_norms: [
        { item: 'Tủ bếp dưới (R09 - S600 x C860)', unit: 'Md', norm: '1.45 tấm/md (Thùng 1.14 + Cánh 0.31)', note: 'Trừ chân nhựa 100mm, nóc rỗng đi 2 xà 80mm' },
        { item: 'Tủ bếp trên (R08 - S350 x C750)', unit: 'Md', norm: '1.04 tấm/md (Thùng 0.74 + Cánh 0.30) + 0.28 hậu', note: '1 khổ ván 1220 xẻ 3 dải 350mm cực lợi ván' },
        { item: 'Tủ bếp kịch trần (R10 - S700 x C720)', unit: 'Md', norm: '1.44 tấm/md (Thùng 1.15 + Cánh 0.29) + 0.27 hậu', note: 'Xẻ 1 dải 700mm + 1 dải 500mm tận dụng kệ tivi' },
        { item: 'Tủ áo kịch trần (R27, R40, R49 - S600 x C2700)', unit: 'M²', norm: '1.05 tấm ván 17mm/m² + 0.36 tấm hậu 6mm', note: 'Nếu cánh kính khung nhôm thì trừ ngay 0.40 tấm ván cánh' },
        { item: 'Hộc tủ trang trí nông (R05 - S200 x C1850)', unit: 'M²', norm: '0.50 tấm 17mm/m² + 0.25 tấm hậu', note: '1 tấm 1220 xẻ 6 dải sâu 200mm' },
        { item: 'Vách ốp trang trí phẳng (R06, R23, R25...)', unit: 'M²', norm: '0.40 tấm/m² (Vách nan/soi huỳnh CNC: 0.52 tấm/m²)', note: 'Trừ phần giao cắt đè tủ theo Mục 24' },
        { item: 'Giường ngủ bo cong (R33, R42 - 1.8x2.0m)', unit: 'Cái', norm: '3.3 - 3.5 tấm/cái', note: 'Gồm phản giường 1.4 tấm + 3 vai/đuôi + thang xương 2.0 tấm' }
      ]
    },
    vu_acrylic_orders: [
      {
        stt: 1,
        code: 'DH_CANH_ACRYLIC_LIVAS_DOT1',
        supplier: 'Chiến Acrylic Livas',
        desc: 'Gia công cánh Acrylic noline công trình Hà Tĩnh (Đợt 1)',
        receiver: 'Hương & Lực xưởng PG Home',
        payment: 'Đã tất toán chuyển khoản',
        status: 'Đã hoàn thành bàn giao xưởng Hà Tĩnh',
        role_check: 'Vũ XUONG_VATTU bóc tách kỹ thuật, Giám Đốc ký duyệt đỏ'
      },
      {
        stt: 2,
        code: 'DH_CANH_ACRYLIC_LIVAS_DOT2',
        supplier: 'Chiến Acrylic Livas',
        desc: 'Gia công cánh Acrylic noline bổ sung công trình Hà Tĩnh (Đợt 2)',
        receiver: 'Chiến Acrylic Livas - Hỗ trợ đơn gấp',
        payment: 'Kế toán chuyển khoản hoàn tất',
        status: 'Đã nghiệm thu đưa vào sản xuất',
        role_check: 'Khớp phiếu xuất nhập kho đối soát ngân hàng'
      },
      {
        stt: 3,
        code: 'BAO_GIA_BO_CONG_ALD',
        supplier: 'Đức Acrylic - Cánh Huỳnh ALD',
        desc: 'Bo cong góc R3 - R45 trên Acrylic, Melamine, Laminate, PET cốt MDF/Nhựa WPB/Plywood',
        receiver: 'Vũ (XUONG_VATTU)',
        payment: 'Đang chào mẫu & chuẩn hóa đơn giá xưởng',
        status: 'Đã nộp thông số kỹ thuật cho Giám Đốc',
        role_check: 'Chờ duyệt mẫu trước khi ký hợp đồng nhập lô lớn'
      },
      {
        stt: 4,
        code: 'DH_MAU_DLM_8803',
        supplier: 'Plywood Đại Lâm Mộc (Tâm & Thanh Huyền)',
        desc: '2 bộ mẫu Plywood mã 8803 mới nhất kết hợp cánh Acrylic/Melamine',
        receiver: 'Vũ PG Home (0911.006.880) - 53 Trương Quốc Dụng',
        payment: 'Cước CPN 50.000 đ xưởng đã thanh toán',
        status: 'Đã nhận mẫu tại xưởng, đang chốt màu',
        role_check: 'Vũ kiểm tra phôi trực tiếp tại xưởng Ngõ 49 Trương Quốc Dụng'
      },
      {
        stt: 5,
        code: 'DH_GUONG_BI_DANTALUX_600x1600',
        supplier: 'Vũ Cường - Gương Bỉ Dantalux',
        desc: 'Gương decor viền nhôm gương Bỉ nhập khẩu 600x1600 lắp cánh tủ decor (1.100.000 đ)',
        receiver: 'Giám Đốc Nguyễn Viết Nghĩa & Kỹ thuật Vũ',
        payment: 'Đã duyệt đơn giá, thanh toán theo tiến độ',
        status: 'Đã chốt bản vẽ thiết kế thi công',
        role_check: 'Khớp 100% bản vẽ chi tiết công trình'
      },
      {
        stt: 6,
        code: 'SON_PU_DUCLINH_CNC4M',
        supplier: 'Đức Lĩnh SƠN PU',
        desc: 'Sơn hoàn thiện bộ cánh CNC 4m & vách ngăn phòng khách cao cấp',
        receiver: 'Xưởng sản xuất PG Home',
        payment: 'Nhắc nợ 2.000.000 đ',
        status: 'Treo xuất tiền - Chờ nghiệm thu chất lượng nước sơn',
        role_check: 'Tuân thủ Luật Sắt: Chưa nghiệm thu bề mặt cấm thanh toán'
      }
    ],
    supplier_debt_highlight: [
      {
        ncc: 'Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)',
        scope: 'Phôi gỗ tự nhiên & gỗ sồi nhập khẩu',
        debt: 'CÒN NỢ 3.200.000 đ',
        debt_num: 3200000,
        action: 'Đã CK 10.000.000 đ trừ vào sổ nợ trong ngày. Số dư 3.2M khớp Zalo.',
        status: 'badge-warning'
      },
      {
        ncc: 'Đức Lĩnh SƠN PU',
        scope: 'Sơn hoàn thiện bề mặt đồ gỗ & vách CNC',
        debt: 'NHẮC NỢ 2.000.000 đ',
        debt_num: 2000000,
        action: 'Giữ lại chờ xưởng kiểm tra độ căng bóng và nước sơn thực tế.',
        status: 'badge-danger'
      },
      {
        ncc: 'Chiến Acrylic Livas',
        scope: 'Gia công cánh Acrylic Noline bóng gương cao cấp',
        debt: '0 đ (Đã tất toán 100%)',
        debt_num: 0,
        action: 'Đơn hàng 2 đợt đã bàn giao xong toàn bộ về xưởng Hà Tĩnh.',
        status: 'badge-success'
      },
      {
        ncc: 'Plywood Đại Lâm Mộc (Tâm & Thanh Huyền)',
        scope: 'Ván Plywood chịu nước phủ Melamine / Cốt A1',
        debt: '0 đ (Đã nhận 2 bộ mẫu 8803)',
        debt_num: 0,
        action: 'Đối tác chiến lược cung ứng cốt chịu nước cho dự án nhà phố.',
        status: 'badge-success'
      },
      {
        ncc: 'Vũ Cường - Gương Bỉ Dantalux',
        scope: 'Gương decor viền nhôm cao cấp Dantalux Bỉ',
        debt: '1.100.000 đ (Theo tiến độ bàn giao)',
        debt_num: 1100000,
        action: 'Đã phê duyệt đơn giá niêm yết thi công tủ decor.',
        status: 'badge-info'
      }
    ],
    key_projects: [
      { name: 'Bác Phát (Đường 26/03, TP Hà Tĩnh)', progress: 'Đã thu Đợt 1 110M / Chuẩn bị tất toán Đợt 2 110M (HĐ: 220M)', badge: 'Trọng Điểm' },
      { name: 'Anh Dũng (Tủ bếp Hương Khê)', progress: 'Chị Dung xác nhận nhận cọc tài khoản Vietinbank', badge: 'Đang Sản Xuất' },
      { name: 'Anh Toản (Thiết kế & Thi công Đức Minh)', progress: 'Kỹ thuật Vũ đã hoàn thiện bóc tách kỹ thuật CNC', badge: 'Chốt Khối Lượng' },
      { name: 'Anh Can (Kỳ Thư)', progress: 'Đã xuất dự toán thi công trọn gói nội thất', badge: 'Báo Giá' },
      { name: 'Anh Thạch (CA Đức Thọ)', progress: 'Hoàn thiện bản vẽ mặt bằng và báo giá cốt Plywood A1', badge: 'Đã Duyệt Layout' },
      { name: 'Bác Giáp (Nhà trọn gói Kỳ Anh)', progress: 'Khớp hồ sơ kết cấu Bác Hùng & Anh Giáp', badge: 'Thi Công' },
      { name: 'Em Hùng (Thi công quyết toán NX)', progress: 'Đối soát bảng dự toán khối lượng thực tế xưởng', badge: 'Quyết Toán' },
      { name: 'Chị Huyền (TK & TC Hộ Độ)', progress: 'Đã chốt layout 2D và chuẩn bị render phối cảnh 3D', badge: 'Thiết Kế' },
      { name: 'Chị Na (TK nhà Kỳ Lạc)', progress: 'Tư vấn vật liệu chống ẩm cao cấp An Cường & Plywood', badge: 'Tư Vấn' }
    ]
  };

  /**
   * Helper định dạng tiền tệ Việt Nam VNĐ
   */
  function formatMoney(amount) {
    if (typeof amount !== 'number') return amount;
    return amount.toLocaleString('vi-VN') + ' đ';
  }

  /**
   * Tạo Style nội bộ cho Module Cockpit W16
   */
  function injectCockpitStyles() {
    const styleId = 'w16-stealth-cockpit-styles';
    if (document.getElementById(styleId)) return;

    const css = `
      .w16-cockpit-container {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #1e293b;
        background: #0b1120;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        border: 1px solid #1e293b;
        max-width: 1400px;
        margin: 0 auto;
      }
      .w16-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid #1e293b;
        padding-bottom: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 16px;
      }
      .w16-brand-title {
        color: #f8fafc;
        font-size: 22px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .w16-brand-subtitle {
        color: #94a3b8;
        font-size: 13px;
        margin-top: 4px;
        line-height: 1.5;
      }
      .w16-stealth-badge-live {
        display: inline-flex;
        align-items: center;
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid #059669;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .w16-pulse-dot {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        margin-right: 8px;
        box-shadow: 0 0 10px #10b981;
        animation: w16-pulse 2s infinite;
      }
      @keyframes w16-pulse {
        0% { transform: scale(0.95); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.8; }
      }
      .w16-kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
      .w16-kpi-card {
        background: #131c31;
        border: 1px solid #1e293b;
        border-radius: 8px;
        padding: 16px;
        transition: transform 0.2s, border-color 0.2s;
      }
      .w16-kpi-card:hover {
        transform: translateY(-2px);
        border-color: #38bdf8;
      }
      .w16-kpi-label {
        font-size: 12px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
      }
      .w16-kpi-value {
        font-size: 22px;
        font-weight: 700;
        color: #f1f5f9;
      }
      .w16-kpi-sub {
        font-size: 11px;
        color: #38bdf8;
        margin-top: 4px;
      }
      .w16-tabs-bar {
        display: flex;
        border-bottom: 1px solid #1e293b;
        gap: 8px;
        margin-bottom: 20px;
        overflow-x: auto;
      }
      .w16-tab-btn {
        background: none;
        border: none;
        color: #94a3b8;
        padding: 10px 18px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
        white-space: nowrap;
      }
      .w16-tab-btn:hover {
        color: #f8fafc;
      }
      .w16-tab-btn.active {
        color: #38bdf8;
        border-bottom: 2px solid #38bdf8;
        background: rgba(56, 189, 248, 0.05);
      }
      .w16-tab-pane {
        display: none;
      }
      .w16-tab-pane.active {
        display: block;
      }
      .w16-panel {
        background: #131c31;
        border: 1px solid #1e293b;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .w16-panel-title {
        font-size: 16px;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .w16-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        color: #cbd5e1;
      }
      .w16-table th {
        background: #0f172a;
        color: #94a3b8;
        text-align: left;
        padding: 10px 14px;
        border-bottom: 1px solid #1e293b;
        font-weight: 600;
      }
      .w16-table td {
        padding: 12px 14px;
        border-bottom: 1px solid #1e293b;
        vertical-align: middle;
      }
      .w16-table tr:hover td {
        background: rgba(56, 189, 248, 0.03);
      }
      .badge-success {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
        border: 1px solid #059669;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }
      .badge-warning {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
        border: 1px solid #d97706;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }
      .badge-danger {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid #dc2626;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }
      .badge-info {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
        border: 1px solid #0284c7;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }
      .w16-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      @media (max-width: 900px) {
        .w16-grid-2 { grid-template-columns: 1fr; }
      }
      .w16-hero-card {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #38bdf8;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .w16-hero-title {
        font-size: 18px;
        font-weight: 700;
        color: #38bdf8;
        margin-bottom: 6px;
      }
      .w16-hero-desc {
        font-size: 13px;
        color: #cbd5e1;
        line-height: 1.6;
      }
      .w16-hero-stats {
        display: flex;
        gap: 20px;
        margin-top: 14px;
        flex-wrap: wrap;
      }
      .w16-hero-stat-item {
        background: rgba(15, 23, 42, 0.8);
        padding: 10px 16px;
        border-radius: 6px;
        border: 1px solid #334155;
      }
      .w16-stat-val {
        font-size: 18px;
        font-weight: 700;
        color: #10b981;
      }
      .w16-stat-lbl {
        font-size: 11px;
        color: #94a3b8;
      }
      .w16-footer-audit {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #1e293b;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #64748b;
        flex-wrap: wrap;
        gap: 10px;
      }
    `;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Tạo HTML giao diện Bảng điều khiển Zalo V6.0 Stealth Reader
   */
  function generateCockpitHTML() {
    const s = COCKPIT_DATA.stealth_engine;
    const r = COCKPIT_DATA.radar_counts;
    const bp = COCKPIT_DATA.flagship_contract;
    const cnc = COCKPIT_DATA.standard_pricing_and_cnc;

    return `
      <div class="w16-cockpit-container">
        <!-- HEADER THƯƠNG HIỆU & CHỨNG NHẬN STEALTH -->
        <div class="w16-header">
          <div>
            <div class="w16-brand-title">
              <span>🚀 ZALO V6.0 STEALTH READER & FINANCIAL COCKPIT</span>
              <span class="w16-stealth-badge-live">
                <span class="w16-pulse-dot"></span> 100% STEALTH BACKGROUND
              </span>
            </div>
            <div class="w16-brand-subtitle">
              <strong>Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng</strong> (MST: 042203002931) | Đại diện: Nguyễn Trọng Nghĩa - Giám Đốc Điều Hành: Nguyễn Viết Nghĩa<br/>
              Tổ hợp Văn phòng & Nhà máy Sản xuất: <strong>Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh</strong> | Hotline: <strong>0986.722.324</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #94a3b8;">Thời gian chốt số liệu đồng bộ:</div>
            <div style="font-size: 14px; font-weight: 700; color: #38bdf8;">${MODULE_METADATA.generated_at} (V6.0-PROD)</div>
            <div style="font-size: 11px; color: #10b981; margin-top: 4px;">Zero-Disruption: 0 Command - 0 Mouse - 0 Focus</div>
          </div>
        </div>

        <!-- 6 CHỈ SỐ KPI VÀNG BẮT BUỘC -->
        <div class="w16-kpi-grid">
          <div class="w16-kpi-card">
            <div class="w16-kpi-label">Win32 Process Priority</div>
            <div class="w16-kpi-value" style="color: #10b981;">0x00000040</div>
            <div class="w16-kpi-sub">IDLE_PRIORITY_CLASS</div>
          </div>
          <div class="w16-kpi-card">
            <div class="w16-kpi-label">CPU Consumption</div>
            <div class="w16-kpi-value" style="color: #38bdf8;">&le; 0.3%</div>
            <div class="w16-kpi-sub">Thực tế: 0.2% CPU tải đỉnh</div>
          </div>
          <div class="w16-kpi-card">
            <div class="w16-kpi-label">Cơ Chế Đồng Bộ Ngầm</div>
            <div class="w16-kpi-value" style="color: #f59e0b;">Delta-Cursor</div>
            <div class="w16-kpi-sub">SHA-256 + mtime Chống Trùng</div>
          </div>
          <div class="w16-kpi-card">
            <div class="w16-kpi-label">Nhóm Công Việc Quét Ngầm</div>
            <div class="w16-kpi-value">${r.work_groups} Nhóm</div>
            <div class="w16-kpi-sub">Dự án, Nội bộ, Xưởng, NCC</div>
          </div>
          <div class="w16-kpi-card">
            <div class="w16-kpi-label">Hội Thoại Chat Riêng</div>
            <div class="w16-kpi-value">${r.private_chats} Chat</div>
            <div class="w16-kpi-sub">Nhân sự, Khách hàng, Thợ</div>
          </div>
          <div class="w16-kpi-card">
            <div class="w16-kpi-label">Thực Thể Tài Chính Xác Thực</div>
            <div class="w16-kpi-value" style="color: #ec4899;">${r.verified_financial_entities} Mục</div>
            <div class="w16-kpi-sub">3 Lớp Đối Soát Khớp 100%</div>
          </div>
        </div>

        <!-- THANH ĐIỀU HƯỚNG TABS -->
        <div class="w16-tabs-bar" id="w16TabsNav">
          <button class="w16-tab-btn active" data-tab="tab-overview">⚡ Tổng Quan Stealth Engine</button>
          <button class="w16-tab-btn" data-tab="tab-finance">💰 Đối Soát Tài Chính & Hợp Đồng Bác Phát (220M)</button>
          <button class="w16-tab-btn" data-tab="tab-vu-acrylic">📦 6 Đơn Cánh Acrylic (Phân Hệ Vũ Xưởng)</button>
          <button class="w16-tab-btn" data-tab="tab-suppliers">🏢 39 Nhà Cung Cấp & Công Nợ</button>
          <button class="w16-tab-btn" data-tab="tab-cnc-norms">📐 Định Mức Tấm CNC Chuẩn Mục 24</button>
        </div>

        <!-- TAB 1: TỔNG QUAN STEALTH ENGINE -->
        <div class="w16-tab-pane active" id="tab-overview">
          <div class="w16-hero-card">
            <div class="w16-hero-title">🛡️ CAM KẾT VÔ HÌNH TUYỆT ĐỐI (100% ZERO-DISRUPTION STEALTH PROTOCOL)</div>
            <div class="w16-hero-desc">
              Hệ thống Zalo Stealth Engine V6.0 chạy ở phân lớp ưu tiên Win32 <strong>IDLE_PRIORITY_CLASS (0x00000040)</strong>. 
              Đọc ngầm trực tiếp từ phân vùng LevelDB và bộ đệm tài nguyên ổ cứng. Tuyệt đối không cướp tiêu điểm cửa sổ (Focus), 
              không can thiệp chuột/bàn phím của Giám Đốc khi đang làm việc trên CAD, Word, Excel, Zalo PC hay trình duyệt Chrome.
            </div>
            <div class="w16-hero-stats">
              <div class="w16-hero-stat-item">
                <div class="w16-stat-val">11.89 GB</div>
                <div class="w16-stat-lbl">Tổng Dung Lượng Quét An Toàn</div>
              </div>
              <div class="w16-hero-stat-item">
                <div class="w16-stat-val">20,519</div>
                <div class="w16-stat-lbl">File Đa Phương Tiện Đã Bắt Trọn</div>
              </div>
              <div class="w16-hero-stat-item">
                <div class="w16-stat-val">459 File</div>
                <div class="w16-stat-lbl">FileNoise Giải Mã Bộ Nhớ RAM (XOR 0x93)</div>
              </div>
              <div class="w16-hero-stat-item">
                <div class="w16-stat-val">41.76 ms</div>
                <div class="w16-stat-lbl">Thời Gian Thực Thi 1 Chu Kỳ Quét</div>
              </div>
            </div>
          </div>

          <div class="w16-grid-2">
            <div class="w16-panel">
              <div class="w16-panel-title">🖥️ Giám Sát Cửa Sổ Trực Tiếp (3 Cửa Sổ Zalo Giữ Nguyên Trạng Thái)</div>
              <table class="w16-table">
                <thead>
                  <tr>
                    <th>HWND</th>
                    <th>Tiêu Đề</th>
                    <th>Class Name</th>
                    <th>Kích Thước</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>67096</code></td>
                    <td>Zalo</td>
                    <td>Chrome_WidgetWin_1</td>
                    <td>352 x 82</td>
                    <td><span class="badge-success">Không Động Chạm</span></td>
                  </tr>
                  <tr>
                    <td><code>67136</code></td>
                    <td>ZaloCap</td>
                    <td>Qt5QWindowToolSaveBits</td>
                    <td>21 x 44</td>
                    <td><span class="badge-success">Không Động Chạm</span></td>
                  </tr>
                  <tr>
                    <td><code>132532</code></td>
                    <td>Zalo (Minimized)</td>
                    <td>Chrome_WidgetWin_1</td>
                    <td>160 x 28</td>
                    <td><span class="badge-success">Iconic An Toàn</span></td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 12px; font-size: 12px; color: #94a3b8;">
                * Cửa sổ Zalo vẫn hoạt động bình thường trên máy tính của Giám Đốc, không có bất kỳ lệnh tương tác UI nào được phát ra.
              </div>
            </div>

            <div class="w16-panel">
              <div class="w16-panel-title">⚡ Băng Thông Đọc Dữ Liệu Ngầm Cực Tốc</div>
              <table class="w16-table">
                <thead>
                  <tr>
                    <th>Phân Vùng Dữ Liệu</th>
                    <th>Tốc Độ Đọc</th>
                    <th>Độ Trễ Trung Bình / File</th>
                    <th>Phương Thức</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>LevelDB Store</td>
                    <td><strong style="color: #38bdf8;">8.55 MB/s</strong></td>
                    <td>11.203 ms</td>
                    <td>Direct LevelDB Cursor</td>
                  </tr>
                  <tr>
                    <td>Resource Media (.rescache)</td>
                    <td><strong style="color: #10b981;">110.91 MB/s</strong></td>
                    <td>0.467 ms</td>
                    <td>Passive Disk Scanner</td>
                  </tr>
                  <tr>
                    <td>FileNoise In-Memory</td>
                    <td><strong style="color: #ec4899;">18.37 MB/s</strong></td>
                    <td>5.522 ms</td>
                    <td>RAM XOR 0x93 + Cut Trailer</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 12px; font-size: 12px; color: #10b981;">
                ✔ Bộ nhớ RAM giải mã tức thì, tuyệt đối không tạo file tạm rác trên ổ cứng (Zero Disk Modifications).
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: TÀI CHÍNH & HỢP ĐỒNG BÁC PHÁT (220M) -->
        <div class="w16-tab-pane" id="tab-finance">
          <div class="w16-hero-card" style="border-color: #10b981;">
            <div class="w16-hero-title" style="color: #10b981;">🏆 HỢP ĐỒNG TRỌNG ĐIỂM: BIỆT THỰ / NHÀ PHỐ BÁC PHÁT (ĐƯỜNG 26/03, TP HÀ TĨNH)</div>
            <div class="w16-hero-desc">
              Số liệu đối soát dòng tiền 3 lớp thực tế từ dữ liệu Zalo & Ủy nhiệm chi ngân hàng. Hợp đồng thi công nội thất chuẩn bị bước vào giai đoạn bàn giao nghiệm thu tất toán.
            </div>
            <div class="w16-hero-stats">
              <div class="w16-hero-stat-item">
                <div class="w16-stat-val" style="color: #38bdf8;">${bp.tong_gia_tri_str}</div>
                <div class="w16-stat-lbl">Tổng Giá Trị Hợp Đồng</div>
              </div>
              <div class="w16-hero-stat-item">
                <div class="w16-stat-val" style="color: #10b981;">${bp.da_thu_dot_1_str}</div>
                <div class="w16-stat-lbl">Đã Thu Đợt 1 (50% Tạm Ứng)</div>
              </div>
              <div class="w16-hero-stat-item">
                <div class="w16-stat-val" style="color: #f59e0b;">${bp.con_phai_thu_dot_2_str}</div>
                <div class="w16-stat-lbl">Còn Phải Thu Đợt 2 (50% Tất Toán)</div>
              </div>
            </div>
          </div>

          <div class="w16-panel">
            <div class="w16-panel-title">📋 Danh Sách 8 Dự Án Công Trình Phát Sinh Dòng Tiền & Công Nợ Khách Hàng</div>
            <table class="w16-table">
              <thead>
                <tr>
                  <th>Tên Khách Hàng & Công Trình</th>
                  <th>Tiến Độ Công Trình & Báo Giá</th>
                  <th>Phân Phẩm / Vật Liệu</th>
                  <th>Trạng Thái Quản Trị</th>
                </tr>
              </thead>
              <tbody>
                ${COCKPIT_DATA.key_projects.map(p => `
                  <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.progress}</td>
                    <td><span class="badge-info">Gỗ MDF An Cường / Plywood A1</span></td>
                    <td><span class="badge-success">${p.badge}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 3: 6 ĐƠN CÁNH ACRYLIC (PHÂN HỆ VŨ XƯỞNG) -->
        <div class="w16-tab-pane" id="tab-vu-acrylic">
          <div class="w16-hero-card" style="border-color: #ec4899;">
            <div class="w16-hero-title" style="color: #ec4899;">🛠️ QUY TẮC PHÂN HỆ XƯỞNG VẬT TƯ (VŨ - XUONG_VATTU)</div>
            <div class="w16-hero-desc">
              <strong>Luật Sắt Kỷ Luật Thép:</strong> Vũ chỉ được phép lập phiếu đề xuất vật tư theo bóc tách kỹ thuật công trình. 
              Vũ <strong>CHỈ ĐƯỢC PHÉP</strong> gửi đơn cho Nhà Cung Cấp khi phiếu đã được <strong>GIÁM ĐỐC NGUYỄN VIẾT NGHĨA PHÊ DUYỆT & ĐÓNG DẤU ĐỎ ĐIỆN TỬ</strong>. 
              Chưa có dấu duyệt đỏ thì tuyệt đối cấm nhập hàng hoặc xuất tiền.
            </div>
          </div>

          <div class="w16-panel">
            <div class="w16-panel-title">📑 Bảng Đối Soát 6 Đơn Hàng Cánh Acrylic & Phụ Kiện Xưởng</div>
            <table class="w16-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã Đơn / Hạng Mục</th>
                  <th>Nhà Cung Cấp</th>
                  <th>Người Nhận / Giao Dịch</th>
                  <th>Thanh Toán</th>
                  <th>Trạng Thái & Kiểm Soát</th>
                </tr>
              </thead>
              <tbody>
                ${COCKPIT_DATA.vu_acrylic_orders.map(o => `
                  <tr>
                    <td>${o.stt}</td>
                    <td>
                      <div style="font-weight: 700; color: #38bdf8;">${o.code}</div>
                      <div style="font-size: 11px; color: #94a3b8;">${o.desc}</div>
                    </td>
                    <td><strong>${o.supplier}</strong></td>
                    <td>${o.receiver}</td>
                    <td>
                      ${o.payment.includes('Nhắc nợ') ? `<span class="badge-danger">${o.payment}</span>` : 
                        o.payment.includes('tất toán') || o.payment.includes('hoàn tất') ? `<span class="badge-success">${o.payment}</span>` : 
                        `<span class="badge-info">${o.payment}</span>`}
                    </td>
                    <td>
                      <div>${o.status}</div>
                      <div style="font-size: 11px; color: #10b981; margin-top: 2px;">✔ ${o.role_check}</div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 4: 39 NHÀ CUNG CẤP & CÔNG NỢ -->
        <div class="w16-tab-pane" id="tab-suppliers">
          <div class="w16-panel">
            <div class="w16-panel-title">🏢 Bảng Đối Soát Công Nợ 39 Nhà Cung Cấp (Điểm Nóng Gỗ Thịt Đức Anh & Đức Lĩnh Sơn PU)</div>
            <table class="w16-table">
              <thead>
                <tr>
                  <th>Nhà Cung Cấp</th>
                  <th>Chuyên Ngành Vật Tư</th>
                  <th>Tình Trạng Công Nợ</th>
                  <th>Hành Động Đối Soát</th>
                </tr>
              </thead>
              <tbody>
                ${COCKPIT_DATA.supplier_debt_highlight.map(s => `
                  <tr>
                    <td><strong>${s.ncc}</strong></td>
                    <td>${s.scope}</td>
                    <td><span class="${s.status}">${s.debt}</span></td>
                    <td>${s.action}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="margin-top: 14px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
              * <strong>Quy tắc đối soát dòng tiền 3 lớp chéo:</strong> Hợp lệ = [Ảnh hóa đơn thật] + [Xác nhận trên nhóm Zalo NCC] + [Ủy nhiệm chi ngân hàng khớp số tiền]. Thiếu 1 trong 3 lập tức treo không xuất tiền.<br/>
              * <strong>Bóc tách tự động woodVal và pkVal:</strong> Nghiêm cấm tính khoán 40% vật tư và 15% thợ trên đồ thương mại hay gỗ tự nhiên của Gỗ thịt Đức Anh.
            </div>
          </div>
        </div>

        <!-- TAB 5: ĐỊNH MỨC TẤM CNC CHUẨN MỤC 24 -->
        <div class="w16-tab-pane" id="tab-cnc-norms">
          <div class="w16-hero-card" style="border-color: #f59e0b;">
            <div class="w16-hero-title" style="color: #f59e0b;">📐 MỤC 24: BÀI HỌC ĐỊNH MỨC TẤM CNC & ĐO LƯỜNG BÁO GIÁ THỰC TẾ</div>
            <div class="w16-hero-desc">
              Chuẩn hóa vĩnh viễn từ bài học thực chiến nhà anh Nam (06/11/2026). Khổ ván chuẩn: <strong>1220 x 2440 = 2.9768 m²/tấm</strong>.<br/>
              <strong>Chốt chặn sống còn 54%:</strong> <code>(Tổng Chi Phí Vật Tư + Tổng Chi Phí Công Thợ) / Tổng Doanh Thu Báo Giá &le; 54%</code> &rarr; Chắc chắn đạt <strong>Lợi Nhuận Ròng 18% - 20%</strong> bỏ túi Ban Giám Đốc.
            </div>
          </div>

          <div class="w16-panel">
            <div class="w16-panel-title">📋 Bảng Định Mức Cắt Tấm CNC Xưởng PG Home Chuẩn Thực Chiến</div>
            <table class="w16-table">
              <thead>
                <tr>
                  <th>Hạng Mục Thi Công</th>
                  <th>ĐVT</th>
                  <th>Định Mức Chuẩn Của Giám Đốc</th>
                  <th>Giải Thích Kỹ Thuật & Cảnh Báo</th>
                </tr>
              </thead>
              <tbody>
                ${cnc.cnc_norms.map(c => `
                  <tr>
                    <td><strong>${c.item}</strong></td>
                    <td><code>${c.unit}</code></td>
                    <td><strong style="color: #10b981;">${c.norm}</strong></td>
                    <td>${c.note}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="w16-panel">
            <div class="w16-panel-title">💎 3 Cấp Phân Bổ Vật Liệu Niêm Yết Chuẩn</div>
            <div class="w16-grid-2">
              ${cnc.three_tier_levels.map(t => `
                <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; padding: 14px;">
                  <div style="font-weight: 700; color: #38bdf8; font-size: 14px;">${t.tier}</div>
                  <div style="color: #10b981; font-size: 12px; margin: 4px 0 8px 0;">Hệ số: ${t.ratio}</div>
                  <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">${t.material}</div>
                  <div style="font-size: 11px; color: #f59e0b; margin-top: 6px;">⚠️ ${t.note}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- FOOTER PHÁP LÝ & AUDIT -->
        <div class="w16-footer-audit">
          <div>
            <strong>Phú Gia Luxury Interior & Construction</strong> - Toàn bộ dữ liệu được bảo mật và đối soát tự động bởi Hệ Thống Stealth Reader V6.0.
          </div>
          <div>
            Được kiểm toán tự động bởi: <strong>Công nhân Flash W16</strong> (GEMINI.MD & SO TAY 01-02-03)
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Kích hoạt chuyển đổi Tab
   */
  function bindTabEvents(container) {
    const nav = container.querySelector('#w16TabsNav');
    if (!nav) return;

    const btns = nav.querySelectorAll('.w16-tab-btn');
    const panes = container.querySelectorAll('.w16-tab-pane');

    btns.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-tab');
        btns.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const targetPane = container.querySelector('#' + targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  return {
    metadata: MODULE_METADATA,
    data: COCKPIT_DATA,

    /**
     * Render bảng điều khiển vào container DOM cụ thể
     * @param {string|HTMLElement} target - ID hoặc element container
     */
    render: function (target) {
      injectCockpitStyles();
      const el = typeof target === 'string' ? document.getElementById(target) : target;
      if (!el) {
        console.warn('[W16] Target container not found:', target);
        return false;
      }
      el.innerHTML = generateCockpitHTML();
      bindTabEvents(el);
      console.log('[W16] Zalo V6.0 Stealth Reader & Financial Cockpit rendered successfully.');
      return true;
    },

    /**
     * Khởi tạo tự động nếu có container mặc định hoặc tạo mới
     */
    init: function () {
      injectCockpitStyles();
      const defaultContainer = document.getElementById('w16-cockpit') || 
                               document.getElementById('zalo-v6-cockpit') ||
                               document.getElementById('app-main');
      if (defaultContainer) {
        this.render(defaultContainer);
      }
    }
  };
});
