/**
 * MODULE W37: HIỆU SUẤT SẢN XUẤT XƯỞNG & ĐỐI SOÁT QUỸ KHOÁN THỢ 15% (WORKSHOP PRODUCTIVITY KPI)
 * Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0986.722.324
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W37 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WORKSHOP_MONTHS = [
    {
      month: 'T8/2026',
      woodVal: 242051705,
      quota15Pct: 36307756,
      actualWagePaid: 41285625,
      variance: -4977869,
      colBGProfit: 0,
      status: 'DEFICIT_LOCKED_COL_BG_0'
    },
    {
      month: 'T9/2026',
      woodVal: 287782767,
      quota15Pct: 43167415,
      actualWagePaid: 44052188,
      variance: -884773,
      colBGProfit: 0,
      status: 'DEFICIT_LOCKED_COL_BG_0'
    },
    {
      month: 'T10/2026',
      woodVal: 450000000,
      quota15Pct: 67500000,
      actualWagePaid: 65473750,
      variance: 2026250,
      colBGProfit: 9900000,
      status: 'SURPLUS_POSITIVE'
    }
  ];

  function evaluateWorkshopMonth(woodVal, actualWagePaid) {
    const quota15Pct = Math.round(woodVal * 0.15);
    const variance = quota15Pct - actualWagePaid;
    const colBGProfit = variance < 0 ? 0 : Math.round(woodVal * 0.022);
    return {
      woodVal,
      quota15Pct,
      actualWagePaid,
      variance,
      colBGProfit,
      isDeficit: variance < 0
    };
  }

  function getKPIReport() {
    const t8t9WoodVal = WORKSHOP_MONTHS[0].woodVal + WORKSHOP_MONTHS[1].woodVal;
    const t8t9Quota15 = WORKSHOP_MONTHS[0].quota15Pct + WORKSHOP_MONTHS[1].quota15Pct;
    const t8t9ActualWage = WORKSHOP_MONTHS[0].actualWagePaid + WORKSHOP_MONTHS[1].actualWagePaid;
    return {
      months: WORKSHOP_MONTHS,
      t8t9Summary: {
        woodVal: t8t9WoodVal, // 529,834,472 đ
        quota15Pct: t8t9Quota15, // 79,475,171 đ
        actualWagePaid: t8t9ActualWage, // 85,337,813 đ
        variance: t8t9Quota15 - t8t9ActualWage, // -5,862,642 đ
        colBGProfit: 0 // Khóa cứng Col BG = 0 đ khi âm quỹ khoán 15%
      }
    };
  }

  function render(containerId) {
    if (typeof document === 'undefined') return '';
    const el = document.getElementById(containerId);
    const r = getKPIReport();
    const html = `
      <div class="pg-w37-kpi" style="background:#0f172a;border:1px solid rgba(212,175,55,0.3);border-radius:12px;padding:16px;color:#f8fafc;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;color:#d4af37;font-size:15px;">🏭 W37: Hiệu Suất Sản Xuất Xưởng & Chốt Chặn Quỹ Khoán Thợ 15%</h3>
          <span style="background:rgba(245,158,11,0.2);color:#fbbf24;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:700;">
            T8+T9 Âm Quỹ -5.86M ➔ Col BG = 0 đ
          </span>
        </div>
        <div style="font-size:12px;color:#cbd5e1;">
          Doanh số gỗ CN T8+T9: <strong>${r.t8t9Summary.woodVal.toLocaleString('vi-VN')} đ</strong> |
          Định mức 15%: <strong>${r.t8t9Summary.quota15Pct.toLocaleString('vi-VN')} đ</strong> |
          Thực chi lương thợ: <strong>${r.t8t9Summary.actualWagePaid.toLocaleString('vi-VN')} đ</strong> |
          Lợi nhuận xưởng (Col BG): <strong style="color:#f87171;">0 đ (Khóa Cứng Kỷ Luật Thép)</strong>
        </div>
      </div>
    `;
    if (el) el.innerHTML = html;
    return html;
  }

  return {
    moduleId: 'W37',
    version: '6.5.0',
    evaluateWorkshopMonth,
    getKPIReport,
    render
  };
});

