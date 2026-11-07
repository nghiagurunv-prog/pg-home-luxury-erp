/**
 * ============================================================================
 * MODULE W03: QUẢN TRỊ QUỸ THỢ NÒNG CỐT HÒA & HÀO (LUẬT SẮT C1)
 * Hệ thống Quản trị & Tự động hóa PG Home Luxury (Hộ Kinh Doanh Phú Gia)
 * Đơn vị: Hộ Kinh Doanh Phú Gia - Mã số ĐKKD/MST: 042203002931
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0973.562.789
 * ============================================================================
 * NGUYÊN TẮC LUẬT SẮT C1:
 * - Trích 20.000 đ/công vào Quỹ Thợ Nòng Cốt giữ đến tất niên cuối năm mới chi trả.
 * - Hàng tháng: Phụ cấp thực chi = 0 đ (TUYỆT ĐỐI CẤM xuất quỹ chi tiền mặt hàng tháng).
 * - Định mức lương ngày:
 *   + Võ Đức Hòa (Hà Viết Hòa - Thợ cả): 530.000 đ/ngày HC | OT: 99.375 đ/giờ
 *   + Lương Thế Hào (Thợ lắp ráp chính): 450.000 đ/ngày HC | OT: 84.375 đ/giờ
 * - Đối soát chuẩn xác 100% lũy kế T8, T9, T10 và tạm tính đầu T11/2026.
 * ============================================================================
 */

(function (window) {
  'use strict';

  // Dữ liệu kiểm toán đối soát chính xác 100% từ data/audit_workshop_attendance_and_core_fund.json
  const AUDIT_DATA = {
    metadata: {
      module_id: "W03",
      module_name: "Quản trị Quỹ Thợ Nòng Cốt Hòa & Hào",
      rule_code: "LUẬT SẮT C1",
      rate_per_day: 20000,
      legal_entity: "Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)",
      address: "Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh",
      hotline: "0973.562.789",
      updated_at: "2026-11-07 10:46:00",
      status: "VERIFIED_ACCURATE_100_PERCENT"
    },
    workers: {
      hoa: {
        id: "hoa",
        full_name: "Võ Đức Hòa",
        administrative_name: "Hà Viết Hòa",
        role: "Thợ cả xưởng gỗ CN",
        daily_rate_hc: 530000,
        hourly_rate_ot: 99375,
        monthly_allowance: 0,
        fund_rate: 20000,
        records: {
          t8: {
            period: "Tháng 08/2026",
            cong_hc: 28.0,
            gio_ot: 0,
            luong_hc: 14840000,
            luong_ot: 0,
            tong_luong: 14840000,
            tam_ung: 0,
            phu_cap: 0,
            thuc_linh: 14840000,
            quy_trich_20k: 560000,
            note: "Quyết toán hoàn tất, đúng định mức 530k/công"
          },
          t9: {
            period: "Tháng 09/2026",
            cong_hc: 28.0,
            gio_ot: 0,
            luong_hc: 14840000,
            luong_ot: 0,
            tong_luong: 14840000,
            tam_ung: 0,
            phu_cap: 0,
            thuc_linh: 14840000,
            quy_trich_20k: 560000,
            note: "Quyết toán hoàn tất, đúng định mức 530k/công"
          },
          t10: {
            period: "Tháng 10/2026",
            cong_hc: 28.0,
            gio_ot: 66.0,
            luong_hc: 14840000,
            luong_ot: 6558750,
            tong_luong: 21398750,
            tam_ung: 1590000,
            phu_cap: 0,
            thuc_linh: 19808750,
            quy_trich_20k: 560000,
            note: "Khớp 100% chứng từ Zalo Hiệp gửi 08:35 & Hào xác nhận 08:39 ngày 02/11/2026"
          },
          t11_est: {
            period: "Đầu Tháng 11/2026 (01-06/11)",
            cong_hc: 5.5,
            gio_ot: 0,
            luong_hc: 2915000,
            luong_ot: 0,
            tong_luong: 2915000,
            tam_ung: 0,
            phu_cap: 0,
            thuc_linh: 2915000,
            quy_trich_20k: 110000,
            note: "Đang chấm công điểm danh sống hàng ngày"
          }
        },
        luy_ke_t8_t10: 1680000,
        luy_ke_tong: 1790000
      },
      hao: {
        id: "hao",
        full_name: "Lương Thế Hào",
        administrative_name: "Lương Thể Hào",
        role: "Thợ lắp ráp chính",
        daily_rate_hc: 450000,
        hourly_rate_ot: 84375,
        monthly_allowance: 0,
        fund_rate: 20000,
        records: {
          t8: {
            period: "Tháng 08/2026",
            cong_hc: 30.0,
            gio_ot: 0,
            luong_hc: 13500000,
            luong_ot: 0,
            tong_luong: 13500000,
            tam_ung: 0,
            phu_cap: 0,
            thuc_linh: 13500000,
            quy_trich_20k: 600000,
            note: "Quyết toán hoàn tất, đúng định mức 450k/công"
          },
          t9: {
            period: "Tháng 09/2026",
            cong_hc: 30.0,
            gio_ot: 0,
            luong_hc: 13500000,
            luong_ot: 0,
            tong_luong: 13500000,
            tam_ung: 0,
            phu_cap: 0,
            thuc_linh: 13500000,
            quy_trich_20k: 600000,
            note: "Quyết toán hoàn tất, đúng định mức 450k/công"
          },
          t10: {
            period: "Tháng 10/2026",
            cong_hc: 30.0,
            gio_ot: 62.0,
            luong_hc: 13500000,
            luong_ot: 5231250,
            tong_luong: 18731250,
            tam_ung: 0,
            phu_cap: 0,
            thuc_linh: 18731250,
            quy_trich_20k: 600000,
            note: "Khớp 100% chứng từ Zalo Hiệp gửi 08:35 & Hào xác nhận 08:39 ngày 02/11/2026"
          },
          t11_est: {
            period: "Đầu Tháng 11/2026 (01-06/11)",
            cong_hc: 5.5,
            gio_ot: 0,
            luong_hc: 2475000,
            luong_ot: 0,
            tong_luong: 2475000,
            tam_ung: 0,
            phu_cap: 0,
            thuc_linh: 2475000,
            quy_trich_20k: 110000,
            note: "Đang chấm công điểm danh sống hàng ngày"
          }
        },
        luy_ke_t8_t10: 1800000,
        luy_ke_tong: 1910000
      }
    },
    totals: {
      luy_ke_t8_t10: 3480000,
      luy_ke_tam_tinh_hien_tai: 3700000,
      cash_held_in_safe: "3.480.000 đ được bảo lưu an toàn tuyệt đối trong két sắt Ban Giám Đốc",
      status_compliance: "TUÂN THỦ 100% LUẬT SẮT C1 - PHỤ CẤP THÁNG = 0 Đ"
    }
  };

  /**
   * Định dạng số sang tiền tệ VNĐ
   */
  function formatMoney(num) {
    if (num === null || num === undefined) return "0 đ";
    return Number(num).toLocaleString("vi-VN") + " đ";
  }

  /**
   * Định dạng số công / giờ
   */
  function formatNumber(num) {
    if (num === null || num === undefined) return "0";
    return Number(num).toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  }

  const PG_Modules_W03 = {
    version: "1.0.0",
    name: "PG_Modules_W03_CoreWorkerFund",

    /**
     * Lấy dữ liệu kiểm toán gốc
     */
    getData: function () {
      return JSON.parse(JSON.stringify(AUDIT_DATA));
    },

    /**
     * Tính toán quỹ nòng cốt theo số ngày công
     * @param {number} workdays Số ngày công thực tế
     * @param {number} rate Đơn giá trích (mặc định 20.000 đ/công)
     */
    calculateFund: function (workdays, rate = 20000) {
      const days = parseFloat(workdays) || 0;
      return {
        workdays: days,
        rate: rate,
        fund_amount: days * rate,
        monthly_cash_allowance: 0, // Bắt buộc = 0 theo Luật Sắt C1
        note: "Tiền trích giữ trong két sắt BGĐ đến tất niên cuối năm"
      };
    },

    /**
     * Tạo chuỗi HTML giao diện quản trị
     */
    generateHTML: function () {
      const hoa = AUDIT_DATA.workers.hoa;
      const hao = AUDIT_DATA.workers.hao;
      const totals = AUDIT_DATA.totals;

      return `
      <div class="pg-w03-wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 1200px; margin: 0 auto;">
        
        <!-- HEADER & BRAND IDENTITY -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 20px 24px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(239,68,68,0.25); border: 1px solid #ef4444; color: #fecaca; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
                KỶ LUẬT THÉP BẢO VỆ DÒNG TIỀN - LUẬT SẮT C1
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                QUẢN TRỊ QUỸ THỢ NÒNG CỐT HÒA & HÀO (TRÍCH 20.000 Đ/CÔNG)
              </h1>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                Tổ hợp Văn phòng & Nhà máy Sản xuất Nội thất Phú Gia (PG Home Luxury) | Hotline: <strong style="color: #38bdf8;">0973.562.789</strong>
              </p>
            </div>
            <div style="text-align: right; background: rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);">
              <div style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; font-weight: 600;">Trạng thái kỷ luật</div>
              <div style="font-size: 14px; color: #4ade80; font-weight: 700; margin-top: 2px;">
                ✓ 100% ĐẠT CHUẨN
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Phụ cấp hàng tháng = 0 đ</div>
            </div>
          </div>
        </div>

        <!-- KPI SUMMARY CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
          
          <!-- Card 1: Tổng Quỹ Két Sắt T8-T10 -->
          <div style="background: #ffffff; padding: 18px; border-radius: 10px; border-left: 5px solid #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Quỹ nòng cốt T8 - T10 (Két BGĐ)</div>
            <div style="font-size: 24px; font-weight: 800; color: #1e3a8a; margin: 6px 0;">
              ${formatMoney(totals.luy_ke_t8_t10)}
            </div>
            <div style="font-size: 12px; color: #475569; display: flex; justify-content: space-between;">
              <span>Hòa: <strong>${formatMoney(hoa.luy_ke_t8_t10)}</strong></span>
              <span>Hào: <strong>${formatMoney(hao.luy_ke_t8_t10)}</strong></span>
            </div>
          </div>

          <!-- Card 2: Lũy kế tạm tính hiện tại -->
          <div style="background: #ffffff; padding: 18px; border-radius: 10px; border-left: 5px solid #059669; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Lũy kế gồm đầu T11 (01-06/11)</div>
            <div style="font-size: 24px; font-weight: 800; color: #065f46; margin: 6px 0;">
              ${formatMoney(totals.luy_ke_tam_tinh_hien_tai)}
            </div>
            <div style="font-size: 12px; color: #475569; display: flex; justify-content: space-between;">
              <span>Hòa: <strong>${formatMoney(hoa.luy_ke_tong)}</strong></span>
              <span>Hào: <strong>${formatMoney(hao.luy_ke_tong)}</strong></span>
            </div>
          </div>

          <!-- Card 3: Định mức trích & kỷ luật phụ cấp -->
          <div style="background: #ffffff; padding: 18px; border-radius: 10px; border-left: 5px solid #dc2626; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Định mức & Kỷ luật chi tiền mặt</div>
            <div style="font-size: 24px; font-weight: 800; color: #991b1b; margin: 6px 0;">
              20.000 đ <span style="font-size: 14px; font-weight: 600; color: #64748b;">/ công</span>
            </div>
            <div style="font-size: 12px; color: #dc2626; font-weight: 700;">
              Hàng tháng Phụ cấp = 0 đ (CẤM CHI TIỀN MẶT)
            </div>
          </div>

          <!-- Card 4: Cơ chế quyết toán -->
          <div style="background: #ffffff; padding: 18px; border-radius: 10px; border-left: 5px solid #d97706; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Kỳ hạn giải ngân Quỹ nòng cốt</div>
            <div style="font-size: 18px; font-weight: 800; color: #b45309; margin: 6px 0;">
              Tất Niên Cuối Năm
            </div>
            <div style="font-size: 12px; color: #475569;">
              Chi trả cùng thưởng Tết & gắn trách nhiệm bảo hành
            </div>
          </div>

        </div>

        <!-- PROFILE 2 THỢ NÒNG CỐT -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 24px;">
          
          <!-- Profile Hòa -->
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
              <div>
                <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: 700;">THỢ CẢ XƯỞNG</span>
                <h3 style="margin: 4px 0 0 0; font-size: 17px; color: #0f172a;">${hoa.full_name} <span style="font-size: 13px; font-weight: 400; color: #64748b;">(${hoa.administrative_name})</span></h3>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; color: #64748b;">Đơn giá HC</div>
                <div style="font-size: 15px; font-weight: 800; color: #2563eb;">${formatMoney(hoa.daily_rate_hc)}/ngày</div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
              <div>• Lương OT: <strong>${formatMoney(hoa.hourly_rate_ot)}/h</strong></div>
              <div>• Phụ cấp tháng: <strong style="color: #dc2626;">0 đ</strong></div>
              <div>• Trích quỹ: <strong>20.000 đ/công</strong></div>
              <div>• Tích lũy T8-T10: <strong style="color: #059669;">${formatMoney(hoa.luy_ke_t8_t10)}</strong></div>
            </div>
            <div style="margin-top: 10px; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #334155;">
              T10 thực lĩnh: <strong>${formatMoney(hoa.records.t10.thuc_linh)}</strong> (28 công + 66h OT, tạm ứng 1.59M).
            </div>
          </div>

          <!-- Profile Hào -->
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
              <div>
                <span style="font-size: 11px; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: 700;">THỢ LẮP RÁP CHÍNH</span>
                <h3 style="margin: 4px 0 0 0; font-size: 17px; color: #0f172a;">${hao.full_name} <span style="font-size: 13px; font-weight: 400; color: #64748b;">(${hao.administrative_name})</span></h3>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; color: #64748b;">Đơn giá HC</div>
                <div style="font-size: 15px; font-weight: 800; color: #d97706;">${formatMoney(hao.daily_rate_hc)}/ngày</div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
              <div>• Lương OT: <strong>${formatMoney(hao.hourly_rate_ot)}/h</strong></div>
              <div>• Phụ cấp tháng: <strong style="color: #dc2626;">0 đ</strong></div>
              <div>• Trích quỹ: <strong>20.000 đ/công</strong></div>
              <div>• Tích lũy T8-T10: <strong style="color: #059669;">${formatMoney(hao.luy_ke_t8_t10)}</strong></div>
            </div>
            <div style="margin-top: 10px; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #334155;">
              T10 thực lĩnh: <strong>${formatMoney(hao.records.t10.thuc_linh)}</strong> (30 công + 62h OT, tạm ứng 0 đ).
            </div>
          </div>

        </div>

        <!-- BẢNG ĐỐI SOÁT LŨY KẾ CHI TIẾT T8 - T10 & ĐẦU T11 -->
        <div style="background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <h2 style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a;">
                BẢNG ĐỐI SOÁT LŨY KẾ CÔNG, LƯƠNG & TRÍCH QUỸ NÒNG CỐT (T8 - T10/2026)
              </h2>
              <span style="font-size: 12px; color: #64748b;">Dữ liệu đối soát thực tế 100% khớp chứng từ quyết toán & tin nhắn Zalo nội bộ</span>
            </div>
            <div style="font-size: 12px; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 6px; font-weight: 600;">
              Đối soát: KHỚP 100%
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
              <thead>
                <tr style="background: #f1f5f9; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1;">
                  <th style="padding: 12px 14px;">Tháng / Kỳ</th>
                  <th style="padding: 12px 14px;">Nhân sự</th>
                  <th style="padding: 12px 14px; text-align: right;">Công HC</th>
                  <th style="padding: 12px 14px; text-align: right;">Giờ OT</th>
                  <th style="padding: 12px 14px; text-align: right;">Lương HC</th>
                  <th style="padding: 12px 14px; text-align: right;">Lương OT</th>
                  <th style="padding: 12px 14px; text-align: right; color: #dc2626;">Phụ cấp</th>
                  <th style="padding: 12px 14px; text-align: right; color: #d97706;">Tạm ứng</th>
                  <th style="padding: 12px 14px; text-align: right; font-weight: 800;">Thực lĩnh</th>
                  <th style="padding: 12px 14px; text-align: right; background: #eff6ff; color: #1e40af; font-weight: 800;">Trích Quỹ 20k</th>
                  <th style="padding: 12px 14px;">Trạng thái Quỹ</th>
                </tr>
              </thead>
              <tbody>
                
                <!-- THÁNG 8 - HÒA -->
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 14px; font-weight: 600; color: #334155;">Tháng 08/2026</td>
                  <td style="padding: 10px 14px; font-weight: 600; color: #0284c7;">Hà Viết Hòa</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatNumber(hoa.records.t8.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">-</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hoa.records.t8.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626; font-weight: 700;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatMoney(hoa.records.t8.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #eff6ff; font-weight: 800; color: #1d4ed8;">${formatMoney(hoa.records.t8.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #059669; font-size: 12px; font-weight: 600;">Giữ két BGĐ</td>
                </tr>

                <!-- THÁNG 8 - HÀO -->
                <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;">
                  <td style="padding: 10px 14px; font-weight: 600; color: #334155;">Tháng 08/2026</td>
                  <td style="padding: 10px 14px; font-weight: 600; color: #b45309;">Lương Thế Hào</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatNumber(hao.records.t8.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">-</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hao.records.t8.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626; font-weight: 700;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatMoney(hao.records.t8.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #eff6ff; font-weight: 800; color: #1d4ed8;">${formatMoney(hao.records.t8.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #059669; font-size: 12px; font-weight: 600;">Giữ két BGĐ</td>
                </tr>

                <!-- THÁNG 9 - HÒA -->
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 14px; font-weight: 600; color: #334155;">Tháng 09/2026</td>
                  <td style="padding: 10px 14px; font-weight: 600; color: #0284c7;">Hà Viết Hòa</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatNumber(hoa.records.t9.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">-</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hoa.records.t9.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626; font-weight: 700;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatMoney(hoa.records.t9.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #eff6ff; font-weight: 800; color: #1d4ed8;">${formatMoney(hoa.records.t9.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #059669; font-size: 12px; font-weight: 600;">Giữ két BGĐ</td>
                </tr>

                <!-- THÁNG 9 - HÀO -->
                <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;">
                  <td style="padding: 10px 14px; font-weight: 600; color: #334155;">Tháng 09/2026</td>
                  <td style="padding: 10px 14px; font-weight: 600; color: #b45309;">Lương Thế Hào</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatNumber(hao.records.t9.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">-</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hao.records.t9.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626; font-weight: 700;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatMoney(hao.records.t9.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #eff6ff; font-weight: 800; color: #1d4ed8;">${formatMoney(hao.records.t9.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #059669; font-size: 12px; font-weight: 600;">Giữ két BGĐ</td>
                </tr>

                <!-- THÁNG 10 - HÒA -->
                <tr style="border-bottom: 1px solid #f1f5f9; background: #f0fdf4;">
                  <td style="padding: 10px 14px; font-weight: 700; color: #166534;">Tháng 10/2026</td>
                  <td style="padding: 10px 14px; font-weight: 700; color: #0284c7;">Hà Viết Hòa</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatNumber(hoa.records.t10.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatNumber(hoa.records.t10.gio_ot)}h</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hoa.records.t10.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right; color: #059669;">${formatMoney(hoa.records.t10.luong_ot)}</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626; font-weight: 700;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; color: #d97706;">${formatMoney(hoa.records.t10.tam_ung)}</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 800; color: #0f172a;">${formatMoney(hoa.records.t10.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #eff6ff; font-weight: 800; color: #1d4ed8;">${formatMoney(hoa.records.t10.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #059669; font-size: 12px; font-weight: 600;">Giữ két BGĐ</td>
                </tr>

                <!-- THÁNG 10 - HÀO -->
                <tr style="border-bottom: 2px solid #cbd5e1; background: #f0fdf4;">
                  <td style="padding: 10px 14px; font-weight: 700; color: #166534;">Tháng 10/2026</td>
                  <td style="padding: 10px 14px; font-weight: 700; color: #b45309;">Lương Thế Hào</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatNumber(hao.records.t10.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 700;">${formatNumber(hao.records.t10.gio_ot)}h</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hao.records.t10.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right; color: #059669;">${formatMoney(hao.records.t10.luong_ot)}</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626; font-weight: 700;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; font-weight: 800; color: #0f172a;">${formatMoney(hao.records.t10.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #eff6ff; font-weight: 800; color: #1d4ed8;">${formatMoney(hao.records.t10.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #059669; font-size: 12px; font-weight: 600;">Giữ két BGĐ</td>
                </tr>

                <!-- TỔNG KẾT T8-T10 -->
                <tr style="background: #e2e8f0; font-weight: 800; color: #0f172a; border-bottom: 2px solid #94a3b8;">
                  <td colspan="2" style="padding: 12px 14px; text-transform: uppercase;">TỔNG LŨY KẾ T8 - T10 BẢO LƯU KÉT SẮT BGĐ:</td>
                  <td style="padding: 12px 14px; text-align: right;">174.0 công</td>
                  <td style="padding: 12px 14px; text-align: right;">128.0h</td>
                  <td style="padding: 12px 14px; text-align: right;">85.020.000 đ</td>
                  <td style="padding: 12px 14px; text-align: right;">11.790.000 đ</td>
                  <td style="padding: 12px 14px; text-align: right; color: #dc2626;">0 đ</td>
                  <td style="padding: 12px 14px; text-align: right;">1.590.000 đ</td>
                  <td style="padding: 12px 14px; text-align: right; color: #0f172a;">95.220.000 đ</td>
                  <td style="padding: 12px 14px; text-align: right; background: #dbeafe; color: #1e3a8a; font-size: 15px;">${formatMoney(totals.luy_ke_t8_t10)}</td>
                  <td style="padding: 12px 14px; color: #1e3a8a;">ĐANG KHÓA KÉT</td>
                </tr>

                <!-- ĐẦU THÁNG 11 TẠM TÍNH -->
                <tr style="border-bottom: 1px dashed #cbd5e1; background: #fffbeb;">
                  <td style="padding: 10px 14px; color: #78350f;">Đầu T11 (01-06/11)</td>
                  <td style="padding: 10px 14px; color: #78350f;">Hà Viết Hòa</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatNumber(hoa.records.t11_est.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">-</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hoa.records.t11_est.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hoa.records.t11_est.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #fef3c7; color: #92400e; font-weight: 700;">${formatMoney(hoa.records.t11_est.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #b45309; font-size: 12px;">Đang tích lũy</td>
                </tr>
                <tr style="border-bottom: 2px solid #cbd5e1; background: #fffbeb;">
                  <td style="padding: 10px 14px; color: #78350f;">Đầu T11 (01-06/11)</td>
                  <td style="padding: 10px 14px; color: #78350f;">Lương Thế Hào</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatNumber(hao.records.t11_est.cong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">-</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hao.records.t11_est.luong_hc)}</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right; color: #dc2626;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">0 đ</td>
                  <td style="padding: 10px 14px; text-align: right;">${formatMoney(hao.records.t11_est.thuc_linh)}</td>
                  <td style="padding: 10px 14px; text-align: right; background: #fef3c7; color: #92400e; font-weight: 700;">${formatMoney(hao.records.t11_est.quy_trich_20k)}</td>
                  <td style="padding: 10px 14px; color: #b45309; font-size: 12px;">Đang tích lũy</td>
                </tr>

                <!-- TỔNG CỘNG TOÀN BỘ ĐẾN HIỆN TẠI -->
                <tr style="background: #1e293b; color: #ffffff; font-weight: 800;">
                  <td colspan="2" style="padding: 14px; text-transform: uppercase;">TỔNG CỘNG LŨY KẾ ĐẾN HIỆN TẠI (GỒM T11):</td>
                  <td style="padding: 14px; text-align: right; color: #38bdf8;">185.0 công</td>
                  <td style="padding: 14px; text-align: right;">128.0h</td>
                  <td style="padding: 14px; text-align: right;">90.410.000 đ</td>
                  <td style="padding: 14px; text-align: right;">11.790.000 đ</td>
                  <td style="padding: 14px; text-align: right; color: #f87171;">0 đ</td>
                  <td style="padding: 14px; text-align: right;">1.590.000 đ</td>
                  <td style="padding: 14px; text-align: right;">100.610.000 đ</td>
                  <td style="padding: 14px; text-align: right; background: #0284c7; color: #ffffff; font-size: 16px;">${formatMoney(totals.luy_ke_tam_tinh_hien_tai)}</td>
                  <td style="padding: 14px; color: #4ade80;">BẢO LƯU 100%</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        <!-- CÔNG CỤ TÍNH THỬ & ĐỐI SOÁT NHANH -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; font-weight: 700;">
            🛠️ CÔNG CỤ TÍNH NHANH TRÍCH QUỸ NÒNG CỐT THEO SỐ CÔNG THỰC TẾ
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end;">
            <div>
              <label style="display: block; font-size: 12px; color: #475569; font-weight: 600; margin-bottom: 4px;">Chọn Thợ nòng cốt:</label>
              <select id="w03-calc-worker" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: #f8fafc;">
                <option value="hoa">Võ Đức Hòa (530.000 đ/ngày - Thợ cả)</option>
                <option value="hao">Lương Thế Hào (450.000 đ/ngày - Thợ lắp)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; color: #475569; font-weight: 600; margin-bottom: 4px;">Số ngày công thực tế:</label>
              <input id="w03-calc-days" type="number" step="0.5" min="0" value="28" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; width: 120px;" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; color: #475569; font-weight: 600; margin-bottom: 4px;">Số giờ OT (tăng ca):</label>
              <input id="w03-calc-ot" type="number" step="0.5" min="0" value="0" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; width: 120px;" />
            </div>
            <button id="w03-calc-btn" style="padding: 8px 18px; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
              Tính toán ngay
            </button>
          </div>

          <div id="w03-calc-result" style="margin-top: 16px; padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: none;">
            <!-- Render kết quả qua JavaScript -->
          </div>
        </div>

        <!-- 4 ĐIỀU LỆ THÉP QUẢN TRỊ DÒNG TIỀN KÉT SẮT -->
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 18px; font-size: 13px; color: #881337;">
          <div style="font-weight: 800; font-size: 14px; margin-bottom: 8px; color: #9f1239; display: flex; align-items: center; gap: 6px;">
            ⚠️ 4 NGUYÊN TẮC LUẬT SẮT BẮT BUỘC TUÂN THỦ 100%:
          </div>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li><strong>Khoản trích 20.000 đ/công:</strong> Giữ an toàn tuyệt đối trong két sắt Ban Giám Đốc đến kỳ quyết toán tất niên cuối năm. Hàng tháng TUYỆT ĐỐI CẤM xuất quỹ chi tiền mặt.</li>
            <li><strong>Phụ cấp hàng tháng = 0 đ:</strong> Cấm mọi hình thức hỗ trợ phụ cấp tiền mặt ngoài lương khoán ngày công thực tế và giờ OT đã chốt.</li>
            <li><strong>Quyết toán thợ cả & thợ lắp ráp:</strong> Chỉ thanh toán lương thực tế theo số công điểm danh sống và giờ OT có xác nhận của Kỹ thuật/Quản lý xưởng.</li>
            <li><strong>Thưởng vượt doanh số > 500M (Vũ 0.3%, Thái 0.5%, Hiệp 0.5%):</strong> Giữ lại đến cuối năm đối soát xong và tỷ lệ thu hồi nợ ≥ 85% mới chi trả.</li>
          </ol>
        </div>

      </div>
      `;
    },

    /**
     * Gắn sự kiện tương tác cho module
     */
    bindEvents: function (container) {
      const calcBtn = container.querySelector("#w03-calc-btn");
      const workerSelect = container.querySelector("#w03-calc-worker");
      const daysInput = container.querySelector("#w03-calc-days");
      const otInput = container.querySelector("#w03-calc-ot");
      const resultDiv = container.querySelector("#w03-calc-result");

      if (!calcBtn || !resultDiv) return;

      calcBtn.addEventListener("click", function () {
        const workerKey = workerSelect.value;
        const days = parseFloat(daysInput.value) || 0;
        const otHours = parseFloat(otInput.value) || 0;
        const worker = AUDIT_DATA.workers[workerKey];

        const luongHc = days * worker.daily_rate_hc;
        const luongOt = otHours * worker.hourly_rate_ot;
        const tongLuong = luongHc + luongOt;
        const quyTrich = days * 20000;

        resultDiv.style.display = "block";
        resultDiv.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div>
              <span style="font-size: 11px; color: #64748b;">Lương HC (${days} công):</span>
              <div style="font-size: 16px; font-weight: 700; color: #0f172a;">${formatMoney(luongHc)}</div>
            </div>
            <div>
              <span style="font-size: 11px; color: #64748b;">Lương OT (${otHours} giờ):</span>
              <div style="font-size: 16px; font-weight: 700; color: #059669;">${formatMoney(luongOt)}</div>
            </div>
            <div>
              <span style="font-size: 11px; color: #64748b;">Phụ cấp hàng tháng:</span>
              <div style="font-size: 16px; font-weight: 700; color: #dc2626;">0 đ (Cấm chi tiền mặt)</div>
            </div>
            <div>
              <span style="font-size: 11px; color: #64748b;">Thực lĩnh tháng tạm tính:</span>
              <div style="font-size: 16px; font-weight: 800; color: #2563eb;">${formatMoney(tongLuong)}</div>
            </div>
            <div style="background: #dbeafe; padding: 8px 12px; border-radius: 6px;">
              <span style="font-size: 11px; color: #1e40af; font-weight: 700;">Trích Quỹ nòng cốt (20k/công):</span>
              <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">${formatMoney(quyTrich)}</div>
              <span style="font-size: 10px; color: #3b82f6;">Khóa trong két sắt BGĐ đến tất niên cuối năm</span>
            </div>
          </div>
        `;
      });
    },

    /**
     * Khởi tạo module và gắn vào phần tử DOM
     * @param {string|HTMLElement} target Phần tử hoặc selector DOM
     */
    render: function (target) {
      let container = null;
      if (typeof target === "string") {
        container = document.querySelector(target);
      } else if (target && target.nodeType) {
        container = target;
      }

      if (!container) {
        container = document.getElementById("pg-w03-module-container");
      }

      const html = this.generateHTML();

      if (container) {
        container.innerHTML = html;
        this.bindEvents(container);
      }

      return html;
    }
  };

  // Đăng ký toàn cục
  window.PG_Modules_W03 = PG_Modules_W03;

  // Auto-init nếu có container sẵn trên trang
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
      const defaultContainer = document.getElementById("pg-w03-module-container");
      if (defaultContainer) {
        PG_Modules_W03.render(defaultContainer);
      }
    });
  }

})(typeof window !== "undefined" ? window : this);
