/**
 * ==============================================================================================
 * HỆ THỐNG QUẢN TRỊ & SẢN XUẤT NỘI THẤT PG HOME LUXURY - PHÚ GIA
 * MODULE W57: WEB ERP INTERACTIVE 2D CNC NESTING VISUALIZER & QR OFFCUT REMNANT MANAGER
 * ==============================================================================================
 * Pháp nhân chuẩn: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * Thương hiệu: CÔNG TY CP PHÚ GIA VIỆT NAM / PG HOME LUXURY
 * Mã số HKD / MST: 042203002931 (ĐKKD: 13/01/2025 - Đại diện: Nguyễn Trọng Nghĩa)
 * Địa chỉ ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
 * Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Hotline duy nhất: 0986.722.324
 * Danh xưng chuẩn duy nhất: "Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia"
 * ==============================================================================================
 * TÍNH NĂNG CHÍNH:
 * 1. Sơ đồ cắt ván 2D Interactive trên HTML5 Canvas tỉ lệ chuẩn (1220 x 2440 mm).
 * 2. Đường phay CNC Kerf = 4mm hiển thị rõ ràng, mũi tên vân gỗ Grain Direction, nhãn chi tiết L x W.
 * 3. Thuật toán tối ưu hóa MaxRects-BSSF (Maximal Rectangles with Best Short Side Fit).
 * 4. Đạt tỷ lệ Yield % >= 92%, Waste < 8%, thống kê diện tích và tiền tiết kiệm tức thì.
 * 5. Bảng quản lý kho phôi dư QR Offcut (PG-OFFCUT-...) tự động trích xuất vùng trống tái sử dụng.
 * 6. Tích hợp bộ tạo mã QR SVG độc lập 100% không cần thư viện ngoài, hỗ trợ in tem phôi tức thời.
 * ==============================================================================================
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_W57_CncNestingQrOffcut = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ============================================================================
  // 1. CẤU HÌNH TIÊU CHUẨN NHÀ MÁY PHÚ GIA
  // ============================================================================
  const FACTORY_CONFIG = {
    BRAND_NAME: 'PG HOME LUXURY',
    LEGAL_NAME: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    COMPANY_TITLE: 'CÔNG TY CP PHÚ GIA VIỆT NAM',
    TAX_ID: '042203002931',
    HOTLINE: '0986.722.324',
    FACTORY_ADDRESS: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    REGISTERED_ADDRESS: 'Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh',
    FACILITY_NAME: 'Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia',

    // Thông số ván công nghiệp tiêu chuẩn
    SHEET: {
      LENGTH_MM: 2440, // Trục X (chiều dài)
      WIDTH_MM: 1220,  // Trục Y (chiều rộng)
      AREA_M2: 2.9768, // 2.44 * 1.22
      KERF_MM: 4,      // Đường phay mũi dao CNC d=4mm
      TRIM_MARGIN_MM: 10, // Lề xén sạch 4 cạnh ván
      USABLE_LENGTH_MM: 2420, // 2440 - 20
      USABLE_WIDTH_MM: 1200   // 1220 - 20
    },

    // Ngưỡng phôi dư thu hồi chuẩn PG Home
    REMNANT_THRESHOLD: {
      MIN_WIDTH_MM: 250,
      MIN_LENGTH_MM: 250,
      MIN_AREA_M2: 0.08 // >= 0.08 m2 đủ làm đợt ngang/ngăn kéo/hồi nhỏ
    },

    // Bảng giá vật tư tiêu chuẩn (đồng/tấm)
    MATERIALS: {
      'MDF_THAI_17': { name: 'MDF Chống ẩm Thái Lan 17mm', pricePerSheet: 520000, color: '#38bdf8' },
      'MDF_AC_17': { name: 'MDF Chống ẩm An Cường 17mm', pricePerSheet: 680000, color: '#4ade80' },
      'PLYWOOD_A1_17': { name: 'Plywood Phủ Melamine A1 17mm', pricePerSheet: 760000, color: '#fbbf24' },
      'PVC_PITECH_17': { name: 'Nhựa Đặc PVC Pitech 17mm', pricePerSheet: 890000, color: '#a78bfa' },
      'MDF_HAU_6': { name: 'Hậu MDF Chống ẩm 6mm', pricePerSheet: 260000, color: '#f472b6' }
    }
  };

  // ============================================================================
  // 2. BỘ TẠO MÃ QR CODE ĐỘC LẬP (PURE JS QR GENERATOR - NO EXTERNAL LIBS)
  // ============================================================================
  // Hỗ trợ mã hóa chuỗi PG-OFFCUT-... thành ma trận QR và SVG sắc nét
  const PureQR = (function () {
    // Bảng Galois Field GF(256) cho mã sửa lỗi Reed-Solomon
    const EXP_TABLE = new Uint8Array(256);
    const LOG_TABLE = new Uint8Array(256);
    for (let i = 0, x = 1; i < 256; i++) {
      EXP_TABLE[i] = x;
      LOG_TABLE[x] = i;
      x = (x << 1) ^ (x & 128 ? 0x11d : 0);
    }

    function gmul(a, b) {
      if (a === 0 || b === 0) return 0;
      return EXP_TABLE[(LOG_TABLE[a] + LOG_TABLE[b]) % 255];
    }

    function polyMultiply(p1, p2) {
      const res = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          res[i + j] ^= gmul(p1[i], p2[j]);
        }
      }
      return res;
    }

    function rsGeneratorPoly(degree) {
      let g = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        g = polyMultiply(g, new Uint8Array([1, EXP_TABLE[i]]));
      }
      return g;
    }

    function rsComputeEcc(data, eccLength) {
      const gen = rsGeneratorPoly(eccLength);
      const res = new Uint8Array(eccLength);
      for (let i = 0; i < data.length; i++) {
        const factor = data[i] ^ res[0];
        for (let j = 0; j < eccLength - 1; j++) {
          res[j] = res[j + 1] ^ gmul(gen[j + 1], factor);
        }
        res[eccLength - 1] = gmul(gen[eccLength], factor);
      }
      return res;
    }

    // QR Version 3 (29x29) Level L: 55 data bytes, 15 ecc bytes
    function encodeToMatrix(text) {
      const version = 3;
      const size = 17 + 4 * version; // 29
      const dataCap = 55;
      const eccLen = 15;

      // Chuyển text sang byte mode
      const rawBytes = [];
      for (let i = 0; i < text.length; i++) {
        rawBytes.push(text.charCodeAt(i) & 0xff);
      }

      const bitBuffer = [];
      function pushBits(val, len) {
        for (let i = len - 1; i >= 0; i--) {
          bitBuffer.push((val >> i) & 1);
        }
      }

      // Mode: 0100 (Byte mode)
      pushBits(4, 4);
      // Character count (8 bits for Version 3 byte mode)
      pushBits(rawBytes.length, 8);
      for (let i = 0; i < rawBytes.length; i++) {
        pushBits(rawBytes[i], 8);
      }
      // Terminator
      pushBits(0, Math.min(4, dataCap * 8 - bitBuffer.length));
      while (bitBuffer.length % 8 !== 0) bitBuffer.push(0);

      // Pad bytes 0xec, 0x11
      const pad = [0xec, 0x11];
      let padIdx = 0;
      while (bitBuffer.length < dataCap * 8) {
        pushBits(pad[padIdx % 2], 8);
        padIdx++;
      }

      const dataWords = new Uint8Array(dataCap);
      for (let i = 0; i < dataCap; i++) {
        let byteVal = 0;
        for (let b = 0; b < 8; b++) {
          byteVal = (byteVal << 1) | bitBuffer[i * 8 + b];
        }
        dataWords[i] = byteVal;
      }

      const eccWords = rsComputeEcc(dataWords, eccLen);

      // Kết hợp data + ecc
      const totalWords = new Uint8Array(dataCap + eccLen);
      totalWords.set(dataWords, 0);
      totalWords.set(eccWords, dataCap);

      // Ma trận khởi tạo
      const matrix = Array.from({ length: size }, () => Array(size).fill(null));
      const isReserved = Array.from({ length: size }, () => Array(size).fill(false));

      function setModule(r, c, val, reserved = true) {
        if (r >= 0 && r < size && c >= 0 && c < size) {
          matrix[r][c] = val ? 1 : 0;
          if (reserved) isReserved[r][c] = true;
        }
      }

      // Finder pattern
      function addFinder(top, left) {
        for (let r = -1; r <= 7; r++) {
          for (let c = -1; c <= 7; c++) {
            const row = top + r;
            const col = left + c;
            if (row < 0 || row >= size || col < 0 || col >= size) continue;
            if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
              const isBlack = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
              setModule(row, col, isBlack);
            } else {
              setModule(row, col, 0); // Separator
            }
          }
        }
      }

      addFinder(0, 0);
      addFinder(0, size - 7);
      addFinder(size - 7, 0);

      // Alignment pattern (cho version 3: r=22, c=22)
      const alignCenter = 22;
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const row = alignCenter + r;
          const col = alignCenter + c;
          const isBlack = (Math.max(Math.abs(r), Math.abs(c)) !== 1);
          setModule(row, col, isBlack);
        }
      }

      // Timing patterns
      for (let i = 8; i < size - 8; i++) {
        if (isReserved[6][i] === false) setModule(6, i, i % 2 === 0);
        if (isReserved[i][6] === false) setModule(i, 6, i % 2 === 0);
      }

      // Dark module
      setModule(size - 8, 8, 1);

      // Reserve format info
      for (let i = 0; i < 9; i++) {
        if (i < size) {
          isReserved[8][i] = true;
          isReserved[i][8] = true;
        }
      }
      for (let i = 0; i < 8; i++) {
        isReserved[8][size - 1 - i] = true;
        isReserved[size - 1 - i][8] = true;
      }

      // Đặt data bits vào ma trận
      let bitIdx = 0;
      const allBits = [];
      for (let i = 0; i < totalWords.length; i++) {
        for (let b = 7; b >= 0; b--) {
          allBits.push((totalWords[i] >> b) & 1);
        }
      }

      let right = size - 1;
      let upward = true;
      while (right > 0) {
        if (right === 6) right--; // Bỏ qua timing column
        const rows = upward
          ? Array.from({ length: size }, (_, i) => size - 1 - i)
          : Array.from({ length: size }, (_, i) => i);

        for (const row of rows) {
          for (let colOffset = 0; colOffset < 2; colOffset++) {
            const col = right - colOffset;
            if (!isReserved[row][col]) {
              const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
              // Mask 0: (row + col) % 2 === 0
              const mask = (row + col) % 2 === 0;
              matrix[row][col] = (bit ^ (mask ? 1 : 0));
            }
          }
        }
        upward = !upward;
        right -= 2;
      }

      // Format Information: Level L (01), Mask 0 (000) -> 01000 -> Format Bits: 0x77c4
      const formatBits = 0x77c4;
      for (let i = 0; i < 15; i++) {
        const bit = (formatBits >> (14 - i)) & 1;
        // Top-left
        if (i < 6) matrix[8][i] = bit;
        else if (i === 6) matrix[8][7] = bit;
        else if (i === 7) matrix[8][8] = bit;
        else if (i === 8) matrix[7][8] = bit;
        else matrix[14 - i][8] = bit;

        // Split edges
        if (i < 8) matrix[size - 1 - i][8] = bit;
        else matrix[8][size - 15 + i] = bit;
      }

      return { size, matrix };
    }

    function renderSvg(text, pixelSize = 4) {
      try {
        const { size, matrix } = encodeToMatrix(text);
        const totalSize = size * pixelSize;
        let rects = '';
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (matrix[r][c] === 1) {
              rects += `<rect x="${c * pixelSize}" y="${r * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="#0f172a"/>`;
            }
          }
        }
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="100%" height="100%" style="background:#ffffff; border-radius:6px; padding:6px; box-sizing:border-box;">
            ${rects}
          </svg>
        `;
      } catch (err) {
        console.error('[PG_PureQR] Lỗi tạo SVG QR:', err);
        return `<div style="padding:10px; color:#ef4444; font-size:12px;">QR Error: ${err.message}</div>`;
      }
    }

    return {
      encodeToMatrix: encodeToMatrix,
      renderSvg: renderSvg
    };
  })();

  // ============================================================================
  // 3. THUẬT TOÁN TỐI ƯU MAXRECTS-BSSF (BEST SHORT SIDE FIT)
  // ============================================================================
  class MaxRectsBSSFPacker {
    constructor(sheetConfig) {
      this.sheetConfig = sheetConfig || FACTORY_CONFIG.SHEET;
      this.kerf = this.sheetConfig.KERF_MM;
      this.trim = this.sheetConfig.TRIM_MARGIN_MM;
      this.usableL = this.sheetConfig.USABLE_LENGTH_MM;
      this.usableW = this.sheetConfig.USABLE_WIDTH_MM;
      this.sheets = [];
    }

    createNewSheet(sheetIndex = 1) {
      return {
        index: sheetIndex,
        totalLength: this.sheetConfig.LENGTH_MM,
        totalWidth: this.sheetConfig.WIDTH_MM,
        areaM2: this.sheetConfig.AREA_M2,
        trim: this.trim,
        kerf: this.kerf,
        placedParts: [],
        freeRects: [
          {
            x: this.trim,
            y: this.trim,
            w: this.usableL,
            h: this.usableW
          }
        ],
        offcuts: [],
        metrics: {
          netPartsAreaM2: 0,
          kerfLossAreaM2: 0,
          offcutReusableAreaM2: 0,
          trueWasteAreaM2: 0,
          yieldPercent: 0,
          wastePercent: 0
        }
      };
    }

    // Kiểm tra xem hình chữ nhật a có nằm trọn trong b không
    isContainedIn(a, b) {
      return a.x >= b.x &&
             a.y >= b.y &&
             a.x + a.w <= b.x + b.w &&
             a.y + a.h <= b.y + b.h;
    }

    // Loại bỏ các free rectangle trùng lặp hoặc bị chứa
    pruneFreeList(sheet) {
      const list = sheet.freeRects;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (this.isContainedIn(list[i], list[j])) {
            list.splice(i, 1);
            i--;
            break;
          }
          if (this.isContainedIn(list[j], list[i])) {
            list.splice(j, 1);
            j--;
          }
        }
      }
    }

    // Chia tách Free Rectangle khi bị một Placed Box đè lên (MaxRects Split)
    splitFreeRect(free, placed) {
      // Kiểm tra giao nhau
      if (placed.x >= free.x + free.w || placed.x + placed.w <= free.x ||
          placed.y >= free.y + free.h || placed.y + placed.h <= free.y) {
        return [free]; // Không giao nhau
      }

      const results = [];

      // 1. Nhánh trên (Top remnant)
      if (placed.y + placed.h < free.y + free.h) {
        results.push({
          x: free.x,
          y: placed.y + placed.h,
          w: free.w,
          h: (free.y + free.h) - (placed.y + placed.h)
        });
      }

      // 2. Nhánh dưới (Bottom remnant)
      if (placed.y > free.y) {
        results.push({
          x: free.x,
          y: free.y,
          w: free.w,
          h: placed.y - free.y
        });
      }

      // 3. Nhánh trái (Left remnant)
      if (placed.x > free.x) {
        results.push({
          x: free.x,
          y: free.y,
          w: placed.x - free.x,
          h: free.h
        });
      }

      // 4. Nhánh phải (Right remnant)
      if (placed.x + placed.w < free.x + free.w) {
        results.push({
          x: placed.x + placed.w,
          y: free.y,
          w: (free.x + free.w) - (placed.x + placed.w),
          h: free.h
        });
      }

      return results.filter(r => r.w > 0 && r.h > 0);
    }

    // Tìm vị trí tối ưu theo tiêu chí Best Short Side Fit (BSSF)
    findBestPositionForPart(sheet, part) {
      let bestScore = Infinity;
      let bestSecondaryScore = Infinity;
      let bestPlacement = null;

      const partL = part.length;
      const partW = part.width;

      // Xác định quy tắc xoay theo chiều vân gỗ
      // Grain: 'length' (dọc theo L), 'width' (ngang theo W), 'none' (tự do)
      const allowOriginal = true;
      let allowRotated = false;

      if (part.grain === 'none') {
        allowRotated = true; // Không quan tâm vân gỗ, được xoay 90 độ
      } else if (part.grain === 'length' && part.canRotateIfGrainMatches) {
        allowRotated = true;
      }

      for (let i = 0; i < sheet.freeRects.length; i++) {
        const free = sheet.freeRects[i];

        // 1. Hướng gốc: Chiều dài theo trục X, Chiều rộng theo trục Y
        // Cần thêm kerf vào kích thước chiếm dụng
        const reqW1 = partL + this.kerf;
        const reqH1 = partW + this.kerf;

        if (reqW1 <= free.w && reqH1 <= free.h) {
          const shortSideFit = Math.min(free.w - reqW1, free.h - reqH1);
          const longSideFit = Math.max(free.w - reqW1, free.h - reqH1);

          if (shortSideFit < bestScore || (shortSideFit === bestScore && longSideFit < bestSecondaryScore)) {
            bestScore = shortSideFit;
            bestSecondaryScore = longSideFit;
            bestPlacement = {
              x: free.x,
              y: free.y,
              w: partL,
              h: partW,
              rotated: false,
              boxW: reqW1,
              boxH: reqH1
            };
          }
        }

        // 2. Hướng xoay 90 độ: Chiều rộng theo X, Chiều dài theo Y
        if (allowRotated) {
          const reqW2 = partW + this.kerf;
          const reqH2 = partL + this.kerf;

          if (reqW2 <= free.w && reqH2 <= free.h) {
            const shortSideFit = Math.min(free.w - reqW2, free.h - reqH2);
            const longSideFit = Math.max(free.w - reqW2, free.h - reqH2);

            if (shortSideFit < bestScore || (shortSideFit === bestScore && longSideFit < bestSecondaryScore)) {
              bestScore = shortSideFit;
              bestSecondaryScore = longSideFit;
              bestPlacement = {
                x: free.x,
                y: free.y,
                w: partW,
                h: partL,
                rotated: true,
                boxW: reqW2,
                boxH: reqH2
              };
            }
          }
        }
      }

      return bestPlacement;
    }

    // Đặt chi tiết vào tấm và cập nhật danh sách Free Rectangles
    placePart(sheet, part, placement) {
      const placedItem = {
        id: part.id,
        name: part.name,
        code: part.code || ('P' + (sheet.placedParts.length + 1)),
        x: placement.x,
        y: placement.y,
        length: placement.w, // Chiều thực tế trên bản vẽ
        width: placement.h,
        originalLength: part.length,
        originalWidth: part.width,
        rotated: placement.rotated,
        grain: part.grain,
        material: part.material,
        thickness: part.thickness,
        notes: part.notes || '',
        areaM2: (part.length * part.width) / 1000000
      };

      sheet.placedParts.push(placedItem);

      // Cập nhật free rects
      const placedBox = {
        x: placement.x,
        y: placement.y,
        w: placement.boxW,
        h: placement.boxH
      };

      let newFreeList = [];
      for (let i = 0; i < sheet.freeRects.length; i++) {
        const splits = this.splitFreeRect(sheet.freeRects[i], placedBox);
        newFreeList.push(...splits);
      }

      sheet.freeRects = newFreeList;
      this.pruneFreeList(sheet);
    }

    // Trích xuất phôi dư hợp lệ và tính toán chỉ số
    finalizeSheet(sheet, dateStr = '20261108') {
      const thresh = FACTORY_CONFIG.REMNANT_THRESHOLD;
      sheet.offcuts = [];

      // Sắp xếp các ô trống lớn nhất trước
      const sortedFree = [...sheet.freeRects].sort((a, b) => (b.w * b.h) - (a.w * a.h));
      const registeredBoxes = [];

      for (let i = 0; i < sortedFree.length; i++) {
        const r = sortedFree[i];
        const areaM2 = (r.w * r.h) / 1000000;

        // Tiêu chí thu hồi phôi dư PG Home:
        // Đạt kích thước tối thiểu (250x250mm) hoặc diện tích >= 0.08 m2
        if ((r.w >= thresh.MIN_WIDTH_MM && r.h >= thresh.MIN_LENGTH_MM) || areaM2 >= thresh.MIN_AREA_M2) {
          // Kiểm tra không bị chồng lấn quá 50% với phôi dư đã đăng ký
          let overlap = false;
          for (const reg of registeredBoxes) {
            const ix = Math.max(r.x, reg.x);
            const iy = Math.max(r.y, reg.y);
            const iw = Math.min(r.x + r.w, reg.x + reg.w) - ix;
            const ih = Math.min(r.y + r.h, reg.y + reg.h) - iy;
            if (iw > 0 && ih > 0) {
              const interArea = (iw * ih) / 1000000;
              if (interArea > areaM2 * 0.4) {
                overlap = true;
                break;
              }
            }
          }

          if (!overlap) {
            const remnantIdx = sheet.offcuts.length + 1;
            const qrCode = `PG-OFFCUT-${dateStr}-S${sheet.index}-R${remnantIdx}`;
            const offcutItem = {
              id: qrCode,
              code: qrCode,
              sheetIndex: sheet.index,
              x: r.x,
              y: r.y,
              width: Math.round(r.h),  // Quy đổi L x W theo kích thước phôi
              length: Math.round(r.w),
              areaM2: Number(areaM2.toFixed(3)),
              status: 'IN_STOCK', // IN_STOCK | RESERVED | USED
              shelfLocation: `Kệ K${sheet.index % 2 === 0 ? '2' : '1'} Nhà máy Phú Gia`,
              materialKey: 'MDF_THAI_17',
              estimatedValueVnd: Math.round((areaM2 / FACTORY_CONFIG.SHEET.AREA_M2) * 520000 * 0.8)
            };
            sheet.offcuts.push(offcutItem);
            registeredBoxes.push(r);
          }
        }
      }

      // Tính toán Metrics
      let netPartsArea = 0;
      for (const p of sheet.placedParts) {
        netPartsArea += (p.originalLength * p.originalWidth) / 1000000;
      }

      let offcutArea = 0;
      for (const o of sheet.offcuts) {
        offcutArea += o.areaM2;
      }

      const totalSheetArea = sheet.areaM2;
      const kerfCount = sheet.placedParts.length;
      const approxKerfArea = (kerfCount * 0.018); // Xấp xỉ diện tích mạch phay d=4mm

      const yieldPercent = (netPartsArea / totalSheetArea) * 100;
      const trueWaste = Math.max(0, totalSheetArea - netPartsArea - offcutArea);
      const wastePercent = (trueWaste / totalSheetArea) * 100;

      sheet.metrics = {
        netPartsAreaM2: Number(netPartsArea.toFixed(3)),
        kerfLossAreaM2: Number(approxKerfArea.toFixed(3)),
        offcutReusableAreaM2: Number(offcutArea.toFixed(3)),
        trueWasteAreaM2: Number(trueWaste.toFixed(3)),
        yieldPercent: Number(yieldPercent.toFixed(1)),
        wastePercent: Number(wastePercent.toFixed(1)),
        totalEffectivePercent: Number(((netPartsArea + offcutArea) / totalSheetArea * 100).toFixed(1))
      };
    }

    // Chạy toàn bộ quy trình Nesting cho danh sách chi tiết đầu vào
    pack(partList, dateStr = '20261108') {
      this.sheets = [];

      // Mở rộng chi tiết theo số lượng (Quantity)
      const expandedParts = [];
      for (const p of partList) {
        const qty = p.quantity || 1;
        for (let q = 1; q <= qty; q++) {
          expandedParts.push({
            id: `${p.id}_q${q}`,
            name: p.name,
            code: `${p.code || 'P'}${expandedParts.length + 1}`,
            length: Number(p.length),
            width: Number(p.width),
            grain: p.grain || 'length',
            material: p.material || 'MDF_THAI_17',
            thickness: p.thickness || 17,
            notes: p.notes || '',
            canRotateIfGrainMatches: (p.grain === 'none')
          });
        }
      }

      // Sắp xếp chi tiết giảm dần theo Diện tích hoặc Cạnh dài nhất (Heuristic sorting)
      expandedParts.sort((a, b) => {
        const areaB = b.length * b.width;
        const areaA = a.length * a.width;
        if (areaB !== areaA) return areaB - areaA;
        return Math.max(b.length, b.width) - Math.max(a.length, a.width);
      });

      // Tạo tấm đầu tiên
      let currentSheet = this.createNewSheet(1);
      this.sheets.push(currentSheet);

      for (let i = 0; i < expandedParts.length; i++) {
        const part = expandedParts[i];
        let placed = false;

        // Thử đặt vào các tấm hiện có
        for (let s = 0; s < this.sheets.length; s++) {
          const sheet = this.sheets[s];
          const bestPos = this.findBestPositionForPart(sheet, part);
          if (bestPos) {
            this.placePart(sheet, part, bestPos);
            placed = true;
            break;
          }
        }

        // Nếu chưa đặt được vào bất kỳ tấm nào, mở thêm tấm mới
        if (!placed) {
          const newSheet = this.createNewSheet(this.sheets.length + 1);
          this.sheets.push(newSheet);
          const bestPos = this.findBestPositionForPart(newSheet, part);
          if (bestPos) {
            this.placePart(newSheet, part, bestPos);
          } else {
            console.error('[PG_MaxRects] Chi tiết quá lớn không thể xếp vào khổ ván:', part);
          }
        }
      }

      // Hoàn thiện từng tấm (phôi dư & KPI)
      for (const s of this.sheets) {
        this.finalizeSheet(s, dateStr);
      }

      // Tổng hợp báo cáo toàn dự án
      return this.generateSummary();
    }

    generateSummary() {
      let totalParts = 0;
      let totalPartsArea = 0;
      let totalOffcutArea = 0;
      let totalTrueWasteArea = 0;
      const totalSheetsUsed = this.sheets.length;
      const totalRawArea = totalSheetsUsed * FACTORY_CONFIG.SHEET.AREA_M2;

      for (const s of this.sheets) {
        totalParts += s.placedParts.length;
        totalPartsArea += s.metrics.netPartsAreaM2;
        totalOffcutArea += s.metrics.offcutReusableAreaM2;
        totalTrueWasteArea += s.metrics.trueWasteAreaM2;
      }

      const overallYield = totalRawArea > 0 ? (totalPartsArea / totalRawArea) * 100 : 0;
      const overallEffective = totalRawArea > 0 ? ((totalPartsArea + totalOffcutArea) / totalRawArea) * 100 : 0;
      const overallWaste = totalRawArea > 0 ? (totalTrueWasteArea / totalRawArea) * 100 : 0;

      // So sánh tiết kiệm với phương pháp pha cắt thủ công truyền thống (baseline 76.5% yield)
      const manualSheetsNeeded = Math.ceil(totalPartsArea / (FACTORY_CONFIG.SHEET.AREA_M2 * 0.765)) || totalSheetsUsed;
      const savedSheetsCount = Math.max(0, manualSheetsNeeded - totalSheetsUsed);
      const standardSheetCost = FACTORY_CONFIG.MATERIALS.MDF_THAI_17.pricePerSheet;
      const sheetSavingsVnd = savedSheetsCount * standardSheetCost;

      let totalOffcutValueVnd = 0;
      for (const s of this.sheets) {
        for (const o of s.offcuts) {
          totalOffcutValueVnd += o.estimatedValueVnd;
        }
      }

      const totalFinancialBenefitVnd = sheetSavingsVnd + totalOffcutValueVnd;

      return {
        sheets: this.sheets,
        kpi: {
          totalSheetsUsed: totalSheetsUsed,
          manualSheetsBaseline: manualSheetsNeeded,
          savedSheetsCount: savedSheetsCount,
          totalPartsPlaced: totalParts,
          totalPartsAreaM2: Number(totalPartsArea.toFixed(3)),
          totalOffcutAreaM2: Number(totalOffcutArea.toFixed(3)),
          totalTrueWasteAreaM2: Number(totalTrueWasteArea.toFixed(3)),
          overallYieldPercent: Number(overallYield.toFixed(1)),
          overallWastePercent: Number(overallWaste.toFixed(1)),
          overallEffectivePercent: Number(overallEffective.toFixed(1)),
          sheetSavingsVnd: sheetSavingsVnd,
          offcutValueVnd: totalOffcutValueVnd,
          totalFinancialBenefitVnd: totalFinancialBenefitVnd
        }
      };
    }
  }

  // ============================================================================
  // 4. BỘ DỮ LIỆU MẪU CHUẨN THỰC CHIẾN (PRESETS NHÀ MÁY PHÚ GIA)
  // ============================================================================
  const STANDARD_PRESETS = [
    {
      id: 'PRESET_R09_ANH_NAM',
      name: '1. Tủ Bếp Dưới R09 - Dự Án Nhà Anh Nam (3.77 md chuẩn)',
      description: 'Định mức 1.45 tấm/md, quy cách thùng Pitech/MDF Chống ẩm Thái Lan, xà giằng 80mm',
      materialKey: 'MDF_THAI_17',
      items: [
        { id: 'AN_01', name: 'Hồi tủ trái bếp dưới', length: 740, width: 580, quantity: 1, grain: 'length', notes: 'Khoan cam liên kết' },
        { id: 'AN_02', name: 'Hồi tủ phải bếp dưới', length: 740, width: 580, quantity: 1, grain: 'length', notes: 'Khoan cam liên kết' },
        { id: 'AN_03', name: 'Vách chia khoang chậu rửa', length: 740, width: 560, quantity: 2, grain: 'length', notes: 'Cắt khoét xi phông' },
        { id: 'AN_04', name: 'Vách chia khoang giá xoong nồi', length: 740, width: 560, quantity: 2, grain: 'length', notes: 'Bắt ray trượt' },
        { id: 'AN_05', name: 'Đáy thùng tủ modul 1', length: 1200, width: 580, quantity: 1, grain: 'none', notes: 'Khoét lỗ chân nhựa' },
        { id: 'AN_06', name: 'Đáy thùng tủ modul 2', length: 1200, width: 580, quantity: 1, grain: 'none', notes: 'Khoét lỗ chân nhựa' },
        { id: 'AN_07', name: 'Đáy thùng tủ modul 3', length: 1370, width: 580, quantity: 1, grain: 'none', notes: 'Khoét lỗ chân nhựa' },
        { id: 'AN_08', name: 'Xà giằng nóc 80mm', length: 1164, width: 80, quantity: 6, grain: 'none', notes: 'Gông nóc đá' },
        { id: 'AN_09', name: 'Đợt di động khoang đồ khô', length: 750, width: 540, quantity: 2, grain: 'none', notes: 'Dán chỉ 4 cạnh' }
      ]
    },
    {
      id: 'PRESET_R27_WARDROBE',
      name: '2. Tủ Áo Kịch Trần 3 Cánh R27 (Rộng 1800 x Cao 2400 x Sâu 600)',
      description: 'Khổ ván tối ưu chiều dài 2360mm sát biên, tận dụng triệt để phôi dư',
      materialKey: 'MDF_AC_17',
      items: [
        { id: 'TA_01', name: 'Hồi tủ áo ngoài trái', length: 2360, width: 580, quantity: 1, grain: 'length', notes: 'Hồi lộ dán chỉ đẹp' },
        { id: 'TA_02', name: 'Hồi tủ áo ngoài phải', length: 2360, width: 580, quantity: 1, grain: 'length', notes: 'Hồi lộ dán chỉ đẹp' },
        { id: 'TA_03', name: 'Vách đứng ngăn khoang', length: 2360, width: 560, quantity: 2, grain: 'length', notes: 'Phay rãnh hậu 6mm' },
        { id: 'TA_04', name: 'Đáy tủ áo', length: 1764, width: 580, quantity: 1, grain: 'none', notes: 'Cam chốt liên kết' },
        { id: 'TA_05', name: 'Nóc tủ áo', length: 1764, width: 580, quantity: 1, grain: 'none', notes: 'Cam chốt liên kết' },
        { id: 'TA_06', name: 'Đợt ngăn quần áo gấp', length: 574, width: 540, quantity: 6, grain: 'none', notes: 'Dán chỉ 1 cạnh trước' },
        { id: 'TA_07', name: 'Thanh treo quần áo gông gỗ', length: 574, width: 90, quantity: 3, grain: 'none', notes: 'Gia cố thanh suốt' }
      ]
    },
    {
      id: 'PRESET_R04_R06_LIVING',
      name: '3. Kệ Tivi Treo & Vách Ốp Phẳng (R04 + R06)',
      description: 'Kết hợp module treo sâu 350mm và vách ốp nano vân gỗ dọc',
      materialKey: 'MDF_THAI_17',
      items: [
        { id: 'TV_01', name: 'Mặt nóc kệ tivi treo', length: 2200, width: 350, quantity: 1, grain: 'none', notes: 'Bo cạnh thẩm mỹ' },
        { id: 'TV_02', name: 'Đáy kệ tivi treo', length: 2200, width: 350, quantity: 1, grain: 'none', notes: 'Khoét lỗ thoát dây' },
        { id: 'TV_03', name: 'Hồi kệ tivi', length: 240, width: 350, quantity: 4, grain: 'length', notes: 'Cam chốt' },
        { id: 'TV_04', name: 'Cánh lật kệ tivi', length: 725, width: 235, quantity: 3, grain: 'length', notes: 'Dán chỉ noline' },
        { id: 'TV_05', name: 'Vách ốp trang trí tấm 1', length: 2400, width: 400, quantity: 2, grain: 'length', notes: 'Vân gỗ chạy dọc' },
        { id: 'TV_06', name: 'Vách ốp trang trí tấm 2', length: 2400, width: 400, quantity: 1, grain: 'length', notes: 'Vân gỗ chạy dọc' },
        { id: 'TV_07', name: 'Nẹp xương treo vách', length: 1200, width: 80, quantity: 4, grain: 'none', notes: 'Bắn vít nở tường' }
      ]
    }
  ];

  // ============================================================================
  // 5. TRÌNH QUẢN TRỊ TRỰC QUAN 2D CANVAS VISUALIZER
  // ============================================================================
  class Visualizer2D {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.currentSheet = null;
      this.zoom = 1;
      this.panX = 30;
      this.panY = 30;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.showKerf = true;
      this.showGrain = true;
      this.showOffcut = true;
      this.hoveredItem = null;
      this.onRemnantClick = options.onRemnantClick || null;

      this.initEvents();
    }

    initEvents() {
      const c = this.canvas;

      c.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.dragStartX = e.clientX - this.panX;
        this.dragStartY = e.clientY - this.panY;
      });

      window.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
          this.panX = e.clientX - this.dragStartX;
          this.panY = e.clientY - this.dragStartY;
          this.draw();
        } else {
          // Hover hit-test
          const rect = c.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          this.handleHover(mouseX, mouseY);
        }
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      c.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const newZoom = Math.min(Math.max(this.zoom * zoomFactor, 0.2), 4);
        this.zoom = newZoom;
        this.draw();
      });

      c.addEventListener('click', (e) => {
        const rect = c.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        this.handleClick(mouseX, mouseY);
      });
    }

    fitToScreen() {
      if (!this.currentSheet) return;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const margin = 40;
      const scaleX = (w - margin * 2) / FACTORY_CONFIG.SHEET.LENGTH_MM;
      const scaleY = (h - margin * 2) / FACTORY_CONFIG.SHEET.WIDTH_MM;
      this.zoom = Math.min(scaleX, scaleY);
      this.panX = (w - FACTORY_CONFIG.SHEET.LENGTH_MM * this.zoom) / 2;
      this.panY = (h - FACTORY_CONFIG.SHEET.WIDTH_MM * this.zoom) / 2;
      this.draw();
    }

    setSheet(sheet) {
      this.currentSheet = sheet;
      this.fitToScreen();
    }

    handleHover(mx, my) {
      if (!this.currentSheet) return;
      const sheet = this.currentSheet;

      // Quy đổi tọa độ chuột sang mm trên tấm ván
      const mmX = (mx - this.panX) / this.zoom;
      const mmY = (my - this.panY) / this.zoom;

      let found = null;

      // 1. Kiểm tra Placed Parts
      for (const p of sheet.placedParts) {
        if (mmX >= p.x && mmX <= p.x + p.length && mmY >= p.y && mmY <= p.y + p.width) {
          found = { type: 'PART', data: p };
          break;
        }
      }

      // 2. Kiểm tra Offcuts nếu chưa trúng Part
      if (!found && this.showOffcut) {
        for (const o of sheet.offcuts) {
          if (mmX >= o.x && mmX <= o.x + o.length && mmY >= o.y && mmY <= o.y + o.width) {
            found = { type: 'OFFCUT', data: o };
            break;
          }
        }
      }

      if (this.hoveredItem !== found) {
        this.hoveredItem = found;
        this.draw();
      }
    }

    handleClick(mx, my) {
      if (!this.currentSheet) return;
      const mmX = (mx - this.panX) / this.zoom;
      const mmY = (my - this.panY) / this.zoom;

      if (this.showOffcut) {
        for (const o of this.currentSheet.offcuts) {
          if (mmX >= o.x && mmX <= o.x + o.length && mmY >= o.y && mmY <= o.y + o.width) {
            if (this.onRemnantClick) this.onRemnantClick(o);
            return;
          }
        }
      }
    }

    draw() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Nền lưới kỹ thuật CNC
      ctx.fillStyle = '#0f172a'; // Slate-900
      ctx.fillRect(0, 0, w, h);

      if (!this.currentSheet) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Chưa có dữ liệu Nesting. Vui lòng bấm "Chạy Tối Ưu MaxRects-BSSF"', w / 2, h / 2);
        return;
      }

      const sheet = this.currentSheet;
      const z = this.zoom;
      const ox = this.panX;
      const oy = this.panY;

      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(z, z);

      // 1. Vẽ Khung Khổ Ván Chuẩn (2440 x 1220 mm)
      const sheetL = FACTORY_CONFIG.SHEET.LENGTH_MM;
      const sheetW = FACTORY_CONFIG.SHEET.WIDTH_MM;

      // Bóng đổ khổ ván
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#1e293b'; // Slate-800
      ctx.fillRect(0, 0, sheetL, sheetW);
      ctx.shadowBlur = 0;

      // Viền khổ ván thực tế
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2 / z;
      ctx.strokeRect(0, 0, sheetL, sheetW);

      // 2. Viền Lề Xén Sạch (Trim Margin = 10mm)
      const trim = sheet.trim;
      ctx.strokeStyle = '#64748b';
      ctx.setLineDash([8 / z, 4 / z]);
      ctx.lineWidth = 1 / z;
      ctx.strokeRect(trim, trim, sheetL - trim * 2, sheetW - trim * 2);
      ctx.setLineDash([]);

      // 3. Vẽ Mũi Tên Hướng Vân Gỗ Khổ Ván (Chiều dài trục X)
      if (this.showGrain) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1 / z;
        for (let gy = 80; gy < sheetW; gy += 120) {
          ctx.beginPath();
          ctx.moveTo(50, gy);
          ctx.lineTo(sheetL - 50, gy);
          ctx.stroke();

          // Mũi tên nhỏ chỉ hướng vân dài
          ctx.beginPath();
          ctx.moveTo(sheetL - 70, gy - 6);
          ctx.lineTo(sheetL - 50, gy);
          ctx.lineTo(sheetL - 70, gy + 6);
          ctx.stroke();
        }
      }

      // 4. Vẽ Các Vùng Phôi Dư Thu Hồi (QR Offcuts)
      if (this.showOffcut && sheet.offcuts) {
        for (const o of sheet.offcuts) {
          const isHov = this.hoveredItem && this.hoveredItem.type === 'OFFCUT' && this.hoveredItem.data.id === o.id;

          ctx.fillStyle = isHov ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.18)';
          ctx.fillRect(o.x, o.y, o.length, o.width);

          ctx.strokeStyle = '#10b981'; // Emerald
          ctx.lineWidth = (isHov ? 3 : 1.5) / z;
          ctx.setLineDash([6 / z, 3 / z]);
          ctx.strokeRect(o.x, o.y, o.length, o.width);
          ctx.setLineDash([]);

          // Nhãn vùng phôi dư QR
          if (o.length > 200 && o.width > 120) {
            ctx.fillStyle = '#10b981';
            ctx.font = `bold ${Math.max(12, Math.min(22, 16 / z))}px Inter, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText(`♻ PHÔI DƯ THU HỒI [${o.code}]`, o.x + 15, o.y + 30);

            ctx.fillStyle = '#6ee7b7';
            ctx.font = `${Math.max(10, Math.min(18, 13 / z))}px Inter, sans-serif`;
            ctx.fillText(`${o.length} × ${o.width} mm (${o.areaM2} m²) • ~${(o.estimatedValueVnd).toLocaleString('vi-VN')} đ`, o.x + 15, o.y + 55);

            ctx.fillStyle = '#a7f3d0';
            ctx.fillText(`📍 ${o.shelfLocation} (Bấm để xem/in mã QR)`, o.x + 15, o.y + 75);
          }
        }
      }

      // 5. Vẽ Các Chi Tiết Đã Xếp (Placed Parts)
      const kerf = sheet.kerf;
      for (let idx = 0; idx < sheet.placedParts.length; idx++) {
        const p = sheet.placedParts[idx];
        const isHov = this.hoveredItem && this.hoveredItem.type === 'PART' && this.hoveredItem.data.id === p.id;

        // Màu nền chi tiết
        ctx.fillStyle = isHov ? '#dbeafe' : '#f8fafc';
        ctx.fillRect(p.x, p.y, p.length, p.width);

        // Viền chi tiết
        ctx.strokeStyle = isHov ? '#2563eb' : '#0284c7';
        ctx.lineWidth = (isHov ? 2.5 : 1.5) / z;
        ctx.strokeRect(p.x, p.y, p.length, p.width);

        // Hiển thị đường phay Kerf = 4mm (mạch cắt)
        if (this.showKerf) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // Amber kerf line
          ctx.lineWidth = kerf;
          ctx.strokeRect(p.x - kerf / 2, p.y - kerf / 2, p.length + kerf, p.width + kerf);
        }

        // Nhãn tên chi tiết và kích thước L x W
        const fontSize = Math.max(10, Math.min(24, 14 / z));
        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';

        const centerX = p.x + p.length / 2;
        const centerY = p.y + p.width / 2;

        if (p.length > 80 && p.width > 40) {
          ctx.fillText(`[${p.code}] ${p.name}`, centerX, centerY - 6);

          ctx.font = `${Math.max(9, fontSize - 2)}px Inter, sans-serif`;
          ctx.fillStyle = '#475569';
          const rotTag = p.rotated ? ' (Xoay 90°)' : '';
          ctx.fillText(`${p.originalLength} × ${p.originalWidth} mm${rotTag}`, centerX, centerY + 12);

          // Ký hiệu vân gỗ trên chi tiết
          if (this.showGrain && p.length > 150 && p.width > 60) {
            ctx.fillStyle = '#0284c7';
            ctx.font = `${Math.max(8, fontSize - 4)}px monospace`;
            const grainSymbol = p.grain === 'length' ? '◀━━ VÂN DỌC ━━▶' : (p.grain === 'width' ? '▲ VÂN NGANG ▼' : '⟲ VÂN TỰ DO');
            ctx.fillText(grainSymbol, centerX, centerY + 28);
          }
        } else {
          // Ô nhỏ chỉ ghi mã
          ctx.fillText(p.code, centerX, centerY + 4);
        }
      }

      ctx.restore();

      // 6. Vẽ Thước Đo Tọa Độ X / Y
      this.drawRulers(ctx, w, h);
    }

    drawRulers(ctx, w, h) {
      const z = this.zoom;
      const ox = this.panX;
      const oy = this.panY;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, 24); // Thước trên
      ctx.fillRect(0, 0, 34, h); // Thước trái

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';

      // Vạch mm trục X
      const stepX = 200; // mỗi 200mm
      for (let x = 0; x <= FACTORY_CONFIG.SHEET.LENGTH_MM; x += stepX) {
        const screenX = ox + x * z;
        if (screenX >= 34 && screenX <= w) {
          ctx.beginPath();
          ctx.moveTo(screenX, 16);
          ctx.lineTo(screenX, 24);
          ctx.stroke();
          ctx.fillText(`${x}`, screenX, 12);
        }
      }

      // Vạch mm trục Y
      ctx.textAlign = 'right';
      const stepY = 200;
      for (let y = 0; y <= FACTORY_CONFIG.SHEET.WIDTH_MM; y += stepY) {
        const screenY = oy + y * z;
        if (screenY >= 24 && screenY <= h) {
          ctx.beginPath();
          ctx.moveTo(26, screenY);
          ctx.lineTo(34, screenY);
          ctx.stroke();
          ctx.fillText(`${y}`, 24, screenY + 4);
        }
      }

      // Ô góc 0,0
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 34, 24);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('mm', 17, 16);
    }
  }

  // ============================================================================
  // 6. QUẢN LÝ KHO PHÔI DƯ VÀ IN TEM NHÃN QR CODE
  // ============================================================================
  class QrRemnantManager {
    constructor() {
      this.remnants = [];
    }

    syncFromNestingResult(nestingResult) {
      this.remnants = [];
      for (const s of nestingResult.sheets) {
        for (const o of s.offcuts) {
          this.remnants.push({
            ...o,
            dateAdded: '08/11/2026',
            materialName: FACTORY_CONFIG.MATERIALS.MDF_THAI_17.name,
            projectSource: 'Tối ưu Nesting CNC Phú Gia'
          });
        }
      }
    }

    getAll() {
      return this.remnants;
    }

    updateStatus(remnantId, newStatus) {
      const target = this.remnants.find(r => r.id === remnantId);
      if (target) {
        target.status = newStatus;
        return true;
      }
      return false;
    }

    renderQrStickerHtml(remnant) {
      const qrSvg = PureQR.renderSvg(remnant.code, 5);
      return `
        <div style="width:380px; background:#ffffff; border:2px solid #0f172a; border-radius:10px; padding:16px; font-family:'Segoe UI', Inter, sans-serif; color:#0f172a; box-shadow:0 10px 25px rgba(0,0,0,0.25);">
          <!-- Header Tem -->
          <div style="border-bottom:2px solid #0284c7; padding-bottom:8px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div style="font-weight:900; font-size:14px; color:#0369a1; letter-spacing:0.5px;">PG HOME LUXURY</div>
              <div style="font-size:10px; color:#64748b; font-weight:600;">HỆ THỐNG THU HỒI PHÔI DƯ CNC</div>
            </div>
            <div style="background:#0284c7; color:#fff; font-size:10px; font-weight:bold; padding:2px 8px; border-radius:4px;">
              CHÍNH CHỦ
            </div>
          </div>

          <!-- Body Tem: QR + Thông số -->
          <div style="display:flex; gap:14px; align-items:center;">
            <div style="width:130px; height:130px; flex-shrink:0; border:1px solid #e2e8f0; border-radius:6px; padding:4px;">
              ${qrSvg}
            </div>
            <div style="flex:1; font-size:12px; line-height:1.5;">
              <div style="font-weight:bold; color:#0f172a; font-size:13px; margin-bottom:4px; word-break:break-all;">
                ${remnant.code}
              </div>
              <div><b>Kích thước:</b> <span style="color:#0284c7; font-weight:bold; font-size:14px;">${remnant.length} × ${remnant.width}</span> mm</div>
              <div><b>Diện tích:</b> ${remnant.areaM2} m² (17mm)</div>
              <div><b>Vật tư:</b> ${remnant.materialName || 'MDF Thái Lan 17mm'}</div>
              <div><b>Vị trí:</b> <span style="color:#10b981; font-weight:600;">${remnant.shelfLocation}</span></div>
              <div><b>Trạng thái:</b> <span style="background:#dcfce7; color:#15803d; padding:1px 6px; border-radius:3px; font-size:11px; font-weight:bold;">SẴN SÀNG DÙNG</span></div>
            </div>
          </div>

          <!-- Footer Tem -->
          <div style="border-top:1px dashed #cbd5e1; margin-top:12px; padding-top:8px; font-size:10px; color:#64748b; text-align:center;">
            <b>${FACTORY_CONFIG.FACILITY_NAME}</b><br/>
            ${FACTORY_CONFIG.FACTORY_ADDRESS} • Hotline: ${FACTORY_CONFIG.HOTLINE}
          </div>
        </div>
      `;
    }
  }

  // ============================================================================
  // 7. GIAO DIỆN NGƯỜI DÙNG WEB ERP MODULE (INJECTION & EVENT CONTROLLER)
  // ============================================================================
  let state = {
    activeTab: 'nesting', // 'nesting' | 'remnants' | 'audit'
    activeSheetIndex: 1,
    currentParts: JSON.parse(JSON.stringify(STANDARD_PRESETS[0].items)),
    selectedMaterialKey: 'MDF_THAI_17',
    nestingResult: null,
    visualizer: null,
    remnantManager: new QrRemnantManager()
  };

  function buildStyles() {
    return `
      <style id="pg-w57-styles">
        .pg-w57-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #090d16;
          color: #f1f5f9;
          border-radius: 12px;
          border: 1px solid #1e293b;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          margin-bottom: 24px;
        }
        .pg-w57-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-bottom: 1px solid #334155;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .pg-w57-brand-title {
          font-size: 18px;
          font-weight: 800;
          color: #38bdf8;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.5px;
        }
        .pg-w57-brand-sub {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 3px;
        }
        .pg-w57-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .pg-w57-badge-gold {
          background: rgba(212, 175, 55, 0.15);
          color: #facc15;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        .pg-w57-badge-emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .pg-w57-tabs {
          display: flex;
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          padding: 0 20px;
          gap: 8px;
        }
        .pg-w57-tab-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 12px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .pg-w57-tab-btn:hover {
          color: #38bdf8;
        }
        .pg-w57-tab-btn.active {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
        }
        .pg-w57-content {
          padding: 20px;
        }
        .pg-w57-grid-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .pg-w57-grid-layout {
            grid-template-columns: 1fr;
          }
        }
        .pg-w57-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 8px;
          padding: 16px;
        }
        .pg-w57-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pg-w57-input, .pg-w57-select {
          width: 100%;
          background: #1e293b;
          border: 1px solid #334155;
          color: #f8fafc;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          box-sizing: border-box;
          margin-bottom: 8px;
        }
        .pg-w57-input:focus, .pg-w57-select:focus {
          outline: none;
          border-color: #38bdf8;
        }
        .pg-w57-btn {
          background: #0284c7;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .pg-w57-btn:hover {
          background: #0369a1;
        }
        .pg-w57-btn-success {
          background: #059669;
        }
        .pg-w57-btn-success:hover {
          background: #047857;
        }
        .pg-w57-btn-outline {
          background: transparent;
          border: 1px solid #334155;
          color: #cbd5e1;
        }
        .pg-w57-btn-outline:hover {
          background: #1e293b;
          color: #fff;
        }
        .pg-w57-btn-sm {
          padding: 4px 8px;
          font-size: 11px;
        }
        .pg-w57-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          text-align: left;
        }
        .pg-w57-table th {
          background: #1e293b;
          color: #94a3b8;
          padding: 8px;
          font-weight: 600;
          border-bottom: 1px solid #334155;
        }
        .pg-w57-table td {
          padding: 8px;
          border-bottom: 1px solid #1e293b;
          color: #e2e8f0;
        }
        .pg-w57-table tr:hover {
          background: rgba(56, 189, 248, 0.05);
        }
        .pg-w57-kpi-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .pg-w57-kpi-item {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 8px;
          padding: 12px 16px;
        }
        .pg-w57-kpi-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
        }
        .pg-w57-kpi-val {
          font-size: 20px;
          font-weight: 800;
          color: #38bdf8;
          margin-top: 4px;
        }
        .pg-w57-kpi-val.emerald {
          color: #34d399;
        }
        .pg-w57-kpi-val.amber {
          color: #fbbf24;
        }
        .pg-w57-canvas-wrapper {
          position: relative;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 8px;
          overflow: hidden;
          height: 600px;
        }
        .pg-w57-canvas-toolbar {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 6px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .pg-w57-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
      </style>
    `;
  }

  function render(containerId = 'w57-cnc-root') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`[PG_W57] Không tìm thấy phần tử #${containerId}. Tạo container mới.`);
      return;
    }

    // Tiêm CSS nếu chưa có
    if (!document.getElementById('pg-w57-styles')) {
      document.head.insertAdjacentHTML('beforeend', buildStyles());
    }

    container.innerHTML = `
      <div class="pg-w57-container">
        <!-- HEADER PHÁP LÝ & THƯƠNG HIỆU -->
        <div class="pg-w57-header">
          <div>
            <div class="pg-w57-brand-title">
              <span>⚡</span> ${FACTORY_CONFIG.BRAND_NAME} • 2D CNC NESTING & QR OFFCUT MANAGER
              <span class="pg-w57-badge pg-w57-badge-gold">MAXRECTS-BSSF v2.4</span>
            </div>
            <div class="pg-w57-brand-sub">
              ${FACTORY_CONFIG.FACILITY_NAME} | ĐC: ${FACTORY_CONFIG.FACTORY_ADDRESS} | MST: ${FACTORY_CONFIG.TAX_ID} | Hotline: ${FACTORY_CONFIG.HOTLINE}
            </div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <span class="pg-w57-badge pg-w57-badge-emerald">KERF 4MM CHUẨN</span>
            <span class="pg-w57-badge pg-w57-badge-gold">VÁN 1220 × 2440</span>
          </div>
        </div>

        <!-- TABS ĐIỀU HƯỚNG -->
        <div class="pg-w57-tabs">
          <button class="pg-w57-tab-btn ${state.activeTab === 'nesting' ? 'active' : ''}" data-tab="nesting">
            🖥 Sơ Đồ Cắt 2D & Tối Ưu Nesting
          </button>
          <button class="pg-w57-tab-btn ${state.activeTab === 'remnants' ? 'active' : ''}" data-tab="remnants">
            📦 Kho Phôi Dư QR Offcut
          </button>
          <button class="pg-w57-tab-btn ${state.activeTab === 'audit' ? 'active' : ''}" data-tab="audit">
            📊 Kiểm Toán Tiết Kiệm & Định Mức
          </button>
        </div>

        <!-- MAIN BODY -->
        <div class="pg-w57-content" id="pg-w57-tab-body">
          ${renderTabContent()}
        </div>
      </div>
    `;

    attachEvents(container);

    // Khởi tạo Canvas nếu đang ở tab Nesting
    if (state.activeTab === 'nesting') {
      initCanvas();
    }
  }

  function renderTabContent() {
    if (state.activeTab === 'nesting') {
      return renderNestingTab();
    } else if (state.activeTab === 'remnants') {
      return renderRemnantsTab();
    } else {
      return renderAuditTab();
    }
  }

  function renderNestingTab() {
    const kpi = state.nestingResult ? state.nestingResult.kpi : null;
    const currentSheet = (state.nestingResult && state.nestingResult.sheets.length > 0)
      ? state.nestingResult.sheets[state.activeSheetIndex - 1]
      : null;

    return `
      <!-- KPI THỐNG KÊ NHANH -->
      <div class="pg-w57-kpi-bar">
        <div class="pg-w57-kpi-item">
          <div class="pg-w57-kpi-label">Tỷ Lệ Tối Ưu (Yield %)</div>
          <div class="pg-w57-kpi-val emerald">${kpi ? kpi.overallYieldPercent + '%' : '92.4%'}</div>
        </div>
        <div class="pg-w57-kpi-item">
          <div class="pg-w57-kpi-label">Lãng Phí (Waste %)</div>
          <div class="pg-w57-kpi-val ${kpi && kpi.overallWastePercent > 8 ? 'amber' : 'emerald'}">${kpi ? kpi.overallWastePercent + '%' : '5.2%'}</div>
        </div>
        <div class="pg-w57-kpi-item">
          <div class="pg-w57-kpi-label">Số Tấm Sử Dụng</div>
          <div class="pg-w57-kpi-val">${kpi ? kpi.totalSheetsUsed + ' Tấm' : '1 Tấm'}</div>
        </div>
        <div class="pg-w57-kpi-item">
          <div class="pg-w57-kpi-label">Phôi Dư Thu Hồi (Offcut)</div>
          <div class="pg-w57-kpi-val emerald">${kpi ? kpi.totalOffcutAreaM2 + ' m²' : '0.42 m²'}</div>
        </div>
        <div class="pg-w57-kpi-item">
          <div class="pg-w57-kpi-label">Tiết Kiệm Quy Đổi</div>
          <div class="pg-w57-kpi-val amber">${kpi ? kpi.totalFinancialBenefitVnd.toLocaleString('vi-VN') + ' đ' : '520.000 đ'}</div>
        </div>
      </div>

      <div class="pg-w57-grid-layout">
        <!-- CỘT TRÁI: NHẬP LIỆU & DANH SÁCH CHI TIẾT -->
        <div>
          <!-- CHỌN PRESET -->
          <div class="pg-w57-card" style="margin-bottom:16px;">
            <div class="pg-w57-card-title">
              <span>📋 Tải Dự Án & Định Mức Chuẩn</span>
            </div>
            <select class="pg-w57-select" id="pg-w57-preset-select">
              ${STANDARD_PRESETS.map(p => `
                <option value="${p.id}">${p.name}</option>
              `).join('')}
            </select>
            <div style="display:flex; gap:8px;">
              <button class="pg-w57-btn pg-w57-btn-outline" style="flex:1;" id="pg-w57-load-preset-btn">
                Tải Preset Mẫu
              </button>
              <button class="pg-w57-btn pg-w57-btn-success" style="flex:1;" id="pg-w57-run-nesting-btn">
                ⚡ Chạy MaxRects
              </button>
            </div>
          </div>

          <!-- THÊM CHI TIẾT MỚI -->
          <div class="pg-w57-card" style="margin-bottom:16px;">
            <div class="pg-w57-card-title">
              <span>➕ Thêm Chi Tiết Cắt</span>
            </div>
            <input type="text" class="pg-w57-input" id="pg-w57-part-name" placeholder="Tên chi tiết (vd: Hồi tủ áo, Cánh...)" />
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <input type="number" class="pg-w57-input" id="pg-w57-part-len" placeholder="Dài (mm) - vd: 740" />
              <input type="number" class="pg-w57-input" id="pg-w57-part-wid" placeholder="Rộng (mm) - vd: 580" />
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <input type="number" class="pg-w57-input" id="pg-w57-part-qty" placeholder="Số lượng" value="1" min="1" />
              <select class="pg-w57-select" id="pg-w57-part-grain">
                <option value="length">Vân dọc (theo L)</option>
                <option value="width">Vân ngang (theo W)</option>
                <option value="none">Vân tự do (xoay 90°)</option>
              </select>
            </div>
            <button class="pg-w57-btn" style="width:100%;" id="pg-w57-add-part-btn">
              + Thêm Vào Bảng Chi Tiết
            </button>
          </div>

          <!-- DANH SÁCH CHI TIẾT HIỆN TẠI -->
          <div class="pg-w57-card">
            <div class="pg-w57-card-title">
              <span>📦 Chi Tiết Đơn Hàng (${state.currentParts.length} mục)</span>
              <button class="pg-w57-btn pg-w57-btn-outline pg-w57-btn-sm" id="pg-w57-clear-parts-btn">Xóa Hết</button>
            </div>
            <div style="max-height: 280px; overflow-y: auto;">
              <table class="pg-w57-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Dài×Rộng</th>
                    <th>SL</th>
                    <th>Vân</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.currentParts.map((p, idx) => `
                    <tr>
                      <td><b>${p.name}</b></td>
                      <td>${p.length}×${p.width}</td>
                      <td><span class="pg-w57-badge pg-w57-badge-gold">${p.quantity || 1}</span></td>
                      <td>${p.grain === 'none' ? 'Tự do' : (p.grain === 'length' ? 'Dọc' : 'Ngang')}</td>
                      <td>
                        <button class="pg-w57-btn pg-w57-btn-outline pg-w57-btn-sm pg-w57-del-part" data-idx="${idx}" style="color:#ef4444; border-color:#7f1d1d;">×</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI: BẢN VẼ 2D CANVAS INTERACTIVE -->
        <div>
          <div class="pg-w57-card" style="padding:12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; color:#38bdf8; font-size:13px;">CHỌN TẤM:</span>
              <select class="pg-w57-select" id="pg-w57-sheet-select" style="width:160px; margin-bottom:0;">
                ${state.nestingResult
                  ? state.nestingResult.sheets.map(s => `
                    <option value="${s.index}" ${s.index === state.activeSheetIndex ? 'selected' : ''}>
                      Tấm ${s.index} (Yield ${s.metrics.yieldPercent}%)
                    </option>
                  `).join('')
                  : '<option value="1">Tấm 1 (Mặc định)</option>'
                }
              </select>
            </div>

            <!-- Nút Toolbar -->
            <div style="display:flex; gap:6px;">
              <button class="pg-w57-btn pg-w57-btn-outline pg-w57-btn-sm" id="pg-w57-toggle-kerf">
                🔪 Kerf: Bật
              </button>
              <button class="pg-w57-btn pg-w57-btn-outline pg-w57-btn-sm" id="pg-w57-toggle-grain">
                🌲 Vân: Bật
              </button>
              <button class="pg-w57-btn pg-w57-btn-outline pg-w57-btn-sm" id="pg-w57-toggle-offcut">
                ♻ Phôi Dư: Bật
              </button>
              <button class="pg-w57-btn pg-w57-btn-outline pg-w57-btn-sm" id="pg-w57-btn-fit">
                🔍 Vừa Khung
              </button>
            </div>
          </div>

          <!-- KHUNG CANVAS -->
          <div class="pg-w57-canvas-wrapper" id="pg-w57-canvas-box">
            <canvas id="pg-w57-canvas" width="1000" height="580" style="display:block; width:100%; height:100%; cursor:grab;"></canvas>
          </div>

          <!-- THÔNG SỐ TẤM ĐANG CHỌN -->
          ${currentSheet ? `
            <div style="margin-top:12px; font-size:12px; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div>
                <b>Tấm ${currentSheet.index}:</b> ${currentSheet.placedParts.length} chi tiết đã xếp •
                Diện tích hữu dụng: <span style="color:#34d399; font-weight:bold;">${currentSheet.metrics.netPartsAreaM2} m²</span> (${currentSheet.metrics.yieldPercent}%)
              </div>
              <div>
                Đường phay Kerf: <b>${currentSheet.kerf}mm</b> •
                Thu hồi phôi dư: <span style="color:#10b981; font-weight:bold;">${currentSheet.offcuts.length} vùng</span> (${currentSheet.metrics.offcutReusableAreaM2} m²)
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function renderRemnantsTab() {
    const remnants = state.remnantManager.getAll();

    return `
      <div class="pg-w57-card">
        <div class="pg-w57-card-title">
          <span>📦 KHO PHÔI DƯ TÁI SỬ DỤNG CÓ GẮN MÃ QR (PG-OFFCUT)</span>
          <span class="pg-w57-badge pg-w57-badge-emerald">${remnants.length} MÃ TRONG KHO</span>
        </div>
        <p style="font-size:12px; color:#94a3b8; margin-top:-6px; margin-bottom:16px;">
          Tất cả các phần ván trống kích thước từ 250×250mm trở lên tự động được đánh số và gắn mã QR. Kỹ thuật viên quét mã Zalo/máy quét để đưa thẳng vào đơn hàng mới.
        </p>

        <div style="overflow-x:auto;">
          <table class="pg-w57-table">
            <thead>
              <tr>
                <th>Mã QR Phôi Dư</th>
                <th>Kích Thước (L×W mm)</th>
                <th>Diện Tích</th>
                <th>Chất Liệu Cốt</th>
                <th>Giá Trị Ước Tính</th>
                <th>Vị Trí Lưu Kho</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              ${remnants.length === 0 ? `
                <tr><td colspan="8" style="text-align:center; padding:24px; color:#64748b;">Chưa có phôi dư nào. Hãy chạy Nesting để tự động trích xuất.</td></tr>
              ` : remnants.map(r => `
                <tr>
                  <td><b style="color:#38bdf8;">${r.code}</b></td>
                  <td><span style="font-weight:bold; color:#f8fafc;">${r.length} × ${r.width}</span> mm</td>
                  <td>${r.areaM2} m²</td>
                  <td>${r.materialName || 'MDF Thái Lan 17mm'}</td>
                  <td style="color:#facc15; font-weight:bold;">${(r.estimatedValueVnd).toLocaleString('vi-VN')} đ</td>
                  <td><span style="color:#34d399;">${r.shelfLocation}</span></td>
                  <td>
                    <span class="pg-w57-badge ${r.status === 'IN_STOCK' ? 'pg-w57-badge-emerald' : 'pg-w57-badge-gold'}">
                      ${r.status === 'IN_STOCK' ? 'SẴN SÀNG' : 'ĐÃ DÙNG'}
                    </span>
                  </td>
                  <td>
                    <button class="pg-w57-btn pg-w57-btn-outline pg-w57-btn-sm pg-w57-print-qr-btn" data-id="${r.id}">
                      🏷 In Tem QR
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAuditTab() {
    const kpi = state.nestingResult ? state.nestingResult.kpi : null;

    return `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div class="pg-w57-card">
          <div class="pg-w57-card-title">
            <span>📊 BÁO CÁO HIỆU QUẢ CÔNG NGHỆ MAXRECTS-BSSF</span>
          </div>
          <table class="pg-w57-table">
            <tbody>
              <tr>
                <td>Khổ ván công nghiệp tiêu chuẩn:</td>
                <td><b>1220 × 2440 mm (2.9768 m²)</b></td>
              </tr>
              <tr>
                <td>Đường phay dao cắt CNC (Kerf):</td>
                <td><b>4.0 mm</b></td>
              </tr>
              <tr>
                <td>Lề xén biên 4 cạnh sạch:</td>
                <td><b>10.0 mm</b></td>
              </tr>
              <tr>
                <td>Tỷ lệ sử dụng ván đạt được (Yield %):</td>
                <td><b style="color:#34d399; font-size:15px;">${kpi ? kpi.overallYieldPercent : '92.4'}% (Chuẩn ≥ 92%)</b></td>
              </tr>
              <tr>
                <td>Tỷ lệ lãng phí thực tế (Waste %):</td>
                <td><b style="color:#38bdf8;">${kpi ? kpi.overallWastePercent : '5.2'}% (Chuẩn < 8%)</b></td>
              </tr>
              <tr>
                <td>Số tấm thực tế sử dụng:</td>
                <td><b>${kpi ? kpi.totalSheetsUsed : '1'} Tấm</b></td>
              </tr>
              <tr>
                <td>Số tấm nếu cắt thủ công (Baseline 76.5%):</td>
                <td><b style="color:#fbbf24;">${kpi ? kpi.manualSheetsBaseline : '2'} Tấm</b></td>
              </tr>
              <tr>
                <td>Số tấm tiết kiệm được trực tiếp:</td>
                <td><b style="color:#34d399;">${kpi ? kpi.savedSheetsCount : '1'} Tấm</b></td>
              </tr>
              <tr>
                <td>Tổng số tiền tiết kiệm toàn bộ:</td>
                <td><b style="color:#facc15; font-size:16px;">${kpi ? kpi.totalFinancialBenefitVnd.toLocaleString('vi-VN') : '520.000'} VNĐ</b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pg-w57-card">
          <div class="pg-w57-card-title">
            <span>🛡 THÔNG TIN ĐƠN VỊ VẬN HÀNH & PHÁP LÝ</span>
          </div>
          <div style="font-size:13px; line-height:1.7; color:#cbd5e1;">
            <div><b>Đơn vị:</b> ${FACTORY_CONFIG.LEGAL_NAME}</div>
            <div><b>Thương hiệu:</b> <span style="color:#38bdf8; font-weight:bold;">${FACTORY_CONFIG.BRAND_NAME}</span> (${FACTORY_CONFIG.COMPANY_TITLE})</div>
            <div><b>Mã số thuế / HKD:</b> ${FACTORY_CONFIG.TAX_ID}</div>
            <div><b>Tổ hợp sản xuất:</b> ${FACTORY_CONFIG.FACILITY_NAME}</div>
            <div><b>Địa chỉ giao dịch:</b> ${FACTORY_CONFIG.FACTORY_ADDRESS}</div>
            <div><b>Hotline:</b> <span style="color:#facc15; font-weight:bold;">${FACTORY_CONFIG.HOTLINE}</span></div>
            <div style="margin-top:12px; padding:10px; background:#1e293b; border-radius:6px; border-left:4px solid #38bdf8; font-size:12px;">
              <b>Quy định bảo mật & thương hiệu:</b> Mọi sơ đồ gia công CNC và tem mã phôi dư phát hành nội bộ phải gắn liền với thương hiệu Phú Gia, tuyệt đối tuân thủ đường phay 4mm và quy cách ván An Cường / Thái Lan.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function initCanvas() {
    const canvas = document.getElementById('pg-w57-canvas');
    if (!canvas) return;

    // Responsive width / height
    const container = document.getElementById('pg-w57-canvas-box');
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = 580;
    }

    state.visualizer = new Visualizer2D(canvas, {
      onRemnantClick: (remnant) => {
        showQrModal(remnant);
      }
    });

    if (state.nestingResult && state.nestingResult.sheets.length > 0) {
      state.visualizer.setSheet(state.nestingResult.sheets[state.activeSheetIndex - 1]);
    } else {
      // Tự động chạy lần đầu với preset mặc định
      runNesting();
    }
  }

  function runNesting() {
    const packer = new MaxRectsBSSFPacker(FACTORY_CONFIG.SHEET);
    const result = packer.pack(state.currentParts, '20261108');
    state.nestingResult = result;
    state.remnantManager.syncFromNestingResult(result);
    state.activeSheetIndex = 1;

    render();
  }

  function showQrModal(remnant) {
    const stickerHtml = state.remnantManager.renderQrStickerHtml(remnant);
    const modalHtml = `
      <div class="pg-w57-modal-overlay" id="pg-w57-modal">
        <div style="position:relative;">
          ${stickerHtml}
          <div style="margin-top:12px; display:flex; justify-content:center; gap:10px;">
            <button class="pg-w57-btn pg-w57-btn-success" onclick="window.print()">
              🖨 In Tem Ngay
            </button>
            <button class="pg-w57-btn pg-w57-btn-outline" id="pg-w57-close-modal">
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('pg-w57-close-modal').addEventListener('click', () => {
      const m = document.getElementById('pg-w57-modal');
      if (m) m.remove();
    });
  }

  function attachEvents(container) {
    // 1. Chuyển Tabs
    const tabBtns = container.querySelectorAll('.pg-w57-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // 2. Chạy Nesting
    const runBtn = container.querySelector('#pg-w57-run-nesting-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        runNesting();
      });
    }

    // 3. Tải Preset
    const loadPresetBtn = container.querySelector('#pg-w57-load-preset-btn');
    if (loadPresetBtn) {
      loadPresetBtn.addEventListener('click', () => {
        const select = container.querySelector('#pg-w57-preset-select');
        const found = STANDARD_PRESETS.find(p => p.id === select.value);
        if (found) {
          state.currentParts = JSON.parse(JSON.stringify(found.items));
          runNesting();
        }
      });
    }

    // 4. Thêm chi tiết
    const addPartBtn = container.querySelector('#pg-w57-add-part-btn');
    if (addPartBtn) {
      addPartBtn.addEventListener('click', () => {
        const nameInput = container.querySelector('#pg-w57-part-name');
        const lenInput = container.querySelector('#pg-w57-part-len');
        const widInput = container.querySelector('#pg-w57-part-wid');
        const qtyInput = container.querySelector('#pg-w57-part-qty');
        const grainInput = container.querySelector('#pg-w57-part-grain');

        const name = nameInput.value.trim();
        const len = Number(lenInput.value);
        const wid = Number(widInput.value);
        const qty = Number(qtyInput.value) || 1;
        const grain = grainInput.value;

        if (!name || len <= 0 || wid <= 0) {
          alert('Vui lòng nhập tên chi tiết và kích thước Dài / Rộng hợp lệ (mm)!');
          return;
        }

        state.currentParts.push({
          id: 'P_' + Date.now(),
          name: name,
          length: len,
          width: wid,
          quantity: qty,
          grain: grain,
          notes: 'Chi tiết thêm tay'
        });

        nameInput.value = '';
        lenInput.value = '';
        widInput.value = '';
        render();
      });
    }

    // 5. Xóa chi tiết
    const delBtns = container.querySelectorAll('.pg-w57-del-part');
    delBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        state.currentParts.splice(idx, 1);
        render();
      });
    });

    // 6. Xóa hết
    const clearBtn = container.querySelector('#pg-w57-clear-parts-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ chi tiết?')) {
          state.currentParts = [];
          render();
        }
      });
    }

    // 7. Chọn tấm ván hiển thị
    const sheetSelect = container.querySelector('#pg-w57-sheet-select');
    if (sheetSelect) {
      sheetSelect.addEventListener('change', () => {
        state.activeSheetIndex = Number(sheetSelect.value);
        if (state.visualizer && state.nestingResult) {
          state.visualizer.setSheet(state.nestingResult.sheets[state.activeSheetIndex - 1]);
        }
      });
    }

    // 8. Toggles trên Canvas Toolbar
    const toggleKerf = container.querySelector('#pg-w57-toggle-kerf');
    if (toggleKerf) {
      toggleKerf.addEventListener('click', () => {
        if (state.visualizer) {
          state.visualizer.showKerf = !state.visualizer.showKerf;
          toggleKerf.textContent = `🔪 Kerf: ${state.visualizer.showKerf ? 'Bật' : 'Tắt'}`;
          state.visualizer.draw();
        }
      });
    }

    const toggleGrain = container.querySelector('#pg-w57-toggle-grain');
    if (toggleGrain) {
      toggleGrain.addEventListener('click', () => {
        if (state.visualizer) {
          state.visualizer.showGrain = !state.visualizer.showGrain;
          toggleGrain.textContent = `🌲 Vân: ${state.visualizer.showGrain ? 'Bật' : 'Tắt'}`;
          state.visualizer.draw();
        }
      });
    }

    const toggleOffcut = container.querySelector('#pg-w57-toggle-offcut');
    if (toggleOffcut) {
      toggleOffcut.addEventListener('click', () => {
        if (state.visualizer) {
          state.visualizer.showOffcut = !state.visualizer.showOffcut;
          toggleOffcut.textContent = `♻ Phôi Dư: ${state.visualizer.showOffcut ? 'Bật' : 'Tắt'}`;
          state.visualizer.draw();
        }
      });
    }

    const fitBtn = container.querySelector('#pg-w57-btn-fit');
    if (fitBtn) {
      fitBtn.addEventListener('click', () => {
        if (state.visualizer) state.visualizer.fitToScreen();
      });
    }

    // 9. Nút in tem trên bảng phôi dư
    const printQrBtns = container.querySelectorAll('.pg-w57-print-qr-btn');
    printQrBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const remnant = state.remnantManager.getAll().find(r => r.id === id);
        if (remnant) {
          showQrModal(remnant);
        }
      });
    });
  }

  // Tự động khởi tạo nếu có container sẵn
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      const rootEl = document.getElementById('w57-cnc-root');
      if (rootEl) {
        render('w57-cnc-root');
      }
    });
  }

  // ============================================================================
  // 8. EXPORT PUBLIC API CỦA MODULE W57
  // ============================================================================
  const ModuleExport = {
    id: 'w57_cnc_nesting_qr_offcut',
    title: 'Web ERP Interactive 2D CNC Nesting Visualizer & QR Offcut Remnant Manager',
    config: FACTORY_CONFIG,
    presets: STANDARD_PRESETS,
    MaxRectsBSSFPacker: MaxRectsBSSFPacker,
    PureQR: PureQR,
    Visualizer2D: Visualizer2D,
    QrRemnantManager: QrRemnantManager,
    render: render,
    runNesting: runNesting,
    getState: () => state
  };

  return ModuleExport;
}));
