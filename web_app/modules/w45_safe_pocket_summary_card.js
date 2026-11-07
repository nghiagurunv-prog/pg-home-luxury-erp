/**
 * MODULE W45: BẢNG SỐ LIỆU BỎ TÚI BAN GIÁM ĐỐC - KÉT SẮT THỰC CHI & LỢI NHUẬN RÒNG (SAFE POCKET SUMMARY CARD)
 * Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0986.722.324
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W45 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DIRECTOR_SAFE_POCKET = {
    companyLegal: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng',
    taxCode: '042203002931',
    address: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    hotline: '0986.722.324',
    director: 'Nguyễn Viết Nghĩa (Đại diện HKD: Nguyễn Trọng Nghĩa)',
    t8t9Verified: {
      woodRevenue: 529834472,
      material40Pct: 211933789,
      workerQuota15Pct: 79475171,
      workerActualPaid: 85337813,
      workshopColBG: 0,
      directorSalary: 24000000,
      officeProfitWood: 32438721,
      accessorySofaProfit: 11652000,
      netPocketProfitT8T9: 44090721
    },
    fullYear2026: {
      totalRevenue12M: 4049412472,
      actualCollectedCash: 3256042174,
      customerReceivables: 793370298,
      bacPhatReceivable95Pct: 125730000,
      supplierPayables9NCC: 385887550,
      board3NCCPayables: 241320000,
      payrollT10CashOut: 120013750,
      retainedCoreWorkerFundT8T10: 2880000
    }
  };

  function getPocketData() {
    return DIRECTOR_SAFE_POCKET;
  }

  function render(containerId) {
    if (typeof document === 'undefined') return '';
    const el = document.getElementById(containerId);
    const d = DIRECTOR_SAFE_POCKET;
    const html = `
      <div class="pg-w45-pocket" style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border:2px solid #d4af37;border-radius:14px;padding:18px;color:#f8fafc;box-shadow:0 10px 25px rgba(0,0,0,0.4);">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(212,175,55,0.3);padding-bottom:10px;margin-bottom:12px;">
          <div>
            <h3 style="margin:0;color:#d4af37;font-size:16px;">👑 W45: Sổ Tay Két Sắt Bỏ Túi Giám Đốc Nguyễn Viết Nghĩa</h3>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${d.companyLegal} · MST: ${d.taxCode} · ${d.address} · ĐT: ${d.hotline}</div>
          </div>
          <span style="background:#d4af37;color:#0f172a;padding:5px 12px;border-radius:99px;font-size:12px;font-weight:800;">
            Lãi Ròng T8+T9: +44.090.721 đ
          </span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px;">
          <div style="background:rgba(15,23,42,0.8);padding:10px;border-radius:8px;border-left:3px solid #10b981;">
            <div style="color:#94a3b8;">Lợi Nhuận Ròng Bỏ Túi T8+T9</div>
            <div style="font-size:16px;font-weight:800;color:#10b981;margin-top:4px;">44.090.721 đ</div>
            <div style="font-size:10px;color:#64748b;">Gỗ VP 32.44M + Phụ kiện/Sofa 11.65M (Col BG = 0 đ)</div>
          </div>
          <div style="background:rgba(15,23,42,0.8);padding:10px;border-radius:8px;border-left:3px solid #3b82f6;">
            <div style="color:#94a3b8;">Doanh Số 12 Tháng / Thực Thu</div>
            <div style="font-size:16px;font-weight:800;color:#60a5fa;margin-top:4px;">4,049 Tỷ / 3,256 Tỷ</div>
            <div style="font-size:10px;color:#64748b;">Nợ phải thu KH: 793.37M (Bác Phát: 125.73M)</div>
          </div>
          <div style="background:rgba(15,23,42,0.8);padding:10px;border-radius:8px;border-left:3px solid #f59e0b;">
            <div style="color:#94a3b8;">Công Nợ 9 NCC / 3 NCC Ván</div>
            <div style="font-size:16px;font-weight:800;color:#fbbf24;margin-top:4px;">385.89M / 241.32M</div>
            <div style="font-size:10px;color:#64748b;">Lam Giang 147.49M · Cầu Vượt 82.07M · Cường Thịnh 11.76M</div>
          </div>
          <div style="background:rgba(15,23,42,0.8);padding:10px;border-radius:8px;border-left:3px solid #a855f7;">
            <div style="color:#94a3b8;">Quỹ Treo Cuối Năm Hòa & Hào</div>
            <div style="font-size:16px;font-weight:800;color:#c084fc;margin-top:4px;">2.880.000 đ (T8-T10)</div>
            <div style="font-size:10px;color:#64748b;">Trích 20k/công giữ đến Tất niên (Cấm chi hàng tháng)</div>
          </div>
        </div>
      </div>
    `;
    if (el) el.innerHTML = html;
    return html;
  }

  return {
    moduleId: 'W45',
    version: '6.5.0',
    getPocketData,
    render
  };
});

