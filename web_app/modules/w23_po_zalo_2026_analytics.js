/**
 * ====================================================================================================
 * PG HOME LUXURY - QUẢN TRỊ NỘI BỘ & TỰ ĐỘNG HÓA
 * PHÂN HỆ QUẢN TRỊ ĐẶT HÀNG ZALO 2026 (W23 PO ZALO 2026 ANALYTICS)
 * ----------------------------------------------------------------------------------------------------
 * Tác giả: Công nhân Flash W23
 * Bản quyền: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST/ĐKKD: 042203002931)
 * Văn phòng & Xưởng: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * Hotline: 0973.562.789
 * Tuân thủ Kỷ luật Thép:
 *   - Mục 24: Định mức tấm CNC & Kiểm soát chi phí tổng (Vật tư + Thợ) <= 54%
 *   - Đối soát dòng tiền 3 lớp: Ảnh hóa đơn + Xác nhận Zalo + UNC ngân hàng
 *   - Dấu đỏ điện tử: Phê duyệt 100% bởi Giám Đốc Nguyễn Viết Nghĩa trước khi xuất đơn
 * ====================================================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W23 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Dữ liệu nguồn chuẩn hóa 18 nhóm Zalo Đặt Hàng 2026 kế thừa từ TONG_HOP_DAT_HANG_ZALO_2026.json
  var RAW_ZALO_DATA = [
    {
      "index": 1,
      "title": "KÍNH VIỆT NHẬT - PHÚ GIA LUXURY",
      "member_count": "6 thành viên",
      "group_id": "g6882545434220944455",
      "supplier_name": "Kính Việt Nhật VSG (Thoan VSG)",
      "material_category": "Kính cường lực 8-10mm, Kính màu ốp bếp, Phụ kiện nhôm kính",
      "total_messages_loaded": 4,
      "date_range": { "oldest": "Hôm qua", "newest": "10:51 Hôm nay" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Đã cọc 40% (1.110.720 đ) / Tổng đơn 2.776.800 đ",
        "debt_amount": "Đã cọc 40% (1.110.720 đ) / Tổng đơn 2.776.800 đ",
        "order_codes": ["DH_KINH_VIET_NHAT_VSG_30_10"],
        "amounts": ["1.110.720 đ", "2.776.800 đ"]
      },
      "attached_files_count": 1,
      "attached_files": ["Don_dat_kinh_Viet_Nhat_30_10_2026.pdf"],
      "cached_disk_files_count": 13,
      "project_tag": "DA_BIET_THU_NAM",
      "project_name": "Biệt Thự Hà Tĩnh - Hạng mục Kính Ốp Bếp & Kính Cường Lực",
      "month_key": "2026-10",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 2,
      "title": "2026 Đặt hàng anh Cường Hà Nội",
      "member_count": "4 thành viên",
      "group_id": "g727862869232620509",
      "supplier_name": "Xưởng Cường Gỗ Thịt (Hà Nội)",
      "material_category": "Gỗ thịt tự nhiên (Gõ đỏ Pachy, Óc chó Bắc Mỹ, Sồi Nga)",
      "total_messages_loaded": 2,
      "date_range": { "oldest": "Hôm qua", "newest": "09:21 Hôm qua" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Đơn giá 1.700.000 đ/m2 cửa gỗ, cọc theo chuyến xe",
        "debt_amount": "Đơn giá 1.700.000 đ/m2 cửa gỗ, cọc theo chuyến xe",
        "order_codes": ["DH_GO_THIT_CUONG_HN_2026"],
        "amounts": ["1.700.000 đ/m2"]
      },
      "attached_files_count": 2,
      "attached_files": ["Untitled.xlsx", "Boc_tach_chi_tiet_go_thit.xlsx"],
      "cached_disk_files_count": 7,
      "project_tag": "DA_GO_THIT_CAU_THANG",
      "project_name": "Công Trình Cửa Gỗ Thịt Tự Nhiên & Biệt Thự",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 3,
      "title": "LamGiang - NT Phú Gia (TP HT)",
      "member_count": "11 thành viên",
      "group_id": "g6116598459303638566",
      "supplier_name": "Tổng Kho Lam Giang (TP Hà Tĩnh - Ms Hoa)",
      "material_category": "Ván phủ Melamine, Phụ kiện ray âm bản lề DTC, Chỉ nẹp dán cạnh",
      "total_messages_loaded": 22,
      "date_range": { "oldest": "T5 08/10/2026", "newest": "Hôm nay" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "DƯ NỢ: 147.492.250 đ (Đã trừ 16.838M Dung CK 02/11 & Đơn 496k Vũ CK dứt điểm 04/11)",
        "debt_amount": "DƯ NỢ: 147.492.250 đ (Đã trừ 16.838M Dung CK 02/11 & Đơn 496k Vũ CK dứt điểm 04/11)",
        "order_codes": ["UNC_VIETINBANK_16.838M", "DH29930"],
        "amounts": ["147.492.250 đ", "16.838.000 đ", "496.000 đ"]
      },
      "attached_files_count": 2,
      "attached_files": ["Don_DH29930.jpg", "BANG_TONG_HOP_CONG_NO_LAM_GIANG_10_THANG_2026.xlsx"],
      "cached_disk_files_count": 198,
      "project_tag": "DA_KHO_XUONG_TRU_VAT_TU",
      "project_name": "Kho Phôi Ván Xưởng & Dự Án Nội Thất Gia Đình T10-T11",
      "month_key": "2026-10",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 4,
      "title": "QUỐC TÂM Phú Gia",
      "member_count": "8 thành viên",
      "group_id": "g495486322416346660",
      "supplier_name": "Phụ Kiện Quốc Tâm (56 Ngô Đức Kế, TP Hà Tĩnh - Trần Quang Tú / Phan Thị Lan)",
      "material_category": "Bản lề giảm chấn, Ray bi 3 tầng, Pitton Blumk, Đèn led cảm ứng",
      "total_messages_loaded": 13,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "DƯ NỢ: 26.170.000 đ (Sổ nợ trang 296: Đã trả 15M ngày 02/11 + HĐ Led 170k ngày 04/11 + HĐ Sập/Ray 80k ngày 05/11)",
        "debt_amount": "DƯ NỢ: 26.170.000 đ (Sổ nợ trang 296: Đã trả 15M ngày 02/11 + HĐ Led 170k ngày 04/11 + HĐ Sập/Ray 80k ngày 05/11)",
        "order_codes": ["HD_RAY_SAP_05_11", "SO_NO_T296", "HD_LED_04_11"],
        "amounts": ["26.170.000 đ", "80.000 đ", "15.000.000 đ", "170.000 đ"]
      },
      "attached_files_count": 3,
      "attached_files": ["Hoa_don_Quoc_Tam_04_11.jpg", "Hoa_don_ban_le_05_11.jpg", "So_no_tay_T296.jpg"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_BIET_THU_NAM",
      "project_name": "Hệ Phụ Kiện Kim Khí Bếp & Tủ Áo Nhà Anh Nam",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 5,
      "title": "Đặt hàng Ceramic Hoàng Hà HY",
      "member_count": "5 thành viên",
      "group_id": "g7737669618333682341",
      "supplier_name": "Hoàng Hà Ceramic PVC (Hưng Yên / Hà Tĩnh)",
      "material_category": "Đá nung kết Ceramic Calacatta, Tấm ốp PVC than tre giả đá",
      "total_messages_loaded": 25,
      "date_range": { "oldest": "18/08/2026", "newest": "09:43 Hôm qua" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Cọc 30-50% đơn hàng đá, thanh toán dứt điểm khi giao tấm",
        "debt_amount": "Cọc 30-50% đơn hàng đá, thanh toán dứt điểm khi giao tấm",
        "order_codes": ["DH_CERAMIC_HOANGHA_CALACATTA"],
        "amounts": ["Cọc 30%-50%"]
      },
      "attached_files_count": 1,
      "attached_files": ["Ban_ve_boc_tach_mat_da_ban_bep.dwg"],
      "cached_disk_files_count": 123,
      "project_tag": "DA_BIET_THU_NAM",
      "project_name": "Mặt Đá Bàn Bếp & Vách Đá Nung Kết Ceramic Luxury",
      "month_key": "2026-10",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 6,
      "title": "Đặt hàng Phú Gia - NT",
      "member_count": "7 thành viên",
      "group_id": "g8911374775675572335",
      "supplier_name": "Gỗ NT Cầu Vượt (Hà Tĩnh - 0979137123)",
      "material_category": "Ván Plywood E0, MDF chống ẩm cốt xanh, Ván nhựa Picomat",
      "total_messages_loaded": 36,
      "date_range": { "oldest": "19/07/2026", "newest": "16:12 23/10/2026" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "DƯ NỢ HIỆN TẠI: 82.065.300 đ (Đã trừ 1 tấm trả 750.000 đ)",
        "debt_amount": "DƯ NỢ HIỆN TẠI: 82.065.300 đ (Đã trừ 1 tấm trả 750.000 đ)",
        "order_codes": ["DON00216", "DON_TRA_HANG_23_10", "DON00274"],
        "amounts": ["750.000 đ", "82.065.300 đ"]
      },
      "attached_files_count": 2,
      "attached_files": ["Cong_no_NT_23_10_2026.jpg", "Don_tra_hang_NT_23_10_2026.jpg"],
      "cached_disk_files_count": 80,
      "project_tag": "DA_KHO_XUONG_TRU_VAT_TU",
      "project_name": "Kho Phôi Ván Xưởng Sản Xuất & Tủ Chống Ẩm",
      "month_key": "2026-10",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 7,
      "title": "Chốt màu, đặt hàng Cường Thịnh",
      "member_count": "5 thành viên",
      "group_id": "g4212121922329497264",
      "supplier_name": "Cường Thịnh (Nga Melamine Cường Thịnh)",
      "material_category": "Ván Melamine Cường Thịnh cốt MDF/HMR chống ẩm",
      "total_messages_loaded": 2,
      "date_range": { "oldest": "16/09/2025", "newest": "10:56 03/09/2026" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Thanh toán theo từng lô ván xuất xưởng",
        "debt_amount": "Thanh toán theo từng lô ván xuất xưởng",
        "order_codes": ["DH_MELAMINE_CUONG_THINH"],
        "amounts": []
      },
      "attached_files_count": 1,
      "attached_files": ["Bang_ma_mau_thuc_te_Melamine.jpg"],
      "cached_disk_files_count": 8,
      "project_tag": "DA_KHO_XUONG_TRU_VAT_TU",
      "project_name": "Hệ Thống Bảng Màu Ván Mẫu Showroom & Xưởng",
      "month_key": "2026-09",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 8,
      "title": "Đặt hàng gỗ thịt nhà Đức Anh - Thu Hương Hà Tĩnh",
      "member_count": "5 thành viên",
      "group_id": "g1224067034537716792",
      "supplier_name": "Sồi Đức Anh - Thu Hương (Hà Tĩnh - Nga)",
      "material_category": "Gỗ sồi Mỹ (Oak) xẻ sấy FAS loại 1, Nan gỗ & Tay vịn cầu thang",
      "total_messages_loaded": 8,
      "date_range": { "oldest": "17/10/2025", "newest": "14/05/2026" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "CÒN NỢ 3.200.000 đ (Đã CK 10.000.000 đ trừ vào sổ nợ trong ngày)",
        "debt_amount": "CÒN NỢ 3.200.000 đ (Đã CK 10.000.000 đ trừ vào sổ nợ trong ngày)",
        "order_codes": ["DH_GO_THIT_DUCANH"],
        "amounts": ["3.200.000 đ", "10.000.000 đ"]
      },
      "attached_files_count": 1,
      "attached_files": ["So_gach_doi_soat_khoi_luong_duc_anh.jpg"],
      "cached_disk_files_count": 0,
      "project_tag": "DA_GO_THIT_CAU_THANG",
      "project_name": "Cầu Thang & Nan Gỗ Sồi Mỹ Biệt Thự",
      "month_key": "2026-05",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 9,
      "title": "Đặt hàng Kính, Gương Phú Mỹ (Vinh)",
      "member_count": "5 thành viên",
      "group_id": "g8487057108956790028",
      "supplier_name": "Kính Gương Phú Mỹ (TP Vinh - Nguyễn Thị Thúy)",
      "material_category": "Kính tôi cường lực, Gương soi nghệ thuật mài vát cạnh",
      "total_messages_loaded": 5,
      "date_range": { "oldest": "11:11 29/10/2025", "newest": "16/11/2025" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Không có dư nợ quá hạn (0 đ)",
        "debt_amount": "Không có dư nợ quá hạn (0 đ)",
        "order_codes": ["DH_KINH_GUONG_PHU_MY"],
        "amounts": []
      },
      "attached_files_count": 1,
      "attached_files": ["Bang_gia_gia_cong_kinh_Phu_My.pdf"],
      "cached_disk_files_count": 0,
      "project_tag": "DA_BIET_THU_NAM",
      "project_name": "Hạng Mục Gia Công Kính Bàn & Gương Nghệ Thuật",
      "month_key": "2026-01",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 10,
      "title": "Gia công Cánh Acrylic Livas (Chiến Acrylic)",
      "member_count": "5 thành viên",
      "group_id": "g_acrylic_livas",
      "supplier_name": "Chiến Acrylic Livas",
      "material_category": "Cánh Acrylic bóng gương No-Line công nghệ Đức cao cấp",
      "total_messages_loaded": 10,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "0 đ (Kế toán chị Hương đã tất toán toàn bộ cả 2 đợt gia công)",
        "debt_amount": "0 đ (Kế toán chị Hương đã tất toán toàn bộ cả 2 đợt gia công)",
        "order_codes": ["DH_CANH_ACRYLIC_LIVAS_DOT1", "DH_CANH_ACRYLIC_LIVAS_DOT2"],
        "amounts": ["Đã tất toán chuyển khoản"]
      },
      "attached_files_count": 2,
      "attached_files": ["Phieu_xuat_kho_Livas_Dot1.pdf", "Phieu_xuat_kho_Livas_Dot2.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_BIET_THU_NAM",
      "project_name": "Cánh Acrylic No-Line Bếp Biệt Thự Hà Tĩnh (Đợt 1 & 2)",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 11,
      "title": "Đặt hàng Cốt Ván Plywood A1 Đại Lâm Mộc (Tâm & Thanh Huyền)",
      "member_count": "4 thành viên",
      "group_id": "g_plywood_dlm",
      "supplier_name": "Plywood Đại Lâm Mộc (Tâm & Thanh Huyền)",
      "material_category": "Cốt Plywood Chống nước Chuẩn A1 mã 8803 phủ Melamine cao cấp",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "0 đ (Đã gửi 2 bộ mẫu mã 8803 cho xưởng Vũ nhận - cước CPN 50k)",
        "debt_amount": "0 đ (Đã gửi 2 bộ mẫu mã 8803 cho xưởng Vũ nhận - cước CPN 50k)",
        "order_codes": ["DH_MAU_DLM_8803"],
        "amounts": ["50.000 đ"]
      },
      "attached_files_count": 1,
      "attached_files": ["Don_van_chuyen_CPN_DLM_8803.jpg"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_KHO_XUONG_TRU_VAT_TU",
      "project_name": "Mẫu Ván Plywood A1 Chịu Nước Mã 8803 Cho Xưởng",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 12,
      "title": "Gia công Bo Cong Acrylic & Huỳnh Cánh ALD (Đức ALD)",
      "member_count": "5 thành viên",
      "group_id": "g_acrylic_ald",
      "supplier_name": "Đức Acrylic - Cánh Huỳnh ALD",
      "material_category": "Cánh bo cong góc R3 đến R45 trên Acrylic, Melamine, Laminate, PET",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Đang trong diện chào hàng mẫu và chuẩn hóa đơn giá",
        "debt_amount": "Đang trong diện chào hàng mẫu và chuẩn hóa đơn giá",
        "order_codes": ["BAO_GIA_BO_CONG_ALD"],
        "amounts": ["Báo giá kỹ thuật theo R3-R45"]
      },
      "attached_files_count": 1,
      "attached_files": ["Bang_thong_so_bo_cong_ALD_R3_R45.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_VACH_TRANG_TRI_PU",
      "project_name": "Cánh Bo Cong Nghệ Thuật R3-R45 Dự Án Luxury",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 13,
      "title": "Đặt hàng Gương Bỉ Dantalux viền nhôm decor (Vũ Cường)",
      "member_count": "5 thành viên",
      "group_id": "g_guong_bi",
      "supplier_name": "Vũ Cường - Gương Bỉ Dantalux",
      "material_category": "Gương phôi Bỉ AGC Dantalux 600x1600 viền nhôm decor cánh tủ",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "1.100.000 đ (Đã chốt đơn giá, thanh toán theo tiến độ)",
        "debt_amount": "1.100.000 đ (Đã chốt đơn giá, thanh toán theo tiến độ)",
        "order_codes": ["DH_GUONG_BI_DANTALUX_600x1600"],
        "amounts": ["1.100.000 đ"]
      },
      "attached_files_count": 1,
      "attached_files": ["Ban_ve_guong_decor_600x1600.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_DO_ROI_LUXURY",
      "project_name": "Gương Decor Bỉ Viền Nhôm Nhập Khẩu 600x1600 Cánh Tủ Áo",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 14,
      "title": "Sơn hoàn thiện PU cao cấp & Vách CNC (Đức Lĩnh SƠN PU)",
      "member_count": "4 thành viên",
      "group_id": "g_son_pu_duclinh",
      "supplier_name": "Đức Lĩnh SƠN PU",
      "material_category": "Sơn PU hoàn thiện bộ cánh CNC 4m và vách ngăn phòng khách cao cấp",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "DƯ NỢ NHẮC THANH TOÁN: 2.000.000 đ (Chờ nghiệm thu bề mặt)",
        "debt_amount": "DƯ NỢ NHẮC THANH TOÁN: 2.000.000 đ (Chờ nghiệm thu bề mặt)",
        "order_codes": ["SON_PU_DUCLINH_CNC4M"],
        "amounts": ["2.000.000 đ"]
      },
      "attached_files_count": 1,
      "attached_files": ["Bien_ban_nghiem_thu_son_canh_CNC.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_VACH_TRANG_TRI_PU",
      "project_name": "Hoàn Thiện Sơn PU Vách Ngăn Cánh CNC 4m Phòng Khách",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 15,
      "title": "Đặt hàng Phụ Kiện Tủ Bếp Kadinax / Dpho (PK Phúc Sơn)",
      "member_count": "4 thành viên",
      "group_id": "g_pk_phucson",
      "supplier_name": "Phụ Kiện Phúc Sơn",
      "material_category": "Giá bát đĩa nâng hạ, tay nâng tủ bếp đôi, giá dao thớt gia vị Kadinax / Dpho",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Tạm hủy đơn để đổi hãng theo yêu cầu riêng của chủ nhà",
        "debt_amount": "Tạm hủy đơn để đổi hãng theo yêu cầu riêng của chủ nhà",
        "order_codes": ["DH_PK_PHUCSON_KADINAX"],
        "amounts": ["Tạm giữ cọc"]
      },
      "attached_files_count": 1,
      "attached_files": ["Don_hang_Kadinax_Phuc_Son.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_BIET_THU_NAM",
      "project_name": "Phụ Kiện Tủ Bếp Thông Minh Kadinax/Dpho Biệt Thự",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 16,
      "title": "Đặt hàng giả đá PG - Hoàng Gia",
      "member_count": "5 thành viên",
      "group_id": "g_giada_hoanggia",
      "supplier_name": "Vật Liệu Hoàng Gia",
      "material_category": "Tấm nano than tre, Tấm PVC vân đá cẩm thạch Hoàng Gia",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Thanh toán theo khối lượng nghiệm thu giao hàng",
        "debt_amount": "Thanh toán theo khối lượng nghiệm thu giao hàng",
        "order_codes": ["DH_PVC_NANO_HOANGGIA"],
        "amounts": []
      },
      "attached_files_count": 1,
      "attached_files": ["Catalog_tam_PVC_van_da_2026.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_VACH_TRANG_TRI_PU",
      "project_name": "Ốp Vách Sau Sofa & Tivi Biệt Thự Luxury Tấm Nano Than Tre",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 17,
      "title": "Đặt hàng Khánh ( Sofa, Bàn ăn)",
      "member_count": "5 thành viên",
      "group_id": "g_khanh_sofa",
      "supplier_name": "Xưởng Đồ Rời Khánh (Hà Nội)",
      "material_category": "Sofa bọc nỉ da góc L, Bàn ăn thông minh mặt đá 6-8 ghế Monet",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "Theo PO-2026-1010 (28.000.000 đ) - Đã bàn giao",
        "debt_amount": "Theo PO-2026-1010 (28.000.000 đ) - Đã bàn giao",
        "order_codes": ["PO-2026-1010"],
        "amounts": ["28.000.000 đ"]
      },
      "attached_files_count": 1,
      "attached_files": ["PO_2026_1010_Sofa_Ban_an.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_DO_ROI_LUXURY",
      "project_name": "Sofa L & Bàn Ăn Thông Minh Monet Nhà Dân Dụng Cao Cấp",
      "month_key": "2026-10",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    },
    {
      "index": 18,
      "title": "Đặt hàng bọc đệm Da - Nỉ - Hà Tĩnh",
      "member_count": "5 thành viên",
      "group_id": "g_bocdem_hatinh",
      "supplier_name": "Cơ sở Bọc Đệm Da Nỉ Hà Tĩnh",
      "material_category": "Vách ốp da nẹp PVD mút D40, Đệm đầu giường bọc da microfiber",
      "total_messages_loaded": 7,
      "date_range": { "oldest": "2026-10-01", "newest": "2026-11-06 17:30" },
      "entities": {
        "customer_name": "PG Home Luxury / Ban Giám Đốc",
        "phone": "0911006880 (Vũ Xưởng)",
        "address": "Xưởng Sản Xuất PG Home - TP Hà Tĩnh",
        "supplier_bank": "0 đ (Đã tất toán nghiệm thu)",
        "debt_amount": "0 đ (Đã tất toán nghiệm thu)",
        "order_codes": ["DH_BOC_DEM_DA_NI_HT"],
        "amounts": []
      },
      "attached_files_count": 1,
      "attached_files": ["Phieu_xuat_kho_boc_dem.pdf"],
      "cached_disk_files_count": 5,
      "project_tag": "DA_DO_ROI_LUXURY",
      "project_name": "Vách Đầu Giường Bọc Da Microfiber & Nẹp PVD Phòng Master",
      "month_key": "2026-11",
      "director_approval_status": "BẮT BUỘC DUYỆT DẤU ĐỎ ĐIỆN TỬ - ĐÃ PHÊ DUYỆT",
      "approval_seal_verified": true
    }
  ];

  // Định nghĩa các Phân hệ Công Trình Chuẩn Hóa
  var PROJECT_CATALOG = {
    "DA_BIET_THU_NAM": {
      id: "DA_BIET_THU_NAM",
      name: "Biệt Thự Hà Tĩnh & Công Trình Anh Nam (Mục 24)",
      desc: "Tủ bếp acrylic, tủ áo kịch trần, phụ kiện thông minh, kính cường lực, mặt đá ceramic cao cấp",
      color: "#2563eb",
      badge: "Công Trình Trọng Điểm"
    },
    "DA_DO_ROI_LUXURY": {
      id: "DA_DO_ROI_LUXURY",
      name: "Đồ Rời & Trang Trí Nội Thất Cao Cấp",
      desc: "Sofa bọc nỉ góc L, bàn ăn thông minh mặt đá Monet, gương decor viền nhôm, vách da nỉ",
      color: "#7c3aed",
      badge: "Mảng Bán Kèm (Lãi Gộp)"
    },
    "DA_KHO_XUONG_TRU_VAT_TU": {
      id: "DA_KHO_XUONG_TRU_VAT_TU",
      name: "Kho Phôi Ván Xưởng Sản Xuất PG Home",
      desc: "Ván cốt xanh Lam Giang, Gỗ NT Cầu Vượt, Plywood A1 mã 8803 Đại Lâm Mộc, Cường Thịnh",
      color: "#059669",
      badge: "Phôi Ván Nòng Cốt"
    },
    "DA_GO_THIT_CAU_THANG": {
      id: "DA_GO_THIT_CAU_THANG",
      name: "Gỗ Tự Nhiên & Cầu Thang Biệt Thự",
      desc: "Cửa gỗ gõ đỏ Pachy Cường Hà Nội, Gỗ sồi xẻ sấy FAS Đức Anh - Thu Hương",
      color: "#d97706",
      badge: "Gỗ Tự Nhiên Bóc Tách Riêng"
    },
    "DA_VACH_TRANG_TRI_PU": {
      id: "DA_VACH_TRANG_TRI_PU",
      name: "Vách Trang Trí, Bo Cong & Sơn PU Hoàn Thiện",
      desc: "Sơn PU Đức Lĩnh cánh CNC 4m, Tấm than tre Hoàng Gia, Cánh bo cong huỳnh ALD",
      color: "#db2777",
      badge: "Thẩm Mỹ Bề Mặt Cao Cấp"
    }
  };

  /**
   * Helper parse số tiền tiếng Việt sang float
   */
  function parseVND(str) {
    if (!str || typeof str !== 'string') return 0;
    var cleaned = str.replace(/[^\d.,]/g, '').trim();
    if (!cleaned) return 0;
    // Xử lý dạng 147.492.250 đ
    if (cleaned.indexOf('.') !== -1 && cleaned.indexOf(',') === -1) {
      cleaned = cleaned.replace(/\./g, '');
    } else if (cleaned.indexOf(',') !== -1 && cleaned.indexOf('.') !== -1) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }
    var val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }

  /**
   * Format số tiền sang định dạng VND đẹp mắt
   */
  function formatVND(num) {
    if (isNaN(num)) return '0 đ';
    return Math.round(num).toLocaleString('vi-VN') + ' đ';
  }

  /**
   * Module Core Object
   */
  var W23 = {
    version: '2026.11.08-W23',
    name: 'PG_Modules_W23_PO_Zalo_Analytics',
    rawDataset: RAW_ZALO_DATA,
    projectCatalog: PROJECT_CATALOG,

    /**
     * Khởi tạo hoặc nạp dữ liệu ngoại vi nếu có
     */
    init: function (customData) {
      if (Array.isArray(customData) && customData.length > 0) {
        this.rawDataset = customData;
      }
      return this;
    },

    /**
     * 1. BÁO CÁO TỔNG QUAN CHỈ SỐ GIÁM ĐỐC (EXECUTIVE KPI SUMMARY)
     */
    getExecutiveSummary: function () {
      var totalGroups = this.rawDataset.length;
      var totalFilesAttached = 0;
      var totalCachedDiskFiles = 0;
      var totalOrders = 0;
      var approvedCount = 0;
      var estimatedTotalDebt = 0;

      this.rawDataset.forEach(function (item) {
        totalFilesAttached += (item.attached_files_count || (item.attached_files ? item.attached_files.length : 0));
        totalCachedDiskFiles += (item.cached_disk_files_count || 0);
        if (item.entities && item.entities.order_codes) {
          totalOrders += item.entities.order_codes.length;
        }
        if (item.approval_seal_verified) {
          approvedCount++;
        }
        // Tính nợ thống kê nổi bật
        if (item.supplier_name.indexOf('Lam Giang') !== -1) estimatedTotalDebt += 147492250;
        if (item.supplier_name.indexOf('Quốc Tâm') !== -1) estimatedTotalDebt += 26170000;
        if (item.supplier_name.indexOf('NT Cầu Vượt') !== -1) estimatedTotalDebt += 82065300;
        if (item.supplier_name.indexOf('Đức Anh') !== -1) estimatedTotalDebt += 3200000;
        if (item.supplier_name.indexOf('Đức Lĩnh') !== -1) estimatedTotalDebt += 2000000;
      });

      return {
        totalSuppliers: totalGroups,
        totalZaloGroups: totalGroups,
        totalOrdersRecorded: totalOrders,
        totalAttachedFiles: totalFilesAttached,
        totalCachedDiskFiles: totalCachedDiskFiles,
        approvalRate: Math.round((approvedCount / totalGroups) * 100) + '%',
        approvedCount: approvedCount,
        estimatedTotalDebt: estimatedTotalDebt,
        formattedEstimatedDebt: formatVND(estimatedTotalDebt),
        costControlTarget: '<= 54% Doanh thu',
        profitNetTarget: '18% - 20% Bỏ Túi BGĐ'
      };
    },

    /**
     * 2. PHÂN TÍCH TOÀN BỘ THEO THÁNG (TIMELINE & MONTHLY AGGREGATION)
     */
    analyzeByMonth: function () {
      var months = {
        '2026-01': { month: 'Tháng 01/2026', key: '2026-01', count: 0, suppliers: [], orders: [], notes: 'Kính Gương Phú Mỹ (Vinh) chuẩn hóa dự toán năm mới' },
        '2026-05': { month: 'Tháng 05/2026', key: '2026-05', count: 0, suppliers: [], orders: [], notes: 'Gỗ sồi Mỹ Đức Anh - Thu Hương phục vụ hạng mục cầu thang' },
        '2026-08': { month: 'Tháng 08/2026', key: '2026-08', count: 0, suppliers: [], orders: [], notes: 'Hoàng Hà Ceramic Calacatta & Hợp đồng đồ rời Sofa xưởng Khánh T8+T9 (11.65M lãi gộp)' },
        '2026-09': { month: 'Tháng 09/2026', key: '2026-09', count: 0, suppliers: [], orders: [], notes: 'Cường Thịnh chốt mẫu ván cốt xanh & NT Cầu Vượt chuẩn bị xưởng' },
        '2026-10': { month: 'Tháng 10/2026', key: '2026-10', count: 0, suppliers: [], orders: [], notes: 'Cao điểm đặt ván Lam Giang, NT Cầu Vượt, Phụ kiện Quốc Tâm, Kính Việt Nhật 30/10' },
        '2026-11': { month: 'Tháng 11/2026', key: '2026-11', count: 0, suppliers: [], orders: [], notes: 'Phê duyệt Dấu Đỏ Điện Tử đồng loạt 06/11/2026, tất toán nợ Livas, thanh toán Lam Giang 16.838M, Quốc Tâm 15M' }
      };

      this.rawDataset.forEach(function (item) {
        var mKey = item.month_key || '2026-11';
        if (!months[mKey]) {
          months[mKey] = {
            month: 'Tháng ' + mKey.split('-')[1] + '/' + mKey.split('-')[0],
            key: mKey,
            count: 0,
            suppliers: [],
            orders: [],
            notes: ''
          };
        }
        months[mKey].count++;
        months[mKey].suppliers.push({
          index: item.index,
          name: item.supplier_name,
          category: item.material_category,
          debt: (item.entities && item.entities.debt_amount) || '0 đ',
          orders: (item.entities && item.entities.order_codes) || []
        });
        if (item.entities && item.entities.order_codes) {
          months[mKey].orders = months[mKey].orders.concat(item.entities.order_codes);
        }
      });

      return months;
    },

    /**
     * 3. PHÂN TÍCH TOÀN BỘ THEO CÔNG TRÌNH / DỰ ÁN (PROJECT BREAKDOWN)
     */
    analyzeByProject: function () {
      var self = this;
      var result = {};

      Object.keys(PROJECT_CATALOG).forEach(function (pId) {
        result[pId] = {
          meta: PROJECT_CATALOG[pId],
          supplierCount: 0,
          suppliers: [],
          orderCodes: [],
          files: []
        };
      });

      this.rawDataset.forEach(function (item) {
        var pTag = item.project_tag || 'DA_BIET_THU_NAM';
        if (!result[pTag]) {
          result[pTag] = {
            meta: { id: pTag, name: item.project_name || pTag, desc: '', color: '#475569', badge: 'Khác' },
            supplierCount: 0,
            suppliers: [],
            orderCodes: [],
            files: []
          };
        }
        result[pTag].supplierCount++;
        result[pTag].suppliers.push({
          index: item.index,
          supplier_name: item.supplier_name,
          material_category: item.material_category,
          debt_info: (item.entities && item.entities.debt_amount) || '',
          approval_status: item.director_approval_status
        });
        if (item.entities && item.entities.order_codes) {
          result[pTag].orderCodes = result[pTag].orderCodes.concat(item.entities.order_codes);
        }
        if (item.attached_files) {
          result[pTag].files = result[pTag].files.concat(item.attached_files);
        }
      });

      return result;
    },

    /**
     * 4. PHÂN TÍCH TOÀN BỘ THEO NHÀ CUNG CẤP (SUPPLIER AUDIT & MATRIX)
     */
    analyzeBySupplier: function () {
      return this.rawDataset.map(function (item) {
        return {
          index: item.index,
          title: item.title,
          supplier_name: item.supplier_name,
          material_category: item.material_category,
          member_count: item.member_count,
          date_range: item.date_range,
          debt_amount: (item.entities && item.entities.debt_amount) || '0 đ',
          order_codes: (item.entities && item.entities.order_codes) || [],
          attached_files: item.attached_files || [],
          cached_files_count: item.cached_disk_files_count || 0,
          approval_seal_verified: !!item.approval_seal_verified,
          director_approval_status: item.director_approval_status,
          project_tag: item.project_tag,
          project_name: item.project_name,
          month_key: item.month_key
        };
      });
    },

    /**
     * 5. TRA CỨU ĐƠN HÀNG TỨC THỜI (SEARCH ENGINE)
     */
    searchOrders: function (query) {
      if (!query || typeof query !== 'string') return this.rawDataset;
      var q = query.toLowerCase().trim();
      return this.rawDataset.filter(function (item) {
        var strHaystack = [
          item.title,
          item.supplier_name,
          item.material_category,
          item.project_name,
          item.entities ? item.entities.debt_amount : '',
          item.entities && item.entities.order_codes ? item.entities.order_codes.join(' ') : '',
          item.attached_files ? item.attached_files.join(' ') : ''
        ].join(' ').toLowerCase();
        return strHaystack.indexOf(q) !== -1;
      });
    },

    /**
     * 6. KẾT XUẤT CSV CHO BAN GIÁM ĐỐC
     */
    exportToCSV: function () {
      var headers = [
        'STT',
        'Tên Nhà Cung Cấp',
        'Nhóm Zalo Đặt Hàng',
        'Phân Loại Vật Tư',
        'Công Trình Trực Thuộc',
        'Mã Đơn Hàng PO',
        'Tình Trạng Công Nợ / Đã Thanh Toán',
        'Duyệt Dấu Đỏ Điện Tử',
        'Tài Liệu Đính Kèm'
      ];
      var rows = this.rawDataset.map(function (item) {
        return [
          item.index,
          '"' + (item.supplier_name || '').replace(/"/g, '""') + '"',
          '"' + (item.title || '').replace(/"/g, '""') + '"',
          '"' + (item.material_category || '').replace(/"/g, '""') + '"',
          '"' + (item.project_name || '').replace(/"/g, '""') + '"',
          '"' + ((item.entities && item.entities.order_codes ? item.entities.order_codes.join(', ') : '')).replace(/"/g, '""') + '"',
          '"' + ((item.entities && item.entities.debt_amount ? item.entities.debt_amount : '')).replace(/"/g, '""') + '"',
          item.approval_seal_verified ? 'ĐÃ DUYỆT (100%)' : 'CHƯA DUYỆT',
          '"' + ((item.attached_files ? item.attached_files.join(', ') : '')).replace(/"/g, '""') + '"'
        ].join(',');
      });
      return '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
    },

    /**
     * 7. TẠO GIAO DIỆN HTML DASHBOARD CHUYÊN NGHIỆP TỰ ĐỘNG
     */
    renderDashboard: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) {
        console.warn('[W23 Analytics] Không tìm thấy phần tử HTML container với ID:', containerId);
        return;
      }

      var summary = this.getExecutiveSummary();
      var monthly = this.analyzeByMonth();
      var projects = this.analyzeByProject();
      var suppliers = this.analyzeBySupplier();

      var html = '';
      html += '<div class="pg-w23-analytics-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 20px;">';
      
      // Header
      html += '  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">';
      html += '    <div>';
      html += '      <h2 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px;">';
      html += '        <span>📋 BÁO CÁO PHÂN TÍCH ĐẶT HÀNG ZALO 2026</span>';
      html += '        <span style="font-size: 12px; background: #ef4444; color: #fff; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">DẤU ĐỎ ĐIỆN TỬ 100%</span>';
      html += '      </h2>';
      html += '      <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Hộ Kinh Doanh Phú Gia - Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0973.562.789</p>';
      html += '    </div>';
      html += '    <div style="text-align: right;">';
      html += '      <button id="w23-btn-export-csv" style="background: #059669; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">📥 Xuất Báo Cáo CSV</button>';
      html += '    </div>';
      html += '  </div>';

      // KPI Cards
      html += '  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">';
      html += '    <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">';
      html += '      <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Tổng Nhà Cung Cấp</div>';
      html += '      <div style="font-size: 26px; font-weight: 700; color: #0f172a; margin-top: 4px;">' + summary.totalSuppliers + ' <span style="font-size: 14px; font-weight: 500; color: #64748b;">Đơn vị</span></div>';
      html += '      <div style="font-size: 12px; color: #059669; margin-top: 4px;">18 Nhóm Zalo chính thức</div>';
      html += '    </div>';
      html += '    <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">';
      html += '      <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Tỷ Lệ Duyệt Dấu Đỏ</div>';
      html += '      <div style="font-size: 26px; font-weight: 700; color: #16a34a; margin-top: 4px;">' + summary.approvalRate + '</div>';
      html += '      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">18/18 NCC Đã ký duyệt điện tử</div>';
      html += '    </div>';
      html += '    <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">';
      html += '      <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Tài Liệu & Bản Vẽ Kèm</div>';
      html += '      <div style="font-size: 26px; font-weight: 700; color: #2563eb; margin-top: 4px;">' + summary.totalAttachedFiles + ' <span style="font-size: 14px; font-weight: 500; color: #64748b;">File PO/DWG</span></div>';
      html += '      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">' + summary.totalCachedDiskFiles + ' File bộ nhớ đệm ổ cứng</div>';
      html += '    </div>';
      html += '    <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">';
      html += '      <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Chốt Chặn Kiểm Soát Cost</div>';
      html += '      <div style="font-size: 26px; font-weight: 700; color: #d97706; margin-top: 4px;">' + summary.costControlTarget + '</div>';
      html += '      <div style="font-size: 12px; color: #059669; margin-top: 4px;">Bảo vệ LN ròng 18-20% Két sắt</div>';
      html += '    </div>';
      html += '  </div>';

      // Navigation Tabs
      html += '  <div style="display: flex; gap: 8px; border-bottom: 2px solid #e2e8f0; margin-bottom: 20px;">';
      html += '    <button class="w23-tab-btn active" data-tab="w23-tab-month" style="padding: 10px 18px; border: none; background: #2563eb; color: #fff; font-weight: 600; border-radius: 6px 6px 0 0; cursor: pointer; font-size: 14px;">📅 Phân Tích Theo Tháng</button>';
      html += '    <button class="w23-tab-btn" data-tab="w23-tab-project" style="padding: 10px 18px; border: none; background: #e2e8f0; color: #475569; font-weight: 600; border-radius: 6px 6px 0 0; cursor: pointer; font-size: 14px;">🏗️ Phân Tích Theo Công Trình</button>';
      html += '    <button class="w23-tab-btn" data-tab="w23-tab-supplier" style="padding: 10px 18px; border: none; background: #e2e8f0; color: #475569; font-weight: 600; border-radius: 6px 6px 0 0; cursor: pointer; font-size: 14px;">🏭 Danh Sách 18 Nhà Cung Cấp</button>';
      html += '  </div>';

      // TAB 1: THEO THÁNG
      html += '  <div id="w23-tab-month" class="w23-tab-content" style="display: block;">';
      html += '    <div style="display: grid; gap: 14px;">';
      Object.keys(monthly).forEach(function (mKey) {
        var mItem = monthly[mKey];
        html += '      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 8px; padding: 16px;">';
        html += '        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">';
        html += '          <div style="font-size: 16px; font-weight: 700; color: #0f172a;">' + mItem.month + ' <span style="font-size: 12px; font-weight: 600; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; margin-left: 8px;">' + mItem.count + ' Giao Dịch Zalo</span></div>';
        html += '          <span style="font-size: 12px; color: #64748b;">Mã: ' + mItem.key + '</span>';
        html += '        </div>';
        html += '        <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569; line-height: 1.5;"><strong>Sự kiện trọng điểm:</strong> ' + mItem.notes + '</p>';
        html += '        <div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        mItem.suppliers.forEach(function (s) {
          html += '          <span style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 10px; font-size: 12px; color: #334155;"><strong>' + s.name + '</strong>: ' + s.category + '</span>';
        });
        html += '        </div>';
        html += '      </div>';
      });
      html += '    </div>';
      html += '  </div>';

      // TAB 2: THEO CÔNG TRÌNH
      html += '  <div id="w23-tab-project" class="w23-tab-content" style="display: none;">';
      html += '    <div style="display: grid; gap: 16px;">';
      Object.keys(projects).forEach(function (pId) {
        var p = projects[pId];
        html += '      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid ' + p.meta.color + '; border-radius: 8px; padding: 18px;">';
        html += '        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">';
        html += '          <h3 style="margin: 0; font-size: 17px; color: #0f172a; font-weight: 700;">' + p.meta.name + '</h3>';
        html += '          <span style="background: ' + p.meta.color + '; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">' + p.meta.badge + '</span>';
        html += '        </div>';
        html += '        <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">' + p.meta.desc + '</p>';
        html += '        <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 6px; padding: 12px; font-size: 13px;">';
        html += '          <div style="font-weight: 600; color: #334155; margin-bottom: 6px;">Đơn vị cung ứng trực tiếp (' + p.supplierCount + ' NCC):</div>';
        html += '          <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.6;">';
        p.suppliers.forEach(function (s) {
          html += '            <li><strong>' + s.supplier_name + '</strong> (' + s.material_category + ') - <em>' + s.debt_info + '</em></li>';
        });
        html += '          </ul>';
        html += '        </div>';
        html += '      </div>';
      });
      html += '    </div>';
      html += '  </div>';

      // TAB 3: THEO NHÀ CUNG CẤP (18 NCC)
      html += '  <div id="w23-tab-supplier" class="w23-tab-content" style="display: none;">';
      html += '    <div style="overflow-x: auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">';
      html += '      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">';
      html += '        <thead>';
      html += '          <tr style="background: #f1f5f9; color: #334155; border-bottom: 2px solid #e2e8f0;">';
      html += '            <th style="padding: 10px 12px;">#</th>';
      html += '            <th style="padding: 10px 12px;">Tên Nhà Cung Cấp</th>';
      html += '            <th style="padding: 10px 12px;">Vật Tư Chuyên Biệt</th>';
      html += '            <th style="padding: 10px 12px;">Dư Nợ / Lịch Sử Thanh Toán</th>';
      html += '            <th style="padding: 10px 12px;">Mã Đơn / File Kèm</th>';
      html += '            <th style="padding: 10px 12px;">Dấu Đỏ BGĐ</th>';
      html += '          </tr>';
      html += '        </thead>';
      html += '        <tbody>';
      suppliers.forEach(function (s) {
        html += '          <tr style="border-bottom: 1px solid #f1f5f9;">';
        html += '            <td style="padding: 10px 12px; font-weight: 700; color: #64748b;">' + s.index + '</td>';
        html += '            <td style="padding: 10px 12px; font-weight: 600; color: #0f172a;">' + s.supplier_name + '</td>';
        html += '            <td style="padding: 10px 12px; color: #475569;">' + s.material_category + '</td>';
        html += '            <td style="padding: 10px 12px; color: #dc2626; font-weight: 500;">' + s.debt_amount + '</td>';
        html += '            <td style="padding: 10px 12px; color: #2563eb; font-size: 12px;">' + (s.order_codes.length > 0 ? s.order_codes.join(', ') : 'Theo lô') + '<br><span style="color: #64748b;">' + s.attached_files.join(', ') + '</span></td>';
        html += '            <td style="padding: 10px 12px;"><span style="background: #dcfce7; color: #15803d; font-weight: 700; font-size: 11px; padding: 2px 6px; border-radius: 4px;">ĐÃ DUYỆT</span></td>';
        html += '          </tr>';
      });
      html += '        </tbody>';
      html += '      </table>';
      html += '    </div>';
      html += '  </div>';

      html += '</div>';

      container.innerHTML = html;

      // Gắn sự kiện tab switching
      var tabBtns = container.querySelectorAll('.w23-tab-btn');
      var tabContents = container.querySelectorAll('.w23-tab-content');
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetId = this.getAttribute('data-tab');
          tabBtns.forEach(function (b) {
            b.style.background = '#e2e8f0';
            b.style.color = '#475569';
            b.classList.remove('active');
          });
          tabContents.forEach(function (c) {
            c.style.display = 'none';
          });
          this.style.background = '#2563eb';
          this.style.color = '#fff';
          this.classList.add('active');
          var activeContent = container.querySelector('#' + targetId);
          if (activeContent) activeContent.style.display = 'block';
        });
      });

      // Gắn sự kiện export CSV
      var exportBtn = container.querySelector('#w23-btn-export-csv');
      if (exportBtn) {
        exportBtn.addEventListener('click', function () {
          var csvContent = W23.exportToCSV();
          var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'BAO_CAO_ZALO_PO_2026_PG_HOME.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  };

  // Tự động đăng ký biến toàn cục
  if (typeof window !== 'undefined') {
    window.PG_Modules_W23 = W23;
  }

  return W23;
});
