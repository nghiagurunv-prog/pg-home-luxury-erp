/**
 * ==============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT & XÂY DỰNG PG HOME LUXURY
 * MODULE: W27 - XUẤT BÁO CÁO CSV / EXCEL TIẾNG VIỆT CHUẨN UTF-8 BOM
 * Tác giả: Công nhân Flash W27 (Hệ thống Sub-Agent Tự Động Hóa PG Home)
 * Bản quyền: (c) 2026 Hộ Kinh Doanh Phú Gia - Hotline: 0973.562.789
 * ==============================================================================
 * ĐẶC TÍNH KỸ THUẬT:
 * 1. Chèn tiền tố UTF-8 Byte Order Mark (\uFEFF) ở đầu file giúp Microsoft Excel
 *    trên Windows tự động nhận diện bảng mã UTF-8, không bị lỗi font Tiếng Việt.
 * 2. Escape chuẩn RFC 4180 cho các ô chứa dấu phẩy, dấu nháy kép, xuống dòng.
 * 3. Hỗ trợ xuất 1 cú nhấp chuột (1-Click Export):
 *    - Bảng lương & Chấm công T10 (Payroll T10 công nhân xưởng & văn phòng)
 *    - Báo cáo CCSC 12 tháng (Doanh số, Dòng tiền, Quỹ lương, Thuế, Lãi PK)
 *    - Báo cáo Công nợ 9 Nhà Cung Cấp (Chi tiết sổ nợ, hạn nợ, đối soát Zalo)
 *    - Xuất toàn bộ gói báo cáo (Export All)
 * 4. Tương thích độc lập: Tự động trích xuất từ window.pgLiveState / window.PG_STATE
 *    hoặc sử dụng kho dữ liệu thực tế được tích hợp sẵn.
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W27 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ============================================================================
  // 1. KHO DỮ LIỆU ĐỐI SOÁT DỰ PHÒNG THỰC TẾ (BASELINE STATE T10/2026)
  // ============================================================================
  const DEFAULT_BASELINE_DATA = {
    brand: {
      name: "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng",
      taxId: "042203002931",
      address: "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
      hotline: "0973.562.789"
    },
    ccscMonths: [
      { m: 1, name: "Tháng 1", sales: 250000000, debt: 25000000, cash: 225000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 3000000, bpkd: 15000000, qlx: 21000000, thue: 13000000, mkt: 10000000, bhxh: 6600000, pk_profit: 0, isActual: false },
      { m: 2, name: "Tháng 2", sales: 80000000, debt: 8000000, cash: 72000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 1000000, bpkd: 7500000, qlx: 21000000, thue: 13000000, mkt: 5000000, bhxh: 6600000, pk_profit: 0, isActual: false },
      { m: 3, name: "Tháng 3", sales: 220000000, debt: 22000000, cash: 198000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 3000000, bpkd: 14500000, qlx: 21000000, thue: 13000000, mkt: 10000000, bhxh: 6600000, pk_profit: 0, isActual: false },
      { m: 4, name: "Tháng 4", sales: 300000000, debt: 30000000, cash: 270000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 4000000, bpkd: 18000000, qlx: 21000000, thue: 13000000, mkt: 15000000, bhxh: 6600000, pk_profit: 0, isActual: false },
      { m: 5, name: "Tháng 5", sales: 350000000, debt: 35000000, cash: 315000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 4500000, bpkd: 19000000, qlx: 21000000, thue: 13000000, mkt: 15000000, bhxh: 6600000, pk_profit: 0, isActual: false },
      { m: 6, name: "Tháng 6", sales: 289578000, debt: 240000000, cash: 49578000, bld: 12000000, hiep_cb: 3500000, hiep_sale: 1978900, bpkd: 16923076, qlx: 11961539, thue: 13000000, mkt: 10000000, bhxh: 6600000, pk_profit: 0, isActual: true },
      { m: 7, name: "Tháng 7", sales: 450000000, debt: 67500000, cash: 382500000, bld: 19970529, hiep_cb: 6500000, hiep_sale: 5000000, bpkd: 11691538, qlx: 22500000, thue: 13000000, mkt: 15000000, bhxh: 6600000, pk_profit: 0, isActual: true },
      { m: 8, name: "Tháng 8", sales: 242051705, debt: 69803651, cash: 172248054, bld: 12000000, hiep_cb: 6500000, hiep_sale: 3000000, bpkd: 10500000, qlx: 19615385, thue: 13000000, mkt: 12000000, bhxh: 6600000, pk_profit: 2652000, isActual: true },
      { m: 9, name: "Tháng 9", sales: 287782767, debt: 138066647, cash: 149716120, bld: 12000000, hiep_cb: 6500000, hiep_sale: 7000000, bpkd: 9865385, qlx: 20250000, thue: 13000000, mkt: 12000000, bhxh: 6600000, pk_profit: 9000000, isActual: true },
      { m: 10, name: "Tháng 10", sales: 480000000, debt: 48000000, cash: 432000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 6000000, bpkd: 18000000, qlx: 21000000, thue: 13000000, mkt: 20000000, bhxh: 6600000, pk_profit: 13287000, isActual: false },
      { m: 11, name: "Tháng 11", sales: 580000000, debt: 58000000, cash: 522000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 8000000, bpkd: 22000000, qlx: 21000000, thue: 13000000, mkt: 20000000, bhxh: 6600000, pk_profit: 15000000, isActual: false },
      { m: 12, name: "Tháng 12", sales: 520000000, debt: 52000000, cash: 468000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 7000000, bpkd: 20000000, qlx: 21000000, thue: 13000000, mkt: 20000000, bhxh: 6600000, pk_profit: 15000000, isActual: false }
    ],
    supplierDebts: [
      {
        ncc: "Tổng Kho Lam Giang",
        rep: "Ms Hoa Lam Giang (TP Hà Tĩnh)",
        category: "Ván HMR Thái Lan, nẹp PVC, ván hậu 5.5mm",
        debt: 147492250,
        deadline: "10/11/2026",
        status: "Đối soát thường kỳ",
        group: "LamGiang - NT Phú Gia (TP HT)",
        note: "Sổ nợ 31/10: 164.33M - Dung CK 16.838M (02/11 VietinBank). Đơn DH29930 (496k) Vũ đã CK Techcombank dứt điểm lúc 14:33 ngày 04/11"
      },
      {
        ncc: "Gỗ NT Cầu Vượt (Hà Tĩnh)",
        rep: "Thịnh Gỗ NT (0979137123)",
        category: "Ván Plywood E0, MDF cốt xanh, Picomat",
        debt: 82065300,
        deadline: "31/10/2026",
        status: "Cần đối soát",
        group: "Đặt hàng Phú Gia - NT",
        note: "Đơn trả SON00337 trừ 750k | Đối soát DON00216-274"
      },
      {
        ncc: "Gỗ Melamine Cường Thịnh",
        rep: "Nga Melamine Cường Thịnh",
        category: "Ván Melamine cốt MDF chống ẩm 17mm",
        debt: 42300000,
        deadline: "10/11/2026",
        status: "Đúng hạn",
        group: "Chốt màu, đặt hàng Cường Thịnh",
        note: "Gối đầu theo từng lô ván xuất xưởng"
      },
      {
        ncc: "Đặt Cánh Acrylic NTD / ALD",
        rep: "Kỹ thuật ALD Miền Trung (Zalo ALD)",
        category: "Cánh Acrylic bóng gương noline chống trầy",
        debt: 34960000,
        deadline: "15/11/2026",
        status: "Đúng hạn",
        group: "Đặt hàng Acrylic ALD",
        note: "PO-1002 (11.1 md = 12.21M Chị Hoa) + PO-1015 (18.2 m2 = 22.75M Shophouse Anh Minh) = 34.96M"
      },
      {
        ncc: "Kính Việt Nhật - VSG",
        rep: "Thoan VSG / Kính Việt Nhật",
        category: "Kính hộp hoa đồng, kính cường lực 10mm, gương dán",
        debt: 27500000,
        deadline: "05/11/2026",
        status: "Chờ giao hàng",
        group: "KÍNH VIỆT NHẬT - PHÚ GIA LUXURY",
        note: "Đơn kính Chị Hoa & vách tắm kính"
      },
      {
        ncc: "Phụ Kiện Quốc Tâm",
        rep: "Hương Kế Toán / Trần Quang Tú (0944698797)",
        category: "Bản lề sỉ, ray bi 3 tầng, pitton, tay nắm, máng led",
        debt: 26170000,
        deadline: "15/11/2026",
        status: "Đúng hạn",
        group: "QUỐC TÂM Phú Gia",
        note: "Sổ nợ T296: Nợ 40.92M - Dung CK 15M (02/11 VietinBank) = 25.92M + HĐ Led 04/11 (170k) + HĐ Sập/Ray 05/11 (80k) = 26.17M (Dưới hạn mức 30M an toàn)"
      },
      {
        ncc: "Hoàng Hà Ceramic PVC",
        rep: "Hoàng Hà Ceramic Hưng Yên",
        category: "Đá nung kết Calacatta, PVC than tre",
        debt: 18600000,
        deadline: "03/11/2026",
        status: "Chờ nghiệm thu",
        group: "Đặt hàng Ceramic Hoàng Hà HY",
        note: "Cọc 50%, thanh toán dứt điểm khi giao hàng"
      },
      {
        ncc: "Gương Bỉ Hà Tĩnh",
        rep: "Nguyễn Thị Thuý",
        category: "Gương tráng bạc 8 lớp, led cảm ứng",
        debt: 6800000,
        deadline: "06/11/2026",
        status: "Gia công",
        group: "Đặt hàng Kính, Gương Phú Gia",
        note: "Theo PO-2026-1010 phòng tắm Master"
      },
      {
        ncc: "Gỗ Đức Anh (Gỗ sồi thịt)",
        rep: "Vợ Sồi Đức Anh (Thu Hương HT)",
        category: "Gỗ sồi Mỹ tự nhiên xẻ sấy chuẩn FAS loại 1",
        debt: 0,
        deadline: "Đã tất toán",
        status: "Đã tất toán 0đ",
        group: "Đặt hàng gỗ thịt nhà Đức Anh - Thu Hương Hà Tĩnh",
        note: "Đơn 13.2M đã tất toán 100% (15/02 trả 10M + 14/05 trả 3.2M) theo Zalo Batch 4"
      }
    ],
    timesheets: {
      "10": {
        month: 10,
        vp: [
          { id: "vp_13_10", name: "Tống Trần Hiệp", dept: "Văn phòng", role: "Sale Admin & Thiết kế 3D", totalHC: 26, baseSalary: 6500000, saleBonus: 6000000, advance: 0, note: "Sale Admin chuẩn định mức" },
          { id: "vp_14_10", name: "Đường Việt Dũng", dept: "Văn phòng", role: "Phòng Kinh Doanh & Sale dự án", totalHC: 26, baseSalary: 6000000, saleBonus: 4500000, advance: 0, note: "Phụ trách dự án khách lẻ & căn hộ" }
        ],
        xuong: [
          { id: "x_2_10", name: "Hà Viết Hòa", dept: "Xưởng", role: "Thợ Cả / Kết cấu", totalHC: 28, otHours: 66, dayRate: 530000, otRate: 99375, advance: 0, fund20k: 560000, note: "Trích quỹ thợ nòng cốt 20k/công = 560k giữ tất niên" },
          { id: "x_3_10", name: "Nguyễn Văn Thái", dept: "Xưởng", role: "Quản lý xưởng sản xuất", totalHC: 26.5, otHours: 0, dayRate: 792453, otRate: 0, advance: 0, fund20k: 0, note: "Khoán lương Quản lý xưởng 21.000.000 đ theo CCSC" },
          { id: "x_4_10", name: "Lê Văn Thoan", dept: "Xưởng", role: "Thợ chính / Dán cạnh máy", totalHC: 7, otHours: 7, dayRate: 450000, otRate: 84375, advance: 0, fund20k: 0, note: "Đi làm 7 công HC + 7h tăng ca" },
          { id: "x_5_10", name: "Hoàng Công Vũ", dept: "Xưởng", role: "Kỹ thuật CNC / Bóc tách vật tư", totalHC: 26, otHours: 0, dayRate: 450000, otRate: 0, advance: 0, fund20k: 0, note: "Kỹ thuật lập trình CNC & bóc tách dự án" },
          { id: "x_6_10", name: "Lương Thể Hào", dept: "Xưởng", role: "Thợ chính / Lắp ráp", totalHC: 30, otHours: 62, dayRate: 450000, otRate: 84375, advance: 0, fund20k: 600000, note: "Trích quỹ thợ nòng cốt 20k/công = 600k giữ tất niên" },
          { id: "x_7_10", name: "Trần Văn Anh", dept: "Xưởng", role: "Thợ lắp đặt & Hoàn thiện", totalHC: 26, otHours: 56, dayRate: 400000, otRate: 75000, advance: 0, fund20k: 0, note: "Lắp đặt tại công trình Nhà Bác Phát & Chị Hoa" },
          { id: "x_8_10", name: "Lê Tuấn Anh", dept: "Xưởng", role: "Thợ phụ / Đóng gói", totalHC: 19.5, otHours: 20.5, dayRate: 300000, otRate: 56250, advance: 0, fund20k: 0, note: "Thợ phụ phụ việc máy cưa, dán cạnh, bốc xếp ván" }
        ]
      }
    }
  };

  // ============================================================================
  // 2. CÁC HÀM TIỆN ÍCH LÕI (CORE UTILITIES)
  // ============================================================================

  /**
   * Escape an toàn cho 1 trường CSV theo chuẩn RFC 4180
   * @param {any} val - Giá trị cần đưa vào ô CSV
   * @returns {string} - Chuỗi an toàn
   */
  function escapeCSV(val) {
    if (val === null || val === undefined) {
      return '""';
    }
    let str = String(val);
    // Nếu chứa dấu nháy kép, dấu phẩy, hoặc dấu xuống dòng
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }
    // Nếu có ký tự đặc biệt hoặc số dài tránh Excel làm tròn thành khoa học
    if (typeof val === 'string' && val.length > 0 && /^[0-9]{10,}$/.test(val)) {
      return `="${val}"`;
    }
    return `"${str}"`;
  }

  /**
   * Định dạng tiền tệ VNĐ hiển thị số nguyên sạch
   * @param {number} num
   * @returns {number|string}
   */
  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return 0;
    return Math.round(Number(num));
  }

  /**
   * Trích xuất State hiện tại từ môi trường runtime hoặc dùng fallback chuẩn
   * @param {object} customData
   * @returns {object}
   */
  function resolveLiveState(customData) {
    if (customData && typeof customData === 'object' && Object.keys(customData).length > 0) {
      return customData;
    }
    if (typeof window !== 'undefined') {
      if (window.pgLiveState && typeof window.pgLiveState === 'object') return window.pgLiveState;
      if (window.PG_STATE && typeof window.PG_STATE === 'object') return window.PG_STATE;
    }
    return DEFAULT_BASELINE_DATA;
  }

  /**
   * Tải file CSV xuống máy khách với UTF-8 BOM chuẩn Microsoft Excel
   * @param {string} filename - Tên file tải về (kèm đuôi .csv)
   * @param {string} csvContent - Nội dung CSV dạng chuỗi
   */
  function triggerDownload(filename, csvContent) {
    // Tiền tố UTF-8 BOM bắt buộc để Excel Windows đọc có dấu không bao giờ lỗi font
    const UTF8_BOM = '\uFEFF';
    const blob = new Blob([UTF8_BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Hỗ trợ IE / Edge Legacy nếu cần
    if (typeof navigator !== 'undefined' && navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
      return;
    }

    if (typeof document !== 'undefined') {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      setTimeout(function () {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 300);
    }
  }

  // ============================================================================
  // 3. XUẤT BẢNG LƯƠNG & CHẤM CÔNG THÁNG 10 (PAYROLL T10)
  // ============================================================================
  function exportPayrollT10(customData) {
    const state = resolveLiveState(customData);
    const ts10 = (state.timesheets && state.timesheets["10"]) || DEFAULT_BASELINE_DATA.timesheets["10"];
    const brand = state.brand || DEFAULT_BASELINE_DATA.brand;

    let csvLines = [];

    // Header thông tin doanh nghiệp
    csvLines.push([escapeCSV(brand.name)].join(','));
    csvLines.push([escapeCSV("Địa chỉ: " + brand.address + " | Hotline: " + brand.hotline + " | MST: " + brand.taxId)].join(','));
    csvLines.push([escapeCSV("BẢNG THANH TOÁN LƯƠNG & CHẤM CÔNG THÁNG 10/2026")].join(','));
    csvLines.push([escapeCSV("Ngày xuất báo cáo: " + new Date().toLocaleDateString('vi-VN'))].join(','));
    csvLines.push(""); // Dòng trống

    // Cột tiêu đề bảng lương
    const headers = [
      "STT",
      "Mã NV",
      "Họ và Tên Nhân Sự",
      "Bộ Phận",
      "Chức Danh / Vị Trí",
      "Công HC Thực Tế",
      "Đơn Giá Công (đ)",
      "Lương Ngày Công (đ)",
      "Giờ Tăng Ca (OT)",
      "Đơn Giá OT/Giờ (đ)",
      "Tiền Tăng Ca OT (đ)",
      "Lương Thưởng / Bonus (đ)",
      "Trích Quỹ Giữ Cuối Năm (đ)",
      "Tạm Ứng (đ)",
      "THỰC LĨNH THÁNG 10 (đ)",
      "Ghi Chú Quy Chuẩn Quản Trị"
    ];
    csvLines.push(headers.map(escapeCSV).join(','));

    let stt = 1;
    let totalHCAll = 0;
    let totalOTHoursAll = 0;
    let totalDaySalaryAll = 0;
    let totalOTSalaryAll = 0;
    let totalBonusAll = 0;
    let totalFundAll = 0;
    let totalAdvanceAll = 0;
    let totalNetSalaryAll = 0;

    // A. Khối Văn Phòng & Ban Giám Đốc
    const vpList = ts10.vp || [];
    vpList.forEach(function (emp) {
      const hc = Number(emp.totalHC || 0);
      const baseSalary = Number(emp.baseSalary || 0);
      const bonus = Number(emp.saleBonus || 0);
      const adv = Number(emp.advance || 0);
      const dayRate = Math.round(baseSalary / 26);
      const daySalary = baseSalary;
      const otHours = 0;
      const otRate = 0;
      const otSalary = 0;
      const fund = 0;
      const net = daySalary + bonus + otSalary - fund - adv;

      totalHCAll += hc;
      totalOTHoursAll += otHours;
      totalDaySalaryAll += daySalary;
      totalOTSalaryAll += otSalary;
      totalBonusAll += bonus;
      totalFundAll += fund;
      totalAdvanceAll += adv;
      totalNetSalaryAll += net;

      csvLines.push([
        escapeCSV(stt++),
        escapeCSV(emp.id || "VP-" + stt),
        escapeCSV(emp.name),
        escapeCSV(emp.dept || "Văn phòng"),
        escapeCSV(emp.role || "Sale Admin"),
        escapeCSV(hc),
        escapeCSV(dayRate),
        escapeCSV(daySalary),
        escapeCSV(otHours),
        escapeCSV(otRate),
        escapeCSV(otSalary),
        escapeCSV(bonus),
        escapeCSV(fund),
        escapeCSV(adv),
        escapeCSV(net),
        escapeCSV(emp.note || "")
      ].join(','));
    });

    // B. Khối Xưởng Sản Xuất
    const xuongList = ts10.xuong || [];
    xuongList.forEach(function (w) {
      const hc = Number(w.totalHC || 0);
      const otHours = Number(w.otHours || 0);
      const dayRate = Number(w.dayRate || 0);
      const otRate = Number(w.otRate || Math.round((dayRate / 8) * 1.5));
      
      let daySalary = Math.round(hc * dayRate);
      let otSalary = Math.round(otHours * otRate);
      let bonus = 0;

      // Xử lý trường hợp Quản lý xưởng (Nguyễn Văn Thái) khoán 21 triệu theo CCSC
      if (w.name.includes("Thái") || (w.role && w.role.includes("Quản lý xưởng"))) {
        daySalary = 21000000;
        otSalary = 0;
      }

      const fund = Number(w.fund20k || 0);
      const adv = Number(w.advance || 0);
      const net = daySalary + otSalary + bonus - fund - adv;

      totalHCAll += hc;
      totalOTHoursAll += otHours;
      totalDaySalaryAll += daySalary;
      totalOTSalaryAll += otSalary;
      totalBonusAll += bonus;
      totalFundAll += fund;
      totalAdvanceAll += adv;
      totalNetSalaryAll += net;

      csvLines.push([
        escapeCSV(stt++),
        escapeCSV(w.id || "XUONG-" + stt),
        escapeCSV(w.name),
        escapeCSV(w.dept || "Xưởng"),
        escapeCSV(w.role || "Thợ sản xuất"),
        escapeCSV(hc),
        escapeCSV(dayRate),
        escapeCSV(daySalary),
        escapeCSV(otHours),
        escapeCSV(otRate),
        escapeCSV(otSalary),
        escapeCSV(bonus),
        escapeCSV(fund),
        escapeCSV(adv),
        escapeCSV(net),
        escapeCSV(w.note || "")
      ].join(','));
    });

    // Dòng TỔNG CỘNG
    csvLines.push([
      escapeCSV("TỔNG CỘNG"),
      escapeCSV(""),
      escapeCSV("Toàn Bộ Nhân Sự (Xưởng & Văn Phòng)"),
      escapeCSV(""),
      escapeCSV(""),
      escapeCSV(totalHCAll),
      escapeCSV(""),
      escapeCSV(totalDaySalaryAll),
      escapeCSV(totalOTHoursAll),
      escapeCSV(""),
      escapeCSV(totalOTSalaryAll),
      escapeCSV(totalBonusAll),
      escapeCSV(totalFundAll),
      escapeCSV(totalAdvanceAll),
      escapeCSV(totalNetSalaryAll),
      escapeCSV("Khóa sổ quyết toán lương Tháng 10/2026")
    ].join(','));

    // Chữ ký xác nhận cuối bảng
    csvLines.push("");
    csvLines.push([
      escapeCSV("Người lập bảng: Tống Trần Hiệp"),
      escapeCSV(""),
      escapeCSV("Quản lý xưởng: Nguyễn Văn Thái"),
      escapeCSV(""),
      escapeCSV("Giám Đốc phê duyệt: Nguyễn Viết Nghĩa")
    ].join(','));

    const csvContent = csvLines.join('\r\n');
    triggerDownload("Bang_Luong_T10_2026_PG_Home.csv", csvContent);
    return { success: true, count: stt - 1, totalNet: totalNetSalaryAll };
  }

  // ============================================================================
  // 4. XUẤT BÁO CÁO CCSC 12 THÁNG (CCSC 12 MONTHS REPORT)
  // ============================================================================
  function exportCCSC12Months(customData) {
    const state = resolveLiveState(customData);
    const months = state.ccscMonths || DEFAULT_BASELINE_DATA.ccscMonths;
    const brand = state.brand || DEFAULT_BASELINE_DATA.brand;

    let csvLines = [];

    // Header công ty
    csvLines.push([escapeCSV(brand.name)].join(','));
    csvLines.push([escapeCSV("HỆ THỐNG QUẢN TRỊ TÀI CHÍNH CCSC 12 THÁNG - NĂM TÀI CHÍNH 2026")].join(','));
    csvLines.push([escapeCSV("Đơn vị tính: Việt Nam Đồng (VNĐ) | Trích xuất: " + new Date().toLocaleDateString('vi-VN'))].join(','));
    csvLines.push("");

    const headers = [
      "Tháng",
      "Phân Loại Số Liệu",
      "Doanh Số Ký Kết (Sales)",
      "Công Nợ Khách Hàng Còn Lại",
      "Dòng Tiền Thực Thu (Cash-In)",
      "Lương Ban Lãnh Đạo (Col G)",
      "Lương Cứng Sale Admin (Hiệp CB)",
      "Thưởng Doanh Số Sale",
      "Chi Phí Bộ Phận KD (BPKD)",
      "Quản Lý Xưởng Sản Xuất (QLX)",
      "Marketing & Chạy Ads (MKT)",
      "Bảo Hiểm Xã Hội (BHXH)",
      "Thuế Doanh Nghiệp (Thuế)",
      "Lợi Nhuận Bán Kèm Phụ Kiện (PK Profit)",
      "Ghi Chú Đánh Giá Hiệu Quả"
    ];
    csvLines.push(headers.map(escapeCSV).join(','));

    let sumSales = 0;
    let sumDebt = 0;
    let sumCash = 0;
    let sumBLD = 0;
    let sumHiepCB = 0;
    let sumHiepSale = 0;
    let sumBPKD = 0;
    let sumQLX = 0;
    let sumMKT = 0;
    let sumBHXH = 0;
    let sumThue = 0;
    let sumPKProfit = 0;

    months.forEach(function (m) {
      const sales = Number(m.sales || 0);
      const debt = Number(m.debt || 0);
      const cash = Number(m.cash || 0);
      const bld = Number(m.bld || 0);
      const hiep_cb = Number(m.hiep_cb || 0);
      const hiep_sale = Number(m.hiep_sale || 0);
      const bpkd = Number(m.bpkd || 0);
      const qlx = Number(m.qlx || 0);
      const mkt = Number(m.mkt || 0);
      const bhxh = Number(m.bhxh || 0);
      const thue = Number(m.thue || 0);
      const pk_profit = Number(m.pk_profit || 0);
      const isActual = m.isActual === true;

      sumSales += sales;
      sumDebt += debt;
      sumCash += cash;
      sumBLD += bld;
      sumHiepCB += hiep_cb;
      sumHiepSale += hiep_sale;
      sumBPKD += bpkd;
      sumQLX += qlx;
      sumMKT += mkt;
      sumBHXH += bhxh;
      sumThue += thue;
      sumPKProfit += pk_profit;

      csvLines.push([
        escapeCSV(m.name || "Tháng " + m.m),
        escapeCSV(isActual ? "THỰC TẾ (ĐÃ CHỐT)" : "KẾ HOẠCH DỰ TOÁN"),
        escapeCSV(sales),
        escapeCSV(debt),
        escapeCSV(cash),
        escapeCSV(bld),
        escapeCSV(hiep_cb),
        escapeCSV(hiep_sale),
        escapeCSV(bpkd),
        escapeCSV(qlx),
        escapeCSV(mkt),
        escapeCSV(bhxh),
        escapeCSV(thue),
        escapeCSV(pk_profit),
        escapeCSV(isActual ? "Đã đối soát dòng tiền ngân hàng & sổ quỹ" : "Chỉ tiêu kế hoạch định hướng")
      ].join(','));
    });

    // Dòng Tổng Cộng Cả Năm
    csvLines.push([
      escapeCSV("TỔNG CỘNG 12 THÁNG"),
      escapeCSV("CẢ NĂM 2026"),
      escapeCSV(sumSales),
      escapeCSV(sumDebt),
      escapeCSV(sumCash),
      escapeCSV(sumBLD),
      escapeCSV(sumHiepCB),
      escapeCSV(sumHiepSale),
      escapeCSV(sumBPKD),
      escapeCSV(sumQLX),
      escapeCSV(sumMKT),
      escapeCSV(sumBHXH),
      escapeCSV(sumThue),
      escapeCSV(sumPKProfit),
      escapeCSV("Báo cáo hợp nhất Ban Giám Đốc PG Home")
    ].join(','));

    const csvContent = csvLines.join('\r\n');
    triggerDownload("Bao_Cao_CCSC_12_Thang_2026_PG_Home.csv", csvContent);
    return { success: true, totalSales: sumSales, totalCash: sumCash };
  }

  // ============================================================================
  // 5. XUẤT DANH SÁCH CÔNG NỢ 9 NHÀ CUNG CẤP (SUPPLIER DEBTS REPORT)
  // ============================================================================
  function exportSupplierDebts(customData) {
    const state = resolveLiveState(customData);
    const debts = state.supplierDebts || DEFAULT_BASELINE_DATA.supplierDebts;
    const brand = state.brand || DEFAULT_BASELINE_DATA.brand;

    let csvLines = [];

    // Header công ty
    csvLines.push([escapeCSV(brand.name)].join(','));
    csvLines.push([escapeCSV("SỔ THEO DÕI VÀ ĐỐI SOÁT CÔNG NỢ NHÀ CUNG CẤP VẬT TƯ & PHỤ KIỆN")].join(','));
    csvLines.push([escapeCSV("Chuẩn đối soát 3 lớp Zalo - Ngày cập nhật: " + new Date().toLocaleDateString('vi-VN'))].join(','));
    csvLines.push("");

    const headers = [
      "STT",
      "Tên Nhà Cung Cấp (NCC)",
      "Đại Diện Liên Hệ / Kế Toán",
      "Danh Mục Mặt Hàng / Vật Tư Cung Cấp",
      "Dư Nợ Thực Tế Còn Lại (đ)",
      "Hạn Thanh Toán Hợp Đồng",
      "Trạng Thái Công Nợ",
      "Nhóm Zalo Kết Nối Đối Soát",
      "Chi Tiết Ghi Chú & Lịch Sử Giao Dịch Zalo"
    ];
    csvLines.push(headers.map(escapeCSV).join(','));

    let stt = 1;
    let totalDebt = 0;

    debts.forEach(function (d) {
      const debtVal = Number(d.debt || 0);
      totalDebt += debtVal;

      csvLines.push([
        escapeCSV(stt++),
        escapeCSV(d.ncc || ""),
        escapeCSV(d.rep || ""),
        escapeCSV(d.category || ""),
        escapeCSV(debtVal),
        escapeCSV(d.deadline || ""),
        escapeCSV(d.status || ""),
        escapeCSV(d.group || ""),
        escapeCSV(d.note || "")
      ].join(','));
    });

    // Dòng TỔNG NỢ NCC
    csvLines.push([
      escapeCSV("TỔNG CỘNG CÔNG NỢ"),
      escapeCSV(debts.length + " Nhà Cung Cấp Đối Tác"),
      escapeCSV(""),
      escapeCSV(""),
      escapeCSV(totalDebt),
      escapeCSV(""),
      escapeCSV("Theo Dõi Nghiêm Ngặt"),
      escapeCSV(""),
      escapeCSV("Bảo vệ dòng tiền két sắt - Kiểm soát dưới hạn mức tín dụng")
    ].join(','));

    const csvContent = csvLines.join('\r\n');
    triggerDownload("Cong_No_Nha_Cung_Cap_PG_Home.csv", csvContent);
    return { success: true, count: debts.length, totalDebt: totalDebt };
  }

  // ============================================================================
  // 6. XUẤT TOÀN BỘ TRỌN GÓI 3 BÁO CÁO (EXPORT ALL IN 1 CLICK)
  // ============================================================================
  function exportAll(customData) {
    const s = resolveLiveState(customData);
    exportPayrollT10(s);
    setTimeout(function () {
      exportCCSC12Months(s);
    }, 400);
    setTimeout(function () {
      exportSupplierDebts(s);
    }, 800);
    return { success: true, message: "Đang tải xuống trọn bộ 3 file CSV/Excel UTF-8 BOM chuẩn tiếng Việt." };
  }

  // ============================================================================
  // 7. TIỆN ÍCH DÀNH RIÊNG CHO GIAO DIỆN WEB APP (UI RENDER HELPER)
  // ============================================================================
  /**
   * Tạo nhanh các nút bấm xuất báo cáo gắn vào bất kỳ container HTML nào
   * @param {string|HTMLElement} containerIdOrElement
   */
  function renderExportButtons(containerIdOrElement) {
    if (typeof document === 'undefined') return;
    const el = typeof containerIdOrElement === 'string' 
      ? document.getElementById(containerIdOrElement) 
      : containerIdOrElement;

    if (!el) return;

    el.innerHTML = `
      <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
        <span style="font-weight: 600; color: #1e293b; margin-right: 5px;">📊 Xuất Excel/CSV:</span>
        <button id="btnExportPayrollT10" style="background: #0284c7; color: #fff; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
          📥 Bảng Lương T10
        </button>
        <button id="btnExportCCSC12" style="background: #16a34a; color: #fff; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
          📈 CCSC 12 Tháng
        </button>
        <button id="btnExportSupplierDebts" style="background: #d97706; color: #fff; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
          🤝 Công Nợ NCC (9 NCC)
        </button>
        <button id="btnExportAll" style="background: #4f46e5; color: #fff; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
          ⚡ Xuất Tất Cả (1 Chạm)
        </button>
      </div>
    `;

    document.getElementById("btnExportPayrollT10").onclick = function () { exportPayrollT10(); };
    document.getElementById("btnExportCCSC12").onclick = function () { exportCCSC12Months(); };
    document.getElementById("btnExportSupplierDebts").onclick = function () { exportSupplierDebts(); };
    document.getElementById("btnExportAll").onclick = function () { exportAll(); };
  }

  // ============================================================================
  // PUBLIC API INTERFACE
  // ============================================================================
  return {
    version: "1.0.0",
    author: "Công nhân Flash W27",
    exportPayrollT10: exportPayrollT10,
    exportCCSC12Months: exportCCSC12Months,
    exportSupplierDebts: exportSupplierDebts,
    exportAll: exportAll,
    downloadCSV: triggerDownload,
    escapeCSV: escapeCSV,
    formatNumber: formatNumber,
    renderExportButtons: renderExportButtons,
    DEFAULT_BASELINE_DATA: DEFAULT_BASELINE_DATA
  };
});
