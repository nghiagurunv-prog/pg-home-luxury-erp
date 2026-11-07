/**
 * ============================================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT PG HOME LUXURY - CÔNG NHÂN FLASH W10
 * MODULE: w10_supplier_board_3ncc.js
 * CHỨC NĂNG: Bảng đối soát công nợ & đơn giá 3 Nhà Cung Cấp Ván chủ lực (Lam Giang, Cầu Vượt, Cường Thịnh)
 *            Tích hợp Engine kiểm toán định mức tấm cắt CNC (Mục 24 GEMINI.md) & Cảnh báo độ lệch đặt hàng.
 * TUÂN THỦ:
 *  - Kỷ luật thép & Quy chuẩn đối soát dòng tiền 3 lớp chéo (Hóa đơn thật + Nhóm Zalo + UNC ngân hàng)
 *  - Thông tin pháp lý chuẩn: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 *  - Hotline: 0973.562.789 | Tổ hợp VP & Nhà máy: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * ============================================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W10 = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // --- DỮ LIỆU ĐỐI SOÁT KIỂM TOÁN CHUẨN XÁC 100% TỪ audit_suppliers_board_3ncc.json ---
  const AUDIT_DATA = {
    meta: {
      tieu_de: "BÁO CÁO ĐỐI SOÁT TOÀN DIỆN 3 NHÀ CUNG CẤP VÁN LỚN (LAM GIANG, CẦU VƯỢT, CƯỜNG THỊNH)",
      ngay_doi_soat: "2026-11-07",
      thoi_diem_cap_nhat_du_lieu: "2026-11-06 17:00:00",
      nguoi_thuc_hien: "Công nhân Flash #09 & #W10 - Kỹ sư đối soát NCC ván gỗ PG Home",
      pham_vi_thoi_gian: "10 tháng đầu năm 2026 (T01 - T10/2026) + Biến động thực tế 06/11/2026",
      quy_chuan_tuan_thu: "Quy chuẩn đối soát dòng tiền 3 lớp chéo (Hóa đơn thật + Xác nhận nhóm Zalo + UNC ngân hàng)",
      trang_thai_kiem_toan: "HOÀN THÀNH - CHÍNH XÁC 100%"
    },
    tong_quan_3_ncc: {
      tong_chi_phi_luy_ke_10_thang: 241320000,
      tong_chi_phi_luy_ke_10_thang_chu: "Hai trăm bốn mươi mốt triệu ba trăm hai mươi nghìn đồng",
      co_cau_chi_phi: [
        {
          ncc_id: "NCC_01_LAM_GIANG",
          ten_ncc: "Công ty Cổ phần Đầu tư Lam Giang",
          gia_tri: 147490000,
          ty_trong_phan_tram: 61.12,
          chuyen_muc: "Ván MDF chống ẩm, MFC, Tấm nhựa WPB/Picomat cốt lõi",
          icon: "🏭",
          mau_sac: "#2563eb"
        },
        {
          ncc_id: "NCC_16_CAU_VUOT",
          ten_ncc: "Công ty TNHH XD KT Nội Thất NT (Gỗ Nội Thất Cầu Vượt)",
          gia_tri: 82070000,
          ty_trong_phan_tram: 34.01,
          chuyen_muc: "Ván Plywood tiêu chuẩn E0 cao cấp, nẹp PVC",
          icon: "🌲",
          mau_sac: "#059669"
        },
        {
          ncc_id: "NCC_CUONG_THINH",
          ten_ncc: "Công ty TNHH SX & TM Gỗ Cường Thịnh",
          gia_tri: 11760000,
          ty_trong_phan_tram: 4.87,
          chuyen_muc: "Ván HMR Vanachai Thái Lan E1/E2, Plywood mộc & phủ Melamine",
          icon: "🪵",
          mau_sac: "#d97706"
        }
      ]
    },
    chi_tiet_ncc: {
      lam_giang: {
        ncc_id: "NCC_01_LAM_GIANG",
        ten_phap_ly: "CÔNG TY CỔ PHẦN ĐẦU TƯ LAM GIANG",
        nhom_zalo_id: "g6116598459303638566",
        tong_so_file_media_kiem_tra: 275,
        quy_mo_chi_tieu_10_thang: 147490000,
        ty_trong: 61.12,
        tai_khoan_thanh_toan_xac_minh: {
          chu_tai_khoan: "CTY CO PHAN DAU TU LAMGIANG",
          so_tai_khoan: "10052288",
          ngan_hang: "Techcombank"
        },
        bien_dong_thanh_toan_moi_nhat_06_11_2026: {
          tong_thanh_toan_trong_ngay: 19954000,
          so_luong_giao_dich: 2,
          danh_sach_unc: [
            {
              stt: 1,
              thoi_gian: "2026-11-06 14:51:24",
              so_tien: 954000,
              ngan_hang_chuyen: "Techcombank",
              nguoi_chuyen: "Hoang Cong Vu",
              noi_dung: "Hoang Cong Vu chuyen khoan nhanh qua Zalo",
              ma_giao_dich: "FT26310745656340",
              file_chung_tu_goc: "1793951617610_2845688247116683961_g6116598459303638566_459c1844d172f4ed67d99f9f25b04c97.jpg"
            },
            {
              stt: 2,
              thoi_gian: "2026-11-06 14:45:00",
              so_tien: 19000000,
              ngan_hang_chuyen: "VietinBank",
              nguoi_chuyen: "LUU THI KIM DUNG",
              noi_dung: "LUU THI KIM DUNG chuyen tien CTY CP DAU TU LAM GIANG",
              ma_giao_dich: "6310ICBVC2RRU41H",
              ma_tham_chieu: "430C61106C34VG91",
              file_chung_tu_goc: "1793951632662_2845688247116683961_g6116598459303638566_0a6beb5612961e847acf9c2b8f4b9e22.jpg"
            }
          ]
        },
        danh_gia_van_hanh: "Nhà cung ứng ván gỗ công nghiệp MDF chống ẩm và nhựa đặc WPB chủ lực số 1, chiếm 61.1% tổng sản lượng ván xưởng. Các phát sinh đặt hàng đều có xác nhận nhóm, thanh toán qua tài khoản pháp nhân đúng chuẩn."
      },
      cau_vuot: {
        ncc_id: "NCC_16_CAU_VUOT",
        ten_phap_ly: "CÔNG TY TNHH XD KT NỘI THẤT NT",
        ten_thuong_hieu: "Gỗ Nội Thất Cầu Vượt",
        nhom_zalo_id: "g8911374775675572335",
        tong_so_file_media_kiem_tra: 83,
        quy_mo_chi_tieu_10_thang: 82070000,
        ty_trong: 34.01,
        ma_khach_hang_sapo: "CUZN00018",
        ten_khach_hang_sapo: "NỘI THẤT PHÚ GIA LUXURY (SĐT: 0916321186)",
        tai_khoan_thu_huong: {
          chu_tai_khoan: "LUU NGOC MINH",
          so_tai_khoan: "100872595955",
          ngan_hang: "VietinBank"
        },
        ho_so_doi_soat_cong_no_sapo: {
          ngay_chot_so_app_sapo: "2026-10-23",
          cong_no_ghi_nhan_tai_23_10: 92905000,
          chung_tu_thanh_toan_xac_thuc: {
            thoi_gian: "2026-10-02 13:38:00",
            so_tien: 40000000,
            ngan_hang: "VietinBank",
            nguoi_chuyen: "LUU THI KIM DUNG",
            ma_giao_dich: "UnfO-8CYCINX3I",
            ma_phieu_thu_sapo: "RVN00189",
            file_unc_goc: "1790923611775_2845688247116683961_g8911374775675572335_d2982bc32da528d8f0a0797ddf7ca138.jpg"
          },
          don_hang_dien_hinh_nha_bac_phat: {
            ngay_dat: "2026-10-16",
            ma_hoa_don_sapo: "SON00730",
            so_tam_plywood_e0: 52,
            ma_van_plywood: ["025T", "201T", "202t", "205T"],
            do_day_tam: ["18mm", "9mm", "6mm"],
            so_cuon_nep_chi: 7,
            gia_tri_don_hang: 36700000,
            file_chung_tu: "1792122328519_2845688247116683961_g8911374775675572335_2ff769d6fe78ba574d618d36eb8b15d6_n"
          },
          don_tra_hang_giam_tru: {
            ngay_tra: "2026-10-23",
            ma_chung_tu_sapo: "SRN0038 / SON00337",
            san_pham: "Plywood E0 18 Ly 414 PL (Số lượng: 1 tấm)",
            gia_tri_giam_tru: -750000,
            file_chung_tu: "1792746771305_2845688247116683961_g8911374775675572335_480ebf70d5eeb2bb6cb99c0d1e57c6b2_n"
          }
        },
        danh_gia_van_hanh: "Đối tác cung ứng Plywood cao cấp E0 lớn nhất, quy trình giao hàng - phiếu trả hàng - biên bản nghiệm thu và quản lý mã Sapo cực kỳ chặt chẽ, đối soát 100% minh bạch."
      },
      cuong_thinh: {
        ncc_id: "NCC_CUONG_THINH",
        ten_phap_ly: "CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI GỖ CƯỜNG THỊNH",
        dia_chi_nha_may: "Khu CN Sông Cùng, Cầu Gáo, Đan Phượng, Hà Nội",
        nhom_zalo_id: "g4212121922329497264",
        tong_so_file_media_kiem_tra: 8,
        quy_mo_chi_tieu_10_thang: 11760000,
        ty_trong: 4.87,
        don_gia_niem_yet_kiem_toan: {
          hmr_vanachai_thai_lan_17mm_e2: {
            ten: "HMR Vanachai Thái Lan 17mm E2",
            tho: 433000,
            phu_1_mat_van_go: 493000,
            phu_2_mat_van_go: 553000
          },
          hmr_vanachai_thai_lan_17mm_e1: {
            ten: "HMR Vanachai Thái Lan 17mm E1",
            tho: 458000,
            phu_1_mat_van_go: 518000,
            phu_2_mat_van_go: 578000
          },
          hmr_dongwha_17mm: {
            ten: "HMR Dongwha 17mm",
            tho: 339000,
            phu_1_mat_van_go: 399000,
            phu_2_mat_van_go: 459000
          },
          plywood_18mm_moc: {
            ten: "Plywood 18mm cốt mộc",
            don_gia: 625000
          },
          plywood_18mm_melamine_cu: {
            ten: "Plywood 18mm Melamine film cũ",
            mot_mat: 660000,
            hai_mat: 720000
          },
          plywood_18mm_melamine_moi: {
            ten: "Plywood 18mm Melamine film mới",
            mot_mat: 690000,
            hai_mat: 750000
          },
          plywood_18mm_melamine_8c: {
            ten: "Plywood 18mm Melamine phủ 8C",
            mot_mat: 830000,
            hai_mat: 890000
          }
        },
        danh_gia_van_hanh: "Đối tác dự phòng chiến lược chuyên ván Vanachai Thái Lan E1/E2 và Plywood. Đơn giá minh bạch, hỗ trợ đáp ứng nhanh khi xưởng cần bổ sung ván gấp."
      }
    },
    ket_luan_kiem_toan: {
      tinh_chinh_xac: "100% khớp nối giữa đơn đặt hàng xưởng, chứng từ ảnh Zalo, đối soát Sapo và sao kê ngân hàng",
      rui_ro_gian_lan: "0% - Không phát sinh hóa đơn khống hay chênh lệch ngoài sổ sách",
      khuyen_nghi_quan_tri: [
        "Tiếp tục duy trì quy chuẩn đóng dấu đỏ điện tử của Giám Đốc trước khi gửi đơn cho Lam Giang và NT Cầu Vượt.",
        "Cập nhật chốt công nợ tức thời <= 60 phút khi có phiếu trả hàng (như trường hợp giảm 750k của Cầu Vượt ngày 23/10).",
        "Theo dõi chặt chẽ hạn mức công nợ gối đầu của Lam Giang để tận dụng chiết khấu thanh toán."
      ]
    }
  };

  // --- HỆ THỐNG ĐỊNH MỨC TẤM CẮT CNC THỰC CHIẾN (MỤC 24 GEMINI.MD) ---
  // Khổ ván chuẩn: 1220 x 2440 mm = 2.9768 m2 / tấm
  const CNC_BENCHMARKS = {
    R09_TU_BEP_DUOI: {
      id: "R09_TU_BEP_DUOI",
      ma: "R09",
      ten: "Tủ bếp dưới (Sâu 600 x Cao 860, Thùng cao 740)",
      dvt: "Md",
      dinh_muc_tong: 1.45,
      chi_tiet: {
        thung_hau: 1.14,
        canh: 0.31,
        hau_6mm: 0.28
      },
      mo_ta: "Trừ chân nhựa 100mm + đá 20mm. Nóc rỗng đi 2 thanh xà 80mm. Khoang chậu rửa và bếp từ không có đợt ngang.",
      cong_thuc_chuan: "Md x 1.45 tấm/md (Ví dụ nhà anh Nam: 3.77 md x 1.45 = 5.47 ~ 5.5 tấm. CẤM BÁO 2.70 tấm/md!)"
    },
    R08_TU_BEP_TREN: {
      id: "R08_TU_BEP_TREN",
      ma: "R08",
      ten: "Tủ bếp trên (Sâu 350 x Cao 750)",
      dvt: "Md",
      dinh_muc_tong: 1.04,
      chi_tiet: {
        thung: 0.74,
        canh: 0.30,
        hau_6mm: 0.28
      },
      mo_ta: "Sâu 350mm nên 1 khổ ván rộng 1220mm xẻ dọc được 3 dải phôi 350mm cực kỳ lợi ván.",
      cong_thuc_chuan: "Md x 1.04 tấm ván 17mm + 0.28 tấm hậu 6mm"
    },
    R10_TU_BEP_KICH_TRAN: {
      id: "R10_TU_BEP_KICH_TRAN",
      ma: "R10",
      ten: "Tủ bếp kịch trần (Sâu 700 x Cao 720)",
      dvt: "Md",
      dinh_muc_tong: 1.44,
      chi_tiet: {
        thung: 1.15,
        canh: 0.29,
        hau_6mm: 0.27
      },
      mo_ta: "Sâu 700mm vượt quá nửa khổ ván 610mm, 1 khổ 1220mm xẻ được 1 dải 700mm + 1 dải 500mm tận dụng cho kệ/lavabo.",
      cong_thuc_chuan: "Md x 1.44 tấm ván 17mm + 0.27 tấm hậu 6mm"
    },
    R27_TU_AO_KICH_TRAN: {
      id: "R27_TU_AO_KICH_TRAN",
      ma: "R27/R40/R49",
      ten: "Tủ quần áo kịch trần (Sâu 600 x Cao 2700)",
      dvt: "M2",
      dinh_muc_tong: 1.05,
      chi_tiet: {
        thung_ngan_keo_canh: 1.05,
        hau_6mm: 0.36,
        khau_tru_canh_kinh: 0.40
      },
      mo_ta: "1 khổ ván 1220mm bổ đôi chuẩn 2 dải 600mm. Khoang nào lắp Cánh kính khung nhôm trừ ngay 0.40 tấm/m2.",
      cong_thuc_chuan: "M2 x 1.05 tấm ván 17mm + 0.36 tấm hậu 6mm (trừ 0.40 nếu cánh kính)"
    },
    R05_HOC_TU_TRANG_TRI: {
      id: "R05_HOC_TU_TRANG_TRI",
      ma: "R05",
      ten: "Hộc tủ trang trí nông (Sâu 200 x Cao 1850)",
      dvt: "M2",
      dinh_muc_tong: 0.50,
      chi_tiet: {
        thung_dot: 0.50,
        hau_6mm: 0.25
      },
      mo_ta: "1 tấm ván khổ 1220mm xẻ được 6 dải sâu 200mm rất tiết kiệm ván.",
      cong_thuc_chuan: "M2 x 0.50 tấm ván 17mm + 0.25 tấm hậu 6mm"
    },
    R06_VACH_OP_PHANG: {
      id: "R06_VACH_OP_PHANG",
      ma: "R06/R23/R25",
      ten: "Vách ốp phẳng trang trí (Dày 17mm)",
      dvt: "M2",
      dinh_muc_tong: 0.40,
      chi_tiet: {
        tam_mat: 0.40,
        loai_soi_huynh_lam: 0.52
      },
      mo_ta: "Hao hụt ghép vân & xương lót ~15% còn 2.50 m2 thành phẩm/tấm. Vách có lam hoặc soi huỳnh CNC là 0.52 tấm/m2.",
      cong_thuc_chuan: "M2 x 0.40 tấm/m2 (hoặc 0.52 nếu soi huỳnh lam sóng)"
    },
    R33_GIUONG_BO_CONG: {
      id: "R33_GIUONG_BO_CONG",
      ma: "R33/R42",
      ten: "Giường ngủ bo cong không đầu giường (1600x2000 / 1800x2000)",
      dvt: "Cái",
      dinh_muc_tong: 3.4,
      chi_tiet: {
        phan_giuong: 1.4,
        vai_duoi_bo_cong: 1.0,
        he_xuong_thang: 1.0
      },
      mo_ta: "Phản giường 2 tấm ghép ~1.4 tấm, 3 vai/đuôi bo cong chập đôi + xương chịu lực ~2.0 tấm.",
      cong_thuc_chuan: "3.3 – 3.5 tấm / cái"
    },
    R04_KE_TIVI_TREO: {
      id: "R04_KE_TIVI_TREO",
      ma: "R04/R24/R36",
      ten: "Kệ tivi / Bàn học treo bo góc (Sâu 400-550 x Cao 150-300)",
      dvt: "Md",
      dinh_muc_tong: 0.60,
      chi_tiet: {
        thung_mat_canh: 0.60,
        day_ngan_keo: 0.15
      },
      mo_ta: "Sâu 400-550mm, 1 khổ xẻ được 2-3 dải. Đáy ngăn kéo đi ván mỏng 6mm hoặc tận dụng phôi dư.",
      cong_thuc_chuan: "0.55 – 0.65 tấm ván 17mm/md + 0.15 tấm hậu/md"
    }
  };

  // --- ĐƠN GIÁ THAM CHIẾU 3 CẤP VẬT LIỆU (QUY TẮC MỤC 24.2 GEMINI.MD) ---
  const MATERIAL_TIERS = {
    AN_CUONG: {
      ten: "Gỗ An Cường Chính Hãng",
      dac_tinh: "MDF Lõi xanh chống ẩm phủ Melamine 2 mặt, Nhựa WPB cao cấp",
      don_gia_phoi_tb: 820000,
      chenh_lech_so_voi_thai_lan: "+380.000 đ/tấm phôi ván",
      nhom_ncc: "Lam Giang (Đại lý phân phối) & Trực tiếp",
      wpb_dac: 2550000,
      ghi_chu: "Thương hiệu hàng đầu, độ phủ bảo hành 100%, chiết khấu theo sản lượng hợp đồng."
    },
    THAI_LAN: {
      ten: "Gỗ Vanachai / Dongwha Thái Lan",
      dac_tinh: "HMR Chống ẩm Vanachai E1/E2, Dongwha chuẩn xưởng",
      don_gia_phoi_tb: 553000,
      chenh_lech_so_voi_thai_lan: "Chuẩn cơ sở (-380.000 đ so với An Cường)",
      nhom_ncc: "Gỗ Cường Thịnh & Lam Giang",
      bang_gia_e1: 578000,
      bang_gia_e2: 553000,
      ghi_chu: "Độ bền cao, giá thành hợp lý, tối ưu cho dự án nhà phố và căn hộ vừa."
    },
    PLYWOOD_E0: {
      ten: "Plywood E0 Chống Nước Cao Cấp",
      dac_tinh: "Plywood cốt bạch đàn/keo ép keo E0 phủ Melamine 2 mặt",
      don_gia_phoi_tb: 750000,
      chenh_lech_so_voi_thai_lan: "+170.000 – +330.000 đ/tấm",
      nhom_ncc: "Gỗ NT Cầu Vượt (NCC độc quyền Plywood E0)",
      tam_e0_18mm: 750000,
      tam_e0_8c: 890000,
      ghi_chu: "Chống nước tuyệt đối, bám vít siêu chắc, dùng cho tủ bếp, lavabo và khu vực ẩm ướt."
    }
  };

  // --- TRẠNG THÁI HIỆN TẠI CỦA MODULE W10 ---
  let state = {
    activeTab: "tong_quan",
    filterSupplier: "ALL",
    calculator: {
      selectedItemKey: "R09_TU_BEP_DUOI",
      volume: 3.77, // md hoặc m2
      isGlassDoor: false,
      isLamHuynh: false,
      orderedSheets: 5.5,
      actualPricePerSheet: 553000,
      supplierId: "NCC_01_LAM_GIANG"
    }
  };

  // --- HÀM ĐỊNH DẠNG SỐ TIỀN & PHẦN TRĂM ---
  function formatMoney(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return "0 đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  }

  function formatNumber(num, decimals = 2) {
    if (num === undefined || num === null || isNaN(num)) return "0";
    return Number(num).toFixed(decimals);
  }

  // --- ENGINE TÍNH TOÁN ĐỊNH MỨC TẤM CNC & CẢNH BÁO ĐỘ LỆCH ---
  function calculateCncQuota(itemKey, volume, options = {}) {
    const item = CNC_BENCHMARKS[itemKey];
    if (!item) return null;

    let baseRate = item.dinh_muc_tong;

    // Hiệu chỉnh đặc thù
    if (itemKey === "R27_TU_AO_KICH_TRAN" && options.isGlassDoor) {
      baseRate = baseRate - item.chi_tiet.khau_tru_canh_kinh; // trừ 0.40 tấm cánh kính
    } else if (itemKey === "R06_VACH_OP_PHANG" && options.isLamHuynh) {
      baseRate = item.chi_tiet.loai_soi_huynh_lam; // 0.52 tấm/m2
    }

    const standardSheets = volume * baseRate;
    const roundedSheets = Math.ceil(standardSheets * 10) / 10; // làm tròn 1 chữ số thập phân
    const hauSheets = item.chi_tiet && item.chi_tiet.hau_6mm ? volume * item.chi_tiet.hau_6mm : 0;

    return {
      item,
      volume,
      effectiveRate: baseRate,
      standardSheetsExact: standardSheets,
      standardSheetsRecommended: roundedSheets,
      hauSheets: Math.ceil(hauSheets * 10) / 10
    };
  }

  // Phân tích độ lệch so với số tấm Vũ đề xuất đặt hàng
  function evaluateVariance(standardRecommended, orderedSheets) {
    const diff = orderedSheets - standardRecommended;
    const percentDiff = standardRecommended > 0 ? (diff / standardRecommended) * 100 : 0;

    let status = "SAFE";
    let message = "";
    let badgeClass = "pg-badge-success";
    let canApprove = true;

    if (percentDiff > 15) {
      status = "DANGER";
      message = `CẢNH BÁO ĐỎ: Số tấm đặt hàng vượt định mức CNC +${formatNumber(percentDiff, 1)}% (+${formatNumber(diff, 1)} tấm). Khóa duyệt dấu đỏ! Cần kiểm tra lại nesting hoặc phôi thừa xưởng.`;
      badgeClass = "pg-badge-danger";
      canApprove = false;
    } else if (percentDiff > 5) {
      status = "WARNING";
      message = `CẢNH BÁO VÀNG: Số tấm đặt hàng cao hơn định mức +${formatNumber(percentDiff, 1)}% (+${formatNumber(diff, 1)} tấm). Chấp nhận được nếu có hao hụt vân gỗ phức tạp, nhưng cần Vũ giải trình.`;
      badgeClass = "pg-badge-warning";
      canApprove = true;
    } else if (percentDiff < -10) {
      status = "DEFICIT";
      message = `LƯU Ý: Số tấm đặt thấp hơn định mức CNC -${formatNumber(Math.abs(percentDiff), 1)}% (-${formatNumber(Math.abs(diff), 1)} tấm). Cần xác nhận xưởng có sẵn phôi tận dụng hay không, tránh thiếu ván dừng máy CNC!`;
      badgeClass = "pg-badge-info";
      canApprove = true;
    } else {
      status = "SAFE";
      message = `HOÀN TOÀN HỢP LỆ: Khớp chuẩn định mức thực chiến xưởng PG Home (Sai số ${formatNumber(percentDiff, 1)}%). Đủ điều kiện để Giám Đốc phê duyệt đóng dấu đỏ điện tử.`;
      badgeClass = "pg-badge-success";
      canApprove = true;
    }

    return {
      status,
      diff,
      percentDiff,
      message,
      badgeClass,
      canApprove
    };
  }

  // --- RENDER GIAO DIỆN CHÍNH ---
  function render(containerId) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) {
      console.warn("[PG_Modules_W10] Không tìm thấy thẻ chứa containerId:", containerId);
      return;
    }

    injectStylesOnce();

    container.innerHTML = `
      <div class="pg-w10-wrapper">
        ${renderHeader()}
        ${renderNavTabs()}
        <div id="pg-w10-tab-content" class="pg-w10-tab-content">
          ${renderTabContent(state.activeTab)}
        </div>
        ${renderFooter()}
      </div>
    `;

    bindEvents(container);
  }

  // --- RENDER HEADER ---
  function renderHeader() {
    return `
      <div class="pg-w10-header">
        <div class="pg-w10-header-left">
          <div class="pg-w10-brand">
            <span class="pg-w10-badge-phugia">PHÚ GIA LUXURY • MÃ HKD: 042203002931</span>
            <span class="pg-w10-badge-version">W10 STEALTH v1.0</span>
          </div>
          <h2 class="pg-w10-title">BẢNG ĐỐI SOÁT CÔNG NỢ & ĐƠN GIÁ 3 NHÀ CUNG CẤP VÁN CHỦ LỰC</h2>
          <p class="pg-w10-subtitle">
            Hệ thống đối soát 3 lớp chéo (Ảnh hóa đơn Zalo + Xác nhận nhóm + UNC Ngân hàng) & Engine Định mức cắt CNC (Mục 24 GEMINI.md)
          </p>
        </div>
        <div class="pg-w10-header-right">
          <div class="pg-stat-chip">
            <div class="pg-stat-val text-blue">${formatMoney(AUDIT_DATA.tong_quan_3_ncc.tong_chi_phi_luy_ke_10_thang)}</div>
            <div class="pg-stat-lbl">Tổng chi tiêu 10 tháng 2026</div>
          </div>
          <div class="pg-stat-chip">
            <div class="pg-stat-val text-green">100% KHỚP NỐI</div>
            <div class="pg-stat-lbl">Kiểm toán Zero-Trust 06/11</div>
          </div>
        </div>
      </div>
    `;
  }

  // --- RENDER NAV TABS ---
  function renderNavTabs() {
    const tabs = [
      { key: "tong_quan", label: "📊 1. Tổng Quan & Dòng Tiền 3 NCC", badge: "241.3M" },
      { key: "so_sanh_gia", label: "🏷️ 2. Đơn Giá & 3 Cấp Vật Liệu", badge: "3 NCC" },
      { key: "cong_cu_cnc", label: "📐 3. Soát Định Mức CNC & Cảnh Báo", badge: "Mục 24" },
      { key: "thuc_chien_du_an", label: "🔍 4. Hồ Sơ Thực Chiến (Bác Phát & Nam)", badge: "Sapo / Zalo" },
      { key: "quy_chuan_quan_tri", label: "🛡️ 5. Quy Chuẩn Két Sắt & Dấu Đỏ", badge: "Kỷ luật thép" }
    ];

    return `
      <div class="pg-w10-tabs">
        ${tabs.map(tab => `
          <button class="pg-w10-tab-btn ${state.activeTab === tab.key ? 'active' : ''}" data-tab="${tab.key}">
            <span>${tab.label}</span>
            <span class="pg-tab-pill">${tab.badge}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // --- RENDER NỘI DUNG TỪNG TAB ---
  function renderTabContent(tabKey) {
    switch (tabKey) {
      case "tong_quan":
        return renderTabTongQuan();
      case "so_sanh_gia":
        return renderTabSoSanhGia();
      case "cong_cu_cnc":
        return renderTabCongCuCnc();
      case "thuc_chien_du_an":
        return renderTabThucChien();
      case "quy_chuan_quan_tri":
        return renderTabQuyChuan();
      default:
        return `<div class="p-4">Đang tải dữ liệu...</div>`;
    }
  }

  // --- TAB 1: TỔNG QUAN & DÒNG TIỀN ---
  function renderTabTongQuan() {
    const tq = AUDIT_DATA.tong_quan_3_ncc;
    const lg = AUDIT_DATA.chi_tiet_ncc.lam_giang;
    const cv = AUDIT_DATA.chi_tiet_ncc.cau_vuot;
    const ct = AUDIT_DATA.chi_tiet_ncc.cuong_thinh;

    return `
      <div class="pg-tab-pane">
        <!-- Banner cảnh báo kiểm toán -->
        <div class="pg-alert-banner">
          <div class="pg-alert-icon">🛡️</div>
          <div class="pg-alert-body">
            <strong>BÁO CÁO ĐỐI SOÁT KIỂM TOÁN CHÍNH THỨC BAN GIÁM ĐỐC:</strong> 
            Tổng lũy kế chi phí ván 10 tháng năm 2026 đạt <strong>${formatMoney(tq.tong_chi_phi_luy_ke_10_thang)}</strong> (${tq.tong_chi_phi_luy_ke_10_thang_chu}). 
            Đã thẩm tra 100% hồ sơ từ <strong>366 tệp media chứng từ Zalo</strong>, đối soát tự động hệ thống Sapo và lệnh chuyển khoản ngân hàng ngày 06/11/2026.
          </div>
        </div>

        <!-- Biểu đồ tỷ trọng 3 NCC -->
        <div class="pg-card mb-4">
          <div class="pg-card-header">
            <h3>CƠ CẤU VÀ TỶ TRỌNG PHÂN BỔ CHI TIÊU VÁN GỖ (T01 - T10/2026)</h3>
            <span class="text-muted text-sm">Cập nhật: 06/11/2026 17:00</span>
          </div>
          <div class="pg-card-body">
            <!-- Thanh tiến trình tỷ trọng trực quan -->
            <div class="pg-progress-stacked">
              <div class="pg-prog-segment bg-blue" style="width: 61.12%;" title="Lam Giang: 61.12%">Lam Giang (61.1%)</div>
              <div class="pg-prog-segment bg-green" style="width: 34.01%;" title="Gỗ NT Cầu Vượt: 34.01%">Cầu Vượt (34.0%)</div>
              <div class="pg-prog-segment bg-amber" style="width: 4.87%;" title="Cường Thịnh: 4.87%">Cường Thịnh (4.9%)</div>
            </div>

            <!-- Bảng tóm tắt số liệu 3 NCC -->
            <div class="pg-grid-3 mt-4">
              <div class="pg-summary-box border-blue">
                <div class="pg-box-top">
                  <span class="pg-box-badge bg-blue-soft text-blue">CHỦ LỰC SỐ 1</span>
                  <span class="pg-box-icon">🏭</span>
                </div>
                <h4>LAM GIANG</h4>
                <div class="pg-box-money text-blue">${formatMoney(lg.quy_mo_chi_tieu_10_thang)}</div>
                <div class="pg-box-meta">Tỷ trọng: <strong>61.12%</strong> • Media: <strong>${lg.tong_so_file_media_kiem_tra} file</strong></div>
                <div class="pg-box-note">MDF chống ẩm, MFC, Tấm nhựa đặc WPB/Picomat</div>
              </div>

              <div class="pg-summary-box border-green">
                <div class="pg-box-top">
                  <span class="pg-box-badge bg-green-soft text-green">PLYWOOD CAO CẤP</span>
                  <span class="pg-box-icon">🌲</span>
                </div>
                <h4>GỖ NT CẦU VƯỢT</h4>
                <div class="pg-box-money text-green">${formatMoney(cv.quy_mo_chi_tieu_10_thang)}</div>
                <div class="pg-box-meta">Tỷ trọng: <strong>34.01%</strong> • Media: <strong>${cv.tong_so_file_media_kiem_tra} file</strong></div>
                <div class="pg-box-note">Plywood chuẩn E0 xuất khẩu, nẹp dán chỉ PVC</div>
              </div>

              <div class="pg-summary-box border-amber">
                <div class="pg-box-top">
                  <span class="pg-box-badge bg-amber-soft text-amber">DỰ PHÒNG CHIẾN LƯỢC</span>
                  <span class="pg-box-icon">🪵</span>
                </div>
                <h4>GỖ CƯỜNG THỊNH</h4>
                <div class="pg-box-money text-amber">${formatMoney(ct.quy_mo_chi_tieu_10_thang)}</div>
                <div class="pg-box-meta">Tỷ trọng: <strong>4.87%</strong> • Media: <strong>${ct.tong_so_file_media_kiem_tra} file</strong></div>
                <div class="pg-box-note">HMR Vanachai Thái Lan E1/E2, Dongwha xưởng</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chi tiết hồ sơ thanh toán thực tế 06/11/2026 -->
        <div class="pg-card mb-4">
          <div class="pg-card-header">
            <h3>BIẾN ĐỘNG THANH TOÁN MỚI NHẤT TRONG NGÀY 06/11/2026 (KHỚP LỆNH NGÂN HÀNG)</h3>
            <span class="pg-badge-success">2 Giao dịch • Tổng: ${formatMoney(lg.bien_dong_thanh_toan_moi_nhat_06_11_2026.tong_thanh_toan_trong_ngay)}</span>
          </div>
          <div class="pg-card-body p-0">
            <table class="pg-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Thời gian</th>
                  <th>Số tiền</th>
                  <th>Ngân hàng & Người chuyển</th>
                  <th>Nội dung giao dịch</th>
                  <th>Mã GD / Tham chiếu</th>
                  <th>Chứng từ Zalo gốc</th>
                </tr>
              </thead>
              <tbody>
                ${lg.bien_dong_thanh_toan_moi_nhat_06_11_2026.danh_sach_unc.map(u => `
                  <tr>
                    <td><strong>#${u.stt}</strong></td>
                    <td><span class="text-mono text-sm">${u.thoi_gian}</span></td>
                    <td><strong class="text-blue">${formatMoney(u.so_tien)}</strong></td>
                    <td>
                      <span class="pg-badge-pill">${u.ngan_hang_chuyen}</span>
                      <div class="text-sm font-semibold">${u.nguoi_chuyen}</div>
                    </td>
                    <td class="text-sm">${u.noi_dung}</td>
                    <td><span class="text-mono text-xs">${u.ma_giao_dich}</span></td>
                    <td>
                      <span class="text-mono text-xs text-muted" title="${u.file_chung_tu_goc}">
                        ${u.file_chung_tu_goc.substring(0, 24)}...jpg
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- TAB 2: ĐƠN GIÁ & 3 CẤP VẬT LIỆU ---
  function renderTabSoSanhGia() {
    const ct = AUDIT_DATA.chi_tiet_ncc.cuong_thinh.don_gia_niem_yet_kiem_toan;

    return `
      <div class="pg-tab-pane">
        <!-- Nguyên tắc xương máu định giá 3 cấp -->
        <div class="pg-card mb-4">
          <div class="pg-card-header bg-gradient-navy text-white">
            <h3>QUY TẮC ĐỊNH GIÁ 3 CẤP VẬT LIỆU (BÀI HỌC MỤC 24.2 - GIÁM ĐỐC CHUẨN HÓA)</h3>
          </div>
          <div class="pg-card-body">
            <div class="pg-rule-box">
              <p><strong>CỐT LÕI ĐỐI SOÁT:</strong> Giữa ván <strong>An Cường</strong> và <strong>Thái Lan (Vanachai/Dongwha)</strong> chỉ chênh lệch thực tế tiền phôi gỗ khoảng <strong>~380.000 đ/tấm</strong>.</p>
              <p>Trong khi đó: <strong>Nhựa đặc WPB An Cường (2.550.000 đ/tấm)</strong>, <strong>Cánh Acrylic Noline</strong>, phụ kiện ray giảm chấn, bản lề, kính cường lực và đơn giá công thợ là cố định 100%.</p>
              <p class="mb-0 text-danger font-semibold">⚠️ DO ĐÓ: Khi báo giá dòng gỗ Thái Lan chỉ được giảm tương ứng phần chênh phôi ván (~12% – 14%), TUYỆT ĐỐI KHÔNG giảm sâu ở các hạng mục có cánh Acrylic hoặc thùng nhựa WPB!</p>
            </div>

            <div class="pg-grid-3 mt-4">
              <div class="pg-tier-card">
                <div class="pg-tier-badge tier-ac">HẠNG A: AN CƯỜNG</div>
                <h4>MDF Lõi Xanh / WPB</h4>
                <div class="pg-tier-price">~820.000 đ / tấm phôi</div>
                <ul class="pg-tier-features">
                  <li>Phân phối chính qua: <strong>Lam Giang</strong></li>
                  <li>Nhựa đặc WPB: <strong>2.550.000 đ/tấm</strong></li>
                  <li>Bề mặt Melamine đồng màu phong phú</li>
                  <li>Bảo hành thương hiệu cao cấp</li>
                </ul>
              </div>

              <div class="pg-tier-card">
                <div class="pg-tier-badge tier-thai">HẠNG B: THÁI LAN (HMR)</div>
                <h4>Vanachai E1/E2 - Dongwha</h4>
                <div class="pg-tier-price">459.000 – 578.000 đ / tấm</div>
                <ul class="pg-tier-features">
                  <li>Phân phối qua: <strong>Cường Thịnh & Lam Giang</strong></li>
                  <li>Chênh lệch phôi: <strong>-380.000 đ so với AC</strong></li>
                  <li>Cốt HMR chống ẩm xanh tỷ trọng cao</li>
                  <li>Tối ưu chi phí nhà phố và căn hộ vừa</li>
                </ul>
              </div>

              <div class="pg-tier-card">
                <div class="pg-tier-badge tier-ply">HẠNG C: PLYWOOD E0</div>
                <h4>Plywood Gỗ Cầu Vượt</h4>
                <div class="pg-tier-price">720.000 – 890.000 đ / tấm</div>
                <ul class="pg-tier-features">
                  <li>Cung ứng độc quyền: <strong>NT Cầu Vượt</strong></li>
                  <li>Tiêu chuẩn khí thải E0 khắt khe</li>
                  <li>Chống nước tuyệt đối cho bếp & lavabo</li>
                  <li>Độ bám vít vượt trội gỗ công nghiệp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Bảng giá niêm yết kiểm toán từ Cường Thịnh -->
        <div class="pg-card">
          <div class="pg-card-header">
            <h3>BẢNG GIÁ NIÊM YẾT KIỂM TOÁN VÁN GỖ THÁI LAN & PLYWOOD (CƯỜNG THỊNH)</h3>
            <span class="text-sm text-muted">Đơn vị: VNĐ / Tấm khổ chuẩn 1220x2440mm</span>
          </div>
          <div class="pg-card-body p-0">
            <table class="pg-table">
              <thead>
                <tr>
                  <th>Loại phôi ván gỗ</th>
                  <th>Quy cách / Tiêu chuẩn</th>
                  <th>Giá Cốt Thô</th>
                  <th>Phủ 1 Mặt Melamine</th>
                  <th>Phủ 2 Mặt Melamine</th>
                  <th>Ghi chú kiểm toán</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>HMR Vanachai Thái Lan 17mm E2</strong></td>
                  <td>Cốt chống ẩm xanh E2</td>
                  <td>${formatMoney(ct.hmr_vanachai_thai_lan_17mm_e2.tho)}</td>
                  <td>${formatMoney(ct.hmr_vanachai_thai_lan_17mm_e2.phu_1_mat_van_go)}</td>
                  <td><strong class="text-blue">${formatMoney(ct.hmr_vanachai_thai_lan_17mm_e2.phu_2_mat_van_go)}</strong></td>
                  <td>Ván thông dụng nội thất phổ thông</td>
                </tr>
                <tr>
                  <td><strong>HMR Vanachai Thái Lan 17mm E1</strong></td>
                  <td>Cốt tiêu chuẩn E1 ít mùi</td>
                  <td>${formatMoney(ct.hmr_vanachai_thai_lan_17mm_e1.tho)}</td>
                  <td>${formatMoney(ct.hmr_vanachai_thai_lan_17mm_e1.phu_1_mat_van_go)}</td>
                  <td><strong class="text-blue">${formatMoney(ct.hmr_vanachai_thai_lan_17mm_e1.phu_2_mat_van_go)}</strong></td>
                  <td>Chuẩn phòng ngủ trẻ em & người già</td>
                </tr>
                <tr>
                  <td><strong>HMR Dongwha 17mm</strong></td>
                  <td>Cốt xanh Hàn Quốc liên doanh</td>
                  <td>${formatMoney(ct.hmr_dongwha_17mm.tho)}</td>
                  <td>${formatMoney(ct.hmr_dongwha_17mm.phu_1_mat_van_go)}</td>
                  <td><strong class="text-blue">${formatMoney(ct.hmr_dongwha_17mm.phu_2_mat_van_go)}</strong></td>
                  <td>Ván tối ưu giá thành công trình rẻ</td>
                </tr>
                <tr>
                  <td><strong>Plywood 18mm Cốt Mộc</strong></td>
                  <td>Cốt ván ép bạch đàn nhiều lớp</td>
                  <td><strong class="text-green">${formatMoney(ct.plywood_18mm_moc.don_gia)}</strong></td>
                  <td>-</td>
                  <td>-</td>
                  <td>Dùng làm xương lót, vách ngăn mộc</td>
                </tr>
                <tr>
                  <td><strong>Plywood 18mm Phủ Melamine Film Cũ</strong></td>
                  <td>Chống nước chống xước</td>
                  <td>-</td>
                  <td>${formatMoney(ct.plywood_18mm_melamine_cu.mot_mat)}</td>
                  <td><strong>${formatMoney(ct.plywood_18mm_melamine_cu.hai_mat)}</strong></td>
                  <td>Dùng khoang chậu rửa tủ bếp</td>
                </tr>
                <tr>
                  <td><strong>Plywood 18mm Phủ Melamine Film Mới</strong></td>
                  <td>Vân gỗ đồng nhất cao cấp</td>
                  <td>-</td>
                  <td>${formatMoney(ct.plywood_18mm_melamine_moi.mot_mat)}</td>
                  <td><strong>${formatMoney(ct.plywood_18mm_melamine_moi.hai_mat)}</strong></td>
                  <td>Dùng tủ bếp cao cấp, lavabo</td>
                </tr>
                <tr>
                  <td><strong>Plywood 18mm Melamine 8C</strong></td>
                  <td>Bề mặt sần vân da phủ bóng 8C</td>
                  <td>-</td>
                  <td>${formatMoney(ct.plywood_18mm_melamine_8c.mot_mat)}</td>
                  <td><strong class="text-amber">${formatMoney(ct.plywood_18mm_melamine_8c.hai_mat)}</strong></td>
                  <td>Dòng VIP tương đương Plywood Cầu Vượt</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- TAB 3: SOÁT ĐỊNH MỨC CNC & CẢNH BÁO ĐỘ LỆCH (TRỌNG TÂM MỤC 24) ---
  function renderTabCongCuCnc() {
    const calc = state.calculator;
    const selectedItem = CNC_BENCHMARKS[calc.selectedItemKey] || CNC_BENCHMARKS.R09_TU_BEP_DUOI;

    const quotaResult = calculateCncQuota(calc.selectedItemKey, calc.volume, {
      isGlassDoor: calc.isGlassDoor,
      isLamHuynh: calc.isLamHuynh
    });

    const varianceResult = evaluateVariance(quotaResult.standardSheetsRecommended, calc.orderedSheets);
    const estimatedCost = calc.orderedSheets * calc.actualPricePerSheet;

    return `
      <div class="pg-tab-pane">
        <!-- Khối hướng dẫn định mức Mục 24 -->
        <div class="pg-alert-banner">
          <div class="pg-alert-icon">⚡</div>
          <div class="pg-alert-body">
            <strong>BỘ LỌC ĐỐI SOÁT ĐỊNH MỨC TẤM CNC XƯỞNG PG HOME (MỤC 24):</strong>
            Hệ thống tự động tính số tấm ván chuẩn theo thiết kế thực tế và đối soát với số lượng đề xuất đặt hàng của Kỹ thuật/Vũ.
            Nếu độ lệch vượt quá +15%, hệ thống sẽ <strong>TỰ ĐỘNG KHÓA DUYỆT DẤU ĐỎ</strong> để bảo vệ dòng tiền két sắt!
          </div>
        </div>

        <div class="pg-grid-2 mt-4">
          <!-- BÊN TRÁI: FORM NHẬP LIỆU -->
          <div class="pg-card">
            <div class="pg-card-header">
              <h3>NHẬP KHỐI LƯỢNG & ĐỀ XUẤT ĐẶT HÀNG</h3>
              <span class="pg-badge-pill">Dành cho Giám Đốc & Kỹ thuật Vũ</span>
            </div>
            <div class="pg-card-body">
              <div class="pg-form-group">
                <label>Hạng mục nội thất chuẩn CNC:</label>
                <select id="w10-select-item" class="pg-input">
                  ${Object.keys(CNC_BENCHMARKS).map(key => {
                    const it = CNC_BENCHMARKS[key];
                    return `<option value="${key}" ${key === calc.selectedItemKey ? 'selected' : ''}>[${it.ma}] ${it.ten}</option>`;
                  }).join('')}
                </select>
                <div class="text-xs text-muted mt-1">${selectedItem.mo_ta}</div>
              </div>

              <div class="pg-grid-2">
                <div class="pg-form-group">
                  <label>Khối lượng thiết kế (${selectedItem.dvt}):</label>
                  <input type="number" id="w10-input-volume" class="pg-input text-mono font-bold" value="${calc.volume}" step="0.01" min="0.1">
                  <span class="text-xs text-muted">Đơn vị: <strong>${selectedItem.dvt}</strong></span>
                </div>

                <div class="pg-form-group">
                  <label>Số tấm đề xuất đặt hàng (Tấm):</label>
                  <input type="number" id="w10-input-ordered" class="pg-input text-mono font-bold text-blue" value="${calc.orderedSheets}" step="0.1" min="0.1">
                  <span class="text-xs text-muted">Phiếu đề xuất của Vũ</span>
                </div>
              </div>

              <!-- Tùy biến mở rộng cho Tủ áo hoặc Vách ốp -->
              ${calc.selectedItemKey === 'R27_TU_AO_KICH_TRAN' ? `
                <div class="pg-checkbox-group">
                  <label>
                    <input type="checkbox" id="w10-check-glass" ${calc.isGlassDoor ? 'checked' : ''}>
                    Có khoang Cánh Kính Khung Nhôm (Trừ 0.40 tấm/m2 diện tích cánh kính)
                  </label>
                </div>
              ` : ''}

              ${calc.selectedItemKey === 'R06_VACH_OP_PHANG' ? `
                <div class="pg-checkbox-group">
                  <label>
                    <input type="checkbox" id="w10-check-lam" ${calc.isLamHuynh ? 'checked' : ''}>
                    Có Lam Sóng hoặc Soi Huỳnh CNC (Tăng định mức lên 0.52 tấm/m2)
                  </label>
                </div>
              ` : ''}

              <div class="pg-grid-2 mt-3">
                <div class="pg-form-group">
                  <label>Nhà Cung Cấp Ván:</label>
                  <select id="w10-select-ncc" class="pg-input">
                    <option value="NCC_01_LAM_GIANG" ${calc.supplierId === 'NCC_01_LAM_GIANG' ? 'selected' : ''}>Lam Giang (MDF/WPB)</option>
                    <option value="NCC_16_CAU_VUOT" ${calc.supplierId === 'NCC_16_CAU_VUOT' ? 'selected' : ''}>Gỗ NT Cầu Vượt (Plywood E0)</option>
                    <option value="NCC_CUONG_THINH" ${calc.supplierId === 'NCC_CUONG_THINH' ? 'selected' : ''}>Gỗ Cường Thịnh (Vanachai/Dongwha)</option>
                  </select>
                </div>

                <div class="pg-form-group">
                  <label>Đơn giá phôi ván dự kiến:</label>
                  <input type="number" id="w10-input-price" class="pg-input text-mono" value="${calc.actualPricePerSheet}" step="1000">
                  <span class="text-xs text-muted">${formatMoney(calc.actualPricePerSheet)} / tấm</span>
                </div>
              </div>

              <!-- Quick presets nút bấm mẫu thử thực tế -->
              <div class="pg-presets-bar mt-3">
                <span class="text-xs font-semibold text-muted">Test case mẫu:</span>
                <button type="button" class="pg-btn-sm" id="w10-preset-nam">🏠 Tủ Bếp Dưới Nam (3.77md = 5.5 tấm)</button>
                <button type="button" class="pg-btn-sm" id="w10-preset-phat">🏢 Đơn Plywood Bác Phát (52 tấm)</button>
                <button type="button" class="pg-btn-sm" id="w10-preset-ao">🚪 Tủ Áo 13.8m2 Kịch Trần</button>
              </div>
            </div>
          </div>

          <!-- BÊN PHẢI: KẾT QUẢ ĐỐI SOÁT & CẢNH BÁO -->
          <div class="pg-card">
            <div class="pg-card-header">
              <h3>KẾT QUẢ KIỂM SOÁT & THẨM ĐỊNH DẤU ĐỎ</h3>
              <span class="pg-badge-pill ${varianceResult.badgeClass}">${varianceResult.status}</span>
            </div>
            <div class="pg-card-body">
              <!-- Hộp cảnh báo độ lệch -->
              <div class="pg-variance-box ${varianceResult.badgeClass}">
                <div class="pg-variance-icon">
                  ${varianceResult.status === 'SAFE' ? '✅' : varianceResult.status === 'WARNING' ? '⚠️' : '🚨'}
                </div>
                <div class="pg-variance-content">
                  <div class="pg-variance-title">
                    Độ lệch so với định mức: 
                    <strong>${varianceResult.diff > 0 ? '+' : ''}${formatNumber(varianceResult.diff, 1)} tấm (${varianceResult.percentDiff > 0 ? '+' : ''}${formatNumber(varianceResult.percentDiff, 1)}%)</strong>
                  </div>
                  <div class="pg-variance-desc">${varianceResult.message}</div>
                </div>
              </div>

              <!-- Chỉ số chi tiết -->
              <div class="pg-grid-2 mt-4">
                <div class="pg-kpi-tile">
                  <div class="pg-kpi-lbl">Định mức CNC chuẩn thực chiến:</div>
                  <div class="pg-kpi-val text-blue">${formatNumber(quotaResult.standardSheetsRecommended, 1)} <span class="text-sm">tấm</span></div>
                  <div class="text-xs text-muted">Hệ số: <strong>${quotaResult.effectiveRate}</strong> tấm / ${selectedItem.dvt}</div>
                </div>

                <div class="pg-kpi-tile">
                  <div class="pg-kpi-lbl">Số tấm Vũ đề xuất:</div>
                  <div class="pg-kpi-val text-amber">${formatNumber(calc.orderedSheets, 1)} <span class="text-sm">tấm</span></div>
                  <div class="text-xs text-muted">Chênh lệch: <strong>${formatNumber(varianceResult.diff, 1)} tấm</strong></div>
                </div>

                <div class="pg-kpi-tile">
                  <div class="pg-kpi-lbl">Tấm hậu 6mm kèm theo:</div>
                  <div class="pg-kpi-val text-green">${formatNumber(quotaResult.hauSheets, 1)} <span class="text-sm">tấm</span></div>
                  <div class="text-xs text-muted">Dùng cho hậu tủ & đáy hộc</div>
                </div>

                <div class="pg-kpi-tile">
                  <div class="pg-kpi-lbl">Tổng giá trị đơn đặt ván:</div>
                  <div class="pg-kpi-val text-purple">${formatMoney(estimatedCost)}</div>
                  <div class="text-xs text-muted">Tạm tính theo đơn giá phôi</div>
                </div>
              </div>

              <!-- Trạng thái dấu đỏ điện tử của Giám Đốc -->
              <div class="pg-stamp-box mt-4">
                <div class="pg-stamp-seal ${varianceResult.canApprove ? 'seal-approved' : 'seal-locked'}">
                  ${varianceResult.canApprove ? 'ĐÃ ĐỦ ĐIỀU KIỆN<br>DUYỆT DẤU ĐỎ' : 'BỊ KHÓA DUYỆT<br>VƯỢT ĐỊNH MỨC'}
                </div>
                <div class="pg-stamp-text">
                  <strong>QUY TẮC CỐT TỬ CỦA GIÁM ĐỐC:</strong><br>
                  ${varianceResult.canApprove 
                    ? 'Phiếu đề xuất hợp lệ. Giám Đốc có thể đóng dấu đỏ điện tử. Vũ mới được phép gửi đơn sang nhóm Zalo của NCC.'
                    : 'Số tấm vượt trần cho phép! Yêu cầu Vũ kiểm tra lại file cắt CNC Aspire/Cabinet Vision, tối ưu sơ đồ xẻ phôi ván trước khi trình lại.'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bảng tra cứu toàn bộ 8 định mức chuẩn xưởng PG Home -->
        <div class="pg-card mt-4">
          <div class="pg-card-header">
            <h3>BẢNG TRA CỨU ĐỊNH MỨC 8 HẠNG MỤC CẮT CNC THỰC CHIẾN (MỤC 24 GEMINI.MD)</h3>
            <span class="text-sm text-muted">Khổ ván 1220x2440 = 2.9768 m2/tấm</span>
          </div>
          <div class="pg-card-body p-0">
            <table class="pg-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên hạng mục sản phẩm</th>
                  <th>ĐVT</th>
                  <th>Định mức ván 17mm</th>
                  <th>Tấm hậu 6mm</th>
                  <th>Công thức chuẩn của Giám Đốc</th>
                  <th>Lưu ý kỹ thuật sống còn</th>
                </tr>
              </thead>
              <tbody>
                ${Object.keys(CNC_BENCHMARKS).map(key => {
                  const b = CNC_BENCHMARKS[key];
                  return `
                    <tr class="${key === calc.selectedItemKey ? 'row-highlight' : ''}">
                      <td><span class="pg-badge-pill">${b.ma}</span></td>
                      <td><strong>${b.ten}</strong></td>
                      <td><strong>${b.dvt}</strong></td>
                      <td><strong class="text-blue">${b.dinh_muc_tong} tấm/${b.dvt}</strong></td>
                      <td>${b.chi_tiet && b.chi_tiet.hau_6mm ? b.chi_tiet.hau_6mm + ' tấm/' + b.dvt : '-'}</td>
                      <td class="text-sm">${b.cong_thuc_chuan}</td>
                      <td class="text-xs text-muted">${b.mo_ta}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- TAB 4: HỒ SƠ THỰC CHIẾN (BÁC PHÁT & NHÀ ANH NAM) ---
  function renderTabThucChien() {
    const cv = AUDIT_DATA.chi_tiet_ncc.cau_vuot.ho_so_doi_soat_cong_no_sapo;

    return `
      <div class="pg-tab-pane">
        <!-- Vụ án nhà anh Nam: Cấm báo cáo 2.70 tấm/md -->
        <div class="pg-card mb-4 border-red-soft">
          <div class="pg-card-header bg-danger text-white">
            <h3>BÀI HỌC XƯƠNG MÁU 06/11/2026: TỦ BẾP DƯỚI NHÀ ANH NAM</h3>
            <span class="pg-badge-pill bg-white text-danger font-bold">GIÁM ĐỐC CHUẨN HÓA VĨNH VIỄN</span>
          </div>
          <div class="pg-card-body">
            <div class="pg-grid-2">
              <div>
                <h4 class="text-danger font-bold mb-2">❌ SAI LẦM TỪNG GẶP (CẤM TÁI DIỄN):</h4>
                <div class="pg-error-note">
                  <p>Báo cáo nhầm định mức tủ bếp dưới thành <strong>2.70 tấm / md</strong> làm tổng ván vọt lên <strong>10.2 tấm</strong> (gấp đôi thực tế), làm méo mó dòng tiền và giá cost dự án.</p>
                  <p class="mb-0"><strong>Nguyên nhân:</strong> Tính trùng diện tích cánh vào thùng, lấy chiều cao phủ bì nhân bừa mà không trừ chân nhựa 100mm, không trừ mặt đá và không tính nóc rỗng chỉ đi 2 thanh xà 80mm.</p>
                </div>
              </div>

              <div>
                <h4 class="text-success font-bold mb-2">✅ CÔNG THỨC CHUẨN ĐÚNG CỦA GIÁM ĐỐC:</h4>
                <div class="pg-correct-note">
                  <div class="text-lg font-bold text-blue mb-1">3.77 md x 1.45 tấm/md = 5.47 ≈ 5.5 TẤM</div>
                  <ul class="text-sm mb-0">
                    <li>Thùng + Hậu: <strong>1.14 tấm / md</strong> (3.77 x 1.14 = 4.3 tấm)</li>
                    <li>Cánh Acrylic: <strong>0.31 tấm / md</strong> (3.77 x 0.31 = 1.2 tấm)</li>
                    <li>Khoang bếp từ & chậu rửa không có đợt ngang tiết kiệm thêm phôi</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Đơn hàng Plywood E0 điển hình nhà Bác Phát từ Cầu Vượt -->
        <div class="pg-card mb-4">
          <div class="pg-card-header">
            <h3>ĐỐI SOÁT ĐƠN HÀNG PLYWOOD NHÀ BÁC PHÁT (MÃ SAPO: SON00730)</h3>
            <span class="pg-badge-pill bg-green text-white">Hợp lệ 100% • 52 Tấm Plywood</span>
          </div>
          <div class="pg-card-body">
            <div class="pg-grid-3 mb-4">
              <div class="pg-info-box">
                <span class="pg-info-lbl">Mã hóa đơn Sapo:</span>
                <span class="pg-info-val text-mono text-blue">${cv.don_hang_dien_hinh_nha_bac_phat.ma_hoa_don_sapo}</span>
                <span class="text-xs text-muted">Ngày đặt: ${cv.don_hang_dien_hinh_nha_bac_phat.ngay_dat}</span>
              </div>
              <div class="pg-info-box">
                <span class="pg-info-lbl">Tổng giá trị đơn:</span>
                <span class="pg-info-val text-green">${formatMoney(cv.don_hang_dien_hinh_nha_bac_phat.gia_tri_don_hang)}</span>
                <span class="text-xs text-muted">52 tấm Plywood E0 + 7 cuộn nẹp</span>
              </div>
              <div class="pg-info-box">
                <span class="pg-info-lbl">Mã khách hàng Sapo:</span>
                <span class="pg-info-val text-mono">CUZN00018</span>
                <span class="text-xs text-muted">NỘI THẤT PHÚ GIA LUXURY</span>
              </div>
            </div>

            <table class="pg-table">
              <thead>
                <tr>
                  <th>Mã ván Plywood E0</th>
                  <th>Độ dày phôi</th>
                  <th>Số lượng</th>
                  <th>Nẹp dán chỉ PVC kèm theo</th>
                  <th>Tệp chứng từ ảnh Zalo</th>
                  <th>Trạng thái đối soát</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${cv.don_hang_dien_hinh_nha_bac_phat.ma_van_plywood.join(', ')}</strong></td>
                  <td>${cv.don_hang_dien_hinh_nha_bac_phat.do_day_tam.join(' / ')}</td>
                  <td><strong class="text-blue">${cv.don_hang_dien_hinh_nha_bac_phat.so_tam_plywood_e0} Tấm</strong></td>
                  <td><strong>${cv.don_hang_dien_hinh_nha_bac_phat.so_cuon_nep_chi} Cuộn</strong></td>
                  <td><span class="text-mono text-xs">${cv.don_hang_dien_hinh_nha_bac_phat.file_chung_tu}</span></td>
                  <td><span class="pg-badge-success">Đã đối soát Sapo</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Phiếu trả hàng giảm trừ công nợ Cầu Vượt -->
        <div class="pg-card">
          <div class="pg-card-header">
            <h3>ĐỐI SOÁT PHIẾU TRẢ HÀNG GIẢM TRỪ CÔNG NỢ TỨC THỜI (SRN0038)</h3>
            <span class="pg-badge-pill bg-amber text-white">Chốt nợ &lt;= 60 phút</span>
          </div>
          <div class="pg-card-body">
            <div class="pg-return-item">
              <div class="pg-return-left">
                <span class="pg-badge-danger">GIẢM TRỪ CÔNG NỢ</span>
                <h4>${cv.don_tra_hang_giam_tru.san_pham}</h4>
                <div class="text-sm text-muted">Mã phiếu Sapo: <strong>${cv.don_tra_hang_giam_tru.ma_chung_tu_sapo}</strong> • Ngày trả: <strong>${cv.don_tra_hang_giam_tru.ngay_tra}</strong></div>
              </div>
              <div class="pg-return-right">
                <div class="pg-return-money">${formatMoney(cv.don_tra_hang_giam_tru.gia_tri_giam_tru)}</div>
                <div class="text-xs text-muted">Đã cấn trừ trực tiếp vào sổ nợ ngày 23/10</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- TAB 5: QUY CHUẨN KÉT SẮT & DẤU ĐỎ ĐIỆN TỬ ---
  function renderTabQuyChuan() {
    const kl = AUDIT_DATA.ket_luan_kiem_toan;

    return `
      <div class="pg-tab-pane">
        <!-- Kết luận kiểm toán Zero-Trust -->
        <div class="pg-card mb-4 border-green-soft">
          <div class="pg-card-header bg-success text-white">
            <h3>KẾT LUẬN KIỂM TOÁN TÀI CHÍNH 3 NCC (ZERO-TRUST AUDIT)</h3>
            <span class="pg-badge-pill bg-white text-green font-bold">100% MINH BẠCH</span>
          </div>
          <div class="pg-card-body">
            <div class="pg-grid-2">
              <div class="pg-audit-verdict">
                <div class="pg-verdict-title">TÍNH CHÍNH XÁC:</div>
                <div class="pg-verdict-desc">${kl.tinh_chinh_xac}</div>
              </div>
              <div class="pg-audit-verdict">
                <div class="pg-verdict-title">RỦI RO GIAN LẬN:</div>
                <div class="pg-verdict-desc text-green font-bold">${kl.rui_ro_gian_lan}</div>
              </div>
            </div>

            <h4 class="mt-4 mb-2 font-bold">KHUYẾN NGHỊ QUẢN TRỊ CỐT TỬ CỦA BAN GIÁM ĐỐC:</h4>
            <div class="pg-recommendation-list">
              ${kl.khuyen_nghi_quan_tri.map((rec, i) => `
                <div class="pg-rec-item">
                  <div class="pg-rec-num">${i + 1}</div>
                  <div class="pg-rec-text">${rec}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 4 Điều lệ sắt bảo vệ dòng tiền két sắt PG Home -->
        <div class="pg-card">
          <div class="pg-card-header">
            <h3>4 KỶ LUẬT THÉP BẢO VỆ DÒNG TIỀN VẬT TƯ & KHOÁN XƯỞNG</h3>
          </div>
          <div class="pg-card-body">
            <div class="pg-rule-grid">
              <div class="pg-rule-card">
                <div class="pg-rule-num">01</div>
                <h4>ĐÓNG DẤU ĐỎ MỚI ĐƯỢC ĐẶT HÀNG</h4>
                <p>Kỹ thuật Vũ chỉ được phép gửi đơn cho Lam Giang, Cầu Vượt, Cường Thịnh khi phiếu đề xuất đã được <strong>Giám Đốc duyệt và đóng dấu đỏ điện tử</strong>. Nghiêm cấm đặt hàng miệng hoặc chat riêng ngoài nhóm Zalo kiểm soát.</p>
              </div>

              <div class="pg-rule-card">
                <div class="pg-rule-num">02</div>
                <h4>QUY CHUẨN 3 LỚP CHÉO TỨC THỜI</h4>
                <p>Mọi khoản thanh toán phải đủ 3 lớp: <strong>[Ảnh hóa đơn thật] + [Xác nhận nhóm Zalo NCC] + [Ủy nhiệm chi ngân hàng khớp số tiền]</strong>. Thiếu 1 trong 3 lập tức treo lệnh chi.</p>
              </div>

              <div class="pg-rule-card">
                <div class="pg-rule-num">03</div>
                <h4>CHỐT NỢ PHÁT SINH &lt;= 60 PHÚT</h4>
                <p>Khi có phát sinh trả hàng (như phiếu -750k Cầu Vượt) hoặc ván lỗi, phải cập nhật vào hệ thống trong vòng <strong>60 phút</strong>, tuyệt đối không dồn số liệu vào cuối tháng gây sai lệch dòng tiền két sắt.</p>
              </div>

              <div class="pg-rule-card">
                <div class="pg-rule-num">04</div>
                <h4>BÓC TÁCH GỖ THỊT & ĐỒ MUA NGOÀI</h4>
                <p>Ván gỗ thịt và đồ thương mại phải bóc tách riêng (woodVal = totalVal - solidWood - accVal). Cấm tính khoán 40% vật tư và 15% thợ trên phần đồ mua ngoài hoặc đá kính.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- RENDER FOOTER ---
  function renderFooter() {
    return `
      <div class="pg-w10-footer">
        <div class="pg-w10-footer-info">
          <strong>HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG</strong> • MST: 042203002931<br>
          Tổ hợp Văn phòng & Nhà máy: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh • Hotline: 0973.562.789
        </div>
        <div class="pg-w10-footer-actions">
          <button type="button" class="pg-btn-sm" id="w10-btn-export">📥 Xuất Dữ Liệu Đối Soát (JSON)</button>
        </div>
      </div>
    `;
  }

  // --- GẮN SỰ KIỆN TƯƠNG TÁC (EVENT LISTENERS) ---
  function bindEvents(container) {
    // 1. Chuyển Tab
    const tabBtns = container.querySelectorAll('.pg-w10-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');
        if (targetTab && targetTab !== state.activeTab) {
          state.activeTab = targetTab;
          tabBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');

          const contentDiv = container.querySelector('#pg-w10-tab-content');
          if (contentDiv) {
            contentDiv.innerHTML = renderTabContent(state.activeTab);
            // Re-bind cho tab mới nếu cần
            rebindTabEvents(container);
          }
        }
      });
    });

    rebindTabEvents(container);

    // 2. Xuất dữ liệu
    const exportBtn = container.querySelector('#w10-btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        exportAuditJson();
      });
    }
  }

  // Gắn sự kiện động cho tab công cụ CNC
  function rebindTabEvents(container) {
    if (state.activeTab !== 'cong_cu_cnc') return;

    const selectItem = container.querySelector('#w10-select-item');
    const inputVolume = container.querySelector('#w10-input-volume');
    const inputOrdered = container.querySelector('#w10-input-ordered');
    const inputPrice = container.querySelector('#w10-input-price');
    const selectNcc = container.querySelector('#w10-select-ncc');
    const checkGlass = container.querySelector('#w10-check-glass');
    const checkLam = container.querySelector('#w10-check-lam');

    function updateCalcAndRerender() {
      if (selectItem) state.calculator.selectedItemKey = selectItem.value;
      if (inputVolume) state.calculator.volume = parseFloat(inputVolume.value) || 0;
      if (inputOrdered) state.calculator.orderedSheets = parseFloat(inputOrdered.value) || 0;
      if (inputPrice) state.calculator.actualPricePerSheet = parseFloat(inputPrice.value) || 0;
      if (selectNcc) state.calculator.supplierId = selectNcc.value;
      if (checkGlass) state.calculator.isGlassDoor = checkGlass.checked;
      if (checkLam) state.calculator.isLamHuynh = checkLam.checked;

      const contentDiv = container.querySelector('#pg-w10-tab-content');
      if (contentDiv) {
        contentDiv.innerHTML = renderTabContent('cong_cu_cnc');
        rebindTabEvents(container);
      }
    }

    if (selectItem) {
      selectItem.addEventListener('change', function () {
        // Tự động gợi ý đơn giá theo NCC hoặc hạng mục
        const item = CNC_BENCHMARKS[this.value];
        if (item) {
          state.calculator.selectedItemKey = this.value;
          // Tự tính thử số tấm gợi ý
          const quota = calculateCncQuota(this.value, state.calculator.volume, {
            isGlassDoor: state.calculator.isGlassDoor,
            isLamHuynh: state.calculator.isLamHuynh
          });
          state.calculator.orderedSheets = quota.standardSheetsRecommended;
        }
        updateCalcAndRerender();
      });
    }

    if (inputVolume) {
      inputVolume.addEventListener('input', function () {
        state.calculator.volume = parseFloat(this.value) || 0;
        const quota = calculateCncQuota(state.calculator.selectedItemKey, state.calculator.volume, {
          isGlassDoor: state.calculator.isGlassDoor,
          isLamHuynh: state.calculator.isLamHuynh
        });
        state.calculator.orderedSheets = quota.standardSheetsRecommended;
        updateCalcAndRerender();
      });
    }

    if (inputOrdered) {
      inputOrdered.addEventListener('input', function () {
        state.calculator.orderedSheets = parseFloat(this.value) || 0;
        updateCalcAndRerender();
      });
    }

    if (inputPrice) {
      inputPrice.addEventListener('input', function () {
        state.calculator.actualPricePerSheet = parseFloat(this.value) || 0;
        updateCalcAndRerender();
      });
    }

    if (selectNcc) {
      selectNcc.addEventListener('change', function () {
        state.calculator.supplierId = this.value;
        if (this.value === 'NCC_01_LAM_GIANG') {
          state.calculator.actualPricePerSheet = 553000;
        } else if (this.value === 'NCC_16_CAU_VUOT') {
          state.calculator.actualPricePerSheet = 750000;
        } else if (this.value === 'NCC_CUONG_THINH') {
          state.calculator.actualPricePerSheet = 493000;
        }
        updateCalcAndRerender();
      });
    }

    if (checkGlass) {
      checkGlass.addEventListener('change', updateCalcAndRerender);
    }

    if (checkLam) {
      checkLam.addEventListener('change', updateCalcAndRerender);
    }

    // Nút Preset Nam
    const btnNam = container.querySelector('#w10-preset-nam');
    if (btnNam) {
      btnNam.addEventListener('click', function () {
        state.calculator.selectedItemKey = "R09_TU_BEP_DUOI";
        state.calculator.volume = 3.77;
        state.calculator.orderedSheets = 5.5;
        state.calculator.actualPricePerSheet = 553000;
        state.calculator.supplierId = "NCC_01_LAM_GIANG";
        updateCalcAndRerender();
      });
    }

    // Nút Preset Bác Phát
    const btnPhat = container.querySelector('#w10-preset-phat');
    if (btnPhat) {
      btnPhat.addEventListener('click', function () {
        state.calculator.selectedItemKey = "R27_TU_AO_KICH_TRAN";
        state.calculator.volume = 49.5;
        state.calculator.orderedSheets = 52.0;
        state.calculator.actualPricePerSheet = 750000;
        state.calculator.supplierId = "NCC_16_CAU_VUOT";
        updateCalcAndRerender();
      });
    }

    // Nút Preset Tủ Áo
    const btnAo = container.querySelector('#w10-preset-ao');
    if (btnAo) {
      btnAo.addEventListener('click', function () {
        state.calculator.selectedItemKey = "R27_TU_AO_KICH_TRAN";
        state.calculator.volume = 13.82;
        state.calculator.orderedSheets = 14.5;
        state.calculator.actualPricePerSheet = 553000;
        state.calculator.isGlassDoor = false;
        updateCalcAndRerender();
      });
    }
  }

  // --- HÀM XUẤT DỮ LIỆU JSON ĐỐI SOÁT ---
  function exportAuditJson() {
    const exportData = {
      phu_gia_audit: AUDIT_DATA,
      cnc_benchmarks: CNC_BENCHMARKS,
      material_tiers: MATERIAL_TIERS,
      thoi_gian_xuat: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PG_Home_Doi_Soat_3NCC_CNC_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // --- INJECT CSS DUY NHẤT 1 LẦN VÀO TRANG ---
  function injectStylesOnce() {
    if (document.getElementById('pg-w10-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'pg-w10-styles';
    styleEl.textContent = `
      .pg-w10-wrapper {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #1e293b;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      .pg-w10-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 16px;
        border-bottom: 2px solid #e2e8f0;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .pg-w10-brand {
        display: flex;
        gap: 8px;
        margin-bottom: 6px;
      }
      .pg-w10-badge-phugia {
        background: #1e3a8a;
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        letter-spacing: 0.5px;
      }
      .pg-w10-badge-version {
        background: #059669;
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 4px;
      }
      .pg-w10-title {
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 4px 0;
      }
      .pg-w10-subtitle {
        font-size: 13px;
        color: #64748b;
        margin: 0;
      }
      .pg-w10-header-right {
        display: flex;
        gap: 12px;
      }
      .pg-stat-chip {
        background: #fff;
        border: 1px solid #cbd5e1;
        padding: 8px 14px;
        border-radius: 8px;
        text-align: right;
      }
      .pg-stat-val {
        font-size: 16px;
        font-weight: 800;
      }
      .pg-stat-lbl {
        font-size: 11px;
        color: #64748b;
      }
      .pg-w10-tabs {
        display: flex;
        gap: 8px;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 8px;
        margin-bottom: 16px;
        overflow-x: auto;
      }
      .pg-w10-tab-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #fff;
        border: 1px solid #cbd5e1;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }
      .pg-w10-tab-btn:hover {
        background: #f1f5f9;
        border-color: #94a3b8;
      }
      .pg-w10-tab-btn.active {
        background: #1e3a8a;
        color: #fff;
        border-color: #1e3a8a;
      }
      .pg-tab-pill {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        background: rgba(0,0,0,0.08);
      }
      .pg-w10-tab-btn.active .pg-tab-pill {
        background: rgba(255,255,255,0.25);
        color: #fff;
      }
      .pg-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 16px;
        overflow: hidden;
      }
      .pg-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }
      .pg-card-header h3 {
        font-size: 14px;
        font-weight: 700;
        margin: 0;
        color: #1e293b;
      }
      .pg-card-body {
        padding: 16px;
      }
      .pg-alert-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-left: 4px solid #2563eb;
        padding: 12px 16px;
        border-radius: 6px;
        margin-bottom: 16px;
        font-size: 13px;
        color: #1e40af;
      }
      .pg-alert-icon {
        font-size: 22px;
      }
      .pg-progress-stacked {
        display: flex;
        height: 28px;
        border-radius: 6px;
        overflow: hidden;
        background: #e2e8f0;
      }
      .pg-prog-segment {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding: 0 4px;
      }
      .bg-blue { background: #2563eb; }
      .bg-green { background: #059669; }
      .bg-amber { background: #d97706; }
      .bg-danger { background: #dc2626; }
      .bg-success { background: #15803d; }
      .text-blue { color: #2563eb; }
      .text-green { color: #059669; }
      .text-amber { color: #d97706; }
      .text-danger { color: #dc2626; }
      .text-purple { color: #7c3aed; }
      .text-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .pg-grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
      }
      .pg-grid-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }
      .pg-summary-box {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-top: 4px solid;
        padding: 14px;
        border-radius: 6px;
      }
      .border-blue { border-top-color: #2563eb; }
      .border-green { border-top-color: #059669; }
      .border-amber { border-top-color: #d97706; }
      .pg-box-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }
      .pg-box-badge {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .bg-blue-soft { background: #dbeafe; }
      .bg-green-soft { background: #d1fae5; }
      .bg-amber-soft { background: #fef3c7; }
      .pg-box-money {
        font-size: 18px;
        font-weight: 800;
        margin: 4px 0;
      }
      .pg-box-meta {
        font-size: 12px;
        color: #475569;
        margin-bottom: 4px;
      }
      .pg-box-note {
        font-size: 11px;
        color: #64748b;
      }
      .pg-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      .pg-table th {
        background: #f8fafc;
        padding: 10px 12px;
        text-align: left;
        font-weight: 700;
        color: #475569;
        border-bottom: 1px solid #cbd5e1;
      }
      .pg-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }
      .pg-table tr:hover {
        background: #f8fafc;
      }
      .row-highlight {
        background: #eff6ff !important;
        border-left: 3px solid #2563eb;
      }
      .pg-badge-pill {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        background: #e2e8f0;
        color: #334155;
      }
      .pg-badge-success { background: #dcfce7; color: #15803d; font-weight: 700; }
      .pg-badge-warning { background: #fef3c7; color: #b45309; font-weight: 700; }
      .pg-badge-danger { background: #fee2e2; color: #b91c1c; font-weight: 700; }
      .pg-badge-info { background: #e0f2fe; color: #0369a1; font-weight: 700; }
      .pg-form-group {
        margin-bottom: 12px;
      }
      .pg-form-group label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #334155;
        margin-bottom: 4px;
      }
      .pg-input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 13px;
        box-sizing: border-box;
      }
      .pg-input:focus {
        border-color: #2563eb;
        outline: none;
        box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
      }
      .pg-checkbox-group {
        font-size: 12px;
        margin: 8px 0;
      }
      .pg-checkbox-group label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
      }
      .pg-variance-box {
        display: flex;
        gap: 12px;
        padding: 14px;
        border-radius: 8px;
        border: 1px solid;
      }
      .pg-variance-icon { font-size: 26px; }
      .pg-variance-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
      .pg-variance-desc { font-size: 12px; line-height: 1.4; }
      .pg-kpi-tile {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 10px 12px;
        border-radius: 6px;
      }
      .pg-kpi-lbl { font-size: 11px; color: #64748b; margin-bottom: 2px; }
      .pg-kpi-val { font-size: 18px; font-weight: 800; }
      .pg-stamp-box {
        display: flex;
        align-items: center;
        gap: 14px;
        background: #f1f5f9;
        border: 1px dashed #94a3b8;
        padding: 12px 14px;
        border-radius: 8px;
      }
      .pg-stamp-seal {
        padding: 6px 10px;
        font-size: 11px;
        font-weight: 800;
        text-align: center;
        border-radius: 6px;
        letter-spacing: 0.5px;
        line-height: 1.2;
        min-width: 110px;
      }
      .seal-approved {
        border: 2px solid #15803d;
        color: #15803d;
        background: #dcfce7;
      }
      .seal-locked {
        border: 2px solid #b91c1c;
        color: #b91c1c;
        background: #fee2e2;
      }
      .pg-stamp-text { font-size: 12px; color: #334155; }
      .pg-presets-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .pg-btn-sm {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
      }
      .pg-btn-sm:hover { background: #e2e8f0; }
      .pg-tier-card {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 14px;
      }
      .pg-tier-badge {
        font-size: 11px;
        font-weight: 800;
        padding: 3px 6px;
        border-radius: 4px;
        display: inline-block;
        margin-bottom: 6px;
      }
      .tier-ac { background: #dbeafe; color: #1e40af; }
      .tier-thai { background: #fef3c7; color: #92400e; }
      .tier-ply { background: #d1fae5; color: #065f46; }
      .pg-tier-price { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
      .pg-tier-features { padding-left: 18px; margin: 0; font-size: 12px; color: #475569; }
      .pg-tier-features li { margin-bottom: 4px; }
      .pg-error-note {
        background: #fef2f2;
        border-left: 3px solid #ef4444;
        padding: 10px 12px;
        font-size: 12px;
        color: #991b1b;
      }
      .pg-correct-note {
        background: #f0fdf4;
        border-left: 3px solid #22c55e;
        padding: 10px 12px;
        font-size: 12px;
        color: #166534;
      }
      .pg-info-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 10px;
        border-radius: 6px;
      }
      .pg-info-lbl { display: block; font-size: 11px; color: #64748b; }
      .pg-info-val { display: block; font-size: 15px; font-weight: 700; }
      .pg-return-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f8fafc;
        border-radius: 6px;
      }
      .pg-return-money { font-size: 18px; font-weight: 800; color: #dc2626; text-align: right; }
      .pg-rule-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .pg-rule-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 14px;
        border-radius: 6px;
      }
      .pg-rule-num {
        font-size: 20px;
        font-weight: 900;
        color: #1e3a8a;
        margin-bottom: 4px;
      }
      .pg-rule-card h4 { font-size: 13px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a; }
      .pg-rule-card p { font-size: 12px; color: #475569; margin: 0; line-height: 1.4; }
      .pg-recommendation-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .pg-rec-item {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        font-size: 13px;
      }
      .pg-rec-num {
        background: #059669;
        color: #fff;
        font-weight: 800;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        flex-shrink: 0;
      }
      .pg-w10-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 14px;
        border-top: 1px solid #e2e8f0;
        margin-top: 16px;
        font-size: 11px;
        color: #64748b;
        flex-wrap: wrap;
        gap: 8px;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // --- TRẢ VỀ PUBLIC API CHO TOÀN BỘ HỆ THỐNG PG HOME ---
  return {
    version: "1.0.0",
    name: "PG_Modules_W10",
    title: "Đối Soát Công Nợ & Đơn Giá 3 NCC Ván Chủ Lực + Định Mức CNC",
    data: AUDIT_DATA,
    cncBenchmarks: CNC_BENCHMARKS,
    materialTiers: MATERIAL_TIERS,
    getState: function () {
      return Object.assign({}, state);
    },
    calculateCncQuota: calculateCncQuota,
    evaluateVariance: evaluateVariance,
    render: render,
    exportAuditJson: exportAuditJson,
    switchTab: function (tabKey) {
      state.activeTab = tabKey;
      const contentDiv = document.getElementById('pg-w10-tab-content');
      if (contentDiv) {
        contentDiv.innerHTML = renderTabContent(tabKey);
        const container = document.querySelector('.pg-w10-wrapper');
        if (container) rebindTabEvents(container);
      }
    }
  };
});
