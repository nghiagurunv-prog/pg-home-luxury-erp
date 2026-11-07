/**
 * ===============================================================================================
 * HỆ THỐNG QUẢN TRỊ NỘI BỘ PG HOME LUXURY - MODULE W26
 * TÊN MODULE: W26 Print A4 Quotation & Material Order Engine (Chuẩn In A4 Đẳng Cấp Luxury)
 * BẢN QUYỀN: HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG
 * ===============================================================================================
 * THÔNG TIN PHÁP LÝ & HỆ THỐNG QUY CHUẨN:
 * - Đơn vị: Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng
 * - Mã số ĐKKD/MST: 042203002931 (Đăng ký lần đầu: 13/01/2025 - Đại diện: Nguyễn Trọng Nghĩa)
 * - Địa chỉ ĐKKD: Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh
 * - Tổ hợp VP & Nhà máy: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh
 * - Hotline chuẩn: 0973.562.789
 * - Giám Đốc Điều Hành: Nguyễn Viết Nghĩa
 * ===============================================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PG_Modules_W26 = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // 1. THÔNG TIN PHÁP LÝ BẤT BIẾN THEO HIẾN PHÁP PHÚ GIA
  const PHU_GIA_LEGAL = Object.freeze({
    BRAND_NAME: 'PG HOME LUXURY',
    COMPANY_FULL_NAME: 'HỘ KINH DOANH PHÚ GIA - NỘI THẤT & XÂY DỰNG',
    TAX_CODE: '042203002931',
    REG_DATE: '13/01/2025',
    LEGAL_REP: 'Nguyễn Trọng Nghĩa',
    DIRECTOR: 'Nguyễn Viết Nghĩa',
    FACTORY_OFFICE_ADDRESS: 'Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh',
    REGISTERED_ADDRESS: 'Số 01, Ngõ 53, Đường Trương Quốc Dụng, Phường Thành Sen, Tỉnh Hà Tĩnh',
    HOTLINE: '0973.562.789',
    EMAIL: 'pghomeluxury.hatinh@gmail.com',
    WEBSITE: 'https://pghome.vn',
    SLOGAN: 'Kiến Tạo Không Gian Sống Đẳng Cấp & Bền Vững'
  });

  // 2. HÀM ĐỊNH DẠNG TIỀN TỆ VNĐ
  function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
  }

  // 3. HÀM CHUYỂN SỐ TIỀN THÀNH CHỮ TIẾNG VIỆT CHUẨN XÁC 100%
  function numberToWords(number) {
    const n = Math.round(Math.abs(Number(number) || 0));
    if (n === 0) return 'Không đồng';

    const dv = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
    const cs = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    function readTrio(trio, hasHigher) {
      const h = Math.floor(trio / 100);
      const t = Math.floor((trio % 100) / 10);
      const u = trio % 10;
      let res = '';

      if (h > 0 || hasHigher) {
        res += cs[h] + ' trăm ';
      }

      if (t === 0 && u === 0) {
        return res.trim();
      }

      if (t === 0 && u > 0) {
        if (h > 0 || hasHigher) res += 'lẻ ';
        res += cs[u];
      } else if (t === 1) {
        res += 'mười ';
        if (u === 1) res += 'một';
        else if (u === 5) res += 'lăm';
        else if (u > 0) res += cs[u];
      } else if (t > 1) {
        res += cs[t] + ' mươi ';
        if (u === 1) res += 'mốt';
        else if (u === 5) res += 'lăm';
        else if (u > 0) res += cs[u];
      }

      return res.trim();
    }

    let temp = n;
    const blocks = [];
    while (temp > 0) {
      blocks.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    }

    let words = '';
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      if (b > 0) {
        const hasHigher = i < blocks.length - 1;
        const blockText = readTrio(b, hasHigher);
        words += blockText + ' ' + dv[i] + ' ';
      }
    }

    words = words.trim().replace(/\s+/g, ' ');
    const capitalized = words.charAt(0).toUpperCase() + words.slice(1) + ' đồng chẵn.';
    return capitalized;
  }

  // 4. BỘ TẠO CON DẤU ĐỎ ĐIỆN TỬ PHÚ GIA (SVG VECTOR CHUẨN XÁC)
  function generateRedStampSVG(options = {}) {
    const isApproved = options.isApproved !== false;
    const dateStr = options.dateStr || new Date().toLocaleDateString('vi-VN');
    const approverName = options.approverName || PHU_GIA_LEGAL.DIRECTOR;
    const sealTitle = options.title || 'ĐÃ PHÊ DUYỆT';

    if (!isApproved) {
      return `
        <div class="unapproved-stamp-box">
          <div class="unapproved-inner">
            <div class="unapproved-title">CHỜ GIÁM ĐỐC DUYỆT</div>
            <div class="unapproved-sub">CHƯA CÓ GIÁ TRỊ NHẬP HÀNG / THỰC THI</div>
          </div>
        </div>
      `;
    }

    // Con dấu đỏ điện tử hình tròn chuẩn mực pháp nhân
    return `
      <div class="red-stamp-wrapper" title="Dấu đỏ điện tử xác thực bởi Ban Giám Đốc PG Home">
        <svg class="red-stamp-svg" viewBox="0 0 240 240" width="165" height="165" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="stampUpperArc" d="M 30,120 A 90,90 0 1,1 210,120" fill="none"/>
            <path id="stampLowerArc" d="M 210,120 A 90,90 0 1,1 30,120" fill="none"/>
            <filter id="stampBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>

          <!-- Vòng viền kép chuẩn văn bản hành chính -->
          <circle cx="120" cy="120" r="112" fill="none" stroke="#cf1322" stroke-width="4.5" stroke-dasharray="0" opacity="0.92"/>
          <circle cx="120" cy="120" r="104" fill="none" stroke="#cf1322" stroke-width="1.8" opacity="0.88"/>
          <circle cx="120" cy="120" r="74" fill="none" stroke="#cf1322" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.75"/>

          <!-- Chữ cong vòng ngoài -->
          <text fill="#cf1322" font-size="10.8" font-family="'Times New Roman', serif" font-weight="900" letter-spacing="1.2px">
            <textPath href="#stampUpperArc" startOffset="50%" text-anchor="middle">
              HKD PHÚ GIA - NỘI THẤT &amp; XÂY DỰNG
            </textPath>
          </text>

          <text fill="#cf1322" font-size="9.8" font-family="'Times New Roman', serif" font-weight="800" letter-spacing="1.5px">
            <textPath href="#stampLowerArc" startOffset="50%" text-anchor="middle">
              ★ MST: 042203002931 - TP. HÀ TĨNH ★
            </textPath>
          </text>

          <!-- Trung tâm con dấu -->
          <g transform="translate(120, 120)" text-anchor="middle">
            <!-- Ngôi sao nhỏ đỉnh tâm -->
            <polygon points="0,-38 4,-26 16,-26 6,-18 10,-6 0,-14 -10,-6 -6,-18 -16,-26 -4,-26" fill="#cf1322" opacity="0.9"/>
            
            <text y="-6" fill="#cf1322" font-size="13" font-family="'Times New Roman', serif" font-weight="900" letter-spacing="0.5px">
              ${sealTitle}
            </text>
            <line x1="-50" y1="2" x2="50" y2="2" stroke="#cf1322" stroke-width="1.5" opacity="0.85"/>
            <text y="17" fill="#cf1322" font-size="11" font-family="'Times New Roman', serif" font-weight="800">
              GIÁM ĐỐC
            </text>
            <text y="32" fill="#cf1322" font-size="12" font-family="'Times New Roman', serif" font-weight="900" letter-spacing="0.3px">
              ${approverName}
            </text>
            <text y="45" fill="#cf1322" font-size="8" font-family="'Times New Roman', serif" font-weight="700" opacity="0.8">
              NGÀY: ${dateStr}
            </text>
          </g>
        </svg>
      </div>
    `;
  }

  // 5. CSS STYLESHEET LUXURY DÙNG CHUNG CHO BẢN IN A4
  const SHARED_PRINT_STYLES = `
    @charset "UTF-8";
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }

    body {
      font-family: "Times New Roman", Times, Georgia, serif;
      background: #f1f5f9;
      color: #0f172a;
      line-height: 1.35;
      font-size: 11pt;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .no-print-bar {
      max-width: 210mm;
      margin: 12px auto;
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 18px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
      font-family: system-ui, -apple-system, sans-serif;
    }

    .no-print-bar .title-group h3 {
      font-size: 14px;
      font-weight: 700;
      color: #fbbf24;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .no-print-bar .title-group p {
      font-size: 11px;
      color: #94a3b8;
    }

    .btn-action-group {
      display: flex;
      gap: 8px;
    }

    .btn-print {
      background: linear-gradient(135deg, #d4af37 0%, #b89120 100%);
      color: #0f172a;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .btn-print:hover {
      background: linear-gradient(135deg, #fcd34d 0%, #d4af37 100%);
      transform: translateY(-1px);
    }

    .btn-close {
      background: #334155;
      color: #f8fafc;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
    }

    .btn-close:hover {
      background: #475569;
    }

    .a4-container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 20px auto;
      background: #ffffff;
      padding: 14mm 16mm 14mm 16mm;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
    }

    .a4-container:last-child {
      page-break-after: auto;
    }

    /* HEADER BLOCK */
    .brand-header {
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand-logo-area {
      flex: 1;
    }

    .brand-super-title {
      font-size: 15pt;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.15;
    }

    .brand-sub-title {
      font-size: 9.5pt;
      font-weight: 700;
      color: #b89120;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 1px;
    }

    .legal-meta-list {
      margin-top: 4px;
      font-size: 9pt;
      color: #334155;
      line-height: 1.35;
    }

    .legal-meta-list strong {
      color: #0f172a;
    }

    .brand-badge-area {
      text-align: right;
      min-width: 170px;
    }

    .badge-code-box {
      border: 1.5px solid #0f172a;
      background: #f8fafc;
      padding: 6px 10px;
      border-radius: 4px;
      display: inline-block;
      text-align: right;
    }

    .badge-code-label {
      font-size: 8pt;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
    }

    .badge-code-value {
      font-size: 11pt;
      font-weight: 900;
      color: #b91c1c;
      font-family: monospace;
      letter-spacing: 0.5px;
    }

    .badge-date-text {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 3px;
      font-style: italic;
    }

    /* DOCUMENT TITLE */
    .doc-main-title {
      text-align: center;
      margin: 10px 0 12px 0;
    }

    .doc-main-title h1 {
      font-size: 16pt;
      text-transform: uppercase;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 1px;
    }

    .doc-main-title .doc-subtitle {
      font-size: 10pt;
      font-style: italic;
      color: #475569;
      margin-top: 2px;
    }

    /* INFO GRID (CLIENT / PROJECT / SUPPLIER) */
    .meta-info-card {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 5px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 10pt;
    }

    .meta-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px 16px;
    }

    .meta-row {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .meta-label {
      font-weight: 700;
      color: #334155;
      min-width: 95px;
      flex-shrink: 0;
    }

    .meta-value {
      color: #0f172a;
      font-weight: 600;
      flex-grow: 1;
    }

    /* WARNING / NOTICE BANNER */
    .notice-bar {
      border-left: 4px solid #b91c1c;
      background: #fef2f2;
      padding: 6px 10px;
      font-size: 9.5pt;
      color: #991b1b;
      margin-bottom: 10px;
      line-height: 1.35;
    }

    .notice-bar strong {
      text-transform: uppercase;
    }

    /* MAIN DATA TABLE */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      margin-bottom: 10px;
    }

    table.data-table thead {
      display: table-header-group;
    }

    table.data-table th {
      background: #1e293b;
      color: #ffffff;
      font-weight: 700;
      padding: 6px 6px;
      border: 1px solid #0f172a;
      text-align: center;
      text-transform: uppercase;
      font-size: 8.5pt;
      letter-spacing: 0.3px;
    }

    table.data-table td {
      border: 1px solid #94a3b8;
      padding: 5px 6px;
      vertical-align: middle;
      color: #0f172a;
    }

    table.data-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    table.data-table tr {
      page-break-inside: avoid;
    }

    .cell-center { text-align: center; }
    .cell-right { text-align: right; }
    .cell-left { text-align: left; }
    .cell-bold { font-weight: 700; }
    .cell-spec { font-size: 8.5pt; color: #475569; }

    /* SUMMARY TOTALS BLOCK */
    .totals-summary-box {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #f8fafc;
      padding: 8px 12px;
      margin-bottom: 12px;
    }

    .totals-summary-grid {
      display: flex;
      justify-content: flex-end;
    }

    .totals-table {
      width: 340px;
      font-size: 10pt;
    }

    .totals-table td {
      padding: 3px 0;
    }

    .totals-table .total-label {
      text-align: right;
      padding-right: 12px;
      color: #475569;
    }

    .totals-table .total-val {
      text-align: right;
      font-weight: 700;
      color: #0f172a;
      font-size: 10.5pt;
    }

    .totals-table .grand-total .total-label {
      font-weight: 800;
      color: #0f172a;
      font-size: 11pt;
      text-transform: uppercase;
      border-top: 1.5px solid #0f172a;
      padding-top: 4px;
    }

    .totals-table .grand-total .total-val {
      font-size: 13pt;
      font-weight: 900;
      color: #b91c1c;
      border-top: 1.5px solid #0f172a;
      padding-top: 4px;
    }

    .amount-in-words {
      margin-top: 6px;
      font-size: 9.5pt;
      font-style: italic;
      color: #1e293b;
      border-top: 1px dashed #cbd5e1;
      padding-top: 5px;
    }

    .amount-in-words strong {
      font-style: normal;
      color: #0f172a;
    }

    /* TERMS & PAYMENT SECTION */
    .terms-box {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 9pt;
      margin-bottom: 12px;
      line-height: 1.4;
      background: #ffffff;
    }

    .terms-box h4 {
      font-size: 9.5pt;
      text-transform: uppercase;
      color: #0f172a;
      margin-bottom: 4px;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 2px;
    }

    .terms-box ol, .terms-box ul {
      padding-left: 18px;
    }

    .terms-box li {
      margin-bottom: 2px;
    }

    /* SIGNATURE BLOCK & RED STAMP */
    .signatures-block {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid #94a3b8;
      page-break-inside: avoid;
    }

    .sign-column {
      flex: 1;
      text-align: center;
      font-size: 10pt;
      position: relative;
    }

    .sign-column .sign-title {
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      font-size: 9.5pt;
    }

    .sign-column .sign-subtitle {
      font-size: 8.5pt;
      font-style: italic;
      color: #64748b;
      margin-top: 2px;
    }

    .sign-space-holder {
      height: 75px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sign-column .sign-name {
      font-weight: 800;
      font-size: 10.5pt;
      color: #0f172a;
    }

    /* CON DẤU ĐỎ ĐIỆN TỬ CSS OVERLAY */
    .red-stamp-wrapper {
      position: absolute;
      top: -15px;
      right: 15px;
      transform: rotate(-4deg);
      pointer-events: none;
      z-index: 10;
      filter: drop-shadow(0 2px 4px rgba(207, 19, 34, 0.2));
    }

    .unapproved-stamp-box {
      border: 2px dashed #94a3b8;
      background: #f8fafc;
      padding: 6px 12px;
      border-radius: 4px;
      display: inline-block;
    }

    .unapproved-title {
      color: #64748b;
      font-weight: 800;
      font-size: 9pt;
      text-transform: uppercase;
    }

    .unapproved-sub {
      color: #dc2626;
      font-size: 7.5pt;
      font-weight: 700;
    }

    /* FOOTER */
    .page-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #64748b;
      font-style: italic;
    }

    /* BẢN IN PRINT QUERY */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .a4-container {
        box-shadow: none !important;
        margin: 0 !important;
        width: 100% !important;
        min-height: auto !important;
        padding: 8mm 10mm !important;
      }
      .red-stamp-wrapper {
        filter: none !important;
      }
    }
  `;

  // 6. RENDER HTML CHO BÁO GIÁ DỰ TOÁN KHÁCH HÀNG (QUOTATION)
  function renderQuotationHTML(quotationData = {}, options = {}) {
    const data = Object.assign({
      code: 'BG-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000),
      date: new Date().toLocaleDateString('vi-VN'),
      customerName: 'Quý Khách Hàng',
      customerPhone: '',
      customerAddress: '',
      projectName: 'Công Trình Nội Thất Cao Cấp',
      designerName: 'Tống Trần Hiệp',
      consultantPhone: PHU_GIA_LEGAL.HOTLINE,
      status: 'APPROVED',
      isApproved: true,
      items: [],
      discountAmount: 0,
      vatPercent: 0,
      notes: ''
    }, quotationData);

    const isApproved = (data.status === 'APPROVED' || data.isApproved === true);

    // Tính toán số tiền
    let subTotal = 0;
    const renderedItems = (data.items || []).map((item, idx) => {
      const qty = Number(item.quantity || item.qty || 1);
      const unitPrice = Number(item.unitPrice || item.price || 0);
      const total = Number(item.total || (qty * unitPrice));
      subTotal += total;

      return `
        <tr>
          <td class="cell-center">${idx + 1}</td>
          <td class="cell-left">
            <div class="cell-bold">${escapeHTML(item.name || 'Hạng mục nội thất')}</div>
            ${item.spec ? `<div class="cell-spec">${escapeHTML(item.spec)}</div>` : ''}
          </td>
          <td class="cell-center cell-spec">${escapeHTML(item.dimensions || item.size || '-')}</td>
          <td class="cell-center">${escapeHTML(item.unit || 'Cái')}</td>
          <td class="cell-center cell-bold">${qty}</td>
          <td class="cell-right">${formatCurrency(unitPrice)}</td>
          <td class="cell-right cell-bold">${formatCurrency(total)}</td>
          <td class="cell-left cell-spec">${escapeHTML(item.note || '')}</td>
        </tr>
      `;
    }).join('');

    const discount = Number(data.discountAmount || 0);
    const afterDiscount = Math.max(0, subTotal - discount);
    const vatPercent = Number(data.vatPercent || 0);
    const vatAmount = (vatPercent > 0) ? (afterDiscount * vatPercent / 100) : 0;
    const grandTotal = afterDiscount + vatAmount;
    const grandTotalInWords = numberToWords(grandTotal);

    const redStamp = generateRedStampSVG({
      isApproved: isApproved,
      dateStr: data.date,
      title: 'ĐÃ PHÊ DUYỆT',
      approverName: PHU_GIA_LEGAL.DIRECTOR
    });

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BÁO GIÁ DỰ TOÁN - ${escapeHTML(data.code)} - ${escapeHTML(data.projectName)}</title>
  <style>${SHARED_PRINT_STYLES}</style>
</head>
<body>
  <div class="no-print-bar">
    <div class="title-group">
      <h3>🏛️ ${PHU_GIA_LEGAL.BRAND_NAME} — BẢN IN A4 BÁO GIÁ NỘI THẤT</h3>
      <p>Mã: ${escapeHTML(data.code)} | Trạng thái: ${isApproved ? '<span style="color:#4ade80;font-weight:bold;">ĐÃ DUYỆT ĐÓNG DẤU ĐỎ</span>' : '<span style="color:#f87171;">CHỜ GIÁM ĐỐC DUYỆT</span>'}</p>
    </div>
    <div class="btn-action-group">
      <button class="btn-print" onclick="window.print()">🖨️ IN A4 / XUẤT PDF</button>
      <button class="btn-close" onclick="window.close()">✕ ĐÓNG</button>
    </div>
  </div>

  <div class="a4-container">
    <div>
      <!-- HEADER DOANH NGHIỆP PHÚ GIA -->
      <div class="brand-header">
        <div class="brand-logo-area">
          <div class="brand-super-title">${PHU_GIA_LEGAL.COMPANY_FULL_NAME}</div>
          <div class="brand-sub-title">${PHU_GIA_LEGAL.BRAND_NAME} — KIẾN TRÚC &amp; NỘI THẤT CAO CẤP</div>
          <div class="legal-meta-list">
            <div><strong>Tổ hợp VP &amp; Nhà máy:</strong> ${PHU_GIA_LEGAL.FACTORY_OFFICE_ADDRESS}</div>
            <div><strong>Trụ sở ĐKKD:</strong> ${PHU_GIA_LEGAL.REGISTERED_ADDRESS}</div>
            <div><strong>Mã Số Thuế:</strong> ${PHU_GIA_LEGAL.TAX_CODE} &nbsp;|&nbsp; <strong>Hotline:</strong> ${PHU_GIA_LEGAL.HOTLINE}</div>
          </div>
        </div>
        <div class="brand-badge-area">
          <div class="badge-code-box">
            <div class="badge-code-label">MÃ BÁO GIÁ</div>
            <div class="badge-code-value">${escapeHTML(data.code)}</div>
          </div>
          <div class="badge-date-text">Ngày lập: ${escapeHTML(data.date)}</div>
        </div>
      </div>

      <!-- TIÊU ĐỀ BÁO GIÁ -->
      <div class="doc-main-title">
        <h1>BẢNG BÁO GIÁ DỰ TOÁN THI CÔNG NỘI THẤT</h1>
        <div class="doc-subtitle">Dự án: <strong>${escapeHTML(data.projectName)}</strong></div>
      </div>

      <!-- THÔNG TIN KHÁCH HÀNG & DỰ ÁN -->
      <div class="meta-info-card">
        <div class="meta-info-grid">
          <div class="meta-row">
            <span class="meta-label">Khách hàng:</span>
            <span class="meta-value">${escapeHTML(data.customerName)}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Điện thoại:</span>
            <span class="meta-value">${escapeHTML(data.customerPhone || 'Theo hợp đồng')}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Địa chỉ thi công:</span>
            <span class="meta-value">${escapeHTML(data.customerAddress || 'TP. Hà Tĩnh')}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Sale / Dự toán:</span>
            <span class="meta-value">${escapeHTML(data.designerName)} (${escapeHTML(data.consultantPhone)})</span>
          </div>
        </div>
      </div>

      <!-- BẢNG CHI TIẾT HẠNG MỤC -->
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 4%;">STT</th>
            <th style="width: 32%;">Hạng mục / Quy cách chi tiết</th>
            <th style="width: 14%;">Kích thước (DxRxC)</th>
            <th style="width: 7%;">ĐVT</th>
            <th style="width: 6%;">SL</th>
            <th style="width: 14%;">Đơn giá (VNĐ)</th>
            <th style="width: 15%;">Thành tiền (VNĐ)</th>
            <th style="width: 8%;">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${renderedItems || '<tr><td colspan="8" class="cell-center" style="padding:15px;color:#94a3b8;">Chưa có dữ liệu hạng mục</td></tr>'}
        </tbody>
      </table>

      <!-- TỔNG CỘNG TIỀN VÀ BẰNG CHỮ -->
      <div class="totals-summary-box">
        <div class="totals-summary-grid">
          <table class="totals-table">
            <tr>
              <td class="total-label">Tổng tiền hạng mục:</td>
              <td class="total-val">${formatCurrency(subTotal)}</td>
            </tr>
            ${discount > 0 ? `
            <tr>
              <td class="total-label">Chiết khấu / Ưu đãi:</td>
              <td class="total-val" style="color:#16a34a;">- ${formatCurrency(discount)}</td>
            </tr>` : ''}
            ${vatPercent > 0 ? `
            <tr>
              <td class="total-label">Thuế VAT (${vatPercent}%):</td>
              <td class="total-val">${formatCurrency(vatAmount)}</td>
            </tr>` : ''}
            <tr class="grand-total">
              <td class="total-label">TỔNG CỘNG THANH TOÁN:</td>
              <td class="total-val">${formatCurrency(grandTotal)}</td>
            </tr>
          </table>
        </div>
        <div class="amount-in-words">
          <strong>Số tiền bằng chữ:</strong> ${grandTotalInWords}
        </div>
      </div>

      <!-- ĐIỀU KHOẢN THANH TOÁN & QUY CHUẨN DÒNG TIỀN PG HOME -->
      <div class="terms-box">
        <h4>Điều Khoản Thanh Toán &amp; Cam Kết Chất Lượng Chuẩn PG Home:</h4>
        <ol>
          <li><strong>Tiến độ thanh toán 3 mốc:</strong> Đợt 1 tạm ứng <strong>40% - 50%</strong> ngay khi ký HĐ để phát lệnh sản xuất tại xưởng; Đợt 2 thanh toán <strong>30% - 40%</strong> khi hàng tập kết đến công trình; Đợt 3 quyết toán <strong>10% - 20% còn lại</strong> trong 03 - 05 ngày sau nghiệm thu bàn giao.</li>
          <li><strong>Vật liệu &amp; Bảo hành:</strong> 100% ván gỗ công nghiệp đúng mã niêm yết theo hợp đồng (An Cường / MDF Lõi Xanh Thái Lan tiêu chuẩn E1/CARB-P2). Bảo hành kỹ thuật kết cấu <strong>24 tháng</strong>, bảo trì trọn đời sản phẩm.</li>
          <li><strong>Tài khoản thanh toán chính thức:</strong> Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank) / Ngân hàng TMCP Công Thương Việt Nam (VietinBank) - Đại diện: <strong>Nguyễn Viết Nghĩa</strong>.</li>
        </ol>
      </div>
    </div>

    <!-- KHỐI CHỮ KÝ & CON DẤU ĐỎ ĐIỆN TỬ -->
    <div>
      <div class="signatures-block">
        <div class="sign-column">
          <div class="sign-title">ĐẠI DIỆN KHÁCH HÀNG</div>
          <div class="sign-subtitle">(Ký, ghi rõ họ tên)</div>
          <div class="sign-space-holder"></div>
          <div class="sign-name">${escapeHTML(data.customerName)}</div>
        </div>

        <div class="sign-column">
          <div class="sign-title">NGƯỜI LẬP BÁO GIÁ</div>
          <div class="sign-subtitle">(Ký, ghi rõ họ tên)</div>
          <div class="sign-space-holder"></div>
          <div class="sign-name">${escapeHTML(data.designerName)}</div>
        </div>

        <div class="sign-column" style="position: relative;">
          <div class="sign-title">GIÁM ĐỐC PHÊ DUYỆT</div>
          <div class="sign-subtitle">(Ký &amp; đóng dấu đỏ)</div>
          <div class="sign-space-holder">
            ${redStamp}
          </div>
          <div class="sign-name">${PHU_GIA_LEGAL.DIRECTOR}</div>
        </div>
      </div>

      <div class="page-footer">
        <div>Bản quyền © 2025-2026 ${PHU_GIA_LEGAL.COMPANY_FULL_NAME} - MST: ${PHU_GIA_LEGAL.TAX_CODE}</div>
        <div>Hotline: ${PHU_GIA_LEGAL.HOTLINE} - Địa chỉ: ${PHU_GIA_LEGAL.FACTORY_OFFICE_ADDRESS}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // 7. RENDER HTML CHO PHIẾU ĐỀ XUẤT ĐẶT HÀNG VẬT TƯ (MATERIAL PURCHASE ORDER)
  function renderMaterialOrderHTML(orderData = {}, options = {}) {
    const data = Object.assign({
      code: 'PO-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000),
      date: new Date().toLocaleDateString('vi-VN'),
      supplierName: 'Tổng Kho Ván Lam Giang',
      supplierPhone: '',
      supplierAddress: 'TP. Hà Tĩnh',
      projectName: 'Công Trình Anh Nam',
      projectCode: 'CT-2026-NAM',
      creatorName: 'Hoàng Công Vũ (Kỹ thuật CNC)',
      approverName: PHU_GIA_LEGAL.DIRECTOR,
      status: 'APPROVED',
      isApproved: true,
      items: [],
      notes: ''
    }, orderData);

    const isApproved = (data.status === 'APPROVED' || data.isApproved === true);

    let subTotal = 0;
    let totalSheets = 0;

    const renderedItems = (data.items || []).map((item, idx) => {
      const qty = Number(item.quantity || item.qty || 1);
      const unitPrice = Number(item.unitPrice || item.price || 0);
      const total = Number(item.total || (qty * unitPrice));
      subTotal += total;
      if (item.unit && (item.unit.toLowerCase().includes('tấm') || item.unit.toLowerCase().includes('tam'))) {
        totalSheets += qty;
      }

      return `
        <tr>
          <td class="cell-center">${idx + 1}</td>
          <td class="cell-left">
            <div class="cell-bold">${escapeHTML(item.name || 'Vật tư / Mã ván')}</div>
            ${item.spec ? `<div class="cell-spec">${escapeHTML(item.spec)}</div>` : ''}
          </td>
          <td class="cell-center cell-spec">${escapeHTML(item.dimensions || item.size || '1220 x 2440')}</td>
          <td class="cell-center">${escapeHTML(item.unit || 'Tấm')}</td>
          <td class="cell-center cell-bold" style="color:#b91c1c;">${qty}</td>
          <td class="cell-right">${formatCurrency(unitPrice)}</td>
          <td class="cell-right cell-bold">${formatCurrency(total)}</td>
          <td class="cell-left cell-spec">${escapeHTML(item.note || item.target || '')}</td>
        </tr>
      `;
    }).join('');

    const grandTotalInWords = numberToWords(subTotal);

    const redStamp = generateRedStampSVG({
      isApproved: isApproved,
      dateStr: data.date,
      title: 'ĐÃ DUYỆT ĐẶT HÀNG',
      approverName: PHU_GIA_LEGAL.DIRECTOR
    });

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PHIẾU ĐẶT HÀNG VẬT TƯ - ${escapeHTML(data.code)} - ${escapeHTML(data.supplierName)}</title>
  <style>${SHARED_PRINT_STYLES}</style>
</head>
<body>
  <div class="no-print-bar">
    <div class="title-group">
      <h3>📋 ${PHU_GIA_LEGAL.BRAND_NAME} — PHIẾU ĐẶT HÀNG VẬT TƯ SẢN XUẤT</h3>
      <p>Mã PO: ${escapeHTML(data.code)} | Trạng thái: ${isApproved ? '<span style="color:#4ade80;font-weight:bold;">ĐÃ DUYỆT ĐÓNG DẤU ĐỎ (ĐỦ ĐIỀU KIỆN GỬI NCC)</span>' : '<span style="color:#f87171;font-weight:bold;">CHƯA DUYỆT - CẤM GỬI NHÀ CUNG CẤP</span>'}</p>
    </div>
    <div class="btn-action-group">
      <button class="btn-print" onclick="window.print()">🖨️ IN A4 / XUẤT PDF</button>
      <button class="btn-close" onclick="window.close()">✕ ĐÓNG</button>
    </div>
  </div>

  <div class="a4-container">
    <div>
      <!-- HEADER DOANH NGHIỆP PHÚ GIA -->
      <div class="brand-header">
        <div class="brand-logo-area">
          <div class="brand-super-title">${PHU_GIA_LEGAL.COMPANY_FULL_NAME}</div>
          <div class="brand-sub-title">TỔ HỢP VĂN PHÒNG &amp; NHÀ MÁY SẢN XUẤT NỘI THẤT PHÚ GIA</div>
          <div class="legal-meta-list">
            <div><strong>Nhà máy &amp; Giao nhận:</strong> ${PHU_GIA_LEGAL.FACTORY_OFFICE_ADDRESS}</div>
            <div><strong>Trụ sở ĐKKD:</strong> ${PHU_GIA_LEGAL.REGISTERED_ADDRESS}</div>
            <div><strong>Mã Số Thuế:</strong> ${PHU_GIA_LEGAL.TAX_CODE} &nbsp;|&nbsp; <strong>Hotline:</strong> ${PHU_GIA_LEGAL.HOTLINE}</div>
          </div>
        </div>
        <div class="brand-badge-area">
          <div class="badge-code-box">
            <div class="badge-code-label">MÃ PHIẾU PO</div>
            <div class="badge-code-value">${escapeHTML(data.code)}</div>
          </div>
          <div class="badge-date-text">Ngày đề xuất: ${escapeHTML(data.date)}</div>
        </div>
      </div>

      <!-- TIÊU ĐỀ PHIẾU -->
      <div class="doc-main-title">
        <h1>PHIẾU ĐỀ XUẤT ĐẶT HÀNG VẬT TƯ SẢN XUẤT</h1>
        <div class="doc-subtitle">Áp dụng cho bóc tách CNC &amp; Vật tư thi công nội thất xưởng PG Home</div>
      </div>

      <!-- NGUYÊN TẮC THÉP VẬN HÀNH XƯỞNG -->
      <div class="notice-bar">
        <strong>LỆNH CƯỠNG CHẾ CỦA BAN GIÁM ĐỐC:</strong> Vũ và Thái chỉ được phép phát lệnh gửi đơn này cho Nhà cung cấp (${escapeHTML(data.supplierName)}) khi phiếu đã có <strong>CON DẤU ĐỎ ĐIỆN TỬ CỦA GIÁM ĐỐC</strong>. Kế toán chỉ thanh toán khi khớp đủ bộ 3 chứng từ: Phiếu đặt hàng đã duyệt + Hóa đơn/Sổ nợ NCC + Xác nhận nhập kho xưởng.
      </div>

      <!-- THÔNG TIN ĐƠN HÀNG & NHÀ CUNG CẤP -->
      <div class="meta-info-card">
        <div class="meta-info-grid">
          <div class="meta-row">
            <span class="meta-label">Nhà cung cấp:</span>
            <span class="meta-value">${escapeHTML(data.supplierName)}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Công trình phục vụ:</span>
            <span class="meta-value">${escapeHTML(data.projectName)} (${escapeHTML(data.projectCode || 'CT-NOIBO')})</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Địa điểm giao hàng:</span>
            <span class="meta-value">${PHU_GIA_LEGAL.FACTORY_OFFICE_ADDRESS}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Người đề xuất:</span>
            <span class="meta-value">${escapeHTML(data.creatorName)}</span>
          </div>
        </div>
      </div>

      <!-- BẢNG VẬT TƯ CẦN ĐẶT -->
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 5%;">STT</th>
            <th style="width: 32%;">Tên vật tư / Mã cốt &amp; Mã màu ván</th>
            <th style="width: 14%;">Quy cách khổ</th>
            <th style="width: 8%;">ĐVT</th>
            <th style="width: 8%;">Số lượng</th>
            <th style="width: 14%;">Đơn giá dự kiến</th>
            <th style="width: 15%;">Thành tiền (VNĐ)</th>
            <th style="width: 14%;">Mục đích cắt / Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          ${renderedItems || '<tr><td colspan="8" class="cell-center" style="padding:15px;color:#94a3b8;">Chưa có danh mục vật tư</td></tr>'}
        </tbody>
      </table>

      <!-- TỔNG KẾT VÀ BẰNG CHỮ -->
      <div class="totals-summary-box">
        <div class="totals-summary-grid">
          <table class="totals-table">
            ${totalSheets > 0 ? `
            <tr>
              <td class="total-label">Tổng số lượng ván tấm:</td>
              <td class="total-val" style="color:#b91c1c;">${totalSheets} tấm</td>
            </tr>` : ''}
            <tr class="grand-total">
              <td class="total-label">TỔNG GIÁ TRỊ ĐƠN HÀNG:</td>
              <td class="total-val">${formatCurrency(subTotal)}</td>
            </tr>
          </table>
        </div>
        <div class="amount-in-words">
          <strong>Tổng tiền dự kiến bằng chữ:</strong> ${grandTotalInWords}
        </div>
      </div>

      <!-- QUY TRÌNH KIỂM SOÁT NHẬP HÀNG TẠI CỬA XƯỞNG -->
      <div class="terms-box">
        <h4>Checklist Bắt Buộc Khi Xe NCC Giao Hàng Đến Cửa Xưởng:</h4>
        <ol>
          <li><strong>Kiểm đếm số lượng:</strong> Thái (Quản lý xưởng) hoặc Vũ (Kỹ thuật) trực tiếp đếm đủ số tấm, kiểm tra mã màu ván Melamine/Acrylic và ký xác nhận phiếu giao hàng.</li>
          <li><strong>Xử lý hàng dư/trả:</strong> Tấm ván nguyên hoặc phụ kiện dư phải đóng gói trả lại NCC để lấy phiếu trừ nợ đối soát công nợ ngay trong vòng 24 giờ.</li>
          <li><strong>Lưu trữ chứng từ:</strong> Chụp ảnh rõ nét phiếu giao hàng gửi ngay lên nhóm Zalo "Vật Tư &amp; Kế Toán" để kế toán ghi sổ công nợ theo thời gian thực (&le; 60 phút).</li>
        </ol>
      </div>
    </div>

    <!-- KHỐI CHỮ KÝ 3 BÊN & CON DẤU ĐỎ ĐIỆN TỬ -->
    <div>
      <div class="signatures-block">
        <div class="sign-column">
          <div class="sign-title">KỸ THUẬT BÓC TÁCH CNC</div>
          <div class="sign-subtitle">(Bóc tách &amp; Lập phiếu)</div>
          <div class="sign-space-holder"></div>
          <div class="sign-name">Hoàng Công Vũ</div>
        </div>

        <div class="sign-column">
          <div class="sign-title">QUẢN LÝ XƯỞNG SẢN XUẤT</div>
          <div class="sign-subtitle">(Kiểm tra định mức &amp; Kho)</div>
          <div class="sign-space-holder"></div>
          <div class="sign-name">Nguyễn Văn Thái</div>
        </div>

        <div class="sign-column" style="position: relative;">
          <div class="sign-title">GIÁM ĐỐC PHÊ DUYỆT</div>
          <div class="sign-subtitle">(Đóng dấu đỏ lệnh nhập hàng)</div>
          <div class="sign-space-holder">
            ${redStamp}
          </div>
          <div class="sign-name">${PHU_GIA_LEGAL.DIRECTOR}</div>
        </div>
      </div>

      <div class="page-footer">
        <div>Bản quyền © 2025-2026 ${PHU_GIA_LEGAL.COMPANY_FULL_NAME} - MST: ${PHU_GIA_LEGAL.TAX_CODE}</div>
        <div>Xưởng sản xuất: ${PHU_GIA_LEGAL.FACTORY_OFFICE_ADDRESS} - Hotline: ${PHU_GIA_LEGAL.HOTLINE}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // 8. HÀM MỞ CỬA SỔ IN HOẶC IN NGẦM KHÔNG CƯỚP TIÊU ĐIỂM
  function openPrintPreview(htmlContent, title = 'PG Home Luxury Print') {
    if (typeof window === 'undefined') return;

    // Tạo cửa sổ popup in ấn
    const printWindow = window.open('', '_blank', 'width=1000,height=850,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      // Không ép focus mạnh để tuân thủ Stealth Protocol
      return printWindow;
    } else {
      // Fallback: In qua hidden iframe an toàn 100%
      let iframe = document.getElementById('pg_print_hidden_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'pg_print_hidden_iframe';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
      }
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow.print();
        } catch (e) {
          console.error('[PG_Modules_W26] Print iframe error:', e);
        }
      }, 500);
      return iframe;
    }
  }

  // 9. CÁC HÀM TIỆN ÍCH
  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 10. PUBLIC EXPORT API
  const PG_Modules_W26 = {
    INFO: PHU_GIA_LEGAL,
    formatCurrency: formatCurrency,
    numberToWords: numberToWords,
    generateRedStampSVG: generateRedStampSVG,
    renderQuotationHTML: renderQuotationHTML,
    renderMaterialOrderHTML: renderMaterialOrderHTML,
    printQuotation: function (data, options) {
      const html = renderQuotationHTML(data, options);
      return openPrintPreview(html, 'Báo Giá - ' + (data && data.code ? data.code : ''));
    },
    printMaterialOrder: function (data, options) {
      const html = renderMaterialOrderHTML(data, options);
      return openPrintPreview(html, 'Phiếu Đặt Hàng - ' + (data && data.code ? data.code : ''));
    },
    openPrintPreview: openPrintPreview
  };

  return PG_Modules_W26;
});
