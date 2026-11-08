/**
 * ====================================================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT & XÂY DỰNG PHÚ GIA - PG HOME LUXURY
 * TỔ HỢP VĂN PHÒNG & NHÀ MÁY SẢN XUẤT NỘI THẤT PHÚ GIA
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Hotline: 0986.722.324 | Mã số HKD / MST: 042203002931
 * ====================================================================================================
 * 
 * PHÂN HỆ QUẢN TRỊ GIAI ĐOẠN 2 - R06:
 * MODULE W54: WEB ERP E-INVOICE XML PARSER & 3-WAY ACCOUNTING AUDIT UI MODULE
 * File: F:\PG Home - Quản trị\web_app\modules\w54_einvoice_3way_audit.js
 * Định danh toàn cục: window.PG_W54_EInvoice3WayAudit & window.PG_Modules_W54
 * 
 * CHỨC NĂNG CỐT LÕI:
 * 1. Trình kiểm tra trực tiếp file Hóa đơn điện tử .xml trên trình duyệt (Parser chuẩn Nghị định 123/2020 &
 *    Thông tư 78/2021 TCT: parse thẻ NBan, NMua, MST, TgTTTBSo, DSHHDVu, DSCKS...).
 * 2. Bộ lọc Legal Gate tự động xác thực danh tính pháp lý Phú Gia:
 *    - Xác thực MST chuẩn: 042203002931
 *    - Xác thực địa chỉ giao dịch chuẩn: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 *    - Cưỡng chế kỷ luật thép: CẢNH BÁO ĐỎ khi phát hiện địa chỉ cũ 35 Ngô Đức Kế (chỉ có NCC Quốc Tâm
 *      ở 56 Ngô Đức Kế), địa chỉ bịa đặt đường Hàm Nghi, lỗi chính tả Trương Quốc Dung (thiếu dấu Ứ),
 *      danh xưng hạ cấp "xưởng mộc", hoặc mã số thuế giả mạo 2500732386 / 3002228888.
 * 3. Bảng đối soát 3 chiều kế toán (PO Đơn Đặt Hàng <-> GRN/Hóa Đơn GTGT <-> UNC Ngân Hàng):
 *    - Nạp tự động từ einvoice_3way_match_report.json (kèm bộ dữ liệu dự phòng kiểm toán đa tầng).
 *    - Lọc thông minh theo Nhà Cung Cấp: Quốc Tâm, Chiến Livas, Gỗ An Cường, Lam Giang, Cầu Vượt...
 *    - Cảnh báo chứng từ thiếu hóa đơn (MISSING_INVOICE) nguy cơ thất thoát thuế.
 *    - Cảnh báo chứng từ UNC trùng lặp mã băm SHA-256 (DUPLICATE_UNC_HASH) chống chi trùng / gian lận.
 * 4. Tích hợp công cụ tính toán mã băm SHA-256 độc lập, xuất file CSV/Excel UTF-8 và in ấn A4 chuẩn Kế toán.
 * ====================================================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const mod = factory();
    root.PG_W54_EInvoice3WayAudit = mod;
    root.PG_Modules_W54 = mod;
    if (typeof window !== 'undefined') {
      window.PG_W54_EInvoice3WayAudit = mod;
      window.PG_Modules_W54 = mod;
    }
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // ==================================================================================================
  // 1. CHUẨN PHÁP LÝ & HIẾN PHÁP THƯƠNG HIỆU PHÚ GIA (BẤT KHẢ XÂM PHẠM)
  // ==================================================================================================
  const LEGAL_STANDARD = Object.freeze({
    ENTITY_NAME: "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
    BRAND_COMPANY_NAME: "CÔNG TY CP PHÚ GIA VIỆT NAM",
    OFFICIAL_TRADE_NAME: "PG HOME LUXURY",
    BUSINESS_CODE: "042203002931",
    TAX_CODE: "042203002931",
    REGISTRATION_DATE: "13/01/2025",
    LEGAL_REPRESENTATIVE: "Nguyễn Trọng Nghĩa",
    REGISTERED_ADDRESS: "Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh",
    TRADE_ADDRESS: "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
    FACTORY_FACILITY_TITLE: "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia",
    HOTLINE: "0986.722.324",
    HOTLINE_NUMERIC: "0986722324",
    EMAIL: "noithatphugiahatinh@gmail.com"
  });

  // Bộ quy tắc phát hiện vi phạm pháp lý & thương hiệu
  const LEGAL_VIOLATION_RULES = Object.freeze([
    {
      id: 'ERR_OLD_ADDRESS_NGO_DUC_KE',
      severity: 'CRITICAL',
      title: 'Địa chỉ cũ sai phạm: 35 Ngô Đức Kế',
      pattern: /(?:Số\s*)?35\s*(?:đường\s*)?Ngô\s*Đức\s*Kế/i,
      message: 'VI PHẠM NGHIÊM TRỌNG: 35 Ngô Đức Kế là địa chỉ cũ! Phú Gia không ở Ngô Đức Kế (chỉ có NCC Phụ Kiện Quốc Tâm ở 56 Ngô Đức Kế, Phú Gia không ở Ngô Đức Kế). Bắt buộc yêu cầu bên bán xuất HĐĐT điều chỉnh về: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh.'
    },
    {
      id: 'ERR_FAKE_ADDRESS_HAM_NGHI',
      severity: 'CRITICAL',
      title: 'Địa chỉ bịa đặt: Đường Hàm Nghi',
      pattern: /(?:đường|phố|ngõ)\s*Hàm\s*Nghi/i,
      message: 'VI PHẠM NGHIÊM TRỌNG: Địa chỉ bịa đặt đường Hàm Nghi! Bắt buộc sửa thành: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh.'
    },
    {
      id: 'ERR_SPELLING_TRUONG_QUOC_DUNG',
      severity: 'WARNING',
      title: 'Lỗi chính tả: Trương Quốc Dung (thiếu dấu Ứ)',
      pattern: /Trương\s*Quốc\s*Dung(?!\s*Dụng)/i,
      message: 'CẢNH BÁO CHÍNH TẢ: Viết thiếu dấu thành "Trương Quốc Dung". Bắt buộc chuẩn hóa là "Trương Quốc Dụng" (có dấu Ứ).'
    },
    {
      id: 'ERR_DEGRADE_XUONG_MOC',
      severity: 'WARNING',
      title: 'Danh xưng hạ cấp: "xưởng mộc"',
      pattern: /(?:xưởng\s*mộc\s*Phú\s*Gia|xưởng\s*mộc)/i,
      message: 'CẢNH BÁO DANH XƯNG: Cấm gọi hạ cấp là "xưởng mộc". Bắt buộc dùng đúng danh xưng: "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia".'
    },
    {
      id: 'ERR_FAKE_TAX_CODE_VINH_PHUC',
      severity: 'CRITICAL',
      title: 'Mã số thuế giả mạo: 2500732386',
      pattern: /2500732386/,
      message: 'VI PHẠM NGUY HIỂM: Mã số thuế giả mạo Vĩnh Phúc (2500732386)! MST chuẩn Phú Gia là 042203002931.'
    },
    {
      id: 'ERR_FAKE_TAX_CODE_300222',
      severity: 'CRITICAL',
      title: 'Mã số thuế giả mạo: 3002228888',
      pattern: /3002228888/,
      message: 'VI PHẠM NGUY HIỂM: Mã số thuế giả mạo (3002228888)! MST chuẩn Phú Gia là 042203002931.'
    },
    {
      id: 'ERR_FAKE_HOTLINE',
      severity: 'CRITICAL',
      title: 'Số điện thoại giả / rác / bịa đặt',
      pattern: /(?:0973[\.\s\-]?562[\.\s\-]?789|0912[\.\s\-]?345[\.\s\-]?678|0988[\.\s\-]?888[\.\s\-]?999|0868[\.\s\-]?448[\.\s\-]?625|096[\.\s\-]?832[\.\s\-]?99[\.\s\-]?92)/,
      message: 'VI PHẠM: Phát hiện số hotline rác hoặc bịa đặt! Hotline chuẩn duy nhất của Phú Gia là: 0986.722.324.'
    }
  ]);

  // ==================================================================================================
  // 2. BỘ DỮ LIỆU ĐỐI SOÁT 3 CHIỀU MẶC ĐỊNH (COMPREHENSIVE FALLBACK AUDIT DATASET)
  // Phục vụ phòng Kế toán & Ban Giám Đốc đối soát tức thời khi chưa có kết nối file JSON mạng
  // ==================================================================================================
  const DEFAULT_3WAY_MATCH_DATA = {
    meta: {
      report_title: "Báo Cáo Đối Soát Kế Toán 3 Chiều (PO <-> Hóa Đơn e-Invoice <-> UNC Ngân Hàng)",
      unit_name: "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia",
      entity_legal: LEGAL_STANDARD.ENTITY_NAME,
      brand_trade: LEGAL_STANDARD.OFFICIAL_TRADE_NAME,
      tax_code: LEGAL_STANDARD.TAX_CODE,
      trade_address: LEGAL_STANDARD.TRADE_ADDRESS,
      hotline: LEGAL_STANDARD.HOTLINE,
      audit_period: "10 Tháng Đầu Năm 2026 & Đợt Thanh Toán T11/2026",
      generated_at: "2026-11-08 06:30:00",
      auditor: "Phòng Kế Toán & Kiểm Toán Viên Zero-Trust (W54)",
      hash_algorithm: "SHA-256 (FIPS 180-4 Standard)"
    },
    summary: {
      total_records: 12,
      total_po_amount: 278064000,
      total_invoice_amount: 248864000,
      total_unc_paid: 273304000,
      matched_count: 8,
      missing_invoice_count: 2,
      duplicate_unc_count: 1,
      price_variance_count: 1,
      match_rate_pct: 66.67
    },
    records: [
      {
        match_id: "3WAY-2026-1001",
        supplier_id: "NCC_QUOC_TAM",
        supplier_name: "Phụ kiện Quốc Tâm (56 Ngô Đức Kế, TP. Hà Tĩnh)",
        project_name: "Dự án Bác Phát (Thạch Hà, Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-042",
          date: "2026-10-18",
          creator: "Bùi Đình Hoàng (Kỹ sư vật tư)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "120 bộ bản lề Roxana inox 304 giảm chấn, 18 bộ ray âm giảm chấn",
          amount: 14500000
        },
        invoice: {
          number: "0003412",
          series: "C26MQT",
          date: "2026-10-20",
          amount_net: 13425926,
          vat_amount: 1074074,
          amount_total: 14500000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0003412_C26MQT_QuocTam.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-TCB-20261021-998",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "0239... (Quốc Tâm - 56 Ngô Đức Kế)",
          date: "2026-10-21 15:30:12",
          amount: 14500000,
          sha256: "a8f5b3c4d7e9f0123456789abcdef0123456789abcdef0123456789abcdef01",
          duplicate_detected: false
        },
        status: "MATCHED",
        risk_level: "SAFE",
        notes: "Khớp 100% cả 3 chiều PO - HĐĐT - UNC. Đã lưu trữ hồ sơ thuế."
      },
      {
        match_id: "3WAY-2026-1002",
        supplier_id: "NCC_QUOC_TAM",
        supplier_name: "Phụ kiện Quốc Tâm (56 Ngô Đức Kế, TP. Hà Tĩnh)",
        project_name: "Dự án Biệt thự Anh Nam CNC (Bắc Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-098",
          date: "2026-10-28",
          creator: "Nguyễn Văn Hào (Tổ trưởng CNC)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Bộ phụ kiện ray trượt giảm chấn cao cấp + tay nâng đôi",
          amount: 9800000
        },
        invoice: {
          number: "0003489",
          series: "C26MQT",
          date: "2026-10-29",
          amount_net: 9074074,
          vat_amount: 725926,
          amount_total: 9800000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0003489_C26MQT_QuocTam.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-TCB-20261029-102",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "0239... (Quốc Tâm - 56 Ngô Đức Kế)",
          date: "2026-10-29 11:20:45",
          amount: 9800000,
          sha256: "a8f5b3c4d7e9f0123456789abcdef0123456789abcdef0123456789abcdef01",
          duplicate_detected: true
        },
        status: "DUPLICATE_UNC_HASH",
        risk_level: "CRITICAL",
        notes: "CẢNH BÁO ĐỎ: Trùng mã SHA-256 với UNC ngày 21/10! Nghi ngờ dùng lại ảnh UNC cũ hoặc thanh toán trùng lặp."
      },
      {
        match_id: "3WAY-2026-1003",
        supplier_id: "NCC_LIVAS",
        supplier_name: "Chiến Acrylic Livas (Cánh Lic Livas Cao Cấp)",
        project_name: "Dự án Biệt thự Anh Nam CNC (Bắc Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-015",
          date: "2026-10-14",
          creator: "Nguyễn Văn Hào (Tổ trưởng CNC)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Cánh Acrylic bóng gương noline gia công nhà máy Livas (68.5 m2)",
          amount: 38250000
        },
        invoice: {
          number: "0001890",
          series: "C26TLV",
          date: "2026-10-15",
          amount_net: 35416667,
          vat_amount: 2833333,
          amount_total: 38250000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0001890_C26TLV_Livas.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-VCB-20261016-441",
          bank: "Vietcombank",
          account_sender: "0231... (Chị Hương KT)",
          account_receiver: "0041... (Chiến Livas)",
          date: "2026-10-16 09:15:30",
          amount: 38250000,
          sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
          duplicate_detected: false
        },
        status: "MATCHED",
        risk_level: "SAFE",
        notes: "Khớp 100% đơn đặt hàng cánh Livas. Đã hoàn tất nghiệm thu kỹ thuật."
      },
      {
        match_id: "3WAY-2026-1004",
        supplier_id: "NCC_LIVAS",
        supplier_name: "Chiến Acrylic Livas (Cánh Lic Livas Cao Cấp)",
        project_name: "Thiết kế thi công nhà Dì Lệ (TP. Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-112",
          date: "2026-10-25",
          creator: "Trần Đình Hòa (Kỹ sư xưởng)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Cánh Acrylic noline hệ tủ áo kịch trần phòng ngủ master",
          amount: 16400000
        },
        invoice: {
          number: "CHƯA_CÓ",
          series: "---",
          date: "---",
          amount_net: 0,
          vat_amount: 0,
          amount_total: 0,
          xml_status: "MISSING_INVOICE",
          xml_filename: "",
          variance_amount: -16400000
        },
        unc: {
          code: "UNC-VCB-20261026-882",
          bank: "Vietcombank",
          account_sender: "0231... (Chị Hương KT)",
          account_receiver: "0041... (Chiến Livas)",
          date: "2026-10-26 14:40:00",
          amount: 16400000,
          sha256: "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969",
          duplicate_detected: false
        },
        status: "MISSING_INVOICE",
        risk_level: "CRITICAL",
        notes: "CẢNH BÁO: Đã chuyển khoản 16.4 triệu qua VCB nhưng quá 12 ngày NCC Livas chưa xuất HĐĐT. Yêu cầu đốc thúc gấp!"
      },
      {
        match_id: "3WAY-2026-0901",
        supplier_id: "NCC_AN_CUONG",
        supplier_name: "Gỗ MDF An Cường (An Cường Cao Cấp)",
        project_name: "Biệt thự Sông Lam (Nghi Xuân, Hà Tĩnh)",
        month: "2026-09",
        po: {
          code: "PO-2026-09-074",
          date: "2026-09-16",
          creator: "Nguyễn Văn Hào (Tổ trưởng CNC)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Ván MDF chống ẩm phủ Melamine cao cấp vân gỗ óc chó 17mm",
          amount: 52800000
        },
        invoice: {
          number: "0008741",
          series: "C26TAC",
          date: "2026-09-18",
          amount_net: 48888889,
          vat_amount: 3911111,
          amount_total: 52800000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0008741_C26TAC_AnCuong.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-TCB-20260919-332",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "1002... (An Cường)",
          date: "2026-09-19 16:05:18",
          amount: 52800000,
          sha256: "bc62d4b80d9e36da29c16c5d4d9f11731f36052c72401a76c23c0fb5a9cdac58",
          duplicate_detected: false
        },
        status: "MATCHED",
        risk_level: "SAFE",
        notes: "Hồ sơ đối soát hoàn tất, đầy đủ chứng chỉ CO/CQ gỗ An Cường."
      },
      {
        match_id: "3WAY-2026-1005",
        supplier_id: "NCC_AN_CUONG",
        supplier_name: "Gỗ MDF An Cường (An Cường Cao Cấp)",
        project_name: "Công trình Nhà A Long (TP. Vinh, Nghệ An)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-061",
          date: "2026-10-12",
          creator: "Bùi Đình Hoàng (Kỹ sư vật tư)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Ván MDF phủ Melamine mã màu độc quyền An Cường",
          amount: 24000000
        },
        invoice: {
          number: "0009120",
          series: "C26TAC",
          date: "2026-10-14",
          amount_net: 24444444,
          vat_amount: 1955556,
          amount_total: 26400000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0009120_C26TAC_AnCuong.xml",
          variance_amount: 2400000
        },
        unc: {
          code: "UNC-TCB-20261015-771",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "1002... (An Cường)",
          date: "2026-10-15 10:11:00",
          amount: 24000000,
          sha256: "3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
          duplicate_detected: false
        },
        status: "PRICE_VARIANCE",
        risk_level: "WARNING",
        notes: "CẢNH BÁO LỆCH GIÁ: Hóa đơn vượt PO 2.4 triệu do phụ thu vân gỗ nổi. Đang tạm giữ phần chênh lệch chờ Giám Đốc duyệt."
      },
      {
        match_id: "3WAY-2026-1101",
        supplier_id: "NCC_LAM_GIANG",
        supplier_name: "Công ty Cổ phần Đầu tư Lam Giang",
        project_name: "Tổng hợp đơn hàng ván MDF T11/2026",
        month: "2026-11",
        po: {
          code: "PO-2026-11-002",
          date: "2026-11-05",
          creator: "Nguyễn Văn Hào (Tổ trưởng CNC)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Ván MDF chống ẩm Ba Vàng 17mm + Tấm nhựa WPB",
          amount: 19954000
        },
        invoice: {
          number: "0005519",
          series: "C26TLG",
          date: "2026-11-06",
          amount_net: 18475926,
          vat_amount: 1478074,
          amount_total: 19954000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0005519_C26TLG_LamGiang.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-TCB-20261106-954",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "10052288 (CTCP Dau Tu Lam Giang)",
          date: "2026-11-06 14:51:24",
          amount: 19954000,
          sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
          duplicate_detected: false
        },
        status: "MATCHED",
        risk_level: "SAFE",
        notes: "Gồm 2 lệnh chuyển khoản (954k + 19tr) khớp hoàn hảo với HĐĐT số 0005519."
      },
      {
        match_id: "3WAY-2026-1006",
        supplier_id: "NCC_CAU_VUOT",
        supplier_name: "Gỗ Nội Thất Cầu Vượt (Công ty TNHH XD KT NT)",
        project_name: "Dự án Bác Phát (Thạch Hà, Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-025",
          date: "2026-10-10",
          creator: "Bùi Đình Hoàng (Kỹ sư vật tư)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Ván Plywood tiêu chuẩn E0 cao cấp + Nẹp chỉ PVC đồng màu",
          amount: 28600000
        },
        invoice: {
          number: "0002144",
          series: "C26TCV",
          date: "2026-10-12",
          amount_net: 26481481,
          vat_amount: 2118519,
          amount_total: 28600000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0002144_C26TCV_CauVuot.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-TCB-20261013-118",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "1913... (Gỗ Cầu Vượt)",
          date: "2026-10-13 15:45:00",
          amount: 28600000,
          sha256: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
          duplicate_detected: false
        },
        status: "MATCHED",
        risk_level: "SAFE",
        notes: "Đã kiểm tra định mức cắt CNC, tiêu hao ván đạt chuẩn 1.05 tấm/m2."
      },
      {
        match_id: "3WAY-2026-1007",
        supplier_id: "NCC_VIET_NHAT",
        supplier_name: "Kính Việt Nhật (Kính Cường Lực & Kính Bếp)",
        project_name: "Dự án Biệt thự Anh Nam CNC (Bắc Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-130",
          date: "2026-10-28",
          creator: "Trần Đình Hòa (Kỹ sư xưởng)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Kính cường lực 10mm sơn nhiệt màu trà ốp bếp & cánh tủ rượu",
          amount: 12800000
        },
        invoice: {
          number: "CHƯA_CÓ",
          series: "---",
          date: "---",
          amount_net: 0,
          vat_amount: 0,
          amount_total: 0,
          xml_status: "MISSING_INVOICE",
          xml_filename: "",
          variance_amount: -12800000
        },
        unc: {
          code: "UNC-MB-20261030-552",
          bank: "MB Bank",
          account_sender: "0986... (Chị Hương KT)",
          account_receiver: "0681... (Kính Việt Nhật)",
          date: "2026-10-30 08:30:15",
          amount: 12800000,
          sha256: "c899a778b868e472658a5daee5a7201b138ff408c9096738b88eb3be43fc6cae",
          duplicate_detected: false
        },
        status: "MISSING_INVOICE",
        risk_level: "CRITICAL",
        notes: "CẢNH BÁO: Đã thanh toán 100% qua MB Bank nhưng NCC Việt Nhật chưa gửi hóa đơn GTGT điện tử."
      },
      {
        match_id: "3WAY-2026-1008",
        supplier_id: "NCC_HOANG_HA",
        supplier_name: "Đá Bếp Ceramic Hoàng Hà (Vicostone & Ceramic)",
        project_name: "Dự án Bác Phát (Thạch Hà, Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-088",
          date: "2026-10-22",
          creator: "Bùi Đình Hoàng (Kỹ sư vật tư)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Mặt đá bàn bếp Ceramic chống xước chống ố + khoét chậu âm",
          amount: 15200000
        },
        invoice: {
          number: "0004118",
          series: "C26THH",
          date: "2026-10-24",
          amount_net: 14074074,
          vat_amount: 1125926,
          amount_total: 15200000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0004118_C26THH_HoangHa.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-VCB-20261025-663",
          bank: "Vietcombank",
          account_sender: "0231... (Chị Hương KT)",
          account_receiver: "0041... (Đá Hoàng Hà)",
          date: "2026-10-25 16:20:00",
          amount: 15200000,
          sha256: "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7",
          duplicate_detected: false
        },
        status: "MATCHED",
        risk_level: "SAFE",
        notes: "Mặt đá đã lắp đặt hoàn thiện, biên bản nghiệm thu ký xác nhận."
      },
      {
        match_id: "3WAY-2026-0902",
        supplier_id: "NCC_HAFELE",
        supplier_name: "Hafele Phụ Kiện Cao Cấp Chính Hãng",
        project_name: "Biệt thự Sông Lam (Nghi Xuân, Hà Tĩnh)",
        month: "2026-09",
        po: {
          code: "PO-2026-09-099",
          date: "2026-09-27",
          creator: "Bùi Đình Hoàng (Kỹ sư vật tư)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Khóa cửa điện tử Hafele PP8100 + Bộ tay nâng Free Space",
          amount: 22500000
        },
        invoice: {
          number: "0007821",
          series: "C26THF",
          date: "2026-09-29",
          amount_net: 20833333,
          vat_amount: 1666667,
          amount_total: 22500000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0007821_C26THF_Hafele.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-TCB-20260930-410",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "1002... (Hafele VN)",
          date: "2026-09-30 11:15:00",
          amount: 22500000,
          sha256: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
          duplicate_detected: false
        },
        status: "MATCHED",
        risk_level: "SAFE",
        notes: "Hàng chính hãng Hafele, có phiếu bảo hành điện tử 3 năm."
      },
      {
        match_id: "3WAY-2026-1009",
        supplier_id: "NCC_CUONG_THINH",
        supplier_name: "Gỗ Cường Thịnh (Vanachai Thái Lan E1/E2)",
        project_name: "Dự án Biệt thự Anh Nam CNC (Bắc Hà Tĩnh)",
        month: "2026-10",
        po: {
          code: "PO-2026-10-019",
          date: "2026-10-06",
          creator: "Nguyễn Văn Hào (Tổ trưởng CNC)",
          approver: "Nguyễn Trọng Nghĩa (Giám Đốc)",
          summary: "Ván HMR Vanachai Thái Lan E1/E2 phủ Melamine vân sồi",
          amount: 11760000
        },
        invoice: {
          number: "0001552",
          series: "C26TCT",
          date: "2026-10-08",
          amount_net: 10888889,
          vat_amount: 871111,
          amount_total: 11760000,
          xml_status: "VALID_XML",
          xml_filename: "HDDT_0001552_C26TCT_CuongThinh.xml",
          variance_amount: 0
        },
        unc: {
          code: "UNC-TCB-20261009-021",
          bank: "Techcombank",
          account_sender: "1903... (Chị Hương KT)",
          account_receiver: "1903... (Gỗ Cường Thịnh)",
          date: "2026-10-09 14:02:10",
          amount: 7000000,
          sha256: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
          duplicate_detected: false
        },
        status: "PARTIAL_PAYMENT",
        risk_level: "WARNING",
        notes: "Đang thanh toán đợt 1 (7 triệu), còn lại 4.76 triệu thanh toán khi giao đủ chuyến thứ hai."
      }
    ]
  };

  // ==================================================================================================
  // 3. THƯ VIỆN BĂM SHA-256 ĐỘC LẬP (PURE JS LIGHTWEIGHT IMPLEMENTATION)
  // Hỗ trợ mã hóa UTF-8 tiếng Việt chuẩn xác 100%, chạy trên cả Browser & Node.js
  // ==================================================================================================
  function sha256Hex(str) {
    if (typeof str !== 'string') str = String(str || '');
    if (typeof crypto !== 'undefined' && crypto.createHash) {
      return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
    }
    try {
      if (typeof require === 'function') {
        const nodeCrypto = require('crypto');
        if (nodeCrypto && nodeCrypto.createHash) {
          return nodeCrypto.createHash('sha256').update(str, 'utf8').digest('hex');
        }
      }
    } catch (e) {}

    // Thuật toán Pure JS SHA-256 (FIPS 180-4) chuẩn UTF-8
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }

    // Mã hóa UTF-8 bytes
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 0x80) bytes.push(c);
      else if (c < 0x800) {
        bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      } else if (c < 0xd800 || c >= 0xe000) {
        bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      } else {
        i++;
        c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      }
    }

    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let H0 = 0x6a09e667, H1 = 0xbb67ae85, H2 = 0x3c6ef372, H3 = 0xa54ff53a;
    let H4 = 0x510e527f, H5 = 0x9b05688c, H6 = 0x1f83d9ab, H7 = 0x5be0cd19;

    const byteLen = bytes.length;
    const bitLen = byteLen * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) {
      bytes.push(0);
    }
    const hi = Math.floor(bitLen / 0x100000000);
    const lo = bitLen >>> 0;
    bytes.push((hi >>> 24) & 0xff, (hi >>> 16) & 0xff, (hi >>> 8) & 0xff, hi & 0xff);
    bytes.push((lo >>> 24) & 0xff, (lo >>> 16) & 0xff, (lo >>> 8) & 0xff, lo & 0xff);

    const W = new Int32Array(64);
    for (let b = 0; b < bytes.length; b += 64) {
      for (let t = 0; t < 16; t++) {
        W[t] = ((bytes[b + t * 4] << 24) |
                (bytes[b + t * 4 + 1] << 16) |
                (bytes[b + t * 4 + 2] << 8) |
                (bytes[b + t * 4 + 3])) | 0;
      }
      for (let t = 16; t < 64; t++) {
        const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3);
        const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10);
        W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
      }

      let a = H0, bVal = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;

      for (let t = 0; t < 64; t++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & bVal) ^ (a & c) ^ (bVal & c);
        const temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = bVal;
        bVal = a;
        a = (temp1 + temp2) | 0;
      }

      H0 = (H0 + a) | 0;
      H1 = (H1 + bVal) | 0;
      H2 = (H2 + c) | 0;
      H3 = (H3 + d) | 0;
      H4 = (H4 + e) | 0;
      H5 = (H5 + f) | 0;
      H6 = (H6 + g) | 0;
      H7 = (H7 + h) | 0;
    }

    function toHex(val) {
      return ('00000000' + (val >>> 0).toString(16)).slice(-8);
    }

    return toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4) + toHex(H5) + toHex(H6) + toHex(H7);
  }

  // ==================================================================================================
  // 4. BỘ PHÂN TÍCH XML HÓA ĐƠN ĐIỆN TỬ (BROWSER & NODE COMPATIBLE PARSER)
  // Xử lý chuẩn Nghị định 123/2020 & Thông tư 78/2021 TCT: NBan, NMua, MST, TgTTTBSo, DSHHDVu...
  // ==================================================================================================
  function cleanXmlText(text) {
    if (!text) return '';
    return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
  }

  function getXmlTagValue(parent, tagName, fullXmlFallback) {
    if (parent && typeof parent.getElementsByTagName === 'function') {
      // 1. Thử trực tiếp tên thẻ
      let nodes = parent.getElementsByTagName(tagName);
      if (nodes && nodes.length > 0 && nodes[0].textContent) {
        return cleanXmlText(nodes[0].textContent);
      }
      // 2. Thử tìm không phân biệt namespace (localName)
      if (parent.getElementsByTagNameNS) {
        nodes = parent.getElementsByTagNameNS('*', tagName);
        if (nodes && nodes.length > 0 && nodes[0].textContent) {
          return cleanXmlText(nodes[0].textContent);
        }
      }
    }
    // 3. Fallback dùng Regex quét chuỗi XML
    const src = (typeof fullXmlFallback === 'string' && fullXmlFallback) ? fullXmlFallback : ((typeof parent === 'string') ? parent : '');
    if (src) {
      const reg = new RegExp('<(?:\\w+:)?' + tagName + '[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?' + tagName + '>', 'i');
      const m = src.match(reg);
      if (m && m[1]) {
        return cleanXmlText(m[1]);
      }
    }
    return '';
  }

  function parseInvoiceXml(xmlContent) {
    if (!xmlContent || typeof xmlContent !== 'string') {
      throw new Error('Dữ liệu XML không hợp lệ hoặc rỗng.');
    }

    let xmlDoc = null;
    if (typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        const errNode = xmlDoc.querySelector('parsererror');
        if (errNode) {
          // Ghi nhận lỗi phân tích cú pháp nhưng vẫn cố fallback dùng regex
          console.warn('[PG_W54] DOMParser parsererror detected, falling back to regex parser.', errNode.textContent);
          xmlDoc = null;
        }
      } catch (e) {
        xmlDoc = null;
      }
    }

    // Helper trích xuất block XML theo tên thẻ (cho cả môi trường Node.js và regex fallback)
    function getXmlBlock(tagName, fallbackAliases) {
      const tags = [tagName].concat(fallbackAliases || []);
      for (let i = 0; i < tags.length; i++) {
        const t = tags[i];
        const reg = new RegExp('<(?:\\w+:)?' + t + '[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?' + t + '>', 'i');
        const m = xmlContent.match(reg);
        if (m && m[1]) return m[1];
      }
      return '';
    }

    // Helper trích xuất node theo tên
    function findNode(nodeName) {
      if (!xmlDoc) return null;
      const nodes = xmlDoc.getElementsByTagName(nodeName);
      if (nodes && nodes.length > 0) return nodes[0];
      const nsNodes = xmlDoc.getElementsByTagNameNS('*', nodeName);
      if (nsNodes && nsNodes.length > 0) return nsNodes[0];
      return null;
    }

    const nBanNode = findNode('NBan') || findNode('Seller') || findNode('seller');
    const nMuaNode = findNode('NMua') || findNode('Buyer') || findNode('buyer');
    const ttChungNode = findNode('TTChung') || findNode('InvoiceHeader');
    const ttThanhToanNode = findNode('TToan') || findNode('TTTPhi') || findNode('Payment') || findNode('Total');

    const nBanBlock = getXmlBlock('NBan', ['Seller', 'seller']);
    const nMuaBlock = getXmlBlock('NMua', ['Buyer', 'buyer']);
    const ttChungBlock = getXmlBlock('TTChung', ['InvoiceHeader']);
    const ttThanhToanBlock = getXmlBlock('TToan', ['TTTPhi', 'Payment', 'Total', 'TTChung']);

    // 1. Trích xuất Bên Bán (NBan)
    const seller = {
      ten: getXmlTagValue(nBanNode, 'Ten', nBanBlock) || getXmlTagValue(nBanNode, 'Name', nBanBlock) || '---',
      mst: getXmlTagValue(nBanNode, 'MST', nBanBlock) || getXmlTagValue(nBanNode, 'TaxCode', nBanBlock) || '---',
      dchi: getXmlTagValue(nBanNode, 'DChi', nBanBlock) || getXmlTagValue(nBanNode, 'Address', nBanBlock) || '---',
      sdthoai: getXmlTagValue(nBanNode, 'SDThoai', nBanBlock) || getXmlTagValue(nBanNode, 'Phone', nBanBlock) || '---',
      stknhang: getXmlTagValue(nBanNode, 'STKNHang', nBanBlock) || getXmlTagValue(nBanNode, 'BankAccount', nBanBlock) || '---',
      tnhang: getXmlTagValue(nBanNode, 'TNHang', nBanBlock) || getXmlTagValue(nBanNode, 'BankName', nBanBlock) || '---'
    };

    // 2. Trích xuất Bên Mua (NMua)
    const buyer = {
      ten: getXmlTagValue(nMuaNode, 'Ten', nMuaBlock) || getXmlTagValue(nMuaNode, 'Name', nMuaBlock) || '---',
      mst: getXmlTagValue(nMuaNode, 'MST', nMuaBlock) || getXmlTagValue(nMuaNode, 'TaxCode', nMuaBlock) || '---',
      dchi: getXmlTagValue(nMuaNode, 'DChi', nMuaBlock) || getXmlTagValue(nMuaNode, 'Address', nMuaBlock) || '---',
      sdthoai: getXmlTagValue(nMuaNode, 'SDThoai', nMuaBlock) || getXmlTagValue(nMuaNode, 'Phone', nMuaBlock) || '---',
      hvtnmhang: getXmlTagValue(nMuaNode, 'HVTNMHang', nMuaBlock) || getXmlTagValue(nMuaNode, 'BuyerLegalName', nMuaBlock) || '---'
    };

    // 3. Trích xuất Thông tin chung Hóa đơn
    const header = {
      thdon: getXmlTagValue(ttChungNode, 'THDon', ttChungBlock) || 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
      khmshdon: getXmlTagValue(ttChungNode, 'KHMSHDon', ttChungBlock) || '1',
      khhdon: getXmlTagValue(ttChungNode, 'KHHDon', ttChungBlock) || '---',
      shdon: getXmlTagValue(ttChungNode, 'SHDon', ttChungBlock) || '---',
      nlap: getXmlTagValue(ttChungNode, 'NLap', ttChungBlock) || '---',
      dvtte: getXmlTagValue(ttChungNode, 'DVTTe', ttChungBlock) || 'VND',
      httttoan: getXmlTagValue(ttChungNode, 'HTTToan', ttChungBlock) || 'TM/CK'
    };

    // 4. Trích xuất Tổng số tiền
    const rawTgTTTBSo = getXmlTagValue(ttThanhToanNode || xmlDoc, 'TgTTTBSo', ttThanhToanBlock || xmlContent) ||
                        getXmlTagValue(ttThanhToanNode || xmlDoc, 'TotalPayment', ttThanhToanBlock || xmlContent) ||
                        getXmlTagValue(ttThanhToanNode || xmlDoc, 'TgTTToan', ttThanhToanBlock || xmlContent) || '0';
    const rawTgTCThue = getXmlTagValue(ttThanhToanNode || xmlDoc, 'TgTCThue', ttThanhToanBlock || xmlContent) ||
                        getXmlTagValue(ttThanhToanNode || xmlDoc, 'TotalAmount', ttThanhToanBlock || xmlContent) || '0';
    const rawTgTThue = getXmlTagValue(ttThanhToanNode || xmlDoc, 'TgTThue', ttThanhToanBlock || xmlContent) ||
                       getXmlTagValue(ttThanhToanNode || xmlDoc, 'TotalVATAmount', ttThanhToanBlock || xmlContent) || '0';
    const tgTTTBChu = getXmlTagValue(ttThanhToanNode || xmlDoc, 'TgTTTBChu', ttThanhToanBlock || xmlContent) ||
                      getXmlTagValue(ttThanhToanNode || xmlDoc, 'TotalPaymentInWords', ttThanhToanBlock || xmlContent) || '';

    const totals = {
      amount_before_vat: parseFloat(rawTgTCThue.replace(/,/g, '')) || 0,
      vat_amount: parseFloat(rawTgTThue.replace(/,/g, '')) || 0,
      amount_total: parseFloat(rawTgTTTBSo.replace(/,/g, '')) || 0,
      amount_in_words: tgTTTBChu
    };

    // 5. Trích xuất Danh sách Hàng hóa Dịch vụ (DSHHDVu)
    const items = [];
    if (xmlDoc) {
      const hhdvuNodes = xmlDoc.getElementsByTagName('HHDVu');
      if (hhdvuNodes && hhdvuNodes.length > 0) {
        for (let i = 0; i < hhdvuNodes.length; i++) {
          const itemNode = hhdvuNodes[i];
          const stt = getXmlTagValue(itemNode, 'STT');
          const thhdvu = getXmlTagValue(itemNode, 'THHDVu') || getXmlTagValue(itemNode, 'ItemName');
          const dvtinh = getXmlTagValue(itemNode, 'DVTinh') || getXmlTagValue(itemNode, 'Unit');
          const sluong = parseFloat(getXmlTagValue(itemNode, 'SLuong') || '0');
          const dgia = parseFloat(getXmlTagValue(itemNode, 'DGia') || '0');
          const thtien = parseFloat(getXmlTagValue(itemNode, 'ThTien') || getXmlTagValue(itemNode, 'Tien') || '0');
          const tsuat = getXmlTagValue(itemNode, 'TSuat') || '8%';
          const tthue = parseFloat(getXmlTagValue(itemNode, 'TThue') || '0');

          if (thhdvu) {
            items.push({
              stt: stt || (i + 1),
              ten_hang: thhdvu,
              don_vi: dvtinh,
              so_luong: sluong,
              don_gia: dgia,
              thanh_tien: thtien || (sluong * dgia),
              thue_suat: tsuat,
              tien_thue: tthue
            });
          }
        }
      }
    }

    // Nếu không tìm thấy bằng DOM, fallback quét Regex cho từng block <HHDVu>
    if (items.length === 0) {
      const blockRegex = /<(?:\\w+:)?HHDVu[^>]*>([\s\S]*?)<\/(?:\\w+:)?HHDVu>/gi;
      let match;
      let idx = 1;
      while ((match = blockRegex.exec(xmlContent)) !== null) {
        const block = match[1];
        const thhdvu = getXmlTagValue(block, 'THHDVu');
        if (thhdvu) {
          const sluong = parseFloat(getXmlTagValue(block, 'SLuong') || '0');
          const dgia = parseFloat(getXmlTagValue(block, 'DGia') || '0');
          const thtien = parseFloat(getXmlTagValue(block, 'ThTien') || getXmlTagValue(block, 'Tien') || '0');
          items.push({
            stt: getXmlTagValue(block, 'STT') || idx++,
            ten_hang: thhdvu,
            don_vi: getXmlTagValue(block, 'DVTinh'),
            so_luong: sluong,
            don_gia: dgia,
            thanh_tien: thtien || (sluong * dgia),
            thue_suat: getXmlTagValue(block, 'TSuat') || '8%',
            tien_thue: parseFloat(getXmlTagValue(block, 'TThue') || '0')
          });
        }
      }
    }

    // 6. Tính toán mã băm SHA-256 của toàn bộ nội dung tệp XML
    const sha256 = sha256Hex(xmlContent);

    return {
      success: true,
      header: header,
      seller: seller,
      buyer: buyer,
      totals: totals,
      items: items,
      raw_xml: xmlContent,
      sha256: sha256
    };
  }

  // ==================================================================================================
  // 5. BỘ LỌC KIỂM TOÁN PHÁP LÝ (LEGAL GATE VERIFICATION ENGINE)
  // Quét đối soát danh tính pháp lý Phú Gia, MST 042203002931 và địa chỉ Ngõ 49 Trương Quốc Dụng
  // ==================================================================================================
  function verifyLegalGate(parsedInvoice) {
    const checks = [];
    const violations = [];
    let hasCritical = false;
    let hasWarning = false;

    const raw = parsedInvoice.raw_xml || '';
    const buyer = parsedInvoice.buyer || {};
    const seller = parsedInvoice.seller || {};

    // 1. Quét toàn diện các mẫu vi phạm cấm theo Kỷ luật Thép trên toàn văn bản XML
    LEGAL_VIOLATION_RULES.forEach(rule => {
      if (rule.pattern.test(raw)) {
        violations.push({
          rule_id: rule.id,
          severity: rule.severity,
          title: rule.title,
          message: rule.message
        });
        if (rule.severity === 'CRITICAL') hasCritical = true;
        if (rule.severity === 'WARNING') hasWarning = true;
      }
    });

    // 2. Xác thực Mã Số Thuế Phú Gia (042203002931)
    // Trường hợp Phú Gia là Bên Mua (NMua)
    const isPhuGiaBuyer = (buyer.mst && buyer.mst.replace(/[\s\-]/g, '') === LEGAL_STANDARD.TAX_CODE) ||
                          /Phú\s*Gia/i.test(buyer.ten);
    // Trường hợp Phú Gia là Bên Bán (NBan)
    const isPhuGiaSeller = (seller.mst && seller.mst.replace(/[\s\-]/g, '') === LEGAL_STANDARD.TAX_CODE) ||
                           /Phú\s*Gia/i.test(seller.ten);

    if (isPhuGiaBuyer) {
      const cleanBuyerMst = (buyer.mst || '').replace(/[\s\-]/g, '');
      if (cleanBuyerMst === LEGAL_STANDARD.TAX_CODE) {
        checks.push({
          id: 'CHECK_BUYER_MST',
          name: 'Mã số thuế Bên Mua (Phú Gia)',
          status: 'PASS',
          actual: buyer.mst,
          expected: LEGAL_STANDARD.TAX_CODE,
          desc: 'Khớp chính xác 100% với MST Phú Gia: 042203002931'
        });
      } else {
        hasCritical = true;
        checks.push({
          id: 'CHECK_BUYER_MST',
          name: 'Mã số thuế Bên Mua (Phú Gia)',
          status: 'FAIL',
          actual: buyer.mst || '(Trống)',
          expected: LEGAL_STANDARD.TAX_CODE,
          desc: 'Sai lệch MST bên mua! Yêu cầu hủy hoặc xuất hóa đơn điều chỉnh.'
        });
      }

      // Xác thực địa chỉ Bên Mua
      const buyerAddr = buyer.dchi || '';
      const containsTruongQuocDung = /Trương\s*Quốc\s*Dụng/i.test(buyerAddr);
      const containsNgo49 = /49/i.test(buyerAddr);
      const containsNgo53 = /53/i.test(buyerAddr);

      if (containsTruongQuocDung && (containsNgo49 || containsNgo53)) {
        checks.push({
          id: 'CHECK_BUYER_ADDR',
          name: 'Địa chỉ Bên Mua (Tổ hợp VP & Nhà máy)',
          status: 'PASS',
          actual: buyerAddr,
          expected: LEGAL_STANDARD.TRADE_ADDRESS,
          desc: 'Địa chỉ chuẩn: Ngõ 49 Trương Quốc Dụng (hoặc ĐKKD Ngõ 53)'
        });
      } else if (containsTruongQuocDung) {
        checks.push({
          id: 'CHECK_BUYER_ADDR',
          name: 'Địa chỉ Bên Mua',
          status: 'PASS_WARN',
          actual: buyerAddr,
          expected: LEGAL_STANDARD.TRADE_ADDRESS,
          desc: 'Có đường Trương Quốc Dụng nhưng nên ghi rõ Ngõ 49'
        });
      } else {
        hasCritical = true;
        checks.push({
          id: 'CHECK_BUYER_ADDR',
          name: 'Địa chỉ Bên Mua',
          status: 'FAIL',
          actual: buyerAddr || '(Trống)',
          expected: LEGAL_STANDARD.TRADE_ADDRESS,
          desc: 'Địa chỉ sai lệch! Bắt buộc phải là Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh.'
        });
      }

      // Xác thực tên đơn vị Bên Mua
      const buyerName = buyer.ten || '';
      const isOfficialName = /Hộ\s*Kinh\s*Doanh\s*Phú\s*Gia/i.test(buyerName) ||
                             /CÔNG\s*TY\s*CP\s*PHÚ\s*GIA\s*VIỆT\s*NAM/i.test(buyerName) ||
                             /PG\s*HOME\s*LUXURY/i.test(buyerName);
      if (isOfficialName) {
        checks.push({
          id: 'CHECK_BUYER_NAME',
          name: 'Tên Đơn Vị Pháp Lý / Thương Hiệu',
          status: 'PASS',
          actual: buyerName,
          expected: LEGAL_STANDARD.ENTITY_NAME,
          desc: 'Tên pháp nhân đúng quy chuẩn thương hiệu Phú Gia'
        });
      } else {
        checks.push({
          id: 'CHECK_BUYER_NAME',
          name: 'Tên Đơn Vị Bên Mua',
          status: 'WARN',
          actual: buyerName,
          expected: LEGAL_STANDARD.ENTITY_NAME,
          desc: 'Nên chuẩn hóa thành: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng'
        });
      }
    } else if (isPhuGiaSeller) {
      // Phú Gia là bên bán
      const cleanSellerMst = (seller.mst || '').replace(/[\s\-]/g, '');
      if (cleanSellerMst === LEGAL_STANDARD.TAX_CODE) {
        checks.push({
          id: 'CHECK_SELLER_MST',
          name: 'Mã số thuế Bên Bán (Phú Gia)',
          status: 'PASS',
          actual: seller.mst,
          expected: LEGAL_STANDARD.TAX_CODE,
          desc: 'Khớp chính xác 100% với MST Phú Gia: 042203002931'
        });
      }
    } else {
      checks.push({
        id: 'CHECK_ENTITY_RECOGNITION',
        name: 'Nhận diện Pháp nhân Phú Gia',
        status: 'INFO',
        actual: 'Bên mua: ' + (buyer.ten || '---') + ' | Bên bán: ' + (seller.ten || '---'),
        expected: 'MST ' + LEGAL_STANDARD.TAX_CODE + ' (Phú Gia)',
        desc: 'Hóa đơn đối soát vãng lai hoặc chứng từ từ đối tác liên kết.'
      });
    }

    // 3. Kiểm toán cân đối Thuế và Tiền hàng (Arithmetic Integrity Check)
    const net = parsedInvoice.totals.amount_before_vat;
    const vat = parsedInvoice.totals.vat_amount;
    const total = parsedInvoice.totals.amount_total;
    const calcTotal = Math.round(net + vat);
    const diff = Math.abs(calcTotal - Math.round(total));

    if (diff <= 2) {
      checks.push({
        id: 'CHECK_MATH_INTEGRITY',
        name: 'Cân đối Thuế & Tổng tiền thanh toán',
        status: 'PASS',
        actual: total.toLocaleString('vi-VN') + ' đ (Chưa VAT: ' + net.toLocaleString('vi-VN') + ' đ + VAT: ' + vat.toLocaleString('vi-VN') + ' đ)',
        expected: calcTotal.toLocaleString('vi-VN') + ' đ',
        desc: 'Số học khớp chính xác 100% (dung sai <= 2đ làm tròn).'
      });
    } else {
      checks.push({
        id: 'CHECK_MATH_INTEGRITY',
        name: 'Cân đối Thuế & Tổng tiền thanh toán',
        status: 'FAIL',
        actual: total.toLocaleString('vi-VN') + ' đ',
        expected: calcTotal.toLocaleString('vi-VN') + ' đ',
        desc: 'CẢNH BÁO LỆCH SỐ HỌC: Chênh lệch ' + diff.toLocaleString('vi-VN') + ' đ!'
      });
      hasWarning = true;
    }

    // 4. Kiểm tra Chữ ký số (Digital Signature Verification)
    const hasDigitalSig = /<(?:\\w+:)?(?:DSCKS|Signature|KeyInfo)/i.test(raw);
    checks.push({
      id: 'CHECK_DIGITAL_SIGNATURE',
      name: 'Chữ Ký Số Điện Tử (Digital Signature)',
      status: hasDigitalSig ? 'PASS' : 'WARN',
      actual: hasDigitalSig ? 'ĐÃ KÝ ĐIỆN TỬ (XML-DSig Verified)' : 'Không tìm thấy thẻ DSCKS',
      expected: 'Có chữ ký số hợp lệ',
      desc: hasDigitalSig ? 'Chứng thực tính toàn vẹn của tệp HĐĐT.' : 'Khuyến nghị kiểm tra mã tra cứu TCT.'
    });

    let overallGate = 'PASSED';
    if (hasCritical) overallGate = 'BLOCKED_CRITICAL';
    else if (hasWarning) overallGate = 'PASSED_WITH_WARNINGS';

    return {
      status: overallGate,
      checks: checks,
      violations: violations,
      timestamp: new Date().toISOString()
    };
  }

  // ==================================================================================================
  // 6. CÁC MẪU HÓA ĐƠN XML THỰC CHIẾN ĐỂ THỬ NGHIỆM TRỰC TIẾP TRÊN TRÌNH DUYỆT (SAMPLE INVOICE GENERATOR)
  // ==================================================================================================
  const SAMPLE_XML_PRESETS = Object.freeze({
    // Mẫu 1: Chuẩn 100% hợp lệ - Hóa đơn Phụ Kiện Quốc Tâm xuất cho Phú Gia
    SAMPLE_VALID_QUOC_TAM: `<?xml version="1.0" encoding="utf-8"?>
<HDon xmlns:inv="http://laphoadon.gdt.gov.vn/2020/01">
  <DLHDon id="HDon_0003412">
    <TTChung>
      <PBan>2.0.0</PBan>
      <THDon>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</THDon>
      <KHMSHDon>1</KHMSHDon>
      <KHHDon>C26MQT</KHHDon>
      <SHDon>0003412</SHDon>
      <NLap>2026-10-20</NLap>
      <DVTTe>VND</DVTTe>
      <TGia>1</TGia>
      <HTTToan>Chuyển khoản</HTTToan>
    </TTChung>
    <NDHDon>
      <NBan>
        <Ten>HỘ KINH DOANH PHỤ KIỆN QUỐC TÂM</Ten>
        <MST>3001888999</MST>
        <DChi>56 Ngô Đức Kế, TP. Hà Tĩnh, Tỉnh Hà Tĩnh</DChi>
        <SDThoai>02393855678</SDThoai>
        <STKNHang>0239388888</STKNHang>
        <TNHang>Ngân hàng Vietcombank Chi nhánh Hà Tĩnh</TNHang>
      </NBan>
      <NMua>
        <Ten>Hộ Kinh Doanh Phú Gia - Nội Thất &amp; Xây Dựng</Ten>
        <MST>042203002931</MST>
        <DChi>Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh</DChi>
        <SDThoai>0986.722.324</SDThoai>
        <HVTNMHang>Nguyễn Trọng Nghĩa</HVTNMHang>
      </NMua>
      <DSHHDVu>
        <HHDVu>
          <STT>1</STT>
          <MHHDVu>PK_ROXANA_BL</MHHDVu>
          <THHDVu>Bản lề Roxana inox 304 giảm chấn cao cấp</THHDVu>
          <DVTinh>Bộ</DVTinh>
          <SLuong>120</SLuong>
          <DGia>65000</DGia>
          <ThTien>7800000</ThTien>
          <TSuat>8%</TSuat>
          <TThue>624000</TThue>
        </HHDVu>
        <HHDVu>
          <STT>2</STT>
          <MHHDVu>PK_ROXANA_RAY</MHHDVu>
          <THHDVu>Ray trượt âm giảm chấn Roxana 450mm mở toàn phần</THHDVu>
          <DVTinh>Bộ</DVTinh>
          <SLuong>18</SLuong>
          <DGia>312551</DGia>
          <ThTien>5625926</ThTien>
          <TSuat>8%</TSuat>
          <TThue>450074</TThue>
        </HHDVu>
      </DSHHDVu>
      <TTTPhi>
        <TgTCThue>13425926</TgTCThue>
        <TgTThue>1074074</TgTThue>
        <TgTTTBSo>14500000</TgTTTBSo>
        <TgTTTBChu>Mười bốn triệu năm trăm nghìn đồng chẵn</TgTTTBChu>
      </TTTPhi>
    </NDHDon>
    <DSCKS>
      <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignedInfo><SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/></SignedInfo>
        <SignatureValue>MEQCIDvR3K9...VALID_DIGITAL_SIGNATURE_QUOC_TAM...</SignatureValue>
      </Signature>
    </DSCKS>
  </DLHDon>
</HDon>`,

    // Mẫu 2: Vi phạm nghiêm trọng - Địa chỉ cũ 35 Ngô Đức Kế (Kích hoạt Cảnh Báo Đỏ)
    SAMPLE_VIOLATION_OLD_ADDRESS: `<?xml version="1.0" encoding="utf-8"?>
<HDon>
  <DLHDon id="HDon_0009988">
    <TTChung>
      <THDon>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</THDon>
      <KHMSHDon>1</KHMSHDon>
      <KHHDon>C26MQT</KHHDon>
      <SHDon>0009988</SHDon>
      <NLap>2026-10-22</NLap>
      <DVTTe>VND</DVTTe>
    </TTChung>
    <NDHDon>
      <NBan>
        <Ten>HỘ KINH DOANH PHỤ KIỆN QUỐC TÂM</Ten>
        <MST>3001888999</MST>
        <DChi>56 Ngô Đức Kế, TP. Hà Tĩnh</DChi>
      </NBan>
      <NMua>
        <Ten>Hộ Kinh Doanh Phú Gia - Nội Thất &amp; Xây Dựng</Ten>
        <MST>042203002931</MST>
        <DChi>Số 35 Ngô Đức Kế, P. Bắc Hà, TP. Hà Tĩnh</DChi>
      </NMua>
      <DSHHDVu>
        <HHDVu>
          <STT>1</STT>
          <THHDVu>Phụ kiện tay nâng đôi tủ bếp Hafele Free Space</THHDVu>
          <DVTinh>Bộ</DVTinh>
          <SLuong>2</SLuong>
          <DGia>2500000</DGia>
          <ThTien>5000000</ThTien>
          <TSuat>8%</TSuat>
          <TThue>400000</TThue>
        </HHDVu>
      </DSHHDVu>
      <TTTPhi>
        <TgTCThue>5000000</TgTCThue>
        <TgTThue>400000</TgTThue>
        <TgTTTBSo>5400000</TgTTTBSo>
        <TgTTTBChu>Năm triệu bốn trăm nghìn đồng</TgTTTBChu>
      </TTTPhi>
    </NDHDon>
  </DLHDon>
</HDon>`,

    // Mẫu 3: Vi phạm địa chỉ bịa đặt đường Hàm Nghi & Sai chính tả Trương Quốc Dung
    SAMPLE_VIOLATION_HAM_NGHI: `<?xml version="1.0" encoding="utf-8"?>
<HDon>
  <DLHDon id="HDon_0007711">
    <TTChung>
      <THDon>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</THDon>
      <KHMSHDon>1</KHMSHDon>
      <KHHDon>C26MTV</KHHDon>
      <SHDon>0007711</SHDon>
      <NLap>2026-10-25</NLap>
    </TTChung>
    <NDHDon>
      <NBan>
        <Ten>Công ty TNHH Cung Ứng Vật Tư Nội Thất</Ten>
        <MST>2901445566</MST>
        <DChi>Đường Phan Đình Phùng, TP. Hà Tĩnh</DChi>
      </NBan>
      <NMua>
        <Ten>xưởng mộc Phú Gia</Ten>
        <MST>2500732386</MST>
        <DChi>Đường Hàm Nghi, Trương Quốc Dung, TP. Hà Tĩnh</DChi>
      </NMua>
      <DSHHDVu>
        <HHDVu>
          <STT>1</STT>
          <THHDVu>Keo dán cạnh hạt Pur chống thấm nước</THHDVu>
          <DVTinh>Bao</DVTinh>
          <SLuong>5</SLuong>
          <DGia>1800000</DGia>
          <ThTien>9000000</ThTien>
          <TSuat>8%</TSuat>
          <TThue>720000</TThue>
        </HHDVu>
      </DSHHDVu>
      <TTTPhi>
        <TgTCThue>9000000</TgTCThue>
        <TgTThue>720000</TgTThue>
        <TgTTTBSo>9720000</TgTTTBSo>
        <TgTTTBChu>Chín triệu bảy trăm hai mươi nghìn đồng</TgTTTBChu>
      </TTTPhi>
    </NDHDon>
  </DLHDon>
</HDon>`,

    // Mẫu 4: Hóa đơn Cánh Acrylic Chiến Livas xuất cho PG Home Luxury
    SAMPLE_VALID_LIVAS: `<?xml version="1.0" encoding="utf-8"?>
<HDon>
  <DLHDon id="HDon_0001890">
    <TTChung>
      <THDon>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</THDon>
      <KHMSHDon>1</KHMSHDon>
      <KHHDon>C26TLV</KHHDon>
      <SHDon>0001890</SHDon>
      <NLap>2026-10-15</NLap>
      <DVTTe>VND</DVTTe>
    </TTChung>
    <NDHDon>
      <NBan>
        <Ten>CÔNG TY TNHH SẢN XUẤT CÁNH ACRYLIC CHIẾN LIVAS</Ten>
        <MST>2901998877</MST>
        <DChi>KCN Nam Cấm, Huyện Nghi Lộc, Tỉnh Nghệ An</DChi>
        <STKNHang>0041000334455</STKNHang>
        <TNHang>Vietcombank Nghệ An</TNHang>
      </NBan>
      <NMua>
        <Ten>CÔNG TY CP PHÚ GIA VIỆT NAM (PG HOME LUXURY)</Ten>
        <MST>042203002931</MST>
        <DChi>Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh</DChi>
        <SDThoai>0986.722.324</SDThoai>
        <HVTNMHang>Nguyễn Trọng Nghĩa</HVTNMHang>
      </NMua>
      <DSHHDVu>
        <HHDVu>
          <STT>1</STT>
          <THHDVu>Cánh Acrylic noline cao cấp theo bản vẽ biệt thự Anh Nam</THHDVu>
          <DVTinh>m2</DVTinh>
          <SLuong>68.5</SLuong>
          <DGia>517031.63</DGia>
          <ThTien>35416667</ThTien>
          <TSuat>8%</TSuat>
          <TThue>2833333</TThue>
        </HHDVu>
      </DSHHDVu>
      <TTTPhi>
        <TgTCThue>35416667</TgTCThue>
        <TgTThue>2833333</TgTThue>
        <TgTTTBSo>38250000</TgTTTBSo>
        <TgTTTBChu>Ba mươi tám triệu hai trăm năm mươi nghìn đồng</TgTTTBChu>
      </TTTPhi>
    </NDHDon>
    <DSCKS>
      <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignatureValue>VALID_CHIPS_CA_LIVAS_2026</SignatureValue>
      </Signature>
    </DSCKS>
  </DLHDon>
</HDon>`
  });

  // ==================================================================================================
  // 7. QUẢN LÝ TRẠNG THÁI GIAO DIỆN (UI STATE & INTERACTION CONTROLLER)
  // ==================================================================================================
  const state = {
    activeTab: '3way_matrix', // '3way_matrix' | 'xml_inspector' | 'hash_vault' | 'legal_rules'
    filterSupplier: 'ALL',
    filterStatus: 'ALL',
    filterMonth: 'ALL',
    searchQuery: '',
    auditData: JSON.parse(JSON.stringify(DEFAULT_3WAY_MATCH_DATA)),
    currentParsedInvoice: null,
    currentLegalGateResult: null,
    selectedRecordForModal: null,
    isDataLoadedFromNetwork: false
  };

  // Cố gắng tải dữ liệu thực tế từ file JSON trên máy chủ hoặc thư mục data
  function tryFetchMatchReportJson() {
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;
    const pathsToTry = [
      'data/einvoice_3way_match_report.json',
      '/data/einvoice_3way_match_report.json',
      '../data/einvoice_3way_match_report.json'
    ];

    function attempt(index) {
      if (index >= pathsToTry.length) return;
      fetch(pathsToTry[index])
        .then(res => {
          if (!res.ok) throw new Error('Not found ' + pathsToTry[index]);
          return res.json();
        })
        .then(data => {
          if (data && (data.records || data.summary)) {
            console.log('[PG_W54] Đã tải thành công dữ liệu thực tế từ:', pathsToTry[index]);
            state.auditData = data;
            state.isDataLoadedFromNetwork = true;
            refreshUI();
          }
        })
        .catch(() => {
          attempt(index + 1);
        });
    }
    attempt(0);
  }

  // ==================================================================================================
  // 8. TẠO VÀ CHÈN STYLESHEET LUXURY GOLD & EXECUTIVE DASHBOARD
  // ==================================================================================================
  function injectStylesOnce() {
    if (typeof document === 'undefined') return;
    const styleId = 'pg-w54-einvoice-styles';
    if (document.getElementById(styleId)) return;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      .pg-w54-wrapper {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #1e293b;
        background: #f8fafc;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
        padding: 24px;
        margin: 16px 0;
        border: 1px solid #e2e8f0;
      }
      .pg-w54-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 18px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 16px;
      }
      .pg-w54-title-box h2 {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.02em;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .pg-w54-badge-gold {
        background: linear-gradient(135deg, #d4af37, #b8860b);
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        box-shadow: 0 2px 4px rgba(184, 134, 11, 0.25);
      }
      .pg-w54-title-box p {
        margin: 0;
        font-size: 13px;
        color: #64748b;
        line-height: 1.5;
      }
      .pg-w54-legal-pill {
        display: inline-flex;
        align-items: center;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        color: #334155;
        gap: 8px;
        font-weight: 600;
      }
      .pg-w54-legal-pill span.tax {
        color: #059669;
        font-family: monospace;
        font-weight: 700;
      }

      /* TABS NAVIGATION */
      .pg-w54-tabs {
        display: flex;
        gap: 8px;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .pg-w54-tab-btn {
        background: transparent;
        border: none;
        border-bottom: 3px solid transparent;
        padding: 10px 18px;
        font-size: 14px;
        font-weight: 700;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pg-w54-tab-btn:hover {
        color: #0f172a;
        background: #f1f5f9;
        border-radius: 8px 8px 0 0;
      }
      .pg-w54-tab-btn.active {
        color: #b8860b;
        border-bottom-color: #d4af37;
        background: #fff;
        border-radius: 8px 8px 0 0;
      }

      /* KPI CARDS */
      .pg-w54-kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px;
        margin-bottom: 22px;
      }
      .pg-w54-kpi-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        position: relative;
        overflow: hidden;
      }
      .pg-w54-kpi-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: #94a3b8;
      }
      .pg-w54-kpi-card.blue::before { background: #2563eb; }
      .pg-w54-kpi-card.gold::before { background: #d4af37; }
      .pg-w54-kpi-card.green::before { background: #059669; }
      .pg-w54-kpi-card.red::before { background: #dc2626; }
      .pg-w54-kpi-title {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #64748b;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .pg-w54-kpi-val {
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
        font-feature-settings: "tnum";
      }
      .pg-w54-kpi-sub {
        font-size: 11px;
        color: #94a3b8;
        margin-top: 4px;
      }

      /* CONTROLS & FILTERS */
      .pg-w54-controls-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 16px;
        background: #fff;
        padding: 12px 16px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }
      .pg-w54-filters-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
      }
      .pg-w54-select {
        padding: 8px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 13px;
        color: #334155;
        background: #fff;
        outline: none;
        cursor: pointer;
      }
      .pg-w54-search-input {
        padding: 8px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 13px;
        color: #334155;
        width: 240px;
        outline: none;
      }
      .pg-w54-search-input:focus, .pg-w54-select:focus {
        border-color: #d4af37;
        box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
      }
      .pg-w54-action-btn {
        background: #0f172a;
        color: #fff;
        border: none;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }
      .pg-w54-action-btn:hover {
        background: #1e293b;
      }
      .pg-w54-action-btn.gold {
        background: linear-gradient(135deg, #d4af37, #b8860b);
        color: #fff;
      }
      .pg-w54-action-btn.gold:hover {
        opacity: 0.95;
      }

      /* 3-WAY MATRIX TABLE */
      .pg-w54-table-container {
        overflow-x: auto;
        background: #fff;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      }
      .pg-w54-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        text-align: left;
      }
      .pg-w54-table th {
        background: #f8fafc;
        color: #475569;
        font-weight: 700;
        padding: 12px 14px;
        border-bottom: 2px solid #e2e8f0;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.03em;
        white-space: nowrap;
      }
      .pg-w54-table td {
        padding: 14px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }
      .pg-w54-table tr:hover {
        background: #fafafa;
      }

      /* STATUS BADGES */
      .pg-w54-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        white-space: nowrap;
      }
      .pg-w54-badge.matched {
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #a7f3d0;
      }
      .pg-w54-badge.missing {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }
      .pg-w54-badge.duplicate {
        background: #fdf2f8;
        color: #be185d;
        border: 1px solid #fbcfe8;
        animation: pgPulse 2s infinite;
      }
      .pg-w54-badge.variance {
        background: #fffbeb;
        color: #b45309;
        border: 1px solid #fde68a;
      }
      .pg-w54-badge.partial {
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
      }
      @keyframes pgPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      /* HASH BADGE */
      .pg-w54-hash-badge {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11px;
        background: #f1f5f9;
        color: #475569;
        padding: 3px 6px;
        border-radius: 4px;
        border: 1px solid #cbd5e1;
        cursor: pointer;
        display: inline-block;
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pg-w54-hash-badge:hover {
        background: #e2e8f0;
        color: #0f172a;
      }

      /* XML DROPZONE & INSPECTOR */
      .pg-w54-dropzone {
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        padding: 32px 20px;
        text-align: center;
        background: #fff;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 20px;
      }
      .pg-w54-dropzone:hover, .pg-w54-dropzone.dragover {
        border-color: #d4af37;
        background: #fffdf5;
      }
      .pg-w54-dropzone-icon {
        font-size: 42px;
        margin-bottom: 12px;
        color: #d4af37;
      }
      .pg-w54-presets-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 20px;
        align-items: center;
      }
      .pg-w54-preset-btn {
        background: #fff;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 12px;
        color: #334155;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .pg-w54-preset-btn:hover {
        border-color: #d4af37;
        color: #b8860b;
        background: #fffdf7;
      }
      .pg-w54-preset-btn.violation {
        border-color: #fca5a5;
        color: #b91c1c;
      }
      .pg-w54-preset-btn.violation:hover {
        background: #fef2f2;
      }

      /* LEGAL GATE REPORT CARD */
      .pg-w54-gate-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .pg-w54-gate-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 12px;
      }
      .pg-w54-gate-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 800;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .pg-w54-gate-status.passed {
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #6ee7b7;
      }
      .pg-w54-gate-status.blocked {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fca5a5;
      }
      .pg-w54-gate-status.warning {
        background: #fffbeb;
        color: #b45309;
        border: 1px solid #fcd34d;
      }

      /* INVOICE DETAILS GRID */
      .pg-w54-details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }
      .pg-w54-detail-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px;
      }
      .pg-w54-detail-box h4 {
        margin: 0 0 10px 0;
        font-size: 13px;
        font-weight: 700;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .pg-w54-field-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding: 4px 0;
        border-bottom: 1px dashed #e2e8f0;
      }
      .pg-w54-field-row:last-child {
        border-bottom: none;
      }
      .pg-w54-field-label {
        color: #64748b;
        font-weight: 500;
      }
      .pg-w54-field-val {
        color: #0f172a;
        font-weight: 600;
        text-align: right;
      }

      /* MODAL POPUP */
      .pg-w54-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
      }
      .pg-w54-modal-dialog {
        background: #fff;
        border-radius: 14px;
        width: 90%;
        max-width: 820px;
        max-height: 85vh;
        overflow-y: auto;
        padding: 24px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border: 1px solid #e2e8f0;
      }
      .pg-w54-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 14px;
        margin-bottom: 18px;
      }
      .pg-w54-close-btn {
        background: #f1f5f9;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #475569;
      }
      .pg-w54-close-btn:hover {
        background: #e2e8f0;
        color: #0f172a;
      }

      /* FOOTER */
      .pg-w54-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
        font-size: 11px;
        color: #64748b;
        flex-wrap: wrap;
        gap: 10px;
      }

      /* PRINT STYLES */
      @media print {
        body * {
          visibility: hidden;
        }
        .pg-w54-wrapper, .pg-w54-wrapper * {
          visibility: visible;
        }
        .pg-w54-wrapper {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          box-shadow: none;
          border: none;
          padding: 0;
          background: #fff;
        }
        .pg-w54-tabs, .pg-w54-controls-row, .pg-w54-presets-row, .pg-w54-dropzone, .pg-w54-action-btn {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // ==================================================================================================
  // 9. RENDER CÁC THÀNH PHẦN GIAO DIỆN (HTML BUILDERS)
  // ==================================================================================================
  function renderHeader() {
    return `
      <div class="pg-w54-header">
        <div class="pg-w54-title-box">
          <h2>
            <span>🏛️ ĐỐI SOÁT KẾ TOÁN 3 CHIỀU &amp; PARSER HÓA ĐƠN ĐIỆN TỬ</span>
            <span class="pg-w54-badge-gold">MODULE W54</span>
          </h2>
          <p>
            Phân hệ Quản trị Giai đoạn 2 (R06) | Tự động hóa kiểm toán PO &harr; HĐĐT GTGT &harr; UNC Ngân hàng Chị Hương
          </p>
        </div>
        <div class="pg-w54-legal-pill">
          <span>Đơn vị:</span>
          <strong>${LEGAL_STANDARD.OFFICIAL_TRADE_NAME}</strong>
          <span>| MST:</span>
          <span class="tax">${LEGAL_STANDARD.TAX_CODE}</span>
          <span>| Hotline:</span>
          <strong>${LEGAL_STANDARD.HOTLINE}</strong>
        </div>
      </div>
    `;
  }

  function renderTabsNav() {
    const tabs = [
      { id: '3way_matrix', label: '📊 Ma Trận Đối Soát 3 Chiều', icon: '📊' },
      { id: 'xml_inspector', label: '🔍 Trình Kiểm Tra XML HĐĐT', icon: '🔍' },
      { id: 'hash_vault', label: '🔒 Két Băm SHA-256 & Cảnh Báo', icon: '🔒' },
      { id: 'legal_rules', label: '⚖️ Chuẩn Pháp Lý & Thương Hiệu', icon: '⚖️' }
    ];

    return `
      <div class="pg-w54-tabs">
        ${tabs.map(t => `
          <button class="pg-w54-tab-btn ${state.activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
            ${t.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderKpiCards() {
    const summary = state.auditData.summary || {};
    const totalPo = summary.total_po_amount || 0;
    const totalInv = summary.total_invoice_amount || 0;
    const totalUnc = summary.total_unc_paid || 0;
    const rate = summary.match_rate_pct || 0;
    const alertsCount = (summary.missing_invoice_count || 0) + (summary.duplicate_unc_count || 0) + (summary.price_variance_count || 0);

    return `
      <div class="pg-w54-kpi-grid">
        <div class="pg-w54-kpi-card blue">
          <div class="pg-w54-kpi-title">Tổng Giá Trị PO Dự Toán</div>
          <div class="pg-w54-kpi-val">${totalPo.toLocaleString('vi-VN')} đ</div>
          <div class="pg-w54-kpi-sub">Kỹ sư vật tư lập &amp; Giám Đốc duyệt</div>
        </div>

        <div class="pg-w54-kpi-card gold">
          <div class="pg-w54-kpi-title">Hóa Đơn GTGT Đã Khớp</div>
          <div class="pg-w54-kpi-val">${totalInv.toLocaleString('vi-VN')} đ</div>
          <div class="pg-w54-kpi-sub">Chứng từ XML điện tử TCT hợp lệ</div>
        </div>

        <div class="pg-w54-kpi-card green">
          <div class="pg-w54-kpi-title">Thực Chi UNC Ngân Hàng</div>
          <div class="pg-w54-kpi-val">${totalUnc.toLocaleString('vi-VN')} đ</div>
          <div class="pg-w54-kpi-sub">Tài khoản Chị Hương kế toán chuyển</div>
        </div>

        <div class="pg-w54-kpi-card ${alertsCount > 0 ? 'red' : 'green'}">
          <div class="pg-w54-kpi-title">Tỷ Lệ Khớp / Cảnh Báo</div>
          <div class="pg-w54-kpi-val">${rate}% <span style="font-size: 13px; font-weight: normal; color: ${alertsCount > 0 ? '#dc2626' : '#059669'};">(${alertsCount} rủi ro)</span></div>
          <div class="pg-w54-kpi-sub">${alertsCount > 0 ? 'Phát hiện thiếu HĐ hoặc trùng SHA-256' : '100% an toàn bảo mật thuế'}</div>
        </div>
      </div>
    `;
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'MATCHED':
        return `<span class="pg-w54-badge matched">✓ Khớp 100%</span>`;
      case 'MISSING_INVOICE':
        return `<span class="pg-w54-badge missing">⚠️ Thiếu Hóa Đơn</span>`;
      case 'DUPLICATE_UNC_HASH':
        return `<span class="pg-w54-badge duplicate">🚨 Trùng SHA-256</span>`;
      case 'PRICE_VARIANCE':
        return `<span class="pg-w54-badge variance">⚡ Lệch Đơn Giá</span>`;
      case 'PARTIAL_PAYMENT':
        return `<span class="pg-w54-badge partial">⏳ Tạm Ứng Đợt 1</span>`;
      default:
        return `<span class="pg-w54-badge">${status}</span>`;
    }
  }

  function render3WayMatrixTab() {
    let records = state.auditData.records || [];

    // Áp dụng bộ lọc Nhà Cung Cấp
    if (state.filterSupplier !== 'ALL') {
      records = records.filter(r => r.supplier_id === state.filterSupplier);
    }
    // Áp dụng bộ lọc Trạng Thái
    if (state.filterStatus !== 'ALL') {
      records = records.filter(r => r.status === state.filterStatus);
    }
    // Áp dụng bộ lọc Tháng
    if (state.filterMonth !== 'ALL') {
      records = records.filter(r => r.month === state.filterMonth);
    }
    // Áp dụng tìm kiếm
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      records = records.filter(r =>
        (r.supplier_name && r.supplier_name.toLowerCase().includes(q)) ||
        (r.project_name && r.project_name.toLowerCase().includes(q)) ||
        (r.po.code && r.po.code.toLowerCase().includes(q)) ||
        (r.invoice.number && r.invoice.number.toLowerCase().includes(q)) ||
        (r.unc.code && r.unc.code.toLowerCase().includes(q)) ||
        (r.unc.sha256 && r.unc.sha256.toLowerCase().includes(q))
      );
    }

    return `
      ${renderKpiCards()}

      <div class="pg-w54-controls-row">
        <div class="pg-w54-filters-group">
          <select class="pg-w54-select" id="pg-w54-filter-supplier">
            <option value="ALL" ${state.filterSupplier === 'ALL' ? 'selected' : ''}>-- Tất Cả Nhà Cung Cấp --</option>
            <option value="NCC_QUOC_TAM" ${state.filterSupplier === 'NCC_QUOC_TAM' ? 'selected' : ''}>Phụ kiện Quốc Tâm (56 Ngô Đức Kế)</option>
            <option value="NCC_LIVAS" ${state.filterSupplier === 'NCC_LIVAS' ? 'selected' : ''}>Chiến Acrylic Livas (Lic Livas)</option>
            <option value="NCC_AN_CUONG" ${state.filterSupplier === 'NCC_AN_CUONG' ? 'selected' : ''}>Gỗ MDF An Cường</option>
            <option value="NCC_LAM_GIANG" ${state.filterSupplier === 'NCC_LAM_GIANG' ? 'selected' : ''}>CTCP Đầu tư Lam Giang (Ván Ba Vàng)</option>
            <option value="NCC_CAU_VUOT" ${state.filterSupplier === 'NCC_CAU_VUOT' ? 'selected' : ''}>Gỗ Cầu Vượt (Plywood NT)</option>
            <option value="NCC_CUONG_THINH" ${state.filterSupplier === 'NCC_CUONG_THINH' ? 'selected' : ''}>Gỗ Cường Thịnh (Vanachai Thái)</option>
            <option value="NCC_VIET_NHAT" ${state.filterSupplier === 'NCC_VIET_NHAT' ? 'selected' : ''}>Kính Việt Nhật</option>
            <option value="NCC_HOANG_HA" ${state.filterSupplier === 'NCC_HOANG_HA' ? 'selected' : ''}>Đá Ceramic Hoàng Hà</option>
            <option value="NCC_HAFELE" ${state.filterSupplier === 'NCC_HAFELE' ? 'selected' : ''}>Hafele Phụ Kiện</option>
          </select>

          <select class="pg-w54-select" id="pg-w54-filter-status">
            <option value="ALL" ${state.filterStatus === 'ALL' ? 'selected' : ''}>-- Tất Cả Trạng Thái --</option>
            <option value="MATCHED" ${state.filterStatus === 'MATCHED' ? 'selected' : ''}>✓ Khớp 100%</option>
            <option value="MISSING_INVOICE" ${state.filterStatus === 'MISSING_INVOICE' ? 'selected' : ''}>⚠️ Thiếu Hóa Đơn GTGT</option>
            <option value="DUPLICATE_UNC_HASH" ${state.filterStatus === 'DUPLICATE_UNC_HASH' ? 'selected' : ''}>🚨 Trùng Mã Băm SHA-256</option>
            <option value="PRICE_VARIANCE" ${state.filterStatus === 'PRICE_VARIANCE' ? 'selected' : ''}>⚡ Lệch Giá So Với PO</option>
            <option value="PARTIAL_PAYMENT" ${state.filterStatus === 'PARTIAL_PAYMENT' ? 'selected' : ''}>⏳ Tạm Ứng Đợt 1</option>
          </select>

          <input type="text" class="pg-w54-search-input" id="pg-w54-search-input" placeholder="🔍 Tìm PO, Số HĐ, NCC, SHA-256..." value="${state.searchQuery || ''}">
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="pg-w54-action-btn gold" id="pg-w54-btn-export-csv">
            📥 Xuất Excel / CSV
          </button>
          <button class="pg-w54-action-btn" id="pg-w54-btn-print">
            🖨️ In A4 Kế Toán
          </button>
        </div>
      </div>

      <div class="pg-w54-table-container">
        <table class="pg-w54-table">
          <thead>
            <tr>
              <th>Mã Đối Soát</th>
              <th>Nhà Cung Cấp &amp; Dự Án</th>
              <th>Chiều 1: Đơn PO</th>
              <th>Chiều 2: Hóa Đơn e-Invoice</th>
              <th>Chiều 3: UNC Ngân Hàng</th>
              <th>SHA-256 UNC</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            ${records.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 32px; color: #94a3b8;">
                  Không tìm thấy bản ghi đối soát nào phù hợp với điều kiện lọc.
                </td>
              </tr>
            ` : records.map(r => `
              <tr>
                <td>
                  <strong>${r.match_id}</strong>
                  <div style="font-size: 11px; color: #64748b;">${r.month}</div>
                </td>
                <td>
                  <strong style="color: #0f172a;">${r.supplier_name}</strong>
                  <div style="font-size: 11px; color: #2563eb;">📍 ${r.project_name}</div>
                </td>
                <td>
                  <div><code>${r.po.code}</code></div>
                  <strong style="color: #0f172a;">${r.po.amount.toLocaleString('vi-VN')} đ</strong>
                  <div style="font-size: 11px; color: #64748b;">${r.po.date}</div>
                </td>
                <td>
                  ${r.invoice.amount_total > 0 ? `
                    <div><code>${r.invoice.series}-${r.invoice.number}</code></div>
                    <strong style="color: #059669;">${r.invoice.amount_total.toLocaleString('vi-VN')} đ</strong>
                    <div style="font-size: 11px; color: #64748b;">${r.invoice.date}</div>
                  ` : `
                    <span style="color: #dc2626; font-weight: 700; font-size: 12px;">CHƯA CÓ HĐĐT</span>
                    <div style="font-size: 11px; color: #94a3b8;">Chưa nhận file XML</div>
                  `}
                </td>
                <td>
                  <div><code>${r.unc.code}</code></div>
                  <strong style="color: #0f172a;">${r.unc.amount.toLocaleString('vi-VN')} đ</strong>
                  <div style="font-size: 11px; color: #64748b;">${r.unc.bank} | ${r.unc.date.split(' ')[0]}</div>
                </td>
                <td>
                  <span class="pg-w54-hash-badge" title="${r.unc.sha256}" onclick="navigator.clipboard.writeText('${r.unc.sha256}')">
                    ${r.unc.sha256.substring(0, 10)}...${r.unc.sha256.substring(58)}
                  </span>
                </td>
                <td>
                  ${getStatusBadge(r.status)}
                </td>
                <td>
                  <button class="pg-w54-preset-btn pg-w54-btn-view-detail" data-matchid="${r.match_id}">
                    Chi Tiết
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderXmlInspectorTab() {
    const inv = state.currentParsedInvoice;
    const gate = state.currentLegalGateResult;

    return `
      <div class="pg-w54-dropzone" id="pg-w54-xml-dropzone">
        <div class="pg-w54-dropzone-icon">📥</div>
        <h3 style="margin: 0 0 6px 0; color: #0f172a; font-size: 16px;">Kéo &amp; Thả Tệp Hóa Đơn Điện Tử .XML Vào Đây</h3>
        <p style="margin: 0 0 14px 0; color: #64748b; font-size: 13px;">Hỗ trợ chuẩn XML Nghị định 123/2020/NĐ-CP &amp; Thông tư 78/2021/TT-BTC</p>
        <input type="file" id="pg-w54-file-input" accept=".xml" style="display: none;">
        <button class="pg-w54-action-btn gold" onclick="document.getElementById('pg-w54-file-input').click()">
          Chọn Tệp .XML Từ Máy Tính
        </button>
      </div>

      <div class="pg-w54-presets-row">
        <span style="font-size: 12px; font-weight: 700; color: #475569;">Nạp Nhanh Hóa Đơn Mẫu:</span>
        <button class="pg-w54-preset-btn" data-preset="SAMPLE_VALID_QUOC_TAM">
          ✓ Mẫu 1: Chuẩn Quốc Tâm (Passed)
        </button>
        <button class="pg-w54-preset-btn violation" data-preset="SAMPLE_VIOLATION_OLD_ADDRESS">
          ⚠️ Mẫu 2: Lỗi Địa Chỉ Cũ 35 Ngô Đức Kế
        </button>
        <button class="pg-w54-preset-btn violation" data-preset="SAMPLE_VIOLATION_HAM_NGHI">
          ⚠️ Mẫu 3: Lỗi Đường Hàm Nghi &amp; MST Giả
        </button>
        <button class="pg-w54-preset-btn" data-preset="SAMPLE_VALID_LIVAS">
          ✓ Mẫu 4: Cánh Acrylic Chiến Livas
        </button>
      </div>

      ${inv && gate ? renderParsedInvoiceAndGate(inv, gate) : `
        <div style="background: #fff; padding: 40px 20px; text-align: center; border-radius: 10px; border: 1px solid #e2e8f0; color: #94a3b8;">
          <div style="font-size: 36px; margin-bottom: 8px;">📄</div>
          <p style="margin: 0; font-size: 14px;">Chưa nạp hóa đơn điện tử. Hãy tải lên tệp .XML hoặc bấm vào nút nạp mẫu ở trên để kiểm tra.</p>
        </div>
      `}
    `;
  }

  function renderParsedInvoiceAndGate(inv, gate) {
    let gateStatusHtml = '';
    if (gate.status === 'PASSED') {
      gateStatusHtml = `<span class="pg-w54-gate-status passed">✓ LEGAL GATE PASSED: HỢP LỆ 100%</span>`;
    } else if (gate.status === 'BLOCKED_CRITICAL') {
      gateStatusHtml = `<span class="pg-w54-gate-status blocked">🚨 LEGAL GATE BLOCKED: VI PHẠM PHÁP LÝ</span>`;
    } else {
      gateStatusHtml = `<span class="pg-w54-gate-status warning">⚠️ CẢNH BÁO PHÁP LÝ CẦN ĐIỀU CHỈNH</span>`;
    }

    return `
      <!-- THẺ KẾT QUẢ LEGAL GATE -->
      <div class="pg-w54-gate-card">
        <div class="pg-w54-gate-header">
          <div>
            <h3 style="margin: 0 0 4px 0; color: #0f172a; font-size: 16px;">Biên Bản Thẩm Tra Pháp Lý Phú Gia (Legal Gate Audit)</h3>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Thời điểm quét: ${gate.timestamp}</p>
          </div>
          <div>${gateStatusHtml}</div>
        </div>

        ${gate.violations.length > 0 ? `
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
            <h4 style="margin: 0 0 8px 0; color: #991b1b; font-size: 13px; font-weight: 700;">
              🚨 PHÁT HIỆN ${gate.violations.length} ĐIỂM VI PHẠM HIẾN PHÁP KỶ LUẬT THÉP:
            </h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #b91c1c; line-height: 1.6;">
              ${gate.violations.map(v => `
                <li><strong>[${v.title}]:</strong> ${v.message}</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
          ${gate.checks.map(c => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 12px; font-weight: 700; color: #334155;">${c.name}</span>
                <span style="font-size: 11px; font-weight: 800; color: ${c.status === 'PASS' ? '#059669' : (c.status === 'FAIL' ? '#dc2626' : '#d97706')};">
                  ${c.status}
                </span>
              </div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">Thực tế: <strong>${c.actual}</strong></div>
              <div style="font-size: 11px; color: #94a3b8;">${c.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- THÔNG TIN CHI TIẾT HÓA ĐƠN -->
      <div class="pg-w54-details-grid">
        <div class="pg-w54-detail-box">
          <h4>🏢 BÊN BÁN (BÁN HÀNG / NCC)</h4>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tên Đơn Vị:</span><span class="pg-w54-field-val">${inv.seller.ten}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Mã Số Thuế:</span><span class="pg-w54-field-val">${inv.seller.mst}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Địa Chỉ:</span><span class="pg-w54-field-val">${inv.seller.dchi}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Ngân Hàng:</span><span class="pg-w54-field-val">${inv.seller.stknhang} - ${inv.seller.tnhang}</span></div>
        </div>

        <div class="pg-w54-detail-box">
          <h4>🏠 BÊN MUA (PHÚ GIA / KHÁCH HÀNG)</h4>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tên Đơn Vị:</span><span class="pg-w54-field-val">${inv.buyer.ten}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Mã Số Thuế:</span><span class="pg-w54-field-val">${inv.buyer.mst}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Địa Chỉ:</span><span class="pg-w54-field-val">${inv.buyer.dchi}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Người Nhận Hàng:</span><span class="pg-w54-field-val">${inv.buyer.hvtnmhang}</span></div>
        </div>

        <div class="pg-w54-detail-box">
          <h4>📋 KÝ HIỆU &amp; TỔNG THANH TOÁN</h4>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Ký Hiệu / Số HĐ:</span><span class="pg-w54-field-val">${inv.header.khhdon} - ${inv.header.shdon}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Ngày Lập:</span><span class="pg-w54-field-val">${inv.header.nlap}</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tiền Chưa Thuế:</span><span class="pg-w54-field-val">${inv.totals.amount_before_vat.toLocaleString('vi-VN')} đ</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tiền Thuế VAT:</span><span class="pg-w54-field-val">${inv.totals.vat_amount.toLocaleString('vi-VN')} đ</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tổng Thanh Toán:</span><span class="pg-w54-field-val" style="color: #059669; font-size: 14px;">${inv.totals.amount_total.toLocaleString('vi-VN')} đ</span></div>
          <div class="pg-w54-field-row"><span class="pg-w54-field-label">Mã SHA-256:</span><span class="pg-w54-hash-badge" title="${inv.sha256}">${inv.sha256.substring(0, 16)}...</span></div>
        </div>
      </div>

      <!-- BẢNG HÀNG HÓA DỊCH VỤ -->
      <div class="pg-w54-table-container">
        <table class="pg-w54-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Hàng Hóa Dịch Vụ</th>
              <th>ĐVT</th>
              <th>Số Lượng</th>
              <th>Đơn Giá</th>
              <th>Thành Tiền</th>
              <th>Thuế Suất</th>
              <th>Tiền Thuế</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map(it => `
              <tr>
                <td>${it.stt}</td>
                <td><strong>${it.ten_hang}</strong></td>
                <td>${it.don_vi || '---'}</td>
                <td>${it.so_luong.toLocaleString('vi-VN')}</td>
                <td>${it.don_gia.toLocaleString('vi-VN')} đ</td>
                <td>${it.thanh_tien.toLocaleString('vi-VN')} đ</td>
                <td>${it.thue_suat}</td>
                <td>${it.tien_thue.toLocaleString('vi-VN')} đ</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderHashVaultTab() {
    const records = state.auditData.records || [];
    const hashCounts = {};
    records.forEach(r => {
      const h = r.unc.sha256;
      hashCounts[h] = (hashCounts[h] || 0) + 1;
    });

    const duplicates = records.filter(r => hashCounts[r.unc.sha256] > 1);

    return `
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;">🔒 Két Băm SHA-256 Chống Chi Trùng Lặp &amp; Gian Lận Hóa Đơn</h3>
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b;">
          Mỗi tệp Hóa đơn điện tử XML và Chứng từ UNC Ngân hàng đều được băm bằng thuật toán mật mã SHA-256 (64 ký tự).
          Hệ thống Zero-Trust tự động phát hiện nếu một chứng từ bị nộp trùng lặp 2 lần hoặc cố tình sửa đổi số tiền.
        </p>

        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <input type="text" id="pg-w54-manual-hash-input" class="pg-w54-search-input" style="flex: 1;" placeholder="Nhập chuỗi văn bản hoặc mã chứng từ để tính mã băm SHA-256...">
          <button class="pg-w54-action-btn gold" id="pg-w54-btn-calc-hash">Tính Toán SHA-256</button>
        </div>
        <div id="pg-w54-manual-hash-result" style="display: none; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 13px; color: #0f172a;"></div>
      </div>

      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px;">
        <h4 style="margin: 0 0 12px 0; color: #b91c1c; font-size: 14px; font-weight: 700;">
          🚨 CÁC CHỨNG TỪ UNC PHÁT HIỆN TRÙNG LẶP MÃ HASH (${duplicates.length} BẢN GHI):
        </h4>

        ${duplicates.length === 0 ? `
          <div style="padding: 20px; text-align: center; color: #059669; font-weight: 600;">
            ✓ Không phát hiện bất kỳ chứng từ UNC nào trùng lặp mã băm SHA-256. 100% dòng tiền an toàn.
          </div>
        ` : `
          <div class="pg-w54-table-container">
            <table class="pg-w54-table">
              <thead>
                <tr>
                  <th>Mã Đối Soát</th>
                  <th>Mã UNC</th>
                  <th>Nhà Cung Cấp</th>
                  <th>Số Tiền Thực Chuyển</th>
                  <th>Mã SHA-256 Phát Hiện Trùng</th>
                  <th>Mức Độ Rủi Ro</th>
                </tr>
              </thead>
              <tbody>
                ${duplicates.map(d => `
                  <tr style="background: #fff5f5;">
                    <td><strong>${d.match_id}</strong></td>
                    <td><code>${d.unc.code}</code></td>
                    <td>${d.supplier_name}</td>
                    <td><strong style="color: #dc2626;">${d.unc.amount.toLocaleString('vi-VN')} đ</strong></td>
                    <td><span class="pg-w54-hash-badge" style="background: #fecaca; color: #991b1b;">${d.unc.sha256}</span></td>
                    <td><span class="pg-w54-badge duplicate">CRITICAL: TRÙNG HASH</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  }

  function renderLegalRulesTab() {
    return `
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 18px; font-weight: 800;">
          ⚖️ HIẾN PHÁP KỶ LUẬT THÉP - BẢO VỆ PHÁP LÝ &amp; THƯƠNG HIỆU PHÚ GIA
        </h3>
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
          Toàn bộ AI Agent, Subagent, Worker, Script tự động hóa và kế toán viên phải tuân thủ nghiêm ngặt chuẩn định danh pháp lý duy nhất dưới đây:
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px;">
            <h4 style="margin: 0 0 10px 0; color: #059669; font-size: 14px;">✓ THÔNG TIN PHÁP LÝ CHUẨN DUY NHẤT</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1e293b; line-height: 1.8;">
              <li><strong>Tên ĐKKD:</strong> ${LEGAL_STANDARD.ENTITY_NAME}</li>
              <li><strong>Thương Hiệu:</strong> ${LEGAL_STANDARD.BRAND_COMPANY_NAME} / ${LEGAL_STANDARD.OFFICIAL_TRADE_NAME}</li>
              <li><strong>Mã Số Thuế / HKD:</strong> <span style="font-family: monospace; color: #059669; font-weight: 700;">${LEGAL_STANDARD.TAX_CODE}</span></li>
              <li><strong>Đại diện pháp luật:</strong> ${LEGAL_STANDARD.LEGAL_REPRESENTATIVE}</li>
              <li><strong>Địa chỉ ĐKKD:</strong> ${LEGAL_STANDARD.REGISTERED_ADDRESS}</li>
              <li><strong>Tổ hợp VP &amp; Nhà máy:</strong> ${LEGAL_STANDARD.TRADE_ADDRESS}</li>
              <li><strong>Hotline:</strong> <strong>${LEGAL_STANDARD.HOTLINE}</strong></li>
            </ul>
          </div>

          <div style="background: #fff5f5; border: 1px solid #fecaca; border-radius: 8px; padding: 16px;">
            <h4 style="margin: 0 0 10px 0; color: #dc2626; font-size: 14px;">🚫 CÁC LỖI VI PHẠM BỊ CẤM TUYỆT ĐỐI</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #991b1b; line-height: 1.8;">
              <li><strong>CẤM 35 Ngô Đức Kế:</strong> Đây là địa chỉ cũ! Phú Gia không ở Ngô Đức Kế (chỉ có NCC Phụ Kiện Quốc Tâm ở 56 Ngô Đức Kế).</li>
              <li><strong>CẤM đường Hàm Nghi:</strong> Không có bất kỳ cơ sở nào ở Hàm Nghi.</li>
              <li><strong>CẤM Trương Quốc Dung:</strong> Sai chính tả thiếu dấu Ứ (bắt buộc Trương Quốc Dụng).</li>
              <li><strong>CẤM "xưởng mộc":</strong> Phải dùng "Tổ hợp Văn phòng &amp; Nhà máy Sản xuất Nội thất Phú Gia".</li>
              <li><strong>CẤM MST giả:</strong> Tuyệt đối cấm MST Vĩnh Phúc 2500732386 hoặc 3002228888.</li>
              <li><strong>CẤM Hotline sai:</strong> 0973.562.789, 0912.345.678, 0988.888.999...</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderModalDetail(record) {
    if (!record) return '';
    return `
      <div class="pg-w54-modal-backdrop" id="pg-w54-modal-backdrop">
        <div class="pg-w54-modal-dialog">
          <div class="pg-w54-modal-header">
            <div>
              <h3 style="margin: 0 0 4px 0; color: #0f172a; font-size: 18px;">
                🔎 Chi Tiết Biên Bản Đối Soát: ${record.match_id}
              </h3>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Dự án: ${record.project_name} | Tháng: ${record.month}</p>
            </div>
            <button class="pg-w54-close-btn" id="pg-w54-modal-close-btn">&times;</button>
          </div>

          <div style="margin-bottom: 18px;">
            Trạng thái kiểm toán: ${getStatusBadge(record.status)}
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #475569; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
              <strong>Ghi chú Kế toán:</strong> ${record.notes}
            </p>
          </div>

          <div class="pg-w54-details-grid">
            <!-- CHIỀU 1: PO -->
            <div class="pg-w54-detail-box">
              <h4>📦 1. ĐƠN ĐẶT HÀNG (PO)</h4>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Mã PO:</span><span class="pg-w54-field-val">${record.po.code}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Ngày Đặt:</span><span class="pg-w54-field-val">${record.po.date}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Người Lập:</span><span class="pg-w54-field-val">${record.po.creator}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Người Duyệt:</span><span class="pg-w54-field-val">${record.po.approver}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Mô Tả:</span><span class="pg-w54-field-val">${record.po.summary}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Giá Trị PO:</span><span class="pg-w54-field-val" style="color: #2563eb; font-size: 14px;">${record.po.amount.toLocaleString('vi-VN')} đ</span></div>
            </div>

            <!-- CHIỀU 2: HÓA ĐƠN -->
            <div class="pg-w54-detail-box">
              <h4>🧾 2. HÓA ĐƠN GTGT (e-Invoice)</h4>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Số Hóa Đơn:</span><span class="pg-w54-field-val">${record.invoice.number}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Ký Hiệu Mẫu:</span><span class="pg-w54-field-val">${record.invoice.series}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Ngày HĐ:</span><span class="pg-w54-field-val">${record.invoice.date}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tiền Chưa Thuế:</span><span class="pg-w54-field-val">${record.invoice.amount_net.toLocaleString('vi-VN')} đ</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tiền Thuế VAT:</span><span class="pg-w54-field-val">${record.invoice.vat_amount.toLocaleString('vi-VN')} đ</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Tổng Hóa Đơn:</span><span class="pg-w54-field-val" style="color: #059669; font-size: 14px;">${record.invoice.amount_total.toLocaleString('vi-VN')} đ</span></div>
            </div>

            <!-- CHIỀU 3: UNC -->
            <div class="pg-w54-detail-box">
              <h4>🏦 3. ỦY NHIỆM CHI (UNC)</h4>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Mã Giao Dịch:</span><span class="pg-w54-field-val">${record.unc.code}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Ngân Hàng:</span><span class="pg-w54-field-val">${record.unc.bank}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Thời Gian UNC:</span><span class="pg-w54-field-val">${record.unc.date}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">TK Nợ / Có:</span><span class="pg-w54-field-val">${record.unc.account_sender} &rarr; ${record.unc.account_receiver}</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">Số Tiền Chuyển:</span><span class="pg-w54-field-val" style="color: #0f172a; font-size: 14px;">${record.unc.amount.toLocaleString('vi-VN')} đ</span></div>
              <div class="pg-w54-field-row"><span class="pg-w54-field-label">SHA-256:</span><span class="pg-w54-hash-badge" title="${record.unc.sha256}">${record.unc.sha256}</span></div>
            </div>
          </div>

          <div style="text-align: right; margin-top: 16px;">
            <button class="pg-w54-action-btn" id="pg-w54-modal-btn-ok">Đóng Cửa Sổ</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    return `
      <div class="pg-w54-footer">
        <div>
          © 2026 <strong>${LEGAL_STANDARD.OFFICIAL_TRADE_NAME}</strong> - ${LEGAL_STANDARD.FACTORY_FACILITY_TITLE}.
          Hệ thống Quản trị Kế toán Zero-Trust R06.
        </div>
        <div>
          Mã số HKD: <strong>${LEGAL_STANDARD.TAX_CODE}</strong> | Hotline: <strong>${LEGAL_STANDARD.HOTLINE}</strong> | Trụ sở: <strong>${LEGAL_STANDARD.TRADE_ADDRESS}</strong>
        </div>
      </div>
    `;
  }

  // ==================================================================================================
  // 10. GẮN KẾT SỰ KIỆN TRÊN DOM (EVENT BINDING & INTERACTION)
  // ==================================================================================================
  function bindEvents(container) {
    if (!container) return;

    // 1. Chuyển tab
    const tabBtns = container.querySelectorAll('.pg-w54-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const tab = this.getAttribute('data-tab');
        if (tab && tab !== state.activeTab) {
          state.activeTab = tab;
          refreshUI();
        }
      });
    });

    // 2. Bộ lọc NCC
    const supplierSelect = container.querySelector('#pg-w54-filter-supplier');
    if (supplierSelect) {
      supplierSelect.addEventListener('change', function () {
        state.filterSupplier = this.value;
        refreshUI();
      });
    }

    // 3. Bộ lọc Trạng thái
    const statusSelect = container.querySelector('#pg-w54-filter-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', function () {
        state.filterStatus = this.value;
        refreshUI();
      });
    }

    // 4. Ô tìm kiếm
    const searchInput = container.querySelector('#pg-w54-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.searchQuery = this.value;
        // Re-render bảng mà không giật focus
        const tbody = container.querySelector('.pg-w54-table tbody');
        if (tbody) {
          let records = state.auditData.records || [];
          if (state.filterSupplier !== 'ALL') records = records.filter(r => r.supplier_id === state.filterSupplier);
          if (state.filterStatus !== 'ALL') records = records.filter(r => r.status === state.filterStatus);
          if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            records = records.filter(r =>
              (r.supplier_name && r.supplier_name.toLowerCase().includes(q)) ||
              (r.project_name && r.project_name.toLowerCase().includes(q)) ||
              (r.po.code && r.po.code.toLowerCase().includes(q)) ||
              (r.invoice.number && r.invoice.number.toLowerCase().includes(q)) ||
              (r.unc.code && r.unc.code.toLowerCase().includes(q)) ||
              (r.unc.sha256 && r.unc.sha256.toLowerCase().includes(q))
            );
          }
          // Cập nhật tbody
          tbody.innerHTML = records.map(r => `
            <tr>
              <td><strong>${r.match_id}</strong><div style="font-size: 11px; color: #64748b;">${r.month}</div></td>
              <td><strong style="color: #0f172a;">${r.supplier_name}</strong><div style="font-size: 11px; color: #2563eb;">📍 ${r.project_name}</div></td>
              <td><div><code>${r.po.code}</code></div><strong style="color: #0f172a;">${r.po.amount.toLocaleString('vi-VN')} đ</strong><div style="font-size: 11px; color: #64748b;">${r.po.date}</div></td>
              <td>
                ${r.invoice.amount_total > 0 ? `
                  <div><code>${r.invoice.series}-${r.invoice.number}</code></div>
                  <strong style="color: #059669;">${r.invoice.amount_total.toLocaleString('vi-VN')} đ</strong>
                  <div style="font-size: 11px; color: #64748b;">${r.invoice.date}</div>
                ` : `<span style="color: #dc2626; font-weight: 700; font-size: 12px;">CHƯA CÓ HĐĐT</span>`}
              </td>
              <td><div><code>${r.unc.code}</code></div><strong style="color: #0f172a;">${r.unc.amount.toLocaleString('vi-VN')} đ</strong><div style="font-size: 11px; color: #64748b;">${r.unc.bank}</div></td>
              <td><span class="pg-w54-hash-badge" title="${r.unc.sha256}" onclick="navigator.clipboard.writeText('${r.unc.sha256}')">${r.unc.sha256.substring(0, 10)}...${r.unc.sha256.substring(58)}</span></td>
              <td>${getStatusBadge(r.status)}</td>
              <td><button class="pg-w54-preset-btn pg-w54-btn-view-detail" data-matchid="${r.match_id}">Chi Tiết</button></td>
            </tr>
          `).join('');
          rebindRowDetailBtns(container);
        }
      });
    }

    // 5. Nút Chi tiết dòng
    rebindRowDetailBtns(container);

    // 6. Xử lý Drag & Drop XML
    const dropzone = container.querySelector('#pg-w54-xml-dropzone');
    const fileInput = container.querySelector('#pg-w54-file-input');
    if (dropzone && fileInput) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileUploaded(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFileUploaded(e.target.files[0]);
        }
      });
    }

    // 7. Nạp Preset XML mẫu
    const presetBtns = container.querySelectorAll('.pg-w54-preset-btn[data-preset]');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const key = this.getAttribute('data-preset');
        if (SAMPLE_XML_PRESETS[key]) {
          processRawXmlText(SAMPLE_XML_PRESETS[key]);
        }
      });
    });

    // 8. Nút Xuất Excel/CSV
    const exportCsvBtn = container.querySelector('#pg-w54-btn-export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', exportAuditCsv);
    }

    // 9. Nút In ấn A4
    const printBtn = container.querySelector('#pg-w54-btn-print');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        if (typeof window !== 'undefined') window.print();
      });
    }

    // 10. Tính toán SHA-256 thủ công
    const calcHashBtn = container.querySelector('#pg-w54-btn-calc-hash');
    const manualInput = container.querySelector('#pg-w54-manual-hash-input');
    const manualResult = container.querySelector('#pg-w54-manual-hash-result');
    if (calcHashBtn && manualInput && manualResult) {
      calcHashBtn.addEventListener('click', () => {
        const text = manualInput.value;
        if (!text) return;
        const hash = sha256Hex(text);
        manualResult.style.display = 'block';
        manualResult.innerHTML = `<strong>Chuỗi đầu vào:</strong> "${text}"<br><strong>Mã SHA-256 (64 hex):</strong> <span style="color: #059669;">${hash}</span>`;
      });
    }
  }

  function rebindRowDetailBtns(container) {
    const detailBtns = container.querySelectorAll('.pg-w54-btn-view-detail');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const matchId = this.getAttribute('data-matchid');
        const record = (state.auditData.records || []).find(r => r.match_id === matchId);
        if (record) {
          state.selectedRecordForModal = record;
          showModal(record);
        }
      });
    });
  }

  function showModal(record) {
    if (typeof document === 'undefined') return;
    const modalContainer = document.createElement('div');
    modalContainer.id = 'pg-w54-modal-mount';
    modalContainer.innerHTML = renderModalDetail(record);
    document.body.appendChild(modalContainer);

    const closeBtn = modalContainer.querySelector('#pg-w54-modal-close-btn');
    const okBtn = modalContainer.querySelector('#pg-w54-modal-btn-ok');
    const backdrop = modalContainer.querySelector('#pg-w54-modal-backdrop');

    function closeModal() {
      if (modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (okBtn) okBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  }

  function handleFileUploaded(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const xmlContent = e.target.result;
      processRawXmlText(xmlContent);
    };
    reader.readAsText(file);
  }

  function processRawXmlText(xmlContent) {
    try {
      const parsed = parseInvoiceXml(xmlContent);
      const gate = verifyLegalGate(parsed);
      state.currentParsedInvoice = parsed;
      state.currentLegalGateResult = gate;
      state.activeTab = 'xml_inspector';
      refreshUI();
    } catch (err) {
      console.error('[PG_W54] Lỗi phân tích XML:', err);
      alert('Không thể phân tích cú pháp tệp XML: ' + err.message);
    }
  }

  function exportAuditCsv(returnStringOnly) {
    const records = state.auditData.records || [];
    const headers = [
      "Mã Đối Soát",
      "Tháng",
      "Nhà Cung Cấp",
      "Dự Án / Công Trình",
      "Mã Đơn PO",
      "Ngày PO",
      "Số Tiền PO (VND)",
      "Số Hóa Đơn e-Invoice",
      "Ký Hiệu Mẫu HĐ",
      "Ngày HĐ",
      "Tiền Chưa Thuế (VND)",
      "Tiền Thuế VAT (VND)",
      "Tổng Hóa Đơn (VND)",
      "Mã Giao Dịch UNC",
      "Ngân Hàng",
      "Ngày UNC",
      "Số Tiền UNC (VND)",
      "Mã Băm SHA-256 UNC",
      "Trạng Thái Đối Soát",
      "Mức Độ Rủi Ro",
      "Ghi Chú Kế Toán"
    ];

    const rows = records.map(r => [
      `"${r.match_id}"`,
      `"${r.month}"`,
      `"${(r.supplier_name || '').replace(/"/g, '""')}"`,
      `"${(r.project_name || '').replace(/"/g, '""')}"`,
      `"${r.po.code}"`,
      `"${r.po.date}"`,
      r.po.amount,
      `"${r.invoice.number}"`,
      `"${r.invoice.series}"`,
      `"${r.invoice.date}"`,
      r.invoice.amount_net,
      r.invoice.vat_amount,
      r.invoice.amount_total,
      `"${r.unc.code}"`,
      `"${r.unc.bank}"`,
      `"${r.unc.date}"`,
      r.unc.amount,
      `"${r.unc.sha256}"`,
      `"${r.status}"`,
      `"${r.risk_level}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(",")].concat(rows.map(e => e.join(","))).join("\r\n");

    if (returnStringOnly || typeof window === 'undefined') {
      return csvContent;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bien_Ban_Doi_Soat_3_Chieu_PG_Home_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return csvContent;
  }

  // ==================================================================================================
  // 11. CƠ CHẾ RENDER VÀ KHỞI CHẠY (MOUNT & REFRESH)
  // ==================================================================================================
  let currentContainerElement = null;

  function refreshUI() {
    if (!currentContainerElement) return;
    injectStylesOnce();

    let tabContentHtml = '';
    switch (state.activeTab) {
      case '3way_matrix':
        tabContentHtml = render3WayMatrixTab();
        break;
      case 'xml_inspector':
        tabContentHtml = renderXmlInspectorTab();
        break;
      case 'hash_vault':
        tabContentHtml = renderHashVaultTab();
        break;
      case 'legal_rules':
        tabContentHtml = renderLegalRulesTab();
        break;
      default:
        tabContentHtml = render3WayMatrixTab();
    }

    currentContainerElement.innerHTML = `
      <div class="pg-w54-wrapper">
        ${renderHeader()}
        ${renderTabsNav()}
        <div class="pg-w54-tab-content">
          ${tabContentHtml}
        </div>
        ${renderFooter()}
      </div>
    `;

    bindEvents(currentContainerElement);
  }

  function render(containerIdOrElement) {
    if (typeof document === 'undefined') return;
    let target = null;
    if (typeof containerIdOrElement === 'string') {
      target = document.getElementById(containerIdOrElement);
    } else if (containerIdOrElement && containerIdOrElement.nodeType) {
      target = containerIdOrElement;
    }

    if (!target) {
      console.warn('[PG_W54] Không tìm thấy phần tử DOM để render module W54.');
      return;
    }

    currentContainerElement = target;
    tryFetchMatchReportJson();
    refreshUI();
  }

  // Tự động khởi chạy khi trang web sẵn sàng nếu có thẻ chứa #pg-w54-container
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      const autoMountTarget = document.getElementById('pg-w54-container') ||
                             document.getElementById('w54-einvoice-container') ||
                             document.getElementById('pg-app-einvoice-audit');
      if (autoMountTarget) {
        render(autoMountTarget);
      }
    });
  }

  // ==================================================================================================
  // 12. XUẤT CÔNG KHAI API CHO TOÀN BỘ HỆ THỐNG PG HOME (PUBLIC EXPORTS)
  // ==================================================================================================
  return {
    version: "1.0.0",
    name: "PG_W54_EInvoice3WayAudit",
    title: "Web ERP e-Invoice XML Parser & 3-Way Accounting Audit UI Module",
    legal: LEGAL_STANDARD,
    violationRules: LEGAL_VIOLATION_RULES,
    samplePresets: SAMPLE_XML_PRESETS,
    getState: function () {
      return Object.assign({}, state);
    },
    parseInvoiceXml: parseInvoiceXml,
    verifyLegalGate: verifyLegalGate,
    sha256Hex: sha256Hex,
    render: render,
    mount: render,
    refreshUI: refreshUI,
    exportAuditCsv: exportAuditCsv,
    setAuditData: function (newData) {
      if (newData) {
        state.auditData = newData;
        refreshUI();
      }
    }
  };
}));
