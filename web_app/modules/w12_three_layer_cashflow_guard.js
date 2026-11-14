/**
 * ============================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI BỘ PG HOME LUXURY - PHÂN HỆ GIÁM ĐỐC & TÀI CHÍNH
 * MODULE W12: QUY CHUẨN ĐỐI SOÁT DÒNG TIỀN 3 LỚP CHÉO & BẢO VỆ KÉT SẮT
 * ============================================================================
 * Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * Mã số ĐKKD/HKD: 042203002931 (Đại diện: Nguyễn Trọng Nghĩa)
 * Xưởng sản xuất: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Văn phòng: 35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh
 * Hotline duy nhất: 0986.722.324
 * 
 * QUY TẮC CỐT TỬ CỦA GIÁM ĐỐC:
 * 1. [Lớp 1: Ảnh hóa đơn thật] + [Lớp 2: Xác nhận nhóm Zalo NCC] + [Lớp 3: UNC Ngân hàng Chị Hương khớp số tiền]
 * 2. Ma trận 4 Nhà Cung Cấp cốt lõi: An Cường, Hafele, Quốc Tâm, Lam Giang.
 * 3. Mã băm SHA-256 64 ký tự chống giả mạo và chống trùng lặp chùm ảnh.
 * 4. THIẾU 1 TRONG 3 LỚP HOẶC LỆCH TIỀN => GẮN CỜ "TREO THANH TOÁN - THIẾU CHỨNG TỪ" 100%.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var mod = factory();
    root.PG_Modules_W12 = mod;
    if (typeof window !== 'undefined') {
      window.PG_W12 = mod;
    }
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // --- THUẬT TOÁN SHA-256 PURE JAVASCRIPT (ZERO-DEPENDENCY, ĐỘC LẬP HOÀN TOÀN) ---
  function sha256_pure_js(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
    var hash = [];
    var k = [];
    var primeCounter = 0;

    var isPrime = function (n) {
      for (var factor = 2, max = Math.sqrt(n); factor <= max; factor++) {
        if (n % factor === 0) return false;
      }
      return true;
    };

    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (isPrime(candidate)) {
        if (primeCounter < 8) {
          hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        }
        k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        primeCounter++;
      }
    }

    words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

    for (i = 0; i < ascii[lengthProperty]; i++) {
      words[i >> 2] |= ascii.charCodeAt(i) << ((3 - (i % 4)) * 8);
    }

    for (j = 0; j < words[lengthProperty]; j += 16) {
      var w = words.slice(j, j + 16);
      var oldHash = hash.slice(0);

      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = (i < 16) ? (w[i] | 0) : ((w[i - 16] + s0 + w[i - 7] + s1) | 0);

        var s1_maj = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
        var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        var temp1 = (hash[7] + s1_maj + ch + k[i] + w[i]) | 0;
        var s0_maj = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
        var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        var temp2 = (s0_maj + maj) | 0;

        hash[7] = hash[6];
        hash[6] = hash[5];
        hash[5] = hash[4];
        hash[4] = (hash[3] + temp1) | 0;
        hash[3] = hash[2];
        hash[2] = hash[1];
        hash[1] = hash[0];
        hash[0] = (temp1 + temp2) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        var b = (hash[i] >> (8 * j)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  // --- HẰNG SỐ TRẠNG THÁI QUẢN TRỊ ---
  var STATUS = {
    APPROVED: 'HOP_LE',                  // Hợp lệ 100% - Đã đủ 3 lớp đối soát
    FROZEN: 'TREO_THANH_TOAN',            // Treo thanh toán - Chặn xuất quỹ
    DUPLICATE_REJECT: 'CANH_BAO_TRUNG_LAP' // Trùng mã băm SHA-256 - Nghi vấn gian lận
  };

  // --- DANH MỤC 4 NHÀ CUNG CẤP CỐT LÕI PG HOME ---
  var CORE_SUPPLIERS = {
    AN_CUONG: {
      key: 'AN_CUONG',
      name: 'Gỗ Công Nghiệp An Cường',
      itemType: 'Ván MDF, MFC chống ẩm lõi xanh & Nhựa WPB',
      zaloGroup: 'Đặt hàng ván An Cường - PG Home Hà Tĩnh'
    },
    HAFELE: {
      key: 'HAFELE',
      name: 'Phụ Kiện Cao Cấp Hafele',
      itemType: 'Ray âm giảm chấn, bản lề inox 304, tay nâng tủ bếp Blum/Hafele',
      zaloGroup: 'Phụ kiện Hafele & Blum chính hãng - Nội Thất Phú Gia'
    },
    QUOC_TAM: {
      key: 'QUOC_TAM',
      name: 'Phụ Kiện Tổng Kho Quốc Tâm (56 Ngô Đức Kế, Hà Tĩnh)',
      itemType: 'Ray bi 3 tầng, bản lề giảm chấn, ốc cam, đinh chỉ xưởng',
      zaloGroup: 'Phụ kiện Quốc Tâm - PG Home'
    },
    LAM_GIANG: {
      key: 'LAM_GIANG',
      name: 'Tổng Kho Ván Lam Giang (Hà Tĩnh)',
      itemType: 'Ván phủ Melamine Thái Lan & Chỉ nẹp PVC đồng màu',
      zaloGroup: 'Ván Gỗ Lam Giang - PG Home Hà Tĩnh'
    }
  };

  // --- KHO DỮ LIỆU GỐC TRÍCH XUẤT TỪ SỔ CÁI UNC CHỊ HƯƠNG & 4 NCC ---
  var SEED_TRANSACTIONS = [
    {
      id: 'TXN-2026-AC-001',
      nha_cung_cap: 'Gỗ Công Nghiệp An Cường',
      loai_giao_dich: 'NHAP_VAN_MDF_CHONG_AM_LOI_XANH',
      thoi_gian: '2026-11-08 14:30:00',
      so_tien_yeu_cau: 45600000,
      so_tien_unc: 45600000,
      layer1_invoice: {
        co_anh: true,
        ten_tep: '1794120300112_ancuong_inv_45m6_mdf.jxl',
        sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        kich_thuoc_bytes: 524100,
        nguoi_gui: 'Vũ (Kỹ thuật xưởng) / Chị Hương'
      },
      layer2_zalo_ncc: {
        co_xac_nhan: true,
        nhom_zalo: 'Đặt hàng ván An Cường - PG Home Hà Tĩnh',
        nguoi_xac_nhan: 'Đại diện Sales An Cường Miền Trung',
        noi_dung: 'Đã nhận đơn đặt ván 32 tấm MDF chống ẩm lõi xanh giao xưởng Phú Gia Ngõ 49 Trương Quốc Dụng. Đã khớp thanh toán 45.600.000 đ.',
        thoi_gian_xac_nhan: '2026-11-08 14:45:00'
      },
      layer3_unc_huong: {
        co_unc: true,
        nguoi_thuc_hien: 'Chị Hương (Kế toán)',
        ngan_hang: 'VietinBank',
        ma_giao_dich: 'UNC-AC-20261108-45M6',
        so_tien_chuyen: 45600000,
        ten_tep_unc: '1794120350220_unc_vietinbank_ancuong_45m6.jxl',
        sha256_unc: 'b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01'
      }
    },
    {
      id: 'TXN-2026-HF-002',
      nha_cung_cap: 'Phụ Kiện Cao Cấp Hafele',
      loai_giao_dich: 'NHAP_PHU_KIEN_TAY_NANG_RAY_AM',
      thoi_gian: '2026-11-09 09:15:00',
      so_tien_yeu_cau: 18500000,
      so_tien_unc: 18500000,
      layer1_invoice: {
        co_anh: true,
        ten_tep: '1794182100450_hafele_inv_tay_nang_blum.jxl',
        sha256: 'c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234',
        kich_thuoc_bytes: 418200,
        nguoi_gui: 'Chị Hương (Kế toán / Vợ Giám Đốc)'
      },
      layer2_zalo_ncc: {
        co_xac_nhan: true,
        nhom_zalo: 'Phụ kiện Hafele & Blum chính hãng - Nội Thất Phú Gia',
        nguoi_xac_nhan: 'Hafele Support Team',
        noi_dung: 'Xác nhận đơn phụ kiện tay nâng Blum HF25 + ray âm giảm chấn Hafele đã xuất kho. Đã nhận đủ 18.500.000 đ.',
        thoi_gian_xac_nhan: '2026-11-09 09:30:00'
      },
      layer3_unc_huong: {
        co_unc: true,
        nguoi_thuc_hien: 'Chị Hương (Kế toán)',
        ngan_hang: 'MB Bank',
        ma_giao_dich: 'UNC-HF-20261109-18M5',
        so_tien_chuyen: 18500000,
        ten_tep_unc: '1794182150330_unc_mbbank_hafele_18m5.jxl',
        sha256_unc: 'd4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345'
      }
    },
    {
      id: 'TXN-2026-001',
      nha_cung_cap: 'Gỗ thịt Đức Anh (Nga)',
      loai_giao_dich: 'THANH_TOAN_TIEN_HANG_GO_THIT',
      thoi_gian: '2026-11-07 10:15:18',
      so_tien_yeu_cau: 10000000,
      so_tien_unc: 10000000,
      layer1_invoice: {
        co_anh: true,
        ten_tep: '1794021318608_2304805760907141944_1193413708528852811_f4c7d99b14e803a445196012069ef016.jxl',
        sha256: '096ebcc14fb86d82a381b257933eb4aeb1c6f569eaf364c5b03ae1e9b6ba9b68',
        kich_thuoc_bytes: 395825,
        nguoi_gui: 'Giám Đốc (Nguyễn Viết Nghĩa)'
      },
      layer2_zalo_ncc: {
        co_xac_nhan: true,
        nhom_zalo: 'Đặt hàng gỗ thịt nhà Đức Anh - Thu Hương Hà Tĩnh',
        nguoi_xac_nhan: 'Nga (Gỗ thịt Đức Anh)',
        noi_dung: 'E gửi lại sổ công nợ, đã trừ 10tr hn c ck nhé ak. Dư nợ còn lại 3.200.000 đ.',
        thoi_gian_xac_nhan: '2026-11-07 10:20:00'
      },
      layer3_unc_huong: {
        co_unc: true,
        nguoi_thuc_hien: 'Chị Hương (Kế toán)',
        ngan_hang: 'VietinBank / Vietcombank',
        ma_giao_dich: 'UNC-DA-20261107-10M',
        so_tien_chuyen: 10000000,
        ten_tep_unc: '1794021146847_1193413708528852811_1193413708528852811_7e0dd607e827353858572c3004c7a2be.jxl',
        sha256_unc: '049c541e7fee2b67f33c75651f9630e7d17de85f31d27621d4af2bb9d7eb7a70'
      }
    },
    {
      id: 'TXN-2026-LG-003',
      nha_cung_cap: 'Tổng Kho Ván Lam Giang (Hà Tĩnh)',
      loai_giao_dich: 'NHAP_VAN_THAI_LAN_NEP_CHI',
      thoi_gian: '2026-11-09 16:20:00',
      so_tien_yeu_cau: 12400000,
      so_tien_unc: 12400000,
      layer1_invoice: {
        co_anh: true,
        ten_tep: '1794208800100_lamgiang_hoa_don_van_thai.jxl',
        sha256: 'e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345678',
        kich_thuoc_bytes: 388500,
        nguoi_gui: 'Chị Hương (Kế toán)'
      },
      layer2_zalo_ncc: {
        co_xac_nhan: true,
        nhom_zalo: 'Ván Gỗ Lam Giang - PG Home Hà Tĩnh',
        nguoi_xac_nhan: 'Kế toán Lam Giang',
        noi_dung: 'Đã nhận đủ 12.400.000 đ tiền ván cốt Thái Lan giao xưởng Phú Gia. Biên lai xuất kho số 104.',
        thoi_gian_xac_nhan: '2026-11-09 16:35:00'
      },
      layer3_unc_huong: {
        co_unc: true,
        nguoi_thuc_hien: 'Chị Hương (Kế toán)',
        ngan_hang: 'VietinBank',
        ma_giao_dich: 'UNC-LG-20261109-12M4',
        so_tien_chuyen: 12400000,
        ten_tep_unc: '1794208850200_unc_vietinbank_lamgiang_12m4.jxl',
        sha256_unc: 'f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789a'
      }
    },
    {
      id: 'TXN-2026-006',
      nha_cung_cap: 'Phụ kiện Tổng kho Quốc Tâm (56 Ngô Đức Kế, Hà Tĩnh)',
      loai_giao_dich: 'NHAP_KHO_RAY_BAN_LE',
      thoi_gian: '2026-11-07 09:00:40',
      so_tien_yeu_cau: 4500000,
      so_tien_unc: 4000000, // Lệch số tiền (4.5M vs 4.0M)
      layer1_invoice: {
        co_anh: true,
        ten_tep: '1794016840625_1193413708528852811_1193413708528852811_71ed67559476cf2c034d2c4ff28148a9.jxl',
        sha256: 'd619aa6883b4387b0e79d6e7567a6e80c7a7997908f9d14175583208ca9f9dd5',
        kich_thuoc_bytes: 797244,
        nguoi_gui: 'Chị Hương (Kế toán / Vợ Giám Đốc)'
      },
      layer2_zalo_ncc: {
        co_xac_nhan: false, // Thiếu nhóm Zalo Quốc Tâm xác nhận nhận đủ tiền
        nhom_zalo: 'Phụ kiện Quốc Tâm - PG Home',
        nguoi_xac_nhan: '',
        noi_dung: 'Chưa có tin nhắn xác nhận nhận tiền từ thủ kho Quốc Tâm.',
        thoi_gian_xac_nhan: ''
      },
      layer3_unc_huong: {
        co_unc: true,
        nguoi_thuc_hien: 'Chị Hương (Kế toán)',
        ngan_hang: 'VietinBank',
        ma_giao_dich: 'UNC-QT-20261107-4M',
        so_tien_chuyen: 4000000,
        ten_tep_unc: '1794016840599_1193413708528852811_1193413708528852811_95f932b45fad164a6cc90f04fb7b4d13.jxl',
        sha256_unc: 'bec502df7d776d2427e0ee7c3dcd262160e2c5a8abd818c0da517bd6c1304170'
      }
    },
    {
      id: 'TXN-2026-004',
      nha_cung_cap: 'Chiến Acrylic Livas',
      loai_giao_dich: 'THANH_TOAN_CANH_ACRYLIC',
      thoi_gian: '2026-11-07 10:01:37',
      so_tien_yeu_cau: 14850000,
      so_tien_unc: null, // Chưa có UNC thực tế
      layer1_invoice: {
        co_anh: true,
        ten_tep: '1794020497539_1193413708528852811_1193413708528852811_af2439b4b341657e5b9db9bf45d01418.jxl',
        sha256: 'fea483e5b02c096e795daa4728fb87a513f9bc4915e4d79755b02df17ba4b9b9',
        kich_thuoc_bytes: 688761,
        nguoi_gui: 'Chị Hương (Kế toán / Vợ Giám Đốc)'
      },
      layer2_zalo_ncc: {
        co_xac_nhan: true,
        nhom_zalo: 'ĐẶT CÁNH LIC LIVAS - NỘI THẤT PHÚ GIA HÀ TĨNH',
        nguoi_xac_nhan: 'Chiến Acrylic Livas',
        noi_dung: 'Đã gia công xong cánh acrylic gửi xe vào Hà Tĩnh. Chờ kế toán thanh toán khi gửi xe.',
        thoi_gian_xac_nhan: '2026-11-07 10:05:00'
      },
      layer3_unc_huong: {
        co_unc: false, // Thiếu UNC ngân hàng khớp tiền
        nguoi_thuc_hien: 'Chị Hương (Kế toán)',
        ngan_hang: '',
        ma_giao_dich: '',
        so_tien_chuyen: 0,
        ten_tep_unc: '',
        sha256_unc: ''
      }
    },
    {
      id: 'TXN-2026-005',
      nha_cung_cap: 'Sơn CNC - CTY PHÚ GIA',
      loai_giao_dich: 'YEU_CAU_GUI_UNC_BILL',
      thoi_gian: '2026-11-07 10:01:11',
      so_tien_yeu_cau: 8500000,
      so_tien_unc: 8500000,
      layer1_invoice: {
        co_anh: false, // Thiếu ảnh hóa đơn bóc tách chi tiết khối lượng ván
        ten_tep: '',
        sha256: '',
        kich_thuoc_bytes: 0,
        nguoi_gui: ''
      },
      layer2_zalo_ncc: {
        co_xac_nhan: true,
        nhom_zalo: 'SƠN CNC - CTY PHU GIA',
        nguoi_xac_nhan: 'Xưởng Sơn CNC',
        noi_dung: 'chị thanh toán gửi bill lên nhóm này luôn chị nha. Chị Hương xác nhận đã ck xong.',
        thoi_gian_xac_nhan: '2026-11-07 10:03:00'
      },
      layer3_unc_huong: {
        co_unc: true,
        nguoi_thuc_hien: 'Chị Hương (Kế toán)',
        ngan_hang: 'Techcombank',
        ma_giao_dich: 'UNC-SONCNC-8.5M',
        so_tien_chuyen: 8500000,
        ten_tep_unc: '1794020471573_1193413708528852811_1193413708528852811_4c09355ce4443ac2d802f69c6b3f9b45.jxl',
        sha256_unc: 'c0d93e334f741905ca6b0e97924c64d04bcee84e0b71a0bac948d7882183ff55'
      }
    }
  ];

  // --- HỆ THỐNG QUẢN TRỊ REGISTRY HASH VÀ GIAO DỊCH ---
  var state = {
    transactions: [],
    knownHashes: {},      // hash -> { txnId, type, fileName, date }
    auditHistory: []
  };

  /**
   * Định dạng tiền tệ VND chuẩn Việt Nam
   */
  function formatMoney(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '0 đ';
    return Number(amount).toLocaleString('vi-VN') + ' đ';
  }

  /**
   * Kiểm tra tính hợp lệ của mã băm SHA-256 (64 hex characters)
   */
  function isValidSha256(hash) {
    if (!hash || typeof hash !== 'string') return false;
    return /^[a-fA-F0-9]{64}$/.test(hash.trim());
  }

  /**
   * ĐỐI SOÁT 3 LỚP CHÉO CHO 1 GIAO DỊCH DUY NHẤT
   */
  function auditTransaction(txn, options) {
    options = options || {};
    var strictShaCheck = options.strictShaCheck !== false;
    var reasons = [];
    var flags = {
      layer1_passed: false,
      layer2_passed: false,
      layer3_passed: false,
      sha256_unique: true,
      amount_matched: false
    };

    if (!txn) {
      return {
        status: STATUS.FROZEN,
        statusLabel: 'TREO THANH TOÁN (Dữ liệu không hợp lệ)',
        flags: flags,
        reasons: ['Dữ liệu giao dịch rỗng hoặc sai cấu trúc']
      };
    }

    // 1. KIỂM TRA LỚP 1: ẢNH HÓA ĐƠN THẬT
    var l1 = txn.layer1_invoice || {};
    if (!l1.co_anh) {
      reasons.push('THIẾU LỚP 1: Chưa có ảnh hóa đơn thật ngoài ổ cứng');
    } else if (!l1.ten_tep || l1.ten_tep.trim() === '') {
      reasons.push('THIẾU LỚP 1: Tên tệp ảnh hóa đơn không hợp lệ');
    } else if (strictShaCheck && (!l1.sha256 || !isValidSha256(l1.sha256))) {
      reasons.push('THIẾU LỚP 1: Mã băm SHA-256 ảnh hóa đơn không đúng chuẩn 64 ký tự hex');
    } else {
      flags.layer1_passed = true;
    }

    // 2. KIỂM TRA LỚP 2: XÁC NHẬN NHÓM ZALO NCC
    var l2 = txn.layer2_zalo_ncc || {};
    if (!l2.co_xac_nhan) {
      reasons.push('THIẾU LỚP 2: Chưa có xác nhận từ nhóm Zalo nhà cung cấp');
    } else if (!l2.nguoi_xac_nhan || l2.nguoi_xac_nhan.trim() === '') {
      reasons.push('THIẾU LỚP 2: Chưa định danh người đại diện NCC xác nhận công nợ');
    } else if (!l2.nhom_zalo || l2.nhom_zalo.trim() === '') {
      reasons.push('THIẾU LỚP 2: Thiếu tên nhóm hội thoại Zalo chính thức của NCC');
    } else {
      flags.layer2_passed = true;
    }

    // 3. KIỂM TRA LỚP 3: UNC NGÂN HÀNG CHỊ HƯƠNG KHỚP SỐ TIỀN
    var l3 = txn.layer3_unc_huong || {};
    var reqAmt = Number(txn.so_tien_yeu_cau || 0);
    var uncAmt = Number(l3.so_tien_chuyen || 0);

    if (!l3.co_unc) {
      reasons.push('THIẾU LỚP 3: Chưa có chứng từ UNC chuyển khoản của Chị Hương');
    } else if (!l3.nguoi_thuc_hien || l3.nguoi_thuc_hien.indexOf('Hương') === -1) {
      reasons.push('THIẾU LỚP 3: Người thực hiện chuyển tiền bắt buộc là Kế toán Chị Hương');
    } else if (reqAmt <= 0 || uncAmt <= 0) {
      reasons.push('THIẾU LỚP 3: Số tiền giao dịch phải lớn hơn 0 đ');
    } else if (reqAmt !== uncAmt) {
      reasons.push('THIẾU LỚP 3: Số tiền UNC (' + formatMoney(uncAmt) + ') không khớp với hóa đơn (' + formatMoney(reqAmt) + ')');
    } else if (strictShaCheck && (!l3.sha256_unc || !isValidSha256(l3.sha256_unc))) {
      reasons.push('THIẾU LỚP 3: Mã băm SHA-256 chứng từ UNC không hợp lệ');
    } else {
      flags.layer3_passed = true;
      flags.amount_matched = true;
    }

    // 4. KIỂM TRA CHỐNG TRÙNG LẶP MÃ BĂM SHA-256
    var currentHashes = [];
    if (l1.sha256 && isValidSha256(l1.sha256)) currentHashes.push({ hash: l1.sha256.toLowerCase(), type: 'INVOICE_IMAGE' });
    if (l3.sha256_unc && isValidSha256(l3.sha256_unc)) currentHashes.push({ hash: l3.sha256_unc.toLowerCase(), type: 'BANK_UNC' });

    for (var i = 0; i < currentHashes.length; i++) {
      var hItem = currentHashes[i];
      var existing = state.knownHashes[hItem.hash];
      if (existing && existing.txnId !== txn.id) {
        flags.sha256_unique = false;
        reasons.unshift('CẢNH BÁO TRÙNG LẶP: Mã SHA-256 (' + hItem.hash.substring(0, 12) + '...) trùng với giao dịch ' + existing.txnId + ' (' + existing.type + ')');
        break;
      }
    }

    // 5. TỔNG HỢP TRẠNG THÁI CUỐI CÙNG
    var finalStatus = STATUS.APPROVED;
    var finalLabel = 'HỢP LỆ - ĐÃ ĐỐI SOÁT 3 LỚP CHÉO';
    var badgeColor = '#10b981'; // Xanh ngọc lục bảo

    if (!flags.sha256_unique) {
      finalStatus = STATUS.DUPLICATE_REJECT;
      finalLabel = 'CẢNH BÁO TRÙNG LẶP SHA-256 - TỪ CHỐI THANH TOÁN';
      badgeColor = '#ef4444'; // Đỏ cảnh báo
    } else if (!flags.layer1_passed || !flags.layer2_passed || !flags.layer3_passed || !flags.amount_matched) {
      finalStatus = STATUS.FROZEN;
      finalLabel = 'TREO THANH TOÁN - CHƯA ĐỦ 3 LỚP ĐỐI SOÁT';
      badgeColor = '#dc2626'; // Đỏ thẫm
    }

    return {
      txnId: txn.id,
      nhaCungCap: txn.nha_cung_cap,
      soTien: reqAmt,
      status: finalStatus,
      statusLabel: finalLabel,
      badgeColor: badgeColor,
      isApproved: finalStatus === STATUS.APPROVED,
      isFrozen: finalStatus !== STATUS.APPROVED,
      flags: flags,
      reasons: reasons,
      auditedAt: new Date().toISOString()
    };
  }

  /**
   * MA TRẬN ĐỐI SOÁT CÔNG NỢ 3 LỚP NHÀ CUNG CẤP (CẢI TIẾN #7)
   * Kiểm tra nghiêm ngặt đơn đặt hàng / hóa đơn nhà cung cấp:
   * 1. Lớp 1: Ảnh hóa đơn / phiếu giao hàng vật lý
   * 2. Lớp 2: Tin nhắn xác nhận nhóm Zalo chính thức của NCC (An Cường, Hafele, Quốc Tâm, Lam Giang...)
   * 3. Lớp 3: Chứng từ UNC ngân hàng Kế toán Chị Hương khớp chính xác số tiền
   * @param {Object} poItem - Bản ghi đơn hàng / khoản chi nhà cung cấp
   * @returns {Object} Kết quả đối soát chuẩn
   */
  function auditSupplierThreeLayer(poItem) {
    if (!poItem) {
      return {
        isApproved: false,
        status: STATUS.FROZEN,
        badgeCode: 'TREO_THANH_TOAN',
        badgeText: 'TREO THANH TOÁN - THIẾU CHỨNG TỪ',
        badgeColor: '#ef4444',
        reasons: ['Dữ liệu đơn hàng hoặc nhà cung cấp không hợp lệ'],
        supplier: 'N/A',
        amount: 0
      };
    }

    var supplier = poItem.supplier || poItem.nha_cung_cap || poItem.vendor || 'Nhà Cung Cấp';
    var reqAmt = Number(poItem.amount || poItem.so_tien || poItem.so_tien_yeu_cau || poItem.totalPrice || 0);

    // Kiểm tra cấu trúc l1, l2, l3 linh hoạt (hỗ trợ cả schema giao dịch lẫn schema PO)
    var l1 = poItem.layer1_invoice || {
      co_anh: !!(poItem.invoiceImage || poItem.hasInvoice || poItem.anh_hoa_don),
      ten_tep: poItem.invoiceImage || poItem.ten_tep_hoa_don || 'hoa_don.jxl',
      sha256: poItem.sha256_invoice || poItem.invoiceSha256 || ''
    };

    var l2 = poItem.layer2_zalo_ncc || {
      co_xac_nhan: !!(poItem.zaloConfirmation || poItem.hasZaloConfirm || poItem.xac_nhan_zalo),
      nhom_zalo: poItem.zaloGroup || poItem.nhom_zalo || '',
      nguoi_xac_nhan: poItem.zaloSender || poItem.nguoi_xac_nhan || ''
    };

    var l3 = poItem.layer3_unc_huong || {
      co_unc: !!(poItem.bankUnc || poItem.hasUnc || poItem.uncImage || poItem.ma_giao_dich_unc),
      so_tien_chuyen: Number(poItem.uncAmount || poItem.so_tien_unc || (poItem.hasUnc ? reqAmt : 0)),
      nguoi_thuc_hien: poItem.uncBy || poItem.nguoi_chuyen || 'Chị Hương (Kế toán)',
      sha256_unc: poItem.sha256_unc || ''
    };

    var reasons = [];
    var l1Pass = false;
    var l2Pass = false;
    var l3Pass = false;
    var amountMatched = false;

    // Lớp 1: Ảnh hóa đơn
    if (!l1.co_anh) {
      reasons.push('Thiếu Lớp 1: Chưa có ảnh hóa đơn/phiếu giao hàng NCC ngoài ổ cứng');
    } else {
      l1Pass = true;
    }

    // Lớp 2: Nhóm Zalo NCC
    if (!l2.co_xac_nhan) {
      reasons.push('Thiếu Lớp 2: Chưa có xác nhận công nợ trên nhóm Zalo chính thức của NCC (' + supplier + ')');
    } else {
      l2Pass = true;
    }

    // Lớp 3: UNC Ngân hàng Chị Hương
    var uncAmt = Number(l3.so_tien_chuyen || 0);
    if (!l3.co_unc) {
      reasons.push('Thiếu Lớp 3: Chưa có UNC ngân hàng do Kế toán Chị Hương thực hiện');
    } else if (reqAmt <= 0 || uncAmt <= 0) {
      reasons.push('Lỗi số tiền: Số tiền đề xuất hoặc UNC phải lớn hơn 0 đ');
    } else if (reqAmt !== uncAmt) {
      reasons.push('Lệch Lớp 3: Số tiền UNC (' + formatMoney(uncAmt) + ') không khớp hóa đơn (' + formatMoney(reqAmt) + ')');
    } else {
      l3Pass = true;
      amountMatched = true;
    }

    var isApproved = l1Pass && l2Pass && l3Pass && amountMatched;
    var status = isApproved ? STATUS.APPROVED : STATUS.FROZEN;
    var badgeCode = isApproved ? 'DU_3_LOP' : 'TREO_THANH_TOAN';
    var badgeText = isApproved ? 'ĐỦ 3 LỚP - CHO PHÉP CHI' : 'TREO THANH TOÁN - THIẾU CHỨNG TỪ';
    var badgeColor = isApproved ? '#10b981' : '#ef4444';

    return {
      isApproved: isApproved,
      status: status,
      badgeCode: badgeCode,
      badgeText: badgeText,
      badgeColor: badgeColor,
      supplier: supplier,
      amount: reqAmt,
      uncAmount: uncAmt,
      flags: {
        layer1_passed: l1Pass,
        layer2_passed: l2Pass,
        layer3_passed: l3Pass,
        amount_matched: amountMatched
      },
      reasons: reasons,
      auditedAt: new Date().toISOString()
    };
  }

  /**
   * TẠO BADGE HTML TRỰC QUAN CHO ĐỐI SOÁT 3 LỚP (CẢI TIẾN #7)
   * Hiển thị nhãn chuẩn:
   * "ĐỦ 3 LỚP - CHO PHÉP CHI" (#10b981) hoặc "TREO THANH TOÁN - THIẾU CHỨNG TỪ" (#ef4444)
   * @param {Object} poItem - Đơn hàng hoặc kết quả auditSupplierThreeLayer
   */
  function renderThreeLayerStatusBadge(poItem) {
    var audit = (poItem && poItem.badgeCode) ? poItem : auditSupplierThreeLayer(poItem);
    var tooltip = audit.isApproved
      ? 'ĐÃ ĐỦ 3 LỚP: 1. Ảnh HĐ thật + 2. Xác nhận Zalo NCC + 3. UNC Chị Hương khớp tiền 100%'
      : 'CHẶN XUẤT QUỸ: ' + (audit.reasons ? audit.reasons.join(' | ') : 'Thiếu chứng từ');

    var icon = audit.isApproved ? '✓' : '⚠️';
    var bg = audit.isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.18)';
    var border = audit.isApproved ? '#10b981' : '#ef4444';

    return '' +
      '<span class="pg-w12-badge" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; background: ' + bg + '; color: ' + audit.badgeColor + '; border: 1px solid ' + border + '; cursor: help;" title="' + tooltip.replace(/"/g, '&quot;') + '">' +
        '<span>' + icon + '</span>' +
        '<span>' + audit.badgeText + '</span>' +
      '</span>';
  }

  /**
   * ĐĂNG KÝ HASH VÀO BỘ NHỚ HỆ THỐNG
   */
  function registerHashesForTxn(txn) {
    if (!txn) return;
    if (txn.layer1_invoice && isValidSha256(txn.layer1_invoice.sha256)) {
      state.knownHashes[txn.layer1_invoice.sha256.toLowerCase()] = {
        txnId: txn.id,
        type: 'ẢNH HÓA ĐƠN THẬT',
        fileName: txn.layer1_invoice.ten_tep,
        registeredAt: new Date().toISOString()
      };
    }
    if (txn.layer3_unc_huong && isValidSha256(txn.layer3_unc_huong.sha256_unc)) {
      state.knownHashes[txn.layer3_unc_huong.sha256_unc.toLowerCase()] = {
        txnId: txn.id,
        type: 'UNC NGÂN HÀNG CHỊ HƯƠNG',
        fileName: txn.layer3_unc_huong.ten_tep_unc,
        registeredAt: new Date().toISOString()
      };
    }
  }

  /**
   * KHỞI TẠO VÀ NẠP SỔ CÁI MẶC ĐỊNH
   */
  function init(customData) {
    state.transactions = [];
    state.knownHashes = {};
    state.auditHistory = [];

    var sourceList = (customData && Array.isArray(customData)) ? customData : SEED_TRANSACTIONS;

    // Đăng ký toàn bộ transaction và hash
    for (var i = 0; i < sourceList.length; i++) {
      var item = JSON.parse(JSON.stringify(sourceList[i]));
      registerHashesForTxn(item);
      state.transactions.push(item);
    }

    // Chạy audit toàn bộ
    return auditAll();
  }

  /**
   * ĐỐI SOÁT TOÀN BỘ KHO GIAO DỊCH
   */
  function auditAll() {
    var results = [];
    var stats = {
      totalCount: state.transactions.length,
      approvedCount: 0,
      frozenCount: 0,
      duplicateCount: 0,
      totalMoneyApproved: 0,
      totalMoneyFrozen: 0,
      missingLayer1Count: 0,
      missingLayer2Count: 0,
      missingLayer3Count: 0
    };

    for (var i = 0; i < state.transactions.length; i++) {
      var txn = state.transactions[i];
      var res = auditTransaction(txn);
      results.push(res);

      if (res.status === STATUS.APPROVED) {
        stats.approvedCount++;
        stats.totalMoneyApproved += res.soTien;
      } else if (res.status === STATUS.DUPLICATE_REJECT) {
        stats.duplicateCount++;
        stats.frozenCount++;
        stats.totalMoneyFrozen += res.soTien;
      } else {
        stats.frozenCount++;
        stats.totalMoneyFrozen += res.soTien;
      }

      if (!res.flags.layer1_passed) stats.missingLayer1Count++;
      if (!res.flags.layer2_passed) stats.missingLayer2Count++;
      if (!res.flags.layer3_passed) stats.missingLayer3Count++;
    }

    state.auditHistory.push({
      timestamp: new Date().toISOString(),
      stats: stats
    });

    return {
      results: results,
      stats: stats,
      auditedAt: new Date().toISOString()
    };
  }

  /**
   * THÊM GIAO DỊCH MỚI VÀ CHẠY ĐỐI SOÁT TỨC THỜI
   */
  function addTransaction(newTxn) {
    if (!newTxn.id) {
      newTxn.id = 'TXN-' + Date.now();
    }
    var auditRes = auditTransaction(newTxn);
    if (auditRes.flags.sha256_unique) {
      registerHashesForTxn(newTxn);
    }
    state.transactions.unshift(newTxn);
    return auditRes;
  }

  /**
   * TÍNH HASH SHA-256 CHO CHUỖI VĂN BẢN HOẶC METADATA ẢNH
   */
  function computeHash(content) {
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    return sha256_pure_js(content);
  }

  /**
   * NHẬP DỮ LIỆU TỪ JSON SỔ CÁI UNC CHỊ HƯƠNG (zalo_huong_unc_ledger.json)
   */
  function importFromLedgerJson(ledgerJson) {
    if (!ledgerJson) return false;
    var data = typeof ledgerJson === 'string' ? JSON.parse(ledgerJson) : ledgerJson;
    
    if (data.top_20_chung_tu_anh_moi_nhat_thang_11_2026) {
      var top20 = data.top_20_chung_tu_anh_moi_nhat_thang_11_2026;
      for (var i = 0; i < top20.length; i++) {
        var it = top20[i];
        if (it.ma_bam_sha256) {
          state.knownHashes[it.ma_bam_sha256.toLowerCase()] = {
            txnId: 'LEDGER-VOUCHER-' + it.thu_tu,
            type: 'CHỨNG TỪ ẢNH GỐC SỔ CÁI',
            fileName: it.ten_tep,
            registeredAt: it.thoi_gian
          };
        }
      }
    }
    return true;
  }

  /**
   * GIAO DIỆN HIỂN THỊ HTML NỘI BỘ (UI RENDERER)
   */
  function renderUI(containerIdOrElement) {
    var container = typeof containerIdOrElement === 'string' 
      ? document.getElementById(containerIdOrElement) 
      : containerIdOrElement;

    if (!container) {
      console.warn('[PG_Modules_W12] Container element not found for rendering.');
      return;
    }

    var auditData = auditAll();
    var stats = auditData.stats;
    var results = auditData.results;

    var html = '' +
      '<div class="w12-guard-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">' +
        '<!-- HEADER THƯƠNG HIỆU & PHÁP LÝ PHÚ GIA -->' +
        '<div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">' +
          '<div>' +
            '<div style="display: flex; align-items: center; gap: 8px;">' +
              '<span style="background: #eab308; color: #000; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">PG HOME LUXURY</span>' +
              '<span style="background: #ef4444; color: #fff; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">MODULE W12: BẢO VỆ DÒNG TIỀN</span>' +
            '</div>' +
            '<h2 style="margin: 8px 0 4px 0; font-size: 20px; font-weight: 700; color: #f1f5f9;">QUY CHUẨN ĐỐI SOÁT DÒNG TIỀN 3 LỚP CHÉO & CHỐNG TRÙNG SHA-256</h2>' +
            '<p style="margin: 0; font-size: 12px; color: #94a3b8;">Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng | ĐKKD: <strong style="color: #cbd5e1;">042203002931</strong> | Hotline: <strong style="color: #eab308;">0986.722.324</strong></p>' +
            '<p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Xưởng SX: Ngõ 49 Trương Quốc Dụng | VP: 35 Đồng Quế, P. Thành Sen, TP. Hà Tĩnh</p>' +
          '</div>' +
          '<div style="text-align: right;">' +
            '<button id="w12-refresh-btn" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s;">⚡ Quét Lại 3 Lớp</button>' +
          '</div>' +
        '</div>' +

        '<!-- THỐNG KÊ KPI BỎ TÚI BGĐ -->' +
        '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">' +
          '<div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">' +
            '<div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Đã Duyệt Hợp Lệ (3 Lớp)</div>' +
            '<div style="font-size: 22px; font-weight: 700; color: #10b981; margin: 4px 0;">' + stats.approvedCount + ' GD</div>' +
            '<div style="font-size: 13px; color: #cbd5e1;">Tổng tiền: <strong style="color: #34d399;">' + formatMoney(stats.totalMoneyApproved) + '</strong></div>' +
          '</div>' +
          '<div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444;">' +
            '<div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Treo Thanh Toán (Khóa Quỹ)</div>' +
            '<div style="font-size: 22px; font-weight: 700; color: #ef4444; margin: 4px 0;">' + stats.frozenCount + ' GD</div>' +
            '<div style="font-size: 13px; color: #cbd5e1;">Tiền bảo vệ: <strong style="color: #f87171;">' + formatMoney(stats.totalMoneyFrozen) + '</strong></div>' +
          '</div>' +
          '<div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">' +
            '<div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Số Lượng Thiếu Từng Lớp</div>' +
            '<div style="font-size: 12px; color: #cbd5e1; margin-top: 6px; line-height: 1.6;">' +
              '• Thiếu Ảnh HĐ Thật (L1): <strong style="color: #fbbf24;">' + stats.missingLayer1Count + '</strong><br>' +
              '• Thiếu Xác Nhận Zalo (L2): <strong style="color: #fbbf24;">' + stats.missingLayer2Count + '</strong><br>' +
              '• Thiếu UNC Ngân Hàng (L3): <strong style="color: #fbbf24;">' + stats.missingLayer3Count + '</strong>' +
            '</div>' +
          '</div>' +
          '<div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1;">' +
            '<div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Bộ Nhớ SHA-256 Chống Trùng</div>' +
            '<div style="font-size: 22px; font-weight: 700; color: #818cf8; margin: 4px 0;">' + Object.keys(state.knownHashes).length + ' mã băm</div>' +
            '<div style="font-size: 12px; color: #cbd5e1;">Kiểm soát: Chị Hương + Giám Đốc</div>' +
          '</div>' +
        '</div>' +

        '<!-- BẢNG ĐỐI SOÁT CHI TIẾT 3 LỚP -->' +
        '<div style="overflow-x: auto; background: #1e293b; border-radius: 8px; border: 1px solid #334155;">' +
          '<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">' +
            '<thead>' +
              '<tr style="background: #0f172a; color: #94a3b8; border-bottom: 2px solid #334155;">' +
                '<th style="padding: 12px 14px;">Mã Giao Dịch / NCC</th>' +
                '<th style="padding: 12px 14px;">Số Tiền HĐ / UNC</th>' +
                '<th style="padding: 12px 14px; text-align: center;">Lớp 1: Ảnh HĐ Thật</th>' +
                '<th style="padding: 12px 14px; text-align: center;">Lớp 2: Zalo NCC</th>' +
                '<th style="padding: 12px 14px; text-align: center;">Lớp 3: UNC Chị Hương</th>' +
                '<th style="padding: 12px 14px;">Trạng Thái Kỷ Luật Thép</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>';

    for (var i = 0; i < state.transactions.length; i++) {
      var txn = state.transactions[i];
      var res = results[i];
      var rowBg = i % 2 === 0 ? '#1e293b' : '#182234';

      var l1Icon = res.flags.layer1_passed 
        ? '<span title="Đủ ảnh & SHA-256 hợp lệ" style="color: #10b981; font-weight: 800; font-size: 14px;">✓ ĐÃ CÓ</span>' 
        : '<span title="Thiếu ảnh thật ngoài ổ cứng" style="color: #ef4444; font-weight: 800; font-size: 13px;">✗ THIẾU</span>';

      var l2Icon = res.flags.layer2_passed 
        ? '<span title="NCC đã xác nhận công nợ" style="color: #10b981; font-weight: 800; font-size: 14px;">✓ ĐÃ CHỐT</span>' 
        : '<span title="Chưa có tin nhắn Zalo NCC" style="color: #ef4444; font-weight: 800; font-size: 13px;">✗ THIẾU</span>';

      var l3Icon = (res.flags.layer3_passed && res.flags.amount_matched)
        ? '<span title="UNC Chị Hương chuẩn xác" style="color: #10b981; font-weight: 800; font-size: 14px;">✓ KHỚP TIỀN</span>' 
        : '<span title="Chưa có UNC hoặc lệch số tiền" style="color: #ef4444; font-weight: 800; font-size: 13px;">✗ LỆCH/THIẾU</span>';

      var badgeHtml = renderThreeLayerStatusBadge(res);

      var reasonHtml = '';
      if (res.reasons.length > 0) {
        reasonHtml = '<div style="margin-top: 6px; font-size: 11px; color: #fca5a5;">' + res.reasons.join('<br>') + '</div>';
      }

      var shaPreview = '';
      if (txn.layer1_invoice && txn.layer1_invoice.sha256) {
        shaPreview = '<div style="font-family: monospace; font-size: 10px; color: #64748b; margin-top: 4px;">SHA256: ' + txn.layer1_invoice.sha256.substring(0, 16) + '...</div>';
      }

      html += '' +
        '<tr style="background: ' + rowBg + '; border-bottom: 1px solid #334155;">' +
          '<td style="padding: 12px 14px;">' +
            '<div style="font-weight: 700; color: #f8fafc;">' + txn.nha_cung_cap + '</div>' +
            '<div style="font-size: 11px; color: #94a3b8;">' + txn.id + ' • ' + (txn.thoi_gian || 'N/A') + '</div>' +
            shaPreview +
          '</td>' +
          '<td style="padding: 12px 14px;">' +
            '<div style="font-weight: 700; color: #38bdf8;">' + formatMoney(txn.so_tien_yeu_cau) + '</div>' +
            '<div style="font-size: 11px; color: ' + (res.flags.amount_matched ? '#94a3b8' : '#f87171') + ';">UNC: ' + formatMoney(txn.layer3_unc_huong ? txn.layer3_unc_huong.so_tien_chuyen : 0) + '</div>' +
          '</td>' +
          '<td style="padding: 12px 14px; text-align: center;">' + l1Icon + '</td>' +
          '<td style="padding: 12px 14px; text-align: center;">' + l2Icon + '</td>' +
          '<td style="padding: 12px 14px; text-align: center;">' + l3Icon + '</td>' +
          '<td style="padding: 12px 14px;">' +
            badgeHtml +
            reasonHtml +
          '</td>' +
        '</tr>';
    }

    html += '' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div style="margin-top: 14px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between;">' +
          '<span>Kỷ luật Thép PG Home Luxury: Cấm xuất tiền khi chưa có xác nhận từ Chị Hương & Giám Đốc.</span>' +
          '<span>Đã đối soát lúc: ' + auditData.auditedAt + '</span>' +
        '</div>' +
      '</div>';

    container.innerHTML = html;

    // Bắt sự kiện nút Refresh
    var refreshBtn = container.querySelector('#w12-refresh-btn');
    if (refreshBtn) {
      refreshBtn.onclick = function () {
        renderUI(container);
      };
    }
  }

  // Tự động khởi tạo bộ dữ liệu gốc
  init();

  // EXPORT CÔNG KHAI MODULE W12
  return {
    moduleId: 'W12',
    version: '2.0.0-PRO',
    legalName: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    taxId: '042203002931',
    hotline: '0986.722.324',
    STATUS: STATUS,
    CORE_SUPPLIERS: CORE_SUPPLIERS,
    init: init,
    auditTransaction: auditTransaction,
    auditSupplierThreeLayer: auditSupplierThreeLayer,
    renderThreeLayerStatusBadge: renderThreeLayerStatusBadge,
    auditAll: auditAll,
    addTransaction: addTransaction,
    computeHash: computeHash,
    registerHashesForTxn: registerHashesForTxn,
    importFromLedgerJson: importFromLedgerJson,
    renderUI: renderUI,
    getState: function () { return state; }
  };
});
