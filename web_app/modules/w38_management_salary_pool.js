/**
 * ==============================================================================
 * HỆ THỐNG QUẢN TRỊ & TỰ ĐỘNG HÓA PG HOME LUXURY
 * TỔ HỢP VĂN PHÒNG & NHÀ MÁY SẢN XUẤT NỘI THẤT PHÚ GIA
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Hotline: 0986.722.324 | MST: 042203002931
 * ==============================================================================
 * MODULE W38: BẢNG TÍNH LƯƠNG & PHỤ CẤP QUẢN LÝ (THÁI - VŨ - HIỆP - DŨNG)
 * TÁCH BIỆT RÕ LƯƠNG CỨNG HÀNG THÁNG & QUỸ THƯỞNG VƯỢT DOANH SỐ > 500M CUỐI NĂM
 * 
 * KỶ LUẬT THÉP BẢO VỆ DÒNG TIỀN KÉT SẮT:
 * 1. Lương cứng & phụ cấp: Chi trả định kỳ hàng tháng theo ngày công thực tế (chuẩn 26 công).
 * 2. Thưởng vượt doanh số > 500M: GIỮ LẠI ĐẾN TẤT NIÊN CUỐI NĂM ĐỐI SOÁT XONG MỚI THANH TOÁN.
 *    - Quản lý xưởng Thái: 0.5%
 *    - Kỹ thuật CNC/Vật tư Vũ: 0.3%
 *    - Sale Admin Hiệp: 0.5%
 *    - Kinh doanh/Dự án Dũng: 0.5%
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W38 = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --- CẤU HÌNH NHÂN SỰ QUẢN LÝ NÒNG CỐT ---
  const MANAGERS_CONFIG = [
    {
      id: 'thai',
      code: 'QL-01',
      fullName: 'Nguyễn Văn Thái',
      shortName: 'Thái',
      dept: 'Quản lý xưởng sản xuất',
      role: 'Quản lý xưởng sản xuất & Tiến độ thi công',
      group: 'QLX',
      phone: '0915.223.456',
      baseSalary: 11500000, // Lương cơ bản tháng (chuẩn 26 ngày)
      allowance: 500000,    // Phụ cấp trách nhiệm / liên lạc
      bonusRate: 0.005,     // 0.5% vượt mốc 500M
      bonusRateDisplay: '0.5%',
      note: 'Chịu trách nhiệm toàn bộ xưởng sản xuất, tiến độ giao hàng & kiểm soát tỷ lệ hao hụt ván'
    },
    {
      id: 'vu',
      code: 'QL-02',
      fullName: 'Hoàng Công Vũ',
      shortName: 'Vũ',
      dept: 'Kỹ thuật xưởng & Vật tư',
      role: 'Kỹ thuật bóc tách vật tư / CNC & Cam chốt',
      group: 'QLX',
      phone: '0988.223.344',
      baseSalary: 9500000,  // Lương cơ bản tháng (Thái 11.5M + Vũ 9.5M = 21.0M chuẩn quỹ QLX CCSC)
      allowance: 500000,    // Phụ cấp kỹ thuật máy / dao phay CNC
      bonusRate: 0.003,     // 0.3% vượt mốc 500M
      bonusRateDisplay: '0.3%',
      note: 'Bóc tách bản vẽ kỹ thuật, lập trình chạy dao CNC, tối ưu hóa xếp ván Nesting & cấp vật tư'
    },
    {
      id: 'hiep',
      code: 'VP-01',
      fullName: 'Tống Trần Hiệp',
      shortName: 'Hiệp',
      dept: 'Văn phòng & Sale Admin',
      role: 'Sale Admin, Dự toán báo giá & Phối cảnh 3D',
      group: 'VANPHONG_SALE',
      phone: '0977.112.233',
      baseSalary: 6500000,  // Chuẩn hiep_cb CCSC: 6.5M/tháng
      allowance: 500000,    // Phụ cấp phần mềm đồ họa / máy tính
      bonusRate: 0.005,     // 0.5% vượt mốc 500M
      bonusRateDisplay: '0.5%',
      note: 'Lập dự toán nhà ở, kiểm soát chi phí cost <= 54%, phối cảnh 3D & hồ sơ kỹ thuật văn phòng'
    },
    {
      id: 'dung',
      code: 'KD-01',
      fullName: 'Đường Việt Dũng',
      shortName: 'Dũng',
      dept: 'Phòng Kinh Doanh',
      role: 'Phụ trách Kinh Doanh & Sale Dự Án Nhà Ở',
      group: 'BPKD',
      phone: '0982.889.901',
      baseSalary: 6000000,  // Lương cứng kinh doanh
      allowance: 500000,    // Phụ cấp tiếp khách / thị trường
      bonusRate: 0.005,     // 0.5% vượt mốc 500M
      bonusRateDisplay: '0.5%',
      note: 'Khai thác khách hàng biệt thự/nhà phố, đàm phán hợp đồng & bảo vệ dòng tiền thu hồi công nợ'
    }
  ];

  // --- DỮ LIỆU THÁNG GỐC THEO CCSC & CHẤM CÔNG (KẾ THỪA TỪ LIVE STATE) ---
  const DEFAULT_CCSC_MONTHS = [
    { m: 1, name: 'Tháng 1', sales: 250000000, debt: 25000000, cash: 225000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 3000000, bpkd: 15000000, qlx: 21000000, isActual: false },
    { m: 2, name: 'Tháng 2', sales: 80000000,  debt: 8000000,  cash: 72000000,  bld: 12000000, hiep_cb: 6500000, hiep_sale: 1000000, bpkd: 7500000,  qlx: 21000000, isActual: false },
    { m: 3, name: 'Tháng 3', sales: 220000000, debt: 22000000, cash: 198000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 3000000, bpkd: 14500000, qlx: 21000000, isActual: false },
    { m: 4, name: 'Tháng 4', sales: 300000000, debt: 30000000, cash: 270000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 4000000, bpkd: 18000000, qlx: 21000000, isActual: false },
    { m: 5, name: 'Tháng 5', sales: 350000000, debt: 35000000, cash: 315000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 4500000, bpkd: 19000000, qlx: 21000000, isActual: false },
    { m: 6, name: 'Tháng 6', sales: 289578000, debt: 240000000, cash: 49578000, bld: 12000000, hiep_cb: 3500000, hiep_sale: 1978900, bpkd: 16923076, qlx: 11961539, isActual: true },
    { m: 7, name: 'Tháng 7', sales: 450000000, debt: 67500000, cash: 382500000, bld: 19970529, hiep_cb: 6500000, hiep_sale: 5000000, bpkd: 11691538, qlx: 22500000, isActual: true },
    { m: 8, name: 'Tháng 8', sales: 242051705, debt: 69803651, cash: 172248054, bld: 12000000, hiep_cb: 6500000, hiep_sale: 3000000, bpkd: 10500000, qlx: 19615385, isActual: true },
    { m: 9, name: 'Tháng 9', sales: 287782767, debt: 138066647, cash: 149716120, bld: 12000000, hiep_cb: 6500000, hiep_sale: 7000000, bpkd: 9865385,  qlx: 20250000, isActual: true },
    { m: 10, name: 'Tháng 10', sales: 480000000, debt: 48000000, cash: 432000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 6000000, bpkd: 18000000, qlx: 21000000, isActual: false },
    { m: 11, name: 'Tháng 11', sales: 580000000, debt: 58000000, cash: 522000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 8000000, bpkd: 22000000, qlx: 21000000, isActual: false },
    { m: 12, name: 'Tháng 12', sales: 520000000, debt: 52000000, cash: 468000000, bld: 12000000, hiep_cb: 6500000, hiep_sale: 7000000, bpkd: 20000000, qlx: 21000000, isActual: false }
  ];

  // Dữ liệu ngày công thực tế ghi nhận (Tháng 8, 9, 10 theo timesheets thực tế)
  const ATTENDANCE_SAMPLE = {
    8: { thai: 27, vu: 22, hiep: 27.5, dung: 28.5 },
    9: { thai: 24.5, vu: 25.5, hiep: 28, dung: 25 },
    10: { thai: 26.5, vu: 26, hiep: 26, dung: 26 }
  };

  // Ngưỡng doanh số xét thưởng giữ lại
  const BONUS_SALES_THRESHOLD = 500000000; // 500 Triệu VNĐ

  // Helper format tiền tệ VNĐ
  function formatMoney(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
    return Math.round(amount).toLocaleString('vi-VN') + ' đ';
  }

  function formatShortMoney(amount) {
    if (!amount || isNaN(amount)) return '0 Tr';
    const mil = amount / 1000000;
    return mil >= 1 ? `${mil.toFixed(1)} Tr` : `${(amount / 1000).toFixed(0)} K`;
  }

  /**
   * Tính toán lương và quỹ thưởng cho 1 tháng
   * @param {Object} monthData Dữ liệu tháng từ CCSC
   * @param {Object} attData Ngày công thực tế (nếu có)
   * @param {String} bonusMode 'SURPLUS_ONLY' (trên phần vượt > 500M) hoặc 'FULL_SALES' (trên toàn bộ doanh số khi vượt mốc)
   */
  function calculateMonth(monthData, attData = null, bonusMode = 'SURPLUS_ONLY') {
    const m = monthData.m;
    const sales = Number(monthData.sales) || 0;
    const isExceeded = sales > BONUS_SALES_THRESHOLD;
    const surplusSales = isExceeded ? (sales - BONUS_SALES_THRESHOLD) : 0;

    const baseAtt = attData || ATTENDANCE_SAMPLE[m] || { thai: 26, vu: 26, hiep: 26, dung: 26 };

    const managerResults = MANAGERS_CONFIG.map(mgr => {
      const days = baseAtt[mgr.id] !== undefined ? baseAtt[mgr.id] : 26;
      // Ngày công chuẩn là 26 ngày/tháng
      const dailyRate = mgr.baseSalary / 26;
      const salaryByDays = Math.round(dailyRate * days);
      const allowance = mgr.allowance;

      // Phụ cấp hoa hồng phát sinh trong tháng theo dữ liệu CCSC
      let monthCommission = 0;
      if (mgr.id === 'hiep') {
        monthCommission = Number(monthData.hiep_sale) || 0;
      } else if (mgr.id === 'dung') {
        // bpkd trong CCSC phản ánh tổng chi kinh doanh (lương cơ bản + hoa hồng)
        const totalBpkd = Number(monthData.bpkd) || 0;
        monthCommission = Math.max(0, totalBpkd - mgr.baseSalary);
      }

      // 1. TỔNG LƯƠNG CỨNG HÀNG THÁNG (Được thanh toán hàng tháng)
      const monthlyPayable = salaryByDays + allowance + monthCommission;

      // 2. QUỸ THƯỞNG VƯỢT DOANH SỐ > 500M (KHÓA KÉT SẮT GIỮ ĐẾN CUỐI NĂM)
      let bonusBase = 0;
      if (isExceeded) {
        bonusBase = (bonusMode === 'FULL_SALES') ? sales : surplusSales;
      }
      const retainedBonus = Math.round(bonusBase * mgr.bonusRate);

      return {
        managerId: mgr.id,
        fullName: mgr.fullName,
        shortName: mgr.shortName,
        dept: mgr.dept,
        role: mgr.role,
        group: mgr.group,
        baseSalary: mgr.baseSalary,
        days: days,
        dailyRate: Math.round(dailyRate),
        salaryByDays: salaryByDays,
        allowance: allowance,
        monthCommission: monthCommission,
        monthlyPayable: monthlyPayable, // Thực nhận tháng
        // Thưởng vượt mốc > 500M
        isEligibleBonus: isExceeded,
        bonusRate: mgr.bonusRate,
        bonusRateDisplay: mgr.bonusRateDisplay,
        bonusBase: bonusBase,
        retainedBonus: retainedBonus,    // Giữ lại két sắt
        retainedStatus: isExceeded ? 'LOCKED_RETAINED' : 'NOT_REACHED'
      };
    });

    const totalMonthlySalary = managerResults.reduce((sum, r) => sum + r.monthlyPayable, 0);
    const totalRetainedBonus = managerResults.reduce((sum, r) => sum + r.retainedBonus, 0);

    return {
      month: m,
      monthName: monthData.name,
      sales: sales,
      isExceeded: isExceeded,
      surplusSales: surplusSales,
      totalMonthlySalary: totalMonthlySalary,
      totalRetainedBonus: totalRetainedBonus,
      managers: managerResults,
      bonusMode: bonusMode,
      isActual: monthData.isActual || false
    };
  }

  /**
   * Tính toán toàn bộ 12 tháng và tổng hợp quỹ thưởng cuối năm
   */
  function calculateFullYear(ccscMonths = null, bonusMode = 'SURPLUS_ONLY') {
    const months = ccscMonths || DEFAULT_CCSC_MONTHS;
    const monthlyDetails = months.map(m => calculateMonth(m, ATTENDANCE_SAMPLE[m.m], bonusMode));

    // Tổng hợp từng quản lý
    const managerSummaries = MANAGERS_CONFIG.map(mgr => {
      let totalSalaryByDays = 0;
      let totalAllowance = 0;
      let totalCommission = 0;
      let totalMonthlyPaid = 0;
      let totalRetainedBonus = 0;
      let exceededMonthsCount = 0;

      monthlyDetails.forEach(mDetail => {
        const p = mDetail.managers.find(item => item.managerId === mgr.id);
        if (p) {
          totalSalaryByDays += p.salaryByDays;
          totalAllowance += p.allowance;
          totalCommission += p.monthCommission;
          totalMonthlyPaid += p.monthlyPaid !== undefined ? p.monthlyPaid : p.monthlyPayable;
          totalRetainedBonus += p.retainedBonus;
          if (p.retainedBonus > 0) exceededMonthsCount++;
        }
      });

      return {
        managerId: mgr.id,
        fullName: mgr.fullName,
        shortName: mgr.shortName,
        dept: mgr.dept,
        role: mgr.role,
        baseSalary: mgr.baseSalary,
        bonusRateDisplay: mgr.bonusRateDisplay,
        totalSalaryByDays: totalSalaryByDays,
        totalAllowance: totalAllowance,
        totalCommission: totalCommission,
        totalMonthlyPaid: totalMonthlyPaid,
        totalRetainedBonus: totalRetainedBonus,
        exceededMonthsCount: exceededMonthsCount,
        grandTotalIncome: totalMonthlyPaid + totalRetainedBonus
      };
    });

    const grandSales = monthlyDetails.reduce((sum, m) => sum + m.sales, 0);
    const grandMonthlySalary = managerSummaries.reduce((sum, s) => sum + s.totalMonthlyPaid, 0);
    const grandRetainedBonusPool = managerSummaries.reduce((sum, s) => sum + s.totalRetainedBonus, 0);
    const exceededMonths = monthlyDetails.filter(m => m.isExceeded);

    return {
      months: monthlyDetails,
      managers: managerSummaries,
      grandSales: grandSales,
      grandMonthlySalary: grandMonthlySalary,
      grandRetainedBonusPool: grandRetainedBonusPool,
      exceededMonthsCount: exceededMonths.length,
      exceededMonthsList: exceededMonths.map(m => m.monthName),
      bonusMode: bonusMode,
      generatedAt: new Date().toISOString()
    };
  }

  // --- HTML TEMPLATE & RENDERER ---
  const UI = {
    currentTab: 'overview',
    currentBonusMode: 'SURPLUS_ONLY', // 'SURPLUS_ONLY' | 'FULL_SALES'
    selectedMonth: 11, // Mặc định hiển thị tháng 11 (vượt 580M)

    init: function (containerId, liveState = null) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`[W38] Container #${containerId} không tồn tại.`);
        return;
      }
      this.container = container;
      this.liveState = liveState || (window.PG_LIVE_STATE ? window.PG_LIVE_STATE : null);
      this.render();
    },

    setBonusMode: function (mode) {
      this.currentBonusMode = mode;
      this.render();
    },

    setTab: function (tab) {
      this.currentTab = tab;
      this.render();
    },

    setMonth: function (m) {
      this.selectedMonth = parseInt(m, 10);
      this.render();
    },

    render: function () {
      if (!this.container) return;

      const ccscMonths = (this.liveState && this.liveState.ccscMonths) ? this.liveState.ccscMonths : DEFAULT_CCSC_MONTHS;
      const data = calculateFullYear(ccscMonths, this.currentBonusMode);
      const selectedMonthData = data.months.find(m => m.month === this.selectedMonth) || data.months[10];

      let tabContent = '';
      if (this.currentTab === 'overview') {
        tabContent = this.renderOverviewTab(data, selectedMonthData);
      } else if (this.currentTab === 'retained_safe') {
        tabContent = this.renderRetainedSafeTab(data);
      } else if (this.currentTab === 'managers') {
        tabContent = this.renderManagersTab(data);
      } else if (this.currentTab === 'rules') {
        tabContent = this.renderRulesTab();
      }

      this.container.innerHTML = `
        <div class="pg-w38-container font-sans text-slate-800 bg-slate-50 p-4 md:p-6 rounded-2xl shadow-xl border border-slate-200">
          <!-- HEADER THƯƠNG HIỆU PHÚ GIA & TIÊU ĐỀ MODULE -->
          <div class="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <i class="fas fa-lock mr-1"></i> KHOẢNH ĐẤT ĐỘC LẬP W38
                </span>
                <span class="text-xs text-slate-500 font-medium">Hệ Thống Quản Trị PG Home Luxury</span>
              </div>
              <h1 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <i class="fas fa-money-check-alt text-amber-600"></i>
                Bảng Tính Lương & Quỹ Thưởng Quản Lý Nòng Cốt
              </h1>
              <p class="text-xs md:text-sm text-slate-600 mt-0.5">
                Tổ hợp VP & Nhà máy Sản xuất: <strong>Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh</strong> | Hotline: <strong>0986.722.324</strong>
              </p>
            </div>

            <!-- CHẾ ĐỘ TÍNH THƯỞNG VƯỢT NGƯỠNG -->
            <div class="flex flex-col items-end gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
              <span class="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <i class="fas fa-sliders-h text-indigo-500"></i> Phương thức xét thưởng > 500M:
              </span>
              <div class="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
                <button onclick="window.PG_Modules_W38.setBonusMode('SURPLUS_ONLY')" 
                  class="px-3 py-1 rounded-md transition-all ${this.currentBonusMode === 'SURPLUS_ONLY' ? 'bg-amber-600 text-white font-bold shadow' : 'text-slate-600 hover:text-slate-900'}">
                  Phần Vượt > 500M (Chuẩn Két Sắt)
                </button>
                <button onclick="window.PG_Modules_W38.setBonusMode('FULL_SALES')" 
                  class="px-3 py-1 rounded-md transition-all ${this.currentBonusMode === 'FULL_SALES' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-600 hover:text-slate-900'}">
                  Toàn Bộ Doanh Số Khi Đạt
                </button>
              </div>
            </div>
          </div>

          <!-- 4 KPI BỎ TÚI CỦA BAN GIÁM ĐỐC -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
            <!-- KPI 1: LƯƠNG CỨNG HÀNG THÁNG CẢ NĂM -->
            <div class="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                <span>Tổng Lương Cứng & PC Hàng Tháng</span>
                <i class="fas fa-calendar-check text-emerald-500 text-base"></i>
              </div>
              <div class="text-xl font-black text-slate-900 mt-2">
                ${formatMoney(data.grandMonthlySalary)}
              </div>
              <div class="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <i class="fas fa-check-circle"></i> Chi trả định kỳ ngày 05-10 hàng tháng
              </div>
            </div>

            <!-- KPI 2: QUỸ THƯỞNG VƯỢT > 500M GIỮ LẠI ĐẾN TẤT NIÊN -->
            <div class="bg-white p-4 rounded-xl border-l-4 border-amber-500 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                <span>Quỹ Thưởng > 500M Giữ Cuối Năm</span>
                <i class="fas fa-vault text-amber-500 text-base"></i>
              </div>
              <div class="text-xl font-black text-amber-700 mt-2">
                ${formatMoney(data.grandRetainedBonusPool)}
              </div>
              <div class="text-xs text-amber-700 mt-1 font-semibold flex items-center gap-1">
                <i class="fas fa-lock"></i> 🔒 Khóa cứng két sắt - Chi dịp Tất niên
              </div>
            </div>

            <!-- KPI 3: DOANH SỐ TOÀN NĂM & SỐ THÁNG VƯỢT MỐC -->
            <div class="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                <span>Doanh Số Toàn Hệ Thống 2026</span>
                <i class="fas fa-chart-line text-blue-500 text-base"></i>
              </div>
              <div class="text-xl font-black text-slate-900 mt-2">
                ${formatMoney(data.grandSales)}
              </div>
              <div class="text-xs text-blue-600 mt-1 font-medium">
                Có <strong>${data.exceededMonthsCount} tháng</strong> vượt mốc 500M (${data.exceededMonthsList.join(', ') || 'Chưa có'})
              </div>
            </div>

            <!-- KPI 4: 4 NHÂN SỰ QUẢN LÝ NÒNG CỐT -->
            <div class="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-sm border border-slate-200">
              <div class="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                <span>Nhân Sự Quản Lý Trọng Yếu</span>
                <i class="fas fa-users-cog text-indigo-500 text-base"></i>
              </div>
              <div class="text-base font-bold text-slate-800 mt-1 flex flex-wrap gap-1">
                <span class="px-2 py-0.5 bg-slate-100 rounded text-xs">Thái (0.5%)</span>
                <span class="px-2 py-0.5 bg-slate-100 rounded text-xs">Vũ (0.3%)</span>
                <span class="px-2 py-0.5 bg-slate-100 rounded text-xs">Hiệp (0.5%)</span>
                <span class="px-2 py-0.5 bg-slate-100 rounded text-xs">Dũng (0.5%)</span>
              </div>
              <div class="text-xs text-indigo-600 mt-1 font-medium">
                Quản lý Xưởng & Phòng Kinh Doanh PG Home
              </div>
            </div>
          </div>

          <!-- THANH ĐIỀU HƯỚNG TAB -->
          <div class="flex border-b border-slate-200 mb-5 gap-2 overflow-x-auto text-xs md:text-sm">
            <button onclick="window.PG_Modules_W38.setTab('overview')"
              class="py-2.5 px-4 font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${this.currentTab === 'overview' ? 'border-amber-600 text-amber-700 bg-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fas fa-table"></i> Chi Tiết Hàng Tháng (Tháng 1 - 12)
            </button>
            <button onclick="window.PG_Modules_W38.setTab('retained_safe')"
              class="py-2.5 px-4 font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${this.currentTab === 'retained_safe' ? 'border-amber-600 text-amber-700 bg-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fas fa-vault text-amber-600"></i> Két Sắt Quỹ Thưởng Cuối Năm
            </button>
            <button onclick="window.PG_Modules_W38.setTab('managers')"
              class="py-2.5 px-4 font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${this.currentTab === 'managers' ? 'border-amber-600 text-amber-700 bg-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fas fa-id-card"></i> Hồ Sơ 4 Quản Lý Nòng Cốt
            </button>
            <button onclick="window.PG_Modules_W38.setTab('rules')"
              class="py-2.5 px-4 font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${this.currentTab === 'rules' ? 'border-amber-600 text-amber-700 bg-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i class="fas fa-balance-scale"></i> Điều Lệ Thép & Luật Két Sắt
            </button>
          </div>

          <!-- NỘI DUNG TAB -->
          <div class="tab-body">
            ${tabContent}
          </div>

          <!-- FOOTER CAM KẾT & PHÁP LÝ -->
          <div class="mt-6 pt-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div class="flex items-center gap-2">
              <i class="fas fa-shield-alt text-emerald-600"></i>
              <span>Quy tắc chuẩn hóa vĩnh viễn bởi Ban Giám Đốc PG Home - Chống thất thoát & bảo vệ dòng tiền két sắt</span>
            </div>
            <div>
              <span>Mã HKD: <strong>042203002931</strong> | Bản quyền © 2026 Nội Thất & Xây Dựng Phú Gia</span>
            </div>
          </div>
        </div>
      `;
    },

    // --- TAB 1: CHI TIẾT TỪNG THÁNG ---
    renderOverviewTab: function (data, currentMonth) {
      const monthSelectorHtml = data.months.map(m => `
        <button onclick="window.PG_Modules_W38.setMonth(${m.month})" 
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${m.month === this.selectedMonth ? 'bg-amber-600 text-white shadow-md' : (m.isExceeded ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200')}">
          ${m.monthName} ${m.isExceeded ? '🔥' : ''}
        </button>
      `).join('');

      const m = currentMonth;
      const isExceeded = m.isExceeded;

      return `
        <div class="space-y-4">
          <!-- BỘ CHỌN THÁNG -->
          <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-700 uppercase"><i class="fas fa-calendar-alt text-amber-600"></i> Chọn tháng đối soát:</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${monthSelectorHtml}
            </div>
          </div>

          <!-- BANNER TRẠNG THÁI DOANH SỐ THÁNG ĐƯỢC CHỌN -->
          <div class="p-4 rounded-xl border ${isExceeded ? 'bg-amber-50 border-amber-300' : 'bg-slate-100 border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${isExceeded ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-300 text-slate-600'}">
                T${m.month}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-slate-900">${m.monthName} / 2026</h3>
                  ${m.isActual ? '<span class="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">Dữ liệu thực tế</span>' : '<span class="px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-700 font-medium">CCSC Kế hoạch</span>'}
                  ${isExceeded ? '<span class="px-2 py-0.5 rounded text-xs bg-red-100 text-red-800 font-bold animate-pulse border border-red-300">🔥 VƯỢT MỐC 500M</span>' : '<span class="px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-600">Dưới ngưỡng 500M</span>'}
                </div>
                <div class="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Doanh số thực thu: <strong class="text-slate-900">${formatMoney(m.sales)}</strong></span>
                  <span>Ngưỡng xét thưởng: <strong class="text-slate-700">${formatMoney(BONUS_SALES_THRESHOLD)}</strong></span>
                  ${isExceeded ? `<span>Phần vượt ngưỡng: <strong class="text-amber-700">${formatMoney(m.surplusSales)}</strong></span>` : ''}
                </div>
              </div>
            </div>

            <!-- TỔNG KẾT THÁNG -->
            <div class="flex items-center gap-4 text-right">
              <div>
                <div class="text-xs text-slate-500 font-medium">Lương cứng tháng này:</div>
                <div class="text-base font-bold text-emerald-700">${formatMoney(m.totalMonthlySalary)}</div>
              </div>
              <div class="border-l border-slate-300 pl-4">
                <div class="text-xs text-slate-500 font-medium">Thưởng giữ két sắt:</div>
                <div class="text-base font-black text-amber-700">${formatMoney(m.totalRetainedBonus)}</div>
              </div>
            </div>
          </div>

          <!-- BẢNG BÓC TÁCH CHI TIẾT 4 QUẢN LÝ -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                <i class="fas fa-list text-amber-600 mr-1.5"></i> Bảng Lương & Thưởng Chi Tiết 4 Quản Lý (${m.monthName})
              </span>
              <span class="text-xs text-slate-500">
                ĐVT: Việt Nam Đồng (VNĐ)
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left border-collapse">
                <thead>
                  <tr class="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th class="py-3 px-3 font-bold">STT</th>
                    <th class="py-3 px-3 font-bold">Họ và Tên</th>
                    <th class="py-3 px-3 font-bold">Chức Danh / Bộ Phận</th>
                    <th class="py-3 px-3 font-bold text-center">Lương Cơ Bản</th>
                    <th class="py-3 px-3 font-bold text-center">Công Thực Tế</th>
                    <th class="py-3 px-3 font-bold text-right">Lương Theo Công</th>
                    <th class="py-3 px-3 font-bold text-right">Phụ Cấp</th>
                    <th class="py-3 px-3 font-bold text-right">Hoa Hồng Tháng</th>
                    <th class="py-3 px-3 font-bold text-right text-emerald-800 bg-emerald-50">LƯƠNG CỨNG THỰC LĨNH</th>
                    <th class="py-3 px-3 font-bold text-center">Tỷ Lệ Thưởng</th>
                    <th class="py-3 px-3 font-bold text-right text-amber-900 bg-amber-50">🔒 THƯỞNG GIỮ LẠI (TẤT NIÊN)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-800">
                  ${m.managers.map((mgr, idx) => `
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="py-3 px-3 text-center text-slate-400 font-mono">${idx + 1}</td>
                      <td class="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span class="w-6 h-6 rounded-full bg-slate-200 text-slate-700 inline-flex items-center justify-center text-xs font-bold">
                          ${mgr.shortName.charAt(0)}
                        </span>
                        <span>${mgr.fullName}</span>
                      </td>
                      <td class="py-3 px-3 text-slate-600">
                        <div>${mgr.role}</div>
                        <span class="text-[10px] text-slate-400">${mgr.dept}</span>
                      </td>
                      <td class="py-3 px-3 text-center font-mono">${formatMoney(mgr.baseSalary)}</td>
                      <td class="py-3 px-3 text-center">
                        <span class="inline-block px-2 py-0.5 rounded font-bold ${mgr.days >= 26 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                          ${mgr.days} / 26
                        </span>
                      </td>
                      <td class="py-3 px-3 text-right font-mono">${formatMoney(mgr.salaryByDays)}</td>
                      <td class="py-3 px-3 text-right font-mono text-slate-600">${formatMoney(mgr.allowance)}</td>
                      <td class="py-3 px-3 text-right font-mono text-blue-700">${formatMoney(mgr.monthCommission)}</td>
                      <td class="py-3 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/60 text-sm">
                        ${formatMoney(mgr.monthlyPayable)}
                      </td>
                      <td class="py-3 px-3 text-center font-bold text-indigo-700 font-mono">
                        ${mgr.bonusRateDisplay}
                      </td>
                      <td class="py-3 px-3 text-right font-mono font-black text-amber-800 bg-amber-50/80 text-sm">
                        ${mgr.retainedBonus > 0 ? `+${formatMoney(mgr.retainedBonus)}` : '<span class="text-slate-400 font-normal">0 đ</span>'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr class="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colspan="8" class="py-3 px-3 text-right uppercase text-xs">Tổng Cộng Tháng ${m.month}:</td>
                    <td class="py-3 px-3 text-right font-mono text-sm text-emerald-800 bg-emerald-100/70">
                      ${formatMoney(m.totalMonthlySalary)}
                    </td>
                    <td></td>
                    <td class="py-3 px-3 text-right font-mono text-sm text-amber-900 bg-amber-100/80">
                      ${formatMoney(m.totalRetainedBonus)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- LỜI NHẮC KỶ LUẬT THÉP -->
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <i class="fas fa-exclamation-triangle text-amber-600 text-base mt-0.5"></i>
            <div>
              <strong>KỶ LUẬT THÉP GIỮ KÉT SẮT CỦA GIÁM ĐỐC NGUYỄN VIẾT NGHĨA:</strong>
              Cột <em>"Lương Cứng Thực Lĩnh"</em> chi trả đầy đủ vào kỳ lương hàng tháng.
              Cột <em>"Thưởng Giữ Lại"</em> (${m.totalRetainedBonus > 0 ? formatMoney(m.totalRetainedBonus) : '0 đ'}) 
              tuyệt đối không được tạm ứng, khóa cứng trong két sắt đến đêm Tất niên cuối năm 2026 sau khi Giám Đốc đối soát công nợ 3 bên xong mới ký duyệt chi.
            </div>
          </div>
        </div>
      `;
    },

    // --- TAB 2: KÉT SẮT QUỸ THƯỞNG CUỐI NĂM ---
    renderRetainedSafeTab: function (data) {
      return `
        <div class="space-y-5">
          <!-- CARD BẢO VỆ KÉT SẮT -->
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 rounded-2xl shadow-xl border border-amber-500/30 relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 text-slate-700/20 text-9xl pointer-events-none">
              <i class="fas fa-vault"></i>
            </div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider mb-2">
                  <i class="fas fa-shield-alt mr-1"></i> Két Sắt Giữ Lại Cuối Năm
                </span>
                <h2 class="text-2xl font-black tracking-tight text-amber-400">
                  Tổng Quỹ Thưởng Vượt Doanh Số > 500M Tích Lũy
                </h2>
                <p class="text-xs text-slate-300 mt-1 max-w-xl">
                  Quỹ thưởng được trích lập tự động từ các tháng có doanh số vượt ngưỡng 500 Triệu VNĐ.
                  Chỉ giải ngân duy nhất 01 lần tại Tiệc Tất Niên 2026 khi toàn bộ công nợ khách hàng được thu hồi.
                </p>
              </div>

              <div class="bg-slate-800/80 p-4 rounded-xl border border-amber-400/40 text-right backdrop-blur">
                <span class="text-xs text-amber-300 font-semibold block uppercase">Tổng Tiền Đang Khóa Két Sắt</span>
                <span class="text-3xl font-black text-amber-400 font-mono block mt-1">
                  ${formatMoney(data.grandRetainedBonusPool)}
                </span>
                <span class="text-[11px] text-slate-400 block mt-0.5">
                  Tính trên ${data.exceededMonthsCount} tháng vượt mốc: <strong>${data.exceededMonthsList.join(', ')}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- BẢNG PHÂN BỔ QUỸ CHO TỪNG QUẢN LÝ -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                <i class="fas fa-users text-amber-600 mr-1.5"></i> Phân Bổ Quỹ Thưởng Tích Lũy Cho 4 Quản Lý Nòng Cốt
              </span>
              <span class="text-xs text-slate-500">
                Phương thức: <strong>${data.bonusMode === 'SURPLUS_ONLY' ? 'Tính trên phần chênh lệch vượt > 500M' : 'Tính trên toàn bộ doanh số khi vượt'}</strong>
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left border-collapse">
                <thead>
                  <tr class="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th class="py-3 px-4 font-bold">STT</th>
                    <th class="py-3 px-4 font-bold">Quản Lý Trọng Yếu</th>
                    <th class="py-3 px-4 font-bold">Vị Trí Công Tác</th>
                    <th class="py-3 px-4 font-bold text-center">Tỷ Lệ Thưởng</th>
                    <th class="py-3 px-4 font-bold text-center">Số Tháng Đạt Thưởng</th>
                    <th class="py-3 px-4 font-bold text-right">Tổng Lương Cứng 12 Tháng</th>
                    <th class="py-3 px-4 font-bold text-right text-amber-900 bg-amber-50">TIỀN THƯỞNG TÍCH LŨY (KÉT SẮT)</th>
                    <th class="py-3 px-4 font-bold text-right">Tổng Thu Nhập Cả Năm</th>
                    <th class="py-3 px-4 font-bold text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-800">
                  ${data.managers.map((mgr, idx) => `
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="py-3.5 px-4 text-center font-mono text-slate-400">${idx + 1}</td>
                      <td class="py-3.5 px-4 font-bold text-slate-900">
                        <div class="text-sm">${mgr.fullName}</div>
                        <span class="text-[10px] text-slate-500">${mgr.dept}</span>
                      </td>
                      <td class="py-3.5 px-4 text-slate-600">${mgr.role}</td>
                      <td class="py-3.5 px-4 text-center font-bold text-indigo-700 font-mono text-sm">
                        ${mgr.bonusRateDisplay}
                      </td>
                      <td class="py-3.5 px-4 text-center">
                        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          ${mgr.exceededMonthsCount} / 12 tháng
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-right font-mono text-slate-700">
                        ${formatMoney(mgr.totalMonthlyPaid)}
                      </td>
                      <td class="py-3.5 px-4 text-right font-mono font-black text-amber-800 bg-amber-50/80 text-base">
                        ${formatMoney(mgr.totalRetainedBonus)}
                      </td>
                      <td class="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        ${formatMoney(mgr.grandTotalIncome)}
                      </td>
                      <td class="py-3.5 px-4 text-center">
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <i class="fas fa-lock text-[10px]"></i> Chờ Tất Niên
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr class="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colspan="5" class="py-3.5 px-4 text-right uppercase text-xs">Tổng Quỹ Thưởng & Lương Cả Năm:</td>
                    <td class="py-3.5 px-4 text-right font-mono text-sm text-slate-800">
                      ${formatMoney(data.grandMonthlySalary)}
                    </td>
                    <td class="py-3.5 px-4 text-right font-mono text-lg text-amber-900 bg-amber-100/90">
                      ${formatMoney(data.grandRetainedBonusPool)}
                    </td>
                    <td class="py-3.5 px-4 text-right font-mono text-sm text-slate-900">
                      ${formatMoney(data.grandMonthlySalary + data.grandRetainedBonusPool)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- LỊCH TRÌNH 12 THÁNG & CÁC THÁNG VƯỢT NGƯỠNG -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 class="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-1.5">
              <i class="fas fa-history text-slate-500"></i> Theo Dõi Doanh Số 12 Tháng & Dòng Tiền Trích Thưởng
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              ${data.months.map(m => `
                <div class="p-3 rounded-xl border ${m.isExceeded ? 'bg-amber-50/80 border-amber-300' : 'bg-slate-50 border-slate-200'} flex flex-col justify-between">
                  <div class="flex items-center justify-between text-xs font-bold ${m.isExceeded ? 'text-amber-900' : 'text-slate-600'}">
                    <span>${m.monthName}</span>
                    ${m.isExceeded ? '<span class="text-red-600">🔥 Đạt</span>' : '<span class="text-slate-400">K.Đạt</span>'}
                  </div>
                  <div class="text-sm font-black text-slate-900 mt-2 font-mono">
                    ${formatMoney(m.sales)}
                  </div>
                  <div class="text-[11px] mt-1 pt-1 border-t ${m.isExceeded ? 'border-amber-200 text-amber-800 font-bold' : 'border-slate-200 text-slate-400'}">
                    ${m.isExceeded ? `Thưởng: +${formatMoney(m.totalRetainedBonus)}` : 'Thưởng: 0 đ'}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    // --- TAB 3: HỒ SƠ 4 QUẢN LÝ ---
    renderManagersTab: function (data) {
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${data.managers.map(mgr => {
            const cfg = MANAGERS_CONFIG.find(c => c.id === mgr.managerId);
            return `
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 font-mono">${cfg.code}</span>
                    <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Tỷ lệ thưởng: ${mgr.bonusRateDisplay}
                    </span>
                  </div>

                  <div class="flex items-center gap-3 mt-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-black text-lg shadow-md">
                      ${mgr.shortName.charAt(0)}
                    </div>
                    <div>
                      <h3 class="text-base font-bold text-slate-900">${mgr.fullName}</h3>
                      <p class="text-xs text-slate-500">${mgr.role}</p>
                      <p class="text-[11px] text-slate-400"><i class="fas fa-phone-alt text-[10px] mr-1"></i>${cfg.phone}</p>
                    </div>
                  </div>

                  <p class="text-xs text-slate-600 mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 italic">
                    "${cfg.note}"
                  </p>

                  <div class="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div class="p-2.5 bg-slate-50 rounded-xl">
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Lương cơ bản (26 công)</span>
                      <strong class="text-slate-800 text-sm font-mono">${formatMoney(mgr.baseSalary)}</strong>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-xl">
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Phụ cấp hàng tháng</span>
                      <strong class="text-slate-800 text-sm font-mono">${formatMoney(cfg.allowance)}</strong>
                    </div>
                  </div>
                </div>

                <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span class="text-[11px] text-slate-400 block font-medium">Quỹ Thưởng > 500M Giữ Lại:</span>
                    <span class="text-base font-black text-amber-700 font-mono">${formatMoney(mgr.totalRetainedBonus)}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-[11px] text-slate-400 block font-medium">Tổng Thu Nhập Năm:</span>
                    <span class="text-base font-black text-slate-900 font-mono">${formatMoney(mgr.grandTotalIncome)}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    // --- TAB 4: ĐIỀU LỆ THÉP & LUẬT KÉT SẮT ---
    renderRulesTab: function () {
      return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs text-slate-700 leading-relaxed">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-200">
            <i class="fas fa-gavel text-amber-600 text-lg"></i>
            <h3 class="text-base font-bold text-slate-900">
              Điều Lệ Thép Quản Trị Dòng Tiền & Quy Chế Thưởng Quản Lý PG Home
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h4 class="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                <i class="fas fa-lock text-amber-600"></i> 1. NGUYÊN TẮC KHÓA CỨNG KÉT SẮT (ZERO-ADVANCE)
              </h4>
              <p>
                - Thưởng vượt doanh số <strong>> 500 Triệu VNĐ</strong> là khoản động viên gắn bó trách nhiệm dài hạn của đội ngũ nòng cốt (Thái, Vũ, Hiệp, Dũng).
              </p>
              <p>
                - <strong>TUYỆT ĐỐI CẤM TẠM ỨNG</strong> dưới mọi hình thức trong suốt 12 tháng vận hành. Toàn bộ số tiền thưởng phát sinh hàng tháng đều phải được bảo toàn nguyên vẹn trong tài khoản dự phòng của công ty.
              </p>
              <p>
                - Thời điểm thanh toán duy nhất: <strong>Đêm Tiệc Tất Niên cuối năm 2026</strong> sau khi Ban Giám Đốc nghiệm thu công trình và thu hồi dứt điểm công nợ khách hàng.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <h4 class="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                <i class="fas fa-calendar-check text-emerald-600"></i> 2. NGUYÊN TẮC LƯƠNG CỨNG HÀNG THÁNG
              </h4>
              <p>
                - Lương cơ bản và phụ cấp được chốt sổ vào ngày cuối cùng của tháng và chi trả từ ngày <strong>05 đến ngày 10 hàng tháng</strong>.
              </p>
              <p>
                - Tính theo số ngày công thực tế (Chuẩn 26 ngày công/tháng). Quản lý xưởng Thái & Kỹ thuật Vũ được chấm công theo bảng điểm danh xưởng thực tế; Hiệp & Dũng theo bảng chấm công văn phòng.
              </p>
              <p>
                - Tổng quỹ lương quản lý xưởng (Thái + Vũ) chuẩn hóa <strong>21.000.000 đ/tháng</strong> đúng theo tỷ lệ bóc tách của bảng CCSC 12 tháng.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <h4 class="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                <i class="fas fa-percentage text-blue-600"></i> 3. TỶ LỆ TRÍCH THƯỞNG VƯỢT MỐC > 500M
              </h4>
              <ul class="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>Quản lý xưởng Thái:</strong> <strong>0.5%</strong> phần vượt ngưỡng (Thưởng tiến độ, giảm hao hụt ván và kiểm soát chất lượng mộc).</li>
                <li><strong>Kỹ thuật CNC Vũ:</strong> <strong>0.3%</strong> phần vượt ngưỡng (Thưởng bóc tách chính xác không lỗi CAM, tối ưu Nesting).</li>
                <li><strong>Sale Admin Hiệp:</strong> <strong>0.5%</strong> phần vượt ngưỡng (Thưởng lập dự toán chuẩn chi phí cost $\le 54\%$, hỗ trợ chốt hợp đồng).</li>
                <li><strong>Phòng Kinh Doanh Dũng:</strong> <strong>0.5%</strong> phần vượt ngưỡng (Thưởng chỉ tiêu doanh số dự án và chăm sóc khách hàng).</li>
              </ul>
            </div>

            <div class="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
              <h4 class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <i class="fas fa-shield-alt text-slate-600"></i> 4. ĐIỀU KIỆN TIÊN QUYẾT ĐỂ GIẢI NGÂN
              </h4>
              <p>
                - Công trình không bị phạt chậm tiến độ do lỗi chủ quan của bộ phận quản lý.
              </p>
              <p>
                - Tỷ lệ công nợ tồn đọng cuối năm phải nằm trong định mức an toàn cho phép của Ban Giám Đốc.
              </p>
              <p>
                - Có chữ ký phê duyệt và đóng dấu điện tử của <strong>Giám Đốc Nguyễn Viết Nghĩa</strong>.
              </p>
            </div>
          </div>
        </div>
      `;
    }
  };

  // --- PUBLIC API EXPORTS ---
  return {
    version: '1.0.0',
    MANAGERS_CONFIG: MANAGERS_CONFIG,
    DEFAULT_CCSC_MONTHS: DEFAULT_CCSC_MONTHS,
    ATTENDANCE_SAMPLE: ATTENDANCE_SAMPLE,
    BONUS_SALES_THRESHOLD: BONUS_SALES_THRESHOLD,

    // Core Calculation Functions
    formatMoney: formatMoney,
    formatShortMoney: formatShortMoney,
    calculateMonth: calculateMonth,
    calculateFullYear: calculateFullYear,

    // UI Renderer & State
    init: function (containerId, liveState) {
      UI.init(containerId, liveState);
    },
    render: function () {
      UI.render();
    },
    setTab: function (tab) {
      UI.setTab(tab);
    },
    setBonusMode: function (mode) {
      UI.setBonusMode(mode);
    },
    setMonth: function (m) {
      UI.setMonth(m);
    },

    // Export Data Helper
    exportSummary: function (liveState = null, mode = 'SURPLUS_ONLY') {
      const ccsc = (liveState && liveState.ccscMonths) ? liveState.ccscMonths : DEFAULT_CCSC_MONTHS;
      return calculateFullYear(ccsc, mode);
    }
  };
}));
