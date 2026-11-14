/**
 * ============================================================================
 * HỆ THỐNG QUẢN TRỊ & DỰ TOÁN BÁO GIÁ PHÚ GIA (PG HOME LUXURY)
 * MODULE W08: KIỂM SOÁT ĐỊNH GIÁ 3 CẤP VẬT LIỆU & CHỐT CHẶN COST <= 54%
 * 
 * Kế thừa chuẩn mực từ Sổ Tay Kỷ Luật & GEMINI.md - Mục 24:
 * - 4.2.4: Định giá 3 Cấp Vật Liệu (An Cường <-> Thái Lan <-> Plywood A1):
 *   + Giữa An Cường và Thái Lan chỉ chênh tiền phôi ván gỗ ~380.000 đ/tấm.
 *   + CỐ ĐỊNH 100%: Nhựa đặc WPB An Cường (2.550.000 đ/tấm), Cánh Acrylic Noline,
 *     Phụ kiện, Kính, Da bọc và Công thợ.
 *   + Cột Thái Lan chỉ được giảm tương ứng phần chênh phôi ván (~12% - 14%),
 *     cấm giảm sâu ở các hạng mục có Cánh Acrylic hoặc Nhựa WPB.
 * - 4.2.5: Chốt Chặn 54% Trước Khi Xuất Báo Giá:
 *   + (Tổng Vật Tư Thực Tế + Tổng Công Thợ Dự Kiến) / Tổng Doanh Thu Báo Giá <= 54%.
 *   + Đạt Lợi nhuận ròng 18% - 20% an toàn cho Ban Giám Đốc.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var mod = factory();
    root.PG_Modules_W08 = mod;
    root.PG_W08 = mod;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // HẰNG SỐ QUY CHUẨN ĐỊNH MỨC & BẢO VỆ DÒNG TIỀN (MỤC 24 GEMINI.MD)
  var CONSTANTS = {
    // Chênh lệch tiền phôi ván gỗ MDF chống ẩm An Cường vs Thái Lan (~380.000 đ/tấm 1220x2440)
    DIFF_RAW_BOARD_AC_TL: 380000,
    
    // Tỷ lệ chênh phôi ván gỗ tiêu chuẩn (12% - 14%)
    PERCENT_WOOD_RAW_DIFF_MIN: 0.12,
    PERCENT_WOOD_RAW_DIFF_MAX: 0.14,
    
    // Đơn giá tấm nhựa đặc WPB An Cường (cố định 100%, không giảm ở cấp Thái Lan)
    PRICE_WPB_BOARD_AN_CUONG: 2550000,
    
    // Tấm ván Plywood A1 cao cấp phủ Melamine/Laminate chịu nước (chênh ~180.000 - 250.000 đ/tấm so với MDF Thái Lan)
    DIFF_RAW_BOARD_PLYWOOD_TL: 220000,

    // Chốt chặn chi phí tổng (Vật Tư + Công Thợ) so với Tổng Doanh Thu Báo Giá
    COST_CEILING_MAX_PERCENT: 0.54, // 54.0%
    
    // Biên lợi nhuận ròng tối thiểu & chuẩn bỏ túi Giám Đốc
    NET_PROFIT_TARGET_MIN: 0.18, // 18.0%
    NET_PROFIT_TARGET_STANDARD: 0.20, // 20.0%
    
    // Chi phí vận hành, thuế, khấu hao, quản lý ước tính (~26% - 28%)
    ESTIMATED_OPEX_RATIO: 0.26
  };

  /**
   * 1. CHỐT CHẶN COST <= 54% (Mục 24.2.5)
   * Kiểm soát tỷ lệ chi phí cost trước khi xuất báo giá gửi khách hàng.
   * Công thức: Cost Ratio = (Tổng Vật Tư Thực Tế + Tổng Công Thợ Dự Kiến) / Tổng Doanh Thu Báo Giá
   * 
   * @param {Object} params
   * @param {number} params.totalCostVatTu - Tổng chi phí vật tư dự kiến/thực tế (đ)
   * @param {number} params.totalCostCongTho - Tổng chi phí nhân công thợ (đ)
   * @param {number} params.totalRevenue - Tổng doanh thu báo giá cho khách (đ)
   * @returns {Object} Kết quả kiểm định chi tiết
   */
  function validateCostCeiling(params) {
    var vatTu = Number(params && params.totalCostVatTu) || 0;
    var congTho = Number(params && params.totalCostCongTho) || 0;
    var revenue = Number(params && params.totalRevenue) || 0;

    if (revenue <= 0) {
      return {
        isValid: false,
        statusCode: 'INVALID_REVENUE',
        costRatio: 0,
        costPercent: 0,
        totalCost: vatTu + congTho,
        totalRevenue: revenue,
        estimatedNetProfitRatio: 0,
        estimatedNetProfitPercent: 0,
        message: 'LỖI NGHIÊM TRỌNG: Tổng doanh thu báo giá phải lớn hơn 0 đ.',
        isSafeForDirector: false
      };
    }

    var totalCost = vatTu + congTho;
    var costRatio = totalCost / revenue;
    var costPercent = Number((costRatio * 100).toFixed(2));
    var estimatedNetProfitRatio = 1 - costRatio - CONSTANTS.ESTIMATED_OPEX_RATIO;
    var estimatedNetProfitPercent = Number((estimatedNetProfitRatio * 100).toFixed(2));

    var isValid = costRatio <= CONSTANTS.COST_CEILING_MAX_PERCENT;
    var isSafeProfit = estimatedNetProfitRatio >= CONSTANTS.NET_PROFIT_TARGET_MIN;

    var message = '';
    var status = 'PASS';

    if (isValid) {
      message = 'ĐẠT CHUẨN CHỐT CHẶN COST (' + costPercent + '% <= 54%). ' +
                'Dự kiến lợi nhuận ròng đạt ' + estimatedNetProfitPercent + '% ' +
                '(Đạt mục tiêu 18% - 20% bỏ túi Giám Đốc). Đủ điều kiện xuất báo giá.';
    } else {
      status = 'FAILED_COST_OVER_54';
      var excessPercent = Number(((costRatio - CONSTANTS.COST_CEILING_MAX_PERCENT) * 100).toFixed(2));
      var excessCost = Math.round(totalCost - (revenue * CONSTANTS.COST_CEILING_MAX_PERCENT));
      message = 'CẢNH BÁO BÁO ĐỘNG ĐỎ: Tỷ lệ Cost (' + costPercent + '%) VƯỢT QUÁ CHỐT CHẶN 54% ' +
                '(Vượt ' + excessPercent + '%, tương đương đội chi phí ' + excessCost.toLocaleString('vi-VN') + ' đ). ' +
                'Biên lợi nhuận ròng ước tính chỉ còn ' + estimatedNetProfitPercent + '%, không bảo vệ được túi tiền Giám Đốc. ' +
                'Yêu cầu bóc tách lại định mức vật tư hoặc đàm phán nâng đơn giá!';
    }

    return {
      isValid: isValid,
      status: status,
      costRatio: Number(costRatio.toFixed(4)),
      costPercent: costPercent,
      maxAllowedCostRatio: CONSTANTS.COST_CEILING_MAX_PERCENT,
      maxAllowedCostPercent: CONSTANTS.COST_CEILING_MAX_PERCENT * 100,
      totalVatTu: vatTu,
      totalCongTho: congTho,
      totalCost: totalCost,
      totalRevenue: revenue,
      estimatedNetProfitRatio: Number(estimatedNetProfitRatio.toFixed(4)),
      estimatedNetProfitPercent: estimatedNetProfitPercent,
      isSafeForDirector: isSafeProfit,
      message: message
    };
  }

  /**
   * 1.1 CHỐT CHẶN TỶ LỆ COST <= 54% TRƯỚC KHI IN / XUẤT BÁO GIÁ A4 (Cải tiến #2)
   * Khóa cứng điều kiện xuất bản báo giá gửi khách hàng nhằm bảo vệ biên lợi nhuận ròng 18% - 20% của Giám Đốc.
   * 
   * @param {number|Object} totalCost - Tổng chi phí (Vật tư + Công thợ) hoặc object { totalCost, totalCostVatTu, totalCostCongTho, totalRevenue }
   * @param {number} [totalRev] - Tổng doanh thu báo giá cho khách hàng
   * @returns {Object} Kết quả kiểm duyệt chốt chặn 54%
   */
  function validateCostCeiling54(totalCost, totalRev) {
    var cost = 0;
    var rev = 0;
    if (typeof totalCost === 'object' && totalCost !== null) {
      if (typeof totalCost.totalCost !== 'undefined') {
        cost = Number(totalCost.totalCost) || 0;
      } else {
        cost = (Number(totalCost.totalCostVatTu) || 0) + (Number(totalCost.totalCostCongTho) || 0);
      }
      rev = Number(totalCost.totalRevenue || totalCost.revenue) || 0;
    } else {
      cost = Number(totalCost) || 0;
      rev = Number(totalRev) || 0;
    }

    if (rev <= 0) {
      return {
        isValid: false,
        statusCode: 'INVALID_REVENUE',
        costRatio: 0,
        costPercent: 0,
        totalCost: cost,
        totalRevenue: rev,
        estimatedNetProfitRatio: 0,
        estimatedNetProfitPercent: 0,
        isSafeForDirector: false,
        canPrintA4: false,
        message: 'LỖI KHÓA XUẤT BẢN: Tổng doanh thu báo giá phải lớn hơn 0 đ trước khi in/xuất báo giá A4.'
      };
    }

    var costRatio = cost / rev;
    var costPercent = Number((costRatio * 100).toFixed(2));
    var estimatedNetProfitRatio = 1 - costRatio - CONSTANTS.ESTIMATED_OPEX_RATIO;
    var estimatedNetProfitPercent = Number((estimatedNetProfitRatio * 100).toFixed(2));
    var isValid = costRatio <= CONSTANTS.COST_CEILING_MAX_PERCENT;
    var isSafeProfit = estimatedNetProfitRatio >= CONSTANTS.NET_PROFIT_TARGET_MIN;

    var status = isValid ? 'PASS' : 'BLOCKED_COST_OVER_54';
    var message = '';

    if (isValid) {
      message = 'ĐẠT CHUẨN CHỐT CHẶN COST (' + costPercent + '% <= 54.00%). ' +
                'Dự kiến lợi nhuận ròng đạt ' + estimatedNetProfitPercent + '% ' +
                '(Bảo vệ an toàn mục tiêu 18% - 20% bỏ túi Giám Đốc). ĐỦ ĐIỀU KIỆN IN/XUẤT BÁO GIÁ A4.';
    } else {
      var excessPercent = Number(((costRatio - CONSTANTS.COST_CEILING_MAX_PERCENT) * 100).toFixed(2));
      var excessCost = Math.round(cost - (rev * CONSTANTS.COST_CEILING_MAX_PERCENT));
      message = 'CẢNH BÁO BÁO ĐỘNG ĐỎ: Tỷ lệ Cost (' + costPercent + '%) VƯỢT QUÁ CHỐT CHẶN 54.00% ' +
                '(Vượt ' + excessPercent + '%, tương đương đội chi phí ' + excessCost.toLocaleString('vi-VN') + ' đ). ' +
                'Biên lợi nhuận ròng ước tính chỉ còn ' + estimatedNetProfitPercent + '%, không bảo vệ được túi tiền Giám Đốc. ' +
                'KHÓA CỨNG: Tuyệt đối không xuất báo giá A4 cho đến khi điều chỉnh về <= 54%!';
    }

    return {
      isValid: isValid,
      canPrintA4: isValid,
      status: status,
      costRatio: Number(costRatio.toFixed(4)),
      costPercent: costPercent,
      maxAllowedCostRatio: CONSTANTS.COST_CEILING_MAX_PERCENT,
      maxAllowedCostPercent: 54.0,
      totalCost: cost,
      totalRevenue: rev,
      excessCost: cost > rev * CONSTANTS.COST_CEILING_MAX_PERCENT ? Math.round(cost - (rev * CONSTANTS.COST_CEILING_MAX_PERCENT)) : 0,
      estimatedNetProfitRatio: Number(estimatedNetProfitRatio.toFixed(4)),
      estimatedNetProfitPercent: estimatedNetProfitPercent,
      isSafeForDirector: isSafeProfit,
      message: message
    };
  }

  /**
   * 1.2 GỢI Ý TỐI ƯU HÓA HẠNG MỤC VƯỢT TRẦN COST (Cải tiến #2)
   * Tự động quét danh sách hạng mục, chỉ ra các hạng mục có tỷ lệ Cost cao hoặc làm đội ngân sách,
   * đồng thời gợi ý chuyển đổi vật liệu khu vực khô sang MDF Thái Lan đúng chuẩn chênh phôi ván 380k/tấm (12%-14%),
   * và giữ nguyên 100% Nhựa WPB An Cường (2.550.000 đ/tấm) & Cánh Acrylic.
   * 
   * @param {Array<Object>} items - Danh sách các hạng mục báo giá
   * @param {number} [totalCost] - Tổng chi phí hiện tại (hoặc tự tính từ items)
   * @param {number} [totalRev] - Tổng doanh thu hiện tại (hoặc tự tính từ items)
   * @returns {Object} Chi tiết phân tích và danh sách gợi ý tối ưu
   */
  function getOptimizationSuggestions(items, totalCost, totalRev) {
    var itemList = Array.isArray(items) ? items : [];
    
    var calcCost = 0;
    var calcRev = 0;
    
    itemList.forEach(function (it) {
      var itCost = Number(it.cost || it.totalCost || (Number(it.costVatTu || 0) + Number(it.costCongTho || 0)) || 0);
      var itRev = Number(it.revenue || it.totalRevenue || it.thanhTien || it.price || 0);
      calcCost += itCost;
      calcRev += itRev;
    });

    var cost = Number(totalCost) > 0 ? Number(totalCost) : calcCost;
    var rev = Number(totalRev) > 0 ? Number(totalRev) : calcRev;
    var currentRatio = rev > 0 ? cost / rev : 0;
    var currentPercent = Number((currentRatio * 100).toFixed(2));
    var isOverCeiling = currentRatio > CONSTANTS.COST_CEILING_MAX_PERCENT;
    var excessCost = isOverCeiling ? Math.round(cost - (rev * CONSTANTS.COST_CEILING_MAX_PERCENT)) : 0;

    var highCostItems = [];
    var suggestions = [];
    var totalPotentialSavings = 0;

    itemList.forEach(function (it, idx) {
      var itCode = it.code || it.itemCode || it.norm_id || ('R' + (it.row || (idx + 1)));
      var itName = it.name || it.tenHangMuc || 'Hạng mục #' + (idx + 1);
      var itCost = Number(it.cost || it.totalCost || (Number(it.costVatTu || 0) + Number(it.costCongTho || 0)) || 0);
      var itRev = Number(it.revenue || it.totalRevenue || it.thanhTien || (Number(it.qty || 1) * Number(it.price || it.donGia || 0)) || 0);
      var itBoards = Number(it.boards || it.boardCount || it.mdf17 || it.totalSheets || 0);
      var itRatio = itRev > 0 ? itCost / itRev : 0;
      var itPercent = Number((itRatio * 100).toFixed(2));

      var nameLower = itName.toLowerCase();
      var isDryArea = !it.isWet && !it.isWPB && !it.isPvc && !(nameLower.indexOf('bếp dưới') >= 0 || nameLower.indexOf('lavabo') >= 0 || nameLower.indexOf('giặt') >= 0);
      var hasWPB = !!(it.isWPB || it.isPvc || nameLower.indexOf('nhựa') >= 0 || nameLower.indexOf('wpb') >= 0 || nameLower.indexOf('pitech') >= 0);
      var hasAcrylic = !!(it.hasAcrylic || nameLower.indexOf('acrylic') >= 0);

      var itemAudit = {
        code: itCode,
        name: itName,
        cost: itCost,
        revenue: itRev,
        costPercent: itPercent,
        isOverRatio: itRatio > CONSTANTS.COST_CEILING_MAX_PERCENT,
        isDryArea: isDryArea,
        hasWPB: hasWPB,
        hasAcrylic: hasAcrylic,
        boardCount: itBoards
      };

      if (itRatio > CONSTANTS.COST_CEILING_MAX_PERCENT || (itCost > 0 && itRev === 0)) {
        highCostItems.push(itemAudit);
      }

      // Gợi ý tối ưu vật liệu: Nếu là khu vực khô đang dùng An Cường
      if (isDryArea && !hasWPB) {
        var estimatedBoard = itBoards > 0 ? itBoards : Math.max(1, Math.round(itCost / 1000000));
        var rawBoardSaving = Math.round(estimatedBoard * CONSTANTS.DIFF_RAW_BOARD_AC_TL);
        var standardReduction = Math.round(itRev * 0.13);
        var netSaving = Math.min(rawBoardSaving, standardReduction > 0 ? standardReduction : rawBoardSaving);

        if (netSaving > 0) {
          totalPotentialSavings += netSaving;
          suggestions.push({
            type: 'SWITCH_TO_MDF_THAI_LAN',
            code: itCode,
            name: itName,
            currentCost: itCost,
            currentRevenue: itRev,
            boardCount: estimatedBoard,
            estimatedSavings: netSaving,
            recommendation: 'Chuyển thùng/thành phần gỗ khu vực khô (' + itName + ') từ MDF An Cường sang MDF lõi xanh Thái Lan. ' +
                            'Mức giảm chuẩn 12% - 14% (chênh phôi ván 380.000 đ/tấm × ' + estimatedBoard + ' tấm ≈ ' +
                            netSaving.toLocaleString('vi-VN') + ' đ tiết kiệm chi phí gốc). ' +
                            'Vẫn đảm bảo thẩm mỹ Melamine và độ bền chống ẩm.'
          });
        }
      } else if (hasWPB || hasAcrylic) {
        suggestions.push({
          type: 'LOCK_FIXED_COMPONENTS',
          code: itCode,
          name: itName,
          recommendation: 'GIỮ NGUYÊN 100% ĐƠN GIÁ: Hạng mục "' + itName + '" chứa Nhựa đặc WPB An Cường (' +
                          CONSTANTS.PRICE_WPB_BOARD_AN_CUONG.toLocaleString('vi-VN') + ' đ/tấm) hoặc Cánh Acrylic Noline. ' +
                          'Nghiêm cấm giảm giá bừa bãi theo tỷ lệ MDF để tránh âm vốn vật tư!'
        });
      }
    });

    if (isOverCeiling) {
      var minSuggestedRevenue = Math.ceil(cost / CONSTANTS.COST_CEILING_MAX_PERCENT);
      var requiredRevIncrease = minSuggestedRevenue - rev;
      suggestions.unshift({
        type: 'ADJUST_QUOTE_REVENUE',
        code: 'ALL',
        name: 'Toàn bộ công trình',
        recommendation: 'ĐIỀU CHỈNH ĐƠN GIÁ BÁN: Để đưa Cost về chuẩn an toàn <= 54.00% mà không giảm chất lượng, ' +
                        'cần nâng tổng doanh thu báo giá từ ' + rev.toLocaleString('vi-VN') + ' đ lên tối thiểu ' +
                        minSuggestedRevenue.toLocaleString('vi-VN') + ' đ (tăng ' + requiredRevIncrease.toLocaleString('vi-VN') + ' đ, ~' +
                        Number(((requiredRevIncrease / rev) * 100).toFixed(1)) + '%).'
      });
    }

    var projectedCost = Math.max(0, cost - totalPotentialSavings);
    var projectedRatio = rev > 0 ? projectedCost / rev : 0;
    var projectedPercent = Number((projectedRatio * 100).toFixed(2));

    return {
      totalCost: cost,
      totalRevenue: rev,
      currentCostRatio: Number(currentRatio.toFixed(4)),
      currentCostPercent: currentPercent,
      isOverCeiling: isOverCeiling,
      excessCost: excessCost,
      highCostItemsCount: highCostItems.length,
      highCostItems: highCostItems,
      potentialMaterialSavings: totalPotentialSavings,
      projectedCostAfterMaterialOptimization: projectedCost,
      projectedCostPercentAfterOptimization: projectedPercent,
      willPassCeilingAfterOptimization: projectedRatio <= CONSTANTS.COST_CEILING_MAX_PERCENT,
      suggestions: suggestions,
      directorSafetyNotice: projectedRatio <= CONSTANTS.COST_CEILING_MAX_PERCENT ?
        'Sau khi tối ưu phôi ván khu vực khô, dự kiến Cost giảm về ' + projectedPercent + '% <= 54%, bảo vệ trọn vẹn lãi ròng 18% - 20% của Giám Đốc.' :
        'Sau khi tối ưu vật tư, Cost dự kiến còn ' + projectedPercent + '%. Cần kết hợp thêm việc điều chỉnh đơn giá các hạng mục cá biệt.'
    };
  }

  /**
   * 2. KIỂM SOÁT ĐỊNH GIÁ 3 CẤP VẬT LIỆU (Mục 24.2.4)
   * Kiểm tra và tính toán bảng giá chuẩn cho 3 cấp:
   * - Cấp 1: AN_CUONG (Chuẩn cơ sở gốc)
   * - Cấp 2: THAI_LAN (Giảm chỉ đúng phần phôi ván gỗ ~380k/tấm, WPB/Acrylic/Phụ kiện/Thợ GIỮ NGUYÊN)
   * - Cấp 3: PLYWOOD_A1 (Cấp chịu nước cao cấp Plywood phủ Melamine/Laminate/Acrylic)
   *
   * @param {Object} item - Chi tiết hạng mục cần kiểm định
   * @param {string} item.itemCode - Mã hiệu hạng mục (VD: R09, R08, R27...)
   * @param {string} item.name - Tên hạng mục (VD: Tủ bếp dưới, Tủ áo kịch trần...)
   * @param {number} item.priceAnCuong - Đơn giá báo giá chuẩn An Cường (đ)
   * @param {number} item.priceThaiLan - Đơn giá báo giá cấp Thái Lan (đ)
   * @param {number} [item.pricePlywood] - Đơn giá cấp Plywood A1 (nếu có)
   * @param {number} item.boardCount - Định mức số tấm ván gỗ tiêu hao (tấm)
   * @param {boolean} [item.isWPB] - Hạng mục có thùng/cánh bằng Nhựa WPB An Cường
   * @param {boolean} [item.hasAcrylic] - Hạng mục có cánh Acrylic Noline
   * @param {number} [item.fixedComponentsValue] - Giá trị linh kiện cố định 100% (Phụ kiện, Đá, Kính, WPB, Acrylic...)
   * @returns {Object} Kết quả kiểm định định giá 3 cấp
   */
  function validateItem3TiersPricing(item) {
    var itemCode = item.itemCode || 'N/A';
    var name = item.name || 'Hạng mục nội thất';
    var priceAC = Number(item.priceAnCuong) || 0;
    var priceTL = Number(item.priceThaiLan) || 0;
    var pricePly = Number(item.pricePlywood) || 0;
    var boardCount = Number(item.boardCount) || 0;
    var isWPB = Boolean(item.isWPB);
    var hasAcrylic = Boolean(item.hasAcrylic);
    var fixedVal = Number(item.fixedComponentsValue) || 0;

    var issues = [];
    var warnings = [];

    if (priceAC <= 0) {
      return {
        isValid: false,
        statusCode: 'INVALID_AN_CUONG_PRICE',
        itemCode: itemCode,
        name: name,
        message: 'Lỗi: Đơn giá chuẩn An Cường của ' + itemCode + ' phải lớn hơn 0 đ.'
      };
    }

    // 1. Phân tích mức giảm giữa An Cường và Thái Lan
    var rawDiff = priceAC - priceTL;
    var discountPercent = (rawDiff / priceAC) * 100;

    // Tính mức giảm dự kiến đúng chuẩn dựa trên số tấm phôi ván gỗ:
    // Chênh lệch cho phép = boardCount * 380.000 đ
    var expectedBoardDiff = boardCount > 0 ? (boardCount * CONSTANTS.DIFF_RAW_BOARD_AC_TL) : 0;

    // Kiểm tra quy tắc giảm giá khi có WPB hoặc Cánh Acrylic Noline
    if (isWPB || hasAcrylic) {
      // Hạng mục chứa vật liệu cố định cao cấp:
      // Nhựa WPB 2.550.000 đ/tấm và Cánh Acrylic Noline là GIÁ CỐ ĐỊNH, KHÔNG ĐỔI giữa An Cường và Thái Lan!
      // Do đó tỷ lệ giảm trên tổng đơn giá Thái Lan KHÔNG ĐƯỢC GIẢM SÂU (> 12% là sai nguyên tắc nghiêm trọng)
      if (discountPercent > 12.0) {
        issues.push({
          rule: 'RULE_4_2_4_FIXED_MATERIALS',
          severity: 'CRITICAL',
          message: 'VI PHẠM QUY TẮC ĐỊNH GIÁ: Hạng mục ' + itemCode + ' (' + name + ') có chứa ' +
                   (isWPB ? 'Nhựa đặc WPB An Cường (2.550.000 đ/tấm) ' : '') +
                   (hasAcrylic ? 'Cánh Acrylic Noline ' : '') +
                   'nhưng cột Thái Lan bị giảm tới ' + discountPercent.toFixed(1) + '%. ' +
                   'Quy tắc Mục 24 cấm giảm sâu ở vật liệu cố định! Chỉ được giảm phần chênh phôi ván gỗ (nếu có).'
        });
      }
    } else {
      // Hạng mục ván gỗ công nghiệp thông thường (Melamine):
      // Tỷ lệ giảm chuẩn chỉ từ 12% đến 14% tương ứng chênh lệch phôi ván gỗ ~380k/tấm
      if (discountPercent > 16.0) {
        issues.push({
          rule: 'RULE_4_2_4_OVER_DISCOUNT',
          severity: 'HIGH',
          message: 'Hạng mục ' + itemCode + ' giảm giá cấp Thái Lan quá sâu (' + discountPercent.toFixed(1) + '% > 14%). ' +
                   'Đang bào mòn lợi nhuận xưởng và túi tiền của Giám Đốc!'
        });
      } else if (discountPercent < 8.0 && priceTL > 0) {
        warnings.push({
          rule: 'RULE_4_2_4_UNDER_DISCOUNT',
          message: 'Hạng mục ' + itemCode + ' chênh lệch giữa An Cường và Thái Lan quá thấp (' + discountPercent.toFixed(1) + '% < 10%). Khó thuyết phục khách hàng chọn gói kinh tế.'
        });
      }
    }

    // Kiểm tra tính hợp lý của số tấm nếu có truyền boardCount
    if (expectedBoardDiff > 0 && Math.abs(rawDiff - expectedBoardDiff) > (expectedBoardDiff * 0.35)) {
      warnings.push({
        rule: 'BOARD_DIFF_DEVIATION',
        message: 'Mức chênh lệch thực tế (' + rawDiff.toLocaleString('vi-VN') + ' đ) lệch đáng kể so với mức tính theo định mức ' + 
                 boardCount + ' tấm phôi x 380k = ' + expectedBoardDiff.toLocaleString('vi-VN') + ' đ.'
      });
    }

    // 2. Kiểm tra Cấp Plywood A1 (nếu có báo giá)
    var isPlywoodValid = true;
    if (pricePly > 0) {
      // Plywood A1 chịu nước cao cấp có giá thành cốt ván cao hơn MDF Thái Lan và thường tương đương hoặc tiệm cận An Cường
      if (pricePly < priceTL) {
        issues.push({
          rule: 'RULE_PLYWOOD_PRICE_INVERTED',
          severity: 'CRITICAL',
          message: 'LỖI ĐỊNH GIÁ NGƯỢC: Đơn giá Plywood A1 (' + pricePly.toLocaleString('vi-VN') + ' đ) không thể thấp hơn cấp MDF Thái Lan (' + priceTL.toLocaleString('vi-VN') + ' đ)!'
        });
        isPlywoodValid = false;
      }
    }

    var isValid = issues.length === 0;

    return {
      isValid: isValid,
      itemCode: itemCode,
      name: name,
      priceAnCuong: priceAC,
      priceThaiLan: priceTL,
      pricePlywood: pricePly,
      diffACTL: rawDiff,
      discountPercentTL: Number(discountPercent.toFixed(2)),
      expectedDiffFromBoards: expectedBoardDiff,
      isWPB: isWPB,
      hasAcrylic: hasAcrylic,
      issues: issues,
      warnings: warnings
    };
  }

  /**
   * 3. BẢNG TÍNH TỰ ĐỘNG ĐƠN GIÁ 3 CẤP TỪ ĐỊNH MỨC GỐC AN CƯỜNG
   * Sinh ra đơn giá chuẩn cho Thái Lan và Plywood A1 dựa trên phôi ván gỗ và vật tư cố định.
   * 
   * @param {Object} spec
   * @param {number} spec.priceAnCuong - Giá bán gói An Cường
   * @param {number} spec.numWoodBoards - Số tấm phôi ván gỗ tiêu hao
   * @param {number} [spec.numWpbBoards] - Số tấm nhựa WPB (nếu có)
   * @param {boolean} [spec.hasAcrylic] - Có cánh Acrylic Noline hay không
   * @param {number} [spec.fixedAccessoriesValue] - Phụ kiện + công thợ cố định
   * @returns {Object} 3 Cột giá tự động tính toán bảo toàn tuyệt đối túi tiền Giám Đốc
   */
  function calculateStandard3Tiers(spec) {
    var priceAC = Number(spec.priceAnCuong) || 0;
    var numWood = Number(spec.numWoodBoards) || 0;
    var numWpb = Number(spec.numWpbBoards) || 0;
    var hasAcrylic = Boolean(spec.hasAcrylic);

    // Tính mức giảm giá tiền phôi ván gỗ chuyển sang Thái Lan:
    // Chỉ trừ numWood * 380.000 đ
    var woodDiff = numWood * CONSTANTS.DIFF_RAW_BOARD_AC_TL;
    
    // Nếu không có thông số tấm cụ thể, áp dụng tỷ lệ giảm phôi chuẩn:
    if (numWood <= 0) {
      if (numWpb > 0 || hasAcrylic) {
        // Có vật liệu cố định lớn: tỷ lệ chênh chỉ khoảng 4% - 6% trên toàn bộ đơn giá
        woodDiff = Math.round(priceAC * 0.05);
      } else {
        // Gỗ MDF thông thường: chênh 12.5% chuẩn
        woodDiff = Math.round(priceAC * 0.125);
      }
    }

    var priceTL = Math.max(0, priceAC - woodDiff);

    // Cấp Plywood A1: Lấy Thái Lan + chênh lệch cốt ván Plywood A1 (~220k/tấm so với Thái Lan)
    var plywoodDiffFromTL = (numWood > 0 ? numWood : 1) * CONSTANTS.DIFF_RAW_BOARD_PLYWOOD_TL;
    var pricePly = priceTL + plywoodDiffFromTL;

    return {
      priceAnCuong: priceAC,
      priceThaiLan: priceTL,
      pricePlywood: pricePly,
      diffAC_TL: woodDiff,
      discountPercentTL: Number(((woodDiff / priceAC) * 100).toFixed(2)),
      wpbFixedCostNote: numWpb > 0 ? (numWpb + ' tấm WPB x 2.550.000 đ = CỐ ĐỊNH 100%') : 'Không dùng WPB',
      acrylicFixedCostNote: hasAcrylic ? 'Cánh Acrylic Noline = CỐ ĐỊNH 100%' : 'Không dùng Acrylic'
    };
  }

  /**
   * 4. HỆ THỐNG KIỂM TOÁN TOÀN DIỆN DỰ ÁN BÁO GIÁ (AUDIT PROJECT QUOTE)
   * Kiểm tra toàn bộ danh sách hạng mục theo Quy tắc 3 Cấp và Chốt Chặn 54%
   * 
   * @param {Object} projectData
   * @param {string} projectData.projectName - Tên công trình/dự án
   * @param {string} projectData.customerName - Tên khách hàng (VD: Anh Nam)
   * @param {number} projectData.totalCostVatTu - Tổng vật tư bóc tách
   * @param {number} projectData.totalCostCongTho - Tổng công thợ sản xuất & lắp đặt
   * @param {number} projectData.totalRevenue - Doanh thu báo giá
   * @param {Array} projectData.items - Danh sách các hạng mục chi tiết
   * @returns {Object} Báo cáo kiểm toán bảo vệ dòng tiền
   */
  function auditProjectQuote(projectData) {
    var projectName = (projectData && projectData.projectName) || 'Dự án nội thất';
    var customerName = (projectData && projectData.customerName) || 'Khách hàng';
    var items = (projectData && projectData.items) || [];

    // Bước 1: Kiểm định chốt chặn Cost <= 54%
    var costAudit = validateCostCeiling({
      totalCostVatTu: projectData && projectData.totalCostVatTu,
      totalCostCongTho: projectData && projectData.totalCostCongTho,
      totalRevenue: projectData && projectData.totalRevenue
    });

    // Bước 2: Kiểm định từng hạng mục theo quy tắc định giá 3 cấp
    var itemAudits = [];
    var totalIssues = 0;
    var totalWarnings = 0;

    for (var i = 0; i < items.length; i++) {
      var itemResult = validateItem3TiersPricing(items[i]);
      itemAudits.push(itemResult);
      if (!itemResult.isValid) {
        totalIssues += (itemResult.issues ? itemResult.issues.length : 1);
      }
      if (itemResult.warnings && itemResult.warnings.length > 0) {
        totalWarnings += itemResult.warnings.length;
      }
    }

    var overallPass = costAudit.isValid && totalIssues === 0;

    var summaryStatus = 'PASS';
    if (!costAudit.isValid) {
      summaryStatus = 'BLOCKED_BY_COST_CEILING';
    } else if (totalIssues > 0) {
      summaryStatus = 'FLAGGED_3TIERS_VIOLATIONS';
    }

    return {
      status: summaryStatus,
      isApproved: overallPass,
      projectName: projectName,
      customerName: customerName,
      costAudit: costAudit,
      totalItemsChecked: items.length,
      totalIssuesFound: totalIssues,
      totalWarningsFound: totalWarnings,
      itemAudits: itemAudits,
      timestamp: new Date().toISOString()
    };
  }

  // PUBLIC API CỦA MODULE W08
  return {
    CONSTANTS: CONSTANTS,
    validateCostCeiling: validateCostCeiling,
    validateCostCeiling54: validateCostCeiling54,
    getOptimizationSuggestions: getOptimizationSuggestions,
    validateItem3TiersPricing: validateItem3TiersPricing,
    calculateStandard3Tiers: calculateStandard3Tiers,
    auditProjectQuote: auditProjectQuote,
    version: '1.2.0-w08-flash'
  };
}));
