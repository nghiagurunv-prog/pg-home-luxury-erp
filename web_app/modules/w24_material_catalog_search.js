/**
 * ==============================================================================
 * MODULE W24: THƯ VIỆN TRA CỨU NHANH ĐƠN GIÁ VẬT TƯ & MÃ VÁN / PHỤ KIỆN 2026
 * HỆ THỐNG QUẢN TRỊ NỘI THẤT & XÂY DỰNG PG HOME LUXURY - TP. HÀ TĨNH
 * ------------------------------------------------------------------------------
 * KHOẢNH ĐẤT ĐỘC LẬP: w24_material_catalog_search.js
 * Căn cứ dữ liệu gốc: TONG_HOP_VAT_TU_ZALO_2026.json & Sổ Tay Luật Sắt Mục 24
 * Đơn vị pháp lý: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0986.722.324
 * Ban Giám Đốc: Nguyễn Viết Nghĩa | Kỹ thuật xưởng: Vũ Kỹ Thuật (0911006880)
 * ==============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W24 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Chuẩn hóa chuỗi tiếng Việt tìm kiếm không dấu
  function removeVietnameseTones(str) {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    return str.trim();
  }

  // Định dạng số tiền VNĐ
  function formatVND(number) {
    if (isNaN(number) || number === null) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  }

  // DANH MỤC VẬT TƯ & ĐƠN GIÁ THỰC TẾ 2026 (Trích xuất từ TONG_HOP_VAT_TU_ZALO_2026.json)
  const MATERIAL_CATALOG_2026 = [
    // 1. Ván Gỗ Công Nghiệp & Melamine Cốt Chống Ẩm
    {
      code: 'VAN_HMR_DWS_17_201T',
      name: 'Ván MDF Chống Ẩm HMR DWS 17mm 2M 201T (Cốt Thái Lan)',
      category: 'Gỗ Công Nghiệp',
      spec: '1220 x 2440 x 17mm, Cốt xanh chống ẩm HMR, phủ Melamine 2 mặt mã 201T',
      unit: 'Tấm',
      unitPrice: 496000,
      supplier: 'Tổng Kho Lam Giang',
      supplierGroup: 'Lam Giang / NT Cầu Vượt / Cường Thịnh',
      note: 'Đã gồm phí vận chuyển về xưởng PG Home. Dùng cho thùng tủ bếp, tủ áo tiêu chuẩn kinh tế.',
      orderReference: 'DH29930 (04/11/2026)',
      approvalRequired: true,
      tier: 'Thái Lan (-12% đến -14% so với An Cường)'
    },
    {
      code: 'VAN_ANCUONG_MDF_17_MS',
      name: 'Ván MDF Lõi Xanh Chống Ẩm An Cường 17mm (Melamine Chuẩn)',
      category: 'Gỗ Công Nghiệp',
      spec: '1220 x 2440 x 17mm, Chuẩn E1/Green Label An Cường, phủ Melamine vân gỗ/đơn sắc',
      unit: 'Tấm',
      unitPrice: 876000,
      supplier: 'Nhà Phân Phối An Cường',
      supplierGroup: 'Tổng Kho Lam Giang / An Cường',
      note: 'Chuẩn 100% gốc báo giá. Chênh khoảng 380.000 đ/tấm so với phôi ván Thái Lan.',
      orderReference: 'BANG_TONG_HOP_CONG_NO_LAM_GIANG_10_THANG_2026',
      approvalRequired: true,
      tier: 'An Cường (Chuẩn 100%)'
    },
    {
      code: 'VAN_HAU_MDF_6MM_CA',
      name: 'Ván Hậu MDF Chống Ẩm 6mm Phủ Melamine Trắng/Vân Gỗ',
      category: 'Gỗ Công Nghiệp',
      spec: '1220 x 2440 x 6mm, Cốt xanh chống ẩm, phủ 1 mặt/2 mặt',
      unit: 'Tấm',
      unitPrice: 175000,
      supplier: 'Tổng Kho Lam Giang',
      supplierGroup: 'Lam Giang / NT Cầu Vượt',
      note: 'Dùng làm hậu tủ áo, hậu tủ bếp trên dưới, đáy ngăn kéo.',
      orderReference: 'DON00216',
      approvalRequired: true,
      tier: 'Lam Giang'
    },
    {
      code: 'NHUA_WPB_ANCUONG_17MM',
      name: 'Tấm Nhựa Đặc Chống Nước WPB An Cường 17mm',
      category: 'Tấm Nhựa Đặc',
      spec: '1220 x 2440 x 17mm, Khối lượng riêng nhẹ, chống nước 100%, không mối mọt',
      unit: 'Tấm',
      unitPrice: 2550000,
      supplier: 'Nhà Phân Phối An Cường',
      supplierGroup: 'An Cường',
      note: 'Cố định đơn giá, dùng khoang chậu rửa tủ bếp dưới & vách ẩm cao. CẤM GIẢM GIÁ theo tỷ lệ ván thường.',
      orderReference: 'Mục 24 - Bài học xương máu',
      approvalRequired: true,
      tier: 'An Cường Đặc Biệt'
    },

    // 2. Cốt Plywood Chuẩn A1 Chống Nước (Đại Lâm Mộc)
    {
      code: 'PLYWOOD_A1_8803_17MM',
      name: 'Cốt Plywood Chống Nước Chuẩn A1 Mã 8803 (Đại Lâm Mộc)',
      category: 'Plywood Cao Cấp',
      spec: '1220 x 2440 x 17mm, Cốt đanh ép keo WBP chống nước tuyệt đối, phủ vân 8803 sắc nét',
      unit: 'Tấm',
      unitPrice: 480000,
      supplier: 'Plywood Đại Lâm Mộc (Tâm & Thanh Huyền)',
      supplierGroup: 'Đại Lâm Mộc',
      note: 'Nhận mẫu 06/11/2026. Dùng cho công trình chịu ẩm cao, khu vực ban công, lavabo.',
      orderReference: 'DH_MAU_DLM_8803',
      approvalRequired: true,
      tier: 'Plywood A1 Mã 8803'
    },

    // 3. Cánh Acrylic Bóng Gương Noline & Bo Cong CNC
    {
      code: 'CANH_ACRYLIC_NOLINE_LIVAS',
      name: 'Gia Công Hoàn Thiện Cánh Acrylic Bóng Gương No-Line (Livas)',
      category: 'Cánh Tủ Cao Cấp',
      spec: 'Dán cạnh không đường line công nghệ Đức, cốt MDF chống ẩm / Plywood',
      unit: 'M²',
      unitPrice: 1250000,
      supplier: 'Chiến Acrylic Livas',
      supplierGroup: 'Livas',
      note: 'Đã hoàn thiện cánh đợt 1 & 2 cho công trình Biệt Thự TP Hà Tĩnh. Không line sắc nét.',
      orderReference: 'DH_CANH_ACRYLIC_LIVAS_DOT1 / DOT2',
      approvalRequired: true,
      tier: 'Cao Cấp Nhập Khẩu'
    },
    {
      code: 'GIA_CONG_BO_CONG_ALD_R3_R45',
      name: 'Gia Công Bo Cong Cánh Huỳnh & Cánh Tủ R3 - R45 (ALD)',
      category: 'Gia Công Bo Cong',
      spec: 'Gia công nhiệt uốn cong R3 đến R45 trên Acrylic/Melamine/Laminate/PET',
      unit: 'Md',
      unitPrice: 380000,
      supplier: 'Đức Acrylic - Cánh Huỳnh ALD',
      supplierGroup: 'ALD',
      note: 'Dùng cho vai/đuôi giường bo cong, kệ tivi bo tròn, góc tủ bếp hiện đại.',
      orderReference: 'BAO_GIA_BO_CONG_ALD (06/11/2026)',
      approvalRequired: true,
      tier: 'ALD Bo Cong CNC'
    },

    // 4. Kính Cường Lực & Gương Bỉ Dantalux Viền Nhôm
    {
      code: 'GUONG_BI_DANTALUX_600X1600',
      name: 'Gương Bỉ AGC Dantalux Tráng Bạc 8 Lớp Viền Nhôm Anode (600x1600)',
      category: 'Kính & Gương',
      spec: 'Kích thước 600 x 1600 mm, Gương Bỉ AGC tráng bạc 8 lớp, bo viền nhôm tinh xảo',
      unit: 'Bộ',
      unitPrice: 1100000,
      supplier: 'Vũ Cường - Gương Bỉ Dantalux',
      supplierGroup: 'Dantalux',
      note: 'Giám Đốc Nghĩa đã duyệt 06/11/2026. Lắp cánh tủ áo decor, bọc viền nhôm chống trầy xước.',
      orderReference: 'DH_GUONG_BI_DANTALUX_600x1600',
      approvalRequired: true,
      tier: 'Gương Bỉ Nhập Khẩu'
    },
    {
      code: 'KINH_CUONG_LUC_VSG_8MM',
      name: 'Kính Cường Lực Hải Long / VSG 8mm Gia Công Mài Cạnh',
      category: 'Kính & Gương',
      spec: 'Kính cường lực 8mm phôi Việt Nhật, gia công mài xiết bóng cạnh',
      unit: 'M²',
      unitPrice: 680000,
      supplier: 'Kính Việt Nhật VSG',
      supplierGroup: 'Việt Nhật / Phú Mỹ',
      note: 'Cọc 40% theo tiến độ đặt hàng (1.110.720 đ). Dùng cho cánh kính tủ áo, đợt kính trang trí.',
      orderReference: 'DH_KINH_VIET_NHAT_VSG_30_10',
      approvalRequired: true,
      tier: 'Việt Nhật VSG'
    },

    // 5. Phụ Kiện Kim Khí Tủ Bếp & Ray Trượt Bản Lề (Quốc Tâm, Phúc Sơn)
    {
      code: 'LED_DAY_12V_10M_TT',
      name: 'Cuộn Dây Led Dán 12V 10m Ánh Sáng Trung Tính (Quốc Tâm)',
      category: 'Phụ Kiện Điện Led',
      spec: 'Cuộn 10m, công suất cao 120 led/m, ánh sáng trung tính 4000K sắc nét',
      unit: 'Cuộn',
      unitPrice: 170000,
      supplier: 'Phụ Kiện Quốc Tâm',
      supplierGroup: 'Quốc Tâm (56 Ngô Đức Kế)',
      note: 'Lấy sáng 04/11 cộng vào sổ nợ T296. Dùng hắt tủ bếp, tủ áo, đợt kệ trang trí.',
      orderReference: 'HD_LED_04_11 (Sổ nợ T296)',
      approvalRequired: true,
      tier: 'Quốc Tâm'
    },
    {
      code: 'RAY_TRUOT_SAP_GIAM_CHAN',
      name: 'Ray Trượt Sập Giảm Chấn Ngăn Kéo (Quốc Tâm)',
      category: 'Phụ Kiện Cơ Khí',
      spec: 'Bộ ray trượt sập giảm chấn tải trọng 35kg, thép mạ kẽm chống rỉ',
      unit: 'Bộ',
      unitPrice: 80000,
      supplier: 'Phụ Kiện Quốc Tâm',
      supplierGroup: 'Quốc Tâm (56 Ngô Đức Kế)',
      note: 'Thợ Hào nhận tại 56 Ngô Đức Kế ngày 05/11. Dùng cho ngăn kéo bàn học, tủ áo.',
      orderReference: 'HD_RAY_SAP_05_11',
      approvalRequired: true,
      tier: 'Quốc Tâm'
    },
    {
      code: 'BAN_LE_GIAM_CHAN_INOX304_DTC',
      name: 'Bản Lề Giảm Chấn Inox 304 Tháo Lắp Nhanh (DTC / Blumk)',
      category: 'Phụ Kiện Cơ Khí',
      spec: 'Inox 304 chống rỉ sét, tích hợp piston đồng giảm chấn êm ái',
      unit: 'Cái',
      unitPrice: 22000,
      supplier: 'Phụ Kiện Quốc Tâm',
      supplierGroup: 'Quốc Tâm / Phúc Sơn',
      note: 'Tiêu chuẩn 2-3 cái/cánh tùy chiều cao cánh tủ.',
      orderReference: 'Hoa_don_ban_le_05_11',
      approvalRequired: true,
      tier: 'Quốc Tâm'
    },
    {
      code: 'NGUON_DUA_LED_12V_5A',
      name: 'Nguồn Đũa Tản Nhiệt Nhôm Siêu Mỏng 12V 5A (60W)',
      category: 'Phụ Kiện Điện Led',
      spec: 'Kích thước siêu mỏng nhét vừa khe nhôm định hình, điện áp vào 220V ra 12V DC',
      unit: 'Cái',
      unitPrice: 85000,
      supplier: 'Phụ Kiện Quốc Tâm',
      supplierGroup: 'Quốc Tâm',
      note: 'Cung cấp nguồn cho chùm led tủ bếp, tủ áo.',
      orderReference: 'Quoc_Tam_Catalog_2026',
      approvalRequired: true,
      tier: 'Quốc Tâm'
    },

    // 6. Sơn Hoàn Thiện PU & Vách CNC Trang Trí
    {
      code: 'SON_PU_MEN_CANH_CNC_DUCLINH',
      name: 'Gia Công Hoàn Thiện Sơn Men PU Trắng/Màu Cánh Huỳnh & Vách CNC',
      category: 'Sơn Hoàn Thiện',
      spec: 'Quy trình sơn 5 lớp: Lót 2 nước, xả nhám, bả bột, sơn màu chống ngả, phủ bóng 2K',
      unit: 'Gói / M²',
      unitPrice: 350000,
      supplier: 'Đức Lĩnh SƠN PU',
      supplierGroup: 'Đức Lĩnh',
      note: 'Vũ kiểm tra nghiệm thu độ mịn và bóng nước sơn trực tiếp tại xưởng trước khi chi trả.',
      orderReference: 'SON_PU_DUCLINH_CNC4M',
      approvalRequired: true,
      tier: 'Đức Lĩnh PU'
    },

    // 7. Đá Nung Kết Ceramic, Tấm Than Tre & Đồ Rời
    {
      code: 'DA_NUNG_KET_CERAMIC_CALACATTA',
      name: 'Mặt Đá Bếp Ceramic Nung Kết Vân Calacatta Chống Trầy 15mm',
      category: 'Đá Bếp Cao Cấp',
      spec: 'Khổ dài liền mạch, chống ố chống trầy nhiệt độ cao, bo viền ghép mòi 45 độ',
      unit: 'Md',
      unitPrice: 1650000,
      supplier: 'Hoàng Hà Ceramic PVC',
      supplierGroup: 'Hoàng Hà Ceramic',
      note: 'Đo bóc tách theo bản vẽ cad mặt đá. Đồ ngoài bóc tách riêng doanh thu không gộp khoán.',
      orderReference: 'DH_CERAMIC_HOANGHA_CALACATTA',
      approvalRequired: true,
      tier: 'Hoàng Hà'
    },
    {
      code: 'TAM_THAN_TRE_NANO_HOANGGIA',
      name: 'Tấm Ốp Đa Năng Sợi Than Tre Phủ PVC Nano Tráng Gương',
      category: 'Tấm Than Tre Trang Trí',
      spec: '1220 x 2800 x 8mm, Cốt than tre thân thiện môi trường, uốn cong bo góc không gãy',
      unit: 'Tấm',
      unitPrice: 320000,
      supplier: 'Vật Liệu Hoàng Gia',
      supplierGroup: 'Hoàng Gia',
      note: 'Dùng cho vách tivi, vách đầu giường bo cong liền khối.',
      orderReference: 'DH_PVC_NANO_HOANGGIA',
      approvalRequired: true,
      tier: 'Hoàng Gia'
    },
    {
      code: 'PHOI_GO_SOI_FAS_LOAI1',
      name: 'Phôi Gỗ Sồi Tự Nhiên Nhập Khẩu Bắc Mỹ FAS Loại 1 Đã Sấy',
      category: 'Gỗ Tự Nhiên',
      spec: 'Quy cách xẻ sấy chuẩn độ ẩm 10-12%, không mắt chết, bề mặt sáng đẹp',
      unit: 'M³',
      unitPrice: 18500000,
      supplier: 'Gỗ Thịt Đức Anh - Thu Hương (Nga)',
      supplierGroup: 'Đức Anh / Cường HN',
      note: 'CCSC: Trừ toàn bộ tiền gỗ thịt và đồ mua ngoài trước khi tính khoán xưởng 40%.',
      orderReference: 'DH_GO_THIT_DUCANH',
      approvalRequired: true,
      tier: 'Đức Anh Sồi'
    }
  ];

  // BẢNG ĐỊNH MỨC TẤM CẮT CNC CHUẨN MỤC 24 (GIÁM ĐỐC NGUYỄN VIẾT NGHĨA CHUẨN HÓA VĨNH VIỄN)
  const CNC_NORMS_STANDARD = {
    R09_TU_BEP_DUOI: {
      id: 'R09',
      title: 'Tủ Bếp Dưới (Sâu 600 x Cao 860, Thùng cao 740)',
      unit: 'Md',
      standardRate: 1.45,
      rateBreakdown: {
        total: 1.45,
        acrylicSplit: { bodyAndBack: 1.14, door: 0.31 }
      },
      note: 'Định mức chuẩn 1.45 tấm/md. Trừ chân nhựa 100mm + đá 20mm, nóc không bịt kín (chỉ 2 xà 80mm). CẤM BÁO NHẦM 2.70 tấm/md!',
      formula: 'Số tấm = Chiều dài (md) * 1.45'
    },
    R08_TU_BEP_TREN: {
      id: 'R08',
      title: 'Tủ Bếp Trên (Sâu 350 x Cao 750)',
      unit: 'Md',
      standardRate: 1.04,
      rateBreakdown: {
        body: 0.74,
        door: 0.30,
        back6mm: 0.28
      },
      note: 'Khổ ván 1220 xẻ 3 dải 350mm rất lợi ván. Thùng: 0.74 tấm/md, Cánh: 0.30 tấm/md, Hậu 6mm: 0.28 tấm/md.',
      formula: 'Số tấm ván 17mm = Md * 1.04 | Số tấm hậu 6mm = Md * 0.28'
    },
    R10_TU_BEP_KICH_TRAN: {
      id: 'R10',
      title: 'Tủ Bếp Kịch Trần (Sâu 700 x Cao 720)',
      unit: 'Md',
      standardRate: 1.44,
      rateBreakdown: {
        body: 1.15,
        door: 0.29,
        back6mm: 0.27
      },
      note: 'Sâu 700 vượt quá nửa khổ ván 610, xẻ 1 dải 700 + 1 dải 500 ghép sang tủ khác.',
      formula: 'Số tấm ván 17mm = Md * 1.44 | Hậu = Md * 0.27'
    },
    R27_TU_AO_KICH_TRAN: {
      id: 'R27',
      title: 'Tủ Quần Áo Kịch Trần (Sâu 600 x Cao 2700)',
      unit: 'M²',
      standardRate: 1.05,
      rateBreakdown: {
        bodyAndDoor: 1.05,
        back6mm: 0.36,
        glassDoorDeduction: 0.40
      },
      note: 'Định mức 1.05 tấm ván 17mm/m² (Thùng + Đợt + Cánh gỗ). Khoang cánh kính khung nhôm trừ ngay 0.40 tấm/m² cánh.',
      formula: 'Số tấm 17mm = M² * 1.05 (trừ 0.40*M² nếu cánh kính) | Hậu = M² * 0.36'
    },
    R05_HOC_TRANG_TRI_NONG: {
      id: 'R05',
      title: 'Hộc Tủ Trang Trí Nông (Sâu 200 x Cao 1850)',
      unit: 'M²',
      standardRate: 0.50,
      rateBreakdown: {
        body: 0.50,
        back6mm: 0.25
      },
      note: 'Khổ ván 1220 xẻ được 6 dải sâu 200mm. Định mức 0.50 tấm 17mm/m² + 0.25 tấm hậu/m².',
      formula: 'Số tấm 17mm = M² * 0.50 | Hậu = M² * 0.25'
    },
    R06_VACH_OP_PHANG: {
      id: 'R06',
      title: 'Vách Ốp Phẳng Trang Trí Dày 17mm (R06, R23, R25, R34)',
      unit: 'M²',
      standardRate: 0.40,
      rateBreakdown: {
        standardFlat: 0.40,
        lamAndHuynhCNC: 0.52
      },
      note: 'Vách phẳng 0.40 tấm/m² (hao hụt 15%). Vách có Lam / Soi huỳnh CNC: 0.52 tấm/m².',
      formula: 'Số tấm = M² * 0.40 (hoặc M² * 0.52 với lam/soi huỳnh)'
    },
    R33_GIUONG_BO_CONG: {
      id: 'R33',
      title: 'Giường Ngủ Bo Cong Không Đầu Giường (1600x2000 / 1800x2000)',
      unit: 'Cái',
      standardRate: 3.4,
      rateBreakdown: {
        range: '3.3 - 3.5 tấm / cái',
        platform: 1.4,
        framesAndBracing: 2.0
      },
      note: 'Phản giường 2 tấm 1.4 tấm + 3 vai/đuôi bo cong chập đôi + xương chịu lực 2.0 tấm = 3.3 - 3.5 tấm/cái.',
      formula: 'Số tấm = Số lượng giường * 3.4 tấm'
    },
    R04_KE_TIVI_BAN_HOC_TREO: {
      id: 'R04',
      title: 'Kệ Tivi / Bàn Học / Bàn Phấn Treo Bo Góc (Sâu 400-550 x Cao 150-300)',
      unit: 'Md',
      standardRate: 0.60,
      rateBreakdown: {
        body17mm: 0.60,
        drawerBottom6mm: 0.15
      },
      note: 'Định mức 0.55 - 0.65 tấm ván 17mm/md + 0.15 tấm hậu/md cho đáy ngăn kéo.',
      formula: 'Số tấm 17mm = Md * 0.60 | Đáy ngăn kéo = Md * 0.15'
    }
  };

  /**
   * API CHÍNH CỦA MODULE W24
   */
  const PG_Modules_W24 = {
    version: '2026.11.08-W24',
    name: 'PG_Home_Material_Catalog_And_Search',
    author: 'Vũ Kỹ Thuật (Phân Hệ XUONG_VATTU) & Nguyễn Viết Nghĩa (Ban Giám Đốc)',
    legal: {
      entity: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
      registrationNumber: '042203002931',
      registrationDate: '13/01/2025',
      representative: 'Nguyễn Trọng Nghĩa',
      factoryAddress: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
      hotline: '0986.722.324'
    },

    // Lấy toàn bộ danh mục vật tư
    getAllMaterials: function () {
      return JSON.parse(JSON.stringify(MATERIAL_CATALOG_2026));
    },

    // Lấy định mức tấm CNC chuẩn
    getCNCNorms: function () {
      return JSON.parse(JSON.stringify(CNC_NORMS_STANDARD));
    },

    // Tra cứu vật tư thông minh theo từ khóa & bộ lọc
    search: function (query, options = {}) {
      const q = removeVietnameseTones(query || '');
      const categoryFilter = options.category || '';
      const supplierFilter = options.supplier || '';

      return MATERIAL_CATALOG_2026.filter((item) => {
        if (categoryFilter && item.category !== categoryFilter) return false;
        if (supplierFilter && !item.supplier.toLowerCase().includes(supplierFilter.toLowerCase())) return false;
        if (!q) return true;

        const nameNorm = removeVietnameseTones(item.name);
        const codeNorm = removeVietnameseTones(item.code);
        const specNorm = removeVietnameseTones(item.spec);
        const supplierNorm = removeVietnameseTones(item.supplier);
        const tierNorm = removeVietnameseTones(item.tier || '');

        return (
          nameNorm.includes(q) ||
          codeNorm.includes(q) ||
          specNorm.includes(q) ||
          supplierNorm.includes(q) ||
          tierNorm.includes(q)
        );
      });
    },

    // Tìm kiếm chính xác theo mã vật tư
    getByCode: function (code) {
      if (!code) return null;
      return MATERIAL_CATALOG_2026.find((item) => item.code.toUpperCase() === code.trim().toUpperCase()) || null;
    },

    // Lọc theo Nhà Cung Cấp
    getBySupplier: function (supplierKeyword) {
      if (!supplierKeyword) return [];
      const kw = supplierKeyword.toLowerCase();
      return MATERIAL_CATALOG_2026.filter(
        (item) => item.supplier.toLowerCase().includes(kw) || item.supplierGroup.toLowerCase().includes(kw)
      );
    },

    // Tính toán số lượng tấm ván CNC tự động từ khối lượng
    calculateCNCMaterialQuota: function (normTypeKey, quantity) {
      const norm = CNC_NORMS_STANDARD[normTypeKey];
      if (!norm) {
        throw new Error(`Không tìm thấy mã hạng mục định mức: ${normTypeKey}`);
      }
      const qty = parseFloat(quantity) || 0;
      let calculatedSheets = 0;
      let detail = '';

      switch (normTypeKey) {
        case 'R09_TU_BEP_DUOI':
          calculatedSheets = Math.round(qty * 1.45 * 100) / 100;
          detail = `${qty} md * 1.45 = ${calculatedSheets} tấm (Thùng+Hậu: ${(qty * 1.14).toFixed(2)}, Cánh: ${(qty * 0.31).toFixed(2)})`;
          break;
        case 'R08_TU_BEP_TREN':
          calculatedSheets = Math.round(qty * 1.04 * 100) / 100;
          detail = `${qty} md * 1.04 = ${calculatedSheets} tấm ván 17mm + ${(qty * 0.28).toFixed(2)} tấm hậu 6mm`;
          break;
        case 'R10_TU_BEP_KICH_TRAN':
          calculatedSheets = Math.round(qty * 1.44 * 100) / 100;
          detail = `${qty} md * 1.44 = ${calculatedSheets} tấm ván 17mm + ${(qty * 0.27).toFixed(2)} tấm hậu 6mm`;
          break;
        case 'R27_TU_AO_KICH_TRAN':
          calculatedSheets = Math.round(qty * 1.05 * 100) / 100;
          detail = `${qty} m² * 1.05 = ${calculatedSheets} tấm ván 17mm + ${(qty * 0.36).toFixed(2)} tấm hậu 6mm (Trừ 0.40 tấm/m² nếu cánh kính)`;
          break;
        case 'R05_HOC_TRANG_TRI_NONG':
          calculatedSheets = Math.round(qty * 0.50 * 100) / 100;
          detail = `${qty} m² * 0.50 = ${calculatedSheets} tấm ván 17mm + ${(qty * 0.25).toFixed(2)} tấm hậu 6mm`;
          break;
        case 'R06_VACH_OP_PHANG':
          calculatedSheets = Math.round(qty * 0.40 * 100) / 100;
          detail = `${qty} m² * 0.40 = ${calculatedSheets} tấm (nếu có lam/soi huỳnh: ${(qty * 0.52).toFixed(2)} tấm)`;
          break;
        case 'R33_GIUONG_BO_CONG':
          calculatedSheets = Math.round(qty * 3.4 * 100) / 100;
          detail = `${qty} cái * 3.4 = ${calculatedSheets} tấm (Phản: 1.4 tấm, Khung/Vai: 2.0 tấm)`;
          break;
        case 'R04_KE_TIVI_BAN_HOC_TREO':
          calculatedSheets = Math.round(qty * 0.60 * 100) / 100;
          detail = `${qty} md * 0.60 = ${calculatedSheets} tấm ván 17mm + ${(qty * 0.15).toFixed(2)} tấm đáy ngăn kéo`;
          break;
        default:
          calculatedSheets = Math.round(qty * norm.standardRate * 100) / 100;
          detail = `${qty} * ${norm.standardRate} = ${calculatedSheets} tấm`;
      }

      return {
        normId: norm.id,
        title: norm.title,
        unit: norm.unit,
        inputQuantity: qty,
        standardRate: norm.standardRate,
        calculatedSheets: calculatedSheets,
        roundedSheets: Math.ceil(calculatedSheets),
        calculationDetail: detail,
        note: norm.note
      };
    },

    // Tạo đối tượng dòng vật tư chuẩn cho Phiếu Đề Xuất của Vũ
    createProposalItem: function (materialCode, quantity, customNote = '', jobName = '') {
      const item = this.getByCode(materialCode);
      if (!item) {
        throw new Error(`Không tìm thấy mã vật tư: ${materialCode}`);
      }
      const qty = parseFloat(quantity) || 1;
      const totalAmount = Math.round(qty * item.unitPrice);

      return {
        itemCode: item.code,
        itemName: item.name,
        category: item.category,
        spec: item.spec,
        unit: item.unit,
        quantity: qty,
        unitPrice: item.unitPrice,
        unitPriceFormatted: formatVND(item.unitPrice),
        totalAmount: totalAmount,
        totalAmountFormatted: formatVND(totalAmount),
        supplier: item.supplier,
        supplierGroup: item.supplierGroup,
        jobName: jobName || 'Công trình nội thất PG Home',
        workshopNote: customNote || item.note,
        orderReference: item.orderReference,
        tier: item.tier,
        approvalRule: 'BẮT BUỘC GIÁM ĐỐC NGUYỄN VIẾT NGHĨA DUYỆT & ĐÓNG DẤU ĐỎ ĐIỆN TỬ - CHƯA DUYỆT CẤM NHẬP HÀNG',
        approvalStatus: 'PENDING_DIRECTOR_SEAL',
        approvalVerified: false,
        createdDate: new Date().toISOString()
      };
    },

    // Kiểm tra chốt chặn chi phí tổng <= 54% (Kỷ luật thép bỏ túi BGĐ)
    auditWorkshopCostControl: function (materialCost, laborCost, quotedRevenue) {
      const mat = parseFloat(materialCost) || 0;
      const lab = parseFloat(laborCost) || 0;
      const rev = parseFloat(quotedRevenue) || 0;

      if (rev <= 0) {
        return {
          valid: false,
          costRatioPercent: 0,
          message: 'Doanh thu báo giá phải lớn hơn 0 để tính tỷ lệ chi phí cost.'
        };
      }

      const totalCost = mat + lab;
      const ratio = (totalCost / rev) * 100;
      const isPassed = ratio <= 54.0;
      const netProfitEstimated = isPassed ? (rev - totalCost) * 0.7 : 0;

      return {
        valid: isPassed,
        totalCost: totalCost,
        totalCostFormatted: formatVND(totalCost),
        quotedRevenue: rev,
        quotedRevenueFormatted: formatVND(rev),
        costRatioPercent: Math.round(ratio * 100) / 100,
        benchmarkPercent: 54.0,
        status: isPassed ? 'PASS_DAT_CHUAN_LOI_NHUAN' : 'CANH_BAO_VUOT_DINH_MUC_54_PERCENT',
        netProfitEstimated: netProfitEstimated,
        netProfitFormatted: formatVND(netProfitEstimated),
        message: isPassed
          ? `Tỷ lệ chi phí đạt chuẩn (${ratio.toFixed(1)}% <= 54%). Đảm bảo lợi nhuận ròng 18% - 20% cho Giám Đốc.`
          : `CẢNH BÁO: Tỷ lệ chi phí vượt ngưỡng (${ratio.toFixed(1)}% > 54%). Bắt buộc rà soát lại bóc tách vật tư hoặc công thợ!`
      };
    },

    // Tự động điền dữ liệu vật tư vào Form HTML của Vũ (Autofill)
    autoFillProposalForm: function (materialItem, formSelectors = {}) {
      if (!materialItem) return false;

      const mapping = {
        nameInput: formSelectors.nameInput || '#material_name, [name="material_name"], #ten_vat_tu',
        codeInput: formSelectors.codeInput || '#material_code, [name="material_code"], #ma_vat_tu',
        specInput: formSelectors.specInput || '#material_spec, [name="material_spec"], #quy_cach',
        unitInput: formSelectors.unitInput || '#material_unit, [name="material_unit"], #dvt',
        priceInput: formSelectors.priceInput || '#material_price, [name="material_price"], #don_gia',
        supplierInput: formSelectors.supplierInput || '#material_supplier, [name="material_supplier"], #nha_cung_cap',
        noteInput: formSelectors.noteInput || '#material_note, [name="material_note"], #ghi_chu'
      };

      try {
        const setVal = (selector, val) => {
          if (!selector || val === undefined || val === null) return;
          const el = document.querySelector(selector);
          if (el) {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };

        setVal(mapping.nameInput, materialItem.name);
        setVal(mapping.codeInput, materialItem.code);
        setVal(mapping.specInput, materialItem.spec);
        setVal(mapping.unitInput, materialItem.unit);
        setVal(mapping.priceInput, materialItem.unitPrice);
        setVal(mapping.supplierInput, materialItem.supplier);
        setVal(mapping.noteInput, materialItem.note);

        return true;
      } catch (err) {
        console.warn('[W24] Không thể tự động điền form:', err);
        return false;
      }
    },

    // Tạo HTML widget tra cứu nhanh nhúng vào giao diện Vũ
    renderSearchWidget: function (containerId, onSelectCallback) {
      const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
      if (!container) return;

      const widgetHtml = `
        <div class="pg-w24-search-widget" style="background:#1e293b; color:#f8fafc; padding:16px; border-radius:10px; border:1px solid #334155; font-family:system-ui,-apple-system,sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #475569; padding-bottom:8px;">
            <div style="font-weight:700; font-size:15px; color:#38bdf8;">
              🔍 TRA CỨU ĐƠN GIÁ VẬT TƯ & MÃ VÁN 2026 (W24)
            </div>
            <span style="font-size:11px; background:#0284c7; color:#fff; padding:2px 8px; border-radius:12px;">PG Home Hà Tĩnh</span>
          </div>

          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input type="text" id="pg-w24-search-input" placeholder="Tìm tên ván, phụ kiện, mã hàng, nhà cung cấp (Lam Giang, Quốc Tâm, Livas...)"
              style="flex:1; padding:8px 12px; border-radius:6px; border:1px solid #475569; background:#0f172a; color:#fff; font-size:13px; outline:none;" />
            <select id="pg-w24-category-filter" style="padding:8px; border-radius:6px; border:1px solid #475569; background:#0f172a; color:#fff; font-size:13px;">
              <option value="">-- Tất cả nhóm --</option>
              <option value="Gỗ Công Nghiệp">Gỗ Công Nghiệp</option>
              <option value="Tấm Nhựa Đặc">Tấm Nhựa Đặc WPB</option>
              <option value="Plywood Cao Cấp">Plywood Chuẩn A1</option>
              <option value="Cánh Tủ Cao Cấp">Cánh Acrylic Noline</option>
              <option value="Gia Công Bo Cong">Bo Cong ALD R3-R45</option>
              <option value="Kính & Gương">Gương Bỉ & Kính VSG</option>
              <option value="Phụ Kiện Điện Led">Led Dán & Nguồn 12V</option>
              <option value="Phụ Kiện Cơ Khí">Ray Trượt & Bản Lề</option>
              <option value="Sơn Hoàn Thiện">Sơn PU Men</option>
              <option value="Đá Bếp Cao Cấp">Đá Ceramic Nung Kết</option>
            </select>
          </div>

          <div id="pg-w24-results-list" style="max-height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
            <!-- Danh sách vật tư render ở đây -->
          </div>

          <div style="margin-top:10px; font-size:11px; color:#94a3b8; display:flex; justify-content:space-between; align-items:center;">
            <span>* Lưu ý Vũ: Mọi phiếu đề xuất bắt buộc phải có DẤU ĐỎ ĐIỆN TỬ của Giám Đốc mới được gửi NCC.</span>
            <span id="pg-w24-item-count" style="font-weight:600; color:#38bdf8;"></span>
          </div>
        </div>
      `;

      container.innerHTML = widgetHtml;

      const input = container.querySelector('#pg-w24-search-input');
      const catSelect = container.querySelector('#pg-w24-category-filter');
      const resultsList = container.querySelector('#pg-w24-results-list');
      const countLabel = container.querySelector('#pg-w24-item-count');

      const renderItems = (items) => {
        resultsList.innerHTML = '';
        countLabel.textContent = `${items.length} vật tư`;

        if (items.length === 0) {
          resultsList.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:13px;">Không tìm thấy vật tư phù hợp.</div>`;
          return;
        }

        items.forEach((item) => {
          const itemEl = document.createElement('div');
          itemEl.style.cssText =
            'padding:8px 12px; background:#0f172a; border:1px solid #334155; border-radius:6px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition:background 0.2s;';
          itemEl.onmouseenter = () => (itemEl.style.background = '#1e3a5f');
          itemEl.onmouseleave = () => (itemEl.style.background = '#0f172a');

          itemEl.innerHTML = `
            <div style="flex:1;">
              <div style="font-weight:600; font-size:13px; color:#e2e8f0;">${item.name}</div>
              <div style="font-size:11px; color:#94a3b8; margin-top:2px;">
                <span style="color:#38bdf8;">Mã: ${item.code}</span> | 
                <span>Quy cách: ${item.spec}</span> | 
                <span style="color:#fbbf24;">NCC: ${item.supplier}</span>
              </div>
            </div>
            <div style="text-align:right; margin-left:12px;">
              <div style="font-weight:700; font-size:13px; color:#4ade80;">${formatVND(item.unitPrice)} / ${item.unit}</div>
              <button type="button" class="pg-w24-select-btn" style="margin-top:4px; padding:3px 8px; font-size:11px; border:none; border-radius:4px; background:#0284c7; color:#fff; cursor:pointer;">
                Điền Form ⇲
              </button>
            </div>
          `;

          const triggerSelect = () => {
            if (typeof onSelectCallback === 'function') {
              onSelectCallback(item);
            } else {
              PG_Modules_W24.autoFillProposalForm(item);
            }
          };

          itemEl.addEventListener('click', triggerSelect);
          resultsList.appendChild(itemEl);
        });
      };

      const doSearch = () => {
        const q = input.value;
        const cat = catSelect.value;
        const results = PG_Modules_W24.search(q, { category: cat });
        renderItems(results);
      };

      input.addEventListener('input', doSearch);
      catSelect.addEventListener('change', doSearch);

      // Render ban đầu
      renderItems(MATERIAL_CATALOG_2026);
    }
  };

  return PG_Modules_W24;
});
