/**
 * ==============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI BỘ PG HOME LUXURY - PHÚ GIA
 * MODULE W04: TÍNH TOÁN & KHÓA QUỸ THƯỞNG VƯỢT DOANH SỐ > 500 TRIỆU/THÁNG
 * ------------------------------------------------------------------------------
 * Quy chế Ban Giám Đốc (Mục 6 - GEMINI.md & Sổ tay Luật Sắt 01):
 * - Điều kiện kích hoạt: Doanh số tháng > 500,000,000 VNĐ.
 * - Tỷ lệ trích thưởng nhân sự nòng cốt:
 *   + Nguyễn Văn Thái (Quản lý xưởng - QLX): 0.5%
 *   + Hoàng Công Vũ (Kỹ thuật / Vật tư / CNC): 0.3%
 *   + Tống Trần Hiệp (Văn phòng & Sale Admin): 0.5%
 *   + Tổng tỷ lệ trích: 1.3%
 * - KỶ LUẬT THÉP BẢO VỆ DÒNG TIỀN KÉT SẮT:
 *   + CẤM TẠM ỨNG HÀNG THÁNG.
 *   + TRẠNG THÁI BẮT BUỘC: "TREO ĐẾN TẤT NIÊN CUỐI NĂM ĐỐI SOÁT" (Locked 100%).
 *   + Chỉ được mở khóa thanh toán tại tiệc tất niên cuối năm sau khi Giám Đốc
 *     đối soát xong công nợ khách hàng và vật tư nhà cung cấp.
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W04 = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // Cấu hình quy chuẩn Ban Giám Đốc Phú Gia
  const CONFIG = {
    MODULE_ID: 'W04',
    MODULE_NAME: 'SalesBonus500MLock',
    THRESHOLD: 500000000, // 500 Triệu VNĐ
    STATUS_LOCKED: 'TREO ĐẾN TẤT NIÊN CUỐI NĂM ĐỐI SOÁT',
    BENEFICIARIES: [
      {
        id: 'thai',
        name: 'Nguyễn Văn Thái',
        username: 'thaixuong',
        role: 'Quản lý xưởng (QLX)',
        rate: 0.005, // 0.5%
        ratePercent: '0.5%'
      },
      {
        id: 'vu',
        name: 'Hoàng Công Vũ',
        username: 'vuvattu',
        role: 'Kỹ thuật / Vật tư / CNC',
        rate: 0.003, // 0.3%
        ratePercent: '0.3%'
      },
      {
        id: 'hiep',
        name: 'Tống Trần Hiệp',
        username: 'hiepsale',
        role: 'Văn phòng & Sale Admin',
        rate: 0.005, // 0.5%
        ratePercent: '0.5%'
      }
    ],
    TOTAL_RATE: 0.013, // 1.3%
    LEGAL_INFO: {
      entity: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
      mst: '042203002931',
      address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
      hotline: '0986.722.324'
    }
  };

  /**
   * Định dạng tiền tệ VNĐ (vd: 580.000.000 đ)
   */
  function formatMoney(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '0 đ';
    return Math.round(amount).toLocaleString('vi-VN') + ' đ';
  }

  /**
   * Lấy chế độ tính thưởng toàn cục hiện hành
   * @returns {string} 'EXCESS' | 'TOTAL'
   */
  function getBonusMode() {
    if (typeof window !== 'undefined' && window.PG_BONUS_500M_MODE) {
      return String(window.PG_BONUS_500M_MODE).toUpperCase() === 'TOTAL' ? 'TOTAL' : 'EXCESS';
    }
    if (typeof globalThis !== 'undefined' && globalThis.PG_BONUS_500M_MODE) {
      return String(globalThis.PG_BONUS_500M_MODE).toUpperCase() === 'TOTAL' ? 'TOTAL' : 'EXCESS';
    }
    return 'EXCESS';
  }

  /**
   * Đặt chế độ tính thưởng toàn cục
   * @param {string} mode - 'EXCESS' | 'TOTAL'
   * @returns {string}
   */
  function setBonusMode(mode) {
    const m = String(mode).toUpperCase() === 'TOTAL' ? 'TOTAL' : 'EXCESS';
    if (typeof window !== 'undefined') window.PG_BONUS_500M_MODE = m;
    if (typeof globalThis !== 'undefined') globalThis.PG_BONUS_500M_MODE = m;
    return m;
  }

  /**
   * Tính thưởng doanh số vượt 500 Triệu (Giữ đến tất niên)
   * Đồng nhất 100% với Module W02 (w02_ccsc_12months_engine.js) & chuẩn build_ccsc_2026.py
   * Hỗ trợ cấu hình window.PG_BONUS_500M_MODE: 'EXCESS' (mặc định) hoặc 'TOTAL'
   * 
   * @param {number} totalSales - Tổng doanh số trong tháng
   * @param {string|null} customMode - 'EXCESS' | 'TOTAL' (nếu muốn ép chế độ)
   * @returns {Object}
   */
  function calculateOver500MBonus(totalSales = 0, customMode = null) {
    const sales = Number(totalSales || 0);
    const threshold = CONFIG.THRESHOLD;
    const isOver = sales > threshold;
    const excess = isOver ? (sales - threshold) : 0;

    // Chế độ tính thưởng: EXCESS (mặc định) hoặc TOTAL (theo chuẩn phom A trong build_ccsc_2026.py)
    let activeMode = 'EXCESS';
    if (customMode && typeof customMode === 'string') {
      activeMode = customMode.toUpperCase() === 'TOTAL' ? 'TOTAL' : 'EXCESS';
    } else {
      activeMode = getBonusMode();
    }

    const rateThai = 0.005;
    const rateVu = 0.003;
    const rateHiep = 0.005;

    // 1. Phương án A: Tính trên TỔNG doanh số tháng khi > 500M (Chuẩn build_standard_phom_ccsc_2026.py)
    const bonusThaiOnTotal = isOver ? Math.round(sales * rateThai) : 0;
    const bonusVuOnTotal = isOver ? Math.round(sales * rateVu) : 0;
    const bonusHiepOnTotal = isOver ? Math.round(sales * rateHiep) : 0;
    const totalBonusOnTotal = bonusThaiOnTotal + bonusVuOnTotal + bonusHiepOnTotal;

    // 2. Phương án B: Tính trên PHẦN VƯỢT ngưỡng 500M (Chuẩn EXCESS)
    const bonusThaiOnExcess = isOver ? Math.round(excess * rateThai) : 0;
    const bonusVuOnExcess = isOver ? Math.round(excess * rateVu) : 0;
    const bonusHiepOnExcess = isOver ? Math.round(excess * rateHiep) : 0;
    const totalBonusOnExcess = bonusThaiOnExcess + bonusVuOnExcess + bonusHiepOnExcess;

    // 3. Số tiền áp dụng chính thức theo activeMode hiện hành
    const bonusThai = activeMode === 'TOTAL' ? bonusThaiOnTotal : bonusThaiOnExcess;
    const bonusVu = activeMode === 'TOTAL' ? bonusVuOnTotal : bonusVuOnExcess;
    const bonusHiep = activeMode === 'TOTAL' ? bonusHiepOnTotal : bonusHiepOnExcess;
    const totalBonus = bonusThai + bonusVu + bonusHiep;

    const note = isOver
      ? (activeMode === 'TOTAL'
          ? `Vượt ngưỡng 500M [Chế độ TOTAL - Tính trên tổng DS ${formatMoney(sales)}]: Thái ${formatMoney(bonusThai)}, Vũ ${formatMoney(bonusVu)}, Hiệp ${formatMoney(bonusHiep)}. Tổng ${formatMoney(totalBonus)} (Chi tiết phần vượt: ${formatMoney(totalBonusOnExcess)}). Khóa treo tất niên đối soát.`
          : `Vượt ngưỡng 500M [Chế độ EXCESS - Tính trên phần vượt ${formatMoney(excess)}]: Thái ${formatMoney(bonusThai)}, Vũ ${formatMoney(bonusVu)}, Hiệp ${formatMoney(bonusHiep)}. Tổng ${formatMoney(totalBonus)} (Chi tiết tổng DS: ${formatMoney(totalBonusOnTotal)}). Khóa treo tất niên đối soát.`)
      : `Không vượt ngưỡng 500M (Doanh số: ${formatMoney(sales)} <= ${formatMoney(threshold)}).`;

    return {
      isOver,
      isQualified: isOver,
      mode: activeMode,
      threshold,
      sales,
      excess,
      // Giá trị áp dụng chính thức theo mode
      bonusThai,
      bonusVu,
      bonusHiep,
      totalBonus,
      // Giá trị chi tiết theo cả 2 phương án đối chiếu minh bạch
      bonusThaiOnTotal,
      bonusVuOnTotal,
      bonusHiepOnTotal,
      totalBonusOnTotal,
      bonusThaiOnExcess,
      bonusVuOnExcess,
      bonusHiepOnExcess,
      totalBonusOnExcess,
      // Định dạng tiền tệ
      totalBonusFormatted: formatMoney(totalBonus),
      totalBonusOnTotalFormatted: formatMoney(totalBonusOnTotal),
      totalBonusOnExcessFormatted: formatMoney(totalBonusOnExcess),
      note
    };
  }

  /**
   * Kiểm tra và tính thưởng vượt doanh số cho một tháng cụ thể
   * @param {Object} monthData - Dữ liệu của 1 tháng ({ m: 11, name: "Tháng 11", sales: 580000000, ... })
   * @param {string|null} customMode - Chế độ 'EXCESS' hoặc 'TOTAL' (tùy chọn)
   * @returns {Object} Chi tiết tính thưởng và trạng thái khóa
   */
  function evaluateMonth(monthData, customMode = null) {
    if (!monthData) {
      return {
        month: 0,
        monthName: 'N/A',
        sales: 0,
        salesFormatted: '0 đ',
        threshold: CONFIG.THRESHOLD,
        thresholdFormatted: formatMoney(CONFIG.THRESHOLD),
        excessSales: 0,
        excessSalesFormatted: '0 đ',
        isQualified: false,
        status: 'KHÔNG CÓ DỮ LIỆU',
        isLocked: true,
        lockSchedule: 'N/A',
        mode: getBonusMode(),
        bonuses: [],
        totalBonus: 0,
        totalBonusFormatted: '0 đ',
        totalBonusOnTotal: 0,
        totalBonusOnTotalFormatted: '0 đ',
        totalBonusOnExcess: 0,
        totalBonusOnExcessFormatted: '0 đ',
        note: 'Không có dữ liệu tháng.'
      };
    }

    const monthNum = monthData.m || 0;
    const monthName = monthData.name || `Tháng ${monthNum}`;
    const sales = Number(monthData.sales) || 0;

    // Sử dụng chung lõi tính toán calculateOver500MBonus
    const bonusCalc = calculateOver500MBonus(sales, customMode);

    const bonuses = CONFIG.BENEFICIARIES.map(beneficiary => {
      let bAmount = 0;
      let bOnTotal = 0;
      let bOnExcess = 0;

      if (beneficiary.id === 'thai') {
        bAmount = bonusCalc.bonusThai;
        bOnTotal = bonusCalc.bonusThaiOnTotal;
        bOnExcess = bonusCalc.bonusThaiOnExcess;
      } else if (beneficiary.id === 'vu') {
        bAmount = bonusCalc.bonusVu;
        bOnTotal = bonusCalc.bonusVuOnTotal;
        bOnExcess = bonusCalc.bonusVuOnExcess;
      } else if (beneficiary.id === 'hiep') {
        bAmount = bonusCalc.bonusHiep;
        bOnTotal = bonusCalc.bonusHiepOnTotal;
        bOnExcess = bonusCalc.bonusHiepOnExcess;
      } else {
        bOnTotal = bonusCalc.isQualified ? Math.round(sales * beneficiary.rate) : 0;
        bOnExcess = bonusCalc.isQualified ? Math.round(bonusCalc.excess * beneficiary.rate) : 0;
        bAmount = bonusCalc.mode === 'TOTAL' ? bOnTotal : bOnExcess;
      }

      return {
        beneficiaryId: beneficiary.id,
        name: beneficiary.name,
        role: beneficiary.role,
        rate: beneficiary.rate,
        ratePercent: beneficiary.ratePercent,
        bonusAmount: bAmount,
        bonusAmountFormatted: formatMoney(bAmount),
        bonusOnTotal: bOnTotal,
        bonusOnTotalFormatted: formatMoney(bOnTotal),
        bonusOnExcess: bOnExcess,
        bonusOnExcessFormatted: formatMoney(bOnExcess)
      };
    });

    return {
      month: monthNum,
      monthName: monthName,
      sales: sales,
      salesFormatted: formatMoney(sales),
      threshold: CONFIG.THRESHOLD,
      thresholdFormatted: formatMoney(CONFIG.THRESHOLD),
      excessSales: bonusCalc.excess,
      excessSalesFormatted: formatMoney(bonusCalc.excess),
      isQualified: bonusCalc.isQualified,
      status: bonusCalc.isQualified ? CONFIG.STATUS_LOCKED : 'CHƯA ĐẠT NGƯỠNG (> 500M)',
      isLocked: bonusCalc.isQualified, // Đạt thưởng là bị khóa 100% đến tất niên
      lockSchedule: bonusCalc.isQualified ? 'Tất niên cuối năm sau đối soát NCC & công nợ' : 'N/A',
      mode: bonusCalc.mode,
      bonuses: bonuses,
      totalBonus: bonusCalc.totalBonus,
      totalBonusFormatted: formatMoney(bonusCalc.totalBonus),
      totalBonusOnTotal: bonusCalc.totalBonusOnTotal,
      totalBonusOnTotalFormatted: formatMoney(bonusCalc.totalBonusOnTotal),
      totalBonusOnExcess: bonusCalc.totalBonusOnExcess,
      totalBonusOnExcessFormatted: formatMoney(bonusCalc.totalBonusOnExcess),
      note: bonusCalc.note
    };
  }

  /**
   * Tính toán toàn bộ 12 tháng từ Live State hoặc danh sách mảng
   * @param {Object|Array} liveStateOrMonths - Đối tượng live state (chứa ccscMonths) hoặc mảng 12 tháng
   * @param {string|null} customMode - Chế độ 'EXCESS' hoặc 'TOTAL' (tùy chọn)
   * @returns {Object} Kết quả kiểm toán đầy đủ 12 tháng
   */
  function calculateAllMonths(liveStateOrMonths, customMode = null) {
    let months = [];
    if (Array.isArray(liveStateOrMonths)) {
      months = liveStateOrMonths;
    } else if (liveStateOrMonths && Array.isArray(liveStateOrMonths.ccscMonths)) {
      months = liveStateOrMonths.ccscMonths;
    }

    const activeMode = customMode ? (String(customMode).toUpperCase() === 'TOTAL' ? 'TOTAL' : 'EXCESS') : getBonusMode();
    const evaluatedMonths = months.map(m => evaluateMonth(m, activeMode));
    const qualifiedMonths = evaluatedMonths.filter(m => m.isQualified);

    // Tính tổng lũy kế cả năm
    let totalQualifiedSales = 0;
    let totalLockedBonus = 0;
    let totalLockedBonusOnTotal = 0;
    let totalLockedBonusOnExcess = 0;

    const summaryByBeneficiary = {};
    CONFIG.BENEFICIARIES.forEach(b => {
      summaryByBeneficiary[b.id] = {
        name: b.name,
        role: b.role,
        ratePercent: b.ratePercent,
        totalLockedAmount: 0,
        totalLockedAmountFormatted: '0 đ',
        totalLockedAmountOnTotal: 0,
        totalLockedAmountOnTotalFormatted: '0 đ',
        totalLockedExcessAmount: 0,
        totalLockedExcessAmountFormatted: '0 đ'
      };
    });

    qualifiedMonths.forEach(m => {
      totalQualifiedSales += m.sales;
      totalLockedBonus += m.totalBonus;
      totalLockedBonusOnTotal += m.totalBonusOnTotal;
      totalLockedBonusOnExcess += m.totalBonusOnExcess;

      m.bonuses.forEach(b => {
        if (summaryByBeneficiary[b.beneficiaryId]) {
          summaryByBeneficiary[b.beneficiaryId].totalLockedAmount += b.bonusAmount;
          summaryByBeneficiary[b.beneficiaryId].totalLockedAmountOnTotal += b.bonusOnTotal;
          summaryByBeneficiary[b.beneficiaryId].totalLockedExcessAmount += b.bonusOnExcess;
        }
      });
    });

    // Format tiền tổng
    Object.keys(summaryByBeneficiary).forEach(id => {
      const bObj = summaryByBeneficiary[id];
      bObj.totalLockedAmountFormatted = formatMoney(bObj.totalLockedAmount);
      bObj.totalLockedAmountOnTotalFormatted = formatMoney(bObj.totalLockedAmountOnTotal);
      bObj.totalLockedExcessAmountFormatted = formatMoney(bObj.totalLockedExcessAmount);
    });

    return {
      module: CONFIG.MODULE_NAME,
      timestamp: new Date().toISOString(),
      mode: activeMode,
      ruleStandard: activeMode === 'TOTAL'
        ? 'Doanh số tháng > 500M [Chế độ TOTAL]: Thái 0.5%, Vũ 0.3%, Hiệp 0.5% tính trên TỔNG doanh số (Khóa treo tất niên)'
        : 'Doanh số tháng > 500M [Chế độ EXCESS]: Thái 0.5%, Vũ 0.3%, Hiệp 0.5% tính trên PHẦN VƯỢT (Khóa treo tất niên)',
      statusGlobal: CONFIG.STATUS_LOCKED,
      totalMonthsCount: evaluatedMonths.length,
      qualifiedMonthsCount: qualifiedMonths.length,
      qualifiedMonthsList: qualifiedMonths.map(m => m.monthName),
      totalQualifiedSales: totalQualifiedSales,
      totalQualifiedSalesFormatted: formatMoney(totalQualifiedSales),
      totalLockedBonus: totalLockedBonus,
      totalLockedBonusFormatted: formatMoney(totalLockedBonus),
      totalLockedBonusOnTotal: totalLockedBonusOnTotal,
      totalLockedBonusOnTotalFormatted: formatMoney(totalLockedBonusOnTotal),
      totalLockedExcessBonus: totalLockedBonusOnExcess,
      totalLockedExcessBonusFormatted: formatMoney(totalLockedBonusOnExcess),
      summaryByBeneficiary: summaryByBeneficiary,
      months: evaluatedMonths
    };
  }

  /**
   * Tạo giao diện HTML chuyên nghiệp, hiển thị trực quan Quỹ Thưởng Vượt Doanh Số
   * @param {string} containerId - ID của DOM element để render (nếu có)
   * @param {Object|Array} liveStateOrMonths - Dữ liệu live state
   * @returns {string} Chuỗi HTML đã tạo
   */
  function renderUI(containerId, liveStateOrMonths) {
    const summary = calculateAllMonths(liveStateOrMonths);

    const html = `
      <div class="pg-w04-card" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); margin: 16px 0;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #e11d48; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Kỷ Luật Thép BGĐ</span>
              <span style="background: #1e293b; color: #94a3b8; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px;">MODULE W04</span>
              <span style="background: #0284c7; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">CHẾ ĐỘ: ${summary.mode === 'TOTAL' ? 'TOTAL (Tổng doanh số)' : 'EXCESS (Phần vượt >500M)'}</span>
            </div>
            <h2 style="margin: 8px 0 4px 0; font-size: 20px; font-weight: 800; color: #f1f5f9;">QUỸ THƯỞNG VƯỢT DOANH SỐ > 500 TRIỆU/THÁNG</h2>
            <div style="font-size: 13px; color: #94a3b8;">
              Đơn vị: <strong style="color: #cbd5e1;">${CONFIG.LEGAL_INFO.entity}</strong> • MST: <strong style="color: #cbd5e1;">${CONFIG.LEGAL_INFO.mst}</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="display: inline-block; background: rgba(225, 29, 72, 0.15); border: 1px solid #e11d48; color: #fb7185; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">
              🔒 ${CONFIG.STATUS_LOCKED}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Tuyệt đối không tạm ứng hàng tháng</div>
          </div>
        </div>

        <!-- Summary KPI Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="background: #1e293b; border-radius: 8px; padding: 14px; border: 1px solid #334155;">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Tháng Vượt Ngưỡng (>500M)</div>
            <div style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 4px;">
              ${summary.qualifiedMonthsCount} / ${summary.totalMonthsCount} tháng
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              ${summary.qualifiedMonthsList.length > 0 ? summary.qualifiedMonthsList.join(', ') : 'Chưa có tháng đạt'}
            </div>
          </div>

          <div style="background: #1e293b; border-radius: 8px; padding: 14px; border: 1px solid #334155;">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Doanh Số Đạt Tiêu Chuẩn</div>
            <div style="font-size: 24px; font-weight: 800; color: #facc15; margin-top: 4px;">
              ${summary.totalQualifiedSalesFormatted}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Cơ sở trích quỹ thưởng 1.3%</div>
          </div>

          <div style="background: #1e293b; border-radius: 8px; padding: 14px; border: 1px solid #e11d48;">
            <div style="font-size: 12px; color: #fb7185; text-transform: uppercase; font-weight: 600;">Tổng Quỹ Thưởng Khóa Treo</div>
            <div style="font-size: 24px; font-weight: 800; color: #f43f5e; margin-top: 4px;">
              ${summary.totalLockedBonusFormatted}
            </div>
            <div style="font-size: 11px; color: #fda4af; margin-top: 2px;">
              (Phần vượt: ${summary.totalLockedExcessBonusFormatted} | Tổng DS: ${summary.totalLockedBonusOnTotalFormatted})
            </div>
          </div>
        </div>

        <!-- Beneficiary Breakdown Cards -->
        <h3 style="font-size: 14px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          Bảng Phân Bổ Quỹ Thưởng Nhân Sự Nòng Cốt (Khóa Cứng)
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 24px;">
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 15px; color: #f8fafc;">Nguyễn Văn Thái</span>
              <span style="background: #0284c7; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">0.5%</span>
            </div>
            <div style="font-size: 12px; color: #94a3b8; margin: 4px 0 12px 0;">Quản lý xưởng (QLX)</div>
            <div style="font-size: 20px; font-weight: 800; color: #38bdf8;">
              ${summary.summaryByBeneficiary.thai.totalLockedAmountFormatted}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">(Vượt: ${summary.summaryByBeneficiary.thai.totalLockedExcessAmountFormatted} | Tổng: ${summary.summaryByBeneficiary.thai.totalLockedAmountOnTotalFormatted})</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Trạng thái: 🔒 Treo tất niên</div>
          </div>

          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 15px; color: #f8fafc;">Hoàng Công Vũ</span>
              <span style="background: #0d9488; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">0.3%</span>
            </div>
            <div style="font-size: 12px; color: #94a3b8; margin: 4px 0 12px 0;">Kỹ thuật / Vật tư / CNC</div>
            <div style="font-size: 20px; font-weight: 800; color: #2dd4bf;">
              ${summary.summaryByBeneficiary.vu.totalLockedAmountFormatted}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">(Vượt: ${summary.summaryByBeneficiary.vu.totalLockedExcessAmountFormatted} | Tổng: ${summary.summaryByBeneficiary.vu.totalLockedAmountOnTotalFormatted})</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Trạng thái: 🔒 Treo tất niên</div>
          </div>

          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 15px; color: #f8fafc;">Tống Trần Hiệp</span>
              <span style="background: #7c3aed; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">0.5%</span>
            </div>
            <div style="font-size: 12px; color: #94a3b8; margin: 4px 0 12px 0;">Văn phòng & Sale Admin</div>
            <div style="font-size: 20px; font-weight: 800; color: #a78bfa;">
              ${summary.summaryByBeneficiary.hiep.totalLockedAmountFormatted}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">(Vượt: ${summary.summaryByBeneficiary.hiep.totalLockedExcessAmountFormatted} | Tổng: ${summary.summaryByBeneficiary.hiep.totalLockedAmountOnTotalFormatted})</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Trạng thái: 🔒 Treo tất niên</div>
          </div>
        </div>

        <!-- 12 Months Detailed Table -->
        <h3 style="font-size: 14px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          Bảng Theo Dõi Chi Tiết 12 Tháng
        </h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
            <thead>
              <tr style="background: #1e293b; color: #94a3b8; border-bottom: 2px solid #334155;">
                <th style="padding: 10px 12px;">Tháng</th>
                <th style="padding: 10px 12px; text-align: right;">Doanh Số</th>
                <th style="padding: 10px 12px; text-align: center;">Ngưỡng 500M</th>
                <th style="padding: 10px 12px; text-align: right;">Thái (0.5%)</th>
                <th style="padding: 10px 12px; text-align: right;">Vũ (0.3%)</th>
                <th style="padding: 10px 12px; text-align: right;">Hiệp (0.5%)</th>
                <th style="padding: 10px 12px; text-align: right;">Tổng Quỹ (1.3%)</th>
                <th style="padding: 10px 12px; text-align: center;">Trạng Thái Chi Trả</th>
              </tr>
            </thead>
            <tbody>
              ${summary.months.map(m => `
                <tr style="border-bottom: 1px solid #1e293b; ${m.isQualified ? 'background: rgba(225, 29, 72, 0.08);' : ''}">
                  <td style="padding: 10px 12px; font-weight: 600; color: ${m.isQualified ? '#f43f5e' : '#cbd5e1'};">
                    ${m.monthName}
                  </td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: ${m.isQualified ? '#facc15' : '#94a3b8'};">
                    ${m.salesFormatted}
                  </td>
                  <td style="padding: 10px 12px; text-align: center;">
                    ${m.isQualified 
                      ? '<span style="background: #059669; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">ĐẠT NGƯỠNG</span>' 
                      : '<span style="color: #64748b; font-size: 11px;">Chưa đạt</span>'}
                  </td>
                  <td style="padding: 10px 12px; text-align: right; color: ${m.isQualified ? '#38bdf8' : '#64748b'};">
                    ${m.isQualified ? m.bonuses[0].bonusAmountFormatted : '-'}
                  </td>
                  <td style="padding: 10px 12px; text-align: right; color: ${m.isQualified ? '#2dd4bf' : '#64748b'};">
                    ${m.isQualified ? m.bonuses[1].bonusAmountFormatted : '-'}
                  </td>
                  <td style="padding: 10px 12px; text-align: right; color: ${m.isQualified ? '#a78bfa' : '#64748b'};">
                    ${m.isQualified ? m.bonuses[2].bonusAmountFormatted : '-'}
                  </td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: ${m.isQualified ? '#f43f5e' : '#64748b'};">
                    ${m.isQualified ? m.totalBonusFormatted : '-'}
                  </td>
                  <td style="padding: 10px 12px; text-align: center;">
                    ${m.isQualified 
                      ? '<span style="background: rgba(225, 29, 72, 0.2); border: 1px solid #e11d48; color: #fb7185; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">🔒 TREO TẤT NIÊN</span>' 
                      : '<span style="color: #64748b; font-size: 11px;">-</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background: #1e293b; border-top: 2px solid #334155; font-weight: 800;">
                <td style="padding: 12px; color: #f8fafc;">TỔNG CỘNG LŨY KẾ</td>
                <td style="padding: 12px; text-align: right; color: #facc15;">${summary.totalQualifiedSalesFormatted}</td>
                <td style="padding: 12px; text-align: center; color: #38bdf8;">${summary.qualifiedMonthsCount} tháng</td>
                <td style="padding: 12px; text-align: right; color: #38bdf8;">${summary.summaryByBeneficiary.thai.totalLockedAmountFormatted}</td>
                <td style="padding: 12px; text-align: right; color: #2dd4bf;">${summary.summaryByBeneficiary.vu.totalLockedAmountFormatted}</td>
                <td style="padding: 12px; text-align: right; color: #a78bfa;">${summary.summaryByBeneficiary.hiep.totalLockedAmountFormatted}</td>
                <td style="padding: 12px; text-align: right; color: #f43f5e; font-size: 14px;">${summary.totalLockedBonusFormatted}</td>
                <td style="padding: 12px; text-align: center; color: #fb7185;">🔒 KHÓA 100% KÉT SẮT</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Footer Rule Note -->
        <div style="margin-top: 20px; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border-left: 4px solid #e11d48; border-radius: 4px; font-size: 12px; color: #94a3b8; line-height: 1.5;">
          <strong style="color: #f8fafc;">Quy chế Quản trị Dòng tiền (Giám Đốc Nguyễn Viết Nghĩa):</strong> Toàn bộ tiền thưởng vượt doanh số của Thái, Vũ và Hiệp được tính toán minh bạch hàng tháng nhưng bắt buộc giữ lại đến tiệc tất niên cuối năm. Chỉ thực hiện chi trả khi Ban Giám Đốc đã hoàn tất đối soát dòng tiền 3 lớp (hóa đơn thật + xác nhận nhóm NCC + ủy nhiệm chi ngân hàng) và thu đủ công nợ khách hàng.
        </div>
      </div>
    `;

    if (containerId && typeof document !== 'undefined') {
      const el = document.getElementById(containerId);
      if (el) {
        el.innerHTML = html;
      }
    }

    return html;
  }

  // Khởi tạo đối tượng public API của module W04
  const PG_Modules_W04 = {
    CONFIG: CONFIG,
    formatMoney: formatMoney,
    evaluateMonth: evaluateMonth,
    calculateAllMonths: calculateAllMonths,
    calculateOver500MBonus: calculateOver500MBonus,
    getBonusMode: getBonusMode,
    setBonusMode: setBonusMode,
    renderUI: renderUI,
    version: '1.1.0'
  };

  return PG_Modules_W04;
});
