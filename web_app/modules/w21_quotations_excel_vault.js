/**
 * ==============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT PG HOME LUXURY - CÔNG NHÂN FLASH W21
 * MODULE: KHO DỰ TOÁN & BÁO GIÁ EXCEL ZALO (QUOTATIONS EXCEL VAULT)
 * CHỐT CHẶN KIỂM SOÁT COST <= 54% THEO MỤC 24 GEMINI.md & HIẾN PHÁP PHÚ GIA
 * File: f:\PG Home - Quản trị\web_app\modules\w21_quotations_excel_vault.js
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W21 = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --- 1. DỮ LIỆU BÓC TÁCH TỪ ZALO EXCEL AUDIT (zalo_excel_quotations_audit.json) ---
  const AUDIT_METADATA = {
    title: "Kho Dự Toán & Báo Giá Excel Zalo - PG Home Luxury",
    scanned_total: 166,
    quotations_count: 86,
    ntd_orders_count: 19,
    contracts_count: 23,
    audit_date: "2026-11-07T10:49:50",
    cost_threshold_target: 54.0, // Chốt chặn tối thượng: Cost <= 54%
    legal_name: "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
    legal_mst: "042203002931",
    office_address: "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
    hotline: "0973.562.789"
  };

  // Danh mục định mức tấm CNC chuẩn thực chiến Mục 24 GEMINI.md (Khổ ván 1220x2440)
  const CNC_NORMS_CATALOG = [
    {
      code: "R09",
      name: "Tủ bếp dưới (Sâu 600 x Cao 860, Thùng 740)",
      unit: "Md",
      norm_sheet: 1.45,
      note: "Trừ chân nhựa 100mm, đá 20mm, nóc hở đi 2 thanh xà 80mm. Nếu tách Acrylic: Thùng+Hậu=1.14 tấm, Cánh=0.31 tấm.",
      formula: "Md x 1.45 tấm (VD: 3.77 md x 1.45 = 5.47 ≈ 5.5 tấm)"
    },
    {
      code: "R08",
      name: "Tủ bếp trên (Sâu 350 x Cao 750)",
      unit: "Md",
      norm_sheet: 1.04,
      note: "Thùng 0.74 tấm/md + Cánh 0.30 tấm/md + Hậu 6mm 0.28 tấm/md. Sâu 350mm xẻ 3 dải rất lợi ván.",
      formula: "Md x 1.04 tấm (Thùng+Cánh) + 0.28 tấm Hậu"
    },
    {
      code: "R10",
      name: "Tủ bếp kịch trần (Sâu 700 x Cao 720)",
      unit: "Md",
      norm_sheet: 1.44,
      note: "Thùng 1.15 tấm/md + Cánh 0.29 tấm/md + Hậu 0.27 tấm/md. 1 khổ ván xẻ 1 dải 700mm + 1 dải 500mm.",
      formula: "Md x 1.44 tấm (Thùng+Cánh) + 0.27 tấm Hậu"
    },
    {
      code: "R27",
      name: "Tủ quần áo kịch trần (Sâu 600 x Cao 2700)",
      unit: "M²",
      norm_sheet: 1.05,
      note: "Thùng + Đợt + Hộc kéo + Cánh gỗ = 1.05 tấm/m² + Hậu 0.36 tấm/m². Nếu cánh kính nhôm: TRỪ 0.40 tấm/m² cánh.",
      formula: "M² x 1.05 tấm ván 17mm + 0.36 tấm Hậu 6mm"
    },
    {
      code: "R05",
      name: "Hộc tủ trang trí nông (Sâu 200 x Cao 1850)",
      unit: "M²",
      norm_sheet: 0.50,
      note: "Xẻ 6 dải sâu 200mm trên 1 khổ ván 1220. Hậu 6mm = 0.25 tấm/m².",
      formula: "M² x 0.50 tấm ván 17mm + 0.25 tấm Hậu"
    },
    {
      code: "R06",
      name: "Vách ốp phẳng trang trí (Dày 17mm)",
      unit: "M²",
      norm_sheet: 0.40,
      note: "Trừ hao hụt ghép vân & xương lót 15% (2.50 m² thành phẩm / tấm). Vách lam soi huỳnh: 0.52 tấm/m².",
      formula: "M² x 0.40 tấm/m² (Vách phẳng) hoặc 0.52 tấm/m² (Lam CNC)"
    },
    {
      code: "R33",
      name: "Giường ngủ bo cong không đầu giường (1.6x2m / 1.8x2m)",
      unit: "Cái",
      norm_sheet: 3.40,
      note: "Phản giường 2 tấm (1.4 tấm) + 3 vai/đuôi bo cong chập đôi + hệ xương/thang chịu lực (2.0 tấm).",
      formula: "3.3 - 3.5 tấm ván 17mm / cái"
    },
    {
      code: "R04",
      name: "Kệ Tivi / Bàn học / Bàn phấn treo bo góc",
      unit: "Md",
      norm_sheet: 0.60,
      note: "Sâu 400-550 x Cao 150-300: 0.55 - 0.65 tấm ván 17mm/md + 0.15 tấm hậu/đáy ngăn kéo.",
      formula: "Md x 0.60 tấm ván 17mm + 0.15 tấm Hậu"
    }
  ];

  // Danh sách các báo giá tiêu biểu bóc tách trực tiếp từ Zalo Excel Audit
  const RAW_QUOTATIONS_DATA = [
    {
      file_id: "fa552d1e7b482a374cab2d4d5e450f81",
      datetime: "2026-11-06 09:43:23",
      customer: "Anh Nam",
      project: "Biệt thự nhà anh Nam (Chuẩn hóa Mục 24 GEMINI.md)",
      total_amount: 314797000.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "MDF An Cường",
      thai_lan_alt: 284360000.0,
      rooms: ["Phòng khách", "Phòng bếp", "WC T1", "Ngủ Master", "Ngủ con gái", "Ngủ con trai", "Phòng thờ", "Giặt là", "Phụ kiện bếp", "Đèn LED"],
      items_count: 68,
      wood_cost_pct: 36.5,
      labor_cost_pct: 13.8,
      hardware_cost_pct: 2.2,
      note: "Báo giá chuẩn hóa đối soát thực chiến 06/11/2026. Tủ bếp dưới 3.77 md = 5.5 tấm CNC."
    },
    {
      file_id: "4de4b56a5d28798b24f27e910e90dd73",
      datetime: "2026-11-05 16:18:40",
      customer: "Anh Nam (Phương án tối ưu)",
      project: "Biệt thự nhà anh Nam",
      total_amount: 255779500.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF An Cường / Thái Lan",
      thai_lan_alt: 192231000.0,
      rooms: ["Phòng khách", "Phòng bếp", "WC T1", "Ngủ Master", "Ngủ con gái", "Ngủ con trai", "Phòng thờ", "Giặt là"],
      items_count: 68,
      wood_cost_pct: 38.0,
      labor_cost_pct: 14.5,
      hardware_cost_pct: 3.1,
      note: "Phương án rút gọn vật tư thương mại, giữ nguyên kết cấu thùng xưởng."
    },
    {
      file_id: "411b60feadb36d2b65699f59cef0d1f2",
      datetime: "2026-11-03 11:11:48",
      customer: "Anh Trung Tuyết",
      project: "Nhà ở tư nhân Hải Thượng Lãn Ông, TP. Hà Tĩnh",
      total_amount: 232248174.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF Melamine Chống Ẩm",
      thai_lan_alt: null,
      rooms: ["Phòng khách", "Phòng bếp", "Ngủ T1 (Bà) thêm LED", "Ngủ Master thêm LED", "Phòng thờ"],
      items_count: 78,
      wood_cost_pct: 37.8,
      labor_cost_pct: 14.2,
      hardware_cost_pct: 2.5,
      note: "Bổ sung hệ LED định hình nhôm định hình hắt tủ."
    },
    {
      file_id: "57a5c39e902a819654c4e2b667e2d137",
      datetime: "2026-09-30 07:13:38",
      customer: "Anh Thạch",
      project: "Biệt thự trọn gói Nhà ở tư nhân",
      total_amount: 686969050.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "An Cường cao cấp + Cánh kính",
      thai_lan_alt: 625000000.0,
      rooms: ["Đại sảnh", "Phòng khách", "Bếp & Đảo bếp", "3 Phòng ngủ", "Phòng giải trí", "Phòng thờ"],
      items_count: 112,
      wood_cost_pct: 39.2,
      labor_cost_pct: 14.0,
      hardware_cost_pct: 4.2,
      note: "Dự án lớn, tỷ lệ cost cao do nhiều phụ kiện nhập khẩu thông minh."
    },
    {
      file_id: "71f973c3a54242d4775040d1ef3284f0",
      datetime: "2026-09-30 07:20:12",
      customer: "Bác Phát",
      project: "Nhà ở tư nhân TP. Hà Tĩnh",
      total_amount: 355258100.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF An Cường + Acrylic NTD",
      thai_lan_alt: null,
      rooms: ["Phòng khách", "Bếp Acrylic Noline", "Phòng ngủ 1", "Phòng ngủ 2", "Tủ áo kịch trần"],
      items_count: 54,
      wood_cost_pct: 38.5,
      labor_cost_pct: 14.5,
      hardware_cost_pct: 3.5,
      note: "Đã bóc tách đơn cánh NTD Acrylic 13.95M riêng để kiểm soát cost xưởng."
    },
    {
      file_id: "384bda7059dd0834b334a2fe0eb0cce8",
      datetime: "2026-08-24 16:25:23",
      customer: "BS Duẫn",
      project: "Nhà phố tư nhân cao cấp",
      total_amount: 353452030.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "MDF Chống Ẩm An Cường",
      thai_lan_alt: 318000000.0,
      rooms: ["Phòng khám tầng 1", "Phòng khách", "Phòng bếp", "2 Phòng ngủ tầng 2"],
      items_count: 82,
      wood_cost_pct: 37.0,
      labor_cost_pct: 14.1,
      hardware_cost_pct: 2.1,
      note: "Tiến độ thi công gấp, chốt phương án vật tư chuẩn xưởng."
    },
    {
      file_id: "5d84065844cc66fb0db64e8a6aed678f",
      datetime: "2026-10-21 10:00:58",
      customer: "Anh Hoàn",
      project: "Nhà ở tư nhân TP. Hà Tĩnh",
      total_amount: 270470150.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "MDF Melamine An Cường",
      thai_lan_alt: 242000000.0,
      rooms: ["Khách", "Bếp", "Ngủ Master", "Ngủ con"],
      items_count: 62,
      wood_cost_pct: 37.5,
      labor_cost_pct: 14.4,
      hardware_cost_pct: 1.8,
      note: "Báo giá duyệt chính thức thi công tháng 10/2026."
    },
    {
      file_id: "a7367d0d35c1bd4c02e2de5783bfb9b1",
      datetime: "2026-10-09 04:47:11",
      customer: "Anh Hùng",
      project: "Nhà ở tư nhân",
      total_amount: 265945500.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF An Cường",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp", "3 Phòng ngủ", "Phòng thờ"],
      items_count: 65,
      wood_cost_pct: 38.2,
      labor_cost_pct: 14.3,
      hardware_cost_pct: 2.0,
      note: "Cost chuẩn xưởng 54.5% - cần rà soát lại phụ kiện kéo."
    },
    {
      file_id: "cf23c31348f37b5387d4d9d6cb091ca3",
      datetime: "2026-09-30 07:39:11",
      customer: "A Quế - Hộ Độ",
      project: "Nhà ở tư nhân Hộ Độ",
      total_amount: 189105050.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "Thái Lan Van Chống Ẩm",
      thai_lan_alt: null,
      rooms: ["Phòng khách", "Bếp chữ L", "Phòng ngủ"],
      items_count: 48,
      wood_cost_pct: 35.8,
      labor_cost_pct: 14.2,
      hardware_cost_pct: 1.5,
      note: "Hợp đồng ký chính thức 183.09M trong DS Xưởng T10. Tỷ lệ cost an toàn 51.5%."
    },
    {
      file_id: "cca9c1453a9e6a5933e39d66fb76e77f",
      datetime: "2026-09-30 07:20:13",
      customer: "Chị Hoa",
      project: "Nhà ở tư nhân TP. Hà Tĩnh",
      total_amount: 213314295.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF An Cường + Acrylic",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp Acrylic", "2 Phòng ngủ"],
      items_count: 51,
      wood_cost_pct: 39.5,
      labor_cost_pct: 14.8,
      hardware_cost_pct: 3.2,
      note: "CẢNH BÁO: Tỷ lệ cost 57.5% vượt trần 54% do cánh Acrylic phát sinh đơn ngoài 12.09M."
    },
    {
      file_id: "98eb94a52b5d1e9ee3a06e7e6f85cb9e",
      datetime: "2026-09-30 07:13:08",
      customer: "Huệ - Hoàng",
      project: "Nhà ở tư nhân",
      total_amount: 273802680.0,
      sender: "Admin",
      material_tier: "MDF Chống Ẩm",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp", "Ngủ Master", "Ngủ bé"],
      items_count: 59,
      wood_cost_pct: 37.2,
      labor_cost_pct: 14.0,
      hardware_cost_pct: 2.0,
      note: "Đạt chuẩn chốt chặn: Cost 53.2% <= 54%."
    },
    {
      file_id: "a3f4b0750768a3ced9c7930bae7d3ac6",
      datetime: "2026-09-05 08:00:13",
      customer: "Dì Lệ",
      project: "Nhà ở tư nhân TP. Hà Tĩnh",
      total_amount: 231769500.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "MDF An Cường",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp", "3 Phòng ngủ"],
      items_count: 56,
      wood_cost_pct: 36.8,
      labor_cost_pct: 14.2,
      hardware_cost_pct: 2.1,
      note: "Đạt chuẩn kỷ luật 53.1% <= 54%."
    },
    {
      file_id: "2b9ab6e68cbae11043417ffadd5cf189",
      datetime: "2026-08-24 17:00:25",
      customer: "Anh Tùng",
      project: "Nhà ở tư nhân",
      total_amount: 201423600.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF Melamine",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp", "2 Phòng ngủ"],
      items_count: 47,
      wood_cost_pct: 37.0,
      labor_cost_pct: 14.5,
      hardware_cost_pct: 2.0,
      note: "Đạt chuẩn 53.5%."
    },
    {
      file_id: "7399b93779b83e7f65ec6e1ae0247dd9",
      datetime: "2026-08-25 17:35:43",
      customer: "Anh Nguyên - TP",
      project: "Nhà ở tư nhân",
      total_amount: 179018500.0,
      sender: "Admin",
      material_tier: "MDF Chống Ẩm",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp", "Ngủ"],
      items_count: 42,
      wood_cost_pct: 37.4,
      labor_cost_pct: 14.3,
      hardware_cost_pct: 1.8,
      note: "Đạt chuẩn 53.5%."
    },
    {
      file_id: "a5dc24934c9ea2ff72728aa913e958f0",
      datetime: "2026-08-15 22:56:59",
      customer: "Anh Đoàn Quốc Toản",
      project: "Nhà ở tư nhân",
      total_amount: 154532500.0,
      sender: "Admin",
      material_tier: "MDF Melamine",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp", "Ngủ"],
      items_count: 38,
      wood_cost_pct: 36.9,
      labor_cost_pct: 14.2,
      hardware_cost_pct: 1.6,
      note: "Đạt chuẩn 52.7%."
    },
    {
      file_id: "512ad926b1e6d1636aa09aee2b4cb278",
      datetime: "2026-09-30 07:12:47",
      customer: "Nhà em Hiên Đài",
      project: "Nhà ở tư nhân",
      total_amount: 130264000.0,
      sender: "Admin",
      material_tier: "MDF Thái Lan",
      thai_lan_alt: null,
      rooms: ["Bếp", "Tủ áo phòng ngủ"],
      items_count: 31,
      wood_cost_pct: 36.0,
      labor_cost_pct: 14.0,
      hardware_cost_pct: 1.5,
      note: "Đạt chuẩn 51.5%."
    },
    {
      file_id: "c84230f151d406d0f00077b457827802",
      datetime: "2026-08-12 05:02:46",
      customer: "Chị Chiến",
      project: "Nhà ở tư nhân Thạch Đài",
      total_amount: 109635500.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "MDF Melamine",
      thai_lan_alt: null,
      rooms: ["Khách", "Bếp", "Tủ áo"],
      items_count: 29,
      wood_cost_pct: 36.5,
      labor_cost_pct: 14.1,
      hardware_cost_pct: 1.6,
      note: "Đạt chuẩn 52.2%."
    },
    {
      file_id: "034e72ba87aaa1ae390bb0dff85a6737",
      datetime: "2026-10-21 22:30:11",
      customer: "Anh Công",
      project: "Nhà ở tư nhân",
      total_amount: 90619638.0,
      sender: "Admin",
      material_tier: "MDF An Cường + Acrylic NTD",
      thai_lan_alt: null,
      rooms: ["Bếp Acrylic", "Tủ rượu"],
      items_count: 24,
      wood_cost_pct: 41.0,
      labor_cost_pct: 14.8,
      hardware_cost_pct: 3.5,
      note: "CẢNH BÁO ĐỎ: Cost 59.3% > 54% do đơn cánh NTD 12.47M chiếm tỷ trọng lớn trên giá trị 90.6M."
    },
    {
      file_id: "ab87d4b30171c72cfee559ca36f2a2ea",
      datetime: "2026-09-05 08:00:32",
      customer: "Dì Lệ (Giai đoạn phụ)",
      project: "Nhà ở tư nhân",
      total_amount: 79746500.0,
      sender: "Nguyễn Viết Nghĩa (Giám Đốc)",
      material_tier: "MDF An Cường",
      thai_lan_alt: null,
      rooms: ["Hệ tủ áo bổ sung", "Kệ tivi"],
      items_count: 18,
      wood_cost_pct: 37.1,
      labor_cost_pct: 14.3,
      hardware_cost_pct: 1.5,
      note: "Đạt chuẩn 52.9%."
    },
    {
      file_id: "1051667baa2b495d29f23c0d732b1883",
      datetime: "2026-10-09 04:48:22",
      customer: "Chị Dương",
      project: "Nhà ở tư nhân",
      total_amount: 40804225.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF Melamine",
      thai_lan_alt: null,
      rooms: ["Tủ bếp bổ sung"],
      items_count: 14,
      wood_cost_pct: 37.0,
      labor_cost_pct: 14.2,
      hardware_cost_pct: 1.4,
      note: "Đạt chuẩn 52.6%."
    },
    {
      file_id: "a96fa39fee38b1116b19dad6c5aa9c61",
      datetime: "2026-09-30 07:10:44",
      customer: "Anh Phú",
      project: "Nhà ở tư nhân",
      total_amount: 40060000.0,
      sender: "Tống Trần Hiệp (Sale Admin)",
      material_tier: "MDF Melamine",
      thai_lan_alt: null,
      rooms: ["Hệ tủ áo"],
      items_count: 12,
      wood_cost_pct: 36.8,
      labor_cost_pct: 14.2,
      hardware_cost_pct: 1.5,
      note: "Đạt chuẩn 52.5%."
    }
  ];

  // Danh mục đơn hàng cắt dán cánh NTD Acrylic tiêu biểu bóc tách từ Zalo
  const RAW_NTD_ACRYLIC_ORDERS = [
    {
      order_id: "#114196",
      file_id: "1793839470365_337278748333353578_g2539027971900219384",
      datetime: "2026-11-05 07:44:31",
      customer: "Chị Hoa",
      client_string: "Phú Gia-Hà Tĩnh-C Hoa",
      amount: 12095695.0,
      sqm: 9.81,
      items_count: 58,
      status: "Đã giao hàng xưởng",
      impact_on_cost: "Tăng cost dự toán của công trình Chị Hoa thêm 5.6%"
    },
    {
      order_id: "#114173",
      file_id: "1793695190196_337278748333353578_g2539027971900219384",
      datetime: "2026-11-03 16:20:47",
      customer: "Anh Công Bs+Bh",
      client_string: "Phú Gia-Hà Tĩnh-A Công BS+BH",
      amount: 946050.0,
      sqm: 0.90,
      items_count: 4,
      status: "Bổ sung bảo hành",
      impact_on_cost: "Cost bảo hành phụ"
    },
    {
      order_id: "#104138",
      file_id: "1793583216620_337278748333353578_g2539027971900219384",
      datetime: "2026-11-02 08:33:39",
      customer: "Anh Công",
      client_string: "Phú Gia-Hà Tĩnh-A Công",
      amount: 12476737.0,
      sqm: 8.68,
      items_count: 58,
      status: "Đã nhận cánh tại xưởng",
      impact_on_cost: "Chiếm 13.8% tổng giá trị hợp đồng Anh Công 90.6M -> Đẩy Cost lên 59.3%"
    },
    {
      order_id: "#103966",
      file_id: "1792636699325_337278748333353578_g2539027971900219384",
      datetime: "2026-10-22 09:38:21",
      customer: "Anh Huỳnh",
      client_string: "Phú Gia-Hà Tĩnh-A Huỳnh",
      amount: 1973369.0,
      sqm: 1.82,
      items_count: 8,
      status: "Đã lắp đặt",
      impact_on_cost: "Tỷ lệ cost trong ngưỡng an toàn 52.8%"
    },
    {
      order_id: "#103923",
      file_id: "1792404917872_337278748333353578_g2539027971900219384",
      datetime: "2026-10-19 17:15:20",
      customer: "Anh Tuấn",
      client_string: "Phú Gia-Hà Tĩnh-A Tuấn",
      amount: 7904009.0,
      sqm: 6.45,
      items_count: 36,
      status: "Đã nghiệm thu",
      impact_on_cost: "Hợp đồng 111.8M Tuấn - Cost an toàn 53.0%"
    },
    {
      order_id: "#103853",
      file_id: "1791971685772_337278748333353578_g2539027971900219384",
      datetime: "2026-10-15 19:09:13",
      customer: "Bác Phát",
      client_string: "Phú Gia-Hà Tĩnh-Bác Phát",
      amount: 13954211.0,
      sqm: 11.20,
      items_count: 64,
      status: "Đã nghiệm thu",
      impact_on_cost: "Khớp đúng dự toán nhà Bác Phát 355.2M"
    },
    {
      order_id: "#103656",
      file_id: "1790938438489_337278748333353578_g2539027971900219384",
      datetime: "2026-10-03 08:16:23",
      customer: "Anh Quế",
      client_string: "Phú Gia-Hà Tĩnh-A Quế Hộ Độ",
      amount: 9904484.0,
      sqm: 8.15,
      items_count: 42,
      status: "Đã bàn giao",
      impact_on_cost: "Khớp hợp đồng Anh Quế Hộ Độ 183.09M"
    }
  ];

  // Danh mục hợp đồng xưởng thi công thực tế từ DS Xưởng T8, T9, T10
  const RAW_CONTRACTS_DATA = [
    { month: "Tháng 10/2026", customer: "Anh Quế", address: "Hộ Độ", value: 183095372, sale: "Lưu Thị Thu Hương", status: "Hoàn thành 98%", cost_check: "ĐẠT 51.5%" },
    { month: "Tháng 10/2026", customer: "Bác Phát", address: "TP. Hà Tĩnh", value: 234243218, sale: "Tống Trần Hiệp", status: "Hoàn thành 90%", cost_check: "ĐẠT 53.4%" },
    { month: "Tháng 10/2026", customer: "Chị Hoa", address: "TP. Hà Tĩnh", value: 227773806, sale: "Tống Trần Hiệp", status: "Thi công 30%", cost_check: "CẢNH BÁO 57.5%" },
    { month: "Tháng 10/2026", customer: "Anh Tuấn", address: "TP. Hà Tĩnh", value: 111800000, sale: "Đường Việt Dũng", status: "Hoàn thành 95%", cost_check: "ĐẠT 53.0%" },
    { month: "Tháng 10/2026", customer: "Anh Huỳnh", address: "Cẩm Nhượng", value: 80661780, sale: "Đường Việt Dũng", status: "Thi công 50%", cost_check: "ĐẠT 52.8%" },
    { month: "Tháng 10/2026", customer: "Anh Hợi", address: "Can Lộc", value: 41564225, sale: "Tống Trần Hiệp", status: "Đã bàn giao 100%", cost_check: "ĐẠT 51.8%" },
    { month: "Tháng 10/2026", customer: "Chị Phượng", address: "Nghi Xuân", value: 42462996, sale: "Tống Trần Hiệp", status: "Hoàn thành 95%", cost_check: "ĐẠT 52.1%" },
    { month: "Tháng 9/2026", customer: "Chị Hiển", address: "Thạch Linh", value: 129803651, sale: "Lưu Thị Thu Hương", status: "Đã bàn giao 100%", cost_check: "ĐẠT 52.4%" },
    { month: "Tháng 9/2026", customer: "Anh Hào", address: "Kỳ Anh", value: 100600000, sale: "Đường Việt Dũng", status: "Đã bàn giao 100%", cost_check: "ĐẠT 53.0%" },
    { month: "Tháng 8/2026", customer: "Cậu Chiến", address: "Hương Khê", value: 154000000, sale: "Lưu Thị Thu Hương", status: "Đã bàn giao 100%", cost_check: "ĐẠT 51.9%" },
    { month: "Tháng 8/2026", customer: "Thắm Minh", address: "Thạch Hưng", value: 87430975, sale: "Lưu Thị Thu Hương", status: "Đã bàn giao 100%", cost_check: "ĐẠT 52.6%" }
  ];

  // --- 2. HÀM TÍNH TOÁN & ĐÁNH GIÁ CHỐT CHẶN COST 54% ---
  function computeCostScore(revenue, woodPct, laborPct, hardwarePct, otherPct) {
    const rev = parseFloat(revenue) || 0;
    const wPct = parseFloat(woodPct) || 37.0;
    const lPct = parseFloat(laborPct) || 14.0;
    const hPct = parseFloat(hardwarePct) || 2.0;
    const oPct = parseFloat(otherPct) || 0.0;

    const totalCostPct = wPct + lPct + hPct + oPct;
    const woodAmount = (rev * wPct) / 100;
    const laborAmount = (rev * lPct) / 100;
    const hardwareAmount = (rev * hPct) / 100;
    const otherAmount = (rev * oPct) / 100;
    const totalCostAmount = woodAmount + laborAmount + hardwareAmount + otherAmount;
    const netProfitAmount = rev - totalCostAmount;
    const netProfitPct = rev > 0 ? (netProfitAmount / rev) * 100 : 0;

    const isPass = totalCostPct <= AUDIT_METADATA.cost_threshold_target;
    let badgeClass = "pass";
    let badgeLabel = "ĐẠT CHUẨN KỶ LUẬT (<= 54%)";
    let message = "An toàn dòng tiền. Lợi nhuận ròng dự kiến 18% - 22% vào két Giám Đốc.";

    if (totalCostPct < 50.0) {
      badgeClass = "super-pass";
      badgeLabel = "SIÊU LỢI NHUẬN (< 50%)";
      message = "Tỷ suất sinh lời vượt trội (> 22% Net Margin). Cực kỳ tối ưu ván và nhân công.";
    } else if (totalCostPct > 54.0) {
      badgeClass = "danger-alert";
      badgeLabel = "CẢNH BÁO ĐỎ: VƯỢT CHỐT CHẶN (> 54%)";
      message = "Nguy cơ ăn mòn lợi nhuận xưởng! Bắt buộc bóc tách lại phụ kiện mua ngoài hoặc đàm phán phôi ván.";
    }

    return {
      revenue: rev,
      woodAmount,
      laborAmount,
      hardwareAmount,
      otherAmount,
      totalCostAmount,
      netProfitAmount,
      netProfitPct,
      totalCostPct,
      isPass,
      badgeClass,
      badgeLabel,
      message
    };
  }

  function formatMoney(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return "0 đ";
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + " đ";
  }

  // --- 3. GIAO DIỆN HTML & CSS STYLE ĐẲNG CẤP THẾ GIỚI ---
  const MODULE_CSS = `
    .w21-vault-container {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0b0f19;
      color: #f1f5f9;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      margin: 16px 0;
      border: 1px solid #1e293b;
    }
    .w21-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #1e293b;
      padding-bottom: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .w21-brand-badge {
      display: inline-block;
      background: linear-gradient(135deg, #eab308, #ca8a04);
      color: #0f172a;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .w21-title {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .w21-subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .w21-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .w21-stat-card {
      background: #131c2e;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
    }
    .w21-stat-card:hover {
      transform: translateY(-2px);
      border-color: #38bdf8;
    }
    .w21-stat-card.gold-border { border-top: 3px solid #eab308; }
    .w21-stat-card.emerald-border { border-top: 3px solid #10b981; }
    .w21-stat-card.ruby-border { border-top: 3px solid #ef4444; }
    .w21-stat-card.blue-border { border-top: 3px solid #38bdf8; }
    .w21-stat-title {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .w21-stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
    }
    .w21-stat-desc {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
    }

    /* Tabs */
    .w21-nav-tabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid #1e293b;
      margin-bottom: 20px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .w21-tab-btn {
      background: #131c2e;
      color: #94a3b8;
      border: 1px solid #1e293b;
      padding: 10px 18px;
      border-radius: 8px 8px 0 0;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .w21-tab-btn:hover {
      background: #1e293b;
      color: #f1f5f9;
    }
    .w21-tab-btn.active {
      background: #0284c7;
      color: #ffffff;
      border-color: #0284c7;
    }
    .w21-tab-pane {
      display: none;
    }
    .w21-tab-pane.active {
      display: block;
    }

    /* Filters Bar */
    .w21-filter-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
      align-items: center;
      background: #131c2e;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #1e293b;
    }
    .w21-search-input {
      flex: 1;
      min-width: 220px;
      background: #0b0f19;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
    }
    .w21-search-input:focus {
      border-color: #38bdf8;
    }
    .w21-select {
      background: #0b0f19;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
    }

    /* Table */
    .w21-table-wrapper {
      overflow-x: auto;
      border: 1px solid #1e293b;
      border-radius: 8px;
    }
    .w21-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    .w21-table th {
      background: #131c2e;
      color: #94a3b8;
      font-weight: 600;
      padding: 12px 14px;
      border-bottom: 1px solid #1e293b;
      white-space: nowrap;
    }
    .w21-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #1e293b;
      color: #e2e8f0;
      vertical-align: middle;
    }
    .w21-table tr:hover {
      background: #131c2e;
    }

    /* Badges */
    .w21-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    .w21-badge.pass {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    .w21-badge.super-pass {
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.4);
    }
    .w21-badge.danger-alert {
      background: rgba(239, 68, 68, 0.18);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.5);
      animation: pulseAlert 2s infinite;
    }
    @keyframes pulseAlert {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    /* Action Buttons */
    .w21-btn {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .w21-btn:hover {
      background: #0369a1;
    }
    .w21-btn-sm {
      padding: 4px 8px;
      font-size: 11px;
    }
    .w21-btn-gold {
      background: #ca8a04;
      color: #ffffff;
    }
    .w21-btn-gold:hover {
      background: #a16207;
    }

    /* Simulator Form */
    .w21-sim-box {
      background: #131c2e;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .w21-sim-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .w21-form-group {
      margin-bottom: 14px;
    }
    .w21-form-group label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .w21-slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .w21-slider {
      flex: 1;
      height: 6px;
      background: #334155;
      border-radius: 3px;
      outline: none;
      accent-color: #0284c7;
    }
    .w21-slider-val {
      min-width: 48px;
      font-weight: 700;
      color: #f8fafc;
      font-size: 13px;
      text-align: right;
    }
    .w21-sim-result-card {
      background: #0b0f19;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #334155;
    }
    .w21-progress-bar-bg {
      height: 12px;
      background: #1e293b;
      border-radius: 6px;
      overflow: hidden;
      margin: 12px 0;
      display: flex;
    }
    .w21-progress-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    /* Modal */
    .w21-modal-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .w21-modal-backdrop.open {
      display: flex;
    }
    .w21-modal-content {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      max-width: 720px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 24px;
      color: #f8fafc;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      position: relative;
    }
    .w21-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .w21-close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 20px;
      cursor: pointer;
    }
    .w21-close-btn:hover {
      color: #ffffff;
    }
  `;

  // --- 4. ENGINE QUẢN LÝ DỮ LIỆU & RENDER ---
  class QuotationsVaultW21 {
    constructor() {
      this.quotations = RAW_QUOTATIONS_DATA;
      this.ntdOrders = RAW_NTD_ACRYLIC_ORDERS;
      this.contracts = RAW_CONTRACTS_DATA;
      this.cncNorms = CNC_NORMS_CATALOG;
      this.metadata = AUDIT_METADATA;

      this.currentFilter = {
        keyword: "",
        status: "ALL", // ALL, PASS, DANGER
        sender: "ALL"
      };

      this.activeTab = "tab-quotations";
    }

    injectStyles() {
      if (!document.getElementById("pg-w21-styles")) {
        const styleEl = document.createElement("style");
        styleEl.id = "pg-w21-styles";
        styleEl.innerHTML = MODULE_CSS;
        document.head.appendChild(styleEl);
      }
    }

    calculateTotalRevenue() {
      return this.quotations.reduce((sum, item) => sum + (item.total_amount || 0), 0);
    }

    calculatePassedQuotations() {
      return this.quotations.filter(item => {
        const score = computeCostScore(item.total_amount, item.wood_cost_pct, item.labor_cost_pct, item.hardware_cost_pct, 0);
        return score.isPass;
      }).length;
    }

    calculateAverageCostRatio() {
      if (!this.quotations.length) return 0;
      const totalRatio = this.quotations.reduce((sum, item) => {
        return sum + (item.wood_cost_pct + item.labor_cost_pct + item.hardware_cost_pct);
      }, 0);
      return (totalRatio / this.quotations.length).toFixed(1);
    }

    render(containerId) {
      this.injectStyles();
      const container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
      if (!container) {
        console.error("[PG_Modules_W21] Không tìm thấy container:", containerId);
        return;
      }

      const totalRev = this.calculateTotalRevenue();
      const passCount = this.calculatePassedQuotations();
      const alertCount = this.quotations.length - passCount;
      const avgCost = this.calculateAverageCostRatio();

      const html = `
        <div class="w21-vault-container">
          <!-- Header -->
          <div class="w21-header">
            <div>
              <span class="w21-brand-badge">⚡ PHÚ GIA LUXURY • MỤC 24 GEMINI.MD</span>
              <h2 class="w21-title">
                📊 KHO DỰ TOÁN & BÁO GIÁ EXCEL ZALO (MODULE W21)
              </h2>
              <div class="w21-subtitle">
                Đơn vị: ${this.metadata.legal_name} • MST: ${this.metadata.legal_mst} • Tổ hợp: ${this.metadata.office_address}
              </div>
            </div>
            <div>
              <button class="w21-btn w21-btn-gold" onclick="window.PG_Modules_W21.openSimModal()">
                ⚡ Máy Thẩm Định Cost 54%
              </button>
            </div>
          </div>

          <!-- KPI Cards -->
          <div class="w21-stats-grid">
            <div class="w21-stat-card blue-border">
              <div class="w21-stat-title">Tổng File Excel Đã Quét</div>
              <div class="w21-stat-value">${this.metadata.scanned_total} File</div>
              <div class="w21-stat-desc">Zalo PC LevelDB & fileNoise Cache</div>
            </div>

            <div class="w21-stat-card gold-border">
              <div class="w21-stat-title">Tổng Doanh Số Báo Giá</div>
              <div class="w21-stat-value">${formatMoney(totalRev)}</div>
              <div class="w21-stat-desc">${this.quotations.length} Dự án bóc tách chi tiết</div>
            </div>

            <div class="w21-stat-card emerald-border">
              <div class="w21-stat-title">Đạt Chốt Chặn Cost &le; 54%</div>
              <div class="w21-stat-value">${passCount} / ${this.quotations.length} Dự án</div>
              <div class="w21-stat-desc">Net Margin bảo đảm 18% - 22% cho BGĐ</div>
            </div>

            <div class="w21-stat-card ruby-border">
              <div class="w21-stat-title">Cảnh Báo Vượt Trần Cost</div>
              <div class="w21-stat-value">${alertCount} Dự án (${((alertCount/this.quotations.length)*100).toFixed(0)}%)</div>
              <div class="w21-stat-desc">Cần tối ưu phụ kiện & ván cắt</div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="w21-nav-tabs">
            <button class="w21-tab-btn active" onclick="window.PG_Modules_W21.switchTab('tab-quotations')">
              📁 Báo Giá Khách Hàng (${this.quotations.length})
            </button>
            <button class="w21-tab-btn" onclick="window.PG_Modules_W21.switchTab('tab-ntd-acrylic')">
              💎 Đơn Cánh NTD Acrylic (${this.ntdOrders.length})
            </button>
            <button class="w21-tab-btn" onclick="window.PG_Modules_W21.switchTab('tab-contracts')">
              📝 Hợp Đồng Xưởng T8-T10 (${this.contracts.length})
            </button>
            <button class="w21-tab-btn" onclick="window.PG_Modules_W21.switchTab('tab-cnc-norms')">
              📐 Định Mức Tấm Cắt CNC (Mục 24)
            </button>
            <button class="w21-tab-btn" onclick="window.PG_Modules_W21.switchTab('tab-simulator')">
              🧮 Giả Lập & Chấm Điểm Cost
            </button>
          </div>

          <!-- Tab 1: Quotations Table -->
          <div id="tab-quotations" class="w21-tab-pane active">
            <div class="w21-filter-bar">
              <input type="text" id="w21-search-box" class="w21-search-input" 
                placeholder="🔍 Tìm theo Tên khách hàng, Dự án, Người gửi..." 
                oninput="window.PG_Modules_W21.handleSearch(this.value)">
              
              <select id="w21-filter-status" class="w21-select" onchange="window.PG_Modules_W21.handleFilterStatus(this.value)">
                <option value="ALL">Tất cả trạng thái Cost</option>
                <option value="PASS">✅ Đạt chuẩn (&le; 54%)</option>
                <option value="DANGER">🚨 Cảnh báo đỏ (> 54%)</option>
              </select>

              <button class="w21-btn w21-btn-sm" onclick="window.PG_Modules_W21.resetFilter()">
                🔄 Đặt lại bộ lọc
              </button>
            </div>

            <div class="w21-table-wrapper">
              <table class="w21-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Thời gian Zalo</th>
                    <th>Khách Hàng & Dự Án</th>
                    <th>Người Gửi</th>
                    <th>Doanh Thu Báo Giá</th>
                    <th>Ước Tính Cost (VT+Thợ)</th>
                    <th>Tỷ Lệ Cost</th>
                    <th>Chấm Điểm 54%</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="w21-quotations-tbody">
                  ${this.renderQuotationsRows()}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab 2: NTD Acrylic Orders -->
          <div id="tab-ntd-acrylic" class="w21-tab-pane">
            <div class="w21-table-wrapper">
              <table class="w21-table">
                <thead>
                  <tr>
                    <th>Mã Đơn NTD</th>
                    <th>Thời Gian Gửi</th>
                    <th>Khách Hàng Bóc Tách</th>
                    <th>Chuỗi Gốc Nhóm Zalo</th>
                    <th>Tổng Tiền</th>
                    <th>Diện Tích (M²)</th>
                    <th>Số Tấm</th>
                    <th>Tác Động Tỷ Lệ Cost</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.ntdOrders.map(item => `
                    <tr>
                      <td><strong style="color: #38bdf8;">${item.order_id}</strong></td>
                      <td style="font-size: 11px; color: #94a3b8;">${item.datetime}</td>
                      <td><strong>${item.customer}</strong></td>
                      <td style="font-size: 11px; color: #cbd5e1;"><code>${item.client_string}</code></td>
                      <td style="font-weight: 700; color: #facc15;">${formatMoney(item.amount)}</td>
                      <td>${item.sqm} m²</td>
                      <td>${item.items_count} cánh</td>
                      <td style="font-size: 12px; color: #94a3b8;">${item.impact_on_cost}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab 3: Contracts Tracking -->
          <div id="tab-contracts" class="w21-tab-pane">
            <div class="w21-table-wrapper">
              <table class="w21-table">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Khách Hàng</th>
                    <th>Địa Chỉ</th>
                    <th>Giá Trị Hợp Đồng</th>
                    <th>Sale Phụ Trách</th>
                    <th>Tiến Độ Thi Công</th>
                    <th>Kiểm Soát Cost</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.contracts.map(c => `
                    <tr>
                      <td><span class="w21-brand-badge">${c.month}</span></td>
                      <td><strong>${c.customer}</strong></td>
                      <td style="color: #94a3b8;">${c.address}</td>
                      <td style="font-weight: 700; color: #38bdf8;">${formatMoney(c.value)}</td>
                      <td>${c.sale}</td>
                      <td><span style="color: #a7f3d0;">${c.status}</span></td>
                      <td>
                        <span class="w21-badge ${c.cost_check.includes('ĐẠT') ? 'pass' : 'danger-alert'}">
                          ${c.cost_check}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab 4: CNC Norms Catalog (Mục 24) -->
          <div id="tab-cnc-norms" class="w21-tab-pane">
            <div style="background: #131c2e; padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #1e293b;">
              <h3 style="margin-top: 0; color: #eab308; font-size: 16px;">
                📐 BẢNG ĐỊNH MỨC TẤM CẮT CNC CHUẨN THỰC CHIẾN XƯỞNG PG HOME (MỤC 24 GEMINI.MD)
              </h3>
              <p style="font-size: 13px; color: #94a3b8; margin: 0;">
                Khổ ván chuẩn: 1220 &times; 2440 = 2.9768 M²/tấm. Chuẩn hóa vĩnh viễn từ bài học đối soát nhà anh Nam ngày 06/11/2026.
              </p>
            </div>

            <div class="w21-table-wrapper">
              <table class="w21-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Hạng Mục Thi Công</th>
                    <th>ĐVT</th>
                    <th>Định Mức Ván</th>
                    <th>Công Thức Giám Đốc</th>
                    <th>Lưu Ý Kỹ Thuật Trừ Hao & Cắt Phôi</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.cncNorms.map(norm => `
                    <tr>
                      <td><strong style="color: #38bdf8;">${norm.code}</strong></td>
                      <td><strong>${norm.name}</strong></td>
                      <td><span class="w21-brand-badge">${norm.unit}</span></td>
                      <td><strong style="color: #facc15; font-size: 14px;">${norm.norm_sheet}</strong> tấm / ${norm.unit}</td>
                      <td style="font-family: monospace; color: #a5f3fc;">${norm.formula}</td>
                      <td style="font-size: 12px; color: #cbd5e1;">${norm.note}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab 5: Interactive Simulator -->
          <div id="tab-simulator" class="w21-tab-pane">
            <div class="w21-sim-box">
              <h3 style="margin-top: 0; color: #38bdf8; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                🧮 CÔNG CỤ THẨM ĐỊNH TỶ LỆ COST & TỰ ĐỘNG CHẤM ĐIỂM CHỐT CHẶN 54%
              </h3>
              <p style="font-size: 13px; color: #94a3b8;">
                Điều chỉnh các thông số dự toán để kiểm tra tức thời Lợi nhuận ròng bỏ túi Giám Đốc và cảnh báo vi phạm chốt chặn 54%.
              </p>

              <div class="w21-sim-grid">
                <div>
                  <div class="w21-form-group">
                    <label>DOANH THU BÁO GIÁ DỰ ÁN (VNĐ):</label>
                    <input type="number" id="sim-revenue-input" class="w21-search-input" value="314797000" 
                      style="width: 100%; font-size: 16px; font-weight: 700; color: #38bdf8;" 
                      oninput="window.PG_Modules_W21.updateSimulation()">
                  </div>

                  <div class="w21-form-group">
                    <label>Chi phí Vật tư phôi ván gỗ (%):</label>
                    <div class="w21-slider-row">
                      <input type="range" id="sim-wood-slider" class="w21-slider" min="25" max="50" step="0.5" value="36.5" 
                        oninput="window.PG_Modules_W21.updateSimulation()">
                      <span id="sim-wood-val" class="w21-slider-val">36.5%</span>
                    </div>
                  </div>

                  <div class="w21-form-group">
                    <label>Chi phí Công thợ xưởng & Lắp đặt (%):</label>
                    <div class="w21-slider-row">
                      <input type="range" id="sim-labor-slider" class="w21-slider" min="10" max="25" step="0.5" value="14.0" 
                        oninput="window.PG_Modules_W21.updateSimulation()">
                      <span id="sim-labor-val" class="w21-slider-val">14.0%</span>
                    </div>
                  </div>

                  <div class="w21-form-group">
                    <label>Phụ kiện mua ngoài / Cánh kính / Acrylic (%):</label>
                    <div class="w21-slider-row">
                      <input type="range" id="sim-hardware-slider" class="w21-slider" min="0" max="15" step="0.5" value="2.5" 
                        oninput="window.PG_Modules_W21.updateSimulation()">
                      <span id="sim-hardware-val" class="w21-slider-val">2.5%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div id="sim-result-container" class="w21-sim-result-card">
                    <!-- Sẽ cập nhật động -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Xem Chi Tiết Báo Giá -->
        <div id="w21-detail-modal" class="w21-modal-backdrop">
          <div class="w21-modal-content">
            <div class="w21-modal-header">
              <h3 id="w21-modal-title" style="margin: 0; color: #38bdf8;">Chi Tiết Báo Giá</h3>
              <button class="w21-close-btn" onclick="window.PG_Modules_W21.closeModal()">&times;</button>
            </div>
            <div id="w21-modal-body">
              <!-- Nội dung chi tiết -->
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
      this.updateSimulation();
    }

    renderQuotationsRows() {
      const filtered = this.getFilteredQuotations();
      if (!filtered.length) {
        return `<tr><td colspan="9" style="text-align: center; color: #94a3b8; padding: 24px;">Không tìm thấy báo giá nào khớp với điều kiện lọc.</td></tr>`;
      }

      return filtered.map((item, index) => {
        const score = computeCostScore(item.total_amount, item.wood_cost_pct, item.labor_cost_pct, item.hardware_cost_pct, 0);
        return `
          <tr>
            <td>${index + 1}</td>
            <td style="font-size: 11px; color: #94a3b8;">${item.datetime}</td>
            <td>
              <strong>${item.customer}</strong>
              <div style="font-size: 11px; color: #94a3b8;">${item.project}</div>
            </td>
            <td style="font-size: 12px; color: #cbd5e1;">${item.sender}</td>
            <td style="font-weight: 700; color: #38bdf8;">${formatMoney(item.total_amount)}</td>
            <td style="font-size: 12px; color: #94a3b8;">${formatMoney(score.totalCostAmount)}</td>
            <td>
              <strong style="color: ${score.isPass ? '#34d399' : '#f87171'}; font-size: 14px;">
                ${score.totalCostPct.toFixed(1)}%
              </strong>
            </td>
            <td>
              <span class="w21-badge ${score.badgeClass}">
                ${score.badgeLabel}
              </span>
            </td>
            <td>
              <button class="w21-btn w21-btn-sm" onclick="window.PG_Modules_W21.openDetail('${item.file_id}')">
                🔍 Soát
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    getFilteredQuotations() {
      return this.quotations.filter(item => {
        const matchKeyword = !this.currentFilter.keyword || 
          item.customer.toLowerCase().includes(this.currentFilter.keyword.toLowerCase()) ||
          item.project.toLowerCase().includes(this.currentFilter.keyword.toLowerCase()) ||
          item.sender.toLowerCase().includes(this.currentFilter.keyword.toLowerCase());

        const score = computeCostScore(item.total_amount, item.wood_cost_pct, item.labor_cost_pct, item.hardware_cost_pct, 0);
        let matchStatus = true;
        if (this.currentFilter.status === "PASS") {
          matchStatus = score.isPass;
        } else if (this.currentFilter.status === "DANGER") {
          matchStatus = !score.isPass;
        }

        return matchKeyword && matchStatus;
      });
    }

    handleSearch(val) {
      this.currentFilter.keyword = val.trim();
      const tbody = document.getElementById("w21-quotations-tbody");
      if (tbody) tbody.innerHTML = this.renderQuotationsRows();
    }

    handleFilterStatus(val) {
      this.currentFilter.status = val;
      const tbody = document.getElementById("w21-quotations-tbody");
      if (tbody) tbody.innerHTML = this.renderQuotationsRows();
    }

    resetFilter() {
      this.currentFilter.keyword = "";
      this.currentFilter.status = "ALL";
      const sBox = document.getElementById("w21-search-box");
      const fStatus = document.getElementById("w21-filter-status");
      if (sBox) sBox.value = "";
      if (fStatus) fStatus.value = "ALL";
      const tbody = document.getElementById("w21-quotations-tbody");
      if (tbody) tbody.innerHTML = this.renderQuotationsRows();
    }

    switchTab(tabId) {
      this.activeTab = tabId;
      document.querySelectorAll(".w21-tab-btn").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".w21-tab-pane").forEach(pane => pane.classList.remove("active"));

      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.add("active");

      // Highlight button
      const buttons = document.querySelectorAll(".w21-tab-btn");
      buttons.forEach(btn => {
        if (btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(tabId)) {
          btn.classList.add("active");
        }
      });
    }

    updateSimulation() {
      const revInput = document.getElementById("sim-revenue-input");
      const woodSlider = document.getElementById("sim-wood-slider");
      const laborSlider = document.getElementById("sim-labor-slider");
      const hwSlider = document.getElementById("sim-hardware-slider");

      if (!revInput || !woodSlider || !laborSlider || !hwSlider) return;

      const rev = parseFloat(revInput.value) || 0;
      const wPct = parseFloat(woodSlider.value) || 36.5;
      const lPct = parseFloat(laborSlider.value) || 14.0;
      const hPct = parseFloat(hwSlider.value) || 2.5;

      document.getElementById("sim-wood-val").innerText = wPct.toFixed(1) + "%";
      document.getElementById("sim-labor-val").innerText = lPct.toFixed(1) + "%";
      document.getElementById("sim-hardware-val").innerText = hPct.toFixed(1) + "%";

      const score = computeCostScore(rev, wPct, lPct, hPct, 0);

      const resBox = document.getElementById("sim-result-container");
      if (!resBox) return;

      resBox.innerHTML = `
        <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">
          KẾT QUẢ ĐỐI SOÁT & CHẤM ĐIỂM DỰ TOÁN
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <span style="font-size: 14px; color: #cbd5e1;">Tỷ Lệ Cost Tổng:</span>
          <span style="font-size: 26px; font-weight: 800; color: ${score.isPass ? '#34d399' : '#f87171'};">
            ${score.totalCostPct.toFixed(1)}%
          </span>
        </div>

        <div class="w21-progress-bar-bg">
          <div class="w21-progress-fill" style="width: ${Math.min(score.totalCostPct, 100)}%; background: ${score.isPass ? '#10b981' : '#ef4444'};"></div>
        </div>

        <div style="margin-bottom: 12px;">
          <span class="w21-badge ${score.badgeClass}" style="font-size: 12px; padding: 6px 12px;">
            ${score.badgeLabel}
          </span>
        </div>

        <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #1e293b; padding-top: 10px; margin-bottom: 12px;">
          ${score.message}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
          <div>
            <div style="color: #94a3b8;">Vật tư ván gỗ:</div>
            <strong style="color: #f1f5f9;">${formatMoney(score.woodAmount)}</strong>
          </div>
          <div>
            <div style="color: #94a3b8;">Công thợ xưởng:</div>
            <strong style="color: #f1f5f9;">${formatMoney(score.laborAmount)}</strong>
          </div>
          <div>
            <div style="color: #94a3b8;">Phụ kiện ngoài:</div>
            <strong style="color: #f1f5f9;">${formatMoney(score.hardwareAmount)}</strong>
          </div>
          <div>
            <div style="color: #94a3b8;">Lợi Nhuận Ròng (Net):</div>
            <strong style="color: #38bdf8;">${formatMoney(score.netProfitAmount)} (${score.netProfitPct.toFixed(1)}%)</strong>
          </div>
        </div>
      `;
    }

    openSimModal() {
      this.switchTab("tab-simulator");
      const simBox = document.querySelector(".w21-sim-box");
      if (simBox) {
        simBox.scrollIntoView({ behavior: 'smooth' });
      }
    }

    openDetail(fileId) {
      const item = this.quotations.find(q => q.file_id === fileId);
      if (!item) return;

      const score = computeCostScore(item.total_amount, item.wood_cost_pct, item.labor_cost_pct, item.hardware_cost_pct, 0);
      const modal = document.getElementById("w21-detail-modal");
      const title = document.getElementById("w21-modal-title");
      const body = document.getElementById("w21-modal-body");

      if (!modal || !title || !body) return;

      title.innerHTML = `🔍 HỒ SƠ DỰ TOÁN BÁO GIÁ: ${item.customer}`;
      body.innerHTML = `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; color: #cbd5e1; margin-bottom: 4px;"><strong>Dự án:</strong> ${item.project}</div>
          <div style="font-size: 12px; color: #94a3b8;"><strong>Người lập & Gửi:</strong> ${item.sender} • Ngày: ${item.datetime}</div>
          <div style="font-size: 12px; color: #94a3b8;"><strong>Cấp vật liệu:</strong> ${item.material_tier} ${item.thai_lan_alt ? `(Phương án Thái Lan: ${formatMoney(item.thai_lan_alt)})` : ''}</div>
        </div>

        <div style="background: #131c2e; padding: 14px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 13px; color: #94a3b8;">Tổng Giá Trị Báo Giá:</span>
            <span style="font-size: 20px; font-weight: 800; color: #38bdf8;">${formatMoney(item.total_amount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 13px; color: #94a3b8;">Tỷ Lệ Cost Thẩm Định:</span>
            <span style="font-size: 18px; font-weight: 800; color: ${score.isPass ? '#34d399' : '#f87171'};">${score.totalCostPct.toFixed(1)}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #94a3b8;">Đánh Giá Chốt Chặn 54%:</span>
            <span class="w21-badge ${score.badgeClass}">${score.badgeLabel}</span>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 13px; font-weight: 700; color: #eab308; margin-bottom: 6px;">DANH SÁCH KHÔNG GIAN BÓC TÁCH:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${(item.rooms || []).map(r => `<span style="background: #1e293b; color: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${r}</span>`).join('')}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">GHI CHÚ KỸ THUẬT & ĐỐI SOÁT:</div>
          <div style="font-size: 12px; color: #cbd5e1; background: #0b0f19; padding: 10px; border-radius: 6px; border: 1px solid #334155;">
            ${item.note}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid #1e293b; padding-top: 14px;">
          <button class="w21-btn w21-btn-gold" onclick="alert('ĐÃ ĐÓNG DẤU ĐỎ ĐIỆN TỬ: Giám Đốc Nguyễn Viết Nghĩa Phê Duyệt Báo Giá!')">
            ✍️ Phê Duyệt & Đóng Dấu Đỏ
          </button>
          <button class="w21-btn" onclick="window.PG_Modules_W21.closeModal()">
            Đóng
          </button>
        </div>
      `;

      modal.classList.add("open");
    }

    closeModal() {
      const modal = document.getElementById("w21-detail-modal");
      if (modal) modal.classList.remove("open");
    }
  }

  // Khởi tạo Singleton
  const instance = new QuotationsVaultW21();
  return instance;
}));
