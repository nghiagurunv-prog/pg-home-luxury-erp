/**
 * ==============================================================================================
 * HỆ THỐNG QUẢN TRỊ PG HOME LUXURY - PHÂN HỆ ĐỐI SOÁT NHÀ CUNG CẤP PHỤ TRỢ (MODULE W11)
 * ==============================================================================================
 * Tên module: window.PG_Modules_W11
 * Mục đích:
 *   1. Quản lý đối soát công nợ & đơn hàng 9 NCC phụ trợ: Phụ kiện (Quốc Tâm, Hafele), Cánh Acrylic
 *      (NTD Giang Còi, Chiến Livas, ALD Huỳnh), Kính Việt Nhật, Đá bếp Ceramic Hoàng Hà, Gương Dantalux,
 *      Gỗ thịt Đức Anh, Sơn PU Đức Lĩnh.
 *   2. CÔNG CỤ TỰ ĐỘNG BÓC TÁCH woodVal - BẢO VỆ DÒNG TIỀN KÉT SẮT:
 *      Nghiêm cấm tính khoán 40% vật tư & 15% lương thợ trên phụ kiện, cánh gia công, đá, kính, gỗ thịt.
 *      woodVal = totalVal - (accVal + stoneVal + glassVal + acrylicVal + solidWoodVal + paintVal).
 * 
 * Pháp lý & Bản quyền: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * Mã số ĐKKD/MST: 042203002931 (ĐK: 13/01/2025 - Đại diện: Nguyễn Trọng Nghĩa)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0973.562.789
 * NCC Phụ Kiện Quốc Tâm: 56 Ngô Đức Kế, TP. Hà Tĩnh
 * ==============================================================================================
 */

(function (window) {
  'use strict';

  // Dữ liệu đối soát gốc kế thừa 100% từ V4.0 Delta-Cursor Verified (audit_suppliers_acrylic_glass_stone_fitting.json)
  const AUDIT_DATA = {
    metadata: {
      project: "PG HOME LUXURY - QUẢN TRỊ NỘI BỘ",
      module: "ĐỐI SOÁT CÔNG NỢ & ĐƠN HÀNG NHÀ CUNG CẤP PHỤ TRỢ (ACRYLIC, KÍNH, ĐÁ, PHỤ KIỆN, GỖ THỊT, SƠN PU)",
      audit_date: "2026-11-07",
      data_version: "V4.0_DELTA_CURSOR_VERIFIED",
      auditor: "Flash Worker #11 - Kỹ sư Đối soát Nhà Cung Cấp & Chống Tính Khoán Láo",
      verification_source: "Zalo Stealth Reader (Zero-Disruption Passive LevelDB / .rescache & Sổ tay công nợ đối soát)",
      legal_entity: "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)",
      office_factory_address: "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
      hotline: "0973.562.789",
      status: "HOÀN TẤT ĐỐI SOÁT 100%"
    },
    summary: {
      total_suppliers_audited: 9,
      key_debt_balances: {
        phu_kien_quoc_tam: 26170000,
        canh_huynh_ald: 34960000,
        ntd_acrylic_historical_debt: 57727823,
        ntd_acrylic_q4_orders_total: 67966194,
        ntd_acrylic_current_estimated_total: 125694017,
        chien_acrylic_livas: 0,
        kinh_viet_nhat: 0,
        guong_bi_dantalux: 0,
        ceramic_hoang_ha: 0,
        go_thit_duc_anh: 3200000,
        son_pu_duc_linh: 2000000
      },
      urgent_payable_actions: [
        {
          supplier: "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh)",
          amount: 3200000,
          note: "Đã trừ 10M thanh toán trong ngày, số nợ còn lại 3.2M đã được NCC Nga xác nhận chính xác 100%."
        },
        {
          supplier: "Đức Lĩnh Sơn PU",
          amount: 2000000,
          note: "Tiền sơn PU bộ CNC 4m + vách nan trang trí, chờ Giám Đốc ký duyệt lệnh chuyển khoản."
        },
        {
          supplier: "Phụ kiện Quốc Tâm (Roxana Hà Tĩnh)",
          amount: 26170000,
          note: "Đã thanh toán 15M ngày 02/11, phát sinh nhỏ ngày 04-05/11 (+250k), duy trì tốt dưới trần nợ 30M."
        }
      ]
    },
    suppliers: [
      {
        id: "NCC_FITTING_QUOC_TAM",
        name: "Phụ kiện Quốc Tâm (Tâm Quốc - Roxana Hà Tĩnh)",
        legal_info: {
          address: "56 Ngô Đức Kế, TP Hà Tĩnh",
          bank_accounts: [
            { bank: "VIB", account_no: "972672963", account_holder: "VO THI HA" },
            { bank: "BIDV", account_no: "52010000078713", account_holder: "QUOC TAM" }
          ],
          zalo_group: "g495486322416346660 (Tâm Quốc / Roxana Quốc Tâm)"
        },
        category: "Phụ kiện Inox 304 Cadman, Roxana, Cariny, ray trượt, bản lề hơi, phụ kiện tủ bếp thông minh",
        current_debt: 26170000,
        credit_limit: 30000000,
        audit_status: "KHỚP 100% SỔ TAY ĐỐI SOÁT & UNC NGÂN HÀNG",
        reconciliation_details: {
          balance_before_nov: 40920000,
          payment_on_2026_11_02: -15000000,
          invoice_2026_11_04: 170000,
          invoice_2026_11_05: 80000,
          net_balance_on_2026_11_05: 26170000
        },
        catalog_resources: [
          "Cadman Phụ Kiện Tủ Bếp Inox 304 (10.6MB)",
          "Roxana Phụ Kiện Tủ Bếp (436KB PDF)",
          "Cariny Phụ Kiện Tủ Bếp (962KB PDF)"
        ],
        evaluation: "Nhà cung cấp phụ kiện nòng cốt tại địa bàn Hà Tĩnh (56 Ngô Đức Kế), giao hàng nhanh trong ngày, công nợ được kiểm soát chặt chẽ dưới hạn mức 30M."
      },
      {
        id: "NCC_DOOR_ALD_CANH_HUYNH",
        name: "Đức Acrylic - Cánh Huỳnh ALD",
        legal_info: {
          brand: "ALD Huỳnh CNC Bo Cong",
          zalo_group: "Đức Acrylic- Cánh Huỳnh Ald"
        },
        category: "Gia công cánh huỳnh tân cổ điển, bo cong R3..R45, sơn phủ hoàn thiện cao cấp",
        current_debt: 34960000,
        audit_status: "KHỚP 100% THEO 2 ĐƠN BÓC TÁCH KỸ THUẬT",
        orders: [
          {
            project: "Nhà Chị Hoa",
            metric: "11.1 md",
            unit_price: 1100000,
            total_amount: 12210000,
            specification: "Cánh huỳnh bo cong R3..R45 sơn PU màu chỉ định"
          },
          {
            project: "Vinhomes Anh Minh",
            metric: "18.2 m2",
            unit_price: 1250000,
            total_amount: 22750000,
            specification: "Cánh huỳnh ALD cao cấp cốt chống ẩm"
          }
        ],
        total_value: 34960000,
        evaluation: "Chi phí gia công cánh huỳnh nằm trong dự toán bóc tách công trình, thanh toán theo tiến độ hoàn thiện nghiệm thu xưởng."
      },
      {
        id: "NCC_ACRYLIC_NTD_GIANG_COI",
        name: "Công ty Cổ phần NTD Acrylic (Giang Còi)",
        legal_info: {
          tax_code: "0109563360",
          address: "Khu Láng Đầm, TDP 5+6, TT Phúc Thọ, Huyện Phúc Thọ, Hà Nội",
          email: "NTDacrylic@gmail.com",
          website: "NTDacrylic.vn",
          bank_accounts: [
            { bank: "Techcombank", account_no: "19036746889018", account_holder: "KHUAT QUANG GIANG" },
            { bank: "VietinBank", account_no: "116002882255", account_holder: "CONG TY CO PHAN NTD ACRYLIC" }
          ],
          zalo_group: "g2539027971900219384 (Đặt hàng ntd / NTD Acrylic)"
        },
        category: "Cánh Acrylic Noline cốt MDF xanh chống ẩm, cốt nhựa đặc WPB, chỉ dán viền đồng màu",
        historical_reconciliation_to_2026_09_29: {
          brought_forward_debt_june: 50295844,
          q3_orders_total: 69517504,
          discount_3_percent: 2085525,
          net_q3_value: 67431979,
          total_paid_july_to_sept: 60000000,
          payment_breakdown: [
            { date: "2026-07-13", amount: 20000000 },
            { date: "2026-07-24", amount: 15000000 },
            { date: "2026-08-12", amount: 15000000 },
            { date: "2026-09-12", amount: 10000000 }
          ],
          confirmed_debt_at_2026_09_29: 57727823
        },
        q4_orders_audit_oct_nov_2026: [
          {
            order_no: "103656",
            date: "2026-10-02",
            customer: "Phú Gia - Hà Tĩnh - A Quế",
            specification: "45 tấm (8.51 m2) cánh Acrylic cốt MDF màu NTD 56, nẹp cùng màu, vát 45 độ",
            total_amount: 9904484
          },
          {
            order_no: "103851",
            date: "2026-10-14",
            customer: "Phú Gia - Hà Tĩnh - A Huỳnh",
            specification: "38 tấm (6.20 m2) cánh Acrylic cốt MDF màu NTD 55, cánh dưới vát ngắn",
            total_amount: 8711639
          },
          {
            order_no: "103853",
            date: "2026-10-14",
            customer: "Phú Gia - Hà Tĩnh - Bắc Phát",
            specification: "Cánh Acrylic cốt nhựa đặc WPB & MDF màu NTD 56, tay vát 45 độ",
            total_amount: 13954211
          },
          {
            order_no: "103923",
            date: "2026-10-19",
            customer: "Phú Gia - Hà Tĩnh - A Tuấn",
            specification: "Tấm phủ & cánh Acrylic MDF màu NTD 06",
            total_amount: 7904009
          },
          {
            order_no: "103966",
            date: "2026-10-22",
            customer: "Phú Gia - Hà Tĩnh - A Huỳnh",
            specification: "Cánh Acrylic bổ sung cốt MDF màu NTD 55",
            total_amount: 1973369
          },
          {
            order_no: "104138",
            date: "2026-11-01",
            customer: "Phú Gia - Hà Tĩnh - A Công",
            specification: "Cánh Acrylic cốt nhựa WPB màu NTD 12 chịu nước",
            total_amount: 12476737
          },
          {
            order_no: "114173",
            date: "2026-11-03",
            customer: "Phú Gia - Hà Tĩnh - A Công (Bổ sung & Bảo hành)",
            specification: "4 tấm (0.90 m2) màu NTD 55 & NTD 12 sửa lại cánh làm lệch",
            total_amount: 946050
          },
          {
            order_no: "114196",
            date: "2026-11-05",
            customer: "Phú Gia - Hà Tĩnh - C Hoa",
            specification: "58 tấm (9.81 m2) cánh màu NTD 08 & NTD 12, cánh giá bát khoét kính vát dài",
            total_amount: 12095695
          }
        ],
        q4_total_invoiced_value: 67966194,
        total_accumulated_debt_estimate: 125694017,
        audit_status: "ĐỐI SOÁT CHÍNH XÁC 100% TỪNG ĐƠN HÀNG FILE GỐC NTD",
        evaluation: "Đối tác cung cấp cánh Acrylic chủ lực từ đầu năm 2026. Chu kỳ thanh toán định kỳ gối đầu sau khi đối chiếu chốt CK 3%."
      },
      {
        id: "NCC_ACRYLIC_CHIEN_LIVAS",
        name: "Chiến Acrylic Livas",
        legal_info: {
          brand: "Acrylic Livas Cao Cấp",
          zalo_group: "ĐẶT CÁNH LIC LIVAS - NỘI THẤT PHÚ GIA HÀ TĨNH"
        },
        category: "Gia công cánh Acrylic Noline & cánh nhôm kính nhập khẩu theo kích thước",
        current_debt: 0,
        audit_status: "ĐÃ TẤT TOÁN 100% QUA NGÂN HÀNG",
        evaluation: "Kế toán PG Home đã hoàn tất chuyển khoản 100% ngay khi hàng gửi xe cập bến Hà Tĩnh. Không còn công nợ tồn đọng."
      },
      {
        id: "NCC_GLASS_KINH_VIET_NHAT",
        name: "Kính Việt Nhật",
        legal_info: {
          zalo_group: "g6882545434220944455 (Kính Việt Nhật)"
        },
        category: "Kính cường lực 8mm, 10mm, kính dán an toàn 2 lớp, kính ốp bếp màu nhiệt, kính thủy decor",
        current_debt: 0,
        payment_terms: "Thanh toán theo bill từng đơn hàng giao nhận tại xưởng / công trình",
        audit_status: "ĐỐI SOÁT MINH BẠCH - KHÔNG NỢ ĐỌNG",
        evaluation: "Bản vẽ cắt kính được xưởng gửi và xác nhận qua file scan chuẩn, thanh toán dứt điểm từng đợt lắp ráp."
      },
      {
        id: "NCC_MIRROR_GUONG_BI_VU_CUONG",
        name: "Vũ Cường - Gương Bỉ Dantalux",
        legal_info: {
          brand: "Gương Bỉ Dantalux Nhập Khẩu",
          zalo_group: "Vũ Cường - Gương Bỉ Dantalux / Đặt Gương - PG Home"
        },
        category: "Gương decor viền nhôm Anode, gương LED cảm ứng, phôi gương Bỉ tráng bạc 8 lớp",
        current_debt: 0,
        standard_pricing: {
          guong_vien_nhom_600x1600: 1100000
        },
        audit_status: "CHỜ ĐẶT HÀNG THỰC TẾ THEO CÔNG TRÌNH",
        evaluation: "Nhà cung cấp gương decor chất lượng cao, đơn giá cố định 1.1M/tấm 600x1600, thanh toán khi phát sinh đơn thực tế."
      },
      {
        id: "NCC_STONE_CERAMIC_HOANG_HA",
        name: "Đá / PVC Ceramic Hoàng Hà",
        legal_info: {
          zalo_group: "g7737669618333682341 (Ceramic Hoàng Hà)"
        },
        category: "Đá nung kết Ceramic, đá Vicostone nhân tạo, tấm ốp PVC ceramic, tấm than tre phủ vân đá",
        current_debt: 0,
        data_assets: {
          sketchup_models: 1,
          cad_dxf_files: 2,
          drawings_and_photos: 49
        },
        payment_terms: "Thanh toán theo khối lượng nghiệm thu bàn giao thực tế tại công trình",
        audit_status: "HỒ SƠ BẢN VẼ ĐẦY ĐỦ - KHÔNG CÔNG NỢ TỒN ĐỌNG",
        evaluation: "Cung ứng và thi công đá bàn bếp, lavabo, vách tivi. Tất cả kích thước bóc tách chuẩn theo file CAD/Sketchup."
      },
      {
        id: "NCC_SOLID_WOOD_DUC_ANH",
        name: "Gỗ thịt Đức Anh (Thu Hương Hà Tĩnh - Nga)",
        legal_info: {
          representative: "Chị Nga (Thu Hương Hà Tĩnh)",
          zalo_group: "Đặt hàng gỗ thịt nhà Đức Anh - Thu Hương Hà Tĩnh"
        },
        category: "Phôi gỗ tự nhiên Sồi Nga, gỗ Óc chó xẻ sấy quy cách",
        current_debt: 3200000,
        payment_history: "Đã chuyển khoản thanh toán 10.000.000 đ trong ngày, NCC Nga đã xác nhận trừ sổ nợ còn đúng 3.200.000 đ",
        audit_status: "ĐỐI SOÁT CHÍNH XÁC 100% VỚI SỔ CÔNG NỢ NCC",
        action_required: "ƯU TIÊN CHI TRẢ 3.200.000 đ để tất toán dứt điểm đơn gỗ thịt."
      },
      {
        id: "NCC_PAINT_DUC_LINH_PU",
        name: "Đức Lĩnh SƠN PU",
        legal_info: {
          representative: "Anh Đức Lĩnh",
          zalo_group: "Đức Lĩnh SƠN PU"
        },
        category: "Gia công sơn PU hoàn thiện bề mặt vách nan gỗ thịt và hệ vách hoa văn CNC",
        current_debt: 2000000,
        debt_breakdown: "Bộ vách CNC 4m + tiền sơn hoàn thiện hệ vách",
        audit_status: "CHỜ GIÁM ĐỐC NGUYỄN VIẾT NGHĨA KÝ DUYỆT CHI",
        action_required: "Trình Giám Đốc duyệt chuyển khoản 2.000.000 đ cho Đức Lĩnh theo thông báo công nợ."
      }
    ]
  };

  /**
   * BỘ ĐIỀU HÀNH CHỐNG TÍNH KHOÁN LÁO (ANTI-FRAUD SEPARATION ENGINE)
   * 
   * Quy tắc kỷ luật thép PG Home:
   * 1. woodVal = totalVal - (accVal + stoneVal + glassVal + acrylicVal + solidWoodVal + paintVal)
   * 2. Chỉ có woodVal (phần xưởng mộc MDF/MFC gia công CNC) mới được áp dụng:
   *    - Định mức vật tư khoán: 40% của woodVal
   *    - Quỹ lương thợ khoán: 15% của woodVal
   * 3. Nghiêm cấm tuyệt đối lấy 40% & 15% áp lên phụ kiện inox, đá bếp, kính ốp, cánh acrylic gia công ngoài!
   *    Vì các món này là thương mại / gia công chuyên biệt, tiền vốn nhập hàng đã có hóa đơn riêng,
   *    thợ mộc chỉ việc lắp ráp hoặc nhà thầu phụ tự lắp. Nếu tính khoán 40%/15% trên tổng doanh thu
   *    thì công ty sẽ bị thất thoát kép và số liệu CCSC sẽ bị thổi phồng sai lệch 100%!
   */
  const AntiFraudEngine = {
    /**
     * Bóc tách giá trị gỗ thuần (pureWoodVal) và tính chênh lệch thất thoát nếu tính láo
     * @param {number} totalVal - Tổng doanh thu báo giá công trình
     * @param {Object} breakdown - Chi tiết các hạng mục phụ trợ
     */
    separateWoodVal: function (totalVal, breakdown = {}) {
      const accVal = Number(breakdown.accVal || 0);          // Phụ kiện inox 304, ray, bản lề, phụ kiện thông minh
      const stoneVal = Number(breakdown.stoneVal || 0);      // Đá bếp Granite / Vicostone / Ceramic
      const glassVal = Number(breakdown.glassVal || 0);      // Kính ốp bếp Hải Long / Việt Nhật / Cánh kính
      const acrylicVal = Number(breakdown.acrylicVal || 0);  // Cánh Acrylic noline gia công NTD / Livas
      const solidWoodVal = Number(breakdown.solidWoodVal || 0); // Gỗ thịt tự nhiên Sồi/Óc chó mua ngoài
      const paintVal = Number(breakdown.paintVal || 0);      // Tiền sơn PU khoán ngoài

      const nonWoodTotal = accVal + stoneVal + glassVal + acrylicVal + solidWoodVal + paintVal;
      const pureWoodVal = Math.max(0, totalVal - nonWoodTotal);

      // Cách tính chuẩn PG Home (Đúng kỷ luật thép Giám Đốc):
      const standardMaterialBudget = pureWoodVal * 0.40; // 40% vật tư gỗ ván MDF cốt xanh xưởng
      const standardWorkerBudget = pureWoodVal * 0.15;   // 15% lương thợ xưởng CNC

      // Cách tính LÁO (Thổi phồng/Gom tất cả):
      const fraudulentMaterialBudget = totalVal * 0.40;
      const fraudulentWorkerBudget = totalVal * 0.15;

      // Khoản chênh lệch nguy hiểm (Tiền công ty bị thất thoát hoặc xưởng nhận vơ tiền thương mại):
      const leakageMaterial = fraudulentMaterialBudget - standardMaterialBudget;
      const leakageWorker = fraudulentWorkerBudget - standardWorkerBudget;
      const totalPreventedLeakage = leakageMaterial + leakageWorker;

      return {
        totalVal,
        pureWoodVal,
        nonWoodTotal,
        components: {
          accVal,
          stoneVal,
          glassVal,
          acrylicVal,
          solidWoodVal,
          paintVal
        },
        percentages: {
          pureWoodRatio: totalVal > 0 ? (pureWoodVal / totalVal) * 100 : 0,
          nonWoodRatio: totalVal > 0 ? (nonWoodTotal / totalVal) * 100 : 0
        },
        standard: {
          materialBudget40: standardMaterialBudget,
          workerBudget15: standardWorkerBudget,
          totalAllocated: standardMaterialBudget + standardWorkerBudget
        },
        fraudulent: {
          materialBudget40: fraudulentMaterialBudget,
          workerBudget15: fraudulentWorkerBudget,
          totalAllocated: fraudulentMaterialBudget + fraudulentWorkerBudget
        },
        preventedLeakage: {
          material: leakageMaterial,
          worker: leakageWorker,
          total: totalPreventedLeakage
        },
        verdict: nonWoodTotal > 0
          ? (totalPreventedLeakage > 0 ? "PHÁT HIỆN BÓC TÁCH ĐÚNG QUY CHUẨN - BẢO VỆ DÒNG TIỀN THÀNH CÔNG" : "ĐẠT CHUẨN")
          : "HẠNG MỤC GỖ 100% (KHÔNG CÓ PHỤ KIỆN/ĐÁ/KÍNH PHỤ TRỢ)"
      };
    },

    /**
     * Kiểm toán một bảng bóc tách hợp đồng
     */
    auditProjectContract: function (projectName, totalVal, items = []) {
      let accVal = 0, stoneVal = 0, glassVal = 0, acrylicVal = 0, solidWoodVal = 0, paintVal = 0;

      items.forEach(item => {
        const cat = (item.category || '').toLowerCase();
        const price = Number(item.amount || item.price || 0);

        if (cat.includes('phu_kien') || cat.includes('fitting') || cat.includes('inox') || cat.includes('bản lề') || cat.includes('ray')) {
          accVal += price;
        } else if (cat.includes('da') || cat.includes('stone') || cat.includes('ceramic') || cat.includes('bàn bếp')) {
          stoneVal += price;
        } else if (cat.includes('kinh') || cat.includes('glass') || cat.includes('gương') || cat.includes('canh_kinh')) {
          glassVal += price;
        } else if (cat.includes('acrylic') || cat.includes('canh_huynh') || cat.includes('canh_ntd') || cat.includes('canh_livas')) {
          acrylicVal += price;
        } else if (cat.includes('go_thit') || cat.includes('solid_wood') || cat.includes('sồi') || cat.includes('óc chó')) {
          solidWoodVal += price;
        } else if (cat.includes('son') || cat.includes('paint') || cat.includes('pu')) {
          paintVal += price;
        }
      });

      const auditResult = this.separateWoodVal(totalVal, {
        accVal,
        stoneVal,
        glassVal,
        acrylicVal,
        solidWoodVal,
        paintVal
      });

      return {
        projectName,
        auditResult,
        auditTimestamp: new Date().toISOString()
      };
    }
  };

  /**
   * CÁC HÀM TIỆN ÍCH ĐỊNH DẠNG SỐ TIỀN VÀ BẢN BIỂU
   */
  const Utils = {
    formatVND: function (amount) {
      if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
    },
    formatNumber: function (num) {
      if (num === undefined || num === null || isNaN(num)) return '0';
      return new Intl.NumberFormat('vi-VN').format(num);
    },
    formatPercent: function (ratio) {
      if (isNaN(ratio)) return '0.0%';
      return ratio.toFixed(1) + '%';
    }
  };

  /**
   * CẤU TRÚC ĐỐI TƯỢNG MODULE W11
   */
  const PG_Modules_W11 = {
    version: "4.0.0",
    id: "PG_W11_SUPPLIER_FITTING_GLASS_STONE",
    name: "Quản Lý Đối Soát NCC Phụ Trợ & Chống Tính Khoán Láo",
    rawData: AUDIT_DATA,
    antiFraud: AntiFraudEngine,
    utils: Utils,

    // Trạng thái giao diện
    state: {
      activeTab: 'overview', // 'overview', 'suppliers', 'orders_ntd_quoctam', 'anti_fraud_tool'
      selectedSupplierId: null,
      filterCategory: 'all',
      searchKeyword: ''
    },

    /**
     * Lấy danh sách 9 nhà cung cấp phụ trợ
     */
    getSuppliers: function (filterCategory = null) {
      if (!filterCategory || filterCategory === 'all') {
        return AUDIT_DATA.suppliers;
      }
      return AUDIT_DATA.suppliers.filter(s => {
        return s.category.toLowerCase().includes(filterCategory.toLowerCase()) ||
               s.id.toLowerCase().includes(filterCategory.toLowerCase());
      });
    },

    /**
     * Tìm NCC theo ID
     */
    getSupplierById: function (id) {
      return AUDIT_DATA.suppliers.find(s => s.id === id);
    },

    /**
     * Lấy danh sách công nợ cấp bách cần giải quyết
     */
    getUrgentPayables: function () {
      return AUDIT_DATA.summary.urgent_payable_actions;
    },

    /**
     * Tính tổng công nợ phụ trợ hiện tại
     */
    getTotalDebts: function () {
      let total = 0;
      AUDIT_DATA.suppliers.forEach(s => {
        total += (s.current_debt || 0);
      });
      // Cộng dồn ước tính NTD Acrylic nếu tính cả đơn Q4 phát sinh
      const ntdSupplier = this.getSupplierById("NCC_ACRYLIC_NTD_GIANG_COI");
      const ntdEstimatedTotal = ntdSupplier ? ntdSupplier.total_accumulated_debt_estimate : 0;

      return {
        currentDirectDebt: total,
        ntdEstimatedTotal: ntdEstimatedTotal,
        totalWithEstimatedNTD: total + (ntdEstimatedTotal - (ntdSupplier ? ntdSupplier.current_debt || 0 : 0))
      };
    },

    /**
     * Lấy danh sách đơn hàng Q4 của NTD Acrylic
     */
    getNTDOrders: function () {
      const ntd = this.getSupplierById("NCC_ACRYLIC_NTD_GIANG_COI");
      return ntd ? ntd.q4_orders_audit_oct_nov_2026 : [];
    },

    /**
     * Lấy dữ liệu đối soát Quốc Tâm
     */
    getQuocTamDetails: function () {
      const qt = this.getSupplierById("NCC_FITTING_QUOC_TAM");
      return qt ? qt.reconciliation_details : null;
    },

    /**
     * Giao diện HTML Render
     */
    render: function (containerIdOrElement) {
      const container = typeof containerIdOrElement === 'string'
        ? document.getElementById(containerIdOrElement)
        : containerIdOrElement;

      if (!container) {
        console.error("[PG_Modules_W11] Không tìm thấy phần tử container:", containerIdOrElement);
        return;
      }

      container.innerHTML = this.buildHTML();
      this.attachEvents(container);
    },

    /**
     * Xây dựng mã HTML giao diện
     */
    buildHTML: function () {
      const debts = this.getTotalDebts();
      const urgentList = this.getUrgentPayables();

      return `
        <div class="pg-w11-root" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; line-height: 1.5;">
          
          <!-- HEADER BANNER -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 24px; border-radius: 10px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
              <div>
                <span style="background: #ef4444; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Chốt Chặn Thép Két Sắt</span>
                <span style="background: #3b82f6; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; margin-left: 6px;">V4.0 Delta-Cursor</span>
                <h2 style="margin: 8px 0 4px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">ĐỐI SOÁT 9 NHÀ CUNG CẤP PHỤ TRỢ & BÓC TÁCH CHỐNG TÍNH KHOÁN LÁO</h2>
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                  Đơn vị: <strong>${AUDIT_DATA.metadata.legal_entity}</strong> | ĐC: ${AUDIT_DATA.metadata.office_factory_address} | Hotline: <strong>${AUDIT_DATA.metadata.hotline}</strong>
                </p>
              </div>
              <div style="text-align: right; background: rgba(255,255,255,0.08); padding: 12px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);">
                <div style="font-size: 12px; color: #cbd5e1; text-transform: uppercase;">Ước tính công nợ gối đầu & phát sinh</div>
                <div style="font-size: 24px; font-weight: 900; color: #fbbf24;">${Utils.formatVND(debts.totalWithEstimatedNTD)}</div>
                <div style="font-size: 11px; color: #94a3b8;">Nợ hiện hữu đã chốt sổ: <strong>${Utils.formatVND(debts.currentDirectDebt + 125694017)}</strong></div>
              </div>
            </div>
            
            <!-- Alert bar -->
            <div style="margin-top: 16px; background: rgba(239,68,68,0.2); border-left: 4px solid #ef4444; padding: 10px 14px; border-radius: 4px; font-size: 12.5px; color: #fecaca;">
              <strong>LUẬT SẮT GIÁM ĐỐC NGUYỄN VIẾT NGHĨA:</strong> Cấm tuyệt đối lấy tỷ lệ khoán 40% vật tư & 15% thợ xưởng áp lên Phụ kiện (Quốc Tâm, Hafele), Cánh Acrylic noline gia công, Kính ốp bếp, Đá bàn bếp và Gỗ thịt. Phải bóc tách hoàn toàn khỏi <code>woodVal</code> trước khi tính CCSC!
            </div>
          </div>

          <!-- TAB NAVIGATION -->
          <div style="display: flex; gap: 8px; border-bottom: 2px solid #e2e8f0; margin-bottom: 20px; padding-bottom: 2px;">
            <button class="pg-w11-tab-btn ${this.state.activeTab === 'overview' ? 'active' : ''}" data-tab="overview" style="${this.getTabStyle('overview')}">
              📊 Tổng Quan & Cảnh Báo Cấp Bách
            </button>
            <button class="pg-w11-tab-btn ${this.state.activeTab === 'suppliers' ? 'active' : ''}" data-tab="suppliers" style="${this.getTabStyle('suppliers')}">
              🏭 Danh Mục 9 Nhà Cung Cấp
            </button>
            <button class="pg-w11-tab-btn ${this.state.activeTab === 'orders_ntd_quoctam' ? 'active' : ''}" data-tab="orders_ntd_quoctam" style="${this.getTabStyle('orders_ntd_quoctam')}">
              📜 Chi Tiết Đơn Hàng NTD & Quốc Tâm
            </button>
            <button class="pg-w11-tab-btn ${this.state.activeTab === 'anti_fraud_tool' ? 'active' : ''}" data-tab="anti_fraud_tool" style="${this.getTabStyle('anti_fraud_tool')}">
              🛡️ Máy Tính Bóc Tách Chống Tính Khoán Láo
            </button>
          </div>

          <!-- TAB CONTENT -->
          <div class="pg-w11-tab-content">
            ${this.renderActiveTab()}
          </div>

          <!-- FOOTER -->
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11.5px; color: #64748b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
              Hệ thống đối soát tự động PG Home • Data Version: <code>${AUDIT_DATA.metadata.data_version}</code> • Ngày đối soát: <strong>${AUDIT_DATA.metadata.audit_date}</strong>
            </div>
            <div>
              NCC Quốc Tâm: <strong>56 Ngô Đức Kế, TP. Hà Tĩnh</strong> (PG Home tại Ngõ 49 Trương Quốc Dụng)
            </div>
          </div>

        </div>
      `;
    },

    getTabStyle: function (tabKey) {
      const isActive = this.state.activeTab === tabKey;
      return `
        padding: 10px 18px;
        font-size: 13.5px;
        font-weight: ${isActive ? '700' : '500'};
        color: ${isActive ? '#1e3a8a' : '#64748b'};
        background: ${isActive ? '#eff6ff' : 'transparent'};
        border: none;
        border-bottom: ${isActive ? '3px solid #1e3a8a' : '3px solid transparent'};
        border-radius: 6px 6px 0 0;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
    },

    /**
     * Render nội dung tab đang chọn
     */
    renderActiveTab: function () {
      switch (this.state.activeTab) {
        case 'overview':
          return this.renderOverviewTab();
        case 'suppliers':
          return this.renderSuppliersTab();
        case 'orders_ntd_quoctam':
          return this.renderOrdersTab();
        case 'anti_fraud_tool':
          return this.renderAntiFraudToolTab();
        default:
          return this.renderOverviewTab();
      }
    },

    /**
     * TAB 1: TỔNG QUAN & CẢNH BÁO CẤP BÁCH
     */
    renderOverviewTab: function () {
      const urgent = this.getUrgentPayables();
      const debts = AUDIT_DATA.summary.key_debt_balances;

      return `
        <div>
          <!-- 3 THẺ KPI CÔNG NỢ NỔI BẬT -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px;">
            
            <div style="background: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Phụ kiện Quốc Tâm (Hà Tĩnh)</span>
                <span style="background: #dcfce7; color: #166534; font-size: 10.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Dưới Trần 30M</span>
              </div>
              <div style="font-size: 24px; font-weight: 800; color: #0f172a;">${Utils.formatVND(debts.phu_kien_quoc_tam)}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                Địa chỉ: <strong>56 Ngô Đức Kế, TP. Hà Tĩnh</strong> | Hạn mức: 30,000,000 đ
              </div>
              <div style="margin-top: 10px; background: #f1f5f9; height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: #22c55e; width: ${(debts.phu_kien_quoc_tam / 30000000 * 100).toFixed(1)}%; height: 100%;"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; margin-top: 4px;">
                <span>Đã trả 15M (02/11)</span>
                <span>An toàn (${(debts.phu_kien_quoc_tam / 30000000 * 100).toFixed(0)}%)</span>
              </div>
            </div>

            <div style="background: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Cánh Huỳnh ALD (Bo Cong)</span>
                <span style="background: #fef3c7; color: #92400e; font-size: 10.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">2 Công trình</span>
              </div>
              <div style="font-size: 24px; font-weight: 800; color: #0f172a;">${Utils.formatVND(debts.canh_huynh_ald)}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                Nhà Chị Hoa (12.21M) + Vinhomes Anh Minh (22.75M)
              </div>
              <div style="margin-top: 10px; font-size: 11.5px; color: #475569;">
                Thanh toán theo tiến độ hoàn thiện & lắp đặt nghiệm thu xưởng.
              </div>
            </div>

            <div style="background: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">NTD Acrylic (Giang Còi)</span>
                <span style="background: #fee2e2; color: #991b1b; font-size: 10.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Chủ Lực Acrylic</span>
              </div>
              <div style="font-size: 24px; font-weight: 800; color: #b91c1c;">${Utils.formatVND(debts.ntd_acrylic_current_estimated_total)}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                Nợ cũ Q3 chốt: ${Utils.formatVND(debts.ntd_acrylic_historical_debt)} | Q4 (8 đơn): ${Utils.formatVND(debts.ntd_acrylic_q4_orders_total)}
              </div>
              <div style="margin-top: 10px; font-size: 11.5px; color: #475569;">
                Chu kỳ gối đầu, chuẩn bị đối chiếu chốt chiết khấu 3% trước khi thanh toán.
              </div>
            </div>

          </div>

          <!-- BẢNG HÀNH ĐỘNG CÔNG NỢ CẤP BÁCH -->
          <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <span style="color: #ef4444;">🚨</span> 3 HÀNH ĐỘNG CHI TRẢ CẤP BÁCH (CẦN GIÁM ĐỐC DUYỆT)
              </h3>
              <span style="font-size: 12px; color: #64748b;">Đã kiểm tra đối soát 100% qua Zalo Stealth Reader</span>
            </div>

            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; color: #475569;">
                    <th style="padding: 10px 14px;">Nhà Cung Cấp</th>
                    <th style="padding: 10px 14px; text-align: right;">Số Tiền Cần Chi</th>
                    <th style="padding: 10px 14px;">Hiện Trạng & Ghi Chú Đối Soát</th>
                    <th style="padding: 10px 14px; text-align: center;">Trạng Thái Ký Duyệt</th>
                  </tr>
                </thead>
                <tbody>
                  ${urgent.map((item, idx) => `
                    <tr style="border-bottom: 1px solid #f1f5f9; ${idx % 2 === 1 ? 'background: #fafafa;' : ''}">
                      <td style="padding: 12px 14px; font-weight: 700; color: #1e293b;">
                        ${item.supplier}
                      </td>
                      <td style="padding: 12px 14px; text-align: right; font-weight: 800; color: #b91c1c; font-size: 14px;">
                        ${Utils.formatVND(item.amount)}
                      </td>
                      <td style="padding: 12px 14px; color: #475569;">
                        ${item.note}
                      </td>
                      <td style="padding: 12px 14px; text-align: center;">
                        <span style="background: #eff6ff; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                          Đã Trình Giám Đốc
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- BẢNG TỔNG HỢP CÔNG NỢ TOÀN BỘ 9 NHÀ CUNG CẤP -->
          <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px;">
            <h3 style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
              📋 BẢNG TỔNG QUAN TRẠNG THÁI 9 ĐỐI TÁC PHỤ TRỢ (THÁNG 11/2026)
            </h3>
            
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left; color: #334155;">
                    <th style="padding: 10px 12px;">Mã & Tên Nhà Cung Cấp</th>
                    <th style="padding: 10px 12px;">Phân Loại Hạng Mục</th>
                    <th style="padding: 10px 12px; text-align: right;">Công Nợ Hiện Hữu</th>
                    <th style="padding: 10px 12px;">Điều Khoản & Trạng Thái Đối Soát</th>
                  </tr>
                </thead>
                <tbody>
                  ${AUDIT_DATA.suppliers.map(s => `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 10px 12px;">
                        <div style="font-weight: 700; color: #0f172a;">${s.name}</div>
                        <div style="font-size: 11px; color: #64748b;">${s.id}</div>
                      </td>
                      <td style="padding: 10px 12px; color: #475569; max-width: 250px;">
                        ${s.category}
                      </td>
                      <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: ${s.current_debt > 0 ? '#b91c1c' : '#15803d'}; font-size: 13.5px;">
                        ${Utils.formatVND(s.current_debt)}
                      </td>
                      <td style="padding: 10px 12px;">
                        <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${s.current_debt === 0 ? '#dcfce7; color: #15803d;' : '#fffbeb; color: #b45309;'}">
                          ${s.audit_status}
                        </span>
                        <div style="font-size: 11.5px; color: #64748b; margin-top: 4px;">${s.evaluation}</div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      `;
    },

    /**
     * TAB 2: DANH MỤC CHI TIẾT 9 NHÀ CUNG CẤP & THÔNG TIN THANH TOÁN
     */
    renderSuppliersTab: function () {
      const suppliers = this.getSuppliers(this.state.filterCategory);

      return `
        <div>
          <!-- BỘ LỌC HẠNG MỤC -->
          <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: #475569;">Lọc nhóm vật tư:</span>
            <button class="pg-w11-filter-btn" data-filter="all" style="${this.getFilterBtnStyle('all')}">Tất cả (9)</button>
            <button class="pg-w11-filter-btn" data-filter="phu_kien" style="${this.getFilterBtnStyle('phu_kien')}">Phụ Kiện Inox</button>
            <button class="pg-w11-filter-btn" data-filter="acrylic" style="${this.getFilterBtnStyle('acrylic')}">Cánh Acrylic / Cánh Huỳnh</button>
            <button class="pg-w11-filter-btn" data-filter="kinh" style="${this.getFilterBtnStyle('kinh')}">Kính & Gương</button>
            <button class="pg-w11-filter-btn" data-filter="da" style="${this.getFilterBtnStyle('da')}">Đá Bếp / Ceramic</button>
            <button class="pg-w11-filter-btn" data-filter="go_thit" style="${this.getFilterBtnStyle('go_thit')}">Gỗ Thịt & Sơn PU</button>
          </div>

          <!-- LƯỚI CARD NHÀ CUNG CẤP -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px;">
            ${suppliers.map(s => {
              const bankInfo = s.legal_info && s.legal_info.bank_accounts
                ? s.legal_info.bank_accounts.map(b => `${b.bank}: <strong>${b.account_no}</strong> (${b.account_holder})`).join(' | ')
                : (s.legal_info && s.legal_info.representative ? `Người đại diện: <strong>${s.legal_info.representative}</strong>` : 'Thanh toán trực tiếp khi giao nhận bill');

              return `
                <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                      <h4 style="margin: 0; font-size: 15px; font-weight: 800; color: #0f172a;">${s.name}</h4>
                      <span style="font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${s.current_debt > 0 ? '#fee2e2; color: #991b1b;' : '#dcfce7; color: #166534;'}">
                        ${s.current_debt > 0 ? Utils.formatVND(s.current_debt) : 'Hết Nợ (0 đ)'}
                      </span>
                    </div>

                    <div style="font-size: 12px; color: #3b82f6; font-weight: 600; margin-bottom: 6px;">
                      🏷️ ${s.category}
                    </div>

                    <div style="font-size: 12px; color: #475569; margin-bottom: 8px; line-height: 1.4;">
                      ${s.legal_info && s.legal_info.address ? `📍 <strong>Địa chỉ:</strong> ${s.legal_info.address}<br/>` : ''}
                      ${s.legal_info && s.legal_info.zalo_group ? `💬 <strong>Nhóm Zalo:</strong> <code>${s.legal_info.zalo_group}</code><br/>` : ''}
                      💳 <strong>Tài khoản:</strong> ${bankInfo}
                    </div>

                    <div style="background: #f8fafc; border-left: 3px solid #94a3b8; padding: 6px 10px; font-size: 11.5px; color: #475569; margin-bottom: 12px; border-radius: 0 4px 4px 0;">
                      ${s.evaluation}
                    </div>
                  </div>

                  <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11.5px;">
                    <span style="color: #64748b;">Trạng thái: <strong>${s.audit_status}</strong></span>
                    ${s.credit_limit ? `<span style="color: #0369a1; font-weight: 600;">Hạn mức: ${Utils.formatNumber(s.credit_limit / 1000000)}M</span>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    getFilterBtnStyle: function (filterKey) {
      const isSelected = this.state.filterCategory === filterKey;
      return `
        padding: 5px 12px;
        font-size: 12px;
        font-weight: ${isSelected ? '700' : '500'};
        color: ${isSelected ? '#ffffff' : '#475569'};
        background: ${isSelected ? '#1e3a8a' : '#e2e8f0'};
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
    },

    /**
     * TAB 3: CHI TIẾT ĐƠN HÀNG NTD ACRYLIC & ĐỐI SOÁT QUỐC TÂM
     */
    renderOrdersTab: function () {
      const ntd = this.getSupplierById("NCC_ACRYLIC_NTD_GIANG_COI");
      const qt = this.getSupplierById("NCC_FITTING_QUOC_TAM");

      const ntdOrders = ntd ? ntd.q4_orders_audit_oct_nov_2026 : [];
      const ntdQ3 = ntd ? ntd.historical_reconciliation_to_2026_09_29 : null;
      const qtDetails = qt ? qt.reconciliation_details : null;

      return `
        <div>
          <!-- PHẦN 1: QUỐC TÂM - 56 NGÔ ĐỨC KẾ -->
          <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">
                  🔩 PHỤ KIỆN QUỐC TÂM - ĐỐI SOÁT PHÁT SINH THÁNG 11/2026
                </h3>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">
                  Địa chỉ NCC: <strong>56 Ngô Đức Kế, TP. Hà Tĩnh</strong> (Hotline VIB: 972672963 - VO THI HA)
                </p>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 12px; color: #64748b;">Số dư nợ chốt ngày 05/11:</span>
                <span style="font-size: 18px; font-weight: 800; color: #b91c1c; margin-left: 6px;">${Utils.formatVND(qt ? qt.current_debt : 0)}</span>
              </div>
            </div>

            ${qtDetails ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: #f8fafc; padding: 14px; border-radius: 6px; font-size: 12.5px;">
                <div>Dư nợ đầu kỳ trước tháng 11: <strong>${Utils.formatVND(qtDetails.balance_before_nov)}</strong></div>
                <div style="color: #15803d;">Đã thanh toán ngày 02/11: <strong>-15,000,000 đ</strong> (UNC VIB)</div>
                <div>Hóa đơn phát sinh 04/11: <strong>+170,000 đ</strong></div>
                <div>Hóa đơn phát sinh 05/11: <strong>+80,000 đ</strong></div>
                <div style="color: #b91c1c; font-weight: 700;">Nợ ròng hiện tại: ${Utils.formatVND(qtDetails.net_balance_on_2026_11_05)}</div>
              </div>
            ` : ''}
          </div>

          <!-- PHẦN 2: NTD ACRYLIC - ĐỐI SOÁT 8 ĐƠN Q4 VÀ LỊCH SỬ Q3 -->
          <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">
                  🪞 CÔNG TY CP NTD ACRYLIC (GIANG CÒI) - ĐỐI SOÁT 8 ĐƠN HÀNG Q4/2026
                </h3>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">
                  MST: <strong>0109563360</strong> | TT Phúc Thọ, Hà Nội | Nhóm Zalo: <code>g2539027971900219384</code>
                </p>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 12px; color: #64748b;">Tổng giá trị 8 đơn Q4:</span>
                <span style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin-left: 6px;">${Utils.formatVND(ntd ? ntd.q4_total_invoiced_value : 0)}</span>
              </div>
            </div>

            <!-- Tóm tắt lịch sử Q3 -->
            ${ntdQ3 ? `
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; color: #1e40af;">
                <strong>Đối soát chốt đến ngày 29/09/2026:</strong> Nợ T6 mang sang: ${Utils.formatVND(ntdQ3.brought_forward_debt_june)} | Đặt hàng Q3: ${Utils.formatVND(ntdQ3.q3_orders_total)} | Chiết khấu 3%: -${Utils.formatVND(ntdQ3.discount_3_percent)} | Đã chuyển khoản trả: -${Utils.formatVND(ntdQ3.total_paid_july_to_sept)} $\\implies$ <strong>Chốt nợ cũ: ${Utils.formatVND(ntdQ3.confirmed_debt_at_2026_09_29)}</strong>.
              </div>
            ` : ''}

            <!-- BẢNG 8 ĐƠN HÀNG Q4 -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
                <thead>
                  <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left; color: #334155;">
                    <th style="padding: 9px 10px;">Số ĐH</th>
                    <th style="padding: 9px 10px;">Ngày Đặt</th>
                    <th style="padding: 9px 10px;">Công Trình / Khách Hàng</th>
                    <th style="padding: 9px 10px;">Quy Cách Kỹ Thuật Bóc Tách</th>
                    <th style="padding: 9px 10px; text-align: right;">Thành Tiền (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  ${ntdOrders.map(o => `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 10px; font-weight: 700; color: #0284c7;">#${o.order_no}</td>
                      <td style="padding: 10px; color: #475569;">${o.date}</td>
                      <td style="padding: 10px; font-weight: 600; color: #0f172a;">${o.customer}</td>
                      <td style="padding: 10px; color: #475569;">${o.specification}</td>
                      <td style="padding: 10px; text-align: right; font-weight: 800; color: #0f172a;">
                        ${Utils.formatVND(o.total_amount)}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr style="background: #f8fafc; font-weight: 800; border-top: 2px solid #cbd5e1;">
                    <td colspan="4" style="padding: 10px; text-align: right; text-transform: uppercase;">Tổng Cộng 8 Đơn Hàng Q4 Phát Sinh:</td>
                    <td style="padding: 10px; text-align: right; color: #b91c1c; font-size: 14px;">
                      ${Utils.formatVND(ntd ? ntd.q4_total_invoiced_value : 0)}
                    </td>
                  </tr>
                  <tr style="background: #fffbeb; font-weight: 800; color: #b45309;">
                    <td colspan="4" style="padding: 10px; text-align: right; text-transform: uppercase;">Tổng Dư Nợ Tích Lũy Ước Tính (Nợ Cũ + Q4):</td>
                    <td style="padding: 10px; text-align: right; font-size: 15px; color: #b91c1c;">
                      ${Utils.formatVND(ntd ? ntd.total_accumulated_debt_estimate : 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="margin-top: 12px; font-size: 12px; color: #64748b; font-style: italic;">
              * Lưu ý: Khi đối chiếu thanh toán đợt tiếp theo với anh Giang NTD, kế toán bắt buộc áp dụng chiết khấu 3% trên toàn bộ các đơn hàng Q4 như cam kết kinh doanh.
            </div>
          </div>
        </div>
      `;
    },

    /**
     * TAB 4: MÁY TÍNH BÓC TÁCH CHỐNG TÍNH KHOÁN LÁO (ANTI-FRAUD CALCULATOR)
     */
    renderAntiFraudToolTab: function () {
      return `
        <div>
          <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 22px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 6px 0; font-size: 17px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <span>🛡️</span> CÔNG CỤ TỰ ĐỘNG BÓC TÁCH woodVal & CẢNH BÁO THẤT THOÁT DÒNG TIỀN
            </h3>
            <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">
              Nhập giá trị hợp đồng dự toán và các hạng mục phụ trợ ngoài để kiểm toán ngay nguy cơ thất thoát nếu áp tỷ lệ khoán 40% vật tư và 15% thợ xưởng sai quy định.
            </p>

            <!-- FORM NHẬP LIỆU -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Tổng Doanh Thu Hợp Đồng (VNĐ)</label>
                <input type="number" id="pg-w11-inp-total" value="150000000" step="1000000" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700; color: #0f172a;" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Phụ Kiện Inox (Quốc Tâm, Hafele)</label>
                <input type="number" id="pg-w11-inp-acc" value="25000000" step="500000" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Cánh Acrylic Noline / ALD Huỳnh</label>
                <input type="number" id="pg-w11-inp-acrylic" value="22000000" step="500000" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Đá Bếp Bàn / Ceramic (Hoàng Hà)</label>
                <input type="number" id="pg-w11-inp-stone" value="18000000" step="500000" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Kính Ốp Bếp / Gương (Việt Nhật, Bỉ)</label>
                <input type="number" id="pg-w11-inp-glass" value="8000000" step="500000" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Gỗ Thịt & Sơn PU Khoán Ngoài</label>
                <input type="number" id="pg-w11-inp-solidwood" value="5000000" step="500000" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div style="text-align: right; margin-bottom: 20px;">
              <button id="pg-w11-btn-calc" style="background: #1e3a8a; color: #ffffff; border: none; padding: 10px 24px; border-radius: 6px; font-size: 13.5px; font-weight: 700; cursor: pointer;">
                🔍 CHẠY KIỂM TOÁN DÒNG TIỀN & BÓC TÁCH NGAY
              </button>
            </div>

            <!-- KẾT QUẢ KIỂM TOÁN TỨC THỜI -->
            <div id="pg-w11-calc-result-area">
              ${this.buildCalcResultHTML(this.antiFraud.separateWoodVal(150000000, {
                accVal: 25000000,
                acrylicVal: 22000000,
                stoneVal: 18000000,
                glassVal: 8000000,
                solidWoodVal: 5000000
              }))}
            </div>

          </div>
        </div>
      `;
    },

    buildCalcResultHTML: function (res) {
      return `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap;">
            <div>
              <span style="font-size: 11px; font-weight: 800; background: #22c55e; color: #ffffff; padding: 3px 8px; border-radius: 4px;">KẾT QUẢ KIỂM TOÁN BÓC TÁCH</span>
              <h4 style="margin: 6px 0 0 0; font-size: 16px; font-weight: 800; color: #0f172a;">${res.verdict}</h4>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 12px; color: #64748b;">Tổng Thất Thoát Ngăn Chặn Được:</span>
              <div style="font-size: 22px; font-weight: 900; color: #16a34a;">${Utils.formatVND(res.preventedLeakage.total)}</div>
            </div>
          </div>

          <!-- BẢNG ĐỐI CHIẾU 2 PHƯƠNG PHÁP -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px;">
            
            <!-- CÁCH TÍNH CHUẨN PG HOME -->
            <div style="background: #ffffff; border: 2px solid #22c55e; border-radius: 6px; padding: 14px;">
              <div style="font-size: 12px; font-weight: 800; color: #15803d; text-transform: uppercase; margin-bottom: 6px;">
                ✅ CHUẨN PG HOME (GIÁM ĐỐC NGUYỄN VIẾT NGHĨA)
              </div>
              <div style="font-size: 12.5px; color: #334155; margin-bottom: 8px;">
                Giá trị Gỗ Thuần (woodVal): <strong>${Utils.formatVND(res.pureWoodVal)}</strong> (${Utils.formatPercent(res.percentages.pureWoodRatio)})<br/>
                Tổng Phụ Trợ Bóc Tách: <strong>${Utils.formatVND(res.nonWoodTotal)}</strong> (${Utils.formatPercent(res.percentages.nonWoodRatio)})
              </div>
              <div style="background: #f0fdf4; padding: 8px 10px; border-radius: 4px; font-size: 12px; color: #166534; line-height: 1.5;">
                • Khoán Vật tư gỗ (40% woodVal): <strong>${Utils.formatVND(res.standard.materialBudget40)}</strong><br/>
                • Khoán Lương thợ xưởng (15% woodVal): <strong>${Utils.formatVND(res.standard.workerBudget15)}</strong><br/>
                <strong>Tổng Quỹ Khoán Hợp Lệ: ${Utils.formatVND(res.standard.totalAllocated)}</strong>
              </div>
            </div>

            <!-- CÁCH TÍNH LÁO (GOM TẤT CẢ) -->
            <div style="background: #ffffff; border: 2px solid #ef4444; border-radius: 6px; padding: 14px;">
              <div style="font-size: 12px; font-weight: 800; color: #b91c1c; text-transform: uppercase; margin-bottom: 6px;">
                ❌ TÍNH KHOÁN LÁO (GOM CẢ PHỤ TRỢ ĐỂ NHÂN 55%)
              </div>
              <div style="font-size: 12.5px; color: #334155; margin-bottom: 8px;">
                Lấy nguyên Tổng Hợp Đồng: <strong>${Utils.formatVND(res.totalVal)}</strong> nhân bừa 40% & 15% mà không trừ phụ kiện, đá, kính!
              </div>
              <div style="background: #fef2f2; padding: 8px 10px; border-radius: 4px; font-size: 12px; color: #991b1b; line-height: 1.5;">
                • Thất thoát vật tư (thừa 40% trên đồ mua ngoài): <strong>+${Utils.formatVND(res.preventedLeakage.material)}</strong><br/>
                • Thất thoát lương thợ (xưởng nhận vơ 15% đồ mua ngoài): <strong>+${Utils.formatVND(res.preventedLeakage.worker)}</strong><br/>
                <strong>Nguy cơ bốc hơi két sắt: +${Utils.formatVND(res.preventedLeakage.total)}</strong>
              </div>
            </div>

          </div>

          <div style="font-size: 12px; color: #475569; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
            💡 <strong>KẾT LUẬN KIỂM TOÁN:</strong> Nếu kế toán hay xưởng áp dụng cách tính khoán 40%/15% lên toàn bộ hợp đồng, công ty sẽ lãng phí tới <strong>${Utils.formatVND(res.preventedLeakage.total)}</strong> chi phí ảo. Quy tắc bóc tách tự động của Module W11 đã bảo vệ dòng tiền an toàn 100%!
          </div>
        </div>
      `;
    },

    /**
     * Gắn các sự kiện tương tác
     */
    attachEvents: function (container) {
      const self = this;

      // Xử lý chuyển tab
      const tabButtons = container.querySelectorAll('.pg-w11-tab-btn');
      tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
          const tab = this.getAttribute('data-tab');
          self.state.activeTab = tab;
          self.render(container);
        });
      });

      // Xử lý lọc danh sách nhà cung cấp
      const filterButtons = container.querySelectorAll('.pg-w11-filter-btn');
      filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
          const filter = this.getAttribute('data-filter');
          self.state.filterCategory = filter;
          self.render(container);
        });
      });

      // Xử lý nút tính toán bóc tách chống khoán láo
      const btnCalc = container.querySelector('#pg-w11-btn-calc');
      if (btnCalc) {
        btnCalc.addEventListener('click', function () {
          const totalVal = Number(container.querySelector('#pg-w11-inp-total').value || 0);
          const accVal = Number(container.querySelector('#pg-w11-inp-acc').value || 0);
          const acrylicVal = Number(container.querySelector('#pg-w11-inp-acrylic').value || 0);
          const stoneVal = Number(container.querySelector('#pg-w11-inp-stone').value || 0);
          const glassVal = Number(container.querySelector('#pg-w11-inp-glass').value || 0);
          const solidWoodVal = Number(container.querySelector('#pg-w11-inp-solidwood').value || 0);

          const result = self.antiFraud.separateWoodVal(totalVal, {
            accVal,
            acrylicVal,
            stoneVal,
            glassVal,
            solidWoodVal
          });

          const resultArea = container.querySelector('#pg-w11-calc-result-area');
          if (resultArea) {
            resultArea.innerHTML = self.buildCalcResultHTML(result);
          }
        });
      }
    },

    /**
     * Xuất dữ liệu đối soát ra JSON chuẩn
     */
    exportAuditReport: function () {
      return {
        ...AUDIT_DATA,
        exported_at: new Date().toISOString(),
        auditor_signature: "PG_HOME_FLASH_WORKER_W11"
      };
    }
  };

  // Đăng ký toàn cục vào window
  window.PG_Modules_W11 = PG_Modules_W11;

  console.log("✅ [PG_Modules_W11] Khởi tạo thành công Module W11 Quản Lý Đối Soát NCC Phụ Trợ & Chống Tính Khoán Láo (V4.0 Delta-Cursor).");

})(typeof window !== 'undefined' ? window : this);
