/**
 * MODULE W22: KHO 407 BẢN VẼ KỸ THUẬT PDF & HỒ SƠ NESTING CNC (PDF VAULT)
 * Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931)
 * Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh | Hotline: 0973.562.789
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W22 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PDF_VAULT_STATS = {
    totalPdfDrawings: 407,
    categories: [
      { id: 'CNC_NESTING', name: 'Sơ đồ cắt ván CNC & Bóc tách phôi (Vũ Kỹ Thuật)', count: 164, normChecked: true },
      { id: 'SHOP_DRAWING_2D', name: 'Bản vẽ kỹ thuật thi công 2D (Tủ bếp, Tủ áo, Vách ốp)', count: 142, normChecked: true },
      { id: 'RENDER_3D_CONCEPT', name: 'Hồ sơ phối cảnh 3D duyệt khách (Hiệp 3D)', count: 68, normChecked: true },
      { id: 'ACRYLIC_NTD_ORDER', name: 'Phiếu đặt gia công cánh Acrylic Noline & Kính', count: 33, normChecked: true }
    ],
    sampleDrawings: [
      { id: 'PDF-001', title: 'Bản vẽ CNC Tủ bếp dưới R09 - Nhà Anh Nam (3.77md = 5.5 tấm)', category: 'CNC_NESTING', sheets: 5.5, approvedByDirector: true },
      { id: 'PDF-002', title: 'Bản vẽ CNC Tủ áo kịch trần R27, R40, R49 - Nhà Anh Nam (Trừ 0.4 tấm/m2 cánh kính)', category: 'CNC_NESTING', sheets: 28.4, approvedByDirector: true },
      { id: 'PDF-003', title: 'Hồ sơ kỹ thuật thi công toàn bộ nội thất Nhà Bác Phát (Tiến độ 95%)', category: 'SHOP_DRAWING_2D', sheets: 52.0, approvedByDirector: true },
      { id: 'PDF-004', title: 'Đặt hàng Cánh Acrylic Noline An Cường PARC 01 / 101 SH', category: 'ACRYLIC_NTD_ORDER', sheets: 12.0, approvedByDirector: true }
    ]
  };

  function getVaultStats() {
    return PDF_VAULT_STATS;
  }

  function searchDrawings(keyword) {
    const q = String(keyword || '').toLowerCase().trim();
    if (!q) return PDF_VAULT_STATS.sampleDrawings;
    return PDF_VAULT_STATS.sampleDrawings.filter(d => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
  }

  function render(containerId) {
    if (typeof document === 'undefined') return '';
    const el = document.getElementById(containerId);
    const html = `
      <div class="pg-w22-pdf-vault" style="background:#0f172a;border:1px solid rgba(212,175,55,0.3);border-radius:12px;padding:16px;color:#f8fafc;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;color:#d4af37;font-size:15px;">📐 W22: Kho 407 Bản Vẽ Kỹ Thuật PDF & Hồ Sơ Nesting CNC</h3>
          <span style="background:rgba(59,130,246,0.18);color:#60a5fa;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600;">
            407 Bản Vẽ PDF Đã Đồng Bộ
          </span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
          ${PDF_VAULT_STATS.categories.map(c => `
            <div style="background:rgba(30,41,59,0.75);padding:10px;border-radius:8px;border-left:3px solid #60a5fa;">
              <div style="font-size:17px;font-weight:700;">${c.count} file PDF</div>
              <div style="font-size:11px;color:#94a3b8;margin-top:4px;">${c.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    if (el) el.innerHTML = html;
    return html;
  }

  return {
    moduleId: 'W22',
    version: '6.5.0',
    getVaultStats,
    searchDrawings,
    render
  };
});

