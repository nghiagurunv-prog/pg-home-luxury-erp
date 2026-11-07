/**
 * =========================================================================================
 * HỆ THỐNG QUẢN TRỊ & CCSC NỘI THẤT PG HOME LUXURY - PHÚ GIA HÀ TĨNH
 * Module: W02 - CCSC 12 MONTHS ENGINE (BỘ MÁY TÍNH TOÁN CCSC & LỢI NHUẬN XƯỞNG 12 THÁNG)
 * Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST/ĐKKD: 042203002931)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0973.562.789
 * =========================================================================================
 * 
 * NGUYÊN TẮC CỐT TỬ CỦA BAN GIÁM ĐỐC (GIÁM ĐỐC NGUYỄN VIẾT NGHĨA):
 * 1. BÓC TÁCH DOANH SỐ GỖ CÔNG NGHIỆP XƯỞNG:
 *    woodVal = totalVal - solidWood - accVal
 *    (TUYỆT ĐỐI CẤM gom gỗ thịt tự nhiên & phụ kiện thương mại bán kèm vào để thổi phồng doanh số xưởng).
 * 2. ĐỊNH MỨC VẬT TƯ XƯỞNG CHUẨN 40%:
 *    vatTu40 = actualXuong * 0.40
 * 3. ĐỊNH MỨC QUỸ KHOÁN CÔNG THỢ XƯỞNG CHUẨN 15%:
 *    quyKhoanTho15 = actualXuong * 0.15
 * 4. KHÓA CỨNG COL BG = 0 ĐỒNG KHI ÂM QUỸ KHOÁN XƯỞNG:
 *    Lợi nhuận xưởng (Col BG) là tiền do chính thợ và máy xưởng làm ra.
 *    CẤM TUYỆT ĐỐI lấy tiền mảng thương mại, đá, kính bù vào xưởng.
 *    Nếu chi phí lương thợ thực tế > 15% quỹ khoán (âm quỹ) ==> KHÓA CỨNG Col BG = 0 đ!
 * 5. QUỸ THỢ NÒNG CỐT (HÀ VIẾT HÒA & LƯƠNG THỂ HÀO):
 *    Trích 20.000 đ/công giữ đến cuối năm tất niên mới chi trả gắn kết trách nhiệm.
 *    Hàng tháng chỉ tạm ứng lương thực tế (Hòa 530k/công, Hào 450k/công, phụ cấp tháng = 0 đ).
 * 6. THƯỞNG DOANH SỐ VƯỢT > 500 TRIỆU:
 *    Giữ lại đến tất niên cuối năm đối soát xong mới chi (Thái 0.5%, Vũ 0.3%, Hiệp 0.5%).
 * =========================================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W02 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Hằng số định mức chuẩn PG Home
  const CONSTANTS = {
    VAT_TU_RATE: 0.40,               // 40% doanh số xưởng gỗ
    QUY_KHOAN_THO_RATE: 0.15,        // 15% doanh số xưởng gỗ
    PHU_KIEN_PROFIT_RATE: 0.30,      // 30% lãi gộp đồ phụ kiện thương mại
    QUY_THO_NONG_COT_PER_DAY: 20000, // 20.000 đ/công giữ cuối năm cho Hòa & Hào
    THRESHOLD_OVER_500M: 500000000,  // Ngưỡng thưởng doanh số > 500M
    RATE_THUONG_THAI: 0.005,         // Thái 0.5%
    RATE_THUONG_VU: 0.003,           // Vũ 0.3%
    RATE_THUONG_HIEP: 0.005,         // Hiệp 0.5%
    LUONG_BLD_STANDARD: 12000000,    // Lương ban lãnh đạo 12M
    LUONG_CB_HIEP: 6500000,          // Lương cơ bản Hiệp 6.5M
    THUE_STANDARD: 13000000,         // Chi phí thuế chuẩn 13M
    BHXH_STANDARD: 6600000,          // Bảo hiểm xã hội chuẩn 6.6M
    HOA_DAILY_WAGE: 530000,          // Ngày công chuẩn thợ cả Hòa
    HAO_DAILY_WAGE: 450000           // Ngày công chuẩn thợ chính Hào
  };

  /**
   * Định dạng số tiền sang định dạng VNĐ chuẩn
   * @param {number} amount
   * @param {boolean} showUnit
   * @returns {string}
   */
  function formatVND(amount, showUnit = true) {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
    const rounded = Math.round(amount);
    const formatted = rounded.toLocaleString('vi-VN');
    return showUnit ? `${formatted} đ` : formatted;
  }

  /**
   * Bóc tách doanh số gỗ công nghiệp xưởng từ 1 hợp đồng / công trình
   * CÔNG THỨC: woodVal = totalVal - solidWood - accVal
   * actualXuong = woodVal * pct
   * 
   * @param {Object} contract - Hợp đồng hoặc dòng nghiệm thu
   * @returns {Object} Chi tiết bóc tách
   */
  function calculateContractWoodVal(contract) {
    if (!contract || typeof contract !== 'object') {
      return {
        contractVal: 0,
        solidVal: 0,
        pkVal: 0,
        woodVal: 0,
        pct: 1,
        actualXuong: 0,
        note: 'Dữ liệu không hợp lệ'
      };
    }

    const contractVal = Number(contract.contractVal || contract.totalVal || contract.sales || 0);
    const solidVal = Number(contract.solidVal || contract.solidWood || 0);
    const pkVal = Number(contract.pkVal || contract.accVal || contract.accessoriesVal || 0);

    // Bóc tách gỗ công nghiệp xưởng: Trừ gỗ thịt và phụ kiện thương mại
    const woodValRaw = contractVal - solidVal - pkVal;
    const woodVal = Math.max(0, woodValRaw);

    const pct = contract.pct !== undefined && contract.pct !== null ? Number(contract.pct) : 1;
    const actualXuong = Math.round(woodVal * pct * 100) / 100;

    return {
      id: contract.id,
      client: contract.client || contract.name || 'Khách hàng',
      address: contract.address || '',
      month: contract.month || contract.m || 0,
      contractVal,
      solidVal,
      pkVal,
      woodVal,
      pct,
      actualXuong,
      debt: Number(contract.debt || 0),
      note: contract.note || ''
    };
  }

  /**
   * Tính toán các chỉ tiêu định mức chuẩn xưởng PG Home từ doanh số xưởng gỗ
   * @param {number} actualXuong - Doanh số gỗ công nghiệp xưởng thực tế sau tiến độ
   * @returns {Object} Định mức vật tư 40%, quỹ khoán thợ 15%, biên dư định mức
   */
  function calculateWorkshopQuota(actualXuong) {
    const validXuong = Math.max(0, Number(actualXuong || 0));
    const vatTu40 = Math.round(validXuong * CONSTANTS.VAT_TU_RATE);
    const quyKhoanTho15 = Math.round(validXuong * CONSTANTS.QUY_KHOAN_THO_RATE);
    const workshopGrossBudget = Math.round(validXuong * (1 - CONSTANTS.VAT_TU_RATE)); // 60% còn lại sau vật tư

    return {
      actualXuong: validXuong,
      vatTu40,
      quyKhoanTho15,
      workshopGrossBudget
    };
  }

  /**
   * Tính lợi nhuận xưởng (Col BG) theo Kỷ Luật Thép PG Home
   * KHÓA CỨNG Col BG = 0 NẾU ÂM QUỸ KHOÁN THỢ!
   * 
   * @param {number} quyKhoanTho15 - Quỹ khoán thợ 15% của xưởng
   * @param {number} actualLaborCost - Tổng chi phí lương thợ thực tế
   * @param {number} rawWorkshopProfit - Lợi nhuận xưởng dự kiến (trước kiểm toán âm)
   * @param {Object} options - Tùy chọn mở rộng
   * @returns {Object}
   */
  function calculateColBG(quyKhoanTho15, actualLaborCost, rawWorkshopProfit = 0, options = {}) {
    const quota = Math.max(0, Number(quyKhoanTho15 || 0));
    const actualLabor = Math.max(0, Number(actualLaborCost || 0));
    const rawProfit = Number(rawWorkshopProfit || 0);

    // Chênh lệch quỹ khoán thợ = Quỹ khoán 15% - Lương thợ chi thực tế
    const laborSurplus = quota - actualLabor;
    const isDeficit = laborSurplus < 0;
    const deficitAmount = isDeficit ? Math.abs(laborSurplus) : 0;

    let colBG = 0;
    let auditReason = '';

    if (isDeficit) {
      // KHÓA CỨNG COL BG = 0 NẾU ÂM QUỸ KHOÁN XƯỞNG!
      colBG = 0;
      auditReason = `ÂM QUỸ KHOÁN THỢ ${formatVND(deficitAmount)} (Lương thợ ${formatVND(actualLabor)} > Quỹ khoán 15% ${formatVND(quota)}). KHÓA CỨNG COL BG = 0 Đ!`;
    } else {
      // Dương quỹ khoán hoặc bằng 0: Col BG được ghi nhận
      if (rawProfit > 0) {
        colBG = options.includeSurplus ? (rawProfit + laborSurplus) : rawProfit;
      } else {
        // Nếu không truyền rawProfit, lấy theo thặng dư khoán thợ
        colBG = laborSurplus;
      }
      auditReason = `ĐẠT ĐỊNH MỨC KHOÁN (Dư quỹ thợ ${formatVND(laborSurplus)}). Col BG ghi nhận ${formatVND(colBG)}.`;
    }

    return {
      quyKhoanTho15: quota,
      actualLaborCost: actualLabor,
      laborSurplus,
      isDeficit,
      deficitAmount,
      colBG: Math.max(0, Math.round(colBG)),
      auditReason
    };
  }

  /**
   * Tính quỹ thợ nòng cốt (Hà Viết Hòa & Lương Thể Hào) trích giữ cuối năm
   * @param {Array} workers - Danh sách công nhân
   * @returns {Object}
   */
  function calculateCoreWorkerRetention(workers = []) {
    let totalDaysHoa = 0;
    let totalDaysHao = 0;

    if (Array.isArray(workers)) {
      workers.forEach(w => {
        const nameUpper = (w.name || '').toUpperCase();
        const days = Number(w.days || 0);
        if (nameUpper.includes('HOÀ') || nameUpper.includes('HOA')) {
          totalDaysHoa += days;
        } else if (nameUpper.includes('HÀO') || nameUpper.includes('HAO')) {
          totalDaysHao += days;
        }
      });
    }

    const retentionHoa = totalDaysHoa * CONSTANTS.QUY_THO_NONG_COT_PER_DAY;
    const retentionHao = totalDaysHao * CONSTANTS.QUY_THO_NONG_COT_PER_DAY;
    const totalRetention = retentionHoa + retentionHao;

    return {
      totalDaysHoa,
      totalDaysHao,
      retentionHoa,
      retentionHao,
      totalRetention,
      note: 'Trích 20.000 đ/công giữ đến cuối năm tất niên mới chi trả gắn kết trách nhiệm.'
    };
  }

  /**
   * Tính thưởng doanh số vượt 500 Triệu (Giữ đến tất niên)
   * @param {number} totalSales - Tổng doanh số trong tháng
   * @returns {Object}
   */
  function calculateOver500MBonus(totalSales = 0) {
    const sales = Number(totalSales || 0);
    const isOver = sales > CONSTANTS.THRESHOLD_OVER_500M;
    const excess = isOver ? (sales - CONSTANTS.THRESHOLD_OVER_500M) : 0;

    const bonusThai = isOver ? Math.round(excess * CONSTANTS.RATE_THUONG_THAI) : 0;
    const bonusVu = isOver ? Math.round(excess * CONSTANTS.RATE_THUONG_VU) : 0;
    const bonusHiep = isOver ? Math.round(excess * CONSTANTS.RATE_THUONG_HIEP) : 0;
    const totalBonus = bonusThai + bonusVu + bonusHiep;

    return {
      isOver,
      excess,
      bonusThai,
      bonusVu,
      bonusHiep,
      totalBonus,
      note: isOver ? 'Vượt ngưỡng 500M: Thưởng giữ lại đến tất niên đối soát xong mới chi trả.' : 'Không vượt ngưỡng 500M.'
    };
  }

  /**
   * Xử lý và tính toán CCSC cho 1 tháng chi tiết
   * @param {Object} monthConfig - Cấu hình tháng từ ccscMonths
   * @param {Array} xuongRecordsOfMonth - Danh sách hợp đồng xưởng trong tháng
   * @param {Array} workersOfMonth - Danh sách công nhân trong tháng
   * @returns {Object}
   */
  function processMonthCCSC(monthConfig, xuongRecordsOfMonth = [], workersOfMonth = []) {
    const m = monthConfig ? Number(monthConfig.m || 0) : 0;
    const name = monthConfig ? (monthConfig.name || `Tháng ${m}`) : `Tháng ${m}`;
    const isActual = monthConfig ? Boolean(monthConfig.isActual) : false;

    // 1. Bóc tách danh sách hợp đồng xưởng
    let totalContractVal = 0;
    let totalSolidVal = 0;
    let totalPkVal = 0;
    let totalWoodVal = 0;
    let totalActualXuong = 0;
    let totalDebt = Number(monthConfig && monthConfig.debt ? monthConfig.debt : 0);

    const decoupledContracts = [];

    if (Array.isArray(xuongRecordsOfMonth) && xuongRecordsOfMonth.length > 0) {
      xuongRecordsOfMonth.forEach(item => {
        const decoupled = calculateContractWoodVal(item);
        decoupledContracts.push(decoupled);
        totalContractVal += decoupled.contractVal;
        totalSolidVal += decoupled.solidVal;
        totalPkVal += decoupled.pkVal;
        totalWoodVal += decoupled.woodVal;
        totalActualXuong += decoupled.actualXuong;
      });
    } else {
      // Nếu không có hợp đồng chi tiết (tháng kế hoạch), lấy doanh số từ cấu hình tháng
      const configuredSales = Number(monthConfig && monthConfig.sales ? monthConfig.sales : 0);
      totalContractVal = configuredSales;
      totalWoodVal = configuredSales;
      totalActualXuong = configuredSales;
    }

    // Doanh số tổng hợp của tháng
    const monthlySales = totalActualXuong > 0 ? totalActualXuong : Number(monthConfig && monthConfig.sales ? monthConfig.sales : 0);
    const cashCollected = Number(monthConfig && monthConfig.cash ? monthConfig.cash : (monthlySales - totalDebt));

    // 2. Định mức xưởng chuẩn
    const workshopQuota = calculateWorkshopQuota(monthlySales);

    // 3. Tính lương thợ thực tế
    let actualLaborCost = 0;
    if (Array.isArray(workersOfMonth) && workersOfMonth.length > 0) {
      workersOfMonth.forEach(w => {
        actualLaborCost += Number(w.total || 0);
      });
    } else {
      // Nếu không có bảng thợ, ước lượng theo 15% quỹ khoán nếu là tháng kế hoạch
      actualLaborCost = workshopQuota.quyKhoanTho15;
    }

    // 4. Lợi nhuận xưởng Col BG & Chốt chặn Kỷ luật thép
    const rawWorkshopProfit = Math.round(monthlySales * 0.10); // Lợi nhuận xưởng định mức cơ sở 10%
    const colBGResult = calculateColBG(workshopQuota.quyKhoanTho15, actualLaborCost, rawWorkshopProfit);

    // 5. Mảng phụ kiện: Lợi nhuận 30%
    let pkProfit = 0;
    if (monthConfig && monthConfig.pk_profit !== undefined) {
      pkProfit = Number(monthConfig.pk_profit);
    } else if (totalPkVal > 0) {
      pkProfit = Math.round(totalPkVal * CONSTANTS.PHU_KIEN_PROFIT_RATE);
    }

    // 6. Chi phí quản lý & vận hành cố định
    const bld = Number(monthConfig && monthConfig.bld ? monthConfig.bld : CONSTANTS.LUONG_BLD_STANDARD);
    const hiep_cb = Number(monthConfig && monthConfig.hiep_cb ? monthConfig.hiep_cb : CONSTANTS.LUONG_CB_HIEP);
    const hiep_sale = Number(monthConfig && monthConfig.hiep_sale ? monthConfig.hiep_sale : 0);
    const bpkd = Number(monthConfig && monthConfig.bpkd ? monthConfig.bpkd : 0);
    const qlx = Number(monthConfig && monthConfig.qlx ? monthConfig.qlx : 0);
    const mkt = Number(monthConfig && monthConfig.mkt ? monthConfig.mkt : 0);
    const thue = Number(monthConfig && monthConfig.thue ? monthConfig.thue : CONSTANTS.THUE_STANDARD);
    const bhxh = Number(monthConfig && monthConfig.bhxh ? monthConfig.bhxh : CONSTANTS.BHXH_STANDARD);

    // 7. Thưởng doanh số > 500M
    const over500MBonus = calculateOver500MBonus(monthlySales);

    // 8. Quỹ thợ nòng cốt trích giữ
    const coreRetention = calculateCoreWorkerRetention(workersOfMonth);

    // 9. Tổng chi phí hoạt động (không gồm vật tư và thợ đã tính vào xưởng)
    const operatingExpenses = bld + hiep_cb + hiep_sale + bpkd + qlx + mkt + thue + bhxh;

    // 10. Lợi nhuận ròng Ban Giám Đốc (CCSC Net Profit)
    // Lợi nhuận ròng = Lợi nhuận xưởng (Col BG) + Lãi phụ kiện (30%) - Chi phí vận hành
    // Lưu ý: Nếu Col BG = 0 vì âm quỹ thợ, lợi nhuận ròng phản ánh đúng thực tế không bị thổi phồng!
    const netProfitBG = colBGResult.colBG + pkProfit - (operatingExpenses - bld); // BLD là lương cố định của BGĐ

    return {
      m,
      name,
      isActual,
      monthlySales,
      debt: totalDebt,
      cash: cashCollected,
      decoupledContracts,
      summaryDecoupled: {
        totalContractVal,
        totalSolidVal,
        totalPkVal,
        totalWoodVal,
        totalActualXuong
      },
      workshopQuota,
      laborAudit: colBGResult,
      pkProfit,
      expenses: {
        bld,
        hiep_cb,
        hiep_sale,
        bpkd,
        qlx,
        mkt,
        thue,
        bhxh,
        total: operatingExpenses
      },
      over500MBonus,
      coreRetention,
      netProfitBG
    };
  }

  /**
   * BỘ MÁY CHÍNH: Chạy CCSC 12 tháng từ dữ liệu pg_home_live_state.json
   * @param {Object} liveStateData - Dữ liệu đầy đủ từ pg_home_live_state.json
   * @returns {Object} Báo cáo phân tích 12 tháng và tổng hợp cả năm
   */
  function run12MonthsEngine(liveStateData) {
    if (!liveStateData || typeof liveStateData !== 'object') {
      throw new Error('Dữ liệu liveStateData không hợp lệ hoặc bị rỗng.');
    }

    const ccscMonths = Array.isArray(liveStateData.ccscMonths) ? liveStateData.ccscMonths : [];
    const xuongRecords = Array.isArray(liveStateData.xuongRecords) ? liveStateData.xuongRecords : [];
    const workers = Array.isArray(liveStateData.workers) ? liveStateData.workers : [];

    const monthsResults = [];

    // Tổng hợp cả năm
    let yearlySales = 0;
    let yearlyDebt = 0;
    let yearlyCash = 0;
    let yearlyWoodVal = 0;
    let yearlySolidVal = 0;
    let yearlyPkVal = 0;
    let yearlyVatTu40 = 0;
    let yearlyQuyKhoanTho15 = 0;
    let yearlyActualLabor = 0;
    let yearlyColBG = 0;
    let yearlyPkProfit = 0;
    let yearlyOperatingExpenses = 0;
    let yearlyNetProfitBG = 0;
    let countDeficitMonths = 0;
    let totalDeficitAmount = 0;
    let totalCoreRetention = 0;
    let totalBonusOver500M = 0;

    for (let m = 1; m <= 12; m++) {
      const monthConfig = ccscMonths.find(item => Number(item.m) === m) || { m, name: `Tháng ${m}`, sales: 0 };
      const recordsOfMonth = xuongRecords.filter(item => Number(item.month) === m);
      
      // Công nhân tính theo tháng: Nếu tháng 8, 9, 10 có bảng công thì truyền vào
      const workersOfMonth = (m >= 8 && m <= 10) ? workers : [];

      const processedMonth = processMonthCCSC(monthConfig, recordsOfMonth, workersOfMonth);
      monthsResults.push(processedMonth);

      // Cộng dồn cả năm
      yearlySales += processedMonth.monthlySales;
      yearlyDebt += processedMonth.debt;
      yearlyCash += processedMonth.cash;
      yearlyWoodVal += processedMonth.summaryDecoupled.totalWoodVal;
      yearlySolidVal += processedMonth.summaryDecoupled.totalSolidVal;
      yearlyPkVal += processedMonth.summaryDecoupled.totalPkVal;
      yearlyVatTu40 += processedMonth.workshopQuota.vatTu40;
      yearlyQuyKhoanTho15 += processedMonth.workshopQuota.quyKhoanTho15;
      yearlyActualLabor += processedMonth.laborAudit.actualLaborCost;
      yearlyColBG += processedMonth.laborAudit.colBG;
      yearlyPkProfit += processedMonth.pkProfit;
      yearlyOperatingExpenses += processedMonth.expenses.total;
      yearlyNetProfitBG += processedMonth.netProfitBG;
      totalCoreRetention += processedMonth.coreRetention.totalRetention;
      totalBonusOver500M += processedMonth.over500MBonus.totalBonus;

      if (processedMonth.laborAudit.isDeficit) {
        countDeficitMonths++;
        totalDeficitAmount += processedMonth.laborAudit.deficitAmount;
      }
    }

    const yearlySummary = {
      yearlySales,
      yearlyDebt,
      yearlyCash,
      yearlyWoodVal,
      yearlySolidVal,
      yearlyPkVal,
      yearlyVatTu40,
      yearlyQuyKhoanTho15,
      yearlyActualLabor,
      yearlyColBG,
      yearlyPkProfit,
      yearlyOperatingExpenses,
      yearlyNetProfitBG,
      countDeficitMonths,
      totalDeficitAmount,
      totalCoreRetention,
      totalBonusOver500M,
      auditVerdict: countDeficitMonths > 0 
        ? `PHÁT HIỆN ${countDeficitMonths} THÁNG ÂM QUỸ KHOÁN THỢ (Tổng âm: ${formatVND(totalDeficitAmount)}). ĐÃ KHÓA CỨNG COL BG = 0 ĐỂ BẢO VỆ DÒNG TIỀN BAN GIÁM ĐỐC!`
        : 'TOÀN BỘ 12 THÁNG ĐẠT CHỈ TIÊU ĐỊNH MỨC QUỸ KHOÁN.'
    };

    return {
      timestamp: new Date().toISOString(),
      standards: CONSTANTS,
      months: monthsResults,
      yearlySummary
    };
  }

  /**
   * Tạo giao diện bảng HTML hiển thị báo cáo CCSC 12 tháng chuyên nghiệp
   * @param {string|HTMLElement} container - Id hoặc DOM element
   * @param {Object} liveStateData - Dữ liệu pg_home_live_state.json
   */
  function renderCCSCSummaryTable(container, liveStateData) {
    const targetElement = typeof container === 'string' ? document.getElementById(container) : container;
    if (!targetElement) {
      console.error('Không tìm thấy container element để render bảng CCSC.');
      return;
    }

    const report = run12MonthsEngine(liveStateData);
    const { months, yearlySummary } = report;

    let html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="border-bottom: 2px solid #334155; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; color: #38bdf8; font-size: 18px; text-transform: uppercase; letter-spacing: 0.5px;">BÁO CÁO CCSC 12 THÁNG & BÓC TÁCH LỢI NHUẬN XƯỞNG PG HOME</h2>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Hộ Kinh Doanh Phú Gia - Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | MST: 042203002931</div>
          </div>
          <div style="background: ${yearlySummary.countDeficitMonths > 0 ? '#ef4444' : '#10b981'}; color: white; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;">
            ${yearlySummary.countDeficitMonths > 0 ? `CẢNH BÁO: ${yearlySummary.countDeficitMonths} THÁNG KHÓA COL BG = 0` : 'KHOÁN AN TOÀN 100%'}
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: right;">
            <thead>
              <tr style="background: #1e293b; color: #94a3b8; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
                <th style="padding: 10px; text-align: left; border: 1px solid #334155;">Tháng</th>
                <th style="padding: 10px; border: 1px solid #334155;">Doanh Số Xưởng (Gỗ CN)</th>
                <th style="padding: 10px; border: 1px solid #334155;">Vật Tư 40%</th>
                <th style="padding: 10px; border: 1px solid #334155;">Quỹ Khoán Thợ 15%</th>
                <th style="padding: 10px; border: 1px solid #334155;">Lương Thợ Chi Thực Tế</th>
                <th style="padding: 10px; border: 1px solid #334155;">Chênh Lệch Quỹ Thợ</th>
                <th style="padding: 10px; border: 1px solid #334155; color: #38bdf8;">Col BG (Lợi Nhuận Xưởng)</th>
                <th style="padding: 10px; border: 1px solid #334155;">Lãi PK (30%)</th>
                <th style="padding: 10px; border: 1px solid #334155;">Trạng Thái Kỷ Luật Thép</th>
              </tr>
            </thead>
            <tbody>
    `;

    months.forEach(m => {
      const isDeficit = m.laborAudit.isDeficit;
      const rowBg = isDeficit ? 'rgba(239, 68, 68, 0.08)' : (m.m % 2 === 0 ? '#1e293b' : '#0f172a');
      const statusBadge = isDeficit
        ? `<span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold;">KHÓA CỨNG 0 Đ</span>`
        : `<span style="background: #059669; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">ĐẠT ĐỊNH MỨC</span>`;

      html += `
        <tr style="background: ${rowBg}; border-bottom: 1px solid #334155;">
          <td style="padding: 8px 10px; text-align: left; font-weight: bold; border: 1px solid #334155;">
            ${m.name} ${m.isActual ? '<span style="color: #38bdf8; font-size: 10px;">(Thực tế)</span>' : ''}
          </td>
          <td style="padding: 8px 10px; border: 1px solid #334155; font-weight: 500;">${formatVND(m.monthlySales)}</td>
          <td style="padding: 8px 10px; border: 1px solid #334155; color: #cbd5e1;">${formatVND(m.workshopQuota.vatTu40)}</td>
          <td style="padding: 8px 10px; border: 1px solid #334155; color: #cbd5e1;">${formatVND(m.workshopQuota.quyKhoanTho15)}</td>
          <td style="padding: 8px 10px; border: 1px solid #334155; color: ${isDeficit ? '#f87171' : '#f8fafc'};">${formatVND(m.laborAudit.actualLaborCost)}</td>
          <td style="padding: 8px 10px; border: 1px solid #334155; color: ${isDeficit ? '#ef4444' : '#34d399'}; font-weight: bold;">
            ${m.laborAudit.laborSurplus >= 0 ? '+' : ''}${formatVND(m.laborAudit.laborSurplus)}
          </td>
          <td style="padding: 8px 10px; border: 1px solid #334155; font-weight: bold; color: ${isDeficit ? '#ef4444' : '#38bdf8'}; font-size: 14px;">
            ${formatVND(m.laborAudit.colBG)}
          </td>
          <td style="padding: 8px 10px; border: 1px solid #334155; color: #a78bfa;">${formatVND(m.pkProfit)}</td>
          <td style="padding: 8px 10px; border: 1px solid #334155; text-align: center;">${statusBadge}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
            <tfoot>
              <tr style="background: #1e293b; font-weight: bold; border-top: 2px solid #38bdf8; color: #f8fafc;">
                <td style="padding: 12px 10px; text-align: left; border: 1px solid #334155;">TỔNG CỘNG 12 THÁNG</td>
                <td style="padding: 12px 10px; border: 1px solid #334155; color: #38bdf8;">${formatVND(yearlySummary.yearlySales)}</td>
                <td style="padding: 12px 10px; border: 1px solid #334155;">${formatVND(yearlySummary.yearlyVatTu40)}</td>
                <td style="padding: 12px 10px; border: 1px solid #334155;">${formatVND(yearlySummary.yearlyQuyKhoanTho15)}</td>
                <td style="padding: 12px 10px; border: 1px solid #334155; color: #f87171;">${formatVND(yearlySummary.yearlyActualLabor)}</td>
                <td style="padding: 12px 10px; border: 1px solid #334155; color: ${yearlySummary.yearlyQuyKhoanTho15 >= yearlySummary.yearlyActualLabor ? '#34d399' : '#ef4444'};">
                  ${formatVND(yearlySummary.yearlyQuyKhoanTho15 - yearlySummary.yearlyActualLabor)}
                </td>
                <td style="padding: 12px 10px; border: 1px solid #334155; color: #38bdf8; font-size: 15px;">${formatVND(yearlySummary.yearlyColBG)}</td>
                <td style="padding: 12px 10px; border: 1px solid #334155; color: #a78bfa;">${formatVND(yearlySummary.yearlyPkProfit)}</td>
                <td style="padding: 12px 10px; border: 1px solid #334155; text-align: center; color: #38bdf8;">HOÀN TẤT ĐỐI SOÁT</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="margin-top: 16px; padding: 12px 16px; background: #1e293b; border-left: 4px solid #38bdf8; border-radius: 4px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
          <strong style="color: #f8fafc;">KẾT LUẬN KIỂM TOÁN BAN GIÁM ĐỐC:</strong><br/>
          • ${yearlySummary.auditVerdict}<br/>
          • Quỹ thợ nòng cốt Hòa & Hào giữ cuối năm tất niên: <strong style="color: #fbbf24;">${formatVND(yearlySummary.totalCoreRetention)}</strong> (20k/công giữ gắn kết trách nhiệm).<br/>
          • Thưởng vượt doanh số > 500M giữ cuối năm: <strong style="color: #fbbf24;">${formatVND(yearlySummary.totalBonusOver500M)}</strong> (Thái 0.5%, Vũ 0.3%, Hiệp 0.5%).
        </div>
      </div>
    `;

    targetElement.innerHTML = html;
  }

  // Public API Export
  return {
    CONSTANTS,
    formatVND,
    calculateContractWoodVal,
    calculateWorkshopQuota,
    calculateColBG,
    calculateCoreWorkerRetention,
    calculateOver500MBonus,
    processMonthCCSC,
    run12MonthsEngine,
    renderCCSCSummaryTable
  };
});
