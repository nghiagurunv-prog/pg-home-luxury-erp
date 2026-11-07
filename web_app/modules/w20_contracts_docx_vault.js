/**
 * MODULE W20: KHO 40 HỢP ĐỒNG & BIÊN BẢN NGHIỆM THU DOCX (CONTRACTS VAULT)
 * Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0973.562.789
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W20 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CONTRACTS_VAULT = [
    {
      code: 'HD-01/10/2026/HĐTC-NT',
      customer: 'Bác Phát',
      project: 'Thi công nội thất trọn gói nhà Bác Phát',
      totalValue: 225730000,
      woodVal: 185730000,
      solidWood: 0,
      accVal: 40000000,
      paidAmount: 100000000,
      remainingDebt: 125730000,
      progressPct: 95,
      status: 'URGENT_COLLECTION_95PCT',
      docxFile: 'HĐTC Nội thất Bác Phát - Phú Gia Luxury.docx'
    },
    {
      code: 'HD-06/11/2026/HĐTC-ANHNAM',
      customer: 'Anh Nam',
      project: 'Nội thất nhà Anh Nam (Chuẩn hóa định mức CNC)',
      totalValue: 295911033,
      woodVal: 238411033,
      solidWood: 0,
      accVal: 57500000,
      paidAmount: 150000000,
      remainingDebt: 145911033,
      progressPct: 85,
      status: 'IN_PROGRESS',
      docxFile: 'HĐTC Nội thất Anh Nam - Phú Gia Luxury.docx'
    },
    {
      code: 'HD-T8-2026/CHI-HOA',
      customer: 'Chị Hoa',
      project: 'Nội thất gỗ công nghiệp & gỗ thịt Chị Hoa',
      totalValue: 168500000,
      woodVal: 146500000,
      solidWood: 22000000,
      accVal: 0,
      paidAmount: 168500000,
      remainingDebt: 0,
      progressPct: 100,
      status: 'COMPLETED_SETTLED',
      docxFile: 'Biên bản nghiệm thu & Thanh lý HĐ Chị Hoa.docx'
    },
    {
      code: 'HD-T8-2026/CAU-CHIEN',
      customer: 'Cậu Chiến',
      project: 'Thi công nội thất nhà Cậu Chiến',
      totalValue: 142000000,
      woodVal: 125500000,
      solidWood: 16500000,
      accVal: 0,
      paidAmount: 142000000,
      remainingDebt: 0,
      progressPct: 100,
      status: 'COMPLETED_SETTLED',
      docxFile: 'HĐTC & Nghiệm thu nhà Cậu Chiến.docx'
    }
  ];

  function getVaultSummary() {
    const totalContractsDocx = 40;
    const trackedValue = CONTRACTS_VAULT.reduce((s, c) => s + c.totalValue, 0);
    const trackedPaid = CONTRACTS_VAULT.reduce((s, c) => s + c.paidAmount, 0);
    const trackedRemaining = CONTRACTS_VAULT.reduce((s, c) => s + c.remainingDebt, 0);
    return {
      totalDocxFiles: totalContractsDocx,
      featuredContracts: CONTRACTS_VAULT,
      trackedValue,
      trackedPaid,
      trackedRemaining,
      legalEntity: 'Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)'
    };
  }

  function render(containerId) {
    if (typeof document === 'undefined') return '';
    const el = document.getElementById(containerId);
    const s = getVaultSummary();
    const html = `
      <div class="pg-w20-vault" style="background:#0f172a;border:1px solid rgba(212,175,55,0.3);border-radius:12px;padding:16px;color:#f8fafc;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;color:#d4af37;font-size:15px;">📄 W20: Kho 40 Hợp Đồng & Biên Bản Nghiệm Thu DOCX</h3>
          <span style="background:rgba(239,68,68,0.18);color:#f87171;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600;">
            Cảnh báo thu nợ 95%: Nhà Bác Phát còn 125.73M
          </span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="border-bottom:1px solid #334155;color:#94a3b8;text-align:left;">
              <th style="padding:6px;">Số HĐ</th>
              <th style="padding:6px;">Chủ Đầu Tư</th>
              <th style="padding:6px;text-align:right;">Giá Trị HĐ</th>
              <th style="padding:6px;text-align:right;">Đã Thu</th>
              <th style="padding:6px;text-align:right;">Còn Nợ</th>
              <th style="padding:6px;text-align:center;">Tiến Độ</th>
            </tr>
          </thead>
          <tbody>
            ${s.featuredContracts.map(c => `
              <tr style="border-bottom:1px solid rgba(51,65,85,0.5);">
                <td style="padding:6px;font-family:monospace;color:#d4af37;">${c.code}</td>
                <td style="padding:6px;font-weight:600;">${c.customer}</td>
                <td style="padding:6px;text-align:right;">${c.totalValue.toLocaleString('vi-VN')} đ</td>
                <td style="padding:6px;text-align:right;color:#10b981;">${c.paidAmount.toLocaleString('vi-VN')} đ</td>
                <td style="padding:6px;text-align:right;color:${c.remainingDebt > 0 ? '#f87171' : '#94a3b8'};font-weight:700;">${c.remainingDebt.toLocaleString('vi-VN')} đ</td>
                <td style="padding:6px;text-align:center;">${c.progressPct}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    if (el) el.innerHTML = html;
    return html;
  }

  return {
    moduleId: 'W20',
    version: '6.5.0',
    getVaultSummary,
    render
  };
});

