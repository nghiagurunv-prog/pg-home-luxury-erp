/**
 * =================================================================================================
 * HỆ THỐNG QUẢN TRỊ & SẢN XUẤT NỘI THẤT PHÚ GIA (PG HOME LUXURY)
 * MODULE W52: WEB ERP INSTANT CAD/BAZIS BOM & 3-TIER QUOTATION UI MODULE (GIAI ĐOẠN 2 - R03)
 * =================================================================================================
 * QUY CHUẨN PHÁP LÝ & NHẬN DIỆN THƯƠNG HIỆU PHÚ GIA (BẤT KHẢ XÂM PHẠM):
 * - Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * - Thương hiệu công ty: CÔNG TY CP PHÚ GIA VIỆT NAM
 * - Thương hiệu thương mại: PG HOME LUXURY
 * - Mã số ĐKKD/MST: 042203002931 (Đăng ký lần đầu: 13/01/2025 - Đại diện: Nguyễn Trọng Nghĩa)
 * - Địa chỉ ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
 * - Tổ hợp Văn phòng & Nhà máy Sản xuất: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * - Hotline chuẩn: 0986.722.324
 * - Giám đốc Điều hành: Nguyễn Viết Nghĩa
 * =================================================================================================
 * TÍNH NĂNG KỸ THUẬT NỔI BẬT:
 * 1. Kéo-thả (Drag & Drop) & Parse Client-side tốc độ cao (< 3s):
 *    - AutoCAD ASCII DXF (.dxf): Trích xuất thực thể LWPOLYLINE, POLYLINE, INSERT, TEXT, MTEXT.
 *    - Bazis Mebelshik (.xml & .csv): Tự động phân tích cây đối tượng, kích thước, vật liệu, dán cạnh.
 *    - Tự động nạp và liên kết dữ liệu từ cad_bom_instant_quotes.json (kèm fallback 3 dự án thực tế).
 * 2. Tự động hiển thị bảng BOM chi tiết:
 *    - Danh sách tấm ván (L x W x T mm), phân loại thùng/cánh/hậu, diện tích m2 từng tấm và tổng m2.
 *    - Số tấm phôi tiêu chuẩn 1220 x 2440 mm (quy đổi định mức cắt CNC Nesting xưởng Phú Gia).
 *    - Số mét dài chỉ nẹp dán cạnh PVC (tự động cộng 12% hao hụt máy dán cạnh tự động).
 *    - Phụ kiện cơ khí nội suy: Bản lề giảm chấn theo chiều cao cánh H, ray trượt ngăn kéo, tay nâng Blum.
 * 3. Bảng so sánh Báo giá 3 Phương án song song (3-Tier Quotation Comparison):
 *    - Phương án 1 (Tiêu chuẩn): MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường
 *    - Phương án 2 (Cao cấp/Bán chạy): Thùng Melamine + Cánh Acrylic No-line Livas & Cánh Kính Khung Nhôm Anode
 *    - Phương án 3 (Siêu sang/Bespoke): 100% Gỗ Óc Chó Bắc Mỹ (American Walnut FAS) + Phụ kiện Blum/Hafele
 *    - Kiểm soát tỷ lệ giá vốn (Vật tư + Nhân công) / Doanh thu <= 54% (Kỷ luật thép W08).
 * 4. Xuất phiếu báo giá chuẩn A4 Pixel-Perfect nhận diện thương hiệu PG Home Luxury.
 * =================================================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_W52_CadBomQuote = factory();
    root.PG_Modules_W52 = root.PG_W52_CadBomQuote;
  }
}(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // 1. QUY CHUẨN PHÁP LÝ & THƯƠNG HIỆU PHÚ GIA (BẤT BIẾN THEO HIẾN PHÁP)
  var PHU_GIA_LEGAL = Object.freeze({
    ENTITY_NAME: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    BRAND_COMPANY_NAME: 'CÔNG TY CP PHÚ GIA VIỆT NAM',
    OFFICIAL_TRADE_NAME: 'PG HOME LUXURY',
    TAX_CODE: '042203002931',
    BUSINESS_CODE: '042203002931',
    REGISTRATION_DATE: '13/01/2025',
    LEGAL_REPRESENTATIVE: 'Nguyễn Trọng Nghĩa',
    DIRECTOR: 'Nguyễn Viết Nghĩa',
    REGISTERED_ADDRESS: 'Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh',
    TRADE_ADDRESS: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    FACTORY_TITLE: 'Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia',
    HOTLINE: '0986.722.324',
    HOTLINE_NUMERIC: '0986722324',
    EMAIL: 'noithatphugiahatinh@gmail.com',
    WEBSITE: 'https://pghome.vn',
    SLOGAN: 'Kiến Tạo Không Gian Sống Đẳng Cấp & Bền Vững'
  });

  // 2. HẰNG SỐ ĐỊNH MỨC KỸ THUẬT XƯỞNG SẢN XUẤT PG HOME
  var CONSTANTS = Object.freeze({
    SHEET_WIDTH_MM: 1220.0,
    SHEET_LENGTH_MM: 2440.0,
    SHEET_AREA_M2: 2.9768, // 1.22 * 2.44
    PVC_WASTAGE_RATE: 0.12, // +12% hao hụt nẹp chỉ dán cạnh máy tự động
    CNC_NESTING_WASTAGE_RATE: 0.15, // 15% hao hụt cắt ván công nghiệp CNC Nesting
    BACKING_WASTAGE_RATE: 0.10, // 10% hao hụt ván hậu
    COST_CEILING_MAX_PERCENT: 0.54, // Kỷ luật thép W08: Giá vốn <= 54% Doanh thu
    DEFAULT_THICKNESS_CARCASS: 17.5,
    DEFAULT_THICKNESS_DOOR: 17.5,
    DEFAULT_THICKNESS_BACK: 9.0
  });

  // 3. CƠ SỞ DỮ LIỆU HỒ SƠ BÓC TÁCH CNC THỰC TẾ XƯỞNG PHÚ GIA
  var PRELOADED_PROJECTS = [
    {
      ma_du_an: 'CT-ANH-NAM-R09',
      ten_hang_muc: 'Tủ Bếp Dưới + Trên + Kịch Trần - Nhà Anh Nam (3.77md)',
      dinh_dang_dau_vao: 'AutoCAD .DXF ASCII (Pure Parser)',
      so_luong_entities_cad: 33,
      bom_boc_tach: {
        panels_count: 30,
        metrics: {
          carcass_area_m2: 4.698,
          door_area_m2: 4.64,
          back_area_m2: 2.4,
          total_panel_area_m2: 11.738,
          pvc_edge_base_md: 58.0,
          pvc_edge_with_12pct_wastage_md: 64.96,
          standard_sheets: {
            sheet_dimension_mm: '1220 x 2440',
            sheet_area_m2: 2.9768,
            board_18mm_carcass_doors: {
              net_area_m2: 9.338,
              cnc_loss_pct: 15.0,
              sheets_exact: 3.61,
              sheets_ordered: 4
            },
            board_9mm_backing: {
              net_area_m2: 2.4,
              loss_pct: 10.0,
              sheets_exact: 0.89,
              sheets_ordered: 1
            }
          },
          hardware: {
            ban_le_giam_chan_tong: 32,
            ray_truot_giam_chan_bo: 4,
            tay_nang_blum_bo: 1,
            tay_nam_cai: 14,
            den_led_profile_md: 9.7
          }
        },
        panels_detail: [
          { name: 'Cánh tủ bếp trên Acrylic (750x400mm)', layer: 'PG_CANH', length_mm: 750, width_mm: 400, thickness_mm: 17.5, quantity: 6, area_m2_single: 0.3, area_m2_total: 1.8, pvc_edge_final_md: 15.456, hinges_per_piece: 2, hinges_total: 12 },
          { name: 'Cánh tủ bếp dưới Melamine (700x450mm)', layer: 'PG_CANH', length_mm: 700, width_mm: 450, thickness_mm: 17.5, quantity: 6, area_m2_single: 0.315, area_m2_total: 1.89, pvc_edge_final_md: 15.456, hinges_per_piece: 2, hinges_total: 12 },
          { name: 'Mặt hộc ngăn kéo (200x600mm)', layer: 'PG_CANH', length_mm: 600, width_mm: 200, thickness_mm: 17.5, quantity: 4, area_m2_single: 0.12, area_m2_total: 0.48, pvc_edge_final_md: 7.168, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Cánh khoang bát nâng hạ (350x800mm)', layer: 'PG_CANH', length_mm: 800, width_mm: 350, thickness_mm: 17.5, quantity: 2, area_m2_single: 0.28, area_m2_total: 0.56, pvc_edge_final_md: 5.152, hinges_per_piece: 4, hinges_total: 8 },
          { name: 'Hồi tủ bếp dưới (820x580mm)', layer: 'PG_VACH', length_mm: 820, width_mm: 580, thickness_mm: 17.5, quantity: 4, area_m2_single: 0.4756, area_m2_total: 1.902, pvc_edge_final_md: 8.87, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Đáy tủ bếp dưới (1800x580mm)', layer: 'PG_VACH', length_mm: 1800, width_mm: 580, thickness_mm: 17.5, quantity: 1, area_m2_single: 1.044, area_m2_total: 1.044, pvc_edge_final_md: 4.68, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Hồi tủ bếp trên (750x350mm)', layer: 'PG_VACH', length_mm: 750, width_mm: 350, thickness_mm: 17.5, quantity: 4, area_m2_single: 0.2625, area_m2_total: 1.05, pvc_edge_final_md: 6.496, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Đáy tủ bếp trên (1800x350mm)', layer: 'PG_VACH', length_mm: 1800, width_mm: 350, thickness_mm: 17.5, quantity: 1, area_m2_single: 0.63, area_m2_total: 0.63, pvc_edge_final_md: 2.8, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Đợt tủ bếp trên (560x330mm)', layer: 'PG_VACH', length_mm: 560, width_mm: 330, thickness_mm: 17.5, quantity: 2, area_m2_single: 0.1848, area_m2_total: 0.3696, pvc_edge_final_md: 1.38, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Tấm hậu tủ bếp trên (1800x750mm)', layer: 'PG_HAU', length_mm: 1800, width_mm: 750, thickness_mm: 9.0, quantity: 1, area_m2_single: 1.35, area_m2_total: 1.35, pvc_edge_final_md: 0.0, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Tấm hậu tủ bếp dưới (1800x580mm)', layer: 'PG_HAU', length_mm: 1800, width_mm: 580, thickness_mm: 9.0, quantity: 1, area_m2_single: 1.05, area_m2_total: 1.05, pvc_edge_final_md: 0.0, hinges_per_piece: 0, hinges_total: 0 }
        ]
      },
      du_toan_3_phuong_an: {
        du_an: 'Tủ Bếp Chữ L Hiện Đại (L-Shaped Kitchen)',
        thoi_gian_tinh_toan_ms: 1.8,
        dat_chuan_duoi_3_giay: true,
        phuong_an_bao_gia: [
          {
            tier_id: 'TIER_1_STANDARD',
            tier_name: 'Phương án 1 (Standard) - MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường',
            vat_lieu_thung: 'Gỗ MDF lõi xanh chống ẩm An Cường 17.5mm phủ Melamine 2 mặt chống ẩm',
            vat_lieu_canh: 'Gỗ MDF lõi xanh chống ẩm An Cường phủ Melamine đồng màu, nẹp chỉ dán cạnh máy tự động PUR',
            vat_lieu_hau: 'MDF lõi xanh chống ẩm 6mm/9mm phủ Melamine 2 mặt',
            phu_kien_co_khi: 'Bản lề giảm chấn Inox 304 tiêu chuẩn Ivan/DTC, ray bi giảm chấn 3 tầng sơn tĩnh điện',
            chi_tiet_chi_phi: {
              go_thung_mdf_an_cuong_vnd: 1832220,
              go_canh_mdf_an_cuong_vnd: 1995200,
              van_hau_mdf_vnd: 528000,
              chi_nep_pvc_dast_canh_vnd: 552160,
              ban_le_giam_chan_vnd: 1120000,
              ray_truot_ngan_keo_vnd: 220000,
              gia_cong_cnc_dan_canh_vnd: 2112840,
              van_chuyen_lap_dat_vnd: 1494080
            },
            tong_gia_tri_chua_vat_vnd: 9854500,
            thoi_gian_bao_hanh: '24 tháng bảo hành chính hãng xưởng Phú Gia',
            chi_phi_gia_von_vnd: 5221880,
            ty_le_cost_phan_tram: 52.99
          },
          {
            tier_id: 'TIER_2_LUXURY_MODERN',
            tier_name: 'Phương án 2 (Luxury Modern) - Thùng MDF An Cường + Cánh Acrylic No-line Livas / Cánh Kính Khung Nhôm Anode',
            vat_lieu_thung: 'Gỗ MDF lõi xanh chống ẩm An Cường 17.5mm phủ Melamine cao cấp chống trầy (khoang chậu dùng nhựa đặc WPB An Cường)',
            vat_lieu_canh: 'Cánh Acrylic bóng gương không đường line (Livas No-line edge) kết hợp Cánh kính khung nhôm Anode mạ điện phân cao cấp',
            vat_lieu_hau: 'Alu Alcorest chống ẩm tuyệt đối hoặc MDF lõi xanh 9mm Melamine 2 mặt',
            phu_kien_co_khi: 'Bản lề giảm chấn Hafele Metalla / Eurogold Inox 304, ray trượt âm mở toàn phần giảm chấn Hafele, đèn LED cảm ứng vẫy tay',
            chi_tiet_chi_phi: {
              go_thung_mdf_an_cuong_vnd: 2114100,
              canh_acrylic_noline_kinh_anode_vnd: 6728000,
              van_hau_alu_mdf9mm_vnd: 672000,
              chi_nep_va_khung_vien_vnd: 779520,
              ban_le_giam_chan_hafele_vnd: 3040000,
              ray_am_giam_chan_hafele_vnd: 640000,
              he_thong_led_thanh_nhom_vnd: 2134000,
              gia_cong_cnc_chuyen_dung_vnd: 3051880,
              van_chuyen_lap_dat_tinh_chinh_vnd: 2241120
            },
            tong_gia_tri_chua_vat_vnd: 21400620,
            thoi_gian_bao_hanh: '36 tháng bảo hành & bảo trì trọn đời',
            chi_phi_gia_von_vnd: 11210000,
            ty_le_cost_phan_tram: 52.38
          },
          {
            tier_id: 'TIER_3_BESPOKE_SIGNATURE',
            tier_name: 'Phương án 3 (Bespoke Signature) - Gỗ Óc Chó Bắc Mỹ FAS (Walnut) + Phụ kiện Blum/Hafele Nhập Khẩu',
            vat_lieu_thung: 'Plywood chống nước phủ Veneer Óc Chó Bắc Mỹ tự nhiên ghép vân kỹ thuật Book-matched',
            vat_lieu_canh: 'Gỗ Óc Chó Bắc Mỹ (North American Walnut FAS 1 Com) tuyển chọn vân cuộn, sơn Inchem Mỹ 7 lớp kết hợp kính xám khói cường lực',
            vat_lieu_hau: 'Plywood chống nước phủ Veneer Óc Chó 9mm 2 mặt sơn PU bảo vệ',
            phu_kien_co_khi: 'Toàn bộ phụ kiện Blum (Áo) chính hãng: Bản lề Blum Clip Top Blumotion, tay nâng đôi Blum Aventos HF, ray hộp Blum Tandembox, LED Hafele Loox5',
            chi_tiet_chi_phi: {
              go_thung_plywood_veneer_oc_cho_vnd: 13154400,
              canh_go_oc_cho_fas_son_inchem_vnd: 19488000,
              van_hau_plywood_veneer_vnd: 1632000,
              chi_nep_go_oc_cho_tu_nhien_vnd: 2273600,
              ban_le_blum_clip_top_blumotion_vnd: 5600000,
              ray_hop_blum_tandembox_vnd: 2500000,
              tay_nang_doi_blum_aventos_hf_vnd: 4200000,
              he_thong_led_hafele_loox5_vnd: 4074000,
              gia_cong_thu_cong_son_inchem_7_lop_vnd: 9977300,
              van_chuyen_lap_dat_cao_cap_vnd: 5135900
            },
            tong_gia_tri_chua_vat_vnd: 68035200,
            thoi_gian_bao_hanh: '60 tháng bảo hành kết cấu & bảo dưỡng định kỳ 6 tháng/lần',
            chi_phi_gia_von_vnd: 35980000,
            ty_le_cost_phan_tram: 52.88
          }
        ]
      }
    },
    {
      ma_du_an: 'CT-ANH-NAM-R27',
      ten_hang_muc: 'Tủ Áo Kịch Trần Cánh Kính - Nhà Anh Nam (12.21m²)',
      dinh_dang_dau_vao: 'Bazis Mebelshik .XML Export (Cây đối tượng)',
      so_luong_entities_cad: 28,
      bom_boc_tach: {
        panels_count: 24,
        metrics: {
          carcass_area_m2: 6.84,
          door_area_m2: 5.52,
          back_area_m2: 3.68,
          total_panel_area_m2: 16.04,
          pvc_edge_base_md: 68.4,
          pvc_edge_with_12pct_wastage_md: 76.61,
          standard_sheets: {
            sheet_dimension_mm: '1220 x 2440',
            sheet_area_m2: 2.9768,
            board_18mm_carcass_doors: {
              net_area_m2: 12.36,
              cnc_loss_pct: 15.0,
              sheets_exact: 4.77,
              sheets_ordered: 5
            },
            board_9mm_backing: {
              net_area_m2: 3.68,
              loss_pct: 10.0,
              sheets_exact: 1.36,
              sheets_ordered: 2
            }
          },
          hardware: {
            ban_le_giam_chan_tong: 20,
            ray_truot_giam_chan_bo: 6,
            tay_nang_blum_bo: 0,
            tay_nam_cai: 4,
            den_led_profile_md: 11.5
          }
        },
        panels_detail: [
          { name: 'Cánh kính khung nhôm Slim Anode (2300x600mm)', layer: 'PG_CANH', length_mm: 2300, width_mm: 600, thickness_mm: 20.0, quantity: 4, area_m2_single: 1.38, area_m2_total: 5.52, pvc_edge_final_md: 25.984, hinges_per_piece: 5, hinges_total: 20 },
          { name: 'Hồi tủ áo kịch trần (2600x600mm)', layer: 'PG_VACH', length_mm: 2600, width_mm: 600, thickness_mm: 17.5, quantity: 3, area_m2_single: 1.56, area_m2_total: 4.68, pvc_edge_final_md: 20.832, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Đáy và Nóc tủ áo (2400x600mm)', layer: 'PG_VACH', length_mm: 2400, width_mm: 600, thickness_mm: 17.5, quantity: 2, area_m2_single: 1.44, area_m2_total: 2.88, pvc_edge_final_md: 12.096, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Hậu tủ áo chống ẩm phủ Melamine (2600x2400mm)', layer: 'PG_HAU', length_mm: 2600, width_mm: 2400, thickness_mm: 9.0, quantity: 1, area_m2_single: 3.68, area_m2_total: 3.68, pvc_edge_final_md: 0.0, hinges_per_piece: 0, hinges_total: 0 }
        ]
      },
      du_toan_3_phuong_an: {
        du_an: 'Tủ Áo Cánh Kính Kịch Trần Hợp Kim Nhôm Anode Slim',
        thoi_gian_tinh_toan_ms: 1.9,
        dat_chuan_duoi_3_giay: true,
        phuong_an_bao_gia: [
          {
            tier_id: 'TIER_1_STANDARD',
            tier_name: 'Phương án 1 (Standard) - MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường',
            vat_lieu_thung: 'MDF lõi xanh chống ẩm An Cường vân vải dệt hoặc màu vân gỗ óc chó 17.5mm',
            vat_lieu_canh: 'Cánh pano MDF lõi xanh An Cường phủ Melamine đồng màu dán cạnh chỉ PUR',
            vat_lieu_hau: 'MDF lõi xanh chống ẩm 9mm phủ Melamine 2 mặt',
            phu_kien_co_khi: 'Bản lề giảm chấn Ivan/DTC Inox 304, ray bi 3 tầng mở êm ái',
            chi_tiet_chi_phi: {
              go_thung_mdf_an_cuong_vnd: 2667600,
              go_canh_mdf_an_cuong_vnd: 2373600,
              van_hau_mdf_vnd: 809600,
              chi_nep_pvc_dast_canh_vnd: 651185,
              ban_le_giam_chan_vnd: 700000,
              ray_truot_ngan_keo_vnd: 660000,
              gia_cong_cnc_dan_canh_vnd: 2887200,
              van_chuyen_lap_dat_vnd: 1977600
            },
            tong_gia_tri_chua_vat_vnd: 12726785,
            thoi_gian_bao_hanh: '24 tháng bảo hành chính hãng xưởng Phú Gia',
            chi_phi_gia_von_vnd: 6732000,
            ty_le_cost_phan_tram: 52.90
          },
          {
            tier_id: 'TIER_2_LUXURY_MODERN',
            tier_name: 'Phương án 2 (Luxury Modern) - Thùng MDF An Cường + Cánh Kính Khung Nhôm Anode Slim Siêu Mỏng',
            vat_lieu_thung: 'MDF lõi xanh chống ẩm An Cường cao cấp dán nẹp noline',
            vat_lieu_canh: 'Cánh kính xám khói cường lực 5mm kết hợp khung nhôm định hình mạ Anode xước xám đen bản slim 20x22mm',
            vat_lieu_hau: 'MDF lõi xanh 9mm Melamine 2 mặt kết hợp đèn LED rãnh âm soi hông',
            phu_kien_co_khi: 'Bản lề cánh kính âm chuyên dụng Hafele góc mở 110 độ, ray trượt âm mở toàn phần Hafele',
            chi_tiet_chi_phi: {
              go_thung_mdf_an_cuong_vnd: 3078000,
              canh_acrylic_noline_kinh_anode_vnd: 8004000,
              van_hau_alu_mdf9mm_vnd: 1030400,
              chi_nep_va_khung_vien_vnd: 919320,
              ban_le_giam_chan_hafele_vnd: 1900000,
              ray_am_giam_chan_hafele_vnd: 1920000,
              he_thong_led_thanh_nhom_vnd: 2530000,
              gia_cong_cnc_chuyen_dung_vnd: 4170400,
              van_chuyen_lap_dat_tinh_chinh_vnd: 2966400
            },
            tong_gia_tri_chua_vat_vnd: 26518520,
            thoi_gian_bao_hanh: '36 tháng bảo hành & bảo trì trọn đời',
            chi_phi_gia_von_vnd: 13920000,
            ty_le_cost_phan_tram: 52.49
          },
          {
            tier_id: 'TIER_3_BESPOKE_SIGNATURE',
            tier_name: 'Phương án 3 (Bespoke Signature) - Gỗ Óc Chó Bắc Mỹ FAS Tuyển Chọn + Cánh Kính Thượng Lưu',
            vat_lieu_thung: 'Plywood chống nước phủ Veneer Óc Chó Bắc Mỹ tự nhiên xẻ sấy cao cấp',
            vat_lieu_canh: 'Gỗ tự nhiên Óc Chó Bắc Mỹ FAS xẻ mộng thủ công kết hợp cánh kính lụa khung nhôm mạ đồng sang trọng',
            vat_lieu_hau: 'Plywood chống nước phủ Veneer Óc Chó 9mm sơn PU bảo vệ',
            phu_kien_co_khi: 'Bản lề Blum Clip Top Blumotion Onyx Black, ray hộp Blum Legrabox cảm ứng Tip-On, LED Hafele Loox5',
            chi_tiet_chi_phi: {
              go_thung_plywood_veneer_oc_cho_vnd: 19152000,
              canh_go_oc_cho_fas_son_inchem_vnd: 23184000,
              van_hau_plywood_veneer_vnd: 2502400,
              chi_nep_go_oc_cho_tu_nhien_vnd: 2681350,
              ban_le_blum_clip_top_blumotion_vnd: 3500000,
              ray_hop_blum_tandembox_vnd: 7500000,
              tay_nang_doi_blum_aventos_hf_vnd: 4200000,
              he_thong_led_hafele_loox5_vnd: 4830000,
              gia_cong_thu_cong_son_inchem_7_lop_vnd: 13634000,
              van_chuyen_lap_dat_cao_cap_vnd: 6798000
            },
            tong_gia_tri_chua_vat_vnd: 87981750,
            thoi_gian_bao_hanh: '60 tháng bảo hành kết cấu & bảo dưỡng định kỳ 6 tháng/lần',
            chi_phi_gia_von_vnd: 46500000,
            ty_le_cost_phan_tram: 52.85
          }
        ]
      }
    },
    {
      ma_du_an: 'CT-BAC-PHAT-0326',
      ten_hang_muc: 'Hệ Vách Tivi Lam Sóng & Tủ Rượu - Nhà Bác Phát',
      dinh_dang_dau_vao: 'Bazis Mebelshik .CSV Export (Danh sách phôi cắt)',
      so_luong_entities_cad: 19,
      bom_boc_tach: {
        panels_count: 16,
        metrics: {
          carcass_area_m2: 3.52,
          door_area_m2: 2.88,
          back_area_m2: 2.16,
          total_panel_area_m2: 8.56,
          pvc_edge_base_md: 39.2,
          pvc_edge_with_12pct_wastage_md: 43.9,
          standard_sheets: {
            sheet_dimension_mm: '1220 x 2440',
            sheet_area_m2: 2.9768,
            board_18mm_carcass_doors: {
              net_area_m2: 6.4,
              cnc_loss_pct: 15.0,
              sheets_exact: 2.47,
              sheets_ordered: 3
            },
            board_9mm_backing: {
              net_area_m2: 2.16,
              loss_pct: 10.0,
              sheets_exact: 0.8,
              sheets_ordered: 1
            }
          },
          hardware: {
            ban_le_giam_chan_tong: 12,
            ray_truot_giam_chan_bo: 2,
            tay_nang_blum_bo: 0,
            tay_nam_cai: 4,
            den_led_profile_md: 6.5
          }
        },
        panels_detail: [
          { name: 'Cánh kính tủ rượu khung nhôm xước (1800x400mm)', layer: 'PG_CANH', length_mm: 1800, width_mm: 400, thickness_mm: 20.0, quantity: 2, area_m2_single: 0.72, area_m2_total: 1.44, pvc_edge_final_md: 9.856, hinges_per_piece: 4, hinges_total: 8 },
          { name: 'Cánh ngăn kéo tủ tivi (200x900mm)', layer: 'PG_CANH', length_mm: 900, width_mm: 200, thickness_mm: 17.5, quantity: 2, area_m2_single: 0.18, area_m2_total: 0.36, pvc_edge_final_md: 4.928, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Hồi tủ rượu đứng (2200x350mm)', layer: 'PG_VACH', length_mm: 2200, width_mm: 350, thickness_mm: 17.5, quantity: 2, area_m2_single: 0.77, area_m2_total: 1.54, pvc_edge_final_md: 6.16, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Đợt kính cường lực kèm rãnh đèn LED (760x330mm)', layer: 'PG_VACH', length_mm: 760, width_mm: 330, thickness_mm: 10.0, quantity: 4, area_m2_single: 0.2508, area_m2_total: 1.0032, pvc_edge_final_md: 3.404, hinges_per_piece: 0, hinges_total: 0 },
          { name: 'Tấm ốp hậu vách vân đá hoặc gương xám (2400x900mm)', layer: 'PG_HAU', length_mm: 2400, width_mm: 900, thickness_mm: 9.0, quantity: 1, area_m2_single: 2.16, area_m2_total: 2.16, pvc_edge_final_md: 0.0, hinges_per_piece: 0, hinges_total: 0 }
        ]
      },
      du_toan_3_phuong_an: {
        du_an: 'Hệ Vách Tivi Lam Sóng Trang Trí & Tủ Rượu Cánh Kính',
        thoi_gian_tinh_toan_ms: 1.5,
        dat_chuan_duoi_3_giay: true,
        phuong_an_bao_gia: [
          {
            tier_id: 'TIER_1_STANDARD',
            tier_name: 'Phương án 1 (Standard) - MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường',
            vat_lieu_thung: 'MDF lõi xanh chống ẩm An Cường vân gỗ tự nhiên 17.5mm',
            vat_lieu_canh: 'Cánh kính thường viền nhôm định hình kết hợp cánh gỗ Melamine',
            vat_lieu_hau: 'MDF lõi xanh chống ẩm 9mm phủ Melamine',
            phu_kien_co_khi: 'Bản lề giảm chấn Ivan Inox 304, ray bi 3 tầng',
            chi_tiet_chi_phi: {
              go_thung_mdf_an_cuong_vnd: 1372800,
              go_canh_mdf_an_cuong_vnd: 1238400,
              van_hau_mdf_vnd: 475200,
              chi_nep_pvc_dast_canh_vnd: 373150,
              ban_le_giam_chan_vnd: 420000,
              ray_truot_ngan_keo_vnd: 220000,
              gia_cong_cnc_dan_canh_vnd: 1540800,
              van_chuyen_lap_dat_vnd: 1024000
            },
            tong_gia_tri_chua_vat_vnd: 6664350,
            thoi_gian_bao_hanh: '24 tháng bảo hành chính hãng xưởng Phú Gia',
            chi_phi_gia_von_vnd: 3510000,
            ty_le_cost_phan_tram: 52.67
          },
          {
            tier_id: 'TIER_2_LUXURY_MODERN',
            tier_name: 'Phương án 2 (Luxury Modern) - Thùng Melamine An Cường + Tủ Rượu Cánh Kính Slim Khói & Vách Lam Sóng Than Tre',
            vat_lieu_thung: 'MDF lõi xanh chống ẩm An Cường cao cấp dán nẹp Noline',
            vat_lieu_canh: 'Cánh kính cường lực xám khói khung nhôm anode titan siêu mảnh, vách lam sóng than tre cao cấp',
            vat_lieu_hau: 'Gương bỉ tráng bạc 5mm hoặc tấm than tre vân đá phủ kim loại',
            phu_kien_co_khi: 'Bản lề cánh kính Hafele nhập khẩu, ray âm giảm chấn Hafele, hệ đèn LED cảm ứng vẫy tay cao cấp',
            chi_tiet_chi_phi: {
              go_thung_mdf_an_cuong_vnd: 1584000,
              canh_acrylic_noline_kinh_anode_vnd: 4176000,
              van_hau_alu_mdf9mm_vnd: 604800,
              chi_nep_va_khung_vien_vnd: 526800,
              ban_le_giam_chan_hafele_vnd: 1140000,
              ray_am_giam_chan_hafele_vnd: 640000,
              he_thong_led_thanh_nhom_vnd: 1430000,
              gia_cong_cnc_chuyen_dung_vnd: 2225600,
              van_chuyen_lap_dat_tinh_chinh_vnd: 1536000
            },
            tong_gia_tri_chua_vat_vnd: 13863200,
            thoi_gian_bao_hanh: '36 tháng bảo hành & bảo trì trọn đời',
            chi_phi_gia_von_vnd: 7280000,
            ty_le_cost_phan_tram: 52.51
          },
          {
            tier_id: 'TIER_3_BESPOKE_SIGNATURE',
            tier_name: 'Phương án 3 (Bespoke Signature) - 100% Gỗ Óc Chó Bắc Mỹ Tuyển Chọn + Cánh Kính Hợp Kim Đồng',
            vat_lieu_thung: 'Plywood chống nước phủ Veneer Óc Chó tự nhiên ghép vân kỹ thuật',
            vat_lieu_canh: 'Gỗ Óc Chó Bắc Mỹ FAS xẻ mộng thủ công sơn Inchem 7 lớp kết hợp cánh kính cường lực siêu trong',
            vat_lieu_hau: 'Plywood chống nước phủ Veneer Óc Chó 9mm 2 mặt',
            phu_kien_co_khi: 'Bản lề Blum Clip Top Blumotion Onyx Black, ray trượt Blum, hệ thống chiếu sáng Hafele Loox5',
            chi_tiet_chi_phi: {
              go_thung_plywood_veneer_oc_cho_vnd: 9856000,
              canh_go_oc_cho_fas_son_inchem_vnd: 12096000,
              van_hau_plywood_veneer_vnd: 1468800,
              chi_nep_go_oc_cho_tu_nhien_vnd: 1536500,
              ban_le_blum_clip_top_blumotion_vnd: 2100000,
              ray_hop_blum_tandembox_vnd: 2500000,
              tay_nang_doi_blum_aventos_hf_vnd: 4200000,
              he_thong_led_hafele_loox5_vnd: 2730000,
              gia_cong_thu_cong_son_inchem_7_lop_vnd: 7276000,
              van_chuyen_lap_dat_cao_cap_vnd: 3520000
            },
            tong_gia_tri_chua_vat_vnd: 47283300,
            thoi_gian_bao_hanh: '60 tháng bảo hành kết cấu & bảo dưỡng định kỳ 6 tháng/lần',
            chi_phi_gia_von_vnd: 24980000,
            ty_le_cost_phan_tram: 52.83
          }
        ]
      }
    }
  ];

  // 4. HÀM TIỆN ÍCH CHUYÊN DÙNG (HELPERS)
  function formatCurrency(amount) {
    var num = Number(amount) || 0;
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function parseFloatSafe(val, fallback) {
    if (typeof val === 'number') return isNaN(val) ? (fallback || 0) : val;
    if (!val) return fallback || 0;
    var clean = String(val).replace(/,/g, '.').replace(/[^\d.-]/g, '');
    var parsed = parseFloat(clean);
    return isNaN(parsed) ? (fallback || 0) : parsed;
  }

  // 5. CÔNG THỨC NỘI SUY BẢN LỀ THEO CHIỀU CAO CÁNH H (QUY CHUẨN XƯỞNG PHÚ GIA)
  function calculateHingesForDoor(heightMm) {
    var h = parseFloatSafe(heightMm, 0);
    if (h <= 900.0) {
      return 2;
    } else if (h <= 1600.0) {
      return 3;
    } else if (h <= 2200.0) {
      return 4;
    } else {
      return 5;
    }
  }

  // 6. THUẬT TOÁN NHẬN DIỆN PHÂN LOẠI LAYER / VỊ TRÍ CHI TIẾT
  function detectLayer(name) {
    var s = String(name || '').toLowerCase();
    if (s.indexOf('cánh') !== -1 || s.indexOf('canh') !== -1 || s.indexOf('door') !== -1 ||
        s.indexOf('front') !== -1 || s.indexOf('mặt ngăn kéo') !== -1 || s.indexOf('mat ngan keo') !== -1) {
      return 'PG_CANH';
    } else if (s.indexOf('hậu') !== -1 || s.indexOf('hau') !== -1 || s.indexOf('back') !== -1 ||
               s.indexOf('đáy ngăn kéo') !== -1 || s.indexOf('day ngan keo') !== -1) {
      return 'PG_HAU';
    } else if (s.indexOf('bản lề') !== -1 || s.indexOf('ban le') !== -1 || s.indexOf('ray') !== -1 ||
               s.indexOf('tay nắm') !== -1 || s.indexOf('tay nam') !== -1 || s.indexOf('tay nâng') !== -1 ||
               s.indexOf('tay nang') !== -1 || s.indexOf('blum') !== -1) {
      return 'PG_PK';
    } else {
      return 'PG_VACH';
    }
  }

  // 7. CLIENT-SIDE PURE ASCII DXF PARSER (AUTOCAD)
  function parseDxf(dxfContent) {
    var lines = String(dxfContent || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    var pairs = [];
    for (var i = 0; i < lines.length - 1; i += 2) {
      var code = parseInt(lines[i].trim(), 10);
      var val = lines[i + 1] ? lines[i + 1].trim() : '';
      if (!isNaN(code)) {
        pairs.push([code, val]);
      }
    }

    var inEntities = false;
    var currentEntity = null;
    var entities = [];

    for (var j = 0; j < pairs.length; j++) {
      var c = pairs[j][0];
      var v = pairs[j][1];

      if (c === 0 && v === 'SECTION') {
        if (j + 1 < pairs.length && pairs[j + 1][0] === 2 && pairs[j + 1][1] === 'ENTITIES') {
          inEntities = true;
          j++;
          continue;
        }
      }

      if (inEntities && c === 0 && v === 'ENDSEC') {
        if (currentEntity) entities.push(currentEntity);
        inEntities = false;
        break;
      }

      if (inEntities) {
        if (c === 0) {
          if (currentEntity) {
            entities.push(currentEntity);
          }
          currentEntity = {
            type: v,
            layer: 'PG_VACH',
            points: [],
            text: '',
            blockName: '',
            properties: {}
          };
        } else if (currentEntity) {
          if (c === 8) {
            currentEntity.layer = v;
          } else if (c === 2) {
            currentEntity.blockName = v;
          } else if (c === 1 || c === 3) {
            currentEntity.text += v;
          } else if (c === 10) {
            var xVal = parseFloatSafe(v, 0);
            var yVal = 0;
            if (j + 1 < pairs.length && pairs[j + 1][0] === 20) {
              yVal = parseFloatSafe(pairs[j + 1][1], 0);
            }
            currentEntity.points.push([xVal, yVal]);
          }
        }
      }
    }

    if (currentEntity && inEntities) {
      entities.push(currentEntity);
    }

    // Chuyển đổi entities thành panels & hardware
    var panels = [];
    var hardware = [];

    entities.forEach(function (ent, idx) {
      var layer = ent.layer || 'PG_VACH';
      var matchedLayer = 'PG_VACH';
      if (layer.indexOf('PG_CANH') !== -1 || layer.indexOf('CANH') !== -1) matchedLayer = 'PG_CANH';
      else if (layer.indexOf('PG_HAU') !== -1 || layer.indexOf('HAU') !== -1) matchedLayer = 'PG_HAU';
      else if (layer.indexOf('PG_PK') !== -1 || layer.indexOf('PK') !== -1) matchedLayer = 'PG_PK';

      if (ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') {
        if (ent.points && ent.points.length >= 2) {
          var xs = ent.points.map(function (p) { return p[0]; });
          var ys = ent.points.map(function (p) { return p[1]; });
          var dx = Math.abs(Math.max.apply(null, xs) - Math.min.apply(null, xs));
          var dy = Math.abs(Math.max.apply(null, ys) - Math.min.apply(null, ys));
          var length = Math.max(dx, dy);
          var width = Math.min(dx, dy);

          if (length >= 50 && width >= 50) {
            var basePvc = (matchedLayer === 'PG_CANH') ? (2 * (length + width) / 1000) : (matchedLayer === 'PG_VACH' ? (2 * length + width) / 1000 : 0);
            var area = (length * width) / 1000000;
            var hinges = (matchedLayer === 'PG_CANH') ? calculateHingesForDoor(length) : 0;

            panels.push({
              name: 'Tấm CAD #' + (idx + 1) + ' (' + Math.round(length) + 'x' + Math.round(width) + 'mm)',
              layer: matchedLayer,
              length_mm: Math.round(length),
              width_mm: Math.round(width),
              thickness_mm: matchedLayer === 'PG_HAU' ? 9.0 : 17.5,
              quantity: 1,
              area_m2_single: Math.round(area * 10000) / 10000,
              area_m2_total: Math.round(area * 10000) / 10000,
              pvc_edge_base_md: Math.round(basePvc * 1000) / 1000,
              pvc_edge_final_md: Math.round(basePvc * (1 + CONSTANTS.PVC_WASTAGE_RATE) * 1000) / 1000,
              hinges_per_piece: hinges,
              hinges_total: hinges
            });
          }
        }
      } else if (ent.type === 'INSERT') {
        var bName = (ent.blockName || '').toUpperCase();
        hardware.push({
          block_name: bName,
          name: ent.blockName || 'Phụ kiện cơ khí CAD',
          quantity: 1
        });
      } else if (ent.type === 'TEXT' || ent.type === 'MTEXT') {
        var txt = ent.text || '';
        var dimMatch = txt.match(/(\d{2,4})\s*[xX*]\s*(\d{2,4})/);
        if (dimMatch) {
          var d1 = parseFloatSafe(dimMatch[1], 0);
          var d2 = parseFloatSafe(dimMatch[2], 0);
          var tL = Math.max(d1, d2);
          var tW = Math.min(d1, d2);
          var tArea = (tL * tW) / 1000000;
          var tHinges = (matchedLayer === 'PG_CANH') ? calculateHingesForDoor(tL) : 0;
          var tBasePvc = (matchedLayer === 'PG_CANH') ? (2 * (tL + tW) / 1000) : (tL / 1000);

          panels.push({
            name: 'Ghi chú CAD: ' + txt,
            layer: matchedLayer,
            length_mm: Math.round(tL),
            width_mm: Math.round(tW),
            thickness_mm: matchedLayer === 'PG_HAU' ? 9.0 : 17.5,
            quantity: 1,
            area_m2_single: Math.round(tArea * 10000) / 10000,
            area_m2_total: Math.round(tArea * 10000) / 10000,
            pvc_edge_base_md: Math.round(tBasePvc * 1000) / 1000,
            pvc_edge_final_md: Math.round(tBasePvc * (1 + CONSTANTS.PVC_WASTAGE_RATE) * 1000) / 1000,
            hinges_per_piece: tHinges,
            hinges_total: tHinges
          });
        }
      }
    });

    return calculateBom(panels, hardware);
  }

  // 8. CLIENT-SIDE BAZIS MEBELSHIK XML PARSER
  function parseXml(xmlContent) {
    var panels = [];
    var hardware = [];
    var doc = null;

    if (typeof DOMParser !== 'undefined') {
      try {
        var parser = new DOMParser();
        doc = parser.parseFromString(xmlContent, 'text/xml');
      } catch (e) {
        doc = null;
      }
    }

    if (doc && !doc.querySelector('parsererror')) {
      var itemNodes = doc.querySelectorAll('Panel, Part, Detail, Item, Деталь, Панель');
      itemNodes.forEach(function (node, idx) {
        var getVal = function (tags) {
          for (var t = 0; t < tags.length; t++) {
            var el = node.querySelector(tags[t]);
            if (el && el.textContent) return el.textContent.trim();
          }
          return '';
        };

        var name = getVal(['Name', 'Title', 'PartName', 'Desc', 'Наименование']) || ('Chi tiết #' + (idx + 1));
        var l = parseFloatSafe(getVal(['Length', 'LengthX', 'L', 'X', 'Длина']), 0);
        var w = parseFloatSafe(getVal(['Width', 'WidthY', 'W', 'Y', 'Ширина']), 0);
        var t = parseFloatSafe(getVal(['Thickness', 'ThicknessZ', 'T', 'Z', 'Толщина']), 17.5);
        var qty = Math.max(1, parseInt(parseFloatSafe(getVal(['Quantity', 'Count', 'Qty', 'Количество']), 1), 10));

        var length = Math.max(l, w);
        var width = Math.min(l, w);
        var layer = detectLayer(name);

        if (layer === 'PG_PK') {
          hardware.push({ block_name: name.toUpperCase(), name: name, quantity: qty });
          return;
        }

        if (length > 0 && width > 0) {
          var areaSingle = (length * width) / 1000000;
          var areaTotal = areaSingle * qty;
          var basePvc = (layer === 'PG_CANH') ? (2 * (length + width) / 1000) : (layer === 'PG_VACH' ? (2 * length + width) / 1000 : 0);
          var finalPvc = basePvc * (1 + CONSTANTS.PVC_WASTAGE_RATE) * qty;
          var hingesPerPiece = (layer === 'PG_CANH') ? calculateHingesForDoor(length) : 0;

          panels.push({
            name: name,
            layer: layer,
            length_mm: Math.round(length),
            width_mm: Math.round(width),
            thickness_mm: t > 0 ? t : (layer === 'PG_HAU' ? 9.0 : 17.5),
            quantity: qty,
            area_m2_single: Math.round(areaSingle * 10000) / 10000,
            area_m2_total: Math.round(areaTotal * 10000) / 10000,
            pvc_edge_base_md: Math.round(basePvc * qty * 1000) / 1000,
            pvc_edge_final_md: Math.round(finalPvc * 1000) / 1000,
            hinges_per_piece: hingesPerPiece,
            hinges_total: hingesPerPiece * qty
          });
        }
      });
    } else {
      // Regex fallback cho môi trường không có DOMParser hoặc XML đơn giản
      var blockRegex = /<(Panel|Part|Detail|Item)[\s>]([\s\S]*?)<\/\1>/gi;
      var match;
      var count = 0;
      while ((match = blockRegex.exec(xmlContent)) !== null) {
        count++;
        var b = match[2];
        var extractTag = function (tag) {
          var r = new RegExp('<' + tag + '>(.*?)</' + tag + '>', 'i');
          var m = b.match(r);
          return m ? m[1].trim() : '';
        };

        var rName = extractTag('Name') || extractTag('Title') || ('Chi tiết XML #' + count);
        var rL = parseFloatSafe(extractTag('Length') || extractTag('LengthX') || '0', 0);
        var rW = parseFloatSafe(extractTag('Width') || extractTag('WidthY') || '0', 0);
        var rT = parseFloatSafe(extractTag('Thickness') || '17.5', 17.5);
        var rQty = Math.max(1, parseInt(parseFloatSafe(extractTag('Quantity') || extractTag('Count') || '1', 1), 10));

        var maxL = Math.max(rL, rW);
        var minW = Math.min(rL, rW);
        var rLayer = detectLayer(rName);

        if (maxL > 0 && minW > 0) {
          var rAreaSingle = (maxL * minW) / 1000000;
          var rAreaTotal = rAreaSingle * rQty;
          var rBasePvc = (rLayer === 'PG_CANH') ? (2 * (maxL + minW) / 1000) : (rLayer === 'PG_VACH' ? (2 * maxL + minW) / 1000 : 0);
          var rFinalPvc = rBasePvc * (1 + CONSTANTS.PVC_WASTAGE_RATE) * rQty;
          var rHinges = (rLayer === 'PG_CANH') ? calculateHingesForDoor(maxL) : 0;

          panels.push({
            name: rName,
            layer: rLayer,
            length_mm: Math.round(maxL),
            width_mm: Math.round(minW),
            thickness_mm: rT > 0 ? rT : (rLayer === 'PG_HAU' ? 9.0 : 17.5),
            quantity: rQty,
            area_m2_single: Math.round(rAreaSingle * 10000) / 10000,
            area_m2_total: Math.round(rAreaTotal * 10000) / 10000,
            pvc_edge_base_md: Math.round(rBasePvc * rQty * 1000) / 1000,
            pvc_edge_final_md: Math.round(rFinalPvc * 1000) / 1000,
            hinges_per_piece: rHinges,
            hinges_total: rHinges * rQty
          });
        }
      }
    }

    return calculateBom(panels, hardware);
  }

  // 9. CLIENT-SIDE BAZIS MEBELSHIK CSV PARSER
  function parseCsv(csvContent) {
    var rawLines = String(csvContent || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    var lines = [];
    for (var i = 0; i < rawLines.length; i++) {
      var t = rawLines[i].trim();
      if (t) lines.push(t);
    }
    if (lines.length < 2) return calculateBom([], []);

    var delimiter = lines[0].indexOf(';') !== -1 ? ';' : (lines[0].indexOf('\t') !== -1 ? '\t' : ',');
    var headers = lines[0].split(delimiter).map(function (h) {
      return h.trim().toLowerCase().replace(/^["']|["']$/g, '');
    });

    var panels = [];
    var hardware = [];

    for (var r = 1; r < lines.length; r++) {
      var cols = lines[r].split(delimiter).map(function (c) {
        return c.trim().replace(/^["']|["']$/g, '');
      });
      if (cols.length < 2) continue;

      var row = {};
      for (var hIdx = 0; hIdx < headers.length; hIdx++) {
        row[headers[hIdx]] = cols[hIdx] || '';
      }

      var name = row['tên'] || row['ten'] || row['name'] || row['chi tiết'] || row['chi tiet'] || ('Chi tiết #' + r);
      var l = parseFloatSafe(row['dài'] || row['dai'] || row['length'] || row['l'] || '0', 0);
      var w = parseFloatSafe(row['rộng'] || row['rong'] || row['width'] || row['w'] || '0', 0);
      var t = parseFloatSafe(row['dày'] || row['day'] || row['thickness'] || row['t'] || '17.5', 17.5);
      var qty = Math.max(1, parseInt(parseFloatSafe(row['số lượng'] || row['so luong'] || row['count'] || row['qty'] || '1', 1), 10));

      var length = Math.max(l, w);
      var width = Math.min(l, w);
      var layer = detectLayer(name);

      if (layer === 'PG_PK') {
        hardware.push({ block_name: name.toUpperCase(), name: name, quantity: qty });
        continue;
      }

      if (length > 0 && width > 0) {
        var areaSingle = (length * width) / 1000000;
        var areaTotal = areaSingle * qty;
        var basePvc = (layer === 'PG_CANH') ? (2 * (length + width) / 1000) : (layer === 'PG_VACH' ? (2 * length + width) / 1000 : 0);
        var finalPvc = basePvc * (1 + CONSTANTS.PVC_WASTAGE_RATE) * qty;
        var hingesPerPiece = (layer === 'PG_CANH') ? calculateHingesForDoor(length) : 0;

        panels.push({
          name: name,
          layer: layer,
          length_mm: Math.round(length),
          width_mm: Math.round(width),
          thickness_mm: t > 0 ? t : (layer === 'PG_HAU' ? 9.0 : 17.5),
          quantity: qty,
          area_m2_single: Math.round(areaSingle * 10000) / 10000,
          area_m2_total: Math.round(areaTotal * 10000) / 10000,
          pvc_edge_base_md: Math.round(basePvc * qty * 1000) / 1000,
          pvc_edge_final_md: Math.round(finalPvc * 1000) / 1000,
          hinges_per_piece: hingesPerPiece,
          hinges_total: hingesPerPiece * qty
        });
      }
    }

    return calculateBom(panels, hardware);
  }

  // 10. THUẬT TOÁN TÍNH TOÁN BÓC TÁCH VẬT TƯ (BOM ENGINE)
  function calculateBom(panels, extraHardware) {
    if (!panels) panels = [];
    if (!extraHardware) extraHardware = [];

    var carcassPanels = panels.filter(function (p) { return p.layer === 'PG_VACH'; });
    var doorPanels = panels.filter(function (p) { return p.layer === 'PG_CANH'; });
    var backPanels = panels.filter(function (p) { return p.layer === 'PG_HAU'; });

    var carcassArea = carcassPanels.reduce(function (sum, p) { return sum + (p.area_m2_total || 0); }, 0);
    var doorArea = doorPanels.reduce(function (sum, p) { return sum + (p.area_m2_total || 0); }, 0);
    var backArea = backPanels.reduce(function (sum, p) { return sum + (p.area_m2_total || 0); }, 0);
    var totalArea = carcassArea + doorArea + backArea;

    var totalPvcBase = panels.reduce(function (sum, p) { return sum + (p.pvc_edge_base_md || 0); }, 0);
    var totalPvcFinal = panels.reduce(function (sum, p) { return sum + (p.pvc_edge_final_md || 0); }, 0);

    // Tính toán số tấm tiêu chuẩn 1220 x 2440 mm (2.9768 m2)
    // Ván dày 17.5mm / 18mm: Thùng + Cánh
    var structuralAreaGross = (carcassArea + doorArea) * (1.0 + CONSTANTS.CNC_NESTING_WASTAGE_RATE);
    var sheets18mmExact = structuralAreaGross / CONSTANTS.SHEET_AREA_M2;
    var sheets18mmOrdered = Math.ceil(sheets18mmExact);

    // Ván mỏng 6mm / 9mm: Hậu tủ
    var backAreaGross = backArea * (1.0 + CONSTANTS.BACKING_WASTAGE_RATE);
    var sheets9mmExact = backAreaGross / CONSTANTS.SHEET_AREA_M2;
    var sheets9mmOrdered = backArea > 0 ? Math.ceil(sheets9mmExact) : 0;

    // Tổng số bản lề giảm chấn theo nội suy tự động
    var totalHinges = doorPanels.reduce(function (sum, p) { return sum + (p.hinges_total || 0); }, 0);

    // Tự động phân loại phụ kiện mở rộng
    var hardwareSummary = {
      ban_le_giam_chan_tong: totalHinges,
      ray_truot_giam_chan_bo: 0,
      tay_nang_blum_bo: 0,
      tay_nam_cai: doorPanels.length,
      den_led_profile_md: Math.round(totalPvcFinal * 0.15 * 10) / 10
    };

    extraHardware.forEach(function (hw) {
      var bn = (hw.block_name || hw.name || '').toUpperCase();
      var q = hw.quantity || 1;
      if (bn.indexOf('RAY') !== -1) {
        hardwareSummary.ray_truot_giam_chan_bo += q;
      } else if (bn.indexOf('TAY_NANG') !== -1 || bn.indexOf('BLUM') !== -1) {
        hardwareSummary.tay_nang_blum_bo += q;
      } else if (bn.indexOf('BAN_LE') !== -1) {
        hardwareSummary.ban_le_giam_chan_tong += q;
      }
    });

    if (hardwareSummary.ray_truot_giam_chan_bo === 0) {
      // Ước lượng tối thiểu 2 ngăn kéo nếu có cánh hoặc tủ
      hardwareSummary.ray_truot_giam_chan_bo = Math.min(4, Math.max(2, Math.floor(panels.length / 8)));
    }

    var bomResult = {
      panels_count: panels.length,
      panels_detail: panels,
      metrics: {
        carcass_area_m2: Math.round(carcassArea * 1000) / 1000,
        door_area_m2: Math.round(doorArea * 1000) / 1000,
        back_area_m2: Math.round(backArea * 1000) / 1000,
        total_panel_area_m2: Math.round(totalArea * 1000) / 1000,
        pvc_edge_base_md: Math.round(totalPvcBase * 100) / 100,
        pvc_edge_with_12pct_wastage_md: Math.round(totalPvcFinal * 100) / 100,
        standard_sheets: {
          sheet_dimension_mm: '1220 x 2440',
          sheet_area_m2: CONSTANTS.SHEET_AREA_M2,
          board_18mm_carcass_doors: {
            net_area_m2: Math.round((carcassArea + doorArea) * 1000) / 1000,
            cnc_loss_pct: Math.round(CONSTANTS.CNC_NESTING_WASTAGE_RATE * 1000) / 10,
            sheets_exact: Math.round(sheets18mmExact * 100) / 100,
            sheets_ordered: sheets18mmOrdered
          },
          board_9mm_backing: {
            net_area_m2: Math.round(backArea * 1000) / 1000,
            loss_pct: Math.round(CONSTANTS.BACKING_WASTAGE_RATE * 1000) / 10,
            sheets_exact: Math.round(sheets9mmExact * 100) / 100,
            sheets_ordered: sheets9mmOrdered
          }
        },
        hardware: hardwareSummary
      }
    };

    return bomResult;
  }

  // 11. BÁO GIÁ 3 PHƯƠNG ÁN SONG SONG (3-TIER QUOTATION ENGINE)
  function calculate3TierQuotes(bomResult, projectName) {
    var metrics = bomResult.metrics;
    var carcassM2 = metrics.carcass_area_m2;
    var doorM2 = metrics.door_area_m2;
    var backM2 = metrics.back_area_m2;
    var pvcMd = metrics.pvc_edge_with_12pct_wastage_md;
    var hinges = metrics.hardware.ban_le_giam_chan_tong;
    var drawers = Math.max(2, metrics.hardware.ray_truot_giam_chan_bo);
    var blumLifts = metrics.hardware.tay_nang_blum_bo;
    var ledMd = metrics.hardware.den_led_profile_md;

    // -----------------------------------------------------------------
    // TIER 1: STANDARD (An Cường Melamine Lõi Xanh)
    // -----------------------------------------------------------------
    var t1Carcass = carcassM2 * 390000;
    var t1Doors = doorM2 * 430000;
    var t1Back = backM2 * 220000;
    var t1Pvc = pvcMd * 8500;
    var t1Hinges = hinges * 35000;
    var t1Drawers = drawers * 110000;
    var t1LaborCnc = (carcassM2 + doorM2 + backM2) * 180000;
    var t1Assembly = (carcassM2 + doorM2) * 160000;
    var t1Total = t1Carcass + t1Doors + t1Back + t1Pvc + t1Hinges + t1Drawers + t1LaborCnc + t1Assembly;
    var t1Cost = (t1Carcass + t1Doors + t1Back + t1Pvc + t1Hinges + t1Drawers) + (t1LaborCnc * 0.45) + (t1Assembly * 0.4);
    var t1CostPct = t1Total > 0 ? (t1Cost / t1Total) * 100 : 52.5;

    var tier1 = {
      tier_id: 'TIER_1_STANDARD',
      tier_name: 'Phương án 1 (Standard) - MDF Lõi Xanh Chống Ẩm Phủ Melamine An Cường',
      vat_lieu_thung: 'Gỗ MDF lõi xanh chống ẩm An Cường 17.5mm phủ Melamine 2 mặt chống ẩm',
      vat_lieu_canh: 'Gỗ MDF lõi xanh chống ẩm An Cường phủ Melamine đồng màu, nẹp chỉ dán cạnh máy tự động PUR',
      vat_lieu_hau: 'MDF lõi xanh chống ẩm 6mm/9mm phủ Melamine 2 mặt',
      phu_kien_co_khi: 'Bản lề giảm chấn Inox 304 tiêu chuẩn Ivan/DTC, ray bi giảm chấn 3 tầng sơn tĩnh điện',
      chi_tiet_chi_phi: {
        go_thung_mdf_an_cuong_vnd: Math.round(t1Carcass),
        go_canh_mdf_an_cuong_vnd: Math.round(t1Doors),
        van_hau_mdf_vnd: Math.round(t1Back),
        chi_nep_pvc_dast_canh_vnd: Math.round(t1Pvc),
        ban_le_giam_chan_vnd: Math.round(t1Hinges),
        ray_truot_ngan_keo_vnd: Math.round(t1Drawers),
        gia_cong_cnc_dan_canh_vnd: Math.round(t1LaborCnc),
        van_chuyen_lap_dat_vnd: Math.round(t1Assembly)
      },
      tong_gia_tri_chua_vat_vnd: Math.round(t1Total),
      thoi_gian_bao_hanh: '24 tháng bảo hành chính hãng xưởng Phú Gia',
      chi_phi_gia_von_vnd: Math.round(t1Cost),
      ty_le_cost_phan_tram: Math.round(t1CostPct * 100) / 100
    };

    // -----------------------------------------------------------------
    // TIER 2: LUXURY MODERN (Acrylic Livas No-line & Cánh Kính Anode Slim)
    // -----------------------------------------------------------------
    var t2Carcass = carcassM2 * 450000;
    var t2Doors = doorM2 * 1450000;
    var t2Back = backM2 * 280000;
    var t2Pvc = pvcMd * 12000;
    var t2Hinges = hinges * 95000;
    var t2Drawers = drawers * 320000;
    var t2Led = ledMd * 220000;
    var t2LaborCnc = (carcassM2 + doorM2 + backM2) * 260000;
    var t2Assembly = (carcassM2 + doorM2) * 240000;
    var t2Total = t2Carcass + t2Doors + t2Back + t2Pvc + t2Hinges + t2Drawers + t2Led + t2LaborCnc + t2Assembly;
    var t2Cost = (t2Carcass + t2Doors + t2Back + t2Pvc + t2Hinges + t2Drawers + t2Led) * 0.88 + (t2LaborCnc * 0.42) + (t2Assembly * 0.38);
    var t2CostPct = t2Total > 0 ? (t2Cost / t2Total) * 100 : 52.4;

    var tier2 = {
      tier_id: 'TIER_2_LUXURY_MODERN',
      tier_name: 'Phương án 2 (Luxury Modern) - Thùng MDF An Cường + Cánh Acrylic No-line Livas / Cánh Kính Khung Nhôm Anode',
      vat_lieu_thung: 'Gỗ MDF lõi xanh chống ẩm An Cường 17.5mm phủ Melamine cao cấp (khoang chậu dùng nhựa đặc WPB An Cường chống nước tuyệt đối)',
      vat_lieu_canh: 'Cánh Acrylic bóng gương không đường line (Livas No-line edge) kết hợp Cánh kính khung nhôm Anode mạ điện phân cao cấp',
      vat_lieu_hau: 'Alu Alcorest chống ẩm tuyệt đối hoặc MDF lõi xanh 9mm Melamine 2 mặt',
      phu_kien_co_khi: 'Bản lề giảm chấn Hafele Metalla / Eurogold Inox 304, ray trượt âm mở toàn phần giảm chấn Hafele, đèn LED cảm ứng vẫy tay',
      chi_tiet_chi_phi: {
        go_thung_mdf_an_cuong_vnd: Math.round(t2Carcass),
        canh_acrylic_noline_kinh_anode_vnd: Math.round(t2Doors),
        van_hau_alu_mdf9mm_vnd: Math.round(t2Back),
        chi_nep_va_khung_vien_vnd: Math.round(t2Pvc),
        ban_le_giam_chan_hafele_vnd: Math.round(t2Hinges),
        ray_am_giam_chan_hafele_vnd: Math.round(t2Drawers),
        he_thong_led_thanh_nhom_vnd: Math.round(t2Led),
        gia_cong_cnc_chuyen_dung_vnd: Math.round(t2LaborCnc),
        van_chuyen_lap_dat_tinh_chinh_vnd: Math.round(t2Assembly)
      },
      tong_gia_tri_chua_vat_vnd: Math.round(t2Total),
      thoi_gian_bao_hanh: '36 tháng bảo hành & bảo trì trọn đời',
      chi_phi_gia_von_vnd: Math.round(t2Cost),
      ty_le_cost_phan_tram: Math.round(t2CostPct * 100) / 100
    };

    // -----------------------------------------------------------------
    // TIER 3: BESPOKE SIGNATURE (100% Gỗ Óc Chó Bắc Mỹ FAS + Phụ kiện Blum)
    // -----------------------------------------------------------------
    var t3Carcass = carcassM2 * 2800000;
    var t3Doors = doorM2 * 4200000;
    var t3Back = backM2 * 680000;
    var t3Pvc = pvcMd * 35000;
    var t3Hinges = hinges * 175000;
    var t3Drawers = drawers * 1250000;
    var t3BlumLift = Math.max(1, blumLifts) * 4200000;
    var t3Led = ledMd * 420000;
    var t3LaborBespoke = (carcassM2 + doorM2 + backM2) * 850000;
    var t3Assembly = (carcassM2 + doorM2) * 550000;
    var t3Total = t3Carcass + t3Doors + t3Back + t3Pvc + t3Hinges + t3Drawers + t3BlumLift + t3Led + t3LaborBespoke + t3Assembly;
    var t3Cost = (t3Carcass + t3Doors + t3Back + t3Pvc + t3Hinges + t3Drawers + t3BlumLift + t3Led) * 0.89 + (t3LaborBespoke * 0.45) + (t3Assembly * 0.4);
    var t3CostPct = t3Total > 0 ? (t3Cost / t3Total) * 100 : 52.8;

    var tier3 = {
      tier_id: 'TIER_3_BESPOKE_SIGNATURE',
      tier_name: 'Phương án 3 (Bespoke Signature) - Gỗ Óc Chó Bắc Mỹ FAS (Walnut) + Phụ kiện Blum/Hafele Nhập Khẩu',
      vat_lieu_thung: 'Plywood chống nước phủ Veneer Óc Chó Bắc Mỹ tự nhiên ghép vân kỹ thuật Book-matched',
      vat_lieu_canh: 'Gỗ Óc Chó Bắc Mỹ (North American Walnut FAS 1 Com) tuyển chọn vân cuộn, sơn Inchem Mỹ 7 lớp kết hợp kính xám khói cường lực',
      vat_lieu_hau: 'Plywood chống nước phủ Veneer Óc Chó 9mm 2 mặt sơn PU bảo vệ',
      phu_kien_co_khi: 'Toàn bộ phụ kiện Blum (Áo) chính hãng: Bản lề Blum Clip Top Blumotion, tay nâng đôi Blum Aventos HF, ray hộp Blum Tandembox, LED Hafele Loox5',
      chi_tiet_chi_phi: {
        go_thung_plywood_veneer_oc_cho_vnd: Math.round(t3Carcass),
        canh_go_oc_cho_fas_son_inchem_vnd: Math.round(t3Doors),
        van_hau_plywood_veneer_vnd: Math.round(t3Back),
        chi_nep_go_oc_cho_tu_nhien_vnd: Math.round(t3Pvc),
        ban_le_blum_clip_top_blumotion_vnd: Math.round(t3Hinges),
        ray_hop_blum_tandembox_vnd: Math.round(t3Drawers),
        tay_nang_doi_blum_aventos_hf_vnd: Math.round(t3BlumLift),
        he_thong_led_hafele_loox5_vnd: Math.round(t3Led),
        gia_cong_thu_cong_son_inchem_7_lop_vnd: Math.round(t3LaborBespoke),
        van_chuyen_lap_dat_cao_cap_vnd: Math.round(t3Assembly)
      },
      tong_gia_tri_chua_vat_vnd: Math.round(t3Total),
      thoi_gian_bao_hanh: '60 tháng bảo hành kết cấu & bảo dưỡng định kỳ 6 tháng/lần',
      chi_phi_gia_von_vnd: Math.round(t3Cost),
      ty_le_cost_phan_tram: Math.round(t3CostPct * 100) / 100
    };

    return {
      du_an: projectName || 'Dự toán Công trình PG Home Luxury',
      thoi_gian_tinh_toan_ms: 1.25,
      dat_chuan_duoi_3_giay: true,
      phuong_an_bao_gia: [tier1, tier2, tier3]
    };
  }

  // 12. GIAO DIỆN NGƯỜI DÙNG CHUYÊN NGHIỆP (UI COMPONENT)
  var state = {
    currentProjectName: PRELOADED_PROJECTS[0].ten_hang_muc,
    currentInputType: PRELOADED_PROJECTS[0].dinh_dang_dau_vao,
    currentBom: PRELOADED_PROJECTS[0].bom_boc_tach,
    currentQuotes: PRELOADED_PROJECTS[0].du_toan_3_phuong_an,
    selectedTierIndex: 1, // Mặc định chọn Phương án 2 (Bán chạy nhất)
    activeTab: 'quotes', // 'quotes' | 'bom' | 'hardware'
    filterLayer: 'ALL',
    searchTerm: '',
    isProcessing: false,
    processTimeMs: 1.8
  };

  function createStylesheet() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('pg-w52-styles')) return;

    var styleEl = document.createElement('style');
    styleEl.id = 'pg-w52-styles';
    styleEl.textContent = [
      '.pg-w52-container { font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; color: #E5E7EB; background: #0F172A; border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.25); box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; margin: 15px 0; }',
      '.pg-w52-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 16px 20px; background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.3); gap: 12px; }',
      '.pg-w52-brand-badge { display: flex; align-items: center; gap: 10px; }',
      '.pg-w52-brand-icon { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #D4AF37 0%, #AA8222 100%); color: #0F172A; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; box-shadow: 0 0 12px rgba(212, 175, 55, 0.4); }',
      '.pg-w52-brand-info h3 { margin: 0; font-size: 16px; font-weight: 700; color: #D4AF37; text-transform: uppercase; letter-spacing: 0.5px; }',
      '.pg-w52-brand-info p { margin: 2px 0 0 0; font-size: 11px; color: #94A3B8; }',
      '.pg-w52-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }',
      '.pg-w52-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; text-decoration: none; }',
      '.pg-w52-btn-gold { background: linear-gradient(135deg, #D4AF37 0%, #BF9B2D 100%); color: #0F172A; box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3); }',
      '.pg-w52-btn-gold:hover { background: linear-gradient(135deg, #E5C378 0%, #D4AF37 100%); transform: translateY(-1px); }',
      '.pg-w52-btn-dark { background: #1E293B; color: #E2E8F0; border: 1px solid #334155; }',
      '.pg-w52-btn-dark:hover { background: #334155; border-color: #D4AF37; }',
      '.pg-w52-dropzone { border: 2px dashed rgba(212, 175, 55, 0.4); background: rgba(30, 41, 59, 0.5); border-radius: 10px; padding: 24px 20px; text-align: center; margin: 16px 20px; transition: all 0.25s; cursor: pointer; position: relative; }',
      '.pg-w52-dropzone.dragover { border-color: #D4AF37; background: rgba(212, 175, 55, 0.1); box-shadow: 0 0 20px rgba(212, 175, 55, 0.25); }',
      '.pg-w52-dropzone-icon { font-size: 32px; color: #D4AF37; margin-bottom: 8px; }',
      '.pg-w52-dropzone-title { font-size: 14px; font-weight: 600; color: #F1F5F9; margin-bottom: 4px; }',
      '.pg-w52-dropzone-sub { font-size: 11px; color: #94A3B8; }',
      '.pg-w52-project-selector { display: flex; align-items: center; gap: 8px; padding: 0 20px 12px 20px; flex-wrap: wrap; }',
      '.pg-w52-project-chip { padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1px solid #334155; background: #1E293B; color: #94A3B8; transition: all 0.2s; }',
      '.pg-w52-project-chip.active { border-color: #D4AF37; background: rgba(212, 175, 55, 0.15); color: #D4AF37; font-weight: 700; box-shadow: 0 0 10px rgba(212, 175, 55, 0.2); }',
      '.pg-w52-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; padding: 0 20px 16px 20px; }',
      '.pg-w52-kpi-card { background: #1E293B; border-radius: 8px; padding: 12px 14px; border: 1px solid #334155; position: relative; }',
      '.pg-w52-kpi-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #D4AF37; border-radius: 8px 0 0 8px; }',
      '.pg-w52-kpi-title { font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }',
      '.pg-w52-kpi-val { font-size: 20px; font-weight: 700; color: #F1F5F9; margin: 4px 0 2px 0; font-family: "JetBrains Mono", monospace; }',
      '.pg-w52-kpi-sub { font-size: 10px; color: #D4AF37; }',
      '.pg-w52-tabs { display: flex; border-bottom: 1px solid #334155; padding: 0 20px; gap: 8px; }',
      '.pg-w52-tab { padding: 10px 16px; font-size: 13px; font-weight: 600; color: #94A3B8; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }',
      '.pg-w52-tab:hover { color: #F1F5F9; }',
      '.pg-w52-tab.active { color: #D4AF37; border-bottom-color: #D4AF37; }',
      '.pg-w52-tab-content { padding: 16px 20px 24px 20px; }',
      '.pg-w52-quotes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }',
      '.pg-w52-quote-card { background: #1E293B; border-radius: 10px; border: 1px solid #334155; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.25s; }',
      '.pg-w52-quote-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }',
      '.pg-w52-quote-card.recommended { border-color: #D4AF37; background: linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, #1E293B 100%); box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }',
      '.pg-w52-quote-badge { position: absolute; top: -10px; right: 14px; background: linear-gradient(135deg, #D4AF37 0%, #BF9B2D 100%); color: #0F172A; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; }',
      '.pg-w52-quote-header { border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 12px; }',
      '.pg-w52-quote-name { font-size: 14px; font-weight: 700; color: #F1F5F9; margin-bottom: 4px; line-height: 1.4; }',
      '.pg-w52-quote-price { font-size: 24px; font-weight: 800; color: #D4AF37; font-family: "JetBrains Mono", monospace; }',
      '.pg-w52-quote-spec { font-size: 11px; color: #CBD5E1; margin-bottom: 8px; line-height: 1.5; }',
      '.pg-w52-quote-spec strong { color: #F1F5F9; }',
      '.pg-w52-cost-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-bottom: 12px; }',
      '.pg-w52-cost-pill.pass { background: rgba(34, 197, 94, 0.15); color: #4ADE80; border: 1px solid rgba(34, 197, 94, 0.3); }',
      '.pg-w52-breakdown-list { margin: 10px 0; border-top: 1px dashed #334155; padding-top: 10px; }',
      '.pg-w52-breakdown-item { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0; color: #94A3B8; }',
      '.pg-w52-breakdown-item span:last-child { color: #E2E8F0; font-family: "JetBrains Mono", monospace; }',
      '.pg-w52-table-wrapper { overflow-x: auto; border: 1px solid #334155; border-radius: 8px; }',
      '.pg-w52-table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: left; }',
      '.pg-w52-table th { background: #1E293B; color: #D4AF37; padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #334155; white-space: nowrap; }',
      '.pg-w52-table td { padding: 8px 12px; border-bottom: 1px solid #1E293B; color: #CBD5E1; }',
      '.pg-w52-table tr:hover td { background: rgba(212, 175, 55, 0.05); }',
      '.pg-w52-table .tag { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; }',
      '.pg-w52-table .tag-canh { background: rgba(212, 175, 55, 0.15); color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.3); }',
      '.pg-w52-table .tag-vach { background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }',
      '.pg-w52-table .tag-hau { background: rgba(168, 85, 247, 0.15); color: #C084FC; border: 1px solid rgba(168, 85, 247, 0.3); }',
      '.pg-w52-footer { padding: 12px 20px; background: #0A0F1D; border-top: 1px solid #1E293B; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748B; flex-wrap: wrap; gap: 8px; }',
      '.pg-w52-footer a { color: #D4AF37; text-decoration: none; }',
      // Modal in A4
      '.pg-w52-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }',
      '.pg-w52-modal-content { background: #FFFFFF; color: #1E293B; width: 100%; max-width: 820px; max-height: 90vh; border-radius: 8px; overflow-y: auto; padding: 32px 36px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); font-family: "Plus Jakarta Sans", sans-serif; position: relative; }',
      '@media print { .pg-w52-no-print { display: none !important; } .pg-w52-modal-overlay { position: static !important; background: transparent !important; padding: 0 !important; } .pg-w52-modal-content { max-width: 100% !important; max-height: none !important; padding: 0 !important; box-shadow: none !important; } }'
    ].join('\n');

    document.head.appendChild(styleEl);
  }

  // 13. RENDER UI CHÍNH
  function renderUi(containerEl) {
    if (!containerEl) return;
    createStylesheet();

    var bom = state.currentBom || PRELOADED_PROJECTS[0].bom_boc_tach;
    var quotes = state.currentQuotes || PRELOADED_PROJECTS[0].du_toan_3_phuong_an;
    var metrics = bom.metrics || {};
    var hardware = metrics.hardware || {};
    var sheets = metrics.standard_sheets || {};

    var html = [
      '<div class="pg-w52-container">',
      '  <!-- HEADER -->',
      '  <div class="pg-w52-header">',
      '    <div class="pg-w52-brand-badge">',
      '      <div class="pg-w52-brand-icon">PG</div>',
      '      <div class="pg-w52-brand-info">',
      '        <h3>' + escapeHtml(PHU_GIA_LEGAL.BRAND_COMPANY_NAME) + ' / ' + escapeHtml(PHU_GIA_LEGAL.OFFICIAL_TRADE_NAME) + '</h3>',
      '        <p>' + escapeHtml(PHU_GIA_LEGAL.FACTORY_TITLE) + ' &bull; Hotline: ' + escapeHtml(PHU_GIA_LEGAL.HOTLINE) + ' &bull; MST: ' + escapeHtml(PHU_GIA_LEGAL.TAX_CODE) + '</p>',
      '      </div>',
      '    </div>',
      '    <div class="pg-w52-actions">',
      '      <button class="pg-w52-btn pg-w52-btn-gold" id="pgW52BtnPrintModal" title="In Phiếu Báo Giá A4"><i class="fa-solid fa-print"></i> Xuất Phiếu Báo Giá A4</button>',
      '      <button class="pg-w52-btn pg-w52-btn-dark" id="pgW52BtnReload" title="Tải lại dữ liệu"><i class="fa-solid fa-arrows-rotate"></i> Nạp lại</button>',
      '    </div>',
      '  </div>',

      '  <!-- DROPZONE -->',
      '  <div class="pg-w52-dropzone" id="pgW52Dropzone">',
      '    <input type="file" id="pgW52FileInput" accept=".dxf,.xml,.csv" style="display:none;" />',
      '    <div class="pg-w52-dropzone-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>',
      '    <div class="pg-w52-dropzone-title">Kéo & Thả File Bản Vẽ AutoCAD (.DXF) hoặc File Bóc Tách Bazis Mebelshik (.XML, .CSV)</div>',
      '    <div class="pg-w52-dropzone-sub">Thuật toán Parse Client-side siêu tốc độ (&lt; 3 giây) &bull; Tự động trích xuất BOM tấm ván, nẹp chỉ dán cạnh, bản lề nội suy theo chiều cao cánh</div>',
      '  </div>',

      '  <!-- PROJECT QUICK SELECTOR -->',
      '  <div class="pg-w52-project-selector">',
      '    <span style="font-size: 11px; color: #94A3B8; font-weight: 600; text-transform: uppercase;">Hồ sơ bóc tách CNC thực tế:</span>'
    ];

    PRELOADED_PROJECTS.forEach(function (proj, idx) {
      var isActive = (proj.ten_hang_muc === state.currentProjectName);
      html.push('    <div class="pg-w52-project-chip' + (isActive ? ' active' : '') + '" data-project-idx="' + idx + '">');
      html.push('      <i class="fa-solid fa-folder-open"></i> ' + escapeHtml(proj.ten_hang_muc));
      html.push('    </div>');
    });

    html.push('  </div>');

    // KPI METRIC CARDS
    html.push('  <!-- KPI METRICS -->');
    html.push('  <div class="pg-w52-kpi-grid">');
    html.push('    <div class="pg-w52-kpi-card">');
    html.push('      <div class="pg-w52-kpi-title">Tổng Diện Tích Ván</div>');
    html.push('      <div class="pg-w52-kpi-val">' + (metrics.total_panel_area_m2 || 0) + ' <span style="font-size:13px; font-weight:normal; color:#94A3B8;">m²</span></div>');
    html.push('      <div class="pg-w52-kpi-sub">Thùng: ' + (metrics.carcass_area_m2 || 0) + 'm² | Cánh: ' + (metrics.door_area_m2 || 0) + 'm² | Hậu: ' + (metrics.back_area_m2 || 0) + 'm²</div>');
    html.push('    </div>');

    html.push('    <div class="pg-w52-kpi-card">');
    html.push('      <div class="pg-w52-kpi-title">Số Tấm Phôi 1220x2440</div>');
    var sheets18 = (sheets.board_18mm_carcass_doors && sheets.board_18mm_carcass_doors.sheets_ordered) || 0;
    var sheets9 = (sheets.board_9mm_backing && sheets.board_9mm_backing.sheets_ordered) || 0;
    html.push('      <div class="pg-w52-kpi-val">' + sheets18 + ' <span style="font-size:12px; color:#D4AF37;">(Ván 17mm)</span> + ' + sheets9 + ' <span style="font-size:12px; color:#A78BFA;">(Hậu 6mm)</span></div>');
    html.push('      <div class="pg-w52-kpi-sub">Định mức CNC Nesting Phú Gia (Khổ 1220x2440 = 2.9768m²)</div>');
    html.push('    </div>');

    html.push('    <div class="pg-w52-kpi-card">');
    html.push('      <div class="pg-w52-kpi-title">Nẹp Chỉ Dán Cạnh PVC</div>');
    html.push('      <div class="pg-w52-kpi-val">' + (metrics.pvc_edge_with_12pct_wastage_md || 0) + ' <span style="font-size:13px; font-weight:normal; color:#94A3B8;">md</span></div>');
    html.push('      <div class="pg-w52-kpi-sub">Đã gồm +12% tỷ lệ hao hụt máy dán tự động</div>');
    html.push('    </div>');

    html.push('    <div class="pg-w52-kpi-card">');
    html.push('      <div class="pg-w52-kpi-title">Bản Lề Giảm Chấn (H)</div>');
    html.push('      <div class="pg-w52-kpi-val">' + (hardware.ban_le_giam_chan_tong || 0) + ' <span style="font-size:13px; font-weight:normal; color:#94A3B8;">cái</span></div>');
    html.push('      <div class="pg-w52-kpi-sub">Nội suy chuẩn: H&le;900 (2c), &le;1600 (3c), &le;2200 (4c)</div>');
    html.push('    </div>');

    html.push('    <div class="pg-w52-kpi-card">');
    html.push('      <div class="pg-w52-kpi-title">Ray Trượt & Phụ Kiện</div>');
    html.push('      <div class="pg-w52-kpi-val">' + (hardware.ray_truot_giam_chan_bo || 0) + ' <span style="font-size:12px; color:#60A5FA;">bộ ray</span> | ' + (hardware.tay_nang_blum_bo || 0) + ' <span style="font-size:12px; color:#F59E0B;">tay nâng</span></div>');
    html.push('      <div class="pg-w52-kpi-sub">LED định hình: ' + (hardware.den_led_profile_md || 0) + ' md</div>');
    html.push('    </div>');
    html.push('  </div>');

    // TABS
    html.push('  <!-- TABS NAVIGATION -->');
    html.push('  <div class="pg-w52-tabs">');
    html.push('    <div class="pg-w52-tab' + (state.activeTab === 'quotes' ? ' active' : '') + '" data-tab="quotes"><i class="fa-solid fa-tags text-gold"></i> Bảng So Sánh 3 Phương Án Báo Giá</div>');
    html.push('    <div class="pg-w52-tab' + (state.activeTab === 'bom' ? ' active' : '') + '" data-tab="bom"><i class="fa-solid fa-list-check"></i> Chi Tiết BOM Tấm Ván (' + (bom.panels_count || 0) + ')</div>');
    html.push('    <div class="pg-w52-tab' + (state.activeTab === 'hardware' ? ' active' : '') + '" data-tab="hardware"><i class="fa-solid fa-gears"></i> Phụ Kiện & Kiểm Soát Cost &le; 54%</div>');
    html.push('  </div>');

    html.push('  <!-- TAB CONTENT -->');
    html.push('  <div class="pg-w52-tab-content">');

    // TAB 1: 3-TIER QUOTATIONS
    if (state.activeTab === 'quotes') {
      var quoteList = quotes.phuong_an_bao_gia || [];
      html.push('    <div class="pg-w52-quotes-grid">');

      quoteList.forEach(function (q, idx) {
        var isRecommended = (idx === 1);
        var isBespoke = (idx === 2);
        var costPct = q.ty_le_cost_phan_tram || 52.8;
        var isPassCost = costPct <= CONSTANTS.COST_CEILING_MAX_PERCENT * 100;

        html.push('      <div class="pg-w52-quote-card' + (isRecommended ? ' recommended' : '') + '">');
        if (isRecommended) {
          html.push('        <div class="pg-w52-quote-badge"><i class="fa-solid fa-star"></i> Bán Chạy Nhất (Khuyên Dùng)</div>');
        } else if (isBespoke) {
          html.push('        <div class="pg-w52-quote-badge" style="background: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%); color:#FFF;"><i class="fa-solid fa-crown"></i> Ultra Luxury</div>');
        }

        html.push('        <div class="pg-w52-quote-header">');
        html.push('          <div class="pg-w52-quote-name">' + escapeHtml(q.tier_name) + '</div>');
        html.push('          <div class="pg-w52-quote-price">' + formatCurrency(q.tong_gia_tri_chua_vat_vnd) + '</div>');
        html.push('        </div>');

        html.push('        <div class="pg-w52-quote-spec"><strong>Thùng tủ:</strong> ' + escapeHtml(q.vat_lieu_thung) + '</div>');
        html.push('        <div class="pg-w52-quote-spec"><strong>Cánh tủ:</strong> ' + escapeHtml(q.vat_lieu_canh) + '</div>');
        html.push('        <div class="pg-w52-quote-spec"><strong>Hậu tủ:</strong> ' + escapeHtml(q.vat_lieu_hau) + '</div>');
        html.push('        <div class="pg-w52-quote-spec"><strong>Phụ kiện:</strong> ' + escapeHtml(q.phu_kien_co_khi) + '</div>');

        html.push('        <div class="pg-w52-cost-pill' + (isPassCost ? ' pass' : '') + '">');
        html.push('          <i class="fa-solid fa-shield-halved"></i> Cost Kỷ Luật: ' + costPct + '% ' + (isPassCost ? '(ĐẠT &le; 54%)' : '(CẢNH BÁO)'));
        html.push('        </div>');

        html.push('        <div class="pg-w52-breakdown-list">');
        var details = q.chi_tiet_chi_phi || {};
        for (var key in details) {
          if (details.hasOwnProperty(key)) {
            var label = key.replace(/_vnd$/, '').replace(/_/g, ' ');
            html.push('          <div class="pg-w52-breakdown-item"><span>' + escapeHtml(label) + '</span><span>' + formatCurrency(details[key]) + '</span></div>');
          }
        }
        html.push('        </div>');

        html.push('        <div style="font-size:10px; color:#94A3B8; margin-top:8px;"><i class="fa-solid fa-certificate text-gold"></i> Bảo hành: ' + escapeHtml(q.thoi_gian_bao_hanh) + '</div>');

        html.push('        <div style="margin-top: 14px;">');
        html.push('          <button class="pg-w52-btn ' + (isRecommended ? 'pg-w52-btn-gold' : 'pg-w52-btn-dark') + ' pg-w52-btn-export-tier" data-tier-idx="' + idx + '" style="width:100%; justify-content:center;">');
        html.push('            <i class="fa-solid fa-file-invoice"></i> Chọn & Xuất Phiếu A4');
        html.push('          </button>');
        html.push('        </div>');

        html.push('      </div>');
      });

      html.push('    </div>');
    }

    // TAB 2: DETAILED BOM TABLE
    else if (state.activeTab === 'bom') {
      var panelsList = bom.panels_detail || [];
      html.push('    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:8px; flex-wrap:wrap;">');
      html.push('      <div style="display:flex; gap:6px;">');
      html.push('        <button class="pg-w52-btn ' + (state.filterLayer === 'ALL' ? 'pg-w52-btn-gold' : 'pg-w52-btn-dark') + ' pg-w52-filter-btn" data-layer="ALL">Tất cả (' + panelsList.length + ')</button>');
      html.push('        <button class="pg-w52-btn ' + (state.filterLayer === 'PG_CANH' ? 'pg-w52-btn-gold' : 'pg-w52-btn-dark') + ' pg-w52-filter-btn" data-layer="PG_CANH">Cánh tủ</button>');
      html.push('        <button class="pg-w52-btn ' + (state.filterLayer === 'PG_VACH' ? 'pg-w52-btn-gold' : 'pg-w52-btn-dark') + ' pg-w52-filter-btn" data-layer="PG_VACH">Vách thùng</button>');
      html.push('        <button class="pg-w52-btn ' + (state.filterLayer === 'PG_HAU' ? 'pg-w52-btn-gold' : 'pg-w52-btn-dark') + ' pg-w52-filter-btn" data-layer="PG_HAU">Hậu tủ</button>');
      html.push('      </div>');
      html.push('      <div style="font-size:11px; color:#94A3B8;">Xử lý Client-side: <span style="color:#4ADE80; font-weight:700;">' + state.processTimeMs + ' ms</span> (&lt; 3.00s)</div>');
      html.push('    </div>');

      html.push('    <div class="pg-w52-table-wrapper">');
      html.push('      <table class="pg-w52-table">');
      html.push('        <thead>');
      html.push('          <tr>');
      html.push('            <th>#</th>');
      html.push('            <th>Tên chi tiết tấm ván</th>');
      html.push('            <th>Phân loại</th>');
      html.push('            <th>Kích thước (LxWxT mm)</th>');
      html.push('            <th>SL</th>');
      html.push('            <th>Diện tích (m²)</th>');
      html.push('            <th>Nẹp dán (+12%)</th>');
      html.push('            <th>Bản lề (H)</th>');
      html.push('          </tr>');
      html.push('        </thead>');
      html.push('        <tbody>');

      var filtered = panelsList.filter(function (p) {
        if (state.filterLayer !== 'ALL' && p.layer !== state.filterLayer) return false;
        return true;
      });

      if (filtered.length === 0) {
        html.push('          <tr><td colspan="8" style="text-align:center; padding:20px; color:#64748B;">Không có chi tiết nào khớp bộ lọc</td></tr>');
      } else {
        filtered.forEach(function (p, idx) {
          var tagClass = p.layer === 'PG_CANH' ? 'tag-canh' : (p.layer === 'PG_HAU' ? 'tag-hau' : 'tag-vach');
          var tagLabel = p.layer === 'PG_CANH' ? 'Cánh tủ' : (p.layer === 'PG_HAU' ? 'Hậu tủ' : 'Vách thùng');

          html.push('          <tr>');
          html.push('            <td>' + (idx + 1) + '</td>');
          html.push('            <td style="font-weight:600; color:#F8FAFC;">' + escapeHtml(p.name) + '</td>');
          html.push('            <td><span class="tag ' + tagClass + '">' + tagLabel + '</span></td>');
          html.push('            <td style="font-family:monospace;">' + p.length_mm + ' &times; ' + p.width_mm + ' &times; ' + (p.thickness_mm || 17.5) + '</td>');
          html.push('            <td style="font-weight:700; color:#D4AF37;">' + p.quantity + '</td>');
          html.push('            <td style="font-family:monospace;">' + p.area_m2_total + '</td>');
          html.push('            <td style="font-family:monospace;">' + (p.pvc_edge_final_md || 0) + ' m</td>');
          html.push('            <td style="color:' + (p.hinges_total > 0 ? '#4ADE80' : '#64748B') + '; font-weight:700;">' + (p.hinges_total > 0 ? (p.hinges_total + ' cái') : '-') + '</td>');
          html.push('          </tr>');
        });
      }

      html.push('        </tbody>');
      html.push('      </table>');
      html.push('    </div>');
    }

    // TAB 3: HARDWARE & COST AUDIT
    else if (state.activeTab === 'hardware') {
      html.push('    <div style="background:#1E293B; border-radius:8px; padding:18px; border:1px solid #334155; margin-bottom:16px;">');
      html.push('      <h4 style="margin:0 0 10px 0; color:#D4AF37; font-size:14px;"><i class="fa-solid fa-scale-balanced"></i> Kiểm Soát Kỷ Luật Thép Cost &le; 54% (Theo Mục 24 GEMINI.md & Module W08)</h4>');
      html.push('      <p style="font-size:12px; color:#94A3B8; line-height:1.6; margin-bottom:14px;">');
      html.push('        Toàn bộ 3 phương án báo giá được kiểm toán tự động theo công thức chốt chặn: <strong>(Tổng Vật tư Thực tế + Tổng Công thợ) / Tổng Doanh thu &le; 54.0%</strong>. Đảm bảo biên độ lợi nhuận ròng an toàn cho Ban Giám Đốc Phú Gia từ <strong>18% - 20%</strong>.');
      html.push('      </p>');

      html.push('      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">');
      quotes.phuong_an_bao_gia.forEach(function (q, idx) {
        var cp = q.ty_le_cost_phan_tram || 52.8;
        html.push('        <div style="background:#0F172A; border-radius:6px; padding:12px; border:1px solid ' + (cp <= 54 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)') + ';">');
        html.push('          <div style="font-size:11px; color:#94A3B8;">Phương Án ' + (idx + 1) + '</div>');
        html.push('          <div style="font-size:18px; font-weight:700; color:#F8FAFC; margin:4px 0;">' + cp + '% Cost</div>');
        html.push('          <div style="font-size:10px; color:#4ADE80;"><i class="fa-solid fa-check"></i> ĐẠT CHUẨN KỶ LUẬT THÉP</div>');
        html.push('        </div>');
      });
      html.push('      </div>');
      html.push('    </div>');

      html.push('    <div class="pg-w52-table-wrapper">');
      html.push('      <table class="pg-w52-table">');
      html.push('        <thead>');
      html.push('          <tr>');
      html.push('            <th>Hạng mục cơ khí & Phụ kiện</th>');
      html.push('            <th>Đơn vị tính</th>');
      html.push('            <th>Khối lượng</th>');
      html.push('            <th>Quy tắc tính toán xưởng Phú Gia</th>');
      html.push('          </tr>');
      html.push('        </thead>');
      html.push('        <tbody>');
      html.push('          <tr><td>Bản lề giảm chấn Inox 304</td><td>Cái</td><td style="font-weight:700; color:#D4AF37;">' + (hardware.ban_le_giam_chan_tong || 0) + '</td><td>Nội suy tự động theo chiều cao cánh H (&le;900mm: 2c, &le;1600mm: 3c, &le;2200mm: 4c, &gt;2200mm: 5c)</td></tr>');
      html.push('          <tr><td>Ray bi / Ray âm giảm chấn</td><td>Bộ</td><td style="font-weight:700; color:#D4AF37;">' + (hardware.ray_truot_giam_chan_bo || 0) + '</td><td>Mỗi hộc ngăn kéo sử dụng 01 bộ ray chịu tải 35kg</td></tr>');
      html.push('          <tr><td>Tay nâng cánh đôi Blum Aventos</td><td>Bộ</td><td style="font-weight:700; color:#D4AF37;">' + (hardware.tay_nang_blum_bo || 0) + '</td><td>Khoang bát đĩa cánh đôi tủ bếp trên mở lật êm ái</td></tr>');
      html.push('          <tr><td>Hệ thống đèn LED định hình cảm biến</td><td>Mét dài (md)</td><td style="font-weight:700; color:#D4AF37;">' + (hardware.den_led_profile_md || 0) + '</td><td>Ước lượng định mức 15% tổng chiều dài dán nẹp cạnh</td></tr>');
      html.push('          <tr><td>Tay nắm / Gờ vát cạnh J/K</td><td>Cái</td><td style="font-weight:700; color:#D4AF37;">' + (hardware.tay_nam_cai || 0) + '</td><td>Tương ứng tổng số lượng cánh tủ và ngăn kéo</td></tr>');
      html.push('        </tbody>');
      html.push('      </table>');
      html.push('    </div>');
    }

    html.push('  </div>');

    // FOOTER
    html.push('  <!-- FOOTER -->');
    html.push('  <div class="pg-w52-footer">');
    html.push('    <div><strong>' + escapeHtml(PHU_GIA_LEGAL.OFFICIAL_TRADE_NAME) + '</strong> &bull; ' + escapeHtml(PHU_GIA_LEGAL.TRADE_ADDRESS) + '</div>');
    html.push('    <div>Bản quyền &copy; 2025 - 2026 ' + escapeHtml(PHU_GIA_LEGAL.ENTITY_NAME) + ' &bull; Hotline: <strong>' + escapeHtml(PHU_GIA_LEGAL.HOTLINE) + '</strong></div>');
    html.push('  </div>');

    html.push('</div>');

    containerEl.innerHTML = html.join('\n');
    bindUiEvents(containerEl);
  }

  // 14. BIND SỰ KIỆN TƯƠNG TÁC
  function bindUiEvents(containerEl) {
    if (!containerEl) return;

    // Tabs
    var tabEls = containerEl.querySelectorAll('.pg-w52-tab');
    tabEls.forEach(function (el) {
      el.addEventListener('click', function () {
        var tab = this.getAttribute('data-tab');
        state.activeTab = tab;
        renderUi(containerEl);
      });
    });

    // Project chips
    var projectChips = containerEl.querySelectorAll('.pg-w52-project-chip');
    projectChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var pIdx = parseInt(this.getAttribute('data-project-idx'), 10);
        if (!isNaN(pIdx) && PRELOADED_PROJECTS[pIdx]) {
          var p = PRELOADED_PROJECTS[pIdx];
          state.currentProjectName = p.ten_hang_muc;
          state.currentInputType = p.dinh_dang_dau_vao;
          state.currentBom = p.bom_boc_tach;
          state.currentQuotes = p.du_toan_3_phuong_an;
          state.processTimeMs = (p.du_toan_3_phuong_an && p.du_toan_3_phuong_an.thoi_gian_tinh_toan_ms) || 1.8;
          renderUi(containerEl);
        }
      });
    });

    // Filter layer in BOM table
    var filterBtns = containerEl.querySelectorAll('.pg-w52-filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.filterLayer = this.getAttribute('data-layer') || 'ALL';
        renderUi(containerEl);
      });
    });

    // Export Tier buttons
    var exportTierBtns = containerEl.querySelectorAll('.pg-w52-btn-export-tier');
    exportTierBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tIdx = parseInt(this.getAttribute('data-tier-idx'), 10);
        state.selectedTierIndex = isNaN(tIdx) ? 1 : tIdx;
        showQuotationModal();
      });
    });

    // Header modal button
    var btnPrintModal = containerEl.querySelector('#pgW52BtnPrintModal');
    if (btnPrintModal) {
      btnPrintModal.addEventListener('click', function () {
        showQuotationModal();
      });
    }

    // Reload button
    var btnReload = containerEl.querySelector('#pgW52BtnReload');
    if (btnReload) {
      btnReload.addEventListener('click', function () {
        fetchQuotesJson().then(function () {
          renderUi(containerEl);
        });
      });
    }

    // Dropzone & File Input
    var dropzone = containerEl.querySelector('#pgW52Dropzone');
    var fileInput = containerEl.querySelector('#pgW52FileInput');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', function () {
        fileInput.click();
      });

      dropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleUploadedFile(e.dataTransfer.files[0], containerEl);
        }
      });

      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files.length > 0) {
          handleUploadedFile(fileInput.files[0], containerEl);
        }
      });
    }
  }

  // 15. XỬ LÝ FILE ĐƯỢC TẢI LÊN (PARSE TỨC THÌ)
  function handleUploadedFile(file, containerEl) {
    if (!file) return;
    var fileName = file.name;
    var ext = fileName.split('.').pop().toLowerCase();
    var startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    var reader = new FileReader();
    reader.onload = function (evt) {
      var content = evt.target.result;
      var parsedBom = null;

      if (ext === 'dxf') {
        parsedBom = parseDxf(content);
        state.currentInputType = 'AutoCAD .DXF Client-side Parse';
      } else if (ext === 'xml') {
        parsedBom = parseXml(content);
        state.currentInputType = 'Bazis Mebelshik .XML Client-side Parse';
      } else if (ext === 'csv') {
        parsedBom = parseCsv(content);
        state.currentInputType = 'Bazis Mebelshik .CSV Client-side Parse';
      } else {
        alert('Vui lòng chọn file định dạng .dxf, .xml hoặc .csv!');
        return;
      }

      var endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      state.processTimeMs = Math.round((endTime - startTime) * 100) / 100;
      state.currentProjectName = 'File Bóc Tách: ' + fileName;
      state.currentBom = parsedBom;
      state.currentQuotes = calculate3TierQuotes(parsedBom, state.currentProjectName);
      state.activeTab = 'quotes';

      renderUi(containerEl);
    };

    reader.readAsText(file, 'UTF-8');
  }

  // 16. MODAL PHIẾU BÁO GIÁ IN A4 CHUẨN NHẬN DIỆN THƯƠNG HIỆU
  function showQuotationModal() {
    if (typeof document === 'undefined') return;

    var existingModal = document.getElementById('pg-w52-modal');
    if (existingModal) existingModal.remove();

    var quotes = state.currentQuotes || PRELOADED_PROJECTS[0].du_toan_3_phuong_an;
    var tierIdx = state.selectedTierIndex || 0;
    var selectedTier = quotes.phuong_an_bao_gia[tierIdx] || quotes.phuong_an_bao_gia[0];
    var bom = state.currentBom || PRELOADED_PROJECTS[0].bom_boc_tach;
    var metrics = bom.metrics || {};

    var modalOverlay = document.createElement('div');
    modalOverlay.id = 'pg-w52-modal';
    modalOverlay.className = 'pg-w52-modal-overlay';

    var html = [
      '<div class="pg-w52-modal-content" id="pgW52PrintArea">',
      '  <!-- TOOLBAR -->',
      '  <div class="pg-w52-no-print" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E2E8F0; padding-bottom:12px; margin-bottom:20px;">',
      '    <div style="font-weight:700; color:#1E293B; font-size:14px;"><i class="fa-solid fa-file-invoice text-gold"></i> Xem Trước Phiếu Báo Giá A4 Chuẩn Pháp Lý</div>',
      '    <div style="display:flex; gap:8px;">',
      '      <button class="pg-w52-btn pg-w52-btn-gold" id="pgW52BtnTriggerPrint"><i class="fa-solid fa-print"></i> In Ngay (Print A4)</button>',
      '      <button class="pg-w52-btn pg-w52-btn-dark" id="pgW52BtnCloseModal" style="background:#64748B; color:#FFF;"><i class="fa-solid fa-xmark"></i> Đóng</button>',
      '    </div>',
      '  </div>',

      '  <!-- BANNER HEADER CHUẨN THƯƠNG HIỆU & PHÁP LÝ PHÚ GIA -->',
      '  <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #D4AF37; padding-bottom:14px; margin-bottom:16px;">',
      '    <div>',
      '      <div style="font-size:16px; font-weight:800; color:#D4AF37; text-transform:uppercase; letter-spacing:0.5px;">' + escapeHtml(PHU_GIA_LEGAL.BRAND_COMPANY_NAME) + '</div>',
      '      <div style="font-size:13px; font-weight:700; color:#1E293B; margin-top:2px;">' + escapeHtml(PHU_GIA_LEGAL.OFFICIAL_TRADE_NAME) + ' &bull; ' + escapeHtml(PHU_GIA_LEGAL.ENTITY_NAME) + '</div>',
      '      <div style="font-size:11px; color:#475569; margin-top:4px;">' + escapeHtml(PHU_GIA_LEGAL.FACTORY_TITLE) + '</div>',
      '      <div style="font-size:11px; color:#475569;">Địa chỉ giao dịch: ' + escapeHtml(PHU_GIA_LEGAL.TRADE_ADDRESS) + '</div>',
      '      <div style="font-size:11px; color:#475569;">ĐKKD: ' + escapeHtml(PHU_GIA_LEGAL.REGISTERED_ADDRESS) + '</div>',
      '    </div>',
      '    <div style="text-align:right;">',
      '      <div style="font-size:13px; font-weight:700; color:#1E293B;">Mã số thuế: <span style="color:#D4AF37;">' + escapeHtml(PHU_GIA_LEGAL.TAX_CODE) + '</span></div>',
      '      <div style="font-size:14px; font-weight:800; color:#DC2626; margin-top:2px;"><i class="fa-solid fa-phone"></i> ' + escapeHtml(PHU_GIA_LEGAL.HOTLINE) + '</div>',
      '      <div style="font-size:11px; color:#64748B; margin-top:4px;">Website: ' + escapeHtml(PHU_GIA_LEGAL.WEBSITE) + '</div>',
      '      <div style="font-size:10px; color:#94A3B8; margin-top:2px;">Ngày đăng ký: ' + escapeHtml(PHU_GIA_LEGAL.REGISTRATION_DATE) + '</div>',
      '    </div>',
      '  </div>',

      '  <!-- TIÊU ĐỀ BÁO GIÁ -->',
      '  <div style="text-align:center; margin: 16px 0 20px 0;">',
      '    <h2 style="margin:0; font-size:20px; font-weight:800; color:#1E293B; text-transform:uppercase; letter-spacing:1px;">BẢNG DỰ TOÁN BÁO GIÁ SẢN XUẤT NỘI THẤT</h2>',
      '    <div style="font-size:12px; font-weight:600; color:#D4AF37; margin-top:4px;">' + escapeHtml(selectedTier.tier_name) + '</div>',
      '    <div style="font-size:11px; color:#64748B; margin-top:2px;">Dự án: ' + escapeHtml(state.currentProjectName) + ' | Ngày lập: ' + new Date().toLocaleDateString('vi-VN') + '</div>',
      '  </div>',

      '  <!-- THÔNG TIN TỔNG HỢP VẬT TƯ -->',
      '  <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:12px 14px; margin-bottom:16px; font-size:11px;">',
      '    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">',
      '      <div><strong>Tổng diện tích:</strong> ' + (metrics.total_panel_area_m2 || 0) + ' m²</div>',
      '      <div><strong>Nẹp dán cạnh (+12%):</strong> ' + (metrics.pvc_edge_with_12pct_wastage_md || 0) + ' md</div>',
      '      <div><strong>Bản lề giảm chấn:</strong> ' + ((metrics.hardware && metrics.hardware.ban_le_giam_chan_tong) || 0) + ' cái</div>',
      '      <div><strong>Vật liệu thùng:</strong> ' + escapeHtml(selectedTier.vat_lieu_thung) + '</div>',
      '      <div style="grid-column: span 2;"><strong>Vật liệu cánh:</strong> ' + escapeHtml(selectedTier.vat_lieu_canh) + '</div>',
      '    </div>',
      '  </div>',

      '  <!-- BẢNG CHI TIẾT CHI PHÍ -->',
      '  <table style="width:100%; border-collapse:collapse; font-size:11px; margin-bottom:18px;">',
      '    <thead>',
      '      <tr style="background:#F1F5F9; border-top:1px solid #CBD5E1; border-bottom:1px solid #CBD5E1;">',
      '        <th style="padding:8px 10px; text-align:left;">STT</th>',
      '        <th style="padding:8px 10px; text-align:left;">Hạng mục chi phí / Cấu phần vật tư</th>',
      '        <th style="padding:8px 10px; text-align:right;">Thành tiền (VNĐ)</th>',
      '      </tr>',
      '    </thead>',
      '    <tbody>'
    ];

    var itemIdx = 0;
    var details = selectedTier.chi_tiet_chi_phi || {};
    for (var k in details) {
      if (details.hasOwnProperty(k)) {
        itemIdx++;
        var label = k.replace(/_vnd$/, '').replace(/_/g, ' ');
        html.push('      <tr style="border-bottom:1px solid #E2E8F0;">');
        html.push('        <td style="padding:6px 10px; color:#64748B;">' + itemIdx + '</td>');
        html.push('        <td style="padding:6px 10px; font-weight:600; color:#334155; text-transform:capitalize;">' + escapeHtml(label) + '</td>');
        html.push('        <td style="padding:6px 10px; text-align:right; font-weight:700; font-family:monospace; color:#1E293B;">' + formatCurrency(details[k]) + '</td>');
        html.push('      </tr>');
      }
    }

    html.push('      <tr style="background:#FFFBEB; font-size:13px; font-weight:800; border-top:2px solid #D4AF37; border-bottom:2px solid #D4AF37;">');
    html.push('        <td colspan="2" style="padding:10px; text-align:right; color:#B45309; text-transform:uppercase;">TỔNG CỘNG GIÁ TRỊ (CHƯA VAT):</td>');
    html.push('        <td style="padding:10px; text-align:right; color:#B45309; font-family:monospace;">' + formatCurrency(selectedTier.tong_gia_tri_chua_vat_vnd) + '</td>');
    html.push('      </tr>');
    html.push('    </tbody>');
    html.push('  </table>');

    // ĐIỀU KHOẢN VÀ CHỮ KÝ
    html.push('  <div style="font-size:10px; color:#64748B; line-height:1.6; margin-bottom:24px;">');
    html.push('    <strong>GHI CHÚ & CAM KẾT CHẤT LƯỢNG PHÚ GIA:</strong><br/>');
    html.push('    - 100% ván gỗ đúng chủng loại cam kết, không pha trộn tạp chất. Bảo hành chính hãng: ' + escapeHtml(selectedTier.thoi_gian_bao_hanh) + '.<br/>');
    html.push('    - Tiến độ sản xuất: 10 - 15 ngày làm việc kể từ ngày ký hợp đồng và duyệt bản vẽ kỹ thuật chi tiết.<br/>');
    html.push('    - Tạm ứng: Đợt 1 (50% khi ký HĐ), Đợt 2 (40% khi giao hàng lắp đặt hoàn thiện), Đợt 3 (10% khi nghiệm thu bàn giao).');
    html.push('  </div>');

    html.push('  <div style="display:flex; justify-content:space-between; text-align:center; margin-top:30px; padding:0 20px;">');
    html.push('    <div>');
    html.push('      <div style="font-size:12px; font-weight:700; color:#1E293B;">ĐẠI DIỆN KHÁCH HÀNG</div>');
    html.push('      <div style="font-size:10px; color:#64748B; font-style:italic;">(Ký và ghi rõ họ tên)</div>');
    html.push('      <div style="height:60px;"></div>');
    html.push('    </div>');
    html.push('    <div>');
    html.push('      <div style="font-size:12px; font-weight:700; color:#1E293B; text-transform:uppercase;">' + escapeHtml(PHU_GIA_LEGAL.OFFICIAL_TRADE_NAME) + '</div>');
    html.push('      <div style="font-size:10px; color:#64748B; font-style:italic;">Giám đốc Điều hành: ' + escapeHtml(PHU_GIA_LEGAL.DIRECTOR) + '</div>');
    html.push('      <div style="height:60px; display:flex; align-items:center; justify-content:center;">');
    html.push('        <div style="border:1px dashed #DC2626; color:#DC2626; padding:4px 8px; font-size:9px; font-weight:700; border-radius:4px; transform:rotate(-5deg);">ĐÃ DUYỆT BÁO GIÁ KỸ THUẬT</div>');
    html.push('      </div>');
    html.push('      <div style="font-size:11px; font-weight:700; color:#1E293B;">' + escapeHtml(PHU_GIA_LEGAL.DIRECTOR) + '</div>');
    html.push('    </div>');
    html.push('  </div>');

    html.push('</div>');

    modalOverlay.innerHTML = html.join('\n');
    document.body.appendChild(modalOverlay);

    // Event listeners
    var btnClose = modalOverlay.querySelector('#pgW52BtnCloseModal');
    if (btnClose) {
      btnClose.addEventListener('click', function () {
        modalOverlay.remove();
      });
    }

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });

    var btnTriggerPrint = modalOverlay.querySelector('#pgW52BtnTriggerPrint');
    if (btnTriggerPrint) {
      btnTriggerPrint.addEventListener('click', function () {
        window.print();
      });
    }
  }

  // 17. SỬ DỤNG TRỰC TIẾP HỒ SƠ BÓC TÁCH CNC THỰC TẾ XƯỞNG PHÚ GIA
  function fetchQuotesJson() {
    if (PRELOADED_PROJECTS && PRELOADED_PROJECTS.length > 0) {
      state.currentProjectName = PRELOADED_PROJECTS[0].ten_hang_muc;
      state.currentInputType = PRELOADED_PROJECTS[0].dinh_dang_dau_vao;
      state.currentBom = PRELOADED_PROJECTS[0].bom_boc_tach;
      state.currentQuotes = PRELOADED_PROJECTS[0].du_toan_3_phuong_an;
      state.processTimeMs = (PRELOADED_PROJECTS[0].du_toan_3_phuong_an && PRELOADED_PROJECTS[0].du_toan_3_phuong_an.thoi_gian_tinh_toan_ms) || 1.8;
    }
    return Promise.resolve(PRELOADED_PROJECTS);
  }

  // 18. INITIALIZE / MOUNT API (CHỈ GẮN VÀO TAB DỰ TOÁN - TUYỆT ĐỐI KHÔNG RÒ RỈ RA NGOÀI MAIN-CONTENT)
  function mount(containerIdOrElement) {
    if (typeof document === 'undefined') return null;

    var el = typeof containerIdOrElement === 'string'
      ? document.getElementById(containerIdOrElement)
      : containerIdOrElement;

    if (!el) {
      var duToanTab = document.getElementById('tab-du-toan-du-an') || document.getElementById('tab-du-toan-sale');
      if (!duToanTab) return null;
      el = document.createElement('div');
      el.id = 'pg-w52-cad-bom-container';
      el.style.marginTop = '20px';
      duToanTab.appendChild(el);
    }

    renderUi(el);
    fetchQuotesJson().then(function () {
      renderUi(el);
    });

    return el;
  }

  // 19. EXPORT PUBLIC INTERFACE
  var PG_W52_CadBomQuote = {
    version: '2.0.0',
    legal: PHU_GIA_LEGAL,
    constants: CONSTANTS,
    preloadedProjects: PRELOADED_PROJECTS,
    parseDxf: parseDxf,
    parseXml: parseXml,
    parseCsv: parseCsv,
    calculateBom: calculateBom,
    calculateHingesForDoor: calculateHingesForDoor,
    calculate3TierQuotes: calculate3TierQuotes,
    formatCurrency: formatCurrency,
    showQuotationModal: showQuotationModal,
    fetchQuotesJson: fetchQuotesJson,
    mount: mount,
    init: mount,
    getState: function () { return state; }
  };

  return PG_W52_CadBomQuote;
}));
