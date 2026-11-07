/**
 * PG HOME LUXURY - CÔNG CỤ ĐO LƯỜNG & KHẤU TRỪ DỰ TOÁN SALE (W09)
 * File: f:\PG Home - Quản trị\web_app\modules\w09_intersection_deduction_tool.js
 * 
 * PHÂN HỆ: Dự Toán Sale & Đo Lường Khối Lượng (Hiệp & Dũng - DU_TOAN_SALE)
 * MỤC TIÊU:
 *  1. Quy tắc đo lường "Trừ Giao Cắt & Khấu Trừ Lỗ Mở" (Mục 24 - Bài học số 3):
 *     - Trừ mảng tường ốp lớn (R06: 15.6 m2) bị đè bởi hệ tủ trang trí (R05: 8.51 m2).
 *     - Trừ hệ tủ áo lớn (R27: 13.82 m2) có khoét lỗ cửa giấu khuôn (R29: 1.61 m2).
 *     - Tự động sinh ghi chú cột Quy Cách chuẩn xác, minh bạch với khách hàng.
 *  2. Phân biệt chiều sâu (R) khi quy đổi từ M2/Md sang số tấm ván CNC (Mục 24 - Bài học số 2):
 *     - R = 17mm: Vách ốp phẳng (0.40 tấm/m2), vách lam/soi huỳnh (0.52 tấm/m2)
 *     - R = 200mm: Hộc tủ trang trí nông (0.50 tấm/m2 ván 17mm + 0.25 tấm/m2 hậu 6mm)
 *     - R = 350mm: Tủ treo / tủ bếp trên (1.04 tấm/md ván 17mm + 0.28 tấm/md hậu 6mm)
 *     - R = 600mm: Tủ áo kịch trần (1.05 tấm/m2 ván 17mm + 0.36 tấm/m2 hậu 6mm, cánh kính trừ 0.40 tấm/m2)
 *                  Tủ bếp dưới (1.45 tấm/md ván 17mm: thùng 1.14 + cánh 0.31)
 *     - R = 700mm: Tủ bếp kịch trần (1.44 tấm/md: thùng 1.15 + cánh 0.29 + hậu 0.27)
 *  3. Giao diện trực quan tích hợp một chạm vào Web App Quản Trị PG Home.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W09 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ==========================================
  // 1. HỆ THỐNG ĐỊNH MỨC VÁN CNC THEO CHIỀU SÂU (R)
  // ==========================================
  const CNC_DEPTH_STANDARDS = {
    R17_FLAT: {
      depthMm: 17,
      name: 'Vách ốp phẳng trang trí (R06, R23, R25, R34, R43)',
      unit: 'm2',
      boardPerUnit: 0.40, // 0.40 tấm ván 17mm / m2 (đã trừ hao hụt ghép vân & xương ~15%)
      backBoardPerUnit: 0.0,
      notes: 'Khổ ván 1220x2440 (~2.98 m2). Thành phẩm ~2.50 m2/tấm sau hao hụt ghép vân.'
    },
    R17_FLUTED: {
      depthMm: 17,
      name: 'Vách ốp Lam / Soi huỳnh CNC (R21, R52)',
      unit: 'm2',
      boardPerUnit: 0.52, // 0.52 tấm ván 17mm / m2
      backBoardPerUnit: 0.0,
      notes: 'Hao hụt rãnh soi huỳnh và nan lam đòi hỏi thêm ~30% phôi ván.'
    },
    R200_SHALLOW: {
      depthMm: 200,
      name: 'Hộc tủ trang trí nông (R05 - Sâu 200 x Cao 1850)',
      unit: 'm2',
      boardPerUnit: 0.50, // 0.50 tấm ván 17mm / m2
      backBoardPerUnit: 0.25, // 0.25 tấm hậu 6mm / m2
      notes: 'Khổ ván 1220mm xẻ được 6 dải sâu 200mm rất lợi ván.'
    },
    R350_WALL_CABINET: {
      depthMm: 350,
      name: 'Tủ bếp trên treo tường (R08 - Sâu 350 x Cao 750)',
      unit: 'md',
      boardPerUnit: 1.04, // Thùng: 0.74 + Cánh: 0.30 = 1.04 tấm/md
      bodyBoard: 0.74,
      doorBoard: 0.30,
      backBoardPerUnit: 0.28,
      notes: 'Sâu 350mm xẻ dọc khổ ván 1220mm được 3 dải 350mm.'
    },
    R600_BASE_KITCHEN: {
      depthMm: 600,
      name: 'Tủ bếp dưới (R09 - Sâu 600 x Cao 860, Thùng cao 740)',
      unit: 'md',
      boardPerUnit: 1.45, // Thùng + Hậu + Cánh = 1.45 tấm/md (Thùng: 1.14 + Cánh: 0.31)
      bodyBoard: 1.14,
      doorBoard: 0.31,
      backBoardPerUnit: 0.0, // Đã gồm trong 1.45
      notes: 'Chuẩn Giám Đốc: 3.77 md x 1.45 = 5.47 tấm. Đã trừ chân nhựa 100mm, nóc rỗng 2 xà 80mm.'
    },
    R600_WARDROBE: {
      depthMm: 600,
      name: 'Tủ quần áo kịch trần (R27, R40, R49 - Sâu 600 x Cao 2700)',
      unit: 'm2',
      boardPerUnit: 1.05, // 1.05 tấm ván 17mm / m2 (Thùng + Đợt + Ngăn kéo + Cánh gỗ)
      backBoardPerUnit: 0.36, // Hậu 6mm: 0.36 tấm / m2
      glassDoorDeductionPerM2: 0.40, // Trừ 0.40 tấm ván 17mm / m2 nếu dùng cánh kính khung nhôm
      notes: 'Bổ đôi chuẩn khổ 1220mm thành 2 dải 600mm. Dùng cánh kính trừ ngay 0.40 tấm/m2.'
    },
    R700_TOP_CABINET: {
      depthMm: 700,
      name: 'Tủ bếp kịch trần (R10 - Sâu 700 x Cao 720)',
      unit: 'md',
      boardPerUnit: 1.44, // Thùng: 1.15 + Cánh: 0.29 = 1.44 tấm/md
      bodyBoard: 1.15,
      doorBoard: 0.29,
      backBoardPerUnit: 0.27,
      notes: 'Sâu 700mm vượt nửa khổ ván 610mm, 1 khổ xẻ 1 dải 700mm + 1 dải 500mm ghép tủ khác.'
    }
  };

  // ==========================================
  // 2. LOGIC TÍNH TOÁN KHẤU TRỪ VÀ TRỪ GIAO CẮT
  // ==========================================

  /**
   * Tính toán khấu trừ giao cắt và lỗ mở cho một hạng mục
   * @param {Object} mainItem - Thông tin hạng mục chính
   *   - code: Mã hiệu (e.g. 'R06', 'R27')
   *   - name: Tên hạng mục
   *   - unit: Đơn vị tính ('m2' hoặc 'md')
   *   - grossQty: Khối lượng phủ bì (Gross Area/Length)
   *   - depthKey: Khóa định mức độ sâu trong CNC_DEPTH_STANDARDS
   *   - unitPrice: Đơn giá dự toán (VNĐ)
   *   - isGlassDoor: Có dùng cánh kính khung nhôm không (với tủ áo)
   *   - glassDoorArea: Diện tích cánh kính (m2)
   * @param {Array<Object>} deductions - Danh sách các mục trừ giao cắt hoặc khoét lỗ
   *   - type: 'OVERLAP' (giao cắt đè lấp) | 'OPENING' (khoét lỗ mở) | 'VOID' (khoang trống)
   *   - refCode: Mã hiệu hạng mục liên quan (e.g. 'R05', 'R29')
   *   - refName: Tên hạng mục liên quan
   *   - area: Diện tích / khối lượng trừ
   *   - reason: Lý do chi tiết (e.g. 'Bị đè bởi hộc tủ R05', 'Khoét lỗ cửa giấu khuôn R29')
   */
  function calculateDeduction(mainItem, deductions = []) {
    const grossQty = Math.max(0, parseFloat(mainItem.grossQty || 0));
    const unit = mainItem.unit || 'm2';
    const unitPrice = parseFloat(mainItem.unitPrice || 0);

    // Tính tổng khấu trừ
    let totalDeductionQty = 0;
    const deductionDetails = [];

    deductions.forEach((d, idx) => {
      const deductionVal = Math.max(0, parseFloat(d.area || 0));
      totalDeductionQty += deductionVal;
      deductionDetails.push({
        index: idx + 1,
        type: d.type || 'OVERLAP',
        refCode: d.refCode || '',
        refName: d.refName || '',
        area: deductionVal,
        reason: d.reason || (d.type === 'OPENING' ? 'Khấu trừ lỗ mở' : 'Trừ giao cắt bị che lấp')
      });
    });

    // Khối lượng thực tính (Net Quantity)
    const netQty = Math.max(0, grossQty - totalDeductionQty);

    // Thành tiền dự toán
    const grossAmount = Math.round(grossQty * unitPrice);
    const netAmount = Math.round(netQty * unitPrice);
    const deductedAmount = grossAmount - netAmount;

    // Tính số tấm ván CNC dự kiến
    const depthStd = CNC_DEPTH_STANDARDS[mainItem.depthKey] || null;
    let cncBoards17mm = 0;
    let cncBackBoards6mm = 0;
    let boardCalculationDetails = '';

    if (depthStd) {
      if (mainItem.depthKey === 'R600_WARDROBE') {
        const baseRate = depthStd.boardPerUnit; // 1.05
        let glassDeduction = 0;
        if (mainItem.isGlassDoor && mainItem.glassDoorArea) {
          const glassArea = Math.min(netQty, parseFloat(mainItem.glassDoorArea || 0));
          glassDeduction = glassArea * depthStd.glassDoorDeductionPerM2; // 0.40 tấm/m2
        }
        cncBoards17mm = Math.max(0, (netQty * baseRate) - glassDeduction);
        cncBackBoards6mm = netQty * depthStd.backBoardPerUnit;
        boardCalculationDetails = `Định mức ${baseRate} tấm/m2 ván 17mm${glassDeduction > 0 ? ` (đã trừ ${glassDeduction.toFixed(2)} tấm do dùng cánh kính)` : ''} + ${depthStd.backBoardPerUnit} tấm/m2 hậu 6mm`;
      } else {
        cncBoards17mm = netQty * (depthStd.boardPerUnit || 0);
        cncBackBoards6mm = netQty * (depthStd.backBoardPerUnit || 0);
        boardCalculationDetails = `Định mức ${depthStd.boardPerUnit} tấm ván 17mm/${depthStd.unit} + ${depthStd.backBoardPerUnit || 0} tấm hậu 6mm/${depthStd.unit}`;
      }
    }

    // Tự động sinh nội dung chuẩn cho cột "Quy Cách" trong bảng dự toán
    const specNotes = generateSpecificationNote(mainItem, grossQty, netQty, deductionDetails);

    return {
      itemCode: mainItem.code || '',
      itemName: mainItem.name || '',
      unit: unit,
      unitPrice: unitPrice,
      grossQty: Number(grossQty.toFixed(2)),
      totalDeductionQty: Number(totalDeductionQty.toFixed(2)),
      netQty: Number(netQty.toFixed(2)),
      grossAmount: grossAmount,
      netAmount: netAmount,
      deductedAmount: deductedAmount,
      deductionDetails: deductionDetails,
      depthStandard: depthStd,
      cncBoards17mm: Number(cncBoards17mm.toFixed(2)),
      cncBackBoards6mm: Number(cncBackBoards6mm.toFixed(2)),
      boardCalculationDetails: boardCalculationDetails,
      specificationNote: specNotes
    };
  }

  /**
   * Sinh chuỗi ghi chú quy cách chuẩn hóa cho Bảng Báo Giá / Dự Toán
   */
  function generateSpecificationNote(mainItem, grossQty, netQty, deductions) {
    if (!deductions || deductions.length === 0) {
      return `Quy cách chuẩn. Khối lượng: ${grossQty.toFixed(2)} ${mainItem.unit}.`;
    }

    const deductionParts = deductions.map(d => {
      const typeStr = d.type === 'OPENING' ? 'lỗ mở' : 'giao cắt đè lấp';
      const refStr = d.refCode ? ` (${d.refCode}${d.refName ? ' - ' + d.refName : ''})` : '';
      return `-${d.area.toFixed(2)} ${mainItem.unit} [${typeStr}${refStr}]`;
    }).join('; ');

    return `Kích thước phủ bì: ${grossQty.toFixed(2)} ${mainItem.unit}. Khấu trừ: ${deductionParts}. Khối lượng thực tính: ${netQty.toFixed(2)} ${mainItem.unit}.`;
  }

  // ==========================================
  // 3. CÁC CA MẪU THỰC CHIẾN (CASE STUDY CHUẨN)
  // ==========================================
  const CASE_STUDIES = {
    // Ca 1: Mảng tường ốp lớn R06 bị đè bởi tủ R05
    CASE_R06_R05: {
      id: 'CASE_R06_R05',
      title: 'Ca 1: Vách ốp phẳng R06 đè bởi Hộc tủ trang trí R05 (Nhà anh Nam)',
      description: 'Mảng tường ốp lớn R06 phủ bì 15.60 m2, có gắn đè hệ hộc tủ trang trí nông R05 rộng 8.51 m2. Khối lượng tính tiền của R06 bắt buộc phải trừ phần giao cắt bị đè lấp.',
      mainItem: {
        code: 'R06',
        name: 'Vách ốp phẳng trang trí tường phòng khách',
        unit: 'm2',
        grossQty: 15.60,
        unitPrice: 1250000,
        depthKey: 'R17_FLAT'
      },
      deductions: [
        {
          type: 'OVERLAP',
          refCode: 'R05',
          refName: 'Hộc tủ trang trí nông sâu 200',
          area: 8.51,
          reason: 'Bị che lấp hoàn toàn bởi hệ hộc tủ R05 treo đè phía trước'
        }
      ]
    },

    // Ca 2: Hệ tủ áo lớn R27 có khoét lỗ cửa giấu khuôn R29
    CASE_R27_R29: {
      id: 'CASE_R27_R29',
      title: 'Ca 2: Tủ áo kịch trần R27 khoét lỗ cửa giấu khuôn R29',
      description: 'Hệ tủ áo master kịch trần R27 phủ bì 13.82 m2, thiết kế cửa thông phòng giấu khuôn R29 xuyên qua tủ (diện tích lỗ mở 1.61 m2). Bắt buộc khấu trừ lỗ mở khỏi khối lượng tủ áo.',
      mainItem: {
        code: 'R27',
        name: 'Tủ quần áo Master kịch trần sâu 600',
        unit: 'm2',
        grossQty: 13.82,
        unitPrice: 2850000,
        depthKey: 'R600_WARDROBE',
        isGlassDoor: false,
        glassDoorArea: 0
      },
      deductions: [
        {
          type: 'OPENING',
          refCode: 'R29',
          refName: 'Cửa thông phòng giấu khuôn',
          area: 1.61,
          reason: 'Khấu trừ khoảng hở lỗ thông phòng xuyên qua hệ tủ áo'
        }
      ]
    },

    // Ca 3: Tủ bếp dưới R09 khoang rỗng chậu rửa & bếp từ (Trừ chân nhựa 100, nóc rỗng)
    CASE_R09_KITCHEN_BASE: {
      id: 'CASE_R09_KITCHEN_BASE',
      title: 'Ca 3: Tủ bếp dưới R09 (3.77 md - Chuẩn Giám Đốc 1.45 tấm/md)',
      description: 'Tủ bếp dưới sâu 600 x cao 860. Chiều dài phủ bì 3.77 md. Chuẩn định mức 1.45 tấm/md = 5.47 tấm ván. Tuyệt đối cấm báo nhầm thành 2.70 tấm/md!',
      mainItem: {
        code: 'R09',
        name: 'Tủ bếp dưới gỗ MDF chống ẩm An Cường (Cánh Acrylic)',
        unit: 'md',
        grossQty: 3.77,
        unitPrice: 3800000,
        depthKey: 'R600_BASE_KITCHEN'
      },
      deductions: []
    },

    // Ca 4: Tủ áo cánh kính R40 (Trừ cánh gỗ 0.40 tấm/m2)
    CASE_R40_GLASS_WARDROBE: {
      id: 'CASE_R40_GLASS_WARDROBE',
      title: 'Ca 4: Tủ áo kịch trần R40 kết hợp Cánh Kính Khung Nhôm (9.50 m2)',
      description: 'Hệ tủ áo 9.50 m2, trong đó có 4.20 m2 khoang cánh kính khung nhôm cao cấp. Phần cánh kính phải trừ 0.40 tấm ván 17mm/m2 để tính đúng số phôi ván thùng đợt.',
      mainItem: {
        code: 'R40',
        name: 'Tủ quần áo phòng ngủ phụ kết hợp cánh kính',
        unit: 'm2',
        grossQty: 9.50,
        unitPrice: 3200000,
        depthKey: 'R600_WARDROBE',
        isGlassDoor: true,
        glassDoorArea: 4.20
      },
      deductions: []
    }
  };

  // ==========================================
  // 4. GIAO DIỆN HTML/CSS TÍCH HỢP WIDGET
  // ==========================================

  function renderHTML(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="pg-w09-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); border: 1px solid #1e293b; max-width: 1100px; margin: 0 auto;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <div style="display: inline-block; background: #d97706; color: #fff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 6px;">
              Quy chuẩn Mục 24 - PG Home Luxury
            </div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #f1f5f9;">
              📐 Công Cụ Đo Lường: "Trừ Giao Cắt & Khấu Trừ Lỗ Mở" Dự Toán Sale
            </h2>
            <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
              Khấu trừ mảng tường ốp đè (R06/R05), lỗ mở cửa giấu khuôn (R27/R29) & phân biệt chiều sâu R=17/200/350/600/700mm
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #cbd5e1; font-weight: 600;">HỘ KINH DOANH PHÚ GIA</div>
            <div style="font-size: 11px; color: #64748b;">Hotline: 0986.722.324 - TP. Hà Tĩnh</div>
          </div>
        </div>

        <!-- Preset Buttons -->
        <div style="margin-bottom: 20px; background: #1e293b; padding: 12px 16px; border-radius: 8px;">
          <div style="font-size: 12px; font-weight: 700; color: #38bdf8; margin-bottom: 8px; text-transform: uppercase;">
            ⚡ Nạp Nhanh Ca Mẫu Thực Chiến (Bài Học Nhà Anh Nam 06/11):
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button id="btnLoadCase1" type="button" style="background: #334155; hover: #475569; color: #f8fafc; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Ca 1: Vách R06 đè bởi Tủ R05 (-8.51m2)
            </button>
            <button id="btnLoadCase2" type="button" style="background: #334155; color: #f8fafc; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Ca 2: Tủ áo R27 khoét lỗ cửa R29 (-1.61m2)
            </button>
            <button id="btnLoadCase3" type="button" style="background: #334155; color: #f8fafc; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Ca 3: Tủ bếp dưới R09 (3.77 md x 1.45 tấm)
            </button>
            <button id="btnLoadCase4" type="button" style="background: #334155; color: #f8fafc; border: 1px solid #475569; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              Ca 4: Tủ áo cánh kính R40 (Trừ cánh gỗ 0.4 tấm)
            </button>
          </div>
        </div>

        <!-- Main Form Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Left Column: Input Form -->
          <div style="background: #1e293b; padding: 18px; border-radius: 8px; border: 1px solid #334155;">
            <h3 style="margin-top: 0; font-size: 15px; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 8px;">
              1. Thông Tin Hạng Mục Chính (Phủ Bì)
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 10px;">
              <div>
                <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">Mã Hiệu</label>
                <input id="inputItemCode" type="text" value="R06" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 13px;" />
              </div>
              <div>
                <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">Tên Hạng Mục</label>
                <input id="inputItemName" type="text" value="Vách ốp phẳng trang trí tường" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 13px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
              <div>
                <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">K/L Phủ Bì (Gross)</label>
                <input id="inputGrossQty" type="number" step="0.01" value="15.60" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #38bdf8; font-weight: bold; padding: 6px 10px; border-radius: 4px; font-size: 13px;" />
              </div>
              <div>
                <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">Đơn Vị Tính</label>
                <select id="selectUnit" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 13px;">
                  <option value="m2">m² (Diện tích)</option>
                  <option value="md">md (Mét dài)</option>
                  <option value="cái">Cái (Bộ)</option>
                </select>
              </div>
              <div>
                <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">Đơn Giá (VNĐ)</label>
                <input id="inputUnitPrice" type="number" step="10000" value="1250000" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 13px;" />
              </div>
            </div>

            <div style="margin-bottom: 12px;">
              <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px;">
                Phân Loại Chiều Sâu (R) & Định Mức Tấm CNC
              </label>
              <select id="selectDepthKey" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #fbbf24; font-weight: 600; padding: 6px 10px; border-radius: 4px; font-size: 12px;">
                <option value="R17_FLAT">R=17mm: Vách ốp phẳng (0.40 tấm/m²)</option>
                <option value="R17_FLUTED">R=17mm: Vách Lam / Huỳnh CNC (0.52 tấm/m²)</option>
                <option value="R200_SHALLOW">R=200mm: Hộc tủ trang trí nông (0.50 tấm 17mm + 0.25 tấm hậu)</option>
                <option value="R350_WALL_CABINET">R=350mm: Tủ bếp trên (1.04 tấm/md + 0.28 tấm hậu)</option>
                <option value="R600_BASE_KITCHEN">R=600mm: Tủ bếp dưới (1.45 tấm/md chuẩn BGĐ)</option>
                <option value="R600_WARDROBE">R=600mm: Tủ áo kịch trần (1.05 tấm/m² + 0.36 tấm hậu)</option>
                <option value="R700_TOP_CABINET">R=700mm: Tủ bếp kịch trần (1.44 tấm/md + 0.27 tấm hậu)</option>
              </select>
            </div>

            <div id="glassOptionsBox" style="display: none; background: #0f172a; padding: 10px; border-radius: 6px; border: 1px dashed #475569; margin-bottom: 12px;">
              <label style="font-size: 12px; color: #f43f5e; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input id="chkIsGlassDoor" type="checkbox" /> Có dùng cánh kính khung nhôm (Trừ 0.40 tấm ván/m²)
              </label>
              <div id="glassAreaInputRow" style="display: none; margin-top: 8px;">
                <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 2px;">Diện tích cánh kính (m²):</label>
                <input id="inputGlassDoorArea" type="number" step="0.01" value="0.00" style="width: 100%; box-sizing: border-box; background: #1e293b; border: 1px solid #475569; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px;" />
              </div>
            </div>

            <!-- Deductions List -->
            <div style="border-top: 1px solid #334155; padding-top: 12px; margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="margin: 0; font-size: 13px; color: #fbbf24;">
                  2. Danh Sách Khấu Trừ Giao Cắt / Lỗ Mở
                </h4>
                <button id="btnAddDeductionRow" type="button" style="background: #0284c7; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                  + Thêm Mục Trừ
                </button>
              </div>

              <div id="deductionsContainer" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
                <!-- Dynamic rows rendered here -->
              </div>
            </div>

            <div style="margin-top: 16px;">
              <button id="btnCalculate" type="button" style="width: 100%; background: #22c55e; color: #0f172a; font-weight: 700; border: none; padding: 10px; border-radius: 6px; font-size: 14px; cursor: pointer; text-transform: uppercase;">
                🚀 Tính Toán Khối Lượng & Định Mức Ngay
              </button>
            </div>
          </div>

          <!-- Right Column: Results & Spec Notes -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Summary KPI Box -->
            <div style="background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155;">
              <h3 style="margin-top: 0; font-size: 14px; color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 12px;">
                📊 Kết Quả Đo Lường Khấu Trừ Thực Tế
              </h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
                <div style="background: #0f172a; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 11px; color: #94a3b8;">K/L Phủ Bì</div>
                  <div id="resGrossQty" style="font-size: 18px; font-weight: 700; color: #e2e8f0;">15.60 m²</div>
                </div>
                <div style="background: #451a03; border: 1px solid #b45309; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 11px; color: #fde68a;">Tổng Trừ Đi</div>
                  <div id="resDeductionQty" style="font-size: 18px; font-weight: 700; color: #f87171;">-8.51 m²</div>
                </div>
                <div style="background: #064e3b; border: 1px solid #059669; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 11px; color: #a7f3d0;">K/L Tính Tiền (Net)</div>
                  <div id="resNetQty" style="font-size: 18px; font-weight: 800; color: #34d399;">7.09 m²</div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; text-align: center;">
                <div style="background: #0f172a; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 11px; color: #94a3b8;">Thành Tiền Phủ Bì</div>
                  <div id="resGrossAmount" style="font-size: 14px; color: #cbd5e1;">19.500.000 đ</div>
                </div>
                <div style="background: #0f172a; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 11px; color: #34d399; font-weight: 600;">Thành Tiền Báo Khách</div>
                  <div id="resNetAmount" style="font-size: 15px; font-weight: 800; color: #38bdf8;">8.862.500 đ</div>
                </div>
              </div>
            </div>

            <!-- CNC Board Norms Box -->
            <div style="background: #1e293b; padding: 14px; border-radius: 8px; border: 1px solid #334155;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #fbbf24;">
                🪵 Định Mức Tấm Cắt CNC Dự Kiến (Khổ 1220×2440):
              </h4>
              <div style="display: flex; gap: 12px; align-items: center;">
                <div style="background: #0f172a; padding: 6px 12px; border-radius: 4px; border-left: 3px solid #f59e0b;">
                  <span style="font-size: 11px; color: #94a3b8;">Ván 17mm: </span>
                  <span id="resBoards17mm" style="font-size: 15px; font-weight: 700; color: #fbbf24;">2.84 tấm</span>
                </div>
                <div style="background: #0f172a; padding: 6px 12px; border-radius: 4px; border-left: 3px solid #38bdf8;">
                  <span style="font-size: 11px; color: #94a3b8;">Hậu 6mm: </span>
                  <span id="resBoards6mm" style="font-size: 15px; font-weight: 700; color: #38bdf8;">0.00 tấm</span>
                </div>
              </div>
              <div id="resBoardDetails" style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
                Định mức 0.40 tấm/m2 ván 17mm
              </div>
            </div>

            <!-- Specification Note Box (Quy Cách) -->
            <div style="background: #1e293b; padding: 14px; border-radius: 8px; border: 1px solid #334155; flex-grow: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <h4 style="margin: 0; font-size: 13px; color: #a78bfa;">
                  📝 Chuỗi Ghi Chú Cột "Quy Cách" (Copy dán sang Dự Toán):
                </h4>
                <button id="btnCopySpec" type="button" style="background: #4f46e5; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                  📋 Sao Chép
                </button>
              </div>
              <textarea id="textSpecNote" readonly style="width: 100%; height: 75px; box-sizing: border-box; background: #0f172a; border: 1px solid #475569; color: #e2e8f0; font-size: 12px; line-height: 1.4; padding: 8px; border-radius: 4px; resize: none;"></textarea>
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    loadCase(CASE_STUDIES.CASE_R06_R05);
  }

  // Quản lý danh sách các dòng khấu trừ trong UI
  let currentDeductions = [];

  function renderDeductionRows() {
    const container = document.getElementById('deductionsContainer');
    if (!container) return;

    if (currentDeductions.length === 0) {
      container.innerHTML = `<div style="font-size: 11px; color: #64748b; font-style: italic; padding: 6px;">Chưa có mục trừ giao cắt nào. Bấm '+ Thêm Mục Trừ' nếu có phần bị che lấp hoặc lỗ mở.</div>`;
      return;
    }

    container.innerHTML = currentDeductions.map((d, idx) => `
      <div style="display: grid; grid-template-columns: 80px 1.2fr 80px 30px; gap: 6px; align-items: center; background: #0f172a; padding: 6px; border-radius: 4px; border: 1px solid #334155;">
        <div>
          <select class="deduct-type" data-idx="${idx}" style="width: 100%; background: #1e293b; color: #fbbf24; border: 1px solid #475569; font-size: 11px; padding: 3px; border-radius: 3px;">
            <option value="OVERLAP" ${d.type === 'OVERLAP' ? 'selected' : ''}>Đè lấp</option>
            <option value="OPENING" ${d.type === 'OPENING' ? 'selected' : ''}>Lỗ mở</option>
            <option value="VOID" ${d.type === 'VOID' ? 'selected' : ''}>Rỗng</option>
          </select>
        </div>
        <div>
          <input type="text" class="deduct-ref" data-idx="${idx}" value="${d.refCode || ''} ${d.refName || ''}" placeholder="Mã/Tên (vd: R05, R29)" style="width: 100%; box-sizing: border-box; background: #1e293b; color: #fff; border: 1px solid #475569; font-size: 11px; padding: 3px 6px; border-radius: 3px;" />
        </div>
        <div>
          <input type="number" step="0.01" class="deduct-area" data-idx="${idx}" value="${d.area || 0}" placeholder="Trừ" style="width: 100%; box-sizing: border-box; background: #1e293b; color: #f87171; font-weight: bold; border: 1px solid #475569; font-size: 11px; padding: 3px 6px; border-radius: 3px;" />
        </div>
        <div>
          <button type="button" class="btn-remove-deduct" data-idx="${idx}" style="background: #ef4444; color: #fff; border: none; width: 24px; height: 24px; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: bold;">×</button>
        </div>
      </div>
    `).join('');

    // Bind inputs
    container.querySelectorAll('.deduct-type').forEach(el => {
      el.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        currentDeductions[idx].type = e.target.value;
      });
    });
    container.querySelectorAll('.deduct-ref').forEach(el => {
      el.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        currentDeductions[idx].refCode = e.target.value;
      });
    });
    container.querySelectorAll('.deduct-area').forEach(el => {
      el.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        currentDeductions[idx].area = parseFloat(e.target.value || 0);
      });
    });
    container.querySelectorAll('.btn-remove-deduct').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        currentDeductions.splice(idx, 1);
        renderDeductionRows();
      });
    });
  }

  function loadCase(caseData) {
    if (!caseData) return;
    const m = caseData.mainItem;
    document.getElementById('inputItemCode').value = m.code || '';
    document.getElementById('inputItemName').value = m.name || '';
    document.getElementById('inputGrossQty').value = m.grossQty || 0;
    document.getElementById('selectUnit').value = m.unit || 'm2';
    document.getElementById('inputUnitPrice').value = m.unitPrice || 0;
    document.getElementById('selectDepthKey').value = m.depthKey || 'R17_FLAT';

    const chkGlass = document.getElementById('chkIsGlassDoor');
    chkGlass.checked = !!m.isGlassDoor;
    document.getElementById('inputGlassDoorArea').value = m.glassDoorArea || 0;

    toggleGlassVisibility();

    currentDeductions = JSON.parse(JSON.stringify(caseData.deductions || []));
    renderDeductionRows();
    triggerCalculation();
  }

  function toggleGlassVisibility() {
    const depthKey = document.getElementById('selectDepthKey').value;
    const glassBox = document.getElementById('glassOptionsBox');
    const glassRow = document.getElementById('glassAreaInputRow');
    const chkGlass = document.getElementById('chkIsGlassDoor');

    if (depthKey === 'R600_WARDROBE') {
      glassBox.style.display = 'block';
      glassRow.style.display = chkGlass.checked ? 'block' : 'none';
    } else {
      glassBox.style.display = 'none';
    }
  }

  function triggerCalculation() {
    const mainItem = {
      code: document.getElementById('inputItemCode').value.trim(),
      name: document.getElementById('inputItemName').value.trim(),
      grossQty: parseFloat(document.getElementById('inputGrossQty').value || 0),
      unit: document.getElementById('selectUnit').value,
      unitPrice: parseFloat(document.getElementById('inputUnitPrice').value || 0),
      depthKey: document.getElementById('selectDepthKey').value,
      isGlassDoor: document.getElementById('chkIsGlassDoor').checked,
      glassDoorArea: parseFloat(document.getElementById('inputGlassDoorArea').value || 0)
    };

    const result = calculateDeduction(mainItem, currentDeductions);

    // Render results
    const fmtMoney = (val) => new Intl.NumberFormat('vi-VN').format(val) + ' đ';
    document.getElementById('resGrossQty').innerText = `${result.grossQty.toFixed(2)} ${result.unit}`;
    document.getElementById('resDeductionQty').innerText = `-${result.totalDeductionQty.toFixed(2)} ${result.unit}`;
    document.getElementById('resNetQty').innerText = `${result.netQty.toFixed(2)} ${result.unit}`;
    
    document.getElementById('resGrossAmount').innerText = fmtMoney(result.grossAmount);
    document.getElementById('resNetAmount').innerText = fmtMoney(result.netAmount);

    document.getElementById('resBoards17mm').innerText = `${result.cncBoards17mm.toFixed(2)} tấm`;
    document.getElementById('resBoards6mm').innerText = `${result.cncBackBoards6mm.toFixed(2)} tấm`;
    document.getElementById('resBoardDetails').innerText = result.boardCalculationDetails;

    document.getElementById('textSpecNote').value = result.specificationNote;
  }

  function bindEvents() {
    document.getElementById('selectDepthKey').addEventListener('change', () => {
      toggleGlassVisibility();
      triggerCalculation();
    });

    document.getElementById('chkIsGlassDoor').addEventListener('change', () => {
      toggleGlassVisibility();
      triggerCalculation();
    });

    document.getElementById('btnCalculate').addEventListener('click', triggerCalculation);

    document.getElementById('btnAddDeductionRow').addEventListener('click', () => {
      currentDeductions.push({
        type: 'OVERLAP',
        refCode: '',
        refName: '',
        area: 0,
        reason: 'Trừ giao cắt'
      });
      renderDeductionRows();
    });

    document.getElementById('btnCopySpec').addEventListener('click', () => {
      const textarea = document.getElementById('textSpecNote');
      textarea.select();
      document.execCommand('copy');
      alert('Đã sao chép chuỗi Quy Cách vào Clipboard!');
    });

    // Preset loaders
    document.getElementById('btnLoadCase1').addEventListener('click', () => loadCase(CASE_STUDIES.CASE_R06_R05));
    document.getElementById('btnLoadCase2').addEventListener('click', () => loadCase(CASE_STUDIES.CASE_R27_R29));
    document.getElementById('btnLoadCase3').addEventListener('click', () => loadCase(CASE_STUDIES.CASE_R09_KITCHEN_BASE));
    document.getElementById('btnLoadCase4').addEventListener('click', () => loadCase(CASE_STUDIES.CASE_R40_GLASS_WARDROBE));
  }

  // ==========================================
  // 5. BỘ KIỂM TOÁN TỰ ĐỘNG (ZERO-TRUST TESTS)
  // ==========================================
  function runTests() {
    const results = [];

    // Test 1: Ca mảng tường R06 đè bởi R05
    const case1 = CASE_STUDIES.CASE_R06_R05;
    const res1 = calculateDeduction(case1.mainItem, case1.deductions);
    const pass1 = Math.abs(res1.netQty - 7.09) < 0.001 &&
                  Math.abs(res1.cncBoards17mm - (7.09 * 0.40)) < 0.01;
    results.push({
      testName: 'Test 1: Vách ốp R06 trừ R05 (15.60 - 8.51 = 7.09 m2)',
      passed: pass1,
      expected: '7.09 m2 Net, 2.84 tấm CNC 17mm',
      actual: `${res1.netQty} m2 Net, ${res1.cncBoards17mm} tấm CNC 17mm`
    });

    // Test 2: Ca tủ áo R27 khoét lỗ cửa giấu khuôn R29
    const case2 = CASE_STUDIES.CASE_R27_R29;
    const res2 = calculateDeduction(case2.mainItem, case2.deductions);
    const pass2 = Math.abs(res2.netQty - 12.21) < 0.001 &&
                  Math.abs(res2.cncBoards17mm - (12.21 * 1.05)) < 0.01;
    results.push({
      testName: 'Test 2: Tủ áo R27 trừ cửa R29 (13.82 - 1.61 = 12.21 m2)',
      passed: pass2,
      expected: '12.21 m2 Net, 12.82 tấm CNC 17mm',
      actual: `${res2.netQty} m2 Net, ${res2.cncBoards17mm} tấm CNC 17mm`
    });

    // Test 3: Ca tủ bếp dưới R09 (3.77 md x 1.45 tấm/md)
    const case3 = CASE_STUDIES.CASE_R09_KITCHEN_BASE;
    const res3 = calculateDeduction(case3.mainItem, case3.deductions);
    const pass3 = Math.abs(res3.cncBoards17mm - 5.47) < 0.01;
    results.push({
      testName: 'Test 3: Tủ bếp dưới R09 (3.77 md x 1.45 tấm = 5.47 tấm)',
      passed: pass3,
      expected: '5.47 tấm ván CNC 17mm',
      actual: `${res3.cncBoards17mm} tấm CNC 17mm`
    });

    // Test 4: Ca tủ áo cánh kính trừ 0.40 tấm/m2 cánh kính
    const case4 = CASE_STUDIES.CASE_R40_GLASS_WARDROBE;
    const res4 = calculateDeduction(case4.mainItem, case4.deductions);
    // 9.50 * 1.05 - 4.20 * 0.40 = 9.975 - 1.68 = 8.295 ≈ 8.30 tấm
    const expectedBoards = 9.50 * 1.05 - 4.20 * 0.40;
    const pass4 = Math.abs(res4.cncBoards17mm - expectedBoards) < 0.01;
    results.push({
      testName: 'Test 4: Tủ áo cánh kính R40 khấu trừ cánh gỗ (9.50 x 1.05 - 4.20 x 0.40 = 8.30 tấm)',
      passed: pass4,
      expected: `${expectedBoards.toFixed(2)} tấm CNC 17mm`,
      actual: `${res4.cncBoards17mm} tấm CNC 17mm`
    });

    const allPassed = results.every(r => r.passed);
    return {
      allPassed: allPassed,
      results: results
    };
  }

  // ==========================================
  // PUBLIC API EXPORT
  // ==========================================
  return {
    version: '1.0.0',
    moduleName: 'PG_Modules_W09',
    author: 'PG Home Luxury - Công nhân Flash W09',
    standards: CNC_DEPTH_STANDARDS,
    caseStudies: CASE_STUDIES,
    calculateDeduction: calculateDeduction,
    generateSpecificationNote: generateSpecificationNote,
    renderHTML: renderHTML,
    runTests: runTests
  };
});
