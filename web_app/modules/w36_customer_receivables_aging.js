/**
 * MODULE W36: PHÂN TÍCH TUỔI NỢ PHẢI THU KHÁCH HÀNG & LỊCH THU TIỀN (RECEIVABLES AGING)
 * Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0986.722.324
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W36 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const RECEIVABLES_LIST = [
    {
      customer: 'Nhà Bác Phát',
      contractCode: '01/10/2026/HĐTC-NT',
      contractValue: 225730000,
      collected: 100000000,
      receivable: 125730000,
      progressPct: 95,
      agingBucket: 'CRITICAL_95PCT_DONE',
      nextMilestoneCall: 80584000,
      finalRetention5Pct: 45146000,
      owner: 'Tống Trần Hiệp & Đường Việt Dũng',
      priority: 'HIGHEST'
    },
    {
      customer: 'Nhà Anh Nam',
      contractCode: '06/11/2026/HĐTC-ANHNAM',
      contractValue: 295911033,
      collected: 150000000,
      receivable: 145911033,
      progressPct: 85,
      agingBucket: 'INSTALLING_80_90PCT',
      nextMilestoneCall: 86728826,
      finalRetention5Pct: 59182207,
      owner: 'Đường Việt Dũng',
      priority: 'HIGH'
    },
    {
      customer: 'Các hợp đồng lẻ & Bổ sung T10-T11/2026',
      contractCode: 'HD-T10-T11-POOL',
      contractValue: 810000000,
      collected: 288270298,
      receivable: 521729702,
      progressPct: 70,
      agingBucket: 'PRODUCTION_50_80PCT',
      nextMilestoneCall: 310000000,
      finalRetention5Pct: 211729702,
      owner: 'Phòng Kinh Doanh & Sale Admin',
      priority: 'MEDIUM'
    }
  ];

  function getAgingReport() {
    const totalReceivables = RECEIVABLES_LIST.reduce((s, r) => s + r.receivable, 0);
    const immediateCallAmount = RECEIVABLES_LIST.reduce((s, r) => s + r.nextMilestoneCall, 0);
    return {
      totalReceivables, // 793,370,735 đ khớp CCSC
      immediateCallAmount,
      bacPhatHighlight: RECEIVABLES_LIST[0],
      items: RECEIVABLES_LIST
    };
  }

  function render(containerId) {
    if (typeof document === 'undefined') return '';
    const el = document.getElementById(containerId);
    const report = getAgingReport();
    const html = `
      <div class="pg-w36-aging" style="background:#0f172a;border:1px solid rgba(212,175,55,0.3);border-radius:12px;padding:16px;color:#f8fafc;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;color:#d4af37;font-size:15px;">💰 W36: Tuổi Nợ Phải Thu Khách Hàng & Lịch Đòi Tiền Theo Tiến Độ</h3>
          <span style="background:rgba(239,68,68,0.2);color:#f87171;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:700;">
            Tổng Phải Thu: ${report.totalReceivables.toLocaleString('vi-VN')} đ
          </span>
        </div>
        <div style="background:rgba(239,68,68,0.1);border-left:4px solid #ef4444;padding:10px;border-radius:6px;margin-bottom:10px;font-size:12px;">
          🚨 <strong>ƯU TIÊN SỐ 1 (NHÀ BÁC PHÁT - ĐÃ XONG 95%):</strong> HĐ <strong>225.730.000 đ</strong>, mới thu <strong>100.000.000 đ</strong> (44.3%). Cần thu ngay đợt lắp đặt 80%: <strong>80.584.000 đ</strong> + nghiệm thu bàn giao: <strong>45.146.000 đ</strong> (Tổng còn thu: <strong>125.730.000 đ</strong>).
        </div>
      </div>
    `;
    if (el) el.innerHTML = html;
    return html;
  }

  return {
    moduleId: 'W36',
    version: '6.5.0',
    getAgingReport,
    render
  };
});

