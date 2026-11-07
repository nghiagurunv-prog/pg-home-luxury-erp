/**
 * MODULE W07: BỘ MÁY TÍNH ĐỊNH MỨC TẤM CẮT CNC THỰC CHIẾN & KIỂM TOÁN DỰ ÁN NHÀ ANH NAM
 * 
 * Bản quyền: Ban Giám Đốc PG Home Luxury (Giám Đốc Nguyễn Viết Nghĩa)
 * Chuẩn hóa từ: Sổ Tay 03 - Mục 24.1 & Mục 24.2 (Audit Công trình Anh Nam ngày 06/11/2026)
 * Khổ ván chuẩn: 1220 x 2440 mm = 2.9768 m²/tấm
 * Mã đơn vị pháp lý: HKD 042203002931 - Ngõ 49 Trương Quốc Dụng, TP. Hà Tĩnh
 * Hotline: 0986.722.324
 */

(function () {
  'use strict';

  // DỮ LIỆU ĐỊNH MỨC QUY CHUẨN XƯỞNG PG HOME (MỤC 24.1 SỔ TAY 03)
  const STANDARD_CNC_NORMS = [
    {
      id: 'R09',
      category: 'Tủ bếp dưới',
      name: 'Tủ bếp dưới (Thùng Pitech + Cánh Acrylic Noline)',
      unit: 'Md',
      depth_mm: 600,
      height_mm: 860,
      core_norm: {
        total_sheets: 1.45,
        pvc_17mm: 1.14,
        acrylic_sheets: 0.31,
        pvc_6mm: 0.0,
        mdf_17mm: 0.0,
        back_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '3.77 md × 1.45 = 5.47 ≈ 5.5 tấm. CẤM BÁO BỪA 2.70 TẤM/MD!',
      tech_notes: 'Trừ chân nhựa 100mm + mặt đá 20mm, nóc rỗng chỉ đi 2 thanh xà 80mm, khoang chậu/bếp không có đợt ngang.'
    },
    {
      id: 'R08',
      category: 'Tủ bếp trên',
      name: 'Tủ bếp trên (Thùng MDF AC/TL + Cánh Acrylic Noline)',
      unit: 'Md',
      depth_mm: 350,
      height_mm: 750,
      core_norm: {
        total_sheets: 1.04,
        mdf_17mm: 0.74,
        acrylic_sheets: 0.30,
        back_6mm: 0.28,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: 'Thùng 0.74 tấm/md + Cánh 0.30 tấm/md + Hậu 6mm 0.28 tấm/md',
      tech_notes: 'Sâu 350mm nên 1 khổ ván 1220mm xẻ dọc chuẩn 3 dải phôi 350mm rất lợi ván.'
    },
    {
      id: 'R10',
      category: 'Tủ bếp kịch trần',
      name: 'Tủ bếp kịch trần (Thùng MDF + Cánh Acrylic Noline)',
      unit: 'Md',
      depth_mm: 700,
      height_mm: 720,
      core_norm: {
        total_sheets: 1.44,
        mdf_17mm: 1.15,
        acrylic_sheets: 0.29,
        back_6mm: 0.27,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: 'Thùng 1.15 tấm/md + Cánh 0.29 tấm/md + Hậu 6mm 0.27 tấm/md',
      tech_notes: 'Sâu 700mm vượt quá nửa khổ ván 610mm, 1 khổ ván xẻ 1 dải 700 + 1 dải 500mm tận dụng sang kệ tivi/lavabo.'
    },
    {
      id: 'R27',
      category: 'Tủ quần áo kịch trần',
      name: 'Tủ quần áo kịch trần (Thùng cánh gỗ MDF)',
      unit: 'M2',
      depth_mm: 600,
      height_mm: 2700,
      core_norm: {
        total_sheets: 1.05,
        mdf_17mm: 1.05,
        back_6mm: 0.36,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      deductions: {
        glass_door_m2_reduction: 0.40 // Trừ 0.40 tấm MDF 17mm trên mỗi m2 cánh kính
      },
      formula_note: '1.05 tấm ván 17mm/m² (Thùng+Đợt+Ngăn kéo+Cánh gỗ) + 0.36 tấm hậu 6mm/m²',
      tech_notes: '1 khổ ván 1220mm bổ đôi chuẩn 2 dải 600mm. Khoang nào dùng cánh kính khung nhôm thì trừ ngay 0.40 tấm 17mm/m² cánh kính.'
    },
    {
      id: 'R05',
      category: 'Hộc tủ trang trí nông',
      name: 'Hộc tủ tivi trang trí / Kệ trang trí nông',
      unit: 'M2',
      depth_mm: 200,
      height_mm: 1850,
      core_norm: {
        total_sheets: 0.50,
        mdf_17mm: 0.50,
        back_6mm: 0.25,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '0.50 tấm ván 17mm/m² + 0.25 tấm hậu 6mm/m²',
      tech_notes: 'Sâu 200mm nên 1 tấm ván 1220mm xẻ dọc được 6 dải phôi sâu 200mm.'
    },
    {
      id: 'R06',
      category: 'Vách ốp phẳng',
      name: 'Vách ốp phẳng trang trí (MDF Melamin)',
      unit: 'M2',
      depth_mm: 17,
      height_mm: 3000,
      core_norm: {
        total_sheets: 0.40,
        mdf_17mm: 0.40,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '0.40 tấm/m² (Hao hụt ghép vân & xương lót ~15% = 2.50 m² thành phẩm / tấm)',
      tech_notes: 'Trừ các vị trí đè tủ kệ, giao cắt hoặc cửa sổ.'
    },
    {
      id: 'R21',
      category: 'Vách Lam / CNC',
      name: 'Vách ốp nan Lam sóng hoặc Soi huỳnh CNC',
      unit: 'M2',
      depth_mm: 150,
      height_mm: 1000,
      core_norm: {
        total_sheets: 0.52,
        mdf_17mm: 0.52,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '0.52 tấm/m² (Bù hao hụt chạy dao CNC và phay rãnh lam)',
      tech_notes: 'Áp dụng cho vách lam sóng sau giường ngủ, vách CNC phòng thờ.'
    },
    {
      id: 'R33',
      category: 'Giường ngủ bo cong',
      name: 'Giường ngủ bo cong không đầu giường (1600×2000 / 1800×2000)',
      unit: 'Cái',
      depth_mm: 2000,
      height_mm: 400,
      core_norm: {
        total_sheets: 3.40,
        mdf_17mm: 3.40,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '3.3 – 3.5 tấm / cái (Chuẩn thực chiến: 3.4 tấm/cái)',
      tech_notes: 'Gồm phản giường 2 tấm (1.4 tấm) + 3 vai/đuôi bo cong chập đôi + hệ xương/thang chịu lực (2.0 tấm).'
    },
    {
      id: 'R04',
      category: 'Kệ tivi bo cong',
      name: 'Kệ tivi bo cong treo tường (Sâu 400 × Cao 300)',
      unit: 'Md',
      depth_mm: 400,
      height_mm: 300,
      core_norm: {
        total_sheets: 0.60,
        mdf_17mm: 0.60,
        back_6mm: 0.15,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '0.60 tấm ván 17mm/md + 0.15 tấm đáy ngăn kéo 6mm/md',
      tech_notes: 'Khung cánh MDF chống ẩm, ray bi 3 tầng.'
    },
    {
      id: 'R24',
      category: 'Bàn trang điểm / bàn học',
      name: 'Bàn học / Bàn trang điểm treo bo góc',
      unit: 'Md',
      depth_mm: 450,
      height_mm: 150,
      core_norm: {
        total_sheets: 0.60,
        mdf_17mm: 0.60,
        back_6mm: 0.15,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '0.60 tấm ván 17mm/md + 0.15 tấm đáy ngăn kéo 6mm/md',
      tech_notes: 'Sâu 450-550mm, có hộc ngăn kéo âm.'
    },
    {
      id: 'R15',
      category: 'Tủ lavabo nhựa PVC',
      name: 'Tủ lavabo treo chống nước (Nhựa đặc An Cường/Pitech)',
      unit: 'Md',
      depth_mm: 500,
      height_mm: 250,
      core_norm: {
        total_sheets: 0.65,
        pvc_17mm: 0.65,
        pvc_6mm: 0.0,
        mdf_17mm: 0.0,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '0.65 tấm PVC đặc 17mm/md',
      tech_notes: 'Thùng cánh nhựa đặc PVC, ray inox 304, không dùng ván gỗ chống ẩm thông thường trong phòng tắm.'
    },
    {
      id: 'R16',
      category: 'Tủ lavabo nhựa PVC',
      name: 'Tủ lavabo đặt sàn chống nước (Nhựa đặc PVC)',
      unit: 'Md',
      depth_mm: 500,
      height_mm: 750,
      core_norm: {
        total_sheets: 1.10,
        pvc_17mm: 1.10,
        pvc_6mm: 0.0,
        mdf_17mm: 0.0,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '1.10 tấm PVC đặc 17mm/md',
      tech_notes: 'Khung hồi sâu 500 cao 750 chịu nước tuyệt đối.'
    },
    {
      id: 'R20',
      category: 'Giường bọc da / Thương mại',
      name: 'Giường ngủ bọc da cao cấp (Khung gỗ tự nhiên + Plywood)',
      unit: 'Cái',
      depth_mm: 2000,
      height_mm: 400,
      core_norm: {
        total_sheets: 2.0,
        plywood_17mm: 2.0,
        mdf_17mm: 0.0,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0
      },
      formula_note: '2.0 tấm Plywood A1 tạo dáng cong + Mút K43 + Da Hàn Quốc',
      tech_notes: 'Hàng gia công khung da chuyên dụng, không tính khoán thợ xưởng như gỗ công nghiệp thông thường.'
    },
    {
      id: 'R29',
      category: 'Cửa thông phòng',
      name: 'Cửa ra vào giấu khuôn âm tường',
      unit: 'Bộ',
      depth_mm: 50,
      height_mm: 2150,
      core_norm: {
        total_sheets: 1.20,
        mdf_17mm: 1.20,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '1.20 tấm MDF 17mm / bộ (Chập 2 mặt tạo cánh phẳng)',
      tech_notes: 'Khung bao giấu khuôn, bản lề âm 3D, khóa từ hoặc tay gạt.'
    },
    {
      id: 'R51',
      category: 'Bàn thờ',
      name: 'Bộ bàn thờ 2 tầng trang nghiêm',
      unit: 'Bộ',
      depth_mm: 810,
      height_mm: 1270,
      core_norm: {
        total_sheets: 4.50,
        mdf_17mm: 4.50,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        pvc_17mm: 0.0,
        pvc_6mm: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '4.50 tấm MDF 17mm / bộ',
      tech_notes: 'Kích thước chuẩn thước Lỗ Ban 1765x810x1270mm.'
    },
    {
      id: 'R54',
      category: 'Tủ bao máy giặt sấy',
      name: 'Hệ tủ bao máy giặt sấy kết hợp tủ kho (Nhựa đặc PVC)',
      unit: 'M2',
      depth_mm: 600,
      height_mm: 2400,
      core_norm: {
        total_sheets: 1.50,
        pvc_17mm: 1.15,
        pvc_6mm: 0.35,
        mdf_17mm: 0.0,
        back_6mm: 0.0,
        acrylic_sheets: 0.0,
        plywood_17mm: 0.0
      },
      formula_note: '1.15 tấm PVC 17mm/m² + 0.35 tấm hậu PVC 6mm/m²',
      tech_notes: 'Chịu ẩm ướt khu giặt là, kết hợp khung sắt gia cố chịu tải máy sấy chồng tầng.'
    }
  ];

  // DỮ LIỆU KIỂM TOÁN TỔNG QUAN TỪ DỰ ÁN NHÀ ANH NAM (06/11/2026)
  const AUDIT_PROJECT_NAM = {
    metadata: {
      project_title: 'Dự Án Nhà Anh Nam - Kiểm Toán Báo Giá 3 Cấp & Định Mức CNC',
      date: '06/11/2026',
      authority: 'Giám Đốc Nguyễn Viết Nghĩa'
    },
    totals: {
      mdf_17mm: 75.87,
      back_6mm: 15.95,
      pvc_17mm: 13.29,
      pvc_6mm: 0.86,
      acrylic_sheets: 4.85,
      acrylic_m2: 10.83,
      plywood_17mm: 2.0,
      glass_door_m2: 3.66,
      mirror_led_units: 4,
      leather_stools: 2,
      hidden_doors: 1
    },
    pricing_comparison: {
      an_cuong: {
        title: 'Cấp 1: Gỗ MDF An Cường Chống Ẩm',
        total_excel: 314797000,
        recalculated: 317207000,
        cost_materials: 129316000,
        cost_materials_pct: 41.08,
        cost_labor: 43316250,
        cost_labor_pct: 13.76,
        total_direct_cost: 172632250,
        cost_ratio: 54.84,
        status: 'SAFE',
        status_text: 'ĐẠT CHUẨN AN TOÀN (~54%) -> Đảm bảo lợi nhuận ròng 18% - 20% cho BGĐ'
      },
      thai_lan: {
        title: 'Cấp 2: Gỗ MDF Thái Lan Chống Ẩm',
        total_excel: null,
        excel_cell_note: 'Ô L57 BỊ TRỐNG CÔNG THỨC & SỐ TIỀN',
        actual_sum: 245426000,
        recalculated: 246251000,
        variance_vs_ac: -69371000,
        discount_pct: -22.04,
        cost_materials: 108500000,
        cost_materials_pct: 44.21,
        cost_labor: 33800000,
        cost_labor_pct: 13.77,
        total_direct_cost: 142300000,
        cost_ratio: 57.98,
        status: 'WARNING_DANGER',
        status_text: 'CẢNH BÁO NGUY HIỂM (>54%) -> Biên lợi nhuận ròng tụt xuống 10%-12% do giảm giá quá sâu ở Cánh Acrylic và Nhựa PVC'
      },
      plywood_a1: {
        title: 'Cấp 3: Thùng Cánh Plywood A1',
        total_excel: 284360000,
        excel_cell_note: 'Ô N20 Giường Da 15M Bị Trống -> N57 Thiếu 15 Triệu',
        actual_sum: 299360000,
        recalculated: 300760000,
        variance_vs_ac: -15437000,
        discount_pct: -4.9,
        status: 'SAFE'
      }
    },
    critical_errors: [
      {
        id: 'L57_MISSING',
        title: 'Lỗi công thức Excel: Ô L57 trống và Ô N20 trống',
        desc: 'Ô L57 (Tổng cộng MDF Thái Lan) không có công thức SUM (= None). Ô N20 (Giường bọc da 15tr) không link công thức khiến N57 chỉ ra 284,360,000 đ (thiếu đúng 15tr đ, thực tế phải là 299,360,000 đ).'
      },
      {
        id: 'RULE_4_VIOLATION',
        title: 'Vi phạm Bài học số 4 Mục 24.2: Giảm giá sâu cào bằng ở cột Thái Lan',
        desc: 'Tủ bếp trên (R08) và tủ kịch trần (R10) cột Thái Lan giảm 1.000.000 đ/md (-27%). Trong khi chênh phôi ván chỉ ~380k/tấm (chênh ~300k - 400k/md), còn Cánh Acrylic Noline và phụ kiện nhà máy giữ nguyên giá. Việc giảm cào bằng này làm tỷ lệ cost đội lên 57.98% (>54%), ăn mòn lợi nhuận ròng của BGĐ.'
      },
      {
        id: 'R52_HARDCODE',
        title: 'Gõ cứng số tiền tại R52 (Ốp CNC phòng thờ)',
        desc: 'R52 khối lượng 6.55 m2. Đơn giá AC 2.2M (thành tiền đúng 14.41M) bị gõ cứng 12M (thiếu 2.41M). Cột TL đơn giá 1.5M (thành tiền đúng 9.825M) bị gõ cứng 9M (thiếu 825k).'
      },
      {
        id: 'R48_OMISSION',
        title: 'Bỏ sót đơn giá tại R48 (Đợt sách phòng ngủ con trai)',
        desc: 'Hạng mục R48 bị bỏ trống toàn bộ đơn giá và thành tiền ở cả 3 cấp vật liệu.'
      },
      {
        id: 'FIXED_PRICE_COMPLIANCE',
        title: 'Điểm sáng: Giữ nguyên 100% đơn giá đồ thương mại và nhựa chuyên dụng',
        desc: 'R09 (Tủ bếp dưới Pitech cánh Acrylic = 3.5M/md), R20 (Giường da = 15M), R28 (Cánh kính = 1.7M/m2), R17/R31/R37/R56 (Gương LED = 1.2M) và R38 (Đôn da = 700k) giữ giá chuẩn.'
      }
    ]
  };

  // CÁC HẠNG MỤC CHI TIẾT TRONG BÁO GIÁ NHÀ ANH NAM
  const DETAILED_ITEMS = [
    { row: 4, room: 'I. Phòng khách', name: 'Kệ tivi bo cong', norm_id: 'R04', unit: 'Md', qty: 4.6, mdf17: 2.76, back6: 0.69, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 10580000, p_tl: 7820000, p_ply: 10120000 },
    { row: 5, room: 'I. Phòng khách', name: 'Hộc tủ tivi trang trí', norm_id: 'R05', unit: 'M2', qty: 8.51, mdf17: 4.25, back6: 2.13, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 17871000, p_tl: 13190500, p_ply: 17020000 },
    { row: 6, room: 'I. Phòng khách', name: 'Ốp phẳng trang trí', norm_id: 'R06', unit: 'M2', qty: 5.71, mdf17: 2.28, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 6281000, p_tl: 4282500, p_ply: 5995500 },
    { row: 8, room: 'II. Phòng bếp', name: 'Tủ bếp trên (cánh Acrylic)', norm_id: 'R08', unit: 'Md', qty: 3.77, mdf17: 2.79, back6: 1.06, pvc17: 0, pvc6: 0, acr: 1.13, ply17: 0, p_ac: 13949000, p_tl: 10179000, p_ply: 13195000 },
    { row: 9, room: 'II. Phòng bếp', name: 'Tủ bếp dưới (thùng Pitech cánh Acrylic)', norm_id: 'R09', unit: 'Md', qty: 3.77, mdf17: 0, back6: 0, pvc17: 4.30, pvc6: 0, acr: 1.17, ply17: 0, p_ac: 13195000, p_tl: 13195000, p_ply: 13195000 },
    { row: 10, room: 'II. Phòng bếp', name: 'Tủ bếp trên kịch trần (cánh Acrylic)', norm_id: 'R10', unit: 'Md', qty: 3.77, mdf17: 4.34, back6: 1.02, pvc17: 0, pvc6: 0, acr: 1.09, ply17: 0, p_ac: 13949000, p_tl: 10179000, p_ply: 13195000 },
    { row: 11, room: 'II. Phòng bếp', name: 'Bao tủ lạnh kết hợp thùng trên', norm_id: 'R11', unit: 'M2', qty: 3.0, mdf17: 2.70, back6: 0.60, pvc17: 0, pvc6: 0, acr: 0.50, ply17: 0, p_ac: 8100000, p_tl: 5700000, p_ply: 7500000 },
    { row: 12, room: 'II. Phòng bếp', name: 'Tủ kho có đợt (cánh Acrylic)', norm_id: 'R12', unit: 'M2', qty: 1.35, mdf17: 1.62, back6: 0.47, pvc17: 0, pvc6: 0, acr: 0.54, ply17: 0, p_ac: 6007500, p_tl: 4522500, p_ply: 5710500 },
    { row: 13, room: 'II. Phòng bếp', name: 'Bàn đảo (cánh Acrylic)', norm_id: 'R13', unit: 'Md', qty: 1.2, mdf17: 1.80, back6: 0.30, pvc17: 0, pvc6: 0, acr: 0.42, ply17: 0, p_ac: 5580000, p_tl: 4200000, p_ply: 5460000 },
    { row: 15, room: 'III. Phòng WC tầng 1', name: 'Tủ lavabo treo (nhựa PVC)', norm_id: 'R15', unit: 'Md', qty: 1.32, mdf17: 0, back6: 0, pvc17: 0.86, pvc6: 0, acr: 0, ply17: 0, p_ac: 4620000, p_tl: 4026000, p_ply: 4620000 },
    { row: 16, room: 'III. Phòng WC tầng 1', name: 'Tủ lavabo đặt (nhựa PVC)', norm_id: 'R16', unit: 'Md', qty: 1.39, mdf17: 0, back6: 0, pvc17: 1.53, pvc6: 0, acr: 0, ply17: 0, p_ac: 5143000, p_tl: 4517500, p_ply: 5143000 },
    { row: 17, room: 'III. Phòng WC tầng 1', name: 'Gương soi viền nhôm đen', norm_id: 'MIR', unit: 'Cái', qty: 1.0, mdf17: 0, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 1200000, p_tl: 1200000, p_ply: 1200000 },
    { row: 18, room: 'III. Phòng WC tầng 1', name: 'Ốp phẳng trang trí (nhựa PVC)', norm_id: 'R18', unit: 'M2', qty: 4.71, mdf17: 0, back6: 0, pvc17: 1.88, pvc6: 0, acr: 0, ply17: 0, p_ac: 5416500, p_tl: 4003500, p_ply: 5416500 },
    { row: 20, room: 'IV. Phòng ngủ Master', name: 'Giường ngủ bọc da cao cấp', norm_id: 'R20', unit: 'Cái', qty: 1.0, mdf17: 0, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 2.0, p_ac: 15000000, p_tl: 15000000, p_ply: 15000000 },
    { row: 21, room: 'IV. Phòng ngủ Master', name: 'Ốp lam sau giường ngủ', norm_id: 'R21', unit: 'M2', qty: 3.7, mdf17: 1.92, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 6290000, p_tl: 4810000, p_ply: 6253000 },
    { row: 22, room: 'IV. Phòng ngủ Master', name: 'Táp đầu giường bo góc (2 cái)', norm_id: 'R22', unit: 'Cái', qty: 2.0, mdf17: 0.70, back6: 0.16, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 2400000, p_tl: 1600000, p_ply: 2100000 },
    { row: 23, room: 'IV. Phòng ngủ Master', name: 'Ốp vân đá sau tivi', norm_id: 'R06', unit: 'M2', qty: 3.63, mdf17: 1.45, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 4719000, p_tl: 3267000, p_ply: 4356000 },
    { row: 24, room: 'IV. Phòng ngủ Master', name: 'Bàn trang điểm', norm_id: 'R24', unit: 'Md', qty: 1.65, mdf17: 0.99, back6: 0.25, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 4455000, p_tl: 3300000, p_ply: 4125000 },
    { row: 25, room: 'IV. Phòng ngủ Master', name: 'Ốp trang trí sau bàn phấn', norm_id: 'R06', unit: 'M2', qty: 4.46, mdf17: 1.78, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 5352000, p_tl: 3345000, p_ply: 4683000 },
    { row: 26, room: 'IV. Phòng ngủ Master', name: 'Đợt trang trí (2 cái)', norm_id: 'R26', unit: 'Cái', qty: 2.0, mdf17: 0.16, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 700000, p_tl: 400000, p_ply: 600000 },
    { row: 27, room: 'IV. Phòng ngủ Master', name: 'Tủ quần áo (trừ cánh kính)', norm_id: 'R27', unit: 'M2', qty: 12.21, mdf17: 11.36, back6: 4.40, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 32967000, p_tl: 24420000, p_ply: 30525000 },
    { row: 28, room: 'IV. Phòng ngủ Master', name: 'Cánh kính tủ áo khung nhôm', norm_id: 'GLS', unit: 'M2', qty: 3.66, mdf17: 0, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 6222000, p_tl: 6222000, p_ply: 6222000 },
    { row: 29, room: 'IV. Phòng ngủ Master', name: 'Cửa ra vào giấu khuôn', norm_id: 'R29', unit: 'Bộ', qty: 1.0, mdf17: 1.20, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 4200000, p_tl: 3500000, p_ply: 4000000 },
    { row: 30, room: 'IV. Phòng ngủ Master', name: 'Tủ lavabo nhựa PVC', norm_id: 'R15', unit: 'Md', qty: 1.6, mdf17: 0, back6: 0, pvc17: 1.04, pvc6: 0, acr: 0, ply17: 0, p_ac: 5920000, p_tl: 5200000, p_ply: 5920000 },
    { row: 31, room: 'IV. Phòng ngủ Master', name: 'Gương soi mài cạnh', norm_id: 'MIR', unit: 'Cái', qty: 1.0, mdf17: 0, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 1200000, p_tl: 1200000, p_ply: 1200000 },
    { row: 33, room: 'V. Phòng ngủ con gái', name: 'Giường ngủ bo cong', norm_id: 'R33', unit: 'Cái', qty: 1.0, mdf17: 3.40, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 8000000, p_tl: 6200000, p_ply: 7800000 },
    { row: 34, room: 'V. Phòng ngủ con gái', name: 'Ốp phẳng sau giường', norm_id: 'R06', unit: 'M2', qty: 2.46, mdf17: 0.98, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 2952000, p_tl: 1845000, p_ply: 2583000 },
    { row: 35, room: 'V. Phòng ngủ con gái', name: 'Táp đầu giường bo góc', norm_id: 'R22', unit: 'Cái', qty: 1.0, mdf17: 0.45, back6: 0.10, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 1200000, p_tl: 800000, p_ply: 1050000 },
    { row: 36, room: 'V. Phòng ngủ con gái', name: 'Bàn trang điểm treo bo góc', norm_id: 'R24', unit: 'Md', qty: 1.0, mdf17: 0.60, back6: 0.15, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 2300000, p_tl: 1700000, p_ply: 2200000 },
    { row: 37, room: 'V. Phòng ngủ con gái', name: 'Gương soi LED', norm_id: 'MIR', unit: 'Cái', qty: 1.0, mdf17: 0, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 1200000, p_tl: 1200000, p_ply: 1200000 },
    { row: 38, room: 'V. Phòng ngủ con gái', name: 'Đôn ngồi đệm da', norm_id: 'STL', unit: 'Cái', qty: 1.0, mdf17: 0, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 700000, p_tl: 700000, p_ply: 700000 },
    { row: 39, room: 'V. Phòng ngủ con gái', name: 'Bàn học treo bo góc', norm_id: 'R24', unit: 'Md', qty: 1.8, mdf17: 1.08, back6: 0.27, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 4140000, p_tl: 3060000, p_ply: 3960000 },
    { row: 40, room: 'V. Phòng ngủ con gái', name: 'Tủ quần áo kịch trần', norm_id: 'R27', unit: 'M2', qty: 4.51, mdf17: 4.74, back6: 1.62, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 12177000, p_tl: 9020000, p_ply: 11275000 },
    { row: 42, room: 'VI. Phòng ngủ con trai', name: 'Giường ngủ bo cong', norm_id: 'R33', unit: 'Cái', qty: 1.0, mdf17: 3.40, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 8000000, p_tl: 6200000, p_ply: 7800000 },
    { row: 43, room: 'VI. Phòng ngủ con trai', name: 'Ốp phẳng sau giường', norm_id: 'R06', unit: 'M2', qty: 4.47, mdf17: 1.79, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 4917000, p_tl: 3352500, p_ply: 4693500 },
    { row: 44, room: 'VI. Phòng ngủ con trai', name: 'Táp đầu giường 01', norm_id: 'R22', unit: 'Cái', qty: 1.0, mdf17: 0.35, back6: 0.08, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 1100000, p_tl: 800000, p_ply: 1050000 },
    { row: 45, room: 'VI. Phòng ngủ con trai', name: 'Táp đầu giường 02 dài', norm_id: 'R22', unit: 'Cái', qty: 1.0, mdf17: 0.70, back6: 0.15, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 3500000, p_tl: 2500000, p_ply: 3300000 },
    { row: 46, room: 'VI. Phòng ngủ con trai', name: 'Bàn học treo bo góc', norm_id: 'R24', unit: 'Md', qty: 2.93, mdf17: 1.76, back6: 0.44, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 7032000, p_tl: 4981000, p_ply: 6446000 },
    { row: 47, room: 'VI. Phòng ngủ con trai', name: 'Giá sách không cánh', norm_id: 'R47', unit: 'Cái', qty: 1.0, mdf17: 0.45, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 2400000, p_tl: 1700000, p_ply: 2200000 },
    { row: 48, room: 'VI. Phòng ngủ con trai', name: 'Đợt sách treo (Bỏ sót giá)', norm_id: 'R48', unit: 'Cái', qty: 1.0, mdf17: 0.15, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 0, p_tl: 0, p_ply: 0 },
    { row: 49, room: 'VI. Phòng ngủ con trai', name: 'Tủ quần áo bo góc', norm_id: 'R27', unit: 'M2', qty: 5.72, mdf17: 6.01, back6: 2.06, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 15444000, p_tl: 11440000, p_ply: 14300000 },
    { row: 51, room: 'VII. Phòng thờ', name: 'Bộ bàn thờ 2 tầng', norm_id: 'R51', unit: 'Bộ', qty: 1.0, mdf17: 4.50, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 12000000, p_tl: 9000000, p_ply: 11700000 },
    { row: 52, room: 'VII. Phòng thờ', name: 'Ốp CNC bàn thờ (Lỗi gõ cứng)', norm_id: 'R21', unit: 'M2', qty: 6.55, mdf17: 3.41, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 12000000, p_tl: 9000000, p_ply: 11700000 },
    { row: 54, room: 'VIII. Phòng giặt là', name: 'Tủ bao máy giặt sấy (nhựa PVC)', norm_id: 'R54', unit: 'M2', qty: 2.46, mdf17: 0, back6: 0, pvc17: 2.83, pvc6: 0.86, acr: 0, ply17: 0, p_ac: 9348000, p_tl: 8118000, p_ply: 8118000 },
    { row: 55, room: 'VIII. Phòng giặt là', name: 'Tủ lavabo giặt là (nhựa PVC)', norm_id: 'R15', unit: 'Md', qty: 0.9, mdf17: 0, back6: 0, pvc17: 0.85, pvc6: 0, acr: 0, ply17: 0, p_ac: 3870000, p_tl: 3330000, p_ply: 3330000 },
    { row: 56, room: 'VIII. Phòng giặt là', name: 'Gương soi mài cạnh', norm_id: 'MIR', unit: 'Cái', qty: 1.0, mdf17: 0, back6: 0, pvc17: 0, pvc6: 0, acr: 0, ply17: 0, p_ac: 1200000, p_tl: 1200000, p_ply: 1200000 }
  ];

  // HÀM TÍNH TOÁN ĐỊNH MỨC CHO 1 HẠNG MỤC TÙY Ý
  function calculateItemNorm(normId, quantity, customOptions) {
    const norm = STANDARD_CNC_NORMS.find(n => n.id === normId);
    if (!norm) {
      return { error: 'Không tìm thấy định mức quy chuẩn với mã: ' + normId };
    }

    const qty = parseFloat(quantity) || 0;
    const opts = customOptions || {};
    const glassM2 = parseFloat(opts.glassDoorM2) || 0;

    let mdf17 = (norm.core_norm.mdf_17mm || 0) * qty;
    let back6 = (norm.core_norm.back_6mm || 0) * qty;
    let pvc17 = (norm.core_norm.pvc_17mm || 0) * qty;
    let pvc6 = (norm.core_norm.pvc_6mm || 0) * qty;
    let acr = (norm.core_norm.acrylic_sheets || 0) * qty;
    let ply17 = (norm.core_norm.plywood_17mm || 0) * qty;

    // Trừ cánh kính tủ áo (nếu có)
    if (norm.id === 'R27' && glassM2 > 0) {
      const deductionPerM2 = norm.deductions ? norm.deductions.glass_door_m2_reduction : 0.40;
      const reduction = glassM2 * deductionPerM2;
      mdf17 = Math.max(0, mdf17 - reduction);
    }

    return {
      norm_id: norm.id,
      category: norm.category,
      name: norm.name,
      unit: norm.unit,
      quantity: qty,
      glassDoorM2: glassM2,
      result: {
        mdf_17mm: parseFloat(mdf17.toFixed(2)),
        back_6mm: parseFloat(back6.toFixed(2)),
        pvc_17mm: parseFloat(pvc17.toFixed(2)),
        pvc_6mm: parseFloat(pvc6.toFixed(2)),
        acrylic_sheets: parseFloat(acr.toFixed(2)),
        plywood_17mm: parseFloat(ply17.toFixed(2)),
        total_sheets: parseFloat((mdf17 + back6 + pvc17 + pvc6 + acr + ply17).toFixed(2))
      },
      rule_ref: norm.formula_note,
      tech_notes: norm.tech_notes
    };
  }

  // HÀM TẠO GIAO DIỆN VÀ RENDER VÀO DOM
  function render(containerId) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) {
      console.warn('[W07] Container element not found:', containerId);
      return;
    }

    const html = `
      <div id="w07-cnc-app" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); max-width: 1300px; margin: 0 auto; line-height: 1.5;">
        
        <!-- HEADER -->
        <div style="border-bottom: 2px solid #334155; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;">W07 - FLASH WORKER</span>
              <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #38bdf8;">ĐỊNH MỨC TẤM CẮT CNC THỰC CHIẾN & KIỂM TOÁN NHÀ ANH NAM</h2>
            </div>
            <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">
              Quy chuẩn Mục 24 Sổ Tay 03 | Khổ ván chuẩn: <strong>1220×2440 mm = 2.9768 m²/tấm</strong> | Bản quyền Giám Đốc Nguyễn Viết Nghĩa
            </p>
          </div>
          <div style="text-align: right; background: #1e293b; padding: 8px 14px; border-radius: 8px; border: 1px solid #475569;">
            <div style="font-size: 11px; color: #94a3b8;">ĐƠN VỊ PHÁP LÝ PG HOME LUXURY</div>
            <div style="font-weight: 700; color: #e2e8f0; font-size: 13px;">HKD 042203002931 • TP. HÀ TĨNH</div>
            <div style="font-size: 12px; color: #38bdf8; font-weight: 600;">Hotline: 0986.722.324</div>
          </div>
        </div>

        <!-- TABS NAVIGATION -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 8px; overflow-x: auto;">
          <button id="w07-tab-btn-calc" onclick="window.PG_Modules_W07.switchTab('calc')" style="background: #2563eb; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s;">⚡ BỘ MÁY TÍNH ĐỊNH MỨC CNC</button>
          <button id="w07-tab-btn-audit" onclick="window.PG_Modules_W07.switchTab('audit')" style="background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s;">📊 KIỂM TOÁN NHÀ ANH NAM (3 CẤP GIÁ)</button>
          <button id="w07-tab-btn-errors" onclick="window.PG_Modules_W07.switchTab('errors')" style="background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s;">⚠️ 5 LỖI CỐT TỬ & BÀI HỌC MỤC 24.2</button>
          <button id="w07-tab-btn-norms" onclick="window.PG_Modules_W07.switchTab('norms')" style="background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; transition: all 0.2s;">📐 BẢNG TRA ĐỊNH MỨC CHUẨN XƯỞNG</button>
        </div>

        <!-- TAB 1: BỘ MÁY TÍNH TƯƠNG TÁC -->
        <div id="w07-tab-calc" style="display: block;">
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #38bdf8; font-size: 16px; display: flex; align-items: center; gap: 8px;">
              <span>🧮</span> TÍNH TOÁN NHANH SỐ TẤM VÁN CẮT CNC CHO HẠNG MỤC MỚI
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 14px;">
              <div>
                <label style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">Hạng mục / Kết cấu quy chuẩn:</label>
                <select id="w07-input-norm" onchange="window.PG_Modules_W07.onNormSelected()" style="width: 100%; background: #0f172a; border: 1px solid #475569; color: #f8fafc; padding: 8px 10px; border-radius: 6px; font-size: 13px;">
                  ${STANDARD_CNC_NORMS.map(n => `<option value="${n.id}">[${n.id}] ${n.name} (${n.unit})</option>`).join('')}
                </select>
              </div>

              <div>
                <label id="w07-label-qty" style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px; font-weight: 600;">Khối lượng thiết kế (Md):</label>
                <input id="w07-input-qty" type="number" step="0.01" value="3.77" oninput="window.PG_Modules_W07.runLiveCalc()" style="width: 100%; background: #0f172a; border: 1px solid #475569; color: #f8fafc; padding: 8px 10px; border-radius: 6px; font-size: 13px;" />
              </div>

              <div id="w07-glass-wrapper" style="display: none;">
                <label style="display: block; font-size: 12px; color: #f59e0b; margin-bottom: 4px; font-weight: 600;">Diện tích cánh kính trừ ra (M²):</label>
                <input id="w07-input-glass" type="number" step="0.01" value="3.66" oninput="window.PG_Modules_W07.runLiveCalc()" style="width: 100%; background: #0f172a; border: 1px solid #f59e0b; color: #f8fafc; padding: 8px 10px; border-radius: 6px; font-size: 13px;" />
              </div>
            </div>

            <div id="w07-calc-note" style="margin-top: 12px; font-size: 12px; color: #cbd5e1; background: #0f172a; padding: 10px 14px; border-radius: 6px; border-left: 3px solid #38bdf8;">
              Công thức áp dụng: <strong>3.77 md × 1.45 = 5.47 ≈ 5.5 tấm</strong> (Thùng Pitech 4.30 tấm + Cánh Acrylic 1.17 tấm).
            </div>
          </div>

          <!-- KẾT QUẢ TÍNH TOÁN TẤM VÁN -->
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h4 style="margin: 0; font-size: 15px; color: #e2e8f0; font-weight: 700;">KẾT QUẢ ĐỊNH MỨC PHÔI TẤM (KHỔ 1220×2440):</h4>
              <span id="w07-calc-badge" style="background: #059669; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">ĐÃ TÍNH TOÁN THEO MỤC 24.1</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px;" id="w07-calc-cards">
              <!-- Render dynamic cards via JS -->
            </div>
          </div>
        </div>

        <!-- TAB 2: KIỂM TOÁN NHÀ ANH NAM (3 CẤP GIÁ) -->
        <div id="w07-tab-audit" style="display: none;">
          <!-- TỔNG KẾT VẬT TƯ DỰ ÁN ANH NAM -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;">
            <div style="background: #1e293b; border: 1px solid #3b82f6; padding: 14px; border-radius: 8px;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">MDF 17MM CHỐNG ẨM</div>
              <div style="font-size: 24px; font-weight: 800; color: #38bdf8; margin: 4px 0;">75.87 <span style="font-size: 13px; font-weight: normal; color: #94a3b8;">tấm</span></div>
              <div style="font-size: 11px; color: #cbd5e1;">226 m² phôi cắt CNC</div>
            </div>

            <div style="background: #1e293b; border: 1px solid #64748b; padding: 14px; border-radius: 8px;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">HẬU MDF 6MM</div>
              <div style="font-size: 24px; font-weight: 800; color: #94a3b8; margin: 4px 0;">15.95 <span style="font-size: 13px; font-weight: normal; color: #64748b;">tấm</span></div>
              <div style="font-size: 11px; color: #94a3b8;">Hậu tủ & đáy hộc kéo</div>
            </div>

            <div style="background: #1e293b; border: 1px solid #10b981; padding: 14px; border-radius: 8px;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">NHỰA ĐẶC PVC PITECH 17MM</div>
              <div style="font-size: 24px; font-weight: 800; color: #34d399; margin: 4px 0;">13.29 <span style="font-size: 13px; font-weight: normal; color: #94a3b8;">tấm</span></div>
              <div style="font-size: 11px; color: #cbd5e1;">Bếp dưới + Lavabo + Máy giặt</div>
            </div>

            <div style="background: #1e293b; border: 1px solid #ec4899; padding: 14px; border-radius: 8px;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">CÁNH ACRYLIC NOLINE</div>
              <div style="font-size: 24px; font-weight: 800; color: #f472b6; margin: 4px 0;">4.85 <span style="font-size: 13px; font-weight: normal; color: #94a3b8;">tấm</span></div>
              <div style="font-size: 11px; color: #cbd5e1;">~10.83 m² cánh nhà máy</div>
            </div>

            <div style="background: #1e293b; border: 1px solid #f59e0b; padding: 14px; border-radius: 8px;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600;">PLYWOOD A1 17MM</div>
              <div style="font-size: 24px; font-weight: 800; color: #fbbf24; margin: 4px 0;">2.00 <span style="font-size: 13px; font-weight: normal; color: #94a3b8;">tấm</span></div>
              <div style="font-size: 11px; color: #cbd5e1;">Tạo dáng giường Master bọc da</div>
            </div>
          </div>

          <!-- BẢNG SO SÁNH 3 CẤP VẬT LIỆU & CHỐT CHẶN COST 54% -->
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 14px 0; font-size: 16px; color: #38bdf8;">ĐỐI SOÁT DOANH THU 3 CẤP & CHỐT CHẶN CHI PHÍ COST 54%</h4>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                <thead>
                  <tr style="background: #0f172a; color: #94a3b8; border-bottom: 2px solid #334155;">
                    <th style="padding: 10px 12px;">CẤP VẬT LIỆU</th>
                    <th style="padding: 10px 12px; text-align: right;">DOANH THU BÁO GIÁ</th>
                    <th style="padding: 10px 12px; text-align: right;">VẬT TƯ THỰC TẾ</th>
                    <th style="padding: 10px 12px; text-align: right;">CÔNG THỢ (15%)</th>
                    <th style="padding: 10px 12px; text-align: right;">TỔNG COST</th>
                    <th style="padding: 10px 12px; text-align: center;">TỶ LỆ COST</th>
                    <th style="padding: 10px 12px;">ĐÁNH GIÁ CHỐT CHẶN 54%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">1. Gỗ An Cường</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700;">314,797,000 đ</td>
                    <td style="padding: 10px 12px; text-align: right;">129,316,000 đ (41.1%)</td>
                    <td style="padding: 10px 12px; text-align: right;">43,316,250 đ (13.8%)</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 600;">172,632,250 đ</td>
                    <td style="padding: 10px 12px; text-align: center;"><span style="background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 700;">54.84%</span></td>
                    <td style="padding: 10px 12px; color: #34d399; font-weight: 600;">✅ ĐẠT CHUẨN AN TOÀN (Lãi ròng 18% - 20%)</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px 12px; font-weight: 700; color: #f59e0b;">2. Gỗ Thái Lan</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #f59e0b;">
                      245,426,000 đ<br/>
                      <span style="font-size: 11px; color: #ef4444;">(-22.04% vs AC | Ô L57 trống)</span>
                    </td>
                    <td style="padding: 10px 12px; text-align: right;">108,500,000 đ (44.2%)</td>
                    <td style="padding: 10px 12px; text-align: right;">33,800,000 đ (13.8%)</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 600;">142,300,000 đ</td>
                    <td style="padding: 10px 12px; text-align: center;"><span style="background: #7f1d1d; color: #f87171; padding: 2px 8px; border-radius: 4px; font-weight: 700;">57.98%</span></td>
                    <td style="padding: 10px 12px; color: #f87171; font-weight: 600;">⚠️ CẢNH BÁO (>54%): Co hẹp lợi nhuận ròng</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 12px; font-weight: 700; color: #e2e8f0;">3. Plywood A1</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700;">
                      299,360,000 đ<br/>
                      <span style="font-size: 11px; color: #94a3b8;">(Sau khi cộng 15M N20)</span>
                    </td>
                    <td style="padding: 10px 12px; text-align: right;">122,800,000 đ (41.0%)</td>
                    <td style="padding: 10px 12px; text-align: right;">41,200,000 đ (13.8%)</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 600;">164,000,000 đ</td>
                    <td style="padding: 10px 12px; text-align: center;"><span style="background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 700;">54.78%</span></td>
                    <td style="padding: 10px 12px; color: #34d399; font-weight: 600;">✅ ĐẠT CHUẨN AN TOÀN (Lãi ròng ~19%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- BẢNG CHI TIẾT CÁC HẠNG MỤC CÔNG TRÌNH ANH NAM -->
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <h4 style="margin: 0; font-size: 15px; color: #e2e8f0;">CHI TIẾT 28 HẠNG MỤC & SỐ LƯỢNG TẤM CNC BÓC TÁCH:</h4>
              <button onclick="window.PG_Modules_W07.exportReport()" style="background: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">📋 COPY BÁO CÁO CHO BGĐ</button>
            </div>
            
            <div style="max-height: 480px; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
                <thead style="position: sticky; top: 0; background: #0f172a; z-index: 2;">
                  <tr style="border-bottom: 2px solid #334155; color: #94a3b8;">
                    <th style="padding: 8px;">Dòng</th>
                    <th style="padding: 8px;">Không Gian</th>
                    <th style="padding: 8px;">Tên Hạng Mục</th>
                    <th style="padding: 8px; text-align: center;">ĐVT</th>
                    <th style="padding: 8px; text-align: right;">KL</th>
                    <th style="padding: 8px; text-align: right; color: #38bdf8;">MDF 17</th>
                    <th style="padding: 8px; text-align: right;">Hậu 6</th>
                    <th style="padding: 8px; text-align: right; color: #34d399;">PVC 17</th>
                    <th style="padding: 8px; text-align: right; color: #f472b6;">Acrylic</th>
                    <th style="padding: 8px; text-align: right;">Tiền AC (đ)</th>
                    <th style="padding: 8px; text-align: right; color: #f59e0b;">Tiền TL (đ)</th>
                  </tr>
                </thead>
                <tbody>
                  ${DETAILED_ITEMS.map((it, idx) => `
                    <tr style="border-bottom: 1px solid #334155; background: ${idx % 2 === 0 ? 'rgba(30,41,59,0.5)' : 'transparent'};">
                      <td style="padding: 7px 8px; color: #64748b;">R${it.row}</td>
                      <td style="padding: 7px 8px; color: #cbd5e1;">${it.room}</td>
                      <td style="padding: 7px 8px; font-weight: 600; color: #f8fafc;">${it.name}</td>
                      <td style="padding: 7px 8px; text-align: center; color: #94a3b8;">${it.unit}</td>
                      <td style="padding: 7px 8px; text-align: right; font-weight: 600;">${it.qty}</td>
                      <td style="padding: 7px 8px; text-align: right; color: #38bdf8; font-weight: 600;">${it.mdf17 > 0 ? it.mdf17 : '-'}</td>
                      <td style="padding: 7px 8px; text-align: right; color: #94a3b8;">${it.back6 > 0 ? it.back6 : '-'}</td>
                      <td style="padding: 7px 8px; text-align: right; color: #34d399; font-weight: 600;">${it.pvc17 > 0 ? it.pvc17 : '-'}</td>
                      <td style="padding: 7px 8px; text-align: right; color: #f472b6; font-weight: 600;">${it.acr > 0 ? it.acr : '-'}</td>
                      <td style="padding: 7px 8px; text-align: right; color: #cbd5e1;">${it.p_ac.toLocaleString('vi-VN')}</td>
                      <td style="padding: 7px 8px; text-align: right; color: #f59e0b;">${it.p_tl.toLocaleString('vi-VN')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 3: 5 LỖI KIỂM TOÁN CỐT TỬ -->
        <div id="w07-tab-errors" style="display: none;">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${AUDIT_PROJECT_NAM.critical_errors.map((err, i) => `
              <div style="background: #1e293b; border-left: 4px solid ${i === 4 ? '#10b981' : (i < 2 ? '#ef4444' : '#f59e0b')}; border-radius: 8px; padding: 16px; border-top: 1px solid #334155; border-right: 1px solid #334155; border-bottom: 1px solid #334155;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <h4 style="margin: 0; font-size: 15px; color: ${i === 4 ? '#34d399' : (i < 2 ? '#f87171' : '#fbbf24')}; font-weight: 700;">
                    ${i + 1}. [${err.id}] ${err.title}
                  </h4>
                  <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: ${i === 4 ? '#065f46' : (i < 2 ? '#7f1d1d' : '#78350f')}; color: white; font-weight: 600;">
                    ${i === 4 ? 'TUÂN THỦ CHUẨN' : (i < 2 ? 'LỖI NGHIÊM TRỌNG' : 'LỖI ĐƠN GIÁ')}
                  </span>
                </div>
                <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.6;">${err.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- TAB 4: BẢNG TRA ĐỊNH MỨC CHUẨN XƯỞNG (MỤC 24.1) -->
        <div id="w07-tab-norms" style="display: none;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 16px;">
            ${STANDARD_CNC_NORMS.map(norm => `
              <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div>
                    <span style="background: #0284c7; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">${norm.id}</span>
                    <span style="color: #94a3b8; font-size: 12px; margin-left: 6px;">${norm.category}</span>
                    <h4 style="margin: 4px 0 0 0; color: #38bdf8; font-size: 14px;">${norm.name}</h4>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 16px; font-weight: 800; color: #f8fafc;">${norm.core_norm.total_sheets} <span style="font-size: 11px; color: #94a3b8;">tấm/${norm.unit}</span></div>
                  </div>
                </div>

                <div style="background: #0f172a; padding: 10px; border-radius: 6px; font-size: 12px; margin-top: 10px;">
                  <div style="color: #fbbf24; font-weight: 600; margin-bottom: 4px;">📌 Công thức: ${norm.formula_note}</div>
                  <div style="color: #94a3b8;">💡 Kỹ thuật: ${norm.tech_notes}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;

    // Run initial live calculation
    runLiveCalc();
  }

  // EVENT KHI CHỌN HẠNG MỤC TRONG SELECT BOX
  function onNormSelected() {
    const sel = document.getElementById('w07-input-norm');
    const glassWrap = document.getElementById('w07-glass-wrapper');
    const labelQty = document.getElementById('w07-label-qty');
    const inputQty = document.getElementById('w07-input-qty');
    if (!sel) return;

    const normId = sel.value;
    const norm = STANDARD_CNC_NORMS.find(n => n.id === normId);
    if (!norm) return;

    if (labelQty) labelQty.innerText = `Khối lượng thiết kế (${norm.unit}):`;

    // Hiển thị ô trừ cánh kính nếu là tủ áo R27
    if (glassWrap) {
      glassWrap.style.display = (normId === 'R27') ? 'block' : 'none';
    }

    // Gợi ý khối lượng mặc định theo dự án Anh Nam
    if (normId === 'R09' || normId === 'R08' || normId === 'R10') {
      inputQty.value = '3.77';
    } else if (normId === 'R27') {
      inputQty.value = '12.21';
    } else if (normId === 'R04') {
      inputQty.value = '4.6';
    } else if (normId === 'R05') {
      inputQty.value = '8.51';
    } else if (normId === 'R06') {
      inputQty.value = '5.71';
    } else if (normId === 'R33') {
      inputQty.value = '1.0';
    }

    runLiveCalc();
  }

  // TÍNH TOÁN REALTIME VÀ RENDER KẾT QUẢ
  function runLiveCalc() {
    const sel = document.getElementById('w07-input-norm');
    const inputQty = document.getElementById('w07-input-qty');
    const inputGlass = document.getElementById('w07-input-glass');
    const cardsContainer = document.getElementById('w07-calc-cards');
    const noteEl = document.getElementById('w07-calc-note');

    if (!sel || !inputQty || !cardsContainer) return;

    const normId = sel.value;
    const qty = parseFloat(inputQty.value) || 0;
    const glassM2 = inputGlass ? (parseFloat(inputGlass.value) || 0) : 0;

    const calc = calculateItemNorm(normId, qty, { glassDoorM2: glassM2 });
    if (calc.error) return;

    if (noteEl) {
      let deductionText = '';
      if (normId === 'R27' && glassM2 > 0) {
        deductionText = ` (Đã trừ ${ (glassM2 * 0.40).toFixed(2) } tấm ván 17mm cho ${glassM2} m² cánh kính)`;
      }
      noteEl.innerHTML = `Quy chuẩn: <strong>${calc.rule_ref}</strong>${deductionText}.<br/><span style="color:#94a3b8;">${calc.tech_notes}</span>`;
    }

    // Render cards
    const res = calc.result;
    const cards = [
      { label: 'TỔNG TẤM VÁN', val: res.total_sheets, color: '#f8fafc', bg: '#334155', border: '#475569', sub: 'Tất cả loại ván' },
      { label: 'MDF 17MM', val: res.mdf_17mm, color: '#38bdf8', bg: '#0c4a6e', border: '#0284c7', sub: 'Thùng / Cánh gỗ' },
      { label: 'HẬU MDF 6MM', val: res.back_6mm, color: '#cbd5e1', bg: '#1e293b', border: '#475569', sub: 'Hậu & Đáy hộc' },
      { label: 'PVC PITECH 17MM', val: res.pvc_17mm, color: '#34d399', bg: '#064e3b', border: '#059669', sub: 'Nhựa chống nước' },
      { label: 'CÁNH ACRYLIC', val: res.acrylic_sheets, color: '#f472b6', bg: '#831843', border: '#db2777', sub: 'Cánh bóng gương' },
      { label: 'PLYWOOD A1', val: res.plywood_17mm, color: '#fbbf24', bg: '#78350f', border: '#d97706', sub: 'Plywood chịu lực' }
    ];

    cardsContainer.innerHTML = cards.map(c => `
      <div style="background: ${c.bg}; border: 1px solid ${c.border}; border-radius: 8px; padding: 12px; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #cbd5e1; letter-spacing: 0.5px;">${c.label}</div>
        <div style="font-size: 26px; font-weight: 800; color: ${c.color}; margin: 4px 0;">${c.val} <span style="font-size: 12px; font-weight: normal; color: #94a3b8;">tấm</span></div>
        <div style="font-size: 11px; color: #94a3b8;">${c.sub}</div>
      </div>
    `).join('');
  }

  // CHUYỂN ĐỔI TAB GIAO DIỆN
  function switchTab(tabName) {
    const tabs = ['calc', 'audit', 'errors', 'norms'];
    tabs.forEach(t => {
      const el = document.getElementById(`w07-tab-${t}`);
      const btn = document.getElementById(`w07-tab-btn-${t}`);
      if (el) el.style.display = (t === tabName) ? 'block' : 'none';
      if (btn) {
        if (t === tabName) {
          btn.style.background = '#2563eb';
          btn.style.color = '#ffffff';
          btn.style.border = 'none';
        } else {
          btn.style.background = '#1e293b';
          btn.style.color = '#94a3b8';
          btn.style.border = '1px solid #334155';
        }
      }
    });
  }

  // XUẤT BÁO CÁO NHANH DẠNG TEXT ĐỂ COPY
  function exportReport() {
    const p = AUDIT_PROJECT_NAM;
    let txt = `========================================================\n`;
    txt += `BÁO CÁO ĐỊNH MỨC CẮT CNC & ĐỐI SOÁT 3 CẤP - NHÀ ANH NAM\n`;
    txt += `Quy chuẩn: Mục 24 Sổ Tay 03 - Ban Giám Đốc PG Home Luxury\n`;
    txt += `========================================================\n\n`;
    txt += `1. TỔNG SỐ TẤM PHÔI VÁN CẮT CNC (Khổ 1220×2440 = 2.9768 m²):\n`;
    txt += ` - Ván MDF 17mm chống ẩm: ${p.totals.mdf_17mm} tấm\n`;
    txt += ` - Hậu MDF 6mm / Đáy ngăn kéo: ${p.totals.back_6mm} tấm\n`;
    txt += ` - Nhựa đặc PVC Pitech 17mm: ${p.totals.pvc_17mm} tấm\n`;
    txt += ` - Nhựa hậu PVC 6mm: ${p.totals.pvc_6mm} tấm\n`;
    txt += ` - Cánh Acrylic Noline nhà máy: ${p.totals.acrylic_sheets} tấm (~${p.totals.acrylic_m2} m²)\n`;
    txt += ` - Plywood A1 17mm: ${p.totals.plywood_17mm} tấm\n`;
    txt += ` - Cánh kính khung nhôm: ${p.totals.glass_door_m2} m²\n\n`;
    txt += `2. SO SÁNH 3 CẤP VẬT LIỆU & CHỐT CHẶN 54%:\n`;
    txt += ` - Cấp 1 (An Cường): 314,797,000 đ | Cost: 54.84% -> ĐẠT CHUẨN (Lãi ròng 18%-20%)\n`;
    txt += ` - Cấp 2 (Thái Lan): 245,426,000 đ (-22.04%) | Cost: 57.98% -> CẢNH BÁO (>54% do giảm cào bằng Acrylic/PVC)\n`;
    txt += ` - Cấp 3 (Plywood A1): 299,360,000 đ | Cost: 54.78% -> ĐẠT CHUẨN\n\n`;
    txt += `3. NGUYÊN TẮC VÀNG TỦ BẾP DƯỚI (R09):\n`;
    txt += ` 3.77 md × 1.45 tấm/md = 5.47 ≈ 5.5 tấm (Thùng Pitech 4.30 tấm + Cánh Acrylic 1.17 tấm).\n`;
    txt += ` TUYỆT ĐỐI CẤM BÁO BỪA THÀNH 2.70 TẤM/MD!\n`;
    txt += `========================================================\n`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(() => {
        alert('Đã copy Báo cáo Định mức CNC & Kiểm toán Dự án Nhà Anh Nam vào Clipboard!');
      }).catch(() => {
        prompt('Copy nội dung báo cáo dưới đây:', txt);
      });
    } else {
      prompt('Copy nội dung báo cáo dưới đây:', txt);
    }
  }

  // EXPORT MODULE RA WINDOW
  window.PG_Modules_W07 = {
    id: 'w07_project_anh_nam_cnc_norm',
    title: 'Định mức Tấm Cắt CNC Thực Chiến & Kiểm Toán Nhà Anh Nam',
    standard_norms: STANDARD_CNC_NORMS,
    audit_data: AUDIT_PROJECT_NAM,
    detailed_items: DETAILED_ITEMS,
    calculateItemNorm: calculateItemNorm,
    render: render,
    onNormSelected: onNormSelected,
    runLiveCalc: runLiveCalc,
    switchTab: switchTab,
    exportReport: exportReport
  };

  console.log('[PG Home] Module W07 - Project Anh Nam CNC Norm loaded successfully.');

  // Tự động render nếu có sẵn container #w07-cnc-root
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      const root = document.getElementById('w07-cnc-root');
      if (root) {
        render('w07-cnc-root');
      }
    });
  }
})();
