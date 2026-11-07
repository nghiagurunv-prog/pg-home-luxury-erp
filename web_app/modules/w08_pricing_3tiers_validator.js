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
    root.PG_Modules_W08 = factory();
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
    validateItem3TiersPricing: validateItem3TiersPricing,
    calculateStandard3Tiers: calculateStandard3Tiers,
    auditProjectQuote: auditProjectQuote,
    version: '1.0.0-w08-flash'
  };
}));
