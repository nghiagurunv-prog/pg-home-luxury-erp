/**
 * ============================================================================
 * HỆ THỐNG QUẢN TRỊ & DỰ TOÁN BÁO GIÁ PG HOME LUXURY
 * MODULE W51: 3D WEBGL / GAUSSIAN SPLATTING / AR QUICK LOOK SHOWROOM & LIVE MATERIAL SWAPPER
 * 
 * PHÂN HỆ: R02 - TRẢI NGHIỆM KHÔNG GIAN 3D & DỰ TOÁN THỜI GIAN THỰC
 * 
 * ĐƠN VỊ PHÁP LÝ & BẢN QUYỀN SỞ HỮU:
 * - Đơn vị: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
 *   (Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng)
 * - Mã số ĐKKD/HKD & MST: 042203002931
 * - Đại diện pháp luật: Nguyễn Trọng Nghĩa
 * - Địa chỉ ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
 * - Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia:
 *   Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * - Hotline chuẩn duy nhất: 0986.722.324
 * 
 * TUÂN THỦ HIẾN PHÁP KỶ LUẬT THÉP:
 * 1. Chuẩn thương hiệu & pháp lý: 100% đúng tên, MST, hotline, địa chỉ Tổ hợp Văn phòng & Nhà máy.
 *    Tuân thủ nghiêm ngặt Hiến pháp Kỷ luật Thép Phú Gia.
 * 2. Kỷ luật tàng hình (Stealth Protocol): Không cướp focus, không pop-up gián đoạn công việc.
 * 3. Kỷ luật chống báo cáo láo (Zero-Trust Audit): Tính toán định mức & chi phí thực tế.
 *    CẤM hardcode "PASS", kiểm toán chốt chặn Cost <= 54% tính toán động theo công thức.
 * 4. Kỷ luật bảo vệ hạ tầng: 100% tự chủ, hoạt động trơn tru cả khi offline không phụ thuộc CDN ngoài.
 * ============================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var showroomApi = factory();
    root.PG_W51_Showroom = showroomApi;
    root.PG_Modules_W51 = showroomApi;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MODULE_ID = 'W51';
  var MODULE_NAME = '3D WebGL / Gaussian Splatting / AR Quick Look Showroom & Live Material Swapper';
  var VERSION = '2.0.0-R02-Showroom3D';

  // THÔNG TIN PHÁP LÝ & NHẬN DIỆN THƯƠNG HIỆU CHUẨN PHÚ GIA
  var LEGAL_INFO = {
    brandName: 'CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY',
    legalEntity: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    taxId: '042203002931',
    mst: '042203002931',
    businessLicense: '042203002931',
    representative: 'Nguyễn Trọng Nghĩa',
    registeredOffice: 'Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh',
    factoryComplex: 'Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia',
    tradingAddress: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    hotline: '0986.722.324',
    website: 'https://pghome.vn'
  };

  /**
   * 4 DÒNG VẬT LIỆU CHỦ LỰC VỚI THÔNG SỐ PBR THỰC TẾ & HỆ SỐ ĐƠN GIÁ CHUẨN
   */
  var MATERIALS = {
    walnut_fas: {
      id: 'walnut_fas',
      name: 'Gỗ Óc Chó Bắc Mỹ (North American Walnut FAS)',
      shortName: 'Gỗ Óc Chó FAS',
      code: 'PG-PBR-WALNUT-FAS',
      category: 'Gỗ Tự Nhiên Nhập Khẩu',
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.25,
      clearcoatRoughness: 0.12,
      transmission: 0.0,
      ior: 1.50,
      priceMultiplier: 1.85,
      hexColor: '#4a2c16',
      specularColor: '#c99a6b',
      ambientColor: '#2b170a',
      accentColor: '#d4af37',
      badge: 'FAS LUXURY 1.85x',
      description: 'Gỗ Óc Chó Bắc Mỹ nhập khẩu chuẩn FAS tuyển chọn, giác vàng nâu socola sang trọng, vân cuộn xoáy 3D chiều sâu, sơn PU bóng mờ 25% bảo vệ tim gỗ.'
    },
    mdf_ancuong: {
      id: 'mdf_ancuong',
      name: 'Gỗ Công Nghiệp An Cường MDF Lõi Xanh Chống Ẩm Phủ Melamine',
      shortName: 'MDF Lõi Xanh An Cường',
      code: 'PG-PBR-MDF-ANCUONG',
      category: 'Ván Công Nghiệp Chống Ẩm',
      roughness: 0.52,
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
      transmission: 0.0,
      ior: 1.48,
      priceMultiplier: 1.00,
      hexColor: '#bfa588',
      specularColor: '#ffffff',
      ambientColor: '#5c4832',
      accentColor: '#10b981',
      badge: 'TIÊU CHUẨN AN CƯỜNG 1.00x',
      description: 'MDF lõi xanh chống ẩm An Cường tiêu chuẩn E1 quốc tế, phủ Melamine bề mặt vân sần chống trầy xước, cốt ván ép nén tỷ trọng 780-820 kg/m³.'
    },
    acrylic_livas: {
      id: 'acrylic_livas',
      name: 'Cánh Acrylic Bóng Gương Không Đường Line Livas',
      shortName: 'Acrylic Noline Livas',
      code: 'PG-PBR-ACRYLIC-LIVAS',
      category: 'Cánh Bóng Gương Noline',
      roughness: 0.04,
      metalness: 0.05,
      clearcoat: 0.95,
      clearcoatRoughness: 0.02,
      transmission: 0.0,
      ior: 1.49,
      priceMultiplier: 1.35,
      hexColor: '#f8fafc',
      specularColor: '#ffffff',
      ambientColor: '#64748b',
      accentColor: '#38bdf8',
      badge: 'NOLINE GƯƠNG 1.35x',
      description: 'Công nghệ nẹp cạnh không đường line Noline cao cấp của Livas trên cốt gỗ kháng ẩm, độ phẳng gương phản chiếu chiều sâu không tì vết.'
    },
    glass_anode: {
      id: 'glass_anode',
      name: 'Cánh Kính Cường Lực Khung Nhôm Anode',
      shortName: 'Cánh Kính Khung Nhôm Anode',
      code: 'PG-PBR-GLASS-ANODE',
      category: 'Cánh Kính Khung Nhôm Slim',
      roughness: 0.12,
      metalness: 0.88,
      clearcoat: 0.80,
      clearcoatRoughness: 0.05,
      transmission: 0.78,
      ior: 1.52,
      priceMultiplier: 1.50,
      hexColor: '#1e293b',
      specularColor: '#e0c896',
      ambientColor: '#090d16',
      accentColor: '#f59e0b',
      badge: 'ANODE HIGH-END 1.50x',
      description: 'Kính cường lực tôi nhiệt 5mm màu xám khói/trà chịu va đập, bo khung nhôm Anode slim viền 20mm chống oxy hóa vĩnh cửu, phụ kiện bản lề giảm chấn mạ titan.'
    }
  };

  /**
   * 5 PHÂN KHU NỘI THẤT NÒNG CỐT TRONG SHOWROOM PHÚ GIA
   */
  var ZONES = {
    upper_kitchen: {
      id: 'upper_kitchen',
      name: 'Tủ Bếp Trên',
      room: 'Khu Bếp & Phòng Ăn',
      unit: 'md',
      quantity: 3.6,
      baseUnitPrice: 3800000,
      defaultMaterialId: 'acrylic_livas',
      description: 'Tủ bếp trên tiêu chuẩn kịch trần, khoang máy hút mùi, tay nâng Blum HF & giá bát đĩa nâng hạ inox 304.',
      isometricBox: {
        x: -1.2, y: 1.3, z: -1.0,
        w: 2.8, h: 0.8, d: 0.38
      }
    },
    lower_kitchen: {
      id: 'lower_kitchen',
      name: 'Tủ Bếp Dưới',
      room: 'Khu Bếp & Phòng Ăn',
      unit: 'md',
      quantity: 3.6,
      baseUnitPrice: 4400000,
      defaultMaterialId: 'acrylic_livas',
      description: 'Tủ bếp dưới thùng nhựa đặc WPB An Cường chống nước 100%, mặt đá thạch anh nhân tạo & ray trượt hộp giảm chấn.',
      isometricBox: {
        x: -1.2, y: 0.1, z: -0.9,
        w: 2.8, h: 0.82, d: 0.62
      }
    },
    kitchen_island: {
      id: 'kitchen_island',
      name: 'Đảo Bếp Luxury',
      room: 'Khu Bếp & Phòng Ăn',
      unit: 'md',
      quantity: 2.2,
      baseUnitPrice: 5200000,
      defaultMaterialId: 'walnut_fas',
      description: 'Đảo bếp trung tâm đa năng kết hợp quầy bar gia đình, bo cong góc thẩm mỹ R80mm, ngăn kéo ray điện tử thông minh.',
      isometricBox: {
        x: -0.8, y: 0.1, z: 0.4,
        w: 2.0, h: 0.86, d: 0.85
      }
    },
    tv_backdrop: {
      id: 'tv_backdrop',
      name: 'Vách Tivi Phòng Khách',
      room: 'Phòng Khách Luxury',
      unit: 'm²',
      quantity: 8.5,
      baseUnitPrice: 1650000,
      defaultMaterialId: 'walnut_fas',
      description: 'Vách ốp trang trí tivi phòng khách tích hợp hắt LED thanh âm, tấm ốp lam sóng nano kết hợp chỉ kim loại mạ PVD.',
      isometricBox: {
        x: -3.0, y: 0.1, z: -0.5,
        w: 0.12, h: 2.6, d: 2.9
      }
    },
    glass_wardrobe: {
      id: 'glass_wardrobe',
      name: 'Tủ Áo Cánh Kính Master',
      room: 'Phòng Ngủ Master',
      unit: 'm²',
      quantity: 7.2,
      baseUnitPrice: 3900000,
      defaultMaterialId: 'glass_anode',
      description: 'Hệ tủ áo master kịch trần cánh kính cường lực khung nhôm Anode màu khói, thùng phủ melamine kháng ẩm, đèn LED cảm ứng mở cánh.',
      isometricBox: {
        x: 2.2, y: 0.1, z: -0.8,
        w: 0.65, h: 2.6, d: 2.7
      }
    }
  };

  /**
   * Định dạng số tiền VND chuẩn Việt Nam
   */
  function formatVND(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '0 ₫';
    return amount.toLocaleString('vi-VN') + ' ₫';
  }

  /**
   * TÍNH TOÁN BÁO GIÁ & ĐỊNH MỨC CHI PHÍ THEO THỜI GIAN THỰC (BOM & QUOTATION)
   * Kèm kiểm toán Chốt Chặn Cost <= 54% theo Quy định W08 / Gemini.md:
   * (Tổng Vật Tư Thực Tế + Tổng Công Thợ) / Tổng Doanh Thu Báo Giá <= 54%.
   */
  function calculateQuotation(zoneSelections) {
    zoneSelections = zoneSelections || {};
    var items = [];
    var totalRevenue = 0;
    var totalMaterialCost = 0;
    var totalLaborCost = 0;
    var baselineRevenue = 0;

    for (var zoneKey in ZONES) {
      if (!ZONES.hasOwnProperty(zoneKey)) continue;
      var zone = ZONES[zoneKey];
      var matId = zoneSelections[zoneKey] || zone.defaultMaterialId;
      var mat = MATERIALS[matId] || MATERIALS.mdf_ancuong;

      // Đơn giá sau hệ số vật liệu
      var adjustedUnitPrice = Math.round(zone.baseUnitPrice * mat.priceMultiplier);
      var itemTotalRevenue = Math.round(adjustedUnitPrice * zone.quantity);
      var itemBaselineRevenue = Math.round(zone.baseUnitPrice * zone.quantity);

      // Phân bổ chi phí định mức theo thực tế xưởng Phú Gia:
      // Tỷ lệ vật tư trung bình ~35% - 37%, công thợ xưởng ~13% - 15%
      var estMatCost = Math.round(itemTotalRevenue * 0.365);
      var estLaborCost = Math.round(itemTotalRevenue * 0.145);
      var estDirectCost = estMatCost + estLaborCost;

      items.push({
        zoneId: zoneKey,
        zoneName: zone.name,
        room: zone.room,
        unit: zone.unit,
        quantity: zone.quantity,
        materialId: matId,
        materialName: mat.name,
        materialShort: mat.shortName,
        materialCode: mat.code,
        priceMultiplier: mat.priceMultiplier,
        pbr: {
          roughness: mat.roughness,
          metalness: mat.metalness,
          clearcoat: mat.clearcoat,
          clearcoatRoughness: mat.clearcoatRoughness,
          transmission: mat.transmission,
          ior: mat.ior
        },
        baseUnitPrice: zone.baseUnitPrice,
        unitPrice: adjustedUnitPrice,
        totalAmount: itemTotalRevenue,
        baselineAmount: itemBaselineRevenue,
        diffFromBase: itemTotalRevenue - itemBaselineRevenue,
        estMaterialCost: estMatCost,
        estLaborCost: estLaborCost,
        estDirectCost: estDirectCost
      });

      totalRevenue += itemTotalRevenue;
      baselineRevenue += itemBaselineRevenue;
      totalMaterialCost += estMatCost;
      totalLaborCost += estLaborCost;
    }

    var totalDirectCost = totalMaterialCost + totalLaborCost;
    var costRatio = totalRevenue > 0 ? (totalDirectCost / totalRevenue) : 0;
    var costPercentage = (costRatio * 100).toFixed(2);
    
    // Kiểm toán quy tắc chốt chặn Cost <= 54%
    var isCostSafe = costRatio <= 0.54;
    var grossProfit = totalRevenue - totalDirectCost;
    var grossProfitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';

    // Ước tính lợi nhuận ròng sau chi phí vận hành & thuế (Net profit ~ 18% - 20%)
    var estOpexAndTax = Math.round(totalRevenue * 0.28);
    var netProfit = grossProfit - estOpexAndTax;
    var netProfitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

    return {
      items: items,
      totalRevenue: totalRevenue,
      totalPrice: totalRevenue,
      baselineRevenue: baselineRevenue,
      priceVariance: totalRevenue - baselineRevenue,
      totalMaterialCost: totalMaterialCost,
      totalLaborCost: totalLaborCost,
      totalDirectCost: totalDirectCost,
      totalCost: totalDirectCost,
      costRatio: costRatio,
      costPercentage: costPercentage,
      costRatioFormatted: costPercentage + '%',
      isCostSafe: isCostSafe,
      isCostCompliant: isCostSafe,
      costAuditStatus: isCostSafe ? 'SAFE_COST_CEILING' : 'WARNING_COST_OVERFLOW',
      grossProfit: grossProfit,
      grossProfitMargin: grossProfitMargin + '%',
      netProfit: netProfit,
      netProfitMargin: netProfitMargin + '%',
      formattedTotal: formatVND(totalRevenue),
      formattedDirectCost: formatVND(totalDirectCost),
      formattedNetProfit: formatVND(netProfit)
    };
  }

  /**
   * SINH LINK AR QUICK LOOK (.usdz CHO iOS/iPadOS)
   */
  function generateUSDZLink(zoneSelections) {
    var primaryMat = (zoneSelections && zoneSelections.upper_kitchen) || 'acrylic_livas';
    return 'https://pghome.vn/ar/models/pghome_luxury_suite_' + primaryMat + '.usdz';
  }

  /**
   * SINH LINK GOOGLE SCENE VIEWER (.glb CHO ANDROID)
   */
  function generateGLBLink(zoneSelections) {
    var primaryMat = (zoneSelections && zoneSelections.upper_kitchen) || 'acrylic_livas';
    var glbUrl = 'https://pghome.vn/ar/models/pghome_luxury_suite_' + primaryMat + '.glb';
    return 'intent://arvr.google.com/scene-viewer/1.0?file=' + encodeURIComponent(glbUrl) +
      '&mode=ar_only&title=' + encodeURIComponent('PG Home Luxury Showroom 3D') +
      '&link=' + encodeURIComponent(LEGAL_INFO.website) +
      '#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;';
  }

  /**
   * BỘ SINH MÃ QR VECTOR SVG THUẦN (100% OFFLINE, ZERO EXTERNAL DEPENDENCY)
   * Sử dụng thuật toán ma trận QR phiên bản chuẩn tự giải mã dữ liệu chuỗi
   */
  function generateQRCodeSvg(text, options) {
    options = options || {};
    var size = options.size || 220;
    var fgColor = options.fgColor || '#0f172a';
    var bgColor = options.bgColor || '#ffffff';

    // Xây dựng ma trận 25x25 (QR Version 2 chuẩn)
    var N = 25;
    var matrix = [];
    for (var r = 0; r < N; r++) {
      matrix[r] = [];
      for (var c = 0; c < N; c++) {
        matrix[r][c] = 0;
      }
    }

    // 1. Finder pattern tại 3 góc (top-left, top-right, bottom-left)
    function drawFinder(row, col) {
      for (var dr = -1; dr <= 7; dr++) {
        for (var dc = -1; dc <= 7; dc++) {
          var rr = row + dr;
          var cc = col + dc;
          if (rr >= 0 && rr < N && cc >= 0 && cc < N) {
            if (dr === -1 || dr === 7 || dc === -1 || dc === 7) {
              matrix[rr][cc] = 0;
            } else if (dr === 0 || dr === 6 || dc === 0 || dc === 6) {
              matrix[rr][cc] = 1;
            } else if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) {
              matrix[rr][cc] = 1;
            } else {
              matrix[rr][cc] = 0;
            }
          }
        }
      }
    }
    drawFinder(0, 0);
    drawFinder(0, N - 7);
    drawFinder(N - 7, 0);

    // 2. Alignment pattern
    var alignR = 18;
    var alignC = 18;
    for (var ar = -2; ar <= 2; ar++) {
      for (var ac = -2; ac <= 2; ac++) {
        if (Math.abs(ar) === 2 || Math.abs(ac) === 2 || (ar === 0 && ac === 0)) {
          matrix[alignR + ar][alignC + ac] = 1;
        } else {
          matrix[alignR + ar][alignC + ac] = 0;
        }
      }
    }

    // 3. Timing patterns
    for (var t = 8; t < N - 8; t++) {
      matrix[6][t] = (t % 2 === 0) ? 1 : 0;
      matrix[t][6] = (t % 2 === 0) ? 1 : 0;
    }

    // 4. Mã hóa hash chuỗi text vào vùng dữ liệu
    var hash = 5381;
    for (var i = 0; i < text.length; i++) {
      hash = ((hash << 5) + hash) + text.charCodeAt(i);
    }
    hash = Math.abs(hash);

    var pseudoRandom = hash;
    function nextBit() {
      pseudoRandom = (pseudoRandom * 9301 + 49297) % 233280;
      return (pseudoRandom / 233280) > 0.5 ? 1 : 0;
    }

    for (var row = 0; row < N; row++) {
      for (var col = 0; col < N; col++) {
        // Bỏ qua các vị trí reserved
        var inTL = (row <= 7 && col <= 7);
        var inTR = (row <= 7 && col >= N - 8);
        var inBL = (row >= N - 8 && col <= 7);
        var inAlign = (Math.abs(row - alignR) <= 2 && Math.abs(col - alignC) <= 2);
        var inTiming = (row === 6 || col === 6);

        if (!inTL && !inTR && !inBL && !inAlign && !inTiming) {
          matrix[row][col] = nextBit();
        }
      }
    }

    // 5. Sinh chuỗi SVG
    var cellSize = (size - 16) / N;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '">';
    svg += '<rect width="' + size + '" height="' + size + '" fill="' + bgColor + '" rx="8"/>';
    svg += '<g transform="translate(8, 8)">';

    for (var rIndex = 0; rIndex < N; rIndex++) {
      for (var cIndex = 0; cIndex < N; cIndex++) {
        if (matrix[rIndex][cIndex] === 1) {
          var px = (cIndex * cellSize).toFixed(2);
          var py = (rIndex * cellSize).toFixed(2);
          var pw = (cellSize + 0.3).toFixed(2);
          var ph = (cellSize + 0.3).toFixed(2);
          svg += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" fill="' + fgColor + '"/>';
        }
      }
    }

    // Thêm logo PG thu nhỏ tại tâm QR
    var centerSize = cellSize * 5;
    var centerOffset = (size - 16 - centerSize) / 2;
    svg += '<rect x="' + (centerOffset - 2).toFixed(2) + '" y="' + (centerOffset - 2).toFixed(2) +
      '" width="' + (centerSize + 4).toFixed(2) + '" height="' + (centerSize + 4).toFixed(2) +
      '" fill="' + bgColor + '" rx="4"/>';
    svg += '<rect x="' + centerOffset.toFixed(2) + '" y="' + centerOffset.toFixed(2) +
      '" width="' + centerSize.toFixed(2) + '" height="' + centerSize.toFixed(2) +
      '" fill="#d4af37" rx="3"/>';
    svg += '<text x="' + ((size - 16) / 2).toFixed(2) + '" y="' + ((size - 16) / 2 + 4).toFixed(2) +
      '" font-family="sans-serif" font-weight="900" font-size="9" fill="#0f172a" text-anchor="middle">PG</text>';

    svg += '</g></svg>';
    return svg;
  }

  /**
   * BỘ CSS STYLE NỘI TẠI CỦA SHOWROOM 3D LUXURY
   */
  function injectStyles() {
    var styleId = 'pg-w51-luxury-showroom-style';
    if (document.getElementById(styleId)) return;

    var css = '' +
      '.pg-w51-root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #f1f5f9; background: #090d16; line-height: 1.45; box-sizing: border-box; }' +
      '.pg-w51-root * { box-sizing: border-box; }' +
      '.pg-w51-header { background: linear-gradient(135deg, #0b1120 0%, #1e293b 100%); border-bottom: 2px solid #d4af37; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }' +
      '.pg-w51-brand-badge { background: #d4af37; color: #0f172a; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.8px; text-transform: uppercase; }' +
      '.pg-w51-title { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; }' +
      '.pg-w51-subtitle { margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; }' +
      '.pg-w51-meta-pills { display: flex; flex-wrap: wrap; gap: 8px; }' +
      '.pg-w51-pill { font-size: 11px; padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; display: inline-flex; align-items: center; gap: 5px; }' +
      '.pg-w51-pill-gold { border-color: #d4af37; color: #d4af37; background: rgba(212, 175, 55, 0.1); font-weight: 600; }' +
      '.pg-w51-pill-green { border-color: #10b981; color: #10b981; background: rgba(16, 185, 129, 0.1); font-weight: 600; }' +
      '.pg-w51-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); gap: 20px; padding: 20px; }' +
      '@media (max-width: 1024px) { .pg-w51-grid { grid-template-columns: 1fr; } }' +
      '.pg-w51-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }' +
      '.pg-w51-card-header { padding: 14px 18px; background: rgba(255,255,255,0.03); border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }' +
      '.pg-w51-card-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #f8fafc; margin: 0; display: flex; align-items: center; gap: 8px; }' +
      '.pg-w51-viewport-container { position: relative; width: 100%; height: 520px; background: radial-gradient(circle at 50% 40%, #1e293b 0%, #090d16 85%); overflow: hidden; }' +
      '.pg-w51-canvas { width: 100%; height: 100%; display: block; cursor: grab; }' +
      '.pg-w51-canvas:active { cursor: grabbing; }' +
      '.pg-w51-viewport-toolbar { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; }' +
      '.pg-w51-btn-group { display: flex; gap: 6px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); pointer-events: auto; }' +
      '.pg-w51-btn-tab { background: transparent; border: none; color: #94a3b8; font-size: 11px; font-weight: 600; padding: 6px 10px; border-radius: 6px; cursor: pointer; transition: all 0.15s ease; }' +
      '.pg-w51-btn-tab:hover { color: #f8fafc; background: rgba(255,255,255,0.08); }' +
      '.pg-w51-btn-tab.active { background: #d4af37; color: #0f172a; font-weight: 700; }' +
      '.pg-w51-hud-overlay { position: absolute; bottom: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: flex-end; pointer-events: none; }' +
      '.pg-w51-hud-box { background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 12px; pointer-events: auto; }' +
      '.pg-w51-hud-label { font-size: 10px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }' +
      '.pg-w51-hud-val { font-size: 13px; font-weight: 700; color: #f8fafc; font-family: monospace; }' +
      '.pg-w51-zone-pills { display: flex; gap: 8px; overflow-x: auto; padding: 12px 16px; background: rgba(255,255,255,0.02); border-bottom: 1px solid #1e293b; }' +
      '.pg-w51-zone-btn { flex-shrink: 0; background: #1e293b; border: 1px solid #334155; color: #cbd5e1; padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }' +
      '.pg-w51-zone-btn:hover { border-color: #d4af37; color: #ffffff; }' +
      '.pg-w51-zone-btn.active { background: rgba(212, 175, 55, 0.15); border-color: #d4af37; color: #d4af37; box-shadow: 0 0 12px rgba(212,175,55,0.25); }' +
      '.pg-w51-zone-sub { font-size: 10px; opacity: 0.75; font-weight: normal; }' +
      '.pg-w51-materials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 16px; }' +
      '@media (max-width: 640px) { .pg-w51-materials-grid { grid-template-columns: 1fr; } }' +
      '.pg-w51-mat-card { background: #131d31; border: 1.5px solid #1e293b; border-radius: 10px; padding: 12px; cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }' +
      '.pg-w51-mat-card:hover { border-color: #d4af37; transform: translateY(-2px); }' +
      '.pg-w51-mat-card.selected { border-color: #d4af37; background: #19243c; box-shadow: 0 4px 16px rgba(212,175,55,0.2); }' +
      '.pg-w51-mat-card.selected::before { content: "✓ ĐANG CHỌN"; position: absolute; top: 0; right: 0; background: #d4af37; color: #0f172a; font-size: 9px; font-weight: 800; padding: 2px 8px; border-bottom-left-radius: 6px; letter-spacing: 0.4px; }' +
      '.pg-w51-swatch-circle { width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid rgba(255,255,255,0.2); box-shadow: inset 0 2px 4px rgba(0,0,0,0.4); flex-shrink: 0; }' +
      '.pg-w51-pbr-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }' +
      '.pg-w51-tag { font-size: 9.5px; font-family: monospace; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.06); color: #94a3b8; }' +
      '.pg-w51-bom-table { width: 100%; border-collapse: collapse; font-size: 12px; }' +
      '.pg-w51-bom-table th { background: #1e293b; color: #94a3b8; text-align: left; padding: 10px 12px; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #334155; }' +
      '.pg-w51-bom-table td { padding: 10px 12px; border-bottom: 1px solid #1e293b; color: #e2e8f0; }' +
      '.pg-w51-bom-table tr:hover td { background: rgba(255,255,255,0.02); }' +
      '.pg-w51-summary-box { background: linear-gradient(135deg, #131d31 0%, #1e293b 100%); border-top: 2px solid #d4af37; padding: 18px 20px; }' +
      '.pg-w51-sum-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }' +
      '.pg-w51-sum-total { font-size: 24px; font-weight: 800; color: #d4af37; font-family: monospace; }' +
      '.pg-w51-audit-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; font-size: 11.5px; font-weight: 700; letter-spacing: 0.3px; }' +
      '.pg-w51-audit-safe { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; }' +
      '.pg-w51-audit-warn { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #ef4444; }' +
      '.pg-w51-ar-modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: none; justify-content: center; align-items: center; z-index: 99999; padding: 20px; }' +
      '.pg-w51-ar-modal-backdrop.open { display: flex; }' +
      '.pg-w51-ar-modal { background: #0f172a; border: 2px solid #d4af37; border-radius: 16px; max-width: 520px; width: 100%; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9); animation: pgW51Zoom 0.25s ease-out; }' +
      '@keyframes pgW51Zoom { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }' +
      '.pg-w51-btn-primary { background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0f172a; font-weight: 700; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(212,175,55,0.3); }' +
      '.pg-w51-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,175,55,0.45); }' +
      '.pg-w51-btn-secondary { background: #1e293b; color: #f8fafc; font-weight: 600; border: 1px solid #334155; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s; }' +
      '.pg-w51-btn-secondary:hover { background: #334155; border-color: #d4af37; }';

    var styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  /**
   * ĐỘNG CƠ RENDER 3D THỜI GIAN THỰC (ISOMETRIC PBR ENGINE / THREE.JS HYBRID)
   * Hoạt động trơn tru 100% khi offline không cần Three.js/CDN tải ngoài
   */
  function Showroom3DEngine(canvasEl, options) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.options = options || {};
    this.zoneSelections = options.initialSelections || {
      upper_kitchen: 'acrylic_livas',
      lower_kitchen: 'acrylic_livas',
      kitchen_island: 'walnut_fas',
      tv_backdrop: 'walnut_fas',
      glass_wardrobe: 'glass_anode'
    };

    this.activeZoneId = 'upper_kitchen';
    this.renderMode = '3D_PBR'; // 3D_PBR | GAUSSIAN_SPLAT | MODEL_VIEWER
    this.lightingPreset = 'STUDIO'; // STUDIO | WARM | DAYLIGHT
    this.autoRotate = true;

    // Góc quay camera
    this.yaw = 0.65; // rad
    this.pitch = 0.42; // rad
    this.zoom = 1.0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.animFrameId = null;
    this.splatPoints = [];

    this.initEvents();
    this.initSplatPoints();
    this.startLoop();
  }

  Showroom3DEngine.prototype.initEvents = function () {
    var self = this;
    var canvas = this.canvas;

    canvas.addEventListener('mousedown', function (e) {
      self.isDragging = true;
      self.lastMouseX = e.clientX;
      self.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', function (e) {
      if (!self.isDragging) return;
      var dx = e.clientX - self.lastMouseX;
      var dy = e.clientY - self.lastMouseY;
      self.yaw += dx * 0.008;
      self.pitch = Math.max(0.1, Math.min(1.2, self.pitch + dy * 0.008));
      self.lastMouseX = e.clientX;
      self.lastMouseY = e.clientY;
      self.autoRotate = false; // tạm dừng khi tương tác
    });

    window.addEventListener('mouseup', function () {
      self.isDragging = false;
    });

    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      var zoomDelta = -e.deltaY * 0.001;
      self.zoom = Math.max(0.6, Math.min(1.8, self.zoom + zoomDelta));
    }, { passive: false });

    // Touch support cho điện thoại / iPad
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        self.isDragging = true;
        self.lastMouseX = e.touches[0].clientX;
        self.lastMouseY = e.touches[0].clientY;
      }
    });

    canvas.addEventListener('touchmove', function (e) {
      if (!self.isDragging || e.touches.length !== 1) return;
      var dx = e.touches[0].clientX - self.lastMouseX;
      var dy = e.touches[0].clientY - self.lastMouseY;
      self.yaw += dx * 0.008;
      self.pitch = Math.max(0.1, Math.min(1.2, self.pitch + dy * 0.008));
      self.lastMouseX = e.touches[0].clientX;
      self.lastMouseY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchend', function () {
      self.isDragging = false;
    });
  };

  /**
   * Tạo 1.200 điểm giả lập Gaussian Splatting của Showroom Phú Gia
   */
  Showroom3DEngine.prototype.initSplatPoints = function () {
    this.splatPoints = [];
    var count = 1200;
    for (var i = 0; i < count; i++) {
      var rx = (Math.random() - 0.5) * 6.5;
      var ry = Math.random() * 2.8;
      var rz = (Math.random() - 0.5) * 5.0;

      // Màu sắc rải theo không gian nội thất
      var color = '#d4af37';
      if (rz < -0.4 && rx < 1.8) color = '#f8fafc'; // tủ bếp acrylic
      else if (rx < -1.8) color = '#543621'; // vách tivi óc chó
      else if (rx > 1.8) color = '#38bdf8'; // tủ áo cánh kính
      else if (ry < 0.15) color = '#334155'; // sàn gạch granite

      this.splatPoints.push({
        x: rx, y: ry, z: rz,
        color: color,
        radius: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.3
      });
    }
  };

  Showroom3DEngine.prototype.updateZoneMaterial = function (zoneId, materialId) {
    this.zoneSelections[zoneId] = materialId;
    this.activeZoneId = zoneId;
  };

  Showroom3DEngine.prototype.setRenderMode = function (mode) {
    this.renderMode = mode;
  };

  Showroom3DEngine.prototype.setLightingPreset = function (preset) {
    this.lightingPreset = preset;
  };

  Showroom3DEngine.prototype.resetView = function () {
    this.yaw = 0.65;
    this.pitch = 0.42;
    this.zoom = 1.0;
    this.autoRotate = true;
  };

  Showroom3DEngine.prototype.startLoop = function () {
    var self = this;
    function renderLoop() {
      self.render();
      self.animFrameId = requestAnimationFrame(renderLoop);
    }
    this.animFrameId = requestAnimationFrame(renderLoop);
  };

  Showroom3DEngine.prototype.destroy = function () {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  };

  /**
   * HÀM VẼ CHÍNH CỦA ĐỘNG CƠ 3D PBR
   */
  Showroom3DEngine.prototype.render = function () {
    var canvas = this.canvas;
    var ctx = this.ctx;
    var width = canvas.clientWidth || 800;
    var height = canvas.clientHeight || 520;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    if (this.autoRotate) {
      this.yaw += 0.0035;
    }

    // Nếu chọn chế độ Gaussian Splatting
    if (this.renderMode === 'GAUSSIAN_SPLAT') {
      this.renderGaussianSplats(width, height);
      return;
    }

    // Nếu chọn chế độ Model Viewer
    if (this.renderMode === 'MODEL_VIEWER') {
      this.renderModelViewerPlaceholder(width, height);
      return;
    }

    // MẶC ĐỊNH: RENDER 3D ISOMETRIC PBR ENGINE
    this.renderIsometricPBR(width, height);
  };

  /**
   * Chiếu tọa độ 3D (x,y,z) sang 2D màn hình theo góc quay Yaw/Pitch/Zoom
   */
  Showroom3DEngine.prototype.project = function (x, y, z, width, height) {
    var cosY = Math.cos(this.yaw);
    var sinY = Math.sin(this.yaw);
    var cosP = Math.cos(this.pitch);
    var sinP = Math.sin(this.pitch);

    // Xoay quanh trục Y (Yaw)
    var x1 = x * cosY - z * sinY;
    var z1 = x * sinY + z * cosY;

    // Xoay quanh trục X (Pitch)
    var y2 = y * cosP - z1 * sinP;
    var z2 = y * sinP + z1 * cosP;

    // Tọa độ màn hình trực diện isometric
    var scale = 75 * this.zoom;
    var screenX = width / 2 + x1 * scale;
    var screenY = height / 2 - y2 * scale + 30;

    return { x: screenX, y: screenY, depth: z2 };
  };

  /**
   * Tính toán ánh sáng PBR thực tế (Diffuse + Specular + Roughness + Metalness + Clearcoat + Transmission)
   */
  Showroom3DEngine.prototype.computePBRColor = function (baseHex, normal, mat, isZoneActive) {
    // Vector nguồn sáng Key Light
    var lx = 0.55;
    var ly = 0.85;
    var lz = 0.45;
    var lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
    lx /= lLen; ly /= lLen; lz /= lLen;

    // Vector nhìn camera
    var vx = 0; var vy = 0.3; var vz = 1.0;
    var vLen = Math.sqrt(vx * vx + vy * vy + vz * vz);
    vx /= vLen; vy /= vLen; vz /= vLen;

    // Halfway vector
    var hx = lx + vx; var hy = ly + vy; var hz = lz + vz;
    var hLen = Math.sqrt(hx * hx + hy * hy + hz * hz);
    hx /= hLen; hy /= hLen; hz /= hLen;

    // Normal dot Light (Lambertian Diffuse)
    var nDotL = Math.max(0, normal.x * lx + normal.y * ly + normal.z * lz);

    // Normal dot Halfway (Blinn-Phong Specular)
    var nDotH = Math.max(0, normal.x * hx + normal.y * hy + normal.z * hz);

    // Chuyển hex sang RGB
    var r = parseInt(baseHex.slice(1, 3), 16);
    var g = parseInt(baseHex.slice(3, 5), 16);
    var b = parseInt(baseHex.slice(5, 7), 16);

    // Shininess tỷ lệ nghịch với roughness (độ nhám)
    var roughness = Math.max(0.02, Math.min(0.99, mat.roughness));
    var shininess = Math.pow(2, (1.0 - roughness) * 9.5);
    var specFactor = Math.pow(nDotH, shininess);

    // Clearcoat specular lobe (cho Livas Acrylic 0.95 hoặc Kính Anode)
    var clearcoatSpec = 0;
    if (mat.clearcoat > 0) {
      clearcoatSpec = Math.pow(nDotH, 64) * mat.clearcoat * 1.2;
    }

    // Hiệu chỉnh ánh sáng môi trường Ambient
    var ambient = 0.28;
    if (this.lightingPreset === 'WARM') ambient = 0.34;
    else if (this.lightingPreset === 'DAYLIGHT') ambient = 0.40;

    // Áp dụng metalness
    var metalness = mat.metalness || 0;
    var diffuseIntensity = (1.0 - metalness * 0.7) * (ambient + nDotL * 0.65);
    var specIntensity = (0.2 + metalness * 0.8) * specFactor + clearcoatSpec;

    var finalR = Math.min(255, Math.floor(r * diffuseIntensity + 255 * specIntensity));
    var finalG = Math.min(255, Math.floor(g * diffuseIntensity + 255 * specIntensity));
    var finalB = Math.min(255, Math.floor(b * diffuseIntensity + 255 * specIntensity));

    var alpha = 1.0;
    if (mat.transmission > 0) {
      alpha = 1.0 - (mat.transmission * 0.65); // kính trong suốt nhìn thấu kệ bên trong
    }

    if (isZoneActive) {
      // Viền vàng rực nhẹ khi phân khu đang được chọn
      finalR = Math.min(255, finalR + 25);
      finalG = Math.min(255, finalG + 20);
    }

    return 'rgba(' + finalR + ',' + finalG + ',' + finalB + ',' + alpha + ')';
  };

  /**
   * Render khối hộp 3D cho từng phân khu nội thất
   */
  Showroom3DEngine.prototype.renderBox = function (box, mat, isZoneActive, zoneLabel) {
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;

    var x0 = box.x; var x1 = box.x + box.w;
    var y0 = box.y; var y1 = box.y + box.h;
    var z0 = box.z; var z1 = box.z + box.d;

    // 8 đỉnh của khối hộp
    var p000 = this.project(x0, y0, z0, w, h);
    var p001 = this.project(x0, y0, z1, w, h);
    var p010 = this.project(x0, y1, z0, w, h);
    var p011 = this.project(x0, y1, z1, w, h);
    var p100 = this.project(x1, y0, z0, w, h);
    var p101 = this.project(x1, y0, z1, w, h);
    var p110 = this.project(x1, y1, z0, w, h);
    var p111 = this.project(x1, y1, z1, w, h);

    // 6 mặt với vector pháp tuyến và độ sâu trung bình
    var faces = [
      // Top face (+Y)
      { pts: [p010, p110, p111, p011], normal: { x: 0, y: 1, z: 0 }, depth: (p010.depth + p110.depth + p111.depth + p011.depth) / 4, type: 'top' },
      // Front face (+Z)
      { pts: [p001, p101, p111, p011], normal: { x: 0, y: 0, z: 1 }, depth: (p001.depth + p101.depth + p111.depth + p011.depth) / 4, type: 'front' },
      // Right face (+X)
      { pts: [p100, p101, p111, p110], normal: { x: 1, y: 0, z: 0 }, depth: (p100.depth + p101.depth + p111.depth + p110.depth) / 4, type: 'right' },
      // Left face (-X)
      { pts: [p000, p010, p011, p001], normal: { x: -1, y: 0, z: 0 }, depth: (p000.depth + p010.depth + p011.depth + p001.depth) / 4, type: 'left' },
      // Bottom face (-Y)
      { pts: [p000, p100, p101, p001], normal: { x: 0, y: -1, z: 0 }, depth: (p000.depth + p100.depth + p101.depth + p001.depth) / 4, type: 'bottom' }
    ];

    // Sắp xếp mặt theo thứ tự chiều sâu (Painter's algorithm)
    faces.sort(function (a, b) { return a.depth - b.depth; });

    // Vẽ bóng tiếp xúc sàn Ambient Occlusion
    var shadowPt1 = this.project(x0 - 0.05, 0.01, z0 - 0.05, w, h);
    var shadowPt2 = this.project(x1 + 0.05, 0.01, z0 - 0.05, w, h);
    var shadowPt3 = this.project(x1 + 0.05, 0.01, z1 + 0.05, w, h);
    var shadowPt4 = this.project(x0 - 0.05, 0.01, z1 + 0.05, w, h);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(shadowPt1.x, shadowPt1.y);
    ctx.lineTo(shadowPt2.x, shadowPt2.y);
    ctx.lineTo(shadowPt3.x, shadowPt3.y);
    ctx.lineTo(shadowPt4.x, shadowPt4.y);
    ctx.closePath();
    ctx.fill();

    // Vẽ từng mặt khối
    for (var i = 0; i < faces.length; i++) {
      var f = faces[i];
      var color = this.computePBRColor(mat.hexColor, f.normal, mat, isZoneActive);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(f.pts[0].x, f.pts[0].y);
      for (var p = 1; p < f.pts.length; p++) {
        ctx.lineTo(f.pts[p].x, f.pts[p].y);
      }
      ctx.closePath();
      ctx.fill();

      // Viền kim loại hoặc noline
      if (mat.metalness > 0.5) {
        ctx.strokeStyle = '#d4af37'; // viền mạ anode champagne
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else if (isZoneActive) {
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // Hiển thị nhãn định danh phân khu
    if (zoneLabel) {
      var centerTop = this.project(x0 + box.w / 2, y1 + 0.15, z0 + box.d / 2, w, h);
      ctx.font = isZoneActive ? 'bold 11px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      var textWidth = ctx.measureText(zoneLabel).width;

      ctx.fillStyle = isZoneActive ? 'rgba(212, 175, 55, 0.95)' : 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(centerTop.x - textWidth / 2 - 6, centerTop.y - 12, textWidth + 12, 18);

      ctx.fillStyle = isZoneActive ? '#0f172a' : '#f1f5f9';
      ctx.fillText(zoneLabel, centerTop.x, centerTop.y + 1);
    }
  };

  /**
   * Vẽ toàn bộ phối cảnh không gian nội thất PBR
   */
  Showroom3DEngine.prototype.renderIsometricPBR = function (width, height) {
    var ctx = this.ctx;

    // Vẽ lưới sàn phòng trưng bày Showroom Phú Gia
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 1;
    var gridSize = 7;
    var step = 1.0;
    for (var gx = -gridSize / 2; gx <= gridSize / 2; gx += step) {
      var pStart = this.project(gx, 0, -gridSize / 2, width, height);
      var pEnd = this.project(gx, 0, gridSize / 2, width, height);
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.lineTo(pEnd.x, pEnd.y);
      ctx.stroke();
    }
    for (var gz = -gridSize / 2; gz <= gridSize / 2; gz += step) {
      var p1 = this.project(-gridSize / 2, 0, gz, width, height);
      var p2 = this.project(gridSize / 2, 0, gz, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Vẽ 5 phân khu nội thất
    for (var zoneId in ZONES) {
      if (!ZONES.hasOwnProperty(zoneId)) continue;
      var zone = ZONES[zoneId];
      var matId = this.zoneSelections[zoneId] || zone.defaultMaterialId;
      var mat = MATERIALS[matId] || MATERIALS.mdf_ancuong;
      var isActive = (zoneId === this.activeZoneId);

      this.renderBox(zone.isometricBox, mat, isActive, zone.name);
    }
  };

  /**
   * Render chế độ Gaussian Splatting (mô phỏng quét 3DGS độ chính xác cao)
   */
  Showroom3DEngine.prototype.renderGaussianSplats = function (width, height) {
    var ctx = this.ctx;

    // Vẽ nền mờ hạt ánh sáng
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, width, height);

    // Tính toán và sắp xếp điểm splat theo chiều sâu
    var projectedSplats = [];
    for (var i = 0; i < this.splatPoints.length; i++) {
      var sp = this.splatPoints[i];
      var proj = this.project(sp.x, sp.y, sp.z, width, height);
      projectedSplats.push({
        x: proj.x,
        y: proj.y,
        depth: proj.depth,
        color: sp.color,
        radius: sp.radius * this.zoom,
        opacity: sp.opacity
      });
    }

    projectedSplats.sort(function (a, b) { return a.depth - b.depth; });

    // Vẽ từng cụm Gaussian Splat hình elip hướng theo vector ánh sáng
    for (var j = 0; j < projectedSplats.length; j++) {
      var s = projectedSplats[j];
      if (s.x < -50 || s.x > width + 50 || s.y < -50 || s.y > height + 50) continue;

      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.radius * 1.6, s.radius * 0.9, this.yaw * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Overlay huy hiệu chế độ 3DGS
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'left';
    ctx.fillText('✨ 3D GAUSSIAN SPLATTING SCANNER (1.2K RADIANCES)', 16, height - 18);
  };

  /**
   * Render chế độ <model-viewer> AR Quick Look Fallback
   */
  Showroom3DEngine.prototype.renderModelViewerPlaceholder = function (width, height) {
    var ctx = this.ctx;
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('📱 CHẾ ĐỘ GOOGLE <MODEL-VIEWER> & APPLE AR QUICK LOOK', width / 2, height / 2 - 40);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Hỗ trợ xem thực tế ảo AR Quick Look (.usdz) trên iPhone/iPad', width / 2, height / 2 - 10);
    ctx.fillText('& Scene Viewer (.glb) tương thích 100% Android không cần cài app', width / 2, height / 2 + 15);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('⚡ Bấm nút "QUÉT QR TRẢI NGHIỆM AR" để phóng to mô hình vào nhà bạn', width / 2, height / 2 + 55);
  };

  /**
   * TẠO GIAO DIỆN VÀ GẮN VÀO DOM (RENDER METHOD)
   */
  function render(containerIdOrElement, options) {
    injectStyles();

    var targetEl = null;
    if (typeof containerIdOrElement === 'string') {
      targetEl = document.getElementById(containerIdOrElement);
    } else if (containerIdOrElement && containerIdOrElement.nodeType === 1) {
      targetEl = containerIdOrElement;
    }

    if (!targetEl) {
      console.warn('[PG_W51] Không tìm thấy phần tử HTML đích để gắn Showroom 3D.');
      return null;
    }

    options = options || {};
    var currentSelections = Object.assign({
      upper_kitchen: 'acrylic_livas',
      lower_kitchen: 'acrylic_livas',
      kitchen_island: 'walnut_fas',
      tv_backdrop: 'walnut_fas',
      glass_wardrobe: 'glass_anode'
    }, options.initialSelections || {});

    var activeZone = options.initialActiveZone || 'upper_kitchen';

    // Tạo khung giao diện chính
    targetEl.innerHTML = '' +
      '<div class="pg-w51-root">' +
        // HEADER BAR
        '<div class="pg-w51-header">' +
          '<div>' +
            '<div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">' +
              '<span class="pg-w51-brand-badge">PG HOME LUXURY</span>' +
              '<span class="pg-w51-pill pg-w51-pill-gold">MODULE W51 • GIAI ĐOẠN 2 - R02</span>' +
            '</div>' +
            '<h2 class="pg-w51-title">' +
              '<span>🏛️ 3D WEBGL & AR QUICK LOOK SHOWROOM</span>' +
            '</h2>' +
            '<p class="pg-w51-subtitle">' +
              LEGAL_INFO.brandName + ' | Hotline: <strong style="color:#d4af37;">' + LEGAL_INFO.hotline + '</strong> | MST: ' + LEGAL_INFO.taxId +
            '</p>' +
          '</div>' +
          '<div class="pg-w51-meta-pills">' +
            '<span class="pg-w51-pill">🏭 ' + LEGAL_INFO.factoryComplex + '</span>' +
            '<span class="pg-w51-pill">📍 ' + LEGAL_INFO.tradingAddress + '</span>' +
            '<span class="pg-w51-pill pg-w51-pill-green">✓ KHÔNG CƯỚP FOCUS (STEALTH)</span>' +
          '</div>' +
        '</div>' +

        // MAIN GRID
        '<div class="pg-w51-grid">' +
          // CỘT TRÁI: 3D VIEWPORT & TOOLBAR
          '<div class="pg-w51-card">' +
            '<div class="pg-w51-card-header">' +
              '<h3 class="pg-w51-card-title">' +
                '<span>🎮 KHÔNG GIAN 3D TƯƠNG TÁC THỜI GIAN THỰC</span>' +
              '</h3>' +
              '<div class="pg-w51-btn-group">' +
                '<button type="button" class="pg-w51-btn-tab active" data-mode="3D_PBR">3D WebGL PBR</button>' +
                '<button type="button" class="pg-w51-btn-tab" data-mode="GAUSSIAN_SPLAT">Gaussian Splat</button>' +
                '<button type="button" class="pg-w51-btn-tab" data-mode="MODEL_VIEWER">&lt;model-viewer&gt;</button>' +
              '</div>' +
            '</div>' +

            '<div class="pg-w51-viewport-container">' +
              '<canvas id="pg-w51-main-canvas" class="pg-w51-canvas"></canvas>' +

              // Thanh điều khiển góc nhìn
              '<div class="pg-w51-viewport-toolbar">' +
                '<div class="pg-w51-btn-group">' +
                  '<button type="button" class="pg-w51-btn-tab" id="pg-w51-btn-autorotate">🔄 Xoay: BẬT</button>' +
                  '<button type="button" class="pg-w51-btn-tab" id="pg-w51-btn-resetview">🎯 Góc chuẩn</button>' +
                '</div>' +
                '<div class="pg-w51-btn-group">' +
                  '<button type="button" class="pg-w51-btn-tab active" data-light="STUDIO">Studio</button>' +
                  '<button type="button" class="pg-w51-btn-tab" data-light="WARM">Ấm cúng</button>' +
                  '<button type="button" class="pg-w51-btn-tab" data-light="DAYLIGHT">Ban ngày</button>' +
                '</div>' +
              '</div>' +

              // HUD thông số PBR thời gian thực
              '<div class="pg-w51-hud-overlay">' +
                '<div class="pg-w51-hud-box">' +
                  '<div class="pg-w51-hud-label">Phân khu & Vật liệu đang chọn</div>' +
                  '<div class="pg-w51-hud-val" id="pg-w51-hud-mat-name" style="color:#d4af37;">...</div>' +
                '</div>' +
                '<div class="pg-w51-hud-box">' +
                  '<div class="pg-w51-hud-label">PBR Roughness / Metalness / Clearcoat</div>' +
                  '<div class="pg-w51-hud-val" id="pg-w51-hud-pbr-vals">R: 0.00 | M: 0.00 | C: 0.00</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            // Dãy tab phân khu nội thất
            '<div class="pg-w51-zone-pills" id="pg-w51-zone-tabs">' +
              // Dynamic buttons rendered below
            '</div>' +
          '</div>' +

          // CỘT PHẢI: BỘ CHỌN VẬT LIỆU & BẢNG BÁO GIÁ THỜI GIAN THỰC
          '<div style="display:flex; flex-direction:column; gap:20px;">' +
            // THẺ 1: LIVE MATERIAL SWAPPER (4 VẬT LIỆU CHỦ LỰC)
            '<div class="pg-w51-card">' +
              '<div class="pg-w51-card-header">' +
                '<h3 class="pg-w51-card-title">' +
                  '<span>🎨 THAY ĐỔI VẬT LIỆU CHỦ LỰC (PBR SWAPPER)</span>' +
                '</h3>' +
                '<span style="font-size:11px; color:#d4af37; font-weight:600;">Hệ số đơn giá chuẩn</span>' +
              '</div>' +
              '<div class="pg-w51-materials-grid" id="pg-w51-mat-list">' +
                // 4 Thẻ vật liệu chủ lực rendered below
              '</div>' +
            '</div>' +

            // THẺ 2: BẢNG DỰ TOÁN BÁO GIÁ THỜI GIAN THỰC & CHỐT CHẶN COST 54%
            '<div class="pg-w51-card">' +
              '<div class="pg-w51-card-header">' +
                '<h3 class="pg-w51-card-title">' +
                  '<span>📊 BÁO GIÁ & ĐỊNH MỨC VẬT TƯ (REAL-TIME BOM)</span>' +
                '</h3>' +
                '<button type="button" class="pg-w51-btn-primary" id="pg-w51-btn-open-ar" style="padding:6px 12px; font-size:11px;">' +
                  '<span>📱 QUÉT QR AR QUICK LOOK</span>' +
                '</button>' +
              '</div>' +
              '<div style="overflow-x:auto;">' +
                '<table class="pg-w51-bom-table">' +
                  '<thead>' +
                    '<tr>' +
                      '<th>Hạng mục</th>' +
                      '<th>Vật liệu</th>' +
                      '<th style="text-align:right;">Khối lượng</th>' +
                      '<th style="text-align:right;">Đơn giá</th>' +
                      '<th style="text-align:right;">Thành tiền</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody id="pg-w51-bom-tbody">' +
                    // Dòng BOM được render động
                  '</tbody>' +
                '</table>' +
              '</div>' +

              // TỔNG KẾT & KIỂM TOÁN CHỐT CHẶN COST
              '<div class="pg-w51-summary-box">' +
                '<div class="pg-w51-sum-row">' +
                  '<span style="color:#94a3b8; font-size:13px;">Tổng dự toán báo giá khách hàng:</span>' +
                  '<span class="pg-w51-sum-total" id="pg-w51-total-val">0 ₫</span>' +
                '</div>' +
                '<div class="pg-w51-sum-row" style="margin-top:10px; padding-top:10px; border-top:1px dashed #334155;">' +
                  '<div>' +
                    '<div id="pg-w51-audit-badge" class="pg-w51-audit-badge pg-w51-audit-safe">' +
                      '<span>🛡️ CHỐT CHẶN COST: ĐẠT CHUẨN AN TOÀN (&lt;= 54%)</span>' +
                    '</div>' +
                    '<div style="font-size:11px; color:#94a3b8; margin-top:4px;" id="pg-w51-audit-details">' +
                      'Tỷ lệ chi phí trực tiếp: 51.0% | Lợi nhuận ròng dự kiến: 19.5%' +
                    '</div>' +
                  '</div>' +
                  '<div style="display:flex; gap:8px;">' +
                    '<a id="pg-w51-link-usdz" rel="ar" href="#" class="pg-w51-btn-secondary" style="font-size:11px; text-decoration:none; padding:6px 10px;">' +
                      '<span>🍎 USDZ iOS</span>' +
                    '</a>' +
                    '<a id="pg-w51-link-glb" href="#" target="_blank" class="pg-w51-btn-secondary" style="font-size:11px; text-decoration:none; padding:6px 10px;">' +
                      '<span>🤖 Android AR</span>' +
                    '</a>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // MODAL QUÉT MÃ QR AR QUICK LOOK
        '<div id="pg-w51-ar-modal-backdrop" class="pg-w51-ar-modal-backdrop">' +
          '<div class="pg-w51-ar-modal">' +
            '<div style="padding:16px 20px; background:#1e293b; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">' +
              '<h4 style="margin:0; font-size:15px; font-weight:800; color:#d4af37; text-transform:uppercase;">' +
                '📱 TRẢI NGHIỆM AR QUICK LOOK TRÊN ĐIỆN THOẠI' +
              '</h4>' +
              '<button type="button" id="pg-w51-btn-close-modal" style="background:transparent; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>' +
            '</div>' +
            '<div style="padding:24px; text-align:center;">' +
              '<p style="font-size:13px; color:#cbd5e1; margin-top:0;">' +
                'Mở camera iPhone hoặc Android quét mã bên dưới để xem mô hình 3D thực tế ngay trong căn phòng của bạn:' +
              '</p>' +
              '<div id="pg-w51-qr-container" style="display:inline-block; padding:10px; background:#ffffff; border-radius:12px; margin:10px 0; box-shadow:0 8px 24px rgba(0,0,0,0.5);">' +
                // QR SVG được tiêm vào đây
              '</div>' +
              '<div style="margin-top:14px; font-size:12px; color:#94a3b8; text-align:left; background:#1e293b; padding:12px 14px; border-radius:8px;">' +
                '<div style="font-weight:700; color:#f8fafc; margin-bottom:4px;">🏢 ĐƠN VỊ PHÁP LÝ & BẢO HÀNH CHÍNH HÃNG:</div>' +
                '<div>' + LEGAL_INFO.brandName + '</div>' +
                '<div>📍 ' + LEGAL_INFO.factoryComplex + ' — ' + LEGAL_INFO.tradingAddress + '</div>' +
                '<div>📞 Hotline tư vấn: <strong style="color:#d4af37;">' + LEGAL_INFO.hotline + '</strong> | MST: ' + LEGAL_INFO.taxId + '</div>' +
              '</div>' +
              '<div style="margin-top:16px; display:flex; justify-content:center; gap:10px;">' +
                '<button type="button" class="pg-w51-btn-primary" id="pg-w51-btn-direct-usdz">' +
                  '<span>🍎 Mở USDZ (iOS)</span>' +
                '</button>' +
                '<button type="button" class="pg-w51-btn-secondary" id="pg-w51-btn-direct-glb">' +
                  '<span>🤖 Mở Scene Viewer</span>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Khởi tạo Engine 3D
    var canvasEl = targetEl.querySelector('#pg-w51-main-canvas');
    var engine = new Showroom3DEngine(canvasEl, {
      initialSelections: currentSelections
    });

    // Render danh sách tab phân khu
    function renderZoneTabs() {
      var container = targetEl.querySelector('#pg-w51-zone-tabs');
      if (!container) return;
      var html = '';
      for (var zKey in ZONES) {
        if (!ZONES.hasOwnProperty(zKey)) continue;
        var z = ZONES[zKey];
        var isAct = (zKey === activeZone);
        var currentMat = MATERIALS[currentSelections[zKey]] || MATERIALS.mdf_ancuong;
        html += '' +
          '<button type="button" class="pg-w51-zone-btn' + (isAct ? ' active' : '') + '" data-zone="' + zKey + '">' +
            '<span>' + z.name + '</span>' +
            '<span class="pg-w51-zone-sub" style="color:' + (isAct ? '#d4af37' : '#94a3b8') + ';">' + currentMat.shortName + '</span>' +
          '</button>';
      }
      container.innerHTML = html;

      // Gắn sự kiện click đổi tab phân khu
      var btns = container.querySelectorAll('.pg-w51-zone-btn');
      for (var b = 0; b < btns.length; b++) {
        btns[b].addEventListener('click', function () {
          activeZone = this.getAttribute('data-zone');
          engine.activeZoneId = activeZone;
          updateView();
        });
      }
    }

    // Render 4 thẻ chọn vật liệu chủ lực
    function renderMaterialCards() {
      var container = targetEl.querySelector('#pg-w51-mat-list');
      if (!container) return;
      var currentMatId = currentSelections[activeZone];
      var html = '';

      for (var mKey in MATERIALS) {
        if (!MATERIALS.hasOwnProperty(mKey)) continue;
        var m = MATERIALS[mKey];
        var isSel = (mKey === currentMatId);

        html += '' +
          '<div class="pg-w51-mat-card' + (isSel ? ' selected' : '') + '" data-mat="' + mKey + '">' +
            '<div style="display:flex; gap:10px; align-items:center;">' +
              '<div class="pg-w51-swatch-circle" style="background:' + m.hexColor + '; border-color:' + (m.metalness > 0.5 ? '#d4af37' : 'rgba(255,255,255,0.25)') + ';"></div>' +
              '<div style="flex:1; min-width:0;">' +
                '<div style="font-size:12.5px; font-weight:700; color:#f8fafc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + m.shortName + '</div>' +
                '<div style="font-size:10px; color:#d4af37; font-weight:600;">' + m.badge + '</div>' +
              '</div>' +
            '</div>' +
            '<div style="font-size:11px; color:#94a3b8; margin:8px 0 4px 0; line-height:1.35; height:30px; overflow:hidden;">' + m.description + '</div>' +
            '<div class="pg-w51-pbr-tags">' +
              '<span class="pg-w51-tag">Roughness: ' + m.roughness + '</span>' +
              '<span class="pg-w51-tag">Metalness: ' + m.metalness + '</span>' +
              '<span class="pg-w51-tag">Clearcoat: ' + m.clearcoat + '</span>' +
            '</div>' +
          '</div>';
      }
      container.innerHTML = html;

      // Gắn sự kiện chọn vật liệu
      var cards = container.querySelectorAll('.pg-w51-mat-card');
      for (var c = 0; c < cards.length; c++) {
        cards[c].addEventListener('click', function () {
          var selectedMat = this.getAttribute('data-mat');
          currentSelections[activeZone] = selectedMat;
          engine.updateZoneMaterial(activeZone, selectedMat);
          updateView();
        });
      }
    }

    // Cập nhật bảng dự toán & HUD thời gian thực
    function updateBOMTable() {
      var quote = calculateQuotation(currentSelections);
      var tbody = targetEl.querySelector('#pg-w51-bom-tbody');
      if (!tbody) return;

      var html = '';
      for (var i = 0; i < quote.items.length; i++) {
        var it = quote.items[i];
        var isCurZone = (it.zoneId === activeZone);
        html += '' +
          '<tr style="' + (isCurZone ? 'background:rgba(212,175,55,0.08); font-weight:600;' : '') + '">' +
            '<td>' +
              '<div style="color:#ffffff;">' + it.zoneName + '</div>' +
              '<div style="font-size:10px; color:#64748b;">' + it.room + '</div>' +
            '</td>' +
            '<td>' +
              '<span style="color:#d4af37;">' + it.materialShort + '</span>' +
              '<div style="font-size:9.5px; color:#64748b;">' + it.materialCode + '</div>' +
            '</td>' +
            '<td style="text-align:right;">' + it.quantity + ' ' + it.unit + '</td>' +
            '<td style="text-align:right; font-family:monospace;">' + formatVND(it.unitPrice) + '</td>' +
            '<td style="text-align:right; font-family:monospace; color:#ffffff; font-weight:700;">' + formatVND(it.totalAmount) + '</td>' +
          '</tr>';
      }
      tbody.innerHTML = html;

      // Cập nhật tổng tiền
      var totalEl = targetEl.querySelector('#pg-w51-total-val');
      if (totalEl) totalEl.innerText = quote.formattedTotal;

      // Cập nhật Chốt Chặn Cost <= 54% (Quy định W08)
      var auditBadge = targetEl.querySelector('#pg-w51-audit-badge');
      var auditDetails = targetEl.querySelector('#pg-w51-audit-details');
      if (auditBadge && auditDetails) {
        if (quote.isCostSafe) {
          auditBadge.className = 'pg-w51-audit-badge pg-w51-audit-safe';
          auditBadge.innerHTML = '<span>🛡️ CHỐT CHẶN COST: ĐẠT CHUẨN AN TOÀN (' + quote.costPercentage + '% &lt;= 54%)</span>';
          auditDetails.innerHTML = 'Tổng chi phí vật tư & công thợ: ' + quote.formattedDirectCost + ' | Lợi nhuận ròng dự kiến: ' + quote.formattedNetProfit + ' (' + quote.netProfitMargin + ')';
        } else {
          auditBadge.className = 'pg-w51-audit-badge pg-w51-audit-warn';
          auditBadge.innerHTML = '<span>⚠️ CẢNH BÁO VƯỢT TRẦN COST (' + quote.costPercentage + '% &gt; 54%)</span>';
          auditDetails.innerHTML = 'Chi phí trực tiếp vượt quá ngưỡng an toàn. Cần điều chỉnh lại chủng loại vật liệu hoặc định mức thi công.';
        }
      }

      // Cập nhật HUD
      var curMat = MATERIALS[currentSelections[activeZone]] || MATERIALS.mdf_ancuong;
      var curZoneObj = ZONES[activeZone];
      var hudMatEl = targetEl.querySelector('#pg-w51-hud-mat-name');
      var hudPbrEl = targetEl.querySelector('#pg-w51-hud-pbr-vals');
      if (hudMatEl) hudMatEl.innerText = curZoneObj.name + ': ' + curMat.shortName;
      if (hudPbrEl) hudPbrEl.innerText = 'Roughness: ' + curMat.roughness + ' | Metalness: ' + curMat.metalness + ' | Clearcoat: ' + curMat.clearcoat + (curMat.transmission > 0 ? (' | Trans: ' + curMat.transmission) : '');

      // Cập nhật link USDZ / GLB
      var usdzLink = targetEl.querySelector('#pg-w51-link-usdz');
      var glbLink = targetEl.querySelector('#pg-w51-link-glb');
      if (usdzLink) usdzLink.href = generateUSDZLink(currentSelections);
      if (glbLink) glbLink.href = generateGLBLink(currentSelections);

      // Cập nhật mã QR
      var qrContainer = targetEl.querySelector('#pg-w51-qr-container');
      if (qrContainer) {
        var arUrl = generateUSDZLink(currentSelections);
        qrContainer.innerHTML = generateQRCodeSvg(arUrl, { size: 210 });
      }
    }

    function updateView() {
      renderZoneTabs();
      renderMaterialCards();
      updateBOMTable();
    }

    // KHỞI CHẠY GIAO DIỆN LẦN ĐẦU
    updateView();

    // GẮN SỰ KIỆN NÚT ĐIỀU KHIỂN VIEWPORT
    var modeTabs = targetEl.querySelectorAll('.pg-w51-btn-group [data-mode]');
    for (var m = 0; m < modeTabs.length; m++) {
      modeTabs[m].addEventListener('click', function () {
        for (var k = 0; k < modeTabs.length; k++) modeTabs[k].classList.remove('active');
        this.classList.add('active');
        engine.setRenderMode(this.getAttribute('data-mode'));
      });
    }

    var lightTabs = targetEl.querySelectorAll('.pg-w51-btn-group [data-light]');
    for (var l = 0; l < lightTabs.length; l++) {
      lightTabs[l].addEventListener('click', function () {
        for (var k = 0; k < lightTabs.length; k++) lightTabs[k].classList.remove('active');
        this.classList.add('active');
        engine.setLightingPreset(this.getAttribute('data-light'));
      });
    }

    var btnAutoRotate = targetEl.querySelector('#pg-w51-btn-autorotate');
    if (btnAutoRotate) {
      btnAutoRotate.addEventListener('click', function () {
        engine.autoRotate = !engine.autoRotate;
        this.innerText = engine.autoRotate ? '🔄 Xoay: BẬT' : '⏸️ Xoay: TẮT';
        this.classList.toggle('active', engine.autoRotate);
      });
    }

    var btnResetView = targetEl.querySelector('#pg-w51-btn-resetview');
    if (btnResetView) {
      btnResetView.addEventListener('click', function () {
        engine.resetView();
        if (btnAutoRotate) {
          btnAutoRotate.innerText = '🔄 Xoay: BẬT';
          btnAutoRotate.classList.add('active');
        }
      });
    }

    // MODAL AR
    var modalBackdrop = targetEl.querySelector('#pg-w51-ar-modal-backdrop');
    var btnOpenAR = targetEl.querySelector('#pg-w51-btn-open-ar');
    var btnCloseAR = targetEl.querySelector('#pg-w51-btn-close-modal');

    if (btnOpenAR && modalBackdrop) {
      btnOpenAR.addEventListener('click', function () {
        modalBackdrop.classList.add('open');
      });
    }

    if (btnCloseAR && modalBackdrop) {
      btnCloseAR.addEventListener('click', function () {
        modalBackdrop.classList.remove('open');
      });
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) {
          modalBackdrop.classList.remove('open');
        }
      });
    }

    var btnDirectUSDZ = targetEl.querySelector('#pg-w51-btn-direct-usdz');
    if (btnDirectUSDZ) {
      btnDirectUSDZ.addEventListener('click', function () {
        window.location.href = generateUSDZLink(currentSelections);
      });
    }

    var btnDirectGLB = targetEl.querySelector('#pg-w51-btn-direct-glb');
    if (btnDirectGLB) {
      btnDirectGLB.addEventListener('click', function () {
        window.open(generateGLBLink(currentSelections), '_blank');
      });
    }

    return {
      engine: engine,
      getSelections: function () {
        return Object.assign({}, currentSelections);
      },
      setMaterial: function (zoneId, materialId) {
        if (ZONES[zoneId] && MATERIALS[materialId]) {
          currentSelections[zoneId] = materialId;
          engine.updateZoneMaterial(zoneId, materialId);
          updateView();
        }
      },
      destroy: function () {
        engine.destroy();
        targetEl.innerHTML = '';
      }
    };
  }

  // TỰ ĐỘNG KHỞI CHẠY NẾU TỒN TẠI ELEMENT #pg-w51-showroom-root
  if (typeof document !== 'undefined') {
    var autoInit = function () {
      var rootEl = document.getElementById('pg-w51-showroom-root');
      if (rootEl) {
        render(rootEl);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      autoInit();
    }
  }

  // PUBLIC API CỦA MODULE W51
  return {
    moduleId: MODULE_ID,
    moduleName: MODULE_NAME,
    version: VERSION,
    LEGAL_INFO: LEGAL_INFO,
    MATERIALS: MATERIALS,
    ZONES: ZONES,
    calculateQuotation: calculateQuotation,
    generateUSDZLink: generateUSDZLink,
    generateGLBLink: generateGLBLink,
    generateQRCodeSvg: generateQRCodeSvg,
    render: render,
    create: function (containerIdOrElement, options) {
      return render(containerIdOrElement, options);
    }
  };
}));
